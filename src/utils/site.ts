const configuredBase = import.meta.env.BASE_URL || "/";

export const siteBasePath = configuredBase.replace(/\/$/, "");

export const withSiteBase = (path: string) => {
  if (!path.startsWith("/") || !siteBasePath || path === siteBasePath || path.startsWith(`${siteBasePath}/`)) {
    return path;
  }

  return `${siteBasePath}${path}`;
};

export const siteAsset = (path: string) => withSiteBase(path);

export const routePath = (pathname: string) => {
  const withoutBase =
    siteBasePath && (pathname === siteBasePath || pathname.startsWith(`${siteBasePath}/`))
      ? pathname.slice(siteBasePath.length) || "/"
      : pathname;

  return withoutBase.replace(/\/+$/, "") || "/";
};
