import { useState } from "react";
import { Message } from "@/lib/chat-store";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { FileText, Image as ImageIcon, Copy, Check, ThumbsUp, ThumbsDown, RefreshCw } from "lucide-react";

export function ChatMessage({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] ${
          isUser
            ? "bg-user-bubble text-user-bubble-foreground rounded-2xl rounded-br-md px-4 py-2.5"
            : "py-2"
        }`}
      >
        {message.files && message.files.length > 0 && (
          <div className={`flex flex-wrap gap-2 ${isUser ? "mb-2" : "mb-3"}`}>
            {message.files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-2 bg-muted/60 rounded-lg px-3 py-1.5 text-xs"
              >
                {file.type.startsWith("image/") ? (
                  <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                ) : (
                  <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                )}
                <span className="truncate max-w-[120px]">{file.name}</span>
              </div>
            ))}
          </div>
        )}

        {isUser ? (
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
        ) : (
          <MarkdownRenderer content={message.content} />
        )}

        {/* Action icons for AI messages */}
        {!isUser && (
          <div className="flex items-center gap-1 mt-2">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Copy"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
            <button
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Good response"
            >
              <ThumbsUp className="h-3.5 w-3.5" />
            </button>
            <button
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Bad response"
            >
              <ThumbsDown className="h-3.5 w-3.5" />
            </button>
            <button
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Retry"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
