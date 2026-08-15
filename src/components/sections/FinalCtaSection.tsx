import { ArrowRight, MapPin, Play } from "lucide-react";
import { churchContent } from "../../content/churchContent";
import { LightRays } from "../decor/ChristianMotifs";
import { Reveal } from "../ui/Reveal";

const iconFor = (label: string) => {
  if (label.includes("cestu")) {
    return MapPin;
  }
  if (label.includes("kázeň")) {
    return Play;
  }
  return ArrowRight;
};

export function FinalCtaSection() {
  const { finalCta } = churchContent;

  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <img
        className="final-cta__image"
        src={finalCta.image.src}
        width={finalCta.image.width}
        height={finalCta.image.height}
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
      <div className="final-cta__overlay" />
      <LightRays />
      <Reveal className="container final-cta__content">
        <p className="eyebrow">Pozvanie</p>
        <h2 id="final-cta-title">{finalCta.heading}</h2>
        <p>{finalCta.text}</p>
        <div className="inline-actions inline-actions--center">
          {finalCta.actions.map((action) => {
            const Icon = iconFor(action.label);
            const isExternal = action.href.startsWith("http");
            return (
              <a
                className={`button ${action.route ? "button--primary" : "button--secondary"}`}
                href={action.href}
                data-route={action.route ? "true" : undefined}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                key={action.label}
              >
                {action.label}
                <Icon aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
