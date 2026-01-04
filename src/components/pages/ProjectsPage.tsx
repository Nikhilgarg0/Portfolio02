import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeft, Github, ExternalLink, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { Projects } from '@/entities';

// Hardcoded projects data
const HARDCODED_PROJECTS: Projects[] = [
  {
    _id: 'website-project',
    projectName: 'Website',
    projectDescription: 'Personal portfolio website coming soon',
    projectType: 'Web',
    techStack: '',
    architectureDetails: '',
    designDecisions: '',
    githubLink: '',
    liveLink: '',
    mainScreenshot: '',
  },
  {
    _id: 'asizto-mobile',
    projectName: 'ASIZTO',
    projectDescription: 'An AI powered Health Assistant Mobile App',
    projectType: 'Mobile',
    techStack: 'React Native, Kotlin, Expo framework, Firestore, Firebase Database',
    architectureDetails: 'Developed a cross-platform health management app featuring secure user authentication, medication reminders with adherence tracking by 35% through notification tracking system, appointment scheduling, and emergency contact management. Integrated AI-driven health insights and medicine information retrieval via Google Gemini API, enhancing personalized user experience. Delivered an intuitive, real-time synchronized mobile app optimized for Android.',
    designDecisions: 'Built with React Native and Expo framework for cross-platform compatibility. Utilized Firestore for secure authentication and Firebase Database for real-time data synchronization. Integrated Google Gemini API for AI-powered health insights and medicine information retrieval.',
    githubLink: 'https://github.com',
    liveLink: '',
    mainScreenshot: '',
  },
];

