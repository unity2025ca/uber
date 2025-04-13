import { Loader2 } from "lucide-react"

export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
    </div>
  )
}
