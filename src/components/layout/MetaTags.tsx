import { useEffect } from "react";
import { churchContent, type SeoPage } from "../../content/churchContent";

type MetaTagsProps = {
  page: SeoPage;
  path: string;
};

const setMeta = (selector: string, attribute: "content" | "href", value: string) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | HTMLLinkElement | null;
  if (!element) {
    element = selector.startsWith("link")
      ? document.createElement("link")
      : document.createElement("meta");

    if (selector.includes("canonical")) {
      element.setAttribute("rel", "canonical");
    }

    const name = selector.match(/name="([^"]+)"/)?.[1];
    const property = selector.match(/property="([^"]+)"/)?.[1];

    if (name) {
      element.setAttribute("name", name);
    }
    if (property) {
      element.setAttribute("property", property);
    }

    document.head.appendChild(element);
  }

  element.setAttribute(attribute, value);
};

const absoluteUrl = (pathOrUrl: string) => {
  if (!pathOrUrl) {
    return "";
  }

  if (/^https?:\/\//.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const siteUrl = churchContent.site.siteUrl.replace(/\/$/, "");
  return siteUrl ? `${siteUrl}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}` : pathOrUrl;
};

export function MetaTags({ page, path }: MetaTagsProps) {
  useEffect(() => {
    document.title = page.title;
    setMeta('meta[name="description"]', "content", page.description);
    setMeta('meta[property="og:title"]', "content", page.title);
    setMeta('meta[property="og:description"]', "content", page.description);
    setMeta('meta[property="og:type"]', "content", "website");
    setMeta('meta[property="og:locale"]', "content", "sk_SK");
    setMeta('meta[property="og:image"]', "content", absoluteUrl(page.image));

    const canonical = absoluteUrl(path === "/" ? "/" : path);
    if (churchContent.site.siteUrl && canonical) {
      setMeta('link[rel="canonical"]', "href", canonical);
      setMeta('meta[property="og:url"]', "content", canonical);
    }

    const sameAs = [
      churchContent.facebook.url,
      churchContent.youtube.channelUrl,
      churchContent.site.nationalWebsiteUrl,
    ].filter(Boolean);

    const data = {
      "@context": "https://schema.org",
      "@type": "Church",
      name: churchContent.identity.displayName,
      description: page.description,
      image: absoluteUrl(page.image),
      url: churchContent.site.siteUrl || undefined,
      email: churchContent.contact.email || undefined,
      telephone: churchContent.contact.phone || undefined,
      address: {
        "@type": "PostalAddress",
        streetAddress: churchContent.address.street,
        addressLocality: churchContent.address.city,
        postalCode: churchContent.address.postalCode,
        addressCountry: "SK",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: churchContent.location.coordinates.latitude,
        longitude: churchContent.location.coordinates.longitude,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: "Sunday",
          opens: "09:30",
        },
      ],
      sameAs: sameAs.length ? sameAs : undefined,
    };

    const id = "gmc-sered-structured-data";
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = id;
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }, [page, path]);

  return null;
}
