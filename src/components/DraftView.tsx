"use client";

import { useState } from "react";
import { Check, Copy, FileText } from "lucide-react";
import { DraftResult } from "@/src/types";

interface DraftViewProps {
  draft: DraftResult;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-500" />
          コピーしました
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          コピー
        </>
      )}
    </button>
  );
}

export default function DraftView({ draft }: DraftViewProps) {
  const allContent = draft.sections
    .map((s) => `【${s.title}】\n${s.content}`)
    .join("\n\n");

  return (
    <div className="p-5 bg-slate-50">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-slate-800 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          {draft.hojokinName} 申請書下書き
        </h4>
        <CopyButton text={allContent} />
      </div>

      <div className="space-y-4">
        {draft.sections.map((section, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 bg-slate-50">
              <h5 className="text-sm font-semibold text-slate-700">{section.title}</h5>
              <CopyButton text={section.content} />
            </div>
            <textarea
              readOnly
              value={section.content}
              rows={6}
              className="w-full px-4 py-3 text-sm text-slate-700 leading-relaxed resize-none focus:outline-none bg-white"
            />
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-400 mt-3 text-center">
        ※ AIが生成した下書きです。実際の申請前に内容を確認・修正してください。
      </p>
    </div>
  );
}
