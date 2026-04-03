import {
  PanelLeft,
  PanelLeftClose,
  Plus,
  Search,
  Settings2,
  MessageSquare,
  FolderKanban,
  Blocks,
  Code2,
  Download,
  Trash2,
  Sun,
  Moon,
} from "lucide-react";
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
  onToggle: () => void;
}

const NAV_ITEMS = [
  { icon: Search, label: "Search" },
  { icon: Settings2, label: "Customize" },
  { icon: MessageSquare, label: "Chats" },
  { icon: FolderKanban, label: "Projects" },
  { icon: Blocks, label: "Artifacts" },
  { icon: Code2, label: "Code" },
];

export function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNew,
  onDelete,
  theme,
  onToggleTheme,
  open,
  onToggle,
}: ChatSidebarProps) {
  const groups = groupConversationsByDate(conversations);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onToggle}
        />
      )}

      <div className="flex h-full flex-shrink-0">
        {/* Icon Rail - always visible */}
        <div className="flex flex-col items-center w-12 bg-icon-rail py-3 gap-1 flex-shrink-0 z-50 relative">
          {/* Top section */}
          <button
            onClick={onToggle}
            className="p-2 rounded-lg text-icon-rail-foreground hover:text-foreground hover:bg-accent transition-colors"
            title={open ? "Close sidebar" : "Open sidebar"}
          >
            {open ? <PanelLeftClose className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
          </button>

          <button
            onClick={onNew}
            className="p-2 rounded-lg text-icon-rail-foreground hover:text-foreground hover:bg-accent transition-colors"
            title="New chat"
          >
            <Plus className="h-5 w-5" />
          </button>

          <div className="mt-2 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                className="p-2 rounded-lg text-icon-rail-foreground hover:text-foreground hover:bg-accent transition-colors"
                title={item.label}
              >
                <item.icon className="h-5 w-5" />
              </button>
            ))}
          </div>

          {/* Bottom section */}
          <div className="mt-auto flex flex-col gap-1 items-center">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg text-icon-rail-foreground hover:text-foreground hover:bg-accent transition-colors"
              title={theme === "light" ? "Dark mode" : "Light mode"}
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            <button
              className="p-2 rounded-lg text-icon-rail-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Download"
            >
              <Download className="h-5 w-5" />
            </button>
            <div
              className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-semibold mt-1 cursor-pointer"
              title="User"
            >
              U
            </div>
          </div>
        </div>

        {/* Expandable Panel */}
        <aside
          className={`fixed lg:relative z-50 top-0 left-12 h-full flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 overflow-hidden ${
            open ? "w-60" : "w-0"
          }`}
        >
          <div className="flex items-center justify-between p-3 flex-shrink-0">
            <span className="text-sm font-semibold text-foreground">Chats</span>
          </div>

          <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 pb-2">
            {groups.map((group) => (
              <div key={group.label} className="mb-3">
                <p className="text-[11px] font-medium text-muted-foreground px-2 py-1.5 uppercase tracking-wider">
                  {group.label}
                </p>
                {group.conversations.map((c) => (
                  <div
                    key={c.id}
                    className={`group flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer text-sm transition-colors ${
                      c.id === activeId
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                    onClick={() => onSelect(c.id)}
                  >
                    <span className="truncate flex-1">{c.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(c.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-muted-foreground hover:text-destructive transition-all flex-shrink-0"
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
        </aside>
      </div>
    </>
  );
}
