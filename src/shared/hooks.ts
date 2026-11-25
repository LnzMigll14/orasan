import { useEffect, useState } from "react";

/** The current time, refreshed every second while `live` is true. */
export function useNow(live: boolean) {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    setNow(Date.now());
    if (!live) return;
    // Read the clock directly so delayed ticks don't lose elapsed time.
    const interval = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(interval);
  }, [live]);

  return now;
}

/** Copies text and reports whether it worked. */
export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
