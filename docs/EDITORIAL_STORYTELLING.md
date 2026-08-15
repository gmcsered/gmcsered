# Editorial Storytelling

## Zámer

Web má pôsobiť ako osobné pozvanie do živého kresťanského spoločenstva. Hlavná myšlienka nie je „sme cirkev“, ale „sme spoločenstvo, kde je každý vítaný, prijatý a milovaný“.

## Nová Cesta

Príbeh je rozdelený do krátkych stránok namiesto jednej dlhej landing page:

1. Domov: prvý dojem, „Miesto, kde si vítaný“, a veľké obrazové vstupy do tém.
   Pod pozvaním „Každý je vítaný“ je lokálne promo video, ktoré sa spúšťa iba po akcii návštevníka.
2. Kto sme: cirkev ako ľudia, vzťahy, prijatie a nádej v Ježišovi Kristovi.
3. Čomu veríme: jasná kresťanská identita cez reálny monumentálny kríž a stručné výroky viery.
4. Spoločenstvo: káva, jedlo, rozhovory a blízkosť.
5. Život zboru: niekoľko skutočných fotografií bez zahltenia.
6. Nedeľné kázne: pokojný spôsob spoznať biblické vyučovanie.
7. Prvýkrát u nás: stručné uistenie, čo sa stane pri prvej návšteve.
8. Kontakt a návšteva: praktické údaje bez pocitu formulára alebo mapového portálu.

## Hero Systém

Každá stránka má jeden silný hero:

- reálna fotografia alebo schválený symbolický obraz,
- krátky slovenský nadpis,
- jeden hlavný pocit,
- maximálne dve akcie,
- konzistentná výška a typografia.

Hlavný hero nesmie byť detail jednotlivého kazateľa. Priorita je spoločenstvo, chvály, rodiny, rozhovory a spoločný život.

## Kríž Na Stránke Čomu Veríme

Stránka `/comu-verime` používa čistý fotografický podklad kríža dodaný používateľom:

- kríž je reálny, pevný a veľký,
- stojí na vrchu s modrou oblohou a prirodzeným svetlom,
- fotografia kríža pokrýva celú plochu sekcie ako hero pozadie,
- vizuál je ukotvený viac vľavo a vyššie, text plynie napravo v nižšej vrstve,
- kríž má mať dostatočný priestor vľavo a nesmie zanikať pod textom,
- text je členený do svetlých transparentných tabov,
- nie je kreslený, obrysový ani technický,
- neobsahuje vertikálnu translucentnú tyč, kruhový ornament ani blueprint geometriu,
- pôsobí ako jasný symbol nádeje, nie ako dekoratívna ilustrácia.

## Image Mapping

Aktuálne mapovanie je zapísané v `docs/ASSET_INVENTORY.md`. Najdôležitejšie použitia:

- domov: zbor počas chvál,
- Kto sme: ľudia a úsmevné spoločenstvo,
- Čomu veríme: reálny monumentálny kríž,
- Spoločenstvo: káva, jedlo, rozhovory a rodinný deň,
- Život zboru: kurátorovaná galéria 8 fotografií,
- Kázne: ostrá otvorená Biblia a fotografia Jána Tagaja pri vyučovaní,
- Prvýkrát u nás: ľudia pri vstupe a rodinný moment,
- Kontakt: zborová miestnosť počas bohoslužby. Banner s kreslom sa nepoužíva ako kontaktný vizuál.

## Motion Rules

- Žiadne skákanie, odrážanie ani agresívny stagger.
- Žiadne autoplay video.
- Žiadna externá animačná knižnica.
- Hover stav musí mať použiteľný focus stav.
- Motion nesmie posúvať layout ani zakrývať text.
- Obrázky môžu mať iba veľmi jemné dýchanie alebo hover pohyb.

## Reduced Motion

Pri `prefers-reduced-motion: reduce`:

- reveal prvky sú viditeľné hneď,
- obrazové animácie sa vypnú,
- obsah ostáva v rovnakom poradí,
- navigácia a CTA zostávajú plne použiteľné.

## Prvá Návšteva

Stránka `/prva-navsteva` má znižovať neistotu. Nepoužíva dlhú sedemkrokovú timeline; drží sa štyroch krokov:

- Prídete,
- Nájdete si miesto,
- Bohoslužba,
- Spoločný čas.

Praktické uistenia sú súčasťou rovnakej obsahovej sekcie, aby stránka nepôsobila ako ďalší dlhý slide.

## Výmena Fotografií

Pri pridaní nových fotiek do `/Users/patus/Documents/GMC`:

1. Vyberte najvyššie rozlíšenie a najprirodzenejšiu chvíľu.
2. Nepoužívajte detail kazateľa ako hlavný hero.
3. Pri deťoch preferujte širšie verejné zábery a overte súhlas.
4. Exportujte WebP výstup do `public/assets/church`.
5. Zapíšte rozmery, alt text a zdrojový súbor do `churchContent.ts` a `docs/ASSET_INVENTORY.md`.
6. Spustite `npm run typecheck` a `npm run build`.

## Copy Direction

Text má byť prirodzený, slovenský a osobný. Používajte krátke vety, ktoré človeka uistia a pozvú. Vyhýbajte sa formálnemu inštitucionálnemu tónu, neovereným sľubom a príliš marketingovým frázam.
