import { useState } from 'react';
import {
  Heart, BedDouble, Bath, Maximize, MapPin, Star, Phone, Car, Calendar,
  ShieldCheck, Tag, User, Flag,
} from 'lucide-react';
import type { Property } from '@/types';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/context/RouterContext';
import { formatRent, formatArea, timeAgo } from '@/lib/format';
import { amenityIcon } from '@/lib/amenityIcons';

export default function PropertyCard({ property }: { property: Property }) {
  const { isFavorite, toggleFavorite } = useApp();
  const { navigate } = useRouter();
  const fav = isFavorite(property.id);
  const [showContact, setShowContact] = useState(false);

  const trustBadges = [
    { label: 'Verified Listing', icon: ShieldCheck, tone: 'emerald' as const, show: property.tags?.includes('Verified Listing') || property.owner.verified },
    { label: 'Owner Listed', icon: User, tone: 'sky' as const, show: property.tags?.includes('Owner Listed') || !property.isDemo },
    { label: 'Recently Added', icon: Tag, tone: 'amber' as const, show: property.tags?.includes('Recently Added') || timeAgo(property.postedAt) === 'Today' || timeAgo(property.postedAt).includes('day') },
    { label: 'Demo Listing', icon: Tag, tone: 'slate' as const, show: property.isDemo },
  ].filter((b) => b.show);

  const toneClasses: Record<string, string> = {
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-800',
    sky: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-950/50 dark:text-sky-300 dark:ring-sky-800',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-800',
    slate: 'bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
  };

  return (
    <article className="group card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-black/40">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-col gap-1.5">
            {property.featured && (
              <span className="badge bg-brand-600 text-white shadow">
                <Star className="h-3 w-3 fill-current" /> Featured
              </span>
            )}
            <span className="badge bg-white/90 text-slate-700 backdrop-blur dark:bg-slate-900/90 dark:text-slate-200">
              {property.type}
            </span>
          </div>
          <button
            onClick={() => toggleFavorite(property.id)}
            aria-label={fav ? 'Remove from favorites' : 'Save to favorites'}
            className={`grid h-9 w-9 place-items-center rounded-full backdrop-blur transition ${
              fav
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                : 'bg-white/90 text-slate-600 hover:bg-white hover:text-rose-500 dark:bg-slate-900/90 dark:text-slate-300'
            }`}
          >
            <Heart className={`h-4 w-4 ${fav ? 'fill-current' : ''}`} />
          </button>
        </div>
        <div className="absolute bottom-0 right-0 rounded-tl-xl bg-slate-900/85 px-3 py-1.5 text-sm font-bold text-white backdrop-blur">
          {formatRent(property.rent)}<span className="text-xs font-normal text-slate-300">/mo</span>
        </div>
      </div>

      <div className="p-4">
        {trustBadges.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            {trustBadges.slice(0, 2).map((b) => (
              <span key={b.label} className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ${toneClasses[b.tone]}`}>
                <b.icon className="h-2.5 w-2.5" /> {b.label}
              </span>
            ))}
          </div>
        )}
        <h3 className="line-clamp-1 font-display text-base font-bold text-slate-900 dark:text-white">{property.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
          <MapPin className="h-3.5 w-3.5" /> {property.location}
        </p>

        <div className="mt-3 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1" title="Bedrooms"><BedDouble className="h-4 w-4 text-brand-600" /> {property.bedrooms} BHK</span>
          <span className="flex items-center gap-1" title="Bathrooms"><Bath className="h-4 w-4 text-brand-600" /> {property.bathrooms}</span>
          <span className="flex items-center gap-1" title="Built-up area"><Maximize className="h-4 w-4 text-brand-600" /> {formatArea(property.area)}</span>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1" title="Deposit">
            <span className="font-medium text-slate-600 dark:text-slate-300">Deposit:</span> {formatRent(property.deposit)}
          </span>
          <span className="flex items-center gap-1" title="Parking">
            <Car className="h-3.5 w-3.5 text-brand-600" /> {property.parking ? 'Parking' : 'No parking'}
          </span>
          <span className="flex items-center gap-1" title="Available from">
            <Calendar className="h-3.5 w-3.5 text-brand-600" /> {new Date(property.availableFrom).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {property.amenities.slice(0, 3).map((a) => {
            const Icon = amenityIcon(a);
            return (
              <span key={a} className="chip !py-0.5 !text-[11px]">
                <Icon className="h-3 w-3" /> {a}
              </span>
            );
          })}
          {property.amenities.length > 3 && (
            <span className="chip !py-0.5 !text-[11px]">+{property.amenities.length - 3}</span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
          <span className="chip">{property.furnishing}</span>
          <span className="text-xs text-slate-400">{timeAgo(property.postedAt)}</span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => navigate({ name: 'details', id: property.id })}
            className="btn-outline !py-2.5 text-sm group-hover:border-brand-400 group-hover:text-brand-700"
          >
            View Details
          </button>
          <button
            onClick={() => setShowContact(true)}
            className="btn-primary !py-2.5 text-sm"
          >
            <Phone className="h-3.5 w-3.5" /> Contact Owner
          </button>
        </div>
      </div>

      {showContact && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => setShowContact(false)}>
          <div className="absolute inset-0 bg-black/50 animate-fade-in" />
          <div className="relative w-full max-w-sm card p-5 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">Contact {property.owner.name}</h3>
              <button onClick={() => setShowContact(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">✕</button>
            </div>
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
              For more details about this property, reach out directly:
            </p>
            <div className="mt-3 space-y-2 text-sm">
              <a href={`tel:${property.owner.phone}`} className="flex items-center gap-2 text-slate-700 hover:text-brand-600 dark:text-slate-200">
                <Phone className="h-4 w-4 text-brand-600" /> {property.owner.phone}
              </a>
              <a href={`mailto:${property.owner.email}`} className="flex items-center gap-2 text-slate-700 hover:text-brand-600 dark:text-slate-200">
                <span className="text-brand-600">@</span> {property.owner.email}
              </a>
            </div>
            <button
              onClick={() => { setShowContact(false); navigate({ name: 'details', id: property.id }); }}
              className="btn-outline w-full mt-4 !py-2.5"
            >
              View full details
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
