"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ConnectButton } from "@/components/wallet/ConnectButton";

interface GuideSection {
  id: string;
  title: string;
  flag: string;
  category: string;
  articles: GuideArticle[];
}

interface GuideArticle {
  title: string;
  summary: string;
  tags: string[];
  readTime: string;
}

interface ProcessingEntry {
  country: string;
  flag: string;
  visaType: string;
  time: string;
  fee: string;
  difficulty: "Easy" | "Moderate" | "Difficult";
}

const PROCESSING_TIMES: ProcessingEntry[] = [
  { country: "Canada", flag: "🇨🇦", visaType: "Express Entry PR", time: "6 months", fee: "CAD $1,525", difficulty: "Moderate" },
  { country: "United Kingdom", flag: "🇬🇧", visaType: "Skilled Worker", time: "3–8 weeks", fee: "£719–1,420", difficulty: "Moderate" },
  { country: "Australia", flag: "🇦🇺", visaType: "Skilled Independent (189)", time: "6–12 months", fee: "AUD $4,640", difficulty: "Moderate" },
  { country: "Germany", flag: "🇩🇪", visaType: "EU Blue Card", time: "4–8 weeks", fee: "€110", difficulty: "Moderate" },
  { country: "United States", flag: "🇺🇸", visaType: "H-1B (lottery)", time: "3–6 months", fee: "USD $730+", difficulty: "Difficult" },
  { country: "UAE", flag: "🇦🇪", visaType: "Employment Visa", time: "2–4 weeks", fee: "AED 300–1,500", difficulty: "Easy" },
  { country: "Japan", flag: "🇯🇵", visaType: "Engineer/Specialist", time: "1–3 months", fee: "¥3,000", difficulty: "Moderate" },
  { country: "Netherlands", flag: "🇳🇱", visaType: "Highly Skilled Migrant", time: "2–4 weeks", fee: "€300", difficulty: "Easy" },
  { country: "New Zealand", flag: "🇳🇿", visaType: "Skilled Migrant", time: "6–12 months", fee: "NZD $4,230", difficulty: "Moderate" },
  { country: "Singapore", flag: "🇸🇬", visaType: "Employment Pass", time: "3–8 weeks", fee: "SGD $105", difficulty: "Moderate" },
];

