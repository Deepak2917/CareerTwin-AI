import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        {
          error: "GitHub username required.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================
    // Fetch Profile
    // ==========================

    const profileRes = await fetch(
      `https://api.github.com/users/${username}`
    );

    if (!profileRes.ok) {
      return NextResponse.json(
        {
          error: "GitHub user not found.",
        },
        {
          status: 404,
        }
      );
    }

    const profile = await profileRes.json();

    // ==========================
    // Fetch Repositories
    // ==========================

    const repoRes = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
    );

    const repos = await repoRes.json();

    let totalStars = 0;

    const languageMap: Record<string, number> = {};

    if (Array.isArray(repos)) {
      repos.forEach((repo: any) => {
        totalStars += repo.stargazers_count || 0;

        if (repo.language) {
          languageMap[repo.language] =
            (languageMap[repo.language] || 0) + 1;
        }
      });
    }

    // ==========================
    // Top Languages
    // ==========================

    const topLanguages = Object.entries(languageMap)
      .sort((a, b) => Number(b[1]) - Number(a[1]))
      .slice(0, 5)
      .map((item) => item[0]);

    // ==========================
    // Top Repositories
    // ==========================

    const topRepositories = Array.isArray(repos)
      ? [...repos]
          .sort(
            (a: any, b: any) =>
              b.stargazers_count - a.stargazers_count
          )
          .slice(0, 5)
          .map((repo: any) => ({
            name: repo.name,
            stars: repo.stargazers_count,
            url: repo.html_url,
            language: repo.language || "Unknown",
          }))
      : [];

    // ==========================
    // Ask Groq
    // ==========================

    const completion =
      await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",

        temperature: 0.2,

        messages: [
          {
            role: "system",
            content: `
You are CareerTwin AI.

Analyze the GitHub profile.

Return ONLY JSON.

{
"portfolioScore":0,
"suggestions":[]
}
`,
          },
          {
            role: "user",
            content: `
Repositories: ${profile.public_repos}

Followers: ${profile.followers}

Stars: ${totalStars}

Languages:

${topLanguages.join(", ")}
`,
          },
        ],
      });

    const response =
      completion.choices[0].message.content ?? "";

    let aiResult: any = {};

    try {
      const start = response.indexOf("{");

      const end = response.lastIndexOf("}");

      aiResult = JSON.parse(
        response.substring(start, end + 1)
      );
    } catch {
      aiResult = {};
    }

    if (!aiResult.portfolioScore)
      aiResult.portfolioScore = 70;

    if (!Array.isArray(aiResult.suggestions)) {
      aiResult.suggestions = [
        "Build more real-world projects",
        "Improve README documentation",
        "Pin your best repositories",
        "Maintain consistent contributions",
        "Use GitHub Actions",
      ];
    }

    // ==========================
    // Response
    // ==========================

    return NextResponse.json({
      username,

      name: profile.name || username,

      avatar: profile.avatar_url,

      followers: profile.followers,

      following: profile.following,

      publicRepos: profile.public_repos,

      stars: totalStars,

      topLanguages:
        topLanguages.length > 0
          ? topLanguages
          : ["JavaScript"],

      topRepositories,

      portfolioScore:
        aiResult.portfolioScore,

      suggestions:
        aiResult.suggestions,
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "GitHub analysis failed.",
      },
      {
        status: 500,
      }
    );
  }
}