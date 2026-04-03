import { useState, useRef, useEffect, useCallback } from "react";
import { PanelLeft } from "lucide-react";
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

      // Mock AI response
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

  // Auto-scroll on new messages
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
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center h-12 px-3 flex-shrink-0 border-b border-border">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <PanelLeft className="h-5 w-5" />
            </button>
          )}
          <span className="ml-2 text-sm font-medium text-muted-foreground">
            {active ? active.title : "New chat"}
          </span>
        </header>

        {/* Messages or Welcome */}
        {!active || active.messages.length === 0 ? (
          <WelcomeScreen onSuggestionClick={handleSuggestionClick} />
        ) : (
          <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
              {active.messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              {isTyping && <TypingIndicator />}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex-shrink-0">
          <ChatInput onSend={handleSend} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
};

export default Index;
