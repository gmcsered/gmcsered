import { ArrowRight, Check, Clock, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { churchContent } from "../content/churchContent";
import { NextPageLink } from "../components/ui/NextPageLink";
import { PageHero } from "../components/ui/PageHero";
import { Reveal } from "../components/ui/Reveal";

export function FirstVisitPage() {
  const { pages, service, address, location, contact, facebook } = churchContent;
  const page = pages.firstVisit;
  const mapEmbedUrl = `https://www.google.com/maps?q=${location.coordinates.latitude},${location.coordinates.longitude}&z=17&hl=sk&output=embed`;

  return (
    <article className="route-page first-visit-route first-visit-compact">
      <PageHero
        eyebrow={page.eyebrow}
        heading={page.heading}
        text={page.intro}
        image={page.image}
        primaryAction={page.cta}
        secondaryAction={page.routeAction}
      />

      <section className="section page-chapter first-visit-steps major-viewport-section" aria-labelledby="first-visit-steps-title">
        <div className="container first-visit-steps__layout">
          <Reveal className="first-visit-steps__copy">
            <p className="eyebrow">Ako to môže vyzerať</p>
            <h2 id="first-visit-steps-title">Štyri jednoduché kroky.</h2>
            <div className="compact-steps">
              {page.steps.map((step, index) => (
                <article key={step.title} tabIndex={0}>
                  <span>{index + 1}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </article>
              ))}
            </div>
            <ul className="reassurance-pills reassurance-pills--light" aria-label="Praktické uistenia pred prvou návštevou">
              {page.reassurances.map((item) => (
                <li key={item}>
                  <Check aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="inline-actions">
              <a className="button button--primary" href={page.cta.href}>
                {page.cta.label}
                <ArrowRight aria-hidden="true" />
              </a>
              <a className="button button--secondary" href={page.routeAction.href} target="_blank" rel="noopener noreferrer">
                <MapPin aria-hidden="true" />
                {page.routeAction.label}
              </a>
            </div>
          </Reveal>

          <Reveal className="first-visit-steps__photo">
            <img src={page.secondaryImage.src} width={page.secondaryImage.width} height={page.secondaryImage.height} alt={page.secondaryImage.alt} loading="lazy" />
            <div className="first-visit-note">
              <strong>Každý je vítaný.</strong>
              <span>Aj keď prichádzate prvýkrát.</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section page-chapter contact-page major-viewport-section" id="prakticke-informacie" aria-labelledby="contact-body-title">
        <div className="container contact-location">
          <Reveal className="contact-location__heading">
            <p className="eyebrow">Praktické informácie</p>
            <h2 id="contact-body-title">{service.title}</h2>
            <p>{location.entranceDirections}</p>
          </Reveal>

          <div className="contact-location__layout">
            <Reveal className="contact-location__map">
              <iframe
                title="Mapa polohy GMC Sereď na Dlhej 6"
                src={mapEmbedUrl}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="contact-location__map-footer">
                <span>
                  <MapPin aria-hidden="true" />
                  {address.street}, {address.postalCode} {address.city}
                </span>
                <a href={location.mapUrl} target="_blank" rel="noopener noreferrer">
                  Otvoriť v Google Maps
                  <ExternalLink aria-hidden="true" />
                </a>
              </div>
            </Reveal>

            <Reveal as="aside" className="contact-location__aside">
              <figure className="contact-location__photo">
                <img
                  src={pages.contact.exteriorImage.src}
                  width={pages.contact.exteriorImage.width}
                  height={pages.contact.exteriorImage.height}
                  alt={pages.contact.exteriorImage.alt}
                  loading="lazy"
                />
                <figcaption>Označenie GMC Sereď pri vstupe z Dlhej ulice</figcaption>
              </figure>

              <div className="contact-location__details">
                <h3>Kontakt a návšteva</h3>
                <ul>
                  <li>
                    <MapPin aria-hidden="true" />
                    <div>
                      <span>Adresa</span>
                      <strong>{address.street}, {address.postalCode} {address.city}</strong>
                    </div>
                  </li>
                  <li>
                    <Clock aria-hidden="true" />
                    <div>
                      <span>Bohoslužba</span>
                      <strong>{service.day} o {service.time}</strong>
                    </div>
                  </li>
                  {contact.phone ? (
                    <li>
                      <Phone aria-hidden="true" />
                      <div>
                        <span>Telefón</span>
                        <a href={`tel:${contact.phone.replace(/\s+/g, "")}`}>{contact.phone}</a>
                      </div>
                    </li>
                  ) : null}
                  {contact.email ? (
                    <li>
                      <Mail aria-hidden="true" />
                      <div>
                        <span>E-mail</span>
                        <a href={`mailto:${contact.email}`}>{contact.email}</a>
                      </div>
                    </li>
                  ) : null}
                  {facebook.url ? (
                    <li>
                      <ExternalLink aria-hidden="true" />
                      <div>
                        <span>Facebook</span>
                        <a href={facebook.url} target="_blank" rel="noopener noreferrer">{facebook.name}</a>
                      </div>
                    </li>
                  ) : null}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <NextPageLink link={page.next} />
    </article>
  );
}
