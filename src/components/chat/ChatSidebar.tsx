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
        className="relative z-50 h-full flex flex-col bg-sidebar border-r border-border flex-shrink-0 transition-[width] duration-300 ease-in-out overflow-hidden"
        style={{ width: open ? 280 : 52 }}
      >
        <div className="flex flex-col h-full" style={{ minWidth: open ? 280 : 52 }}>
          {/* Toggle row */}
          <div className={`flex items-center pt-4 ${open ? "px-4 gap-3" : "justify-center"}`}>
            <button
              onClick={onToggle}
              className="p-2 rounded-lg text-icon-rail-foreground hover:text-foreground hover:bg-accent transition-colors flex-shrink-0"
              title="Toggle sidebar"
            >
              <CopyIcon className="h-5 w-5" />
            </button>
            {open && (
              <h2 className="text-lg font-bold text-foreground tracking-tight">Claude</h2>
            )}
          </div>

          {/* Nav top */}
          <nav className={`mt-1 space-y-0.5 ${open ? "px-3" : "px-0 flex flex-col items-center"}`}>
            {NAV_TOP.map((item) => (
              <button
                key={item.label}
                onClick={item.action === "new" ? onNew : undefined}
                className={`flex items-center rounded-lg text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors ${
                  open
                    ? "gap-3.5 w-full px-3 py-2 text-[15px]"
                    : "p-2 justify-center"
                }`}
                title={!open ? item.label : undefined}
              >
                <item.icon className={`flex-shrink-0 ${open ? "h-[18px] w-[18px]" : "h-5 w-5"}`} />
                {open && item.label}
              </button>
            ))}
          </nav>

          {/* Nav mid */}
          <nav className={`mt-3 space-y-0.5 ${open ? "px-3" : "px-0 flex flex-col items-center"}`}>
            {NAV_MID.map((item) => (
              <button
                key={item.label}
                className={`flex items-center rounded-lg text-sidebar-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors ${
                  open
                    ? "gap-3.5 w-full px-3 py-2 text-[15px]"
                    : "p-2 justify-center"
                }`}
                title={!open ? item.label : undefined}
              >
                <item.icon className={`flex-shrink-0 ${open ? "h-[18px] w-[18px]" : "h-5 w-5"}`} />
                {open && item.label}
              </button>
            ))}
          </nav>

          {/* Recents (only when expanded) / spacer when collapsed */}
          {open ? (
            <div className="mt-3 flex-1 overflow-y-auto scrollbar-thin px-3">
              <p className="text-[13px] text-muted-foreground px-3 py-2">Recents</p>
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
                            <Star className="h-4 w-4" /> Star
                          </button>
                          <button className="flex items-center gap-3 w-full px-4 py-2 text-popover-foreground hover:bg-accent transition-colors">
                            <Pencil className="h-4 w-4" /> Rename
                          </button>
                          <button className="flex items-center gap-3 w-full px-4 py-2 text-popover-foreground hover:bg-accent transition-colors">
                            <FolderPlus className="h-4 w-4" /> Add to project
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
                            <Trash2 className="h-4 w-4" /> Delete
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
          ) : (
            <div className="flex-1" />
          )}

          {/* Bottom */}
          {open ? (
            <div className="flex-shrink-0 border-t border-border px-3 py-3">
              <div className="flex items-center gap-3 px-2">
                <div className="w-9 h-9 rounded-full bg-muted text-foreground flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  DA
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">Dhiwahar Ad...</p>
                  <p className="text-xs text-muted-foreground">Pro plan</p>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <button className="p-1 text-sidebar-foreground hover:text-foreground transition-colors">
                    <ChevronsUpDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 pb-3">
              <div className="flex items-center justify-center h-5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "hsl(217, 91%, 60%)" }} />
              </div>
              <button className="p-2 rounded-lg text-icon-rail-foreground hover:text-foreground hover:bg-accent transition-colors" title="Download">
                <Download className="h-5 w-5" />
              </button>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold cursor-pointer mt-0.5"
                style={{ background: "hsl(40, 20%, 88%)", color: "hsl(30, 10%, 25%)" }}
                title="User"
              >
                DA
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
