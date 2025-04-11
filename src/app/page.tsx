"use client";

import { useEffect, useState, useRef, useMemo, FormEvent } from "react";
import {
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
  useSpring,
  useScroll,
  useInView,
  type Variants,
  type MotionValue,
} from "framer-motion";
import { toast } from "sonner";

export default function ComingSoonPage() {
  // Countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 40,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Animation controls
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Mouse tracking for interactive effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  // Smooth spring-based values
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 15 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 15 });

  // Parallax and 3D transform values
  const y1 = useTransform(smoothProgress, [0, 1], [0, -50]);
  const y2 = useTransform(smoothProgress, [0, 1], [0, -100]);
  const opacity = useTransform(smoothProgress, [0, 0.5, 1], [1, 1, 0.8]);

  // 3D rotation values based on mouse position
  const rotateX = useTransform(smoothMouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(smoothMouseX, [-300, 300], [-10, 10]);

  // Cursor glow effect
  const cursorGlowX = useTransform(smoothMouseX, [-300, 300], [-150, 150]);
  const cursorGlowY = useTransform(smoothMouseY, [-300, 300], [-150, 150]);

  // Track mouse position
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to the center of the screen
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;

      mouseX.set(x);
      mouseY.set(y);
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Start animations when in view
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  // Countdown timer
  useEffect(() => {
    // Set the target date to 20 days from now
    const targetDate = new Date("2025-03-20T00:00:00Z");
    targetDate.setDate(targetDate.getDate() + 40);

    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 15,
      },
    },
  };

  const textRevealVariants: Variants = {
    hidden: { y: 100 },
    visible: {
      y: 0,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const loadingToast = toast.loading("Sending email...");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/send-notify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        toast.success("Email sent successfully!", { id: loadingToast });
      } else {
        toast.error(data.error || "Failed to send email!", {
          id: loadingToast,
        });
      }
    } catch (err) {
      toast.error("Something went wrong!", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white">
      {/* Animated background */}
      <div className="fixed inset-0 z-0">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a1018] via-black to-black" />

        {/* Interactive particle system */}
        <ParticleSystem mouseX={smoothMouseX} mouseY={smoothMouseY} />

        {/* Cursor glow effect */}
        <motion.div
          className="pointer-events-none absolute -inset-1/4 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"
          style={{
            left: cursorGlowX,
            top: cursorGlowY,
            width: "300px",
            height: "300px",
            x: "-50%",
            y: "-50%",
            mixBlendMode: "soft-light",
          }}
        />

        {/* Animated grid with perspective */}
        <PerspectiveGrid rotateX={rotateX} rotateY={rotateY} />
      </div>

      {/* Main content */}
      <motion.div
        ref={containerRef}
        className="relative z-10 w-full max-w-md space-y-16 px-4 text-center"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        style={{
          y: y1,
          opacity,
          rotateX,
          rotateY,
          transformPerspective: 1000,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Heading section */}
        <motion.div className="space-y-6" variants={itemVariants}>
          <div className="overflow-hidden">
            <motion.div variants={textRevealVariants}>
              <h1 className="text-7xl font-extralight tracking-tight">
                <span className="relative inline-block">
                  <span className="relative z-10">COMING</span>
                  <motion.span
                    className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-slate-500 to-transparent"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1.2 }}
                  />
                </span>{" "}
                <span className="font-bold relative">
                  <span className="absolute inset-0 bg-gradient-to-r from-slate-300 via-white to-slate-300 bg-clip-text text-transparent blur-sm animate-pulse-slow">
                    SOON
                  </span>
                  <span className="relative bg-gradient-to-r from-slate-300 via-white to-slate-300 bg-clip-text text-transparent">
                    SOON
                  </span>
                </span>
              </h1>
            </motion.div>
          </div>

          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-slate-400/50 to-transparent">
              <motion.div
                className="h-full w-full bg-white/80"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  delay: 1.2,
                  duration: 1.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </div>
          </motion.div>

          <motion.p
            className="text-white/70 font-light"
            variants={itemVariants}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1.4,
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            We're crafting something extraordinary
          </motion.p>
        </motion.div>

        {/* Countdown timer */}
        <motion.div
          className="grid grid-cols-4 gap-4"
          variants={itemVariants}
          style={{
            y: y2,
            rotateX: useTransform(rotateX, (v) => v * 1.5),
            rotateY: useTransform(rotateY, (v) => v * 1.5),
            transformPerspective: 1000,
            transformStyle: "preserve-3d",
          }}
        >
          <HolographicTimeUnit value={timeLeft.days} label="DAYS" />
          <HolographicTimeUnit value={timeLeft.hours} label="HOURS" />
          <HolographicTimeUnit value={timeLeft.minutes} label="MINS" />
          <HolographicTimeUnit value={timeLeft.seconds} label="SECS" />
        </motion.div>

        {/* Email subscription form */}
        <motion.div className="space-y-6" variants={itemVariants}>
          <motion.p
            className="text-white/60 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 1 }}
          >
            Be the first to know when we launch
          </motion.p>

          <motion.form
            onSubmit={handleSubmit}
            className="flex space-x-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 2,
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            <HolographicInput />
            <HolographicButton isDisabled={loading} />
          </motion.form>
        </motion.div>
      </motion.div>

      {/* Floating cursor */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-50 mix-blend-difference"
        style={{
          x: cursorPosition.x - 16,
          y: cursorPosition.y - 16,
          backgroundColor: "rgba(255, 255, 255, 0.5)",
          boxShadow: "0 0 20px 5px rgba(255, 255, 255, 0.3)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />
    </div>
  );
}

function HolographicTimeUnit({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  const [prevValue, setPrevValue] = useState(value);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (prevValue !== value) {
      setIsFlipping(true);
      const timer = setTimeout(() => {
        setPrevValue(value);
        setIsFlipping(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  return (
    <motion.div
      className="flex flex-col items-center"
      whileHover={{
        y: -5,
        transition: {
          type: "spring",
          stiffness: 400,
          damping: 10,
        },
      }}
    >
      <motion.div
        className="relative flex h-24 w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-b from-white/10 to-transparent backdrop-blur-sm border border-white/10"
        whileHover={{
          boxShadow: "0 0 30px rgba(255, 255, 255, 0.15)",
          borderColor: "rgba(255, 255, 255, 0.2)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          transition: { duration: 0.3 },
        }}
      >
        {/* Holographic effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-500/10 via-transparent to-slate-400/10 opacity-50" />
        <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay" />

        {/* Scanline effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"
          animate={{
            y: ["-100%", "200%"],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            ease: "linear",
          }}
          style={{ height: "50%" }}
        />

        {/* 3D flip animation for numbers */}
        <div className="relative h-full w-full perspective-1000">
          <motion.div
            className={`absolute inset-0 flex items-center justify-center backface-hidden ${
              isFlipping ? "animate-flip-out" : ""
            }`}
          >
            <span className="text-4xl font-light text-white relative">
              <span className="absolute inset-0 blur-sm text-blue-100 opacity-70">
                {prevValue.toString().padStart(2, "0")}
              </span>
              <span className="relative">
                {prevValue.toString().padStart(2, "0")}
              </span>
            </span>
          </motion.div>

          <motion.div
            className={`absolute inset-0 flex items-center justify-center backface-hidden rotateX-180 ${
              isFlipping ? "animate-flip-in" : "opacity-0"
            }`}
          >
            <span className="text-4xl font-light text-white relative">
              <span className="absolute inset-0 blur-sm text-blue-100 opacity-70">
                {value.toString().padStart(2, "0")}
              </span>
              <span className="relative">
                {value.toString().padStart(2, "0")}
              </span>
            </span>
          </motion.div>
        </div>

        {/* Edge highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

        {/* Pulse glow */}
        <motion.div
          className="absolute inset-0 rounded-lg bg-white/5"
          animate={{
            opacity: [0, 0.3, 0],
            scale: [0.85, 1.05, 0.85],
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      </motion.div>

      <motion.span
        className="mt-2 text-xs tracking-widest text-white/60"
        whileHover={{
          color: "rgba(255, 255, 255, 0.9)",
          textShadow: "0 0 8px rgba(255, 255, 255, 0.3)",
          transition: { duration: 0.2 },
        }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
}

function HolographicInput() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div className="relative w-full overflow-hidden rounded-md group">
      <motion.input
        type="email"
        name="email"
        placeholder="Your email address"
        className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none transition-all duration-300"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          boxShadow: isFocused ? "0 0 20px rgba(255, 255, 255, 0.15)" : "none",
        }}
      />

      {/* Holographic effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100"
        animate={{
          background: [
            "linear-gradient(45deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0) 100%)",
            "linear-gradient(45deg, rgba(255, 255, 255, 0) 100%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0) 0%)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      {/* Bottom line */}
      <motion.div
        className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-white to-transparent"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{
          scaleX: isFocused ? 1 : [0.5, 1, 0.5],
          opacity: isFocused ? 1 : [0.3, 0.5, 0.3],
        }}
        transition={
          isFocused
            ? { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
            : {
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
              }
        }
      />

      {/* Scanline effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none"
        animate={{
          y: ["-100%", "200%"],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          ease: "linear",
        }}
        style={{ height: "50%" }}
      />
    </motion.div>
  );
}

function HolographicButton({ isDisabled }: { isDisabled?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef(null);

  return (
    <motion.button
      disabled={isDisabled}
      ref={buttonRef}
      type="submit"
      className="relative px-4 py-3 rounded-md text-sm font-medium overflow-hidden min-w-max"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{
        scale: 1.03,
      }}
      whileTap={{ scale: 0.97 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 15,
      }}
    >
      {/* Holographic background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-slate-700 to-slate-900 rounded-md"
        animate={{
          backgroundPosition: isHovered ? ["0% 0%", "100% 100%"] : "0% 0%",
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Noise texture */}
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.07] mix-blend-overlay rounded-md" />

      {/* Holographic edge glow */}
      <motion.div
        className="absolute inset-0 rounded-md"
        animate={{
          boxShadow: isHovered
            ? "0 0 20px 5px rgba(255, 255, 255, 0.3), inset 0 0 15px rgba(255, 255, 255, 0.2)"
            : "0 0 10px 2px rgba(255, 255, 255, 0.15), inset 0 0 5px rgba(255, 255, 255, 0.1)",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Text layers */}
      <motion.span
        className="relative z-10 block text-white font-medium"
        animate={{ y: isHovered ? -30 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        NOTIFY ME
      </motion.span>
      <motion.span
        className="absolute inset-0 flex items-center justify-center text-white font-medium"
        animate={{ y: isHovered ? 0 : 30 }}
        initial={{ y: 30 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        NOTIFY ME
      </motion.span>

      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 z-0 overflow-hidden rounded-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="absolute inset-0 translate-x-[-100%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/30 to-transparent"
          animate={{
            x: isHovered ? ["0%", "200%"] : "-100%",
          }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
            delay: 0.1,
          }}
        />
      </motion.div>
    </motion.button>
  );
}

function ParticleSystem({
  mouseX,
  mouseY,
}: {
  mouseX: MotionValue;
  mouseY: MotionValue;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Create particles only once
  const particles = useMemo(() => {
    if (typeof window === "undefined") return;

    return Array.from({ length: 100 }).map(() => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      hue: Math.random() * 20 + 220, // Subtle blue range
    }));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions with device pixel ratio for sharpness
    const setCanvasDimensions = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);

      // Reset canvas dimensions in CSS
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    // Animation loop
    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get current mouse position
      const mouseXValue = mouseX.get();
      const mouseYValue = mouseY.get();

      // Update and draw particles
      for (const particle of particles!) {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around screen
        if (particle.x > window.innerWidth) particle.x = 0;
        if (particle.x < 0) particle.x = window.innerWidth;
        if (particle.y > window.innerHeight) particle.y = 0;
        if (particle.y < 0) particle.y = window.innerHeight;

        // Mouse interaction - attract particles
        const dx = mouseXValue + window.innerWidth / 2 - particle.x;
        const dy = mouseYValue + window.innerHeight / 2 - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          const angle = Math.atan2(dy, dx);
          const force = (150 - distance) / 1500;
          particle.x += Math.cos(angle) * force;
          particle.y += Math.sin(angle) * force;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${particle.hue}, 100%, 70%, ${
          particle.opacity * (1 - distance / 1000)
        })`;
        ctx.fill();
      }

      // Connect particles with lines
      for (let i = 0; i < particles!.length; i++) {
        for (let j = i + 1; j < particles!.length; j++) {
          const dx = particles![i].x - particles![j].x;
          const dy = particles![i].y - particles![j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(148, 163, 184, ${
              0.15 * (1 - distance / 100)
            })`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles![i].x, particles![i].y);
            ctx.lineTo(particles![j].x, particles![j].y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      cancelAnimationFrame(animationId);
    };
  }, [mouseX, mouseY, particles]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0" />;
}

function PerspectiveGrid({
  rotateX,
  rotateY,
}: {
  rotateX: MotionValue;
  rotateY: MotionValue;
}) {
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className="absolute inset-0 grid grid-cols-[repeat(20,1fr)] grid-rows-[repeat(20,1fr)]"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          transformPerspective: 1000,
          z: -10,
        }}
      >
        {/* Horizontal grid lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`h-${i}`}
            className="absolute left-0 right-0 h-px"
            style={{
              top: `${(i + 1) * 5}%`,
              opacity: i % 5 === 0 ? 0.3 : 0.07,
              background:
                i % 5 === 0
                  ? "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)"
                  : "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.07) 50%, transparent 100%)",
              zIndex: i % 5 === 0 ? 2 : 1,
            }}
          />
        ))}

        {/* Vertical grid lines */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={`v-${i}`}
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: `${(i + 1) * 5}%`,
              opacity: i % 5 === 0 ? 0.3 : 0.07,
              background:
                i % 5 === 0
                  ? "linear-gradient(0deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)"
                  : "linear-gradient(0deg, transparent 0%, rgba(255, 255, 255, 0.07) 50%, transparent 100%)",
              zIndex: i % 5 === 0 ? 2 : 1,
            }}
          />
        ))}

        {/* Grid floor */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-slate-900/5 to-transparent"
          style={{
            transformStyle: "preserve-3d",
            transform: "translateZ(-10px)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
