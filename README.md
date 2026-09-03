# Sabbir Ahmed Akash — Portfolio

A single-page personal portfolio. Plain HTML, CSS and JavaScript with no build step, no
framework and no dependencies to install — the folder you are looking at *is* the website.
That means you can open it in VS Code, edit a file, hit save, and refresh the browser to
see the change. It also means deploying is a matter of handing this folder to a host.

It has a dark and a light theme (button in the top-right of the nav), a direct email
button that opens the visitor's mail client with a subject and message already filled in,
and a résumé download you can swap out yourself in about ten seconds.

---

## Open it locally

The quickest route is to just double-click `index.html` — every path inside it is
relative, so it works straight off the file system with no server.

For a slightly more faithful preview (and because `404.html` needs a server to resolve its
paths), run a local web server instead. If you have the **Live Server** extension
installed, right-click `index.html` in VS Code and choose *Open with Live Server*; the
project is already configured to serve from the root on port 5500, so you'll land on
`http://localhost:5500`. Otherwise, from a terminal in this folder:

```bash
python -m http.server 5500
# then open http://localhost:5500
```

`.vscode/extensions.json` lists the four extensions worth having here (Live Server,
EditorConfig, Prettier and a spell-checker seeded with the proper nouns from your résumé so
it stops underlining "Sabbir" and "EasyOCR"). VS Code will offer to install them the first
time you open the folder.

---

## What's in here

```
sabbir-portfolio/
├── index.html              the entire site — all content lives here
├── 404.html                styled "page not found" page
├── css/
│   └── styles.css          all styling; colour tokens are at the very top
├── js/
│   └── main.js             theme toggle, scroll reveal, nav highlighting, copy-email
├── assets/
│   ├── resume/
│   │   └── resume.pdf      ← the file the download button serves
│   └── img/
│       ├── og-image.png    link preview card for social/messaging apps
│       ├── favicon.svg     browser tab icon
│       └── apple-touch-icon.png
├── netlify.toml            Netlify config (headers + caching)
├── vercel.json             Vercel config (headers + caching)
├── robots.txt              search-engine directives
├── sitemap.xml             one-URL sitemap
├── .gitignore              keeps OS junk and platform caches out of git
├── .editorconfig           consistent indentation across editors
└── .vscode/                workspace settings + extension recommendations
```

---

## Updating your résumé

Replace `assets/resume/resume.pdf` with your new PDF, keeping the filename exactly
`resume.pdf`. That's the whole job — nothing in the HTML needs touching.

The filename on disk and the filename a visitor receives are deliberately decoupled. The
download button carries `download="Sabbir-Ahmed-Akash-Resume.pdf"`, so however messy your
export name is (`Resume_final_v3_ACTUAL.pdf`), the person clicking it gets a clean, properly
named file. If you ever want to change the name they receive, edit that `download` attribute
in `index.html`.

One thing to keep in mind: when you update your résumé, the page content doesn't update
itself. If the new PDF adds a job or a project, add it to `index.html` too, or the two will
drift apart.

---

## Editing the content

Everything readable is in `index.html`, in the order it appears on screen: nav, hero,
about, skills, projects, experience, education, contact, footer. Each section is wrapped in
`<section id="...">` with a comment above it, so scrolling through the file feels like
scrolling through the page.

A few specifics worth knowing:

**Adding a project.** Copy one of the four existing `<article class="project">` blocks and
edit the heading, paragraph and tag list. The numbered eyebrows (`01`, `02`, …) are typed
into the markup rather than generated, so renumber them if you insert one in the middle.

**Project repo links.** There are four `TODO: add repo link` comments in `index.html`, one
per project. Your résumé didn't list any URLs so I left them empty rather than guess. When
you're ready, wrap each project's `<h3>` in an anchor:

```html
<h3><a href="https://github.com/sabbirahmed277/texmate">TexMate</a></h3>
```

**Your LeetCode link.** Your résumé gave the handle (`sabbir277`) but not the full URL, so
`index.html` currently points at `https://leetcode.com/u/sabbir277/`. Click it once to
confirm it lands on your profile — LeetCode has used both `/u/` and `/username` forms over
the years.

**Your phone number.** It's on your résumé but intentionally not on this page. A phone
number on a public site gets scraped and dialled by recruiters and spammers alike. If you
want it there anyway, add it next to the email in the contact section.

---

## Changing the colours

