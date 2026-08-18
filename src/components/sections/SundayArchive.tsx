import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { SundayArchiveGallery, SundayArchiveItem, SundayArchivePhoto } from "../../content/sundayArchive";
import { Reveal } from "../ui/Reveal";

type SundayArchiveProps = {
  sundays: SundayArchiveItem[];
};

const INITIAL_VISIBLE_SUNDAYS = 12;

const formatPhotoCount = (count: number) => {
  if (count === 1) return "1 fotografia";
  if (count > 1 && count < 5) return `${count} fotografie`;
  return `${count} fotografií`;
};

export function SundayArchive({ sundays }: SundayArchiveProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_SUNDAYS);
  const [activeSundayIndex, setActiveSundayIndex] = useState<number | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [loadedGalleries, setLoadedGalleries] = useState<Record<string, SundayArchiveGallery>>({});
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLElement | null>(null);

  const visibleSundays = useMemo(() => sundays.slice(0, visibleCount), [sundays, visibleCount]);
  const activeSunday = activeSundayIndex === null ? null : visibleSundays[activeSundayIndex];
  const activeGallery = activeSunday ? loadedGalleries[activeSunday.date] ?? null : null;
  const activePhoto = activeGallery && activePhotoIndex !== null ? activeGallery.photos[activePhotoIndex] : null;

  const openSunday = async (index: number) => {
    const sunday = visibleSundays[index];
    setActiveSundayIndex(index);
    setActivePhotoIndex(null);
    setLoadingError(null);

    if (loadedGalleries[sunday.date]) return;

    try {
      const response = await fetch(sunday.manifest);
      if (!response.ok) throw new Error(`Nepodarilo sa načítať manifest (${response.status}).`);
      const gallery = (await response.json()) as SundayArchiveGallery;
      setLoadedGalleries((current) => ({ ...current, [sunday.date]: gallery }));
    } catch (error) {
      setLoadingError(error instanceof Error ? error.message : "Nepodarilo sa načítať galériu.");
    }
  };

  const closeGallery = () => {
    setActiveSundayIndex(null);
    setActivePhotoIndex(null);
    setLoadingError(null);
  };

  const showPrevious = () => {
    if (!activeGallery) return;
    setActivePhotoIndex((index) => (index === null ? 0 : (index - 1 + activeGallery.photos.length) % activeGallery.photos.length));
  };

  const showNext = () => {
    if (!activeGallery) return;
    setActivePhotoIndex((index) => (index === null ? 0 : (index + 1) % activeGallery.photos.length));
  };

  useEffect(() => {
    if (!activeSunday) return undefined;

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (activePhotoIndex !== null) {
          setActivePhotoIndex(null);
        } else {
          closeGallery();
        }
      }

      if (activePhotoIndex !== null && event.key === "ArrowLeft") showPrevious();
      if (activePhotoIndex !== null && event.key === "ArrowRight") showNext();
    };

    document.body.classList.add("gallery-browser-open");
    document.addEventListener("keydown", onKeyDown);
    window.requestAnimationFrame(() => dialogRef.current?.focus());

    return () => {
      document.body.classList.remove("gallery-browser-open");
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [activeSunday, activePhotoIndex, activeGallery]);

  if (!sundays.length) {
    return (
      <Reveal className="sunday-archive-empty">
        <CalendarDays aria-hidden="true" />
        <p>Nedeľný fotoarchív je pripravený. Prvé nedeľné galérie sa zobrazia po nahratí fotiek do Cloudflare R2.</p>
      </Reveal>
    );
  }

  return (
    <>
      <div className="sunday-archive-grid">
        {visibleSundays.map((sunday, index) => (
          <Reveal as="article" className="sunday-archive-card" key={sunday.date}>
            <button type="button" onClick={() => openSunday(index)} aria-label={`Otvoriť galériu ${sunday.title}, ${formatPhotoCount(sunday.photoCount)}`}>
              <img src={sunday.cover} alt="" aria-hidden="true" loading="lazy" />
              <span className="sunday-archive-card__shade" aria-hidden="true" />
              <span className="sunday-archive-card__content">
                <span>
                  <CalendarDays aria-hidden="true" />
                  {sunday.title}
                </span>
                <strong>{formatPhotoCount(sunday.photoCount)}</strong>
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {visibleCount < sundays.length ? (
        <div className="sunday-archive-actions">
          <button className="button button--secondary" type="button" onClick={() => setVisibleCount((count) => Math.min(count + INITIAL_VISIBLE_SUNDAYS, sundays.length))}>
            Zobraziť staršie
          </button>
        </div>
      ) : null}

      {activeSunday ? (
        <div className="gallery-browser" role="presentation">
          <button className="gallery-browser__backdrop" type="button" aria-label="Zatvoriť nedeľnú galériu" onClick={closeGallery} />
          <section
            className={`gallery-browser__panel${activePhoto ? " gallery-browser__panel--photo" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="sunday-browser-title"
            ref={dialogRef}
            tabIndex={-1}
          >
            <header className="gallery-browser__header">
              <div>
                <span>Nedele v GMC Sereď</span>
                <h3 id="sunday-browser-title">{activeSunday.title}</h3>
                <p>{formatPhotoCount(activeSunday.photoCount)}</p>
              </div>
              <button className="gallery-browser__close" type="button" aria-label="Zatvoriť galériu" onClick={closeGallery}>
                <X aria-hidden="true" />
              </button>
            </header>

            {loadingError ? (
              <div className="sunday-archive-error" role="alert">
                {loadingError}
              </div>
            ) : !activeGallery ? (
              <div className="sunday-archive-loading">Načítavam fotky…</div>
            ) : activePhoto && activePhotoIndex !== null ? (
              <SundayPhotoView
                photo={activePhoto}
                index={activePhotoIndex}
                total={activeGallery.photos.length}
                onBack={() => setActivePhotoIndex(null)}
                onPrevious={showPrevious}
                onNext={showNext}
              />
            ) : (
              <div className="gallery-browser__grid">
                {activeGallery.photos.map((image, index) => (
                  <button type="button" key={image.thumbnail} onClick={() => setActivePhotoIndex(index)} aria-label={`Zväčšiť fotografiu ${index + 1}`}>
                    <span className="gallery-browser__thumbnail">
                      <img src={image.thumbnail} alt={image.alt ?? `Fotografia ${index + 1} z ${activeGallery.title}`} loading="lazy" />
                    </span>
                    <span>{index + 1}</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      ) : null}
    </>
  );
}

type SundayPhotoViewProps = {
  photo: SundayArchivePhoto;
  index: number;
  total: number;
  onBack: () => void;
  onPrevious: () => void;
  onNext: () => void;
};

function SundayPhotoView({ photo, index, total, onBack, onPrevious, onNext }: SundayPhotoViewProps) {
  return (
    <div className="gallery-browser__photo-view">
      <button className="gallery-browser__back" type="button" onClick={onBack}>
        <ArrowLeft aria-hidden="true" />
        Späť do galérie
      </button>
      <div className="gallery-browser__stage">
        <button className="gallery-browser__nav gallery-browser__nav--previous" type="button" aria-label="Predchádzajúca fotografia" onClick={onPrevious}>
          <ChevronLeft aria-hidden="true" />
        </button>
        <img src={photo.full} alt={photo.alt ?? `Fotografia ${index + 1}`} />
        <button className="gallery-browser__nav gallery-browser__nav--next" type="button" aria-label="Nasledujúca fotografia" onClick={onNext}>
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
      <div className="gallery-browser__photo-caption" aria-live="polite">
        <strong>Nedeľa v GMC Sereď</strong>
        <span>
          {index + 1} / {total}
        </span>
      </div>
    </div>
  );
}
