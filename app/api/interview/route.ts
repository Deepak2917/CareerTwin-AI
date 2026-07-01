import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      skills,
      missingSkills,
      careerSuggestions,
      targetCompany,
    } = body;

    const prompt = `
You are an expert technical interviewer.

Target Company:
${targetCompany}

Candidate Skills:
${skills?.join(", ")}

Missing Skills:
${missingSkills?.join(", ")}

Career Suggestions:
${careerSuggestions?.join(", ")}

Generate EXACTLY 5 interview questions.

Rules:
- 1 HR question
- 1 Resume/Project question
- 2 Technical questions
- 1 DSA question

Return ONLY valid JSON.

[
  {
    "type":"HR",
    "question":"..."
  }
]
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const response =
      completion.choices[0].message.content ?? "";

    const start = response.indexOf("[");
    const end = response.lastIndexOf("]");

    if (start === -1 || end === -1) {
      throw new Error("Invalid JSON returned by AI");
    }

    const questions = JSON.parse(
      response.substring(start, end + 1)
    );

    return NextResponse.json(questions);

  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to generate interview questions",
      },
      {
        status: 500,
      }
    );
  }
}