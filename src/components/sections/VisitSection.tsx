import { ArrowRight, CheckCircle2, MapPin, Play } from "lucide-react";
import { churchContent } from "../../content/churchContent";
import { SectionOrnament } from "../decor/ChristianMotifs";
import { Reveal } from "../ui/Reveal";

export function VisitSection() {
  const { visit, service, address, location, youtube } = churchContent;
  const practicalItems = [
    visit.practical.parking ? { label: "Parkovanie", value: visit.practical.parking } : null,
    visit.practical.entrance ? { label: "Vstup", value: visit.practical.entrance } : null,
    visit.practical.accessibility ? { label: "Bezbariérovosť", value: visit.practical.accessibility } : null,
    visit.practical.childrenProgram ? { label: "Deti a mládež", value: visit.practical.childrenProgram } : null,
    visit.practical.serviceDuration ? { label: "Trvanie", value: visit.practical.serviceDuration } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <section className="section visit-invitation" id="navsteva">
      <SectionOrnament className="section-ornament section-ornament--right" />
      <div className="container visit-invitation__layout">
        <Reveal className="visit-invitation__copy">
          <p className="eyebrow">{visit.eyebrow}</p>
          <h2>{visit.heading}</h2>
          <div className="visit-invitation__text">
            {visit.text.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ul className="visit-checklist" aria-label="Praktické informácie">
            {visit.checklist.map((item) => (
              <li key={item}>
                <CheckCircle2 aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>

          <div className="visit-invitation__address">
            <h3>{service.title}</h3>
            <p>{service.day} o {service.time}</p>
            <address>
              {address.street}
              <br />
              {address.city}
              <br />
              {address.country}
            </address>
          </div>

          <p className="location-note">{location.entranceDirections}</p>

          {practicalItems.length ? (
            <dl className="practical-list">
              {practicalItems.map((item) => (
                <div key={item.label}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <div className="inline-actions">
            <a className="button button--primary" href="/prva-navsteva" data-route>
              {visit.primaryAction}
              <ArrowRight aria-hidden="true" />
            </a>
            <a className="button button--secondary" href={location.mapUrl} target="_blank" rel="noopener noreferrer">
              <MapPin aria-hidden="true" />
              {visit.secondaryAction}
            </a>
            {youtube.enabled && youtube.channelUrl ? (
              <a className="button button--secondary" href={youtube.channelUrl} target="_blank" rel="noopener noreferrer">
                <Play aria-hidden="true" />
                {visit.sermonAction}
              </a>
            ) : null}
          </div>
        </Reveal>

        <Reveal className="visit-invitation__photos">
          <img
            className="visit-invitation__main"
            src={visit.peopleImage.src}
            width={visit.peopleImage.width}
            height={visit.peopleImage.height}
            alt={visit.peopleImage.alt}
            loading="lazy"
          />
          <img
            className="visit-invitation__location"
            src={visit.image.src}
            width={visit.image.width}
            height={visit.image.height}
            alt={visit.image.alt}
            loading="lazy"
          />
          <img
            className="visit-invitation__badge"
            src={visit.secondaryImage.src}
            width={visit.secondaryImage.width}
            height={visit.secondaryImage.height}
            alt={visit.secondaryImage.alt}
            loading="lazy"
          />
        </Reveal>
      </div>
    </section>
  );
}
