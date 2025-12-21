// HPI 1.6-G
import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Github, Linkedin, Mail, ChevronDown, ExternalLink, Code2, Terminal, Cpu } from 'lucide-react';
import { BaseCrudService } from '@/integrations';
import { Experience, Projects } from '@/entities';
import { Image } from '@/components/ui/image';

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
      className={`${className || ''} transition-all duration-700 ease-out`}
      style={{ 
        opacity: isInView ? 1 : 0, 
        transform: isInView ? 'translateY(0)' : 'translateY(20px)',
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

const StickyCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 w-6 h-6 border border-accent rounded-full pointer-events-none z-[100] mix-blend-difference hidden md:block"
      style={{ 
        transform: `translate(${mousePosition.x - 12}px, ${mousePosition.y - 12}px)`,
        transition: 'transform 0.1s ease-out'
      }}
    />
  );
};

// --- Main Page Component ---

export default function HomePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<Projects[]>([]);
  const [loading, setLoading] = useState(true);

  // Data Fidelity Protocol: Fetching Canonical Data Sources
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
        
        // Taking top 3 for the sticky stack effect
        setFeaturedProjects(projectItems.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
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
      <StickyCursor />
      <Header />
      <HeroSection />
      <AboutSection />
      <ExperienceSection experiences={experiences} />
      <ProjectsSection projects={featuredProjects} />
      <ContactSection />
      <Footer />
    </div>
  );
}

// --- Sections ---

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
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
          {['About', 'Experience', 'Projects', 'Contact'].map((item) => (
            <a 
              key={item}
              href={`#${item.toLowerCase()}`} 
              className="font-paragraph text-sm text-foreground/70 hover:text-accent transition-colors duration-300 hidden md:block"
            >
              {item}
            </a>
          ))}
          <Link 
            to="/resume" 
            className="px-5 py-2 border border-foreground/20 rounded-full text-sm hover:border-accent hover:text-accent transition-all duration-300"
          >
            Resume
          </Link>
        </div>
      </nav>
    </header>
  );
}

function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Headline scroll effects
  const headlineWeight = useTransform(scrollY, [0, 200], [700, 600]);
  const headlineOpacity = useTransform(scrollY, [0, 250], [1, 0.5]);
  const headlineScale = useTransform(scrollY, [0, 250], [1, 0.95]);
  
  // Badge scroll effects
  const badgeY = useTransform(scrollY, [0, 300], [0, -30]);
  const badgeOpacity = useTransform(scrollY, [0, 250], [1, 0.3]);

  return (
    <section ref={containerRef} className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden pt-32 pb-24 px-6 md:px-12">
      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-accent/20 opacity-20 blur-[100px]" />
      </div>

      <motion.div 
        style={{ y: y1, opacity }} 
        className="z-10 w-full max-w-5xl"
      >
        {/* Intelligent Availability Badge */}
        <div className="flex justify-center mb-12">
          <AvailabilityBadge badgeY={badgeY} badgeOpacity={badgeOpacity} />
        </div>

        {/* Scroll-Reactive Headline */}
        <motion.h1 
          style={{ fontWeight: headlineWeight, opacity: headlineOpacity, scale: headlineScale }}
          className="font-heading text-5xl md:text-6xl lg:text-7xl tracking-tight mb-8 leading-[1.2] text-center"
        >
          Building what's <br />
          <span className="text-accent">next</span>
        </motion.h1>

        {/* Subtitle */}
        <p className="text-center text-lg md:text-xl text-foreground/70 mb-16 max-w-2xl mx-auto leading-relaxed">
          Early-stage developer focused on web and mobile applications. Graduating 2026. Learning in public, building with intent.
        </p>

        {/* Code Snippet Display */}
        <div className="mb-16 bg-foreground/5 border border-foreground/10 rounded-lg p-6 md:p-8 font-mono text-sm overflow-x-auto">
          <div className="flex gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <CodeSnippet />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <ProjectsCTA />
          <button className="px-6 py-3 border border-foreground/20 rounded-lg text-foreground/70 hover:border-accent hover:text-accent transition-all duration-300 font-medium">
            Get in Touch
          </button>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6">
          <SocialLink href="https://github.com" icon={<Github size={20} />} label="GitHub" />
          <SocialLink href="https://linkedin.com" icon={<Linkedin size={20} />} label="LinkedIn" />
          <SocialLink href="#contact" icon={<Mail size={20} />} label="Email" />
        </div>
      </motion.div>

      <motion.div 
        style={{ opacity }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-foreground/40"
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  );
}

