
import { motion } from "framer-motion"

export function AnimateOnScroll({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        delay,
      }}
      viewport={{ once: true, margin: "-100px" }}
    >
      {children}
    </motion.div>
  )
}
