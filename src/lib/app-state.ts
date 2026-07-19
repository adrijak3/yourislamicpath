import { useCallback, useEffect, useMemo, useState } from "react";

const EVENT = "guided-path:state";
const key = (name: string) => `guidedpath.${name}`;

function read<T>(name: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const raw = localStorage.getItem(key(name)); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
}
function write<T>(name: string, value: T) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key(name), JSON.stringify(value));
  window.dispatchEvent(new CustomEvent(EVENT, { detail: name }));
}
export function useStoredState<T>(name: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  useEffect(() => {
    setValue(read(name, fallback));
    const sync = (event: Event) => {
      const detail = event instanceof CustomEvent ? event.detail : undefined;
      if (!detail || detail === name) setValue(read(name, fallback));
    };
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => { window.removeEventListener(EVENT, sync); window.removeEventListener("storage", sync); };
  }, [name]);
  const update = useCallback((next: T | ((current: T) => T)) => {
    setValue(current => { const result = typeof next === "function" ? (next as (v:T)=>T)(current) : next; write(name, result); return result; });
  }, [name]);
  return [value, update] as const;
}

export type LocalUser = { id: string; name: string; email: string; joinedAt: string };
type StoredAccount = LocalUser & { password: string };
export function useLocalAuth() {
  const [accounts, setAccounts] = useStoredState<StoredAccount[]>("accounts", []);
  const [userId, setUserId] = useStoredState<string | null>("session", null);
  const user = useMemo(() => accounts.find(a => a.id === userId) ?? null, [accounts, userId]);
  return {
    user,
    signUp(name: string, email: string, password: string) {
      if (accounts.some(a => a.email.toLowerCase() === email.toLowerCase())) throw new Error("An account with this email already exists.");
      const account: StoredAccount = { id: crypto.randomUUID(), name, email, password, joinedAt: new Date().toISOString() };
      setAccounts(prev => [...prev, account]); setUserId(account.id); return account;
    },
    login(email: string, password: string) {
      const account = accounts.find(a => a.email.toLowerCase() === email.toLowerCase() && a.password === password);
      if (!account) throw new Error("Incorrect email or password.");
      setUserId(account.id); return account;
    },
    logout() { setUserId(null); },
    resetPassword(email: string, password: string) {
      if (!accounts.some(a => a.email.toLowerCase() === email.toLowerCase())) throw new Error("No account was found with this email.");
      setAccounts(prev => prev.map(a => a.email.toLowerCase() === email.toLowerCase() ? { ...a, password } : a));
    },
  };
}

export function useBookmarks() {
  const [items, setItems] = useStoredState<string[]>("bookmarks", []);
  return { items, has: (id:string)=>items.includes(id), toggle:(id:string)=>setItems(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]) };
}

export function useStreak() {
  const [days, setDays] = useStoredState<string[]>("activityDays", []);
  useEffect(() => {
    const today = new Date().toISOString().slice(0,10);
    setDays(prev => prev.includes(today) ? prev : [...prev, today].slice(-365));
  }, []);
  const streak = useMemo(() => {
    const set = new Set(days); let count = 0; const d = new Date();
    while (set.has(d.toISOString().slice(0,10))) { count++; d.setDate(d.getDate()-1); }
    return count;
  }, [days]);
  return streak;
}
