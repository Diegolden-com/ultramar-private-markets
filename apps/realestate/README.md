# Ultramar Real Estate

This workspace serves the independent public site for `realestate.ultramar.capital`.
It is deliberately separate from the financial platform at `ultramar.capital`: it has
its own metadata, sitemap, robots policy, visual system, and deployment target.

## Local development

From the monorepo root:

```bash
corepack yarn dev:realestate
```

For a production check:

```bash
corepack yarn workspace @ultramar/realestate lint
corepack yarn workspace @ultramar/realestate typecheck
corepack yarn workspace @ultramar/realestate build
```

## Publishing inventory

`lib/listings.ts` is the only public inventory source. It reserves three property
records and does not fabricate locations, dimensions, prices, legal status, images,
or geometry.

Use [`LISTING_INTAKE.md`](./LISTING_INTAKE.md) to collect the approved facts,
media, map precision, and contact data for each of the three records before editing
`lib/listings.ts`.

Use the following states:

- `draft`: never rendered, indexed, or added to a sitemap.
- `teaser`: renders only the approved property type, name, general location, and headline. It
  remains `noindex`; it cannot expose media, maps, documents, prices, or facts.
- `published`: requires a description, commercial availability, a valid
  `updatedAt` date (`YYYY-MM-DD`), and at least one verified fact. It is eligible
  for a property page and sitemap only after a valid contact channel is configured.

Before changing a record to `teaser` or `published`, set one of these public values
in the deployment environment:

```text
NEXT_PUBLIC_REAL_ESTATE_CONTACT_EMAIL=
NEXT_PUBLIC_REAL_ESTATE_CONTACT_WHATSAPP=
```

The WhatsApp value must be a full international E.164 number. A deployment with no
valid contact channel does not expose public listing URLs.

Do not put original photos with unreviewed EXIF data, private coordinates, title
documents, or unapproved plans in `public/`. Add only re-encoded, reviewed public
image derivatives to `public/media/` and refer to them as `/media/...`. Place only
approved public documents in `public/documents/`. `publicMap` must be an explicit
HTTPS link plus a `precision` value (`general` or `exact`); do not expose a map by
default. Query-string document links are rejected so signed or temporary URLs cannot
be published accidentally. Redeploy after updating a `NEXT_PUBLIC_*` value because
those values are embedded at build time.

## Deployment

Deploy this workspace as its own Vercel project with its Root Directory set to
`apps/realestate`; its checked-in [`vercel.json`](./vercel.json) supplies the build
configuration. Then assign `realestate.ultramar.capital` to that project. The apex
Vercel project must remain responsible only for `ultramar.capital` and
`www.ultramar.capital`.

For the current Ultramar setup, link the app directory once, then deploy it:

```bash
cd apps/realestate
vercel link --yes --project ultramar-real-estate --scope pachuco
vercel deploy --prod --yes --scope pachuco
```

For CI deployments without a local link, set `VERCEL_ORG_ID` and
`VERCEL_PROJECT_ID` for this project before invoking `vercel deploy` from the
monorepo root.

After the project is assigned, create the following DNS record at the authoritative
Cloudflare zone before treating the custom domain as live:

```text
A  realestate.ultramar.capital  76.76.21.21
```

Vercel's standard deployment protection may keep generated `*.vercel.app` URLs
private; the verified custom production domain is the intended public endpoint.
