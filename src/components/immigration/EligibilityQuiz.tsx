"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EligibilityQuizProps {
  onClose: () => void;
}

type Step = {
  id: string;
  question: string;
  tooltip?: string;
  options: { label: string; value: string }[];
};

const STEPS: Step[] = [
  {
    id: "destination",
    question: "Where do you want to immigrate?",
    tooltip: "Select your target country to see relevant immigration pathways and requirements.",
    options: [
      { label: "🇺🇸 United States", value: "us" },
      { label: "🇨🇦 Canada", value: "ca" },
      { label: "🇬🇧 United Kingdom", value: "uk" },
      { label: "🇩🇪 Germany / EU", value: "de" },
      { label: "🇦🇺 Australia", value: "au" },
      { label: "🇦🇪 UAE / Gulf States", value: "uae" },
      { label: "🇯🇵 Japan / South Korea", value: "jp" },
      { label: "🌎 Other / Not Sure", value: "other" },
    ],
  },
  {
    id: "purpose",
    question: "What is the purpose of your immigration?",
    tooltip: "Your purpose determines which visa category applies and what documents you need.",
    options: [
      { label: "💼 Work or Employment", value: "work" },
      { label: "🎓 Study / Education", value: "study" },
      { label: "👨‍👩‍👧 Family Reunification", value: "family" },
      { label: "🛡️ Asylum / Protection", value: "asylum" },
      { label: "💻 Remote Work / Digital Nomad", value: "nomad" },
      { label: "🏢 Business / Investment", value: "business" },
    ],
  },
  {
    id: "origin",
    question: "What is your region of origin?",
    tooltip: "Some countries have special visa agreements, faster processing, or restrictions based on nationality.",
    options: [
      { label: "🌍 West Africa (Nigeria, Ghana, Senegal…)", value: "west_africa" },
      { label: "🌍 East/Southern Africa (Kenya, Ethiopia, SA…)", value: "east_africa" },
      { label: "🌏 South Asia (India, Pakistan, Bangladesh…)", value: "south_asia" },
      { label: "🌏 Southeast Asia (Philippines, Indonesia…)", value: "se_asia" },
      { label: "🌎 Latin America (Mexico, Brazil, Colombia…)", value: "latam" },
      { label: "🌍 Middle East / North Africa", value: "mena" },
      { label: "🇪🇺 Eastern Europe / CIS", value: "east_europe" },
      { label: "Other / Prefer not to say", value: "other" },
    ],
  },
  {
    id: "status",
    question: "What is your current immigration status?",
    tooltip: "Your current status affects which pathways are available and how urgently you may need to act.",
    options: [
      { label: "📍 In my home country (not yet traveled)", value: "home" },
      { label: "🛂 Currently on tourist / visitor visa", value: "tourist" },
      { label: "🎓 On a student visa", value: "student" },
      { label: "💼 On a work visa", value: "work" },
      { label: "⚠️ Undocumented / status expired", value: "undocumented" },
      { label: "🔄 Permanent resident (seeking citizenship)", value: "pr" },
    ],
  },
];

type Answers = Record<string, string>;

