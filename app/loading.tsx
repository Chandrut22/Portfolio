export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="mb-8">
        <div className="h-20 w-20 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>

      <div className="relative h-1 w-60 overflow-hidden rounded-full bg-secondary">
        <div className="absolute inset-0 h-full w-full bg-primary animate-loading"></div>
      </div>

      <p className="mt-6 text-muted-foreground">Loading portfolio...</p>
    </div>
  )
}
// import { BoltLoader } from "react-awesome-loaders";

// export default function Loading() {
//   return (
//     <>
//       <BoltLoader
//         className={"loaderbolt"}
//         boltColor={"#3b82f6"}
//         backgroundBlurColor={"#E0E7FF"}
//       />
//     </>
//   )
// }

