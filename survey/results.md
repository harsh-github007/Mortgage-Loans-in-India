# Survey re-analysis

120 home-loan borrowers, 30 from each of SBI, ICICI Bank, HDFC and NBFCs (non-bank lenders), from the report's survey tables ([`survey_counts.csv`](survey_counts.csv)). For each question, the permutation test asks whether answers differ between lenders by more than chance would produce; Cramér's V measures how much (0 = not at all, 1 = completely).

![Survey answers by lender](figures/by_lender.png)

| Question | Share shown | SBI | ICICI | HDFC | NBFCs | p-value | Adjusted p | Cramér's V |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Getting the loan was time-consuming | Said it was time-consuming | 63% | 100% | 100% | 87% | < 0.001 | < 0.001 | 0.32 |
| How long ago the loan was taken | Loan taken in the last year | 20% | 40% | 63% | 50% | 0.002 | 0.018 | 0.30 |
| Getting the loan needed a lot of paperwork | Said it needed a lot of paperwork | 70% | 40% | 50% | 80% | 0.007 | 0.063 | 0.32 |
| Satisfaction with the lender | Highly satisfied | 20% | 37% | 53% | 37% | 0.020 | 0.162 | 0.23 |
| Where they learned about the loan | Found the loan online | 27% | 57% | 50% | 77% | 0.028 | 0.198 | 0.23 |
| Occupation | Business owners | 37% | 20% | 20% | 50% | 0.039 | 0.235 | 0.22 |
| Gender | Women | 13% | 23% | 30% | 43% | 0.080 | 0.399 | 0.24 |
| Rate charged is in line with the market | Rate in line with the market | 87% | 77% | 93% | 70% | 0.109 | 0.436 | 0.23 |
| Main factor in choosing the lender | Chose mainly on interest rate | 70% | 67% | 63% | 77% | 0.374 | 1.000 | 0.17 |
| Age | Aged 31-40 | 53% | 57% | 53% | 53% | 0.835 | 1.000 | 0.12 |
| Aware of all terms and conditions | Aware of all terms | 67% | 70% | 77% | 73% | 0.902 | 1.000 | 0.08 |

**6 of 11 questions differ between lenders at the 5% level:** getting the loan was time-consuming, how long ago the loan was taken, getting the loan needed a lot of paperwork, satisfaction with the lender, where they learned about the loan, occupation. After adjusting for testing 11 questions at once (Holm's method), 2 still do: getting the loan was time-consuming, how long ago the loan was taken.

## Reading these results

- **The groups are not alike to begin with.** SBI's borrowers are mostly men with loans taken 1–10 years ago; HDFC's and the NBFCs' loans are mostly under a year old, and the NBFC group has far more women and business owners. So a difference between lenders may reflect who was asked as much as how the lender behaves.
- **This is a convenience sample,** not a random one, so the shares describe these 120 borrowers, not each lender's customers.
- **With 30 people per lender, only large differences can be detected.** A share's 95% interval is roughly ±15–18 points.
- **One table in the report is left out.** Its title repeats the one before it and it has no interpretation, so what it asked is unknown.
