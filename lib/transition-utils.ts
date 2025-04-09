// Transition types and utilities

export type TransitionType =
  // Square transitions
  | "in:square:center"
  | "in:square:hesitate"
  | "in:square:top-right"
  | "in:square:top-left"
  | "in:square:bottom-right"
  | "in:square:bottom-left"
  | "out:square:center"
  | "out:square:hesitate"
  | "out:square:top-right"
  | "out:square:top-left"
  | "out:square:bottom-right"
  | "out:square:bottom-left"
  // Wipe transitions
  | "in:wipe:right"
  | "in:wipe:left"
  | "in:wipe:up"
  | "in:wipe:down"
  | "in:wipe:top-right"
  | "in:wipe:top-left"
  | "in:wipe:bottom-right"
  | "in:wipe:bottom-left"
  | "in:wipe:cinematic"
  | "out:wipe:right"
  | "out:wipe:left"
  | "out:wipe:up"
  | "out:wipe:down"
  | "out:wipe:top-right"
  | "out:wipe:top-left"
  | "out:wipe:bottom-right"
  | "out:wipe:bottom-left"
  | "out:wipe:cinematic"
  // Polygon transitions
  | "in:diamond:center"
  | "in:diamond:hesitate"
  | "in:polygon:opposing-corners"
  | "out:diamond:center"
  | "out:diamond:hesitate"
  | "out:polygon:opposing-corners"
  // Default transitions
  | "fade"
  | "scale"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"

// Map section IDs to entrance and exit transitions
export const sectionTransitions: Record<string, { enter: TransitionType; exit: TransitionType }> = {
  home: {
    enter: "in:square:center",
    exit: "out:square:center",
  },
  skills: {
    enter: "in:wipe:right",
    exit: "out:wipe:left",
  },
  experience: {
    enter: "in:wipe:up",
    exit: "out:wipe:down",
  },
  projects: {
    enter: "in:diamond:center",
    exit: "out:diamond:center",
  },
  education: {
    enter: "in:square:top-left",
    exit: "out:square:bottom-right",
  },
  certificates: {
    enter: "in:wipe:cinematic",
    exit: "out:wipe:cinematic",
  },
  gallery: {
    enter: "in:polygon:opposing-corners",
    exit: "out:polygon:opposing-corners",
  },
  contact: {
    enter: "in:square:hesitate",
    exit: "out:square:hesitate",
  },
}

