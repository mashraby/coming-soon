import { Menu } from "lucide-react";
import Link from "next/link";

import ToggleTheme from "@/components/shared/toggle-theme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const containerClass = "container mx-auto px-4 max-w-2xl";

export default function Header() {
  const navLinks = [
    {
      title: "Home",
      slug: "#home",
    },
    {
      title: "Experience",
      slug: "#experience",
    },
    {
      title: "Skills",
      slug: "#skills",
    },
    {
      title: "Projects",
      slug: "#projects",
    },
    {
      title: "Contact",
      slug: "#contact",
    },
  ];

  return (
    <header className="sticky top-0 py-4">
      <div
        className={cn(
          containerClass,
          "flex w-full items-center justify-end md:justify-center"
        )}
      >
        <nav className="flex flex-row-reverse items-center justify-start gap-8 rounded-full border-2 bg-white/30 p-4 backdrop-blur-xl dark:bg-zinc-900/30 md:flex-row lg:w-max lg:px-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button type="button" className="flex md:hidden">
                <Menu className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="bottom"
              align="end"
              className="bg-white dark:bg-zinc-900"
            >
              {navLinks.map((navLink) => (
                <DropdownMenuItem key={navLink.slug} asChild>
                  <Link href={navLink.slug}>{navLink.title}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((navLink) => (
              <li key={navLink.slug}>
                <Link className="text-xs hover:underline" href={navLink.slug}>
                  {navLink.title}
                </Link>
              </li>
            ))}
          </ul>
          <ToggleTheme />
        </nav>
      </div>
    </header>
  );
}
