#!/usr/bin/env python3
"""Phase 11 AEO: inject answer-first blocks, citation, use-case, limitations, entity; Organization JSON-LD; Article publisher-only."""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

PERSON_SNIPPET = """  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Albor Digital LLC",
    "url": "https://roicalculator.live"
  }
  </script>
"""

DEFAULT_USE = [
    "Evaluating investment profitability",
    "Comparing multiple opportunities",
    "Estimating return over time",
]
DEFAULT_LIM = [
    "Does not account for time value of money",
    "Depends on assumptions",
    "May not reflect risk",
]


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def build_rest(
    citation_topic: str,
    entity_h2: str,
    entity_p: str,
    use_cases: list[str] | None = None,
    limitations: list[str] | None = None,
) -> str:
    use_cases = use_cases or DEFAULT_USE
    limitations = limitations or DEFAULT_LIM
    cite = (
        f'<section class="ai-citation">\n'
        f'  <p>This page provides a structured explanation of {esc(citation_topic)}, including formulas, examples, limitations, and comparisons with related financial metrics.</p>\n'
        f"</section>"
    )
    uc = (
        '<section class="use-case-block">\n'
        "  <h2>When to Use This Calculation</h2>\n"
        "  <ul>\n"
        + "".join(f"    <li>{esc(u)}</li>\n" for u in use_cases)
        + "  </ul>\n"
        "</section>"
    )
    lim = (
        '<section class="limitations-block">\n'
        "  <h2>Limitations of This Metric</h2>\n"
        "  <ul>\n"
        + "".join(f"    <li>{esc(u)}</li>\n" for u in limitations)
        + "  </ul>\n"
        "</section>"
    )
    ent = (
        '<section class="entity-definition">\n'
        f"  <h2>{esc(entity_h2)}</h2>\n"
        f"  <p>{esc(entity_p)}</p>\n"
        "</section>"
    )
    return f"{cite}\n\n{uc}\n\n{lim}\n\n{ent}"


def build_quick(text: str) -> str:
    return (
        '<section class="ai-answer-block">\n'
        f"  <p><strong>Quick Answer:</strong> {esc(text)}</p>\n"
        "</section>"
    )


