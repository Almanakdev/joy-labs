"use client";

import { UPCOMING_LAUNCHES } from "@/lib/mock-data";
import { Section } from "@/components/ui/Section";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { motion } from "framer-motion";

export function UpcomingLaunches() {
  return (
    <Section
      eyebrow="Upcoming Launches"
      title="Projects eligible to launch"
      subtitle="These builders crossed the Work Score threshold. Vote, follow, and back the work."
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {UPCOMING_LAUNCHES.map((p, i) => (
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <ProjectCard project={p} />
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
