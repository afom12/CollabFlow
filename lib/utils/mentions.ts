/**
 * Utility functions for @mention detection and processing
 */

export interface MentionMatch {
  userId: string
  userName: string
  startIndex: number
  endIndex: number
}

/**
 * Extract @mentions from text
 * Format: @username or @userId
 */
export function extractMentions(text: string): MentionMatch[] {
  const mentionRegex = /@(\w+)/g
  const mentions: MentionMatch[] = []
  let match

  while ((match = mentionRegex.exec(text)) !== null) {
    mentions.push({
      userId: match[1], // This will be resolved to actual userId
      userName: match[1],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    })
  }

  return mentions
}

/**
 * Replace @mentions in text with formatted HTML/React components
 */
export function formatMentions(text: string, users: Array<{ id: string; name: string; email: string }>): string {
  let formattedText = text
  const mentions = extractMentions(text)

  // Sort by start index in reverse to avoid index shifting
  mentions.sort((a, b) => b.startIndex - a.startIndex)

  for (const mention of mentions) {
    const user = users.find(
      (u) =>
        u.name?.toLowerCase() === mention.userName.toLowerCase() ||
        u.email?.toLowerCase() === mention.userName.toLowerCase() ||
        u.id === mention.userId
    )

    if (user) {
      const mentionText = `@${mention.userName}`
      const replacement = `<span class="mention" data-user-id="${user.id}">@${user.name || user.email}</span>`
      formattedText =
        formattedText.slice(0, mention.startIndex) +
        replacement +
        formattedText.slice(mention.endIndex)
    }
  }

  return formattedText
}

/**
 * Get user IDs from mentions in text
 */
export function getMentionedUserIds(
  text: string,
  users: Array<{ id: string; name: string; email: string }>
): string[] {
  const mentions = extractMentions(text)
  const userIds: string[] = []

  for (const mention of mentions) {
    const user = users.find(
      (u) =>
        u.name?.toLowerCase() === mention.userName.toLowerCase() ||
        u.email?.toLowerCase() === mention.userName.toLowerCase() ||
        u.id === mention.userId
    )

    if (user && !userIds.includes(user.id)) {
      userIds.push(user.id)
    }
  }

  return userIds
}

