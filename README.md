# The Firoz Master Bespoke & Tailoring: website

Static website (HTML5, CSS3, vanilla JavaScript). No frameworks, no build step, no backend, no paid services.

## Run locally
Open `index.html` in any modern browser. All paths are relative.

## Publish free on GitHub Pages
1. Create a GitHub repository and upload the **contents** of this folder (so `index.html` sits at the repository root).
2. Settings > Pages > Build and deployment > Deploy from a branch > `main` / `(root)` > Save.
3. After it is live, edit `index.html` and add `<link rel="canonical" href="https://YOUR-URL/">`, and make the `og:image` value an absolute URL so link previews work.

## Project structure
```
index.html          page (semantic HTML, SEO and social meta, structured data)
styles.css          all styles; colour tokens at the top (:root)
js/config.js        ★ business details: WhatsApp number, phones, email, Instagram, Google link
js/products.js      ★ collections (12) and gallery photographs
js/main.js          WhatsApp links, mobile menu, enquiry form, scroll reveal
js/gallery.js       collections grid, filters, product cards, full-screen viewer
assets/             original photographs and logo (unchanged)
assets/optimized/   WebP sizes, embroidery close-ups, FM mark
assets/gallery/     put new photographs here
assets/fonts/       Bodoni Moda + Jost (open licence)
IMAGE-SOURCES.md    image source and licence record
```

## Change the WhatsApp number (one place)
Edit `whatsappNumber` in `js/config.js` (digits only, country code first, e.g. `919820458461`). Every WhatsApp button, product card, the viewer and the enquiry form read it. It currently uses **+91 98204 58461**, the number the site already used. The three listed phone numbers are used for calls only; none is assumed to be on WhatsApp.

## Add or change gallery photographs
Add the image to `assets/gallery/`, then add an entry to `FM_PRODUCTS` in `js/products.js` (title, categories, image paths, pixel width/height, alt text). Cards, filters, viewer and the WhatsApp message are generated automatically. A commented template for the black embroidered tuxedo is included. Photos marked `source: 'editorial'` show an "Inspiration photo" label.

## How enquiries work
- **Product cards, collection cards, viewer:** open WhatsApp with a message naming the design and its collection.
- **Custom Design:** the customer taps the button, WhatsApp opens, and they attach their reference photograph in the chat themselves. Nothing is uploaded through the website.
- **Custom Embroidery:** opens WhatsApp with a message about patterns, names or motifs.
- **Book a consultation / occasion buttons:** open a form (name, mobile, category, occasion, date, colour, requirements), validated in the browser, which opens WhatsApp with a formatted message. Nothing is stored.
- No prices appear anywhere. Appointments and walk-ins are left to WhatsApp; no policy is stated.

## Content that still needs real business information
- Black embroidered tuxedo photograph (not received) and photographs for 3-Piece Suits, Coat Pants / Formal Suits and Blazers (see `IMAGE-SOURCES.md`).
- Confirm which collection each existing photograph belongs to (for example the ivory sherwani and navy kurta are also shown under Wedding Wear).
- Confirm the five craft-process steps and the collection descriptions are accurate.
- Opening hours and appointment policy (deliberately not stated).
- The supplied logo file is cropped; a full logo would improve the header.
- The embedded map needs internet; the "View on Google" button opens the Google listing.
