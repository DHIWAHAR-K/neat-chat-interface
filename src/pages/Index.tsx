import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, Share } from "lucide-react";
import { ChatSidebar } from "@/components/chat/ChatSidebar";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { WelcomeScreen } from "@/components/chat/WelcomeScreen";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { useTheme } from "@/hooks/use-theme";
import {
  Conversation,
  Message,
  FileAttachment,
  genId,
  getMockResponse,
} from "@/lib/chat-store";

const Index = () => {
  const { theme, toggleTheme } = useTheme();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId) ?? null;
  const hasMessages = active && active.messages.length > 0;

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, 50);
  }, []);

  const handleNewChat = useCallback(() => {
    setActiveId(null);
  }, []);

  const handleDeleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeId === id) setActiveId(null);
    },
    [activeId]
  );

  const handleSend = useCallback(
    (content: string, files: FileAttachment[]) => {
      const userMsg: Message = {
        id: genId(),
        role: "user",
        content,
        files: files.length > 0 ? files : undefined,
        timestamp: Date.now(),
      };

      let convId = activeId;

      if (!convId) {
        const newConv: Conversation = {
          id: genId(),
          title: content.slice(0, 40) + (content.length > 40 ? "…" : ""),
          messages: [userMsg],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        convId = newConv.id;
        setConversations((prev) => [newConv, ...prev]);
        setActiveId(convId);
      } else {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId
              ? { ...c, messages: [...c.messages, userMsg], updatedAt: Date.now() }
              : c
          )
        );
      }

      scrollToBottom();

      setIsTyping(true);
      const responseDelay = 1000 + Math.random() * 1500;
      const finalConvId = convId;

      setTimeout(() => {
        const aiMsg: Message = {
          id: genId(),
          role: "assistant",
          content: getMockResponse(),
          timestamp: Date.now(),
        };
        setConversations((prev) =>
          prev.map((c) =>
            c.id === finalConvId
              ? { ...c, messages: [...c.messages, aiMsg], updatedAt: Date.now() }
              : c
          )
        );
        setIsTyping(false);
        scrollToBottom();
      }, responseDelay);
    },
    [activeId, scrollToBottom]
  );

  const handleSuggestionClick = useCallback(
    (text: string) => {
      handleSend(text, []);
    },
    [handleSend]
  );

  useEffect(() => {
    scrollToBottom();
  }, [active?.messages.length, scrollToBottom]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <ChatSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={(id) => {
          setActiveId(id);
          setSidebarOpen(false);
        }}
        onNew={() => {
          handleNewChat();
          setSidebarOpen(false);
        }}
        onDelete={handleDeleteConversation}
        theme={theme}
        onToggleTheme={toggleTheme}
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((o) => !o)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between h-12 px-4 flex-shrink-0">
          {hasMessages ? (
            <>
              <button className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors">
                {active.title}
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-muted">
                <Share className="h-4 w-4" />
                Share
              </button>
            </>
          ) : (
            <div />
          )}
        </header>

        {/* Messages or Welcome */}
        {!hasMessages ? (
          <>
            <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
            <div className="flex-shrink-0">
              <ChatInput onSend={handleSend} disabled={isTyping} isWelcome />
            </div>
          </>
        ) : (
          <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
              <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
                {active.messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                {isTyping && <TypingIndicator />}
              </div>
            </div>
            <div className="flex-shrink-0">
              <ChatInput onSend={handleSend} disabled={isTyping} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
