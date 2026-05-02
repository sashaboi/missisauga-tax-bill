// Source: "Tax bill explainer version 6 for Onkar.xlsx"
//   - Active sheet: "Tax calulator sheet 2" (sheet 3) — 31 service lines
//   - Sheet 1 ("Worksheet") shows how Mississauga Corporate Transactions,
//     One-time Reserves, and the Capital Infrastructure & Debt Repayment Levy
//     are pro-rata allocated across each Mississauga service area, so each
//     line below already includes its share. Peel lines are the Mississauga
//     share of the Peel budget (≈57.72%, 62.02% for Police).
//
// Each line item allocates by the spreadsheet formula:
//   amount(row) = (userMunicipalTax * B[row]) / B$33
// where B$33 == basisTotal and userMunicipalTax = userTax * municipalShare.
//
// 15% of the resident's total tax is the Province of Ontario education
// share, rendered as a separate line and a summary card. Source:
//   https://www.mississauga.ca/city-of-mississauga-news/news/mississaugas-2026-budget-adopted/
//   "City of Mississauga 37%, Region of Peel 48%, Province of Ontario 15%."
//
// section: "Mississauga" | "Peel" | "Other" | "Education"

window.TAX_DATA = {
  defaultTax: 7000,
  municipalShare: 0.85,
  educationShare: 0.15,
  basisTotal: 1863397268.75,

  detailed: {
    items: [
      { name: "Peel Regional Police",                                       budget: 519499290.90,    section: "Peel" },
      { name: "Mississauga Fire & Emergency Services",                      budget: 204142271.91,    section: "Mississauga" },
      { name: "Mi Way",                                                     budget: 145509416.37,    section: "Mississauga" },
      { name: "Peel Housing Support",                                       budget: 142005726.24,    section: "Peel",        note: 4,  info: "Region of Peel\u2019s funding for subsidized housing initiatives." },
      { name: "Mississauga Roads & Winter Maintenance",                     budget: 123588128.56,    section: "Mississauga" },
      { name: "Peel Garbage Collection",                                    budget: 83105803.24,     section: "Peel" },
      { name: "Peel Paramedic Services",                                    budget: 74148812.35,     section: "Peel" },
      { name: "Mississauga General Government",                             budget: 73187482.74,     section: "Mississauga", note: 1,  info: "Salaries and other overhead for back office services like Finance, Human Resources, Internal Audit, and Communications." },
      { name: "Peel Roads & Winter Maintenance",                            budget: 61589805.72,     section: "Peel" },
      { name: "Mississauga Parks, Forestry & Environment",                  budget: 50280027.36,     section: "Mississauga" },
      { name: "Mississauga Information Technology",                         budget: 45979085.88,     section: "Mississauga" },
      { name: "Mississauga Recreation & Culture",                           budget: 37938972.22,     section: "Mississauga", note: 14, info: "Community centres, golf courses, sports fields, sports arenas, swimming pools, and support for arts and culture." },
      { name: "Peel Seniors Services",                                      budget: 36284843.24,     section: "Peel",        note: 5,  info: "Long-term care and adult day programs for a growing population." },
      { name: "Mississauga Library",                                        budget: 35883991.10,     section: "Mississauga" },
      { name: "Mississauga Facilities & Property Management",               budget: 27534513.43,     section: "Mississauga", note: 2,  info: "Planning and design of new facilities and maintenance of existing City facilities." },
      { name: "Peel Public Health",                                         budget: 26847057.03,     section: "Peel" },
      { name: "Conservation Authorities",                                   budget: 21018056.02,     section: "Other",       note: 11, info: "Mississauga\u2019s share of funding for Credit Valley Conservation, Toronto and Region Conservation Authority, and Halton Conservation Authority." },
      { name: "Peel Trans Help",                                            budget: 20657129.30,     section: "Peel" },
      { name: "Mississauga Planning & Building",                            budget: 20485034.69,     section: "Mississauga", note: 3,  info: "Processing development applications from developers and residents \u2014 rezoning, site plan approval, and building permits." },
      { name: "Peel Income Support",                                        budget: 19936353.44,     section: "Peel",        note: 6,  info: "Back-office costs to deliver income support programs (Ontario Works, subsidized child care). Provincial dollars don\u2019t cover these; municipalities do." },
      { name: "Mississauga Regulatory Services",                            budget: 18508232.20,     section: "Mississauga", note: 15, info: "By-law enforcement." },
      { name: "Peel Business Services",                                     budget: 12717116.20,     section: "Peel",        note: 7,  info: "Salaries and other overhead for services like climate change, communications, finance, HR, internal audit, and procurement." },
      { name: "Municipal Property Assessment Corporation (MPAC)",           budget: 12203519.67,     section: "Other",       note: 12, info: "Decides the value of your home, on which property taxes are calculated." },
      { name: "Peel Early Years and Child Care",                            budget: 11698332.97,     section: "Peel" },
      { name: "Peel Community Investment",                                  budget: 10981164.37,     section: "Peel",        note: 8,  info: "Grants to non-profits that provide services and support to vulnerable residents." },
      { name: "Peel Information and Technology",                            budget: 10851328.25,     section: "Peel" },
      { name: "Mississauga Mayor & Members of Council",                     budget: 6383843.55,      section: "Mississauga" },
      { name: "Peel Heritage, Arts and Culture",                            budget: 3504889.63,      section: "Peel" },
      { name: "Peel Property Management",                                   budget: 3393559.07,      section: "Peel",        note: 9,  info: "Operations and maintenance of Peel facilities and planning and leasing of new facilities." },
      { name: "Peel Development Services",                                  budget: 2482851.79,      section: "Peel",        note: 10, info: "Input into City of Mississauga development applications to ensure infrastructure keeps up with growth." },
      { name: "Peel Regional Chair and Council",                            budget: 1050629.31,      section: "Peel" },
    ],
    notes: [
      { mark: 1,  text: "Salaries and other overhead for back office services like Finance, Human Resources, Internal Audit, and Communications." },
      { mark: 2,  text: "Planning and design of new facilities and maintenance of existing facilities." },
      { mark: 3,  text: "Processing development applications from developers and residents including rezoning, site plan approval, and building permits." },
      { mark: 4,  text: "Subsidized housing." },
      { mark: 5,  text: "Long-term care and adult day programs." },
      { mark: 6,  text: "Back-office costs to deliver income support programs (Ontario Works, subsidized child care). These are not paid by the province and are paid by municipalities." },
      { mark: 7,  text: "Salaries and other overhead for services like climate change, communications, finance, HR, internal audit, and procurement." },
      { mark: 8,  text: "Grants to non-profits that provide services and support to vulnerable residents." },
      { mark: 9,  text: "Operations and maintenance of Peel facilities and planning and leasing of new facilities." },
      { mark: 10, text: "Input into City of Mississauga development applications to ensure infrastructure keeps up with growth." },
      { mark: 11, text: "Mississauga\u2019s share of funding for Credit Valley Conservation, Toronto and Region Conservation Authority, and Halton Conservation Authority." },
      { mark: 12, text: "Decides the value of your home, on which property taxes are calculated." },
      { mark: 13, text: "Education tax. The City does not receive this; it collects it on behalf of school boards." },
      { mark: 14, text: "Community centres, golf courses, sports fields, sports arenas, swimming pools, and support for arts and culture." },
      { mark: 15, text: "By-law enforcement." },
    ],
  },
};
