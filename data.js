// Source: "Tax invoice ver 4.xlsx" — two sheets:
//   1) "Combined budget with net adjust"  → TAX_DATA.detailed   (used by /)
//   2) "Summary tax invoice"              → TAX_DATA.summary    (used by /summary)
//
// Both share the same basis (B2 = 1,871,900.7984 = sum of all detailed rows).
// Each line item allocates by the spreadsheet formula:
//   amount(row) = (userTax * B[row]) / B$2
//
// section: "Mississauga" | "Peel" | "Combined" | "Other"
//   - "Combined" is summary-only, for rows that merge Mississauga + Peel.

window.TAX_DATA = {
  defaultTax: 8000,
  basisTotal: 1871900.7984,

  detailed: {
    items: [
      { name: "Peel Regional Police",                                       budget: 519048.326,        section: "Peel" },
      { name: "Mississauga Fire",                                           budget: 182786,            section: "Mississauga" },
      { name: "Peel Housing",                                               budget: 145050.2584128,    section: "Peel",        info: "Region of Peel\u2019s funding for subsidized housing initiatives" },
      { name: "Mississauga General Government",                             budget: 140636,            section: "Mississauga", info: "Corporate Business Services, Finance, Human Resources, Internal Audit, Legal Services, Legislative Services, the Office of Emergency Management, and Strategic Communications & Initiatives. Also includes Corporate Transactions." },
      { name: "Mississauga Transit (MiWay)",                                budget: 130287,            section: "Mississauga" },
      { name: "Mississauga Roads & Winter Maintenance",                     budget: 110659,            section: "Mississauga" },
      { name: "Peel Garbage Collection",                                    budget: 83127.6388,        section: "Peel" },
      { name: "Peel Paramedic Services",                                    budget: 74041.4336064,     section: "Peel" },
      { name: "Peel Roads & Winter Maintenance",                            budget: 64695.57744,       section: "Peel" },
      { name: "Mississauga Parks and Forestry",                             budget: 45020,             section: "Mississauga" },
      { name: "Mississauga Information Technology",                         budget: 41169,             section: "Mississauga" },
      { name: "Peel Seniors Services",                                      budget: 36891.7749408,     section: "Peel",        info: "Long-term care and adult day programs for a growing population." },
      { name: "Mississauga Recreation & Culture",                           budget: 33970,             section: "Mississauga" },
      { name: "Mississauga Library",                                        budget: 32130,             section: "Mississauga" },
      { name: "Peel Public Health",                                         budget: 27110.5068,        section: "Peel" },
      { name: "Mississauga Facilities & Property Management",               budget: 24654,             section: "Mississauga", info: "Planning, design, construction and compliance of new and existing City facilities." },
      { name: "Conservation Authorities",                                   budget: 21121.28,          section: "Other" },
      { name: "Peel TransHelp",                                             budget: 20891.1768,        section: "Peel" },
      { name: "Peel Income Support",                                        budget: 20081.3652,        section: "Peel",        info: "Provide application and assessment services for income and support programs such as Ontario Works, Child Care Fee Subsidy, and emergency assistance programs." },
      { name: "Mississauga Planning & Building",                            budget: 18342,             section: "Mississauga", info: "Includes zoning, building permits, and community land use planning." },
      { name: "Mississauga By-Law and Enforcement",                         budget: 16572,             section: "Mississauga" },
      { name: "Peel Business Services & Clerks",                            budget: 13614.4164,        section: "Peel",        info: "Climate Change and Energy Management, Communications, Culture and Inclusion (C&I), Finance, Government Relations, Human Resources (HR), Internal Audit, Legal Services, Procurement, Service Peel, Strategy and Transformation, and the Office of the Chief Administrative Officer." },
      { name: "Municipal Property Assessment Corporation (MPAC)",           budget: 12263.52,          section: "Other" },
      { name: "Peel Subsidized Child Care",                                 budget: 11901.2868,        section: "Peel" },
      { name: "Peel Information Technology",                                budget: 11090.3208,        section: "Peel" },
      { name: "Peel Community Investment",                                  budget: 10985.2704,        section: "Peel",        info: "Grants to not-for-profits via the Community Investment Program (CIP) to strengthen social services and support vulnerable residents." },
      { name: "Mississauga Capital Infrastructure & Debt Repayment Levy",   budget: 7480,              section: "Mississauga" },
      { name: "Mississauga Mayor & Members of Council",                     budget: 5716,              section: "Mississauga" },
      { name: "Peel Heritage, Arts & Culture",                              budget: 3543.4308,         section: "Peel" },
      { name: "Peel Facilities & Property Management",                      budget: 3471.858,          section: "Peel",        info: "Planning, design, construction and compliance of new and existing Regional facilities." },
      { name: "Peel Planning & Building (Development Services)",            budget: 2492.9268,         section: "Peel",        info: "Municipal land development applications and growth forecasts." },
      { name: "Peel Regional Council & Chair",                              budget: 1057.4304,         section: "Peel" },
    ],
  },

  // Rolled-up view: cross-authority services merged into combined rows.
  // Footnote numbers attach to specific items.
  summary: {
    items: [
      { name: "Peel Regional Police",                                       budget: 519048.326,        section: "Peel" },
      { name: "Mississauga Fire",                                           budget: 182786,            section: "Mississauga" },
      { name: "Mississauga and Peel Roads & Winter Maintenance",            budget: 175355,            section: "Combined" },
      { name: "Peel Housing",                                               budget: 145050.2584128,    section: "Peel",        note: 1, info: "Region of Peel\u2019s funding for subsidized housing initiatives" },
      { name: "Mississauga General Government",                             budget: 140636,            section: "Mississauga", note: 2, info: "Corporate Business Services, Finance, Human Resources, Internal Audit, Legal Services, Legislative Services, the Office of Emergency Management, and Strategic Communications & Initiatives. Also includes Corporate Transactions." },
      { name: "Mississauga Transit (MiWay)",                                budget: 130287,            section: "Mississauga" },
      { name: "Peel Garbage Collection",                                    budget: 83127.6388,        section: "Peel" },
      { name: "Peel Paramedic Services",                                    budget: 74041.4336064,     section: "Peel" },
      { name: "Mississauga and Peel Information Technology",                budget: 52259.3208,        section: "Combined" },
      { name: "Mississauga Parks and Forestry",                             budget: 45020,             section: "Mississauga" },
      { name: "Mississauga and Peel Recreation & Culture",                  budget: 41056.8616,        section: "Combined",    note: 3 },
      { name: "Peel Seniors Services",                                      budget: 36891.7749408,     section: "Peel",        info: "Long-term care and adult day programs for a growing population." },
      { name: "Mississauga Library",                                        budget: 32130,             section: "Mississauga" },
      { name: "Mississauga and Peel Building Maintenance",                  budget: 28125.858,         section: "Combined" },
      { name: "Peel Public Health",                                         budget: 27110.5068,        section: "Peel" },
      { name: "Conservation Authorities",                                   budget: 21121.28,          section: "Other" },
      { name: "Peel TransHelp",                                             budget: 20891.1768,        section: "Peel" },
      { name: "Mississauga and Peel Planning Services",                     budget: 20834.9268,        section: "Combined",    note: 4, info: "Includes zoning, building permits, and community land use planning." },
      { name: "Peel Income Support",                                        budget: 20081.3652,        section: "Peel",        info: "Provide application and assessment services for income and support programs such as Ontario Works, Child Care Fee Subsidy, and emergency assistance programs." },
      { name: "Mississauga By-Law and Enforcement",                         budget: 16572,             section: "Mississauga" },
      { name: "Peel Business Services & Clerks",                            budget: 13614.4164,        section: "Peel",        info: "Climate Change and Energy Management, Communications, Culture and Inclusion (C&I), Finance, Government Relations, Human Resources (HR), Internal Audit, Legal Services, Procurement, Service Peel, Strategy and Transformation, and the Office of the Chief Administrative Officer." },
      { name: "Municipal Property Assessment Corporation (MPAC)",           budget: 12263.52,          section: "Other" },
      { name: "Peel Subsidized Child Care",                                 budget: 11901.2868,        section: "Peel" },
      { name: "Peel Community Investment",                                  budget: 10985.2704,        section: "Peel",        note: 5, info: "Grants to not-for-profits via the Community Investment Program (CIP) to strengthen social services and support vulnerable residents." },
      { name: "Mississauga Capital Infrastructure & Debt Repayment Levy",   budget: 7480,              section: "Mississauga", note: 6 },
      { name: "Mississauga Mayor & Members of Council",                     budget: 5716,              section: "Mississauga" },
      { name: "Peel Regional Council & Chair",                              budget: 1057.4304,         section: "Peel" },
    ],
    notes: [
      { mark: 1, text: "" },
      { mark: 2, text: "Mississauga Government includes Finance, Human Resources, Internal Audit, Legal Services, Communications and Emergency Management, Integrity Commissioner, Tourism Mississauga, and financial transactions." },
      { mark: 3, text: "" },
      { mark: 4, text: "" },
      { mark: 5, text: "" },
      { mark: 6, text: "" },
    ],
  },
};
