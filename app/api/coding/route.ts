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
        { error: "Username is required." },
        { status: 400 }
      );
    }

    const query = `
    query userProfile($username: String!) {

      matchedUser(username: $username) {

        username

        profile {
          ranking
        }

        submitStats {
          acSubmissionNum {
            difficulty
            count
          }
        }
      }

      userContestRanking(username: $username) {
        rating
        globalRanking
        attendedContestsCount
      }

    }
    `;

    const lcResponse = await fetch(
      "https://leetcode.com/graphql",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: {
            username,
          },
        }),
      }
    );

    const lcData = await lcResponse.json();

    if (!lcData.data?.matchedUser) {
      return NextResponse.json(
        {
          error: "LeetCode user not found.",
        },
        {
          status: 404,
        }
      );
    }

    const stats =
      lcData.data.matchedUser.submitStats.acSubmissionNum;

    const easy =
      stats.find((x: any) => x.difficulty === "Easy")?.count ?? 0;

    const medium =
      stats.find((x: any) => x.difficulty === "Medium")?.count ?? 0;

    const hard =
      stats.find((x: any) => x.difficulty === "Hard")?.count ?? 0;

    const total =
      stats.find((x: any) => x.difficulty === "All")?.count ?? 0;

    const ranking =
      lcData.data.matchedUser.profile.ranking ?? 0;

    const contest =
      lcData.data.userContestRanking;

    const rating =
      contest?.rating ?? 0;

    const globalRanking =
      contest?.globalRanking ?? 0;

    const contests =
      contest?.attendedContestsCount ?? 0;

    const ai =
      await groq.chat.completions.create({

        model: "llama-3.3-70b-versatile",

        temperature: 0.2,

        messages: [
          {
            role: "system",
            content: `
Return ONLY JSON.

{
"codingScore":0,
"strongTopics":[],
"weakTopics":[],
"recommendations":[],
"dailyGoal":""
}
`,
          },
          {
            role: "user",
            content: `
Easy ${easy}

Medium ${medium}

Hard ${hard}

Contest Rating ${rating}

Global Ranking ${globalRanking}
`,
          },
        ],
      });

    const response =
      ai.choices[0].message.content ?? "";

    const start =
      response.indexOf("{");

    const end =
      response.lastIndexOf("}");

    const json =
      JSON.parse(
        response.substring(start, end + 1)
      );

    return NextResponse.json({

      username,

      totalSolved: total,

      easySolved: easy,

      mediumSolved: medium,

      hardSolved: hard,

      contestRating: Math.round(rating),

      ranking,

      globalRanking,

      contests,

      ...json,

    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to analyze profile.",
      },
      {
        status: 500,
      }
    );
  }
}