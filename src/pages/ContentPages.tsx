import {
  ArrowRight,
  BookOpen,
  Check,
  Clock,
  Cross,
  ExternalLink,
  Heart,
  Mail,
  MapPin,
  Phone,
  Play,
  Users,
  Utensils,
} from "lucide-react";
import { churchContent } from "../content/churchContent";
import { NextPageLink } from "../components/ui/NextPageLink";
import { PageHero } from "../components/ui/PageHero";
import { ProgramEventCard } from "../components/sections/ProgramEventCard";
import { ChurchLifeGalleries } from "../components/sections/ChurchLifeGalleries";
import { Reveal } from "../components/ui/Reveal";
import { programData } from "../content/programData";

const routeAttr = (route?: boolean) => (route ? "true" : undefined);

const beliefIcons = [Cross, Heart, BookOpen, Check, Users];

export function AboutPage() {
  const page = churchContent.pages.about;

  return (
    <article className="route-page about-route">
      <PageHero eyebrow={page.eyebrow} heading={page.heading} text={page.intro} image={page.image} primaryAction={page.cta} />
      <section className="section page-chapter about-page-chapter" aria-labelledby="about-body-title">
        <div className="container editorial-two-col">
          <Reveal className="editorial-copy">
            <p className="eyebrow">Naša identita</p>
            <h2 id="about-body-title">{page.quote}</h2>
            {page.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <a className="button button--primary" href={page.cta.href} data-route={routeAttr(page.cta.route)}>
              {page.cta.label}
              <ArrowRight aria-hidden="true" />
            </a>
          </Reveal>
          <Reveal className="editorial-collage editorial-collage--about">
            {page.collage.map((image) => (
              <figure key={image.src}>
                <img src={image.src} width={image.width} height={image.height} alt={image.alt} loading="lazy" />
              </figure>
            ))}
          </Reveal>
        </div>
      </section>
      <NextPageLink link={page.next} />
    </article>
  );
}

export function BeliefsPage() {
  const page = churchContent.pages.beliefs;

  return (
    <article className="route-page beliefs-route">
      <section className="beliefs-page-hero" aria-labelledby="beliefs-page-title">
        <picture className="beliefs-page-hero__background">
          {page.image.sources.map((source) => (
            <source key={source.src} srcSet={source.src} media={source.media} width={source.width} height={source.height} />
          ))}
          <img src={page.image.src} width={page.image.width} height={page.image.height} alt="" fetchPriority="high" />
        </picture>
        <div className="beliefs-page-hero__overlay" aria-hidden="true" />
        <div className="container beliefs-page-hero__layout">
          <blockquote className="beliefs-page-hero__scripture">
            <p>{page.scripture.text}</p>
            <cite>{page.scripture.citation}</cite>
          </blockquote>
          <div className="beliefs-page-hero__content">
            <h1 id="beliefs-page-title">{page.heading}</h1>
            <p className="beliefs-page-hero__subheading">{page.subheading}</p>
            <p className="beliefs-page-hero__intro">{page.intro}</p>
            <div className="beliefs-page-hero__items" aria-label="Základy našej viery">
              {page.items.map((item, index) => {
                const Icon = beliefIcons[index] ?? Check;

                return (
                  <article className="beliefs-page-hero__item" key={item.title}>
                    <span className="beliefs-page-hero__item-icon" aria-hidden="true">
                      <Icon />
                    </span>
                    <div>
                      <h2>{item.title}</h2>
                      <p>{item.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

export function CommunityPage() {
  const page = churchContent.pages.community;

  return (
    <article className="route-page community-route">
      <PageHero eyebrow={page.eyebrow} heading={page.heading} text={page.intro} image={page.image} primaryAction={page.cta} />
      <section className="section page-chapter community-page-chapter" aria-labelledby="community-body-title">
        <div className="container community-story">
          <Reveal className="community-story__copy">
            <p className="eyebrow">Vzťahy, káva a spoločný stôl</p>
            <h2 id="community-body-title">{page.quote}</h2>
            <ul className="warm-list">
              {page.statements.map((statement) => (
                <li key={statement}>
                  <Heart aria-hidden="true" />
                  <span>{statement}</span>
                </li>
              ))}
            </ul>
            <a className="button button--primary" href={page.cta.href} data-route={routeAttr(page.cta.route)}>
              {page.cta.label}
              <ArrowRight aria-hidden="true" />
            </a>
          </Reveal>
          <Reveal className="community-magazine">
            {page.collage.map((image) => (
              <figure key={image.src}>
                <img src={image.src} width={image.width} height={image.height} alt={image.alt} loading="lazy" />
                {image.caption ? <figcaption>{image.caption}</figcaption> : null}
              </figure>
            ))}
          </Reveal>
        </div>
      </section>
      <NextPageLink link={page.next} />
    </article>
  );
}

export function ChurchLifePage() {
  const page = churchContent.pages.churchLife;

  return (
    <article className="route-page church-life-route">
      <PageHero eyebrow={page.eyebrow} heading={page.heading} text={page.intro} image={page.image} primaryAction={page.cta} />
      <section className="section page-chapter church-life-page" aria-labelledby="church-life-gallery-title">
        <div className="container">
          <Reveal className="section-heading">
            <p className="eyebrow">Výber fotografií</p>
            <h2 id="church-life-gallery-title">Niekoľko skutočných chvíľ</h2>
          </Reveal>
          <ChurchLifeGalleries galleries={page.galleries} />
        </div>
      </section>
      {page.hopestreet ? (
        <section className="section hopestreet-section" aria-labelledby="hopestreet-title">
          <div className="container">
            <Reveal className="hopestreet-feature">
              <div className="hopestreet-feature__copy">
                <p className="eyebrow">{page.hopestreet.eyebrow}</p>
                <h2 id="hopestreet-title">{page.hopestreet.heading}</h2>
                {page.hopestreet.logo ? (
                  <div className="hopestreet-feature__brand">
                    <img
                      src={page.hopestreet.logo.src}
                      width={page.hopestreet.logo.width}
                      height={page.hopestreet.logo.height}
                      alt={page.hopestreet.logo.alt}
                      loading="lazy"
                    />
                  </div>
                ) : null}
                <p>{page.hopestreet.text}</p>
                <div className="hopestreet-feature__actions">
                  <a className="button button--secondary" href={page.hopestreet.facebookUrl} target="_blank" rel="noopener noreferrer">
                    HopeStreet na Facebooku
                    <ExternalLink aria-hidden="true" />
                  </a>
                </div>
              </div>
              <div className="hopestreet-feature__media">
                <figure>
                  <img
                    src={page.hopestreet.poster.src}
                    width={page.hopestreet.poster.width}
                    height={page.hopestreet.poster.height}
                    alt={page.hopestreet.poster.alt}
                    loading="lazy"
                  />
                </figure>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}
      <NextPageLink link={page.next} />
    </article>
  );
}

export function ProgramPage() {
  const page = churchContent.pages.program;

  return (
    <article className="route-page program-route">
      <section className="program-intro" aria-labelledby="program-page-title">
        <div className="program-intro__shapes" aria-hidden="true">
          <span className="program-intro__schedule-shape">
            <i />
            <i />
            <i />
          </span>
          <span className="program-intro__arrow-shape" />
        </div>
        <div className="container program-intro__inner">
          <div className="program-intro__copy">
            <p className="eyebrow">{page.eyebrow}</p>
            <h1 id="program-page-title">{page.heading}</h1>
            <p>{page.intro}</p>
          </div>
          <div className="program-intro__actions">
            <a className="button button--primary" href={page.cta.href}>
              {page.cta.label}
              <ArrowRight aria-hidden="true" />
            </a>
            <a className="button button--secondary" href={page.next.href} data-route={routeAttr(true)}>
              {page.next.label}
              <ArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
      <section className="section page-chapter program-page" aria-labelledby="program-title">
        <div className="container program-layout">
          <div className="program-poster-column">
            <Reveal className="program-poster">
              <img src={programData.poster.src} width={programData.poster.width} height={programData.poster.height} alt={programData.poster.alt} loading="lazy" />
            </Reveal>
            <Reveal as="figure" className="program-moment">
              <img
                src={page.contextImage.src}
                width={page.contextImage.width}
                height={page.contextImage.height}
                alt={page.contextImage.alt}
                loading="lazy"
              />
              {page.contextImage.caption ? <figcaption>{page.contextImage.caption}</figcaption> : null}
            </Reveal>
          </div>
          <Reveal className="program-copy">
            <p className="eyebrow">{programData.monthLabel}</p>
            <h2 id="program-title">{programData.title}</h2>
            <div className="program-events" aria-label={programData.monthLabel}>
              {programData.events.map((event) => (
                <ProgramEventCard event={event} key={`${event.date}-${event.time}-${event.title}`} />
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      <section className="section program-actions" aria-labelledby="program-actions-title">
        <div className="container">
          <Reveal className="section-heading">
            <p className="eyebrow">Ďalšie kroky</p>
            <h2 id="program-actions-title">{page.actionsHeading}</h2>
          </Reveal>
          <div className="program-action-grid">
            {page.actions.map((action) => (
              <Reveal as="article" className="program-action-card" key={action.title}>
                <Check aria-hidden="true" />
                <h3>{action.title}</h3>
                <p>{action.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <NextPageLink link={page.next} />
    </article>
  );
}

export function SermonsPage() {
  const { pages, youtube } = churchContent;
  const page = pages.sermons;
  const channelHref = youtube.channelUrl || page.channelAction.href;

  return (
    <article className="route-page sermons-route">
      <PageHero eyebrow={page.eyebrow} heading={page.heading} text={page.intro} image={page.image} primaryAction={{ ...page.channelAction, href: channelHref }} secondaryAction={page.cta} tone="light" />
      <section className="section page-chapter sermons-page" aria-labelledby="sermons-body-title">
        <div className="container sermons-focus">
          <Reveal className="sermons-focus__image">
            <img src={page.previewImage.src} width={page.previewImage.width} height={page.previewImage.height} alt={page.previewImage.alt} loading="lazy" />
            {page.previewImage.caption ? <span className="sermons-focus__caption">{page.previewImage.caption}</span> : null}
            <span className="play-mark" aria-hidden="true">
              <Play />
            </span>
          </Reveal>
          <Reveal className="sermons-focus__copy">
            <p className="eyebrow">{page.latestLabel}</p>
            <h2 id="sermons-body-title">Nedeľné posolstvá</h2>
            <p>{youtube.latestSermon.enabled && youtube.latestSermon.title ? youtube.latestSermon.title : page.latestUnavailable}</p>
            <a className="button button--primary" href={channelHref} target="_blank" rel="noopener noreferrer">
              {page.channelAction.label}
              <ExternalLink aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </section>
      <NextPageLink link={page.next} />
    </article>
  );
}

export function ContactPage() {
  const { pages, service, address, location, contact, facebook } = churchContent;
  const page = pages.contact;
  const mapEmbedUrl = `https://www.google.com/maps?q=${location.coordinates.latitude},${location.coordinates.longitude}&z=17&hl=sk&output=embed`;

  return (
    <article className="route-page contact-route">
      <PageHero eyebrow={page.eyebrow} heading={page.heading} text={page.intro} image={page.image} primaryAction={page.cta} />
      <section className="section page-chapter contact-page" aria-labelledby="contact-body-title">
        <div className="container contact-location">
          <Reveal className="contact-location__heading">
            <p className="eyebrow">Prakticky</p>
            <h2 id="contact-body-title">{service.title}</h2>
            <p>
              {service.day} o {service.time}. {location.entranceDirections}
            </p>
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
                  src={page.exteriorImage.src}
                  width={page.exteriorImage.width}
                  height={page.exteriorImage.height}
                  alt={page.exteriorImage.alt}
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
