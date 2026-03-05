"use client";

import { useState } from "react";
import { Building2, Users, MapPin, TrendingUp, ChevronRight, Loader2 } from "lucide-react";
import { CompanyProfile, Industry, EmployeeSize, Goal, Revenue } from "@/src/types";

const INDUSTRIES: Industry[] = ["製造業", "IT", "サービス業", "医療", "建設", "飲食", "小売", "その他"];
const EMPLOYEE_SIZES: EmployeeSize[] = ["1〜5", "6〜20", "21〜50", "51〜300", "301〜"];
const GOALS: Goal[] = ["ITシステム導入", "設備投資", "採用強化", "販路開拓", "研究開発", "省エネ", "その他"];
const REVENUES: Revenue[] = ["〜1000万", "〜5000万", "〜1億", "〜5億", "5億〜"];
const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県",
  "静岡県", "愛知県", "三重県", "滋賀県", "京都府", "大阪府", "兵庫県",
  "奈良県", "和歌山県", "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県", "福岡県", "佐賀県", "長崎県",
  "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県"
];

interface ProfileFormProps {
  onSubmit: (profile: CompanyProfile) => void;
  isLoading: boolean;
}

export default function ProfileForm({ onSubmit, isLoading }: ProfileFormProps) {
  const [form, setForm] = useState<Partial<CompanyProfile>>({
    companyName: "",
    goals: [],
  });

  const handleGoalToggle = (goal: Goal) => {
    const current = form.goals ?? [];
    if (current.includes(goal)) {
      setForm({ ...form, goals: current.filter((g) => g !== goal) });
    } else {
      setForm({ ...form, goals: [...current, goal] });
    }
  };

  const isValid =
    form.industry &&
    form.employeeSize &&
    form.prefecture &&
    form.goals &&
    form.goals.length > 0 &&
    form.revenue;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit(form as CompanyProfile);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 会社名 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          会社名（任意）
        </label>
        <input
          type="text"
          placeholder="例：株式会社サンプル"
          value={form.companyName ?? ""}
          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 placeholder:text-slate-400 bg-white"
        />
      </div>

      {/* 業種 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
          <Building2 className="w-4 h-4 text-blue-600" />
          業種 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {INDUSTRIES.map((industry) => (
            <button
              key={industry}
              type="button"
              onClick={() => setForm({ ...form, industry })}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                form.industry === industry
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {industry}
            </button>
          ))}
        </div>
      </div>

      {/* 従業員数 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
          <Users className="w-4 h-4 text-blue-600" />
          従業員数 <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {EMPLOYEE_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setForm({ ...form, employeeSize: size })}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                form.employeeSize === size
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {size}名
            </button>
          ))}
        </div>
      </div>

      {/* 都道府県 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          都道府県 <span className="text-red-500">*</span>
        </label>
        <select
          value={form.prefecture ?? ""}
          onChange={(e) => setForm({ ...form, prefecture: e.target.value })}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 bg-white"
        >
          <option value="">都道府県を選択</option>
          {PREFECTURES.map((pref) => (
            <option key={pref} value={pref}>
              {pref}
            </option>
          ))}
        </select>
      </div>

      {/* やりたいこと */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          直近でやりたいこと（複数選択可） <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {GOALS.map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => handleGoalToggle(goal)}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                form.goals?.includes(goal)
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
      </div>

      {/* 年間売上 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          年間売上 <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {REVENUES.map((revenue) => (
            <button
              key={revenue}
              type="button"
              onClick={() => setForm({ ...form, revenue })}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                form.revenue === revenue
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {revenue}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!isValid || isLoading}
        className={`w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${
          isValid && !isLoading
            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
            : "bg-slate-200 text-slate-400 cursor-not-allowed"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            AIがマッチング中...
          </>
        ) : (
          <>
            AIマッチングを開始
            <ChevronRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
}
