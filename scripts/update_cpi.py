import json
import math
import os
from pathlib import Path
from urllib import request

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
GENERATED_DIR = DATA_DIR / "generated"
CONFIG_DIR = DATA_DIR / "config"

SEED_LOCATIONS = [
    ("united-states", "United States", "United States", "US", "national_cpi", None, ["new-york", "los-angeles", "chicago"]),
    ("new-york", "New York City", "New York-Newark-Jersey City, NY-NJ-PA", "NY-NJ-PA", "direct_metro_cpi", None, ["philadelphia", "boston", "washington-dc"]),
    ("los-angeles", "Los Angeles", "Los Angeles-Long Beach-Anaheim, CA", "CA", "direct_metro_cpi", None, ["riverside", "san-diego", "san-francisco"]),
    ("chicago", "Chicago", "Chicago-Naperville-Elgin, IL-IN-WI", "IL-IN-WI", "direct_metro_cpi", None, ["milwaukee", "indianapolis", "st-louis"]),
    ("dallas", "Dallas", "Dallas-Fort Worth-Arlington, TX", "TX", "direct_metro_cpi", None, ["houston", "austin", "san-antonio"]),
    ("houston", "Houston", "Houston-The Woodlands-Sugar Land, TX", "TX", "direct_metro_cpi", None, ["dallas", "san-antonio", "new-orleans"]),
    ("washington-dc", "Washington DC", "Washington-Arlington-Alexandria, DC-VA-MD-WV", "DC-MD-VA-WV", "direct_metro_cpi", None, ["baltimore", "philadelphia", "richmond"]),
    ("philadelphia", "Philadelphia", "Philadelphia-Camden-Wilmington, PA-NJ-DE-MD", "PA-NJ-DE-MD", "direct_metro_cpi", None, ["new-york", "baltimore", "washington-dc"]),
    ("miami", "Miami", "Miami-Fort Lauderdale-West Palm Beach, FL", "FL", "direct_metro_cpi", None, ["tampa", "orlando", "jacksonville"]),
    ("atlanta", "Atlanta", "Atlanta-Sandy Springs-Roswell, GA", "GA", "direct_metro_cpi", None, ["charlotte", "nashville", "birmingham"]),
    ("boston", "Boston", "Boston-Cambridge-Newton, MA-NH", "MA-NH", "direct_metro_cpi", None, ["providence", "hartford", "new-york"]),
    ("phoenix", "Phoenix", "Phoenix-Mesa-Scottsdale, AZ", "AZ", "direct_metro_cpi", None, ["las-vegas", "san-diego", "denver"]),
    ("san-francisco", "San Francisco", "San Francisco-Oakland-Hayward, CA", "CA", "direct_metro_cpi", None, ["san-jose", "sacramento", "los-angeles"]),
    ("riverside", "Riverside", "Riverside-San Bernardino-Ontario, CA", "CA", "regional_proxy_cpi", "los-angeles", ["los-angeles", "san-diego", "phoenix"]),
    ("detroit", "Detroit", "Detroit-Warren-Dearborn, MI", "MI", "direct_metro_cpi", None, ["cleveland", "chicago", "columbus"]),
    ("seattle", "Seattle", "Seattle-Tacoma-Bellevue, WA", "WA", "direct_metro_cpi", None, ["portland", "san-francisco", "denver"]),
    ("minneapolis", "Minneapolis", "Minneapolis-St. Paul-Bloomington, MN-WI", "MN-WI", "direct_metro_cpi", None, ["milwaukee", "chicago", "kansas-city"]),
    ("san-diego", "San Diego", "San Diego-Carlsbad, CA", "CA", "regional_proxy_cpi", "los-angeles", ["los-angeles", "riverside", "phoenix"]),
    ("tampa", "Tampa", "Tampa-St. Petersburg-Clearwater, FL", "FL", "regional_proxy_cpi", "miami", ["orlando", "miami", "jacksonville"]),
    ("denver", "Denver", "Denver-Aurora-Lakewood, CO", "CO", "direct_metro_cpi", None, ["salt-lake-city", "phoenix", "kansas-city"]),
    ("baltimore", "Baltimore", "Baltimore-Columbia-Towson, MD", "MD", "regional_proxy_cpi", "washington-dc", ["washington-dc", "philadelphia", "richmond"]),
    ("st-louis", "St. Louis", "St. Louis, MO-IL", "MO-IL", "direct_metro_cpi", None, ["kansas-city", "chicago", "louisville"]),
    ("orlando", "Orlando", "Orlando-Kissimmee-Sanford, FL", "FL", "regional_proxy_cpi", "miami", ["tampa", "miami", "jacksonville"]),
    ("charlotte", "Charlotte", "Charlotte-Concord-Gastonia, NC-SC", "NC-SC", "regional_proxy_cpi", "south", ["raleigh", "atlanta", "nashville"]),
    ("san-antonio", "San Antonio", "San Antonio-New Braunfels, TX", "TX", "regional_proxy_cpi", "dallas", ["austin", "houston", "dallas"]),
    ("portland", "Portland", "Portland-Vancouver-Hillsboro, OR-WA", "OR-WA", "direct_metro_cpi", None, ["seattle", "sacramento", "san-francisco"]),
    ("sacramento", "Sacramento", "Sacramento-Roseville-Arden-Arcade, CA", "CA", "regional_proxy_cpi", "san-francisco", ["san-francisco", "san-jose", "portland"]),
    ("pittsburgh", "Pittsburgh", "Pittsburgh, PA", "PA", "direct_metro_cpi", None, ["cleveland", "columbus", "philadelphia"]),
    ("las-vegas", "Las Vegas", "Las Vegas-Henderson-Paradise, NV", "NV", "regional_proxy_cpi", "west", ["phoenix", "salt-lake-city", "los-angeles"]),
    ("austin", "Austin", "Austin-Round Rock, TX", "TX", "regional_proxy_cpi", "dallas", ["san-antonio", "houston", "dallas"]),
    ("cincinnati", "Cincinnati", "Cincinnati, OH-KY-IN", "OH-KY-IN", "direct_metro_cpi", None, ["columbus", "louisville", "indianapolis"]),
    ("kansas-city", "Kansas City", "Kansas City, MO-KS", "MO-KS", "direct_metro_cpi", None, ["st-louis", "oklahoma-city", "denver"]),
    ("columbus", "Columbus", "Columbus, OH", "OH", "regional_proxy_cpi", "midwest", ["cincinnati", "cleveland", "pittsburgh"]),
    ("indianapolis", "Indianapolis", "Indianapolis-Carmel-Anderson, IN", "IN", "regional_proxy_cpi", "midwest", ["chicago", "cincinnati", "louisville"]),
    ("cleveland", "Cleveland", "Cleveland-Elyria, OH", "OH", "direct_metro_cpi", None, ["pittsburgh", "columbus", "detroit"]),
    ("san-jose", "San Jose", "San Jose-Sunnyvale-Santa Clara, CA", "CA", "regional_proxy_cpi", "san-francisco", ["san-francisco", "sacramento", "los-angeles"]),
    ("nashville", "Nashville", "Nashville-Davidson--Murfreesboro--Franklin, TN", "TN", "regional_proxy_cpi", "south", ["atlanta", "charlotte", "louisville"]),
    ("virginia-beach", "Virginia Beach", "Virginia Beach-Norfolk-Newport News, VA-NC", "VA-NC", "regional_proxy_cpi", "south", ["richmond", "washington-dc", "raleigh"]),
    ("providence", "Providence", "Providence-Warwick, RI-MA", "RI-MA", "regional_proxy_cpi", "boston", ["boston", "hartford", "new-york"]),
    ("jacksonville", "Jacksonville", "Jacksonville, FL", "FL", "regional_proxy_cpi", "miami", ["orlando", "tampa", "atlanta"]),
    ("milwaukee", "Milwaukee", "Milwaukee-Waukesha-West Allis, WI", "WI", "direct_metro_cpi", None, ["chicago", "minneapolis", "detroit"]),
    ("oklahoma-city", "Oklahoma City", "Oklahoma City, OK", "OK", "regional_proxy_cpi", "south", ["dallas", "kansas-city", "austin"]),
    ("raleigh", "Raleigh", "Raleigh, NC", "NC", "regional_proxy_cpi", "south", ["charlotte", "richmond", "virginia-beach"]),
    ("memphis", "Memphis", "Memphis, TN-MS-AR", "TN-MS-AR", "regional_proxy_cpi", "south", ["nashville", "birmingham", "st-louis"]),
    ("richmond", "Richmond", "Richmond, VA", "VA", "regional_proxy_cpi", "south", ["washington-dc", "virginia-beach", "raleigh"]),
    ("new-orleans", "New Orleans", "New Orleans-Metairie, LA", "LA", "regional_proxy_cpi", "south", ["houston", "memphis", "birmingham"]),
    ("louisville", "Louisville", "Louisville/Jefferson County, KY-IN", "KY-IN", "regional_proxy_cpi", "midwest", ["cincinnati", "indianapolis", "nashville"]),
    ("salt-lake-city", "Salt Lake City", "Salt Lake City, UT", "UT", "regional_proxy_cpi", "west", ["denver", "las-vegas", "phoenix"]),
    ("hartford", "Hartford", "Hartford-West Hartford-East Hartford, CT", "CT", "regional_proxy_cpi", "boston", ["providence", "boston", "new-york"]),
    ("buffalo", "Buffalo", "Buffalo-Cheektowaga-Niagara Falls, NY", "NY", "regional_proxy_cpi", "northeast", ["cleveland", "pittsburgh", "new-york"]),
    ("birmingham", "Birmingham", "Birmingham-Hoover, AL", "AL", "regional_proxy_cpi", "south", ["atlanta", "memphis", "nashville"]),
]

