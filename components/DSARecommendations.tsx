interface DSARecommendationsProps {
  analysis: any;
}

export default function DSARecommendations({
  analysis,
}: DSARecommendationsProps) {

  const questions =
    analysis?.dsaTopics ?? [];

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">

      <h2 className="text-3xl font-bold mb-8">
        AI Recommended DSA Topics
      </h2>

      {questions.length === 0 ? (

        <p className="text-slate-400">
          Upload a resume to receive AI recommendations.
        </p>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">

          {questions.map(
            (question: string, index: number) => (

              <div
                key={index}
                className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 hover:border-purple-500 transition"
              >

                <h3 className="font-semibold">
                  {question}
                </h3>

                <p className="text-slate-400 text-sm mt-2">
                  Recommended based on your resume
                </p>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}