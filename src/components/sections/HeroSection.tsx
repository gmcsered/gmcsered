import { ArrowRight, CalendarHeart, Check, Clock, MapPin, Play } from "lucide-react";
import { churchContent } from "../../content/churchContent";
import { CrossMotif, LightRays } from "../decor/ChristianMotifs";
import { getSundayServiceMessage } from "../../utils/sundayMessage";

export function HeroSection() {
  const { hero, service, address, visualFeatures } = churchContent;
  const sundayMessage = visualFeatures.contextualSundayMessage ? getSundayServiceMessage() : service.welcome;

  return (
    <section className="hero" id="domov" aria-labelledby="hero-title">
      <picture>
        {hero.image.sources.map((source) => (
          <source
            key={source.src}
            srcSet={source.src}
            media={source.media}
            width={source.width}
            height={source.height}
          />
        ))}
        <img
          className="hero__image"
          src={hero.image.src}
          width={hero.image.width}
          height={hero.image.height}
          alt={hero.image.alt}
          decoding="async"
        />
      </picture>
      <div className="hero__overlay" />
      <LightRays className="hero__rays" />
      <CrossMotif className="hero__cross" />
      <div className="container hero__content">
        <div className="hero__text">
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1 id="hero-title">{hero.headline}</h1>
          {hero.text.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="hero__actions">
            <a className="button button--primary" href="#navsteva">
              {hero.primaryAction}
              <ArrowRight aria-hidden="true" />
            </a>
            <a className="button button--secondary" href="#kazne">
              <Play aria-hidden="true" />
              {hero.secondaryAction}
            </a>
          </div>
          <ul className="hero__trust" aria-label="Základné informácie">
            {service.orientation.map((item) => (
              <li key={item}>
                <Check aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <aside className="hero-card" aria-label="Praktické informácie o bohoslužbe">
          <p className="hero-card__status">
            <CalendarHeart aria-hidden="true" />
            {sundayMessage}
          </p>
          <h2>{service.title}</h2>
          <p className="hero-card__time">
            <Clock aria-hidden="true" />
            {service.day} o {service.time}
          </p>
          <p>
            <MapPin aria-hidden="true" />
            {address.formatted}
          </p>
          <p className="hero-card__welcome">{service.welcome}</p>
          <p className="hero-card__children">{service.childrenYouthProgram}</p>
        </aside>
      </div>
    </section>
  );
}
