import TransitionDemo from "@/components/transition-demo"

export default function TransitionsPage() {
  return (
    <div className="container mx-auto py-16">
      <h1 className="text-4xl font-bold mb-8 text-center">Page Transition Showcase</h1>
      <p className="text-center mb-12 text-muted-foreground max-w-2xl mx-auto">
        This page demonstrates all the available transition effects that can be applied to sections in your portfolio.
        Click on any transition to see it in action.
      </p>

      <TransitionDemo />
    </div>
  )
}
