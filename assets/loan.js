// Home-loan arithmetic for India: EMI, repayment schedule with prepayments and rate changes,
// income tax under both regimes (FY 2026-27), and rent vs buy. No DOM here, so it can be tested.

/** Monthly instalment for principal P at an annual rate (per cent) over n months. */
export function emi(P, annualRate, n) {
  if (P <= 0 || n <= 0) return 0;
  const r = annualRate / 1200;
  if (r === 0) return P / n;
  const f = (1 + r) ** n;
  return (P * r * f) / (f - 1);
}

/** Months needed to repay P at an annual rate with a fixed instalment, or Infinity if it never clears. */
export function monthsToRepay(P, annualRate, instalment) {
  const r = annualRate / 1200;
  if (P <= 0) return 0;
  if (r === 0) return Math.ceil(P / instalment);
  if (instalment <= P * r) return Infinity;
  return Math.ceil(-Math.log(1 - (P * r) / instalment) / Math.log(1 + r));
}

/**
 * Month-by-month schedule.
 * opts.prepayments: [{month, amount}]  one-off part-payments, made after that month's instalment
 * opts.extraMonthly: extra paid every month on top of the EMI
 * opts.rateChanges:  [{month, rate}]   new annual rate from that month on (a repo-linked loan resetting)
 * opts.mode: 'tenure' (keep the EMI, finish sooner or later; what Indian lenders do by default) or 'emi' (keep the end date, change the EMI)
 */
export function schedule(P, annualRate, months, opts = {}) {
  const { prepayments = [], extraMonthly = 0, rateChanges = [], mode = 'tenure' } = opts;
  const prepay = new Map();
  for (const p of prepayments) if (p.amount > 0) prepay.set(p.month, (prepay.get(p.month) || 0) + p.amount);
  const rates = new Map(rateChanges.map(c => [c.month, c.rate]));
  let rate = annualRate, bal = P, pay = emi(P, annualRate, months);
  const rows = [];
  for (let m = 1; bal > 0.005 && m <= 1200; m++) {
    if (rates.has(m)) {
      rate = rates.get(m);
      if (mode === 'emi') pay = emi(bal, rate, Math.max(1, months - m + 1));
      else if (pay <= bal * rate / 1200) pay = emi(bal, rate, Math.max(1, months - m + 1)); // EMI no longer covers interest: lender must raise it
    }
    const interest = bal * rate / 1200;
    let principal = Math.min(bal, pay - interest);
    const extra = Math.min(bal - principal, extraMonthly + (prepay.get(m) || 0));
    const opening = bal;
    bal = Math.max(0, bal - principal - extra);
    rows.push({ month: m, rate, opening, emi: principal + interest, interest, principal, prepaid: extra, closing: bal });
    if (mode === 'emi' && extra > 0 && bal > 0) pay = emi(bal, rate, Math.max(1, months - m));
  }
  return rows;
}

export function summarise(rows) {
  const s = { months: rows.length, interest: 0, principal: 0, prepaid: 0, paid: 0 };
  for (const r of rows) { s.interest += r.interest; s.principal += r.principal; s.prepaid += r.prepaid; }
  s.paid = s.interest + s.principal + s.prepaid;
  return s;
}

/** Totals for each loan year (months 1–12 = year 1). */
export function yearly(rows) {
  const out = [];
  for (const r of rows) {
    const y = Math.ceil(r.month / 12);
    out[y - 1] ||= { year: y, interest: 0, principal: 0, prepaid: 0, closing: 0 };
    const o = out[y - 1];
    o.interest += r.interest; o.principal += r.principal; o.prepaid += r.prepaid; o.closing = r.closing;
  }
  return out;
}

// ---------------------------------------------------------------- income tax, FY 2026-27

const CESS = 0.04;
const NEW_SLABS = [[400000, 0], [800000, 0.05], [1200000, 0.10], [1600000, 0.15], [2000000, 0.20], [2400000, 0.25], [Infinity, 0.30]];
const OLD_SLABS = [[250000, 0], [500000, 0.05], [1000000, 0.20], [Infinity, 0.30]];

function slabTax(income, slabs) {
  let tax = 0, lower = 0;
  for (const [upper, rate] of slabs) {
    if (income > lower) tax += (Math.min(income, upper) - lower) * rate;
    lower = upper;
  }
  return tax;
}

