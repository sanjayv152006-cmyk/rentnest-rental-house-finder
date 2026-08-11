import { SlidersHorizontal, X } from 'lucide-react';
import { ALL_AMENITIES, CITIES, FURNISHINGS, PROPERTY_TYPES, areasForCity } from '@/types';
import { amenityIcon } from '@/lib/amenityIcons';
import type { FilterState } from '@/lib/filters';

export default function FilterPanel({
  filters,
  setFilters,
  resultCount,
  onClear,
}: {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  resultCount: number;
  onClear: () => void;
}) {
  const set = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    setFilters({ ...filters, [key]: value });

  const toggleAmenity = (a: string) =>
    set('amenities', filters.amenities.includes(a) ? filters.amenities.filter((x) => x !== a) : [...filters.amenities, a]);

  return (
    <aside className="card sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto p-5">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-base font-bold text-slate-900 dark:text-white">
          <SlidersHorizontal className="h-4 w-4 text-brand-600" /> Filters
        </h3>
        <button onClick={onClear} className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-rose-500 dark:text-slate-400">
          <X className="h-3.5 w-3.5" /> Clear all
        </button>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <label className="label">District / City</label>
          <select className="input" value={filters.city} onChange={(e) => setFilters({ ...filters, city: e.target.value, area: 'All' })}>
            <option value="All">All cities</option>
            {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Local Area</label>
          <select className="input" value={filters.area} onChange={(e) => set('area', e.target.value)} disabled={filters.city === 'All'}>
            <option value="All">All areas</option>
            {areasForCity(filters.city).map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Property Type</label>
          <select className="input" value={filters.type} onChange={(e) => set('type', e.target.value as FilterState['type'])}>
            <option value="All">All types</option>
            {PROPERTY_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Rent Range (₹/mo)</label>
          <div className="flex items-center gap-2">
            <input className="input" type="number" min={0} placeholder="₹Min" value={filters.minRent} onChange={(e) => set('minRent', e.target.value)} />
            <span className="text-slate-400">–</span>
            <input className="input" type="number" min={0} placeholder="₹Max" value={filters.maxRent} onChange={(e) => set('maxRent', e.target.value)} />
          </div>
        </div>

        <div>
          <label className="label">Bedrooms</label>
          <div className="flex flex-wrap gap-2">
            {['Any', '1', '2', '3', '4'].map((b) => (
              <button
                key={b}
                onClick={() => set('bedrooms', b)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  filters.bedrooms === b
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {b === 'Any' ? 'Any' : `${b}+`}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Bathrooms</label>
          <div className="flex flex-wrap gap-2">
            {['Any', '1', '2', '3'].map((b) => (
              <button
                key={b}
                onClick={() => set('bathrooms', b)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  filters.bathrooms === b
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {b === 'Any' ? 'Any' : `${b}+`}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Furnishing</label>
          <select className="input" value={filters.furnishing} onChange={(e) => set('furnishing', e.target.value as FilterState['furnishing'])}>
            <option value="All">Any</option>
            {FURNISHINGS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>

        <div>
          <label className="label">Parking</label>
          <div className="flex gap-2">
            {(['Any', 'Yes', 'No'] as const).map((p) => (
              <button
                key={p}
                onClick={() => set('parking', p)}
                className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  filters.parking === p
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {p === 'Any' ? 'Any' : p === 'Yes' ? 'Available' : 'None'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {ALL_AMENITIES.map((a) => {
              const active = filters.amenities.includes(a);
              const Icon = amenityIcon(a);
              return (
                <button
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
                    active
                      ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-300 dark:bg-brand-950/60 dark:text-brand-300 dark:ring-brand-700'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {a}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
        {resultCount} {resultCount === 1 ? 'home' : 'homes'} found
      </div>
    </aside>
  );
}
