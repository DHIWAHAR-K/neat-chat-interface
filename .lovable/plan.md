

## Pixel-Perfect Claude UI Overhaul

### What needs to change

The current UI has a traditional sidebar + bottom input layout. The real Claude UI (from your screenshots) has several distinct differences:

### 1. Sidebar: Icon Rail + Expandable Panel
**Current**: A sliding drawer sidebar that fully hides.
**Target**: A permanent narrow icon rail (~48px) on the left that is always visible, with icons stacked vertically. Clicking the sidebar toggle expands a wider panel with text labels and conversation history. The icons (top to bottom): sidebar toggle, new chat (+), search, customize, chats, projects, artifacts, code. Bottom: download icon, user avatar with initials.

### 2. Welcome Screen: Centered Greeting + Inline Input
**Current**: "How can I help you today?" with suggestion grid, input at bottom.
**Target**: Large greeting "Good afternoon, [Name]" with Claude's orange asterisk/sparkle icon. The input box is centered in the page (not stuck to bottom) with "How can I help you today?" as placeholder. Below the input: a row of action chips (Write, Learn, Code, From Drive, From Gmail) with small icons.

### 3. Input Box Redesign
**Current**: Bottom-fixed input with paperclip + send button.
**Target**: Rounded rectangle input with textarea on top row, bottom row has "+" button on left and "Sonnet 4.6" model selector + audio/equalizer icon on right. Send button only appears when there's text. In chat view, placeholder changes to "Reply...".

### 4. Chat Messages + Action Icons
**Current**: AI messages render markdown, no action buttons.
**Target**: After each AI message, show a row of small action icons: copy, thumbs up, thumbs down, retry. The Claude asterisk icon appears as the typing/loading indicator (not dots).

### 5. Header Bar
**Current**: Simple bar with sidebar toggle + "New chat" text.
**Target**: In chat view: conversation title with a dropdown chevron on the left, "Share" button on the right. In welcome view: minimal/no header text.

### 6. Color Palette (Dark Mode Default)
**Current**: Warm beige light mode.
**Target**: Match Claude's exact dark palette - very dark warm brown/charcoal background (~#2a2520), sidebar slightly darker, input box with subtle lighter background, warm-toned text.

---

### Files to Create/Modify

| File | Action |
|------|--------|
| `src/index.css` | Update dark theme colors to match Claude's warm dark brown palette; also refine light mode |
| `src/components/chat/ChatSidebar.tsx` | Complete rewrite: icon rail + expandable panel with nav items (New chat, Search, Customize, Chats, Projects, Artifacts, Code), recents list, user avatar at bottom |
| `src/components/chat/WelcomeScreen.tsx` | Rewrite: large greeting with Claude asterisk, centered input (move input into welcome), action chips row (Write, Learn, Code, From Drive, From Gmail) |
| `src/components/chat/ChatInput.tsx` | Redesign: "+" attach button on bottom-left, model selector "Sonnet 4.6" + audio icon on bottom-right, no visible send button (Enter to send), rounded container |
| `src/components/chat/ChatMessage.tsx` | Add action icon row below AI messages (copy, thumbs up, thumbs down, retry) |
| `src/components/chat/TypingIndicator.tsx` | Replace dots with Claude's animated orange asterisk/sparkle |
| `src/pages/Index.tsx` | Update layout: icon rail always visible, header with title dropdown + Share button, adjust input positioning for welcome vs chat states |
| `tailwind.config.ts` | Add any new animation keyframes (asterisk spin) |

### Technical Details

- The icon rail is a flex column of ~48px width, always rendered, separate from the expandable sidebar panel
- Sidebar expansion overlays or pushes content, with conversation list under "Recents" label
- Welcome screen input is vertically centered; in chat mode it sticks to bottom
- Model selector is a static dropdown-style element (non-functional for now, just UI)
- Action chips use small emoji/icon prefixes (pencil for Write, sparkle for Learn, code brackets for Code, Google Drive icon, Gmail icon)
- User avatar shows initials in a circle at bottom-left of icon rail

