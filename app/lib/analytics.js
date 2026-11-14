// Lazy-load Supabase client so the 232KB SDK is not in the critical initial page bundle
let _supabasePromise = null;
async function getSupabase() {
  if (!_supabasePromise) {
    _supabasePromise = import('./supabase').then(mod => mod.supabase);
  }
  return _supabasePromise;
}

const IS_BROWSER = typeof window !== 'undefined';
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || 'G-8V921YKC8S';

const firedEventsCache = new Set();

/**
 * Capture and store UTM parameters and experiment variant from URL query params.
 */
export function captureUTMs() {
  if (!IS_BROWSER) return;
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const utms = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'variant'].forEach((key) => {
      const val = urlParams.get(key);
      if (val) utms[key] = val;
    });

    const v = urlParams.get('variant')?.toUpperCase();
    if (v && ['A', 'B', 'C', 'D', 'E'].includes(v)) {
      utms.variant = v;
      localStorage.setItem('0machine_variant', v);
      document.cookie = `0machine_variant=${v}; path=/; max-age=31536000; SameSite=Lax`;
    }

    if (Object.keys(utms).length > 0) {
      const existing = getSavedUTMs();
      localStorage.setItem('0machine_utm', JSON.stringify({ ...existing, ...utms }));
    }
  } catch (e) {
    // Ignore storage errors
  }
}

/**
 * Retrieve the active experiment variant.
 */
export function getSavedVariant() {
  if (!IS_BROWSER) return 'A';
  try {
    // 1. URL search param
    const urlParams = new URLSearchParams(window.location.search);
    const vParam = urlParams.get('variant')?.toUpperCase();
    if (['A', 'B', 'C', 'D', 'E'].includes(vParam)) return vParam;

    // 2. Cookie
    const match = document.cookie.match(/(?:^|;\s*)0machine_variant=([A-Ea-e])/);
    if (match && match[1]) return match[1].toUpperCase();

    // 3. localStorage
    const stored = localStorage.getItem('0machine_variant')?.toUpperCase();
    if (['A', 'B', 'C', 'D', 'E'].includes(stored)) return stored;
  } catch (e) {}
  return 'A';
}

/**
 * Retrieve saved UTM parameters.
 */
export function getSavedUTMs() {
  if (!IS_BROWSER) return {};
  try {
    const raw = localStorage.getItem('0machine_utm');
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed.variant) {
      parsed.variant = getSavedVariant();
    }
    return parsed;
  } catch (e) {
    return { variant: getSavedVariant() };
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

  const sendToSupabase = async () => {
    try {
      const referrer = referrerOverride !== null ? referrerOverride : document.referrer || 'direct';
      const userAgent = navigator.userAgent;
      const sessionId = getSessionId();
      const utms = getSavedUTMs();
      const supabase = await getSupabase();

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
  };

  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(sendToSupabase, { timeout: 2500 });
  } else {
    setTimeout(sendToSupabase, 1000);
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
  const logToDb = async () => {
    try {
      const pagePath = window.location.pathname;
      const referrer = document.referrer || 'direct';
      const userAgent = navigator.userAgent;
      const sessionId = getSessionId();
      const supabase = await getSupabase();

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
  };

  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(logToDb, { timeout: 2500 });
  } else {
    setTimeout(logToDb, 1000);
  }
}
