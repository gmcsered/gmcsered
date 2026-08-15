import { churchContent } from "../../content/churchContent";
import { BibleMotif, ScriptureDivider } from "../decor/ChristianMotifs";
import { Reveal } from "../ui/Reveal";

export function BibleVerseSection() {
  const { bibleVerse } = churchContent;

  return (
    <section className="verse-section" aria-labelledby="verse-title">
      <img
        className="verse-section__image"
        src={bibleVerse.image.src}
        width={bibleVerse.image.width}
        height={bibleVerse.image.height}
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
      <div className="verse-section__overlay" />
      <BibleMotif className="verse-section__bible" />
      <Reveal className="container verse-section__content">
        <p className="eyebrow" id="verse-title">
          {bibleVerse.heading}
        </p>
        <ScriptureDivider />
        <blockquote>
          <p>{bibleVerse.text}</p>
          <cite>{bibleVerse.reference}</cite>
        </blockquote>
      </Reveal>
    </section>
  );
}
