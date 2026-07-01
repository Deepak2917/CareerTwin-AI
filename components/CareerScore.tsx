"use client";

import {
  Trophy,
  Target,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

interface Props {
  analysis: any;
}

export default function CareerScore({
  analysis,
}: Props) {
  if (!analysis) return null;

  const score = analysis.careerScore ?? 0;
  const readiness =
    analysis.companyReadiness ??
    analysis.placementProbability ??
    0;
  const ats = analysis.atsScore ?? 0;

  let verdict = "Needs Improvement";
  let verdictColor = "text-red-400";

  if (readiness >= 85) {
    verdict = "Excellent";
    verdictColor = "text-green-400";
  } else if (readiness >= 70) {
    verdict = "Good";
    verdictColor = "text-cyan-400";
  } else if (readiness >= 55) {
    verdict = "Average";
    verdictColor = "text-yellow-400";
  }

  const cards = [
    {
      title: "Career Score",
      value: score,
      color: "bg-cyan-500",
      text: "text-cyan-400",
      icon: Trophy,
    },
    {
      title: "Company Readiness",
      value: readiness,
      color: "bg-purple-500",
      text: "text-purple-400",
      icon: Target,
    },
    {
      title: "ATS Score",
      value: ats,
      color: "bg-green-500",
      text: "text-green-400",
      icon: BadgeCheck,
    },
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

      <h2 className="mb-10 flex items-center justify-center gap-3 text-4xl font-bold">
        <Sparkles className="h-9 w-9 text-yellow-400" />
        Career Intelligence
      </h2>

      <div className="grid gap-6 lg:grid-cols-4">

        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className="rounded-2xl bg-slate-900 p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <div className="mb-4 flex items-center justify-center">
                <Icon className={`h-10 w-10 ${card.text}`} />
              </div>

              <p className="text-center text-slate-400">
                {card.title}
              </p>

              <h2
                className={`mt-4 text-center text-5xl font-bold ${card.text}`}
              >
                {card.value}%
              </h2>

              <div className="mt-6 h-3 w-full rounded-full bg-slate-800">
                <div
                  className={`h-full rounded-full ${card.color} transition-all duration-700`}
                  style={{
                    width: `${card.value}%`,
                  }}
                />
              </div>
            </div>
          );
        })}

        <div className="rounded-2xl bg-slate-900 p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">

          <div className="mb-4 flex justify-center">
            <Sparkles className="h-10 w-10 text-yellow-400" />
          </div>

          <p className="text-slate-400">
            Verdict
          </p>

          <h2
            className={`mt-6 text-3xl font-bold ${verdictColor}`}
          >
            {verdict}
          </h2>

          <p className="mt-4 text-sm text-slate-500">
            Overall placement readiness based on
            resume quality, ATS score, and career
            analysis.
          </p>

        </div>

      </div>

    </div>
  );
}