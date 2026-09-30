"""Re-analysis of the home-loan customer survey (30 borrowers each at SBI, ICICI Bank, HDFC and NBFCs).

    python survey/analyze.py

For every question it tests whether answers differ between lenders. With 30 people per
lender many cells are small, so the p-value comes from a permutation test of the
chi-square statistic (answers shuffled across lenders 20,000 times) rather than the
chi-square approximation. Cramér's V gives the size of the difference (0 = none, 1 = total).

Writes survey/results.md and survey/figures/*.png.
"""

from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import numpy as np  # noqa: E402
import pandas as pd  # noqa: E402

HERE = Path(__file__).resolve().parent
LENDERS = ["SBI", "ICICI", "HDFC", "NBFCs"]
BLUE, INK, MUTED, GRID = "#2a78d6", "#0b0b0b", "#52514e", "#e5e4df"
REPS = 20_000
SEED = 7


def table(df, q):
    t = df[df.question == q].pivot_table(index="answer", columns="lender", values="count", aggfunc="sum")[LENDERS]
    order = df[df.question == q].drop_duplicates("answer")["answer"]
    return t.loc[order]


def chi2_stat(t):
    t = np.asarray(t, float)
    t = t[t.sum(1) > 0]
    exp = t.sum(1, keepdims=True) * t.sum(0, keepdims=True) / t.sum()
    return ((t - exp) ** 2 / exp).sum(), t


def permutation_test(t, reps=REPS, seed=SEED):
    """p-value of the chi-square statistic under random reassignment of respondents to lenders."""
    stat, t = chi2_stat(t)
    answers = np.repeat(np.arange(t.shape[0]), t.sum(1).astype(int))
    sizes = t.sum(0).astype(int)
    groups = np.repeat(np.arange(t.shape[1]), sizes)
    rng = np.random.default_rng(seed)
    hits = 0
    for _ in range(reps):
        perm = rng.permutation(answers)
        sim = np.zeros_like(t)
        np.add.at(sim, (perm, groups), 1)
        hits += chi2_stat(sim)[0] >= stat - 1e-9
    n = t.sum()
    v = np.sqrt(stat / (n * (min(t.shape) - 1)))
    return stat, (hits + 1) / (reps + 1), v


def wilson(k, n, z=1.96):
    p = k / n
    d = 1 + z * z / n
    c = (p + z * z / (2 * n)) / d
    h = z * np.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d
    return max(0.0, c - h), min(1.0, c + h)


# the one share per question that best summarises it
HEADLINE = {
    "satisfaction": ("Highly satisfied", "Highly satisfied"),
    "info_source": ("Internet", "Found the loan online"),
    "time_consuming": (["Strongly agree", "Agree"], "Said it was time-consuming"),
    "paperwork": ("Yes", "Said it needed a lot of paperwork"),
    "rate_fair": ("Agree", "Rate in line with the market"),
    "aware_terms": ("Yes", "Aware of all terms"),
    "choice_factor": ("Interest rate", "Chose mainly on interest rate"),
    "gender": ("Female", "Women"),
    "occupation": ("Business", "Business owners"),
    "loan_age": ("Under 1 year", "Loan taken in the last year"),
    "age": ("31-40", "Aged 31-40"),
}


def share(t, answer):
    k = t.loc[answer].sum(axis=0) if isinstance(answer, list) else t.loc[answer]
    return k, t.sum(axis=0)


