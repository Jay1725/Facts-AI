import { createClient, type SupportedStorage } from '@supabase/supabase-js';

const REMEMBER_SESSION_KEY = 'facts.rememberSession';

export function setRememberSession(remember: boolean) {
  window.localStorage.setItem(REMEMBER_SESSION_KEY, remember ? 'true' : 'false');
}

function shouldRemember() {
  return window.localStorage.getItem(REMEMBER_SESSION_KEY) !== 'false';
}

const sessionStorageAdapter: SupportedStorage = {
  getItem: (key) => (shouldRemember() ? window.localStorage : window.sessionStorage).getItem(key),
  setItem: (key, value) => (shouldRemember() ? window.localStorage : window.sessionStorage).setItem(key, value),
  removeItem: (key) => {
    window.localStorage.removeItem(key);
    window.sessionStorage.removeItem(key);
  },
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase is not configured for this project.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: sessionStorageAdapter,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
