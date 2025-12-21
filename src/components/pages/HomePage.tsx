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
    <section ref={containerRef} className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-accent/20 opacity-20 blur-[100px]" />
      </div>

      <motion.div 
        style={{ y: y1, opacity }} 
        className="z-10 text-center max-w-4xl px-6"
      >
        {/* Intelligent Availability Badge */}
        <AvailabilityBadge badgeY={badgeY} badgeOpacity={badgeOpacity} />

        {/* Scroll-Reactive Headline */}
        <motion.h1 
          style={{ fontWeight: headlineWeight, opacity: headlineOpacity, scale: headlineScale }}
          className="font-heading text-5xl md:text-7xl lg:text-8xl tracking-tight mb-8 leading-[1.1]"
        >
          Building the <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-foreground to-foreground/50">
            Digital Future
          </span>
        </motion.h1>

        <div className="h-24 md:h-16 flex items-center justify-center mb-12">
          <TypewriterEffect />
        </div>

        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          {/* Enhanced CTA with Project Preview */}
          <ProjectsCTA />
          <div className="flex gap-6">
            <SocialLink href="https://github.com" icon={<Github size={20} />} label="GitHub" />
            <SocialLink href="https://linkedin.com" icon={<Linkedin size={20} />} label="LinkedIn" />
            <SocialLink href="#contact" icon={<Mail size={20} />} label="Email" />
          </div>
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

function TypewriterEffect() {
  const [text, setText] = useState('');
  const fullText = "Engineering discipline. Attention to detail. Growth mindset.";
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <p className="font-mono text-lg md:text-xl text-foreground/60 h-full">
      {text}<span className="animate-pulse text-accent">_</span>
    </p>
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
  return (
    <section id="about" className="py-32 px-6 md:px-12 max-w-[120rem] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-4">
          <AnimatedElement>
            <h2 className="font-heading text-4xl font-bold mb-6 flex items-center gap-4">
              <span className="w-12 h-[1px] bg-accent"></span>
              About
            </h2>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-foreground/5">
              <Image 
                src="https://static.wixstatic.com/media/445dc7_21ec1884c0d540bfaa549a9aaf780056~mv2.png?originWidth=768&originHeight=960" 
                alt="Developer working"
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
          </AnimatedElement>
        </div>

        <div className="lg:col-span-8 flex flex-col justify-center">
          <AnimatedElement delay={200}>
            <p className="font-heading text-2xl md:text-3xl leading-relaxed text-foreground/90 mb-12">
              I am an early-stage developer crafting <span className="text-accent">clean, functional applications</span> with a focus on engineering fundamentals.
            </p>
          </AnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <AnimatedElement delay={300}>
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4">
                  <Code2 size={24} />
                </div>
                <h3 className="font-heading text-xl font-bold">The Craft</h3>
                <p className="text-foreground/60 leading-relaxed">
                  I approach development not just as coding, but as problem-solving. Every line of code is an opportunity to improve readability, performance, and maintainability.
                </p>
              </div>
            </AnimatedElement>

            <AnimatedElement delay={400}>
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent mb-4">
                  <Cpu size={24} />
                </div>
                <h3 className="font-heading text-xl font-bold">The Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind', 'Git'].map((tech) => (
                    <span key={tech} className="px-3 py-1 text-xs font-mono border border-foreground/10 rounded-full text-foreground/60">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedElement>
          </div>
        </div>
      </div>
    </section>
  );
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    setTimeout(() => setFormState('success'), 1500);
  };

  return (
    <section id="contact" className="py-32 px-6 md:px-12 max-w-4xl mx-auto">
      <AnimatedElement>
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl font-bold mb-4">Let's Build Together</h2>
          <p className="text-foreground/60">
            Have a project in mind or just want to chat tech? I'm always open to new ideas.
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <label className={`absolute left-0 transition-all duration-300 ${activeField === 'name' || (document.getElementById('name') as HTMLInputElement)?.value ? '-top-6 text-xs text-accent' : 'top-2 text-foreground/40'}`}>
                  Name
                </label>
                <input 
                  id="name"
                  required
                  onFocus={() => setActiveField('name')}
                  onBlur={() => setActiveField(null)}
                  className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
              <div className="relative">
                <label className={`absolute left-0 transition-all duration-300 ${activeField === 'email' || (document.getElementById('email') as HTMLInputElement)?.value ? '-top-6 text-xs text-accent' : 'top-2 text-foreground/40'}`}>
                  Email
                </label>
                <input 
                  id="email"
                  type="email"
                  required
                  onFocus={() => setActiveField('email')}
                  onBlur={() => setActiveField(null)}
                  className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
            
            <div className="relative mt-8">
              <label className={`absolute left-0 transition-all duration-300 ${activeField === 'message' || (document.getElementById('message') as HTMLTextAreaElement)?.value ? '-top-6 text-xs text-accent' : 'top-2 text-foreground/40'}`}>
                Message
              </label>
              <textarea 
                id="message"
                required
                rows={4}
                onFocus={() => setActiveField('message')}
                onBlur={() => setActiveField(null)}
                className="w-full bg-transparent border-b border-foreground/20 py-2 focus:outline-none focus:border-accent transition-colors resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button 
                type="submit"
                disabled={formState === 'submitting'}
                className="px-8 py-3 bg-foreground text-background font-medium rounded-lg hover:bg-accent hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {formState === 'submitting' ? 'Sending...' : 'Send Message'}
                {!formState && <ArrowRight size={18} />}
              </button>
            </div>
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