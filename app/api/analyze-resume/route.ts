import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import mammoth from "mammoth";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

async function extractResumeText(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  // TXT
  if (extension === "txt") {
    return await file.text();
  }

  // DOCX
  if (extension === "docx") {
    const buffer = Buffer.from(await file.arrayBuffer());

    const result = await mammoth.extractRawText({
      buffer,
    });

    return result.value;
  }

  throw new Error("Only TXT and DOCX files are supported.");
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const file = formData.get("resume") as File;
    const company =
  (formData.get("company") as string) || "Amazon";

    if (!file) {
      return NextResponse.json(
        {
          error: "No resume uploaded",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------
    // Resume Text
    // -----------------------------

    const resumeText = await extractResumeText(file);

    // -----------------------------
    // Extract Profile Links
    // -----------------------------

    const githubMatch = resumeText.match(
      /github\.com\/([A-Za-z0-9_-]+)/i
    );

    const leetcodeMatch = resumeText.match(
      /leetcode\.com\/(?:u\/|profile\/)?([A-Za-z0-9_-]+)/i
    );

    

    const githubUsername =
      githubMatch?.[1] ?? "";

    const leetcodeUsername =
      leetcodeMatch?.[1] ?? "";

   

    // -----------------------------
    // AI Analysis
    // -----------------------------

    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        temperature: 0.2,

        messages: [
          {
            role: "system",
            content: `
You are CareerTwin AI.

Analyze the uploaded resume carefully.

The candidate wants to get placed in the TARGET COMPANY provided.

While calculating salaryPrediction,
estimate the expected fresher CTC range for THAT company
based on:

• Resume quality
• Skills
• Projects
• ATS score
• Company hiring standards

Examples:

Amazon → 10–18 LPA

Google → 18–35 LPA

Microsoft → 12–22 LPA

Adobe → 12–20 LPA

Atlassian → 18–30 LPA

Flipkart → 8–18 LPA

Return realistic salary ranges.

Do not use the same salary for every company.

Return ONLY valid JSON.

Do not return markdown.
Do not return explanations.
Do not use triple backticks.

Return this JSON format exactly:

{
  "name":"",
  "careerScore":0,
  "placementProbability":0,
  "companyReadiness":0,
  "skills":[],
  "missingSkills":[],
  "salaryPrediction":"",
  "careerSuggestions":[],
  "dsaTopics":[],
  "atsScore":0,
  "resumeSuggestions":[],
  "learningRoadmap":{
    "week1":[],
    "week2":[],
    "week3":[],
    "week4":[]
  }
}
`,
          },
         {
  role: "user",
  content: `
Target Company:
${company}

Resume:

${resumeText}
`,
},
        ],
      });

    const response =
      completion.choices[0].message.content ?? "";

    console.log("Groq Response:");
    console.log(response);

    let json: any = {};

    try {
      const start = response.indexOf("{");

      const end = response.lastIndexOf("}");

      json = JSON.parse(
        response.substring(start, end + 1)
      );
    } catch (error) {
      console.error("JSON Parse Error");

      json = {};
    }

    // -----------------------------
    // Defaults
    // -----------------------------

    json.name ??= "";

    json.careerScore ??= 70;

    json.placementProbability ??= 75;
    json.companyReadiness ??= 75;

    json.skills ??= [];

    json.missingSkills ??= [];

    json.salaryPrediction ??= "8-12 LPA";

    json.careerSuggestions ??= [];

    json.dsaTopics ??= [];

    json.atsScore ??= 80;

    json.resumeSuggestions ??= [];

    json.learningRoadmap ??= {
      week1: [],
      week2: [],
      week3: [],
      week4: [],
    };

    // -----------------------------
    // Return Response
    // -----------------------------

    return NextResponse.json({
      ...json,

      profiles: {
        github: githubUsername,

        leetcode: leetcodeUsername,

     
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Resume analysis failed",

        details:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}