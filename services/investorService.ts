import type { Investor } from "@/types";
import investorsData from "@/data/investors.json";
import { notFound, simulate } from "./mock";

// The investor "database". The current investor represents the simulated
// logged-in user of the platform.
const DATASET: Investor[] = investorsData as Investor[];

export const CURRENT_INVESTOR_ID = "inv-001";

/** Returns every registered investor. */
export function getInvestors(): Promise<Investor[]> {
  return simulate<Investor[]>(() => DATASET.map((i) => ({ ...i })));
}

/** Fetches an investor by id; rejects when missing. */
export function getInvestorById(id: string): Promise<Investor> {
  return simulate<Investor>(() => {
    const investor = DATASET.find((i) => i.id === id);
    if (!investor) throw notFound("investor", id);
    return { ...investor, portfolio: [...investor.portfolio], interests: [...investor.interests] };
  });
}

/** The simulated authenticated user. */
export function getCurrentInvestor(): Promise<Investor> {
  return getInvestorById(CURRENT_INVESTOR_ID);
}

/**
 * Simulates saving profile updates. Returns the merged profile so callers can
 * persist it locally.
 */
export function updateInvestorProfile(id: string, patch: Partial<Investor>): Promise<Investor> {
  return simulate<Investor>(() => {
    const index = DATASET.findIndex((i) => i.id === id);
    if (index === -1) throw notFound("investor", id);
    DATASET[index] = { ...DATASET[index], ...patch };
    return { ...DATASET[index] };
  });
}

/** Marks an interest as saved for the given investor. */
export function saveInterest(investorId: string, dealId: string): Promise<Investor> {
  return simulate<Investor>(() => {
    const index = DATASET.findIndex((i) => i.id === investorId);
    if (index === -1) throw notFound("investor", investorId);
    const investor = DATASET[index];
    if (!investor.interests.includes(dealId)) {
      investor.interests = [...investor.interests, dealId];
    }
    return { ...investor, interests: [...investor.interests] };
  });
}

/** Removes an interest for the given investor. */
export function removeInterest(investorId: string, dealId: string): Promise<Investor> {
  return simulate<Investor>(() => {
    const index = DATASET.findIndex((i) => i.id === investorId);
    if (index === -1) throw notFound("investor", investorId);
    const investor = DATASET[index];
    investor.interests = investor.interests.filter((id) => id !== dealId);
    return { ...investor, interests: [...investor.interests] };
  });
}
