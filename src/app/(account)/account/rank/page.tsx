"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  getRankSnapshot,
  getManagementBonus,
  getMatchingBonus,
  getPvLedgers,
  type RankSnapshot,
  type ManagementBonus,
  type MatchingBonus,
  type PvLedger,
} from "@/lib/api/bonus";
import { RankCard } from "./_components/RankCard";
import { ManagementBonusList } from "./_components/ManagementBonusList";
import { MatchingBonusList } from "./_components/MatchingBonusList";
import { PvLedgerList } from "./_components/PvLedgerList";

type Tab = "management" | "matching" | "pv";

const TABS: { key: Tab; label: string }[] = [
  { key: "management", label: "Thưởng quản trị" },
  { key: "matching", label: "Thưởng đồng cấp" },
  { key: "pv", label: "Lịch sử PV" },
];

function toRows<T>(data: unknown): T[] {
  if (Array.isArray(data)) return data as T[];
  const obj = data as { rows?: T[]; items?: T[] } | null | undefined;
  if (Array.isArray(obj?.rows)) return obj!.rows;
  if (Array.isArray(obj?.items)) return obj!.items;
  return [];
}

const Spinner = () => (
  <div className="flex h-40 items-center justify-center">
    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
  </div>
);

export default function RankPage() {
  const [tab, setTab] = useState<Tab>("management");

  const [snapshot, setSnapshot] = useState<RankSnapshot | null>(null);
  const [snapLoading, setSnapLoading] = useState(true);

  const [management, setManagement] = useState<ManagementBonus[]>([]);
  const [mgmtLoading, setMgmtLoading] = useState(false);
  const [mgmtLoaded, setMgmtLoaded] = useState(false);

  const [matching, setMatching] = useState<MatchingBonus[]>([]);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchLoaded, setMatchLoaded] = useState(false);

  const [ledgers, setLedgers] = useState<PvLedger[]>([]);
  const [pvLoading, setPvLoading] = useState(false);
  const [pvLoaded, setPvLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadSnapshot() {
      try {
        const data = await getRankSnapshot();
        if (mounted) setSnapshot(data);
      } catch (error) {
        console.error("LOAD_RANK_SNAPSHOT_ERROR:", error);
      } finally {
        if (mounted) setSnapLoading(false);
      }
    }

    loadSnapshot();
    return () => {
      mounted = false;
    };
  }, []);

  const loadManagement = useCallback(async () => {
    setMgmtLoading(true);
    try {
      const data = await getManagementBonus({ page: 1, limit: 50 });
      setManagement(toRows<ManagementBonus>(data));
    } catch (error) {
      console.error("LOAD_MANAGEMENT_BONUS_ERROR:", error);
    } finally {
      setMgmtLoading(false);
      setMgmtLoaded(true);
    }
  }, []);

  const loadMatching = useCallback(async () => {
    setMatchLoading(true);
    try {
      const data = await getMatchingBonus({ page: 1, limit: 50 });
      setMatching(toRows<MatchingBonus>(data));
    } catch (error) {
      console.error("LOAD_MATCHING_BONUS_ERROR:", error);
    } finally {
      setMatchLoading(false);
      setMatchLoaded(true);
    }
  }, []);

  const loadLedgers = useCallback(async () => {
    setPvLoading(true);
    try {
      const data = await getPvLedgers({ page: 1, limit: 50 });
      setLedgers(toRows<PvLedger>(data));
    } catch (error) {
      console.error("LOAD_PV_LEDGERS_ERROR:", error);
    } finally {
      setPvLoading(false);
      setPvLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (tab === "management" && !mgmtLoaded) loadManagement();
    if (tab === "matching" && !matchLoaded) loadMatching();
    if (tab === "pv" && !pvLoaded) loadLedgers();
  }, [tab, mgmtLoaded, matchLoaded, pvLoaded, loadManagement, loadMatching, loadLedgers]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Quản trị & Thưởng
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Theo dõi cấp bậc, thưởng quản trị, thưởng đồng cấp và lịch sử PV
        </p>
      </div>

      {snapLoading ? (
        <Spinner />
      ) : snapshot ? (
        <RankCard snapshot={snapshot} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Chưa có dữ liệu cấp bậc cho chu kỳ hiện tại.
        </p>
      )}

      <div className="flex gap-2 border-b border-slate-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              tab === t.key
                ? "border-th-blue text-th-blue"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "management" &&
        (mgmtLoading ? <Spinner /> : <ManagementBonusList items={management} />)}

      {tab === "matching" &&
        (matchLoading ? <Spinner /> : <MatchingBonusList items={matching} />)}

      {tab === "pv" && (pvLoading ? <Spinner /> : <PvLedgerList items={ledgers} />)}
    </div>
  );
}
