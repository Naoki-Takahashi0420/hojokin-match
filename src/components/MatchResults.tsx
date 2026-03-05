"use client";

import { useState } from "react";
import {
  Award,
  Calendar,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  Info,
  Loader2,
  Star,
} from "lucide-react";
import { CompanyProfile, DraftResult, MatchResult } from "@/src/types";
import { formatAmount, formatRate } from "@/src/lib/utils";
import DraftView from "./DraftView";

const DRAFTABLE_IDS = ["monozukuri", "it-donyu", "jizokuka"];

interface MatchResultsProps {
  results: MatchResult[];
  profile: CompanyProfile;
  onReset: () => void;
}

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-emerald-500"
      : score >= 60
      ? "bg-blue-500"
      : score >= 40
      ? "bg-amber-500"
      : "bg-slate-300";

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-slate-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-sm font-bold text-slate-700 w-10 text-right">{score}</span>
    </div>
  );
}

function HojokinCard({
  result,
  profile,
  rank,
}: {
  result: MatchResult;
  profile: CompanyProfile;
  rank: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [draft, setDraft] = useState<DraftResult | null>(null);
  const canDraft = DRAFTABLE_IDS.includes(result.hojokin.id);

  const handleDraft = async () => {
    setDraftLoading(true);
    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, hojokinId: result.hojokin.id }),
      });
      const data = await res.json();
      setDraft(data);
    } catch (err) {
      console.error(err);
      alert("申請書の生成に失敗しました");
    } finally {
      setDraftLoading(false);
    }
  };

  const borderColor =
    rank === 1
      ? "border-amber-400"
      : rank === 2
      ? "border-slate-400"
      : rank === 3
      ? "border-amber-700"
      : "border-slate-200";

  return (
    <div className={`bg-white rounded-2xl border-2 ${borderColor} shadow-sm hover:shadow-md transition-shadow`}>
      <div className="p-5">
        {/* ヘッダー */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {rank <= 3 && (
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    rank === 1
                      ? "bg-amber-100 text-amber-700"
                      : rank === 2
                      ? "bg-slate-100 text-slate-600"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {rank}位
                </span>
              )}
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {result.hojokin.category}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-800">{result.hojokin.name}</h3>
            <p className="text-sm text-slate-500 mt-0.5">{result.comment}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center gap-1 text-amber-500 mb-1">
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="text-lg font-bold text-slate-800">{result.score}</span>
              <span className="text-xs text-slate-400">/100</span>
            </div>
          </div>
        </div>

        {/* スコアバー */}
        <ScoreBar score={result.score} />

        {/* 基本情報 */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <p className="text-xs text-blue-600 font-medium mb-1">補助上限</p>
            <p className="text-sm font-bold text-slate-800">{formatAmount(result.hojokin.maxAmount)}</p>
          </div>
          <div className="bg-emerald-50 rounded-xl p-3 text-center">
            <p className="text-xs text-emerald-600 font-medium mb-1">補助率</p>
            <p className="text-sm font-bold text-slate-800">{formatRate(result.hojokin.subsidyRate)}</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 text-center">
            <p className="text-xs text-amber-600 font-medium mb-1 flex items-center justify-center gap-1">
              <Calendar className="w-3 h-3" />
              申請期限
            </p>
            <p className="text-xs font-bold text-slate-800">{result.hojokin.deadline}</p>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <Info className="w-4 h-4" />
            詳細を見る
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {canDraft && (
            <button
              onClick={handleDraft}
              disabled={draftLoading}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
              {draftLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              {draftLoading ? "生成中..." : "申請書を生成"}
            </button>
          )}
        </div>
      </div>

      {/* 詳細展開 */}
      {expanded && (
        <div className="px-5 pb-5 border-t border-slate-100 pt-4 space-y-3">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">概要</p>
            <p className="text-sm text-slate-700 leading-relaxed">{result.hojokin.description}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">主な要件</p>
            <ul className="space-y-1">
              {result.hojokin.requirements.map((req, i) => (
                <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>
          <a
            href={result.hojokin.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            公式サイトで確認
          </a>
        </div>
      )}

      {/* 申請書ドラフト */}
      {draft && (
        <div className="border-t border-slate-100">
          <DraftView draft={draft} />
        </div>
      )}
    </div>
  );
}

export default function MatchResults({ results, profile, onReset }: MatchResultsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">マッチング結果</h2>
          <p className="text-sm text-slate-500 mt-1">
            {results.length}件の補助金が見つかりました。適合度順に表示しています。
          </p>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 border border-slate-200 px-3 py-2 rounded-lg transition-colors"
        >
          <Award className="w-4 h-4" />
          再入力
        </button>
      </div>

      <div className="space-y-4">
        {results.map((result, i) => (
          <HojokinCard
            key={result.hojokin.id}
            result={result}
            profile={profile}
            rank={i + 1}
          />
        ))}
      </div>
    </div>
  );
}
