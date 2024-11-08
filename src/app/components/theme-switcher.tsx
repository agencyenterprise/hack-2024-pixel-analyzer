"use client";

import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";

// import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  // const { theme, setTheme } = useTheme();
  const [theme, setTheme] = useState("");

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

        setTheme(newTheme);
      }}
    />
  );
};

export default ThemeSwitcher;
