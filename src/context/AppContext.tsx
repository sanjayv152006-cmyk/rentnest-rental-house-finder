import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Property } from '@/types';

export interface User {
  name: string;
  email: string;
}

export interface ContactRequest {
  id: string;
  propertyId: string;
  propertyTitle: string;
  ownerName: string;
  message: string;
  sentAt: string;
}

interface AppState {
  user: User | null;
  login: (email: string, name?: string) => void;
  signup: (name: string, email: string) => void;
  logout: () => void;

  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  postedProperties: Property[];
  addPostedProperty: (p: Property) => void;
  deletePostedProperty: (id: string) => void;

  contactRequests: ContactRequest[];
  addContactRequest: (r: Omit<ContactRequest, 'id' | 'sentAt'>) => void;
}

const AppContext = createContext<AppState | undefined>(undefined);

function useStored<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  const update = (v: T) => {
    setValue(v);
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      /* ignore */
    }
  };
  return [value, update];
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useStored<User | null>('rentnest-user', null);
  const [favorites, setFavorites] = useStored<string[]>('rentnest-favorites', []);
  const [posted, setPosted] = useStored<Property[]>('rentnest-posted', []);
  const [requests, setRequests] = useStored<ContactRequest[]>('rentnest-requests', []);

  const login = (email: string, name?: string) => {
    setUser({ email, name: name || email.split('@')[0] });
  };
  const signup = (name: string, email: string) => setUser({ name, email });
  const logout = () => setUser(null);

  const toggleFavorite = (id: string) =>
    setFavorites(favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id]);
  const isFavorite = (id: string) => favorites.includes(id);

  const addPostedProperty = (p: Property) => setPosted([p, ...posted]);
  const deletePostedProperty = (id: string) => setPosted(posted.filter((p) => p.id !== id));
  const addContactRequest = (r: Omit<ContactRequest, 'id' | 'sentAt'>) =>
    setRequests([
      { ...r, id: `cr-${Date.now()}`, sentAt: new Date().toISOString() },
      ...requests,
    ]);

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        favorites,
        toggleFavorite,
        isFavorite,
        postedProperties: posted,
        addPostedProperty,
        deletePostedProperty,
        contactRequests: requests,
        addContactRequest,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