function getRecommendation(answers: Answers): {
  title: string;
  description: string;
  steps: string[];
  urgency: "low" | "medium" | "high";
  resources: string[];
} {
  const { destination, purpose, status } = answers;

  if (purpose === "asylum") {
    return {
      title: "Asylum Application",
      description: "You may be eligible for asylum or refugee protection. This is time-critical — apply as soon as you arrive in your destination country.",
      steps: [
        "Submit asylum application immediately upon arrival (Form I-589 in US, equivalent elsewhere)",
        "Gather evidence of persecution: affidavits, medical records, news reports, police records",
        "Contact UNHCR, ILRC, or a local NGO immediately for free legal assistance",
        "Attend biometric appointment and asylum interview — bring an interpreter if needed",
        "Do NOT leave the country while your application is pending",
        "If rejected: explore appeals immediately — don't give up without legal help",
      ],
      urgency: "high",
      resources: ["UNHCR: unhcr.org", "ILRC: ilrc.org", "IRC: rescue.org"],
    };
  }

  if (purpose === "nomad") {
    const nomadDests: Record<string, string> = {
      de: "Germany's Freiberufler (freelancer) visa",
      uae: "UAE Freelance Permit via a free zone",
      other: "Portugal D8 visa, Colombia Migrant M visa, or Mexico Temporary Resident visa",
    };
    return {
      title: "Digital Nomad / Remote Work Visa",
      description: `Remote work visas are growing globally. ${nomadDests[destination] ?? "Several countries now offer dedicated remote work visas"} — most require proof of foreign-sourced income of $2,000–$5,000/month.`,
      steps: [
        "Confirm your employer or clients are foreign-based (most nomad visas require non-local income)",
        "Gather proof of income: bank statements, contracts, invoices — typically 3 months minimum",
        "Check tax implications: many countries tax world income after 183 days of residency",
        "Obtain health insurance valid in the destination country",
        "Apply at the nearest consulate or online where available",
        "Consider hiring a local immigration consultant for smoother processing",
      ],
      urgency: "low",
      resources: ["Nomad List: nomadlist.com"],
    };
  }

  if (purpose === "business") {
    return {
      title: "Investor / Business Visa",
      description: `Business immigration requires capital investment or an innovative startup. ${destination === "us" ? "EB-5 ($800K–$1.05M) or E-2 treaty investor visa" : destination === "ca" ? "Start-Up Visa or Investor stream" : destination === "uk" ? "Innovator Founder or Global Talent" : "Investor or entrepreneur visa"} may apply.`,
      steps: [
        "Determine your investment level and business structure",
        "Secure a business plan reviewed by a local accountant or lawyer",
        "Open a business bank account and demonstrate fund legitimacy (source-of-funds letter)",
        "File the business immigrant petition with the relevant authority",
        "Demonstrate the business will create local jobs or economic value",
        "Attend consular interview with full documentation",
      ],
      urgency: "medium",
      resources: ["USCIS: uscis.gov/working-in-the-united-states/business"],
    };
  }

  if (purpose === "family") {
    const dest = destination === "us" ? "the US"
      : destination === "ca" ? "Canada"
      : destination === "uk" ? "the UK"
      : destination === "de" ? "Germany"
      : destination === "au" ? "Australia"
      : destination === "uae" ? "the UAE"
      : "your destination country";
    return {
      title: "Family Reunification Visa",
      description: `Family-sponsored visas allow citizens or permanent residents to bring close family to ${dest}. Wait times range from weeks (UAE, UK) to years (US, for non-immediate relatives).`,
      steps: [
        "Your sponsor (family member who is citizen/PR) files the petition on your behalf",
        "Gather proof of relationship: marriage certificate, birth certificate (apostilled + translated)",
        "Wait for visa number availability if applicable (US: can take 1–20+ years for extended family)",
        "Complete the immigrant visa application and medical examination",
        "Attend consular interview — bring full supporting documentation",
        "Enter the country once the visa is approved",
      ],
      urgency: status === "undocumented" ? "high" : "medium",
      resources: ["USCIS: uscis.gov/family", "IRCC: canada.ca/family-reunification"],
    };
  }

  if (purpose === "study") {
    const studyInfo: Record<string, string> = {
      us: "F-1 Student Visa — apply at US consulate after receiving I-20 from your school. OPT (12–36 months) lets you work after graduation.",
      ca: "Canadian Study Permit — apply online via IRCC. Post-Graduation Work Permit (PGWP) up to 3 years after graduation.",
      uk: "UK Student Visa — need CAS from licensed sponsor. Graduate Route visa gives 2–3 years work rights post-study.",
      de: "Germany Student Visa — language skills (A2–B1 German or English-taught program). Blocked account (~€11,208) required.",
      au: "Australia Student Visa (500) — enrol with CRICOS-registered institution. 20hrs/week work during term, full-time during breaks.",
    };
    return {
      title: "Student Visa",
      description: studyInfo[destination] ?? "Student visas require an acceptance letter from an accredited institution. Most allow part-time work and have post-study work pathways.",
      steps: [
        "Apply and receive an official acceptance letter from your institution",
        "Pay any required pre-arrival fees (SEVIS $350 for US, blocked account for Germany)",
        "Complete the student visa application form online",
        "Attend a visa interview at the consulate (required for US; optional for some others)",
        "Show proof of financial support covering tuition + living expenses",
        "Maintain full-time enrollment — partial withdrawal may affect visa status",
      ],
      urgency: "low",
      resources: ["USCIS: uscis.gov/student", "IRCC: canada.ca/study-permit"],
    };
  }

  // Work visa fallback
  const workInfo: Record<string, string> = {
    us: "H-1B (specialty occupation, annual lottery), O-1 (extraordinary ability), EB-2/EB-3 (employment-based green card) may apply.",
    ca: "Express Entry is Canada's fastest PR path. PNP can top up your CRS score by 600 points.",
    uk: "Skilled Worker Visa requires a licensed employer sponsor. Salary threshold: £38,700 general / £30,960 new entrant.",
    de: "EU Blue Card requires a degree + job offer at ~€43,800/year. Job Seeker Visa lets you enter Germany first and find work.",
    au: "Skilled Independent (189), Skilled Nominated (190), or employer-sponsored TSS 482 visa depending on your occupation.",
    uae: "UAE Employment Visa is employer-sponsored and typically processed in 2–4 weeks. Tied to your employer.",
    jp: "Engineer/Specialist visa is most common. Japan HSP points visa offers fast-track PR (1 year at 80+ points).",
  };
  return {
    title: "Employment-Based Visa",
    description: workInfo[destination] ?? "Work visas typically require a job offer from a sponsoring employer. Points-based systems (Canada, Australia) also allow self-sponsorship.",
    steps: [
      "Secure a job offer from a qualifying employer in your target country",
      "Verify your employer holds the necessary sponsorship license",
      "Employer files the petition, labor certification, or sponsorship (varies by country)",
      "Gather academic credentials — may need foreign credential evaluation (WES for Canada, NARIC for UK)",
      "Attend consular interview in your home country with all supporting documents",
      "Enter the country with your approved work visa",
    ],
    urgency: status === "undocumented" ? "high" : "medium",
    resources: ["USCIS: uscis.gov/working", "IRCC: canada.ca/express-entry", "gov.uk/skilled-worker-visa"],
  };
}