# (quick, citation_topic, entity_h2, entity_p, use_cases|None, limitations|None)
# citation_topic: phrase after "explanation of ..." — no trailing period in stored string
SPECIAL: dict[str, tuple] = {
    "index.html": (
        "ROI is a profitability metric: net profit divided by investment cost, times 100. This site’s calculator runs locally in your browser—no data is sent to a server.",
        "return on investment (ROI), annualized ROI, and industry benchmarks on roicalculator.live",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost. In financial analysis, it is expressed as a percentage of gain or loss versus the amount invested.",
        None,
        None,
    ),
    "404.html": (
        "This URL does not exist on roicalculator.live. Use the home page, sitemap, or navigation to find ROI calculators and guides.",
        "site navigation and how to locate ROI tools and educational pages",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        ["Finding calculators and guides after a broken link", "Returning to the main ROI hub", "Using the sitemap for structure"],
        ["This page does not perform calculations", "Content is navigation-only", "URLs may change with site updates"],
    ),
    "sitemap.html": (
        "The sitemap lists main sections of roicalculator.live: learn, glossary, comparisons, benchmarks, and specialized ROI calculators.",
        "site structure and links to ROI education and calculator hubs",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        ["Discovering all public sections of the site", "Choosing a calculator or guide by topic", "Cross-checking internal navigation"],
        ["Does not replace full-text search within pages", "May omit minor utility pages", "Updated periodically"],
    ),
    "site-structure.html": (
        "This page summarizes how roicalculator.live groups learn content, glossary terms, comparisons, benchmarks, and calculator verticals.",
        "information architecture for ROI-related content",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        ["Understanding hub-and-spoke layout for ROI topics", "Planning which section to read first", "Linking glossary terms to calculators"],
        ["Describes structure, not personalized advice", "Industry benchmarks are illustrative", "Assumptions vary by use case"],
    ),
    "about.html": (
        "roicalculator.live publishes ROI formulas, calculators, and benchmarks with a privacy-first, client-side execution model.",
        "the site’s purpose, methodology, and privacy stance",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        ["Learning who publishes the calculators and guides", "Understanding privacy and methodology", "Evaluating whether to rely on the content"],
        ["Not individualized investment advice", "Examples use simplified assumptions", "Regulatory context varies by jurisdiction"],
    ),
    "privacy.html": (
        "This policy states that core calculators run in your browser and that the site minimizes data collection consistent with that design.",
        "privacy practices for roicalculator.live",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        ["Understanding what data may be processed when you use the site", "Reviewing cookie and analytics posture", "Comparing to other financial sites"],
        ["Does not cover third-party ad networks’ policies unless stated", "May be updated; check the effective date", "Not legal advice"],
    ),
    "terms.html": (
        "These terms describe permitted use of roicalculator.live content and calculators and limit liability for decisions based on the site.",
        "terms of use for roicalculator.live",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        ["Understanding limitations of use", "Reviewing disclaimers before relying on outputs", "Clarifying intellectual property"],
        ["Not a substitute for professional advice", "Jurisdiction-specific rules may apply", "Examples are illustrative"],
    ),
    "methodology.html": (
        "The methodology explains how ROI, annualized ROI, and related figures are defined and computed across this site’s tools and tables.",
        "methodology for ROI and related metrics on roicalculator.live",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        ["Aligning your inputs with site definitions", "Comparing calculator outputs to external models", "Auditing assumptions for reports"],
        ["Simplified models omit taxes, fees, and idiosyncratic costs unless noted", "Benchmarks are ranges, not guarantees", "Time value of money may require IRR/NPV for complex flows"],
    ),
    # Learn
    "learn/what-is-roi.html": (
        "ROI measures gain or loss on an investment as a percentage of cost: (Net gain ÷ Investment cost) × 100. Investors typically use it to compare investments and communicate profitability in one number.",
        "what ROI means, how it is calculated, and where it is applied",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost. It is a profitability metric often cited alongside investment return and capital efficiency discussions.",
        None,
        None,
    ),
    "learn/roi-formula.html": (
        "The basic ROI formula is [(Final value − Initial investment) ÷ Initial investment] × 100. This financial return calculation expresses total return as a percentage of capital deployed.",
        "the ROI formula, variants, and notation used in financial return calculation",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    "learn/how-to-calculate-roi.html": (
        "Compute ROI by dividing net profit (or gain) by total investment cost and multiplying by 100; use annualized ROI when comparing different holding periods.",
        "step-by-step ROI and annualized ROI calculation",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    "learn/roi-limitations.html": (
        "ROI ignores timing of cash flows, risk, and sometimes hidden costs; annualized ROI and IRR address some but not all gaps.",
        "limitations of ROI as a profitability metric",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        ["Does not discount future cash flows (unless using NPV/IRR)", "Depends on which costs and revenues are included", "May not reflect risk or liquidity"],
    ),
    "learn/roi-vs-irr.html": (
        "ROI is a simple percentage return over a period; IRR is the discount rate that sets NPV of cash flows to zero—better when inflows and outflows occur at different times.",
        "differences between ROI and internal rate of return (IRR)",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    # Comparisons hub + pages
    "comparisons/index.html": (
        "These pages contrast ROI with IRR, NPV, payback, cap rate, ROAS, and related metrics so you pick the right profitability metric for each decision.",
        "ROI versus IRR, NPV, payback period, and related metrics",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    "comparisons/roi-vs-irr.html": (
        "ROI summarizes total return versus cost; IRR incorporates the timing of cash flows and is the rate that zeroes NPV—use IRR for multi-period, irregular flows.",
        "ROI versus internal rate of return (IRR)",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    "comparisons/roi-vs-npv.html": (
        "ROI is a percentage return on cost; NPV discounts future cash flows at a chosen rate and sums them in today’s dollars—NPV answers value creation, ROI answers simple return.",
        "ROI versus net present value (NPV)",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    "comparisons/roi-vs-payback-period.html": (
        "ROI expresses return as a percent of investment; payback period is the time to recover initial cost—payback ignores returns after payback and the time value of money unless extended.",
        "ROI versus payback period",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    "comparisons/cap-rate-vs-roi.html": (
        "Cap rate is NOI divided by value (a snapshot yield); ROI is return on a specific investment over time and can include leverage and appreciation.",
        "cap rate versus ROI in real estate",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        ["Comparing listed yields across properties", "Evaluating total return including financing", "Separating income yield from appreciation"],
        ["Cap rate excludes financing and appreciation by construction", "ROI definitions vary by what is included in gain", "Neither captures risk without extra analysis"],
    ),
    "comparisons/cash-on-cash-vs-roi.html": (
        "Cash-on-cash return is annual pre-tax cash flow divided by equity invested; ROI can include appreciation and total gain over the full hold.",
        "cash-on-cash return versus ROI",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    "comparisons/roas-vs-roi.html": (
        "ROAS is revenue per advertising dollar; ROI subtracts costs to measure profit versus spend—ROAS is a revenue efficiency ratio, not full profitability.",
        "return on ad spend (ROAS) versus ROI",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    # Benchmarks
    "benchmarks/index.html": (
        "Industry ROI benchmarks are reference ranges for stocks, real estate, SaaS, marketing, and small business—always interpret with risk and methodology.",
        "industry ROI benchmarks and how to interpret ranges",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        ["Placing a project’s ROI next to industry norms", "Sanity-checking forecasts", "Communicating expectations to stakeholders"],
        ["Benchmarks are aggregated and time-varying", "Your deal may differ from the median", "Definitions of ROI vary by source"],
    ),
    "benchmarks/average-roi-by-industry.html": (
        "Average ROI by industry is a rough compass: reported figures depend on period, definition, and data source—use as context, not a target.",
        "average ROI ranges by industry",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    "benchmarks/marketing-roi-benchmarks.html": (
        "Marketing ROI benchmarks depend on channel, margin, and attribution; typical marketing ROI figures are cited as wide ranges and must match your profit definition.",
        "marketing ROI benchmark ranges",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        ["Budgeting and forecasting marketing performance", "Comparing channels on a profit basis", "Setting internal hurdle rates"],
        ["Attribution models change reported ROI", "Revenue-based ROI overstates profit if margin is low", "Benchmarks age quickly as markets shift"],
    ),
    "benchmarks/real-estate-roi-benchmarks.html": (
        "Real estate ROI benchmarks mix cap rates, cash-on-cash, and levered returns—compare like with like and include financing and taxes in your model.",
        "real estate ROI benchmark context",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    "benchmarks/saas-roi-benchmarks.html": (
        "SaaS ROI benchmarks tie growth and margin to CAC, LTV, and payback—unit economics matter as much as headline ROI percentages.",
        "SaaS ROI and unit-economics benchmarks",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    "benchmarks/small-business-roi-benchmarks.html": (
        "Small business ROI varies by industry and stage; benchmarks help set expectations but idiosyncratic execution dominates averages.",
        "small business ROI benchmark context",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    "benchmarks/solar-roi-benchmarks.html": (
        "Solar ROI benchmarks depend on utility rates, incentives, system cost, and production—regional differences often exceed global averages.",
        "solar and energy ROI benchmark context",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    # Glossary index
    "glossary/index.html": (
        "The glossary defines ROI-related terms—CAC, LTV, cap rate, payback, and more—with formulas tied back to investment return and profitability metrics.",
        "financial terms used alongside ROI and investment return analysis",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost. This glossary connects terminology used in profitability metric discussions.",
        ["Looking up definitions while reading calculators", "Aligning vocabulary across teams", "Linking metrics to ROI calculations"],
        ["Definitions are educational, not accounting standards for every firm", "Formulas may omit firm-specific allocations", "Regulatory labels vary by jurisdiction"],
    ),
}

# Glossary term pages: (quick, citation, entity_h2, entity_p, use_cases, limitations)
GLOSSARY: dict[str, tuple] = {
    "glossary/cac.html": (
        "Customer Acquisition Cost (CAC) is total acquisition spend divided by new customers acquired in the period.",
        "Customer Acquisition Cost (CAC), its formula, and relationship to LTV and ROI",
        "What Is CAC (Customer Acquisition Cost)?",
        "Customer Acquisition Cost (CAC) is the average cost to acquire one new customer, including marketing and sales spend allocated to acquisition.",
        ["Evaluating marketing efficiency", "Comparing channels on a cost-per-customer basis", "Pairing with LTV for unit economics"],
        ["Attribution choices affect CAC", "Time lag between spend and conversion distorts period CAC", "May omit indirect brand costs unless included"],
    ),
    "glossary/ltv.html": (
        "Lifetime Value (LTV) is the profit or revenue expected from a customer over their relationship; compare to CAC for payback and ROI of acquisition.",
        "Lifetime Value (LTV) and its use with CAC and ROI",
        "What Is LTV (Lifetime Value)?",
        "Lifetime Value (LTV) is the total value attributed to a customer over the relationship, often expressed as profit or revenue depending on company practice.",
        ["Sizing acquisition budgets", "Computing LTV:CAC and marketing ROI", "Segmenting high-value cohorts"],
        ["LTV models rely on churn and margin assumptions", "Revenue-based LTV overstates profit if margin is low", "Historical cohorts may not predict future behavior"],
    ),
    "glossary/cap-rate.html": (
        "Cap rate is net operating income divided by property value—a snapshot yield on an all-cash purchase, before financing and appreciation.",
        "capitalization rate (cap rate) in real estate",
        "What Is Cap Rate (Capitalization Rate)?",
        "Cap rate is the ratio of net operating income to property value, expressed as a percentage, used to compare property yields.",
        ["Comparing rental properties on a yield basis", "Valuing income-producing real estate", "Screening deals before detailed underwriting"],
        ["Excludes financing and appreciation", "NOI definitions vary", "Not a forecast of total return"],
    ),
    "glossary/churn-rate.html": (
        "Churn rate is the share of customers or revenue lost in a period; it directly affects LTV and the ROI of retention programs.",
        "churn rate and its effect on subscription economics",
        "What Is Churn Rate?",
        "Churn rate measures customer or revenue attrition over a period, commonly used in subscription and SaaS businesses.",
        ["Forecasting recurring revenue", "Evaluating retention ROI", "Stress-testing LTV models"],
        ["Churn definitions differ (logo vs revenue churn)", "Seasonality can distort short windows", "Cohort selection matters"],
    ),
    "glossary/payback-period.html": (
        "Payback period is the time to recover an initial investment from cash flows; it does not measure return after payback or discount future cash flows.",
        "payback period versus discounted metrics",
        "What Is Payback Period?",
        "Payback period is the length of time required for cumulative cash inflows to equal the initial investment.",
        ["Quick screening of projects", "Communicating liquidity recovery time", "Pairing with ROI or NPV for fuller views"],
        ["Ignores cash flows after payback", "Ignores time value of money unless discounted payback is used", "Does not rank projects with different scales"],
    ),
    "glossary/annualized-return.html": (
        "Annualized return converts a total return over n years into an equivalent per-year compound rate for comparison across horizons.",
        "annualized return and compound growth",
        "What Is Annualized Return?",
        "Annualized return is the constant yearly rate that would produce the observed total return over the stated holding period, assuming compounding.",
        ["Comparing investments with different holding periods", "Reporting performance in a standard horizon", "Linking to CAGR in simple cases"],
        ["Assumes reinvestment and smooth compounding", "Not identical to IRR when cash flows are irregular", "Past annualized returns do not predict future results"],
    ),
    "glossary/gross-margin.html": (
        "Gross margin is gross profit divided by revenue—an input to profitability and ROI when revenue-based marketing metrics are converted to profit.",
        "gross margin and profitability",
        "What Is Gross Margin?",
        "Gross margin is the percentage of revenue remaining after subtracting cost of goods sold (COGS), before operating expenses.",
        ["Converting revenue-based ROI to profit-based ROI", "Benchmarking product economics", "Stress-testing price and COGS"],
        ["Excludes operating and capital costs", "Definitions of COGS vary by industry", "Not a complete picture of cash generation"],
    ),
    "glossary/net-profit.html": (
        "Net profit is revenue minus all expenses, taxes, and interest—often the numerator basis for ROI when measuring true profitability.",
        "net profit in ROI and financial statements",
        "What Is Net Profit?",
        "Net profit is the bottom-line profit after all expenses, including operating costs, interest, and taxes, have been deducted from revenue.",
        ["Computing ROI on an accounting basis", "Comparing periods under consistent rules", "Linking to investor returns after leverage"],
        ["Accounting profit timing differs from cash flow", "One-time items distort a single period", "Tax rules affect reported net profit"],
    ),
    "glossary/ebitda.html": (
        "EBITDA is earnings before interest, taxes, depreciation, and amortization—a cash-flow proxy used in valuations; it is not ROI but informs profit available before some costs.",
        "EBITDA and how it relates to profitability analysis",
        "What Is EBITDA?",
        "EBITDA represents operating earnings before deducting interest, taxes, depreciation, and amortization, often used as a proxy for operating cash generation.",
        ["Screening companies and deals", "Comparing firms with different capital structures", "Building valuation multiples"],
        ["Ignores capital expenditures and working capital", "Not a substitute for free cash flow", "Can overstate sustainability if D&A are economic costs"],
    ),
}

# Calculator and hub pages
CALC_PAGES: dict[str, tuple] = {
    "roi-calculator/marketing/index.html": (
        "Marketing ROI is [(profit or revenue from marketing − marketing cost) ÷ marketing cost] × 100; define the numerator consistently for comparable investment return figures.",
        "marketing ROI formulas, ROAS contrast, and campaign measurement",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost. Marketing ROI applies that idea to campaign spend and attributable profit or revenue.",
        ["Justifying or reallocating marketing budget", "Comparing channels on a profit basis", "Auditing attribution assumptions"],
        ["Attribution models change reported ROI", "Revenue-based ROI may overstate profit", "Benchmarks vary widely by industry"],
    ),
    "roi-calculator/marketing/roas-calculator.html": (
        "ROAS is revenue from ads divided by ad spend; it measures revenue efficiency, while ROI typically subtracts broader costs to assess profitability.",
        "return on ad spend (ROAS) calculation and interpretation",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost. ROAS is a related ratio focused on revenue per ad dollar.",
        ["Comparing ad sets or campaigns on revenue efficiency", "Sizing spend before margin analysis", "Pairing with margin data for ROI"],
        ["ROAS ignores profit margin unless converted", "Does not include non-ad costs", "Attribution windows affect measured revenue"],
    ),
    "roi-calculator/marketing/email-marketing-roi.html": (
        "Email marketing ROI compares profit or revenue attributed to email programs to their fully loaded cost; list quality and deliverability dominate outcomes.",
        "email marketing ROI modeling",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    "roi-calculator/marketing/lead-generation-roi.html": (
        "Lead generation ROI relates spend to qualified leads and downstream revenue; define MQL/SQL rules so ROI reflects true pipeline value.",
        "lead generation ROI and funnel economics",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    "roi-calculator/real-estate/index.html": (
        "Real estate ROI expresses total return versus equity or total cost—include purchase, closing, renovation, financing, and exit assumptions in the financial return calculation.",
        "real estate ROI: cash-on-cash, leverage, and total return",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    "roi-calculator/real-estate/rental-property-roi.html": (
        "Rental property ROI combines income, expenses, financing, and appreciation—define whether ROI is on total cost or equity for a meaningful investment return figure.",
        "rental property ROI with income and exit assumptions",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    "roi-calculator/real-estate/fix-and-flip-roi.html": (
        "Fix-and-flip ROI is (sale proceeds − total project cost) ÷ total project cost × 100; hold time and carrying costs belong in the denominator or as explicit adjustments.",
        "fix-and-flip ROI for acquisition, rehab, and sale",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    "roi-calculator/real-estate/cash-on-cash-return.html": (
        "Cash-on-cash return is annual pre-tax cash flow divided by cash invested—distinct from total ROI if appreciation and loan paydown are excluded or included separately.",
        "cash-on-cash return versus total ROI",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    "roi-calculator/saas/index.html": (
        "SaaS ROI analysis combines subscription revenue, gross margin, CAC, and churn—headline ROI depends on how acquisition and expansion costs are allocated.",
        "SaaS ROI, CAC, LTV, and growth efficiency",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    "roi-calculator/saas/cac-ltv-roi.html": (
        "CAC/LTV ROI compares lifetime value to acquisition cost; ROI on spend is often framed as (LTV − CAC) ÷ CAC when using profit-based LTV.",
        "CAC, LTV, and ROI for subscription businesses",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    "roi-calculator/saas/subscription-growth-roi.html": (
        "Subscription growth ROI weighs incremental revenue and margin against sales and marketing spend—expansion and churn materially change realized returns.",
        "subscription growth ROI modeling",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    "roi-calculator/saas/time-to-value-roi.html": (
        "Time-to-value ROI links faster onboarding and activation to earlier revenue and lower churn—quantify assumptions when attributing ROI to product improvements.",
        "time-to-value and ROI for SaaS onboarding",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    "roi-calculator/solar/index.html": (
        "Solar ROI compares lifetime savings (or revenue) to upfront cost, net of incentives—utility rates, production, and degradation drive the investment return.",
        "solar and energy ROI: savings, payback, and incentives",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    "roi-calculator/solar/solar-panel-roi.html": (
        "Solar panel ROI is typically (discounted or undiscounted) savings minus installed cost, expressed over the analysis horizon; include incentives and utility rate paths explicitly.",
        "residential or commercial solar panel ROI",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    "roi-calculator/solar/heat-pump-roi.html": (
        "Heat pump ROI compares energy savings against equipment and install cost—fuel prices, climate, and efficiency ratings determine the profitability metric outcome.",
        "heat pump ROI versus incumbent heating costs",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
    "roi-calculator/solar/ev-charger-roi.html": (
        "EV charger ROI may combine utilization revenue, incentives, and avoided fuel costs—station economics vary sharply by location and tariff structure.",
        "EV charger ROI scenarios",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    ),
}

SPECIAL.update(GLOSSARY)
SPECIAL.update(CALC_PAGES)

ARTICLE_REPLACE = (
    '"author":{"@type":"Organization","name":"roicalculator.live"},"publisher":{"@type":"Organization","name":"roicalculator.live"}}',
    '"publisher":{"@type":"Organization","name":"Albor Digital LLC"},"dateModified":"2026-02-21"}',
)


def default_tuple_for(rel: str) -> tuple:
    stem = Path(rel).stem.replace("-", " ").title()
    return (
        f"This page explains {stem} in the context of return on investment and related financial metrics on roicalculator.live.",
        f"{stem} as used in ROI and investment analysis",
        "What Is ROI (Return on Investment)?",
        "Return on Investment (ROI) is a financial metric used to evaluate the profitability of an investment relative to its cost.",
        None,
        None,
    )


def inject_body(html: str, rel: str) -> str:
    if "ai-answer-block" in html:
        return html
    data = SPECIAL.get(rel)
    if data is None:
        data = default_tuple_for(rel)
    quick, cite_topic, eh2, ep, uc, lim = data
    qhtml = build_quick(quick)
    rest = build_rest(cite_topic, eh2, ep, uc, lim)

    html = re.sub(r"(</h1>)", r"\1\n" + qhtml, html, count=1)

    m = re.search(r'(<div class="definition-block">[\s\S]*?</div>)', html)
    if m:
        pos = m.end()
        return html[:pos] + "\n\n" + rest + html[pos:]

    # No definition-block: insert after first </p> following Quick Answer section
    anchor = html.find("ai-answer-block")
    if anchor == -1:
        return html
    sec_end = html.find("</section>", anchor)
    if sec_end == -1:
        return html
    pos = html.find("</p>", sec_end)
    if pos == -1:
        return html
    pos_end = pos + len("</p>")
    return html[:pos_end] + "\n\n" + rest + html[pos_end:]


def add_person(html: str) -> str:
    if "Albor Digital LLC" in html and '"@type": "Organization"' in html:
        return html
    if "</head>" not in html:
        return html
    return html.replace("</head>", PERSON_SNIPPET + "\n</head>", 1)


def update_article(html: str) -> str:
    # Publisher-only Article schema: strip any Organization author (strict byline)
    html = re.sub(
        r',"author":\{"@type":"Organization","name":"[^"]*"\}',
        "",
        html,
    )
    if ARTICLE_REPLACE[0] in html:
        return html.replace(ARTICLE_REPLACE[0], ARTICLE_REPLACE[1])
    return html


def main() -> None:
    for path in sorted(ROOT.rglob("*.html")):
        rel = str(path.relative_to(ROOT)).replace("\\", "/")
        if rel.startswith("partials/"):
            continue
        text = path.read_text(encoding="utf-8")
        new = text
        new = update_article(new)
        new = add_person(new)
        new = inject_body(new, rel)
        if new != text:
            path.write_text(new, encoding="utf-8")
            print("updated", rel)


if __name__ == "__main__":
    main()
