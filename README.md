
![E30 Gallery Logo](https://res.cloudinary.com/e30/image/upload/v1718175491/media/y1wmi8gmdbvjkpnodxq2.png)


## Description

This repo contains the website of [E30 Gallery](https://e30gallery.com), an art gallery located in Frankfurt am Main, Germany.

## Technologies

This is a [Next.js](https://nextjs.org) app using the [App Router](https://nextjs.org/docs/app). Data is sourced from [Payload](https://payloadcms.com/) and styling is done with [Tailwind CSS](https://tailwindcss.com). It is a bilingual site (English and German), using <code>paraglide-js</code> to handle localizations and translations. SMTP functionality is handled by [Resend](https://resend.com/emails).


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
