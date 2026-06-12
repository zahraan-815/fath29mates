import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { POINTS_MAP } from "../data/users";
import type { AchievementStatus } from "../types";

export default function AdminDashboard() {
  const { achievements, reviewAchievement, deleteAchievement, currentUser } = useApp();
  const [filter, setFilter] = useState<"pending" | "all" | "approved" | "rejected">(
    "pending"
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!currentUser?.isAdmin) return null;

  const pendingCount = achievements.filter((a) => a.status === "pending").length;
  const approvedCount = achievements.filter((a) => a.status === "approved").length;

  const filtered =
    filter === "all" ? achievements : achievements.filter((a) => a.status === filter);

  const handleReview = (id: string, status: AchievementStatus) => {
    reviewAchievement(id, status);
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      deleteAchievement(id);
      setDeletingId(null);
    }, 300);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,27,75,0.9), rgba(48,40,100,0.85))",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(255,255,255,0.06)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        {/* Animated background orbs */}
        <motion.div
          className="absolute -right-20 -top-20 w-72 h-72 rounded-full blur-3xl"
          style={{ background: "rgba(99,102,241,0.15)" }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute left-10 bottom-0 w-56 h-56 rounded-full blur-3xl"
          style={{ background: "rgba(245,158,11,0.1)" }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <div className="relative p-6 md:p-8 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 mb-3"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <span className="text-sm">🔒 ADMIN PANEL</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Approvals & Reviews</h1>
          <p className="text-white/60 mt-1">
            Review member achievement submissions and award points.
          </p>

          <div className="mt-5 grid grid-cols-3 gap-3">
            {[
              { label: "Pending", val: pendingCount, icon: "⏳", color: "#fbbf24", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.2)" },
              { label: "Approved", val: approvedCount, icon: "✅", color: "#34d399", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.2)" },
              { label: "Total", val: achievements.length, icon: "📊", color: "#93c5fd", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                className="rounded-xl p-3 md:p-4 border"
                style={{ background: stat.bg, borderColor: stat.border }}
                whileHover={{ scale: 1.05, y: -3 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{stat.icon}</span>
                  <div className="text-2xl md:text-3xl font-bold" style={{ color: stat.color }}>{stat.val}</div>
                </div>
                <div className="text-xs text-white/60 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(
          [
            { key: "pending", label: `Pending (${pendingCount})` },
            { key: "approved", label: "Approved" },
            { key: "rejected", label: "Rejected" },
            { key: "all", label: "All" },
          ] as const
        ).map((f) => (
          <motion.button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition flex items-center gap-1.5 ${
              filter === f.key ? "text-white" : "text-slate-600"
            }`}
            style={
              filter === f.key
                ? {
                    background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.2))",
                    borderColor: "rgba(99,102,241,0.3)",
                    backdropFilter: "blur(12px)",
                  }
                : {
                    background: "rgba(255,255,255,0.6)",
                    borderColor: "rgba(200,200,200,0.4)",
                    backdropFilter: "blur(12px)",
                  }
            }
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            {f.label}
          </motion.button>
        ))}
      </div>

      {/* List */}
      <motion.div
        className="rounded-2xl border overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(200,200,200,0.4)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 text-center"
          >
            <motion.div
              className="text-4xl mb-2"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              📭
            </motion.div>
            <p className="text-slate-500">No submissions in this category.</p>
          </motion.div>
        ) : (
          <ul className="divide-y" style={{ borderColor: "rgba(200,200,200,0.2)" }}>
            {filtered.map((a, i) => (
              <motion.li
                key={a.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: deletingId === a.id ? 0 : 1,
                  x: deletingId === a.id ? -30 : 0,
                  height: deletingId === a.id ? 0 : "auto",
                }}
                transition={{ duration: 0.3 }}
                className="p-5"
                style={{ background: i % 2 === 0 ? "transparent" : "rgba(0,0,0,0.01)" }}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border"
                        style={{
                          background: "rgba(99,102,241,0.08)",
                          borderColor: "rgba(99,102,241,0.15)",
                          color: "#4f46e5",
                        }}
                      >
                        👤 Member {a.username}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          a.level === "Beginner"
                            ? "bg-emerald-100 text-emerald-700"
                            : a.level === "Intermediate"
                            ? "bg-sky-100 text-sky-700"
                            : "bg-pink-100 text-pink-700"
                        }`}
                      >
                        {a.level} · {POINTS_MAP[a.level]} pts
                      </span>
                      <StatusChip status={a.status} />
                    </div>
                    <h3 className="font-semibold text-slate-800">{a.title}</h3>
                    <p className="text-sm text-slate-600 mt-1">{a.description}</p>
                    <p className="text-xs text-slate-400 mt-2">
                      Submitted {new Date(a.submittedAt).toLocaleString()}
                      {a.date && <> · Achievement date: {a.date}</>}
                    </p>
                  </div>

                  {a.status === "pending" && (
                    <div className="flex gap-2 shrink-0">
                      <motion.button
                        onClick={() => handleReview(a.id, "approved")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-xl text-white text-sm font-semibold border-none cursor-pointer"
                        style={{
                          background: "linear-gradient(135deg, #10b981, #059669)",
                          boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
                        }}
                      >
                        ✓ Approve
                      </motion.button>
                      <motion.button
                        onClick={() => handleReview(a.id, "rejected")}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-xl text-sm font-semibold border"
                        style={{
                          background: "rgba(239,68,68,0.06)",
                          borderColor: "rgba(239,68,68,0.2)",
                          color: "#dc2626",
                        }}
                      >
                        ✕ Reject
                      </motion.button>
                      <motion.button
                        onClick={() => handleDelete(a.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-9 h-9 rounded-xl flex items-center justify-center border"
                        style={{
                          background: "rgba(100,116,139,0.06)",
                          borderColor: "rgba(100,116,139,0.2)",
                          color: "#64748b",
                        }}
                      >
                        🗑
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  const colors: Record<string, { bg: string; text: string; label: string }> = {
    pending: { bg: "bg-amber-100", text: "text-amber-700", label: "⏳ Awaiting review" },
    approved: { bg: "bg-emerald-100", text: "text-emerald-700", label: "✓ Approved" },
    rejected: { bg: "bg-red-100", text: "text-red-700", label: "✕ Rejected" },
  };
  const c = colors[status] ?? colors.pending;
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.bg} ${c.text}`}
    >
      {c.label}
    </motion.span>
  );
}
