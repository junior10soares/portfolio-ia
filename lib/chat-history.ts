export type StoredMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  done?: boolean;
  feedback?: 1 | -1;
  meta?: unknown;
};

export type Conversation = {
  id: string;
  title: string;
  updatedAt: number;
};

const LIST_KEY = "portfolio:chat:conversations";
const threadKey = (id: string) => `portfolio:chat:thread:${id}`;

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadConversations(): Conversation[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(LIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveConversations(list: Conversation[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(LIST_KEY, JSON.stringify(list));
}

export function loadThread(id: string): StoredMessage[] {
  if (!isBrowser()) return [];
  try {
    const raw = window.localStorage.getItem(threadKey(id));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveThread(
  id: string,
  messages: StoredMessage[],
  titleSeed: string
) {
  if (!isBrowser()) return;
  window.localStorage.setItem(threadKey(id), JSON.stringify(messages));

  const list = loadConversations().filter((c) => c.id !== id);
  const title = titleSeed.trim().slice(0, 48) || "Nova conversa";
  list.unshift({ id, title, updatedAt: Date.now() });
  saveConversations(list.slice(0, 20));
}

export function deleteThread(id: string) {
  if (!isBrowser()) return;
  window.localStorage.removeItem(threadKey(id));
  saveConversations(loadConversations().filter((c) => c.id !== id));
}
