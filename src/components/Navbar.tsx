import { Home as HomeIcon, Search, LayoutDashboard, Heart, PlusCircle, LogIn, LogOut, Menu, X, House, Settings as SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from '@/context/RouterContext';
import { useApp } from '@/context/AppContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { route, navigate } = useRouter();
  const { user, logout } = useApp();
  const [open, setOpen] = useState(false);

  const links = [
    { label: 'Home', icon: HomeIcon, route: { name: 'home' as const } },
    { label: 'Browse', icon: Search, route: { name: 'browse' as const } },
    { label: 'Post a Rental', icon: PlusCircle, route: { name: 'post' as const } },
    { label: 'Favorites', icon: Heart, route: { name: 'favorites' as const } },
  ];

  const isActive = (name: string) => route.name === name;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate({ name: 'home' })} className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-lg shadow-brand-600/30">
            <House className="h-5 w-5" />
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Rent<span className="text-brand-600">Nest</span>
          </span>
        </button>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <button
              key={l.label}
              onClick={() => navigate(l.route)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                isActive(l.route.name)
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <button
                onClick={() => navigate({ name: 'dashboard' })}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                  isActive('dashboard')
                    ? 'border-brand-400 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-950/60 dark:text-brand-300'
                    : 'border-slate-300 bg-white text-slate-800 hover:border-brand-400 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-brand-500 dark:hover:text-brand-300'
                }`}
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="max-w-[8rem] truncate">{user.name}</span>
              </button>
              <button onClick={() => navigate({ name: 'settings' })} className={`btn-ghost !py-2 !px-3 ${isActive('settings') ? 'text-brand-600' : ''}`} aria-label="Settings">
                <SettingsIcon className="h-4 w-4" />
              </button>
              <button onClick={logout} className="btn-ghost !py-2 !px-3" aria-label="Log out">
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button onClick={() => navigate({ name: 'auth' })} className="hidden btn-primary !py-2 md:inline-flex">
              <LogIn className="h-4 w-4" />
              Sign In
            </button>
          )}
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-xl text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <button
                key={l.label}
                onClick={() => {
                  navigate(l.route);
                  setOpen(false);
                }}
                className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium ${
                  isActive(l.route.name)
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300'
                    : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
              </button>
            ))}
            {user ? (
              <>
                <button
                  onClick={() => {
                    navigate({ name: 'dashboard' });
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </button>
                <button
                  onClick={() => {
                    navigate({ name: 'settings' });
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <SettingsIcon className="h-4 w-4" /> Settings
                </button>
                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  <LogOut className="h-4 w-4" /> Log out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  navigate({ name: 'auth' });
                  setOpen(false);
                }}
                className="btn-primary mt-1"
              >
                <LogIn className="h-4 w-4" /> Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
