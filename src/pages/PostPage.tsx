import { useState } from 'react';
import { UploadCloud, CheckCircle2, ImagePlus, X, Home as HomeIcon } from 'lucide-react';
import { useRouter } from '@/context/RouterContext';
import { useApp } from '@/context/AppContext';
import { ALL_AMENITIES, FURNISHINGS, PROPERTY_TYPES, CITIES, areasForCity, type Property, type PropertyType, type Furnishing } from '@/types';
import { formatRent } from '@/lib/format';
import { amenityIcon } from '@/lib/amenityIcons';
import { uid } from '@/lib/format';

const sampleImages = [
  'https://images.pexels.com/photos/8482510/pexels-photo-8482510.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/8135492/pexels-photo-8135492.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/6903157/pexels-photo-6903157.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/7045356/pexels-photo-7045356.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

export default function PostPage() {
  const { navigate } = useRouter();
  const { user, addPostedProperty } = useApp();

  const [form, setForm] = useState({
    title: '',
    location: '',
    address: '',
    city: CITIES[0],
    rent: '',
    deposit: '',
    type: PROPERTY_TYPES[0] as PropertyType,
    bedrooms: '2',
    bathrooms: '2',
    area: '',
    furnishing: 'Furnished' as Furnishing,
    parking: 'true',
    availableFrom: new Date().toISOString().slice(0, 10),
    description: '',
    ownerName: user?.name || '',
    phone: '',
    email: user?.email || '',
  });
  const [selectedArea, setSelectedArea] = useState('');
  const [amenities, setAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm({ ...form, [k]: v });
  const toggleAmenity = (a: string) =>
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const addSampleImage = () => {
    const next = sampleImages.find((u) => !images.includes(u));
    if (next) setImages([...images, next]);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).slice(0, 8).forEach((f) => {
      const url = URL.createObjectURL(f);
      setImages((prev) => [...prev, url]);
    });
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.title.trim()) e.title = 'Property title is required';
    if (!selectedArea) e.location = 'Please select a local area';
    if (!form.address.trim()) e.address = 'Full address is required';
    if (!form.rent || Number(form.rent) <= 0) e.rent = 'Enter a valid monthly rent';
    if (!form.deposit || Number(form.deposit) < 0) e.deposit = 'Enter a valid deposit amount';
    if (!form.area || Number(form.area) <= 0) e.area = 'Enter the area in sq.ft';
    if (!form.ownerName.trim()) e.ownerName = 'Owner name is required';
    if (form.phone && form.phone.length < 8) e.phone = 'Enter a valid phone number';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (images.length === 0) e.images = 'Add at least one property image';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate({ name: 'auth' });
      return;
    }
    if (!validate()) return;

    const property: Property = {
      id: uid(),
      title: form.title,
      location: selectedArea ? `${selectedArea}, ${form.city}` : form.city,
      address: form.address,
      city: form.city,
      rent: Number(form.rent),
      deposit: Number(form.deposit),
      type: form.type,
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      area: Number(form.area),
      furnishing: form.furnishing,
      parking: form.parking === 'true',
      availableFrom: form.availableFrom,
      amenities: amenities.length ? amenities : ['Parking', 'Water Supply'],
      description: form.description || 'A wonderful rental property awaiting its next tenant.',
      images,
      owner: {
        name: form.ownerName || user.name,
        phone: form.phone,
        email: form.email || user.email,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(form.ownerName || user.name)}&backgroundColor=14bf80&textColor=ffffff`,
        verified: true,
        responseRate: 96,
      },
      featured: false,
      available: true,
      postedAt: new Date().toISOString(),
      postedByUser: true,
    };
    addPostedProperty(property);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 px-4 py-24 text-center animate-fade-up">
        <CheckCircle2 className="h-16 w-16 text-brand-600" />
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Property Posted Successfully!</h1>
        <p className="text-slate-500 dark:text-slate-400">Your listing is now live on RentNest and visible to thousands of renters across Tamil Nadu.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={() => navigate({ name: 'dashboard' })} className="btn-primary">Go to Dashboard</button>
          <button onClick={() => navigate({ name: 'browse' })} className="btn-outline">View in Browse</button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
        <HomeIcon className="h-3.5 w-3.5" /> / <span className="text-slate-900 dark:text-white">Post a Rental</span>
      </nav>
      <h1 className="mt-4 font-display text-3xl font-extrabold text-slate-900 dark:text-white">Post a Rental</h1>
      <p className="mt-2 text-slate-500 dark:text-slate-400">List your property in minutes and reach qualified renters across Tamil Nadu.</p>

      {!user && (
        <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300">
          <span>You need to sign in to post a property.</span>
          <button onClick={() => navigate({ name: 'auth' })} className="btn-primary !py-2">Sign In</button>
        </div>
      )}

      <form onSubmit={submit} className="mt-6 space-y-8">
        {/* Basics */}
        <section className="card p-6">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Property Details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="label">Property title *</label>
              <input className="input" placeholder="e.g. 2 BHK Modern Apartment in OMR" value={form.title} onChange={(e) => set('title', e.target.value)} />
              {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title}</p>}
            </div>
            <div>
              <label className="label">Local Area *</label>
              <select
                className="input"
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
              >
                <option value="">Select an area</option>
                {areasForCity(form.city).map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
              {errors.location && <p className="mt-1 text-xs text-rose-600">{errors.location}</p>}
            </div>
            <div>
              <label className="label">District / City</label>
              <select className="input" value={form.city} onChange={(e) => { set('city', e.target.value); setSelectedArea(''); }}>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Full Address *</label>
              <textarea
                className="input min-h-[5rem] resize-y"
                placeholder="Flat no, building name, street, area, PIN code"
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
              />
              {errors.address && <p className="mt-1 text-xs text-rose-600">{errors.address}</p>}
            </div>
            <div>
              <label className="label">Monthly Rent (₹) *</label>
              <input className="input" type="number" min={0} placeholder="15000" value={form.rent} onChange={(e) => set('rent', e.target.value)} />
              {errors.rent && <p className="mt-1 text-xs text-rose-600">{errors.rent}</p>}
            </div>
            <div>
              <label className="label">Deposit (₹) *</label>
              <input className="input" type="number" min={0} placeholder="50000" value={form.deposit} onChange={(e) => set('deposit', e.target.value)} />
              {errors.deposit && <p className="mt-1 text-xs text-rose-600">{errors.deposit}</p>}
            </div>
            <div>
              <label className="label">Property Type</label>
              <select className="input" value={form.type} onChange={(e) => set('type', e.target.value as PropertyType)}>
                {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Bedrooms</label>
              <select className="input" value={form.bedrooms} onChange={(e) => set('bedrooms', e.target.value)}>
                {['1', '2', '3', '4', '5'].map((n) => <option key={n} value={n}>{n} BHK</option>)}
              </select>
            </div>
            <div>
              <label className="label">Bathrooms</label>
              <select className="input" value={form.bathrooms} onChange={(e) => set('bathrooms', e.target.value)}>
                {['1', '2', '3', '4'].map((n) => <option key={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Area (sq.ft) *</label>
              <input className="input" type="number" min={0} placeholder="1150" value={form.area} onChange={(e) => set('area', e.target.value)} />
              {errors.area && <p className="mt-1 text-xs text-rose-600">{errors.area}</p>}
            </div>
            <div>
              <label className="label">Furnishing</label>
              <select className="input" value={form.furnishing} onChange={(e) => set('furnishing', e.target.value as Furnishing)}>
                {FURNISHINGS.map((f) => <option key={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Parking</label>
              <select className="input" value={form.parking} onChange={(e) => set('parking', e.target.value)}>
                <option value="true">Available</option>
                <option value="false">Not available</option>
              </select>
            </div>
            <div>
              <label className="label">Available From</label>
              <input className="input" type="date" value={form.availableFrom} onChange={(e) => set('availableFrom', e.target.value)} />
            </div>
          </div>
        </section>

        {/* Amenities */}
        <section className="card p-6">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Amenities</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Select all that apply.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {ALL_AMENITIES.map((a) => {
              const active = amenities.includes(a);
              const Icon = amenityIcon(a);
              return (
                <button
                  type="button"
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active
                      ? 'bg-brand-50 text-brand-700 ring-1 ring-brand-300 dark:bg-brand-950/60 dark:text-brand-300 dark:ring-brand-700'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
                  }`}
                >
                  <Icon className="h-4 w-4" /> {a}
                </button>
              );
            })}
          </div>
        </section>

        {/* Description */}
        <section className="card p-6">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Property Description</h2>
          <label className="label mt-3">Describe your property</label>
          <textarea
            className="input min-h-[8rem] resize-y"
            placeholder="Describe what makes this home special — layout, light, locality, nearby schools, transport, shops..."
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </section>

        {/* Images */}
        <section className="card p-6">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Property Images *</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Add up to 8 photos. The first image becomes the cover.</p>
          <label className="mt-4 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-brand-400 hover:bg-brand-50/40 dark:border-slate-700 dark:bg-slate-800/40 dark:hover:border-brand-600">
            <UploadCloud className="h-8 w-8 text-brand-600" />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Click to upload photos</span>
            <span className="text-xs text-slate-400">PNG, JPG up to 8 images</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          </label>
          <button type="button" onClick={addSampleImage} className="btn-ghost mt-3 !py-2">
            <ImagePlus className="h-4 w-4" /> Add sample image
          </button>
          {errors.images && <p className="mt-2 text-xs text-rose-600">{errors.images}</p>}
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {images.map((img, i) => (
                <div key={i} className="group relative aspect-[4/3] overflow-hidden rounded-xl">
                  <img src={img} alt={`Upload ${i + 1}`} className="h-full w-full object-cover" />
                  {i === 0 && <span className="badge absolute left-2 top-2 bg-brand-600 text-white">Cover</span>}
                  <button
                    type="button"
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Contact */}
        <section className="card p-6">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Contact Details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <label className="label">Owner Name *</label>
              <input className="input" placeholder="Your full name" value={form.ownerName} onChange={(e) => set('ownerName', e.target.value)} />
              {errors.ownerName && <p className="mt-1 text-xs text-rose-600">{errors.ownerName}</p>}
            </div>
            <div>
              <label className="label">Contact Number</label>
              <input className="input" placeholder="+91 98XXX XXXXX" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
              {errors.phone && <p className="mt-1 text-xs text-rose-600">{errors.phone}</p>}
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input" type="email" placeholder="you@email.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
              {errors.email && <p className="mt-1 text-xs text-rose-600">{errors.email}</p>}
            </div>
          </div>
        </section>

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => navigate({ name: 'home' })} className="btn-ghost">Cancel</button>
          <button type="submit" className="btn-primary" disabled={!user}>Submit Property</button>
        </div>
      </form>
    </div>
  );
}
