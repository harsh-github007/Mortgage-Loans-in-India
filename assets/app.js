import { emi, schedule, summarise, yearly, taxComparison, rentVsBuy, inr } from './loan.js';

// Starting rates for salaried borrowers, September 2026 (see the sources under the rates table).
const LENDERS = [
  ['Punjab National Bank', 7.20], ['State Bank of India', 7.25], ['Bank of Baroda', 7.45], ['LIC Housing Finance', 7.50],
  ['ICICI Bank', 7.55], ['Kotak Mahindra Bank', 7.70], ['HDFC Bank', 7.90], ['PNB Housing Finance', 7.90], ['Axis Bank', 8.35],
];
const REPO = 5.25;
const $ = id => document.getElementById(id);
const num = id => Math.max(0, parseFloat($(id).value) || 0);
const css = name => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const hasCharts = () => typeof Chart !== 'undefined';
const pct = (x, d = 0) => `${(x * 100).toFixed(d)}%`;
const months = m => { const y = Math.floor(m / 12), r = m % 12; return [y && `${y} year${y > 1 ? 's' : ''}`, r && `${r} month${r > 1 ? 's' : ''}`].filter(Boolean).join(' ') || '0 months'; };
let yearChart, balChart, rvbChart;

function setupLenders() {
  $('lender').innerHTML += LENDERS.map(([n, lo]) => `<option value="${lo}">${n} — from ${lo.toFixed(2)}%</option>`).join('');
  $('lender').addEventListener('change', e => { if (e.target.value) { $('rate').value = e.target.value; render(); } });
  $('ratesTable').innerHTML = '<thead><tr><th>Lender</th><th>Starting rate</th><th>Above the repo rate</th><th>EMI on ₹50 lakh, 20 years</th></tr></thead><tbody>' +
    LENDERS.map(([n, lo]) => `<tr><td>${n}</td><td>${lo.toFixed(2)}%</td><td>${(lo - REPO).toFixed(2)} pts</td><td>${inr(emi(5e6, lo, 240))}</td></tr>`).join('') + '</tbody>';
}

function loan() {
  const P = num('amount'), rate = num('rate'), n = Math.round(num('years') * 12);
  return { P, rate, n };
}

function renderLoan({ P, rate, n }) {
  const rows = schedule(P, rate, n), s = summarise(rows), ys = yearly(rows);
  $('kEmi').textContent = inr(emi(P, rate, n));
  $('kInt').textContent = inr(s.interest, true);
  $('kIntPct').textContent = P ? `${pct(s.interest / P)} of the loan` : '';
  $('kPaid').textContent = inr(s.paid, true);
  $('kY1').textContent = ys[0] ? inr(ys[0].interest) : '–';
  $('kY1Pct').textContent = ys[0] ? `${pct(ys[0].interest / (ys[0].interest + ys[0].principal))} of year 1's payments` : '';
  $('yearTable').innerHTML = '<thead><tr><th>Year</th><th>Interest</th><th>Principal</th><th>Loan left</th></tr></thead><tbody>' +
    ys.map(y => `<tr><td>${y.year}</td><td>${inr(y.interest)}</td><td>${inr(y.principal)}</td><td>${inr(y.closing)}</td></tr>`).join('') + '</tbody>';
  if (!hasCharts()) return rows;
  const data = { labels: ys.map(y => y.year), datasets: [
    { label: 'Interest', data: ys.map(y => y.interest), backgroundColor: css('--orange'), borderRadius: 3, borderSkipped: false },
    { label: 'Principal', data: ys.map(y => y.principal), backgroundColor: css('--blue'), borderRadius: 3, borderSkipped: false },
  ] };
  const options = { responsive: true, maintainAspectRatio: false, animation: false, interaction: { mode: 'index', intersect: false },
    scales: { x: { stacked: true, grid: { display: false }, title: { display: true, text: 'Loan year' } }, y: { stacked: true, ticks: { callback: v => inr(v, true) } } },
    plugins: { tooltip: { callbacks: { label: c => `${c.dataset.label}: ${inr(c.raw)}` } } } };
  if (yearChart) { yearChart.data = data; yearChart.update(); } else yearChart = new Chart($('yearChart'), { type: 'bar', data, options });
  return rows;
}

