import { type Variants } from "framer-motion";

/**
 * Zora Animation Library
 * Consistent, performant animations across the platform
 */

// Timing presets (in seconds)
export const duration = {
    instant: 0.1,
    fast: 0.15,
    normal: 0.2,
    slow: 0.3,
    slower: 0.5,
} as const;

// Easing presets
export const easing = {
    easeOut: [0.0, 0.0, 0.2, 1],
    easeIn: [0.4, 0.0, 1, 1],
    easeInOut: [0.4, 0.0, 0.2, 1],
    spring: { type: "spring", stiffness: 400, damping: 30 },
    bounce: { type: "spring", stiffness: 500, damping: 25 },
} as const;

// Fade animations
export const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: duration.normal } },
    exit: { opacity: 0, transition: { duration: duration.fast } },
};

export const fadeInUp: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: duration.normal, ease: easing.easeOut }
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: { duration: duration.fast }
    },
};

export const fadeInDown: Variants = {
    initial: { opacity: 0, y: -10 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: duration.normal, ease: easing.easeOut }
    },
    exit: {
        opacity: 0,
        y: 10,
        transition: { duration: duration.fast }
    },
};

export const fadeInScale: Variants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
        opacity: 1,
        scale: 1,
        transition: { duration: duration.normal, ease: easing.easeOut }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: duration.fast }
    },
};

// Slide animations
export const slideInLeft: Variants = {
    initial: { x: -20, opacity: 0 },
    animate: {
        x: 0,
        opacity: 1,
        transition: { duration: duration.normal, ease: easing.easeOut }
    },
    exit: {
        x: -20,
        opacity: 0,
        transition: { duration: duration.fast }
    },
};

export const slideInRight: Variants = {
    initial: { x: 20, opacity: 0 },
    animate: {
        x: 0,
        opacity: 1,
        transition: { duration: duration.normal, ease: easing.easeOut }
    },
    exit: {
        x: 20,
        opacity: 0,
        transition: { duration: duration.fast }
    },
};

// Stagger children animations
export const staggerContainer: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
};

export const staggerItem: Variants = {
    initial: { opacity: 0, y: 10 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: duration.normal, ease: easing.easeOut }
    },
};

// Scale animations (for buttons, cards)
export const scaleOnHover = {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: duration.fast },
};

export const scaleOnTap = {
    whileTap: { scale: 0.95 },
    transition: { duration: duration.instant },
};

// Page transitions
export const pageTransition: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: duration.slow, ease: easing.easeOut }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: duration.normal }
    },
};

// Modal/Dialog animations
export const modalOverlay: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: duration.normal } },
    exit: { opacity: 0, transition: { duration: duration.fast } },
};

export const modalContent: Variants = {
    initial: { opacity: 0, scale: 0.95, y: 10 },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { duration: duration.normal, ease: easing.easeOut }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: 10,
        transition: { duration: duration.fast }
    },
};

// Skeleton loading animation
export const skeletonPulse = {
    animate: {
        opacity: [0.5, 1, 0.5],
        transition: {
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

// Number counter animation helper
export const springNumber = {
    type: "spring",
    stiffness: 100,
    damping: 15,
};
