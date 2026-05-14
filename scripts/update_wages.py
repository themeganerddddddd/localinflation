import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
GENERATED_DIR = DATA_DIR / "generated"

def mock_wage(slug: str, year: int) -> float:
    seed = sum(ord(c) for c in slug)
    base = 42000 + (seed % 18000)
    growth = 0.026 + (seed % 9) / 1000
    if year >= 2021:
        growth += 0.004
    return round(base * ((1 + growth) ** (year - 1997)), 2)

def main():
    metros = json.loads((DATA_DIR / "metros.json").read_text(encoding="utf-8"))
    wages = {
        metro["slug"]: [{"year": year, "wage": mock_wage(metro["slug"], year)} for year in range(1997, 2027)]
        for metro in metros
    }
    GENERATED_DIR.mkdir(exist_ok=True)
    (GENERATED_DIR / "wages.json").write_text(json.dumps(wages, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote wage series for {len(wages)} locations.")

if __name__ == "__main__":
    main()
