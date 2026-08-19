"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Coins } from "lucide-react";
import type { Deal } from "@/types";
import { formatCompactINR, formatINR } from "@/utils/format";
import { Modal } from "@/components/common/Modal";
import { Button } from "@/components/common/Button";
import { RiskBadge, ROIBadge } from "@/components/common/RiskBadge";
import { useAppDispatch } from "@/store";
import { addInvestment } from "@/store/slices/interestsSlice";

export function InvestDealModal({
  deal,
  open,
  onClose,
}: {
  deal: Deal;
  open: boolean;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();
  const [amount, setAmount] = useState<number>(deal.minimumInvestment);
  const [confirmed, setConfirmed] = useState(false);

  const projectedAmount = useMemo(
    () => Math.round(amount * Math.pow(1 + deal.expectedROI / 100, Math.max(1, deal.duration) / 12)),
    [amount, deal.expectedROI, deal.duration],
  );

  const confirm = () => {
    dispatch(addInvestment({ dealId: deal.id, amount }));
    setConfirmed(true);
  };

  const close = () => {
    setConfirmed(false);
    setAmount(deal.minimumInvestment);
    onClose();
  };

  const valid = amount >= deal.minimumInvestment && amount <= deal.maximumInvestment;

  return (
    <Modal
      open={open}
      onClose={close}
      title={confirmed ? "Investment recorded" : `Invest in ${deal.companyName}`}
      description={
        confirmed
          ? "This simulated investment has been added to your portfolio."
          : "Simulated investment — no real capital is transferred."
      }
    >
      {confirmed ? (
        <div className="flex flex-col items-center py-4 text-center">
          <CheckCircle2 className="h-12 w-12 text-emerald-500" aria-hidden />
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            {formatINR(amount)} allocated to {deal.companyName}. Projected value at exit:{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              {formatINR(projectedAmount)}
            </span>
            .
          </p>
          <Button className="mt-5" onClick={close}>
            Done
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <ROIBadge roi={deal.expectedROI} />
            <RiskBadge level={deal.riskLevel} />
          </div>
          <div>
            <label
              htmlFor="invest-amount"
              className="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              <span className="inline-flex items-center gap-1.5">
                <Coins className="h-4 w-4 text-brand-600" aria-hidden />
                Investment amount (₹)
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Min {formatCompactINR(deal.minimumInvestment)} · Max{" "}
                {formatCompactINR(deal.maximumInvestment)}
              </span>
            </label>
            <input
              id="invest-amount"
              type="number"
              min={deal.minimumInvestment}
              max={deal.maximumInvestment}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            {!valid && amount > 0 && (
              <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">
                Amount must be between {formatCompactINR(deal.minimumInvestment)} and{" "}
                {formatCompactINR(deal.maximumInvestment)}.
              </p>
            )}
          </div>

          <div className="rounded-lg bg-slate-50 p-3 text-sm dark:bg-slate-800/50">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Investment</span>
              <span className="font-semibold text-slate-800 dark:text-slate-100">
                {formatCompactINR(amount)}
              </span>
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">
                Projected value ({Math.ceil(deal.duration / 12)} yr)
              </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {formatCompactINR(projectedAmount)}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button onClick={confirm} disabled={!valid}>
              Confirm investment
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}