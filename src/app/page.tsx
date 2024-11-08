import { FileInput } from "@/app/components/file-input";
import { Leaderboard } from "@/app/components/leaderboard";
import { ThemeSwitcher } from "@/app/components/theme-switcher";

export default async function Home() {
  return (
    <div className="container mx-auto flex flex-col gap-4 px-2 py-12 md:gap-8 md:px-0 md:pt-8">
      <div>
        <h1 className="font-primary text-center text-5xl font-normal md:text-6xl">
          Pixel <span className="absolute text-4xl top-5">✨</span>
        </h1>
        <h1 className="font-primary text-center text-3xl font-normal md:text-5xl">
        Analyzer
        </h1>
      </div>
      <FileInput />
      <Leaderboard />
      <ThemeSwitcher />
    </div>
  );
}
