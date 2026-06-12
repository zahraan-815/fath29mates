import { useState } from "react";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { POINTS_MAP } from "../data/users";

type TabType = "members" | "reset-password" | "bulk-actions";

export default function AdminSettings() {
  const { memberDetails, achievements, resetMemberPassword, allUsers } = useApp();

  if (!allUsers) return null;

  const members = allUsers.filter((u) => !u.isAdmin);
  const [activeTab, setActiveTab] = useState<TabType>("members");
  const [search, setSearch] = useState("");
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [newPassword, setNewPassword] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<string | null>(null);

  const filteredMembers = members.filter((m) =>
    m.username.includes(search)
  );

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleResetPassword = () => {
    if (!selectedMember || !newPassword.trim()) return;
    resetMemberPassword(selectedMember, newPassword);
    showNotification(`Password for Member ${selectedMember} updated ✓`);
    setNewPassword("");
  };

  // handleClearAllPending is intentionally left as a placeholder for future use

  const handleResetAllPoints = () => {
    showNotification("All achievements cleared, points reset ✓");
    // Clear all achievements via storage
    try {
      const key = "fath_portal_state_v2";
      const raw = localStorage.getItem(key);
      if (raw) {
        const state = JSON.parse(raw);
        state.achievements = [];
        localStorage.setItem(key, JSON.stringify(state));
      }
    } catch {
      // ignore
    }
    window.location.reload();
  };

  const getMemberStats = (username: string) => {
    const memberAch = achievements.filter((a) => a.username === username);
    return {
      total: memberAch.length,
      approved: memberAch.filter((a) => a.status === "approved").length,
      pending: memberAch.filter((a) => a.status === "pending").length,
      rejected: memberAch.filter((a) => a.status === "rejected").length,
      points: memberAch
        .filter((a) => a.status === "approved")
        .reduce((sum, a) => sum + POINTS_MAP[a.level], 0),
    };
  };

  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: "members", label: "Members Directory", icon: "👥" },
    { key: "reset-password", label: "Reset Passwords", icon: "🔑" },
    { key: "bulk-actions", label: "Bulk Actions", icon: "📋" },
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
          background: "linear-gradient(135deg, rgba(30,27,75,0.9), rgba(48,40,100,0.85))",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(255,255,255,0.08)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl"
            style={{ background: "rgba(99,102,241,0.2)" }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl"
            style={{ background: "rgba(168,85,247,0.15)" }}
            animate={{ scale: [1.2, 1, 1.2] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>

        <div className="relative p-6 md:p-8 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 mb-3"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <span className="text-sm">⚙️ Admin Control Panel</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold">Settings & Management</h1>
          <p className="text-white/60 mt-1">
            Full control over all members, passwords, and data.
          </p>

          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Members", val: members.length, icon: "👥" },
              { label: "Total Submissions", val: achievements.length, icon: "📝" },
              { label: "Pending Reviews", val: achievements.filter(a => a.status === "pending").length, icon: "⏳" },
              { label: "Approved", val: achievements.filter(a => a.status === "approved").length, icon: "✅" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl p-3 border"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{stat.icon}</span>
                  <div className="text-2xl font-bold">{stat.val}</div>
                </div>
                <div className="text-xs text-white/50 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="rounded-xl px-4 py-3 border text-sm text-emerald-700"
          style={{
            background: "rgba(16,185,129,0.08)",
            borderColor: "rgba(16,185,129,0.2)",
            backdropFilter: "blur(12px)",
          }}
        >
          {successMsg}
        </motion.div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition flex items-center gap-1.5 ${
              activeTab === tab.key
                ? "text-white"
                : "text-slate-600 hover:bg-white/60"
            }`}
            style={
              activeTab === tab.key
                ? {
                    background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.15))",
                    borderColor: "rgba(99,102,241,0.25)",
                  }
                : {
                    background: "rgba(255,255,255,0.6)",
                    borderColor: "rgba(200,200,200,0.5)",
                    backdropFilter: "blur(12px)",
                  }
            }
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Members Directory */}
      {activeTab === "members" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="🔍  Search members by ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-80 px-4 py-2.5 rounded-xl border outline-none transition-all text-sm"
              style={{
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(16px)",
                borderColor: "rgba(200,200,200,0.5)",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(99,102,241,0.4)";
                e.target.style.boxShadow = "0 0 20px rgba(99,102,241,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(200,200,200,0.5)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Members grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMembers.map((member, idx) => {
              const stats = getMemberStats(member.username);
              const details = memberDetails[member.username];
              const isExpanded = editingMember === member.username;

              return (
                <motion.div
                  key={member.username}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  whileHover={{ y: -3 }}
                  className="rounded-2xl border overflow-hidden"
                  style={{
                    background: "rgba(255,255,255,0.6)",
                    backdropFilter: "blur(20px)",
                    borderColor: "rgba(200,200,200,0.4)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    className="h-2"
                    style={{
                      background: `linear-gradient(90deg, hsl(${240 + idx * 3}, 60%, 60%), hsl(${280 + idx * 3}, 60%, 60%))`,
                    }}
                  />
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <motion.div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                        style={{
                          background: `linear-gradient(135deg, hsl(${240 + idx * 3}, 70%, 60%), hsl(${280 + idx * 3}, 70%, 60%))`,
                        }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {member.username.slice(0, 2)}
                      </motion.div>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-800">
                          {details?.fullName || `Member ${member.username}`}
                        </div>
                        <div className="text-xs text-slate-500">ID: {member.username}</div>
                      </div>
                      <motion.button
                        onClick={() => setEditingMember(isExpanded ? null : member.username)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                        style={{
                          background: "rgba(99,102,241,0.08)",
                          color: "#6366f1",
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {isExpanded ? "▲" : "▼"}
                      </motion.button>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-4 gap-1.5 mb-3">
                      {[
                        { label: "Pts", val: stats.points, bg: "rgba(99,102,241,0.1)", color: "#6366f1" },
                        { label: "Approved", val: stats.approved, bg: "rgba(16,185,129,0.1)", color: "#10b981" },
                        { label: "Pending", val: stats.pending, bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
                        { label: "Rejected", val: stats.rejected, bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
                      ].map((s) => (
                        <div
                          key={s.label}
                          className="rounded-lg px-2 py-1.5 text-center"
                          style={{ background: s.bg }}
                        >
                          <div className="text-sm font-bold" style={{ color: s.color }}>{s.val}</div>
                          <div className="text-[10px] text-slate-500">{s.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-2 pt-3 border-t"
                        style={{ borderColor: "rgba(200,200,200,0.3)" }}
                      >
                        {details && (
                          <>
                            {details.fullName && (
                              <div className="text-sm">
                                <span className="text-slate-500">Name: </span>
                                <span className="text-slate-800 font-medium">{details.fullName}</span>
                              </div>
                            )}
                            {details.email && (
                              <div className="text-sm">
                                <span className="text-slate-500">Email: </span>
                                <span className="text-slate-800">{details.email}</span>
                              </div>
                            )}
                            {details.phone && (
                              <div className="text-sm">
                                <span className="text-slate-500">Phone: </span>
                                <span className="text-slate-800">{details.phone}</span>
                              </div>
                            )}
                            {details.skills && (
                              <div className="text-sm">
                                <span className="text-slate-500">Skills: </span>
                                <span className="text-slate-800">{details.skills}</span>
                              </div>
                            )}
                            {details.bio && (
                              <div className="text-sm">
                                <span className="text-slate-500">Bio: </span>
                                <span className="text-slate-800">{details.bio}</span>
                              </div>
                            )}
                          </>
                        )}
                        {!details && (
                          <div className="text-sm text-slate-400 italic">No details provided</div>
                        )}

                        {/* Member achievements list */}
                        {stats.total > 0 && (
                          <div className="mt-2">
                            <div className="text-xs font-semibold text-slate-600 mb-1">Achievements:</div>
                            <div className="space-y-1 max-h-28 overflow-y-auto">
                              {achievements
                                .filter((a) => a.username === member.username)
                                .map((a) => (
                                  <div
                                    key={a.id}
                                    className="flex items-center justify-between text-xs px-2 py-1 rounded-lg"
                                    style={{ background: "rgba(0,0,0,0.02)" }}
                                  >
                                    <span className="text-slate-700 truncate flex-1">{a.title}</span>
                                    <span
                                      className={`ml-2 shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                        a.status === "approved"
                                          ? "bg-emerald-100 text-emerald-700"
                                          : a.status === "pending"
                                          ? "bg-amber-100 text-amber-700"
                                          : "bg-red-100 text-red-700"
                                      }`}
                                    >
                                      {a.status}
                                    </span>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}

                        <motion.button
                          onClick={() => {
                            setSelectedMember(member.username);
                            setActiveTab("reset-password");
                            setEditingMember(null);
                          }}
                          className="w-full mt-2 py-2 rounded-lg text-xs font-medium text-white"
                          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          🔑 Reset Password
                        </motion.button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Reset Passwords Tab */}
      {activeTab === "reset-password" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-lg mx-auto"
        >
          <div
            className="rounded-2xl border p-6"
            style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(20px)",
              borderColor: "rgba(200,200,200,0.4)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            }}
          >
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span>🔑</span> Reset Member Password
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Select Member
                </label>
                <select
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border outline-none transition-all bg-white/80"
                  style={{ borderColor: "rgba(200,200,200,0.5)" }}
                >
                  <option value="">-- Select a member --</option>
                  {members.map((m) => (
                    <option key={m.username} value={m.username}>
                      {memberDetails[m.username]?.fullName || `Member ${m.username}`} (ID: {m.username})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  New Password
                </label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2.5 rounded-xl border outline-none transition-all"
                  style={{
                    background: "rgba(255,255,255,0.8)",
                    borderColor: "rgba(200,200,200,0.5)",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(99,102,241,0.4)";
                    e.target.style.boxShadow = "0 0 20px rgba(99,102,241,0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(200,200,200,0.5)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <motion.button
                onClick={handleResetPassword}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-2.5 rounded-xl font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  boxShadow: "0 4px 15px rgba(99,102,241,0.3)",
                }}
              >
                Reset Password
              </motion.button>

              <div className="pt-4 border-t text-xs text-slate-500"
                style={{ borderColor: "rgba(200,200,200,0.3)" }}
              >
                <p className="font-medium mb-1">Default password format:</p>
                <p>{`<member_number>@fath`}</p>
                <p className="mt-2 text-amber-600">⚠️ After resetting, the member must use the new password to log in.</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Bulk Actions Tab */}
      {activeTab === "bulk-actions" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-2 gap-6"
        >
          {/* Bulk password reset */}
          <div
            className="rounded-2xl border p-6"
            style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(20px)",
              borderColor: "rgba(200,200,200,0.4)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            }}
          >
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span>🔄</span> Reset All to Default
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Reset all member passwords back to their default format (number@fath).
            </p>
            <motion.button
              onClick={() => {
                try {
                  const key = "fath_portal_state_v2";
                  const raw = localStorage.getItem(key);
                  if (raw) {
                    const state = JSON.parse(raw);
                    state.customPasswords = {};
                    localStorage.setItem(key, JSON.stringify(state));
                  }
                } catch {
                  // ignore
                }
                showNotification("All passwords reset to default ✓");
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 rounded-xl font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #0ea5e9, #3b82f6)",
                boxShadow: "0 4px 15px rgba(59,130,246,0.3)",
              }}
            >
              Reset All Passwords
            </motion.button>
          </div>

          {/* Clear all data */}
          <div
            className="rounded-2xl border p-6"
            style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(20px)",
              borderColor: "rgba(200,200,200,0.4)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            }}
          >
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span>🗑️</span> Reset All Points
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Clear ALL achievements and reset the leaderboard. This cannot be undone.
            </p>
            <motion.button
              onClick={handleResetAllPoints}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 rounded-xl font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                boxShadow: "0 4px 15px rgba(239,68,68,0.3)",
              }}
            >
              Clear All Achievements
            </motion.button>
          </div>

          {/* Export data */}
          <div
            className="rounded-2xl border p-6"
            style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(20px)",
              borderColor: "rgba(200,200,200,0.4)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            }}
          >
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span>📊</span> Export Data
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              Download a JSON export of all member data and achievements.
            </p>
            <motion.button
              onClick={() => {
                const key = "fath_portal_state_v2";
                const raw = localStorage.getItem(key);
                if (raw) {
                  const blob = new Blob([raw], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "fath_portal_data.json";
                  a.click();
                  URL.revokeObjectURL(url);
                  showNotification("Data exported ✓");
                }
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 rounded-xl font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #10b981, #059669)",
                boxShadow: "0 4px 15px rgba(16,185,129,0.3)",
              }}
            >
              Download Export
            </motion.button>
          </div>

          {/* Quick overview */}
          <div
            className="rounded-2xl border p-6"
            style={{
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(20px)",
              borderColor: "rgba(200,200,200,0.4)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
            }}
          >
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <span>📈</span> Quick Stats
            </h3>
            <div className="space-y-2">
              {[
                { label: "Members with profiles", val: Object.keys(memberDetails).length },
                { label: "Total submissions", val: achievements.length },
                { label: "Approved achievements", val: achievements.filter(a => a.status === "approved").length },
                { label: "Total points awarded", val: achievements.filter(a => a.status === "approved").reduce((sum, a) => sum + POINTS_MAP[a.level], 0) },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center justify-between py-1.5 border-b last:border-0"
                  style={{ borderColor: "rgba(200,200,200,0.2)" }}
                >
                  <span className="text-sm text-slate-600">{stat.label}</span>
                  <span className="text-sm font-bold text-slate-800">{stat.val}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
