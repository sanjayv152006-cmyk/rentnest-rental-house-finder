import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

export default function ImageGallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const next = useCallback(() => setActive((i) => (i + 1) % images.length), [images.length]);
  const prev = useCallback(() => setActive((i) => (i - 1 + images.length) % images.length), [images.length]);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, next, prev]);

  return (
    <>
      <div className="grid grid-cols-4 gap-3">
        <div className="col-span-4 overflow-hidden rounded-2xl lg:col-span-3">
          <button onClick={() => setLightbox(true)} className="group relative block aspect-[16/10] w-full overflow-hidden">
            <img src={images[active]} alt={alt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <span className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
          </button>
        </div>
        <div className="col-span-4 grid grid-cols-4 gap-3 lg:col-span-1 lg:grid-cols-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative aspect-[4/3] overflow-hidden rounded-xl transition ${
                i === active ? 'ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-slate-900' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`${alt} ${i + 1}`} className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 animate-fade-in" onClick={() => setLightbox(false)}>
          <button className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" onClick={() => setLightbox(false)}>
            <X className="h-5 w-5" />
          </button>
          <button className="absolute left-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); prev(); }}>
            <ChevronLeft className="h-6 w-6" />
          </button>
          <img src={images[active]} alt={alt} className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain animate-scale-in" onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-4 bottom-1/2 grid h-11 w-11 translate-y-1/2 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20" onClick={(e) => { e.stopPropagation(); next(); }}>
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
}
