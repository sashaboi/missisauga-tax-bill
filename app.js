(function () {
  "use strict";

  const view = document.body.dataset.view || "detailed";
  const D = window.TAX_DATA;
  const basisTotal = D.basisTotal;
  const municipalShare = typeof D.municipalShare === "number" ? D.municipalShare : 0.85;
  const educationShare = typeof D.educationShare === "number" ? D.educationShare : 0.15;
  const dataset = D.detailed;
  const items = dataset.items;
  const notes = dataset.notes || [];

  // Math follows the source spreadsheet (v6 "Tax calulator sheet 2"):
  //   userMunicipal = userTax * 0.85   (collected for Mississauga + Peel services)
  //   userEducation = userTax * 0.15   (collected on behalf of school boards)
  //   amount(row)   = userMunicipal * (B[row] / B$33)
  // Education tax is rendered as its own line / summary card; it is NOT
  // allocated across any service.

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
    Other: "",
    Education: "Province of Ontario",
  };

  const summaryEls = {
    Peel:        { sub: "sub-peel" },
    Mississauga: { sub: "sub-mississauga" },
    Education:   { sub: "sub-education" },
  };

  // Largest first.
  let sorted = items.slice().sort((a, b) => b.budget - a.budget);

  // Invoice view: keep Mississauga + Peel pairs as two rows, listed back-to-back
  // (City first, Region second), at the slot of whichever appears first in budget order.
  if (view === "invoice") {
    const PAIRS = [
      ["Mississauga Roads & Winter Maintenance", "Peel Roads & Winter Maintenance"],
      ["Mississauga Information Technology", "Peel Information and Technology"],
      ["Mississauga Facilities & Property Management", "Peel Property Management"],
      ["Mississauga Planning & Building", "Peel Development Services"],
    ];
    const byName = new Map(sorted.map((x) => [x.name, x]));
    const pairKey = new Map();
    PAIRS.forEach((names, pi) => {
      names.forEach((n) => pairKey.set(n, pi));
    });
    const emittedPair = new Set();
    const out = [];
    for (const item of sorted) {
      const pi = pairKey.get(item.name);
      if (pi !== undefined) {
        if (emittedPair.has(pi)) continue;
        const names = PAIRS[pi];
        const a = byName.get(names[0]);
        const b = byName.get(names[1]);
        if (!a || !b) {
          out.push(item);
          continue;
        }
        emittedPair.add(pi);
        out.push(a, b);
        continue;
      }
      out.push(item);
    }
    sorted = out;
  }

  const maxShare = sorted[0].budget / basisTotal;

  const rowsEl = document.getElementById("rows");

  function renderRow(item, displayIndex, opts = {}) {
    const isEducation = !!opts.isEducation;
    const share = isEducation ? 0 : item.budget / basisTotal;
    const barW = isEducation
      ? Math.max(2, (educationShare / Math.max(municipalShare * maxShare, educationShare)) * 100)
      : Math.max(2, (share / maxShare) * 100);

    const noteMark = item.note
      ? `<sup class="note-ref">[${item.note}]</sup>`
      : "";
    const infoIcon = item.info
      ? `<button type="button" class="info-icon" aria-label="More info"
           data-info="${item.info.replace(/"/g, "&quot;")}">i</button>`
      : "";

    const row = document.createElement("div");
    row.className = "row" + (isEducation ? " row-education" : "");
    row.dataset.section = item.section;
    if (isEducation) {
      row.dataset.eduShare = String(educationShare);
    } else {
      row.dataset.share = String(share);
    }

    row.innerHTML = `
      <div class="col col-num">${displayIndex}</div>
      <div class="col col-desc">
        <div class="desc-name">${item.name}${noteMark}${infoIcon}</div>
        <div class="desc-bar"><span class="bar-${item.section}" style="width:${barW.toFixed(2)}%"></span></div>
      </div>
      <div class="col col-auth auth-${item.section}">${AUTHORITY_LABEL[item.section] || ""}</div>
      <div class="col col-amt" data-amt>—</div>
    `;
    rowsEl.appendChild(row);
  }

  sorted.forEach((item, i) => renderRow(item, i + 1));

  // Synthetic Education Tax line — always appears last.
  const educationItem = {
    name: "Education Tax",
    section: "Education",
    note: 13,
    info:
      "Province of Ontario education share. The City does not receive this; it collects it on behalf of school boards. " +
      "Source: City of Mississauga 2026 Budget breakdown (City 37%, Peel 48%, Education 15%).",
  };
  renderRow(educationItem, sorted.length + 1, { isEducation: true });

  // Render notes block if the page provides one.
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
    const userMunicipal = userTax * municipalShare;
    const userEducation = userTax * educationShare;

    const totals = { Peel: 0, Mississauga: 0, Other: 0, Education: 0 };
    let displayedTotal = 0;

    document.querySelectorAll(".row").forEach((row) => {
      const isEdu = row.dataset.eduShare !== undefined;
      const amt = isEdu
        ? userEducation
        : userMunicipal * Number(row.dataset.share || 0);
      totals[row.dataset.section] = (totals[row.dataset.section] || 0) + amt;
      displayedTotal += amt;
      const amtEl = row.querySelector("[data-amt]");
      if (amtEl) amtEl.textContent = fmtMoney(amt);
    });

    for (const section of Object.keys(summaryEls)) {
      const el = document.getElementById(summaryEls[section].sub);
      if (el) el.textContent = fmtMoney(totals[section] || 0);
    }

    const grandEl = document.getElementById("grandTotal");
    if (grandEl) grandEl.textContent = fmtMoney(displayedTotal);
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
      basisEl.textContent = fmtMoney(basisTotal) + " (operating budget)";
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

  function parseTaxInput(str) {
    const digits = String(str ?? "").replace(/\D/g, "");
    if (!digits) return 0;
    const n = Number(digits);
    if (!Number.isFinite(n)) return 0;
    return Math.max(0, Math.min(n, 1e15));
  }

  function formatTaxDisplay(n) {
    const v = Math.max(0, Math.floor(Number(n)) || 0);
    return v.toLocaleString("en-CA", { maximumFractionDigits: 0 });
  }

  function taxValueFromInput() {
    return parseTaxInput(input.value);
  }

  function syncTaxDisplayFormatted() {
    input.value = formatTaxDisplay(taxValueFromInput());
  }

  input.addEventListener("input", () => {
    recalc(taxValueFromInput());
  });

  input.addEventListener("blur", () => {
    syncTaxDisplayFormatted();
    recalc(taxValueFromInput());
  });

  const printBtn = document.getElementById("printBtn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      syncTaxDisplayFormatted();
      recalc(taxValueFromInput());
      window.print();
    });
  }

  setMeta();
  const startTax =
    parseTaxInput(input.value) ||
    (typeof window.TAX_DATA !== "undefined" && window.TAX_DATA.defaultTax) ||
    0;
  input.value = formatTaxDisplay(startTax);
  recalc(startTax);

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
    // After layout, shift the popover left so it stays inside the viewport,
    // and keep the arrow visually anchored over the icon.
    requestAnimationFrame(() => {
      const margin = 12;
      const popRect = pop.getBoundingClientRect();
      const overflowRight = popRect.right - (window.innerWidth - margin);
      if (overflowRight > 0) {
        const allowedShift = Math.max(0, popRect.left - margin);
        const shift = Math.min(overflowRight, allowedShift);
        if (shift > 0) {
          pop.style.transform = `translateX(-${shift}px)`;
          pop.style.setProperty("--arrow-left", `${10 + shift}px`);
        }
      }
    });
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
