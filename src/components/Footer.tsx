import { House, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useRouter } from '@/context/RouterContext';
import { CITIES, CONTACT } from '@/types';

export default function Footer() {
  const { navigate } = useRouter();

  return (
    <footer className="mt-20 border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
                <House className="h-5 w-5" />
              </span>
              <span className="font-display text-xl font-extrabold text-slate-900 dark:text-white">
                Rent<span className="text-brand-600">Nest</span>
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Find comfortable and affordable rental homes across Tamil Nadu. Search by location, budget, and amenities — verified listings in 20+ cities.
            </p>
            <div className="mt-5 flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:text-slate-400 dark:hover:text-brand-400"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wide text-slate-900 dark:text-white">Explore</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                { label: 'Browse Houses', route: { name: 'browse' as const } },
                { label: 'Post a Rental', route: { name: 'post' as const } },
                { label: 'Favorites', route: { name: 'favorites' as const } },
                { label: 'My Dashboard', route: { name: 'dashboard' as const } },
              ].map((l) => (
                <li key={l.label}>
                  <button
                    onClick={() => navigate(l.route)}
                    className="text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wide text-slate-900 dark:text-white">Popular Tamil Nadu Locations</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {CITIES.slice(0, 6).map((c) => (
                <li key={c}>
                  <button
                    onClick={() => navigate({ name: 'browse', query: { city: c } })}
                    className="flex items-center gap-1.5 text-slate-500 transition hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400"
                  >
                    <MapPin className="h-3.5 w-3.5" /> {c}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wide text-slate-900 dark:text-white">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 transition hover:text-brand-600 dark:hover:text-brand-400">
                  <Mail className="h-4 w-4 text-brand-600" /> {CONTACT.email}
                </a>
              </li>
              <li>
                <a href={`tel:${CONTACT.phone}`} className="flex items-center gap-2 transition hover:text-brand-600 dark:hover:text-brand-400">
                  <Phone className="h-4 w-4 text-brand-600" /> +91 {CONTACT.phone}
                </a>
              </li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-600" /> {CONTACT.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400 sm:flex-row">
          <p>© {new Date().getFullYear()} RentNest — Tamil Nadu Rental House Finder. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-brand-600 dark:hover:text-brand-400">Privacy</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-brand-600 dark:hover:text-brand-400">Terms</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-brand-600 dark:hover:text-brand-400">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
