import { UserRound } from "lucide-react";
import { churchContent } from "../../content/churchContent";
import { CrossMotif, SectionOrnament } from "../decor/ChristianMotifs";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

export function LeadershipSection() {
  const visibleLeaders = churchContent.leadership.filter((person) => person.enabled && person.image);

  if (!visibleLeaders.length) {
    return null;
  }

  return (
    <section className="section leadership-section" id="vedenie">
      <SectionOrnament className="section-ornament section-ornament--right" />
      <div className="container leadership-layout">
        <Reveal>
          <div className="leadership-copy">
            <p className="eyebrow">Ľudia, ktorí slúžia</p>
            <SectionHeading
              title="Naše vedenie"
              text="Vedenie zboru vnímame ako službu ľuďom, nie ako vzdialenú funkciu."
            />
            <div className="leadership-note">
              <CrossMotif />
              <p>Ďalšie portréty vedenia doplníme po oficiálnom schválení fotografií.</p>
            </div>
          </div>
        </Reveal>

        <div className="leadership-cards" aria-label="Potvrdené vedenie zboru">
          {visibleLeaders.map((person) => (
            <Reveal as="article" className="leader-card" key={person.role}>
              <div className="leader-card__image-wrap">
                {person.image ? (
                  <img
                    src={person.image.src}
                    width={person.image.width}
                    height={person.image.height}
                    alt={person.image.alt}
                    loading="lazy"
                  />
                ) : null}
              </div>
              <div className="leader-card__body">
                <p className="leader-card__role">
                  <UserRound aria-hidden="true" />
                  {person.role}
                </p>
                <h3>{person.name}</h3>
                <p>{person.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
