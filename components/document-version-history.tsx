"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, User, RotateCcw } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

type DocumentVersion = {
  id: string
  version: number
  content: any
  createdAt: Date
  createdBy: {
    id: string
    name: string
    email: string
  }
}

type DocumentVersionHistoryProps = {
  versions: DocumentVersion[]
  currentVersion: number
  onRestore?: (versionId: string) => void
}

export function DocumentVersionHistory({
  versions,
  currentVersion,
  onRestore,
}: DocumentVersionHistoryProps) {
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Version History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {versions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No version history available
            </p>
          ) : (
            versions.map((version) => (
              <div
                key={version.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedVersion === version.id
                    ? "bg-accent border-primary"
                    : "hover:bg-muted/50"
                } ${
                  version.version === currentVersion
                    ? "border-primary/50 bg-primary/5"
                    : ""
                }`}
                onClick={() => setSelectedVersion(version.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={version.version === currentVersion ? "default" : "outline"}>
                        v{version.version}
                        {version.version === currentVersion && " (Current)"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(version.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{version.createdBy.name}</span>
                    </div>
                  </div>
                  {version.version !== currentVersion && onRestore && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRestore(version.id)
                      }}
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      Restore
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}

