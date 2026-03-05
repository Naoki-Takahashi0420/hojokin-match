"use client";

import { useState } from "react";
import { Sparkles, Shield, Zap } from "lucide-react";
import ProfileForm from "@/src/components/ProfileForm";
import MatchResults from "@/src/components/MatchResults";
import { CompanyProfile, MatchResult } from "@/src/types";

type Step = "input" | "results";

export default function Home() {
  const [step, setStep] = useState<Step>("input");
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (profileData: CompanyProfile) => {
    setIsLoading(true);
    setError(null);
    setProfile(profileData);

    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!res.ok) {
        throw new Error("マッチングAPIエラー");
      }

      const data = await res.json();
      setResults(data.results);
      setStep("results");
    } catch (err) {
      console.error(err);
      setError("マッチング処理中にエラーが発生しました。しばらくしてから再試行してください。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setStep("input");
    setResults([]);
    setProfile(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* ヘッダー */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-800">補助金マッチングAI</h1>
              <p className="text-xs text-slate-500">Powered by Claude AI</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              無料で利用可能
            </span>
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              即時診断
            </span>
          </div>
        </div>
      </header>

      {/* ステップインジケーター */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 text-sm">
            <div
              className={`flex items-center gap-1.5 font-medium ${
                step === "input" ? "text-blue-600" : "text-slate-400"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === "input" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                }`}
              >
                1
              </span>
              企業情報入力
            </div>
            <div className="w-8 h-px bg-slate-200" />
            <div
              className={`flex items-center gap-1.5 font-medium ${
                step === "results" ? "text-blue-600" : "text-slate-400"
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === "results" ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                }`}
              >
                2
              </span>
              AIマッチング結果
            </div>
            <div className="w-8 h-px bg-slate-200" />
            <div className="flex items-center gap-1.5 font-medium text-slate-400">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-slate-200 text-slate-500">
                3
              </span>
              申請書生成
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <main className="max-w-5xl mx-auto px-4 py-10">
        {step === "input" && (
          <div className="max-w-2xl mx-auto">
            {/* ヒーローセクション */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-slate-800 mb-3">
                最適な補助金を、AIが即座に診断
              </h2>
              <p className="text-slate-500 text-base leading-relaxed">
                企業情報を入力するだけで、AIが10種類以上の補助金・助成金から
                <br className="hidden sm:block" />
                あなたの会社に最適なものをスコアリングします。
              </p>
            </div>

            {/* フォームカード */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
              <ProfileForm onSubmit={handleSubmit} isLoading={isLoading} />
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>

            {/* 特徴 */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { icon: Sparkles, title: "AI分析", desc: "Claude AIが適合度を自動判定" },
                { icon: Zap, title: "即時診断", desc: "30秒以内に結果を表示" },
                { icon: Shield, title: "申請書生成", desc: "主要3補助金の下書きを自動作成" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="text-center p-4 bg-white/60 rounded-xl border border-slate-200">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">{title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === "results" && profile && (
          <MatchResults
            results={results}
            profile={profile}
            onReset={handleReset}
          />
        )}
      </main>

      {/* フッター */}
      <footer className="border-t border-slate-200 bg-white mt-16">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center text-xs text-slate-400">
          <p>補助金マッチングAI — 情報は参考用です。申請前に必ず公式サイトでご確認ください。</p>
        </div>
      </footer>
    </div>
  );
}