const GUIDES: GuideSection[] = [
  {
    id: "us",
    title: "United States",
    flag: "🇺🇸",
    category: "North America",
    articles: [
      {
        title: "H-1B Specialty Occupation Visa",
        summary: "For workers in specialty occupations requiring at least a bachelor's degree. Annual cap of 85,000 visas with lottery system. Registration opens each March.",
        tags: ["Work", "Employer Sponsored", "Lottery"],
        readTime: "5 min",
      },
      {
        title: "Green Card via Employment (EB-1 to EB-5)",
        summary: "Permanent residency through employment preference categories from priority workers (EB-1) to investors (EB-5, $800K–$1.05M).",
        tags: ["Permanent Residence", "Employment", "Long-term"],
        readTime: "8 min",
      },
      {
        title: "Asylum & Refugee Protection",
        summary: "Apply within 1 year of entering the US. Must prove past persecution or well-founded fear based on race, religion, nationality, political opinion, or social group.",
        tags: ["Asylum", "Urgent", "Protection"],
        readTime: "6 min",
      },
      {
        title: "F-1 Student Visa & OPT/STEM OPT",
        summary: "Study at accredited US institutions. OPT allows 12 months of work after graduation. STEM graduates get an extra 24-month extension — 36 months total.",
        tags: ["Student", "Education", "OPT"],
        readTime: "4 min",
      },
      {
        title: "O-1 Extraordinary Ability Visa",
        summary: "For individuals with extraordinary ability in sciences, arts, education, business, or athletics. No cap, no lottery — evidence-based self-petition.",
        tags: ["Work", "Self-Petition", "No Cap"],
        readTime: "5 min",
      },
    ],
  },
  {
    id: "canada",
    title: "Canada",
    flag: "🇨🇦",
    category: "North America",
    articles: [
      {
        title: "Express Entry (FSW, CEC, FST)",
        summary: "Points-based system using the Comprehensive Ranking System (CRS). Draws happen bi-weekly. Average processing: 6 months. No job offer needed for top scorers.",
        tags: ["Work", "Points-based", "Fast Track"],
        readTime: "7 min",
      },
      {
        title: "Provincial Nominee Program (PNP)",
        summary: "Provinces nominate workers with locally needed skills. Extra 600 CRS points guarantee an ITA. Strong option for healthcare, trades, and rural communities.",
        tags: ["Provincial", "Work", "Alternative"],
        readTime: "5 min",
      },
      {
        title: "Family Sponsorship",
        summary: "Canadian citizens and PRs can sponsor spouses, common-law partners, dependent children, parents, and grandparents. Super Visa available for parents.",
        tags: ["Family", "Sponsorship", "Permanent"],
        readTime: "6 min",
      },
      {
        title: "Start-Up Visa Program",
        summary: "For innovative entrepreneurs with a qualifying business idea. Requires support from a designated Canadian VC fund, angel investor, or business incubator.",
        tags: ["Business", "Entrepreneur", "Permanent"],
        readTime: "6 min",
      },
    ],
  },
  {
    id: "uk",
    title: "United Kingdom",
    flag: "🇬🇧",
    category: "Europe",
    articles: [
      {
        title: "Skilled Worker Visa",
        summary: "Need a licensed UK employer sponsor. Salary threshold: £38,700 general / £30,960 new entrant (2024). Job must appear on the eligible occupation list.",
        tags: ["Work", "Employer Sponsored", "Salary Threshold"],
        readTime: "5 min",
      },
      {
        title: "Global Talent Visa",
        summary: "For leaders and emerging leaders in academia, research, arts, culture, or digital technology. No job offer needed — endorsed by Arts Council, UKRI, or Tech Nation.",
        tags: ["Talent", "No Job Offer", "Endorsement"],
        readTime: "4 min",
      },
      {
        title: "Family Visa (Spouse/Partner)",
        summary: "Join a UK citizen or settled person. Sponsor must earn £29,000/year (rising to £38,700). Leads to Indefinite Leave to Remain after 5 years.",
        tags: ["Family", "Spouse", "Income Requirement"],
        readTime: "6 min",
      },
      {
        title: "Student Visa & Graduate Route",
        summary: "Study at a UK licensed sponsor. Work up to 20hrs/week during term. Graduate Visa allows 2 years (3 for PhD) of unrestricted work post-study.",
        tags: ["Student", "Education", "Graduate Route"],
        readTime: "5 min",
      },
      {
        title: "High Potential Individual (HPI) Visa",
        summary: "For graduates from top-ranked global universities. No job offer required. 2-year visa (3 for PhD). Eligible universities list updated annually by UKVI.",
        tags: ["Work", "Graduate", "No Job Offer"],
        readTime: "4 min",
      },
    ],
  },
  {
    id: "eu",
    title: "European Union",
    flag: "🇪🇺",
    category: "Europe",
    articles: [
      {
        title: "EU Blue Card (Skilled Workers)",
        summary: "High-skilled non-EU workers with university degree + salary ≥1.5× average national salary. Valid in most EU countries. Faster path to PR (21 months).",
        tags: ["Work", "High-skilled", "Pan-EU"],
        readTime: "5 min",
      },
      {
        title: "Family Reunification Directive",
        summary: "Non-EU nationals can bring family members after 1 year of legal residence. Requirements and processing vary significantly by member state.",
        tags: ["Family", "EU Resident", "Varies by Country"],
        readTime: "7 min",
      },
      {
        title: "Asylum in Europe (Dublin Regulation)",
        summary: "Apply in the first EU country you enter. Once rejected in one country, it's harder to apply in another. Seek legal help immediately upon arrival.",
        tags: ["Asylum", "Urgent", "Dublin III"],
        readTime: "8 min",
      },
      {
        title: "EU Long-Term Residence Permit",
        summary: "After 5 years of legal continuous EU residence. Grants near-equal rights to citizens: work, education, social security — portable across the EU.",
        tags: ["Permanent Residence", "Long-term", "EU Rights"],
        readTime: "6 min",
      },
    ],
  },
  {
    id: "germany",
    title: "Germany",
    flag: "🇩🇪",
    category: "Europe",
    articles: [
      {
        title: "EU Blue Card Germany",
        summary: "Fastest route to German PR (21 months with B1 German, 33 months otherwise). Requires university degree + job offer meeting salary threshold (~€43,800 / €34,100 for shortage occupations).",
        tags: ["Work", "High-skilled", "Fast Track"],
        readTime: "5 min",
      },
      {
        title: "Job Seeker Visa (Chancenkarte)",
        summary: "Germany allows qualified professionals to enter for 6 months to find work. Must have recognized degree and sufficient funds (~€1,000/month). No job offer required to enter.",
        tags: ["Work", "Job Search", "Unique Route"],
        readTime: "4 min",
      },
      {
        title: "Ausbildung (Vocational Training)",
        summary: "Germany's dual apprenticeship system is open to foreign nationals. Training lasts 2–3 years. Monthly training allowance paid. Strong path to Blue Card or permanent residence.",
        tags: ["Training", "Vocational", "Pathway"],
        readTime: "5 min",
      },
      {
        title: "Skilled Immigration Act 2023 (Fachkräfteeinwanderungsgesetz)",
        summary: "Major 2023 reform expanded immigration beyond degree holders. Recognized vocational qualifications + experience now qualify. Points-based Chancenkarte (opportunity card) also introduced.",
        tags: ["Work", "Reform 2023", "Vocational"],
        readTime: "7 min",
      },
    ],
  },
  {
    id: "australia",
    title: "Australia",
    flag: "🇦🇺",
    category: "Oceania",
    articles: [
      {
        title: "Skilled Independent Visa (Subclass 189)",
        summary: "Points-tested permanent visa — no sponsor, no state nomination. Must have skills assessment and score 65+ points. Popular for nurses, engineers, accountants, and IT professionals.",
        tags: ["Permanent Residence", "Points-based", "No Sponsor"],
        readTime: "6 min",
      },
      {
        title: "Skilled Nominated (Subclass 190)",
        summary: "State/territory nomination gives an extra 5 points. Opens doors when your 189 score isn't sufficient. Each state prioritises different occupation lists.",
        tags: ["Permanent Residence", "State Nominated", "Work"],
        readTime: "5 min",
      },
      {
        title: "Temporary Skill Shortage (TSS 482)",
        summary: "Employer-sponsored work visa for 2–4 years depending on occupation list. Pathway to permanent Subclass 186 after 3 years of employment.",
        tags: ["Work", "Employer Sponsored", "Temporary"],
        readTime: "5 min",
      },
      {
        title: "Working Holiday Visa (Subclass 417/462)",
        summary: "For 18–35 year olds (up to 45 for some countries). Live and work in Australia 1–3 years. 88 days of regional work can extend stay by a year.",
        tags: ["Work", "Holiday", "Youth"],
        readTime: "4 min",
      },
      {
        title: "Partner Visa (Subclass 820/801)",
        summary: "For spouses/de facto partners of Australian citizens or PRs. Stage 1 is temporary (820), Stage 2 is permanent (801) after 2 years. Genuine relationship must be demonstrated.",
        tags: ["Family", "Spouse", "Permanent"],
        readTime: "6 min",
      },
    ],
  },
  {
    id: "uae",
    title: "UAE & Gulf States",
    flag: "🇦🇪",
    category: "Middle East",
    articles: [
      {
        title: "UAE Employment Visa",
        summary: "Employer-sponsored. UAE labour law requires a work permit before entry. Processed in 2–4 weeks. Most nationalities eligible. Medical and Emirates ID required after arrival.",
        tags: ["Work", "Employer Sponsored", "Fast"],
        readTime: "3 min",
      },
      {
        title: "UAE Golden Visa (10-Year Residence)",
        summary: "Long-term residency for investors, entrepreneurs, skilled professionals, scientists, and outstanding graduates. No employer sponsor needed. Grants independent residency.",
        tags: ["Permanent Residence", "High-skill", "Investment"],
        readTime: "5 min",
      },
      {
        title: "UAE Freelance / Self-Employment Visa",
        summary: "Free zone freelancer permits allow independent work without a local sponsor. Dubai, Abu Dhabi, Sharjah all have free zones. Costs AED 7,500–20,000/year.",
        tags: ["Work", "Freelance", "Self-Employed"],
        readTime: "4 min",
      },
      {
        title: "Saudi Arabia & GCC — Premium Residency",
        summary: "Saudi Arabia launched Premium Residency (Green Card) in 2019. One-time fee SAR 800,000 or annual SAR 100,000. Allows business ownership, no sponsor needed.",
        tags: ["Work", "GCC", "Premium"],
        readTime: "5 min",
      },
    ],
  },
  {
    id: "japan",
    title: "Japan & South Korea",
    flag: "🇯🇵",
    category: "Asia-Pacific",
    articles: [
      {
        title: "Japan Engineer / Specialist in Humanities",
        summary: "Most common work visa for foreign professionals. Requires degree or 10+ years experience. Employer must be an approved sponsor. Initial 1–5 year term, renewable.",
        tags: ["Work", "Employer Sponsored", "Renewable"],
        readTime: "4 min",
      },
      {
        title: "Japan Specified Skilled Worker (SSW-1 & SSW-2)",
        summary: "Two tiers for 12 specific industries introduced in 2019. SSW-1 is capped at 5 years, no family. SSW-2 has no cap, leads to permanent residency, and allows family sponsorship.",
        tags: ["Work", "Skilled", "Pathway to PR"],
        readTime: "5 min",
      },
      {
        title: "Japan Highly Skilled Professional (HSP) Points Visa",
        summary: "Points-based for highly qualified professionals. 70+ points: preferential treatment. 80+ points: fast-track PR in just 1 year. Covers research, business management, and technical fields.",
        tags: ["Work", "Points-based", "Fast Track PR"],
        readTime: "5 min",
      },
      {
        title: "South Korea E-7 Skilled Worker & F-5 Permanent Residence",
        summary: "E-7 covers 80+ occupation categories with employer sponsorship, renewable for 3 years. After sustained employment: F-2 (resident) → F-5 (permanent) path open.",
        tags: ["Work", "Korea", "Points-based"],
        readTime: "5 min",
      },
    ],
  },
  {
    id: "latam",
    title: "Latin America",
    flag: "🌎",
    category: "Latin America",
    articles: [
      {
        title: "Brazil — MERCOSUR Residence Agreement",
        summary: "Citizens of Argentina, Bolivia, Chile, Colombia, Ecuador, Paraguay, Peru, Uruguay can get 2-year temporary residence in Brazil, then convert to permanent. Simple and affordable.",
        tags: ["Regional", "Pathway", "MERCOSUR"],
        readTime: "4 min",
      },
      {
        title: "Mexico — Temporary & Permanent Resident Visas",
        summary: "Mexico offers temporary residency (1–4 years) and permanent residency based on economic solvency, family ties, or skills. Popular with remote workers — low cost of living.",
        tags: ["Temporary", "Permanent", "Mexico"],
        readTime: "4 min",
      },
      {
        title: "Emigrating from Latin America — Key Pathways",
        summary: "Top destinations for Latin Americans: Spain (ibero-american fast track to citizenship), US (TPS, family), Canada (Express Entry), Portugal (D7 Passive Income Visa). Language is a natural advantage for Spain and Portugal.",
        tags: ["Emigration", "Diaspora", "Guide"],
        readTime: "6 min",
      },
      {
        title: "Digital Nomad Visas — Colombia, Argentina, Costa Rica",
        summary: "Colombia (Migrant M visa), Argentina (Rentista), and Costa Rica all offer paths for remote workers. Requires proof of foreign income. Processing: 1–4 weeks.",
        tags: ["Digital Nomad", "Remote Work", "Short-term"],
        readTime: "4 min",
      },
    ],
  },
  {
    id: "india_seasia",
    title: "India & Southeast Asia",
    flag: "🇮🇳",
    category: "Asia-Pacific",
    articles: [
      {
        title: "India — OCI Card (Overseas Citizens of India)",
        summary: "Lifelong multi-purpose visa for Indian-origin persons and spouses of Indian citizens. Unlimited entry, no registration required. Near-equal rights but not full citizenship.",
        tags: ["Dual Status", "Diaspora", "India"],
        readTime: "4 min",
      },
      {
        title: "Singapore — Employment Pass & S Pass",
        summary: "EP for professionals earning SGD $5,000+/month. S Pass for mid-level at $3,150+/month. Employers must show fair consideration to locals. 1–2 year initial, renewable.",
        tags: ["Work", "Singapore", "High-skill"],
        readTime: "4 min",
      },
      {
        title: "Thailand — Long-Term Resident (LTR) Visa",
        summary: "10-year LTR visa for wealthy global citizens, remote workers, highly-skilled professionals, and retirees. Income requirements vary by category: $40K–$80K/year.",
        tags: ["Long-term", "Remote Work", "Thailand"],
        readTime: "4 min",
      },
      {
        title: "Philippines — 13A Permanent Resident Visa",
        summary: "For foreign nationals married to Filipino citizens. Initially conditional (1 year), then permanent. Includes right to work without additional permits.",
        tags: ["Family", "Philippines", "Permanent"],
        readTime: "3 min",
      },
    ],
  },
  {
    id: "nigeria",
    title: "Nigerian Immigration",
    flag: "🇳🇬",
    category: "Africa",
    articles: [
      {
        title: "Nigerian Passport Renewal",
        summary: "Renew at NIS offices or Nigerian embassies abroad. Standard: 6–8 weeks. Express: 3–5 days (premium). Book online at immigration.gov.ng. Both 32-page and 64-page available.",
        tags: ["Passport", "Document", "Nigeria"],
        readTime: "3 min",
      },
      {
        title: "Nigerian Diaspora — Dual Citizenship",
        summary: "Nigerians can hold dual citizenship. Apply through NIS for renunciation reversal. Nigerian-Americans and British-Nigerians commonly hold both. Process takes 3–6 months.",
        tags: ["Dual Citizenship", "Diaspora", "Rights"],
        readTime: "4 min",
      },
      {
        title: "ECOWAS Free Movement Rights",
        summary: "Nigerian passport holders can move freely within all 15 ECOWAS states for up to 90 days without a visa — covering Ghana, Senegal, Côte d'Ivoire, and more.",
        tags: ["ECOWAS", "West Africa", "Visa-Free"],
        readTime: "3 min",
      },
      {
        title: "CERPAC — Long-Term Residence in Nigeria",
        summary: "Foreigners residing long-term in Nigeria need a Combined Expatriate Residence Permit and Aliens Card. Apply within 90 days of arrival. Valid 1–2 years, renewable.",
        tags: ["Nigeria Entry", "Permit", "Expat"],
        readTime: "4 min",
      },
    ],
  },
];

