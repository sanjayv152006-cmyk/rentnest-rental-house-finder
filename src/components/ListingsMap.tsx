import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Property } from '@/types';
import { formatRent } from '@/lib/format';
import { MapPin, Navigation } from 'lucide-react';

interface ListingsMapProps {
  properties: Property[];
  onSelect: (id: string) => void;
}

export default function ListingsMap({ properties, onSelect }: ListingsMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [11.0, 77.5],
      zoom: 9,
      scrollWheelZoom: false,
    });
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const layer = markersRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    const validProps = properties.filter((p) => typeof p.lat === 'number' && typeof p.lng === 'number');
    if (validProps.length === 0) return;

    const customIcon = L.divIcon({
      className: 'rentnest-marker',
      html: `<div style="background:#14bf80;width:24px;height:24px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.35);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24],
    });

    const bounds: L.LatLngExpression[] = [];

    validProps.forEach((p) => {
      const marker = L.marker([p.lat as number, p.lng as number], { icon: customIcon });
      const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
      marker.bindPopup(
        `<div style="font-family:Inter,system-ui,sans-serif;min-width:200px;max-width:240px;">
          <div style="font-weight:700;font-size:14px;color:#0f172a;margin-bottom:4px;">${p.title}</div>
          <div style="font-size:12px;color:#64748b;margin-bottom:6px;display:flex;align-items:center;gap:4px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#14bf80" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            ${p.location}
          </div>
          <div style="font-weight:800;font-size:16px;color:#0f172a;margin-bottom:8px;">${formatRent(p.rent)}/mo</div>
          <div style="display:flex;gap:6px;">
            <a href="#" data-rentnest-id="${p.id}" style="flex:1;background:#14bf80;color:#fff;text-decoration:none;font-size:12px;font-weight:600;padding:6px 8px;border-radius:6px;text-align:center;">View Details</a>
            <a href="${directionsUrl}" target="_blank" rel="noopener" style="flex:1;background:#fff;color:#0f172a;border:1px solid #cbd5e1;text-decoration:none;font-size:12px;font-weight:600;padding:6px 8px;border-radius:6px;text-align:center;">Directions</a>
          </div>
          ${p.isDemo ? '<div style="margin-top:6px;font-size:10px;color:#d97706;">Demo Listing • Approximate Location</div>' : ''}
        </div>`
      );
      layer.addLayer(marker);
      bounds.push([p.lat as number, p.lng as number]);
    });

    if (bounds.length === 1) {
      map.setView(bounds[0], 13);
    } else if (bounds.length > 1) {
      map.fitBounds(L.latLngBounds(bounds), { padding: [40, 40] });
    }

    // Handle "View Details" clicks inside popups
    const clickHandler = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.dataset && target.dataset.rentnestId) {
        e.preventDefault();
        map.closePopup();
        onSelect(target.dataset.rentnestId);
      }
    };
    map.getContainer().addEventListener('click', clickHandler);

    return () => {
      map.getContainer().removeEventListener('click', clickHandler);
    };
  }, [properties, onSelect]);

  return (
    <section className="card overflow-hidden p-0">
      <div className="flex items-center justify-between p-5 pb-3">
        <div>
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900 dark:text-white">
            <MapPin className="h-5 w-5 text-brand-600" /> Map View
          </h2>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Click a marker to see property details and directions
          </p>
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">
          {properties.filter((p) => p.lat).length} mapped listings
        </span>
      </div>
      <div ref={containerRef} className="h-[420px] w-full bg-slate-100 dark:bg-slate-800" />
      <div className="flex items-center justify-between p-4">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Map data © OpenStreetMap contributors · Demo listings use approximate locality coordinates
        </span>
        <a
          href="https://www.openstreetmap.org/?mlat=11.0&mlon=77.5#map=9/11.0/77.5"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline !py-2 text-sm"
        >
          <Navigation className="h-3.5 w-3.5" /> View on Map
        </a>
      </div>
    </section>
  );
}
