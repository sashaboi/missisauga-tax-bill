# Property Tax Bill — Where Your Dollars Go

A static, invoice-styled web app that takes an annual property tax amount and
shows an itemized breakdown of where the money goes across **City of
Mississauga**, **Region of Peel**, combined (cross-authority) services, and a
couple of pass-through levies (Conservation Authorities, MPAC).

Source: `Tax invoice ver 4.xlsx` (sheets `Combined budget with net adjust` and
`Summary tax invoice`). Operating budget figures are in `$ thousands`.

## Two views

| Path             | View      | What it shows                                                                 |
| ---------------- | --------- | ----------------------------------------------------------------------------- |
| `/`              | Detailed  | Sheet 1, **32 line items** — every service listed individually.               |
| `/summary`       | Summary   | Sheet 2, **27 line items** — Mississauga + Peel pairs merged where applicable, plus footnotes. |

The header has a pill nav so you can flip between them. On a static host (Netlify,
Vercel, GitHub Pages with custom 404, etc.) `/summary` resolves to `summary.html`
automatically; on a local file open or naive server, use `summary.html` directly.

## Run

No build step. Just open `index.html` in a browser:

```bash
open index.html
```

Or serve the folder:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080  (and  /summary.html )
```

## Use

- The amount field at the top of the bill is the **only input** (default `$8,000`).
- All line items, per-section subtotals, and the grand total update live as you type.
- Click **Print / Save as PDF** for a clean printable bill.

## Files

- `index.html`   — Detailed view (sheet 1)
- `summary.html` — Summary view (sheet 2)
- `styles.css`   — invoice / letterhead styling, shared
- `data.js`      — budget data for both views (`window.TAX_DATA.{detailed,summary}`)
- `app.js`       — proportional allocation, render, and view selection

## Calculation

Each line item allocates the user's tax by budget share, exactly as the
spreadsheet does:

```
amount(row) = (userTax × B[row]) / B$2
```

…where `B$2 = 1,871,900.7984` (the sum of all detailed rows). The detailed view
reconciles to the user's input to the cent.

### Note on the summary view

The source summary sheet's "Mississauga and Peel Recreation & Culture" row has
a value of `41,056.86`, which is `33,970 + 3,543.43 × 2` — i.e. the Peel Heritage
budget is double-counted. The app uses the sheet's value as-is, so at `$8,000`
the summary view's line items sum to about **`$8,015.15`** rather than
`$8,000.00`. Switch to Detailed for an exact reconciliation.
