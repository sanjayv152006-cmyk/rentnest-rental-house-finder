import { Heart, Home as HomeIcon, ArrowRight } from 'lucide-react';
import { useRouter } from '@/context/RouterContext';
import { useApp } from '@/context/AppContext';
import { properties } from '@/data/properties';
import PropertyCard from '@/components/PropertyCard';

export default function FavoritesPage() {
  const { navigate } = useRouter();
  const { favorites } = useApp();
  const saved = properties.filter((p) => favorites.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
        <HomeIcon className="h-3.5 w-3.5" /> / <span className="text-slate-900 dark:text-white">Favorites</span>
      </nav>
      <div className="mt-4 flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
          <Heart className="h-6 w-6 fill-current" />
        </span>
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">Your Favorites</h1>
          <p className="text-slate-500 dark:text-slate-400">{saved.length} {saved.length === 1 ? 'home' : 'homes'} saved</p>
        </div>
      </div>

      {saved.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {saved.map((p) => <PropertyCard key={p.id} property={p} />)}
        </div>
      ) : (
        <div className="card mt-8 flex flex-col items-center gap-3 py-20 text-center">
          <Heart className="h-12 w-12 text-slate-300 dark:text-slate-700" />
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">No favorites yet</h3>
          <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">Tap the heart icon on any property to save it here and compare later.</p>
          <button onClick={() => navigate({ name: 'browse' })} className="btn-primary mt-2">
            Browse Homes <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
