
![E30 Gallery Logo](https://res.cloudinary.com/e30/image/upload/v1718175491/media/y1wmi8gmdbvjkpnodxq2.png)


## Description

This repo contains the website of [E30 Gallery](https://e30gallery.com), an art gallery located in Frankfurt am Main, Germany.

## Technologies

This is a [Next.js](https://nextjs.org) app using the [App Router](https://nextjs.org/docs/app). Data is sourced from [Payload](https://payloadcms.com/). It is a bilingual site (English and German), using <code>next-intl</code> to handle localizations and translations. SMTP functionality is handled by [Resend](https://resend.com/emails).


## Installation

1. Use the git CLI to close the repo

```
gh repo clone brunosj/e30-gallery
```

2. Install dependencies

```bash
pnpm install
# or
yarn install
```

3. Navigate into the site's directory and start the development server

```bash
pnpm dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) with your browser to see the result.

## Production deployment

GitHub Actions SSHs into the VPS and runs `bash scripts/deploy.sh` from a single checkout at `/home/lando/frontend/repo`. PM2 process `e30-frontend` listens on port **5173**. Caddy proxies `e30gallery.com` to `127.0.0.1:5173`.

Keep `.env` / `.env.production` on the server (never committed).

Manual deploy:

```bash
cd /home/lando/frontend/repo && bash scripts/deploy.sh
```

Node comes from `.nvmrc` (installed via nvm on first deploy if missing). PM2 is reloaded, not deleted, so the old process serves until the new one is up. A failed build leaves PM2 untouched.

Health URL: `http://127.0.0.1:5173/api/health` (returns 503 when the CMS or its MongoDB is unreachable). Use `https://e30gallery.com/api/health` for external uptime monitoring.

Rollback (each successful deploy records its SHA in `/home/lando/frontend/last-good-sha`):

```bash
cd /home/lando/frontend/repo
git reset --hard "$(cat ../last-good-sha)"   # or a known SHA
SKIP_GIT_SYNC=1 bash scripts/deploy.sh
```

GitHub secrets: `SSH_PRIVATE_KEY`, `HOST`, `USERNAME`, `SSH_KNOWN_HOSTS` (output of `ssh-keyscan -H <host>` from a trusted network; the workflow falls back to `ssh-keyscan` with a warning if unset), optional `RESEND_API_KEY`.

Useful checks:

```bash
pm2 show e30-frontend   # cwd must be /home/lando/frontend/repo
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:5173/api/health
curl -s -o /dev/null -w "%{http_code}\n" https://e30gallery.com/api/health
```

Do **not** delete `/home/lando/cms` or `/home/lando/media`.

## Structure

```
.
├── node_modules
├── public
    ├── locales
└── src
    ├── api
    ├── common
    ├── hooks
    ├── modules
    ├── pages
    ├── styles
    ├── types
    ├── utils
├── .eslintrc.json
├── .gitignore
├── next-i18next.config.js
├── next-config.js
├── pnpm-lock.yaml
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
└── tsconfig.json


```

## Further development

This repository is maintained by [brunosj](https://github.com/brunosj).
