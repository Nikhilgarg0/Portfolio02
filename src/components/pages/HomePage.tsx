// HPI 1.6-G - Intentionally Engineered Portfolio
import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Github, Linkedin, Mail, ChevronDown, ExternalLink, Code2, Terminal } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Experience, Projects } from '@/entities';
import { Image } from '@/components/ui/image';

// --- Easing Constants (Apple-like, subtle) ---
const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN_OUT = [0.4, 0, 0.2, 1] as const;

// --- Custom Cursor Component ---
function CustomCursor() {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.classList.contains('cursor-pointer');
      
      setIsHoveringInteractive(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  return (
    <>
      <style>{`
        * { cursor: none !important; }
        input, textarea { cursor: text !important; }
      `}</style>

      <motion.div
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
        className="fixed w-8 h-8 border border-accent/40 rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      />

      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: isHoveringInteractive ? 1.5 : 1,
          backgroundColor: isHoveringInteractive ? '#007BFF' : 'rgba(0, 123, 255, 0.6)',
        }}
        transition={{ duration: 0.2 }}
        className="fixed w-2 h-2 bg-accent rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      />
    </>
  );
}

// --- Utility Components ---
type AnimatedElementProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

const AnimatedElement: React.FC<AnimatedElementProps> = ({ children, className, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <div 
      ref={ref} 
      className={`${className || ''}`}
      style={{ 
        opacity: isInView ? 1 : 0, 
        transform: isInView ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s cubic-bezier(${EASE_OUT.join(',')}), transform 0.6s cubic-bezier(${EASE_OUT.join(',')})`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

// --- Main Page Component ---
export default function HomePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Projects[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { items: expItems } = await BaseCrudService.getAll<Experience>('experience');
        const { items: projectItems } = await BaseCrudService.getAll<Projects>('projects');
        
        setExperiences(expItems.sort((a, b) => {
          const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
          const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
          return dateB - dateA;
        }));
        
        setFeaturedProjects(projectItems.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['about', 'experience', 'projects', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen selection:bg-accent/30 selection:text-accent font-paragraph overflow-x-clip">
      <CustomCursor />
      <Header activeSection={activeSection} />
      <HeroSection />
      <AboutSection />
      <ExperienceSection experiences={experiences} />
      <ProjectsSection projects={featuredProjects} />
      <ContactSection />
      <Footer />
    </div>
  );
}

// --- Header with Active Section Tracking ---
function Header({ activeSection }: { activeSection: string }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = ['About', 'Experience', 'Projects', 'Contact'];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md py-4 border-b border-white/5' : 'bg-transparent py-8'
      }`}
    >
      <nav className="max-w-[120rem] mx-auto px-6 md:px-12 flex justify-between items-center">
        <Link to="/" className="font-heading text-xl font-bold tracking-tighter flex items-center gap-2 group">
          <span className="w-8 h-8 bg-foreground text-background flex items-center justify-center rounded-sm font-mono text-sm group-hover:bg-accent transition-colors duration-300">
            DEV
          </span>
          <span className="hidden sm:inline-block">Portfolio</span>
        </Link>
        
        <div className="flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = activeSection === item.toLowerCase();
            return (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                className="font-paragraph text-sm text-foreground/70 hover:text-accent transition-colors duration-300 hidden md:block relative group"
              >
                {item}
                <span 
                  className={`absolute bottom-0 left-0 h-px bg-accent transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </a>
            );
          })}
          <Link 
            to="/resume" 
            className="px-5 py-2 border border-foreground/20 rounded-full text-sm hover:border-accent hover:text-accent transition-all duration-300 flex items-center gap-2 group"
          >
            CV
            <ChevronDown size={16} className="group-hover:translate-y-1 transition-transform" />
          </Link>
        </div>
      </nav>
    </header>
  );
}

// --- Hero Section ---
function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 800], [0, 200]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);
  const codeOpacity = useTransform(scrollY, [0, 400], [1, 0.6]);

  return (
    <section ref={containerRef} className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-20 md:pt-32 pb-16 md:pb-24 px-4 md:px-12">
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[200px] w-[200px] md:h-[310px] md:w-[310px] rounded-full bg-accent/20 opacity-20 blur-[100px]" />
      </div>

      <motion.div 
        style={{ y: y1, opacity }} 
        className="z-10 w-full max-w-5xl"
      >
        <div className="flex justify-center mb-8 md:mb-12">
          <AvailabilityBadge />
        </div>

        <h1 className="font-heading text-3xl md:text-6xl lg:text-7xl tracking-tight mb-6 md:mb-8 leading-[1.2] text-center">
          NIKHIL GARG<br />
          <span className="text-accent">; )</span>
        </h1>

        <p className="text-center text-base md:text-xl text-foreground/70 mb-12 md:mb-16 max-w-2xl mx-auto leading-relaxed px-2">
          Early-stage developer focused on web and mobile applications. Graduating 2026. Learning in public, building with intent.
        </p>

        <motion.div 
          style={{ opacity: codeOpacity }}
          className="mb-12 md:mb-16 bg-foreground/5 border border-foreground/10 rounded-lg p-4 md:p-8 font-mono text-xs md:text-sm overflow-x-auto group hover:border-accent/30 hover:bg-foreground/[0.08] transition-all duration-500"
        >
          <div className="flex gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <CodeSnippet />
          <p className="text-xs text-foreground/40 mt-4 text-center">Click to expand</p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-10 md:mb-12">
          <ProjectsCTA />
          <a href="#contact" className="px-6 py-3 border border-foreground/20 rounded-lg text-foreground/70 hover:border-accent hover:text-accent transition-all duration-300 font-medium text-sm md:text-base">
            Get in Touch
          </a>
        </div>

        <div className="flex justify-center gap-4 md:gap-6">
          <SocialLink href="https://github.com" icon={<Github size={20} />} label="GitHub" />
          <SocialLink href="https://linkedin.com" icon={<Linkedin size={20} />} label="LinkedIn" />
          <SocialLink href="#contact" icon={<Mail size={20} />} label="Email" />
        </div>
      </motion.div>

      <motion.div 
        style={{ opacity }}
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-foreground/40"
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  );
}

// Code Snippet Component with Expandable Modal
function CodeSnippet() {
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isExpanded]);

  return (
    <>
      <motion.div
        onClick={() => setIsExpanded(true)}
        className="cursor-pointer"
      >
        <div className="space-y-2 text-foreground/80">
          <div><span className="text-accent">const</span> <span className="text-foreground">developer</span> = {'{'}</div>
          <div className="ml-4"><span className="text-foreground/60">name:</span> <span className="text-green-400">"Nikhil"</span>,</div>
          <div className="ml-4"><span className="text-foreground/60">status:</span> <span className="text-green-400">"Available"</span>,</div>
          <div className="ml-4"><span className="text-foreground/60">focus:</span> [<span className="text-green-400">"web"</span>, <span className="text-green-400">"mobile"</span>],</div>
          <div className="ml-4"><span className="text-foreground/60">graduating:</span> <span className="text-blue-400">2026</span>,</div>
          <div>{'}'};</div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              onClick={(e) => e.stopPropagation()}
              className="bg-foreground/5 border border-foreground/10 rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-heading text-2xl font-bold">Developer Profile</h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-foreground/60 hover:text-foreground transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-2 text-foreground/80 font-mono text-sm md:text-base mb-6">
                <div><span className="text-accent">const</span> <span className="text-foreground">developer</span> = {'{'}</div>
                <div className="ml-4"><span className="text-foreground/60">name:</span> <span className="text-green-400">"Nikhil"</span>,</div>
                <div className="ml-4"><span className="text-foreground/60">status:</span> <span className="text-green-400">"Available"</span>,</div>
                <div className="ml-4"><span className="text-foreground/60">focus:</span> [<span className="text-green-400">"web"</span>, <span className="text-green-400">"mobile"</span>],</div>
                <div className="ml-4"><span className="text-foreground/60">graduating:</span> <span className="text-blue-400">2026</span>,</div>
                <div className="ml-4"><span className="text-foreground/60">skills:</span> [<span className="text-green-400">"MERN"</span>, <span className="text-green-400">"Expo"</span>, <span className="text-green-400">"Android Studio"</span>],</div>
                <div className="ml-4"><span className="text-foreground/60">experience:</span> <span className="text-blue-400">1</span> <span className="text-foreground/60">years,</span></div>
                <div className="ml-4"><span className="text-foreground/60">openToWork:</span> <span className="text-blue-400">true</span></div>
                <div>{'}'};</div>
              </div>

              <p className="text-foreground/70 text-sm">
                Click anywhere outside to close this expanded view.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="p-3 rounded-full border border-foreground/10 text-foreground/60 hover:text-accent hover:border-accent transition-all duration-300"
    >
      {icon}
    </a>
  );
}

// Availability Badge
function AvailabilityBadge() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.button
      onClick={() => setIsExpanded(!isExpanded)}
      className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono tracking-wider hover:border-accent/50 transition-colors duration-300 cursor-pointer"
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
      </span>
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <motion.span
            key="expanded"
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            transition={{ duration: 0.3 }}
          >
            Open for internships & contract work through 2026
          </motion.span>
        ) : (
          <motion.span
            key="collapsed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            AVAILABLE FOR 2026
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// Enhanced CTA Button
function ProjectsCTA() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href="#projects"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative px-8 py-4 bg-foreground text-background font-medium rounded-lg overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 w-full h-full bg-accent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      <motion.span
        className="relative flex items-center gap-2"
        animate={{ x: isHovered ? 4 : 0 }}
        transition={{ duration: 0.3, ease: EASE_OUT }}
      >
        <span className="text-sm">View Projects</span>
        
        <motion.div
          animate={{ 
            x: isHovered ? 2 : 0,
            rotate: isHovered ? 15 : 0
          }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
        >
          <ArrowRight size={18} />
        </motion.div>
      </motion.span>
    </motion.a>
  );
}

// --- About Section ---
function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="about" className="py-20 md:py-32 px-4 md:px-12 max-w-[120rem] mx-auto" ref={containerRef}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-start">
        <div className="lg:col-span-4">
          <AnimatedElement>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6 md:mb-8 flex items-center gap-4">
              <span className="w-8 md:w-12 h-[1px] bg-accent"></span>
              About
            </h2>
            <ImageWithParallax imageY={imageY} />
          </AnimatedElement>
        </div>

        <div className="lg:col-span-8 flex flex-col justify-start">
          <AnimatedElement delay={200}>
            <p className="font-heading text-xl md:text-3xl leading-relaxed text-foreground/90 mb-12 md:mb-16">
              I design systems that scale. Every decision prioritizes <span className="text-accent">readability, maintainability, and performance</span> over expedience.
            </p>
          </AnimatedElement>

          <AnimatedElement delay={300}>
            <CraftSection />
          </AnimatedElement>

          <AnimatedElement delay={400}>
            <StackSection />
          </AnimatedElement>
        </div>
      </div>
    </section>
  );
}

// Image with Parallax
function ImageWithParallax({ imageY }: { imageY: any }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      style={{ y: imageY }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-foreground/5 border border-foreground/10"
    >
      <motion.div
        animate={{ scale: isHovered ? 1.02 : 1 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        className="w-full h-full"
      >
        <Image 
          src="https://static.wixstatic.com/media/445dc7_21ec1884c0d540bfaa549a9aaf780056~mv2.png?originWidth=768&originHeight=960" 
          alt="Developer working"
          className="w-full h-full object-cover opacity-75"
        />
      </motion.div>
      
      <motion.div
        animate={{ opacity: isHovered ? 0.08 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-accent pointer-events-none"
      />
    </motion.div>
  );
}

// The Craft Section
function CraftSection() {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      className="mb-16 pb-16 border-b border-foreground/10"
    >
      <div className="space-y-6">
        <motion.div
          animate={{ opacity: isFocused ? 1 : 0.7 }}
          transition={{ duration: 0.2 }}
          className="w-12 h-12 rounded-lg bg-accent/15 flex items-center justify-center text-accent"
        >
          <Code2 size={28} />
        </motion.div>

        <h3 className="font-heading text-3xl font-bold text-foreground">
          The Craft
        </h3>

        <motion.p
          animate={{ color: isFocused ? '#E0E0E0' : '#999999' }}
          transition={{ duration: 0.2 }}
          className="text-lg leading-relaxed max-w-2xl"
        >
          I approach every problem as a systems design challenge. Code is communication—clarity and structure matter as much as functionality. I prioritize:
        </motion.p>

        <ul className="space-y-3 mt-6">
          {[
            { label: 'Readability', desc: 'Code that explains itself through clear naming and structure' },
            { label: 'Scalability', desc: 'Architectures that grow without technical debt' },
            { label: 'Maintainability', desc: 'Systems designed for future developers, including myself' }
          ].map((item) => (
            <CraftPrinciple key={item.label} label={item.label} desc={item.desc} isFocused={isFocused} />
          ))}
        </ul>
      </div>
    </div>
  );
}

// Individual Craft Principle
function CraftPrinciple({ label, desc, isFocused }: { label: string; desc: string; isFocused: boolean }) {
  return (
    <motion.li
      animate={{ opacity: isFocused ? 1 : 0.7 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-3 group"
    >
      <motion.span
        animate={{ width: isFocused ? 24 : 16 }}
        transition={{ duration: 0.2 }}
        className="mt-1.5 h-px bg-accent flex-shrink-0"
      />
      <div>
        <span className="font-mono text-sm font-semibold text-accent">{label}</span>
        <p className="text-foreground/60 text-sm mt-1">{desc}</p>
      </div>
    </motion.li>
  );
}

// The Stack Section
function StackSection() {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  const technologies = [
    { name: 'React', category: 'Frontend' },
    { name: 'TypeScript', category: 'Language' },
    { name: 'Node.js', category: 'Runtime' },
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'Tailwind', category: 'Styling' },
    { name: 'Git', category: 'VCS' }
  ];

  return (
    <div className="space-y-6">
      <h3 className="font-heading text-lg font-semibold text-foreground/70 uppercase tracking-wide">
        Tools & Technologies
      </h3>

      <div className="flex flex-wrap gap-3">
        {technologies.map((tech) => (
          <motion.div
            key={tech.name}
            onMouseEnter={() => setHoveredTech(tech.name)}
            onMouseLeave={() => setHoveredTech(null)}
            animate={{
              opacity: hoveredTech === tech.name ? 1 : 0.6,
              borderColor: hoveredTech === tech.name ? '#007BFF' : '#333333'
            }}
            transition={{ duration: 0.2 }}
            className="px-4 py-2 text-sm font-mono border border-foreground/20 rounded-md text-foreground/60 cursor-default"
          >
            {tech.name}
          </motion.div>
        ))}
      </div>

      <p className="text-xs text-foreground/40 mt-6">
        Tools evolve. Systems thinking is timeless.
      </p>
    </div>
  );
}

// --- Experience Section ---
function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  return (
    <section id="experience" className="py-20 md:py-32 bg-foreground/[0.02] border-y border-foreground/5">
      <div className="max-w-[100rem] mx-auto px-4 md:px-12">
        <AnimatedElement>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-16 md:mb-20 text-center">Experience Journey</h2>
        </AnimatedElement>

        <div className="relative">
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-foreground/10 -translate-x-1/2 hidden md:block" />

          <div className="space-y-16 md:space-y-24">
            {experiences.map((exp, index) => (
              <ExperienceItem key={exp._id} experience={exp} index={index} isFirst={index === 0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Experience Item with Hover Elevation
function ExperienceItem({ experience, index, isFirst }: { experience: Experience; index: number; isFirst: boolean }) {
  const isEven = index % 2 === 0;
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-20% 0px" });

  return (
    <div ref={ref} className={`flex flex-col md:flex-row gap-8 md:gap-0 items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
      <div className="flex-1 w-full md:w-1/2">
        <AnimatedElement delay={index * 100} className={`flex ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
          <motion.div
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            animate={{
              y: isInView ? -8 : 0,
              boxShadow: isInView 
                ? '0 20px 40px rgba(0, 123, 255, 0.15)' 
                : '0 0px 0px rgba(0, 0, 0, 0)',
              scale: isInView ? 1.02 : 1
            }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className={`w-full md:w-4/5 p-8 rounded-2xl bg-background border border-foreground/5 transition-colors duration-300 relative group ${isEven ? 'md:ml-12' : 'md:mr-12'}`}
          >
            <div className={`absolute top-1/2 w-12 h-px bg-accent/30 hidden md:block ${isEven ? '-left-12' : '-right-12'}`} />
            
            <motion.div
              animate={{
                scale: isFirst || isInView ? 1.4 : 1,
                backgroundColor: isFirst || isInView ? '#007BFF' : '#666666'
              }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className={`absolute top-1/2 w-3 h-3 rounded-full hidden md:block ${isEven ? '-left-[54px]' : '-right-[54px]'} translate-y-[-50%]`}
            />

            <span className="inline-block px-3 py-1 mb-4 text-xs font-mono text-accent bg-accent/5 rounded-full">
              {experience.startDate ? new Date(experience.startDate).getFullYear() : 'Present'}
            </span>
            
            <h3 className="font-heading text-2xl font-bold mb-1">{experience.title}</h3>
            <p className="text-lg text-foreground/80 mb-4">{experience.organizationName}</p>
            
            {experience.description && (
              <p className="text-foreground/60 leading-relaxed text-sm">
                {experience.description}
              </p>
            )}
          </motion.div>
        </AnimatedElement>
      </div>
      <div className="hidden md:block w-px" />
      <div className="flex-1 w-full md:w-1/2" />
    </div>
  );
}

// --- Projects Section ---
function ProjectsSection({ projects }: { projects: Projects[] }) {
  return (
    <section id="projects" className="py-20 md:py-32 px-4 md:px-12 max-w-[120rem] mx-auto">
      <AnimatedElement>
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 md:mb-24 border-b border-foreground/10 pb-6 md:pb-8 gap-4">
          <div>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-3 md:mb-4">Selected Works</h2>
            <p className="text-foreground/60 max-w-md text-sm md:text-base">
              A collection of experiments, applications, and technical explorations.
            </p>
          </div>
          <Link 
            to="/projects" 
            className="group flex items-center gap-2 text-accent hover:text-accent/80 transition-colors whitespace-nowrap text-sm md:text-base"
          >
            View All Projects <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
          </Link>
        </div>
      </AnimatedElement>

      <div className="space-y-20 md:space-y-32">
        {projects.map((project, index) => (
          <ProjectCard key={project._id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}

// Project Card with Reveal Interaction
function ProjectCard({ project, index }: { project: Projects; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);
  
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div ref={ref} className="group relative grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center min-h-auto md:min-h-[60vh]">
      <div className={`order-2 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
        <AnimatedElement>
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="font-mono text-accent text-xs md:text-sm">0{index + 1}</span>
              <div className="h-px w-8 md:w-12 bg-accent/30" />
              <span className="font-mono text-foreground/40 text-xs md:text-sm uppercase tracking-wider">{project.projectType || 'Development'}</span>
            </div>
            
            <h3 className="font-heading text-2xl md:text-5xl font-bold group-hover:text-accent transition-colors duration-300">
              {project.projectName}
            </h3>
            
            <p className="text-base md:text-lg text-foreground/70 leading-relaxed max-w-xl">
              {project.projectDescription}
            </p>

            <motion.div
              animate={{ 
                opacity: isHovered ? 1 : 0, 
                height: isHovered ? 'auto' : 0,
                marginTop: isHovered ? 16 : 0
              }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="overflow-hidden"
            >
              {project.architectureDetails && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
                  transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.05 }}
                  className="p-4 bg-foreground/5 border border-foreground/10 rounded-lg"
                >
                  <p className="text-xs font-mono text-accent/70 uppercase tracking-wider mb-2">Architecture</p>
                  <p className="text-sm text-foreground/60">{project.architectureDetails}</p>
                </motion.div>
              )}
              {project.designDecisions && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
                  transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.1 }}
                  className="mt-3 p-4 bg-foreground/5 border border-foreground/10 rounded-lg"
                >
                  <p className="text-xs font-mono text-accent/70 uppercase tracking-wider mb-2">Design Decisions</p>
                  <p className="text-sm text-foreground/60">{project.designDecisions}</p>
                </motion.div>
              )}
            </motion.div>

            <div className="flex flex-wrap gap-2 md:gap-3 pt-4">
              {project.techStack?.split(',').map((tech) => (
                <span key={tech} className="px-3 py-1 text-xs border border-foreground/10 rounded-md text-foreground/60">
                  {tech.trim()}
                </span>
              ))}
            </div>

            <div className="flex gap-4 md:gap-6 pt-6 md:pt-8 flex-wrap">
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs md:text-sm font-medium hover:text-accent transition-colors">
                  <Github size={18} /> Source Code
                </a>
              )}
              {project.liveLink && (
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="hidden md:flex items-center gap-2 text-xs md:text-sm font-medium hover:text-accent transition-colors">
                  <ExternalLink size={18} /> Live Demo
                </a>
              )}
            </div>
          </div>
        </AnimatedElement>
      </div>

      <div className={`order-1 ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'}`}>
        <motion.div 
          style={{ y, opacity }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          className="relative aspect-video rounded-xl overflow-hidden bg-foreground/5 border border-foreground/10 group-hover:border-accent/30 transition-colors duration-500"
        >
          {project.mainScreenshot ? (
            <Image 
              src={project.mainScreenshot} 
              alt={project.projectName || 'Project Preview'} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-foreground/5">
              <Terminal size={48} className="text-foreground/20" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-tr from-background/80 via-transparent to-transparent opacity-60" />
        </motion.div>
      </div>
    </div>
  );
}

// --- Contact Section ---
function ContactSection() {
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [activeField, setActiveField] = useState<string | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setTimeout(() => setFormState('success'), 1500);
  };

  const subjects = ['Hiring', 'Collaboration', 'Feedback', 'Other'];

  return (
    <section id="contact" className="py-20 md:py-32 px-4 md:px-12 max-w-5xl mx-auto">
      <AnimatedElement>
        <div className="mb-12 md:mb-16">
          <span className="text-accent font-mono text-xs md:text-sm uppercase tracking-wider">Contact</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3 md:mt-4 mb-4 md:mb-6">Get in touch</h2>
          <p className="text-foreground/60 text-base md:text-lg">
            Have a question or want to work together? Send me a message.
          </p>
        </div>

        {formState === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-accent/10 border border-accent/20 rounded-2xl p-8 md:p-12 text-center"
          >
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="text-white" size={32} />
            </div>
            <h3 className="font-heading text-xl md:text-2xl font-bold mb-2">Message Sent</h3>
            <p className="text-foreground/70 text-sm md:text-base">I'll get back to you as soon as possible.</p>
            <button 
              onClick={() => setFormState('idle')}
              className="mt-8 text-sm text-accent hover:underline"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="relative pt-6">
                <motion.label 
                  animate={{
                    y: activeField === 'name' || (document.getElementById('name') as HTMLInputElement)?.value ? -28 : 0,
                    fontSize: activeField === 'name' || (document.getElementById('name') as HTMLInputElement)?.value ? '0.75rem' : '0.875rem',
                    color: activeField === 'name' || (document.getElementById('name') as HTMLInputElement)?.value ? '#007BFF' : '#999999'
                  }}
                  transition={{ duration: 0.2, ease: EASE_OUT }}
                  className="absolute left-4 block pointer-events-none"
                >
                  Name
                </motion.label>
                <input 
                  id="name"
                  placeholder=""
                  required
                  onFocus={() => setActiveField('name')}
                  onBlur={() => setActiveField(null)}
                  className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors text-sm md:text-base"
                />
              </div>
              <div className="relative pt-6">
                <motion.label 
                  animate={{
                    y: activeField === 'email' || (document.getElementById('email') as HTMLInputElement)?.value ? -28 : 0,
                    fontSize: activeField === 'email' || (document.getElementById('email') as HTMLInputElement)?.value ? '0.75rem' : '0.875rem',
                    color: activeField === 'email' || (document.getElementById('email') as HTMLInputElement)?.value ? '#007BFF' : '#999999'
                  }}
                  transition={{ duration: 0.2, ease: EASE_OUT }}
                  className="absolute left-4 block pointer-events-none"
                >
                  Email
                </motion.label>
                <input 
                  id="email"
                  type="email"
                  placeholder=""
                  required
                  onFocus={() => setActiveField('email')}
                  onBlur={() => setActiveField(null)}
                  className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors text-sm md:text-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-3">Subject</label>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {subjects.map((subject) => (
                  <motion.button
                    key={subject}
                    type="button"
                    onClick={() => setSelectedSubject(subject)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      borderColor: selectedSubject === subject ? '#007BFF' : '#333333',
                      backgroundColor: selectedSubject === subject ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
                      color: selectedSubject === subject ? '#007BFF' : '#999999'
                    }}
                    transition={{ duration: 0.2, ease: EASE_OUT }}
                    className={`px-4 py-2 rounded-lg border text-xs md:text-sm font-medium`}
                  >
                    {subject}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="relative pt-6">
              <motion.label 
                animate={{
                  y: activeField === 'message' || (document.getElementById('message') as HTMLTextAreaElement)?.value ? -28 : 0,
                  fontSize: activeField === 'message' || (document.getElementById('message') as HTMLTextAreaElement)?.value ? '0.75rem' : '0.875rem',
                  color: activeField === 'message' || (document.getElementById('message') as HTMLTextAreaElement)?.value ? '#007BFF' : '#999999'
                }}
                transition={{ duration: 0.2, ease: EASE_OUT }}
                className="absolute left-4 block pointer-events-none"
              >
                Message
              </motion.label>
              <textarea 
                id="message"
                placeholder=""
                required
                rows={5}
                onFocus={() => setActiveField('message')}
                onBlur={() => setActiveField(null)}
                className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors resize-none text-sm md:text-base"
              />
              <div className="text-right text-xs text-foreground/40 mt-2">0/1000</div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                disabled={formState === 'submitting'}
                className="px-6 md:px-8 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm md:text-base"
              >
                <Mail size={18} />
                {formState === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>
            </div>

            <p className="text-xs text-foreground/40 text-center pt-4">
              Prefer email? Reach me at <a href="mailto:hello@example.com" className="text-accent hover:underline">hello@example.com</a>
            </p>
          </form>
        )}
      </AnimatedElement>
    </section>
  );
}

// --- Footer ---
function Footer() {
  return (
    <footer className="py-8 md:py-12 border-t border-foreground/5 bg-background">
      <div className="max-w-[120rem] mx-auto px-4 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
        <div className="text-center md:text-left">
          <p className="font-heading font-bold text-lg mb-1">Nikhils Portfolio</p>
          <p className="text-xs md:text-sm text-foreground/40">© 2026. Built with precision.</p>
        </div>
        
        <div className="flex gap-6 md:gap-8">
          <a href="https://github.com" className="text-foreground/40 hover:text-accent transition-colors text-xs md:text-sm">GitHub</a>
          <a href="https://linkedin.com" className="text-foreground/40 hover:text-accent transition-colors text-xs md:text-sm">LinkedIn</a>
          <a href="mailto:hello@example.com" className="text-foreground/40 hover:text-accent transition-colors text-xs md:text-sm">Email</a>
        </div>
      </div>
    </footer>
  );
}