PROXY_SERIES = {
    "south": "CUUR0300SA0",
    "west": "CUUR0400SA0",
    "midwest": "CUUR0200SA0",
    "northeast": "CUUR0100SA0",
}

def mock_index(slug: str, year: int) -> float:
    seed = sum(ord(c) for c in slug)
    weighted_seed = sum((index + 1) * ord(char) for index, char in enumerate(slug))
    base_rate = 0.018 + (weighted_seed % 37) / 10000
    level_adjustment = 1 + ((weighted_seed % 29) - 14) / 1000
    cycle = 1 + math.sin((year - 1997 + (weighted_seed % 7)) / 3.2) * ((weighted_seed % 9) / 1000)
    shock = 0.045 if year in (2021, 2022) else 0
    years = year - 1997
    value = 160 * level_adjustment * cycle * ((1 + base_rate) ** years)
    if year >= 2021:
        value *= 1 + shock
    if year >= 2023:
        value *= 1.025
    return round(value, 3)

def fetch_bls_series(series_id: str, start_year: int, end_year: int):
    api_key = os.environ.get("BLS_API_KEY")
    payload = {
        "seriesid": [series_id],
        "startyear": str(start_year),
        "endyear": str(end_year),
    }
    if api_key:
        payload["registrationkey"] = api_key
    req = request.Request(
        "https://api.bls.gov/publicAPI/v2/timeseries/data/",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    with request.urlopen(req, timeout=30) as response:
        raw = json.loads(response.read().decode("utf-8"))
    by_year = {}
    for item in raw.get("Results", {}).get("series", [{}])[0].get("data", []):
        if item.get("period") == "M13":
            by_year[int(item["year"])] = float(item["value"])
    return [{"year": year, "index": by_year[year]} for year in sorted(by_year)]

def main():
    DATA_DIR.mkdir(exist_ok=True)
    GENERATED_DIR.mkdir(exist_ok=True)
    CONFIG_DIR.mkdir(exist_ok=True)

    metros = []
    cpi = {}
    config = {}
    for slug, display, full, region, coverage, fallback, nearby in SEED_LOCATIONS:
        cpi_series_id = PROXY_SERIES.get(fallback or "", "CUUR0000SA0" if slug == "united-states" else "VERIFY")
        wage_series_id = "VERIFY"
        metros.append({
            "slug": slug,
            "display_name": display,
            "full_name": full,
            "state_or_region": region,
            "page_type": "national" if slug == "united-states" else "metro",
            "data_coverage": coverage,
            "cpi_series_id": cpi_series_id,
            "wage_series_id": wage_series_id,
            "fallback_cpi_slug": fallback,
            "nearby": nearby,
        })
        config[slug] = {"series_id": cpi_series_id, "coverage": coverage}
        cpi[slug] = [{"year": year, "index": mock_index(slug, year)} for year in range(1997, 2027)]

    (DATA_DIR / "metros.json").write_text(json.dumps(metros, indent=2) + "\n", encoding="utf-8")
    (CONFIG_DIR / "cpi_series.json").write_text(json.dumps(config, indent=2) + "\n", encoding="utf-8")
    (GENERATED_DIR / "cpi.json").write_text(json.dumps(cpi, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(metros)} metro records and CPI series.")

if __name__ == "__main__":
    main()
