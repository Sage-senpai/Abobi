// Auto-extracted from src/app/(app)/resources/page.tsx — kept module-level for server import

export interface GuideArticle {
  title: string;
  summary: string;
  tags: string[];
  readTime: string;
  content: string;
  sources: { label: string; url: string }[];
  lastUpdated: string;
}

export interface GuideSection {
  id: string;
  title: string;
  flag: string;
  category: string;
  articles: GuideArticle[];
}

export interface ProcessingEntry {
  country: string;
  flag: string;
  visaType: string;
  time: string;
  fee: string;
  difficulty: "Easy" | "Moderate" | "Difficult";
}

export const PROCESSING_TIMES: ProcessingEntry[] = [
  { country: "Canada", flag: "\u{1F1E8}\u{1F1E6}", visaType: "Express Entry PR", time: "6 months", fee: "CAD $1,525", difficulty: "Moderate" },
  { country: "United Kingdom", flag: "\u{1F1EC}\u{1F1E7}", visaType: "Skilled Worker", time: "3\u20138 weeks", fee: "\u00A3719\u20131,420", difficulty: "Moderate" },
  { country: "Australia", flag: "\u{1F1E6}\u{1F1FA}", visaType: "Skilled Independent (189)", time: "6\u201312 months", fee: "AUD $4,640", difficulty: "Moderate" },
  { country: "Germany", flag: "\u{1F1E9}\u{1F1EA}", visaType: "EU Blue Card", time: "4\u20138 weeks", fee: "\u20AC110", difficulty: "Moderate" },
  { country: "United States", flag: "\u{1F1FA}\u{1F1F8}", visaType: "H-1B (lottery)", time: "3\u20136 months", fee: "USD $730+", difficulty: "Difficult" },
  { country: "UAE", flag: "\u{1F1E6}\u{1F1EA}", visaType: "Employment Visa", time: "2\u20134 weeks", fee: "AED 300\u20131,500", difficulty: "Easy" },
  { country: "Japan", flag: "\u{1F1EF}\u{1F1F5}", visaType: "Engineer/Specialist", time: "1\u20133 months", fee: "\u00A53,000", difficulty: "Moderate" },
  { country: "Netherlands", flag: "\u{1F1F3}\u{1F1F1}", visaType: "Highly Skilled Migrant", time: "2\u20134 weeks", fee: "\u20AC300", difficulty: "Easy" },
  { country: "New Zealand", flag: "\u{1F1F3}\u{1F1FF}", visaType: "Skilled Migrant", time: "6\u201312 months", fee: "NZD $4,230", difficulty: "Moderate" },
  { country: "Singapore", flag: "\u{1F1F8}\u{1F1EC}", visaType: "Employment Pass", time: "3\u20138 weeks", fee: "SGD $105", difficulty: "Moderate" },
  { country: "Brazil", flag: "\u{1F1E7}\u{1F1F7}", visaType: "Work Visa (VITEM V)", time: "2\u20134 months", fee: "USD $290", difficulty: "Moderate" },
  { country: "Mexico", flag: "\u{1F1F2}\u{1F1FD}", visaType: "Temporary Resident", time: "4\u20136 weeks", fee: "MXN $4,920", difficulty: "Easy" },
  { country: "South Korea", flag: "\u{1F1F0}\u{1F1F7}", visaType: "E-7 Work Visa", time: "2\u20134 weeks", fee: "USD $90", difficulty: "Moderate" },
  { country: "Saudi Arabia", flag: "\u{1F1F8}\u{1F1E6}", visaType: "Premium Residency", time: "2\u20133 months", fee: "SAR 800,000 (one-time)", difficulty: "Moderate" },
  { country: "India", flag: "\u{1F1EE}\u{1F1F3}", visaType: "Employment Visa", time: "3\u20138 weeks", fee: "USD $200", difficulty: "Moderate" },
];

