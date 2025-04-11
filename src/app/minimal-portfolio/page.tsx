"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronRight,
  Code,
  Menu,
  Moon,
  Sun,
} from "lucide-react";
import { Inter } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import React, { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import Header from "./minimal-portfolio-header";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const containerClass = "container mx-auto px-4 max-w-2xl";

export default function MinimalPortfolio() {
  return (
    <main className={cn(inter.className, "bg-white dark:bg-zinc-900")}>
      <Header />
      <Hero />
      <Experience />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}

function ToggleTheme() {
  const { theme, setTheme } = useTheme();
  const toggleTheme = () =>
    theme !== "dark" ? setTheme("dark") : setTheme("light");

  return (
    <button type="button" onClick={toggleTheme}>
      {theme === "dark" ? (
        <Moon className="size-4" />
      ) : (
        <Sun className="size-4" />
      )}
    </button>
  );
}

// function Header() {
//   const navLinks = [
//     {
//       title: "Home",
//       slug: "#home",
//     },
//     {
//       title: "Experience",
//       slug: "#experience",
//     },
//     {
//       title: "Skills",
//       slug: "#skills",
//     },
//     {
//       title: "Projects",
//       slug: "#projects",
//     },
//     {
//       title: "Contact",
//       slug: "#contact",
//     },
//   ];

//   return (
//     <header className="sticky top-0 py-4">
//       <div
//         className={cn(
//           containerClass,
//           "flex w-full items-center justify-end md:justify-center"
//         )}
//       >
//         <nav className="flex flex-row-reverse items-center justify-start gap-8 rounded-full border-2 bg-white/30 p-4 backdrop-blur-xl dark:bg-zinc-900/30 md:flex-row lg:w-max lg:px-8">
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <button type="button" className="flex md:hidden">
//                 <Menu className="size-4" />
//               </button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent
//               side="bottom"
//               align="end"
//               className="bg-white dark:bg-zinc-900"
//             >
//               {navLinks.map((navLink) => (
//                 <DropdownMenuItem key={navLink.slug} asChild>
//                   <Link href={navLink.slug}>{navLink.title}</Link>
//                 </DropdownMenuItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>

//           <ul className="hidden items-center gap-8 md:flex">
//             {navLinks.map((navLink) => (
//               <li key={navLink.slug}>
//                 <Link className="text-xs hover:underline" href={navLink.slug}>
//                   {navLink.title}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//           <ToggleTheme />
//         </nav>
//       </div>
//     </header>
//   );
// }

function Hero() {
  return (
    <section id="#home" className="mt-8">
      <div className={containerClass}>
        <div className="flex flex-col items-center gap-8 md:flex-row">
          <div className="rounded-full border-2 p-1">
            <Image
              className="rounded-full"
              src="/portfolio-me.jpg"
              alt="portfolio me"
              width={200}
              height={200}
            />
          </div>
          <div className="flex flex-col gap-4">
            <h1 className="text-center text-2xl font-extrabold md:text-start md:text-3xl lg:text-4xl">
              Hi, I&apos;m Jhon Doe 👋
            </h1>
            <p className="text-center text-sm text-gray-400 md:text-start">
              Frontend Developer focused on React and TypeScript, creating
              responsive, user-friendly web apps.
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-2">
          <h2 className="text-base font-semibold">About me</h2>
          <p className="text-sm text-gray-400">
            I have been working as a front-end developer since 2022,
            specializing in React and Next.js with a strong focus on building
            scalable, performant web applications. My expertise in TypeScript
            allows me to write clean, maintainable code with enhanced type
            safety, contributing to efficient project development. I am
            passionate about delivering high-quality user interfaces and
            optimizing web performance while staying up to date with the latest
            technologies in the field.
          </p>
        </div>
      </div>
    </section>
  );
}

function Experience() {
  const [expandedCards, setExpandedCards] = useState<number[]>([1]);

  const toggleCard = (id: number) => {
    setExpandedCards((prev) =>
      prev.includes(id) ? prev.filter((cardId) => cardId !== id) : [...prev, id]
    );
  };

  const isExpanded = (id: number) => expandedCards.includes(id);

  const experiences = [
    {
      id: 1,
      role: "Senior Frontend Developer",
      company: "TechCorp",
      period: "2021 - Present",
      description:
        "Led the development of the company's design system and component library. Improved performance by 40% through code optimization.",
      image: "/portfolio-exp-1.svg",
    },
    {
      id: 2,
      role: "UI/UX Developer",
      company: "DesignStudio",
      period: "2018 - 2021",
      description:
        "Designed and implemented responsive interfaces for various clients. Collaborated with design and product teams to create intuitive user experiences.",
      image: "/portfolio-exp-2.svg",
    },
    {
      id: 3,
      role: "Web Developer",
      company: "StartupInc",
      period: "2016 - 2018",
      description:
        "Built and maintained the company's main product. Implemented new features and fixed bugs on a regular basis.",
      image: "/portfolio-exp-3.svg",
    },
  ];

  return (
    <section id="experience" className="mt-8">
      <div className={containerClass}>
        <h2 className="text-base font-semibold">Experience</h2>
        <div className="mt-2 flex flex-col gap-4">
          {experiences.map((experience) => (
            <motion.div
              key={experience.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className={cn(
                  "dark:bg-zinc-900 border hover:bg-gray-50 transition-colors cursor-pointer rounded-xl dark:hover:border-zinc-700 dark:hover:bg-zinc-800",
                  {
                    "dark:border-zinc-700 dark:bg-zinc-800 bg-gray-50":
                      isExpanded(experience.id),
                  }
                )}
                onClick={() => toggleCard(experience.id)}
              >
                <CardHeader className="p-4">
                  <div className="flex w-full items-start justify-between">
                    <div className="flex gap-2">
                      <Image
                        className="size-12 rounded-lg object-contain"
                        width={50}
                        height={50}
                        src={experience.image || "/placeholder.svg"}
                        alt={`${experience.role} at ${experience.company}`}
                      />
                      <div>
                        <CardTitle className="text-sm">
                          {experience.company}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {experience.role}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {experience.period}
                      </span>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{
                          rotate: isExpanded(experience.id) ? 90 : 0,
                          opacity: isExpanded(experience.id) ? 1 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center justify-center"
                      >
                        <ChevronRight className="size-4 text-gray-400" />
                      </motion.div>
                    </div>
                  </div>
                </CardHeader>

                <AnimatePresence>
                  {isExpanded(experience.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      style={{ overflow: "hidden" }}
                    >
                      <CardContent className="px-4 pb-2 pt-0">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3, delay: 0.1 }}
                          className="text-xs"
                        >
                          {experience.description}
                        </motion.p>
                      </CardContent>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills() {
  const skills = [
    "TypeScript",
    "React",
    "Next.js",
    "Tailwind CSS",
    "Shadcn",
    "Redux Toolkit",
    "React Query",
    "Node.js",
    "Mongodb",
    "Postgresql",
  ];

  return (
    <section id="skills" className="mt-8">
      <div className={containerClass}>
        <h2 className="text-base font-semibold">Skills</h2>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const projects = [
    {
      id: 1,
      title: "Portfolio Website",
      description:
        "A fully responsive personal portfolio website built with Next.js, TypeScript, and Tailwind CSS. Features include dark mode, animations with Framer Motion, and a contact form with email integration.",
      image: "/placeholder.svg",
      technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      demoLink: "https://example.com",
      githubLink: "https://github.com/example/portfolio",
    },
    {
      id: 2,
      title: "E-commerce Platform",
      description:
        "A complete e-commerce solution with product catalog, shopping cart, user authentication, and Stripe payment integration. Built with Next.js for the frontend and Node.js/Express for the backend API.",
      image: "/placeholder.svg",
      technologies: ["React", "Node.js", "MongoDB", "Stripe"],
      category: "web",
      demoLink: "https://example.com/ecommerce",
      githubLink: "https://github.com/example/ecommerce",
    },
    {
      id: 3,
      title: "Task Management App",
      description:
        "A cross-platform mobile application for task and project management. Features include task creation, due dates, priority levels, project grouping, and push notifications for reminders.",
      image: "/placeholder.svg",
      technologies: ["React Native", "Firebase", "Redux"],
      category: "mobile",
      demoLink: "https://example.com/taskapp",
      githubLink: "https://github.com/example/taskapp",
    },
    {
      id: 4,
      title: "Dashboard UI Kit",
      description:
        "A comprehensive UI kit for building admin dashboards and data visualization interfaces. Includes over 50 components, 10 page templates, and various chart types all built with accessibility in mind.",
      image: "/placeholder.svg",
      technologies: ["Figma", "UI/UX", "Design System"],
      demoLink: "https://example.com/dashboard-ui",
    },
    {
      id: 5,
      title: "Weather Application",
      description:
        "A weather application that provides real-time forecasts, interactive maps, and historical weather data. Uses multiple weather APIs to ensure accuracy and reliability of data.",
      image: "/placeholder.svg",
      technologies: ["React", "OpenWeatherMap API", "Mapbox"],
      demoLink: "https://example.com/weather",
      githubLink: "https://github.com/example/weather",
    },
    {
      id: 6,
      title: "Fitness Tracker",
      description:
        "A fitness tracking mobile application that allows users to log workouts, track nutrition, set goals, and view progress over time. Includes social features for sharing achievements.",
      image: "/placeholder.svg",
      technologies: ["Flutter", "Firebase", "HealthKit"],
      demoLink: "https://example.com/fitness",
      githubLink: "https://github.com/example/fitness",
    },
  ];

  return (
    <section id="projects" className="mt-8">
      <div className={containerClass}>
        <h2 className="text-base font-semibold">Projects</h2>
        <p className="mt-2 text-base text-gray-400">
          Here are my latest favourite projects
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="bg-gray-50 transition-colors hover:border-gray-400/50 dark:bg-zinc-800 dark:hover:border-zinc-700"
            >
              <Link href={project.demoLink} target="_blank">
                <Image
                  className="w-max rounded-t-lg object-cover"
                  src={project.image}
                  alt={project.title}
                  width={200}
                  height={50}
                />
              </Link>
              <CardContent className="px-4 py-2">
                <h3 className="text-sm font-semibold">{project.title}</h3>
                <p className="mt-2 text-xs text-gray-400">
                  {project.description}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <Button
                    variant="link"
                    asChild
                    className="group p-0 text-xs leading-none"
                    size="sm"
                  >
                    <Link href={project.demoLink} target="_blank">
                      Live
                      <ArrowUpRight className="transition-all group-hover:rotate-45" />
                    </Link>
                  </Button>
                  {project.githubLink && (
                    <Button
                      variant="link"
                      className="p-0 text-xs"
                      size="sm"
                      asChild
                    >
                      <Link href={project.githubLink} target="_blank">
                        Source
                        <Code />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="mt-8">
      <div className={containerClass}>
        <h2 className="text-base font-semibold">Contact</h2>
        <p className="mt-2 text-base text-gray-400">
          If you want to contact me, write to me via telegram{" "}
          <Link
            className="text-black underline dark:text-white"
            href="https://t.me/MashrabYoldashov"
            target="_blank"
          >
            direct message
          </Link>
          . I always reply and I will not ignore you. If you don&apos;t have a
          telegram account write to my another socials. 👇
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Link
            className="text-black underline dark:text-white"
            href="https://www.linkedin.com/in/mashraby"
            target="_blank"
          >
            linkedin
          </Link>
          <Separator orientation="vertical" />
          <Link
            className="text-black underline dark:text-white"
            href="https://x.com/mashrabdev"
            target="_blank"
          >
            twitter
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="mt-8">
      <div className={cn(containerClass, "border-t p-4")}>
        <p className="text-center text-sm font-semibold text-gray-400">
          {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
