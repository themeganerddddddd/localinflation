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
