import type { User } from "../types";

const memberNumbers: number[] = [
  791, 806, 807, 808, 809, 810, 811, 812, 813, 814,
  816, 817, 818, 819, 820, 821, 822, 823, 824, 825,
  826, 827, 828, 829, 830, 831, 832, 833, 834, 835,
  836, 849,
];

const members: User[] = memberNumbers.map((n) => ({
  username: String(n),
  password: `${n}@fath`,
  isAdmin: false,
  displayName: `Member ${n}`,
}));

export const INITIAL_USERS: User[] = [
  {
    username: "ADMINISTRATOR",
    password: "@admin__",
    isAdmin: true,
    displayName: "Administrator",
  },
  ...members,
];

// Points per achievement level
export const POINTS_MAP = {
  Beginner: 5,
  Intermediate: 10,
  Advanced: 15,
} as const;
