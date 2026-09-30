# A Study on Home Loans with Special Reference to Mortgage Loans in India

*Updated September 2026. Every cost figure below can be reproduced in the [calculator](https://harsh-github007.github.io/Mortgage-Loans-in-India/), and the survey analysis in [`survey/analyze.py`](../survey/analyze.py).*

## Abstract

Home loans in India became markedly cheaper in 2025, when the Reserve Bank of India cut the repo rate from 6.50% to 5.25%; the best advertised home-loan rates now start at about 7.2%. This study asks what that means for a borrower in practice, and what borrowers themselves say about getting a loan. It combines three things: the loan arithmetic (instalments, prepayment, rate changes, tax and rent-versus-buy) worked through with current rates and the FY 2026-27 tax rules; current market data; and a survey of 120 home-loan borrowers at SBI, ICICI Bank, HDFC and non-bank lenders.

Four findings stand out. On a typical ₹50 lakh, 20-year loan, interest adds up to 94% of the amount borrowed, and more than three-quarters of the first year's payments go to interest. The gap between the cheapest and dearest mainstream lenders, about 1.15 percentage points, is worth ₹8.5 lakh over the loan. For salaried borrowers, the home-loan tax deductions no longer justify the old tax regime at any of the salaries tested. And in the survey, borrowers' main complaint was the process rather than the price: 88% found getting a loan time-consuming, with large differences between lenders.

## 1. The market in 2026

**Interest rates.** The RBI cut the repo rate four times in 2025, from 6.50% to 6.25% in February, 6.00% in April, 5.50% in June and 5.25% in December, and held it at 5.25% with a neutral stance on 5 August 2026, forecasting 5.0% CPI inflation and 6.7% GDP growth for 2026-27 [1, 2]. Since October 2019, banks have had to link new floating-rate retail loans to an external benchmark, almost always the repo rate. So these cuts pass directly into existing home loans at the next reset.

**What borrowers pay.** In September 2026, starting rates for salaried borrowers with good credit ranged from 7.20% (Punjab National Bank) and 7.25% (SBI) to 7.90% (HDFC Bank, PNB Housing Finance) and 8.35% (Axis Bank) [3, 4]. That is 2 to 3 percentage points above the repo rate. Borrowers with weaker credit, and self-employed borrowers, pay more.

| Lender | Starting rate | Above repo | EMI on ₹50 lakh, 20 years |
| --- | ---: | ---: | ---: |
| Punjab National Bank | 7.20% | 1.95 pts | ₹39,367 |
| State Bank of India | 7.25% | 2.00 pts | ₹39,519 |
| Bank of Baroda | 7.45% | 2.20 pts | ₹40,127 |
| LIC Housing Finance | 7.50% | 2.25 pts | ₹40,280 |
| ICICI Bank | 7.55% | 2.30 pts | ₹40,433 |
| Kotak Mahindra Bank | 7.70% | 2.45 pts | ₹40,893 |
| HDFC Bank | 7.90% | 2.65 pts | ₹41,511 |
| PNB Housing Finance | 7.90% | 2.65 pts | ₹41,511 |
| Axis Bank | 8.35% | 3.10 pts | ₹42,918 |

**Lending volumes.** Bank lending is growing fast: non-food bank credit was up 19.1% in the year to 31 July 2026, against 9.9% a year earlier, and housing loans kept growing at double-digit rates [5]. Outstanding housing loans had already reached about ₹27 lakh crore by March 2024, up ₹10 lakh crore in two years [6].

**Government support.** Under PMAY-Urban 2.0, first-time buyers with household incomes up to ₹9 lakh buying homes worth up to ₹35 lakh can receive an interest subsidy of up to ₹1.8 lakh [7].

## 2. What a home loan costs

The examples use a ₹50 lakh loan over 20 years at 7.55%, the middle of the September 2026 range.

**The instalment and the interest.** The EMI is ₹40,433. Over 20 years the borrower repays ₹97.0 lakh, so interest comes to **₹47.0 lakh, 94% of the amount borrowed**. Early payments are mostly interest: in year 1, ₹3.74 lakh of the ₹4.85 lakh paid, or **77%**, is interest.

**The lender matters.** At 7.20% the EMI is ₹39,367; at 8.35% it is ₹42,918. The ₹3,550 monthly difference adds up to **₹8.5 lakh over the loan**, which makes a 1-point difference in rate worth shopping for.

**Prepaying early is worth far more than prepaying late.** A one-time ₹5 lakh prepayment in year 3, keeping the EMI unchanged, saves **₹10.9 lakh** of interest and ends the loan 3 years 3 months sooner. The same ₹5 lakh in year 15 saves only ₹1.9 lakh. Floating-rate home loans to individuals carry no prepayment penalty.

**How rate changes reach borrowers.** Lenders usually keep the EMI when the rate moves and change the tenure instead:

- **A cut:** a ₹50 lakh loan taken at 8.80% in January 2025, with the 2025 cuts passed through in full, falls to 7.55% by December. With the EMI unchanged, it finishes **40 months sooner** and saves **₹18.2 lakh** in interest. Borrowers who ask to keep the tenure instead see their EMI fall from ₹44,345 to about ₹40,490.
- **A rise:** 0.5 percentage points on the base loan after a year lengthens it by 1 year 10 months and adds ₹8.7 lakh of interest.

**Tax (FY 2026-27).** From 1 April 2026 the Income-tax Act, 2025 applies, but the home-loan reliefs keep their limits. Under the old regime, a buyer living in the home can deduct up to ₹2 lakh of interest a year, and principal within the ₹1.5 lakh overall limit for tax-saving investments (the old Section 80C, now Section 123) [8]. The new regime, which is the default, allows neither for a self-occupied home. It has lower slabs, a ₹75,000 standard deduction, and no tax on salaries up to ₹12.75 lakh [9].

On the base loan, the deductions cut old-regime tax by about ₹97,000 in year 1 for a salaried borrower earning ₹15 lakh or more. That is still not enough: at every salary tested, from ₹10 lakh to ₹50 lakh, the **new regime leaves the borrower better off**, by ₹1.1–1.5 lakh a year at salaries of ₹20 lakh and above. This held with ₹75,000 of other deductions (health insurance and pension contributions), and with a ₹1 crore loan, since the interest deduction is capped at ₹2 lakh either way. For most salaried buyers of a home they will live in, the loan's tax benefit is no longer a reason to pick the old regime.

**Renting or buying.** Take a ₹75 lakh home that would rent for ₹22,000 a month, a rental yield of 3.5%. The buyer puts 20% down, pays 7% in stamp duty and registration, and borrows the rest at 7.55% over 20 years (an EMI of about ₹48,500). The renter invests the same upfront sum, and every month invests whatever buying would have cost beyond the rent, at 10% a year. Rent rises 5% a year and upkeep costs 0.5% of the home's value.

After 15 years, with home values rising 5% a year, the buyer holds ₹1.32 crore of home equity and the renter ₹1.89 crore. **Buying comes out ahead only if home prices rise faster than about 7.3% a year.** The break-even rate falls to 5.0% if the renter's investments earn 7%, and rises to 9.0% if they earn 12%. With Indian rental yields this low, whether buying pays depends mostly on price growth and on what the renter would earn instead.

## 3. What borrowers say: a survey

**Method.** 120 people with home loans answered a questionnaire: 30 each at SBI, ICICI Bank, HDFC and non-bank housing finance companies (NBFCs). They were reached by convenience, not at random, and included salaried employees, self-employed professionals, business owners and homemakers. For each question, a permutation test (20,000 random reshuffles of answers across lenders) checks whether lenders differ by more than chance. Cramér's V measures the size of the difference, and Holm's method adjusts for testing 11 questions at once. The counts are in [`survey/survey_counts.csv`](../survey/survey_counts.csv).

![Survey answers by lender](../survey/figures/by_lender.png)

| Question | Share shown | SBI | ICICI | HDFC | NBFCs | p-value | Adjusted p |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Getting the loan was time-consuming | Agree | 63% | 100% | 100% | 87% | < 0.001 | < 0.001 |
| How long ago the loan was taken | Under a year | 20% | 40% | 63% | 50% | 0.002 | 0.018 |
| It needed a lot of paperwork | Yes | 70% | 40% | 50% | 80% | 0.007 | 0.063 |
| Satisfaction with the lender | Highly satisfied | 20% | 37% | 53% | 37% | 0.020 | 0.162 |
| Where they learned about the loan | Online | 27% | 57% | 50% | 77% | 0.028 | 0.198 |
| Occupation | Business owners | 37% | 20% | 20% | 50% | 0.039 | 0.235 |
| Rate is in line with the market | Agree | 87% | 77% | 93% | 70% | 0.109 | 0.436 |
| Main reason for choosing the lender | Interest rate | 70% | 67% | 63% | 77% | 0.374 | 1.000 |
| Aware of all terms and conditions | Yes | 67% | 70% | 77% | 73% | 0.902 | 1.000 |

**Findings.**

- **The process is the pain point, not the price.** 88% of borrowers found getting the loan time-consuming, and 60% said it needed a lot of paperwork. Yet 82% thought their rate was in line with the market, and 69% chose their lender mainly on rate.
- **Lenders differ most on the process.** Every ICICI and HDFC borrower found it time-consuming, against 63% at SBI; this is the one difference that stays clear after adjusting for the number of tests. Paperwork was most often a burden at NBFCs (80%) and least at ICICI (40%).
- **Satisfaction was high but not deep.** 88% were satisfied or highly satisfied. Only 20% of SBI borrowers were *highly* satisfied, against 53% at HDFC, although that difference does not survive the adjustment.
- **Online is now the main way borrowers find a loan.** 53% overall, and 77% at NBFCs, against 27% at SBI, whose borrowers more often heard of their loan through television.
- **The four groups are not alike,** which limits every comparison. SBI's borrowers mostly took their loans 1–10 years ago, while HDFC's and the NBFCs' loans are mostly under a year old. The NBFC group has more business owners and women. Some differences between lenders may reflect who was asked, and when they borrowed, rather than how the lender works today.

## 4. Conclusions

**For borrowers:**

1. **Compare the spread over the repo rate, not the headline rate.** A 1-point difference costs about ₹7.5 lakh on a ₹50 lakh, 20-year loan.
2. **Prepay early if you can.** ₹5 lakh in year 3 saves more than five times what it saves in year 15.
3. **When the repo rate falls, check your lender has passed the cut on,** and decide whether a shorter loan or a lower EMI suits you better.
4. **Compare both tax regimes before choosing the old one for the home loan.** For most salaried owner-occupiers the new regime now wins anyway.
5. **Treat rent-versus-buy as a bet on house prices.** At today's rental yields, buying only wins if prices grow faster than the return the money could earn elsewhere.

**For lenders:** borrowers in this survey were broadly content with rates but not with the process. Faster sanctioning and less paperwork are where lenders can differ most. The online channel, already the main source for NBFC borrowers, is where most new borrowers look first.

## 5. Limitations

- **The survey is small and not random.** 30 borrowers per lender can only reveal large differences, and the results describe these 120 people, not each lender's customers.
- **Rates are advertised starting rates.** Actual rates depend on credit score, loan size and employment.
- **The tax examples are simplified.** They cover salaried residents under 60 and leave out surcharge on incomes above ₹50 lakh.
- **Rent-versus-buy results depend on assumptions.** Price growth, rent growth and investment returns are all uncertain, so the break-even points matter more than any single result.

## Sources

1. [RBI Policy Update August 2026: Repo Rate Unchanged at 5.25%](https://www.indiainfoline.com/news/economy/rbi-policy-update-august-2026-repo-rate-unchanged-at-5-25-fy27-gdp-growth-raised-to-6-7-inflation-forecast-cut), India Infoline
2. [Repo Rate 2026: history of changes](https://cleartax.in/s/repo-rate), ClearTax
3. [Home Loan Interest Rates, September 2026](https://www.urbanmoney.com/home-loan/interest-rate), Urban Money (updated 28 September 2026)
4. [Home Loan Interest Rates](https://www.icici.bank.in/personal-banking/loans/home-loan/interest-rates), ICICI Bank
5. [Bank credit growth jumps to 19.1% in July](https://aninews.in/news/business/bank-credit-growth-jumps-to-191-in-july-nearly-doubles-from-year-ago-level-rbi20260831194906/), ANI, citing RBI data (31 August 2026)
6. [Home loan outstanding up by ₹10 lakh crore in last 2 years](https://www.outlookbusiness.com/news/home-loan-outstanding-up-by-rs-10-lakh-crore-in-last-2-yrs-reaches-rs-27-lakh-crore-in-march-rbi-data), Outlook Business, citing RBI data
7. [PMAY-U 2.0: benefits, eligibility and subsidy](https://www.icicihfc.com/en/loans/home-loan/pmay-u-2-0), ICICI Home Finance
8. [Home Loan Tax Benefits: Full Guide FY 2026-27](https://taxgarden.in/blog/home-loan-tax-benefits-section-24-80c-india-fy-2026-27), Tax Garden
9. [Income Tax Slabs FY 2025-26 and FY 2026-27](https://cleartax.in/s/income-tax-slabs), ClearTax
