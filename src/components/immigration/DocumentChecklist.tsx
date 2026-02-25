"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DocumentChecklistProps {
  onClose: () => void;
}

type VisaType =
  | "us-h1b"
  | "us-eb"
  | "ca-express"
  | "ca-study"
  | "uk-skilled"
  | "uk-student"
  | "de-blucard"
  | "au-189"
  | "au-482"
  | "uae-employment"
  | "jp-engineer"
  | "eu-spouse"
  | "asylum";

interface DocItem {
  name: string;
  required: boolean;
  tooltip: string;
}

interface VisaChecklist {
  label: string;
  flag: string;
  description: string;
  documents: DocItem[];
}

const CHECKLISTS: Record<VisaType, VisaChecklist> = {
  "us-h1b": {
    label: "US H-1B Work Visa",
    flag: "🇺🇸",
    description: "For specialty occupation workers with a bachelor's degree or higher. Employer files on your behalf.",
    documents: [
      { name: "Valid passport (6+ months validity)", required: true, tooltip: "Must be valid for at least 6 months beyond your intended stay." },
      { name: "Form I-129 (employer files)", required: true, tooltip: "Your employer files this petition on your behalf — you cannot file it yourself." },
      { name: "Labor Condition Application (LCA)", required: true, tooltip: "Employer must get this approved from the Department of Labor first." },
      { name: "Degree certificates + official transcripts", required: true, tooltip: "Foreign degrees may need a NACES-approved evaluation (e.g., WES, ECE)." },
      { name: "Employment offer letter", required: true, tooltip: "Must specify job title, salary, start date, and work location." },
      { name: "Form DS-160 (online visa application)", required: true, tooltip: "Complete online at ceac.state.gov before your consular appointment." },
      { name: "SEVIS fee receipt (if applicable)", required: false, tooltip: "Required for certain H-1B3 categories. Confirm with your employer." },
      { name: "Resume / CV", required: false, tooltip: "Shows your work history and qualifications to support the petition." },
    ],
  },
  "us-eb": {
    label: "US EB-2/EB-3 Green Card",
    flag: "🇺🇸",
    description: "Employment-based permanent residence for professionals and skilled workers.",
    documents: [
      { name: "Valid passport", required: true, tooltip: "Must remain valid throughout the entire process." },
      { name: "PERM labor certification (employer)", required: true, tooltip: "Employer proves no qualified US workers are available. Takes 6–18 months from DOL." },
      { name: "Form I-140 petition", required: true, tooltip: "Employer files this to classify you as an immigrant worker." },
      { name: "Form I-485 or immigrant visa application", required: true, tooltip: "File I-485 if in the US; complete consular processing if abroad." },
      { name: "Birth certificate with certified translation", required: true, tooltip: "Official government birth certificate. Must be translated by certified translator." },
      { name: "Police clearance certificates", required: true, tooltip: "Required from every country you've lived in for 6+ months since age 16." },
      { name: "Medical examination (Form I-693)", required: true, tooltip: "Done by a USCIS-designated civil surgeon. Valid for 2 years." },
      { name: "Tax returns (last 3 years)", required: false, tooltip: "Shows financial history and tax compliance." },
    ],
  },
  "ca-express": {
    label: "Canada Express Entry",
    flag: "🇨🇦",
    description: "Points-based permanent residence for skilled workers. Average 6-month processing from ITA.",
    documents: [
      { name: "Valid passport (all pages)", required: true, tooltip: "Include all pages of current and expired passports within the last 10 years." },
      { name: "Educational Credential Assessment (ECA)", required: true, tooltip: "WES, ICAS, or other approved organization. Takes 5–20 business days." },
      { name: "IELTS/CELPIP language test results", required: true, tooltip: "Must be within 2 years. Minimum CLB 7 recommended for FSW." },
      { name: "Proof of work experience (reference letters)", required: true, tooltip: "Letters, pay stubs, tax records for at least 1 year of skilled work at NOC 0/A/B." },
      { name: "Police clearance from each country of residence", required: true, tooltip: "Required for all countries you've lived in for 6+ months since age 18." },
      { name: "Medical examination (IRCC panel physician)", required: true, tooltip: "Done by an IRCC-approved panel physician. Valid for 12 months." },
      { name: "Proof of funds (settlement funds)", required: true, tooltip: "Single applicant: minimum CAD $13,757. No employer job offer required if you have enough funds." },
      { name: "Birth certificate for all family members", required: true, tooltip: "Required for you and all accompanying dependants." },
    ],
  },
  "ca-study": {
    label: "Canada Study Permit",
    flag: "🇨🇦",
    description: "Study at a Canadian Designated Learning Institution (DLI). Post-Graduation Work Permit available after.",
    documents: [
      { name: "Acceptance letter from a DLI", required: true, tooltip: "Must be a Designated Learning Institution. Check Canada's official DLI list." },
      { name: "Valid passport", required: true, tooltip: "Must cover your entire intended period of study." },
      { name: "Proof of financial support", required: true, tooltip: "Show tuition + CAD $10,000/year for living expenses. Bank statements, scholarship letters." },
      { name: "Immigration medical exam", required: false, tooltip: "Required if you're from certain countries or studying in healthcare. Check IRCC's list." },
      { name: "Biometrics (fingerprints + photo)", required: true, tooltip: "Required for most nationalities. Book at a VAC or IRCC office." },
      { name: "Statement of purpose / study plan", required: true, tooltip: "Explain why you chose Canada, your program, and career plans." },
      { name: "Proof of ties to home country", required: false, tooltip: "Shows intent to return: property, family, job offer, etc. Strengthens your application." },
      { name: "Language test results (if required)", required: false, tooltip: "Some programs require IELTS/TOEFL. Check your school's admission requirements." },
    ],
  },
  "uk-skilled": {
    label: "UK Skilled Worker Visa",
    flag: "🇬🇧",
    description: "For people with a skilled job offer from a UK-licensed sponsor employer.",
    documents: [
      { name: "Certificate of Sponsorship (from employer)", required: true, tooltip: "Your employer must be a licensed UK sponsor. You'll receive a reference number." },
      { name: "Valid passport or travel document", required: true, tooltip: "Must be valid for your entire planned stay plus 6 months." },
      { name: "English language proof", required: true, tooltip: "IELTS B1+, degree from English-speaking country, or listed nationality exempt." },
      { name: "Bank statements (28+ consecutive days with £1,270)", required: true, tooltip: "Must show at least £1,270 in the same account for 28 days before applying." },
      { name: "Criminal record certificate", required: false, tooltip: "Required for roles involving vulnerable people or for certain visa categories." },
      { name: "Tuberculosis test results", required: false, tooltip: "Required if applying from countries including Nigeria, Ghana, Kenya, India, Pakistan." },
      { name: "Marriage/civil partnership certificate", required: false, tooltip: "Required if bringing a spouse or partner as a dependent." },
    ],
  },
  "uk-student": {
    label: "UK Student Visa",
    flag: "🇬🇧",
    description: "Study at a UK Higher Education Provider. Graduate Visa allows 2–3 years of work after.",
    documents: [
      { name: "Confirmation of Acceptance for Studies (CAS)", required: true, tooltip: "Issued by your UK university or college. Contains a reference number for your visa application." },
      { name: "Valid passport", required: true, tooltip: "Must cover your entire study period." },
      { name: "Proof of finances", required: true, tooltip: "Show tuition + £1,334/month (London) or £1,023/month (elsewhere) for 9 months." },
      { name: "English language certificate (B2+)", required: true, tooltip: "IELTS Academic score usually 6.0–6.5+. Check your university's specific requirement." },
      { name: "Academic qualifications (transcripts, certificates)", required: true, tooltip: "Official transcripts for your previous education. May need translation and verification." },
      { name: "Tuberculosis test results", required: false, tooltip: "Required for applicants from certain countries. Check the UK government's listed countries." },
      { name: "ATAS certificate (if required)", required: false, tooltip: "Academic Technology Approval Scheme — required for certain subjects (physics, engineering, etc.) for nationals of specific countries." },
      { name: "Parental consent (if under 18)", required: false, tooltip: "Written permission from parents for students under 18, plus details of their care arrangements in the UK." },
    ],
  },
  "de-blucard": {
    label: "Germany EU Blue Card",
    flag: "🇩🇪",
    description: "For highly qualified non-EU workers with a university degree. Fastest path to German permanent residence.",
    documents: [
      { name: "Valid passport", required: true, tooltip: "Must be valid for the duration of your planned stay." },
      { name: "University degree certificate + recognition proof", required: true, tooltip: "Foreign degrees must be recognized by anabin.kmk.org or you need a statement of comparability from KMK." },
      { name: "Job offer / employment contract", required: true, tooltip: "Must meet minimum salary threshold: ~€43,800 general / ~€34,100 for shortage occupations (IT, engineering, medicine)." },
      { name: "Curriculum Vitae (CV)", required: true, tooltip: "German employers expect a professional tabular CV (Lebenslauf) with a photo." },
      { name: "Health insurance proof", required: true, tooltip: "Public (GKV) or private (PKV) health insurance. Must be valid from day of entry." },
      { name: "Biometric passport photos", required: true, tooltip: "Usually 2 passport-format photos per application." },
      { name: "Rental contract or accommodation proof", required: true, tooltip: "Required when registering at the Einwohnermeldeamt (residents' registration office)." },
      { name: "German language skills proof (B1+)", required: false, tooltip: "B1 German speeds up your path to Niederlassungserlaubnis (permanent residence) from 33 to 21 months." },
    ],
  },
  "au-189": {
    label: "Australia Skilled Independent (189)",
    flag: "🇦🇺",
    description: "Points-tested permanent visa. No sponsor needed. Must score 65+ points and have a skills assessment.",
    documents: [
      { name: "Valid passport", required: true, tooltip: "Must be valid at the time of application. Include previous passports if any." },
      { name: "Skills assessment from relevant authority", required: true, tooltip: "e.g., Engineers Australia, AHPRA (healthcare), VETASSESS, ACS (IT). Takes 4–16 weeks." },
      { name: "English language test (IELTS, PTE, TOEFL)", required: true, tooltip: "Competent English minimum (IELTS 6.0 each band). Superior English (7.0+) earns more points." },
      { name: "Expression of Interest (EOI) in SkillSelect", required: true, tooltip: "Submit your profile to the SkillSelect pool. You'll receive an ITA based on your points score." },
      { name: "Police clearance (all countries lived 12+ months)", required: true, tooltip: "From each country you've lived in for 12+ months since age 16." },
      { name: "Health examination (HAP ID)", required: true, tooltip: "Conducted by an IRCA-approved panel physician. Book via health.homeaffairs.gov.au." },
      { name: "Proof of work experience", required: true, tooltip: "Reference letters, payslips, statutory declarations for 3–8+ years of skilled work." },
      { name: "Trade qualification (if applicable)", required: false, tooltip: "For trade occupations: Trades Recognition Australia (TRA) assessment." },
    ],
  },
  "au-482": {
    label: "Australia TSS Visa (Subclass 482)",
    flag: "🇦🇺",
    description: "Temporary Skill Shortage visa. Employer-sponsored work visa for 2–4 years.",
    documents: [
      { name: "Sponsorship approval (employer files)", required: true, tooltip: "Your employer must be an approved sponsor. They file a sponsorship application first." },
      { name: "Nomination by your employer", required: true, tooltip: "Your employer nominates you for a specific position — must be on the relevant occupation list (MLTSSL or STSOL)." },
      { name: "Valid passport", required: true, tooltip: "Valid for your entire intended stay in Australia." },
      { name: "Skills assessment (for some occupations)", required: true, tooltip: "Required for MLTSSL occupations. Check with the relevant assessing authority." },
      { name: "English language test results", required: true, tooltip: "Competent English minimum unless exempt. IELTS 5.0 each band as minimum." },
      { name: "Qualifications and experience documents", required: true, tooltip: "Degree certificates, transcripts, and employment references matching your nominated occupation." },
      { name: "Health examination", required: true, tooltip: "Conducted by an IRCA-approved panel physician." },
      { name: "Police clearance", required: false, tooltip: "May be requested by the Department during processing." },
    ],
  },
  "uae-employment": {
    label: "UAE Employment Visa",
    flag: "🇦🇪",
    description: "Employer-sponsored work visa. Processed in 2–4 weeks. Linked to your employer and job.",
    documents: [
      { name: "Valid passport (6+ months validity)", required: true, tooltip: "The UAE requires 6 months validity beyond your intended stay." },
      { name: "Employment offer letter / contract", required: true, tooltip: "Signed and stamped offer letter from your UAE employer specifying role and salary." },
      { name: "Educational certificates (attested)", required: true, tooltip: "Degree certificates must be attested by your home country's Ministry of Education AND the UAE Embassy." },
      { name: "Passport-sized photos (white background)", required: true, tooltip: "Typically 2–4 recent color photos against a plain white background." },
      { name: "Medical fitness certificate", required: true, tooltip: "Full medical examination done in the UAE within 30 days of arrival, at a DHA/MOH-approved center." },
      { name: "Emirates ID registration", required: true, tooltip: "Biometric registration required within 30 days of entry. Done through ICP (Federal Authority for Identity)." },
      { name: "Work permit (employer applies first)", required: true, tooltip: "Employer applies for a work permit before you enter — you enter on a work entry visa." },
      { name: "Police clearance certificate", required: false, tooltip: "Required for some industries (finance, healthcare, security). Check with your employer." },
    ],
  },
  "jp-engineer": {
    label: "Japan Engineer / Specialist Visa",
    flag: "🇯🇵",
    description: "Most common work visa for foreign professionals in IT, engineering, finance, and humanities.",
    documents: [
      { name: "Valid passport", required: true, tooltip: "Must be valid throughout your intended stay. Bring all previous passports too." },
      { name: "Certificate of Eligibility (COE) from employer", required: true, tooltip: "Your Japanese employer applies for the COE from the Immigration Bureau. This is the key document." },
      { name: "University degree certificate", required: true, tooltip: "Or 10+ years of professional experience in the relevant field. Official certificate with translation." },
      { name: "Employment contract or offer letter", required: true, tooltip: "Specifying your position, duties, and salary. Helps confirm visa category eligibility." },
      { name: "Curriculum Vitae (CV)", required: true, tooltip: "Detailed CV showing relevant education and work experience." },
      { name: "Passport photos (4.5cm x 4.5cm)", required: true, tooltip: "White background, taken within the last 6 months." },
      { name: "Tax documents (if transferring within company)", required: false, tooltip: "For intracompany transferees: prior year tax records from the sending company." },
      { name: "Japanese language certificate (N3+)", required: false, tooltip: "Not required but earns additional points under HSP points system. JLPT N3 is minimum meaningful level." },
    ],
  },
  "eu-spouse": {
    label: "EU Family Reunification",
    flag: "🇪🇺",
    description: "Join an EU citizen or long-term resident spouse/family member in Europe.",
    documents: [
      { name: "Valid passport (2+ years remaining)", required: true, tooltip: "Must cover entire intended stay and have blank pages." },
      { name: "Marriage certificate (apostilled + translated)", required: true, tooltip: "Official original apostille, certified translation into the destination country's language." },
      { name: "Sponsor's proof of EU residence/citizenship", required: true, tooltip: "EU national ID, residence permit, or citizenship certificate of your sponsor." },
      { name: "Proof of family relationship", required: true, tooltip: "Birth certificates for children, DNA test results if relationship is disputed by authorities." },
      { name: "Sponsor's income proof (meets threshold)", required: true, tooltip: "Must meet minimum income: typically €1,000–€1,800/month net, varies by country and family size." },
      { name: "Health insurance (comprehensive)", required: true, tooltip: "Covers all family members. Cannot rely on emergency-only coverage for most applications." },
      { name: "Adequate housing proof", required: true, tooltip: "Rental contract, property deed, or employer-provided accommodation for the entire family." },
      { name: "Biometric passport photos", required: true, tooltip: "Usually 2–4 recent biometric photos per family member in passport format." },
    ],
  },
  "asylum": {
    label: "Asylum Application",
    flag: "🌍",
    description: "Protection for those fleeing persecution. Apply immediately upon arrival — even without documents.",
    documents: [
      { name: "Any ID or passport (even expired)", required: false, tooltip: "You can apply for asylum even without documents. Lack of ID will NOT disqualify you." },
      { name: "Written statement of persecution", required: true, tooltip: "Describe in detail the threats, harm, or persecution you faced. Be specific with dates, names, and events." },
      { name: "Evidence of persecution", required: false, tooltip: "News articles, medical records, police reports, photos, witness letters, human rights reports — anything relevant." },
      { name: "Evidence of country conditions", required: false, tooltip: "Reports from UNHCR, Amnesty International, or Human Rights Watch about your country of origin." },
      { name: "Membership proof (political/religious)", required: false, tooltip: "Party membership cards, church records, union cards, etc. if relevant to your claim." },
      { name: "Medical records (if applicable)", required: false, tooltip: "Documents injuries from persecution or trauma. Can significantly strengthen your claim." },
      { name: "Witness statements or affidavits", required: false, tooltip: "Signed statements from people who can verify your account of persecution." },
      { name: "Translation of documents (if not in local language)", required: false, tooltip: "Certified translations strengthen your case and may be required at interview." },
    ],
  },
};

