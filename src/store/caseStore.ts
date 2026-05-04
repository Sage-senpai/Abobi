"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { nanoid } from "nanoid";
import type { CaseStatus, CreateCaseInput, VisaCase } from "@/types/case";

interface CaseState {
  cases: VisaCase[];
  createCase: (input: CreateCaseInput) => VisaCase;
  updateStatus: (id: string, status: CaseStatus, note?: string) => void;
  updateCase: (id: string, patch: Partial<Omit<VisaCase, "id" | "events" | "createdAt">>) => void;
  deleteCase: (id: string) => void;
  getCase: (id: string) => VisaCase | undefined;
}

export const useCaseStore = create<CaseState>()(
  persist(
    (set, get) => ({
      cases: [],
      createCase: (input) => {
        const now = Date.now();
        const newCase: VisaCase = {
          id: nanoid(),
          country: input.country,
          visaType: input.visaType,
          status: input.status,
          filedAt: input.filedAt ?? null,
          receiptNumber: input.receiptNumber,
          notes: input.notes,
          events: [
            { id: nanoid(), timestamp: now, status: input.status, note: "Case created" },
          ],
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({ cases: [newCase, ...state.cases] }));
        return newCase;
      },
      updateStatus: (id, status, note) => {
        const now = Date.now();
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === id
              ? {
                  ...c,
                  status,
                  updatedAt: now,
                  events: [
                    { id: nanoid(), timestamp: now, status, note },
                    ...c.events,
                  ],
                }
              : c
          ),
        }));
      },
      updateCase: (id, patch) => {
        set((state) => ({
          cases: state.cases.map((c) =>
            c.id === id ? { ...c, ...patch, updatedAt: Date.now() } : c
          ),
        }));
      },
      deleteCase: (id) =>
        set((state) => ({ cases: state.cases.filter((c) => c.id !== id) })),
      getCase: (id) => get().cases.find((c) => c.id === id),
    }),
    {
      name: "zeroviza-cases",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
