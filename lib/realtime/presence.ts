import { LiveObject } from "@liveblocks/client"

export type Presence = {
  cursor: { x: number; y: number } | null
  currentPage: string | null
  editingDocument: string | null
}

export type Storage = {
  documents: LiveObject<Record<string, any>>
}

export const initialPresence: Presence = {
  cursor: null,
  currentPage: null,
  editingDocument: null,
}

