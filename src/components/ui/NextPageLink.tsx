import { ArrowRight } from "lucide-react";
import type { ImageAsset, LinkTarget } from "../../content/churchContent";
import { Reveal } from "./Reveal";

type NextPageLinkProps = {
  eyebrow?: string;
  link: LinkTarget & { route?: boolean; image: ImageAsset };
};

export function NextPageLink({ eyebrow = "Ďalší krok", link }: NextPageLinkProps) {
  const isExternal = link.href.startsWith("http");

  return (
    <section className="next-page-section" aria-label={eyebrow}>
      <Reveal className="container">
        <a
          className="next-page-link"
          href={link.href}
          data-route={link.route ? "true" : undefined}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
        >
          <img src={link.image.src} width={link.image.width} height={link.image.height} alt="" aria-hidden="true" loading="lazy" />
          <span className="next-page-link__shade" aria-hidden="true" />
          <span className="next-page-link__content">
            <span className="eyebrow">{eyebrow}</span>
            <strong>{link.label}</strong>
          </span>
          <span className="next-page-link__icon">
            <ArrowRight aria-hidden="true" />
          </span>
        </a>
      </Reveal>
    </section>
  );
}
