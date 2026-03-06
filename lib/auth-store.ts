import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DATA_DIR = join(process.cwd(), "data");
const USERS_FILE = join(DATA_DIR, "users.json");
const SESSIONS_FILE = join(DATA_DIR, "sessions.json");

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

// File-based storage helpers
function readJsonFile<T>(filePath: string, defaultValue: T): T {
  try {
    if (existsSync(filePath)) {
      const data = readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error(`Error reading ${filePath}:`, e);
  }
  return defaultValue;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error(`Error writing ${filePath}:`, e);
  }
}

export interface StoredUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  userType: "buyer" | "investor";
  createdAt: string;
}

export interface StoredSession {
  userId: string;
  expires: number;
  accessToken?: string;
}

// Get all users
export function getUsers(): StoredUser[] {
  return readJsonFile<StoredUser[]>(USERS_FILE, []);
}

// Get user by email
export function getUserByEmail(email: string): StoredUser | undefined {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

// Save user
export function saveUser(user: StoredUser): void {
  const users = getUsers();
  const existingIndex = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
  
  if (existingIndex >= 0) {
    users[existingIndex] = { ...users[existingIndex], ...user };
  } else {
    users.push(user);
  }
  
  writeJsonFile(USERS_FILE, users);
}

// Get sessions
export function getSessions(): StoredSession[] {
  return readJsonFile<StoredSession[]>(SESSIONS_FILE, []);
}

// Save session
export function saveSession(session: StoredSession): void {
  const sessions = getSessions();
  const filtered = sessions.filter(s => s.userId !== session.userId);
  filtered.push(session);
  writeJsonFile(SESSIONS_FILE, filtered);
}
