// Source: "Tax invoice ver 3 (1).xlsx" — the corrected sheet.
// In this version B2 = 1,871,900.7984 (= sum of B3:B34), so the formula
//   amount(row) = (userTax * B[row]) / B$2
// reconciles exactly to the user's tax amount. Names and per-row budgets
// match the spreadsheet as-shipped.
// section: "Mississauga" | "Peel" | "Other"

window.TAX_DATA = {
  basisTotal: 1871900.7984,
  items: [
    { name: "Peel Regional Police",                                       budget: 519048.326,        section: "Peel" },
    { name: "Mississauga Fire",                                           budget: 182786,            section: "Mississauga" },
    { name: "Peel Housing",                                               budget: 145050.2584128,    section: "Peel" },
    { name: "Mississauga General Government",                             budget: 140636,            section: "Mississauga" },
    { name: "Mississauga Transit",                                        budget: 130287,            section: "Mississauga" },
    { name: "Mississauga Roads & Winter Maintenance",                     budget: 110659,            section: "Mississauga" },
    { name: "Peel Garbage Collection",                                    budget: 83127.6388,        section: "Peel" },
    { name: "Peel Paramedic Services",                                    budget: 74041.4336064,     section: "Peel" },
    { name: "Peel Roads & Winter Maintenance",                            budget: 64695.57744,       section: "Peel" },
    { name: "Mississauga Parks and Forestry",                             budget: 45020,             section: "Mississauga" },
    { name: "Mississauga Information Technology",                         budget: 41169,             section: "Mississauga" },
    { name: "Peel Seniors Services",                                      budget: 36891.7749408,     section: "Peel" },
    { name: "Mississauga Recreation & Culture",                           budget: 33970,             section: "Mississauga" },
    { name: "Mississauga Library",                                        budget: 32130,             section: "Mississauga" },
    { name: "Peel Public Health",                                         budget: 27110.5068,        section: "Peel" },
    { name: "Mississauga Facilities & Property Management",               budget: 24654,             section: "Mississauga" },
    { name: "Conservation Authorities",                                   budget: 21121.28,          section: "Other" },
    { name: "Peel TransHelp",                                             budget: 20891.1768,        section: "Peel" },
    { name: "Peel Income Support",                                        budget: 20081.3652,        section: "Peel" },
    { name: "Mississauga Planning & Building",                            budget: 18342,             section: "Mississauga" },
    { name: "Mississauga By-Law and Enforcement",                         budget: 16572,             section: "Mississauga" },
    { name: "Peel Business Services & Clerks",                            budget: 13614.4164,        section: "Peel" },
    { name: "Municipal Property Assessment Corporation (MPAC)",           budget: 12263.52,          section: "Other" },
    { name: "Peel Subsidized Child Care",                                 budget: 11901.2868,        section: "Peel" },
    { name: "Peel Information Technology",                                budget: 11090.3208,        section: "Peel" },
    { name: "Peel Community Investment",                                  budget: 10985.2704,        section: "Peel" },
    { name: "Mississauga Capital Infrastructure & Debt Repayment Levy",   budget: 7480,              section: "Mississauga" },
    { name: "Mississauga Mayor & Members of Council",                     budget: 5716,              section: "Mississauga" },
    { name: "Peel Heritage, Arts & Culture",                              budget: 3543.4308,         section: "Peel" },
    { name: "Peel Facilities & Property Management",                      budget: 3471.858,          section: "Peel" },
    { name: "Peel Planning & Building (Development Services)",            budget: 2492.9268,         section: "Peel" },
    { name: "Peel Regional Council & Chair",                              budget: 1057.4304,         section: "Peel" },
  ],
};
