import { useState } from 'react';
import { User as UserIcon, Heart, Home as HomeIcon, Mail, LogOut, PlusCircle, Trash2, Building2, Clock, Eye } from 'lucide-react';
import { useRouter } from '@/context/RouterContext';
import { useApp } from '@/context/AppContext';
import { properties } from '@/data/properties';
import PropertyCard from '@/components/PropertyCard';
import { formatRent, timeAgo } from '@/lib/format';

type Tab = 'profile' | 'saved' | 'posted' | 'requests';

export default function DashboardPage() {
  const { navigate } = useRouter();
  const { user, logout, favorites, postedProperties, contactRequests, deletePostedProperty } = useApp();
  const [tab, setTab] = useState<Tab>('profile');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
        <UserIcon className="h-12 w-12 text-slate-300" />
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Please sign in</h1>
        <p className="text-slate-500 dark:text-slate-400">Sign in to view your dashboard, saved homes, and listings.</p>
        <button onClick={() => navigate({ name: 'auth' })} className="btn-primary">Sign In</button>
      </div>
    );
  }

  const savedProperties = properties.filter((p) => favorites.includes(p.id));
  const allPosted = postedProperties;

  const tabs: { id: Tab; label: string; icon: typeof UserIcon; count: number }[] = [
    { id: 'profile', label: 'Profile', icon: UserIcon, count: 0 },
    { id: 'saved', label: 'Saved Properties', icon: Heart, count: savedProperties.length },
    { id: 'posted', label: 'Posted Properties', icon: Building2, count: allPosted.length },
    { id: 'requests', label: 'Contact Requests', icon: Mail, count: contactRequests.length },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}&backgroundColor=14bf80&textColor=ffffff`}
            alt={user.name}
            className="h-14 w-14 rounded-full bg-brand-100"
          />
          <div>
            <h1 className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">Hi, {user.name}</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
          </div>
        </div>
        <button onClick={() => { logout(); navigate({ name: 'home' }); }} className="btn-outline !py-2.5">
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-8 flex gap-2 overflow-x-auto no-scrollbar">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
              tab === t.id
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
            {t.count > 0 && (
              <span className={`rounded-full px-1.5 text-xs ${tab === t.id ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'profile' && (
          <div className="card max-w-2xl p-6 animate-fade-in">
            <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">Account Details</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="label">Name</label>
                <input className="input" value={user.name} readOnly />
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" value={user.email} readOnly />
              </div>
              <div className="grid grid-cols-3 gap-3 pt-2">
                <Stat label="Saved" value={savedProperties.length} icon={Heart} />
                <Stat label="Posted" value={allPosted.length} icon={Building2} />
                <Stat label="Inquiries" value={contactRequests.length} icon={Mail} />
              </div>
            </div>
          </div>
        )}

        {tab === 'saved' && (
          <div className="animate-fade-in">
            {savedProperties.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {savedProperties.map((p) => <PropertyCard key={p.id} property={p} />)}
              </div>
            ) : (
              <EmptyState icon={Heart} title="No saved properties yet" text="Tap the heart on any home to save it here for easy comparison." action={{ label: 'Browse homes', onClick: () => navigate({ name: 'browse' }) }} />
            )}
          </div>
        )}

        {tab === 'posted' && (
          <div className="animate-fade-in">
            <div className="mb-4 flex justify-end">
              <button onClick={() => navigate({ name: 'post' })} className="btn-primary"><PlusCircle className="h-4 w-4" /> Post New</button>
            </div>
            {allPosted.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {allPosted.map((p) => (
                  <div key={p.id} className="relative group">
                    <PropertyCard property={p} />
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => navigate({ name: 'details', id: p.id })} className="btn-outline !py-2 flex-1">
                        <Eye className="h-4 w-4" /> View
                      </button>
                      <button
                        onClick={() => setConfirmDelete(p.id)}
                        className="btn-outline !py-2 !px-3 border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={Building2} title="You haven't posted any properties" text="List your first rental and start receiving inquiries." action={{ label: 'Post a Rental', onClick: () => navigate({ name: 'post' }) }} />
            )}
          </div>
        )}

        {tab === 'requests' && (
          <div className="animate-fade-in">
            {contactRequests.length > 0 ? (
              <div className="space-y-3">
                {contactRequests.map((r) => (
                  <div key={r.id} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60"><Mail className="h-5 w-5" /></span>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{r.propertyTitle}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">To: {r.ownerName}</p>
                        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">"{r.message}"</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 sm:flex-col sm:items-end">
                      <Clock className="h-3.5 w-3.5" /> {timeAgo(r.sentAt)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={Mail} title="No contact requests yet" text="When you message an owner about a property, it'll appear here." action={{ label: 'Browse homes', onClick: () => navigate({ name: 'browse' }) }} />
            )}
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={() => setConfirmDelete(null)} />
          <div className="relative w-full max-w-sm card p-6 animate-scale-in">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/40">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-slate-900 dark:text-white">Delete this property?</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">This action cannot be undone. The listing will be permanently removed from RentNest.</p>
            <div className="mt-5 flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="btn-ghost flex-1">Cancel</button>
              <button
                onClick={() => {
                  deletePostedProperty(confirmDelete);
                  setConfirmDelete(null);
                }}
                className="btn-primary flex-1 bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, icon: Icon }: { label: string; value: number; icon: typeof UserIcon }) {
  return (
    <div className="rounded-xl bg-slate-50 p-3 text-center dark:bg-slate-800/60">
      <Icon className="mx-auto h-4 w-4 text-brand-600" />
      <div className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-white">{value}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  );
}

function EmptyState({
  icon: Icon, title, text, action,
}: { icon: typeof UserIcon; title: string; text: string; action: { label: string; onClick: () => void } }) {
  return (
    <div className="card flex flex-col items-center gap-3 py-16 text-center">
      <Icon className="h-12 w-12 text-slate-300 dark:text-slate-700" />
      <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">{text}</p>
      <button onClick={action.onClick} className="btn-primary mt-2">{action.label}</button>
    </div>
  );
}
