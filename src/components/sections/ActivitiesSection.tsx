import { ArrowUpRight, BookOpen, Church, HeartHandshake } from "lucide-react";
import { churchContent } from "../../content/churchContent";
import { CrossMotif } from "../decor/ChristianMotifs";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

const icons = [Church, BookOpen, HeartHandshake];

export function ActivitiesSection() {
  return (
    <section className="section activities-section" id="co-robime">
      <CrossMotif className="section-watermark" />
      <div className="container">
        <Reveal>
          <SectionHeading
            title="Čo robíme"
            text="Naše stretnutia sú jednoduché, osobné a zamerané na vieru, vzťahy a službu."
            align="center"
          />
        </Reveal>
        <div className="activity-groups">
          {churchContent.activityGroups.map((group, index) => {
            const Icon = icons[index];
            return (
              <Reveal as="article" className="activity-group" tabIndex={0} key={group.title}>
                <div className="activity-group__image">
                  <img
                    src={group.image.src}
                    width={group.image.width}
                    height={group.image.height}
                    alt={group.image.alt}
                    loading="lazy"
                  />
                </div>
                <div className="activity-group__body">
                  <div className="activity-group__icon">
                    <Icon aria-hidden="true" />
                  </div>
                  <h3>{group.title}</h3>
                  <p>{group.text}</p>
                  <ul>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="activity-group__reveal">
                    {group.reveal}
                    <ArrowUpRight aria-hidden="true" />
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
