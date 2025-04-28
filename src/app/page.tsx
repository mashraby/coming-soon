"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { motion } from "framer-motion";

const socials = [
  { title: "Telegram", url: "https://t.me/mashraby" },
  { title: "Twitter", url: "https://x.com/mashrabdev" },
  { title: "Linkedin", url: "https://www.linkedin.com/in/mashraby" },
];

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen flex-col container mx-auto max-w-2xl">
      <motion.h1
        className="text-6xl font-extralight mb-2"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Minimal UI
      </motion.h1>

      <motion.p
        className="text-muted-foreground text-xl text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        We’re building something simple and powerful for you. An effortless,
        inspiring experience is coming soon. Stay tuned!
      </motion.p>

      <motion.div
        className="flex items-center gap-4 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {socials.map((s, index) => (
          <Link
            key={index}
            className="text-base flex items-center gap-2 group"
            href={s.url}
            target="_blank"
          >
            {s.title}{" "}
            <ArrowUpRight className="size-3.5 group-hover:rotate-12 transition-all" />
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
