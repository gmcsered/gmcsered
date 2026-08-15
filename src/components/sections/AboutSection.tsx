import { HeartHandshake } from "lucide-react";
import { churchContent } from "../../content/churchContent";
import { SectionOrnament } from "../decor/ChristianMotifs";
import { ExternalTextLink } from "../ui/ExternalTextLink";
import { Reveal } from "../ui/Reveal";

export function AboutSection() {
  const { about } = churchContent;

  return (
    <section className="section about-story" id="kto-sme">
      <SectionOrnament className="section-ornament" />
      <div className="container about-story__layout">
        <Reveal className="about-story__media">
          <img
            className="about-story__primary"
            src={about.image.src}
            width={about.image.width}
            height={about.image.height}
            alt={about.image.alt}
            loading="lazy"
          />
          <img
            className="about-story__secondary"
            src={about.secondaryImage.src}
            width={about.secondaryImage.width}
            height={about.secondaryImage.height}
            alt={about.secondaryImage.alt}
            loading="lazy"
          />
        </Reveal>

        <Reveal className="about-story__copy">
          <p className="eyebrow">{about.eyebrow}</p>
          <h2>{about.heading}</h2>
          <div className="about-story__text">
            {about.text.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <blockquote className="pull-quote">
            <HeartHandshake aria-hidden="true" />
            <p>{about.pullQuote}</p>
          </blockquote>
          <ExternalTextLink href={about.nationalLink.href}>{about.nationalLink.label}</ExternalTextLink>
        </Reveal>
      </div>
    </section>
  );
}