def chart(df, out):
    qs = ["satisfaction", "time_consuming", "paperwork", "info_source"]
    fig, axes = plt.subplots(1, len(qs), figsize=(12, 3.4), sharey=True)
    for ax, q in zip(axes, qs):
        ans, label = HEADLINE[q]
        k, n = share(table(df, q), ans)
        p = (k / n).values
        lo, hi = np.array([wilson(a, b) for a, b in zip(k, n)]).T
        x = np.arange(len(LENDERS))
        ax.bar(x, p, width=0.6, color=BLUE)
        ax.errorbar(x, p, yerr=[p - lo, hi - p], fmt="none", ecolor=INK, lw=1, capsize=3)
        for xi, pi in zip(x, p):
            ax.text(xi, pi / 2, f"{pi:.0%}", ha="center", va="center", fontsize=9, color="white", fontweight="bold", zorder=5, bbox=dict(facecolor=BLUE, edgecolor="none", pad=1.5))
        ax.set_xticks(x, LENDERS)
        ax.set_ylim(0, 1.08)
        ax.set_title(label, fontsize=10, color=INK, loc="left")
        ax.yaxis.set_major_formatter(matplotlib.ticker.PercentFormatter(1.0))
        ax.grid(axis="y", color=GRID, lw=0.8)
        ax.set_axisbelow(True)
        for s in ("top", "right"):
            ax.spines[s].set_visible(False)
        for s in ("left", "bottom"):
            ax.spines[s].set_color(GRID)
        ax.tick_params(colors=MUTED, labelsize=9)
    fig.text(0.01, 0.01, "30 borrowers per lender; lines show 95% intervals.", fontsize=8, color=MUTED)
    fig.tight_layout(rect=(0, 0.04, 1, 1))
    fig.savefig(out, dpi=160)
    plt.close(fig)


def main():
    df = pd.read_csv(HERE / "survey_counts.csv")
    (HERE / "figures").mkdir(exist_ok=True)
    rows = []
    for q in df.question.drop_duplicates():
        t = table(df, q)
        stat, p, v = permutation_test(t.values)
        ans, label = HEADLINE[q]
        k, n = share(t, ans)
        rows.append({"question": q, "text": df[df.question == q].question_text.iloc[0], "summary": label,
                     **{l: f"{k[l] / n[l]:.0%}" for l in LENDERS}, "p": p, "v": v})
    res = pd.DataFrame(rows)
    # Holm adjustment: with 11 questions, about one would reach p < 0.05 by chance alone
    order = res["p"].sort_values().index
    m, running = len(res), 0.0
    for i, idx in enumerate(order):
        running = max(running, min(1.0, (m - i) * res.at[idx, "p"]))
        res.at[idx, "p_holm"] = running
    chart(df, HERE / "figures" / "by_lender.png")

    lines = ["# Survey re-analysis", "",
             "120 home-loan borrowers, 30 from each of SBI, ICICI Bank, HDFC and NBFCs (non-bank lenders), from the report's survey tables "
             "([`survey_counts.csv`](survey_counts.csv)). For each question, the permutation test asks whether answers differ between lenders "
             "by more than chance would produce; Cramér's V measures how much (0 = not at all, 1 = completely).", "",
             "![Survey answers by lender](figures/by_lender.png)", "",
             "| Question | Share shown | SBI | ICICI | HDFC | NBFCs | p-value | Adjusted p | Cramér's V |",
             "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |"]
    for _, r in res.sort_values("p").iterrows():
        fmt = lambda x: "< 0.001" if x < 0.001 else f"{x:.3f}"
        lines.append(f"| {r.text} | {r.summary} | {r.SBI} | {r.ICICI} | {r.HDFC} | {r.NBFCs} | {fmt(r.p)} | {fmt(r.p_holm)} | {r.v:.2f} |")
    sig = res[res.p < 0.05].sort_values("p")
    strong = res[res.p_holm < 0.05].sort_values("p")
    lines += ["", f"**{len(sig)} of {len(res)} questions differ between lenders at the 5% level:** " + ", ".join(sig.text.str.lower()) + ". "
              f"After adjusting for testing {len(res)} questions at once (Holm's method), {len(strong)} still do: " + ", ".join(strong.text.str.lower()) + ".", "",
              "## Reading these results", "",
              "- **The groups are not alike to begin with.** SBI's borrowers are mostly men with loans taken 1–10 years ago; HDFC's and the NBFCs' "
              "loans are mostly under a year old, and the NBFC group has far more women and business owners. So a difference between lenders may "
              "reflect who was asked as much as how the lender behaves.",
              "- **This is a convenience sample,** not a random one, so the shares describe these 120 borrowers, not each lender's customers.",
              "- **With 30 people per lender, only large differences can be detected.** A share's 95% interval is roughly ±15–18 points.",
              "- **One table in the report is left out.** Its title repeats the one before it and it has no interpretation, so what it asked is unknown.", ""]
    (HERE / "results.md").write_text("\n".join(lines))
    print(res[["question", "summary", *LENDERS, "p", "v"]].to_string(index=False))


if __name__ == "__main__":
    main()
