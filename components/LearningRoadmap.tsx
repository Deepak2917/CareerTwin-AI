"use client";

import {
  CalendarDays,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

interface LearningRoadmapProps {
  analysis: any;
}

export default function LearningRoadmap({
  analysis,
}: LearningRoadmapProps) {

  const roadmap = analysis?.learningRoadmap;

  if (!roadmap) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

        <div className="flex items-center gap-3 mb-6">

          <CalendarDays className="w-10 h-10 text-cyan-400" />

          <h2 className="text-4xl font-bold">
            AI Learning Roadmap
          </h2>

        </div>

        <p className="text-slate-400 text-lg">
          Upload a resume to generate your
          personalized 4-week learning roadmap.
        </p>

      </div>
    );
  }

  const weeks = [
    {
      title: "Week 1",
      subtitle: "Fundamentals",
      color: "text-cyan-400",
      border: "border-cyan-500",
      bg: "bg-cyan-500/10",
      topics: roadmap.week1 ?? [],
    },
    {
      title: "Week 2",
      subtitle: "Intermediate",
      color: "text-green-400",
      border: "border-green-500",
      bg: "bg-green-500/10",
      topics: roadmap.week2 ?? [],
    },
    {
      title: "Week 3",
      subtitle: "Advanced",
      color: "text-yellow-400",
      border: "border-yellow-500",
      bg: "bg-yellow-500/10",
      topics: roadmap.week3 ?? [],
    },
    {
      title: "Week 4",
      subtitle: "Projects & Interviews",
      color: "text-purple-400",
      border: "border-purple-500",
      bg: "bg-purple-500/10",
      topics: roadmap.week4 ?? [],
    },
  ];

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

      <div className="flex items-center justify-center gap-3 mb-10">

        <CalendarDays className="w-10 h-10 text-cyan-400" />

        <h2 className="text-4xl font-bold">
          AI Learning Roadmap
        </h2>

      </div>

      <div className="grid gap-8 md:grid-cols-2">

        {weeks.map((week) => (

          <div
            key={week.title}
            className={`rounded-2xl border ${week.border} ${week.bg} p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl`}
          >

            <div className="flex items-center gap-3 mb-5">

              <BookOpen className={`w-8 h-8 ${week.color}`} />

              <div>

                <h3 className={`text-2xl font-bold ${week.color}`}>
                  {week.title}
                </h3>

                <p className="text-slate-400 text-sm">
                  {week.subtitle}
                </p>

              </div>

            </div>

            <ul className="space-y-4">

              {week.topics.length > 0 ? (

                week.topics.map(
                  (
                    topic: string,
                    index: number
                  ) => (

                    <li
                      key={index}
                      className="flex items-start gap-3"
                    >

                      <CheckCircle2
                        className={`mt-1 h-5 w-5 ${week.color}`}
                      />

                      <span className="text-slate-200">
                        {topic}
                      </span>

                    </li>

                  )
                )

              ) : (

                <p className="text-slate-400">
                  No topics available.
                </p>

              )}

            </ul>

          </div>

        ))}

      </div>

    </div>
  );
}