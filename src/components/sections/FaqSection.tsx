import { Minus, Plus } from "lucide-react";
import { churchContent } from "../../content/churchContent";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

export function FaqSection() {
  return (
    <section className="section faq-section" id="otazky">
      <div className="container narrow">
        <Reveal>
          <SectionHeading title="Časté otázky" align="center" />
        </Reveal>
        <div className="faq-list">
          {churchContent.faq.map((item, index) => (
            <Reveal as="article" key={item.question}>
              <details className="faq-item" id={`otazka-${item.id}`} open={index === 0}>
              <summary>
                {item.question}
                <span className="faq-item__icon" aria-hidden="true">
                  <Plus className="faq-item__plus" />
                  <Minus className="faq-item__minus" />
                </span>
              </summary>
              <p>{item.answer}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
