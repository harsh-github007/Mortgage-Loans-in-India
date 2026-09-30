import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emi, monthsToRepay, schedule, summarise, yearly, taxNew, taxOld, taxComparison, rentVsBuy, inr } from '../assets/loan.js';

const near = (a, b, tol = 1) => assert.ok(Math.abs(a - b) <= tol, `${a} is not within ${tol} of ${b}`);

test('EMI matches the standard formula', () => {
  near(emi(5_000_000, 8.5, 240), 43391.16, 0.01);   // ₹50 lakh, 8.5%, 20 years
  near(emi(1_000_000, 0, 100), 10000, 1e-9);
  assert.equal(emi(0, 8, 120), 0);
});

test('a plain schedule repays exactly the principal in the stated months', () => {
  const rows = schedule(5_000_000, 8.5, 240);
  const s = summarise(rows);
  assert.equal(s.months, 240);
  near(s.principal, 5_000_000, 0.01);
  near(s.interest, 43391.16 * 240 - 5_000_000, 1);
  near(rows.at(-1).closing, 0, 0.01);
});

test('monthsToRepay inverts emi', () => {
  assert.equal(monthsToRepay(5_000_000, 8.5, emi(5_000_000, 8.5, 240)), 240);
  assert.equal(monthsToRepay(1_000_000, 12, 10_000), Infinity); // instalment only covers interest
});

test('a prepayment shortens the loan and cuts interest when the EMI is kept', () => {
  const base = summarise(schedule(5_000_000, 8.5, 240));
  const pre = summarise(schedule(5_000_000, 8.5, 240, { prepayments: [{ month: 36, amount: 500_000 }] }));
  assert.ok(pre.months < base.months);
  assert.ok(pre.interest < base.interest - 500_000); // saves more than the amount prepaid
  near(pre.principal + pre.prepaid, 5_000_000, 0.01);
});

test('keeping the end date instead lowers the EMI after a prepayment', () => {
  const rows = schedule(5_000_000, 8.5, 240, { prepayments: [{ month: 36, amount: 500_000 }], mode: 'emi' });
  assert.equal(rows.length, 240);
  assert.ok(rows[40].emi < rows[10].emi);
  near(rows.at(-1).closing, 0, 0.01);
});

test('a repo-rate rise keeps the EMI and lengthens the loan', () => {
  const base = schedule(5_000_000, 8.5, 240);
  const up = schedule(5_000_000, 8.5, 240, { rateChanges: [{ month: 13, rate: 9.0 }] });
  assert.ok(up.length > base.length);
  near(up[20].emi, base[20].emi, 0.01);
  assert.equal(up[20].rate, 9.0);
});

test('a rate rise the EMI cannot cover forces a higher EMI instead of a loan that never ends', () => {
  const rows = schedule(1_000_000, 8, 240, { rateChanges: [{ month: 2, rate: 30 }] });
  assert.ok(rows.length < 1200 && rows.at(-1).closing < 0.01);
});

test('yearly totals add up to the schedule', () => {
  const rows = schedule(2_000_000, 8, 120);
  const y = yearly(rows);
  assert.equal(y.length, 10);
  near(y.reduce((s, r) => s + r.principal, 0), 2_000_000, 0.01);
});

test('new regime: no tax up to ₹12.75 lakh salary, marginal relief just above', () => {
  assert.equal(taxNew(1_275_000), 0);
  // ₹12.85 lakh gross = ₹12.10 lakh taxable: slab tax 61,500, but relief caps it at the ₹10,000 above ₹12 lakh
  assert.equal(taxNew(1_285_000), Math.round(10_000 * 1.04));
  // ₹20 lakh gross = ₹19.25 lakh taxable: 20k + 40k + 60k + 20% of 3.25 lakh
  const t = 20000 + 40000 + 60000 + 0.20 * 325000;
  assert.equal(taxNew(2_000_000), Math.round(t * 1.04));
});

test('old regime: slabs, deductions and the ₹5 lakh rebate', () => {
  // ₹10 lakh gross, no deductions: taxable 9.5 lakh -> 12,500 + 90,000
  assert.equal(taxOld(1_000_000), Math.round(102_500 * 1.04));
  // interest is capped at ₹2 lakh and 80C at ₹1.5 lakh
  assert.equal(taxOld(1_500_000, { interest: 300_000, principal: 200_000 }), taxOld(1_500_000, { interest: 200_000, principal: 150_000 }));
  assert.equal(taxOld(550_000), 0); // taxable 5 lakh -> rebate
});

test('tax comparison reports the loan saving and the better regime', () => {
  const c = taxComparison(2_500_000, { interest: 200_000, principal: 150_000 });
  assert.ok(c.loanSaving > 0);
  assert.ok(['old', 'new'].includes(c.better));
  assert.equal(c.oldWithout - c.oldWithLoan, c.loanSaving);
});

test('rent vs buy: faster appreciation favours buying', () => {
  const base = { price: 8_000_000, downPct: 20, rate: 8, tenureYears: 20, years: 15, rent: 25_000, rentGrowth: 5, investReturn: 10 };
  const low = rentVsBuy({ ...base, appreciation: 2 });
  const high = rentVsBuy({ ...base, appreciation: 9 });
  assert.ok(high.buyWealth > low.buyWealth);
  assert.equal(high.path.length, 15);
});

test('rupee formatting uses the Indian grouping', () => {
  assert.equal(inr(4339116), '₹43,39,116');
  assert.equal(inr(12_500_000, true), '₹1.25 crore');
  assert.equal(inr(4_500_000, true), '₹45.00 lakh');
});
