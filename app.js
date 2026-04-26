(function () {
  "use strict";

  const view = document.body.dataset.view || "detailed";
  // The "invoice" view renders the detailed dataset in a different chrome.
  const dataKey = view === "summary" ? "summary" : "detailed";
  const D = window.TAX_DATA;
  const basisTotal = D.basisTotal;
  const dataset = D[dataKey];
  const items = dataset.items;
  const notes = dataset.notes || [];

  // Math follows the source spreadsheet exactly:
  //   amount(row) = (userTax * B[row]) / B$2
  // where B$2 == basisTotal. The detailed view reconciles to the user's
  // input. The summary view is ~$15 over per $8,000 because the source
  // sheet's "Recreation & Culture" combined row double-counts Peel
  // Heritage; we surface this in the UI rather than silently fixing it.

  const fmtMoney = (n) =>
    n.toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const AUTHORITY_LABEL = {
    Peel: "Region of Peel",
    Mississauga: "City of Mississauga",
    Combined: "Mississauga + Peel",
    Other: "",
  };

  const summaryEls = {
    Peel:        { sub: "sub-peel" },
    Mississauga: { sub: "sub-mississauga" },
    Combined:    { sub: "sub-combined" },
  };

  // One combined, sorted list (largest first).
  const sorted = items.slice().sort((a, b) => b.budget - a.budget);
  const maxShare = sorted[0].budget / basisTotal;

  const rowsEl = document.getElementById("rows");
  sorted.forEach((item, i) => {
    const share = item.budget / basisTotal;
    const barW = Math.max(2, (share / maxShare) * 100);
    const noteMark = item.note
      ? `<sup class="note-ref">[${item.note}]</sup>`
      : "";
    const infoIcon = item.info
      ? `<button type="button" class="info-icon" aria-label="More info"
           data-info="${item.info.replace(/"/g, "&quot;")}">i</button>`
      : "";

    const row = document.createElement("div");
    row.className = "row";
    row.dataset.share = String(share);
    row.dataset.section = item.section;

    row.innerHTML = `
      <div class="col col-num">${i + 1}</div>
      <div class="col col-desc">
        <div class="desc-name">${item.name}${noteMark}${infoIcon}</div>
        <div class="desc-bar"><span class="bar-${item.section}" style="width:${barW.toFixed(2)}%"></span></div>
      </div>
      <div class="col col-auth auth-${item.section}">${AUTHORITY_LABEL[item.section]}</div>
      <div class="col col-amt" data-amt>—</div>
    `;
    rowsEl.appendChild(row);
  });

  // Render the notes block (summary view only).
  const notesList = document.getElementById("notesList");
  if (notesList) {
    if (notes.length === 0) {
      const wrap = document.getElementById("notesBlock");
      if (wrap) wrap.style.display = "none";
    } else {
      for (const n of notes) {
        const li = document.createElement("li");
        li.className = "note-item" + (n.text ? "" : " note-empty");
        li.value = n.mark;
        li.innerHTML = n.text
          ? n.text
          : `<em class="note-placeholder">No description provided in the source sheet.</em>`;
        notesList.appendChild(li);
      }
    }
  }

  function recalc(userTax) {
    const totals = { Peel: 0, Mississauga: 0, Combined: 0, Other: 0 };
    let allocated = 0;
    document.querySelectorAll(".row").forEach((row) => {
      const share = Number(row.dataset.share);
      const amt = userTax * share;
      totals[row.dataset.section] += amt;
      allocated += amt;
      row.querySelector("[data-amt]").textContent = fmtMoney(amt);
    });

    for (const section of Object.keys(summaryEls)) {
      const el = document.getElementById(summaryEls[section].sub);
      if (el) el.textContent = fmtMoney(totals[section]);
    }

    document.getElementById("grandTotal").textContent = fmtMoney(allocated);
  }

  function setMeta() {
    const now = new Date();
    const yearEl = document.getElementById("taxYear");
    if (yearEl) yearEl.textContent = String(now.getFullYear());

    const issueEl = document.getElementById("issueDate");
    if (issueEl) {
      issueEl.textContent = now.toLocaleDateString("en-CA", {
        year: "numeric", month: "long", day: "numeric",
      });
    }

    const basisEl = document.getElementById("basisTotal");
    if (basisEl) {
      basisEl.textContent = fmtMoney(basisTotal * 1000) + " (operating budget)";
    }

    // Invoice view extras: invoice number + due date.
    const invNoEl = document.getElementById("invoiceNo");
    if (invNoEl) {
      const seed = Math.floor(100000 + Math.random() * 899999);
      invNoEl.textContent = "#MIS-" + now.getFullYear() + "-" + seed;
    }
    const dueEl = document.getElementById("dueDate");
    if (dueEl) {
      const due = new Date(now.getFullYear(), 11, 31); // Dec 31 of current year
      dueEl.textContent = due.toLocaleDateString("en-CA", {
        year: "numeric", month: "long", day: "numeric",
      });
    }
  }

  const input = document.getElementById("taxAmount");
  input.addEventListener("input", () => {
    const v = Math.max(0, Number(input.value) || 0);
    recalc(v);
  });

  const printBtn = document.getElementById("printBtn");
  if (printBtn) printBtn.addEventListener("click", () => window.print());

  setMeta();
  recalc(Number(input.value) || 0);

  // Info-icon popover: click toggles a small bubble; outside-click / Escape closes.
  function closePopover() {
    document.querySelectorAll(".info-popover").forEach((p) => p.remove());
    document
      .querySelectorAll('.info-icon[aria-expanded="true"]')
      .forEach((b) => b.setAttribute("aria-expanded", "false"));
  }
  function openPopover(btn) {
    closePopover();
    const text = btn.getAttribute("data-info") || "";
    const pop = document.createElement("span");
    pop.className = "info-popover";
    pop.setAttribute("role", "tooltip");
    pop.textContent = text;
    btn.insertAdjacentElement("afterend", pop);
    btn.setAttribute("aria-expanded", "true");
  }
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".info-icon");
    if (btn) {
      e.stopPropagation();
      if (btn.getAttribute("aria-expanded") === "true") closePopover();
      else openPopover(btn);
      return;
    }
    if (!e.target.closest(".info-popover")) closePopover();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closePopover();
  });

  // Auto-focus the amount input — does not pop the soft keyboard on mobile
  // (browsers require a user gesture for that), but shows the blinking caret.
  requestAnimationFrame(() => {
    try { input.focus({ preventScroll: true }); } catch (_) { input.focus(); }
  });
})();
