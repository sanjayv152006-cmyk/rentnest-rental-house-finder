import { Search, MapPin, Home, IndianRupee, BedDouble } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from '@/context/RouterContext';
import { CITIES, PROPERTY_TYPES, areasForCity } from '@/types';

export default function SearchBar({ variant = 'hero' }: { variant?: 'hero' | 'compact' }) {
  const { navigate } = useRouter();
  const [city, setCity] = useState('All');
  const [area, setArea] = useState('All');
  const [type, setType] = useState('All');
  const [minRent, setMinRent] = useState('');
  const [maxRent, setMaxRent] = useState('');
  const [bedrooms, setBedrooms] = useState('Any');

  const areas = city === 'All' ? [] : areasForCity(city);

  const submit = () => {
    const query: Record<string, string> = {};
    if (city !== 'All') query.city = city;
    if (area !== 'All') query.area = area;
    if (type !== 'All') query.type = type;
    if (minRent) query.minRent = minRent;
    if (maxRent) query.maxRent = maxRent;
    if (bedrooms !== 'Any') query.bedrooms = bedrooms;
    navigate({ name: 'browse', query });
  };

  const isHero = variant === 'hero';

  return (
    <div className={`card p-4 sm:p-5 ${isHero ? 'shadow-2xl shadow-slate-300/40 dark:shadow-black/40' : ''}`}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <div>
          <label className="label flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-brand-600" /> District / City</label>
          <select
            className="input"
            value={city}
            onChange={(e) => { setCity(e.target.value); setArea('All'); }}
          >
            <option value="All">All cities</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-brand-600" /> Local Area</label>
          <select className="input" value={area} onChange={(e) => setArea(e.target.value)} disabled={city === 'All'}>
            <option value="All">All areas</option>
            {areas.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label flex items-center gap-1.5"><Home className="h-3.5 w-3.5 text-brand-600" /> Property Type</label>
          <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="All">All types</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label flex items-center gap-1.5"><IndianRupee className="h-3.5 w-3.5 text-brand-600" /> Min Rent</label>
          <input className="input" type="number" min={0} placeholder="₹0" value={minRent} onChange={(e) => setMinRent(e.target.value)} />
        </div>
        <div>
          <label className="label flex items-center gap-1.5"><IndianRupee className="h-3.5 w-3.5 text-brand-600" /> Max Rent</label>
          <input className="input" type="number" min={0} placeholder="₹50,000" value={maxRent} onChange={(e) => setMaxRent(e.target.value)} />
        </div>
        <div>
          <label className="label flex items-center gap-1.5"><BedDouble className="h-3.5 w-3.5 text-brand-600" /> Bedrooms</label>
          <select className="input" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)}>
            {['Any', '1', '2', '3', '4'].map((b) => (
              <option key={b} value={b}>{b === 'Any' ? 'Any' : `${b} BHK+`}</option>
            ))}
          </select>
        </div>
      </div>
      <button onClick={submit} className="btn-primary mt-3 w-full sm:w-auto sm:px-8">
        <Search className="h-4 w-4" /> Search Homes
      </button>
    </div>
  );
}
