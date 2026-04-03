import { Sparkles, Pencil, GraduationCap, Code2 } from "lucide-react";

const ACTION_CHIPS = [
  { icon: Pencil, label: "Write" },
  { icon: GraduationCap, label: "Learn" },
  { icon: Code2, label: "Code" },
];

interface WelcomeScreenProps {
  onSuggestionClick: (text: string) => void;
}

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4">
      {/* Claude sparkle icon */}
      <div className="mb-5">
        <Sparkles className="h-10 w-10 text-primary" />
      </div>

      {/* Greeting */}
      <h1 className="text-3xl font-semibold mb-8 text-foreground">
        {getGreeting()}, User
      </h1>

      {/* Action chips */}
      <div className="flex flex-wrap gap-2 justify-center">
        {ACTION_CHIPS.map((chip) => (
          <button
            key={chip.label}
            onClick={() => onSuggestionClick(`Help me ${chip.label.toLowerCase()}`)}
            className="flex items-center gap-2 text-sm px-4 py-2 rounded-full border border-border hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          >
            <chip.icon className="h-4 w-4" />
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