function renderPrepay({ P, rate, n }, base) {
  const mode = $('mode').value;
  const pre = schedule(P, rate, n, { prepayments: [{ month: Math.round(num('lumpYear') * 12), amount: num('lump') }], extraMonthly: num('extra'), mode });
  const b = summarise(base), s = summarise(pre);
  const saved = b.interest - s.interest;
  const tail = mode === 'tenure'
    ? `and finishes <b>${months(b.months - s.months)}</b> sooner.`
    : `and your EMI drops to <b>${inr(pre.at(-1)?.emi ?? 0)}</b> afterwards.`;
  $('preResult').innerHTML = s.prepaid > 0
    ? `Prepaying <b>${inr(s.prepaid, true)}</b> saves <b>${inr(saved, true)}</b> in interest ${tail}`
    : 'Enter a prepayment to see what it saves.';
  return pre;
}

function renderRepo({ P, rate, n }, base) {
  const change = parseFloat($('repoChange').value) || 0, after = Math.max(1, Math.round(num('repoAfter')));
  const moved = schedule(P, rate, n, { rateChanges: [{ month: after, rate: Math.max(0.1, rate + change) }] });
  const b = summarise(base), s = summarise(moved);
  const newRate = (rate + change).toFixed(2);
  const diff = s.months - b.months;
  const emiNow = moved[Math.min(after, moved.length - 1)]?.emi ?? 0, emiBefore = base[0]?.emi ?? 0;
  const emiNote = Math.abs(emiNow - emiBefore) > 1 ? ` Your EMI also has to rise to <b>${inr(emiNow)}</b>, because the old one no longer covers the interest.` : '';
  $('repoResult').innerHTML = change === 0 ? 'Enter a change to see its effect.'
    : `At <b>${newRate}%</b> from month ${after}, keeping the EMI, the loan runs <b>${months(Math.abs(diff))} ${diff >= 0 ? 'longer' : 'shorter'}</b> and total interest ${s.interest >= b.interest ? 'rises' : 'falls'} by <b>${inr(Math.abs(s.interest - b.interest), true)}</b>.${emiNote}`;
  return moved;
}

function renderBalance(base, pre, moved) {
  if (!hasCharts()) return;
  const yearEnd = rows => [{ x: 0, y: rows[0]?.opening ?? 0 }, ...rows.filter((r, i) => r.month % 12 === 0 || i === rows.length - 1).map(r => ({ x: r.month / 12, y: r.closing }))];
  const data = { datasets: [
    { label: 'As entered', data: yearEnd(base), borderColor: css('--blue'), backgroundColor: css('--blue'), borderWidth: 2, pointRadius: 0 },
    { label: 'With prepayments', data: yearEnd(pre), borderColor: css('--aqua'), backgroundColor: css('--aqua'), borderWidth: 2, pointRadius: 0 },
    { label: 'With the repo change', data: yearEnd(moved), borderColor: css('--orange'), backgroundColor: css('--orange'), borderWidth: 2, pointRadius: 0, borderDash: [5, 4] },
  ] };
  const options = { responsive: true, maintainAspectRatio: false, animation: false, parsing: false, interaction: { mode: 'nearest', intersect: false },
    scales: { x: { type: 'linear', min: 0, title: { display: true, text: 'Years' }, grid: { display: false } }, y: { min: 0, ticks: { callback: v => inr(v, true) } } },
    plugins: { tooltip: { callbacks: { title: i => `Year ${i[0].raw.x.toFixed(1)}`, label: c => `${c.dataset.label}: ${inr(c.raw.y, true)}` } } } };
  if (balChart) { balChart.data = data; balChart.update(); } else balChart = new Chart($('balChart'), { type: 'line', data, options });
}

