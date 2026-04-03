import { Plus, MessageSquare, Trash2, Sun, Moon, PanelLeftClose } from "lucide-react";
import { Conversation, groupConversationsByDate } from "@/lib/chat-store";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  open: boolean;
  onClose: () => void;
}

export function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  theme,
  onToggleTheme,
  open,
  onClose,
}: ChatSidebarProps) {
  const groups = groupConversationsByDate(conversations);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:relative z-50 top-0 left-0 h-full flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ${
          open ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:w-0 lg:-translate-x-full"
        } overflow-hidden`}
      >
        <div className="flex items-center justify-between p-3 flex-shrink-0">
          <button
            onClick={onNew}
            className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-lg hover:bg-sidebar-accent transition-colors flex-1"
          >
            <Plus className="h-4 w-4" />
            New chat
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 pb-2">
          {groups.map((group) => (
            <div key={group.label} className="mb-3">
              <p className="text-xs font-medium text-muted-foreground px-3 py-1.5">
                {group.label}
              </p>
              {group.conversations.map((c) => (
                <div
                  key={c.id}
                  className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
                    c.id === activeId
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                  onClick={() => onSelect(c.id)}
                >
                  <MessageSquare className="h-3.5 w-3.5 flex-shrink-0 opacity-50" />
                  <span className="truncate flex-1">{c.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(c.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ))}

          {conversations.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-8">
              No conversations yet
            </p>
          )}
        </nav>

        <div className="flex-shrink-0 p-3 border-t border-sidebar-border">
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
            {theme === "light" ? "Dark mode" : "Light mode"}
          </button>
        </div>
      </aside>
    </>
  );
}
