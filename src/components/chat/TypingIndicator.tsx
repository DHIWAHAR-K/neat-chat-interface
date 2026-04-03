export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-4 px-1">
      <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-pulse-dot" style={{ animationDelay: "0ms" }} />
      <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-pulse-dot" style={{ animationDelay: "200ms" }} />
      <div className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-pulse-dot" style={{ animationDelay: "400ms" }} />
    </div>
  );
}
