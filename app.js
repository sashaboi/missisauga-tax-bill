(function () {
  "use strict";

  const { basisTotal, items } = window.TAX_DATA;
  // Math follows the source spreadsheet exactly:
  //   amount(row) = (userTax * B[row]) / B$2
  // where B$2 is the basisTotal value provided in data.js (1,082,479.7984).
  // The line items therefore do NOT sum to the user's input — that matches
  // the spreadsheet's behavior (sum(B3:B34) > B2), so the "Total" row below
  // is the actual sum of the allocations, not the input box.

  const fmtMoney = (n) =>
    n.toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const fmtPct = (n) =>
    `${(n * 100).toLocaleString("en-CA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}%`;

  const AUTHORITY_LABEL = {
    Peel: "Region of Peel",
    Mississauga: "City of Mississauga",
    Other: "",
  };

  const summaryEls = {
    Peel:        { sub: "sub-peel",        pct: "pct-peel" },
    Mississauga: { sub: "sub-mississauga", pct: "pct-mississauga" },
  };

  // One combined, sorted list. Items already arrive sorted by budget desc.
  const sorted = items.slice().sort((a, b) => b.budget - a.budget);
  const maxShare = sorted[0].budget / basisTotal;

  const rowsEl = document.getElementById("rows");
  sorted.forEach((item, i) => {
    const share = item.budget / basisTotal;
    const barW = Math.max(2, (share / maxShare) * 100);

    const row = document.createElement("div");
    row.className = "row";
    row.dataset.share = String(share);
    row.dataset.section = item.section;

    row.innerHTML = `
      <div class="col col-num">${i + 1}</div>
      <div class="col col-desc">
        <div class="desc-name">${item.name}</div>
        <div class="desc-bar"><span class="bar-${item.section}" style="width:${barW.toFixed(2)}%"></span></div>
      </div>
      <div class="col col-auth auth-${item.section}">${AUTHORITY_LABEL[item.section]}</div>
      <div class="col col-amt" data-amt>—</div>
    `;
    rowsEl.appendChild(row);
  });

  function recalc(userTax) {
    // Per the source spreadsheet: amount(row) = (userTax * B[row]) / B$2
    const totals = { Peel: 0, Mississauga: 0, Other: 0 };
    let allocated = 0;
    document.querySelectorAll(".row").forEach((row) => {
      const share = Number(row.dataset.share); // B[row] / B$2
      const amt = userTax * share;
      totals[row.dataset.section] += amt;
      allocated += amt;
      row.querySelector("[data-amt]").textContent = fmtMoney(amt);
    });

    for (const section of Object.keys(summaryEls)) {
      const sub = totals[section];
      document.getElementById(summaryEls[section].sub).textContent = fmtMoney(sub);
      const pctEl = document.getElementById(summaryEls[section].pct);
      if (pctEl) pctEl.textContent = "";
    }

    // Grand total = sum of the line items as the spreadsheet computes them
    // (this will be > userTax because sum(B3:B34) > B$2 in the source).
    document.getElementById("grandTotal").textContent = fmtMoney(allocated);
  }

  function setMeta() {
    const now = new Date();
    const year = now.getFullYear();
    document.getElementById("taxYear").textContent = String(year);
    document.getElementById("issueDate").textContent = now.toLocaleDateString("en-CA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    document.getElementById("basisTotal").textContent =
      fmtMoney(basisTotal * 1000) + " (operating budget)";
  }

  const input = document.getElementById("taxAmount");
  input.addEventListener("input", () => {
    const v = Math.max(0, Number(input.value) || 0);
    recalc(v);
  });

  document.getElementById("printBtn").addEventListener("click", () => window.print());

  setMeta();
  recalc(Number(input.value) || 0);

  // Auto-focus the amount input so the cursor blinks there on load.
  // Mobile browsers only open the soft keyboard in response to a user
  // gesture, so calling focus() programmatically here does NOT pop the
  // keyboard on iOS/Android — it just shows the blinking caret. When the
  // user taps the field, the keyboard appears as normal.
  requestAnimationFrame(() => {
    try { input.focus({ preventScroll: true }); } catch (_) { input.focus(); }
  });
})();
