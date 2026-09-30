"""Repo rate and housing sales across the pre-COVID, COVID and post-COVID eras."""
from datetime import date
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

REPO = [(date(2016,1,1),6.75),(date(2016,4,5),6.50),(date(2016,10,4),6.25),(date(2017,8,2),6.00),(date(2018,6,6),6.25),
        (date(2018,8,1),6.50),(date(2019,2,7),6.25),(date(2019,4,4),6.00),(date(2019,6,6),5.75),(date(2019,8,7),5.40),
        (date(2019,10,4),5.15),(date(2020,3,27),4.40),(date(2020,5,22),4.00),(date(2022,5,4),4.40),(date(2022,6,8),4.90),
        (date(2022,8,5),5.40),(date(2022,9,30),5.90),(date(2022,12,7),6.25),(date(2023,2,8),6.50),(date(2025,2,7),6.25),
        (date(2025,4,9),6.00),(date(2025,6,6),5.50),(date(2025,12,5),5.25),(date(2026,9,30),5.25)]
SALES = {2018:1.95,2019:2.36,2020:1.28,2021:2.36,2022:3.65,2023:4.77,2024:4.60,2025:3.96}  # lakh units, top 7 cities (ANAROCK)
ERAS = [("Pre-COVID",date(2016,1,1),date(2020,3,1),"#eef3fb"),("COVID",date(2020,3,1),date(2022,4,1),"#fdf0e6"),("Post-COVID",date(2022,4,1),date(2026,10,1),"#edf7f2")]

fig, (a, b) = plt.subplots(2, 1, figsize=(8, 5.6), sharex=True, gridspec_kw={"height_ratios":[1.1,1]})
for ax in (a, b):
    for name, s, e, c in ERAS:
        ax.axvspan(s, e, color=c, zorder=0)
    ax.spines[["top","right"]].set_visible(False)
for name, s, e, c in ERAS:
    a.text(s + (e - s) / 2, 7.05, name, ha="center", fontsize=9.5, weight="bold", color="#333")
a.step([d for d,_ in REPO], [r for _,r in REPO], where="post", color="#2a78d6", lw=2)
a.set_ylim(3.5, 7.4); a.set_ylabel("RBI repo rate (%)")
a.set_title("Interest rates and home sales in India, 2016–2026", loc="left", fontsize=11, weight="bold")
xs = [date(y,7,1) for y in SALES]; ys = list(SALES.values())
b.bar(xs, ys, width=250, color="#e8833a")
for x, y in zip(xs, ys):
    b.text(x, y + 0.1, f"{y:.2f}", ha="center", fontsize=8)
b.set_ylim(0, 5.4); b.set_ylabel("Homes sold, top 7\ncities (lakh units)")
b.xaxis.set_major_locator(mdates.YearLocator()); b.xaxis.set_major_formatter(mdates.DateFormatter("%Y"))
b.set_xlim(date(2016,1,1), date(2026,10,1))
fig.text(0.01, 0.005, "Sources: RBI policy announcements; ANAROCK annual housing reports.", fontsize=7.5, color="#666")
fig.tight_layout(rect=(0,0.02,1,1))
fig.savefig("research/figures/eras.png", dpi=180)
