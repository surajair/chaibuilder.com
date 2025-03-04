import { getChaiBuilderTailwindConfig } from '@chaibuilder/pages/tailwind'
export default getChaiBuilderTailwindConfig([
  './app/(chaibuilder)/**/*.{js,ts,jsx,tsx,mdx}',
  './node_modules/@chaibuilder/pages/dist/**/*.{js,cjs}',
])
