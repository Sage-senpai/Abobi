import "server-only";

import { nanoid } from "nanoid";
import { findEmbassies } from "@/data/embassies";
import { getVerifiedLawyers, getLawyerByWallet } from "@/lib/db/client";
import { hireProvider, type HireResult } from "@/lib/agent/hire";
import { findTokensOwnedBy, getCaseAgentNFTAddress } from "@/lib/contracts/CaseAgentNFT";
import type { VisaCase, CaseStatus } from "@/types/case";
import type { UserProfile, UserPersona, AgentInboxItem } from "@/types/user";
import type { Embassy } from "@/types/embassy";

// ─── Tool schemas (OpenAI-compatible function-call format) ───────────────────

export const TOOL_DEFS = [
  {
    type: "function" as const,
    function: {
      name: "lookup_embassy",
      description:
        "Look up a country's diplomatic mission. Use when the user asks where to apply, where the consulate is, what the phone or appointment URL is, or which mission has jurisdiction over their region.",
      parameters: {
        type: "object",
        properties: {
          representingCountry: {
            type: "string",
            description: "The country whose embassy or consulate you are looking for (e.g. 'United States', 'United Kingdom', 'Germany').",
          },
          hostCountry: {
            type: "string",
            description: "Optional country where the user is currently located (e.g. 'Nigeria', 'Ghana'). Narrows the search.",
          },
          query: {
            type: "string",
            description: "Optional free-text search like 'Lagos' or 'asylum services'.",
          },
        },
        required: ["representingCountry"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "find_service_provider",
      description:
        "Search the on-chain registry of verified immigration service providers. Use when the user needs a lawyer, RCIC, OISC adviser, MARA agent, translator, credential evaluator, notary, or document specialist.",
      parameters: {
        type: "object",
        properties: {
          serviceType: {
            type: "string",
            enum: [
              "Lawyer",
              "RCIC (Canada Consultant)",
              "OISC Adviser (UK)",
              "MARA Agent (Australia)",
              "Translator",
              "Credential Evaluator",
              "Notary",
              "Document Specialist",
            ],
            description: "Which type of professional the user needs.",
          },
          jurisdiction: {
            type: "string",
            description: "Optional jurisdiction filter (e.g. 'California, USA', 'England & Wales').",
          },
          language: {
            type: "string",
            description: "Optional spoken-language filter (e.g. 'Yoruba', 'Spanish').",
          },
        },
        required: ["serviceType"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "create_case",
      description:
        "Create a new visa case in the user's tracker. Use when the user has explicitly decided to pursue a specific visa or has just filed an application. Do not call this speculatively — only when the user has confirmed the country, visa type, and current state.",
      parameters: {
        type: "object",
        properties: {
          country: {
            type: "string",
            description: "Destination country (e.g. 'United States', 'Canada', 'United Kingdom').",
          },
          visaType: {
            type: "string",
            description: "Specific visa or program (e.g. 'H-1B', 'Express Entry', 'Skilled Worker').",
          },
          status: {
            type: "string",
            enum: [
              "preparing",
              "submitted",
              "biometrics-scheduled",
              "interview-scheduled",
              "additional-info-requested",
              "approved",
              "rejected",
              "appeal",
            ],
            description: "Current stage of the application.",
          },
          filedAt: {
            type: "string",
            description: "Optional ISO date (YYYY-MM-DD) the user filed.",
          },
          receiptNumber: {
            type: "string",
            description: "Optional receipt or application number.",
          },
        },
        required: ["country", "visaType", "status"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "hire_provider",
      description:
        "Hire a verified service provider on the user's behalf and record the hire on the 0G chain. CRITICAL: only call this AFTER the user has explicitly confirmed they want to engage a specific provider for a specific task and has agreed to the fee. Never call speculatively. The hire records a small operator-paid 0G transfer to the provider's wallet with the full task metadata in the calldata, viewable on chainscan.0g.ai.",
      parameters: {
        type: "object",
        properties: {
          providerWallet: {
            type: "string",
            description: "The provider's verified wallet address (must come from a prior find_service_provider result, not invented).",
          },
          taskDescription: {
            type: "string",
            description: "Brief description of the task the provider will complete (under 280 characters).",
          },
          agreedFeeUSD: {
            type: "number",
            description: "Fee in USD that the user agreed to pay for this task. Should match the provider's published flatRateUSD or a number the user explicitly confirmed.",
          },
        },
        required: ["providerWallet", "taskDescription", "agreedFeeUSD"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "extract_profile_facts",
      description:
        "Save structured facts about the user that should persist across conversations. Call this whenever the user shares personal info that affects future advice (citizenship, current country, target country, profession, education level, family situation, budget, language fluency, or prior visa history). Only pass fields you are confident about — do not invent details.",
      parameters: {
        type: "object",
        properties: {
          citizenship: { type: "string" },
          currentCountry: { type: "string" },
          targetCountries: {
            type: "array",
            items: { type: "string" },
          },
          profession: { type: "string" },
          educationLevel: {
            type: "string",
            description: "e.g. 'Bachelor's', 'Master's', 'PhD', 'High school'.",
          },
          family: {
            type: "string",
            description: "e.g. 'single', 'married, no kids', 'married + 2 kids'.",
          },
          languages: {
            type: "array",
            items: { type: "string" },
          },
          englishLevel: {
            type: "string",
            description: "e.g. 'native', 'IELTS 7.5', 'conversational'.",
          },
          budget: {
            type: "string",
            description: "e.g. '$5K', '$20K-$30K', 'limited'.",
          },
          visaHistory: {
            type: "array",
            items: { type: "string" },
            description: "Previous visa applications or denials (e.g. 'B1/B2 denied 2021', 'F-1 student 2018-2022').",
          },
          notes: {
            type: "string",
            description: "Any other context worth remembering long-term.",
          },
        },
      },
    },
  },
];

// ─── Tool execution context ──────────────────────────────────────────────────

export interface ToolContext {
  walletAddress: string;
  profile: UserProfile;
}

export interface ToolResult {
  ok: boolean;
  /** Short summary suitable for showing in the UI as the tool runs. */
  uiSummary: string;
  /** JSON payload sent back to the model as the tool result. */
  modelPayload: unknown;
  /** Profile mutations the loop should apply before persisting. */
  profilePatch?: Partial<UserProfile>;
  /** Inbox events to append. */
  inboxItems?: AgentInboxItem[];
  /** Cases to add (so the agent loop can persist them in one go). */
  newCases?: VisaCase[];
  /** On-chain receipt link to surface in the UI (for hire_provider, etc). */
  explorerUrl?: string;
  /** Short tx hash for display. */
  txHash?: string;
}

// ─── Handlers ────────────────────────────────────────────────────────────────

function trim<T>(arr: T[], n: number): T[] {
  return arr.slice(0, n);
}

function summarizeEmbassy(e: Embassy): Record<string, unknown> {
  return {
    representingCountry: e.representingCountry,
    hostCity: e.hostCity,
    hostCountry: e.hostCountry,
    type: e.type,
    address: e.address,
    phone: e.phone,
    email: e.email,
    website: e.website,
    appointmentUrl: e.appointmentUrl,
    hours: e.hours,
    jurisdictionNotes: e.jurisdictionNotes,
    services: e.servicesOffered,
  };
}

async function handleLookupEmbassy(args: {
  representingCountry: string;
  hostCountry?: string;
  query?: string;
}): Promise<ToolResult> {
  const matches = findEmbassies({
    representingCountry: args.representingCountry,
    hostCountry: args.hostCountry,
    query: args.query,
  });

  if (matches.length === 0) {
    return {
      ok: false,
      uiSummary: `No ${args.representingCountry} mission found${args.hostCountry ? ` in ${args.hostCountry}` : ""}`,
      modelPayload: { matches: [], note: "Embassy not in directory. Tell the user to check the official MFA website." },
    };
  }

  return {
    ok: true,
    uiSummary: `Found ${matches.length} ${args.representingCountry} mission${matches.length === 1 ? "" : "s"}`,
    modelPayload: { matches: trim(matches, 4).map(summarizeEmbassy) },
  };
}

async function handleFindServiceProvider(args: {
  serviceType: string;
  jurisdiction?: string;
  language?: string;
}): Promise<ToolResult> {
  let providers;
  try {
    providers = await getVerifiedLawyers();
  } catch (err) {
    return {
      ok: false,
      uiSummary: "Could not reach the provider registry",
      modelPayload: { error: err instanceof Error ? err.message : "Registry read failed" },
    };
  }

  const filtered = providers.filter((p) => {
    if ((p.serviceType ?? "Lawyer") !== args.serviceType) return false;
    if (args.jurisdiction && !p.jurisdiction.toLowerCase().includes(args.jurisdiction.toLowerCase())) return false;
    if (args.language && !p.languages.some((l) => l.toLowerCase().includes(args.language!.toLowerCase()))) return false;
    return true;
  });

  if (filtered.length === 0) {
    return {
      ok: true,
      uiSummary: `No verified ${args.serviceType}s match those filters yet`,
      modelPayload: {
        matches: [],
        note: `No verified ${args.serviceType}s registered yet. Suggest the user broaden filters or ask the directory page.`,
      },
    };
  }

  return {
    ok: true,
    uiSummary: `Found ${filtered.length} verified ${args.serviceType}${filtered.length === 1 ? "" : "s"}`,
    modelPayload: {
      matches: trim(filtered, 5).map((p) => ({
        fullName: p.fullName,
        serviceType: p.serviceType,
        jurisdiction: p.jurisdiction,
        languages: p.languages,
        yearsExperience: p.yearsExperience,
        specializations: p.specializations,
        website: p.website,
        wallet: p.walletAddress,
        flatRateUSD: p.flatRateUSD,
        hourlyRateUSD: p.hourlyRateUSD,
        acceptsHires: p.acceptsHires ?? false,
      })),
      hint: "If the user wants to engage one of these providers, confirm the fee with them first, then call hire_provider with the wallet, task, and agreed fee. Only providers with acceptsHires=true can be hired.",
    },
  };
}

async function handleHireProvider(
  args: {
    providerWallet: string;
    taskDescription: string;
    agreedFeeUSD: number;
  },
  ctx: ToolContext
): Promise<ToolResult> {
  const provider = await getLawyerByWallet(args.providerWallet);
  if (!provider || provider.status !== "verified") {
    return {
      ok: false,
      uiSummary: "Provider not verified — refusing to hire",
      modelPayload: { error: "Provider is not in the verified registry. Refuse to invent unverified hires." },
    };
  }
  if (!provider.acceptsHires) {
    return {
      ok: false,
      uiSummary: `${provider.fullName} is not currently accepting agent hires`,
      modelPayload: { error: "Provider has acceptsHires=false. Suggest the user contact them through their website instead." },
    };
  }
  if (args.agreedFeeUSD <= 0) {
    return {
      ok: false,
      uiSummary: "Refused: agreed fee must be greater than zero",
      modelPayload: { error: "agreedFeeUSD must be > 0." },
    };
  }

  // Look up the user's case agent INFT (if any) to bind the hire to it
  let caseAgentTokenId: string | null = null;
  if (getCaseAgentNFTAddress()) {
    try {
      const tokens = await findTokensOwnedBy(ctx.walletAddress);
      caseAgentTokenId = tokens[0] ?? null;
    } catch {
      // not fatal
    }
  }

  let hire: HireResult;
  try {
    hire = await hireProvider({
      userWallet: ctx.walletAddress,
      providerWallet: args.providerWallet,
      taskDescription: args.taskDescription,
      agreedFeeUSD: args.agreedFeeUSD,
      caseAgentTokenId,
    });
  } catch (err) {
    return {
      ok: false,
      uiSummary: "Hire transaction failed",
      modelPayload: { error: err instanceof Error ? err.message : "Hire failed" },
    };
  }

  const inboxItem: AgentInboxItem = {
    id: nanoid(),
    createdAt: Date.now(),
    type: "tool-result",
    title: `Hired ${provider.fullName} ($${args.agreedFeeUSD})`,
    detail: `Task: ${args.taskDescription.slice(0, 140)} · Receipt on chain (tx ${hire.txHash.slice(0, 10)}…)`,
    read: false,
  };

  return {
    ok: true,
    uiSummary: `Hired ${provider.fullName} for $${args.agreedFeeUSD}`,
    modelPayload: {
      success: true,
      provider: provider.fullName,
      providerWallet: args.providerWallet,
      agreedFeeUSD: args.agreedFeeUSD,
      txHash: hire.txHash,
      blockNumber: hire.blockNumber,
      receiptHash: hire.receiptHash,
      caseAgentTokenId,
      explorerUrl: `https://chainscan.0g.ai/tx/${hire.txHash}`,
    },
    inboxItems: [inboxItem],
    explorerUrl: `https://chainscan.0g.ai/tx/${hire.txHash}`,
    txHash: hire.txHash,
  };
}

async function handleCreateCase(
  args: {
    country: string;
    visaType: string;
    status: CaseStatus;
    filedAt?: string;
    receiptNumber?: string;
  },
  ctx: ToolContext
): Promise<ToolResult> {
  const now = Date.now();
  const newCase: VisaCase = {
    id: nanoid(),
    country: args.country,
    visaType: args.visaType,
    status: args.status,
    filedAt: args.filedAt ? new Date(args.filedAt).getTime() : null,
    receiptNumber: args.receiptNumber,
    events: [
      { id: nanoid(), timestamp: now, status: args.status, note: "Created by AI agent" },
    ],
    createdAt: now,
    updatedAt: now,
  };

  const inboxItem: AgentInboxItem = {
    id: nanoid(),
    createdAt: now,
    type: "case-update",
    title: `Tracking new ${args.country} ${args.visaType} case`,
    detail: `Status: ${args.status}${args.receiptNumber ? ` · Receipt ${args.receiptNumber}` : ""}`,
    caseId: newCase.id,
    read: false,
  };

  return {
    ok: true,
    uiSummary: `Created case: ${args.country} ${args.visaType}`,
    modelPayload: {
      caseId: newCase.id,
      message: "Case created and synced to user's 0G profile.",
    },
    newCases: [newCase],
    inboxItems: [inboxItem],
  };
  void ctx;
}

async function handleExtractProfileFacts(
  args: Partial<UserPersona>,
  ctx: ToolContext
): Promise<ToolResult> {
  const existing = ctx.profile.persona ?? { updatedAt: 0 };
  const merged: UserPersona = {
    ...existing,
    ...Object.fromEntries(Object.entries(args).filter(([, v]) => v !== undefined && v !== null)),
    updatedAt: Date.now(),
  };

  // Diff for the UI summary
  const changedKeys = Object.keys(args).filter(
    (k) => args[k as keyof UserPersona] !== undefined &&
      JSON.stringify(args[k as keyof UserPersona]) !== JSON.stringify(existing[k as keyof UserPersona])
  );

  if (changedKeys.length === 0) {
    return {
      ok: true,
      uiSummary: "No new profile facts to save",
      modelPayload: { saved: false, persona: merged },
    };
  }

  return {
    ok: true,
    uiSummary: `Saved profile facts: ${changedKeys.join(", ")}`,
    modelPayload: { saved: true, persona: merged },
    profilePatch: { persona: merged },
  };
}

// ─── Dispatcher ──────────────────────────────────────────────────────────────

export async function executeTool(
  name: string,
  rawArgs: string | Record<string, unknown>,
  ctx: ToolContext
): Promise<ToolResult> {
  let args: Record<string, unknown>;
  try {
    args = typeof rawArgs === "string" ? JSON.parse(rawArgs) : rawArgs;
  } catch {
    return {
      ok: false,
      uiSummary: `Tool ${name} called with invalid JSON arguments`,
      modelPayload: { error: "Invalid JSON arguments" },
    };
  }

  switch (name) {
    case "lookup_embassy":
      return handleLookupEmbassy(args as Parameters<typeof handleLookupEmbassy>[0]);
    case "find_service_provider":
      return handleFindServiceProvider(args as Parameters<typeof handleFindServiceProvider>[0]);
    case "hire_provider":
      return handleHireProvider(args as Parameters<typeof handleHireProvider>[0], ctx);
    case "create_case":
      return handleCreateCase(args as Parameters<typeof handleCreateCase>[0], ctx);
    case "extract_profile_facts":
      return handleExtractProfileFacts(args as Partial<UserPersona>, ctx);
    default:
      return {
        ok: false,
        uiSummary: `Unknown tool: ${name}`,
        modelPayload: { error: `Tool '${name}' not implemented` },
      };
  }
}
