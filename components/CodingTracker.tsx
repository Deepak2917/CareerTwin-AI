"use client";

import { useEffect, useState } from "react";

interface Props {
  username?: string;
}

interface CodingData {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  contestRating: number;
  ranking: number;
  globalRanking: number;
  contests: number;
  codingScore: number;
  strongTopics: string[];
  weakTopics: string[];
  recommendations: string[];
  dailyGoal: string;
}

export default function CodingTracker({
  username = "",
}: Props) {
  const [leetcodeUsername, setLeetcodeUsername] =
    useState(username);

  const [loading, setLoading] = useState(false);

  const [profile, setProfile] =
    useState<CodingData | null>(null);

  useEffect(() => {
    if (username) {
      setLeetcodeUsername(username);
    }
  }, [username]);

  useEffect(() => {
    if (leetcodeUsername) {
      analyzeCodingProfile(leetcodeUsername);
    }
  }, [leetcodeUsername]);

  async function analyzeCodingProfile(
    user: string
  ) {
    if (!user) return;

    setLoading(true);

    try {
      const response = await fetch("/api/coding", {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          username: user,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data.error);
        setLoading(false);
        return;
      }

      setProfile(data);

    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl">

      <h2 className="text-4xl font-bold mb-8">
        Coding Tracker
      </h2>

      <div className="flex gap-4">

        <input
          value={leetcodeUsername}
          onChange={(e) =>
            setLeetcodeUsername(
              e.target.value
            )
          }
          placeholder="Enter LeetCode Username"
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-4"
        />

        <button
          onClick={() =>
            analyzeCodingProfile(
              leetcodeUsername
            )
          }
          disabled={loading}
          className="bg-cyan-500 hover:bg-cyan-600 px-8 rounded-xl font-bold"
        >
          {loading
            ? "Analyzing..."
            : "Analyze"}
        </button>

      </div>

      {profile && (

        <div className="mt-10 space-y-8">

          <div className="grid md:grid-cols-4 gap-5">

            <div className="bg-slate-900 rounded-xl p-6 text-center">
              <p className="text-slate-400">
                Coding Score
              </p>

              <h2 className="text-5xl font-bold text-cyan-400 mt-3">
                {profile.codingScore}
              </h2>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 text-center">
              <p className="text-slate-400">
                Solved
              </p>

              <h2 className="text-5xl font-bold text-green-400 mt-3">
                {profile.totalSolved}
              </h2>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 text-center">
              <p className="text-slate-400">
                Contest Rating
              </p>

              <h2 className="text-5xl font-bold text-purple-400 mt-3">
                {profile.contestRating}
              </h2>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 text-center">
              <p className="text-slate-400">
                Global Rank
              </p>

              <h2 className="text-4xl font-bold text-orange-400 mt-4">
                {profile.globalRanking}
              </h2>
            </div>

          </div>

          <div className="grid md:grid-cols-3 gap-5">

            <div className="bg-green-900/20 border border-green-500 rounded-xl p-6 text-center">

              <p className="text-green-400">
                Easy
              </p>

              <h2 className="text-4xl font-bold mt-3">
                {profile.easySolved}
              </h2>

            </div>

            <div className="bg-yellow-900/20 border border-yellow-500 rounded-xl p-6 text-center">

              <p className="text-yellow-400">
                Medium
              </p>

              <h2 className="text-4xl font-bold mt-3">
                {profile.mediumSolved}
              </h2>

            </div>

            <div className="bg-red-900/20 border border-red-500 rounded-xl p-6 text-center">

              <p className="text-red-400">
                Hard
              </p>

              <h2 className="text-4xl font-bold mt-3">
                {profile.hardSolved}
              </h2>

            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-slate-900 rounded-xl p-6">

              <h3 className="text-green-400 font-bold mb-4">
                Strong Topics
              </h3>

              <ul className="list-disc ml-5">

                {(profile.strongTopics ?? []).map(
                  (item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  )
                )}

              </ul>

            </div>

            <div className="bg-slate-900 rounded-xl p-6">

              <h3 className="text-red-400 font-bold mb-4">
                Weak Topics
              </h3>

              <ul className="list-disc ml-5">

                {(profile.weakTopics ?? []).map(
                  (item, index) => (
                    <li key={index}>
                      {item}
                    </li>
                  )
                )}

              </ul>

            </div>

          </div>

          <div className="bg-slate-900 rounded-xl p-6">

            <h3 className="text-cyan-400 font-bold mb-4">
              AI Recommendations
            </h3>

            <ul className="list-disc ml-6">

              {(profile.recommendations ?? []).map(
                (item, index) => (
                  <li key={index}>
                    {item}
                  </li>
                )
              )}

            </ul>

            <div className="mt-8 bg-cyan-500/10 border border-cyan-500 rounded-xl p-5">

              <h3 className="text-cyan-400 font-bold">
                Today's Goal
              </h3>

              <p className="mt-2">
                {profile.dailyGoal}
              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}