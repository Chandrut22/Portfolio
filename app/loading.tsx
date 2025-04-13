export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="relative h-16 w-16">
        <div className="absolute h-16 w-16 rounded-full border-4 border-primary opacity-20"></div>
        <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-transparent border-t-primary"></div>
      </div>
      <p className="mt-6 text-muted-foreground">Loading portfolio...</p>
    </div>
  )
}
