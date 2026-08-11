import type { Property, PropertyType, Furnishing } from '@/types';

export interface FilterState {
  search: string;
  city: string;
  area: string;
  type: PropertyType | 'All';
  minRent: string;
  maxRent: string;
  bedrooms: string;
  bathrooms: string;
  furnishing: Furnishing | 'All';
  parking: 'Any' | 'Yes' | 'No';
  amenities: string[];
}

export const defaultFilters: FilterState = {
  search: '',
  city: 'All',
  area: 'All',
  type: 'All',
  minRent: '',
  maxRent: '',
  bedrooms: 'Any',
  bathrooms: 'Any',
  furnishing: 'All',
  parking: 'Any',
  amenities: [],
};

export function applyFilters(list: Property[], f: FilterState): Property[] {
  return list.filter((p) => {
    if (f.search) {
      const q = f.search.toLowerCase();
      if (
        !p.title.toLowerCase().includes(q) &&
        !p.location.toLowerCase().includes(q) &&
        !p.address.toLowerCase().includes(q)
      )
        return false;
    }
    if (f.city !== 'All' && p.city !== f.city) return false;
    if (f.area !== 'All' && !p.location.toLowerCase().includes(f.area.toLowerCase())) return false;
    if (f.type !== 'All' && p.type !== f.type) return false;
    if (f.furnishing !== 'All' && p.furnishing !== f.furnishing) return false;
    if (f.minRent && p.rent < Number(f.minRent)) return false;
    if (f.maxRent && p.rent > Number(f.maxRent)) return false;
    if (f.bedrooms !== 'Any' && p.bedrooms < Number(f.bedrooms)) return false;
    if (f.bathrooms !== 'Any' && p.bathrooms < Number(f.bathrooms)) return false;
    if (f.parking === 'Yes' && !p.parking) return false;
    if (f.parking === 'No' && p.parking) return false;
    if (f.amenities.length > 0 && !f.amenities.every((a) => p.amenities.includes(a))) return false;
    return true;
  });
}
