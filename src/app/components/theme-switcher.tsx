"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const Icon = theme === "light" ? SunIcon : MoonIcon;

  return (
    <Icon
      className="absolute left-4 top-4 h-6 w-6 cursor-pointer"
      onClick={() => {
        const newTheme = theme === "light" ? "dark" : "light";

        // eslint-disable-next-line
        setTheme(newTheme);
      }}
    />
  );
}
