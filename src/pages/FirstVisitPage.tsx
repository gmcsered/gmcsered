import { ArrowRight, Check, MapPin } from "lucide-react";
import { churchContent } from "../content/churchContent";
import { NextPageLink } from "../components/ui/NextPageLink";
import { PageHero } from "../components/ui/PageHero";
import { Reveal } from "../components/ui/Reveal";

export function FirstVisitPage() {
  const page = churchContent.pages.firstVisit;

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
              <a className="button button--primary" href={page.cta.href} data-route={page.cta.route ? "true" : undefined}>
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

      <NextPageLink link={page.next} />
    </article>
  );
}
