// PM2 ecosystem — process runs from the git checkout.
// Docs: ldz-kit/infra/deploy.md
//
// Prefer calling `next` directly. Corepack's `pnpm` shim is a Node script;
// `script: 'pnpm'` + `interpreter: 'bash'` makes PM2 run it as shell and fail with
// `process.env.COREPACK_...: command not found`.

module.exports = {
  apps: [
    {
      name: 'e30-frontend',
      cwd: '/home/lando/frontend/repo',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 5173',
      env: {
        PORT: 5173,
        NODE_ENV: 'production',
        NODE_OPTIONS: '--no-deprecation',
      },
    },
  ],
}