export function EligibilityQuiz({ onClose }: EligibilityQuizProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [done, setDone] = useState(false);

  const currentStep = STEPS[step];

  const handleSelect = (value: string) => {
    const newAnswers = { ...answers, [currentStep.id]: value };
    setAnswers(newAnswers);

    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  };

  const recommendation = done ? getRecommendation(answers) : null;

  const urgencyColors = {
    high: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", badge: "bg-red-100 text-red-700" },
    medium: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-100 text-amber-700" },
    low: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", badge: "bg-green-100 text-green-700" },
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="absolute inset-0 bg-[#0F172A]/50 backdrop-blur-sm"
        onClick={onClose}
      />

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
            <h2 className="text-white font-black text-lg">Eligibility Check</h2>
            <p className="text-[#64748B] text-sm">
              {done ? "Your personalized pathway" : `Step ${step + 1} of ${STEPS.length}`}
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
        {!done && (
          <div className="h-1 bg-[#F1F5F9] flex-shrink-0">
            <motion.div
              className="h-full bg-[#DC2626]"
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {!done ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-5">
                  <h3 className="text-[#0F172A] font-bold text-xl">{currentStep.question}</h3>
                  {currentStep.tooltip && (
                    <p className="text-[#64748B] text-sm mt-1.5 leading-relaxed">{currentStep.tooltip}</p>
                  )}
                </div>

                <div className="space-y-2">
                  {currentStep.options.map((opt) => (
                    <motion.button
                      key={opt.value}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelect(opt.value)}
                      className="w-full flex items-center gap-4 p-3.5 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#DC2626] hover:bg-[#FEF2F2] text-left transition-all group"
                    >
                      <span className="text-[#0F172A] font-medium text-sm flex-1 group-hover:text-[#DC2626] transition-colors">
                        {opt.label}
                      </span>
                      <svg className="w-4 h-4 text-[#94A3B8] group-hover:text-[#DC2626] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.button>
                  ))}
                </div>

                {step > 0 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="mt-4 text-[#64748B] text-sm hover:text-[#0F172A] transition-colors flex items-center gap-1"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {recommendation && (
                  <>
                    <div className={`p-4 rounded-2xl border mb-5 ${urgencyColors[recommendation.urgency].bg} ${urgencyColors[recommendation.urgency].border}`}>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-[#0F172A] font-black text-lg">{recommendation.title}</h3>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${urgencyColors[recommendation.urgency].badge}`}>
                          {recommendation.urgency === "high" ? "Time Sensitive" : recommendation.urgency === "medium" ? "Moderate" : "Flexible"}
                        </span>
                      </div>
                      <p className="text-[#334155] text-sm leading-relaxed">{recommendation.description}</p>
                    </div>

                    <div className="mb-5">
                      <h4 className="text-[#0F172A] font-bold text-sm mb-3">Recommended Next Steps</h4>
                      <ol className="space-y-2.5">
                        {recommendation.steps.map((s, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.07 }}
                            className="flex items-start gap-3 text-sm text-[#334155]"
                          >
                            <span className="w-5 h-5 rounded-full bg-[#DC2626] text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            {s}
                          </motion.li>
                        ))}
                      </ol>
                    </div>

                    {recommendation.resources.length > 0 && (
                      <div className="mb-5">
                        <h4 className="text-[#0F172A] font-bold text-sm mb-2">Helpful Resources</h4>
                        <div className="flex flex-wrap gap-2">
                          {recommendation.resources.map((r) => (
                            <span key={r} className="text-xs text-[#64748B] bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-full">
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <p className="text-[#64748B] text-xs leading-relaxed">
                        <strong>Disclaimer:</strong> This assessment is for informational purposes only and is not legal advice. Requirements change frequently. Consult a licensed immigration attorney for your specific situation.
                      </p>
                    </div>

                    <div className="flex gap-3 mt-5">
                      <button
                        onClick={() => { setStep(0); setAnswers({}); setDone(false); }}
                        className="flex-1 py-2.5 rounded-xl border border-[#E2E8F0] text-[#64748B] text-sm font-semibold hover:border-[#DC2626] hover:text-[#DC2626] transition-all"
                      >
                        Start Over
                      </button>
                      <button
                        onClick={onClose}
                        className="flex-1 py-2.5 rounded-xl bg-[#DC2626] text-white text-sm font-semibold hover:bg-[#B91C1C] transition-colors"
                      >
                        Ask AI Advisor
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
