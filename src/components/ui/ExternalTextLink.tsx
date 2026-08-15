import { ExternalLink } from "lucide-react";

type ExternalTextLinkProps = {
  href: string;
  children: string;
};

export function ExternalTextLink({ href, children }: ExternalTextLinkProps) {
  return (
    <a className="text-link" href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <ExternalLink aria-hidden="true" />
    </a>
  );
}
