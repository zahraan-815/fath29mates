import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import type { AchievementLevel } from "../types";
import { POINTS_MAP } from "../data/users";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

export default function Dashboard() {
  const {
    currentUser,
    achievements,
    addAchievement,
    memberDetails,
    saveMemberDetails,
  } = useApp();

  if (!currentUser || currentUser.isAdmin) return null;

  const myAchievements = achievements.filter(
    (a) => a.username === currentUser.username
  );
  const existingDetails = memberDetails[currentUser.username];

  const [fullName, setFullName] = useState(existingDetails?.fullName ?? "");
  const [email, setEmail] = useState(existingDetails?.email ?? "");
  const [phone, setPhone] = useState(existingDetails?.phone ?? "");
  const [bio, setBio] = useState(existingDetails?.bio ?? "");
  const [skills, setSkills] = useState(existingDetails?.skills ?? "");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState<AchievementLevel>("Beginner");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const approvedCount = myAchievements.filter((a) => a.status === "approved").length;
  const pendingCount = myAchievements.filter((a) => a.status === "pending").length;
  const totalPoints = myAchievements
    .filter((a) => a.status === "approved")
    .reduce((sum, a) => sum + POINTS_MAP[a.level], 0);

  const handleSaveDetails = (e: React.FormEvent) => {
    e.preventDefault();
    saveMemberDetails(currentUser.username, { fullName, email, phone, bio, skills });
    setSavedNotice("Profile saved ✓");
    setTimeout(() => setSavedNotice(null), 2500);
  };

  const handleSubmitAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    addAchievement(currentUser.username, title, description, level, date);
    setTitle("");
    setDescription("");
    setLevel("Beginner");
    setDate(new Date().toISOString().slice(0, 10));
    setSavedNotice("Achievement submitted to admin for approval ✓");
    setTimeout(() => setSavedNotice(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="rounded-2xl p-6 md:p-8 text-white relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(79,70,229,0.95), rgba(147,51,234,0.9), rgba(219,39,119,0.85))",
          boxShadow: "0 20px 60px rgba(99,102,241,0.3)",
        }}
      >
        {/* Animated orbs */}
        <motion.div
          className="absolute -right-10 -top-10 w-56 h-56 rounded-full"
          style={{ background: "rgba(255,255,255,0.1)" }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute left-20 bottom-0 w-40 h-40 rounded-full"
          style={{ background: "rgba(255,255,255,0.06)" }}
          animate={{ scale: [1.1, 0.9, 1.1], x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold">
            Hello, {existingDetails?.fullName || currentUser.displayName} 👋
          </h1>
          <p className="text-white/70 mt-1">
            Track your growth and climb the leaderboard.
          </p>
        </div>

        <div className="relative mt-5 grid grid-cols-3 gap-3 md:gap-4">
          {[
            { label: "Points", val: totalPoints, icon: "⚡" },
            { label: "Approved", val: approvedCount, icon: "✅" },
            { label: "Pending", val: pendingCount, icon: "⏳" },
          ].map((card) => (
            <motion.div
              key={card.label}
              className="rounded-xl p-3 md:p-4 text-center border"
              style={{
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                borderColor: "rgba(255,255,255,0.15)",
              }}
              whileHover={{ scale: 1.05, y: -3 }}
            >
              <span className="text-xl">{card.icon}</span>
              <div className="text-2xl md:text-3xl font-bold mt-1">{card.val}</div>
              <div className="text-xs md:text-sm text-white/70">{card.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {savedNotice && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="rounded-xl px-4 py-3 border text-sm font-medium text-emerald-700"
          style={{
            background: "rgba(16,185,129,0.08)",
            backdropFilter: "blur(12px)",
            borderColor: "rgba(16,185,129,0.2)",
          }}
        >
          {savedNotice}
        </motion.div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile details */}
        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="show"
          className="rounded-2xl p-6 border"
          style={{
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(20px)",
            borderColor: "rgba(200,200,200,0.4)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
          }}
        >
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>👤</span> My Details
          </h2>
          <form onSubmit={handleSaveDetails} className="space-y-3">
            {[
              { label: "Full Name", value: fullName, setter: setFullName, type: "text", placeholder: "Your name", span: 1 },
              { label: "Email", value: email, setter: setEmail, type: "email", placeholder: "you@example.com", span: 2 },
              { label: "Phone", value: phone, setter: setPhone, type: "tel", placeholder: "+91 ...", span: 2 },
              { label: "Skills", value: skills, setter: setSkills, type: "text", placeholder: "e.g. Web Dev, Design, AI", span: 1 },
            ].map((field) => (
              <div key={field.label} className={field.span === 2 ? "sm:col-span-2" : ""}>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.setter(e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2 rounded-xl border outline-none transition-all text-sm"
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    borderColor: "rgba(200,200,200,0.5)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(99,102,241,0.4)";
                    e.target.style.boxShadow = "0 0 12px rgba(99,102,241,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(200,200,200,0.5)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
                className="w-full px-3 py-2 rounded-xl border outline-none transition-all resize-none text-sm"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  borderColor: "rgba(200,200,200,0.5)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(99,102,241,0.4)";
                  e.target.style.boxShadow = "0 0 12px rgba(99,102,241,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(200,200,200,0.5)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 rounded-xl font-semibold text-white border-none cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #334155, #1e293b)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              Save Details
            </motion.button>
          </form>
        </motion.div>

        {/* Add Achievement */}
        <motion.div
          custom={2}
          variants={cardVariants}
          initial="hidden"
          animate="show"
          className="rounded-2xl p-6 border"
          style={{
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(20px)",
            borderColor: "rgba(200,200,200,0.4)",
            boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
          }}
        >
          <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2">
            <span>🏅</span> Add Achievement
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Submissions are sent to admin for approval.
          </p>
          <form onSubmit={handleSubmitAchievement} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Won Inter-College Hackathon"
                className="w-full px-3 py-2 rounded-xl border outline-none transition-all text-sm"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  borderColor: "rgba(200,200,200,0.5)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(99,102,241,0.4)";
                  e.target.style.boxShadow = "0 0 12px rgba(99,102,241,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(200,200,200,0.5)";
                  e.target.style.boxShadow = "none";
                }}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your achievement..."
                rows={3}
                className="w-full px-3 py-2 rounded-xl border outline-none transition-all resize-none text-sm"
                style={{
                  background: "rgba(255,255,255,0.7)",
                  borderColor: "rgba(200,200,200,0.5)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(99,102,241,0.4)";
                  e.target.style.boxShadow = "0 0 12px rgba(99,102,241,0.1)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(200,200,200,0.5)";
                  e.target.style.boxShadow = "none";
                }}
                required
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Level (Points)
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as AchievementLevel)}
                  className="w-full px-3 py-2 rounded-xl border outline-none transition-all bg-white/80 text-sm"
                  style={{ borderColor: "rgba(200,200,200,0.5)" }}
                >
                  <option value="Beginner">Beginner — {POINTS_MAP.Beginner} pts</option>
                  <option value="Intermediate">Intermediate — {POINTS_MAP.Intermediate} pts</option>
                  <option value="Advanced">Advanced — {POINTS_MAP.Advanced} pts</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border outline-none transition-all text-sm"
                  style={{
                    background: "rgba(255,255,255,0.7)",
                    borderColor: "rgba(200,200,200,0.5)",
                  }}
                  required
                />
              </div>
            </div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 rounded-xl font-semibold text-white border-none cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #6366f1, #a855f7)",
                boxShadow: "0 4px 15px rgba(99,102,241,0.3)",
              }}
            >
              Submit for Approval
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* My achievements */}
      <motion.div
        custom={3}
        variants={cardVariants}
        initial="hidden"
        animate="show"
        className="rounded-2xl p-6 border"
        style={{
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(200,200,200,0.4)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
        }}
      >
        <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span>📜</span> My Achievements
        </h2>
        {myAchievements.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-slate-500 text-sm"
          >
            No achievements yet. Submit your first one above!
          </motion.p>
        ) : (
          <div className="space-y-3">
            {myAchievements.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                className="rounded-xl p-4 border"
                style={{
                  background: "rgba(255,255,255,0.5)",
                  borderColor: "rgba(200,200,200,0.3)",
                }}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-slate-800">{a.title}</h3>
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
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{a.description}</p>
                    <p className="text-xs text-slate-400 mt-2">
                      Submitted {new Date(a.submittedAt).toLocaleString()}
                      {a.status === "approved" && a.reviewedAt && (
                        <> · Approved {new Date(a.reviewedAt).toLocaleString()}</>
                      )}
                    </p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    approved: "bg-emerald-100 text-emerald-700 border-emerald-200",
    rejected: "bg-red-100 text-red-700 border-red-200",
  };
  const cls = styles[status] ?? styles.pending;
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`text-xs font-medium px-2.5 py-1 rounded-full border ${cls}`}
    >
      {status.toUpperCase()}
    </motion.span>
  );
}
