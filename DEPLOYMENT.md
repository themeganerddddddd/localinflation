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
BLS_API_KEY=your-bls-api-key
```

## AdSense

The AdSense publisher script is included globally in `app/layout.tsx` with:

```txt
ca-pub-3475349544392275
```

The site does not use placeholder ad blocks. Confirm `/ads.txt` is reachable after deployment.

## Before launch checklist

```txt
1. Add production domain to NEXT_PUBLIC_SITE_URL.
2. Confirm the AdSense script appears in page source.
3. Confirm /ads.txt loads.
4. Confirm /privacy, /terms, /methodology, /about are visible.
5. Confirm sitemap.xml and robots.txt load.
6. Submit the domain to Google Search Console.
7. Submit the domain to AdSense for review.
```
