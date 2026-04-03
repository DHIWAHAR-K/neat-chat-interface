import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Search,
  Settings2,
  MessageCircle,
  FolderKanban,
  Blocks,
  Code2,
  Download,
  ChevronsUpDown,
  Copy as CopyIcon,
  MoreHorizontal,
  Star,
  Pencil,
  FolderPlus,
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

const RAIL_ICONS_TOP = [
  { icon: CopyIcon, label: "Open", action: "toggle" },
  { icon: Plus, label: "New chat", action: "new" },
  { icon: Search, label: "Search" },
  { icon: Settings2, label: "Customize" },
];

const RAIL_ICONS_MID = [
  { icon: MessageCircle, label: "Chats" },
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
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpenId) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpenId]);

  return (
    <div className="flex h-full flex-shrink-0 relative">
      {/* Icon Rail - always visible */}
      <div className="flex flex-col items-center w-[52px] bg-icon-rail border-r border-border py-3 gap-0.5 flex-shrink-0 z-50">
        {/* Top icons */}
        {RAIL_ICONS_TOP.map((item) => (
          <button
            key={item.label}
            onClick={
              item.action === "toggle" ? onToggle :
              item.action === "new" ? onNew :
              undefined
            }
            className="p-2.5 rounded-lg text-icon-rail-foreground hover:text-foreground hover:bg-accent transition-colors"
            title={item.label}
          >
            <item.icon className="h-[18px] w-[18px]" />
          </button>
        ))}

        {/* Separator */}
        <div className="w-6 border-t border-border my-1.5" />

        {RAIL_ICONS_MID.map((item) => (
          <button
            key={item.label}
            className="p-2.5 rounded-lg text-icon-rail-foreground hover:text-foreground hover:bg-accent transition-colors"
            title={item.label}
          >
            <item.icon className="h-[18px] w-[18px]" />
          </button>
        ))}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom icons */}
        <div className="flex flex-col items-center gap-0.5">
          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-lg text-icon-rail-foreground hover:text-foreground hover:bg-accent transition-colors"
            title={theme === "light" ? "Dark mode" : "Light mode"}
          >
            {theme === "light" ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
          </button>
          <div className="relative">
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-icon-rail" />
            <button
              className="p-2.5 rounded-lg text-icon-rail-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Download"
            >
              <Download className="h-[18px] w-[18px]" />
            </button>
          </div>
          <div
            className="w-9 h-9 rounded-full bg-muted text-foreground flex items-center justify-center text-xs font-semibold cursor-pointer mt-1"
            title="User"
          >
            DA
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Expandable panel */}
      <aside
        className={`fixed lg:absolute z-50 top-0 left-[52px] h-full flex flex-col bg-sidebar border-r border-border transition-all duration-300 overflow-hidden ${
          open ? "w-60" : "w-0"
        }`}
      >
        <div className="flex flex-col h-full min-w-[240px]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <h2 className="text-base font-bold text-foreground">Claude</h2>
          </div>

          {/* Nav items with labels */}
          <nav className="px-2 space-y-0.5">
            <button
              onClick={onNew}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
            >
              <Plus className="h-[18px] w-[18px]" />
              New chat
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors">
              <Search className="h-[18px] w-[18px]" />
              Search
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors">
              <Settings2 className="h-[18px] w-[18px]" />
              Customize
            </button>
          </nav>

          <nav className="px-2 mt-2 space-y-0.5">
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors">
              <MessageCircle className="h-[18px] w-[18px]" />
              Chats
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors">
              <FolderKanban className="h-[18px] w-[18px]" />
              Projects
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors">
              <Blocks className="h-[18px] w-[18px]" />
              Artifacts
            </button>
            <button className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors">
              <Code2 className="h-[18px] w-[18px]" />
              Code
            </button>
          </nav>

          {/* Recents */}
          <div className="mt-3 flex-1 overflow-y-auto scrollbar-thin px-2">
            <p className="text-[11px] font-medium text-muted-foreground px-3 py-1.5 uppercase tracking-wider">
              Recents
            </p>
            <div className="space-y-0.5">
              {groups.map((group) =>
                group.conversations.map((c) => (
                  <div
                    key={c.id}
                    className={`group relative flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
                      c.id === activeId
                        ? "bg-sidebar-accent text-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                    onClick={() => {
                      onSelect(c.id);
                      setMenuOpenId(null);
                    }}
                  >
                    <span className="truncate flex-1">{c.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId(menuOpenId === c.id ? null : c.id);
                      }}
                      className={`p-0.5 rounded text-muted-foreground hover:text-foreground transition-all flex-shrink-0 ${
                        menuOpenId === c.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {menuOpenId === c.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 top-full mt-1 z-50 w-48 rounded-xl bg-popover border border-border shadow-lg py-1.5 text-sm"
                      >
                        <button className="flex items-center gap-3 w-full px-4 py-2 text-popover-foreground hover:bg-accent transition-colors">
                          <Star className="h-4 w-4" />
                          Star
                        </button>
                        <button className="flex items-center gap-3 w-full px-4 py-2 text-popover-foreground hover:bg-accent transition-colors">
                          <Pencil className="h-4 w-4" />
                          Rename
                        </button>
                        <button className="flex items-center gap-3 w-full px-4 py-2 text-popover-foreground hover:bg-accent transition-colors">
                          <FolderPlus className="h-4 w-4" />
                          Add to project
                        </button>
                        <div className="my-1 border-t border-border" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(c.id);
                            setMenuOpenId(null);
                          }}
                          className="flex items-center gap-3 w-full px-4 py-2 text-destructive hover:bg-accent transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}

              {conversations.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-8">
                  No conversations yet
                </p>
              )}
            </div>
          </div>

          {/* Bottom user */}
          <div className="flex-shrink-0 px-3 pb-4 pt-2">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 rounded-full bg-muted text-foreground flex items-center justify-center text-xs font-semibold flex-shrink-0">
                DA
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Dhiwahar Adhithya K</p>
                <p className="text-xs text-muted-foreground">Pro plan</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Download className="h-4 w-4 text-sidebar-foreground" />
                <ChevronsUpDown className="h-4 w-4 text-sidebar-foreground" />
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
