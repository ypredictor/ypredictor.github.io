# YPredictor — Y-DNA haplogroup predictor and STR matcher

**A free online tool for DNA genealogy: it predicts your Y-chromosome haplogroup from Y-STR markers and finds your closest matches in a reference corpus.**



*Read this in other languages: [Русский](README.ru.md).*

### 🔗 Open: **[ypredictor.github.io](https://ypredictor.github.io/)**

Paste the STR markers from your FamilyTreeDNA test and get a predicted Y-tree branch and a list of the closest related haplotypes with an estimate of the age of the common ancestor (TMRCA). Everything is computed **right in your browser**: no registration, no uploading your data to a server.


## Demo

https://github.com/user-attachments/assets/8dc3ce12-ab0c-49af-b5c2-490f81381e1b

<sub>Mobile view: paste STR markers → run the prediction → open the match tree and walk the branch → collapse the tree → tap through the matches → then search by a Kit number from a completely different haplogroup.</sub>

---

## Why this is useful

For shallow tests (37–67 markers) labs often stop at a broad group — for example J1-Z1842, which fits a large part of the Caucasus. To find out the specific young subclade you usually have to order an expensive Big Y test. YPredictor estimates that deep branch **from the STR markers you already have** — for free and in seconds.

---

## Principle: trustworthy, robust predictions

YPredictor's parameters are **calibrated against cross-validation, not guessed**. The predictor is **learned from open data and confirmed against it**, and a new version ships **only if the calibrated clades stay within their accuracy thresholds**.

A scheduled pipeline runs continuously: it scrapes fresh public FTDNA data, recomputes neighbors and re-derives the predictor, then measures accuracy by **leave-one-out cross-validation**. A build is published only when every calibrated clade stays within its accuracy threshold — a build that would push a clade past that bound is blocked. So a corpus refresh cannot quietly ship a quality regression on the calibrated clades.

That is what *trustworthy* and *robust* mean here in practice:

- **Robust** — the descent stops where the data stops supporting it (`minSupport` / `margin` / `topK`), and noisy short haplotypes and biasing reference groups are kept out of voting. The predictor would rather return a shorter, correct branch than a deep, brittle guess.
- **Trustworthy** — every prediction reports its depth, confidence and reliability; the accuracy figures come from cross-validation; and deployment is **gated** on those figures staying within set thresholds.

---

## Features

### 🧬 Haplogroup prediction
- Descent down the phylogenetic Y-tree by **nearest-neighbor voting** — each neighbor votes for a branch, and the closer the haplotype, the heavier its vote.
- **Clade-anchored mode** for calibrated clades (J1-Z1842, J2-M172, R1b-M269, R1a-M417, G2-P15): if the nearest neighbor belongs to a known clade, the prediction is built only from that clade's members with parameters tuned to those populations — noticeably more accurate.
- **Not only "Caucasian" clades.** The tool accepts any Y-STR haplotype and predicts across the whole Y-tree — the corpus also contains kits of rarer haplogroups (**T, N, O, E, L, Q, I** and others), so for them the predictor also finds neighbors and determines a branch (with the ordinary prediction, without clade calibration).
- For every result it shows the **depth** (how many tree nodes were traversed), the **confidence** (share of votes for the branch) and a reliability heuristic.
- Links to the terminal SNP in FTDNA Discover straight from the result.

> **Example.** From a shallow test the lab reports the broad group J1. From the markers the predictor builds the path down to a young branch: `J1 → ZS3042 → ZS4880 → B233` (B233 is one of the large Dargin branches). Such branches developed in the Caucasus and are usually not visible in the lab result.

### 🔍 STR matcher
- More than just prediction: a full search for the **closest matches** — up to 50 neighbors, sorted by **TMRCA age** (the 0.95 probability point) rather than simply by genetic distance.
- For each neighbor: haplogroup, project, TMRCA in years, `diff/cmp` (differences / compared markers), number of markers.
- Correct distance computation accounting for palindromic markers (CDY, DYF395, etc.) and the DYS389 correction.

