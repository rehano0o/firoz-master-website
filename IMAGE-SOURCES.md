# Image sources and licensing record

Last updated: 8 November 2026.

## Photographs used on the website

All photographs currently on the website are the **original Firoz Master product photographs** supplied with the project ZIP. They are the business's own images, so no third-party licence or attribution applies. The files in `assets/` are kept exactly as supplied. Smaller WebP copies in `assets/optimized/` were generated from them for faster loading.

| File (original, unchanged) | Shown as | Collection(s) |
|---|---|---|
| `assets/green-embroidered-kurta.webp` | Green embroidered kurta | Kurta Pajamas |
| `assets/ivory-sherwani.webp` | Ivory embroidered sherwani | Sherwanis, Wedding Wear |
| `assets/maroon-embroidered-kurta.webp` | Maroon embroidered kurta | Kurta Pajamas |
| `assets/navy-embroidered-kurta.webp` | Navy embroidered kurta | Kurta Pajamas, Wedding Wear |
| `assets/cream-nehru-jacket.jpg` | Cream Nehru jacket | Nehru Jackets |
| `assets/embroidered-waistcoat.jpg` | Embroidered waistcoat | Waistcoats |
| `assets/matching-family-outfits.webp` | Matching outfits for adult and child | Matching Family Outfits |
| `assets/firoz-master-logo.jpg` | Brand logo (FM mark cropped for header, footer and favicon) | n/a |

The embroidery close-ups (`assets/optimized/detail-*.webp`) are crops of the photographs above.
Fonts: Bodoni Moda and Jost, SIL Open Font License 1.1 (licence files in `assets/fonts/`).

## Photographs added on 9 November 2026 (business photographs, `photo.zip`)

22 further original photographs are in `assets/gallery/` (each as a 800px WebP plus a 360px thumbnail), registered in `js/products.js`. The three homepage hero photographs are 9:16 crops of three of them (`hero-*.webp`). Of the 31 supplied, 9 were not added because they show the same garment as another photograph or as one already on the site (kept: the existing versions).

Collections: Tuxedos, 3-Piece Suits, Blazers, Sherwanis, Wedding Wear, Indo-Western (new), Kurta Pajamas, Waistcoats, Fabric Collection (new).
Coat Pants / Formal Suits has no photograph yet and still shows its typographic card.

Stock/editorial photographs have not been added.

## How to add stock photographs safely

1. Download from a site whose licence allows commercial website use (Unsplash and Pexels licences generally do; read the current licence page for each image).
2. Save into `assets/gallery/` with a descriptive name, for example `three-piece-suit-charcoal.webp`. Resize to roughly 1200 px on the long edge and export as WebP, plus a ~360 px wide copy.
3. Add an entry to `FM_PRODUCTS` in `js/products.js` with `source: 'editorial'`. Such photos automatically show an "Inspiration photo" label and are never presented as Firoz Master's own work.
4. Record it in the table below.

| File | Source URL | Photographer | Licence (and link) | Attribution required? | Date checked |
|---|---|---|---|---|---|
| (none added yet) | | | | | |