Open `css/styles.css`. The first two blocks are the entire palette: `:root` holds the dark
theme, `[data-theme="light"]` holds the light one. No rule further down the file hardcodes a
colour — they all read from these tokens. So changing the accent from indigo to, say, amber
is a two-line edit rather than a hunt through 800 lines.

The one rule to follow: **every token you add or rename must exist in both blocks.** If a
token is missing from the light block, light mode silently inherits the dark value and you
get white text on a white background. The two blocks currently have exact parity — keep it
that way.

The palette was also checked against WCAG AA (4.5:1 contrast for body text) in both themes.
If you lighten `--text-muted` or `--accent-2`, re-check them; those two are the closest to
the line.

---

## Deploying

All three options below serve this folder as-is. Pick one — you don't need to prepare
anything differently for each.

### Push to GitHub first

```bash
cd sabbir-portfolio
git init
git add .
git commit -m "Initial commit: portfolio site"
git branch -M main
git remote add origin https://github.com/sabbirahmed277/sabbir-portfolio.git
git push -u origin main
```

Create the empty `sabbir-portfolio` repo on GitHub first (no README, no .gitignore — this
folder already has both), then run the above.

### Netlify

The zero-effort version: go to [app.netlify.com/drop](https://app.netlify.com/drop) and drag
this whole folder onto the page. It's live in a few seconds on a random subdomain you can
then rename.

For automatic redeploys on every push, use *Add new site → Import an existing project* and
pick the GitHub repo instead. When it asks for build settings, leave the build command empty
and set the publish directory to `.` — `netlify.toml` already declares exactly that, so you
can usually just click through. That file also sets security headers and sensible cache
lifetimes: HTML revalidates every request so your edits appear immediately, while CSS, JS
and images are cached.

### Vercel

*Add New → Project*, import the GitHub repo, and choose **Other** as the framework preset.
Leave the build and output settings alone. `vercel.json` supplies the same headers and cache
rules as the Netlify config.

If you prefer the terminal, `npx vercel` from inside this folder works too and will walk you
through it.

### GitHub Pages

In your repo, go to *Settings → Pages*, set the source to *Deploy from a branch*, pick
`main` and the `/ (root)` folder, and save. A minute later the site is at
`https://sabbirahmed277.github.io/sabbir-portfolio/`.

**One caveat specific to this option.** Because that URL puts the site in a subfolder rather
than at a domain root, the root-relative paths in `404.html` (`/css/styles.css`,
`/assets/img/favicon.svg`) will 404. `index.html` is unaffected — it uses relative paths
throughout. Either drop the leading slashes in `404.html`:

```html
<link rel="stylesheet" href="css/styles.css">
```

or sidestep it entirely by naming the repo `sabbirahmed277.github.io`, which publishes at
the domain root and makes the existing paths correct. The second option also gives you the
much nicer URL, so it's the one I'd pick.

`netlify.toml` and `vercel.json` are simply ignored by GitHub Pages — harmless to leave in.

---

## Before you go live

There is one placeholder to replace: the domain `https://sabbir-portfolio.netlify.app/`
appears in three files as a stand-in for wherever you actually deploy. Each spot is marked
with a ⚠️ comment.

In `index.html` it's on four lines — the `canonical` link, `og:url`, and the two image meta
tags. These have to be absolute URLs; that's what makes your link render as a proper preview
card with the image when someone drops it into WhatsApp, LinkedIn or Slack. Get the domain
wrong and the preview breaks. In `robots.txt` it's the `Sitemap:` line, and in `sitemap.xml`
it's the `<loc>` element (worth refreshing `<lastmod>` at the same time).

Once the real domain is in place, you can submit `https://your-domain/sitemap.xml` to Google
Search Console if you want the site indexed sooner.

---

## Known limitations

**The theme resets on reload.** The toggle works, and on first load the page matches whatever
your operating system is set to — it even follows along live if you flip your OS theme while
the page is open. What it doesn't do is remember a manual choice across a page refresh,
because this project was built without browser storage. Adding it is three lines in
`js/main.js` using `localStorage`; ask me and I'll wire it up.

**Fonts load from Google.** Inter and JetBrains Mono come from the Google Fonts CDN, so the
first paint depends on that request. If you'd rather the site be fully self-contained, the
font files can be downloaded into `assets/` and served locally.

---

## A note on licensing

There's deliberately no `LICENSE` file. Without one, everything here is all-rights-reserved
by default, which is the right posture for a personal site — your name, your writing and
your résumé aren't things you want someone free to reuse. If you later want to let people
learn from the code, add an MIT licence covering the code only and say so explicitly in the
file.