export function DocumentChecklist({ onClose }: DocumentChecklistProps) {
  const [selected, setSelected] = useState<VisaType | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [tooltip, setTooltip] = useState<string | null>(null);

  const checklist = selected ? CHECKLISTS[selected] : null;
  const requiredDocs = checklist?.documents.filter((d) => d.required) ?? [];
  const optionalDocs = checklist?.documents.filter((d) => !d.required) ?? [];
  const totalRequired = requiredDocs.length;
  const checkedRequired = requiredDocs.filter((d) => checked[d.name]).length;
  const progress = totalRequired > 0 ? (checkedRequired / totalRequired) * 100 : 0;

  // Group checklists by region for easier navigation
  const groups: { label: string; keys: VisaType[] }[] = [
    { label: "🇺🇸 United States", keys: ["us-h1b", "us-eb"] },
    { label: "🇨🇦 Canada", keys: ["ca-express", "ca-study"] },
    { label: "🇬🇧 United Kingdom", keys: ["uk-skilled", "uk-student"] },
    { label: "🇩🇪 Germany", keys: ["de-blucard"] },
    { label: "🇦🇺 Australia", keys: ["au-189", "au-482"] },
    { label: "🇦🇪 UAE", keys: ["uae-employment"] },
    { label: "🇯🇵 Japan", keys: ["jp-engineer"] },
    { label: "🇪🇺 EU / Other", keys: ["eu-spouse", "asylum"] },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div className="absolute inset-0 bg-[#0F172A]/50 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Header */}
        <div className="bg-[#0F172A] px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-white font-black text-lg">Document Checklist</h2>
            <p className="text-[#64748B] text-sm">
              {checklist ? `${checklist.flag} ${checklist.label}` : "Select your visa type"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#1E293B] flex items-center justify-center text-[#64748B] hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        {checklist && (
          <div className="px-6 py-3 border-b border-[#E2E8F0] flex-shrink-0">
            <div className="flex justify-between text-xs text-[#64748B] mb-1.5">
              <span>Required documents collected</span>
              <span className="font-bold text-[#DC2626]">{checkedRequired}/{totalRequired}</span>
            </div>
            <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#DC2626] rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {!checklist ? (
              <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="text-[#64748B] text-sm mb-4 leading-relaxed">
                  Select your immigration pathway to get a personalized document checklist:
                </p>
                <div className="space-y-4">
                  {groups.map((group) => (
                    <div key={group.label}>
                      <p className="text-[#94A3B8] text-xs font-semibold uppercase tracking-wider mb-2">{group.label}</p>
                      <div className="space-y-2">
                        {group.keys.map((key) => {
                          const val = CHECKLISTS[key];
                          return (
                            <motion.button
                              key={key}
                              whileHover={{ x: 4 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => setSelected(key)}
                              className="w-full flex items-center gap-3 p-3.5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#DC2626] hover:bg-[#FEF2F2] text-left transition-all group"
                            >
                              <span className="text-xl">{val.flag}</span>
                              <div className="flex-1">
                                <p className="text-[#0F172A] font-semibold text-sm group-hover:text-[#DC2626] transition-colors">{val.label}</p>
                                <p className="text-[#94A3B8] text-xs mt-0.5">{val.documents.length} documents · {val.documents.filter(d => d.required).length} required</p>
                              </div>
                              <svg className="w-4 h-4 text-[#94A3B8] group-hover:text-[#DC2626]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                              </svg>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="checklist" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <p className="text-[#64748B] text-sm mb-4 leading-relaxed">{checklist.description}</p>

                {/* Required docs */}
                <div className="mb-5">
                  <h3 className="text-[#0F172A] font-bold text-sm mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                    Required Documents ({requiredDocs.length})
                  </h3>
                  <div className="space-y-2">
                    {requiredDocs.map((doc) => (
                      <div key={doc.name} className="flex items-start gap-3">
                        <button
                          onClick={() => setChecked((c) => ({ ...c, [doc.name]: !c[doc.name] }))}
                          className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-all ${
                            checked[doc.name]
                              ? "bg-[#DC2626] border-[#DC2626]"
                              : "border-[#CBD5E1] hover:border-[#DC2626]"
                          }`}
                        >
                          {checked[doc.name] && (
                            <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`text-sm ${checked[doc.name] ? "line-through text-[#94A3B8]" : "text-[#0F172A]"}`}>
                              {doc.name}
                            </span>
                            <button
                              onMouseEnter={() => setTooltip(doc.name)}
                              onMouseLeave={() => setTooltip(null)}
                              onClick={() => setTooltip(tooltip === doc.name ? null : doc.name)}
                              className="text-[#94A3B8] hover:text-[#64748B]"
                            >
                              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                <circle cx="12" cy="12" r="10" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4M12 8h.01" />
                              </svg>
                            </button>
                          </div>
                          <AnimatePresence>
                            {tooltip === doc.name && (
                              <motion.p
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="text-[#64748B] text-xs mt-1 leading-relaxed overflow-hidden"
                              >
                                {doc.tooltip}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optional docs */}
                {optionalDocs.length > 0 && (
                  <div>
                    <h3 className="text-[#0F172A] font-bold text-sm mb-2 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#94A3B8]" />
                      Supporting Documents ({optionalDocs.length})
                    </h3>
                    <div className="space-y-2">
                      {optionalDocs.map((doc) => (
                        <div key={doc.name} className="flex items-start gap-3">
                          <button
                            onClick={() => setChecked((c) => ({ ...c, [doc.name]: !c[doc.name] }))}
                            className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 border-2 transition-all ${
                              checked[doc.name]
                                ? "bg-[#64748B] border-[#64748B]"
                                : "border-[#CBD5E1] hover:border-[#64748B]"
                            }`}
                          >
                            {checked[doc.name] && (
                              <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm ${checked[doc.name] ? "line-through text-[#94A3B8]" : "text-[#334155]"}`}>
                                {doc.name}
                              </span>
                              <span className="text-[10px] text-[#94A3B8] border border-[#E2E8F0] px-1.5 py-0.5 rounded">optional</span>
                              <button
                                onMouseEnter={() => setTooltip(doc.name)}
                                onMouseLeave={() => setTooltip(null)}
                                onClick={() => setTooltip(tooltip === doc.name ? null : doc.name)}
                                className="text-[#94A3B8] hover:text-[#64748B]"
                              >
                                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                  <circle cx="12" cy="12" r="10" />
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-4M12 8h.01" />
                                </svg>
                              </button>
                            </div>
                            <AnimatePresence>
                              {tooltip === doc.name && (
                                <motion.p
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="text-[#64748B] text-xs mt-1 leading-relaxed overflow-hidden"
                                >
                                  {doc.tooltip}
                                </motion.p>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => { setSelected(null); setChecked({}); setTooltip(null); }}
                  className="mt-6 text-[#DC2626] text-sm font-semibold hover:underline flex items-center gap-1"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Change visa type
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
