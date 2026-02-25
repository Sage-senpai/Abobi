"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { EligibilityQuiz } from "./EligibilityQuiz";
import { DocumentChecklist } from "./DocumentChecklist";

interface Action {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  href?: string;
  modal?: "eligibility" | "checklist";
}

const ACTIONS: Action[] = [
  {
    id: "eligibility",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    label: "Check Eligibility",
    description: "Find your visa options",
    color: "text-[#DC2626]",
    bgColor: "bg-[#FEF2F2]",
    borderColor: "border-[#FECACA]",
    modal: "eligibility",
  },
  {
    id: "checklist",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    label: "Doc Checklist",
    description: "Required documents list",
    color: "text-[#2563EB]",
    bgColor: "bg-[#EFF6FF]",
    borderColor: "border-blue-200",
    modal: "checklist",
  },
  {
    id: "chat",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    label: "Ask AI Advisor",
    description: "Get instant guidance",
    color: "text-[#16A34A]",
    bgColor: "bg-[#F0FDF4]",
    borderColor: "border-green-200",
    href: "/chat",
  },
  {
    id: "documents",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    label: "Upload Docs",
    description: "Secure 0G blockchain storage",
    color: "text-[#D97706]",
    bgColor: "bg-[#FFFBEB]",
    borderColor: "border-amber-200",
    href: "/documents",
  },
];

export function QuickActions() {
  const [activeModal, setActiveModal] = useState<"eligibility" | "checklist" | null>(null);

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[#0F172A] font-bold text-base">Quick Actions</h2>
          <span className="text-[#94A3B8] text-xs">Immigration tools</span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {ACTIONS.map((action, i) => {
            const content = (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
                whileTap={{ scale: 0.97 }}
                className={`
                  p-4 rounded-2xl border cursor-pointer transition-all duration-200
                  ${action.bgColor} ${action.borderColor}
                  hover:shadow-md
                `}
                onClick={action.modal ? () => setActiveModal(action.modal!) : undefined}
              >
                <div className={`w-9 h-9 rounded-xl ${action.bgColor} border ${action.borderColor} flex items-center justify-center ${action.color} mb-3`}>
                  {action.icon}
                </div>
                <p className="text-[#0F172A] font-bold text-sm">{action.label}</p>
                <p className="text-[#64748B] text-xs mt-0.5">{action.description}</p>
              </motion.div>
            );

            return action.href ? (
              <Link key={action.id} href={action.href}>
                {content}
              </Link>
            ) : (
              <div key={action.id}>{content}</div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {activeModal === "eligibility" && (
          <EligibilityQuiz onClose={() => setActiveModal(null)} />
        )}
        {activeModal === "checklist" && (
          <DocumentChecklist onClose={() => setActiveModal(null)} />
        )}
      </AnimatePresence>
    </>
  );
}
