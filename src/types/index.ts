export type Industry = "製造業" | "IT" | "サービス業" | "医療" | "建設" | "飲食" | "小売" | "その他";
export type EmployeeSize = "1〜5" | "6〜20" | "21〜50" | "51〜300" | "301〜";
export type Goal = "ITシステム導入" | "設備投資" | "採用強化" | "販路開拓" | "研究開発" | "省エネ" | "その他";
export type Revenue = "〜1000万" | "〜5000万" | "〜1億" | "〜5億" | "5億〜";

export interface CompanyProfile {
  companyName: string;
  industry: Industry;
  employeeSize: EmployeeSize;
  prefecture: string;
  goals: Goal[];
  revenue: Revenue;
}

export interface Hojokin {
  id: string;
  name: string;
  fullName: string;
  category: string;
  maxAmount: number;
  subsidyRate: number;
  deadline: string;
  targetIndustries: string[];
  targetSize: string[];
  targetGoals: string[];
  description: string;
  requirements: string[];
  url: string;
}

export interface MatchResult {
  hojokin: Hojokin;
  score: number;
  comment: string;
}

export interface DraftResult {
  hojokinId: string;
  hojokinName: string;
  sections: DraftSection[];
}

export interface DraftSection {
  title: string;
  content: string;
}
