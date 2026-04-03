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

const NAV_TOP = [
  { icon: Plus, label: "New chat", action: "new" },
  { icon: Search, label: "Search" },
  { icon: Settings2, label: "Customize" },
];

const NAV_MID = [
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
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`relative z-50 h-full flex flex-col bg-sidebar border-r border-border flex-shrink-0 transition-[width] duration-300 ease-in-out overflow-hidden ${
          open ? "w-[280px]" : "w-[52px]"
        }`}
      >
        {/* ===== EXPANDED STATE ===== */}
        <div
          className={`absolute inset-0 flex flex-col transition-opacity duration-200 ${
            open ? "opacity-100 delay-100" : "opacity-0 pointer-events-none"
          }`}
          style={{ minWidth: 280 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4">
            <h2 className="text-lg font-bold text-foreground tracking-tight">Claude</h2>
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
            >
              <CopyIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Nav top */}
          <nav className="px-3 space-y-0.5">
            {NAV_TOP.map((item) => (
              <button
                key={item.label}
                onClick={item.action === "new" ? onNew : undefined}
                className="flex items-center gap-3.5 w-full px-3 py-2 rounded-lg text-[15px] text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
              >
                <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Nav mid */}
          <nav className="px-3 mt-3 space-y-0.5">
            {NAV_MID.map((item) => (
              <button
                key={item.label}
                className="flex items-center gap-3.5 w-full px-3 py-2 rounded-lg text-[15px] text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
              >
                <item.icon className="h-[18px] w-[18px] flex-shrink-0" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Recents */}
          <div className="mt-3 flex-1 overflow-y-auto scrollbar-thin px-3">
            <p className="text-[13px] text-muted-foreground px-3 py-2">
              Recents
            </p>
            <div className="space-y-0.5">
              {groups.map((group) =>
                group.conversations.map((c) => (
                  <div
                    key={c.id}
                    className={`group relative flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer text-[15px] transition-colors ${
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
                        className="absolute right-0 top-full mt-1 z-[60] w-48 rounded-xl bg-popover border border-border shadow-lg py-1.5 text-sm"
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
          <div className="flex-shrink-0 border-t border-border px-3 py-3">
            <div className="flex items-center gap-3 px-2">
              <div className="w-9 h-9 rounded-full bg-muted text-foreground flex items-center justify-center text-xs font-semibold flex-shrink-0">
                DA
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">Dhiwahar Adhithya K</p>
                <p className="text-xs text-muted-foreground">Pro plan</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-primary" />
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

        {/* ===== COLLAPSED STATE (Icon Rail) ===== */}
        <div
          className={`absolute inset-0 flex flex-col items-center py-3 gap-0.5 transition-opacity duration-200 ${
            open ? "opacity-0 pointer-events-none" : "opacity-100 delay-100"
          }`}
          style={{ width: 52 }}
        >
          {/* Top icons */}
          <button
            onClick={onToggle}
            className="p-2.5 rounded-lg text-icon-rail-foreground hover:text-foreground hover:bg-accent transition-colors"
            title="Open sidebar"
          >
            <CopyIcon className="h-[18px] w-[18px]" />
          </button>
          <button
            onClick={onNew}
            className="p-2.5 rounded-lg text-icon-rail-foreground hover:text-foreground hover:bg-accent transition-colors"
            title="New chat"
          >
            <Plus className="h-[18px] w-[18px]" />
          </button>
          <button className="p-2.5 rounded-lg text-icon-rail-foreground hover:text-foreground hover:bg-accent transition-colors" title="Search">
            <Search className="h-[18px] w-[18px]" />
          </button>
          <button className="p-2.5 rounded-lg text-icon-rail-foreground hover:text-foreground hover:bg-accent transition-colors" title="Customize">
            <Settings2 className="h-[18px] w-[18px]" />
          </button>

          <div className="w-6 border-t border-border my-1.5" />

          <button className="p-2.5 rounded-lg text-icon-rail-foreground hover:text-foreground hover:bg-accent transition-colors" title="Chats">
            <MessageCircle className="h-[18px] w-[18px]" />
          </button>
          <button className="p-2.5 rounded-lg text-icon-rail-foreground hover:text-foreground hover:bg-accent transition-colors" title="Projects">
            <FolderKanban className="h-[18px] w-[18px]" />
          </button>
          <button className="p-2.5 rounded-lg text-icon-rail-foreground hover:text-foreground hover:bg-accent transition-colors" title="Artifacts">
            <Blocks className="h-[18px] w-[18px]" />
          </button>
          <button className="p-2.5 rounded-lg text-icon-rail-foreground hover:text-foreground hover:bg-accent transition-colors" title="Code">
            <Code2 className="h-[18px] w-[18px]" />
          </button>

          <div className="flex-1" />

          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-lg text-icon-rail-foreground hover:text-foreground hover:bg-accent transition-colors"
            title={theme === "light" ? "Dark mode" : "Light mode"}
          >
            {theme === "light" ? <Moon className="h-[18px] w-[18px]" /> : <Sun className="h-[18px] w-[18px]" />}
          </button>
          <div className="relative">
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-sidebar z-10" />
            <button className="p-2.5 rounded-lg text-icon-rail-foreground hover:text-foreground hover:bg-accent transition-colors" title="Download">
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
      </aside>
    </>
  );
}
