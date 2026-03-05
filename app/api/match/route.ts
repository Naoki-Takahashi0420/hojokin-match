import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import hojokinData from "@/src/data/hojokin.json";
import { CompanyProfile, Hojokin, MatchResult } from "@/src/types";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const profile: CompanyProfile = await req.json();

    const hojokinList = hojokinData as Hojokin[];

    const prompt = `あなたは補助金・助成金の専門家です。以下の企業情報と補助金リストを元に、各補助金の適合度をスコアリングしてください。

企業情報:
- 会社名: ${profile.companyName || "未設定"}
- 業種: ${profile.industry}
- 従業員数: ${profile.employeeSize}名
- 都道府県: ${profile.prefecture}
- やりたいこと: ${profile.goals.join("、")}
- 年間売上: ${profile.revenue}

補助金リスト:
${hojokinList.map((h, i) => `${i + 1}. ID: ${h.id}
   名称: ${h.name}
   対象業種: ${h.targetIndustries.join("、")}
   対象規模: ${h.targetSize.join("、")}
   対象ゴール: ${h.targetGoals.join("、")}
   説明: ${h.description}`).join("\n\n")}

各補助金について、この企業への適合度を0〜100でスコアリングし、一言コメントを付けてください。
スコアは以下の観点で判断してください:
- 業種の一致度
- 従業員規模の適合性
- やりたいことと補助対象の一致度
- 売上規模の適合性

必ず以下のJSON形式のみで返答してください（他のテキストは不要）:
{
  "results": [
    {
      "id": "補助金ID",
      "score": 数値（0-100）,
      "comment": "一言コメント（50文字以内）"
    }
  ]
}`;

    const message = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 2048,
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
    const scoreMap = new Map(
      parsed.results.map((r: { id: string; score: number; comment: string }) => [
        r.id,
        { score: r.score, comment: r.comment },
      ])
    );

    const matchResults: MatchResult[] = hojokinList
      .map((h) => {
        const match = scoreMap.get(h.id) as { score: number; comment: string } | undefined;
        return {
          hojokin: h,
          score: match?.score ?? 0,
          comment: match?.comment ?? "適合度を評価中",
        };
      })
      .sort((a, b) => b.score - a.score);

    return NextResponse.json({ results: matchResults });
  } catch (error) {
    console.error("Match API error:", error);
    return NextResponse.json(
      { error: "マッチング処理中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
