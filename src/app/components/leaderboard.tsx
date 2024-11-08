interface LeaderboardProps {
  data: {
    score: number;
    description: string;
    imageUrl: string;
  }[];
}

const colorsByIndex: Record<number, string> = {
  0: "bg-gold border-gold",
  1: "bg-silver border-silver",
  2: "bg-bronze border-bronze",
};

export function Leaderboard(props: LeaderboardProps) {
  const { data } = props;

  if (data.length === 0) return null;

  const orderedData = data.sort((a, b) => b.score - a.score);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-center text-3xl font-semibold font-second tracking-wider">
        Leaderboard
      </h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {orderedData.map((item, index) => (
          <div
            key={index}
            className="bg-foreground/[2.5%] text-foreground border rounded-lg shadow relative"
          >
            <div
              className={`text-white shadow-md w-8 h-8 flex items-center justify-center border rounded-full absolute -top-4 -left-4 font-bold
                ${colorsByIndex[index] ?? "bg-border"}`}
            >
              {index + 1}
            </div>

            <img
              className="rounded-t-lg w-full h-48 object-cover"
              src={item.imageUrl}
              alt=""
            />

            <div className="px-4 py-2">
              <h5 className="mb-2 text-center text-2xl font-bold font-second tracking-tight">
                {item.score}
              </h5>
              <p className="mb-3 font-normal font-second text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
