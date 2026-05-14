# LocalInflation

Local inflation, wage growth, and cost-pressure tools for U.S. cities.

## Run Locally

```txt
npm install
npm run dev
```

## Build

```txt
npm run typecheck
npm run build
```

## Oil Model Data

The oil-inflation simulator uses generated monthly oil, gasoline, CPI, and macro data.

```txt
npm run data:oil
npm run model:oil:lp
npm run model:oil:var
npm run model:oil:gbdt
npm run model:oil:all
```

Optional environment variables:

```txt
FRED_API_KEY=
BLS_API_KEY=
EIA_API_KEY=
```

If public/API data or Python dependencies are unavailable, the scripts write placeholder outputs so the app keeps working.

## Post-Deploy Checklist

```txt
1. Confirm https://localinflation.com loads.
2. Confirm /robots.txt loads.
3. Confirm /sitemap.xml loads.
4. Confirm /ads.txt loads.
5. Confirm page source contains ca-pub-3475349544392275 if AdSense script is enabled.
6. Submit sitemap to Google Search Console.
7. Submit sitemap to Bing Webmaster Tools.
8. Use URL inspection for key pages:
   /inflation-calculator/united-states
   /oil-price-inflation-simulator
   /cities
   /salary-inflation-calculator
```