function renderTax(base) {
  const y1 = yearly(base)[0] || { interest: 0, principal: 0 };
  const c = taxComparison(num('salary'), { interest: y1.interest, principal: y1.principal, other80C: num('other80c') });
  const rows = [['Old regime, without the loan', c.oldWithout], ['Old regime, with the loan', c.oldWithLoan], ['New regime (no home-loan deduction)', c.newTax]];
  const best = Math.min(c.oldWithLoan, c.newTax);
  $('taxTable').innerHTML = '<thead><tr><th>Year 1 tax</th><th>Tax</th></tr></thead><tbody>' +
    rows.map(([k, v], i) => `<tr class="${i > 0 && v === best ? 'best' : ''}"><td>${k}</td><td>${inr(v)}</td></tr>`).join('') + '</tbody>';
  $('taxResult').innerHTML = `In year 1 the loan cuts old-regime tax by <b>${inr(c.loanSaving)}</b>. ` +
    (c.better === 'old' ? `With it, the <b>old regime</b> is cheaper by <b>${inr(c.difference)}</b>.` : `Even so, the <b>new regime</b> is cheaper by <b>${inr(c.difference)}</b>, so the loan brings no tax benefit.`);
}

function renderRentVsBuy({ rate, n }) {
  const r = rentVsBuy({ price: num('price'), downPct: Math.min(100, num('down')), rate, tenureYears: Math.max(1, n / 12), years: Math.max(1, Math.round(num('horizon'))),
    rent: num('rent'), rentGrowth: num('rentGrowth'), appreciation: parseFloat($('appr').value) || 0, investReturn: parseFloat($('ret').value) || 0 });
  const gap = Math.abs(r.buyWealth - r.rentWealth);
  $('rvbResult').innerHTML = `After ${num('horizon')} years, buying leaves you with <b>${inr(r.buyWealth, true)}</b> in home equity; renting and investing leaves <b>${inr(r.rentWealth, true)}</b>. ` +
    `<b>${r.better === 'buy' ? 'Buying' : 'Renting'}</b> comes out ahead by ${inr(gap, true)}.`;
  if (!hasCharts()) return;
  const data = { labels: r.path.map(p => p.year), datasets: [
    { label: 'Buy: home value minus loan', data: r.path.map(p => p.buy), borderColor: css('--blue'), backgroundColor: css('--blue'), borderWidth: 2, pointRadius: 0 },
    { label: 'Rent: investments', data: r.path.map(p => p.rent), borderColor: css('--orange'), backgroundColor: css('--orange'), borderWidth: 2, pointRadius: 0 },
  ] };
  const options = { responsive: true, maintainAspectRatio: false, animation: false, interaction: { mode: 'index', intersect: false },
    scales: { x: { grid: { display: false }, title: { display: true, text: 'Years' } }, y: { ticks: { callback: v => inr(v, true) } } },
    plugins: { tooltip: { callbacks: { label: c => `${c.dataset.label}: ${inr(c.raw, true)}` } } } };
  if (rvbChart) { rvbChart.data = data; rvbChart.update(); } else rvbChart = new Chart($('rvbChart'), { type: 'line', data, options });
}

function render() {
  const l = loan();
  if (!l.P || !l.n) return;
  const base = renderLoan(l);
  const pre = renderPrepay(l, base);
  const moved = renderRepo(l, base);
  renderBalance(base, pre, moved);
  renderTax(base);
  renderRentVsBuy(l);
}

if (hasCharts()) {
  Chart.defaults.font.family = css('--sans');
  Chart.defaults.color = css('--muted');
  Chart.defaults.borderColor = css('--line');
}
setupLenders();
document.querySelectorAll('input, select').forEach(el => el.addEventListener('input', render));
render();
