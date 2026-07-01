interface Props {
  analysis: any;
}

export default function ProfileConnections({
  analysis,
}: Props) {
  const profiles = analysis?.profiles ?? {};

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <h2 className="mb-8 text-4xl font-bold">
        Connected Profiles
      </h2>

      <div className="space-y-5">

        {/* GitHub */}

        <div className="flex items-center justify-between rounded-2xl bg-slate-900 p-6">

          <div>

            <h3 className="text-2xl font-semibold">
              GitHub
            </h3>

            <p className="mt-1 text-slate-400">
              {profiles.github || "Not Found"}
            </p>

          </div>

          {profiles.github ? (

            <span className="rounded-xl bg-green-500/20 px-5 py-2 font-semibold text-green-400">
              ✅ Connected
            </span>

          ) : (

            <button className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold hover:bg-cyan-600">
              Connect
            </button>

          )}

        </div>

        {/* LeetCode */}

        <div className="flex items-center justify-between rounded-2xl bg-slate-900 p-6">

          <div>

            <h3 className="text-2xl font-semibold">
              LeetCode
            </h3>

            <p className="mt-1 text-slate-400">
              {profiles.leetcode || "Not Found"}
            </p>

          </div>

          {profiles.leetcode ? (

            <span className="rounded-xl bg-green-500/20 px-5 py-2 font-semibold text-green-400">
              ✅ Connected
            </span>

          ) : (

            <button className="rounded-xl bg-cyan-500 px-6 py-3 font-semibold hover:bg-cyan-600">
              Connect
            </button>

          )}

        </div>

      </div>

    </div>
  );
}