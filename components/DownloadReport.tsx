"use client";

import jsPDF from "jspdf";
import { Download } from "lucide-react";

interface Props {
  analysis: any;
}

export default function DownloadReport({
  analysis,
}: Props) {
  if (!analysis) return null;

  function addSection(
    doc: jsPDF,
    title: string,
    items: string[],
    y: number
  ) {
    doc.setFontSize(15);
    doc.setTextColor(41, 98, 255);
    doc.text(title, 20, y);

    y += 8;

    doc.setFontSize(11);
    doc.setTextColor(40, 40, 40);

    if (items.length === 0) {
      doc.text("No data available.", 25, y);
      return y + 10;
    }

    items.forEach((item) => {
      if (y > 275) {
        doc.addPage();
        y = 20;
      }

      const lines = doc.splitTextToSize(
        "• " + item,
        170
      );

      doc.text(lines, 25, y);

      y += lines.length * 6;
    });

    return y + 8;
  }

  function downloadPDF() {
    const doc = new jsPDF();

    let y = 20;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(30, 30, 30);

    doc.text("CareerTwin AI Career Report", 20, y);

    y += 12;

    doc.setDrawColor(0, 180, 255);
    doc.line(20, y, 190, y);

    y += 12;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    doc.text(
      `Candidate : ${analysis.name || "Unknown"}`,
      20,
      y
    );

    y += 8;

    doc.text(
      `Career Score : ${
        analysis.careerScore ?? 0
      } /100`,
      20,
      y
    );

    y += 8;

    doc.text(
      `ATS Score : ${
        analysis.atsScore ?? 0
      } /100`,
      20,
      y
    );

    y += 8;

    doc.text(
      `Placement Probability : ${
        analysis.placementProbability ?? 0
      }%`,
      20,
      y
    );

    y += 8;

    doc.text(
      `Salary Prediction : ${
        analysis.salaryPrediction ??
        "Not Available"
      }`,
      20,
      y
    );

    y += 15;

    y = addSection(
      doc,
      "Skills",
      analysis.skills ?? [],
      y
    );

    y = addSection(
      doc,
      "Missing Skills",
      analysis.missingSkills ?? [],
      y
    );

    y = addSection(
      doc,
      "Resume Suggestions",
      analysis.resumeSuggestions ?? [],
      y
    );

    y = addSection(
      doc,
      "Career Suggestions",
      analysis.careerSuggestions ?? [],
      y
    );

    doc.save("CareerTwin_Report.pdf");
  }

  return (
    <div className="flex justify-center">

      <button
        onClick={downloadPDF}
        className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-green-500 to-cyan-500 px-10 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      >
        <Download size={22} />

        Download Career Report

      </button>

    </div>
  );
}