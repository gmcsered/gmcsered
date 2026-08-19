import { ExternalLink, Play, Radio } from "lucide-react";
import { churchContent } from "../../content/churchContent";
import { LightRays } from "../decor/ChristianMotifs";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

export function SermonsSection() {
  const { sermons, youtube } = churchContent;
  const latest = youtube.latestSermon.enabled && youtube.latestSermon.url ? youtube.latestSermon : null;

  return (
    <section className="section sermons" id="kazne">
      <LightRays className="section-watermark" />
      <div className="container sermons-layout">
        <Reveal className="sermons-media">
          <img
            src={sermons.image.src}
            width={sermons.image.width}
            height={sermons.image.height}
            alt={sermons.image.alt}
            loading="lazy"
          />
          <div className="sermons-media__play" aria-hidden="true">
            <Play />
          </div>
        </Reveal>
        <Reveal>
          <p className="highlight">
            <Radio aria-hidden="true" />
            {youtube.weeklyMessage}
          </p>
          <SectionHeading title={sermons.heading} />
          {sermons.text.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {latest ? (
            <article className="latest-sermon">
              <p>{latest.label}</p>
              <h3>{latest.title}</h3>
              {latest.date || latest.speaker ? (
                <span>
                  {[latest.date, latest.speaker].filter(Boolean).join(" | ")}
                </span>
              ) : null}
              <a className="button button--secondary" href={latest.url} target="_blank" rel="noopener noreferrer">
                Pozrieť kázeň
                <ExternalLink aria-hidden="true" />
              </a>
            </article>
          ) : null}
          <div className="inline-actions">
            {youtube.enabled && youtube.channelUrl ? (
              <a className="button button--primary" href={youtube.channelUrl} target="_blank" rel="noopener noreferrer">
                Pozrieť YouTube kanál
                <ExternalLink aria-hidden="true" />
              </a>
            ) : null}
            {youtube.latestSermonUrl ? (
              <a
                className="button button--secondary"
                href={youtube.latestSermonUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Pozrieť poslednú kázeň
                <ExternalLink aria-hidden="true" />
              </a>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
