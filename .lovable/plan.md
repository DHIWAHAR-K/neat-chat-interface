

## Claude-Style Chatbot UI

### Overview
A pixel-perfect recreation of Claude's chatbot interface with conversation sidebar, file upload support, markdown rendering, and light/dark theme toggle.

### Pages & Layout

**Main Layout**
- Collapsible sidebar on the left for conversation history
- Main chat area taking remaining width
- Clean, minimal aesthetic matching Claude's design language

### Sidebar
- "New chat" button at the top
- List of past conversations grouped by date (Today, Yesterday, Previous 7 days)
- Each conversation shows truncated first message as title
- Hover actions: rename, delete
- Collapse/expand toggle
- Theme toggle (sun/moon icon) at the bottom

### Chat Area
- Centered content column (max-width ~768px) like Claude
- Welcome screen when no messages: greeting text + suggestion chips (e.g. "Explain quantum computing", "Write a poem", "Help me debug")
- Messages display:
  - User messages: right-aligned or subtle background distinction
  - AI messages: left-aligned with markdown rendering (headings, code blocks with syntax highlighting, lists, tables)
  - Typing indicator animation for AI responses
- Sticky input bar at the bottom:
  - Multi-line textarea that auto-grows
  - File/image attach button (paperclip icon) with drag-and-drop zone
  - Send button (arrow icon) that activates when there's input
  - Attached files shown as removable chips above the input

### Theme System
- Light mode: warm white/beige tones matching Claude's palette
- Dark mode: deep neutral grays
- Toggle in sidebar footer with smooth transition

### State Management
- All conversations stored in local state (no backend yet)
- Mock AI responses with a typing delay to simulate real behavior
- File attachments stored as local object URLs

### Dependencies
- `react-markdown` + `remark-gfm` for markdown rendering
- `react-syntax-highlighter` for code blocks
- Lucide icons for UI elements

