import { useMemo, useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, Home as HomeIcon, Frown, LocateFixed, MapPin } from 'lucide-react';
import PropertyCard from '@/components/PropertyCard';
import FilterPanel from '@/components/FilterPanel';
import ListingsMap from '@/components/ListingsMap';
import { properties } from '@/data/properties';
import { useRouter } from '@/context/RouterContext';
import { useApp } from '@/context/AppContext';
import { applyFilters, defaultFilters, type FilterState } from '@/lib/filters';

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function BrowsePage() {
  const { route } = useRouter();
  const { postedProperties } = useApp();
  const query = route.name === 'browse' ? route.query ?? {} : {};

  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    city: query.city ?? 'All',
    area: query.area ?? 'All',
    type: (query.type as FilterState['type']) ?? 'All',
    minRent: query.minRent ?? '',
    maxRent: query.maxRent ?? '',
    bedrooms: query.bedrooms ?? 'Any',
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sort, setSort] = useState('relevance');
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [locStatus, setLocStatus] = useState<'idle' | 'loading' | 'error' | 'denied'>('idle');

  const findNearMe = () => {
    if (!navigator.geolocation) { setLocStatus('error'); return; }
    setLocStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => { setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocStatus('idle'); setSort('nearest'); },
      () => { setLocStatus('denied'); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // re-sync when navigating with a new query (e.g. city from footer)
  useEffect(() => {
    setFilters((f) => ({
      ...f,
      city: query.city ?? 'All',
      area: query.area ?? 'All',
      type: (query.type as FilterState['type']) ?? 'All',
      minRent: query.minRent ?? '',
      maxRent: query.maxRent ?? '',
      bedrooms: query.bedrooms ?? 'Any',
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.city, query.area, query.type, query.minRent, query.maxRent, query.bedrooms]);

  // auto-trigger "near me" when SearchBar requests it
  useEffect(() => {
    if (query.near === 'me') findNearMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.near]);

  const all = useMemo(() => [...postedProperties, ...properties], [postedProperties]);
  const filtered = useMemo(() => {
    let list = applyFilters(all, filters);
    if (sort === 'rent-low') list = [...list].sort((a, b) => a.rent - b.rent);
    if (sort === 'rent-high') list = [...list].sort((a, b) => b.rent - a.rent);
    if (sort === 'newest') list = [...list].sort((a, b) => +new Date(b.postedAt) - +new Date(a.postedAt));
    if (sort === 'nearest' && userLoc) list = [...list].sort((a, b) => {
      const da = a.lat ? haversine(userLoc.lat, userLoc.lng, a.lat, a.lng) : Infinity;
      const db = b.lat ? haversine(userLoc.lat, userLoc.lng, b.lat, b.lng) : Infinity;
      return da - db;
    });
    return list;
  }, [all, filters, sort, userLoc]);

  const clearAll = () => setFilters(defaultFilters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
        <HomeIcon className="h-3.5 w-3.5" /> / <span className="text-slate-900 dark:text-white">Browse Houses</span>
      </nav>
      <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">Browse Houses</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">{filtered.length} {filtered.length === 1 ? 'rental' : 'rentals'} available</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input !py-2.5 pl-9 sm:w-64"
              placeholder="Search title or area..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          <select className="input !py-2.5 sm:w-44" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="relevance">Sort: Relevance</option>
            <option value="rent-low">Rent: Low to High</option>
            <option value="rent-high">Rent: High to Low</option>
            <option value="newest">Recently Added</option>
            <option value="nearest">Nearest to me</option>
          </select>
          <button onClick={findNearMe} className="btn-outline !py-2.5 flex items-center gap-1.5 whitespace-nowrap" title="Find houses near me">
            <LocateFixed className="h-4 w-4" /> <span className="hidden sm:inline">Near me</span>
          </button>
          <button onClick={() => setShowMobileFilters(true)} className="btn-outline !px-3 lg:hidden">
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[18rem_1fr]">
        <div className="hidden lg:block">
          <FilterPanel filters={filters} setFilters={setFilters} resultCount={filtered.length} onClear={clearAll} />
        </div>

        <div>
          {locStatus === 'denied' && (
            <div className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              Location permission was denied. Enable it in your browser to find houses near you.
            </div>
          )}
          {locStatus === 'error' && (
            <div className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
              Your browser doesn't support location. Try a different browser.
            </div>
          )}
          {userLoc && sort === 'nearest' && (
            <div className="mb-4 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700 dark:bg-brand-950/40 dark:text-brand-300">
              <MapPin className="mr-1 inline h-4 w-4" /> Showing nearest rentals first. Your exact location is never shared.
            </div>
          )}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          ) : (
            <div className="card flex flex-col items-center justify-center gap-3 py-20 text-center">
              <Frown className="h-12 w-12 text-slate-300 dark:text-slate-700" />
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">No homes match your filters</h3>
              <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">Try widening your budget, changing the city, or removing some amenities.</p>
              <button onClick={clearAll} className="btn-primary mt-2">Clear filters</button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute inset-y-0 right-0 w-full max-w-sm overflow-y-auto bg-white p-4 animate-fade-in dark:bg-slate-950">
            <button onClick={() => setShowMobileFilters(false)} className="mb-3 ml-auto grid h-9 w-9 place-items-center rounded-lg bg-slate-100 dark:bg-slate-800">
              <X className="h-5 w-5" />
            </button>
            <FilterPanel filters={filters} setFilters={setFilters} resultCount={filtered.length} onClear={clearAll} />
            <button onClick={() => setShowMobileFilters(false)} className="btn-primary mt-4 w-full">Show {filtered.length} homes</button>
          </div>
        </div>
      )}
    </div>
  );
}