/**
 * Tax for a salaried resident under 60. Surcharge (incomes over ₹50 lakh) is left out.
 * New regime: ₹75,000 standard deduction, no home-loan deduction on a self-occupied home, full rebate up to ₹12 lakh taxable (with marginal relief).
 * Old regime: ₹50,000 standard deduction, interest up to ₹2 lakh, principal within the ₹1.5 lakh 80C limit, rebate up to ₹5 lakh taxable.
 */
export function taxNew(gross) {
  const taxable = Math.max(0, gross - 75000);
  let tax = slabTax(taxable, NEW_SLABS);
  if (taxable <= 1200000) tax = 0;
  else tax = Math.min(tax, taxable - 1200000); // marginal relief just above the rebate limit
  return Math.round(tax * (1 + CESS));
}

export function taxOld(gross, { interest = 0, principal = 0, other80C = 0, otherDeductions = 0 } = {}) {
  const ded80C = Math.min(150000, principal + other80C);
  const taxable = Math.max(0, gross - 50000 - Math.min(200000, interest) - ded80C - otherDeductions);
  let tax = slabTax(taxable, OLD_SLABS);
  if (taxable <= 500000) tax = Math.max(0, tax - 12500);
  return Math.round(tax * (1 + CESS));
}

/** What the loan saves in tax in one year, and which regime leaves you better off. */
export function taxComparison(gross, { interest, principal, other80C = 0, otherDeductions = 0 }) {
  const oldWithLoan = taxOld(gross, { interest, principal, other80C, otherDeductions });
  const oldWithout = taxOld(gross, { other80C, otherDeductions });
  const newTax = taxNew(gross);
  return { oldWithLoan, oldWithout, loanSaving: oldWithout - oldWithLoan, newTax, better: oldWithLoan < newTax ? 'old' : 'new', difference: Math.abs(newTax - oldWithLoan) };
}

// ---------------------------------------------------------------- rent vs buy

/**
 * Wealth after `years` if you buy versus rent and invest the difference.
 * Buying: pay the down payment and costs now, then the EMI and upkeep; at the end own the home minus the loan left.
 * Renting: invest the down payment and costs instead, and each month invest whatever buying would have cost beyond the rent.
 */
export function rentVsBuy({ price, downPct, rate, tenureYears, years, rent, rentGrowth, appreciation, investReturn, upkeepPct = 0.5, buyCostsPct = 7 }) {
  const loan = price * (1 - downPct / 100);
  const upfront = price * downPct / 100 + price * buyCostsPct / 100;
  const pay = emi(loan, rate, tenureYears * 12);
  const r = investReturn / 1200;
  let bal = loan, invest = upfront, rentNow = rent, home = price;
  const path = [];
  for (let m = 1; m <= years * 12; m++) {
    const interest = bal * rate / 1200;
    const instalment = bal > 0 ? Math.min(pay, bal + interest) : 0;
    bal = Math.max(0, bal + interest - instalment);
    const upkeep = home * upkeepPct / 1200;
    const buyingCost = instalment + upkeep;
    invest = invest * (1 + r) + (buyingCost - rentNow);
    home *= (1 + appreciation / 100) ** (1 / 12);
    if (m % 12 === 0) { rentNow *= 1 + rentGrowth / 100; path.push({ year: m / 12, buy: home - bal, rent: invest }); }
  }
  const last = path[path.length - 1] || { buy: 0, rent: 0 };
  return { buyWealth: last.buy, rentWealth: last.rent, better: last.buy >= last.rent ? 'buy' : 'rent', path, emi: pay };
}

/** ₹ in the Indian style: ₹43,391 or ₹12.5 lakh / ₹1.2 crore when short. */
export function inr(x, short = false) {
  if (!isFinite(x)) return '–';
  const s = x < 0 ? '−' : '';
  const a = Math.abs(x);
  if (short && a >= 1e7) return `${s}₹${(a / 1e7).toFixed(2)} crore`;
  if (short && a >= 1e5) return `${s}₹${(a / 1e5).toFixed(2)} lakh`;
  return s + '₹' + Math.round(a).toLocaleString('en-IN');
}
