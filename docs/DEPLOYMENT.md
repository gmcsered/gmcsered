# Deployment

Web je statická Vite SPA aplikácia. Nepotrebuje backend, databázu ani serverové API.

## Produkčný build

```bash
npm install
npm run build
```

Produkčný výstup je v:

```text
dist/
```

## Požiadavky na hosting

- statický hosting
- HTTPS
- podpora kompresie Brotli alebo gzip
- SPA fallback na `index.html`
- možnosť nastaviť cache hlavičky pre obrázky a build assety

## SPA fallback

Adresa `/prva-navsteva` je klientská route. Hosting musí pri priamom otvorení tejto adresy vrátiť `index.html`.

Príklad pravidla:

```text
/* /index.html 200
```

## Cache odporúčania

Pre build assety s hashom:

```text
Cache-Control: public, max-age=31536000, immutable
```

Pre obrázky v `public/assets/church`:

```text
Cache-Control: public, max-age=2592000
```

Pre `index.html`:

```text
Cache-Control: no-cache
```

## Doména

Po potvrdení finálnej domény doplňte `siteUrl` v `src/content/churchContent.ts`. Tým sa sprístupnia absolútne canonical a Open Graph URL.

## Odporúčané platformy

- Netlify
- Vercel
- Cloudflare Pages
- GitHub Pages
- vlastný statický hosting cez Nginx alebo Apache

## Kontroly po nasadení

- Otvoriť homepage.
- Otvoriť `/prva-navsteva` priamo v novom okne.
- Overiť navigáciu a mobilné menu.
- Overiť, že všetky obrázky načítavajú z vlastnej domény, nie z Facebook CDN.
- Overiť titulok, meta description a Open Graph obrázok.
- Overiť mapový, Facebook, e-mail a národný odkaz.
- Skontrolovať responzívne rozloženie na mobilnom a desktopovom viewport-e.
