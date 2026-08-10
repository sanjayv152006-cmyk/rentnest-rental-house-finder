import { Heart, BedDouble, Bath, Maximize, MapPin, Star } from 'lucide-react';
import type { Property } from '@/types';
import { useApp } from '@/context/AppContext';
import { useRouter } from '@/context/RouterContext';
import { formatRent, formatArea, timeAgo } from '@/lib/format';
import { amenityIcon } from '@/lib/amenityIcons';

export default function PropertyCard({ property }: { property: Property }) {
  const { isFavorite, toggleFavorite } = useApp();
  const { navigate } = useRouter();
  const fav = isFavorite(property.id);

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
        <div className="absolute bottom-0 right-0 rounded-tl-xl bg-slate-900/80 px-3 py-1.5 text-sm font-bold text-white backdrop-blur">
          {formatRent(property.rent)}<span className="text-xs font-normal text-slate-300">/mo</span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-1 font-display text-base font-bold text-slate-900 dark:text-white">{property.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
          <MapPin className="h-3.5 w-3.5" /> {property.location}
        </p>

        <div className="mt-3 flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
          <span className="flex items-center gap-1"><BedDouble className="h-4 w-4 text-brand-600" /> {property.bedrooms}</span>
          <span className="flex items-center gap-1"><Bath className="h-4 w-4 text-brand-600" /> {property.bathrooms}</span>
          <span className="flex items-center gap-1"><Maximize className="h-4 w-4 text-brand-600" /> {formatArea(property.area)}</span>
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

        <button
          onClick={() => navigate({ name: 'details', id: property.id })}
          className="mt-3 w-full btn-outline !py-2.5 group-hover:border-brand-400 group-hover:text-brand-700"
        >
          View Details
        </button>
      </div>
    </article>
  );
}
