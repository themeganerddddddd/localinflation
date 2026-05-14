# LocalInflation Deployment

## Recommended deploy path

Deploy the standalone app folder:

```txt
C:\Users\WestleySturhan\Downloads\v2-tenantadvocate-main\LocalDollar
```

The app is named LocalInflation in the UI and package metadata.

## Vercel settings

Use the default Next.js settings:

```txt
Framework Preset: Next.js
Build Command: npm run build
Install Command: npm install
Output Directory: .next
```

## Environment variables

Set these in Vercel:

```txt
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-your-adsense-id
NEXT_PUBLIC_ADSENSE_SLOT_ID=your-display-ad-slot-id
BLS_API_KEY=your-bls-api-key
```

## AdSense slots

Ad placements are intentionally below the core calculator/result areas:

```txt
homepage-lower
inflation-calculator-after-results
inflation-calculator-lower-body
future-costs-lower-body
oil-simulator-lower-body
cities-lower-body
rankings-lower-body
highest-inflation-lower-body
wages-vs-inflation-lower-body
{city-slug}-results
```

For launch, the fastest setup is to create one responsive display ad unit in AdSense and set its numeric slot ID as `NEXT_PUBLIC_ADSENSE_SLOT_ID`. Later, you can replace individual logical slot names with separate numeric slot IDs if you want per-page reporting.

## Before launch checklist

```txt
1. Add production domain to NEXT_PUBLIC_SITE_URL.
2. Add AdSense publisher ID.
3. Add a numeric AdSense display ad slot ID.
4. Confirm /privacy, /terms, /methodology, /about are visible.
5. Confirm sitemap.xml and robots.txt load.
6. Submit the domain to Google Search Console.
7. Submit the domain to AdSense for review.
```
