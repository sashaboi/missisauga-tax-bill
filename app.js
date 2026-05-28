(function () {
  "use strict";

  const view = document.body.dataset.view || "invoice";
  const D = window.TAX_DATA;
  const notes = D.notes || [];
  const YEAR_STORAGE_KEY = "taxYear";

  const PAIRS = [
    ["Mississauga Roads and  winter maintenance", "Peel Roads"],
    ["Mississauga Information Technology", "Peel Information and Technology"],
    ["Mississauga Facilities & Property Management", "Peel Real Property Asset Management"],
    ["Mississauga Planning & Building", "Peel Development Services"],
  ];

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
    Peel: { sub: "sub-peel" },
    Mississauga: { sub: "sub-mississauga" },
    Education: { sub: "sub-education" },
  };

  let activeYear;
  let items;
  let basisTotal;
  let municipalShare;
  let educationShare;
  let sorted = [];
  let maxShare = 0;
  let tippyInstances = [];

  const rowsEl = document.getElementById("rows");
  const input = document.getElementById("taxAmount");
  const yearSelect = document.getElementById("taxYearSelect");

  function getStoredYear() {
    const stored = sessionStorage.getItem(YEAR_STORAGE_KEY);
    if (stored && D.years[stored]) return Number(stored);
    return D.defaultYear || 2026;
  }

  function persistYear(year) {
    sessionStorage.setItem(YEAR_STORAGE_KEY, String(year));
  }

  function applyYearData(year) {
    const yd = D.years[year];
    if (!yd) return;
    activeYear = year;
    items = yd.items;
    basisTotal = yd.basisTotal;
    municipalShare = yd.municipalShare;
    educationShare = yd.educationShare;
  }

  function sortItems(list) {
    let out = list.slice().sort((a, b) => b.budget - a.budget);
    if (view !== "invoice") return out;

    const byName = new Map(out.map((x) => [x.name, x]));
    const pairKey = new Map();
    PAIRS.forEach((names, pi) => {
      names.forEach((n) => pairKey.set(n, pi));
    });
    const emittedPair = new Set();
    const paired = [];
    for (const item of out) {
      const pi = pairKey.get(item.name);
      if (pi !== undefined) {
        if (emittedPair.has(pi)) continue;
        const names = PAIRS[pi];
        const a = byName.get(names[0]);
        const b = byName.get(names[1]);
        if (!a || !b) {
          paired.push(item);
          continue;
        }
        emittedPair.add(pi);
        paired.push(a, b);
        continue;
      }
      paired.push(item);
    }
    return paired;
  }

  function destroyTooltips() {
    tippyInstances.forEach((inst) => inst.destroy());
    tippyInstances = [];
  }

  function initTooltips() {
    if (!window.tippy) return;
    destroyTooltips();
    tippyInstances = window.tippy(".info-icon", {
      content: (ref) => ref.getAttribute("data-info") || "",
      allowHTML: false,
      trigger: "click",
      hideOnClick: true,
      placement: "bottom-start",
      theme: "navy",
      maxWidth: 360,
      interactive: false,
      appendTo: () => document.body,
      offset: [0, 6],
      popperOptions: {
        modifiers: [
          { name: "preventOverflow", options: { padding: 8 } },
          {
            name: "flip",
            options: { fallbackPlacements: ["top-start", "top-end", "bottom-end"] },
          },
        ],
      },
    });
  }

  function renderRow(item, displayIndex, opts = {}) {
    const isEducation = !!opts.isEducation;
    const share = isEducation ? 0 : item.budget / basisTotal;
    const barW = isEducation
      ? Math.max(2, (educationShare / Math.max(municipalShare * maxShare, educationShare)) * 100)
      : Math.max(2, (share / maxShare) * 100);

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
        <div class="desc-name">${item.name}${infoIcon}</div>
        <div class="desc-bar"><span class="bar-${item.section}" style="width:${barW.toFixed(2)}%"></span></div>
      </div>
      <div class="col col-auth auth-${item.section}">${AUTHORITY_LABEL[item.section] || ""}</div>
      <div class="col col-amt" data-amt>—</div>
    `;
    rowsEl.appendChild(row);
  }

  function renderAll() {
    sorted = sortItems(items);
    maxShare = sorted.length ? sorted[0].budget / basisTotal : 0;

    rowsEl.innerHTML = "";
    sorted.forEach((item, i) => renderRow(item, i + 1));

    const educationItem = {
      name: "Education Tax",
      section: "Education",
      note: 13,
      info:
        "Province of Ontario education share (" +
        activeYear +
        "). The City does not receive this; it collects it on behalf of school boards.",
    };
    renderRow(educationItem, sorted.length + 1, { isEducation: true });

    if (window.tippy) initTooltips();
    recalc(taxValueFromInput());
  }

  function recalc(userTax) {
    const userMunicipal = userTax * municipalShare;
    const userEducation = userTax * educationShare;

    const totals = { Peel: 0, Mississauga: 0, Other: 0, Education: 0 };
    let displayedTotal = 0;

    document.querySelectorAll(".row").forEach((row) => {
      const isEdu = row.dataset.eduShare !== undefined;
      const amt = isEdu ? userEducation : userMunicipal * Number(row.dataset.share || 0);
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
    if (yearEl) yearEl.textContent = String(activeYear);

    const issueEl = document.getElementById("issueDate");
    if (issueEl) {
      issueEl.textContent = now.toLocaleDateString("en-CA", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    const basisEl = document.getElementById("basisTotal");
    if (basisEl) {
      basisEl.textContent = fmtMoney(basisTotal) + " (" + activeYear + " operating budget)";
    }
  }

  function onYearChange(year) {
    applyYearData(year);
    persistYear(year);
    if (yearSelect) yearSelect.value = String(year);
    setMeta();
    renderAll();
  }

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
    const raw = String(input.value ?? "").replace(/\D/g, "");
    if (!raw) {
      input.value = "";
      return;
    }
    input.value = formatTaxDisplay(parseTaxInput(input.value));
  }

  // Notes block (details view only).
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

  input.addEventListener("input", () => {
    recalc(taxValueFromInput());
  });

  input.addEventListener("blur", () => {
    syncTaxDisplayFormatted();
    recalc(taxValueFromInput());
  });

  if (yearSelect) {
    yearSelect.value = String(getStoredYear());
    yearSelect.addEventListener("change", () => {
      onYearChange(Number(yearSelect.value));
    });
  }

  const printBtn = document.getElementById("printBtn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      syncTaxDisplayFormatted();
      recalc(taxValueFromInput());
      window.print();
    });
  }

  onYearChange(getStoredYear());

  const digits = String(input.value ?? "").replace(/\D/g, "");
  const startTax = digits === "" ? 0 : parseTaxInput(input.value);
  if (digits) input.value = formatTaxDisplay(startTax);
  recalc(startTax);

  if (window.tippy) initTooltips();
  else window.addEventListener("DOMContentLoaded", initTooltips);

  requestAnimationFrame(() => {
    try {
      input.focus({ preventScroll: true });
    } catch (_) {
      input.focus();
    }
  });
})();
