import { FileInput } from "@/app/components/file-input";
import { Leaderboard } from "@/app/components/leaderboard";
import { ThemeSwitcher } from "@/app/components/theme-switcher";

export default async function Home() {
  return (
    <div className="container mx-auto flex flex-col gap-4 px-2 py-12 md:gap-8 md:px-0 md:pt-8">
      <div>
        <h1 className="text-center font-primary text-5xl font-normal md:text-6xl">
          Pixel <span className="absolute top-5 text-4xl">✨</span>
        </h1>
        <h1 className="text-center font-primary text-3xl font-normal md:text-5xl">
          Analyzer
        </h1>
        <p className="mx-auto mt-4 w-full text-center text-sm font-extralight text-foreground lg:w-2/3">
          🤖 Have you ever wondered how the AI sees 👀 and what does it thinks
          of our world? 🌎 or how it judges the beauty (or not) of an image? 🖼️
          lets find out together! 🚀
        </p>
      </div>
      <FileInput />
      <Leaderboard />
      <ThemeSwitcher />
    </div>
  );
}