// Get transition variants based on transition type
export const getTransitionVariants = (transitionType: TransitionType) => {
  // Default transition values
  const duration = 0.8
  const ease = "easeOut"

  // Square transitions
  if (transitionType === "in:square:center") {
    return {
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1, transition: { duration, ease } },
    }
  } else if (transitionType === "out:square:center") {
    return {
      hidden: { opacity: 1, scale: 1 },
      visible: { opacity: 0, scale: 0, transition: { duration, ease } },
    }
  } else if (transitionType === "in:square:hesitate") {
    return {
      hidden: { opacity: 0, scale: 0 },
      visible: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: duration * 1.5,
          ease,
          scale: { type: "spring", stiffness: 200, damping: 15 },
        },
      },
    }
  } else if (transitionType === "out:square:hesitate") {
    return {
      hidden: { opacity: 1, scale: 1 },
      visible: {
        opacity: 0,
        scale: 0,
        transition: {
          duration: duration * 1.5,
          ease,
          scale: { type: "spring", stiffness: 200, damping: 15 },
        },
      },
    }
  } else if (transitionType === "in:square:top-right") {
    return {
      hidden: { opacity: 0, scale: 0, x: "100%", y: "-100%" },
      visible: { opacity: 1, scale: 1, x: 0, y: 0, transition: { duration, ease } },
    }
  } else if (transitionType === "out:square:top-right") {
    return {
      hidden: { opacity: 1, scale: 1, x: 0, y: 0 },
      visible: { opacity: 0, scale: 0, x: "100%", y: "-100%", transition: { duration, ease } },
    }
  } else if (transitionType === "in:square:top-left") {
    return {
      hidden: { opacity: 0, scale: 0, x: "-100%", y: "-100%" },
      visible: { opacity: 1, scale: 1, x: 0, y: 0, transition: { duration, ease } },
    }
  } else if (transitionType === "out:square:top-left") {
    return {
      hidden: { opacity: 1, scale: 1, x: 0, y: 0 },
      visible: { opacity: 0, scale: 0, x: "-100%", y: "-100%", transition: { duration, ease } },
    }
  } else if (transitionType === "in:square:bottom-right") {
    return {
      hidden: { opacity: 0, scale: 0, x: "100%", y: "100%" },
      visible: { opacity: 1, scale: 1, x: 0, y: 0, transition: { duration, ease } },
    }
  } else if (transitionType === "out:square:bottom-right") {
    return {
      hidden: { opacity: 1, scale: 1, x: 0, y: 0 },
      visible: { opacity: 0, scale: 0, x: "100%", y: "100%", transition: { duration, ease } },
    }
  } else if (transitionType === "in:square:bottom-left") {
    return {
      hidden: { opacity: 0, scale: 0, x: "-100%", y: "100%" },
      visible: { opacity: 1, scale: 1, x: 0, y: 0, transition: { duration, ease } },
    }
  } else if (transitionType === "out:square:bottom-left") {
    return {
      hidden: { opacity: 1, scale: 1, x: 0, y: 0 },
      visible: { opacity: 0, scale: 0, x: "-100%", y: "100%", transition: { duration, ease } },
    }
  }

  // Wipe transitions
  else if (transitionType === "in:wipe:right") {
    return {
      hidden: { opacity: 0, x: "-100%" },
      visible: { opacity: 1, x: 0, transition: { duration, ease } },
    }
  } else if (transitionType === "out:wipe:right") {
    return {
      hidden: { opacity: 1, x: 0 },
      visible: { opacity: 0, x: "100%", transition: { duration, ease } },
    }
  } else if (transitionType === "in:wipe:left") {
    return {
      hidden: { opacity: 0, x: "100%" },
      visible: { opacity: 1, x: 0, transition: { duration, ease } },
    }
  } else if (transitionType === "out:wipe:left") {
    return {
      hidden: { opacity: 1, x: 0 },
      visible: { opacity: 0, x: "-100%", transition: { duration, ease } },
    }
  } else if (transitionType === "in:wipe:up") {
    return {
      hidden: { opacity: 0, y: "100%" },
      visible: { opacity: 1, y: 0, transition: { duration, ease } },
    }
  } else if (transitionType === "out:wipe:up") {
    return {
      hidden: { opacity: 1, y: 0 },
      visible: { opacity: 0, y: "-100%", transition: { duration, ease } },
    }
  } else if (transitionType === "in:wipe:down") {
    return {
      hidden: { opacity: 0, y: "-100%" },
      visible: { opacity: 1, y: 0, transition: { duration, ease } },
    }
  } else if (transitionType === "out:wipe:down") {
    return {
      hidden: { opacity: 1, y: 0 },
      visible: { opacity: 0, y: "100%", transition: { duration, ease } },
    }
  } else if (transitionType === "in:wipe:top-right") {
    return {
      hidden: { opacity: 0, x: "-100%", y: "100%" },
      visible: { opacity: 1, x: 0, y: 0, transition: { duration, ease } },
    }
  } else if (transitionType === "out:wipe:top-right") {
    return {
      hidden: { opacity: 1, x: 0, y: 0 },
      visible: { opacity: 0, x: "100%", y: "-100%", transition: { duration, ease } },
    }
  } else if (transitionType === "in:wipe:top-left") {
    return {
      hidden: { opacity: 0, x: "100%", y: "100%" },
      visible: { opacity: 1, x: 0, y: 0, transition: { duration, ease } },
    }
  } else if (transitionType === "out:wipe:top-left") {
    return {
      hidden: { opacity: 1, x: 0, y: 0 },
      visible: { opacity: 0, x: "-100%", y: "-100%", transition: { duration, ease } },
    }
  } else if (transitionType === "in:wipe:bottom-right") {
    return {
      hidden: { opacity: 0, x: "-100%", y: "-100%" },
      visible: { opacity: 1, x: 0, y: 0, transition: { duration, ease } },
    }
  } else if (transitionType === "out:wipe:bottom-right") {
    return {
      hidden: { opacity: 1, x: 0, y: 0 },
      visible: { opacity: 0, x: "100%", y: "100%", transition: { duration, ease } },
    }
  } else if (transitionType === "in:wipe:bottom-left") {
    return {
      hidden: { opacity: 0, x: "100%", y: "-100%" },
      visible: { opacity: 1, x: 0, y: 0, transition: { duration, ease } },
    }
  } else if (transitionType === "out:wipe:bottom-left") {
    return {
      hidden: { opacity: 1, x: 0, y: 0 },
      visible: { opacity: 0, x: "-100%", y: "100%", transition: { duration, ease } },
    }
  } else if (transitionType === "in:wipe:cinematic") {
    return {
      hidden: { opacity: 0, scale: 1.2, y: 20 },
      visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
          duration: duration * 1.5,
          ease: [0.22, 1, 0.36, 1],
        },
      },
    }
  } else if (transitionType === "out:wipe:cinematic") {
    return {
      hidden: { opacity: 1, scale: 1, y: 0 },
      visible: {
        opacity: 0,
        scale: 0.8,
        y: -20,
        transition: {
          duration: duration * 1.5,
          ease: [0.22, 1, 0.36, 1],
        },
      },
    }
  }

  // Polygon transitions
  else if (transitionType === "in:diamond:center") {
    return {
      hidden: { opacity: 0, scale: 0, rotate: 45 },
      visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration, ease } },
    }
  } else if (transitionType === "out:diamond:center") {
    return {
      hidden: { opacity: 1, scale: 1, rotate: 0 },
      visible: { opacity: 0, scale: 0, rotate: 45, transition: { duration, ease } },
    }
  } else if (transitionType === "in:diamond:hesitate") {
    return {
      hidden: { opacity: 0, scale: 0, rotate: 45 },
      visible: {
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: {
          duration: duration * 1.5,
          ease,
          scale: { type: "spring", stiffness: 200, damping: 15 },
          rotate: { type: "spring", stiffness: 200, damping: 20 },
        },
      },
    }
  } else if (transitionType === "out:diamond:hesitate") {
    return {
      hidden: { opacity: 1, scale: 1, rotate: 0 },
      visible: {
        opacity: 0,
        scale: 0,
        rotate: 45,
        transition: {
          duration: duration * 1.5,
          ease,
          scale: { type: "spring", stiffness: 200, damping: 15 },
          rotate: { type: "spring", stiffness: 200, damping: 20 },
        },
      },
    }
  } else if (transitionType === "in:polygon:opposing-corners") {
    return {
      hidden: {
        opacity: 0,
        clipPath: "polygon(0% 0%, 100% 100%, 100% 100%, 0% 0%)",
      },
      visible: {
        opacity: 1,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        transition: { duration: duration * 1.2, ease },
      },
    }
  } else if (transitionType === "out:polygon:opposing-corners") {
    return {
      hidden: {
        opacity: 1,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      },
      visible: {
        opacity: 0,
        clipPath: "polygon(100% 0%, 100% 0%, 100% 100%, 0% 100%)",
        transition: { duration: duration * 1.2, ease },
      },
    }
  }

  // Default transitions
  else if (transitionType === "fade") {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration, ease } },
    }
  } else if (transitionType === "scale") {
    return {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1, transition: { duration, ease } },
    }
  } else if (transitionType === "slide-up") {
    return {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration, ease } },
    }
  } else if (transitionType === "slide-down") {
    return {
      hidden: { opacity: 0, y: -50 },
      visible: { opacity: 1, y: 0, transition: { duration, ease } },
    }
  } else if (transitionType === "slide-left") {
    return {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0, transition: { duration, ease } },
    }
  } else if (transitionType === "slide-right") {
    return {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0, transition: { duration, ease } },
    }
  }

  // Default fallback
  return {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration, ease } },
  }
}
