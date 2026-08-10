import { createContext, useContext, useState, type ReactNode } from 'react';

type Route =
  | { name: 'home' }
  | { name: 'browse'; query?: Record<string, string> }
  | { name: 'details'; id: string }
  | { name: 'post' }
  | { name: 'auth' }
  | { name: 'dashboard' }
  | { name: 'favorites' }
  | { name: 'settings' };

interface RouterValue {
  route: Route;
  navigate: (r: Route) => void;
}

const RouterContext = createContext<RouterValue | undefined>(undefined);

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>({ name: 'home' });

  const navigate = (r: Route) => {
    setRoute(r);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return <RouterContext.Provider value={{ route, navigate }}>{children}</RouterContext.Provider>;
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}

export type { Route };
