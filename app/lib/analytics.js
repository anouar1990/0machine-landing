import { supabase } from './supabase';

const IS_BROWSER = typeof window !== 'undefined';

// Get or create anonymous session ID
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
 * @param {string} pagePath - Optional path of the page visited.
 * @param {string} referrerOverride - Optional override for the referrer.
 */
export async function trackPageView(pagePath, referrerOverride = null) {
  if (!IS_BROWSER) return;

  try {
    const referrer = referrerOverride !== null ? referrerOverride : document.referrer || 'direct';
    const userAgent = navigator.userAgent;
    const sessionId = getSessionId();

    const { error } = await supabase.from('analytics_events').insert({
      event_name: 'pageview',
      page_path: pagePath || window.location.pathname,
      referrer: referrer,
      session_id: sessionId,
      user_agent: userAgent,
      metadata: {}
    });

    if (error) {
      console.warn('Error tracking pageview:', error.message);
    }
  } catch (err) {
    console.error('Failed to track pageview:', err);
  }
}

/**
 * Tracks a custom event (e.g. button click, checkout start).
 * @param {string} eventName - Name of the event.
 * @param {object} metadata - Custom metadata properties.
 */
export async function trackEvent(eventName, metadata = {}) {
  if (!IS_BROWSER) return;

  try {
    const pagePath = window.location.pathname;
    const referrer = document.referrer || 'direct';
    const userAgent = navigator.userAgent;
    const sessionId = getSessionId();

    const { error } = await supabase.from('analytics_events').insert({
      event_name: eventName,
      page_path: pagePath,
      referrer: referrer,
      session_id: sessionId,
      user_agent: userAgent,
      metadata: metadata
    });

    if (error) {
      console.warn(`Error tracking event ${eventName}:`, error.message);
    }
  } catch (err) {
    console.error(`Failed to track event ${eventName}:`, err);
  }
}
