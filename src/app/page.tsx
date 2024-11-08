import { FileInput } from "@/app/components/file-input";
import { Leaderboard } from "@/app/components/leaderboard";
import ThemeSwitcher from "@/app/components/theme-switcher";

const FAKE_DATA = [
  {
    name: "Alice",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    score: 13,
    imageUrl: "/paisagem-1.png",
  },
  {
    name: "Bob",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    score: 25,
    imageUrl: "/paisagem-2.jpg",
  },
  {
    name: "Charlie",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    score: 37,
    imageUrl: "/paisagem-1.png",
  },
];

export default async function Home() {
  return (
    <div className="container mx-auto py-12 px-2 flex flex-col gap-4 md:pt-8 md:px-0 md:gap-8">
      <h1 className="text-5xl text-center font-primary font-normal md:text-6xl">
        AIsthetics ✨
      </h1>
      <FileInput />
      <Leaderboard data={FAKE_DATA} />
      <ThemeSwitcher />
  </div>    
  );
}
