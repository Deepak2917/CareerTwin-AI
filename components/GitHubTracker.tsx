"use client";

import { useEffect, useState } from "react";

interface Props {
  username?: string;
}

interface Repository {
  name: string;
  stars: number;
  url: string;
  language: string;
}

interface GitHubProfile {
  username: string;
  name: string;
  avatar: string;
  followers: number;
  following: number;
  publicRepos: number;
  stars: number;
  topLanguages: string[];
  topRepositories: Repository[];
  portfolioScore: number;
  suggestions: string[];
}

export default function GitHubTracker({
  username = "",
}: Props) {

  const [githubUsername, setGithubUsername] =
    useState(username);

  const [loading, setLoading] =
    useState(false);

  const [profile, setProfile] =
    useState<GitHubProfile | null>(null);

  useEffect(() => {
    if (username) {
      setGithubUsername(username);
    }
  }, [username]);

  useEffect(() => {
    if (githubUsername) {
      analyzeGitHub(githubUsername);
    }
  }, [githubUsername]);

  async function analyzeGitHub(user: string) {

    if (!user) return;

    setLoading(true);

    try {

      const response = await fetch("/api/github", {

        method: "POST",

        headers: {
          "Content-Type": "application/json",
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

    } catch (err) {

      console.error(err);

    }

    setLoading(false);

  }

  return (

    <div className="bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-xl">

      <h2 className="text-4xl font-bold mb-8">

        GitHub Intelligence

      </h2>

      <div className="flex gap-4">

        <input
          value={githubUsername}
          onChange={(e) =>
            setGithubUsername(e.target.value)
          }
          placeholder="GitHub Username"
          className="flex-1 bg-slate-900 border border-slate-700 rounded-xl p-4"
        />

        <button
          onClick={() =>
            analyzeGitHub(githubUsername)
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

          <div className="flex items-center gap-6">

            <img
              src={profile.avatar}
              alt=""
              className="w-24 h-24 rounded-full"
            />

            <div>

              <h2 className="text-3xl font-bold">

                {profile.name}

              </h2>

              <p className="text-slate-400">

                @{profile.username}

              </p>

            </div>

          </div>

          <div className="grid md:grid-cols-4 gap-5">

            <div className="bg-slate-900 rounded-xl p-6 text-center">

              <p className="text-slate-400">
                Portfolio Score
              </p>

              <h2 className="text-5xl text-cyan-400 font-bold mt-3">
                {profile.portfolioScore}
              </h2>

            </div>

            <div className="bg-slate-900 rounded-xl p-6 text-center">

              <p className="text-slate-400">
                Repositories
              </p>

              <h2 className="text-5xl text-green-400 font-bold mt-3">
                {profile.publicRepos}
              </h2>

            </div>

            <div className="bg-slate-900 rounded-xl p-6 text-center">

              <p className="text-slate-400">
                Followers
              </p>

              <h2 className="text-5xl text-purple-400 font-bold mt-3">
                {profile.followers}
              </h2>

            </div>

            <div className="bg-slate-900 rounded-xl p-6 text-center">

              <p className="text-slate-400">
                Stars
              </p>

              <h2 className="text-5xl text-yellow-400 font-bold mt-3">
                {profile.stars}
              </h2>

            </div>

          </div>

          <div className="grid md:grid-cols-2 gap-6">

            <div className="bg-slate-900 rounded-xl p-6">

              <h3 className="text-green-400 font-bold mb-4">
                Top Languages
              </h3>

              <ul className="list-disc ml-5">

                {(profile.topLanguages ?? []).map(
                  (lang, index) => (
                    <li key={index}>
                      {lang}
                    </li>
                  )
                )}

              </ul>

            </div>

            <div className="bg-slate-900 rounded-xl p-6">

              <h3 className="text-cyan-400 font-bold mb-4">
                AI Suggestions
              </h3>

              <ul className="list-disc ml-5">

                {(profile.suggestions ?? []).map(
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

            <h3 className="text-yellow-400 font-bold mb-5">
              ⭐ Top Repositories
            </h3>

            {(profile.topRepositories ?? []).map(
              (repo, index) => (

                <div
                  key={index}
                  className="border-b border-slate-700 py-4"
                >

                  <h4 className="font-semibold">
                    {repo.name}
                  </h4>

                  <p className="text-slate-400">
                    Language: {repo.language}
                  </p>

                  <p className="text-slate-400">
                    ⭐ {repo.stars}
                  </p>

                  <a
                    href={repo.url}
                    target="_blank"
                    className="text-cyan-400 underline"
                  >
                    View Repository
                  </a>

                </div>

              )
            )}

          </div>

        </div>

      )}

    </div>

  );

}