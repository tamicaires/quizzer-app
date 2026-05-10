const PREFIX = "quizzer_";

function key(name: string): string {
  return `${PREFIX}${name}`;
}

export function loadFromStorage<T>(name: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key(name));
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(name: string, value: T): void {
  try {
    localStorage.setItem(key(name), JSON.stringify(value));
  } catch {
    // storage full or unavailable — silent fail
  }
}

export function removeFromStorage(name: string): void {
  try {
    localStorage.removeItem(key(name));
  } catch {
    // silent fail
  }
}
