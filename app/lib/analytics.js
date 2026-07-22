import { supabase } from './supabase';

const IS_BROWSER = typeof window !== 'undefined';
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || 'G-8V921YKC8S';

const firedEventsCache = new Set();

/**
 * Capture and store UTM parameters from URL query params.
 */
export function captureUTMs() {
  if (!IS_BROWSER) return;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utms = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((key) => {
      const val = urlParams.get(key);
      if (val) utms[key] = val;
    });

    if (Object.keys(utms).length > 0) {
      localStorage.setItem('0machine_utm', JSON.stringify(utms));
    }
  } catch (e) {
    // Ignore storage errors
  }
}

/**
 * Retrieve saved UTM parameters.
 */
export function getSavedUTMs() {
  if (!IS_BROWSER) return {};
  try {
    const raw = localStorage.getItem('0machine_utm');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function getSessionId() {
  if (!IS_BROWSER) return null;
  let sessionId = localStorage.getItem('0machine_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('0machine_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Tracks a page view event.
 */
export async function trackPageView(pagePath, referrerOverride = null) {
  if (!IS_BROWSER) return;
  captureUTMs();

  const path = pagePath || window.location.pathname;

  // Web Marketing Pixels
  if (window.gtag) {
    window.gtag('event', 'page_view', { page_title: document.title, page_path: path });
  }
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }
  if (window.pintrk) {
    window.pintrk('track', 'PageVisit');
  }
  if (window.ttq && typeof window.ttq.page === 'function') {
    window.ttq.page();
  }
  if (window.snaptr) {
    window.snaptr('track', 'PAGE_VIEW');
  }

  try {
    const referrer = referrerOverride !== null ? referrerOverride : document.referrer || 'direct';
    const userAgent = navigator.userAgent;
    const sessionId = getSessionId();
    const utms = getSavedUTMs();

    await supabase.from('analytics_events').insert({
      event_name: 'pageview',
      page_path: path,
      referrer: referrer,
      session_id: sessionId,
      user_agent: userAgent,
      metadata: { ...utms }
    });
  } catch (err) {
    console.warn('Error tracking pageview:', err.message);
  }
}

/**
 * Tracks a custom event (e.g. signup_completed, activated, pro_feature_viewed, checkout_started, subscription_paid).
 */
export async function trackEvent(eventName, metadata = {}, dedupeKey = null) {
  if (!IS_BROWSER) return;

  if (dedupeKey) {
    if (firedEventsCache.has(dedupeKey)) return;
    firedEventsCache.add(dedupeKey);
  }

  const utms = getSavedUTMs();
  const payload = { ...utms, ...metadata };

  // 1. GA4
  if (window.gtag) {
    let gaEventName = eventName;
    if (eventName === 'subscription_paid') gaEventName = 'purchase';
    window.gtag('event', gaEventName, { ...payload, send_to: GA_TRACKING_ID });
  }

  // 2. Meta Pixel
  if (window.fbq) {
    if (eventName === 'signup_completed') {
      window.fbq('track', 'CompleteRegistration', payload);
    } else if (eventName === 'pro_feature_viewed') {
      window.fbq('track', 'ViewContent', { content_name: metadata.feature || 'pro_feature' });
    } else if (eventName === 'checkout_started') {
      window.fbq('track', 'InitiateCheckout', payload);
    } else if (eventName === 'subscription_paid') {
      window.fbq('track', 'Purchase', { value: metadata.amount || 19, currency: metadata.currency || 'USD' });
    } else {
      window.fbq('trackCustom', eventName, payload);
    }
  }

  // 3. Pinterest Tag
  if (window.pintrk) {
    if (eventName === 'signup_completed') {
      window.pintrk('track', 'Signup', payload);
    } else if (eventName === 'checkout_started') {
      window.pintrk('track', 'Checkout', payload);
    } else if (eventName === 'subscription_paid') {
      window.pintrk('track', 'Purchase', { value: metadata.amount || 19, currency: metadata.currency || 'USD' });
    } else {
      window.pintrk('track', 'PageVisit', payload);
    }
  }

  // 4. TikTok Pixel
  if (window.ttq && typeof window.ttq.track === 'function') {
    if (eventName === 'signup_completed') {
      window.ttq.track('CompleteRegistration', payload);
    } else if (eventName === 'pro_feature_viewed') {
      window.ttq.track('ViewContent', { content_name: metadata.feature || 'pro_feature' });
    } else if (eventName === 'checkout_started') {
      window.ttq.track('InitiateCheckout', payload);
    } else if (eventName === 'subscription_paid') {
      window.ttq.track('CompletePayment', { value: metadata.amount || 19, currency: metadata.currency || 'USD' });
    }
  }

  // 5. Snapchat Pixel
  if (window.snaptr) {
    if (eventName === 'signup_completed') {
      window.snaptr('track', 'SIGN_UP', payload);
    } else if (eventName === 'pro_feature_viewed') {
      window.snaptr('track', 'VIEW_CONTENT', payload);
    } else if (eventName === 'checkout_started') {
      window.snaptr('track', 'START_CHECKOUT', payload);
    } else if (eventName === 'subscription_paid') {
      window.snaptr('track', 'PURCHASE', { price: metadata.amount || 19, currency: metadata.currency || 'USD' });
    }
  }

  // 6. Supabase DB Logging
  try {
    const pagePath = window.location.pathname;
    const referrer = document.referrer || 'direct';
    const userAgent = navigator.userAgent;
    const sessionId = getSessionId();

    await supabase.from('analytics_events').insert({
      event_name: eventName,
      page_path: pagePath,
      referrer: referrer,
      session_id: sessionId,
      user_agent: userAgent,
      metadata: payload
    });
  } catch (err) {
    console.warn(`Failed to track event ${eventName}:`, err.message);
  }
}
