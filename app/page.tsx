"use client";

import { useState } from "react";
import InterviewCard from "@/components/InterviewCard";
import ResumeUpload from "@/components/ResumeUpload";
import SkillsDashboard from "@/components/SkillsDashboard";
import ProfileConnections from "@/components/ProfileConnections";
import CareerScore from "@/components/CareerScore";
import CodingTracker from "@/components/CodingTracker";
import GitHubTracker from "@/components/GitHubTracker";
import DSARecommendations from "@/components/DSARecommendations";
import LearningRoadmap from "@/components/LearningRoadmap";
import DownloadReport from "@/components/DownloadReport";
import ResumeSuggestions from "@/components/ResumeSuggestions";

export default function Home() {

  const [analysis, setAnalysis] = useState<any>(null);

  const [selectedCompany, setSelectedCompany] =
    useState("Amazon");

  const [profiles, setProfiles] = useState({
    github: "",
    leetcode: "",
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">

      {/* Background */}

      <div className="absolute inset-0">

        <div className="absolute top-0 left-0 h-96 w-96 rounded-full bg-purple-600/30 blur-[180px]" />

        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/30 blur-[180px]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#7c3aed22,transparent_35%),radial-gradient(circle_at_bottom_right,#06b6d422,transparent_35%)]" />

      </div>

      {/* Hero */}

      <section className="relative z-10 px-6 pt-20 text-center">

        <div className="inline-flex items-center rounded-full border border-purple-500/40 bg-purple-500/10 px-5 py-2 text-sm text-purple-300 backdrop-blur-xl">

          🚀 AI Powered Career Intelligence

        </div>

        <h1 className="mt-8 text-6xl font-extrabold tracking-tight md:text-8xl bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">

          CareerTwin AI

        </h1>

        <p className="mx-auto mt-8 max-w-3xl text-xl text-slate-300 md:text-2xl leading-relaxed">

          Upload your resume, analyze your GitHub &
          LeetCode profiles, discover skill gaps,
          improve ATS score and get an AI-powered
          learning roadmap.

        </p>

      </section>

      {/* Upload */}

      <section className="relative z-10 mx-auto mt-20 max-w-6xl px-6">

        <div className="grid gap-8 md:grid-cols-2">

          <ResumeUpload
            setAnalysis={(data: any) => {

              setAnalysis(data);

             sessionStorage.setItem(
      "careerAnalysis",
      JSON.stringify({
        company: selectedCompany,
        analysis: data,
      })
    );

    if (data.profiles) {

      setProfiles({
        github: data.profiles.github || "",
        leetcode: data.profiles.leetcode || "",
      });

    }

            }}
            selectedCompany={selectedCompany}
          />

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-xl">

            <h2 className="mb-6 text-2xl font-bold">

              Target Company

            </h2>

            <select
              value={selectedCompany}
              onChange={(e) =>
                setSelectedCompany(e.target.value)
              }
              className="w-full rounded-2xl border border-slate-700 bg-slate-900 p-4"
            >

              <option>Amazon</option>
              <option>Google</option>
              <option>Microsoft</option>
              <option>Adobe</option>
              <option>Atlassian</option>
              <option>Flipkart</option>

            </select>

            <div className="mt-10">

              <p className="text-slate-400">

                Expected Salary

              </p>

              <h2 className="mt-3 text-5xl font-bold text-cyan-400">

                {analysis
                  ? analysis.salaryPrediction
                  : "₹12–18 LPA"}

              </h2>

            </div>

            {analysis && (

              <div className="mt-10">

                <p className="text-slate-400">

                  ATS Score

                </p>

                <h2 className="mt-3 text-5xl font-bold text-green-400">

                  {analysis.atsScore}/100

                </h2>

                <div className="mt-4 h-3 w-full rounded-full bg-slate-800">

                  <div
                    className="h-full rounded-full bg-green-500 transition-all duration-700"
                    style={{
                      width: `${analysis.atsScore}%`,
                    }}
                  />

                </div>

              </div>

            )}

          </div>

        </div>

      </section>

      {analysis && (

        <section className="relative z-10 mx-auto mt-16 max-w-6xl px-6">

          <SkillsDashboard analysis={analysis} />

        </section>

      )}

      {analysis && (

        <section className="relative z-10 mx-auto mt-16 max-w-6xl px-6">

          <ProfileConnections analysis={analysis} />

        </section>

      )}

      <section className="relative z-10 mx-auto mt-16 max-w-6xl px-6">

        <CareerScore analysis={analysis} />

      </section>

      <section className="relative z-10 mx-auto mt-16 max-w-6xl px-6">

        <CodingTracker
          username={profiles.leetcode}
        />

      </section>

      <section className="relative z-10 mx-auto mt-16 max-w-6xl px-6">

        <GitHubTracker
          username={profiles.github}
        />

      </section>

      <section className="relative z-10 mx-auto mt-16 max-w-6xl px-6">

        <DSARecommendations analysis={analysis} />

      </section>

      <section className="relative z-10 mx-auto mt-16 max-w-6xl px-6">

        <LearningRoadmap analysis={analysis} />

      </section>

      {analysis && (

        <section className="relative z-10 mx-auto mt-16 max-w-6xl px-6">

          <DownloadReport analysis={analysis} />

        </section>

      )}

      <section className="relative z-10 mx-auto mt-16 mb-24 max-w-6xl px-6">

        <ResumeSuggestions analysis={analysis} />

      </section>
      {/* AI Interview */}

{analysis && (

  <section className="relative z-10 mx-auto mb-24 max-w-6xl px-6">

    <InterviewCard />

  </section>

)}

    </main>
  );
}