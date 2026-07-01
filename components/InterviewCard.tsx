"use client";

import { useRouter } from "next/navigation";

export default function InterviewCard() {

  const router = useRouter();

  return (

    <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 p-10 backdrop-blur-xl">

      <div className="grid items-center gap-8 md:grid-cols-2">

        <div>

          <h2 className="text-4xl font-bold">

            🤖 AI Mock Interview

          </h2>

          <p className="mt-5 text-lg text-slate-300 leading-relaxed">

            Your resume has been analyzed successfully.

            Now test yourself with a personalized mock interview.

            CareerTwin AI generates interview questions
            based on your resume, target company,
            technical skills and career goals.

          </p>

          <div className="mt-8 flex flex-wrap gap-3">

            <span className="rounded-full bg-cyan-500/20 px-4 py-2">

              HR

            </span>

            <span className="rounded-full bg-purple-500/20 px-4 py-2">

              Technical

            </span>

            <span className="rounded-full bg-green-500/20 px-4 py-2">

              DSA

            </span>

            <span className="rounded-full bg-yellow-500/20 px-4 py-2">

              AI Feedback

            </span>

          </div>

        </div>

        <div className="flex justify-center">

          <button

            onClick={() =>
              router.push("/interview")
            }

            className="rounded-2xl bg-cyan-500 px-10 py-5 text-2xl font-bold transition hover:scale-105 hover:bg-cyan-600"

          >

            🚀 Start AI Interview

          </button>

        </div>

      </div>

    </div>

  );

}