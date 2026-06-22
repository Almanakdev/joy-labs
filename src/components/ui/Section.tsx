"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Section({
  id,
  eyebrow,
  title,
  subtitle,
  children,
  className,
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8", className)}>
      {(eyebrow || title || subtitle) && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 max-w-2xl"
        >
          {eyebrow && (
            <span className="chip bg-purple-100 text-purple-700">{eyebrow}</span>
          )}
          {title && (
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {title}
            </h2>
          )}
          {subtitle && <p className="mt-3 text-lg text-muted">{subtitle}</p>}
        </motion.div>
      )}
      {children}
    </section>
  );
}
