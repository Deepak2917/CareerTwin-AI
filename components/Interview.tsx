"use client";

import { useState } from "react";

interface Question {
  type: string;
  question: string;
}

interface InterviewReport {
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  confidenceScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  hiringRecommendation: string;
}

export default function Interview({
  questions,
}: {
  questions: Question[];
}) {

  const [current, setCurrent] = useState(0);

  const [answers, setAnswers] = useState<string[]>(
    new Array(questions.length).fill("")
  );

  const [loading, setLoading] = useState(false);

  const [report, setReport] =
    useState<InterviewReport | null>(null);

  const progress =
    ((current + 1) / questions.length) * 100;

  function updateAnswer(value: string) {

    const updated = [...answers];

    updated[current] = value;

    setAnswers(updated);

  }

  async function submitInterview() {

    if (
      answers.some(
        (answer) => answer.trim() === ""
      )
    ) {
      alert(
        "Please answer all questions before submitting."
      );
      return;
    }

    setLoading(true);

    try {

      const response = await fetch(
        "/api/interview/evaluate",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            questions,
            answers,
          }),
        }
      );

      const data =
        await response.json();

      setReport(data);

    } catch (error) {

      console.error(error);

      alert(
        "Interview evaluation failed."
      );

    }

    setLoading(false);

  }

  if (report) {

    return (

      <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

        <h1 className="mb-10 text-center text-5xl font-bold">

          🎉 Interview Report

        </h1>

        <div className="grid gap-6 md:grid-cols-4">

          <div className="rounded-xl bg-slate-900 p-6 text-center">

            <p>Overall</p>

            <h2 className="mt-3 text-5xl font-bold text-cyan-400">

              {report.overallScore}

            </h2>

          </div>

          <div className="rounded-xl bg-slate-900 p-6 text-center">

            <p>Technical</p>

            <h2 className="mt-3 text-5xl font-bold text-green-400">

              {report.technicalScore}

            </h2>

          </div>

          <div className="rounded-xl bg-slate-900 p-6 text-center">

            <p>Communication</p>

            <h2 className="mt-3 text-5xl font-bold text-yellow-400">

              {report.communicationScore}

            </h2>

          </div>

          <div className="rounded-xl bg-slate-900 p-6 text-center">

            <p>Confidence</p>

            <h2 className="mt-3 text-5xl font-bold text-purple-400">

              {report.confidenceScore}

            </h2>

          </div>

        </div>

        <div className="mt-8 rounded-xl border border-green-500 bg-green-500/10 p-6">

          <h3 className="mb-3 text-xl font-bold text-green-400">

            Strengths

          </h3>

          <ul className="list-disc ml-5 space-y-2">

            {report.strengths.map(
              (item, index) => (
                <li key={index}>{item}</li>
              )
            )}

          </ul>

        </div>

        <div className="mt-6 rounded-xl border border-red-500 bg-red-500/10 p-6">

          <h3 className="mb-3 text-xl font-bold text-red-400">

            Weaknesses

          </h3>

          <ul className="list-disc ml-5 space-y-2">

            {report.weaknesses.map(
              (item, index) => (
                <li key={index}>{item}</li>
              )
            )}

          </ul>

        </div>

        <div className="mt-6 rounded-xl bg-slate-900 p-6">

          <h3 className="mb-3 text-xl font-bold text-cyan-400">

            AI Suggestions

          </h3>

          <ul className="list-disc ml-5 space-y-2">

            {report.suggestions.map(
              (item, index) => (
                <li key={index}>{item}</li>
              )
            )}

          </ul>

        </div>

        <div className="mt-8 rounded-xl border border-cyan-500 bg-cyan-500/10 p-6 text-center">

          <h2 className="text-3xl font-bold">

            {report.hiringRecommendation}

          </h2>

        </div>

      </div>

    );

  }

  return (

    <div className="rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl">

      <h1 className="mb-8 text-4xl font-bold">

        AI Mock Interview

      </h1>

      <div className="mb-6">

        <div className="mb-2 flex justify-between">

          <span>

            Question {current + 1} of {questions.length}

          </span>

          <span>

            {Math.round(progress)}%

          </span>

        </div>

        <div className="h-3 rounded-full bg-slate-800">

          <div
            className="h-3 rounded-full bg-cyan-500 transition-all"
            style={{
              width: `${progress}%`,
            }}
          />

        </div>

      </div>

      <div className="mb-4 inline-block rounded-full bg-purple-600 px-4 py-2">

        {questions[current].type}

      </div>

      <h2 className="mb-8 text-3xl font-bold">

        {questions[current].question}

      </h2>

      <textarea
        rows={10}
        value={answers[current]}
        onChange={(e) =>
          updateAnswer(e.target.value)
        }
        placeholder="Write your answer here..."
        className="w-full rounded-xl border border-slate-700 bg-slate-900 p-5"
      />

      <div className="mt-8 flex justify-between">

        <button
          disabled={current === 0}
          onClick={() =>
            setCurrent(current - 1)
          }
          className="rounded-xl bg-slate-700 px-6 py-3 disabled:opacity-40"
        >

          Previous

        </button>

        {current === questions.length - 1 ? (

          <button
            onClick={submitInterview}
            disabled={loading}
            className="rounded-xl bg-green-500 px-8 py-3 font-bold hover:bg-green-600"
          >

            {loading
              ? "Evaluating..."
              : "Submit Interview"}

          </button>

        ) : (

          <button
            onClick={() =>
              setCurrent(current + 1)
            }
            className="rounded-xl bg-cyan-500 px-8 py-3 font-bold hover:bg-cyan-600"
          >

            Next →

          </button>

        )}

      </div>

    </div>

  );

}