export const GUIDES: GuideSection[] = [
  {
    id: "us",
    title: "United States",
    flag: "\u{1F1FA}\u{1F1F8}",
    category: "North America",
    articles: [
      {
        title: "H-1B Specialty Occupation Visa",
        summary: "For workers in specialty occupations requiring at least a bachelor's degree. Annual cap of 85,000 visas with lottery system. Registration opens each March.",
        tags: ["Work", "Employer Sponsored", "Lottery"],
        readTime: "5 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

You must hold at least a U.S. bachelor's degree or foreign equivalent in a field directly related to the specialty occupation. Your employer must file a Labor Condition Application (LCA) with the Department of Labor and a petition with USCIS on your behalf.

REQUIREMENTS

- Valid passport and a qualifying degree or 12 years of progressive work experience as equivalent
- A job offer from a U.S. employer in a specialty occupation
- Employer must pay at least the prevailing wage for the position and geographic area
- Filing fee: $780 base fee + $500 Fraud Prevention and Detection Fee + $150 ACWIA fee (for employers with 25+ employees)
- Premium processing available for an additional $2,805 (15 calendar day adjudication)

PROCESS AND TIMELINE

1. Employer registers in the USCIS H-1B electronic registration system (opens early March each year).
2. USCIS conducts a random lottery if registrations exceed the 85,000 cap (65,000 regular + 20,000 advanced degree exemption).
3. Selected registrants have 90 days to file the full H-1B petition.
4. Standard processing takes 3-6 months. Premium processing guarantees a response within 15 calendar days.
5. If approved, the visa becomes active on October 1 of that fiscal year.

TIPS

- File early and ensure all documents are complete to avoid Requests for Evidence (RFEs).
- Cap-exempt employers (universities, nonprofit research organizations, government research organizations) are not subject to the lottery.
- H-1B holders can change employers through a transfer petition without re-entering the lottery.
- Spouses on H-4 visas may apply for work authorization if the H-1B holder has an approved I-140 immigrant petition.`,
        sources: [
          { label: "USCIS H-1B Overview", url: "https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations" },
          { label: "DOL Prevailing Wage", url: "https://www.dol.gov/agencies/eta/foreign-labor/wages" },
          { label: "USCIS Fee Schedule", url: "https://www.uscis.gov/fees" },
        ],
      },
      {
        title: "Green Card via Employment (EB-1 to EB-5)",
        summary: "Permanent residency through employment preference categories from priority workers (EB-1) to investors (EB-5, $800K\u2013$1.05M).",
        tags: ["Permanent Residence", "Employment", "Long-term"],
        readTime: "8 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY BY CATEGORY

EB-1: Priority Workers -- extraordinary ability individuals, outstanding professors/researchers, and multinational managers/executives. No labor certification (PERM) needed.
EB-2: Professionals with advanced degrees or exceptional ability. Includes the National Interest Waiver (NIW) which does not require a job offer or employer sponsorship.
EB-3: Skilled workers (2+ years experience), professionals (bachelor's degree), and other workers. Requires PERM labor certification.
EB-4: Special immigrants including religious workers, certain broadcasters, and Iraqi/Afghan translators.
EB-5: Immigrant investors who invest $1,050,000 (or $800,000 in a Targeted Employment Area) and create 10 full-time jobs.

REQUIREMENTS

- PERM Labor Certification (for EB-2 and EB-3): Employer must prove no qualified U.S. workers are available. Processing time: 6-18 months.
- Form I-140, Immigrant Petition for Alien Workers
- Filing fee: $700 for I-140; $1,440 for I-485 (Adjustment of Status)
- Medical examination by a USCIS-designated physician
- Evidence of qualifications specific to the category

PROCESS AND TIMELINE

1. PERM Labor Certification (if required): 6-18 months.
2. I-140 petition: 6-8 months standard, 15 days with premium processing ($2,805).
3. Wait for priority date to become current (check the Visa Bulletin monthly). For India and China EB-2/EB-3, wait times can exceed 10 years.
4. File I-485 Adjustment of Status or process through consular processing abroad.
5. Total timeline ranges from 1-2 years (EB-1 for most countries) to 10+ years (EB-2/EB-3 for India).

TIPS

- EB-1A and EB-2 NIW allow self-petitioning without employer sponsorship.
- The EB-5 Regional Center program pools investments and simplifies the job creation requirement.
- Filing I-485 concurrently with I-140 (when priority date is current) allows you to obtain work authorization (EAD) and travel permission (Advance Parole) while waiting.`,
        sources: [
          { label: "USCIS Employment-Based Immigration", url: "https://www.uscis.gov/working-in-the-united-states/permanent-workers" },
          { label: "Visa Bulletin", url: "https://travel.state.gov/content/travel/en/legal/visa-law0/visa-bulletin.html" },
          { label: "USCIS EB-5 Investors", url: "https://www.uscis.gov/working-in-the-united-states/permanent-workers/eb-5-immigrant-investor-program" },
        ],
      },
      {
        title: "Asylum & Refugee Protection",
        summary: "Apply within 1 year of entering the US. Must prove past persecution or well-founded fear based on race, religion, nationality, political opinion, or social group.",
        tags: ["Asylum", "Urgent", "Protection"],
        readTime: "6 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

You must be physically present in the United States and demonstrate that you have suffered persecution or have a well-founded fear of persecution on account of race, religion, nationality, membership in a particular social group, or political opinion. The one-year filing deadline applies from the date of your last arrival, though exceptions exist for changed or extraordinary circumstances.

REQUIREMENTS

- Form I-589, Application for Asylum and for Withholding of Removal (no filing fee)
- Supporting evidence: personal declaration, country condition reports, medical or psychological evaluations, witness statements, identity documents
- If you missed the one-year deadline, you must demonstrate changed circumstances or extraordinary circumstances that caused the delay

PROCESS AND TIMELINE

1. File Form I-589 with USCIS (affirmative asylum) or raise the claim before an Immigration Judge (defensive asylum, if in removal proceedings).
2. Biometrics appointment scheduled by USCIS.
3. Asylum interview at a USCIS Asylum Office (affirmative cases). Current average wait for an interview varies widely by office, from several months to several years.
4. Decision: granted, referred to Immigration Court, or denied.
5. If granted, you may apply for a Green Card after 1 year of asylee status.
6. Work authorization (EAD): You may apply 150 days after filing, and USCIS must adjudicate within 30 days after that (180-day clock rule).

TIPS

- Seek legal representation immediately. Pro bono attorneys are available through organizations like the American Immigration Lawyers Association (AILA), CLINIC, and local legal aid societies.
- Keep detailed records of any persecution, threats, or harm. Photographs, police reports, medical records, and news articles strengthen your case.
- Withholding of Removal and Convention Against Torture (CAT) protection are alternative forms of relief if asylum is unavailable.
- Spouses and unmarried children under 21 can be included in your asylum application.`,
        sources: [
          { label: "USCIS Asylum", url: "https://www.uscis.gov/humanitarian/refugees-and-asylum/asylum" },
          { label: "UNHCR USA", url: "https://www.unhcr.org/us/" },
          { label: "CLINIC Legal Resources", url: "https://cliniclegal.org/" },
        ],
      },
      {
        title: "F-1 Student Visa & OPT/STEM OPT",
        summary: "Study at accredited US institutions. OPT allows 12 months of work after graduation. STEM graduates get an extra 24-month extension \u2014 36 months total.",
        tags: ["Student", "Education", "OPT"],
        readTime: "4 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

You must have been accepted to a SEVP-certified school, demonstrate sufficient financial resources to cover tuition and living expenses, maintain a residence abroad that you do not intend to abandon (for initial visa issuance), and demonstrate English proficiency or enrollment in English language courses.

REQUIREMENTS

- Form I-20 issued by your SEVP-certified school
- SEVIS fee payment: $350 (Form I-901)
- Visa application fee (MRV fee): $185
- Proof of financial support for the entire duration of study
- Proof of ties to your home country

PROCESS AND TIMELINE

1. Receive acceptance and Form I-20 from the school.
2. Pay the SEVIS fee and schedule a visa interview at a U.S. embassy or consulate.
3. Attend the visa interview with all required documentation.
4. Enter the U.S. up to 30 days before the program start date.
5. Optional Practical Training (OPT): Apply 90 days before graduation through 60 days after. Receive 12 months of work authorization.
6. STEM OPT Extension: STEM degree holders may apply for an additional 24 months (36 months total). Employer must be enrolled in E-Verify.

TIPS

- Maintain full-time enrollment (minimum 12 credits for undergrads, as defined by school for graduate students) to keep valid F-1 status.
- On-campus employment is permitted up to 20 hours per week during the academic year.
- Curricular Practical Training (CPT) allows internship or cooperative education before graduation.
- If you plan to pursue OPT, apply early as processing can take 3-5 months.`,
        sources: [
          { label: "Study in the States", url: "https://studyinthestates.dhs.gov/" },
          { label: "USCIS OPT", url: "https://www.uscis.gov/working-in-the-united-states/students-and-exchange-visitors/optional-practical-training-opt-for-f-1-students" },
          { label: "SEVP School Search", url: "https://studyinthestates.dhs.gov/school-search" },
        ],
      },
      {
        title: "O-1 Extraordinary Ability Visa",
        summary: "For individuals with extraordinary ability in sciences, arts, education, business, or athletics. No cap, no lottery \u2014 evidence-based self-petition.",
        tags: ["Work", "Self-Petition", "No Cap"],
        readTime: "5 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

O-1A is for individuals with extraordinary ability in the sciences, education, business, or athletics. O-1B is for individuals with extraordinary ability or achievement in the arts, motion pictures, or television. You must demonstrate sustained national or international acclaim through extensive documentation.

REQUIREMENTS

You must meet at least 3 of the following 8 criteria (O-1A):
- Receipt of nationally or internationally recognized awards or prizes
- Membership in associations requiring outstanding achievements
- Published material about you in major media
- Judging the work of others in your field
- Original scientific, scholarly, or business contributions of major significance
- Authorship of scholarly articles in professional journals or major media
- Employment in a critical or essential capacity at distinguished organizations
- High salary or remuneration relative to others in your field

Filing fee: $780 (Form I-129). Premium processing: $2,805 for 15-day adjudication.

PROCESS AND TIMELINE

1. Gather evidence for at least 3 of the 8 criteria.
2. Obtain an advisory opinion from a peer group or relevant organization (recommended but not always required).
3. File Form I-129 with USCIS along with all supporting evidence.
4. Standard processing: 2-4 months. Premium processing: 15 calendar days.
5. If approved, valid for the duration of the event or activity, up to 3 years, with 1-year extensions available.

TIPS

- There is no annual cap or lottery for O-1 visas.
- An agent can file on your behalf if you work for multiple employers.
- O-1 can be a strong alternative to H-1B, especially for those not selected in the lottery.
- Evidence of extraordinary ability should include quantifiable achievements such as citation counts, revenue figures, audience numbers, or ranking metrics.`,
        sources: [
          { label: "USCIS O-1 Visa", url: "https://www.uscis.gov/working-in-the-united-states/temporary-workers/o-1-visa-individuals-with-extraordinary-ability-or-achievement" },
          { label: "USCIS Policy Manual", url: "https://www.uscis.gov/policy-manual" },
        ],
      },
    ],
  },
  {
    id: "canada",
    title: "Canada",
    flag: "\u{1F1E8}\u{1F1E6}",
    category: "North America",
    articles: [
      {
        title: "Express Entry (FSW, CEC, FST)",
        summary: "Points-based system using the Comprehensive Ranking System (CRS). Draws happen bi-weekly. Average processing: 6 months. No job offer needed for top scorers.",
        tags: ["Work", "Points-based", "Fast Track"],
        readTime: "7 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

Express Entry manages three programs: Federal Skilled Worker (FSW) requires 1+ year of continuous full-time skilled work experience (NOC TEER 0, 1, 2, or 3), language proficiency (CLB 7+), and post-secondary education. Canadian Experience Class (CEC) requires 1+ year of skilled work experience in Canada within the last 3 years. Federal Skilled Trades (FST) requires 2+ years of experience in a skilled trade plus a valid job offer or Canadian certificate of qualification.

REQUIREMENTS

- Language test results: IELTS General or CELPIP (English), TEF Canada or TCF Canada (French)
- Educational Credential Assessment (ECA) for foreign degrees, from WES, IQAS, or other designated organizations
- Proof of settlement funds: CAD $14,690 for a single applicant (2025 figure, adjusted annually) unless you have a valid job offer or are a CEC applicant
- Police certificates from every country where you lived 6+ months since age 18
- Medical exam by a panel physician

PROCESS AND TIMELINE

1. Create an Express Entry profile and receive a CRS score (maximum 1,200 points).
2. IRCC conducts regular draws (typically bi-weekly). Minimum CRS scores fluctuate; recent general draws have ranged from 480-530 points.
3. If your score meets or exceeds the draw cutoff, you receive an Invitation to Apply (ITA).
4. Submit a complete application within 60 days of the ITA.
5. Processing target: 6 months from submission to permanent residence decision.

TIPS

- Provincial Nominee Programs (PNP) add 600 CRS points, virtually guaranteeing an ITA.
- French language proficiency provides significant bonus points (up to 50 additional CRS points).
- Category-based draws now target specific occupations in healthcare, STEM, trades, transport, and agriculture.
- A valid job offer from a Canadian employer with an LMIA adds 50-200 CRS points depending on the NOC level.`,
        sources: [
          { label: "IRCC Express Entry", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry.html" },
          { label: "CRS Score Tool", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/eligibility/criteria-comprehensive-ranking-system/grid.html" },
          { label: "Express Entry Rounds", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/submit-profile/rounds-invitations.html" },
        ],
      },
      {
        title: "Provincial Nominee Program (PNP)",
        summary: "Provinces nominate workers with locally needed skills. Extra 600 CRS points guarantee an ITA. Strong option for healthcare, trades, and rural communities.",
        tags: ["Provincial", "Work", "Alternative"],
        readTime: "5 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

Each province and territory operates its own PNP streams with distinct eligibility criteria. Common streams include Employer-Driven (requiring a job offer from a provincial employer), Express Entry-Aligned (for candidates already in the Express Entry pool), Human Capital (based on skills, education, and work experience), and Entrepreneur/Business streams.

REQUIREMENTS

- Requirements vary by province and stream, but commonly include:
- A job offer from a provincial employer (for employer-driven streams)
- Work experience relevant to the provincial labor market
- Language test results (CLB levels vary; typically CLB 4-7 depending on the stream)
- Minimum education requirements (often a high school diploma or higher)
- Proof of settlement funds and intent to reside in the nominating province

PROCESS AND TIMELINE

1. Research provincial streams and determine eligibility. Each province has its own application portal.
2. Apply directly to the province (paper-based or enhanced/aligned with Express Entry).
3. If nominated, you receive a Provincial Nomination Certificate.
4. For Express Entry-aligned streams: 600 CRS bonus points are added, followed by an ITA in the next draw.
5. For base/paper-based streams: apply directly to IRCC for permanent residence. Processing time: 15-19 months.

TIPS

- Smaller provinces (e.g., Saskatchewan, Manitoba, Atlantic provinces) often have lower requirements and faster processing.
- The Atlantic Immigration Program (AIP) is employer-driven and covers New Brunswick, Newfoundland, Nova Scotia, and Prince Edward Island.
- Rural and Northern Immigration Pilot (RNIP) targets smaller communities with specific labor needs.
- Some provinces hold periodic draws for specific occupations; monitor provincial immigration websites regularly.`,
        sources: [
          { label: "IRCC Provincial Nominees", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/provincial-nominees.html" },
          { label: "Ontario PNP", url: "https://www.ontario.ca/page/ontario-immigrant-nominee-program-oinp" },
          { label: "BC PNP", url: "https://www.welcomebc.ca/Immigrate-to-B-C/British-Columbia-Provincial-Nominee-Program" },
        ],
      },
      {
        title: "Family Sponsorship",
        summary: "Canadian citizens and PRs can sponsor spouses, common-law partners, dependent children, parents, and grandparents. Super Visa available for parents.",
        tags: ["Family", "Sponsorship", "Permanent"],
        readTime: "6 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

Canadian citizens and permanent residents aged 18+ can sponsor their spouse, common-law partner, conjugal partner, dependent children (under 22 and unmarried), parents, and grandparents. Sponsors must meet minimum income requirements (for parent/grandparent sponsorship) and sign an undertaking to financially support the sponsored person.

REQUIREMENTS

- For spousal sponsorship: proof of genuine relationship (marriage certificate, cohabitation evidence, photos, communications, joint finances)
- For parent/grandparent sponsorship: meet the Minimum Necessary Income (MNI) for 3 consecutive tax years. For 2025, MNI for a family of 3 (sponsor + spouse + 1 parent) is approximately CAD $51,000
- Sponsor must not be in default on previous sponsorship undertakings, on social assistance (except for disability), or subject to a removal order
- Medical exam and police certificates required for sponsored persons

PROCESS AND TIMELINE

1. Sponsor files a sponsorship application alongside the permanent residence application of the sponsored person.
2. Spousal sponsorship processing: approximately 12 months.
3. Parent/grandparent sponsorship: intake is limited annually; IRCC opens an interest-to-sponsor form each October. Processing: 20-24 months after submission.
4. The Super Visa (for parents/grandparents) allows stays of up to 5 years per entry while waiting for PR processing. Requires private medical insurance.

TIPS

- Inland spousal sponsorship allows the spouse to remain in Canada during processing and includes an open work permit.
- Outland spousal sponsorship is processed at a visa office abroad and may be faster for some nationalities.
- Common-law partners must demonstrate 12 consecutive months of cohabitation.
- Dependent children are processed automatically with the principal applicant at no additional government fee.`,
        sources: [
          { label: "IRCC Family Sponsorship", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/family-sponsorship.html" },
          { label: "Super Visa", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/parent-grandparent-super-visa.html" },
        ],
      },
      {
        title: "Start-Up Visa Program",
        summary: "For innovative entrepreneurs with a qualifying business idea. Requires support from a designated Canadian VC fund, angel investor, or business incubator.",
        tags: ["Business", "Entrepreneur", "Permanent"],
        readTime: "6 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

You must have a qualifying business that is innovative, can create jobs for Canadians, and can compete on a global scale. You need a letter of support from a designated organization: a venture capital fund (minimum $200,000 investment), an angel investor group (minimum $75,000 investment), or a business incubator (acceptance into the program). Language proficiency of CLB 5 in either English or French is required.

REQUIREMENTS

- Letter of support from a designated organization
- Language test results: minimum CLB 5 in English (IELTS/CELPIP) or French (TEF/TCF)
- Proof of settlement funds: at least CAD $14,690 for a single applicant
- Up to 5 co-founders can apply under one qualifying business, but each must independently hold at least 10% of voting rights
- All applicants combined plus the designated organization must hold more than 50% of voting rights

PROCESS AND TIMELINE

1. Develop your business plan and pitch to designated organizations (listed on the IRCC website).
2. Secure a letter of support and a commitment certificate from the designated organization.
3. Submit your permanent residence application to IRCC.
4. Processing time: currently 12-16 months, though IRCC has been working to reduce backlogs.
5. You may also apply for a temporary work permit under the Start-Up Visa stream to begin operations in Canada while your PR application is processed.

TIPS

- The business idea does not need to be technology-based, but most successful applicants are in tech, clean energy, biotech, or fintech.
- Networking with designated organizations through pitch events, accelerators, and startup conferences increases your chances of securing a letter of support.
- Spouses or common-law partners receive open work permits during processing.
- The program leads directly to permanent residence, unlike most other entrepreneur immigration programs globally.`,
        sources: [
          { label: "IRCC Start-Up Visa", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa.html" },
          { label: "Designated Organizations List", url: "https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/start-visa/designated-organizations.html" },
        ],
      },
    ],
  },
  {
    id: "uk",
    title: "United Kingdom",
    flag: "\u{1F1EC}\u{1F1E7}",
    category: "Europe",
    articles: [
      {
        title: "Skilled Worker Visa",
        summary: "Need a licensed UK employer sponsor. Salary threshold: \u00A338,700 general / \u00A330,960 new entrant (2024). Job must appear on the eligible occupation list.",
        tags: ["Work", "Employer Sponsored", "Salary Threshold"],
        readTime: "5 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

You must have a job offer from a UK employer who holds a valid Sponsor Licence, the job must be on the list of eligible occupations, and you must be paid at least the applicable salary threshold. The general salary threshold is GBP 38,700 per year. A lower threshold of GBP 30,960 applies to new entrants (under 26, recent graduates, or those in professional training).

REQUIREMENTS

- Certificate of Sponsorship (CoS) from your employer with a valid reference number
- English language proficiency: CEFR Level B1 (equivalent to IELTS 4.0 in each component) -- can be met through a passport from a majority English-speaking country, a degree taught in English, or a SELT test
- Sufficient maintenance funds: GBP 1,270 in your bank account for at least 28 consecutive days (unless your employer certifies maintenance)
- Visa fee: GBP 719 (up to 3 years) or GBP 1,420 (over 3 years)
- Immigration Health Surcharge: GBP 1,035 per year

PROCESS AND TIMELINE

1. Your employer assigns you a Certificate of Sponsorship.
2. Apply online and book a biometrics appointment at a Visa Application Centre.
3. Standard processing: 3 weeks from outside the UK; 8 weeks from inside the UK.
4. Priority processing (additional GBP 500): decision within 5 working days.
5. Initial visa granted for up to 5 years. Can switch to Indefinite Leave to Remain (ILR) after 5 years of continuous residence.

TIPS

- Some occupations qualify for a reduced salary threshold (Immigration Salary List).
- PhD-level jobs may qualify for a lower threshold of GBP 34,830.
- You can change employers by getting a new CoS and applying to update your visa.
- Time on certain other visas (e.g., Tier 2 General, Student switching to Skilled Worker) may count toward the 5-year ILR requirement.`,
        sources: [
          { label: "UK Gov Skilled Worker Visa", url: "https://www.gov.uk/skilled-worker-visa" },
          { label: "Eligible Occupations", url: "https://www.gov.uk/government/publications/skilled-worker-visa-eligible-occupations" },
          { label: "Immigration Health Surcharge", url: "https://www.gov.uk/healthcare-immigration-application" },
        ],
      },
      {
        title: "Global Talent Visa",
        summary: "For leaders and emerging leaders in academia, research, arts, culture, or digital technology. No job offer needed \u2014 endorsed by Arts Council, UKRI, or Tech Nation.",
        tags: ["Talent", "No Job Offer", "Endorsement"],
        readTime: "4 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

You must be recognized as a leader (Exceptional Talent) or an emerging leader (Exceptional Promise) in one of the following fields: academia or research (endorsed by UKRI), arts and culture (endorsed by Arts Council England), or digital technology (endorsed by Tech Nation, now transitioned to DSIT). There is no minimum salary requirement or job offer requirement.

REQUIREMENTS

- Endorsement from the relevant designated body
- Evidence of your achievements: publications, patents, awards, media coverage, revenue metrics, letters of recommendation from established figures in your field
- Application fee: GBP 716 for the endorsement stage + GBP 192 for the visa
- Immigration Health Surcharge: GBP 1,035 per year
- No English language requirement

PROCESS AND TIMELINE

1. Apply for endorsement from the relevant body. Each has specific criteria and evidence requirements.
2. Endorsement decision: typically within 5-8 weeks.
3. Once endorsed, apply for the visa within 3 months.
4. Visa processing: 3-8 weeks standard.
5. Visa granted for up to 5 years initially. Can apply for ILR after 3 years (Exceptional Talent) or 5 years (Exceptional Promise).

TIPS

- Tech Nation endorsement now managed through DSIT following the transition in 2024.
- Academic applicants may be fast-tracked if they have received a prestigious fellowship or prize.
- Global Talent holders have full flexibility: they can work as employees, freelancers, or start their own business in the UK.
- This visa is one of the fastest routes to settlement (ILR) in the UK at just 3 years for Exceptional Talent holders.`,
        sources: [
          { label: "UK Gov Global Talent", url: "https://www.gov.uk/global-talent" },
          { label: "UKRI Endorsement", url: "https://www.ukri.org/apply-for-funding/global-talent-visa/" },
          { label: "Tech Nation (DSIT)", url: "https://technation.io/visa/" },
        ],
      },
      {
        title: "Family Visa (Spouse/Partner)",
        summary: "Join a UK citizen or settled person. Sponsor must earn \u00A329,000/year (rising to \u00A338,700). Leads to Indefinite Leave to Remain after 5 years.",
        tags: ["Family", "Spouse", "Income Requirement"],
        readTime: "6 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

You can apply if you are the spouse, civil partner, unmarried partner (2+ years cohabitation), or fiance(e) of a British citizen or a person with settled status (ILR or EU settled status) in the UK. The relationship must be genuine and subsisting.

REQUIREMENTS

- Minimum income requirement: GBP 29,000 per year (from the sponsor's employment, self-employment, pension, or savings). This is scheduled to increase to GBP 38,700 in phases.
- Savings can substitute for income: savings above GBP 16,000, divided by 2.5, count toward the threshold
- English language requirement: CEFR A1 for entry; CEFR A2 for extension; CEFR B1 for ILR
- Visa fee: GBP 1,846 per application (initial + each extension)
- Immigration Health Surcharge: GBP 1,035 per year
- Adequate accommodation: must not be overcrowded or in violation of public health regulations

PROCESS AND TIMELINE

1. Apply online and submit biometrics at a VAC or UKVCAS centre.
2. Standard processing: 24 weeks (from outside the UK) or 8 weeks (from inside the UK).
3. Priority service: 5-8 working days (additional GBP 500-1,000).
4. Initial visa granted for 33 months (from outside UK) or 30 months (from inside UK).
5. Apply for further leave to remain (FLR) after the initial period.
6. Apply for ILR after 5 years of continuous residence on the family route.
7. Apply for British citizenship 12 months after receiving ILR.

TIPS

- Fiance(e) visas are granted for 6 months and do not allow work; you must marry within that period and switch to a spouse visa.
- Cash savings of GBP 88,500+ can meet the entire minimum income requirement without employment income.
- If you have children who are British citizens, the income requirement may be reduced.
- Gather extensive evidence of your relationship: joint bank accounts, shared tenancy, photographs, correspondence, and witness statements.`,
        sources: [
          { label: "UK Gov Family Visa", url: "https://www.gov.uk/uk-family-visa" },
          { label: "Financial Requirement Guidance", url: "https://www.gov.uk/government/publications/chapter-8-appendix-fm-family-members" },
        ],
      },
      {
        title: "Student Visa & Graduate Route",
        summary: "Study at a UK licensed sponsor. Work up to 20hrs/week during term. Graduate Visa allows 2 years (3 for PhD) of unrestricted work post-study.",
        tags: ["Student", "Education", "Graduate Route"],
        readTime: "5 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

You must have an unconditional offer of a place on a course from a licensed Student sponsor, with a valid Confirmation of Acceptance for Studies (CAS). You must demonstrate English language ability at the required level (usually CEFR B2 for degree-level courses). You must have sufficient funds to cover course fees and living costs.

REQUIREMENTS

- CAS reference number from your licensed sponsor
- Financial evidence: course fees for the first year + GBP 1,334/month for up to 9 months (London) or GBP 1,023/month (outside London)
- Visa fee: GBP 490 (from outside the UK)
- Immigration Health Surcharge: GBP 776 per year (student rate)
- ATAS certificate for certain sensitive research subjects (postgraduate)

PROCESS AND TIMELINE

1. Receive your CAS from the university.
2. Apply online up to 6 months before the course start date.
3. Attend a biometrics appointment.
4. Decision: typically within 3 weeks (outside the UK).
5. Work rights: up to 20 hours per week during term, full-time during vacations.
6. Graduate Route: apply within the UK before your Student visa expires. Granted for 2 years (bachelor's/master's) or 3 years (PhD). No sponsor needed. Full work rights.

TIPS

- The Graduate Route visa is unsponsored and allows you to work in any job at any skill level for 2-3 years.
- You can switch from a Graduate visa to a Skilled Worker visa without leaving the UK.
- Short-term study visas (6-11 months) are available for English language courses but do not lead to the Graduate Route.
- Some scholarships (Chevening, Commonwealth) include visa fee and health surcharge coverage.`,
        sources: [
          { label: "UK Gov Student Visa", url: "https://www.gov.uk/student-visa" },
          { label: "Graduate Route", url: "https://www.gov.uk/graduate-visa" },
          { label: "Licensed Sponsors Register", url: "https://www.gov.uk/government/publications/register-of-licensed-sponsors-students" },
        ],
      },
      {
        title: "High Potential Individual (HPI) Visa",
        summary: "For graduates from top-ranked global universities. No job offer required. 2-year visa (3 for PhD). Eligible universities list updated annually by UKVI.",
        tags: ["Work", "Graduate", "No Job Offer"],
        readTime: "4 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

You must have been awarded a qualification from a university that appears on the Global Universities List, published annually by the UK government. The qualification must have been awarded within the 5 years preceding your application. The university must appear on the list for the year in which you graduated. PhD holders qualify if awarded within 5 years.

REQUIREMENTS

- Degree certificate or official transcript confirming completion from an eligible university
- Confirmation from Ecctis (formerly UK NARIC) that the qualification meets the required level
- English language proficiency at CEFR B1 level
- Visa fee: GBP 822
- Immigration Health Surcharge: GBP 1,035 per year
- Maintenance funds: GBP 1,270 available for 28 consecutive days

PROCESS AND TIMELINE

1. Check the Global Universities List to confirm your university qualifies for the year of your graduation.
2. Obtain an Ecctis confirmation of your degree level.
3. Apply online from outside the UK (this visa cannot be applied for from within the UK).
4. Processing: 3-4 weeks standard.
5. Visa granted for 2 years (bachelor's or master's) or 3 years (PhD).
6. You can switch to a Skilled Worker visa or other routes from within the UK before the HPI expires.

TIPS

- You can only apply for this visa once.
- The Global Universities List is based on rankings from QS, Times Higher Education, and Shanghai Academic Ranking. Typically, only universities that appear in the top tiers across at least 2 of the 3 rankings are included.
- There is no restriction on the type of work you can do during the visa period.
- This visa does not lead directly to ILR, but time spent on it counts if you switch to a route that does (e.g., Skilled Worker).`,
        sources: [
          { label: "UK Gov HPI Visa", url: "https://www.gov.uk/high-potential-individual-visa" },
          { label: "Global Universities List", url: "https://www.gov.uk/government/publications/high-potential-individual-visa-global-universities-list" },
        ],
      },
    ],
  },
  {
    id: "eu",
    title: "European Union",
    flag: "\u{1F1EA}\u{1F1FA}",
    category: "Europe",
    articles: [
      {
        title: "EU Blue Card (Skilled Workers)",
        summary: "High-skilled non-EU workers with university degree + salary \u22651.5\u00D7 average national salary. Valid in most EU countries. Faster path to PR (21 months).",
        tags: ["Work", "High-skilled", "Pan-EU"],
        readTime: "5 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

You must be a non-EU/EEA national with a recognized higher education qualification (at least 3 years of study) or, under the 2024 revised directive, 5 years of relevant professional experience. You must have a binding job offer or work contract with a salary meeting the threshold set by the member state -- typically 1.0 to 1.5 times the average national gross salary. Shortage occupation categories may qualify for a lower threshold (typically 1.0 times).

REQUIREMENTS

- Recognized university degree (minimum 3 years of study) or equivalent professional experience
- Work contract or binding job offer for at least 6 months (revised directive reduced this from 12 months)
- Salary above the national threshold. Examples: Germany EUR 45,300 (general) / EUR 41,042 (shortage); Netherlands EUR 42,326; France EUR 38,961
- Health insurance coverage valid in the member state
- Application fee varies by country: typically EUR 100-300

PROCESS AND TIMELINE

1. Obtain a job offer meeting the salary threshold.
2. Apply at the embassy/consulate or, in some countries, directly at the immigration office if already legally present.
3. Processing: 30-90 days depending on the member state.
4. Blue Card initially valid for the duration of the work contract + 3 months, up to a maximum of 4 years.
5. Under the 2024 revised directive, EU Long-Term Resident status can be obtained after 3 years (or as little as 21 months if you spent time in multiple EU member states).

TIPS

- The 2024 revised EU Blue Card Directive introduced significant improvements: lower salary thresholds, recognition of professional experience, easier intra-EU mobility, and inclusion of beneficiaries of international protection.
- Blue Card holders can move to another EU member state after 12 months (down from 18 under the old directive).
- Family members receive automatic work authorization in the host member state.
- Denmark and Ireland are not part of the EU Blue Card scheme and have their own work visa programs.`,
        sources: [
          { label: "EU Immigration Portal - Blue Card", url: "https://immigration-portal.ec.europa.eu/blue-card/essential-information_en" },
          { label: "EUR-Lex Blue Card Directive", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32021L1883" },
        ],
      },
      {
        title: "Family Reunification Directive",
        summary: "Non-EU nationals can bring family members after 1 year of legal residence. Requirements and processing vary significantly by member state.",
        tags: ["Family", "EU Resident", "Varies by Country"],
        readTime: "7 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

Non-EU nationals who hold a residence permit valid for at least one year in an EU member state and who have a reasonable prospect of obtaining permanent residence can apply to bring their family members. The directive covers spouses, minor children (under 18), and in some member states, dependent parents and adult children.

REQUIREMENTS

- The sponsor must have held a valid residence permit for at least 1 year (some member states require 2 years)
- Stable and regular resources sufficient to maintain the family without recourse to social assistance
- Adequate housing meeting health and safety standards
- Health insurance for all family members
- Integration requirements: some member states (Netherlands, Germany, France, Austria) require family members to pass a basic language or civic integration test before or after arrival
- Application fees vary by country: typically EUR 50-400 per family member

PROCESS AND TIMELINE

1. Sponsor applies at the local immigration authority.
2. Family members apply for entry clearance at the relevant embassy or consulate.
3. Processing time varies significantly: 2-3 months (Netherlands), 6-12 months (Germany), up to 18 months (Italy).
4. Family members receive a residence permit valid for at least 1 year, renewable.
5. After 5 years of legal residence, family members can apply for autonomous residence permits independent of the sponsor.

TIPS

- EU citizens exercising free movement rights have a separate, more favorable regime under the Citizens' Rights Directive (2004/38/EC).
- Some member states allow de facto partners or registered partners, not just married spouses.
- Children over 12 arriving independently from the sponsor may face additional integration conditions in some states.
- Refugees and beneficiaries of subsidiary protection often have easier requirements (no income or housing conditions) if the application is filed within 3 months of protection status being granted.`,
        sources: [
          { label: "EU Family Reunification Directive", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32003L0086" },
          { label: "EU Immigration Portal - Family", url: "https://immigration-portal.ec.europa.eu/family-reunification_en" },
        ],
      },
      {
        title: "Asylum in Europe (Dublin Regulation)",
        summary: "Apply in the first EU country you enter. Once rejected in one country, it's harder to apply in another. Seek legal help immediately upon arrival.",
        tags: ["Asylum", "Urgent", "Dublin III"],
        readTime: "8 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

Any person who is outside their country of nationality and unable or unwilling to return due to a well-founded fear of persecution on grounds of race, religion, nationality, political opinion, or membership of a particular social group may apply for international protection in any EU member state. The Dublin III Regulation determines which member state is responsible for examining the application.

REQUIREMENTS

- No specific documentation is required to apply for asylum -- you have the right to apply regardless of how you entered the EU
- Identification documents (if available): passport, ID card, birth certificate
- Any evidence supporting your claim: medical reports, police reports, country condition evidence, witness statements
- You will be fingerprinted and registered in the Eurodac database upon arrival

PROCESS AND TIMELINE

1. Express your intention to seek asylum to border authorities, police, or at a reception centre.
2. Registration and fingerprinting (Eurodac).
3. Dublin determination: the responsible member state is identified (typically the first country of entry, but family unity and other criteria may apply). This takes up to 3 months.
4. If transferred to another member state, the transfer must occur within 6 months.
5. Substantive asylum interview and decision: timelines vary greatly -- from 6 months (Germany, Netherlands) to 2+ years (Italy, Greece).
6. If granted refugee status: 3-5 year renewable residence permit. If granted subsidiary protection: 1-3 year renewable permit.

TIPS

- Seek free legal assistance immediately upon arrival. UNHCR, the Red Cross, and local NGOs provide legal counseling at reception centres.
- Family unity is a key criterion under Dublin III: if you have family members with protection status in a specific member state, you may be transferred there.
- Unaccompanied minors are generally processed in the country where they are present, regardless of Dublin rules.
- The EU Pact on Migration and Asylum (adopted 2024) introduces border screening procedures and solidarity mechanisms that may change processing timelines.`,
        sources: [
          { label: "UNHCR - Asylum in Europe", url: "https://www.unhcr.org/europe.html" },
          { label: "European Asylum Support Office (EUAA)", url: "https://euaa.europa.eu/" },
          { label: "Dublin III Regulation Text", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32013R0604" },
        ],
      },
      {
        title: "EU Long-Term Residence Permit",
        summary: "After 5 years of legal continuous EU residence. Grants near-equal rights to citizens: work, education, social security \u2014 portable across the EU.",
        tags: ["Permanent Residence", "Long-term", "EU Rights"],
        readTime: "6 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

Non-EU nationals who have resided legally and continuously in an EU member state for at least 5 years. Absences of less than 6 consecutive months (and not exceeding 10 months total over the 5-year period) are permitted. You must have stable and regular resources, sickness insurance, and meet any integration conditions required by the member state.

REQUIREMENTS

- 5 years of continuous legal residence in one EU member state
- Stable and regular income sufficient to support yourself and dependents without social assistance (thresholds vary by country)
- Comprehensive sickness insurance
- Integration conditions: some member states require language proficiency (e.g., A2 or B1) and/or civic integration exams
- Application fee: typically EUR 100-250
- Clean criminal record (no threat to public policy or security)

PROCESS AND TIMELINE

1. Compile evidence of 5 years of continuous residence, income, and insurance.
2. Submit application to the local immigration authority.
3. Processing: the member state must decide within 6 months.
4. If granted, the EU Long-Term Resident permit is valid for at least 5 years and is automatically renewable.
5. After obtaining the permit, you may move to another EU member state for work, study, or self-employment under simplified conditions.

TIPS

- Time spent on a student visa may count partially (typically 50%) toward the 5-year requirement in some member states.
- EU Long-Term Residents enjoy near-equal treatment with nationals regarding employment, education, social security, and tax benefits.
- You can lose the status if you are absent from the EU for 12 consecutive months or from the member state that issued the permit for 6 years.
- The status is distinct from national permanent residence permits but offers the additional benefit of intra-EU mobility.`,
        sources: [
          { label: "EU Long-Term Residents Directive", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32003L0109" },
          { label: "EU Immigration Portal", url: "https://immigration-portal.ec.europa.eu/long-term-residents_en" },
        ],
      },
    ],
  },
  {
    id: "germany",
    title: "Germany",
    flag: "\u{1F1E9}\u{1F1EA}",
    category: "Europe",
    articles: [
      {
        title: "EU Blue Card Germany",
        summary: "Fastest route to German PR (21 months with B1 German, 33 months otherwise). Requires university degree + job offer meeting salary threshold (~\u20AC43,800 / \u20AC34,100 for shortage occupations).",
        tags: ["Work", "High-skilled", "Fast Track"],
        readTime: "5 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

You must hold a recognized university degree (check the Anabin database for recognition) and have a concrete job offer or employment contract in Germany. The salary must meet the threshold: EUR 45,300 per year (general) or EUR 41,042 per year for shortage occupations (STEM, medicine, IT). Under the revised directive, 5 years of relevant professional experience can substitute for a degree in certain cases.

REQUIREMENTS

- Recognized university degree (verify at anabin.kmk.org)
- Employment contract or binding job offer with a salary above the threshold
- Application fee: EUR 100 (from abroad at the embassy) or EUR 110 (within Germany at the Foreigners' Office)
- Health insurance (statutory or private meeting German standards)
- No criminal record or threat to public safety

PROCESS AND TIMELINE

1. Apply for a national visa (type D) at the German embassy in your country of residence if applying from abroad.
2. Processing: 4-8 weeks at the embassy.
3. After arrival, register your address (Anmeldung) within 2 weeks.
4. Apply for the Blue Card at the local Foreigners' Office (Auslanderbehoerde).
5. Blue Card issued for the duration of the contract + 3 months, up to a maximum of 4 years.
6. Permanent settlement permit: after 21 months with B1 German language proficiency, or 27 months with A1 German language proficiency.

TIPS

- Germany has the lowest salary threshold for the EU Blue Card among major EU economies, making it one of the most accessible routes.
- The Blue Card allows unrestricted labor market access after 2 years (or 1 year with employer change approval from the Foreigners' Office).
- Spouses of Blue Card holders receive automatic work authorization regardless of their nationality.
- The German government provides free integration courses (Integrationskurse) that include 600 hours of German language instruction.`,
        sources: [
          { label: "BAMF Blue Card", url: "https://www.bamf.de/EN/Themen/MigrationAufenthalt/ZuwijkCommons/Aufenthaltstitel/BlueCard/bluecard-node.html" },
          { label: "Make it in Germany", url: "https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card" },
          { label: "Anabin Database", url: "https://anabin.kmk.org/anabin.html" },
        ],
      },
      {
        title: "Job Seeker Visa (Chancenkarte)",
        summary: "Germany allows qualified professionals to enter for up to 1 year to find work. Must have recognized degree or qualifications and sufficient funds. No job offer required to enter.",
        tags: ["Work", "Job Search", "Unique Route"],
        readTime: "4 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

The Chancenkarte (Opportunity Card), introduced under the Skilled Immigration Act reform, uses a points system. You need at least 6 points based on: qualifications (recognized degree or vocational qualification), language skills (German and English), professional experience, age (under 35 preferred), and connection to Germany (prior residence or studies). Alternatively, holders of a fully recognized German qualification can obtain the card without the points system.

REQUIREMENTS

- Points-based assessment: 6 points minimum from categories including qualification recognition, language proficiency, work experience, age, and Germany connection
- Proof of financial self-sufficiency: approximately EUR 1,027 per month (or a blocked account with equivalent funds for the intended stay)
- Health insurance for the duration of stay
- Basic German (A1-A2) or English (B2) language proficiency
- Application fee: EUR 75
- No job offer required

PROCESS AND TIMELINE

1. Verify if your qualification is recognized in Germany through the Anabin database or apply for recognition.
2. Take a language test if needed (Goethe-Zertifikat for German, IELTS/TOEFL for English).
3. Apply at the German embassy with evidence of qualifications, funds, and insurance.
4. Processing: 4-8 weeks.
5. The Chancenkarte is granted for up to 1 year. You may work part-time (up to 20 hours per week) or do trial employment during this period.
6. Once you find qualifying employment, switch to a work visa (Blue Card, Skilled Worker, etc.) from within Germany.

TIPS

- The Chancenkarte replaced the previous 6-month Job Seeker Visa with a longer and more flexible framework.
- Part-time work of up to 20 hours per week is permitted to support yourself during the job search.
- Two trial employment periods of up to 2 weeks each are allowed with different employers.
- German language ability significantly increases both your points and your chances of employment.`,
        sources: [
          { label: "Make it in Germany - Chancenkarte", url: "https://www.make-it-in-germany.com/en/visa-residence/types/job-search-opportunity-card" },
          { label: "BAMF Skilled Immigration", url: "https://www.bamf.de/EN/Themen/MigrationAufenthalt/ZuwandererDrittstaaten/Arbeit/arbeit-node.html" },
        ],
      },
      {
        title: "Ausbildung (Vocational Training)",
        summary: "Germany's dual apprenticeship system is open to foreign nationals. Training lasts 2\u20133 years. Monthly training allowance paid. Strong path to Blue Card or permanent residence.",
        tags: ["Training", "Vocational", "Pathway"],
        readTime: "5 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

Applicants must be at least 16 years old and have completed secondary education (equivalent to a German Hauptschulabschluss or Realschulabschluss). German language proficiency of at least B1 is strongly recommended (B2 for healthcare and technical trades). You need a training contract (Ausbildungsvertrag) with a German company registered with the relevant Chamber of Commerce or Trade (IHK or HWK).

REQUIREMENTS

- A training contract with a German employer
- German language proficiency: B1 minimum (B2 recommended for competitive placements)
- Proof of financial means for initial months (approximately EUR 934/month, though the training allowance typically covers this)
- Health insurance
- Visa fee: EUR 75
- Recognized secondary school certificate

PROCESS AND TIMELINE

1. Find a training position: check the IHK apprenticeship exchange (Lehrstellenborse), the Federal Employment Agency (Arbeitsagentur), or company websites directly.
2. Sign a training contract (Ausbildungsvertrag) with the employer.
3. Apply for a training visa at the German embassy (processing: 4-8 weeks).
4. Training duration: 2-3.5 years depending on the occupation. Combines workplace training (3-4 days/week) with vocational school (1-2 days/week).
5. Monthly training allowance: EUR 800-1,400 depending on the industry, year of training, and region.
6. After completing the Ausbildung, you receive a recognized German vocational qualification and can apply for a work visa or Blue Card.

TIPS

- Germany has over 320 recognized Ausbildung occupations, from mechatronics and IT to healthcare and hospitality.
- The Ausbildung is fully paid -- you earn a monthly allowance and the training itself is free.
- After completing the Ausbildung, you are eligible for a 12-month job search visa if you do not immediately secure employment.
- A completed Ausbildung qualification can serve as the basis for a permanent settlement permit after 2 years of subsequent employment.`,
        sources: [
          { label: "Make it in Germany - Vocational Training", url: "https://www.make-it-in-germany.com/en/study-training/training/vocational/what-is-vocational-training" },
          { label: "IHK Apprenticeship Exchange", url: "https://www.ihk-lehrstellenboerse.de/" },
        ],
      },
      {
        title: "Skilled Immigration Act 2023 (Fachkrafteeinwanderungsgesetz)",
        summary: "Major 2023 reform expanded immigration beyond degree holders. Recognized vocational qualifications + experience now qualify. Points-based Chancenkarte (opportunity card) also introduced.",
        tags: ["Work", "Reform 2023", "Vocational"],
        readTime: "7 min",
        lastUpdated: "March 2026",
        content: `OVERVIEW

The Skilled Immigration Act, significantly reformed in 2023 with provisions rolling out through 2024, represents Germany's most comprehensive immigration reform in decades. It creates three pillars for skilled worker immigration: qualification-based (recognized degree or vocational qualification), experience-based (minimum 2 years of experience + state-recognized qualification from the home country), and potential-based (the Chancenkarte/Opportunity Card points system).

KEY CHANGES

- Experience Pillar: Workers with at least 2 years of professional experience and a state-recognized vocational qualification from their home country can now work in Germany, even without formal German recognition of their qualification. Salary threshold: EUR 40,770/year or the applicable collective bargaining agreement rate.
- Qualification recognition can now happen in parallel with employment (up to 12 months of recognition partnership).
- The salary threshold for the EU Blue Card was lowered to EUR 45,300 (general) and EUR 41,042 (shortage occupations).
- IT specialists with 3+ years of experience and a salary of at least EUR 41,042 can obtain a work visa without any formal degree.
- Short-term mobility: up to 8 months per 18-month period for workers sent by foreign employers for training, project work, or service delivery.

PROCESS AND TIMELINE

1. Determine which pillar applies to your situation (qualification, experience, or potential).
2. Begin qualification recognition if needed (through the relevant Chamber or recognition body).
3. Apply at the German embassy or consulate. Processing: 4-8 weeks for most visa types.
4. The accelerated skilled worker procedure (beschleunigtes Fachkrafteverfahren) can reduce processing to 1-2 weeks, initiated by the employer for EUR 411.

TIPS

- The accelerated procedure is particularly useful for employers who need workers quickly; the employer initiates the process with the Foreigners' Office.
- Western Balkan countries (Albania, Bosnia-Herzegovina, Kosovo, Montenegro, North Macedonia, Serbia) have a special contingent arrangement for all occupations.
- Recognition of foreign qualifications can be checked at anabin.kmk.org (for academic degrees) or anerkennung-in-deutschland.de (for vocational qualifications).
- Family reunification is easier for skilled workers: spouses do not need to prove German language proficiency before entering Germany.`,
        sources: [
          { label: "Make it in Germany - New Immigration Law", url: "https://www.make-it-in-germany.com/en/visa-residence/skilled-immigration-act" },
          { label: "BMAS Skilled Immigration Act", url: "https://www.bmas.de/EN/Labour/International/skilled-worker-immigration-act.html" },
          { label: "Recognition in Germany", url: "https://www.anerkennung-in-deutschland.de/en/" },
        ],
      },
    ],
  },
  {
    id: "australia",
    title: "Australia",
    flag: "\u{1F1E6}\u{1F1FA}",
    category: "Oceania",
    articles: [
      {
        title: "Skilled Independent Visa (Subclass 189)",
        summary: "Points-tested permanent visa \u2014 no sponsor, no state nomination. Must have skills assessment and score 65+ points. Popular for nurses, engineers, accountants, and IT professionals.",
        tags: ["Permanent Residence", "Points-based", "No Sponsor"],
        readTime: "6 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

You must be under 45 years of age, have an occupation on the relevant Skilled Occupation List (SOL), obtain a positive skills assessment from the designated assessing authority, and score at least 65 points on the points test. Points are awarded for age (25-32 is optimal at 30 points), English proficiency (up to 20 points for superior English), work experience (up to 20 points), education (up to 20 points), and other factors.

REQUIREMENTS

- Positive skills assessment from the relevant authority (e.g., Engineers Australia, ACS for IT, ANMAC for nursing)
- English language test: minimum Competent English (IELTS 6.0 in each band). Higher scores earn more points.
- Points score of 65+ (competitive scores are typically 80-95+)
- Health examination and character (police) clearances
- Application fee: AUD $4,640 (primary applicant); additional fees for dependents (AUD $2,320 per adult, AUD $1,160 per child)
- Skills assessment fees vary by occupation: AUD $300-1,500

PROCESS AND TIMELINE

1. Complete your skills assessment with the relevant authority.
2. Submit an Expression of Interest (EOI) through SkillSelect.
3. If your points score is high enough, you receive an Invitation to Apply (ITA) in a monthly round.
4. Lodge the visa application within 60 days of the ITA.
5. Processing time: 6-12 months from lodgement (varies by occupation and completeness of application).
6. If granted, the visa is permanent from the day of decision.

TIPS

- Current competitive scores are well above the 65-point minimum; many occupations require 85-95+ points to receive an invitation.
- Points can be boosted by: superior English (IELTS 8+), a professional year in Australia, NAATI credentialed community language, partner skills, and Australian study.
- The 189 visa grants immediate permanent residence with full work, study, and Medicare rights.
- Consider the Subclass 190 (state-nominated, +5 points) or Subclass 491 (regional, +15 points) if your 189 points score is not competitive.`,
        sources: [
          { label: "DHA Subclass 189", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-independent-189" },
          { label: "SkillSelect", url: "https://immi.homeaffairs.gov.au/visas/working-in-australia/skillselect" },
          { label: "Points Calculator", url: "https://immi.homeaffairs.gov.au/help-support/departmental-forms/online-forms/points-calculator" },
        ],
      },
      {
        title: "Skilled Nominated (Subclass 190)",
        summary: "State/territory nomination gives an extra 5 points. Opens doors when your 189 score isn't sufficient. Each state prioritises different occupation lists.",
        tags: ["Permanent Residence", "State Nominated", "Work"],
        readTime: "5 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

Same base requirements as the Subclass 189 (positive skills assessment, 65+ points, age under 45, English proficiency), but you must also receive a nomination from an Australian state or territory government. The nominating state adds 5 points to your score. Each state maintains its own list of priority occupations and may have additional requirements such as minimum work experience, English scores, or a commitment to living in that state.

REQUIREMENTS

- Positive skills assessment for an occupation on the state's nominated occupation list
- Points score of 65+ (including the 5 nomination points)
- Nomination from a state/territory government
- Commitment to live and work in the nominating state for at least 2 years after visa grant
- Application fee: AUD $4,640 (primary applicant)
- Some states charge a nomination fee: AUD $300-400

PROCESS AND TIMELINE

1. Check each state's occupation list and eligibility requirements on their respective immigration websites.
2. Apply for state nomination through the state's portal.
3. State nomination processing: 4-12 weeks depending on the state.
4. Once nominated, you are invited to apply through SkillSelect.
5. Lodge the visa application within 60 days.
6. Visa processing: 6-9 months.

TIPS

- Each state has different priorities. NSW focuses on ICT and engineering; Victoria on healthcare and education; South Australia actively recruits for regional occupations.
- Some states require you to already be living/working in that state (onshore nomination streams).
- The 2-year residence commitment in the nominating state is a genuine obligation; failing to comply can impact future visa applications.
- Tasmania and South Australia generally have more accessible nomination criteria and lower score requirements.`,
        sources: [
          { label: "DHA Subclass 190", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/skilled-nominated-190" },
          { label: "NSW Skilled Nominated", url: "https://www.nsw.gov.au/visas-and-migration/skilled-visas" },
          { label: "Victoria State Nomination", url: "https://liveinmelbourne.vic.gov.au/migrate/skilled-migration-visas" },
        ],
      },
      {
        title: "Temporary Skill Shortage (TSS 482)",
        summary: "Employer-sponsored work visa for 2\u20134 years depending on occupation list. Pathway to permanent Subclass 186 after 3 years of employment.",
        tags: ["Work", "Employer Sponsored", "Temporary"],
        readTime: "5 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

You must be nominated by an Australian employer who is an approved sponsor. The position must be on the relevant occupation list (Short-Term, Medium-Term, or Labour Agreement stream). You must have at least 2 years of relevant work experience and meet the English language requirements (generally IELTS 5.0 overall with no band below 4.5, or 5.0 in each band for some occupations).

REQUIREMENTS

- Standard Business Sponsorship (SBS) from the employer
- Nomination for the specific position
- Skills assessment (required for some occupations, not all)
- English language test: IELTS 5.0 (overall, minimum 4.5 per band) for Short-Term stream; 5.0 each band for Medium-Term
- Application fee: AUD $1,455 (short-term) or AUD $2,645 (medium-term)
- Health insurance (mandatory)
- Employer must demonstrate genuine need and meet market salary rate

PROCESS AND TIMELINE

1. Employer applies for or holds a Standard Business Sponsorship.
2. Employer nominates the position (fee: AUD $330).
3. Visa applicant lodges the visa application.
4. Processing: 1-4 months depending on occupation and completeness.
5. Short-term stream: visa for up to 2 years (one renewal possible). Medium-term stream: up to 4 years with pathway to permanent residence.
6. After 3 years on the Medium-Term stream, you can apply for the Subclass 186 Employer Nomination Scheme (permanent residence).

TIPS

- Employers must pay at least the Temporary Skilled Migration Income Threshold (TSMIT), currently AUD $73,150 per year, or the market rate, whichever is higher.
- The Labour Agreement stream allows employers in specific industries to sponsor workers where standard occupation lists do not cover the role.
- Changing employers requires a new nomination and visa application but does not reset your time toward the permanent residency pathway.
- Workers in regional areas may be eligible for the Subclass 494 (Skilled Employer Sponsored Regional) instead, which offers its own PR pathway.`,
        sources: [
          { label: "DHA TSS 482", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-skill-shortage-482" },
          { label: "Occupation Lists", url: "https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list" },
        ],
      },
      {
        title: "Working Holiday Visa (Subclass 417/462)",
        summary: "For 18\u201335 year olds (up to 45 for some countries). Live and work in Australia 1\u20133 years. 88 days of regional work can extend stay by a year.",
        tags: ["Work", "Holiday", "Youth"],
        readTime: "4 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

Subclass 417: Available to passport holders from the UK, Canada, Japan, South Korea, and many European countries. Ages 18-35 (up to 45 for Canadian, Irish, and French citizens). Subclass 462: Available to passport holders from the USA, Argentina, Chile, China, Indonesia, Thailand, and others. Ages 18-30 (18-35 for some countries). You must not have dependent children traveling with you.

REQUIREMENTS

- Valid passport from an eligible country
- Sufficient funds: AUD $5,000 + onward/return travel costs
- Application fee: AUD $640
- Health insurance (recommended; not mandatory but strongly advised)
- Character and health requirements
- No previous Working Holiday visa (for first visa); specific work requirements for second and third visas

PROCESS AND TIMELINE

1. Apply online through ImmiAccount.
2. Processing: typically 1-30 days for most applicants.
3. First visa: 12 months. You can work for any employer, but a maximum of 6 months with the same employer.
4. Second visa: available if you complete 88 days (approximately 3 months) of specified work in regional Australia during your first year. Specified work includes agriculture, mining, construction, and tourism in eligible postcodes.
5. Third visa: available if you complete 6 months of specified work in regional Australia during your second year.

TIPS

- Specified regional work includes fruit picking, farming, fishing, tree farming, mining, and construction in designated regional areas.
- Tax rate for Working Holiday makers is 15% on income up to AUD $45,000, then standard marginal rates above that.
- You can study for up to 4 months on a Working Holiday visa.
- This visa cannot be extended or bridged into a skilled visa directly, but you can apply for other visas from within Australia while holding a valid Working Holiday visa.`,
        sources: [
          { label: "DHA Working Holiday 417", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-417" },
          { label: "DHA Work and Holiday 462", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-462" },
        ],
      },
      {
        title: "Partner Visa (Subclass 820/801)",
        summary: "For spouses/de facto partners of Australian citizens or PRs. Stage 1 is temporary (820), Stage 2 is permanent (801) after 2 years. Genuine relationship must be demonstrated.",
        tags: ["Family", "Spouse", "Permanent"],
        readTime: "6 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

You must be the spouse or de facto partner (including same-sex partners) of an Australian citizen, permanent resident, or eligible New Zealand citizen. De facto relationships must have existed for at least 12 months before applying (waived in certain circumstances such as registered relationships or children of the relationship). You must be in Australia at the time of application for the onshore 820/801 stream. The offshore equivalent is 309/100.

REQUIREMENTS

- Evidence of a genuine and continuing relationship across four categories: financial aspects (joint accounts, shared expenses), nature of the household (shared living arrangements), social aspects (recognition by friends, family, community), and nature of commitment (future plans, length of relationship)
- Sponsor must be approved (not have sponsored more than 2 partners previously, and observe 5-year limitation between sponsorships)
- Application fee: AUD $9,095 (primary applicant)
- Health examination and police clearances
- English language requirement or pay second Visa Application Charge (AUD $5,090) if not met

PROCESS AND TIMELINE

1. Lodge the combined 820/801 application online.
2. Stage 1 (Subclass 820 Temporary Partner): processed first. Current processing: 14-27 months. A bridging visa with work rights is granted immediately.
3. Stage 2 (Subclass 801 Permanent Partner): automatically assessed 2 years after the application date. You must still be in the relationship. Processing: 8-16 months after eligibility date.
4. If the relationship was 3+ years old (or 2+ years with children) at the time of application, the permanent visa may be granted immediately.

TIPS

- The application fee of AUD $9,095 is one of the highest partner visa fees globally. Budget for health checks, police certificates, and translations as well.
- Keep a comprehensive evidence portfolio throughout your relationship: screenshots of messages, travel itineraries, photos at different time periods, statutory declarations from friends/family.
- If the relationship breaks down due to family violence, you may still be eligible for the permanent visa.
- Prospective Marriage Visa (Subclass 300) is available if you are engaged but not yet married; it grants 9 months to enter Australia and marry.`,
        sources: [
          { label: "DHA Partner Visa (Onshore)", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-onshore/temporary-820" },
          { label: "DHA Partner Visa (Offshore)", url: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/partner-offshore/temporary-309" },
        ],
      },
    ],
  },
  {
    id: "uae",
    title: "UAE & Gulf States",
    flag: "\u{1F1E6}\u{1F1EA}",
    category: "Middle East",
    articles: [
      {
        title: "UAE Employment Visa",
        summary: "Employer-sponsored. UAE labour law requires a work permit before entry. Processed in 2\u20134 weeks. Most nationalities eligible. Medical and Emirates ID required after arrival.",
        tags: ["Work", "Employer Sponsored", "Fast"],
        readTime: "3 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

Any foreign national with a job offer from a UAE-based employer can apply for an employment visa. The employer must hold a valid trade license and be registered with the Ministry of Human Resources and Emiratisation (MoHRE). There is no minimum salary requirement for the basic employment visa, though salary levels affect the category of residence permit and family sponsorship eligibility.

REQUIREMENTS

- Job offer and employment contract from a UAE employer
- Entry permit issued by the employer through MoHRE or the relevant free zone authority
- Medical fitness test upon arrival (includes blood tests and chest X-ray)
- Emirates ID registration (mandatory biometric ID card)
- Visa stamping fee: AED 300-500 depending on the employment category
- Employer typically covers all visa and permit costs
- Attested educational certificates may be required for certain professional roles

PROCESS AND TIMELINE

1. Employer applies for an entry permit through MoHRE or the free zone authority.
2. Entry permit issued: 2-5 working days.
3. Employee enters the UAE on the entry permit (valid for 60 days).
4. Medical fitness test: results within 2-3 days.
5. Emirates ID biometrics enrollment and residence visa stamping: 5-7 working days.
6. Total process from application to residence visa: 2-4 weeks.
7. Employment visa is typically valid for 2 years (mainland) or 3 years (free zone), renewable.

TIPS

- UAE employment law was overhauled in 2022 (Federal Decree-Law No. 33 of 2021). All contracts are now fixed-term (maximum 3 years, renewable).
- To sponsor family members (spouse, children), you must earn a minimum of AED 4,000/month (or AED 3,000 + accommodation).
- Free zone companies process visas through their own authority, which can sometimes be faster than mainland processing.
- If you leave your employer, you have a 30-day grace period to find new employment, switch visa status, or depart the UAE.`,
        sources: [
          { label: "MoHRE UAE", url: "https://www.mohre.gov.ae/en/services.aspx" },
          { label: "ICP UAE", url: "https://icp.gov.ae/en/services/" },
          { label: "GDRFA Dubai", url: "https://gdrfa.gov.ae/en" },
        ],
      },
      {
        title: "UAE Golden Visa (10-Year Residence)",
        summary: "Long-term residency for investors, entrepreneurs, skilled professionals, scientists, and outstanding graduates. No employer sponsor needed. Grants independent residency.",
        tags: ["Permanent Residence", "High-skill", "Investment"],
        readTime: "5 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

The Golden Visa is available to: investors (real estate worth AED 2 million+, or a public investment of AED 2 million+), entrepreneurs (with a project worth AED 500,000+ or approval from a UAE incubator), specialized talents and researchers (in science, medicine, engineering, technology, and creative fields), outstanding students (GPA 3.8+ from UAE universities or top 100 global universities), and skilled professionals (in medicine, science, engineering, IT, education, business, and law) earning at least AED 30,000/month with a valid employment contract.

REQUIREMENTS

- Evidence of eligibility for the relevant category
- Valid passport with at least 6 months validity
- Health insurance valid in the UAE
- No processing fees for certain categories; AED 2,800 for others
- Medical fitness certificate
- For investors: proof of investment (title deed, bank statements)
- For professionals: attested qualifications and employment contract

PROCESS AND TIMELINE

1. Apply through the ICP (Federal Authority for Identity, Citizenship, Customs and Port Security) smart services portal or the GDRFA app.
2. Submit supporting documents for your category.
3. Processing: 7-30 days depending on the category and emirate.
4. Golden Visa is valid for 10 years and is renewable.
5. Unlike standard residence visas, the Golden Visa remains valid even if you spend extended periods outside the UAE.

TIPS

- The Golden Visa allows you to sponsor family members (spouse, children of any age, and domestic helpers) without salary requirements.
- Real estate investors can obtain the Golden Visa even with a mortgage, provided the property is valued at AED 2 million+.
- Golden Visa holders can stay outside the UAE for more than 6 months without losing their residence status (standard visas are cancelled after 6 months of absence).
- PhD holders, medical doctors, and individuals with scientific achievements can apply directly without a minimum salary requirement.`,
        sources: [
          { label: "ICP Golden Visa", url: "https://icp.gov.ae/en/services/golden-visa/" },
          { label: "GDRFA Golden Visa", url: "https://gdrfa.gov.ae/en/golden-visa" },
        ],
      },
      {
        title: "UAE Freelance / Self-Employment Visa",
        summary: "Free zone freelancer permits allow independent work without a local sponsor. Dubai, Abu Dhabi, Sharjah all have free zones. Costs AED 7,500\u201320,000/year.",
        tags: ["Work", "Freelance", "Self-Employed"],
        readTime: "4 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

Freelance permits are available to individuals in designated professional categories. Each free zone defines its own list of eligible activities. Common categories include media, technology, education, consulting, design, and creative arts. Some free zones also allow general professional services. You do not need a local sponsor or partner.

REQUIREMENTS

- Application to a free zone authority (popular options: Dubai Media City, Dubai Internet City, DMCC, Abu Dhabi's twofour54, Sharjah Media City)
- Portfolio or evidence of professional experience in your field
- Passport copies and photographs
- Annual costs: AED 7,500-20,000 depending on the free zone and activity type. This typically includes the freelance permit, residence visa, and Emirates ID
- Health insurance (mandatory)
- Some free zones require a minimum qualification or years of experience

PROCESS AND TIMELINE

1. Choose a free zone and verify that your professional activity is covered.
2. Submit the application with required documents.
3. Free zone permit issued: 3-7 working days.
4. Entry permit, medical test, and Emirates ID: additional 7-14 days.
5. Total process: 2-4 weeks.
6. Permit is valid for 1-3 years depending on the free zone and package selected.

TIPS

- Freelancers under a free zone permit can only perform the activities specified in their permit. Adding activities may require an additional fee.
- Some free zones offer flexi-desk packages that include a professional address, meeting room access, and mail handling.
- Freelance permit holders can sponsor dependents if their monthly income meets the threshold (typically AED 10,000-15,000/month or equivalent).
- The UAE mainland also now offers freelance permits through MoHRE for certain professional categories.`,
        sources: [
          { label: "GoFreelance Dubai", url: "https://gofreelance.ae/" },
          { label: "DMCC Free Zone", url: "https://www.dmcc.ae/" },
          { label: "twofour54 Abu Dhabi", url: "https://www.twofour54.com/" },
        ],
      },
      {
        title: "Saudi Arabia & GCC \u2014 Premium Residency",
        summary: "Saudi Arabia launched Premium Residency (Green Card) in 2019. One-time fee SAR 800,000 or annual SAR 100,000. Allows business ownership, no sponsor needed.",
        tags: ["Work", "GCC", "Premium"],
        readTime: "5 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

Saudi Arabia's Premium Residency is open to foreign nationals who meet specific criteria determined by the Premium Residency Centre. Two tiers exist: Permanent Premium Residency (one-time fee of SAR 800,000) and Temporary Renewable Premium Residency (annual fee of SAR 100,000 per year). Applicants must be 21 or older, have a valid passport, have no criminal record, be medically fit, and demonstrate financial solvency.

REQUIREMENTS

- Application through the Premium Residency Centre portal
- Valid passport with at least 6 months validity
- Criminal background check from your country of residence
- Medical fitness certificate
- Proof of financial solvency (bank statements, employment contracts, or business ownership documents)
- Permanent: SAR 800,000 one-time fee (approximately USD $213,000)
- Temporary: SAR 100,000 annual fee (approximately USD $26,700)

PROCESS AND TIMELINE

1. Apply online through the Premium Residency Centre portal.
2. Submit required documentation.
3. Background and eligibility verification: 30-90 days.
4. If approved, pay the applicable fee and receive the Premium Residency ID.
5. Registration for Iqama (residency permit) and associated government services.

TIPS

- Premium residents can own real estate in Saudi Arabia (including in Makkah and Madinah, with certain restrictions).
- Premium residents can own and operate businesses without a Saudi partner (bypassing the traditional sponsorship/kafala requirement).
- Family members (spouse and children) can be added as dependents.
- Other GCC countries have their own long-term residence programs: UAE Golden Visa, Bahrain Golden Residency, and Qatar Permanent Residency are all alternatives in the region.
- The kafala (sponsorship) system has been significantly reformed across the GCC, but Premium Residency offers the most independence from employer sponsorship.`,
        sources: [
          { label: "Saudi Premium Residency Centre", url: "https://prc.gov.sa/en" },
          { label: "Saudi Vision 2030", url: "https://www.vision2030.gov.sa/" },
        ],
      },
    ],
  },
  {
    id: "japan",
    title: "Japan & South Korea",
    flag: "\u{1F1EF}\u{1F1F5}",
    category: "Asia-Pacific",
    articles: [
      {
        title: "Japan Engineer / Specialist in Humanities",
        summary: "Most common work visa for foreign professionals. Requires degree or 10+ years experience. Employer must be an approved sponsor. Initial 1\u20135 year term, renewable.",
        tags: ["Work", "Employer Sponsored", "Renewable"],
        readTime: "4 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

This is Japan's primary work visa for white-collar professionals in fields such as engineering, IT, natural sciences, law, economics, business administration, and other humanities. You must have a university degree relevant to the job or at least 10 years of professional experience in the field (3 years for some IT-related occupations). The job must match your qualifications.

REQUIREMENTS

- University degree (bachelor's or higher) related to the job, or 10+ years of relevant work experience
- A job offer from a Japanese company with a contract or letter of employment
- The company's business registration documents and financial statements
- Certificate of Eligibility (CoE) -- applied for by the employer at the regional Immigration Services Agency office
- Visa application fee: JPY 3,000 (single entry) or JPY 6,000 (multiple entry)
- No minimum salary requirement by law, but immigration authorities assess whether the salary is comparable to what a Japanese national would receive for the same work

PROCESS AND TIMELINE

1. Employer applies for a Certificate of Eligibility (CoE) at the Immigration Services Agency. Processing: 1-3 months.
2. CoE is sent to the applicant abroad.
3. Apply for a visa at the Japanese embassy/consulate with the CoE. Processing: 5-10 working days.
4. Enter Japan and register at the local ward/city office within 14 days.
5. Visa initially granted for 1, 3, or 5 years depending on the assessment.
6. Renewable indefinitely as long as you maintain qualifying employment.

TIPS

- The CoE is valid for only 3 months from the date of issue; you must enter Japan within this period.
- Changing employers requires notifying the Immigration Services Agency within 14 days, and your new job must fall within the same visa category.
- After 10 years of continuous residence (with at least 5 years on a work visa), you can apply for permanent residence.
- Japan's points-based Highly Skilled Professional visa may be a better option if you qualify (faster PR in 1-3 years).`,
        sources: [
          { label: "Immigration Services Agency of Japan", url: "https://www.moj.go.jp/isa/index.html" },
          { label: "Japan Visa Information", url: "https://www.mofa.go.jp/j_info/visit/visa/index.html" },
        ],
      },
      {
        title: "Japan Specified Skilled Worker (SSW-1 & SSW-2)",
        summary: "Two tiers for 12 specific industries introduced in 2019. SSW-1 is capped at 5 years, no family. SSW-2 has no cap, leads to permanent residency, and allows family sponsorship.",
        tags: ["Work", "Skilled", "Pathway to PR"],
        readTime: "5 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

SSW-1: You must pass a skills test and a Japanese language test (JLPT N4 or JFT-Basic A2) for your specific industry. Available for 16 designated industries: nursing care, building cleaning, material processing, industrial machinery, electrical/electronics, construction, shipbuilding, automobile maintenance, aviation, accommodation, agriculture, fisheries, food and beverage manufacturing, food service, and (added in 2024) automobile transportation, railroad, forestry, and wood industry.

SSW-2: For workers with advanced skills in construction and shipbuilding (with plans to expand to other sectors). Must pass a higher-level skills test. No family restrictions and no 5-year cap.

REQUIREMENTS

- Pass the industry-specific skills test (administered in Japan and select countries)
- Pass the Japanese language test: JLPT N4 or JFT-Basic A2 level for SSW-1; typically N3 or higher for SSW-2
- Job offer from a registered Japanese employer
- No criminal record
- Former Technical Intern Training Program (TITP) participants who completed 3 years in a related field are exempt from the skills test

PROCESS AND TIMELINE

1. Pass the required skills and language tests.
2. Secure a job offer from a registered accepting organization.
3. Employer applies for a Certificate of Eligibility.
4. Processing: 1-2 months.
5. SSW-1: granted for 1 year, 6 months, or 4 months (renewable up to a cumulative 5-year maximum).
6. SSW-2: granted for 1 or 3 years (no maximum cumulative limit, renewable indefinitely).

TIPS

- SSW-1 holders cannot bring family members to Japan. SSW-2 holders can sponsor spouses and children.
- SSW-2 time counts toward the 10-year permanent residence requirement, and the path to PR is open for SSW-2 holders.
- Japan is replacing the Technical Intern Training Program (TITP) with the new Ikusei Shuro (Training and Employment) system starting in 2027, which will allow workers to change employers more freely.
- Skills tests are offered in multiple countries including the Philippines, Vietnam, Indonesia, Thailand, Myanmar, Cambodia, Nepal, and Mongolia.`,
        sources: [
          { label: "ISA Specified Skilled Worker", url: "https://www.moj.go.jp/isa/policies/ssw/index.html" },
          { label: "JITCO SSW Information", url: "https://www.jitco.or.jp/en/regulation/ssw.html" },
        ],
      },
      {
        title: "Japan Highly Skilled Professional (HSP) Points Visa",
        summary: "Points-based for highly qualified professionals. 70+ points: preferential treatment. 80+ points: fast-track PR in just 1 year. Covers research, business management, and technical fields.",
        tags: ["Work", "Points-based", "Fast Track PR"],
        readTime: "5 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

The Highly Skilled Professional visa uses a points system evaluating academic background, professional career, annual salary, age, and bonus items (Japanese language ability, degrees from top-ranked universities, research achievements). Three categories exist: (a) Advanced academic research, (b) Advanced specialized/technical activities, and (c) Advanced business management. You need 70+ points to qualify.

REQUIREMENTS

- 70+ points on the HSP points calculation form
- Points are awarded for: degree level (doctoral: 30 points, master's: 20, bachelor's: 10), age (under 30: 15 points), salary (JPY 10M+: 40 points, JPY 7-8M: 20 points), work experience, research achievements, and Japanese language proficiency
- Job offer or business plan relevant to the HSP category
- Annual salary: minimum JPY 3 million for categories (a) and (b)
- Certificate of Eligibility applied for by the employer

PROCESS AND TIMELINE

1. Calculate your points using the official points calculation form available from the Immigration Services Agency.
2. Employer applies for a Certificate of Eligibility designating the HSP visa category.
3. CoE processing: typically faster than standard work visas (2-4 weeks in many cases).
4. Visa granted for 5 years initially.
5. Permanent residence: 70-79 points qualifies for PR after 3 years of residence; 80+ points qualifies for PR after just 1 year.

TIPS

- The 1-year path to permanent residence (with 80+ points) is the fastest PR route in Japan and one of the fastest globally.
- HSP visa holders receive preferential treatment: permission for multiple activities (e.g., teaching at a university while running a business), a 5-year initial visa, expedited immigration processing, and permission for a spouse to work.
- Parents and domestic workers of HSP holders may be granted residence under certain conditions (annual household income of JPY 8 million+ and a child under 7).
- JLPT N1 certification adds 15 bonus points; N2 adds 10 points. Graduating from a Japanese university also adds significant bonus points.`,
        sources: [
          { label: "ISA Highly Skilled Professional", url: "https://www.moj.go.jp/isa/publications/materials/newimmiact_3_index.html" },
          { label: "Points Calculation Form", url: "https://www.moj.go.jp/isa/content/930001657.pdf" },
        ],
      },
      {
        title: "South Korea E-7 Skilled Worker & F-5 Permanent Residence",
        summary: "E-7 covers 80+ occupation categories with employer sponsorship, renewable for 3 years. After sustained employment: F-2 (resident) \u2192 F-5 (permanent) path open.",
        tags: ["Work", "Korea", "Points-based"],
        readTime: "5 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

E-7 (Specially Designated Activities): Available for foreign workers in 84 designated occupation categories including IT, engineering, natural sciences, social sciences, law, and skilled trades. You need a bachelor's degree or equivalent qualifications and a job offer from a Korean employer. Annual salary should be at least KRW 26.28 million (approximately USD $19,500) for general categories.

F-5 (Permanent Residence): Available after sustained legal residence in Korea, typically through the points-based F-2 (Resident) visa. F-2 requires 80+ points on the Korean Immigration Points System based on age, education, Korean language ability, income, and social integration.

REQUIREMENTS

- E-7: Bachelor's degree or higher + employer sponsorship + relevant occupation on the designated list
- F-2 (Points-based): 80+ points from: age (max 25), education (max 35), Korean language TOPIK (max 20), social integration program (max 10), income (max 10)
- F-5: After 3 years on F-2 status with continued point score of 80+ and annual income of at least 2x the GNI per capita
- Korean Immigration & Integration Program (KIIP) completion can substitute for some language requirements
- Application fees: KRW 130,000 for E-7; KRW 230,000 for F-5

PROCESS AND TIMELINE

1. E-7: Employer files a visa issuance confirmation at the local immigration office. Processing: 2-4 weeks. Visa is initially granted for 1-3 years, renewable.
2. After sustained E-7 employment and accumulating points, apply for F-2 (Resident) visa. Processing: 1-2 months.
3. After 3 years on F-2 with maintained qualifications, apply for F-5 (Permanent Residence). Processing: 2-4 months.
4. F-5 holders have unrestricted work rights and do not need to renew their visa (but must re-enter Korea at least once every 2 years to maintain status).

TIPS

- TOPIK Level 4+ (intermediate) is strongly recommended and earns significant points toward F-2/F-5.
- The Social Integration Program (KIIP) is a free government-run program that provides Korean language and culture education. Completing Level 5 earns bonus immigration points.
- E-7 visa holders can bring spouses and minor children as dependents.
- Korea also offers the E-9 Non-Professional Employment visa for workers in manufacturing, construction, agriculture, and fisheries through the Employment Permit System (EPS).`,
        sources: [
          { label: "Korea Immigration Service", url: "https://www.immigration.go.kr/immigration_eng/index.do" },
          { label: "KIIP Program", url: "https://www.socinet.go.kr/soci/main/main.jsp" },
          { label: "Hi Korea Portal", url: "https://www.hikorea.go.kr/" },
        ],
      },
    ],
  },
  {
    id: "latam",
    title: "Latin America",
    flag: "\u{1F30E}",
    category: "Latin America",
    articles: [
      {
        title: "Brazil \u2014 MERCOSUR Residence Agreement",
        summary: "Citizens of Argentina, Bolivia, Chile, Colombia, Ecuador, Paraguay, Peru, Uruguay can get 2-year temporary residence in Brazil, then convert to permanent. Simple and affordable.",
        tags: ["Regional", "Pathway", "MERCOSUR"],
        readTime: "4 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

Citizens of MERCOSUR member states (Argentina, Bolivia, Chile, Colombia, Ecuador, Guyana, Paraguay, Peru, Suriname, Uruguay, and Venezuela) can apply for temporary residence in Brazil under the MERCOSUR Residence Agreement. No job offer, specific income level, or educational qualification is required. The agreement also extends to associated states.

REQUIREMENTS

- Valid passport or national identity document
- Birth certificate (apostilled or legalized)
- Criminal background check from your country of origin or residence (apostilled)
- Proof of entry into Brazil (passport stamp or migration card)
- Application fee: approximately BRL 210 (about USD $40)
- No proof of income or employment required for the initial temporary permit

PROCESS AND TIMELINE

1. Enter Brazil on a tourist visa or visa-free entry.
2. Apply at the Federal Police (Policia Federal) immigration office for the MERCOSUR temporary residence permit.
3. Processing: 30-90 days.
4. Temporary residence permit is valid for 2 years.
5. Before the 2-year permit expires, apply for conversion to permanent residence. You must demonstrate that you have means of subsistence (employment, self-employment, or savings).
6. Permanent residence is granted indefinitely, renewable every 10 years (administrative renewal only).

TIPS

- The MERCOSUR agreement is one of the simplest immigration pathways globally, with minimal bureaucratic requirements.
- Once you have permanent residence, you can apply for Brazilian citizenship after 4 years of permanent residence (reduced to 1 year if you have a Brazilian spouse or child, or are from a Portuguese-speaking country).
- The RNM (Registro Nacional Migratório) replaces the old RNE card and serves as your identification document.
- Brazil also offers humanitarian visas for nationals of certain countries facing crisis situations (e.g., Haitians, Afghans, Ukrainians).`,
        sources: [
          { label: "Brazil Federal Police - Immigration", url: "https://www.gov.br/pf/pt-br/assuntos/imigracao" },
          { label: "MERCOSUR Residence Agreement", url: "https://www.mercosur.int/" },
        ],
      },
      {
        title: "Mexico \u2014 Temporary & Permanent Resident Visas",
        summary: "Mexico offers temporary residency (1\u20134 years) and permanent residency based on economic solvency, family ties, or skills. Popular with remote workers \u2014 low cost of living.",
        tags: ["Temporary", "Permanent", "Mexico"],
        readTime: "4 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

Mexico offers several residence pathways. Temporary Resident Visa (1-4 years): requires economic solvency (monthly income of at least MXN 43,000 or approximately USD $2,500/month for the last 6 months, OR savings of at least MXN 720,000 or approximately USD $42,000). Family ties to a Mexican citizen or resident also qualify. Permanent Resident Visa: requires higher economic solvency (monthly income of at least MXN 107,000 or approximately USD $6,200/month for the last 6 months, OR savings of at least MXN 4,300,000 or approximately USD $250,000), family ties, 4 years as a temporary resident, or retirement (with pension income meeting the threshold).

REQUIREMENTS

- Valid passport with at least 6 months validity
- Completed visa application form
- Recent photograph meeting INM specifications
- Proof of economic solvency (bank statements for the last 6 months showing the required monthly income or balance)
- For family ties: marriage certificate, birth certificate, or proof of relationship
- Visa application fee: approximately USD $50 (consular fee varies by nationality)
- Temporary Resident Card fee: approximately MXN 5,000 (paid in Mexico)

PROCESS AND TIMELINE

1. Apply at the Mexican consulate in your country of residence.
2. Consular processing: 5-10 working days.
3. Enter Mexico within 180 days of visa issuance.
4. Within 30 days of entry, complete the INM (National Immigration Institute) canje process to exchange the visa for a Temporary Resident Card.
5. Temporary Resident Cards are initially valid for 1 year, renewable for up to 4 years total.
6. After 4 years of temporary residency, apply for permanent residency.

TIPS

- Mexico does not have a specific digital nomad visa, but the Temporary Resident Visa effectively serves this purpose for remote workers meeting the income threshold.
- Temporary residents can work in Mexico with a work permit endorsement (requires a Mexican employer to request it), or freelance under certain conditions.
- The economic solvency requirements are based on the Mexican minimum wage and are updated annually.
- Permanent residents can work freely without any additional permits and can travel in and out of Mexico without restrictions.`,
        sources: [
          { label: "INM Mexico", url: "https://www.gob.mx/inm" },
          { label: "Mexican Consular Services", url: "https://embamex.sre.gob.mx/" },
        ],
      },
      {
        title: "Emigrating from Latin America \u2014 Key Pathways",
        summary: "Top destinations for Latin Americans: Spain (ibero-american fast track to citizenship), US (TPS, family), Canada (Express Entry), Portugal (D7 Passive Income Visa). Language is a natural advantage for Spain and Portugal.",
        tags: ["Emigration", "Diaspora", "Guide"],
        readTime: "6 min",
        lastUpdated: "March 2026",
        content: `SPAIN -- IBERO-AMERICAN CITIZENSHIP FAST TRACK

Citizens of former Spanish colonies (all of Latin America and the Philippines) can obtain Spanish citizenship after just 2 years of legal residence, compared to the standard 10 years for other nationalities. Requirements: 2 years of continuous legal residence, clean criminal record, sufficient integration (basic Spanish and civics test -- CCSE and DELE A2). Common entry visas: student visa, non-lucrative visa, work visa, or entrepreneur visa.

PORTUGAL -- D7 AND DIGITAL NOMAD VISA

The D7 Passive Income Visa is for retirees and individuals with passive income (minimum approximately EUR 870/month based on the Portuguese minimum wage). Portuguese-speaking Brazilians have a natural language advantage. Portugal also offers a Digital Nomad Visa (D8) for remote workers earning at least 4x the Portuguese minimum wage (approximately EUR 3,480/month). After 5 years of legal residence, apply for permanent residence or Portuguese citizenship (with language test).

UNITED STATES -- FAMILY AND TPS

Family sponsorship remains the most common pathway for Latin Americans to the U.S. U.S. citizens can petition for spouses, children, parents, and siblings (though sibling wait times can exceed 20 years for some countries). Temporary Protected Status (TPS) is available for nationals of designated countries facing conflict or natural disaster. The Diversity Visa Lottery is not available to nationals of countries with high U.S. immigration rates (Mexico, Brazil, Colombia, and others are typically excluded).

CANADA -- EXPRESS ENTRY

Canada's Express Entry system is nationality-neutral and skills-based. Latin Americans with strong English or French proficiency, university degrees, and skilled work experience are competitive candidates. Canadian Language Benchmarks (CLB) testing in both English and French can maximize CRS points. Provincial Nominee Programs in Atlantic Canada and the Prairies actively recruit workers in healthcare, trades, and agriculture.

TIPS

- Spain's 2-year path to citizenship is the fastest in Europe for Latin Americans and leads to full EU citizenship.
- Portuguese citizenship, obtained after 5 years, also grants EU-wide rights.
- Many Latin American countries allow dual citizenship, so you can maintain your original nationality while acquiring a second one.
- Brazil has reciprocal agreements with Portugal that provide special residence rights under the Treaty of Friendship and Cooperation.`,
        sources: [
          { label: "Spain Immigration Portal", url: "https://extranjeros.inclusion.gob.es/" },
          { label: "Portugal SEF / AIMA", url: "https://www.sef.pt/en/" },
          { label: "IRCC Canada", url: "https://www.canada.ca/en/immigration-refugees-citizenship.html" },
        ],
      },
      {
        title: "Digital Nomad Visas \u2014 Colombia, Argentina, Costa Rica",
        summary: "Colombia (Migrant M visa), Argentina (Rentista), and Costa Rica all offer paths for remote workers. Requires proof of foreign income. Processing: 1\u20134 weeks.",
        tags: ["Digital Nomad", "Remote Work", "Short-term"],
        readTime: "4 min",
        lastUpdated: "March 2026",
        content: `COLOMBIA -- DIGITAL NOMAD VISA (V-TYPE)

Colombia introduced a dedicated Digital Nomad Visa in 2022. Requirements: proof of remote employment or freelance work for a company outside Colombia, monthly income of at least 3x the Colombian minimum wage (approximately USD $900/month for 2025), health insurance with coverage in Colombia, and a valid passport. The visa is granted for up to 2 years. Application fee: approximately USD $55. Apply online through the Colombian Ministry of Foreign Affairs visa portal.

ARGENTINA -- DIGITAL NOMAD VISA (RENTISTA)

Argentina launched its digital nomad visa program in 2022. Requirements: proof of remote work for a foreign employer or as a freelancer, monthly income of at least USD $1,500, health insurance valid in Argentina, and a clean criminal record. The visa is valid for 6 months, extendable for another 6 months. Application can be made at Argentine consulates abroad or, for some nationalities, upon arrival. No Argentine tax obligations for income earned from foreign sources during the visa period.

COSTA RICA -- DIGITAL NOMAD VISA (RENTISTA)

Costa Rica offers a Digital Nomad Visa for remote workers. Requirements: proof of remote employment with a company outside Costa Rica, monthly income of at least USD $3,000 (or USD $5,000 for a family), health insurance, and a clean criminal record. Valid for 1 year, renewable for an additional year. Application fee: approximately USD $100. Holders are exempt from Costa Rican income tax on foreign-sourced income.

PROCESS AND TIMELINE

1. Gather required documents: employment contract or client contracts, bank statements showing income, insurance policy, and police clearance.
2. Apply online (Colombia) or at the nearest consulate (Argentina, Costa Rica).
3. Processing: Colombia 5-15 days; Argentina 2-4 weeks; Costa Rica 2-4 weeks.
4. If approved from abroad, enter the country and register with local immigration.

TIPS

- Colombia's digital nomad visa is the most affordable in the region with the lowest income requirement.
- Costa Rica's higher income threshold reflects its higher cost of living, especially in popular areas like San Jose and Guanacaste.
- None of these visas provide a direct pathway to permanent residence, but spending time in the country may facilitate other visa applications.
- Internet quality varies: Colombia (Medellin, Bogota) and Costa Rica (San Jose) generally offer reliable high-speed connections. Argentina has variable quality outside Buenos Aires.`,
        sources: [
          { label: "Colombia Visa Portal", url: "https://www.cancilleria.gov.co/en/procedures_services/visa" },
          { label: "Argentina Migration", url: "https://www.argentina.gob.ar/interior/migraciones" },
          { label: "Costa Rica DGME", url: "https://www.migracion.go.cr/" },
        ],
      },
    ],
  },
  {
    id: "india_seasia",
    title: "India & Southeast Asia",
    flag: "\u{1F1EE}\u{1F1F3}",
    category: "Asia-Pacific",
    articles: [
      {
        title: "India \u2014 OCI Card (Overseas Citizens of India)",
        summary: "Lifelong multi-purpose visa for Indian-origin persons and spouses of Indian citizens. Unlimited entry, no registration required. Near-equal rights but not full citizenship.",
        tags: ["Dual Status", "Diaspora", "India"],
        readTime: "4 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

OCI is available to: foreign nationals who were citizens of India at any point after January 26, 1950 (or were eligible to become citizens on that date); foreign nationals whose parents, grandparents, or great-grandparents were Indian citizens; spouses of Indian citizens or existing OCI cardholders (subject to 2 years of marriage if applying on spousal basis); and minor children of OCI cardholders. Pakistani and Bangladeshi citizens or persons who ever held Pakistani or Bangladeshi citizenship are not eligible.

REQUIREMENTS

- Application form and supporting documents (birth certificates, evidence of Indian origin, marriage certificate if applicable)
- Current and previous passports
- Application fee: approximately USD $275 (varies by country)
- Two recent passport-size photographs
- Proof of Indian origin: parents' or grandparents' Indian passports, birth certificates from India, or other documentary evidence
- Processing fee for re-issuance (after passport renewal): approximately USD $25

PROCESS AND TIMELINE

1. Apply online through the OCI portal at ociservices.gov.in.
2. Submit physical documents at the nearest Indian embassy/consulate or designated application centre (VFS Global or BLS International).
3. Processing: 4-8 weeks (varies by jurisdiction; some consulates take longer).
4. OCI card is valid for the lifetime of the holder and does not expire.
5. OCI must be re-issued to update passport details when: the passport is renewed before age 20 (each time), the passport is renewed after age 50 (once), or the U.S. sticker needs updating.

TIPS

- OCI grants near-equal rights to Indian citizens including unlimited entry, no visa required, right to work and study, and right to purchase certain types of property. Agricultural land and plantation property cannot be purchased.
- OCI holders cannot vote, hold public office, or hold a government job in India.
- The old PIO (Person of Indian Origin) card has been merged into the OCI scheme.
- OCI registration must be reissued when the holder renews their foreign passport (up to age 50). After age 50, only one re-issuance is required.
- Processing times at Indian consulates vary significantly; plan ahead if you need the card for upcoming travel.`,
        sources: [
          { label: "OCI Services Portal", url: "https://ociservices.gov.in/" },
          { label: "MHA India - OCI", url: "https://www.mha.gov.in/en/divisionofmha/foreigners-division/overseas-citizen-of-india-cardholder" },
        ],
      },
      {
        title: "Singapore \u2014 Employment Pass & S Pass",
        summary: "EP for professionals earning SGD $5,000+/month. S Pass for mid-level at $3,150+/month. Employers must show fair consideration to locals. 1\u20132 year initial, renewable.",
        tags: ["Work", "Singapore", "High-skill"],
        readTime: "4 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

Employment Pass (EP): For foreign professionals, managers, and executives. Minimum fixed monthly salary of SGD $5,600 (as of September 2025; higher for older and more experienced candidates -- up to SGD $10,700+ for those in their 40s). Must pass the COMPASS (Complementarity Assessment) framework, a points-based system evaluating salary, qualifications, diversity, and the employer's local workforce share. S Pass: For mid-skilled technical staff. Minimum salary SGD $3,150 (higher in financial services: SGD $3,650). Subject to employer-level quotas (10-18% of total workforce depending on the sector).

REQUIREMENTS

- EP: Recognized university qualification, professional qualifications, or specialist skills. COMPASS score of 40+ points across four categories: salary, qualifications, diversity, and support for local employment. Application fee: SGD $105.
- S Pass: At least a diploma, degree, or technical certificate. Relevant work experience. Application fee: SGD $105.
- Employer must demonstrate fair consideration of local candidates through advertising on MyCareersFuture for at least 14 days before applying for an EP.
- Monthly foreign worker levy for S Pass holders: SGD $550-650 per worker.

PROCESS AND TIMELINE

1. Employer submits the application through the Ministry of Manpower (MOM) EP Online portal.
2. Processing: 3-8 weeks for most applications.
3. If approved in principle, the pass is issued as an In-Principle Approval (IPA) letter.
4. The worker enters Singapore on the IPA and completes registration (fingerprinting and photo) for the physical card.
5. EP: initially valid for 1-2 years, renewable for up to 3 years. S Pass: 1-2 years, renewable for up to 3 years.

TIPS

- The COMPASS framework (introduced 2023) replaced the previous purely salary-based assessment. Employers with strong local hiring records and diversity score higher.
- EP holders can apply for Permanent Residence (PR) after holding the pass for at least 6 months, though successful PR applications typically come after 2-3 years.
- Dependant's Passes (for spouses and children) are available for EP holders earning at least SGD $6,000/month.
- The ONE Pass (Overseas Networks and Expertise Pass) is a separate, elite 5-year pass for top talent earning at least SGD $30,000/month, with the flexibility to work for multiple employers and start businesses.`,
        sources: [
          { label: "MOM Employment Pass", url: "https://www.mom.gov.sg/passes-and-permits/employment-pass" },
          { label: "MOM S Pass", url: "https://www.mom.gov.sg/passes-and-permits/s-pass" },
          { label: "COMPASS Framework", url: "https://www.mom.gov.sg/passes-and-permits/employment-pass/compass" },
        ],
      },
      {
        title: "Thailand \u2014 Long-Term Resident (LTR) Visa",
        summary: "10-year LTR visa for wealthy global citizens, remote workers, highly-skilled professionals, and retirees. Income requirements vary by category: $40K\u2013$80K/year.",
        tags: ["Long-term", "Remote Work", "Thailand"],
        readTime: "4 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

Four categories qualify for the LTR visa:
1. Wealthy Global Citizens: personal income of at least USD $80,000/year with minimum USD $1 million in assets.
2. Wealthy Pensioners: aged 50+, annual pension or income of at least USD $80,000/year (or USD $40,000+ with an investment of at least USD $250,000 in Thai government bonds, property, or FDI).
3. Work-from-Thailand Professionals: employed by a company with USD $150 million+ revenue (over the past 3 years), personal income of at least USD $80,000/year (or USD $40,000+ with a master's degree or IP/patent ownership), and at least 5 years of work experience.
4. Highly Skilled Professionals: specialists in targeted industries (digital, automation, biotech, medical, aerospace, etc.) with a minimum income of USD $80,000/year (or USD $40,000+ with expertise in a Thai BOI-targeted industry), employed by a company with operations in Thailand.

REQUIREMENTS

- Application through the Thailand Board of Investment (BOI) LTR portal
- Valid passport with at least 12 months validity
- Health insurance with minimum USD $50,000 coverage (or equivalent Thai social security)
- Evidence of income, employment, and assets as required by the category
- No application fee; visa fee: THB 50,000 (approximately USD $1,400) for the 10-year visa
- Criminal background check

PROCESS AND TIMELINE

1. Apply online through the BOI LTR visa portal.
2. BOI reviews the application: 20-30 working days.
3. If approved, receive an endorsement letter from BOI.
4. Apply for the LTR visa at a Thai embassy/consulate or at Thai Immigration within Thailand.
5. Visa is valid for 10 years (5 years initially, renewable for another 5 years).

TIPS

- LTR holders enjoy a reduced personal income tax rate of 17% (flat) for Thai-sourced income. Work-from-Thailand Professionals are exempt from Thai tax on foreign-sourced income.
- LTR holders receive a digital work permit, fast-track airport immigration, and exemption from the 90-day reporting requirement (annual reporting instead).
- Dependants (spouse and children under 20) can also receive the 10-year visa.
- The LTR visa allows holders to work in Thailand with a digital work permit at no additional cost.
- Thailand's standard retirement visa (Non-Immigrant O-A) remains available for those who do not meet LTR thresholds (requires only THB 800,000 in savings or THB 65,000/month income).`,
        sources: [
          { label: "Thailand BOI LTR", url: "https://ltr.boi.go.th/" },
          { label: "Thai Immigration Bureau", url: "https://www.immigration.go.th/" },
        ],
      },
      {
        title: "Philippines \u2014 13A Permanent Resident Visa",
        summary: "For foreign nationals married to Filipino citizens. Initially conditional (1 year), then permanent. Includes right to work without additional permits.",
        tags: ["Family", "Philippines", "Permanent"],
        readTime: "3 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

The 13(a) Quota Immigrant Visa is available to foreign nationals who are legally married to a Filipino citizen. The marriage must be recognized under Philippine law. The Filipino spouse must petition for the foreign spouse. This visa leads to permanent residence in the Philippines.

REQUIREMENTS

- NSO/PSA-authenticated marriage certificate
- Filipino spouse's birth certificate (PSA-authenticated)
- Joint affidavit of support with evidence of financial capacity
- NBI (National Bureau of Investigation) clearance for the foreign spouse
- Medical examination by a Bureau of Quarantine-designated physician
- Visa fee: PHP 10,000-20,000 (approximately USD $180-360)
- ACR I-Card (Alien Certificate of Registration): PHP 3,000
- Recent photographs and valid passport

PROCESS AND TIMELINE

1. Filipino spouse files a petition at the Bureau of Immigration (BI) in Manila.
2. Submit all required documents.
3. Interview at the Bureau of Immigration (both spouses must attend).
4. Processing: 2-4 months.
5. Initially granted as a Probationary Visa (valid for 1 year).
6. After 1 year, apply for conversion to Permanent Resident status (no additional petition needed; file a motion with the BI).
7. Permanent status is indefinite as long as the marriage subsists and you do not abandon Philippine residence.

TIPS

- 13(a) visa holders have the right to work in the Philippines without needing a separate Alien Employment Permit (AEP).
- You must maintain an ACR I-Card (Alien Certificate of Registration) and renew it annually (PHP 3,000).
- If the marriage is dissolved or annulled, the visa may be revoked.
- Foreign nationals who are not married to Filipinos can explore the Special Resident Retiree's Visa (SRRV) through the Philippine Retirement Authority (deposit of USD $20,000-50,000 depending on age and terms).
- Philippines also offers the SIRV (Special Investor's Resident Visa) for investors with at least USD $75,000 invested in Philippine corporations.`,
        sources: [
          { label: "Bureau of Immigration Philippines", url: "https://immigration.gov.ph/" },
          { label: "Philippine Retirement Authority", url: "https://pra.gov.ph/" },
        ],
      },
    ],
  },
  {
    id: "nigeria",
    title: "Nigerian Immigration",
    flag: "\u{1F1F3}\u{1F1EC}",
    category: "Africa",
    articles: [
      {
        title: "Nigerian Passport Renewal",
        summary: "Renew at NIS offices or Nigerian embassies abroad. Standard: 6\u20138 weeks. Express: 3\u20135 days (premium). Book online at immigration.gov.ng. Both 32-page and 64-page available.",
        tags: ["Passport", "Document", "Nigeria"],
        readTime: "3 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

All Nigerian citizens are eligible for passport renewal. You can apply for a standard 32-page booklet or a 64-page booklet (for frequent travelers). Both are available as regular processing or enhanced e-passport. Children under 18 require consent of a parent or guardian.

REQUIREMENTS

- Current or expired Nigerian passport
- National Identification Number (NIN) -- mandatory
- Recent passport photographs (white background, no glasses)
- Completed online application through the NIS portal
- Fees: 32-page (5-year): NGN 35,000; 32-page (10-year): NGN 70,000; 64-page (5-year): NGN 70,000; 64-page (10-year): NGN 140,000
- For applications abroad, fees are charged in local currency equivalent (approximately USD $80-230 depending on booklet type)

PROCESS AND TIMELINE

1. Create an account on the Nigeria Immigration Service portal (portal.immigration.gov.ng).
2. Complete the application and pay the fee online.
3. Book an appointment at your nearest NIS office or Nigerian embassy/consulate.
4. Attend the appointment for biometrics capture (fingerprints and photograph).
5. Standard processing: 6-8 weeks (within Nigeria); 4-12 weeks (abroad, varies by embassy).
6. Express/premium processing at select NIS offices: 3-5 working days (additional fee may apply).
7. Collect the passport in person or by courier (if available at the processing location).

TIPS

- Always apply online first before visiting any NIS office; walk-in applications without prior online booking are generally not accepted.
- The NIN is now mandatory for all passport applications. If you do not have one, apply at NIMC (National Identity Management Commission) offices first.
- Premium processing (expedited) is available at select passport offices including Ikoyi (Lagos) and the Abuja Head Office.
- Applications abroad are processed through the Nigerian embassy or consulate, and processing times vary significantly by location.
- Carry your old passport to the appointment as it will be returned to you with the new one (or retained if it contains valid visas).`,
        sources: [
          { label: "Nigeria Immigration Service", url: "https://portal.immigration.gov.ng/" },
          { label: "NIS Official Website", url: "https://immigration.gov.ng/" },
        ],
      },
      {
        title: "Nigerian Diaspora \u2014 Dual Citizenship",
        summary: "Nigerians can hold dual citizenship. Apply through NIS for renunciation reversal. Nigerian-Americans and British-Nigerians commonly hold both. Process takes 3\u20136 months.",
        tags: ["Dual Citizenship", "Diaspora", "Rights"],
        readTime: "4 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

Section 28 of the 1999 Nigerian Constitution (as amended) provides that a Nigerian citizen who acquires the citizenship of another country shall forfeit Nigerian citizenship. However, in practice, Nigeria widely tolerates dual citizenship and the Nigerian government has not enforced forfeiture provisions in decades. The Citizenship Act allows individuals who lost Nigerian citizenship by acquiring another nationality to apply for restoration. Nigerian-born individuals who acquired foreign citizenship can continue to hold and renew Nigerian passports.

REQUIREMENTS

- For citizenship restoration (if formally renounced): application to the President through the NIS
- Evidence of Nigerian citizenship by birth (birth certificate, previous Nigerian passport, parents' documentation)
- Current foreign passport
- Declaration of intent to retain Nigerian citizenship
- Application fee: varies (typically NGN 50,000-100,000)
- Processing through the NIS Citizenship and Business Department

PROCESS AND TIMELINE

1. Contact the NIS Citizenship and Business Department or the nearest Nigerian embassy.
2. Submit the restoration application with supporting documents.
3. Interview/verification process.
4. Processing: 3-6 months (can be longer in practice).
5. If approved, you receive a certificate of restoration of citizenship.
6. Apply for or renew your Nigerian passport using the standard process.

TIPS

- In practice, most Nigerians abroad hold both citizenships without formally applying for restoration, as enforcement of the renunciation provision is extremely rare.
- When entering Nigeria on a foreign passport, you may be asked to show a Nigerian passport or evidence of Nigerian origin. Carrying both passports is advisable.
- Nigerian dual citizens should be aware that Nigerian law applies to them while on Nigerian soil, regardless of other citizenships.
- The Nigerian Diaspora Commission (NiDCOM) was established in 2017 to coordinate with Nigerians abroad and can provide guidance on dual citizenship matters.
- Children born abroad to Nigerian parents are Nigerian citizens by descent and are entitled to Nigerian passports.`,
        sources: [
          { label: "Nigeria Immigration Service", url: "https://immigration.gov.ng/" },
          { label: "NiDCOM", url: "https://nidcom.gov.ng/" },
        ],
      },
      {
        title: "ECOWAS Free Movement Rights",
        summary: "Nigerian passport holders can move freely within all 15 ECOWAS states for up to 90 days without a visa \u2014 covering Ghana, Senegal, C\u00F4te d'Ivoire, and more.",
        tags: ["ECOWAS", "West Africa", "Visa-Free"],
        readTime: "3 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

All citizens of ECOWAS (Economic Community of West African States) member states have the right to enter, reside, and establish businesses in any other ECOWAS member state. The 15 member states are: Benin, Burkina Faso, Cabo Verde, Cote d'Ivoire, The Gambia, Ghana, Guinea, Guinea-Bissau, Liberia, Mali, Niger, Nigeria, Senegal, Sierra Leone, and Togo. The right is guaranteed by the ECOWAS Protocol on Free Movement of Persons (1979).

REQUIREMENTS

- Valid ECOWAS travel document: Nigerian passport, ECOWAS travel certificate, or national ID card
- International Certificate of Vaccination (yellow card) with valid Yellow Fever vaccination -- mandatory for entry to most ECOWAS states
- No visa required for stays of up to 90 days in any ECOWAS member state
- For stays beyond 90 days, you must register with the immigration authorities of the host country and may need a residence permit
- Right of Establishment (for business): requires compliance with the host country's business registration laws

PROCESS AND TIMELINE

1. Travel to any ECOWAS member state with your valid Nigerian passport and vaccination card.
2. At the border or airport, present your passport for stamping. No visa fee is charged.
3. You are granted up to 90 days of stay.
4. For stays beyond 90 days: register with local immigration authorities within the first 90 days.
5. For residence and work: apply for a residence permit through the host country's immigration service. Fees and processing vary by country.
6. The right to work and establish businesses is guaranteed but implementation varies in practice.

TIPS

- Despite the legal framework, some border posts may request informal payments. Know your rights under the ECOWAS protocol and carry a printed copy if possible.
- Ghana and Cote d'Ivoire are the most common ECOWAS destinations for Nigerians, with established diaspora communities and business networks.
- The ECOWAS biometric ID card is being rolled out to further facilitate free movement; Nigeria has been issuing the national e-ID card which is compatible.
- Transit between ECOWAS states by road is common, especially in West Africa. Major corridor routes include Lagos-Accra, Lagos-Cotonou, and Abuja-Niamey.
- Some ECOWAS states (Mali, Niger, Burkina Faso) have security concerns; check travel advisories before traveling.`,
        sources: [
          { label: "ECOWAS Commission", url: "https://ecowas.int/" },
          { label: "ECOWAS Free Movement Protocol", url: "https://ecowas.int/ecowas-protocols/" },
        ],
      },
      {
        title: "CERPAC \u2014 Long-Term Residence in Nigeria",
        summary: "Foreigners residing long-term in Nigeria need a Combined Expatriate Residence Permit and Aliens Card. Apply within 90 days of arrival. Valid 1\u20132 years, renewable.",
        tags: ["Nigeria Entry", "Permit", "Expat"],
        readTime: "4 min",
        lastUpdated: "March 2026",
        content: `ELIGIBILITY

All foreign nationals intending to reside in Nigeria for more than 90 days must obtain a CERPAC (Combined Expatriate Residence Permit and Aliens Card). This applies to employees, business owners, dependents, diplomats' household staff, and anyone on a long-term stay. Exemptions exist for certain diplomatic personnel and ECOWAS nationals on short stays.

REQUIREMENTS

- Valid passport with a Nigerian visa (Subject to Regularization (STR), Temporary Work Permit (TWP), or Business visa)
- Employer's letter of application to the Comptroller General of Immigration
- Form IMM 22 (for expatriate quota positions) or evidence of business registration
- Company's certificate of incorporation and Expatriate Quota approval (for employment)
- Two passport photographs
- CERPAC fee: USD $2,000 for a 2-year card (Green Card category for expatriate workers) or USD $1,000 for a 1-year card (other categories)
- Biometrics capture at designated NIS offices

PROCESS AND TIMELINE

1. Employer or sponsor files an application with the NIS.
2. Submit all required documents and pay the fee.
3. Attend biometrics capture at a designated NIS office.
4. Processing: 2-6 weeks.
5. CERPAC card issued, valid for 1-2 years depending on the category.
6. Renewal must be filed before expiry; late renewal incurs penalties.

TIPS

- The CERPAC must be carried at all times as proof of legal residence in Nigeria.
- Failure to obtain a CERPAC within 90 days of arrival is an offense that can result in fines or deportation.
- The Expatriate Quota (EQ) is a separate approval that employers must obtain from the Ministry of Interior to hire foreign workers. The EQ specifies the number and positions for which foreigners can be employed.
- Dependents of CERPAC holders (spouse and children) must each obtain their own CERPAC at the standard fee.
- Nigeria also offers Permanent Residence for foreigners who have lived in Nigeria for at least 15 continuous years and meet other criteria, though this is rarely granted in practice.`,
        sources: [
          { label: "Nigeria Immigration Service", url: "https://immigration.gov.ng/" },
          { label: "NIS CERPAC Portal", url: "https://portal.immigration.gov.ng/" },
        ],
      },
    ],
  },
  {
    id: "br",
    title: "Brazil",
    flag: "\u{1F1E7}\u{1F1F7}",
    category: "Latin America",
    articles: [
      {
        title: "Work Visa (VITEM V) and Residence Permit",
        summary: "Sponsored work visa for foreign professionals, requires Ministry of Justice authorization. Path to permanent residence after 4 years.",
        tags: ["Work", "Employer Sponsored", "Residence"],
        readTime: "5 min",
        lastUpdated: "May 2026",
        content: `ELIGIBILITY

Brazilian employer must obtain prior work authorization from the Ministry of Justice and Public Security. Applicant typically needs a university degree plus 2 years of professional experience, OR 9+ years of professional experience in the role, OR a postgraduate qualification.

REQUIREMENTS

- Valid passport (6+ months remaining)
- Employment contract with Brazilian-registered company
- Notarized degree certificates with apostille
- Police clearance from country of residence (apostilled)
- Birth certificate (apostilled)
- Health insurance valid in Brazil
- Filing fee: USD ~$290

PROCESS AND TIMELINE

1. Brazilian employer applies for work authorization through SISMIGRA portal.
2. Once authorized (typically 30-60 days), Ministry of Justice publishes approval in the Federal Gazette.
3. Applicant schedules visa interview at nearest Brazilian consulate.
4. After visa issuance, applicant has 90 days to enter Brazil.
5. Within 90 days of entry, register at the Federal Police to obtain CRNM (Migration Registration Card).

TIPS

- After 4 years on a VITEM V, you may apply for permanent residence (Residência Permanente).
- Spouses of work visa holders can apply for VITEM XI dependent visa with work authorization.
- Brazil also offers a Digital Nomad Visa (since 2022) for remote workers earning USD $1,500+/month, valid 1 year and renewable.
- Investor route: USD $148,000+ investment in a Brazilian business qualifies for VITEM XIV residence.`,
        sources: [
          { label: "Brazilian Ministry of Justice (Migration)", url: "https://www.gov.br/mj/pt-br/assuntos/seus-direitos/migracoes" },
          { label: "Federal Police Migration", url: "https://www.gov.br/pf/pt-br/assuntos/imigracao" },
        ],
      },
      {
        title: "Digital Nomad Visa (VITEM XIV)",
        summary: "1-year visa for remote workers earning USD $1,500+/month from foreign employers. Renewable once for a total of 2 years.",
        tags: ["Remote Work", "Digital Nomad"],
        readTime: "3 min",
        lastUpdated: "May 2026",
        content: `ELIGIBILITY

Available to foreigners who work remotely for an employer located outside Brazil, or who run their own business serving non-Brazilian clients. Cannot work for a Brazilian employer on this visa.

REQUIREMENTS

- Proof of remote work arrangement (employment contract or business documents)
- Minimum income USD $1,500/month OR USD $18,000 in available bank funds
- International health insurance covering the entire stay
- Clean criminal record
- Valid passport with 6+ months remaining
- Filing fee: USD ~$100

PROCESS

1. Apply at Brazilian consulate in your home country with all supporting documents.
2. Visa typically issued in 2-4 weeks.
3. Enter Brazil within validity period (usually 1 year).
4. Register with Federal Police within 90 days of arrival.
5. Renew once for an additional 12 months by demonstrating continued income.

TIPS

- Brazil has tax residency rules: stay 183+ days in 12 months and you may become a Brazilian tax resident.
- The visa does not lead to permanent residence directly, but you can switch to a residence permit if eligibility changes.`,
        sources: [
          { label: "CNIG Resolution 45/2021 (Digital Nomad)", url: "https://www.in.gov.br/en/web/dou/-/resolucao-normativa-cnig-mj-n-45-de-9-de-setembro-de-2021-344277835" },
        ],
      },
    ],
  },
  {
    id: "mx",
    title: "Mexico",
    flag: "\u{1F1F2}\u{1F1FD}",
    category: "Latin America",
    articles: [
      {
        title: "Temporary Resident Visa",
        summary: "1-year initially, renewable up to 4 years. Path to permanent residence. Multiple qualifying routes including income, family, and work.",
        tags: ["Residence", "Long-term"],
        readTime: "5 min",
        lastUpdated: "May 2026",
        content: `ELIGIBILITY ROUTES

1. Economic solvency: Monthly income equivalent to 300x daily minimum wage (about USD $2,700/month) for the past 6 months, OR savings of about USD $44,000.
2. Family ties: Spouse, child, or parent of a Mexican citizen or permanent resident.
3. Work offer: Mexican employer with INM-registered Constancia de Empleador.
4. Investment: Real estate worth ~USD $400,000 OR business investment ~USD $200,000.

REQUIREMENTS

- Valid passport
- Bank statements (last 6 or 12 months depending on route)
- Birth/marriage certificates (apostilled and translated)
- Photos meeting Mexican passport-photo specifications
- Filing fee: MXN ~$4,920 (USD ~$280) for the visa
- Resident card fee after entry: MXN ~$5,200

PROCESS AND TIMELINE

1. Apply at Mexican consulate abroad — DO NOT enter Mexico as a tourist if you intend to apply for residency.
2. Initial visa issued in 4-6 weeks, valid for 6 months as a single-entry travel document.
3. Enter Mexico, then within 30 days visit the local INM office to exchange the visa for a Temporary Resident card.
4. Card initially valid 1 year, renewable for 1, 2, or 3 years cumulatively.
5. After 4 years on Temporary Resident status, apply for Permanent Resident.

TIPS

- Income thresholds change yearly with the minimum-wage adjustment — check INM and your consulate for current numbers.
- Marriage to a Mexican citizen accelerates the path: 2 years of Temporary Residence in Mexico, then Permanent Resident.
- After 5 years of legal residence, you become eligible for Mexican citizenship by naturalization.`,
        sources: [
          { label: "Instituto Nacional de Migración", url: "https://www.gob.mx/inm" },
          { label: "Mexican Consulate Visa Info", url: "https://www.gob.mx/sre/acciones-y-programas/temporary-resident-visa" },
        ],
      },
    ],
  },
  {
    id: "kr",
    title: "South Korea",
    flag: "\u{1F1F0}\u{1F1F7}",
    category: "East Asia",
    articles: [
      {
        title: "E-7 Special Occupation Work Visa",
        summary: "For skilled foreign professionals in 87 designated occupations. Annual quota with point-based selection. Path to F-2 long-term residence after 3 years.",
        tags: ["Work", "Skilled"],
        readTime: "5 min",
        lastUpdated: "May 2026",
        content: `ELIGIBILITY

Must hold a job offer in one of 87 occupations on Korea's E-7 list (engineering, IT, science, design, certain trades). Bachelor's degree + 1 year experience, OR 5 years experience without degree, OR Korean university graduate with relevant degree.

REQUIREMENTS

- Job offer with annual salary at least 80% of Korean GNI per capita (~KRW 33 million / USD $25,000 minimum, varies by year)
- University degree (apostilled), professional certifications, employment history
- Korean employer must register the position with HOMETAX and obtain immigration approval
- Filing fee: KRW 130,000 (USD ~$100) for visa issuance

PROCESS AND TIMELINE

1. Korean employer applies for Confirmation of Visa Issuance (사증발급인정서) with the Korea Immigration Service.
2. Once approved (2-4 weeks), applicant submits visa application at Korean consulate abroad.
3. Visa issued within 1-2 weeks.
4. Enter Korea, then within 90 days apply for Alien Registration Card (ARC) at local immigration office.
5. E-7 initially valid 1-3 years, renewable.

TIPS

- E-7-4 (Skilled Worker) is a separate sub-category for production workers — easier requirements but quota-limited.
- After 3 years on E-7, you may apply for F-2 (Resident) visa under the points system; after 5 years on F-2, F-5 (Permanent Resident) becomes available.
- TOPIK (Korean language test) Level 3+ significantly boosts F-2 application points.`,
        sources: [
          { label: "Korea Immigration Service (HiKorea)", url: "https://www.hikorea.go.kr/" },
          { label: "Korea Visa Portal", url: "https://www.visa.go.kr/" },
        ],
      },
      {
        title: "D-2 Student & D-4 Language Training Visas",
        summary: "Study at Korean university (D-2) or attend a Korean-language program (D-4). Both allow part-time work after 6 months and lead to D-10 job-seeker after graduation.",
        tags: ["Student", "Language"],
        readTime: "4 min",
        lastUpdated: "May 2026",
        content: `D-2 ELIGIBILITY

Admission letter from a Korean university (bachelor's, master's, doctoral, or research program). Proof of financial support: minimum USD $20,000 in bank balance OR scholarship documentation.

D-4 ELIGIBILITY

Enrolled in a 6+ month full-time Korean language program at a recognized institution (typically a university-affiliated language center).

REQUIREMENTS (BOTH)

- Standardized Admission Letter from the Korean institution
- Bank statement showing minimum financial support
- Tuberculosis test (mandatory for many nationalities including Nigeria, Pakistan, Vietnam, Philippines)
- Visa fee: KRW 100,000 (USD ~$75)

PROCESS AND TIMELINE

1. Receive Admission Letter from Korean institution.
2. Apply at Korean consulate in home country (4-6 weeks processing typical).
3. Enter Korea, register with local immigration within 90 days for ARC.
4. Visa renewed annually based on enrollment.

WORK PERMISSIONS

- After 6 months in Korea, D-2 and D-4 holders can apply for permission to work part-time (up to 25 hours/week during semester, unlimited during breaks).
- Required: Korean language proficiency (TOPIK 2+ for D-2, TOPIK 3+ for D-4 work permission).

POST-GRADUATION

- D-10 (Job-Seeker) visa allows 6 months to find employment, extendable to 2 years total.
- Switch to E-7 once employed; advanced-degree holders may qualify for F-2-7 points-based residency.`,
        sources: [
          { label: "Study in Korea (Government)", url: "https://www.studyinkorea.go.kr/" },
          { label: "Korea Visa Portal — Student", url: "https://www.visa.go.kr/" },
        ],
      },
    ],
  },
  {
    id: "sa",
    title: "Saudi Arabia",
    flag: "\u{1F1F8}\u{1F1E6}",
    category: "Middle East",
    articles: [
      {
        title: "Premium Residency (Saudi Green Card)",
        summary: "Long-term residence for foreign investors and skilled professionals without local sponsor. Two tiers: lifetime (one-time SAR 800,000) and renewable annual (SAR 100,000/year).",
        tags: ["Permanent Residence", "Investor"],
        readTime: "5 min",
        lastUpdated: "May 2026",
        content: `ELIGIBILITY

Open to applicants 21+ with clean criminal record, proof of financial solvency, and either:
- Substantial business activity or investment in Saudi Arabia
- Highly specialized skills (Talent route — engineers, doctors, scientists, artists)
- Real estate ownership in the Kingdom (Real Estate Owner route)
- Distinguished entrepreneurs (Special Talent route)
- Direct relatives of Saudi nationals (Family route)

CATEGORIES (2024 EXPANSION)

1. Permanent (Lifetime): One-time fee of SAR 800,000 (USD ~$213,000)
2. Renewable Annual: SAR 100,000 (USD ~$26,600) per year
3. Special Talent: Free or reduced fee for Saudi-recognized world-class talent
4. Real Estate Owner: Tied to ownership of property worth SAR 4 million+
5. Entrepreneur: Tied to recognized startup activity
6. Distinguished Talent: Specialized expertise and Ministry endorsement
7. Investor: Active business investment SAR 7 million+

KEY BENEFITS

- No Saudi sponsor (kafeel) required — applicant becomes their own sponsor
- Right to own property and businesses outright
- Right to recruit foreign workers
- Family residency for spouse and children under 25
- Free movement in/out of Kingdom
- Access to government services and certain benefits

REQUIREMENTS

- Valid passport (12+ months)
- Medical fitness certificate
- Police clearance from country of residence
- Proof of financial means (bank statements, investment portfolio)
- Health insurance for self and family

PROCESS AND TIMELINE

1. Apply through Premium Residency Center portal (PRC.GOV.SA).
2. Submit documents and pay application processing fee.
3. Review takes 6-12 weeks for standard categories.
4. If approved, pay residency fee (SAR 100,000 or SAR 800,000 depending on tier).
5. Premium Residency Card issued; biometric registration in Riyadh.

TIPS

- Premium Residency does NOT lead to Saudi citizenship — naturalization remains rare and discretionary.
- Distinguished Talent and Special Talent routes have lower or zero financial thresholds — worth exploring if you have specialized credentials.
- Spouses and children under 25 are included in the same application.`,
        sources: [
          { label: "Premium Residency Center (Official)", url: "https://prc.gov.sa/en" },
          { label: "Saudi Vision 2030 — Premium Residency", url: "https://www.vision2030.gov.sa/" },
        ],
      },
    ],
  },
  {
    id: "in",
    title: "India",
    flag: "\u{1F1EE}\u{1F1F3}",
    category: "South Asia",
    articles: [
      {
        title: "Employment Visa for Foreigners",
        summary: "For skilled foreign professionals employed by Indian companies. Minimum salary USD $25,000/year. Valid up to 5 years, renewable in India.",
        tags: ["Work", "Employer Sponsored"],
        readTime: "5 min",
        lastUpdated: "May 2026",
        content: `ELIGIBILITY

Foreign nationals coming to India for employment with an Indian company at a senior or skilled level. Minimum gross annual salary USD $25,000 (waivers possible for certain roles such as language teachers, ethnic chefs, and translators).

REQUIREMENTS

- Employment contract with Indian-registered company
- Salary at least USD $25,000/year (waivers for specific categories)
- Educational qualifications and professional credentials
- Employer's business registration documents
- Police clearance from country of residence
- Filing fee: varies by nationality (USD ~$200 typical)

PROCESS AND TIMELINE

1. Receive employment offer from Indian company.
2. Apply at Indian Mission in country of residence using the Indian Visa Online portal.
3. Submit biometrics and supporting documents at the relevant Visa Application Center (VFS Global in most countries).
4. Standard processing: 3-8 weeks.
5. After arrival in India, register with FRRO (Foreigners Regional Registration Office) within 14 days if stay exceeds 180 days.

KEY CONDITIONS

- Visa is tied to the specific employer; changing jobs requires fresh visa application.
- Spouses and dependent children can apply for X (Entry) visa for the duration of the employment visa.
- Employment visa is NOT issued for jobs that can be filled by Indian nationals (clerical, secretarial, semi-skilled labor).

EXTENSION AND RENEWAL

- Initial visa typically issued for the contract duration up to 5 years.
- Renewable in India through the FRRO; do not need to leave the country to renew.
- Continuous residence on employment visa can support eventual application for Permanent Residency Status (PRS) under specific high-investment criteria.`,
        sources: [
          { label: "Indian Visa Online (Government)", url: "https://indianvisaonline.gov.in/" },
          { label: "Bureau of Immigration India (FRRO)", url: "https://indianfrro.gov.in/" },
        ],
      },
      {
        title: "OCI (Overseas Citizen of India) Card",
        summary: "Lifetime visa for foreign nationals of Indian origin and their spouses. Functions like permanent residency for diaspora — no need to apply for visas to visit India.",
        tags: ["Diaspora", "PIO", "Long-term"],
        readTime: "4 min",
        lastUpdated: "May 2026",
        content: `ELIGIBILITY

- Foreign nationals who were Indian citizens at any time after January 26, 1950
- Foreign nationals descended (up to 4 generations) from someone who was an Indian citizen
- Spouses of Indian citizens or existing OCI cardholders (married 2+ years)

EXCLUSIONS

- Citizens or former citizens of Pakistan and Bangladesh are not eligible
- Persons with criminal records may be denied

REQUIREMENTS

- Proof of Indian origin (parent, grandparent, or great-grandparent's Indian passport, birth certificate, or domicile certificate)
- Foreign passport (valid 6+ months)
- Marriage certificate (for spouse applicants)
- Photos meeting OCI specifications
- Application fee: USD ~$275 (lower for renewals after age 20 and after age 50)

PROCESS AND TIMELINE

1. Apply online via OCI portal (https://ociservices.gov.in).
2. Print application and submit at Indian Mission/VFS along with original documents.
3. Processing: 8-12 weeks typical, can be faster.
4. Document verification at Mission, then printed in India and shipped back.

KEY BENEFITS

- Lifetime multiple-entry visa to India
- Parity with Non-Resident Indians (NRIs) for most economic, financial, and educational matters (except agricultural land ownership and government employment)
- No requirement to register with FRRO regardless of length of stay
- Eligibility to apply for Indian citizenship after spending 12 months in India in qualifying conditions

IMPORTANT NOTES

- OCI is NOT dual citizenship — you remain a foreign national.
- OCI must be re-issued after every passport renewal (free first time, fees thereafter).
- Cancelled if holder takes up employment in Pakistan/Bangladesh, or for certain offences.`,
        sources: [
          { label: "OCI Services Portal", url: "https://ociservices.gov.in/" },
          { label: "Ministry of Home Affairs — OCI", url: "https://www.mha.gov.in/MHA1/Par2017/pdfs/par2018-pdfs/ls-21082018-eng/2105.pdf" },
        ],
      },
    ],
  },
];
