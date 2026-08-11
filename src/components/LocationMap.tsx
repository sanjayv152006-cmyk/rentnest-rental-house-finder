import { useMemo } from 'react';
import { MapPin, Navigation, Landmark, Building2, GraduationCap, Hospital, Bus, Train, ShoppingBag } from 'lucide-react';

interface LocationMapProps {
  city: string;
  area: string;
  address: string;
  lat?: number;
  lng?: number;
  isDemo?: boolean;
}

interface NearbyPlace {
  label: string;
  distance: string;
  icon: typeof Landmark;
}

const NEARBY_TEMPLATES: Record<string, NearbyPlace[]> = {
  Tiruppur: [
    { label: 'Tiruppur Railway Station', distance: '2.1 km', icon: Train },
    { label: 'Central Bus Stand', distance: '1.5 km', icon: Bus },
    { label: 'Tiruppur Kumaran Memorial', distance: '3.0 km', icon: Landmark },
    { label: 'Corporation Shopping Complex', distance: '0.8 km', icon: ShoppingBag },
    { label: 'Government Hospital', distance: '2.6 km', icon: Hospital },
    { label: 'Bharathiar School', distance: '1.2 km', icon: GraduationCap },
  ],
  Coimbatore: [
    { label: 'Coimbatore Junction', distance: '3.2 km', icon: Train },
    { label: 'Gandhipuram Bus Stand', distance: '1.1 km', icon: Bus },
    { label: 'Tidel Park', distance: '4.5 km', icon: Building2 },
    { label: 'Fun Mall', distance: '2.0 km', icon: ShoppingBag },
    { label: 'KMCH Hospital', distance: '2.8 km', icon: Hospital },
    { label: 'PSG Tech', distance: '3.6 km', icon: GraduationCap },
  ],
  Erode: [
    { label: 'Erode Junction', distance: '1.8 km', icon: Train },
    { label: 'Central Bus Terminus', distance: '2.3 km', icon: Bus },
    { label: 'Vellode Bird Sanctuary', distance: '5.0 km', icon: Landmark },
    { label: 'Texvalley Market', distance: '3.1 km', icon: ShoppingBag },
    { label: 'Erode GH', distance: '2.0 km', icon: Hospital },
    { label: 'IRT Medical College', distance: '4.2 km', icon: GraduationCap },
  ],
  Chennai: [
    { label: 'Metro Station', distance: '0.9 km', icon: Train },
    { label: 'MTC Bus Stop', distance: '0.4 km', icon: Bus },
    { label: 'Phoenix Marketcity', distance: '2.5 km', icon: ShoppingBag },
    { label: 'Apollo Hospital', distance: '3.0 km', icon: Hospital },
    { label: 'DAV School', distance: '1.3 km', icon: GraduationCap },
  ],
  Madurai: [
    { label: 'Madurai Junction', distance: '2.4 km', icon: Train },
    { label: 'Mattuthavani Bus Stand', distance: '0.6 km', icon: Bus },
    { label: 'Meenakshi Temple', distance: '4.0 km', icon: Landmark },
    { label: 'Theme Park Mall', distance: '1.8 km', icon: ShoppingBag },
    { label: 'Government Rajaji Hospital', distance: '3.2 km', icon: Hospital },
    { label: 'Madurai Kamaraj University', distance: '6.5 km', icon: GraduationCap },
  ],
  Salem: [
    { label: 'Salem Junction', distance: '3.0 km', icon: Train },
    { label: 'New Bus Stand', distance: '1.4 km', icon: Bus },
    { label: 'Salem Steel Plant', distance: '5.2 km', icon: Building2 },
    { label: 'The Chennai Silks Mall', distance: '1.0 km', icon: ShoppingBag },
    { label: 'Salem GH', distance: '2.1 km', icon: Hospital },
  ],
};

const FALLBACK_NEARBY: NearbyPlace[] = [
  { label: 'Bus Stop', distance: '0.5 km', icon: Bus },
  { label: 'Railway Station', distance: '2.0 km', icon: Train },
  { label: 'Shopping Centre', distance: '1.2 km', icon: ShoppingBag },
  { label: 'Hospital', distance: '2.4 km', icon: Hospital },
  { label: 'School', distance: '1.0 km', icon: GraduationCap },
];

export default function LocationMap({ city, area, address, lat, lng, isDemo }: LocationMapProps) {
  const nearby = NEARBY_TEMPLATES[city] ?? FALLBACK_NEARBY;

  const { mapSrc, directionsUrl } = useMemo(() => {
    const hasCoords = typeof lat === 'number' && typeof lng === 'number';
    if (hasCoords) {
      const bbox = `${(lng as number) - 0.01},${(lat as number) - 0.008},${(lng as number) + 0.01},${(lat as number) + 0.008}`;
      return {
        mapSrc: `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`,
        directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
      };
    }
    const q = encodeURIComponent(`${area}, ${city}, Tamil Nadu, India`);
    return {
      mapSrc: `https://www.openstreetmap.org/export/embed.html?bbox=76.8,11.0,79.0,13.0&layer=mapnik&marker=11.5,78.0`,
      directionsUrl: `https://www.google.com/maps/search/?api=1&query=${q}`,
    };
  }, [lat, lng, area, city]);

  return (
    <section className="card overflow-hidden p-0">
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Location</h2>
          {isDemo && (
            <span className="chip bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-800">
              <MapPin className="h-3 w-3" /> Demo Listing – Approximate Location
            </span>
          )}
        </div>
        <p className="mt-1 flex items-start gap-1.5 text-sm text-slate-600 dark:text-slate-300">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /> {address}
        </p>
      </div>

      <div className="relative aspect-[16/9] w-full bg-slate-100 dark:bg-slate-800">
        <iframe
          title={`Map of ${area}, ${city}`}
          src={mapSrc}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="flex items-center justify-between p-4">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Map data © OpenStreetMap contributors
        </span>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary !py-2 text-sm"
        >
          <Navigation className="h-3.5 w-3.5" /> Get Directions
        </a>
      </div>

      <div className="border-t border-slate-100 p-6 dark:border-slate-800">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Nearby places</h3>
        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {nearby.map((place) => {
            const Icon = place.icon;
            return (
              <div key={place.label} className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5 text-sm dark:bg-slate-800/60">
                <span className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200">
                  <Icon className="h-4 w-4 text-brand-600" /> {place.label}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{place.distance}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