const CATEGORY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  "Work": { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700" },
  "Family": { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700" },
  "Asylum": { bg: "bg-red-50", border: "border-red-200", text: "text-red-700" },
  "Urgent": { bg: "bg-red-50", border: "border-red-200", text: "text-red-700" },
  "Student": { bg: "bg-green-50", border: "border-green-200", text: "text-green-700" },
  "Permanent Residence": { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700" },
  "Points-based": { bg: "bg-indigo-50", border: "border-indigo-200", text: "text-indigo-700" },
  "Digital Nomad": { bg: "bg-teal-50", border: "border-teal-200", text: "text-teal-700" },
  "default": { bg: "bg-[#F8FAFC]", border: "border-[#E2E8F0]", text: "text-[#64748B]" },
};

const DIFFICULTY_COLORS = {
  Easy: "bg-green-100 text-green-700 border-green-200",
  Moderate: "bg-amber-100 text-amber-700 border-amber-200",
  Difficult: "bg-red-100 text-red-700 border-red-200",
};

function getTagStyle(tag: string) {
  return CATEGORY_COLORS[tag] ?? CATEGORY_COLORS["default"];
}

export default function ResourcesPage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [expandedGuide, setExpandedGuide] = useState<string | null>("us");
  const [showTimes, setShowTimes] = useState(false);

  const filters = ["all", "Work", "Family", "Asylum", "Student", "Permanent Residence"];

  const filteredGuides = GUIDES.map((guide) => ({
    ...guide,
    articles: activeFilter === "all"
      ? guide.articles
      : guide.articles.filter((a) => a.tags.some((t) => t === activeFilter)),
  })).filter((g) => g.articles.length > 0);

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <motion.header
        className="bg-white border-b border-[#E2E8F0] px-6 py-4 flex items-center justify-between flex-shrink-0"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-[#0F172A] font-black text-xl">Immigration Guides</h1>
          <p className="text-[#64748B] text-sm mt-0.5">
            {GUIDES.length} countries · {GUIDES.reduce((a, g) => a + g.articles.length, 0)} guides · Official sources
          </p>
        </div>
        <ConnectButton />
      </motion.header>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-5 max-w-4xl mx-auto w-full">

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#FFFBEB] border border-amber-200 rounded-2xl px-4 py-3 flex gap-3"
        >
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-amber-800 text-sm leading-relaxed">
            <strong>For information only.</strong> Immigration laws change frequently. Always verify with official government sources or a licensed attorney. Use the AI Advisor for personalised guidance.
          </p>
        </motion.div>

        {/* Processing Times Panel */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.04 }}
          className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden"
        >
          <button
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[#F8FAFC] transition-colors text-left"
            onClick={() => setShowTimes(!showTimes)}
          >
            <div className="w-9 h-9 rounded-xl bg-[#0F172A] flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-[#0F172A] font-bold text-base">Processing Times &amp; Fees</h2>
              <p className="text-[#64748B] text-xs">{PROCESSING_TIMES.length} countries · Approximate estimates · Updated 2025</p>
            </div>
            <motion.svg
              className="w-5 h-5 text-[#94A3B8] flex-shrink-0"
              animate={{ rotate: showTimes ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>
          <AnimatePresence>
            {showTimes && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden border-t border-[#F1F5F9]"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                        <th className="text-left px-5 py-3 text-[#64748B] text-xs font-semibold uppercase tracking-wide">Country</th>
                        <th className="text-left px-3 py-3 text-[#64748B] text-xs font-semibold uppercase tracking-wide hidden sm:table-cell">Visa Type</th>
                        <th className="text-left px-3 py-3 text-[#64748B] text-xs font-semibold uppercase tracking-wide">Time</th>
                        <th className="text-left px-3 py-3 text-[#64748B] text-xs font-semibold uppercase tracking-wide hidden md:table-cell">Fee</th>
                        <th className="text-left px-3 py-3 text-[#64748B] text-xs font-semibold uppercase tracking-wide">Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PROCESSING_TIMES.map((entry, i) => (
                        <motion.tr
                          key={entry.country}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className="border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#FEF2F2]/20 transition-colors"
                        >
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{entry.flag}</span>
                              <span className="text-[#0F172A] font-semibold text-sm">{entry.country}</span>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-[#64748B] text-xs hidden sm:table-cell">{entry.visaType}</td>
                          <td className="px-3 py-3 text-[#0F172A] font-semibold text-xs">{entry.time}</td>
                          <td className="px-3 py-3 text-[#64748B] text-xs hidden md:table-cell">{entry.fee}</td>
                          <td className="px-3 py-3">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${DIFFICULTY_COLORS[entry.difficulty]}`}>
                              {entry.difficulty}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[#94A3B8] text-[10px] px-5 py-3 border-t border-[#F1F5F9]">
                  * Processing times are approximate and vary by applicant profile, consulate workload, and season. Government fees only — attorney and service fees are additional.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.07 }}
          className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1"
        >
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeFilter === f
                  ? "bg-[#DC2626] text-white shadow-sm"
                  : "bg-white border border-[#E2E8F0] text-[#64748B] hover:border-[#DC2626] hover:text-[#DC2626]"
              }`}
            >
              {f === "all" ? "All Guides" : f}
            </button>
          ))}
        </motion.div>

        {/* Country count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-[#64748B] text-xs"
        >
          Showing <strong className="text-[#0F172A]">{filteredGuides.length}</strong> countries
          {activeFilter !== "all" && <> with <strong className="text-[#DC2626]">{activeFilter}</strong> visas</>}
        </motion.p>

        {/* Guides */}
        <div className="space-y-3">
          {filteredGuides.map((guide, gi) => (
            <motion.div
              key={guide.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + gi * 0.04 }}
              className="bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden"
            >
              {/* Section header */}
              <button
                className="w-full flex items-center gap-3 px-5 py-4 hover:bg-[#F8FAFC] transition-colors text-left"
                onClick={() => setExpandedGuide(expandedGuide === guide.id ? null : guide.id)}
              >
                <span className="text-2xl">{guide.flag}</span>
                <div className="flex-1">
                  <h2 className="text-[#0F172A] font-bold text-base">{guide.title}</h2>
                  <p className="text-[#64748B] text-xs">{guide.articles.length} guide{guide.articles.length !== 1 ? "s" : ""} · {guide.category}</p>
                </div>
                <motion.svg
                  className="w-5 h-5 text-[#94A3B8] flex-shrink-0"
                  animate={{ rotate: expandedGuide === guide.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </motion.svg>
              </button>

              {/* Articles */}
              <AnimatePresence>
                {expandedGuide === guide.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden border-t border-[#F1F5F9]"
                  >
                    {guide.articles.map((article, ai) => (
                      <motion.div
                        key={article.title}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: ai * 0.04 }}
                        className="px-5 py-4 border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#FEF2F2]/30 transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-[#0F172A] font-semibold text-sm group-hover:text-[#DC2626] transition-colors">
                            {article.title}
                          </h3>
                          <span className="text-[10px] text-[#94A3B8] flex-shrink-0 mt-0.5">{article.readTime} read</span>
                        </div>
                        <p className="text-[#64748B] text-sm leading-relaxed mb-2.5">{article.summary}</p>
                        <div className="flex flex-wrap gap-1.5 items-center">
                          {article.tags.map((tag) => {
                            const style = getTagStyle(tag);
                            return (
                              <span key={tag} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${style.bg} ${style.border} ${style.text}`}>
                                {tag}
                              </span>
                            );
                          })}
                          <Link
                            href="/chat"
                            className="ml-auto text-[10px] text-[#DC2626] font-semibold hover:underline flex items-center gap-1"
                          >
                            Ask AI about this
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Legal Aid Resources */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-[#E2E8F0] rounded-2xl p-5"
        >
          <h2 className="text-[#0F172A] font-bold text-base mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-[#DC2626]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
            </svg>
            Free Legal Aid Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { region: "🇺🇸 United States", orgs: "UNHCR · ILRC · CLINIC · Vera Institute" },
              { region: "🇬🇧 United Kingdom", orgs: "Migrant Help · Law Centres Network · JCWI" },
              { region: "🇨🇦 Canada", orgs: "Legal Aid Ontario · IRCC Tools · CARL" },
              { region: "🇩🇪 Germany", orgs: "Pro Asyl · AWO · Caritas Migrationsdienst" },
              { region: "🇦🇺 Australia", orgs: "RACS · ASRC · Legal Aid NSW" },
              { region: "🌍 Global", orgs: "UNHCR · IOM · Asylum Access · IRC" },
            ].map((item) => (
              <div key={item.region} className="flex items-start gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div className="flex-1">
                  <p className="text-[#0F172A] font-semibold text-sm">{item.region}</p>
                  <p className="text-[#64748B] text-xs mt-0.5">{item.orgs}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[#94A3B8] text-xs mt-3 leading-relaxed">
            These organizations provide free or low-cost immigration legal services. Verify current availability directly with each organization.
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-[#0F172A] rounded-2xl p-6 text-center pb-6"
        >
          <p className="text-white font-black text-lg mb-1">Need personalized guidance?</p>
          <p className="text-[#94A3B8] text-sm mb-4 leading-relaxed">
            Our AI advisor covers all countries listed here. Describe your situation and get step-by-step guidance in your language.
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#DC2626] text-white font-semibold rounded-xl hover:bg-[#B91C1C] transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Start Free Consultation
          </Link>
          <p className="text-[#475569] text-xs mt-3">Multilingual · No sign-up required · Not legal advice</p>
        </motion.div>

      </div>
    </div>
  );
}
