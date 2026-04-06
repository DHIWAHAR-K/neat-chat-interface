const BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, "") || "/api";

export interface TranscriptResult {
  transcript: string;
  confidence?: number;
  status: string;
  disclaimer: string;
}

export async function transcribeFile(file: File): Promise<TranscriptResult> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE}/transcribe/upload`, { method: "POST", body: form });
  if (!res.ok) {
    const detail = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(detail.detail ?? res.statusText);
  }
  return res.json();
}

export async function ragQuery(
  query: string,
  topK = 5
): Promise<{ chunks: { text: string; source: string }[] }> {
  const res = await fetch(`${BASE}/rag/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, top_k: topK }),
  });
  if (!res.ok) throw new Error((await res.json()).detail ?? res.statusText);
  return res.json();
}

export interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  citations?: string[];
}

export async function generateSOAP(
  transcript: string,
  ragContext?: string
): Promise<SOAPNote> {
  const res = await fetch(`${BASE}/soap/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ transcript, rag_context: ragContext }),
  });
  if (!res.ok) throw new Error((await res.json()).detail ?? res.statusText);
  return res.json();
}

export async function textToSpeech(text: string): Promise<Blob> {
  const res = await fetch(`${BASE}/soap/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error((await res.json()).detail ?? res.statusText);
  return res.blob();
}

export async function classifyImage(file: File) {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${BASE}/imaging/classify`, { method: "POST", body: form });
  if (!res.ok) throw new Error((await res.json()).detail ?? res.statusText);
  return res.json();
}

/** Chat history (MongoDB via backend). */

export interface ApiChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ApiConversation {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: ApiChatMessage[];
}

export interface ApiConversationSummary {
  id: string;
  title: string;
  updatedAt: number;
}

export async function listChatConversations(): Promise<ApiConversationSummary[]> {
  const res = await fetch(`${BASE}/chat/conversations`);
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail ?? res.statusText);
  return res.json();
}

export async function createChatConversation(body: { title?: string } = {}): Promise<ApiConversation> {
  const res = await fetch(`${BASE}/chat/conversations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail ?? res.statusText);
  return res.json();
}

export async function getChatConversation(id: string): Promise<ApiConversation> {
  const res = await fetch(`${BASE}/chat/conversations/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail ?? res.statusText);
  return res.json();
}

export async function appendChatMessage(
  conversationId: string,
  body: { role: "user" | "assistant"; content: string; id?: string; timestamp?: number }
): Promise<ApiConversation> {
  const res = await fetch(
    `${BASE}/chat/conversations/${encodeURIComponent(conversationId)}/messages`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail ?? res.statusText);
  return res.json();
}

export async function deleteChatConversation(id: string): Promise<void> {
  const res = await fetch(`${BASE}/chat/conversations/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail ?? res.statusText);
}
