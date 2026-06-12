import { useState, type FormEvent } from "react";
import { useApp } from "../context/AppContext";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function Login() {
  const { login, setPage } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const err = login(username, password);
    if (err) setError(err);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 px-4 py-10 relative overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl"
        animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-3xl"
        animate={{ x: [0, -60, 0], y: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-500/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white/20"
          animate={{
            x: [Math.random() * 100 - 50, Math.random() * 100 - 50],
            y: [Math.random() * 100 - 50, Math.random() * 100 - 50],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.5,
          }}
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
        />
      ))}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center"
      >
        {/* Left side - branding */}
        <motion.div variants={item} className="text-white space-y-6">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10"
            style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)" }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm">Members Portal</span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-bold leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Welcome to the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-pink-400 animate-gradient">
              FATH
            </span>{" "}
            Portal
          </motion.h1>

          <motion.p
            className="text-white/60 text-lg"
            variants={item}
          >
            Log in to track your achievements, climb the leaderboard, and showcase your growth.
          </motion.p>

          <motion.div variants={item} className="grid grid-cols-3 gap-3 pt-4">
            {[
              { label: "Beginner pts", val: "5", color: "text-emerald-300", border: "border-emerald-400/20", bg: "rgba(52,211,153,0.08)" },
              { label: "Intermediate pts", val: "10", color: "text-sky-300", border: "border-sky-400/20", bg: "rgba(56,189,248,0.08)" },
              { label: "Advanced pts", val: "15", color: "text-pink-300", border: "border-pink-400/20", bg: "rgba(244,114,182,0.08)" },
            ].map((card) => (
              <motion.div
                key={card.label}
                className={`rounded-xl p-4 border backdrop-blur-sm ${card.border}`}
                style={{ background: card.bg }}
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`text-2xl font-bold ${card.color}`}>{card.val}</div>
                <div className="text-xs text-white/50">{card.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right side - glass login card */}
        <motion.div variants={item}>
          <div
            className="rounded-2xl p-8 border relative overflow-hidden"
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              borderColor: "rgba(255,255,255,0.1)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            {/* Inner shine */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
            <div className="relative">
              <motion.div
                className="mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-white">Sign in</h2>
                <p className="text-white/50 text-sm mt-1">
                  Use your member number or administrator credentials
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div whileFocus="focus">
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. 791 or ADMINISTRATOR"
                    className="w-full px-4 py-2.5 rounded-xl outline-none transition-all border text-white placeholder-white/30"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      borderColor: "rgba(255,255,255,0.1)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(99,102,241,0.5)";
                      e.target.style.background = "rgba(255,255,255,0.08)";
                      e.target.style.boxShadow = "0 0 20px rgba(99,102,241,0.15)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255,255,255,0.1)";
                      e.target.style.background = "rgba(255,255,255,0.05)";
                      e.target.style.boxShadow = "none";
                    }}
                    required
                  />
                </motion.div>

                <motion.div>
                  <label className="block text-sm font-medium text-white/70 mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl outline-none transition-all border text-white placeholder-white/30"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      borderColor: "rgba(255,255,255,0.1)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(99,102,241,0.5)";
                      e.target.style.background = "rgba(255,255,255,0.08)";
                      e.target.style.boxShadow = "0 0 20px rgba(99,102,241,0.15)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(255,255,255,0.1)";
                      e.target.style.background = "rgba(255,255,255,0.05)";
                      e.target.style.boxShadow = "none";
                    }}
                    required
                  />
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-xl px-4 py-3 text-sm border"
                    style={{
                      background: "rgba(239, 68, 68, 0.1)",
                      borderColor: "rgba(239, 68, 68, 0.3)",
                      color: "#fca5a5",
                    }}
                  >
                    {error}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-2.5 rounded-xl font-semibold text-white transition-all cursor-pointer relative overflow-hidden group animate-gradient"
                  style={{
                    background: "linear-gradient(135deg, #6366f1, #a855f7, #ec4899)",
                    backgroundSize: "200% 200%",
                    boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
                  }}
                >
                  <span className="relative z-10">Sign In</span>
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)", backgroundSize: "200% 100%" }}
                  />
                </motion.button>
              </form>

              <motion.div
                className="mt-5 pt-5 border-t border-white/10 space-y-3"
                variants={item}
              >
                <button
                  onClick={() => setShowHint((s) => !s)}
                  className="text-sm text-indigo-300 hover:text-indigo-200 font-medium transition-colors"
                >
                  {showHint ? "Hide" : "Show"} password pattern
                </button>
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="rounded-xl px-4 py-3 text-sm border"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      borderColor: "rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    <p className="font-medium mb-1 text-white/90">Members:</p>
                    <p>
                      Password format: <code className="px-1.5 py-0.5 rounded bg-white/10">{"<number>@fath"}</code>
                      <br />
                      Example: <code className="px-1.5 py-0.5 rounded bg-white/10">791@fath</code>
                    </p>
                  </motion.div>
                )}
                <motion.button
                  onClick={() => setPage("leaderboard")}
                  whileHover={{ x: 4 }}
                  className="block text-sm text-white/60 hover:text-white/90 font-medium transition-colors"
                >
                  View public leaderboard →
                </motion.button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
