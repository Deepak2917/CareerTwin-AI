import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { questions, answers } = await request.json();

    if (
      !questions ||
      !answers ||
      questions.length !== answers.length
    ) {
      return NextResponse.json(
        {
          error: "Invalid interview data.",
        },
        {
          status: 400,
        }
      );
    }

    const interview = questions
      .map(
        (q: any, index: number) => `
Question ${index + 1}
Type: ${q.type}

Question:
${q.question}

Candidate Answer:
${answers[index]}
`
      )
      .join("\n\n----------------------------\n\n");

    const prompt = `
You are a Senior Software Engineering Interviewer.

Evaluate the COMPLETE interview.

Interview:

${interview}

Evaluate the candidate across:

1. Technical Knowledge
2. Communication Skills
3. Confidence
4. Problem Solving

Return ONLY valid JSON.

{
  "overallScore":0,
  "technicalScore":0,
  "communicationScore":0,
  "confidenceScore":0,
  "strengths":[],
  "weaknesses":[],
  "suggestions":[],
  "hiringRecommendation":""
}

Rules:

overallScore -> out of 100

technicalScore -> out of 100

communicationScore -> out of 100

confidenceScore -> out of 100

strengths -> exactly 5 points

weaknesses -> exactly 5 points

suggestions -> exactly 5 points

hiringRecommendation should be one of:

"Hire"

"Borderline"

"Needs Improvement"
`;

    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        temperature: 0.2,

        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });

    const response =
      completion.choices[0].message.content ?? "";

    console.log(response);

    const start = response.indexOf("{");
    const end = response.lastIndexOf("}");

    if (start === -1 || end === -1) {
      throw new Error("Invalid JSON returned.");
    }

    let report = JSON.parse(
      response.substring(start, end + 1)
    );

    report.overallScore ??= 75;
    report.technicalScore ??= 75;
    report.communicationScore ??= 75;
    report.confidenceScore ??= 75;

    report.strengths ??= [];
    report.weaknesses ??= [];
    report.suggestions ??= [];

    report.hiringRecommendation ??=
      "Needs Improvement";

    return NextResponse.json(report);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Interview evaluation failed.",
      },
      {
        status: 500,
      }
    );
  }
}