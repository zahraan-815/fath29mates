import { AppProvider, useApp } from "./context/AppContext";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminSettings from "./pages/AdminSettings";
import Leaderboard from "./pages/Leaderboard";

function PublicLeaderboardView() {
  const { setPage } = useApp();
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/50 to-purple-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold"
            style={{
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
            }}
          >
            F
          </div>
          <span className="font-bold text-slate-800">FATH Portal</span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(0,0,0,0.05)", color: "#64748b" }}
          >
            Public View
          </span>
        </div>
        <button
          onClick={() => setPage("login")}
          className="text-sm font-medium px-3 py-1.5 rounded-xl transition"
          style={{ color: "#6366f1" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(99,102,241,0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          ← Sign in
        </button>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        <Leaderboard />
      </div>
    </div>
  );
}

function Router() {
  const { page, currentUser } = useApp();

  // Public leaderboard is accessible even without login
  if (!currentUser) {
    if (page === "leaderboard") {
      return <PublicLeaderboardView />;
    }
    return <Login />;
  }

  // Logged-in routes
  let content;
  if (page === "settings" && currentUser.isAdmin) {
    content = <AdminSettings />;
  } else if (page === "admin" && currentUser.isAdmin) {
    content = <AdminDashboard />;
  } else if (page === "leaderboard") {
    content = <Leaderboard />;
  } else if (currentUser.isAdmin) {
    content = <AdminDashboard />;
  } else {
    content = <Dashboard />;
  }

  return <Layout>{content}</Layout>;
}

export default function App() {
  return (
    <AppProvider>
      <Router />
    </AppProvider>
  );
}
