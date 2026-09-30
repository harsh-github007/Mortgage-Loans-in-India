# Mortgage Loans in India

A study of home loans in India, with a calculator that works through what a loan really costs.

**Calculator:** https://harsh-github007.github.io/Mortgage-Loans-in-India/
**Research paper:** [A Study on Home Loans with Special Reference to Mortgage Loans in India: Before, During and After COVID-19](research/home-loans-in-india.md) ([PDF](research/home-loans-in-india.pdf))

## Key findings

- **Interest nearly doubles the cost.** On a ₹50 lakh, 20-year loan at 7.55%, interest adds up to ₹47 lakh, 94% of the amount borrowed. In year 1, 77% of the payments go to interest.
- **The lender matters.** Starting rates in September 2026 run from 7.20% to 8.35%, 2 to 3 points above the RBI's 5.25% repo rate. That spread is worth ₹8.5 lakh over a ₹50 lakh loan.
- **Prepay early.** ₹5 lakh prepaid in year 3 saves ₹10.9 lakh of interest and 3 years 3 months; the same amount in year 15 saves ₹1.9 lakh.
- **The tax break rarely decides the regime now.** At every salary tested, from ₹10 lakh to ₹50 lakh, the new tax regime beats the old regime with home-loan deductions.
- **Buying beats renting only if prices rise fast.** For a ₹75 lakh home renting at ₹22,000 a month, buying wins over 15 years only if prices rise more than about 7% a year.
- **Borrowers complain about the process, not the price.** In a survey of 120 borrowers, 88% found getting a loan time-consuming but 82% thought their rate fair, and lenders differed most on processing time.

## The calculator

A single page that runs in the browser, for any device:
- **Your loan:** EMI, total interest, and where each year's payments go, with a year-by-year table.
- **Prepaying:** a one-time or monthly prepayment, keeping either the EMI or the end date.
- **Repo-rate changes:** what a rise or cut does to a floating-rate loan.
- **Tax, FY 2026-27:** tax under the old regime with and without the loan, against the new regime.
- **Rent or buy:** wealth after a chosen number of years from buying versus renting and investing the difference.
- **Current rates:** starting rates at nine lenders in September 2026, with the spread over the repo rate.

The arithmetic is in [`assets/loan.js`](assets/loan.js), kept separate from the page so it can be tested.

## The survey

120 home-loan borrowers, 30 each at SBI, ICICI Bank, HDFC and non-bank lenders, answered 11 questions on who they are, how they chose their lender and how the loan process went. The counts are in [`survey/survey_counts.csv`](survey/survey_counts.csv), and [`survey/analyze.py`](survey/analyze.py) tests each question for differences between lenders, with permutation tests suited to the small groups and an adjustment for testing 11 questions. The results are in [`survey/results.md`](survey/results.md).

![Survey answers by lender](survey/figures/by_lender.png)

## Running it

```bash
python -m http.server 8000        # then open http://localhost:8000
npm test                          # 13 tests of the loan and tax arithmetic (Node 18+)
python survey/analyze.py          # re-run the survey analysis (pandas, numpy, matplotlib)
```

The site is static HTML, CSS and JavaScript with no build step, and [Chart.js](https://www.chartjs.org/) is included in `assets/vendor/`. [`.github/workflows/pages.yml`](.github/workflows/pages.yml) publishes it to GitHub Pages on every push.

## Project layout

```
index.html, assets/          the calculator
assets/loan.js               EMI, schedules, prepayment, rate changes, tax, rent vs buy
tests/loan.test.mjs          tests for loan.js
research/                    the research paper (Markdown and PDF)
survey/                      survey counts, analysis script, results and chart
```

For information only, not financial or tax advice.
