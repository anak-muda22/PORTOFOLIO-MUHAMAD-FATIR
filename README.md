# Muhamad Fatir: IT Portfolio
React + TypeScript + Vite + Tailwind + Three.js. Static site for GitHub Pages / Vercel.

## Run
`npm install` then `npm run dev`. Production: `npm run build`.

## Edit content
Everything lives in `src/data/` (`profile.ts`, `skills.ts`, `projects.ts`, `interests.ts`). Add project details in `projects.ts`; fill its `demo` field with the live website URL when available. Empty education/experience/languages are hidden or replaced by a neutral message. Set `email`, `github`, `linkedin`, `location` in `profile.ts`.

The home page includes a Three.js ID card with a draggable lanyard, a circular cursor mask, and gentle swing motion. Replace `public/profile.jpeg` with your own portrait to update the image. The blue background in the current portrait is removed in the shader. Section and card entrance animations replay when they re-enter the viewport; reduced-motion preferences are respected.

The personal soundtrack is served locally from `public/music/soundtrack.mp3` in a compact Spotify-inspired player with a play/pause button. Playback starts automatically when allowed and loops; browsers that block autoplay show a prompt to press play.

Technology logos use official Simple Icons SVG marks; role and category cards use matching interface icons. Employer and school logos are not substituted with unofficial marks.

## Upload certificates (no code edits)
1. On GitHub open `public/certificates/` → **Add file → Upload files** (png, jpg, webp, pdf) → Commit to `main`.
2. The *Update certificates.json* action regenerates `public/certificates.json`; *Deploy* republishes the site.
3. Optional details: add `public/certificates/metadata.json`:
```json
{ "my-cert.pdf": { "title": "Name", "issuer": "Org", "date": "2025-06-01", "credentialId": "ABC", "verifyUrl": "https://...", "category": "Cybersecurity" } }
```
Without metadata the file name is the title, nothing else is invented.

## Deploy
Repo Settings → Pages → Source: **GitHub Actions**. Replace `USERNAME/REPO` in `public/sitemap.xml` and `robots.txt`.

## CV
The download button uses `public/Muhamad-Fatir-CV.pdf`. Update profile, education, and experience details in `src/data/profile.ts`, and skills in `src/data/skills.ts`.
