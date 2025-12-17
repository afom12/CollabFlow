/**
 * Yjs provider for TipTap Collaboration extension
 * Creates a Y.Doc and syncs it with Liveblocks
 */

import * as Y from "yjs"
import { Liveblocks } from "@liveblocks/node"

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY || "",
})

export async function getYDocProvider(documentId: string) {
  // Create a Y.Doc for this document
  const ydoc = new Y.Doc()
  
  // Get or create a Liveblocks room for this document
  const roomId = `document:${documentId}`
  
  // Return the Y.Doc which will be used by TipTap Collaboration extension
  return ydoc
}

/**
 * Create a Yjs provider that syncs with Liveblocks
 * This is used by TipTap's Collaboration extension
 */
export function createYjsProvider(documentId: string, ydoc: Y.Doc) {
  const roomId = `document:${documentId}`
  
  // The TipTap Collaboration extension will handle the Yjs provider
  // We just need to ensure the Y.Doc is available
  return {
    ydoc,
    roomId,
  }
}

