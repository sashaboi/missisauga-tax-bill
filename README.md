# Property Tax Bill — Where Your Dollars Go

A static, invoice-styled web app that takes an annual property tax amount and
shows an itemized breakdown of where the money goes across **City of
Mississauga**, **Region of Peel**, and other levies (Conservation Authorities,
MPAC).

Source data: `Tax invoice ver 3.xlsx` (operating budget figures in $ thousands).

## Run

No build step. Just open `index.html` in a browser, e.g.:

```bash
open index.html
```

Or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Use

- The amount field at the top of the bill is the **only input** (default `$6,600`).
- All line items, the per-section subtotals, and the grand total update live as
  you type.
- Click **Print / Save as PDF** to get a clean printable version of the bill.

## Files

- `index.html` — invoice layout
- `styles.css` — tax-bill / letterhead styling
- `data.js`    — budget data extracted from the spreadsheet
- `app.js`     — proportional allocation + render

## Calculation

Each line item allocates the tax dollar by budget share:

```
amount(item) = userTax * budget(item) / sum(budget)
```

This matches the formula used in the spreadsheet: `=(C$2 * B[row]) / B$2`.
