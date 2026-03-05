"use client";

import { useState } from "react";
import { Building2, Users, MapPin, TrendingUp, ChevronRight, Loader2, Check } from "lucide-react";
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

const RequiredBadge = () => (
  <span className="ml-1.5 px-1.5 py-0.5 text-xs font-bold bg-red-100 text-red-600 rounded">必須</span>
);

const OptionalBadge = () => (
  <span className="ml-1.5 px-1.5 py-0.5 text-xs font-medium bg-slate-100 text-slate-400 rounded">任意</span>
);

export default function ProfileForm({ onSubmit, isLoading }: ProfileFormProps) {
  const [form, setForm] = useState<Partial<CompanyProfile>>({
    companyName: "",
    goals: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleGoalToggle = (goal: Goal) => {
    const current = form.goals ?? [];
    if (current.includes(goal)) {
      setForm({ ...form, goals: current.filter((g) => g !== goal) });
    } else {
      setForm({ ...form, goals: [...current, goal] });
    }
    if (errors.goals) setErrors((prev) => ({ ...prev, goals: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.industry) newErrors.industry = "業種を選択してください";
    if (!form.employeeSize) newErrors.employeeSize = "従業員数を選択してください";
    if (!form.prefecture) newErrors.prefecture = "都道府県を選択してください";
    if (!form.goals || form.goals.length === 0) newErrors.goals = "やりたいことを1つ以上選択してください";
    if (!form.revenue) newErrors.revenue = "年間売上を選択してください";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // 最初のエラー項目にスクロール
      const firstErrorKey = Object.keys(newErrors)[0];
      document.getElementById(`field-${firstErrorKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    onSubmit(form as CompanyProfile);
  };

  const clearError = (field: string) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 会社名 */}
      <div>
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          会社名
          <OptionalBadge />
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
      <div id="field-industry">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
          <Building2 className="w-4 h-4 text-blue-600" />
          業種
          <RequiredBadge />
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {INDUSTRIES.map((industry) => (
            <button
              key={industry}
              type="button"
              onClick={() => {
                setForm({ ...form, industry });
                clearError("industry");
              }}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all flex items-center justify-center gap-1.5 ${
                form.industry === industry
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-600 ring-offset-1"
                  : "bg-white text-slate-600 border-slate-300 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {form.industry === industry && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
              {industry}
            </button>
          ))}
        </div>
        {errors.industry && (
          <p className="mt-2 text-xs font-medium text-red-500">{errors.industry}</p>
        )}
      </div>

      {/* 従業員数 */}
      <div id="field-employeeSize">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
          <Users className="w-4 h-4 text-blue-600" />
          従業員数
          <RequiredBadge />
        </label>
        <div className="flex flex-wrap gap-2">
          {EMPLOYEE_SIZES.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => {
                setForm({ ...form, employeeSize: size });
                clearError("employeeSize");
              }}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all flex items-center gap-1.5 ${
                form.employeeSize === size
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-600 ring-offset-1"
                  : "bg-white text-slate-600 border-slate-300 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {form.employeeSize === size && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
              {size}名
            </button>
          ))}
        </div>
        {errors.employeeSize && (
          <p className="mt-2 text-xs font-medium text-red-500">{errors.employeeSize}</p>
        )}
      </div>

      {/* 都道府県 */}
      <div id="field-prefecture">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          都道府県
          <RequiredBadge />
        </label>
        <select
          value={form.prefecture ?? ""}
          onChange={(e) => {
            setForm({ ...form, prefecture: e.target.value });
            clearError("prefecture");
          }}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 bg-white ${
            form.prefecture ? "border-blue-400 ring-1 ring-blue-200" : "border-slate-300"
          }`}
        >
          <option value="">都道府県を選択してください</option>
          {PREFECTURES.map((pref) => (
            <option key={pref} value={pref}>
              {pref}
            </option>
          ))}
        </select>
        {errors.prefecture && (
          <p className="mt-2 text-xs font-medium text-red-500">{errors.prefecture}</p>
        )}
      </div>

      {/* やりたいこと（複数選択） */}
      <div id="field-goals">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-1">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          直近でやりたいこと
          <RequiredBadge />
        </label>
        <p className="text-xs text-slate-500 mb-3">複数選択できます</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {GOALS.map((goal) => {
            const selected = form.goals?.includes(goal);
            return (
              <button
                key={goal}
                type="button"
                onClick={() => handleGoalToggle(goal)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all flex items-center gap-1.5 ${
                  selected
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-600 ring-offset-1"
                    : "bg-white text-slate-600 border-slate-300 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                <span className={`w-4 h-4 rounded flex-shrink-0 border flex items-center justify-center ${
                  selected ? "bg-white border-white" : "border-slate-400"
                }`}>
                  {selected && <Check className="w-3 h-3 text-blue-600" />}
                </span>
                {goal}
              </button>
            );
          })}
        </div>
        {errors.goals && (
          <p className="mt-2 text-xs font-medium text-red-500">{errors.goals}</p>
        )}
      </div>

      {/* 年間売上 */}
      <div id="field-revenue">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
          <TrendingUp className="w-4 h-4 text-blue-600" />
          年間売上
          <RequiredBadge />
        </label>
        <div className="flex flex-wrap gap-2">
          {REVENUES.map((revenue) => (
            <button
              key={revenue}
              type="button"
              onClick={() => {
                setForm({ ...form, revenue });
                clearError("revenue");
              }}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-all flex items-center gap-1.5 ${
                form.revenue === revenue
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-600 ring-offset-1"
                  : "bg-white text-slate-600 border-slate-300 hover:border-blue-300 hover:text-blue-600"
              }`}
            >
              {form.revenue === revenue && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
              {revenue}
            </button>
          ))}
        </div>
        {errors.revenue && (
          <p className="mt-2 text-xs font-medium text-red-500">{errors.revenue}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white shadow-md hover:shadow-lg disabled:cursor-not-allowed"
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
