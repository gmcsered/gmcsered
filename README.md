# GMC Sereď

Produkčný web pre miestny kresťanský zbor GMC Sereď. Web je statická React aplikácia bez backendu. Web beží na GitHub Pages, mesačný program je v jednoduchom textovom súbore a dlhodobý nedeľný fotoarchív je pripravený pre Cloudflare R2.

## Ako aktualizovať web GMC Sereď

Web ostáva jednoduchý statický web: jeden príkaz skontroluje obsah, pripraví fotky, vytvorí build, commitne zmeny a pošle ich na GitHub. GitHub Actions potom web automaticky zverejní. Nie je potrebný žiadny redakčný systém ani server.

### Nedeľné fotky

Toto je bežný týždenný postup pre nedeľný fotoarchív `Nedele v GMC Sereď`.

1. Vytvorte priečinok s dátumom nedele:

   ```text
   content-import/sundays/YYYY-MM-DD/
   ```

   Príklad:

   ```text
   content-import/sundays/2026-08-23/
   ```

2. Skopírujte doň všetky fotky z tej nedele.

   Netreba ich triediť. Netreba ich premenovať. Netreba ich zmenšovať.

3. Spustite:

   ```bash
   ./update-site.sh
   ```

Skript fotky automaticky zmenší, prevedie na WebP, vytvorí náhľady, nahrá ich do Cloudflare R2 a do GitHubu uloží iba malý manifest s URL adresami. Originálne fotky z `content-import/` sa nikdy necommitujú do GitHubu.

Ak chcete spracovať iba jednu konkrétnu nedeľu, môžete použiť:

```bash
./update-site.sh 2026-08-23
```

### Mesačný program

1. Nahraďte súbor `public/content/program/current-program.jpg` novým plagátom. Názov súboru musí zostať presne `current-program.jpg`.
2. Otvorte `public/content/program/program.txt`.
3. Upravte prvý riadok, druhý riadok a udalosti.
4. Spustite:

   ```bash
   ./update-site.sh
   ```

Formát programu:

```text
September v GMC Sereď
Jesenný program

6.9. | 9:30 | Nedeľná bohoslužba | Pastor Ján Tagaj
13.9. | 9:30 | Nedeľná bohoslužba | Pastor Ján Tagaj
20.9. | 9:30 | Nedeľná bohoslužba | Pastor Ján Tagaj
```

Stránka programu vždy používa ten istý súbor plagátu. Pri novom mesiaci preto netreba meniť žiadny komponent ani cestu k obrázku. Súbor `src/content/program.json` je generovaný automaticky; neupravujte ho ručne.

### Kurátorské výberové galérie

Tieto galérie sú malý trvalý výber fotiek, ktoré ukazujú život zboru. Sú uložené priamo v Git repozitári a nie sú to týždenné nedeľné archívy.

Používajú sa presne tieto priečinky:

- `public/content/gallery/spolocny-cas/` – Spoločný čas v zbore
- `public/content/gallery/deti-mladez/` – Deti a mládež
- `public/content/gallery/chvaly-slovo/` – Chvály a Slovo
- `public/content/gallery/family-days/` – Family Days

Pri builde sa tieto galérie načítajú automaticky zo všetkých podporovaných obrázkov v priečinkoch. Poradie, názvy a popisy ovláda jediný súbor `src/content/galleryCategories.json`.

Týždenné nedeľné fotky nedávajte sem. Tie patria do `content-import/sundays/YYYY-MM-DD/` a po uploadnutí budú uložené v Cloudflare R2.

### Presun na iný Mac

Na inom počítači stačí:

1. naklonovať repozitár z GitHubu,
2. nainštalovať Node/npm závislosti:

   ```bash
   npm ci
   ```

3. vytvoriť lokálny `.env` podľa `.env.example`,
4. používať rovnaký príkaz:

   ```bash
   ./update-site.sh
   ```

Nie sú potrebné žiadne absolútne lokálne cesty.

## Cloudflare R2 nastavenie pre nedeľný fotoarchív

Dlhodobé nedeľné fotky sa nemajú ukladať do GitHubu. Patria do Cloudflare R2 a budú verejne dostupné cez:

```text
https://media.gmcsered.sk
```

Pred prvým nedeľným uploadom treba v Cloudflare pripraviť:

- Cloudflare účet,
- R2 bucket,
- R2 API token / prístupové kľúče,
- verejnú custom domain `media.gmcsered.sk` pre R2 bucket,
- DNS/custom-domain nastavenie v Cloudflare.

Lokálne vytvorte súbor `.env` podľa `.env.example`:

```text
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
R2_PUBLIC_BASE_URL=https://media.gmcsered.sk
```

Skutočné heslá a kľúče nikdy necommitujte. `.env` je ignorovaný Gitom.

Ak R2 ešte nie je nakonfigurované, web sa stále dá normálne buildnúť a nasadiť. R2 údaje sú potrebné iba vtedy, keď sa pokúšate nahrať nové nedeľné fotky.

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
- `/zivot-zboru` - fotogalérie z jednotlivých oblastí života zboru.
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
