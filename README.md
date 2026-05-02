# Property Tax Bill — Where Your Dollars Go

A static, invoice-styled web app that takes an annual property tax amount and
shows an itemized breakdown of where the money goes across **City of
Mississauga**, **Region of Peel**, **Province of Ontario** (education tax), and
two pass-through levies (Conservation Authorities, MPAC).

Source: `Tax bill explainer version 6 for Onkar.xlsx`, active sheet
`Tax calulator sheet 2` (31 service rows). Budget figures are in real
**dollars** (no longer thousands), with Mississauga's Corporate Transactions,
One-time Reserves, and the Capital Infrastructure & Debt Repayment Levy
already pro-rata allocated into each Mississauga service line.

## Two views

| Path                | View     | What it shows |
| ------------------- | -------- | ------------- |
| `/` (`index.html`)  | Detailed | All 31 services + Education Tax line, sorted by budget. |
| `/invoice.html`     | Invoice  | Same data on a clean white invoice template, with Mississauga + Peel pairs (Roads, IT, Facilities, Planning) listed back-to-back. |

The Invoice page also has a hamburger menu in the header to flip between views.

## Run

No build step. Just open `index.html` in a browser:

```bash
open index.html
```

Or serve the folder:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Use

- The amount field at the top is the **only input** (default `$7,000`, the
  v6 sheet's default for an average Mississauga household).
- The amount is split **85% municipal / 15% education**, matching the City of
  Mississauga's published 2026 breakdown
  (City 37%, Peel 48%, Education 15%).
- The 85% municipal portion is allocated across the 31 services in proportion
  to each service's budget. The 15% education portion is shown as its own
  "Education Tax" line at the bottom.
- All line items, per-section subtotals, and the grand total update live as
  you type. Click **Print / Save as PDF** for a clean printable bill.

## Files

- `index.html`   — Detailed view
- `invoice.html` — Invoice view (clean template)
- `styles.css`   — Shared styling, plus an `invoice`-scoped block
- `data.js`      — `window.TAX_DATA` (basis, shares, items, notes)
- `app.js`       — Allocation, rendering, and view switching

## Calculation

```
userMunicipal = userTax × 0.85
userEducation = userTax × 0.15

amount(row)   = userMunicipal × (B[row] / B$33)   // 31 service rows
amount(edu)   = userEducation                     // synthetic last row
```

…where `B$33 = $1,863,397,268.75` (the sum of all 31 service rows). The total
of all displayed amounts always reconciles to `userTax` exactly.

## Source notes

The workbook ships note text for 15 numbered items (General Government,
Facilities, Planning & Building, Housing, Seniors Services, Income Support,
Business Services, Community Investment, Peel Property Management, Peel
Development Services, Conservation Authorities, MPAC, Education Tax,
Recreation & Culture, Regulatory Services). These render as `[n]` references
in the line items and as click-through `i` icons next to the service name.

The disclaimer copy is taken from the source: *"This is not a real property tax
bill from the City of Mississauga. This is an app that allows you to get a
break down of what services your property taxes pay for. This should be used
only city of Mississauga residents. It will not work for residents of other
cities."*