export default function ProjectsPage() {
  const [projects] = useState<Projects[]>(HARDCODED_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Projects | null>(HARDCODED_PROJECTS[1]);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="bg-background text-foreground min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-foreground/10">
        <nav className="max-w-[120rem] mx-auto px-8 py-6 flex justify-between items-center">
          <Link to="/" className="font-heading text-xl font-bold flex items-center gap-2 hover:text-accent transition-colors duration-300">
            <ArrowLeft size={20} />
            Back
          </Link>
          <div className="flex gap-8 items-center">
            <Link to="/" className="font-paragraph text-sm hover:text-accent transition-colors duration-300">
              Home
            </Link>
            <Link to="/resume" className="font-paragraph text-sm hover:text-accent transition-colors duration-300">
              Resume
            </Link>
          </div>
        </nav>
      </header>

      <div className="pt-32 pb-16 px-8">
        <div className="max-w-[120rem] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h1 className="font-heading text-5xl font-bold mb-4">Projects</h1>
            <p className="font-paragraph text-lg text-foreground/70 mb-16 max-w-3xl">
              Interactive exploration of selected work. Each project represents a deliberate focus on architecture, user experience, and engineering discipline.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Project List */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="lg:col-span-4 space-y-4"
            >
              <h2 className="font-heading text-2xl font-semibold mb-6">All Projects</h2>
              {projects.map((project, index) => (
                <motion.button
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                  onClick={() => setSelectedProject(project)}
                  className={`w-full text-left p-6 border rounded-lg transition-all duration-300 ${
                    selectedProject?._id === project._id
                      ? 'bg-accent/10 border-accent'
                      : 'bg-foreground/[0.02] border-foreground/10 hover:border-accent/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-heading text-xl font-semibold">
                      {project.projectName}
                    </h3>
                    {project.projectType && (
                      <span className="font-paragraph text-xs px-3 py-1 bg-accent/10 text-accent rounded-full">
                        {project.projectType}
                      </span>
                    )}
                  </div>
                  <p className="font-paragraph text-sm text-foreground/60 line-clamp-2">
                    {project.projectDescription}
                  </p>
                </motion.button>
              ))}
            </motion.div>

            {/* Project Details */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                {selectedProject && (
                  <motion.div
                    key={selectedProject._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                    className="space-y-8"
                  >
                    {/* Coming Soon Banner for Website Project */}
                    {selectedProject._id === 'website-project' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                        className="flex flex-col items-center justify-center py-24 px-8 border border-accent/30 rounded-lg bg-accent/5"
                      >
                        <Clock size={48} className="text-accent mb-4" />
                        <h2 className="font-heading text-4xl font-bold mb-2 text-center">Coming Soon</h2>
                        <p className="font-paragraph text-lg text-foreground/70 text-center max-w-md">
                          This project is currently in development. Check back soon for updates!
                        </p>
                      </motion.div>
                    )}

                    {/* Project Details for Non-Coming Soon Projects */}
                    {selectedProject._id !== 'website-project' && (
                      <>
                        {/* Project Header */}
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <h2 className="font-heading text-4xl font-bold">
                              {selectedProject.projectName}
                            </h2>
                            <div className="flex gap-3">
                              {selectedProject.githubLink && (
                                <a
                                  href={selectedProject.githubLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-3 bg-foreground/5 border border-foreground/10 rounded-lg hover:border-accent transition-colors duration-300"
                                  aria-label="View on GitHub"
                                >
                                  <Github size={20} />
                                </a>
                              )}
                              {selectedProject.liveLink && (
                                <a
                                  href={selectedProject.liveLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-3 bg-accent text-primary-foreground rounded-lg hover:bg-accent/90 transition-colors duration-300"
                                  aria-label="View live project"
                                >
                                  <ExternalLink size={20} />
                                </a>
                              )}
                            </div>
                          </div>
                          <p className="font-paragraph text-lg text-foreground/80 leading-relaxed">
                            {selectedProject.projectDescription}
                          </p>
                        </div>

                        {/* Tech Stack - Expandable */}
                        {selectedProject.techStack && (
                          <ExpandableSection
                            title="Tech Stack"
                            isExpanded={expandedSections['tech']}
                            onToggle={() => toggleSection('tech')}
                          >
                            <div className="flex flex-wrap gap-3">
                              {selectedProject.techStack.split(',').map((tech, index) => (
                                <span
                                  key={index}
                                  className="font-paragraph text-sm px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-lg"
                                >
                                  {tech.trim()}
                                </span>
                              ))}
                            </div>
                          </ExpandableSection>
                        )}

                        {/* Architecture - Expandable */}
                        {selectedProject.architectureDetails && (
                          <ExpandableSection
                            title="Architecture"
                            isExpanded={expandedSections['arch']}
                            onToggle={() => toggleSection('arch')}
                          >
                            <p className="font-paragraph text-base text-foreground/80 leading-relaxed whitespace-pre-line">
                              {selectedProject.architectureDetails}
                            </p>
                          </ExpandableSection>
                        )}

                        {/* Design Decisions - Expandable */}
                        {selectedProject.designDecisions && (
                          <ExpandableSection
                            title="Design Decisions"
                            isExpanded={expandedSections['design']}
                            onToggle={() => toggleSection('design')}
                          >
                            <p className="font-paragraph text-base text-foreground/80 leading-relaxed whitespace-pre-line">
                              {selectedProject.designDecisions}
                            </p>
                          </ExpandableSection>
                        )}
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-foreground/10">
        <div className="max-w-[120rem] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-paragraph text-sm text-foreground/60">
            © 2025 Early-Stage Developer. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-paragraph text-sm text-foreground/60 hover:text-accent transition-colors duration-300"
            >
              GitHub
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-paragraph text-sm text-foreground/60 hover:text-accent transition-colors duration-300"
            >
              LinkedIn
            </a>
            <Link 
              to="/resume"
              className="font-paragraph text-sm text-foreground/60 hover:text-accent transition-colors duration-300"
            >
              Resume
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Expandable Section Component
function ExpandableSection({ 
  title, 
  isExpanded, 
  onToggle, 
  children 
}: { 
  title: string; 
  isExpanded: boolean; 
  onToggle: () => void; 
  children: React.ReactNode;
}) {
  return (
    <div className="border border-foreground/10 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-6 bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-colors duration-300"
      >
        <h3 className="font-heading text-2xl font-semibold">{title}</h3>
        {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <div className="p-6 pt-0">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
