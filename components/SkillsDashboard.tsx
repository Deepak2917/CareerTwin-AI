"use client";

import { useState } from "react";
import {
  Brain,
  CheckCircle2,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Props {
  analysis: any;
}

export default function SkillsDashboard({
  analysis,
}: Props) {

  if (!analysis) return null;

  const skills = analysis.skills ?? [];
  const missingSkills = analysis.missingSkills ?? [];

  const [showAllSkills, setShowAllSkills] =
    useState(false);

  const [showAllMissing, setShowAllMissing] =
    useState(false);

  const visibleSkills = showAllSkills
    ? skills
    : skills.slice(0, 9);

  const visibleMissing = showAllMissing
    ? missingSkills
    : missingSkills.slice(0, 9);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

      <div className="flex items-center justify-center gap-3 mb-10">

        <Brain className="h-10 w-10 text-cyan-400" />

        <h2 className="text-4xl font-bold">
          Skills Dashboard
        </h2>

      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Existing Skills */}

        <div className="rounded-2xl bg-slate-900 p-8">

          <div className="flex items-center gap-3 mb-6">

            <CheckCircle2 className="h-8 w-8 text-green-400" />

            <h3 className="text-2xl font-bold text-green-400">
              Existing Skills
            </h3>

          </div>

          {skills.length === 0 ? (

            <p className="text-slate-400">
              No skills detected.
            </p>

          ) : (

            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                {visibleSkills.map(
                  (
                    skill: string,
                    index: number
                  ) => (

                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 p-3 hover:bg-green-500/20 transition-all"
                    >

                      <CheckCircle2
                        size={16}
                        className="text-green-400 flex-shrink-0"
                      />

                      <span className="text-sm break-words">
                        {skill}
                      </span>

                    </div>

                  )
                )}

              </div>

              {skills.length > 9 && (

                <button
                  onClick={() =>
                    setShowAllSkills(!showAllSkills)
                  }
                  className="mt-6 flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
                >

                  {showAllSkills ? (
                    <>
                      <ChevronUp size={18} />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown size={18} />
                      Show {skills.length - 9} More
                    </>
                  )}

                </button>

              )}

            </>

          )}

        </div>

        {/* Missing Skills */}

        <div className="rounded-2xl bg-slate-900 p-8">

          <div className="flex items-center gap-3 mb-6">

            <AlertTriangle className="h-8 w-8 text-red-400" />

            <h3 className="text-2xl font-bold text-red-400">
              Missing Skills
            </h3>

          </div>

          {missingSkills.length === 0 ? (

            <p className="text-slate-400">
              No missing skills.
            </p>

          ) : (

            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">

                {visibleMissing.map(
                  (
                    skill: string,
                    index: number
                  ) => (

                    <div
                      key={index}
                      className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 hover:bg-red-500/20 transition-all"
                    >

                      <AlertTriangle
                        size={16}
                        className="text-red-400 flex-shrink-0"
                      />

                      <span className="text-sm break-words">
                        {skill}
                      </span>

                    </div>

                  )
                )}

              </div>

              {missingSkills.length > 9 && (

                <button
                  onClick={() =>
                    setShowAllMissing(!showAllMissing)
                  }
                  className="mt-6 flex items-center gap-2 text-cyan-400 hover:text-cyan-300"
                >

                  {showAllMissing ? (
                    <>
                      <ChevronUp size={18} />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown size={18} />
                      Show {missingSkills.length - 9} More
                    </>
                  )}

                </button>

              )}

            </>

          )}

        </div>

      </div>

    </div>
  );
}