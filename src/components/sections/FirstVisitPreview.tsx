import { ArrowRight, HeartHandshake, MapPin, UsersRound } from "lucide-react";
import { churchContent } from "../../content/churchContent";
import { BibleMotif } from "../decor/ChristianMotifs";
import { Reveal } from "../ui/Reveal";

const icons = [HeartHandshake, MapPin, UsersRound];

export function FirstVisitPreview() {
  const content = churchContent.firstVisitPreview;

  return (
    <section className="section first-visit-invite" id="prva-navsteva-nahlad">
      <img
        className="first-visit-invite__background"
        src={content.backgroundImage.src}
        width={content.backgroundImage.width}
        height={content.backgroundImage.height}
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
      <div className="first-visit-invite__shade" aria-hidden="true" />
      <BibleMotif className="first-visit-invite__motif" />
      <div className="container first-visit-invite__layout">
        <Reveal className="first-visit-invite__copy">
          <p className="eyebrow">{content.eyebrow}</p>
          <h2>{content.heading}</h2>
          <p>{content.intro}</p>
          <p className="first-visit-invite__highlight">{content.highlight}</p>
          <div className="first-visit-invite__points">
            {content.items.map((item, index) => {
              const Icon = icons[index] ?? HeartHandshake;
              return (
                <article key={item.title}>
                  <span className="first-visit-invite__number">{String(index + 1).padStart(2, "0")}</span>
                  <Icon aria-hidden="true" />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
          <div className="section-action section-action--left">
            <a className="button button--primary" href="/prva-navsteva" data-route>
              Prejsť prvou návštevou
              <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </Reveal>

        <Reveal className="first-visit-invite__media">
          <div className="first-visit-invite__path" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <figure className="first-visit-invite__photo first-visit-invite__photo--kava">
            <img
              src={content.image.src}
              width={content.image.width}
              height={content.image.height}
              alt={content.image.alt}
              loading="lazy"
            />
            {content.image.caption ? <figcaption>{content.image.caption}</figcaption> : null}
          </figure>
          <figure className="first-visit-invite__photo first-visit-invite__photo--stol">
            <img
              src={content.secondaryImage.src}
              width={content.secondaryImage.width}
              height={content.secondaryImage.height}
              alt={content.secondaryImage.alt}
              loading="lazy"
            />
            {content.secondaryImage.caption ? <figcaption>{content.secondaryImage.caption}</figcaption> : null}
          </figure>
          <div className="first-visit-invite__service" aria-label="Nedeľná bohoslužba">
            <span>{content.serviceCard.label}</span>
            <strong>{content.serviceCard.time}</strong>
            <small>{content.serviceCard.place}</small>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
