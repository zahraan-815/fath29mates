import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type {
  Achievement,
  AchievementLevel,
  AchievementStatus,
  MemberDetails,
  Page,
  User,
} from "../types";
import { INITIAL_USERS, POINTS_MAP } from "../data/users";

interface AppContextValue {
  currentUser: User | null;
  login: (username: string, password: string) => string | null;
  logout: () => void;
  page: Page;
  setPage: (p: Page) => void;

  // member details
  memberDetails: Record<string, MemberDetails>;
  saveMemberDetails: (username: string, details: MemberDetails) => void;
  resetMemberPassword: (username: string, newPassword: string) => void;
  allUsers: User[];

  // achievements
  achievements: Achievement[];
  addAchievement: (
    username: string,
    title: string,
    description: string,
    level: AchievementLevel,
    date: string
  ) => void;
  reviewAchievement: (id: string, status: AchievementStatus) => void;
  deleteAchievement: (id: string) => void;

  // leaderboard
  leaderboard: { username: string; points: number; approvedCount: number }[];
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = "fath_portal_state_v2";

interface PersistedState {
  achievements: Achievement[];
  memberDetails: Record<string, MemberDetails>;
  customPasswords: Record<string, string>;
}

function loadState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { achievements: [], memberDetails: {}, customPasswords: {} };
}

function saveState(state: PersistedState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [page, setPage] = useState<Page>("login");

  const [achievements, setAchievements] = useState<Achievement[]>(
    loadState().achievements
  );
  const [memberDetails, setMemberDetails] = useState<Record<string, MemberDetails>>(
    loadState().memberDetails
  );
  const [customPasswords, setCustomPasswords] = useState<Record<string, string>>(
    loadState().customPasswords
  );

  // All users with potential custom passwords
  const allUsers: User[] = useMemo(
    () =>
      INITIAL_USERS.map((u) => ({
        ...u,
        password: customPasswords[u.username] ?? u.password,
      })),
    [customPasswords]
  );

  // Session persistence via sessionStorage
  useEffect(() => {
    try {
      const sess = sessionStorage.getItem("fath_portal_user");
      if (sess) {
        const u = JSON.parse(sess) as User;
        const match = allUsers.find((x) => x.username === u.username);
        if (match) {
          setCurrentUser(match);
          setPage(match.isAdmin ? "admin" : "dashboard");
        }
      }
    } catch {
      // ignore
    }
  }, [allUsers]);

  useEffect(() => {
    saveState({ achievements, memberDetails, customPasswords });
  }, [achievements, memberDetails, customPasswords]);

  const login = (username: string, password: string): string | null => {
    const trimmedUser = username.trim();
    const user = allUsers.find(
      (u) =>
        u.username.toUpperCase() === trimmedUser.toUpperCase() &&
        u.password === password
    );
    if (!user) return "Invalid username or password";
    setCurrentUser(user);
    setPage(user.isAdmin ? "admin" : "dashboard");
    try {
      sessionStorage.setItem("fath_portal_user", JSON.stringify(user));
    } catch {
      // ignore
    }
    return null;
  };

  const logout = () => {
    setCurrentUser(null);
    setPage("login");
    try {
      sessionStorage.removeItem("fath_portal_user");
    } catch {
      // ignore
    }
  };

  const saveMemberDetailsLocal = (username: string, details: MemberDetails) => {
    setMemberDetails((prev) => ({ ...prev, [username]: details }));
  };

  const resetMemberPassword = (username: string, newPassword: string) => {
    setCustomPasswords((prev) => ({
      ...prev,
      [username]: newPassword.trim(),
    }));
  };

  const addAchievement = (
    username: string,
    title: string,
    description: string,
    level: AchievementLevel,
    date: string
  ) => {
    const newA: Achievement = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      username,
      title: title.trim(),
      description: description.trim(),
      level,
      date,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };
    setAchievements((prev) => [newA, ...prev]);
  };

  const reviewAchievement = (id: string, status: AchievementStatus) => {
    setAchievements((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status, reviewedAt: new Date().toISOString() } : a
      )
    );
  };

  const deleteAchievement = (id: string) => {
    setAchievements((prev) => prev.filter((a) => a.id !== id));
  };

  const leaderboard = useMemo(() => {
    const map = new Map<string, { points: number; approvedCount: number }>();
    for (const u of allUsers) {
      if (u.isAdmin) continue;
      map.set(u.username, { points: 0, approvedCount: 0 });
    }
    for (const a of achievements) {
      if (a.status !== "approved") continue;
      const entry = map.get(a.username);
      if (entry) {
        entry.points += POINTS_MAP[a.level];
        entry.approvedCount += 1;
      } else {
        map.set(a.username, {
          points: POINTS_MAP[a.level],
          approvedCount: 1,
        });
      }
    }
    return Array.from(map.entries())
      .map(([username, v]) => ({ username, ...v }))
      .sort((x, y) => y.points - x.points || y.approvedCount - x.approvedCount);
  }, [achievements, allUsers]);

  const value: AppContextValue = {
    currentUser,
    login,
    logout,
    page,
    setPage,
    memberDetails,
    saveMemberDetails: saveMemberDetailsLocal,
    resetMemberPassword,
    allUsers,
    achievements,
    addAchievement,
    reviewAchievement,
    deleteAchievement,
    leaderboard,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
