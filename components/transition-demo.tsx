"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { getTransitionVariants, type TransitionType } from "@/lib/transition-utils"

export default function TransitionDemo() {
  const [currentTransition, setCurrentTransition] = useState<TransitionType>("in:square:center")
  const [isVisible, setIsVisible] = useState(true)

  const transitionGroups = {
    "Square Entrances": [
      "in:square:center",
      "in:square:hesitate",
      "in:square:top-right",
      "in:square:top-left",
      "in:square:bottom-right",
      "in:square:bottom-left",
    ],
    "Square Exits": [
      "out:square:center",
      "out:square:hesitate",
      "out:square:top-right",
      "out:square:top-left",
      "out:square:bottom-right",
      "out:square:bottom-left",
    ],
    "Wipe Entrances": [
      "in:wipe:right",
      "in:wipe:left",
      "in:wipe:up",
      "in:wipe:down",
      "in:wipe:top-right",
      "in:wipe:top-left",
      "in:wipe:bottom-right",
      "in:wipe:bottom-left",
      "in:wipe:cinematic",
    ],
    "Wipe Exits": [
      "out:wipe:right",
      "out:wipe:left",
      "out:wipe:up",
      "out:wipe:down",
      "out:wipe:top-right",
      "out:wipe:top-left",
      "out:wipe:bottom-right",
      "out:wipe:bottom-left",
      "out:wipe:cinematic",
    ],
    "Polygon Entrances": ["in:diamond:center", "in:diamond:hesitate", "in:polygon:opposing-corners"],
    "Polygon Exits": ["out:diamond:center", "out:diamond:hesitate", "out:polygon:opposing-corners"],
  }

  const handleTransitionClick = (transition: TransitionType) => {
    setIsVisible(false)
    setCurrentTransition(transition)

    // Re-show the element after a short delay to trigger the animation
    setTimeout(() => {
      setIsVisible(true)
    }, 500)
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-3xl font-bold mb-6">Transition Demo</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Select a Transition</h3>

          <div className="space-y-6">
            {Object.entries(transitionGroups).map(([groupName, transitions]) => (
              <div key={groupName}>
                <h4 className="text-lg font-medium mb-2">{groupName}</h4>
                <div className="flex flex-wrap gap-2">
                  {transitions.map((transition) => (
                    <Button
                      key={transition}
                      variant={currentTransition === transition ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleTransitionClick(transition as TransitionType)}
                    >
                      {transition}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center min-h-[400px] bg-muted/30 rounded-lg relative overflow-hidden">
          <AnimatePresence mode="wait">
            {isVisible && (
              <motion.div
                key={currentTransition}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={getTransitionVariants(currentTransition)}
                className="w-full h-full absolute inset-0 flex items-center justify-center"
              >
                <Card className="w-64 h-64">
                  <CardHeader>
                    <CardTitle>Transition Demo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Current transition:</p>
                    <p className="font-mono text-sm mt-2">{currentTransition}</p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-center">
        <Button onClick={() => handleTransitionClick(currentTransition)}>Replay Transition</Button>
      </div>
    </div>
  )
}
