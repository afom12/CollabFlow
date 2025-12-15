export default function TeamLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { team: string }
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-4">
        <h1 className="text-2xl font-bold capitalize">{params.team}</h1>
      </div>
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}

