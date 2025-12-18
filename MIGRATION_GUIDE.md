# Database Migration Guide

This guide explains how to apply the database schema changes for the new collaboration features.

## New Models Added

The following models have been added to `prisma/schema.prisma`:

1. **Reaction** - For emoji reactions on comments and documents
2. **Attachment** - For file attachments on comments, documents, and issues
3. **Message** - For team chat messages
4. **ReactionMessage** - For reactions on chat messages
5. **AttachmentMessage** - For file attachments on chat messages

## Updated Models

- **Comment** - Added `mentions` field (String array)
- **User** - Added relations for reactions, messages, and attachments
- **Document** - Added relations for reactions and attachments
- **Issue** - Added relation for attachments
- **Team** - Added relation for messages

## Migration Steps

### 1. Generate Migration

```bash
npx prisma migrate dev --name add_collaboration_features
```

This will:
- Create a new migration file
- Apply the migration to your database
- Regenerate the Prisma Client

### 2. If Migration Fails

If you encounter issues, you can:

**Option A: Reset Database (Development Only)**
```bash
npx prisma migrate reset
```

**Option B: Create Migration Manually**
```bash
npx prisma migrate dev --create-only --name add_collaboration_features
# Edit the migration file if needed
npx prisma migrate dev
```

### 3. Generate Prisma Client

After migration:
```bash
npx prisma generate
```

### 4. Verify Migration

Check your database to ensure all tables are created:
```bash
npx prisma studio
```

## Schema Changes Summary

### New Tables
- `reactions` - Stores emoji reactions
- `attachments` - Stores file attachments
- `messages` - Stores team chat messages
- `reaction_messages` - Stores reactions on messages
- `attachment_messages` - Stores attachments on messages

### Updated Tables
- `comments` - Added `mentions` column (String array)

## Environment Variables

Make sure these are set in your `.env`:

```env
DATABASE_URL="your-postgresql-connection-string"
RESEND_API_KEY="your-resend-api-key" # Optional, for email notifications
```

## Testing

After migration, test the features:

1. **Reactions**: Try reacting to a comment
2. **Mentions**: Try mentioning a user with @username
3. **Attachments**: Try uploading a file
4. **Team Chat**: Navigate to `/[team]/chat` and send a message

## Rollback (if needed)

If you need to rollback:

```bash
npx prisma migrate resolve --rolled-back add_collaboration_features
npx prisma migrate dev
```

Or manually drop the tables in your database.

