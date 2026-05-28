# Property Tax Bill — Where Your Dollars Go

A static, invoice-styled web app that takes an annual property tax amount and
shows an itemized breakdown of where the money goes across **City of
Mississauga**, **Region of Peel**, and **Province of Ontario** (education tax).

Source: `Tax bill explainer version 10 corrected by Louise (1).xlsx`
(`Tax  Inv 2026` and `Tax Invoice 2025` sheets). Budget figures are in real
**dollars**. Mississauga lines include pro-rata shares of Corporate
Transactions, Reserves, and Capital Infrastructure already allocated in the
workbook.

## Views

| Path | What it shows |
| ---- | ------------- |
| `/` (`index.html`) | Invoice-style home page (default). |
| `/details.html` | Detailed breakdown with authority column, summary cards, and budget bars. |
| `/invoice.html` | Redirects to `/` (legacy bookmark). |

Use the **Tax year** dropdown (2025 or 2026) on either view. The choice is
remembered in `sessionStorage` when you switch pages.

## Run

No build step. Open `index.html` in a browser:

```bash
open index.html
```

Or serve the folder:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Use

- The amount field at the top is the **only input** (default `$7,000`).
- Shares are **year-specific** (from the workbook’s Tax rates / invoice totals),
  not a fixed 85/15 split.
- Municipal amounts allocate across 31 services in proportion to each line’s
  budget; education tax is a separate last row.
- All line items and the grand total update live as you type. Click **Print /
  Save as PDF** for a clean printable bill.

## Files

- `index.html` — Invoice home page
- `details.html` — Detailed view
- `styles.css` — Shared styling (invoice + detailed)
- `data.js` — `window.TAX_DATA` (years, items, notes)
- `app.js` — Allocation, rendering, year switching

## Calculation

```
educationAmount = userTax × educationShare[year]
userMunicipal   = userTax × municipalShare[year]
amount(row)     = userMunicipal × (B[row] / B$36)
```

| Year | Basis (B36) | Municipal share | Education share |
| ---- | ----------- | --------------- | --------------- |
| 2026 | $1,863,784,101 | ≈ 85.94% | ≈ 14.06% |
| 2025 | $1,734,959,866 | ≈ 85.20% | ≈ 14.80% |

The total of all displayed amounts reconciles to `userTax` exactly.

## Disclaimer

*Not an official bill.* This app lets Mississauga residents see how property
tax dollars are distributed across services. The City of Mississauga does not
issue this statement. It does not work for residents of other cities.
