
# Mayx-ArtStudio — Static Site (GitHub Pages ready)

## Publish (GitHub Pages)
1) Create a new repository on GitHub named `mayx-artstudio.github.io` (or any name, then enable Pages).
2) Upload all files in this folder.
3) Settings → Pages → Deploy from branch → branch `main` (or `master`), folder `/root`.
4) Wait ~1 minute; your site will be live at `https://<your-username>.github.io/<repo-name>/` (or root if repo is `<username>.github.io`).

## Configure
- Replace `YOUR_EMAIL_ADDRESS` in `script.js` (2 places) with your real email (e.g. mayx.artstudio@gmail.com).
- (Optional) Configure EmailJS:
  - In `index.html`, set `emailjs.init('YOUR_EMAILJS_PUBLIC_KEY')`.
  - In `script.js`, uncomment the `emailjs.send(...)` block and put your IDs.
- Add your social links in the About section (index.html).
- Add artworks in `data/artworks.json` with bilingual fields.

## Add Artworks (data/artworks.json)
Example:
[
  {
    "id": "work-8",
    "image": "assets/images/my_new_art.jpg",
    "title": { "it": "Titolo IT", "en": "Title EN" },
    "description": { "it": "Descrizione…", "en": "Description…" },
    "price": "€ 1.200"
  }
]

## Themes / Palettes
- Default theme: Dark minimal + cyan.
- Click the moon icon to cycle: Dark → Light → Sand (beige/minimal).
- You can set a default theme by changing `data-theme` on `<html>`.

