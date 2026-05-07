import "server-only";

import { nanoid } from "nanoid";
import { downloadProfile, uploadProfile } from "@/lib/0g/storage";
import { getStorageIndex, upsertStorageIndex } from "@/lib/db/client";
import { calculateStreak, createDefaultProfile } from "@/lib/zeroviza/streak";
import { chatWithTools } from "@/lib/0g/compute";
import type { UserProfile, AgentInboxItem } from "@/types/user";
import type { VisaCase } from "@/types/case";

const STALE_DAYS = 14;
const UPCOMING_DAYS = 7;
const ACTIVE_STATUSES = new Set([
  "preparing",
  "submitted",
  "biometrics-scheduled",
  "interview-scheduled",
  "additional-info-requested",
  "appeal",
]);

const MS_PER_DAY = 86_400_000;
const dayDiff = (a: number, b: number) => Math.floor((a - b) / MS_PER_DAY);

interface CaseAnalysis {
  case: VisaCase;
  daysOpen: number;
  daysSinceLastEvent: number;
  flags: ("stale" | "active" | "interview-soon" | "biometrics-soon")[];
}

function analyzeCase(c: VisaCase): CaseAnalysis {
  const now = Date.now();
  const lastEventTs = c.events[0]?.timestamp ?? c.createdAt;
  const daysSinceLastEvent = dayDiff(now, lastEventTs);
  const daysOpen = dayDiff(now, c.createdAt);

  const flags: CaseAnalysis["flags"] = [];
  if (daysSinceLastEvent >= STALE_DAYS && ACTIVE_STATUSES.has(c.status)) flags.push("stale");
  if (c.status === "interview-scheduled") flags.push("interview-soon");
  if (c.status === "biometrics-scheduled") flags.push("biometrics-soon");
  if (ACTIVE_STATUSES.has(c.status)) flags.push("active");

  return { case: c, daysOpen, daysSinceLastEvent, flags };
}

async function summarizeCases(analyses: CaseAnalysis[], persona: UserProfile["persona"]): Promise<string | null> {
  if (analyses.length === 0) return null;

  const personaLine = persona
    ? `User profile: ${[
        persona.citizenship && `${persona.citizenship} citizen`,
        persona.currentCountry && `currently in ${persona.currentCountry}`,
        persona.targetCountries?.length && `targeting ${persona.targetCountries.join(", ")}`,
        persona.profession && `profession: ${persona.profession}`,
      ]
        .filter(Boolean)
        .join("; ")}`
    : "";

  const caseLines = analyses
    .map(
      (a) =>
        `- ${a.case.country} ${a.case.visaType}: status=${a.case.status}, days_open=${a.daysOpen}, days_since_update=${a.daysSinceLastEvent}, flags=[${a.flags.join(",")}]`
    )
    .join("\n");

  const messages = [
    {
      role: "system",
      content:
        "You are an immigration case-monitoring agent. Given a list of the user's open visa cases with metadata, produce a SINGLE concise sentence (under 200 characters) summarizing the most important action item the user should take TODAY. Be specific. If nothing is urgent, say so plainly. Do not invent details.",
    },
    {
      role: "user",
      content: `${personaLine}\n\nOpen cases:\n${caseLines}\n\nWrite the action item now.`,
    },
  ];

  try {
    const result = await chatWithTools(messages, []);
    if (result.kind === "content") return result.content.trim();
    return null;
  } catch (err) {
    console.warn("[morningRoutine] inference failed:", err);
    return null;
  }
}

function buildInboxItems(analyses: CaseAnalysis[]): AgentInboxItem[] {
  const out: AgentInboxItem[] = [];
  const now = Date.now();

  for (const a of analyses) {
    if (a.flags.includes("stale")) {
      out.push({
        id: nanoid(),
        createdAt: now,
        type: "reminder",
        title: `${a.case.country} ${a.case.visaType} has gone quiet`,
        detail: `${a.daysSinceLastEvent} days since the last status update. Consider checking the official portal or contacting the embassy.`,
        caseId: a.case.id,
        read: false,
      });
    }
    if (a.flags.includes("interview-soon")) {
      out.push({
        id: nanoid(),
        createdAt: now,
        type: "reminder",
        title: `Prep for your ${a.case.country} interview`,
        detail: `Status is interview-scheduled. Confirm the date, gather originals (passport, financial docs, employment letter), and rehearse common questions.`,
        caseId: a.case.id,
        read: false,
      });
    }
    if (a.flags.includes("biometrics-soon")) {
      out.push({
        id: nanoid(),
        createdAt: now,
        type: "reminder",
        title: `Biometrics appointment for your ${a.case.country} ${a.case.visaType}`,
        detail: `Bring your appointment confirmation, passport, and a printed copy of your application receipt. Arrive 15 minutes early.`,
        caseId: a.case.id,
        read: false,
      });
    }
  }

  return out;
}

export interface MorningRoutineResult {
  walletAddress: string;
  ranAt: number;
  casesAnalyzed: number;
  inboxItemsAdded: number;
  summary: string | null;
  skipped?: string;
}

/**
 * Run the agent's morning routine for a single user. Idempotent in spirit:
 * the same routine running twice in one day will append duplicate inbox
 * items. Caller should de-dupe by `lastAgentRunAt` if needed.
 */
export async function runMorningRoutine(walletAddress: string): Promise<MorningRoutineResult> {
  const ranAt = Date.now();

  // Load profile from 0G
  const index = await getStorageIndex(walletAddress);
  let profile: UserProfile | null = null;
  if (index?.profileRootHash) {
    try {
      profile = await downloadProfile(index.profileRootHash);
    } catch {
      profile = null;
    }
  }
  if (!profile) {
    return {
      walletAddress,
      ranAt,
      casesAnalyzed: 0,
      inboxItemsAdded: 0,
      summary: null,
      skipped: "No profile blob on 0G yet — user has not chatted",
    };
  }

  const cases = profile.cases ?? [];
  const activeCases = cases.filter((c) => ACTIVE_STATUSES.has(c.status));

  if (activeCases.length === 0) {
    return {
      walletAddress,
      ranAt,
      casesAnalyzed: 0,
      inboxItemsAdded: 0,
      summary: null,
      skipped: "No active cases",
    };
  }

  const analyses = activeCases.map(analyzeCase);
  const inboxItems = buildInboxItems(analyses);
  const summary = await summarizeCases(analyses, profile.persona);

  if (summary) {
    inboxItems.unshift({
      id: nanoid(),
      createdAt: ranAt,
      type: "system",
      title: "Daily case summary",
      detail: summary,
      read: false,
    });
  }

  if (inboxItems.length === 0) {
    return {
      walletAddress,
      ranAt,
      casesAnalyzed: activeCases.length,
      inboxItemsAdded: 0,
      summary,
    };
  }

  const merged: UserProfile = {
    ...profile,
    agentInbox: [...inboxItems, ...(profile.agentInbox ?? [])].slice(0, 50),
  };
  const withStreak = calculateStreak(merged);

  try {
    const result = await uploadProfile(withStreak);
    await upsertStorageIndex(walletAddress, "", result.rootHash);
  } catch (err) {
    console.error("[morningRoutine] persist failed:", err);
  }

  return {
    walletAddress,
    ranAt,
    casesAnalyzed: activeCases.length,
    inboxItemsAdded: inboxItems.length,
    summary,
  };

  // suppress unused
  void createDefaultProfile;
}
