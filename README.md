## Chai builder + NextJS Starter

This is a starter project for Chai builder + NextJS.

## Requirements

- `CHAIBUILDER_API_KEY` - Your Chai builder `API key`. Send us an email at [support@chaibuilder.com](mailto:support@chaibuilder.com) to get your API key.

## Features

- Website builder with drag and drop
  - Extensible builder with extension points
  - <i>Canvas DND is WIP</i>
- One click publish
- Page lock (prevent multiple users from editing the same page)
- Multi-language support
- SEO ( Basic, Open Graph, JSON-LD )
- SSR and SSG support
  - Built in Vercel ISR support
- Themeable with Tailwind CSS(Shadcn themes)
- Global blocks for reusable content
- Draft preview mode (preview changes before publishing)
- Data binding with external data (e.g. from a CMS)
- Custom page blocks (e.g. a team page with a list of team members)
- Custom page types (e.g. a blog page template for all blogs)
- AI content generation ( with multilingual support )
- AI style editing
- Dark mode support
- Custom authentication ( Implement your own auth provider )

## Stack

- NextJS15 + React 19
- Tailwind CSS 3.4+
- Shadcn UI
- TypeScript

## Development

I recomment using `pnpm` for development.

```bash
pnpm install
pnpm run dev
```
Navigate to `/chai` route to view the builder and publish.



## Deployment
I recomment using `Vercel` for deployment for better ISR support.


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
