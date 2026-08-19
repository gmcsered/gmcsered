import { useRef, useState } from "react";
import { ArrowRight, Check, Clock, MapPin, Play } from "lucide-react";
import { churchContent } from "../content/churchContent";
import { PageHero } from "../components/ui/PageHero";
import { Reveal } from "../components/ui/Reveal";

export function HomePage() {
  const { pages, service, address } = churchContent;
  const home = pages.home;
  const promoVideo = home.invitation.promoVideo;
  const promoVideoRef = useRef<HTMLVideoElement | null>(null);
  const [promoStarted, setPromoStarted] = useState(false);
  const [promoControls, setPromoControls] = useState(false);

  const handlePromoPlay = async () => {
    const video = promoVideoRef.current;

    if (!video) {
      return;
    }

    try {
      await video.play();
      setPromoStarted(true);
      setPromoControls(true);
    } catch {
      setPromoControls(true);
      video.controls = true;
    }
  };

  return (
    <article className="route-page home-route">
      <PageHero
        eyebrow={home.hero.eyebrow}
        heading={home.hero.heading}
        text={home.hero.text}
        image={home.hero.image}
        primaryAction={home.hero.primaryAction}
        secondaryAction={home.hero.secondaryAction}
      />

      <section className="home-invitation major-viewport-section" aria-labelledby="home-invitation-title">
        <Reveal className="container home-invitation__intro">
          <h2 id="home-invitation-title">{promoVideo?.heading}</h2>
          <p>{promoVideo?.text}</p>
        </Reveal>
        {promoVideo ? (
          <Reveal className="container home-promo-video">
            <div className="home-promo-video__copy">
              <p className="eyebrow">Pozvanie</p>
              <h3>{home.invitation.heading}</h3>
              <p>{home.invitation.text}</p>
              <ul className="home-facts home-facts--panel" aria-label="Základné informácie">
                <li>
                  <Clock aria-hidden="true" />
                  <span>{service.day} o {service.time}</span>
                </li>
                <li>
                  <MapPin aria-hidden="true" />
                  <span>{address.formatted}</span>
                </li>
                {home.invitation.facts.slice(2).map((fact) => (
                  <li key={fact}>
                    <Check aria-hidden="true" />
                    <span>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="home-promo-video__media">
              <div className="home-promo-video__frame">
                <video
                  ref={promoVideoRef}
                  controls={promoControls}
                  playsInline
                  preload="metadata"
                  poster={promoVideo.poster.src}
                  aria-label={promoVideo.label}
                  onPlay={() => {
                    setPromoStarted(true);
                    setPromoControls(true);
                  }}
                >
                  <source src={promoVideo.src} type="video/mp4" />
                  Váš prehliadač nedokáže prehrať toto video.
                </video>
                {!promoStarted ? (
                  <button className="home-promo-video__play" type="button" onClick={handlePromoPlay} aria-label="Prehrať promo video">
                    <Play aria-hidden="true" />
                    <span>Prehrať video</span>
                  </button>
                ) : null}
              </div>
            </div>
          </Reveal>
        ) : null}
      </section>

      <section className="section chapter-hub major-viewport-section" aria-labelledby="chapter-hub-title">
        <div className="container">
          <Reveal className="section-heading">
            <p className="eyebrow">Vyberte si cestu</p>
            <h2 id="chapter-hub-title">Čo chcete spoznať ako prvé?</h2>
          </Reveal>

          <div className="chapter-grid">
            {home.chapters.map((chapter) => (
              <Reveal as="article" className="chapter-card" key={chapter.href}>
                <a href={chapter.href} data-route={chapter.route ? "true" : undefined}>
                  <img
                    src={chapter.image.src}
                    width={chapter.image.width}
                    height={chapter.image.height}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                  />
                  <span className="chapter-card__shade" aria-hidden="true" />
                  <span className="chapter-card__content">
                    <strong>{chapter.title}</strong>
                    <span>{chapter.text}</span>
                  </span>
                  <span className="chapter-card__arrow">
                    <ArrowRight aria-hidden="true" />
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="home-final major-viewport-section" aria-labelledby="home-final-title">
        <div className="container home-final__layout">
          <Reveal className="home-final__content">
            <p className="eyebrow">Nedeľa o 9:30</p>
            <h2 id="home-final-title">{home.finalCta.heading}</h2>
            <p>{home.finalCta.text}</p>
            <a className="button button--primary" href={home.finalCta.action.href} data-route={home.finalCta.action.route ? "true" : undefined}>
              {home.finalCta.action.label}
              <ArrowRight aria-hidden="true" />
            </a>
          </Reveal>

          <Reveal as="aside" className="home-final__leadership" aria-label="Vedenie zboru">
            {home.finalCta.leadership.map((person, index) => (
              <p className={index === 0 ? "home-final__leader home-final__leader--inline" : "home-final__leader"} key={person.label}>
                <span>{person.label}:</span> <strong>{person.name}</strong>
              </p>
            ))}
          </Reveal>
        </div>
      </section>
    </article>
  );
}
