import type { ReactNode } from "react";
import { useApp } from "../context/AppContext";
import type { Page } from "../types";
import { motion } from "framer-motion";

export default function Layout({ children }: { children: ReactNode }) {
  const { currentUser, logout, page, setPage } = useApp();

  if (!currentUser) return <>{children}</>;

  const navItems: { key: Page; label: string; icon: string; adminOnly?: boolean }[] = [
    { key: "dashboard", label: "My Portal", icon: "🏠" },
    { key: "leaderboard", label: "Leaderboard", icon: "🏆" },
    { key: "admin", label: "Approvals", icon: "✅", adminOnly: true },
    { key: "settings", label: "Settings", icon: "⚙️", adminOnly: true },
  ];

  const visibleItems = navItems.filter((i) => !i.adminOnly || currentUser.isAdmin);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/50 to-purple-50/50 relative">
      {/* Background decorations */}
      <motion.div
        className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.08), transparent 70%)" }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="fixed bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none z-0"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.06), transparent 70%)" }}
        animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Top nav */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="sticky top-0 z-30 border-b"
        style={{
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderColor: "rgba(255,255,255,0.5)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <motion.button
              onClick={() => setPage(currentUser.isAdmin ? "admin" : "dashboard")}
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold"
                style={{
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
                }}
              >
                F
              </div>
              <span className="font-bold text-slate-800 text-lg hidden sm:inline">
                FATH Portal
              </span>
            </motion.button>
            <nav className="flex items-center gap-1">
              {visibleItems.map((item) => (
                <motion.button
                  key={item.key}
                  onClick={() => setPage(item.key)}
                  className={`px-3 py-1.5 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
                    page === item.key
                      ? "border"
                      : "text-slate-600 hover:bg-white/80"
                  }`}
                  style={
                    page === item.key
                      ? {
                          background: "rgba(99,102,241,0.08)",
                          color: "#4f46e5",
                          borderColor: "rgba(99,102,241,0.2)",
                        }
                      : {}
                  }
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{item.icon}</span>
                  <span className="hidden sm:inline">{item.label}</span>
                </motion.button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-semibold text-slate-800">
                {currentUser.displayName}
              </div>
              <div className="text-xs text-slate-500">
                {currentUser.isAdmin ? "Administrator" : `Member ${currentUser.username}`}
              </div>
            </div>
            <motion.div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #ec4899)",
                boxShadow: "0 4px 12px rgba(236,72,153,0.3)",
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              {currentUser.displayName.charAt(0).toUpperCase()}
            </motion.div>
            <motion.button
              onClick={logout}
              className="text-sm font-medium px-3 py-1.5 rounded-xl transition"
              style={{ color: "#64748b" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#dc2626";
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)";
              }}
              onHoverEnd={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#64748b";
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              }}
            >
              Logout
            </motion.button>
          </div>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
