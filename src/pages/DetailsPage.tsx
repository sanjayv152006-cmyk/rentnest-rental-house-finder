import { useState } from 'react';
import {
  ArrowLeft, BedDouble, Bath, Maximize, MapPin, Star, Phone, Mail, Heart, Share2,
  CheckCircle2, ShieldCheck, Clock, MessageSquare, Home as HomeIcon, Sofa, Car, Calendar,
  Flag, Tag, User,
} from 'lucide-react';
import { useRouter } from '@/context/RouterContext';
import { useApp } from '@/context/AppContext';
import { properties } from '@/data/properties';
import { formatRent, formatArea, timeAgo } from '@/lib/format';
import type { Property } from '@/types';
import { amenityIcon } from '@/lib/amenityIcons';
import ImageGallery from '@/components/ImageGallery';
import PropertyCard from '@/components/PropertyCard';
import LocationMap from '@/components/LocationMap';

export default function DetailsPage({ id }: { id: string }) {
  const { navigate } = useRouter();
  const { isFavorite, toggleFavorite, user, addContactRequest, postedProperties } = useApp();
  const property: Property | undefined = [...postedProperties, ...properties].find((p) => p.id === id);
  const [showContact, setShowContact] = useState(false);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!property) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-24 text-center">
        <HomeIcon className="h-12 w-12 text-slate-300" />
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Home not found</h1>
        <p className="text-slate-500 dark:text-slate-400">This listing may have been removed.</p>
        <button onClick={() => navigate({ name: 'browse' })} className="btn-primary">Back to browse</button>
      </div>
    );
  }

  const fav = isFavorite(property.id);
  const similar = properties.filter((p) => p.id !== property.id && p.city === property.city).slice(0, 3);

  const handleContact = () => {
    if (!user) {
      navigate({ name: 'auth' });
      return;
    }
    if (!message.trim()) return;
    addContactRequest({
      propertyId: property.id,
      propertyTitle: property.title,
      ownerName: property.owner.name,
      message,
    });
    setSent(true);
    setMessage('');
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
        <button onClick={() => navigate({ name: 'home' })} className="flex items-center gap-1 hover:text-brand-600"><HomeIcon className="h-3.5 w-3.5" /> Home</button>
        / <button onClick={() => navigate({ name: 'browse' })} className="hover:text-brand-600">Browse</button>
        / <span className="text-slate-900 dark:text-white">{property.title}</span>
      </nav>

      <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            {property.featured && <span className="badge bg-brand-600 text-white"><Star className="h-3 w-3 fill-current" /> Featured</span>}
            <span className="badge bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">{property.type}</span>
            <span className={`badge ${property.available ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-rose-100 text-rose-700'}`}>
              {property.available ? 'Available' : 'Leased'}
            </span>
          </div>
          <h1 className="mt-3 font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">{property.title}</h1>
          <p className="mt-1.5 flex items-center gap-1.5 text-slate-500 dark:text-slate-400"><MapPin className="h-4 w-4 text-brand-600" /> {property.location}</p>
          <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-500 dark:text-slate-400"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {property.address}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => toggleFavorite(property.id)}
            className={`btn-outline !py-2.5 ${fav ? 'border-rose-400 text-rose-600 dark:text-rose-400' : ''}`}
          >
            <Heart className={`h-4 w-4 ${fav ? 'fill-current' : ''}`} /> {fav ? 'Saved' : 'Save'}
          </button>
          <button onClick={() => navigator.clipboard?.writeText(window.location.href)} className="btn-outline !py-2.5 !px-3" aria-label="Share">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-6">
        <ImageGallery images={property.images} alt={property.title} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-8">
          {/* Key stats */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: BedDouble, label: 'Bedrooms', value: `${property.bedrooms} BHK` },
              { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
              { icon: Maximize, label: 'Built-up Area', value: formatArea(property.area) },
              { icon: Sofa, label: 'Furnishing', value: property.furnishing },
              { icon: Car, label: 'Parking', value: property.parking ? 'Available' : 'Not available' },
              { icon: Calendar, label: 'Available From', value: new Date(property.availableFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
              { icon: Tag, label: 'Deposit', value: formatRent(property.deposit) },
              { icon: HomeIcon, label: 'Property Type', value: property.type },
            ].map((s) => (
              <div key={s.label} className="card p-4">
                <s.icon className="h-5 w-5 text-brand-600" />
                <div className="mt-2 text-base font-bold text-slate-900 dark:text-white">{s.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Description */}
          <section className="card p-6">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">About this home</h2>
            <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">{property.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="chip"><MapPin className="h-3.5 w-3.5" /> {property.city}</span>
              <span className="chip"><Clock className="h-3.5 w-3.5" /> Listed {timeAgo(property.postedAt)}</span>
              {property.postedByUser && <span className="chip bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">Your Listing</span>}
            </div>
          </section>

          {/* Amenities */}
          <section className="card p-6">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Amenities</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {property.amenities.map((a) => {
                const Icon = amenityIcon(a);
                return (
                  <div key={a} className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-3 py-2.5 text-sm text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
                    <Icon className="h-4 w-4 text-brand-600" /> {a}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Map */}
          <LocationMap city={property.city} area={property.location.split(',')[0]} address={property.address} lat={property.lat} lng={property.lng} isDemo={property.isDemo} />

          {/* Similar */}
          {similar.length > 0 && (
            <section>
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Similar homes in {property.city}</h2>
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {similar.map((p) => <PropertyCard key={p.id} property={p} />)}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
          <div className="card p-6">
            <div className="flex items-end gap-1">
              <span className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">{formatRent(property.rent)}</span>
              <span className="pb-1 text-sm text-slate-500 dark:text-slate-400">/month</span>
            </div>
            <div className="mt-4 space-y-2.5">
              <button onClick={() => setShowContact(true)} className="btn-primary w-full">
                <Phone className="h-4 w-4" /> Contact Owner
              </button>
              <button
                onClick={() => toggleFavorite(property.id)}
                className={`btn-outline w-full ${fav ? 'border-rose-400 text-rose-600 dark:text-rose-400' : ''}`}
              >
                <Heart className={`h-4 w-4 ${fav ? 'fill-current' : ''}`} /> {fav ? 'Saved to Favorites' : 'Save to Favorites'}
              </button>
            </div>
            <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
              <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><ShieldCheck className="h-4 w-4 text-brand-600" /> {property.owner.verified ? 'Verified owner' : 'Owner not verified'}</p>
              <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><CheckCircle2 className="h-4 w-4 text-brand-600" /> {property.available ? 'Ready to move in' : 'Currently leased'}</p>
              <p className="flex items-center gap-2 text-slate-600 dark:text-slate-300"><Calendar className="h-4 w-4 text-brand-600" /> Available from {new Date(property.availableFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
              {property.isDemo && <p className="flex items-center gap-2 text-amber-600 dark:text-amber-400"><Tag className="h-4 w-4" /> Demo Listing - sample data</p>}
              <button className="flex items-center gap-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400"><Flag className="h-4 w-4" /> Report this listing</button>
            </div>
          </div>

          {/* Owner */}
          <div className="card p-6">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Listed by</h3>
            <div className="mt-3 flex items-center gap-3">
              <img src={property.owner.avatar} alt={property.owner.name} className="h-14 w-14 rounded-full bg-brand-100" />
              <div>
                <p className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                  {property.owner.name}
                  {property.owner.verified && <ShieldCheck className="h-4 w-4 text-brand-600" />}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Responds in ~{Math.max(1, Math.round((100 - property.owner.responseRate) / 10))}h · {property.owner.responseRate}% response rate</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <a href={`tel:${property.owner.phone}`} className="flex items-center gap-2 text-slate-600 hover:text-brand-600 dark:text-slate-300"><Phone className="h-4 w-4 text-brand-600" /> {property.owner.phone}</a>
              <a href={`mailto:${property.owner.email}`} className="flex items-center gap-2 text-slate-600 hover:text-brand-600 dark:text-slate-300"><Mail className="h-4 w-4 text-brand-600" /> {property.owner.email}</a>
            </div>
          </div>
        </aside>
      </div>

      <button onClick={() => navigate({ name: 'browse' })} className="mt-10 flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-brand-600 dark:text-slate-300">
        <ArrowLeft className="h-4 w-4" /> Back to all homes
      </button>

      {/* Contact modal */}
      {showContact && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={() => setShowContact(false)} />
          <div className="relative w-full max-w-md card p-6 animate-scale-in">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">Contact {property.owner.name}</h3>
              <button onClick={() => setShowContact(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">✕</button>
            </div>
            {!user && (
              <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                Please sign in to send a message to the owner.
              </p>
            )}
            {sent ? (
              <div className="mt-4 flex flex-col items-center gap-2 py-6 text-center">
                <CheckCircle2 className="h-10 w-10 text-brand-600" />
                <p className="font-semibold text-slate-900 dark:text-white">Message sent!</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{property.owner.name} will get back to you soon.</p>
              </div>
            ) : (
              <>
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                  <img src={property.owner.avatar} alt={property.owner.name} className="h-10 w-10 rounded-full" />
                  <div className="text-sm">
                    <p className="font-semibold text-slate-900 dark:text-white">{property.title}</p>
                    <p className="text-slate-500 dark:text-slate-400">{formatRent(property.rent)}/mo · {property.location}</p>
                  </div>
                </div>
                <label className="label mt-4">Your message</label>
                <textarea
                  className="input min-h-[7rem] resize-y"
                  placeholder={`Hi ${property.owner.name.split(' ')[0]}, I'm interested in this property. Is it still available?`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={!user}
                />
                <button onClick={handleContact} disabled={!user || !message.trim()} className="btn-primary mt-4 w-full">
                  <MessageSquare className="h-4 w-4" /> Send Message
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
