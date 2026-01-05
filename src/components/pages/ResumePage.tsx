import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Github, Linkedin, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BaseCrudService } from '@/integrations';
import { Experience } from '@/entities';

export default function ResumePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      const { items } = await BaseCrudService.getAll<Experience>('experience');
      setExperiences(items.sort((a, b) => {
        const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
        const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
        return dateB - dateA;
      }));
    };
    
    fetchExperiences();
  }, []);

  const formatDate = (date?: Date | string) => {
    if (!date) return 'Present';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
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
            <Link to="/projects" className="font-paragraph text-sm hover:text-accent transition-colors duration-300">
              Projects
            </Link>
          </div>
        </nav>
      </header>

      <div className="pt-32 pb-16 px-8">
        <div className="max-w-[100rem] mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="mb-16"
          >
            <h1 className="font-heading text-5xl font-bold mb-6">Resume</h1>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <p className="font-paragraph text-lg text-foreground/70">
                Early-Stage App and Web Developer • Graduating 2026
              </p>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-6 py-3 bg-accent text-primary-foreground font-paragraph text-base rounded-lg hover:bg-accent/90 transition-colors duration-300 w-fit"
              >
                <Download size={20} />
                Download PDF
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Contact & Skills */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="space-y-12"
            >
              {/* Contact */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-6 text-accent">Contact</h2>
                <div className="space-y-4">
                  <a 
                    href="mailto:developer@example.com"
                    className="flex items-center gap-3 font-paragraph text-base text-foreground/80 hover:text-accent transition-colors duration-300"
                  >
                    <Mail size={18} />
                    developer@example.com
                  </a>
                  <a 
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 font-paragraph text-base text-foreground/80 hover:text-accent transition-colors duration-300"
                  >
                    <Github size={18} />
                    github.com/developer
                  </a>
                  <a 
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 font-paragraph text-base text-foreground/80 hover:text-accent transition-colors duration-300"
                  >
                    <Linkedin size={18} />
                    linkedin.com/in/developer
                  </a>
                </div>
              </section>

              {/* Technical Skills */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-6 text-accent">Technical Skills</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-heading text-lg font-semibold mb-3">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {['JavaScript', 'TypeScript', 'Python', 'HTML', 'CSS'].map((skill) => (
                        <span 
                          key={skill}
                          className="font-paragraph text-sm px-3 py-1 bg-foreground/5 border border-foreground/10 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-heading text-lg font-semibold mb-3">Frameworks & Libraries</h3>
                    <div className="flex flex-wrap gap-2">
                      {['React', 'Node.js', 'Express', 'Tailwind CSS'].map((skill) => (
                        <span 
                          key={skill}
                          className="font-paragraph text-sm px-3 py-1 bg-foreground/5 border border-foreground/10 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-heading text-lg font-semibold mb-3">Tools & Platforms</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Git', 'PostgreSQL', 'MongoDB', 'Figma'].map((skill) => (
                        <span 
                          key={skill}
                          className="font-paragraph text-sm px-3 py-1 bg-foreground/5 border border-foreground/10 rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Core Competencies */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-6 text-accent">Core Competencies</h2>
                <ul className="font-paragraph text-base text-foreground/80 space-y-2">
                  <li>• Full-stack web development</li>
                  <li>• RESTful API design</li>
                  <li>• Responsive UI/UX</li>
                  <li>• Database architecture</li>
                  <li>• Version control (Git)</li>
                  <li>• Agile methodologies</li>
                </ul>
              </section>
            </motion.div>

            {/* Right Column - Experience & Education */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="lg:col-span-2 space-y-12"
            >
              {/* Professional Summary */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-6 text-accent">Professional Summary</h2>
                <p className="font-paragraph text-base text-foreground/80 leading-relaxed">
                  Early-stage developer with a strong foundation in full-stack web development and a focus on clean, maintainable code. Experienced in building responsive applications using modern frameworks and tools. Committed to engineering best practices, user-centered design, and continuous learning. Seeking opportunities to contribute to meaningful projects while growing technical expertise.
                </p>
              </section>

              {/* Experience */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-6 text-accent">Experience</h2>
                <div className="space-y-8">
                  {experiences.map((exp) => (
                    <div key={exp._id} className="border-l-2 border-accent/30 pl-6 pb-6 relative">
                      <div className="absolute left-[-9px] top-0 w-4 h-4 bg-accent rounded-full" />
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                        <div>
                          <h3 className="font-heading text-xl font-semibold">{exp.title}</h3>
                          <p className="font-paragraph text-base text-accent">{exp.organizationName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-paragraph text-sm text-foreground/60">
                            {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                          </p>
                          {exp.location && (
                            <p className="font-paragraph text-sm text-foreground/60">{exp.location}</p>
                          )}
                        </div>
                      </div>
                      {exp.description && (
                        <p className="font-paragraph text-base text-foreground/80 leading-relaxed">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Education */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-6 text-accent">Education</h2>
                <div className="border-l-2 border-accent/30 pl-6 pb-6 relative">
                  <div className="absolute left-[-9px] top-0 w-4 h-4 bg-accent rounded-full" />
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                    <div>
                      <h3 className="font-heading text-xl font-semibold">Bachelor of Science in Computer Science</h3>
                      <p className="font-paragraph text-base text-accent">University Name</p>
                    </div>
                    <p className="font-paragraph text-sm text-foreground/60">
                      Expected 2026
                    </p>
                  </div>
                  <p className="font-paragraph text-base text-foreground/80">
                    Relevant coursework: Data Structures, Algorithms, Web Development, Database Systems, Software Engineering
                  </p>
                </div>
              </section>

              {/* Projects Highlight */}
              <section>
                <h2 className="font-heading text-2xl font-semibold mb-6 text-accent">Notable Projects</h2>
                <p className="font-paragraph text-base text-foreground/80 mb-4">
                  For detailed project information, interactive demos, and technical deep-dives, visit the{' '}
                  <Link to="/projects" className="text-accent hover:text-accent/80 transition-colors duration-300">
                    Projects page
                  </Link>
                  .
                </p>
                <div className="space-y-4">
                  <div className="p-4 bg-foreground/[0.02] border border-foreground/10 rounded-lg">
                    <h3 className="font-heading text-lg font-semibold mb-2">Web Application Projects</h3>
                    <p className="font-paragraph text-sm text-foreground/70">
                      Full-stack applications demonstrating modern web development practices, API integration, and responsive design.
                    </p>
                  </div>
                  <div className="p-4 bg-foreground/[0.02] border border-foreground/10 rounded-lg">
                    <h3 className="font-heading text-lg font-semibold mb-2">Mobile Development</h3>
                    <p className="font-paragraph text-sm text-foreground/70">
                      Cross-platform mobile applications showcasing UI/UX design and mobile-first development approaches.
                    </p>
                  </div>
                </div>
              </section>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-foreground/10">
        <div className="max-w-[100rem] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
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
          </div>
        </div>
      </footer>

      {/* Print Styles */}
      <style>{`
        @media print {
          header, footer, button {
            display: none !important;
          }
          
          body {
            background: white !important;
            color: black !important;
          }
          
          .bg-background {
            background: white !important;
          }
          
          .text-foreground {
            color: black !important;
          }
          
          .border-foreground\\/10 {
            border-color: #ccc !important;
          }
          
          a {
            color: #007BFF !important;
          }
        }
      `}</style>
    </div>
  );
}
