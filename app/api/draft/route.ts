import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { CompanyProfile, DraftResult } from "@/src/types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SUPPORTED_HOJOKIN = ["monozukuri", "it-donyu", "jizokuka"];

const HOJOKIN_INFO: Record<string, { name: string; sections: string[] }> = {
  monozukuri: {
    name: "ものづくり補助金",
    sections: [
      "1. 補助事業の具体的な取組内容",
      "2. 将来の展望（事業化に向けて想定しているスケジュール）",
      "3. 本事業で取得する主な設備等の名称・機能・導入理由",
      "4. 革新的な製品・サービス・生産プロセス等の説明",
      "5. 付加価値額の向上計画",
    ],
  },
  "it-donyu": {
    name: "IT導入補助金",
    sections: [
      "1. 導入するITツールの概要と選定理由",
      "2. 現状の業務課題",
      "3. ITツール導入による業務改善計画",
      "4. 期待する効果（定量的目標）",
      "5. 導入後の活用・運用計画",
    ],
  },
  jizokuka: {
    name: "小規模事業者持続化補助金",
    sections: [
      "1. 企業概要",
      "2. 顧客ニーズと市場の動向",
      "3. 自社の強み",
      "4. 経営方針・目標と今後のプラン",
      "5. 補助事業計画（販路開拓等の取組内容）",
    ],
  },
};

export async function POST(req: NextRequest) {
  try {
    const { profile, hojokinId }: { profile: CompanyProfile; hojokinId: string } =
      await req.json();

    if (!SUPPORTED_HOJOKIN.includes(hojokinId)) {
      return NextResponse.json(
        { error: "この補助金の申請書下書き生成には対応していません" },
        { status: 400 }
      );
    }

    const info = HOJOKIN_INFO[hojokinId];

    const prompt = `あなたは補助金申請書の作成専門家です。以下の企業情報を元に、${info.name}の申請書の主要項目を作成してください。

企業情報:
- 会社名: ${profile.companyName || "（会社名未入力）"}
- 業種: ${profile.industry}
- 従業員数: ${profile.employeeSize}名
- 都道府県: ${profile.prefecture}
- 実施したいこと: ${profile.goals.join("、")}
- 年間売上: ${profile.revenue}

以下の各セクションについて、具体的で説得力のある内容を作成してください。
各セクションは300〜500文字程度で記述してください。

${info.sections.join("\n")}

必ず以下のJSON形式のみで返答してください（他のテキストは不要）:
{
  "sections": [
    {
      "title": "セクションタイトル",
      "content": "内容"
    }
  ]
}`;

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("JSON not found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    const result: DraftResult = {
      hojokinId,
      hojokinName: info.name,
      sections: parsed.sections,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Draft API error:", error);
    return NextResponse.json(
      { error: "申請書下書き生成中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
