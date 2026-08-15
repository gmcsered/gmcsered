import { CrossMotif } from "../decor/ChristianMotifs";
import { Reveal } from "../ui/Reveal";
import { churchContent } from "../../content/churchContent";

type ChapterQuoteSectionProps = {
  index: number;
};

export function ChapterQuoteSection({ index }: ChapterQuoteSectionProps) {
  const quote = churchContent.chapterQuotes[index];

  if (!quote) {
    return null;
  }

  return (
    <section className="chapter-quote" aria-label="Krátke pozvanie">
      <img
        src={quote.image.src}
        width={quote.image.width}
        height={quote.image.height}
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
      <div className="chapter-quote__overlay" />
      <CrossMotif className="chapter-quote__cross" />
      <Reveal className="container chapter-quote__content">
        <p>{quote.text}</p>
      </Reveal>
    </section>
  );
}
