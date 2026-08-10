import { useState } from 'react';
import {
  Moon,
  Sun,
  Bell,
  Globe,
  MapPin,
  Lock,
  LogOut,
  Trash2,
  User as UserIcon,
  Check,
  AlertTriangle,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useRouter } from '@/context/RouterContext';
import { useApp } from '@/context/AppContext';
import { useTheme } from '@/context/ThemeContext';
import { CITIES } from '@/types';

type Lang = 'en' | 'ta';

interface NotifSettings {
  newListings: boolean;
  priceDrops: boolean;
  messages: boolean;
}

function useSetting<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  const update = (v: T) => {
    setValue(v);
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      /* ignore */
    }
  };
  return [value, update] as const;
}

export default function SettingsPage() {
  const { navigate } = useRouter();
  const { user, logout, signup } = useApp();
  const { theme, toggle } = useTheme();

  const [lang, setLang] = useSetting<Lang>('rentnest-lang', 'en');
  const [preferredCity, setPreferredCity] = useSetting<string>('rentnest-pref-city', 'All');
  const [notifs, setNotifs] = useSetting<NotifSettings>('rentnest-notifs', {
    newListings: true,
    priceDrops: true,
    messages: true,
  });

  const [editName, setEditName] = useState(user?.name ?? '');
  const [editEmail, setEditEmail] = useState(user?.email ?? '');
  const [profileSaved, setProfileSaved] = useState(false);

  const [curPass, setCurPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passMsg, setPassMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  if (!user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
        <UserIcon className="h-12 w-12 text-slate-300" />
        <h1 className="font-display text-2xl font-bold text-slate-900 dark:text-white">Please sign in</h1>
        <p className="text-slate-500 dark:text-slate-400">Sign in to manage your account settings.</p>
        <button onClick={() => navigate({ name: 'auth' })} className="btn-primary">Sign In</button>
      </div>
    );
  }

  const saveProfile = () => {
    const name = editName.trim() || user.name;
    const email = editEmail.trim() || user.email;
    signup(name, email);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const changePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);

    const stored = localStorage.getItem('rentnest-password');
    if (stored && curPass !== stored) {
      setPassMsg({ type: 'err', text: 'Current password is incorrect.' });
      return;
    }
    if (newPass.length < 6) {
      setPassMsg({ type: 'err', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPass !== confirmPass) {
      setPassMsg({ type: 'err', text: 'New passwords do not match.' });
      return;
    }
    localStorage.setItem('rentnest-password', newPass);
    setCurPass('');
    setNewPass('');
    setConfirmPass('');
    setPassMsg({ type: 'ok', text: 'Password updated successfully.' });
  };

  const deleteAccount = () => {
    const keys = [
      'rentnest-user',
      'rentnest-favorites',
      'rentnest-posted',
      'rentnest-requests',
      'rentnest-password',
      'rentnest-lang',
      'rentnest-pref-city',
      'rentnest-notifs',
    ];
    keys.forEach((k) => localStorage.removeItem(k));
    logout();
    navigate({ name: 'home' });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-extrabold text-slate-900 dark:text-white">Settings</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Manage your account, appearance, and preferences.
      </p>

      {/* Appearance */}
      <Section icon={theme === 'dark' ? Moon : Sun} title="Appearance" desc="Choose how RentNest looks to you.">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Theme</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Switch between light and dark mode.
            </p>
          </div>
          <button
            onClick={toggle}
            className={`relative h-10 w-20 rounded-full transition-colors ${
              theme === 'dark' ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'
            }`}
            aria-label="Toggle theme"
          >
            <span
              className={`absolute top-1 grid h-8 w-8 place-items-center rounded-full bg-white text-slate-700 shadow transition-all ${
                theme === 'dark' ? 'left-11 text-brand-600' : 'left-1'
              }`}
            >
              {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </span>
          </button>
        </div>

        <Divider />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Language</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Select your display language.</p>
          </div>
          <div className="flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
            {(['en', 'ta'] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${
                  lang === l
                    ? 'bg-white text-brand-700 shadow-sm dark:bg-slate-900 dark:text-brand-300'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {l === 'en' ? 'English' : 'தமிழ்'}
              </button>
            ))}
          </div>
        </div>
      </Section>

      {/* Edit Profile */}
      <Section icon={UserIcon} title="Edit Profile" desc="Update your personal information.">
        <div className="space-y-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} placeholder="you@email.com" />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={saveProfile} className="btn-primary">Save Changes</button>
            {profileSaved && (
              <span className="flex items-center gap-1 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <Check className="h-4 w-4" /> Saved
              </span>
            )}
          </div>
        </div>
      </Section>

      {/* Notifications */}
      <Section icon={Bell} title="Notifications" desc="Choose what you want to be notified about.">
        <div className="space-y-1">
          {(Object.keys(notifs) as (keyof NotifSettings)[]).map((key) => (
            <div key={key}>
              <ToggleRow
                label={key === 'newListings' ? 'New Listings' : key === 'priceDrops' ? 'Price Drops' : 'Messages'}
                desc={
                  key === 'newListings'
                    ? 'Get notified when new properties match your search.'
                    : key === 'priceDrops'
                      ? 'Alerts when a saved property drops in price.'
                      : 'Notifications for owner replies and inquiries.'
                }
                checked={notifs[key]}
                onChange={(v) => setNotifs({ ...notifs, [key]: v })}
              />
              <Divider />
            </div>
          ))}
        </div>
      </Section>

      {/* Preferred Location */}
      <Section icon={MapPin} title="Preferred Location" desc="Set your default city for browsing and search.">
        <div>
          <label className="label">Default City</label>
          <select
            className="input"
            value={preferredCity}
            onChange={(e) => setPreferredCity(e.target.value)}
          >
            <option value="All">All cities</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            We'll use this when suggesting properties near you.
          </p>
        </div>
      </Section>

      {/* Change Password */}
      <Section icon={Lock} title="Change Password" desc="Keep your account secure with a strong password.">
        <form onSubmit={changePassword} className="space-y-4">
          <div>
            <label className="label">Current Password</label>
            <div className="relative">
              <input
                className="input pr-10"
                type={showPass ? 'text' : 'password'}
                value={curPass}
                onChange={(e) => setCurPass(e.target.value)}
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="label">New Password</label>
            <input
              className="input"
              type={showPass ? 'text' : 'password'}
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>
          <div>
            <label className="label">Confirm New Password</label>
            <input
              className="input"
              type={showPass ? 'text' : 'password'}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              placeholder="Re-enter new password"
            />
          </div>
          {passMsg && (
            <p
              className={`rounded-lg px-3 py-2 text-sm ${
                passMsg.type === 'ok'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
              }`}
            >
              {passMsg.text}
            </p>
          )}
          <button type="submit" className="btn-primary">Update Password</button>
        </form>
      </Section>

      {/* Danger Zone */}
      <Section icon={AlertTriangle} title="Account Actions" desc="Log out or permanently delete your account.">
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => {
              logout();
              navigate({ name: 'home' });
            }}
            className="btn-outline !py-2.5"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
          <button
            onClick={() => setConfirmDelete(true)}
            className="btn-outline !py-2.5 border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/40"
          >
            <Trash2 className="h-4 w-4" /> Delete Account
          </button>
        </div>
      </Section>

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={() => setConfirmDelete(false)} />
          <div className="relative w-full max-w-md card p-6 animate-scale-in">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-950/40">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-slate-900 dark:text-white">
              Delete your account?
            </h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              This will permanently remove your profile, favorites, posted properties, and all settings.
              This action cannot be undone.
            </p>
            <div className="mt-4">
              <label className="label">Type <span className="font-bold text-rose-600">DELETE</span> to confirm</label>
              <input
                className="input"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
              />
            </div>
            <div className="mt-5 flex gap-3">
              <button onClick={() => { setConfirmDelete(false); setDeleteConfirmText(''); }} className="btn-ghost flex-1">
                Cancel
              </button>
              <button
                onClick={deleteAccount}
                disabled={deleteConfirmText !== 'DELETE'}
                className="btn-primary flex-1 bg-rose-600 hover:bg-rose-700 shadow-rose-600/20"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  desc,
  children,
}: {
  icon: typeof Moon;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card mt-6 p-6 animate-fade-in">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">{title}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function ToggleRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{label}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-brand-600' : 'bg-slate-200 dark:bg-slate-700'
        }`}
        aria-label={`Toggle ${label}`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-slate-100 dark:border-slate-800" />;
}
