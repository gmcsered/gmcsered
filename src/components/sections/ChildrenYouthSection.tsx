import { BookOpen, Heart, UsersRound } from "lucide-react";
import { churchContent } from "../../content/churchContent";
import { BibleMotif, LightRays } from "../decor/ChristianMotifs";
import { Reveal } from "../ui/Reveal";

export function ChildrenYouthSection() {
  const { childrenYouth } = churchContent;

  return (
    <section className="section children-youth-section" id="deti-a-mladez">
      <LightRays className="section-watermark section-watermark--right" />
      <div className="container children-youth-section__layout">
        <Reveal className="children-youth-section__media">
          <img
            src={childrenYouth.image.src}
            width={childrenYouth.image.width}
            height={childrenYouth.image.height}
            alt={childrenYouth.image.alt}
            loading="lazy"
          />
          <div className="children-youth-section__badge">
            <UsersRound aria-hidden="true" />
            <span>{childrenYouth.confirmedStatement}</span>
          </div>
        </Reveal>

        <Reveal className="children-youth-section__copy">
          <BibleMotif className="children-youth-section__motif" />
          <p className="eyebrow">{childrenYouth.eyebrow}</p>
          <h2>{childrenYouth.heading}</h2>
          {childrenYouth.text.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="children-youth-section__points" aria-label="Dôrazy programu pre deti a mládež">
            <span>
              <BookOpen aria-hidden="true" />
              Spoznávať Boha
            </span>
            <span>
              <Heart aria-hidden="true" />
              Budovať priateľstvá
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
