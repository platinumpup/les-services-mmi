# Company Under Construction PWA

A simple static "coming soon / under construction" Progressive Web App made for Cloudflare Pages.

## Files

- `index.html` — landing page
- `styles.css` — responsive visual styling
- `app.js` — service worker registration and year update
- `manifest.webmanifest` — PWA app metadata
- `sw.js` — offline cache service worker
- `assets/` — icons and favicon

## Customize

Search for these placeholders and replace them:

- `Your Company`
- `Company`
- `hello@yourcompany.com`

You can also change the colors in `styles.css` under `:root`.

## Deploy with Cloudflare Pages

### Option 1: Direct Upload

1. Log in to Cloudflare.
2. Go to **Workers & Pages**.
3. Create a Pages project.
4. Choose **Direct Upload**.
5. Upload the contents of this folder, not the zip itself.

### Option 2: GitHub/GitLab

1. Push these files to a GitHub or GitLab repository.
2. In Cloudflare Pages, connect the repo.
3. Framework preset: **None**.
4. Build command: leave empty or use `exit 0`.
5. Output directory: `/` or leave default for static files.

## Domain

After the Pages project is deployed:

1. Open the Pages project in Cloudflare.
2. Go to **Custom domains**.
3. Add your domain or subdomain.
4. Follow Cloudflare's DNS instructions.

## PWA Testing

Open the site in Chrome or Edge, then check DevTools → Application → Manifest and Service Workers.