### 🌳 Match tree
- After the calculation, press **"🌳 Show on tree"** — a fragment of the Y-tree opens with your closest matches placed on their nodes and a **"You"** marker on the predicted branch.
- It clearly shows how the matches are distributed across subclades and where your haplotype falls among them.

### ⌨️ Input
- Y-STR markers in the standard FamilyTreeDNA order: **Y-12 / Y-37 / Y-67 / Y-111** and STR values from **Big Y**.
- Values from YSEQ and other providers — entered manually, if the same marker order is preserved.
- Or just a **Kit number** from the corpus — the tool will fill in its markers.
- Separators are space, comma or newline; palindromes look like `15-17`.

### 📲 PWA — installs as an app
- **Works offline**: a service worker caches the app shell and the corpus (stale-while-revalidate), so after the first visit the predictor is available without a network connection.
- **Installs to the home screen** (Android/Chrome — via a button, iOS — "Share" → "Add to Home Screen") and launches as a native app in its own window.
- Dark/light theme, responsive layout, fast startup.

### 🔄 Scheduled auto-update
- The corpus and code are **rebuilt on a cron**: scrape public FTDNA projects → recompute neighbors → build a new PWA version → automatic commit and publish. The new version is published **only if leave-one-out cross-validation shows the calibrated clades still within their accuracy thresholds** — otherwise the release is blocked.
- The version is a content hash of the corpus and code; when it changes, the service worker pulls the new data in the background and shows installed users a toast **"Updated to version …"** offering to reload.
- No manual updates: an open tab and the installed app fetch the fresh corpus on their own.

### 🌐 Bilingual and private
- **RU/EN** interface — auto-detected from the browser language, with a manual switch.
- **Markers never leave the page** — all computation is local, there is no server backend.
- The corpus contains no personal names: only haplogroup, markers and a project label.

### 🔗 Sharing
- The "Share" button builds a link with the markers embedded — the recipient opens the predictor with a ready result.
- The share text contains the predicted haplogroup and the top closest matches (haplogroup · project · TMRCA age).

---

## How to use

