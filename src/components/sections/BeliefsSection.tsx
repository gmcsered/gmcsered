import { BookOpen, Cross, HandHeart, Heart, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { churchContent } from "../../content/churchContent";
import { ExternalTextLink } from "../ui/ExternalTextLink";
import { Reveal } from "../ui/Reveal";

const icons = [Cross, Heart, BookOpen, Sparkles, HandHeart];

const reduceMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function BeliefsSection() {
  const { beliefs, visualFeatures } = churchContent;
  const background = beliefs.background;
  const [activeIndex, setActiveIndex] = useState(0);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (!visualFeatures.beliefCrossScroll || reduceMotion()) {
      return undefined;
    }

    const nodes = itemRefs.current.filter(Boolean) as HTMLElement[];
    if (!nodes.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          const index = Number((visible.target as HTMLElement).dataset.index ?? 0);
          setActiveIndex(index);
        }
      },
      { rootMargin: "-28% 0px -34% 0px", threshold: [0.24, 0.42, 0.62] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [visualFeatures.beliefCrossScroll]);

  return (
    <section className="belief-cross-section" id="comu-verime" aria-labelledby="belief-title">
      <picture className="belief-cross-section__picture" aria-hidden="true">
        {background.sources.map((source) => (
          <source key={source.src} srcSet={source.src} media={source.media} width={source.width} height={source.height} />
        ))}
        <img
          src={background.src}
          width={background.width}
          height={background.height}
          alt=""
          loading="lazy"
        />
      </picture>
      <div className="belief-cross-section__veil" aria-hidden="true" />
      <div className="belief-cross-section__glow-line" aria-hidden="true" />
      <div className="container belief-cross-section__layout">
        <div className="belief-cross-section__art" aria-hidden="true" />

        <div className="belief-cross-section__content">
          <Reveal className="belief-cross-section__intro">
            <p className="eyebrow">Čomu veríme</p>
            <h2 id="belief-title">{beliefs.heading}</h2>
            <p>{beliefs.intro}</p>
          </Reveal>

          <div className="belief-scroll" aria-label="Základy našej viery">
            {beliefs.items.map((item, index) => {
              const Icon = icons[index] ?? Cross;
              return (
                <article
                  className={`belief-scroll__item ${activeIndex === index ? "is-active" : ""}`}
                  data-index={index}
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  tabIndex={0}
                  key={item.title}
                >
                  <div className="belief-scroll__icon">
                    <Icon aria-hidden="true" />
                  </div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    <p className="belief-scroll__support">{item.support}</p>
                  </div>
                </article>
              );
            })}
          </div>

          {beliefs.link.href ? (
            <div className="section-action section-action--left">
              <ExternalTextLink href={beliefs.link.href}>{beliefs.link.label}</ExternalTextLink>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
