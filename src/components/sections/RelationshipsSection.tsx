import { Coffee, HeartHandshake, Utensils } from "lucide-react";
import { churchContent } from "../../content/churchContent";
import { SectionOrnament } from "../decor/ChristianMotifs";
import { Reveal } from "../ui/Reveal";

const icons = [HeartHandshake, Coffee, Utensils];

export function RelationshipsSection() {
  const { relationships } = churchContent;

  return (
    <section className="section relationships-section" id="co-robime">
      <SectionOrnament className="section-ornament section-ornament--right" />
      <div className="container relationships-section__layout">
        <Reveal className="relationships-section__copy">
          <p className="eyebrow">{relationships.eyebrow}</p>
          <h2>{relationships.heading}</h2>
          {relationships.text.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="relationship-lines">
            {relationships.statements.map((statement, index) => {
              const Icon = icons[index] ?? HeartHandshake;
              return (
                <p key={statement}>
                  <Icon aria-hidden="true" />
                  {statement}
                </p>
              );
            })}
          </div>
        </Reveal>

        <Reveal className="relationship-collage">
          {relationships.images.map((image, index) => (
            <figure className={`relationship-photo relationship-photo--${index + 1}`} key={image.src}>
              <img
                src={image.src}
                width={image.width}
                height={image.height}
                alt={image.alt}
                loading="lazy"
              />
              {image.caption ? <figcaption>{image.caption}</figcaption> : null}
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
