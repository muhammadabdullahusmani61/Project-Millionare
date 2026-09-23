'use client';

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { IconButton } from "@/components/ui/button";

export function ThemeControl() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("usmani-theme");
    const shouldUseDark = savedTheme === "dark";
    document.documentElement.dataset.theme = shouldUseDark ? "dark" : "light";
    if (shouldUseDark !== dark) {
      const frame = window.requestAnimationFrame(() => setDark(shouldUseDark));
      return () => window.cancelAnimationFrame(frame);
    }
  }, [dark]);

  function toggleTheme() {
    const nextDark = !dark;
    setDark(nextDark);
    document.documentElement.dataset.theme = nextDark ? "dark" : "light";
    window.localStorage.setItem("usmani-theme", nextDark ? "dark" : "light");
  }

  return (
    <IconButton onClick={toggleTheme} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} title={dark ? "Switch to light theme" : "Switch to dark theme"}>
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </IconButton>
  );
}
