export type PropertyType =
  | 'Apartment'
  | 'Independent House'
  | 'Villa'
  | 'Studio'
  | 'Penthouse'
  | 'Individual House';

export type Furnishing = 'Furnished' | 'Semi-Furnished' | 'Unfurnished';

export interface Owner {
  name: string;
  phone: string;
  email: string;
  avatar: string;
  verified: boolean;
  responseRate: number;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  address: string;
  city: string;
  rent: number;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  area: number;
  furnishing: Furnishing;
  amenities: string[];
  description: string;
  images: string[];
  owner: Owner;
  featured: boolean;
  available: boolean;
  postedAt: string;
  postedByUser?: boolean;
}

export const PROPERTY_TYPES: PropertyType[] = [
  'Apartment',
  'Independent House',
  'Villa',
  'Studio',
  'Penthouse',
  'Individual House',
];

export const FURNISHINGS: Furnishing[] = [
  'Furnished',
  'Semi-Furnished',
  'Unfurnished',
];

export const ALL_AMENITIES: string[] = [
  'Parking',
  'WiFi',
  'AC',
  'Power Backup',
  'Lift',
  'Security',
  'CCTV',
  'Water Supply',
  'Gym',
  'Swimming Pool',
  'Children Play Area',
  'Garden',
  'Modular Kitchen',
  'Washing Machine',
  'Refrigerator',
  'Pet Friendly',
  'Solar Power',
  'Geyser',
  'Cupboards',
  'Balcony',
];

export const CITIES: string[] = [
  'Chennai',
  'Coimbatore',
  'Madurai',
  'Tiruchirappalli',
  'Salem',
  'Tiruppur',
  'Erode',
  'Vellore',
  'Thanjavur',
  'Tirunelveli',
  'Dindigul',
  'Kanyakumari',
  'Karur',
  'Namakkal',
  'Dharmapuri',
  'Krishnagiri',
  'Cuddalore',
  'Villupuram',
  'Pudukkottai',
  'Hosur',
];

export const DISTRICT_AREAS: Record<string, string[]> = {
  Chennai: ['Tambaram', 'Velachery', 'Porur', 'Avadi', 'Anna Nagar', 'Sholinganallur', 'Taramani', 'Neelangarai', 'Chitlapakkam', 'Vadapalani', 'Adyar', 'Mylapore', 'T Nagar', 'Guindy', 'Perambur', 'Ambattur'],
  Coimbatore: ['Gandhipuram', 'Singanallur', 'Peelamedu', 'Saravanampatti', 'RS Puram', 'Avinashi Road', 'Race Course Road', 'Saibaba Colony', 'Vadavalli', 'Kovaipudur'],
  Madurai: ['Anna Nagar', 'KK Nagar', 'Mattuthavani', 'Teppakulam', 'South Masi Street', 'Goripalayam', 'Thallakulam', 'Bypass Road', 'Kochadai'],
  Tiruppur: ['Avarampalayam', 'Kumar Nagar', 'G.N. Mills', 'Mangalam', 'Uthukuli', 'Kunnathur Road'],
  Erode: ['PS Park', 'Perundurai Road', 'Mettur Road', 'Thindal', 'Solar', 'Chithode'],
  Salem: ['Fairlands', 'Ammapet', 'Suramangalam', 'Gugai', 'Steel Plant Road', 'Karuppur', 'Kondalampatti'],
  Tiruchirappalli: ['Cantonment', 'Srirangam', 'Thillai Nagar', 'Woraiyur', 'Rockfort', 'Kallukuzhi', 'Golden Rock'],
  Vellore: ['Katpadi', 'Sathuvachari', 'Gandhi Nagar', 'Bagayam', 'Arcot Road', 'Vellore Fort Area'],
  Thanjavur: ['Rajarajan Nagar', 'Medical College Road', 'Vadakku Veedhi', 'Pillaiyarpatti', 'Gnanam Nagar'],
  Tirunelveli: ['Palayamkottai', 'Vannarpettai', 'Thatchanallur', 'Melpuram', 'Nanguneri Road'],
  Dindigul: ['Nagar', 'Vedasandur', 'Palani Road', 'Reddiarchatram'],
  Kanyakumari: ['Nagercoil', 'Marthandam', 'Kuzhithurai', 'Colachel'],
  Karur: ['Vangal', 'Thanthoni', 'Kulithalai Road'],
  Namakkal: ['Mohanur Road', 'Tiruchengode', 'Paramathi'],
  Dharmapuri: ['Pennagaram', 'Hogenakkal Road', 'Harur'],
  Krishnagiri: ['Hosur', 'Rayakottai', 'Bargur'],
  Cuddalore: ['Devanampattinam', 'Tirupathiripuliyur', 'Silver Beach Road'],
  Villupuram: ['Villupuram Town', 'Tindivanam', 'Gingee'],
  Pudukkottai: ['Tirugokarnam', 'Pudukkottai Town', 'Aranthangi'],
  Hosur: ['Bagalur Road', 'Sipcot', 'Mathigiri', 'Anekal Road'],
};

export function areasForCity(city: string): string[] {
  return DISTRICT_AREAS[city] ?? [];
}

export const CONTACT = {
  email: 'sanjayv152006@gmail.com',
  phone: '7094362852',
  address: 'Tamil Nadu, India',
};
