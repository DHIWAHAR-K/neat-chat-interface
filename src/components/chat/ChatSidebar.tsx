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
  LayoutGrid,
  Copy,
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

const NAV_ITEMS_TOP = [
  { icon: Plus, label: "New chat", action: "new" },
  { icon: Search, label: "Search" },
  { icon: Settings2, label: "Customize" },
];

const NAV_ITEMS_MID = [
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

  // Close context menu on outside click
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
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed lg:relative z-50 top-0 left-0 h-full flex flex-col bg-sidebar transition-all duration-300 overflow-hidden ${
          open ? "w-72" : "w-0 lg:w-0"
        }`}
      >
        <div className="flex flex-col h-full min-w-[288px]">
          {/* Top icon */}
          <div className="px-4 pt-4 pb-2">
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
          </div>

          {/* Claude title + new window */}
          <div className="flex items-center justify-between px-5 pb-4">
            <h2 className="text-lg font-bold text-foreground">Claude</h2>
            <button className="p-1.5 rounded-lg text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors">
              <Copy className="h-4 w-4" />
            </button>
          </div>

          {/* Nav items - top group */}
          <nav className="px-3 space-y-0.5">
            {NAV_ITEMS_TOP.map((item) => (
              <button
                key={item.label}
                onClick={item.action === "new" ? onNew : undefined}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
              >
                <item.icon className="h-[18px] w-[18px]" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Nav items - mid group */}
          <nav className="px-3 mt-3 space-y-0.5">
            {NAV_ITEMS_MID.map((item) => (
              <button
                key={item.label}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
              >
                <item.icon className="h-[18px] w-[18px]" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Recents */}
          <div className="mt-4 flex-1 overflow-y-auto scrollbar-thin px-3">
            <p className="text-xs font-medium text-muted-foreground px-3 py-1.5">
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

                    {/* Context menu */}
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

          {/* Bottom user section */}
          <div className="flex-shrink-0 px-3 pb-4 pt-2">
            {/* Theme toggle */}
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors mb-2"
            >
              {theme === "light" ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
              {theme === "light" ? "Dark mode" : "Light mode"}
            </button>

            {/* User row */}
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-9 h-9 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold flex-shrink-0">
                DA
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Dhiwahar Adhithya K</p>
                <p className="text-xs text-muted-foreground">Pro plan</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <button className="p-1 text-sidebar-foreground hover:text-foreground transition-colors">
                  <Download className="h-4 w-4" />
                </button>
                <button className="p-1 text-sidebar-foreground hover:text-foreground transition-colors">
                  <ChevronsUpDown className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
