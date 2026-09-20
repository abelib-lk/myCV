# Asanka B. Ekanayake — Portfolio / CV

A static, single-page portfolio deployed on Netlify at
**https://asanka-div.netlify.app/**

All CV content lives in [`mycv.json`](mycv.json). The page is rendered from that
file at load time, so **editing `mycv.json` is how you update the site** — you
should rarely need to touch the HTML.

---

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page shell, SEO/Open Graph meta, JSON-LD, and the contact form |
| `mycv.json` | **All CV content** — the single source of truth |
| `script.js` | Renders `mycv.json` into the page; nav, theme toggle, form submit |
| `style.css` | Dark + light glassmorphism themes, and the print/PDF stylesheet |
| `netlify.toml` | Publish directory, security headers, cache rules |
| `success.html` | Fallback thank-you page after a form post (no-JS path) |
| `404.html` | Not-found page (Netlify serves this automatically) |
| `favicon.svg` | "AE" monogram icon |
| `og-image.png` | 1200×630 social sharing preview image |
| `robots.txt`, `sitemap.xml` | Search engine hints |
| `site.webmanifest` | Installable-app metadata |

Not deployed (listed in `.gitignore`): `sms.php`, `myCV.zip`.

---

## Editing your CV

Open `mycv.json` and edit. Keep the existing shape:

```jsonc
"personal_information": {
  "full_name": "...",
  "professional_title": "...",
  "tagline": "...",            // one line under the title
  "availability": "...",       // green status pill; remove to hide it
  "years_experience": "12+",   // shown in the hero stats
  ...
}
```

Skills are an **array of groups**, so the headings read exactly as you type them:

```jsonc
"technical_proficiencies": [
  { "category": "Automation & RPA", "items": ["UiPath", "..."] }
]
```

Project entries may include any of `components`, `features`, `integrations`, or
`projects` — each renders as a labelled bullet list on the card. Add a `link`
to get a "View Project" button.

Certifications are grouped by `category`. Within an item, a `link` renders a
clickable **Verify** button; if there's no link, a `verification`,
`certificate`, `code`, or `description` value is shown as plain text instead.

> After editing, check the JSON is still valid:
> `node -e "JSON.parse(require('fs').readFileSync('mycv.json','utf8'))"`

---

## Previewing locally

The page fetches `mycv.json`, so it must be served over HTTP —
opening `index.html` directly from disk will fail on the fetch.

```bash
# from this folder
npx serve .
# or, since you have XAMPP:  http://localhost/myCV/
```

Note: the contact form only works on the deployed Netlify site. Locally the
submit will fail and show the "please email instead" fallback message.

---

## Deploying

The site is wired to GitHub, so **any push to `main` auto-deploys**:

```bash
git add -A
git commit -m "Update CV"
git push
```

Netlify builds in a few seconds. There is no build step — files are served
straight from the repo root.

### First-time setup (already done once)

1. Push this repo to GitHub.
2. In Netlify, open the **asanka-div** site →
   *Site configuration → Build & deploy → Continuous deployment* →
   **Link repository**, and pick the GitHub repo.
3. Build settings: leave **build command empty**, publish directory `.`
   (`netlify.toml` already declares this).

### Contact form

The form uses **Netlify Forms** (free tier: 100 submissions/month).

- In Netlify: *Site configuration → Forms* → make sure **form detection is
  enabled**. Netlify finds the form on the next deploy.
- Then *Forms → Form notifications* → **Add notification → Email notification**
  so submissions land in your inbox.
- Submissions are also listed under the **Forms** tab.
- A hidden `bot-field` honeypot filters most spam.

---

## Download CV as PDF

The **Download CV** button calls the browser's print dialog against a dedicated
print stylesheet — navigation, the contact form, hero buttons and stats are
stripped, colours flatten to black-on-white, and the layout reflows to ~5 pages.
Choose *Save as PDF* in the dialog.

---

## Notes

- Theme preference (dark/light) is remembered in `localStorage`, and defaults to
  your OS setting on first visit.
- Animations are disabled automatically for visitors who set
  *prefers-reduced-motion*.
- `netlify.toml` sets a Content-Security-Policy. If you add a new third-party
  script, font, or image host, add it there too or the browser will block it.
