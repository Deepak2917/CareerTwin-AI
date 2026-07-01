"use client";

import { useEffect, useState } from "react";
import Interview from "@/components/Interview";

export default function InterviewPage() {
  const [loading, setLoading] = useState(false);

  const [questions, setQuestions] = useState<any[]>([]);

  const [company, setCompany] =
    useState("");

  const [skills, setSkills] =
    useState<string[]>([]);

  const [missingSkills, setMissingSkills] =
    useState<string[]>([]);

  const [careerSuggestions, setCareerSuggestions] =
    useState<string[]>([]);

  useEffect(() => {
    const saved =
      sessionStorage.getItem(
        "careerAnalysis"
      );

    if (!saved) return;

    const parsed = JSON.parse(saved);

    setCompany(parsed.company);

    setSkills(
      parsed.analysis.skills || []
    );

    setMissingSkills(
      parsed.analysis.missingSkills || []
    );

    setCareerSuggestions(
      parsed.analysis.careerSuggestions ||
        []
    );
  }, []);

  async function generateInterview() {

    if (!company) {

      alert(
        "Please analyze your resume first."
      );

      return;

    }

    setLoading(true);

    try {

      const response = await fetch(
        "/api/interview",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            targetCompany: company,

            skills,

            missingSkills,

            careerSuggestions,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        alert(
          data.error ||
            "Failed to generate interview."
        );

        setLoading(false);

        return;

      }

      setQuestions(data);

    } catch (error) {

      console.error(error);

      alert(
        "Failed to generate interview."
      );

    }

    setLoading(false);

  }

  if (questions.length > 0) {

    return (

      <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">

        <div className="mx-auto max-w-6xl">

          <Interview questions={questions} />

        </div>

      </main>

    );

  }

  return (

    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">

      <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

        <div className="text-center">

          <h1 className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-5xl font-bold text-transparent">

            🤖 AI Mock Interview

          </h1>

          <p className="mt-6 text-lg text-slate-300">

            Experience an AI-powered mock interview
            personalized using your resume analysis.

          </p>

          {company && (

            <div className="mt-6 inline-block rounded-full bg-cyan-500/20 px-6 py-2 text-cyan-400">

              Target Company :
              <span className="ml-2 font-bold">

                {company}

              </span>

            </div>

          )}

        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">

          <div className="rounded-2xl bg-slate-900 p-6">

            <h2 className="mb-4 text-xl font-bold text-cyan-400">

              Interview Includes

            </h2>

            <ul className="space-y-3 text-slate-300">

              <li>✅ HR Questions</li>

              <li>✅ Resume Discussion</li>

              <li>✅ Technical Questions</li>

              <li>✅ DSA Question</li>

              <li>✅ AI Evaluation</li>

            </ul>

          </div>

          <div className="rounded-2xl bg-slate-900 p-6">

            <h2 className="mb-4 text-xl font-bold text-purple-400">

              Evaluation Criteria

            </h2>

            <ul className="space-y-3 text-slate-300">

              <li>⭐ Technical Knowledge</li>

              <li>⭐ Communication</li>

              <li>⭐ Confidence</li>

              <li>⭐ Problem Solving</li>

              <li>⭐ Hiring Recommendation</li>

            </ul>

          </div>

        </div>

        <div className="mt-12 text-center">

          <button

            onClick={generateInterview}

            disabled={loading}

            className="rounded-xl bg-cyan-500 px-10 py-4 text-xl font-bold transition hover:bg-cyan-600 disabled:opacity-50"

          >

            {loading
              ? "Generating Interview..."
              : "Start AI Interview"}

          </button>

        </div>

      </div>

    </main>

  );

}