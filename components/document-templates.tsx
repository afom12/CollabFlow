"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Book, List, Calendar, Lightbulb } from "lucide-react"

type Template = {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  content: any
}

const templates: Template[] = [
  {
    id: "blank",
    name: "Blank Document",
    description: "Start with a clean slate",
    icon: <FileText className="h-5 w-5" />,
    content: { type: "doc", content: [{ type: "paragraph" }] },
  },
  {
    id: "meeting-notes",
    name: "Meeting Notes",
    description: "Template for taking meeting notes",
    icon: <Calendar className="h-5 w-5" />,
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "Meeting Notes" }],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Date:" }],
        },
        {
          type: "paragraph",
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Attendees:" }],
        },
        {
          type: "bulletList",
          content: [
            { type: "listItem", content: [{ type: "paragraph" }] },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Agenda:" }],
        },
        {
          type: "bulletList",
          content: [
            { type: "listItem", content: [{ type: "paragraph" }] },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Action Items:" }],
        },
        {
          type: "bulletList",
          content: [
            { type: "listItem", content: [{ type: "paragraph" }] },
          ],
        },
      ],
    },
  },
  {
    id: "project-plan",
    name: "Project Plan",
    description: "Template for project planning",
    icon: <List className="h-5 w-5" />,
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "Project Plan" }],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Overview" }],
        },
        {
          type: "paragraph",
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Goals" }],
        },
        {
          type: "bulletList",
          content: [
            { type: "listItem", content: [{ type: "paragraph" }] },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Timeline" }],
        },
        {
          type: "paragraph",
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Resources" }],
        },
        {
          type: "bulletList",
          content: [
            { type: "listItem", content: [{ type: "paragraph" }] },
          ],
        },
      ],
    },
  },
  {
    id: "blog-post",
    name: "Blog Post",
    description: "Template for writing blog posts",
    icon: <Book className="h-5 w-5" />,
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "Blog Post Title" }],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Write an engaging introduction here...",
            },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Main Content" }],
        },
        {
          type: "paragraph",
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Conclusion" }],
        },
        {
          type: "paragraph",
        },
      ],
    },
  },
  {
    id: "brainstorm",
    name: "Brainstorming",
    description: "Template for brainstorming sessions",
    icon: <Lightbulb className="h-5 w-5" />,
    content: {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "Brainstorming Session" }],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Topic:" }],
        },
        {
          type: "paragraph",
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Ideas:" }],
        },
        {
          type: "bulletList",
          content: [
            { type: "listItem", content: [{ type: "paragraph" }] },
            { type: "listItem", content: [{ type: "paragraph" }] },
            { type: "listItem", content: [{ type: "paragraph" }] },
          ],
        },
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "Top Ideas:" }],
        },
        {
          type: "bulletList",
          content: [
            { type: "listItem", content: [{ type: "paragraph" }] },
          ],
        },
      ],
    },
  },
]

type DocumentTemplatesProps = {
  onSelectTemplate: (template: Template) => void
}

export function DocumentTemplates({ onSelectTemplate }: DocumentTemplatesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Card
          key={template.id}
          className="cursor-pointer hover:border-primary transition-colors"
          onClick={() => onSelectTemplate(template)}
        >
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                {template.icon}
              </div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {template.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

