import { ArrowLeft, ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ChurchLifeGalleryCategory } from "../../content/churchLifeGalleries";
import { Reveal } from "../ui/Reveal";

type ChurchLifeGalleriesProps = {
  galleries: ChurchLifeGalleryCategory[];
};

const formatPhotoCount = (count: number) => {
  if (count === 1) return "1 fotografia";
  if (count > 1 && count < 5) return `${count} fotografie`;
  return `${count} fotografií`;
};

export function ChurchLifeGalleries({ galleries }: ChurchLifeGalleriesProps) {
  const [activeGalleryIndex, setActiveGalleryIndex] = useState<number | null>(null);
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLElement | null>(null);
  const activeGallery = activeGalleryIndex === null ? null : galleries[activeGalleryIndex];
  const activePhoto = activeGallery && activePhotoIndex !== null ? activeGallery.photos[activePhotoIndex] : null;

  const openGallery = (index: number) => {
    setActiveGalleryIndex(index);
    setActivePhotoIndex(null);
  };

  const closeGallery = () => {
    setActiveGalleryIndex(null);
    setActivePhotoIndex(null);
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
    if (!activeGallery) return undefined;

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
  }, [activeGallery, activePhotoIndex]);

  return (
    <>
      <div className="curated-gallery">
        {galleries.map((gallery, index) => (
          <Reveal as="article" className="curated-gallery__item" key={gallery.id}>
            <button
              className="curated-gallery__trigger"
              type="button"
              aria-label={`Otvoriť galériu ${gallery.title}, ${formatPhotoCount(gallery.photos.length)}`}
              onClick={() => openGallery(index)}
            >
              <img
                src={gallery.cover.src}
                alt=""
                aria-hidden="true"
                loading="lazy"
              />
              <span className="curated-gallery__shade" aria-hidden="true" />
              <span className="curated-gallery__caption">
                <span>{gallery.category}</span>
                <strong>{gallery.title}</strong>
                <em>{gallery.description}</em>
                <small>
                  <Images aria-hidden="true" />
                  {formatPhotoCount(gallery.photos.length)}
                </small>
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      {activeGallery ? (
        <div className="gallery-browser" role="presentation">
          <button className="gallery-browser__backdrop" type="button" aria-label="Zatvoriť galériu" onClick={closeGallery} />
          <section
            className={`gallery-browser__panel${activePhoto ? " gallery-browser__panel--photo" : ""}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-browser-title"
            ref={dialogRef}
            tabIndex={-1}
          >
            <header className="gallery-browser__header">
              <div>
                <span>{activeGallery.category}</span>
                <h3 id="gallery-browser-title">{activeGallery.title}</h3>
                <p>{activeGallery.description}</p>
              </div>
              <button className="gallery-browser__close" type="button" aria-label="Zatvoriť galériu" onClick={closeGallery}>
                <X aria-hidden="true" />
              </button>
            </header>

            {activePhoto && activePhotoIndex !== null ? (
              <div className="gallery-browser__photo-view">
                <button className="gallery-browser__back" type="button" onClick={() => setActivePhotoIndex(null)}>
                  <ArrowLeft aria-hidden="true" />
                  Späť do galérie
                </button>
                <div className="gallery-browser__stage">
                  <button className="gallery-browser__nav gallery-browser__nav--previous" type="button" aria-label="Predchádzajúca fotografia" onClick={showPrevious}>
                    <ChevronLeft aria-hidden="true" />
                  </button>
                  <img src={activePhoto.src} alt={activePhoto.alt} />
                  <button className="gallery-browser__nav gallery-browser__nav--next" type="button" aria-label="Nasledujúca fotografia" onClick={showNext}>
                    <ChevronRight aria-hidden="true" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="gallery-browser__grid">
                {activeGallery.photos.map((image, index) => (
                  <button
                    type="button"
                    key={image.src}
                    onClick={() => setActivePhotoIndex(index)}
                    aria-label={`Zväčšiť fotografiu ${index + 1} z ${activeGallery.photos.length}`}
                  >
                    <span className="gallery-browser__thumbnail">
                      <img src={image.src} alt={image.alt} loading="lazy" />
                    </span>
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
