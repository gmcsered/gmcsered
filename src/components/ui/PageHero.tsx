import { ArrowRight } from "lucide-react";
import type { ImageAsset, LinkTarget, ResponsiveImageAsset } from "../../content/churchContent";

type PageHeroProps = {
  eyebrow: string;
  heading: string;
  text: string;
  image: ImageAsset | ResponsiveImageAsset;
  primaryAction?: LinkTarget & { route?: boolean };
  secondaryAction?: LinkTarget & { route?: boolean };
  tone?: "light" | "dark";
};

const isResponsiveImage = (image: ImageAsset | ResponsiveImageAsset): image is ResponsiveImageAsset =>
  "sources" in image;

const actionProps = (action: LinkTarget & { route?: boolean }) => {
  const isExternal = action.href.startsWith("http");
  return {
    href: action.href,
    "data-route": action.route ? "true" : undefined,
    target: isExternal ? "_blank" : undefined,
    rel: isExternal ? "noopener noreferrer" : undefined,
  };
};

export function PageHero({
  eyebrow,
  heading,
  text,
  image,
  primaryAction,
  secondaryAction,
  tone = "dark",
}: PageHeroProps) {
  return (
    <section className={`page-hero page-hero--${tone}`} aria-labelledby="page-title">
      <picture className="page-hero__media">
        {isResponsiveImage(image)
          ? image.sources.map((source) => (
              <source
                key={source.src}
                srcSet={source.src}
                media={source.media}
                width={source.width}
                height={source.height}
              />
            ))
          : null}
        <img src={image.src} width={image.width} height={image.height} alt="" aria-hidden="true" />
      </picture>
      <div className="page-hero__overlay" aria-hidden="true" />
      <div className="container page-hero__content">
        <p className="eyebrow">{eyebrow}</p>
        <h1 id="page-title">{heading}</h1>
        <p>{text}</p>
        {primaryAction || secondaryAction ? (
          <div className="inline-actions">
            {primaryAction ? (
              <a className="button button--primary" {...actionProps(primaryAction)}>
                {primaryAction.label}
                <ArrowRight aria-hidden="true" />
              </a>
            ) : null}
            {secondaryAction ? (
              <a className="button button--secondary" {...actionProps(secondaryAction)}>
                {secondaryAction.label}
                <ArrowRight aria-hidden="true" />
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
