"use client";

import {
  FileText,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface ResumeSuggestionsProps {
  analysis: any;
}

export default function ResumeSuggestions({
  analysis,
}: ResumeSuggestionsProps) {

  const suggestions =
    analysis?.resumeSuggestions ?? [];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

      <div className="flex items-center justify-center gap-3 mb-10">

        <FileText className="w-10 h-10 text-green-400" />

        <h2 className="text-4xl font-bold">
          Resume Improvement Suggestions
        </h2>

      </div>

      {suggestions.length === 0 ? (

        <div className="rounded-2xl bg-slate-900 p-8 text-center">

          <Sparkles className="mx-auto mb-5 h-12 w-12 text-cyan-400" />

          <p className="text-lg text-slate-300">
            Upload a resume to receive AI-powered
            resume improvement suggestions.
          </p>

        </div>

      ) : (

        <div className="grid gap-5">

          {suggestions.map(
            (
              item: string,
              index: number
            ) => (

              <div
                key={index}
                className="flex items-start gap-4 rounded-2xl border border-green-500/30 bg-green-500/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-green-400 hover:shadow-xl"
              >

                <CheckCircle2 className="mt-1 h-7 w-7 text-green-400 flex-shrink-0" />

                <div>

                  <h3 className="font-semibold text-green-300">
                    Suggestion {index + 1}
                  </h3>

                  <p className="mt-2 text-slate-200 leading-7">
                    {item}
                  </p>

                </div>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}