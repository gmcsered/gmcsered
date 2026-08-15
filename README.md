# GMC Sereď

Produkčný web pre miestny kresťanský zbor GMC Sereď. Web je statická React aplikácia bez backendu. Verejný obsah je v slovenčine a je centralizovaný v `src/content/churchContent.ts`.

## Technológia

- React
- TypeScript
- Vite
- vlastné CSS
- lokálne optimalizované obrázky WebP a PNG

## Príkazy

```bash
npm install
npm run dev
npm run typecheck
npm run build
```

Produkčný výstup sa vytvorí v priečinku `dist/`.

## Štruktúra Webu

Web už nie je jedna dlhá landing page. Obsah je rozdelený do krátkych stránok:

- `/` - stručný domov a vizuálna navigácia.
- `/kto-sme` - ľudia, prijatie a nádej v Ježišovi Kristovi.
- `/comu-verime` - základy viery s reálnym monumentálnym krížom.
- `/spolocenstvo` - vzťahy, káva, jedlo a spoločný život.
- `/zivot-zboru` - kurátorovaná galéria 8 silných fotografií.
- `/kazne` - nedeľné kázne a odkaz na YouTube kanál.
- `/prva-navsteva` - pokojná prvá návšteva v štyroch krokoch.
- `/kontakt` - adresa, čas bohoslužby, budova, vstup a odkazy.

Každá stránka má rovnaký rytmus: header, silný hero, jednu hlavnú obsahovú časť, jasný ďalší krok a footer. Podrobný opis je v `docs/INFORMATION_ARCHITECTURE.md`.

## Obsah a SEO

Všetky verejné texty, route dáta, SEO titulky, meta popisy, odkazy, obrázky, leadership, mapa, bohoslužby, prvá návšteva, verše a CTA sú v:

```text
src/content/churchContent.ts
```

Nová route štruktúra je v objekte `pages`. Každá stránka má vlastné SEO údaje v objekte `seo` a vlastný `next` odkaz pre orientáciu návštevníka.

Prázdne alebo `enabled: false` hodnoty sa nemajú verejne zobrazovať.

## Vizuálny Systém

Web je navrhnutý ako pozvanie, nie ako informačný portál. Hlavný vizuálny jazyk sú reálni ľudia, chvály, rozhovory, káva, jedlo a deti s mládežou.

Domovská stránka pod pozvaním „Každý je vítaný“ používa lokálne promo video `public/assets/church/media/promo.mp4`. Video má zapnuté ovládanie, nespúšťa sa automaticky a načítava iba metadáta, kým ho návštevník nespustí.

Časť `Čomu veríme` používa reálnu fotografiu veľkého pevného kríža ako celoplošné hero pozadie. Text je umiestnený v svetlých transparentných taboch, aby kríž zostal hlavným vizuálnym prvkom. Nepoužíva sa kreslený kríž, obrys, vertikálna tyč, kruhový ornament ani technická geometria.

Stránka `Kázne` používa ostrý obraz otvorenej Biblie bez ťažkého zahmlenia alebo videa. Stránka `Kontakt` používa ako hlavný vizuál zbor počas bohoslužby; banner s kreslom sa nepoužíva ako kontaktný hero, pretože neidentifikuje správnu budovu.

Pohyb je jemný: pomalé dýchanie hero fotografií, hover/focus pohyb obrázkov a okamžitý statický fallback pre `prefers-reduced-motion`.

## Obrázky

Pôvodné podklady sú v:

```text
/Users/patus/Documents/GMC
```

Originály sa neupravujú, nepresúvajú ani nepremenúvajú. Vybrané kópie a optimalizované výstupy sú iba v:

```text
public/assets/church
```

Nové route obrázky sú v `public/assets/church/ia`. Prehľad výberu a zdrojov je v `docs/ASSET_INVENTORY.md`.

## Image Optimization Workflow

1. Vyberte najvyššiu kvalitu zdrojovej fotografie.
2. Upravujte iba kópiu v `public/assets/church/...`.
3. Exportujte WebP v rozmeroch vhodných pre konkrétny layout.
4. Zapíšte cestu, rozmery a slovenský alt text do `src/content/churchContent.ts`.
5. Pri výmene hero obrázka upravte príslušný záznam v `pages.<route>.image`.
6. Spustite `npm run typecheck` a `npm run build`.

## Leadership

Sekcia vedenia zostáva pripravená v `churchContent.leadership`.

- `Kazateľ` je zapnutý pre Jána Tagaja so schválenou fotografiou.
- `Superintendentka` a `Biskup` sú zapísaní centrálne, ale vypnutí, kým nie je potvrdená vhodná fotografia a verejné použitie.
- Nevypĺňajte životopisné údaje, ktoré neboli výslovne overené.

## Mapa a Súradnice

Súradnice a odkaz na mapy sú iba v `churchContent.location`:

```ts
location: {
  coordinates: {
    latitude: 48.29376336953857,
    longitude: 17.733573520375433,
  },
  mapUrl: "https://www.google.com/maps/search/?api=1&query=48.29376336953857%2C17.733573520375433",
}
```

Komponenty nesmú hardcodovať súradnice. Ak sa overí presnejší vstup, upravte `location.coordinates`, `location.mapUrl`, `location.entranceDirections` a `location.buildingNote`.

## YouTube a Kázne

YouTube nastavenia sú v `churchContent.youtube`.

- Kanál: `https://www.youtube.com/@JanTagaj`
- Konkrétny odkaz na poslednú kázeň doplňte až po overení verejnej URL.
- Web nepoužíva autoplay, YouTube SDK ani embedded video skripty.

## Animácie

Voliteľné funkcie sú v `visualFeatures`. Ak treba pohyb zjednodušiť, vypnite napríklad `scrollReveal` alebo príslušnú route interakciu. Používatelia s `prefers-reduced-motion` dostanú statické zobrazenie automaticky.

## Nasadenie

Web je statická SPA aplikácia. Hosting musí mať fallback pravidlo na `index.html`, aby fungovali route adresy ako `/kto-sme` alebo `/prva-navsteva`.

Po potvrdení domény vyplňte:

```ts
site: {
  siteUrl: "https://...",
}
```
