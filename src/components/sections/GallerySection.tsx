import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { churchContent } from "../../content/churchContent";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

export function GallerySection() {
  const { churchLife, visualFeatures } = churchContent;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeImage = activeIndex === null ? null : churchLife.gallery[activeIndex];

  const close = () => setActiveIndex(null);
  const showPrevious = () =>
    setActiveIndex((index) => (index === null ? index : (index - 1 + churchLife.gallery.length) % churchLife.gallery.length));
  const showNext = () =>
    setActiveIndex((index) => (index === null ? index : (index + 1) % churchLife.gallery.length));

  useEffect(() => {
    if (activeIndex === null) {
      return undefined;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
      }
      if (event.key === "ArrowLeft") {
        showPrevious();
      }
      if (event.key === "ArrowRight") {
        showNext();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("lightbox-open");
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("lightbox-open");
    };
  }, [activeIndex]);

  return (
    <section className="section gallery-section" id="zivot-zboru">
      <div className="container">
        <Reveal>
          <SectionHeading title={churchLife.heading} text={churchLife.text} align="center" />
        </Reveal>
        <div className="gallery-grid">
          {churchLife.gallery.map((image, index) => (
            <Reveal
              as="article"
              className="gallery-item"
              key={image.src}
            >
              <img
                src={image.src}
                width={image.width}
                height={image.height}
                alt={image.alt}
                loading="lazy"
              />
              <div className="gallery-item__caption">
                <span>{image.category}</span>
                {image.caption}
              </div>
              {visualFeatures.galleryLightbox ? (
                <button
                  className="gallery-item__button"
                  type="button"
                  aria-label={`Otvoriť fotografiu: ${image.caption ?? image.category}`}
                  onClick={() => setActiveIndex(index)}
                />
              ) : null}
            </Reveal>
          ))}
        </div>
      </div>
      {activeImage ? (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Zväčšená fotografia">
          <button className="lightbox__backdrop" type="button" aria-label="Zatvoriť fotografiu" onClick={close} />
          <div className="lightbox__panel">
            <button className="lightbox__close" type="button" aria-label="Zatvoriť fotografiu" onClick={close}>
              <X aria-hidden="true" />
            </button>
            <button className="lightbox__nav lightbox__nav--prev" type="button" aria-label="Predchádzajúca fotografia" onClick={showPrevious}>
              <ChevronLeft aria-hidden="true" />
            </button>
            <img
              src={activeImage.src}
              width={activeImage.width}
              height={activeImage.height}
              alt={activeImage.alt}
            />
            <button className="lightbox__nav lightbox__nav--next" type="button" aria-label="Nasledujúca fotografia" onClick={showNext}>
              <ChevronRight aria-hidden="true" />
            </button>
            <div className="lightbox__caption">
              <p>{activeImage.caption ?? activeImage.category}</p>
              <span>
                {(activeIndex ?? 0) + 1} / {churchLife.gallery.length}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
