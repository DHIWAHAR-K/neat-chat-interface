import { Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "Explain quantum computing in simple terms",
  "Write a short poem about the ocean",
  "Help me debug a React component",
  "What are the best practices for TypeScript?",
];

interface WelcomeScreenProps {
  onSuggestionClick: (text: string) => void;
}

export function WelcomeScreen({ onSuggestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 pb-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
      </div>

      <h1 className="text-2xl font-semibold mb-2">How can I help you today?</h1>
      <p className="text-muted-foreground text-sm mb-8">Ask me anything or pick a suggestion below</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-xl">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestionClick(s)}
            className="text-left text-sm px-4 py-3 rounded-xl border border-border hover:bg-muted/60 transition-colors leading-relaxed"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