// Code Snippet Component
function CodeSnippet() {
  return (
    <div className="space-y-2 text-foreground/80">
      <div><span className="text-accent">const</span> <span className="text-foreground">developer</span> = {'{'}
      </div>
      <div className="ml-4"><span className="text-foreground/60">name:</span> <span className="text-green-400">"Developer"</span>,</div>
      <div className="ml-4"><span className="text-foreground/60">status:</span> <span className="text-green-400">"Available"</span>,</div>
      <div className="ml-4"><span className="text-foreground/60">focus:</span> [<span className="text-green-400">"web"</span>, <span className="text-green-400">"mobile"</span>],</div>
      <div className="ml-4"><span className="text-foreground/60">graduating:</span> <span className="text-blue-400">2026</span>,</div>
      <div>{'}'};</div>
    </div>
  );
}



function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="p-3 rounded-full border border-foreground/10 text-foreground/60 hover:text-accent hover:border-accent transition-all duration-300 hover:-translate-y-1"
    >
      {icon}
    </a>
  );
}

// Intelligent Availability Badge with Scroll Reactivity
function AvailabilityBadge({ badgeY, badgeOpacity }: { badgeY: any; badgeOpacity: any }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.button
      style={{ y: badgeY, opacity: badgeOpacity }}
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

// Enhanced CTA with Directional Micro-Movement & Project Reveal
function ProjectsCTA() {
  const [isHovered, setIsHovered] = useState(false);
  const [firstProjectName, setFirstProjectName] = useState<string>('');

  useEffect(() => {
    const fetchFirstProject = async () => {
      const { items } = await BaseCrudService.getAll<Projects>('projects');
      if (items.length > 0) {
        setFirstProjectName(items[0].projectName || 'View Projects');
      }
    };
    fetchFirstProject();
  }, []);

  return (
    <motion.a
      href="#projects"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group relative px-8 py-4 bg-foreground text-background font-medium rounded-lg overflow-hidden"
    >
      {/* Background color shift on hover */}
      <motion.div
        className="absolute inset-0 w-full h-full bg-accent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      <motion.span
        className="relative flex items-center gap-2"
        animate={{ x: isHovered ? 4 : 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Text that reveals project name on hover */}
        <AnimatePresence mode="wait">
          {isHovered && firstProjectName ? (
            <motion.span
              key="project"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="text-sm"
            >
              Explore: {firstProjectName}
            </motion.span>
          ) : (
            <motion.span
              key="default"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              View Projects
            </motion.span>
          )}
        </AnimatePresence>
        
        <motion.div
          animate={{ x: isHovered ? 2 : 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <ArrowRight size={18} />
        </motion.div>
      </motion.span>
    </motion.a>
  );
}

function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Subtle parallax for image (slow, predictable)
  const imageY = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="about" className="py-32 px-6 md:px-12 max-w-[120rem] mx-auto" ref={containerRef}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* Image Column - Subtle Parallax & Hover Zoom */}
        <div className="lg:col-span-4">
          <AnimatedElement>
            <h2 className="font-heading text-4xl font-bold mb-8 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-accent"></span>
              About
            </h2>
            <ImageWithInteraction imageY={imageY} />
          </AnimatedElement>
        </div>

        {/* Content Column - Hierarchy-Driven */}
        <div className="lg:col-span-8 flex flex-col justify-start">
          {/* Engineering Philosophy Statement */}
          <AnimatedElement delay={200}>
            <p className="font-heading text-2xl md:text-3xl leading-relaxed text-foreground/90 mb-16">
              I design systems that scale. Every decision prioritizes <span className="text-accent">readability, maintainability, and performance</span> over expedience.
            </p>
          </AnimatedElement>

          {/* The Craft - Primary Focus */}
          <AnimatedElement delay={300}>
            <CraftSection />
          </AnimatedElement>

          {/* The Stack - Secondary Support */}
          <AnimatedElement delay={400}>
            <StackSection />
          </AnimatedElement>
        </div>
      </div>
    </section>
  );
}

// Image with Subtle Parallax & Hover Zoom
function ImageWithInteraction({ imageY }: { imageY: any }) {
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
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full h-full"
      >
        <Image 
          src="https://static.wixstatic.com/media/445dc7_21ec1884c0d540bfaa549a9aaf780056~mv2.png?originWidth=768&originHeight=960" 
          alt="Developer working"
          className="w-full h-full object-cover opacity-75"
        />
      </motion.div>
      
      {/* Subtle overlay - no gradient, just a border shift on hover */}
      <motion.div
        animate={{ opacity: isHovered ? 0.08 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-accent pointer-events-none"
      />
    </motion.div>
  );
}

// The Craft - Dominant Section
function CraftSection() {
  const [isFocused, setIsFocused] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      onMouseEnter={() => !prefersReducedMotion && setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      className="mb-16 pb-16 border-b border-foreground/10"
    >
      <div className="space-y-6">
        {/* Icon - Larger, more prominent */}
        <motion.div
          animate={{ opacity: isFocused ? 1 : 0.7 }}
          transition={{ duration: 0.2 }}
          className="w-12 h-12 rounded-lg bg-accent/15 flex items-center justify-center text-accent"
        >
          <Code2 size={28} />
        </motion.div>

        {/* Heading */}
        <h3 className="font-heading text-3xl font-bold text-foreground">
          The Craft
        </h3>

        {/* Description - Engineering-focused */}
        <motion.p
          animate={{ color: isFocused ? '#E0E0E0' : '#999999' }}
          transition={{ duration: 0.2 }}
          className="text-lg leading-relaxed max-w-2xl"
        >
          I approach every problem as a systems design challenge. Code is communication—clarity and structure matter as much as functionality. I prioritize:
        </motion.p>

        {/* Core Principles - Subtle List */}
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

// Individual Craft Principle with Subtle Underline
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

// The Stack - Secondary, Supporting Role
function StackSection() {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();

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
      {/* Smaller heading to indicate secondary role */}
      <h3 className="font-heading text-lg font-semibold text-foreground/70 uppercase tracking-wide">
        Tools & Technologies
      </h3>

      {/* Tech Stack Grid - Minimal, clean */}
      <div className="flex flex-wrap gap-3">
        {technologies.map((tech) => (
          <motion.div
            key={tech.name}
            onMouseEnter={() => !prefersReducedMotion && setHoveredTech(tech.name)}
            onMouseLeave={() => setHoveredTech(null)}
            animate={{
              borderColor: hoveredTech === tech.name ? '#007BFF' : '#333333',
              backgroundColor: hoveredTech === tech.name ? '#007BFF15' : 'transparent'
            }}
            transition={{ duration: 0.2 }}
            className="px-4 py-2 text-sm font-mono border border-foreground/20 rounded-md text-foreground/60 cursor-default"
          >
            <motion.span
              animate={{ opacity: hoveredTech === tech.name ? 1 : 0.6 }}
              transition={{ duration: 0.2 }}
            >
              {tech.name}
            </motion.span>
          </motion.div>
        ))}
      </div>

      {/* Subtle note about tools */}
      <p className="text-xs text-foreground/40 mt-6">
        Tools evolve. Systems thinking is timeless.
      </p>
    </div>
  );
}

// Helper hook for reduced motion preference
function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  return (
    <section id="experience" className="py-32 bg-foreground/[0.02] border-y border-foreground/5">
      <div className="max-w-[100rem] mx-auto px-6 md:px-12">
        <AnimatedElement>
          <h2 className="font-heading text-4xl font-bold mb-20 text-center">Experience Journey</h2>
        </AnimatedElement>

        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-foreground/10 -translate-x-1/2 hidden md:block" />

          <div className="space-y-24">
            {experiences.map((exp, index) => (
              <ExperienceItem key={exp._id} experience={exp} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceItem({ experience, index }: { experience: Experience; index: number }) {
  const isEven = index % 2 === 0;
  
  return (
    <div className={`flex flex-col md:flex-row gap-8 md:gap-0 items-center ${isEven ? 'md:flex-row-reverse' : ''}`}>
      <div className="flex-1 w-full md:w-1/2">
        <AnimatedElement delay={index * 100} className={`flex ${isEven ? 'md:justify-start' : 'md:justify-end'}`}>
          <div className={`w-full md:w-4/5 p-8 rounded-2xl bg-background border border-foreground/5 hover:border-accent/30 transition-colors duration-300 relative group ${isEven ? 'md:ml-12' : 'md:mr-12'}`}>
            {/* Connector Line */}
            <div className={`absolute top-1/2 w-12 h-px bg-accent/30 hidden md:block ${isEven ? '-left-12' : '-right-12'}`} />
            <div className={`absolute top-1/2 w-3 h-3 rounded-full bg-accent hidden md:block ${isEven ? '-left-[54px]' : '-right-[54px]'} translate-y-[-50%]`} />

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
          </div>
        </AnimatedElement>
      </div>
      <div className="hidden md:block w-px" /> {/* Spacer for center line */}
      <div className="flex-1 w-full md:w-1/2" /> {/* Empty space for balance */}
    </div>
  );
}

function ProjectsSection({ projects }: { projects: Projects[] }) {
  return (
    <section id="projects" className="py-32 px-6 md:px-12 max-w-[120rem] mx-auto">
      <AnimatedElement>
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-foreground/10 pb-8">
          <div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">Selected Works</h2>
            <p className="text-foreground/60 max-w-md">
              A collection of experiments, applications, and technical explorations.
            </p>
          </div>
          <Link 
            to="/projects" 
            className="group flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mt-6 md:mt-0"
          >
            View All Projects <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </AnimatedElement>

      <div className="space-y-32">
        {projects.map((project, index) => (
          <ProjectCard key={project._id} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: Projects; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="group relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
      <div className={`order-2 ${index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'}`}>
        <AnimatedElement>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="font-mono text-accent text-sm">0{index + 1}</span>
              <div className="h-px w-12 bg-accent/30" />
              <span className="font-mono text-foreground/40 text-sm uppercase tracking-wider">{project.projectType || 'Development'}</span>
            </div>
            
            <h3 className="font-heading text-4xl md:text-5xl font-bold group-hover:text-accent transition-colors duration-300">
              {project.projectName}
            </h3>
            
            <p className="text-lg text-foreground/70 leading-relaxed max-w-xl">
              {project.projectDescription}
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              {project.techStack?.split(',').map((tech) => (
                <span key={tech} className="px-3 py-1 text-xs border border-foreground/10 rounded-md text-foreground/60">
                  {tech.trim()}
                </span>
              ))}
            </div>

            <div className="flex gap-6 pt-8">
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors">
                  <Github size={18} /> Source Code
                </a>
              )}
              {project.liveLink && (
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors">
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
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-tr from-background/80 via-transparent to-transparent opacity-60" />
        </motion.div>
      </div>
    </div>
  );
}

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
    <section id="contact" className="py-32 px-6 md:px-12 max-w-5xl mx-auto">
      <AnimatedElement>
        <div className="mb-16">
          <span className="text-accent font-mono text-sm uppercase tracking-wider">Contact</span>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mt-4 mb-6">Get in touch</h2>
          <p className="text-foreground/60 text-lg">
            Have a question or want to work together? Send me a message.
          </p>
        </div>

        {formState === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-accent/10 border border-accent/20 rounded-2xl p-12 text-center"
          >
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="text-white" size={32} />
            </div>
            <h3 className="font-heading text-2xl font-bold mb-2">Message Sent</h3>
            <p className="text-foreground/70">I'll get back to you as soon as possible.</p>
            <button 
              onClick={() => setFormState('idle')}
              className="mt-8 text-sm text-accent hover:underline"
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name & Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <label className={`absolute left-0 transition-all duration-300 text-sm ${activeField === 'name' || (document.getElementById('name') as HTMLInputElement)?.value ? '-top-6 text-xs text-accent' : 'top-3 text-foreground/50'}`}>
                  Name
                </label>
                <input 
                  id="name"
                  placeholder="Your name"
                  required
                  onFocus={() => setActiveField('name')}
                  onBlur={() => setActiveField(null)}
                  className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors placeholder:text-foreground/30"
                />
              </div>
              <div className="relative">
                <label className={`absolute left-0 transition-all duration-300 text-sm ${activeField === 'email' || (document.getElementById('email') as HTMLInputElement)?.value ? '-top-6 text-xs text-accent' : 'top-3 text-foreground/50'}`}>
                  Email
                </label>
                <input 
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  onFocus={() => setActiveField('email')}
                  onBlur={() => setActiveField(null)}
                  className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors placeholder:text-foreground/30"
                />
              </div>
            </div>

            {/* Subject Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-3">Subject</label>
              <div className="flex flex-wrap gap-3">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => setSelectedSubject(subject)}
                    className={`px-4 py-2 rounded-lg border transition-all duration-300 text-sm font-medium ${
                      selectedSubject === subject
                        ? 'border-accent bg-accent/10 text-accent'
                        : 'border-foreground/20 text-foreground/60 hover:border-foreground/40'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Field */}
            <div className="relative">
              <label className={`absolute left-0 transition-all duration-300 text-sm ${activeField === 'message' || (document.getElementById('message') as HTMLTextAreaElement)?.value ? '-top-6 text-xs text-accent' : 'top-3 text-foreground/50'}`}>
                Message
              </label>
              <textarea 
                id="message"
                placeholder="What's this about?"
                required
                rows={5}
                onFocus={() => setActiveField('message')}
                onBlur={() => setActiveField(null)}
                className="w-full bg-transparent border border-foreground/20 rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors resize-none placeholder:text-foreground/30"
              />
              <div className="text-right text-xs text-foreground/40 mt-2">0/1000</div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button 
                type="submit"
                disabled={formState === 'submitting'}
                className="px-8 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Mail size={18} />
                {formState === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>
            </div>

            {/* Contact Alternative */}
            <p className="text-xs text-foreground/40 text-center pt-4">
              Prefer email? Reach me at <a href="mailto:hello@example.com" className="text-accent hover:underline">hello@example.com</a>
            </p>
          </form>
        )}
      </AnimatedElement>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 border-t border-foreground/5 bg-background">
      <div className="max-w-[120rem] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="font-heading font-bold text-lg mb-1">DEV Portfolio</p>
          <p className="text-sm text-foreground/40">© 2026. Built with precision.</p>
        </div>
        
        <div className="flex gap-8">
          <a href="https://github.com" className="text-foreground/40 hover:text-accent transition-colors text-sm">GitHub</a>
          <a href="https://linkedin.com" className="text-foreground/40 hover:text-accent transition-colors text-sm">LinkedIn</a>
          <a href="mailto:hello@example.com" className="text-foreground/40 hover:text-accent transition-colors text-sm">Email</a>
        </div>
      </div>
    </footer>
  );
}