1. Open **[ypredictor.github.io](https://ypredictor.github.io/)** (or install it as an app).
2. Paste your Y-STR markers from your FamilyTreeDNA account (or a Kit number from the corpus).
3. Press **"Predict"** — you get the haplogroup, reliability metrics and a table of the closest neighbors.
4. Press **📋** on a neighbor to fill in its markers, or **🔗** to share the result.

> The **?** icon next to each metric opens an explanation — what "depth", "confidence", "mode" and "reliable?" mean.

---

## Accuracy and limitations

Prediction is **probabilistic**. Deep branches that are well represented in the corpus are estimated reliably; shallow, rare or borderline ones less confidently — this is an inherent property of estimation from STRs.

**The predicted haplogroup is a hypothesis, not a confirmed result.** Only an SNP test (**FamilyTreeDNA Big Y** or a targeted test for an individual SNP) confirms the exact terminal haplogroup. Use the predictor to decide which test to order.

The corpus and calibration are oriented primarily toward Caucasus populations (the J1-Z1842, J2-M172 and other clades), but the tool accepts any Y-STR haplotypes.

---

## Accuracy by clade

The accuracy of the calibrated clades is measured by **leave-one-out cross-validation** on kits with a deep confirmed path (≥5 tree nodes) inside the clade: for each such kit the prediction is built from its neighbors (excluding the kit itself) and compared with the known branch.

<!-- accuracy-table:start -->
| Clade | Kits tested | Correct branch | Avg. match depth |
|-------|:---:|:---:|:---:|
| **J1-Z1842** | 483 | 93.8 % | 3.98 |
| **J2-M172** | 1665 | 96.5 % | 9.50 |
| **R1b-M269** | 92 | 94.6 % | 5.95 |
| **R1a-M417** | 81 | 95.1 % | 6.15 |
| **G2-P15** | 61 | 93.4 % | 9.13 |
<!-- accuracy-table:end -->

- **Correct branch** — the share of predictions where the path did not go down a wrong fork of the tree (it may be shorter or deeper than the true one, but on the same lineage).
- **Avg. match depth** — the average number of path nodes (from the root) that matched the truth; the larger, the more detailed the prediction.

The numbers are generated from the current corpus (2026-07) by the project's `emit-accuracy` script. The tool is not limited to these five clades: it accepts any Y-STR haplotype and also handles rarer haplogroups — **T, N, O, E, L, Q, I** and others — with the ordinary (non-clade-calibrated) prediction.

---

## How it works (technically)

- **Everything is computed in the browser.** The math (distance, TMRCA, prediction) is ported to JS; the Y-chromosome tree is not needed on the client — precomputed paths (breadcrumbs) and clade labels are baked into the corpus.
- **Genetic distance** — normalized by STR, with per-allele handling of palindromic markers (CDY, DYF395…) and the DYS389 correction.
- **TMRCA** — an estimate of the time to the common ancestor by the GMRCA method with extrapolation for distant pairs; neighbors are sorted precisely by age, not by "raw" distance.
- **Prediction algorithm** — a plurality descent down the tree: at each node the branch with the largest weight of neighbor votes is chosen; the descent continues while the branch has enough support and margin over the second-best (the `minSupport` / `margin` / `topK` thresholds). Under a calibrated clade only its members vote, with the clade's parameters (clade-anchored).
- **Voting and non-voting neighbors.** Only the **closest** neighbors (top-K) vote for a branch, and the closer the haplotype the heavier the vote; distant neighbors are visible in the list but do not vote for a branch. Part of the corpus is marked with a **"predictor only"** badge — these are reference kits from donor projects: they add votes and widen coverage but are not counted as full matches. Some reference groups are deliberately **excluded from voting** (a methodological decision, so as not to bias the estimate), while still remaining visible among the neighbors. Domain rules apply too — for example, on a "bare" broad result an incompatible sub-branch does not vote. Haplotypes that are too short (fewer than ~14 markers) do not participate as matches: the distance to them is too noisy.

- **Calibration parameters** (minSupport / margin / topK): J1-Z1842 `5 / 2.5 / 15` · J2-M172 `5 / 4 / 15` · R1b-M269 `5 / 2.5 / 10` · R1a-M417 `5 / 4 / 20` · G2-P15 `4 / 2.5 / 10`.
- **Corpus** — over 10,000 kits (haplogroup + markers + precomputed path), gzip-compressed and loaded as a separate file; it contains no personal names, only a project label.
- **PWA** — the service worker caches the shell and the corpus with the stale-while-revalidate scheme; the build version = a content hash of the data and code, and updates are pulled in the background.

---

## Sources

Haplogroup names and Y-tree topology follow established phylogenetic sources:

- [YFull Y-tree (YTree)](https://www.yfull.com/tree/) — an SNP tree of the Y chromosome with branch age estimates
- [ISOGG Y-DNA Haplogroup Tree](https://isogg.org/tree/) — the ISOGG consensus tree
- [FamilyTreeDNA Discover](https://discover.familytreedna.com/) — a public haplotree and STR resources

---

## Acknowledgments

The **TMRCA** calculation and the **STR matcher** were inspired by and largely born thanks to **[Dean McGee's Y-DNA Comparison Utility](http://www.mymcgee.com/tools/yutility111.html)** — a classic tool for comparing Y-STR haplotypes and estimating the time to the common ancestor. Thanks to its author for the methodology and years of contribution to DNA genealogy.

---

## About this repository

The site's contents (`index.html`, `corpus.gz`, `sw.js`, `manifest.webmanifest`, `sitemap.xml`, etc.) are **automatic build artifacts**. They are generated and published by a cron job from the main computation engine (scrape FTDNA → normalize → precompute neighbors → build the PWA) and are updated on every data change. The prose in this README is written by hand; the accuracy table above is generated from the current corpus by the `emit-accuracy` script.

---

*The tool is made for DNA genealogists and researchers of paternal lines. It is not a medical or diagnostic service.*
