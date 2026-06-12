import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { POINTS_MAP } from "../data/users";

export default function Leaderboard() {
  const { leaderboard, currentUser } = useApp();

  const topThree = leaderboard.slice(0, 3);

  const medals = [
    { bg: "from-amber-300 to-yellow-500", ring: "ring-amber-200/50", label: "🥇", shadow: "0 8px 30px rgba(245,158,11,0.3)" },
    { bg: "from-slate-300 to-slate-500", ring: "ring-slate-200/50", label: "🥈", shadow: "0 8px 30px rgba(148,163,184,0.3)" },
    { bg: "from-orange-300 to-amber-700", ring: "ring-orange-200/50", label: "🥉", shadow: "0 8px 30px rgba(217,119,6,0.3)" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(245,158,11,0.95), rgba(234,88,12,0.9), rgba(236,72,153,0.85))",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(255,255,255,0.15)",
          boxShadow: "0 20px 60px rgba(245,158,11,0.25)",
        }}
      >
        {/* Animated background orbs */}
        <motion.div
          className="absolute -right-20 -top-20 w-72 h-72 rounded-full blur-3xl"
          style={{ background: "rgba(255,255,255,0.15)" }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative p-6 md:p-8 text-white">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            🏆 Leaderboard
          </h1>
          <p className="text-white/80 mt-1">
            Top members by earned achievement points.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-xs md:text-sm">
            {[
              { label: "Beginner", pts: POINTS_MAP.Beginner, bg: "rgba(52,211,153,0.15)", border: "rgba(52,211,153,0.3)" },
              { label: "Intermediate", pts: POINTS_MAP.Intermediate, bg: "rgba(56,189,248,0.15)", border: "rgba(56,189,248,0.3)" },
              { label: "Advanced", pts: POINTS_MAP.Advanced, bg: "rgba(244,114,182,0.15)", border: "rgba(244,114,182,0.3)" },
            ].map((badge) => (
              <motion.span
                key={badge.label}
                className="px-3 py-1 rounded-full border"
                style={{ background: badge.bg, borderColor: badge.border }}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                {badge.label} · {badge.pts} pts
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Top 3 podium */}
      {topThree.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-4"
        >
          {/* 2nd */}
          {topThree[1] && <TopCard entry={topThree[1]} rank={1} medal={medals[1]} />}
          {/* 1st (featured) */}
          {topThree[0] && <TopCard entry={topThree[0]} rank={0} medal={medals[0]} featured />}
          {/* 3rd */}
          {topThree[2] && <TopCard entry={topThree[2]} rank={2} medal={medals[2]} />}
        </motion.div>
      )}

      {/* Full rankings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl border overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(200,200,200,0.4)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
        }}
      >
        <div className="p-5 border-b" style={{ borderColor: "rgba(200,200,200,0.2)" }}>
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Full Rankings</h2>
            <span className="text-xs text-slate-500 px-3 py-1 rounded-full" style={{ background: "rgba(0,0,0,0.04)" }}>
              {leaderboard.length} members
            </span>
          </div>
        </div>

        {leaderboard.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 text-center text-slate-500"
          >
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-4xl mb-2"
            >
              🏅
            </motion.div>
            No points awarded yet.
          </motion.div>
        ) : (
          <ul>
            {leaderboard.map((entry, idx) => {
              const isMe = currentUser?.username === entry.username;
              return (
                <motion.li
                  key={entry.username}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(idx * 0.03, 0.5) }}
                  className={`px-5 py-4 flex items-center gap-4 transition-colors border-b last:border-0 ${
                    isMe ? "" : "hover:bg-indigo-50/30"
                  }`}
                  style={{
                    background: isMe ? "rgba(99,102,241,0.04)" : "transparent",
                    borderColor: "rgba(200,200,200,0.1)",
                  }}
                  whileHover={{ x: 4 }}
                >
                  {/* Rank */}
                  <motion.div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                      idx < 3
                        ? "text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                    style={
                      idx < 3
                        ? { background: `linear-gradient(135deg, hsl(${45 + idx * 30}, 70%, 55%), hsl(${20 + idx * 30}, 70%, 50%))` }
                        : {}
                    }
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: Math.min(idx * 0.05, 0.6), type: "spring" }}
                  >
                    {idx + 1}
                  </motion.div>

                  {/* Avatar */}
                  <motion.div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                    style={{
                      background: `linear-gradient(135deg, hsl(${240 + idx * 8}, 70%, 60%), hsl(${280 + idx * 8}, 70%, 60%))`,
                    }}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    {entry.username.charAt(0)}
                  </motion.div>

                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-800">
                        Member {entry.username}
                      </span>
                      {isMe && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white"
                          style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
                        >
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-500">
                      {entry.approvedCount} achievement{entry.approvedCount !== 1 ? "s" : ""}
                    </div>
                  </div>

                  {/* Points */}
                  <div className="text-right shrink-0">
                    <motion.div
                      className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: Math.min(idx * 0.05, 0.7) }}
                    >
                      {entry.points}
                    </motion.div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                      points
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </motion.div>
    </div>
  );
}

function TopCard({
  entry,
  rank,
  medal,
  featured,
}: {
  entry: { username: string; points: number; approvedCount: number };
  rank: number;
  medal: { bg: string; ring: string; label: string; shadow: string };
  featured?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 + rank * 0.1 }}
      whileHover={{ y: -5 }}
      className={`rounded-2xl border p-5 text-center ${
        featured ? "md:-mt-6 md:mb-[-14px]" : ""
      }`}
      style={{
        background: "rgba(255,255,255,0.65)",
        backdropFilter: "blur(20px)",
        borderColor: "rgba(200,200,200,0.4)",
        boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
      }}
    >
      <motion.div
        className={`mx-auto rounded-full flex items-center justify-center text-3xl ring-4 ${medal.ring} ${
          featured ? "w-24 h-24 text-4xl" : "w-20 h-20"
        }`}
        style={{
          background: `linear-gradient(135deg, ${
            rank === 0 ? "#fde68a, #f59e0b" : rank === 1 ? "#cbd5e1, #94a3b8" : "#fed7aa, #d97706"
          })`,
          boxShadow: medal.shadow,
        }}
        whileHover={{ rotate: [0, -10, 10, -5, 5, 0], scale: 1.05 }}
        transition={{ duration: 0.6 }}
      >
        {medal.label}
      </motion.div>
      <div className="mt-3 text-sm text-slate-500">Rank #{rank + 1}</div>
      <div className="text-lg font-bold text-slate-800 mt-0.5">
        Member {entry.username}
      </div>
      <motion.div
        className="text-3xl font-extrabold mt-2"
        style={{
          background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 + rank * 0.1, type: "spring" }}
      >
        {entry.points} pts
      </motion.div>
      <div className="text-xs text-slate-500 mt-1">
        {entry.approvedCount} achievement{entry.approvedCount !== 1 ? "s" : ""}
      </div>
    </motion.div>
  );
}
