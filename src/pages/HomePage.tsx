import { ShieldCheck, Search, BadgeDollarSign, Headset, ArrowRight, Quote, Star, MapPin, PlusCircle, Heart, LayoutDashboard } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import { useRouter } from '@/context/RouterContext';
import { properties, popularLocations, reviews } from '@/data/properties';

export default function HomePage() {
  const { navigate } = useRouter();
  const featured = properties.filter((p) => p.featured).slice(0, 8);

  const features = [
    { icon: Search, title: 'Smart Search', text: 'Filter by location, budget, type, and amenities to find homes that truly match your needs.' },
    { icon: ShieldCheck, title: 'Verified Listings', text: 'Every property is reviewed and every owner identity-checked so you rent with confidence.' },
    { icon: BadgeDollarSign, title: 'No Hidden Fees', text: 'Transparent monthly rents with no surprise charges. What you see is what you pay.' },
    { icon: Headset, title: '24/7 Support', text: 'Our team is here around the clock to help with anything from tours to lease questions.' },
  ];

  const stats = [
    { value: '12K+', label: 'Active Listings' },
    { value: '38K+', label: 'Happy Renters' },
    { value: '24', label: 'Cities Covered' },
    { value: '4.9', label: 'Average Rating' },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 via-white to-white dark:from-brand-950/30 dark:via-slate-950 dark:to-slate-950" />
        <div className="absolute -right-24 -top-24 -z-10 h-96 w-96 rounded-full bg-brand-200/40 blur-3xl dark:bg-brand-900/20" />
        <div className="absolute -left-24 top-40 -z-10 h-72 w-72 rounded-full bg-sand-200/40 blur-3xl dark:bg-sand-900/10" />

        <div className="mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8 lg:pt-24">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="animate-fade-up">
              <span className="badge bg-brand-100 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                <Star className="h-3 w-3 fill-current" /> Trusted by 38,000+ renters
              </span>
              <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                Find Your Perfect <span className="text-brand-600">Rental Home</span>
              </h1>
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                Find comfortable and affordable rental homes across Tamil Nadu. Search by location, budget, and amenities — from Chennai to Kanyakumari.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button onClick={() => navigate({ name: 'browse' })} className="btn-primary">
                  Browse Houses <ArrowRight className="h-4 w-4" />
                </button>
                <button onClick={() => navigate({ name: 'post' })} className="btn-outline">
                  <PlusCircle className="h-4 w-4" /> Post a Rental
                </button>
              </div>
              <div className="mt-10 grid grid-cols-4 gap-4">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">{s.value}</div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-fade-up [animation-delay:120ms]">
              <div className="relative grid grid-cols-2 gap-4">
                <img src={properties[17].images[0]} alt="Featured home" className="mt-8 aspect-[3/4] w-full rounded-2xl object-cover shadow-xl" />
                <img src={properties[2].images[0]} alt="Featured home" className="aspect-[3/4] w-full rounded-2xl object-cover shadow-xl" />
                <img src={properties[12].images[0]} alt="Featured home" className="-mt-8 aspect-[3/4] w-full rounded-2xl object-cover shadow-xl" />
                <img src={properties[1].images[0]} alt="Featured home" className="mt-4 aspect-[3/4] w-full rounded-2xl object-cover shadow-xl" />
              </div>
            </div>
          </div>

          <div className="mt-10 animate-fade-up [animation-delay:240ms]">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Popular locations */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Popular Tamil Nadu Locations</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Explore rentals in the most searched cities.</p>
          </div>
          <button onClick={() => navigate({ name: 'browse' })} className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 sm:flex">
            View all <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {popularLocations.map((loc) => (
            <button
              key={loc.city}
              onClick={() => navigate({ name: 'browse', query: { city: loc.city } })}
              className="group relative aspect-[3/4] overflow-hidden rounded-2xl text-left"
            >
              <img src={loc.image} alt={loc.city} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-3">
                <p className="flex items-center gap-1 text-sm font-bold text-white"><MapPin className="h-3.5 w-3.5" /> {loc.city}</p>
                <p className="mt-0.5 text-xs text-slate-200">{loc.count} {loc.count === 1 ? 'listing' : 'listings'}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Featured Rental Properties</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">Hand-picked homes across Tamil Nadu our renters love.</p>
          </div>
          <button onClick={() => navigate({ name: 'browse' })} className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 sm:flex">
            See all <ArrowRight className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => <PropertyCard key={p.id} property={p} />)}
        </div>
      </section>

      {/* Why choose */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-brand-950 p-8 text-white sm:p-12 dark:from-slate-900 dark:to-slate-900">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Why Choose RentNest</h2>
            <p className="mx-auto mt-2 max-w-xl text-slate-300">We make renting simpler, safer, and faster — for renters and owners alike.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl bg-white/5 p-6 backdrop-blur ring-1 ring-white/10 transition hover:bg-white/10">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-500 text-white">
                  <f.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">What Our Renters Say</h2>
          <p className="mx-auto mt-2 max-w-xl text-slate-500 dark:text-slate-400">Real stories from people who found their home with RentNest.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((r) => (
            <div key={r.name} className="card relative p-6">
              <Quote className="absolute right-4 top-4 h-8 w-8 text-brand-100 dark:text-brand-950/60" />
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                ))}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">"{r.text}"</p>
              <div className="mt-5 flex items-center gap-3 border-t border-slate-100 pt-4 dark:border-slate-800">
                <img src={r.avatar} alt={r.name} className="h-10 w-10 rounded-full bg-brand-100" />
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{r.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{r.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-slate-200 bg-white p-8 text-center sm:p-12 dark:border-slate-800 dark:bg-slate-900 md:flex-row md:text-left">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">Have a property to rent out?</h2>
            <p className="mt-2 max-w-xl text-slate-500 dark:text-slate-400">List it free on RentNest and reach thousands of qualified renters across Tamil Nadu in minutes.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate({ name: 'post' })} className="btn-primary"><PlusCircle className="h-4 w-4" /> Post a Rental</button>
            <button onClick={() => navigate({ name: 'dashboard' })} className="btn-outline"><LayoutDashboard className="h-4 w-4" /> Dashboard</button>
            <button onClick={() => navigate({ name: 'favorites' })} className="btn-outline"><Heart className="h-4 w-4" /> Favorites</button>
          </div>
        </div>
      </section>
    </div>
  );
}
