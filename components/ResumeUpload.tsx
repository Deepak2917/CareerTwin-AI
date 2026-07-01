"use client";

import { useState } from "react";

interface Props {
  setAnalysis: any;
  selectedCompany: string;
}

export default function ResumeUpload({
  setAnalysis,
  selectedCompany,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  }

  async function analyzeResume() {
    if (!file) {
      alert("Please select a resume.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("resume", file);
      formData.append("company", selectedCompany);

      const response = await fetch("/api/analyze-resume", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      console.log("Resume Analysis");
      console.log(data);

      setAnalysis(data);

      alert("✅ Resume analyzed successfully!");

    } catch (error) {
      console.error(error);
      alert("Server Error");
    }

    setLoading(false);
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">

      <h2 className="text-2xl font-bold mb-6">
        Upload Resume
      </h2>

      <label
        htmlFor="resume-upload"
        className="block border-2 border-dashed border-purple-500 rounded-2xl p-10 text-center cursor-pointer hover:border-cyan-400 transition"
      >
        <p className="text-lg text-slate-300">
          Drag & Drop Resume
        </p>

        <p className="text-slate-500 mt-2">
           DOCX • TXT Supported
        </p>

        <div className="mt-6">
          <span className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl">
            Browse Files
          </span>
        </div>

        <input
          id="resume-upload"
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>

      {file && (
        <div className="mt-6 bg-green-500/10 border border-green-500 rounded-xl p-4">

          <p className="text-green-400 font-semibold">
            ✅ Resume Selected
          </p>

          <p className="text-slate-300 mt-2 break-all">
            {file.name}
          </p>

          <p className="text-cyan-400 mt-3">
            Target Company: <b>{selectedCompany}</b>
          </p>

          <button
            onClick={analyzeResume}
            disabled={loading}
            className="mt-5 w-full bg-cyan-500 hover:bg-cyan-600 transition py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Analyze Resume"}
          </button>

        </div>
      )}

    </div>
  );
}