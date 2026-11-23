import CourseDetails from './components/CourseDetails';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Code2,
  Database,
  GraduationCap,
  Laptop,
  Lightbulb,
  MessageCircle,
  Monitor,
  Network,
  Rocket,
  Sparkles,
  Terminal,
  BookOpen,
  Clock3,
  ShieldCheck,
  Users,
  Globe,
  BriefcaseBusiness,
  Microscope,
  Cpu,
  LoaderCircle,
  RefreshCw
} from 'lucide-react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SectionHeading from './components/SectionHeading';
import { api } from './services/api';

const iconMap = {
  'website-design': Monitor,
  'python-programming': Code2,
  'machine-learning': BrainCircuit,
  'artificial-intelligence': Cpu,
  'deep-learning': Network,
  'natural-language-processing': MessageCircle,
  'large-language-models': Sparkles
};

const defaultDurations = [
  '1 Week',
  '2 Weeks',
  '1 Month',
  '3 Months'
];

const fallbackCourses = [
  {
    id: 'fallback-1',
    slug: 'website-design',
    title: 'Website Design',
    description:
      'Learn to create responsive, modern websites and build a strong foundation in web development.',
    category: 'training',
    durations: defaultDurations
  },
  {
    id: 'fallback-2',
    slug: 'python-programming',
    title: 'Python Programming',
    description:
      'Develop practical programming skills, from Python fundamentals to building useful applications.',
    category: 'training',
    durations: defaultDurations
  },
  {
    id: 'fallback-3',
    slug: 'machine-learning',
    title: 'Machine Learning',
    description:
      'Explore predictive modelling, data preparation, model evaluation and intelligent systems.',
    category: 'training',
    durations: defaultDurations
  },
  {
    id: 'fallback-4',
    slug: 'artificial-intelligence',
    title: 'Artificial Intelligence',
    description:
      'Understand AI techniques and discover how intelligent systems can solve real-world problems.',
    category: 'training',
    durations: defaultDurations
  },
  {
    id: 'fallback-5',
    slug: 'deep-learning',
    title: 'Deep Learning',
    description:
      'Explore neural networks and modern deep learning approaches for complex data problems.',
    category: 'training',
    durations: defaultDurations
  },
  {
    id: 'fallback-6',
    slug: 'natural-language-processing',
    title: 'Natural Language Processing',
    description:
      'Learn techniques for processing, analysing and understanding human language with AI.',
    category: 'training',
    durations: defaultDurations
  },
  {
    id: 'fallback-7',
    slug: 'large-language-models',
    title: 'Large Language Models',
    description:
      'Discover LLM foundations, prompting, practical applications and AI-assisted workflows.',
    category: 'training',
    durations: defaultDurations
  }
];

const trainingModes = [
  {
    icon: Laptop,
    title: 'Learn online',
    text: 'Access training remotely, wherever you are.'
  },
  {
    icon: Code2,
    title: 'Build practical skills',
    text: 'Develop your knowledge through hands-on learning.'
  },
  {
    icon: GraduationCap,
    title: 'Grow with confidence',
    text: 'Strengthen your skills for academic or professional goals.'
  }
];

const benefits = [
  {
    icon: Lightbulb,
    title: 'Practical learning',
    text: 'Focus on developing knowledge and skills that can be applied to real problems.'
  },
  {
    icon: Users,
    title: 'Learning support',
    text: 'Get guidance as you develop your technical and research capabilities.'
  },
  {
    icon: Rocket,
    title: 'Future-ready skills',
    text: 'Explore technologies shaping modern software, data and AI.'
  },
  {
    icon: ShieldCheck,
    title: 'Responsible practice',
    text: 'Encouraging ethical AI, responsible research and professional standards.'
  }
];



function TrainingCard({ course, index }) {
  return <CourseDetails course={course} index={index} />;
}



function App() {
  const [courses, setCourses] = useState(fallbackCourses);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [apiConnected, setApiConnected] = useState(false);
  const [loadError, setLoadError] = useState('');

  async function loadCourses() {
    setLoadingCourses(true);
    setLoadError('');

    try {
      const response = await api.getServices();

      const allServices = Array.isArray(response.data)
        ? response.data
        : [];

      const trainingServices = allServices.filter(
        (service) => service.category === 'training'
      );

      if (trainingServices.length > 0) {
        setCourses(trainingServices.map((service) => ({
          ...service,
          durations: Array.isArray(service.durations)
            ? service.durations
            : defaultDurations
        })));
      }

      setApiConnected(true);
    } catch (error) {
      console.error('Could not load training services:', error);
      setLoadError(
        'We could not refresh our training catalogue. Showing our programme overview instead.'
      );
      setApiConnected(false);
    } finally {
      setLoadingCourses(false);
    }
  }

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <>
      <Navbar />

      <main>
        {/* HERO */}
        <section className="hero-section" id="home">
          <div className="hero-grid-pattern" />

          <div className="container hero-layout">
            <div className="hero-content">
              <div className="hero-pill">
                <span className="status-dot" />
                TECHNOLOGY · TRAINING · INNOVATION
              </div>

              <h1>
                Your ideas.
                <br />
                <span>Our expertise.</span>
                <br />
                A smarter future.
              </h1>

              <p className="hero-description">
                Develop in-demand technology skills, solve complex
                IT challenges and advance your research with
                Just Science.
              </p>

              <div className="hero-actions">
                <a href="#training" className="button button-primary">
                  Explore our training
                  <ArrowRight size={18} />
                </a>

                <a href="#consultancy" className="button button-secondary">
                  Our services
                  <ArrowUpRight size={17} />
                </a>
              </div>

              <div className="hero-proof">
                <div className="proof-icon">
                  <Globe size={19} />
                </div>
                <div>
                  <strong>Learn and connect online</strong>
                  <span>Technology and research support</span>
                </div>
              </div>
            </div>

            <div className="hero-visual">
              <div className="visual-orb orb-one" />
              <div className="visual-orb orb-two" />

              <div className="visual-window">
                <div className="window-header">
                  <div className="window-dots">
                    <i />
                    <i />
                    <i />
                  </div>
                  <span>justscience.ai</span>
                  <Sparkles size={15} />
                </div>

                <div className="visual-window-body">
                  <div className="code-intro">
                    <span className="code-tag">INTELLIGENCE / 001</span>
                    <h3>
                      Ideas into
                      <br />
                      <span>innovation.</span>
                    </h3>
                    <p>
                      Learn. Experiment.
                      <br />
                      Create something meaningful.
                    </p>
                  </div>

                  <div className="code-editor">
                    <div className="editor-label">
                      <Terminal size={14} />
                      <span>hello_world.py</span>
                    </div>

                    <div className="code-lines">
                      <p>
                        <span className="code-muted">01</span>
                        <span className="code-purple">def</span>{' '}
                        <span className="code-blue">innovate</span>():
                      </p>
                      <p>
                        <span className="code-muted">02</span>
                        &nbsp;&nbsp;skills = <span className="code-green">"learn"</span>
                      </p>
                      <p>
                        <span className="code-muted">03</span>
                        &nbsp;&nbsp;ideas = <span className="code-green">"create"</span>
                      </p>
                      <p>
                        <span className="code-muted">04</span>
                        &nbsp;&nbsp;<span className="code-purple">return</span> skills, ideas
                      </p>
                    </div>
                  </div>

                  <div className="visual-tags">
                    <span><BrainCircuit size={15} /> AI & ML</span>
                    <span><Database size={15} /> Data</span>
                    <span><Code2 size={15} /> Code</span>
                  </div>
                </div>
              </div>

              <div className="floating-card floating-card-top">
                <span className="floating-icon">
                  <BrainCircuit size={21} />
                </span>
                <div>
                  <strong>Artificial Intelligence</strong>
                  <span>Explore what's possible</span>
                </div>
              </div>

              <div className="floating-card floating-card-bottom">
                <span className="floating-icon floating-icon-green">
                  <CheckCircle2 size={21} />
                </span>
                <div>
                  <strong>Skills for tomorrow</strong>
                  <span>Start building today</span>
                </div>
              </div>

              <div className="visual-decoration decoration-one" />
              <div className="visual-decoration decoration-two" />
            </div>
          </div>

          <div className="hero-bottom container">
            <span>EXPLORE OUR EXPERTISE</span>
            <div>
              <a href="#training">Technology Training <ArrowRight size={14} /></a>
              <a href="#consultancy">IT Consultancy <ArrowRight size={14} /></a>
              <a href="#research">Research Support <ArrowRight size={14} /></a>
            </div>
          </div>
        </section>

        {/* INTRO / VALUE */}
        <section className="intro-section section-padding">
          <div className="container intro-layout">
            <div className="intro-heading">
              <span className="eyebrow">WHAT WE DO</span>
              <h2>
                Knowledge that
                <br />
                <span>moves you forward.</span>
              </h2>
            </div>

            <div className="intro-copy">
              <p>
                Just Science brings together technology training,
                IT consultancy and academic research guidance
                to help individuals and organisations turn
                challenges into opportunities.
              </p>
              <a href="#about" className="text-link">
                Discover Just Science <ArrowRight size={17} />
              </a>
            </div>
          </div>

          <div className="container value-strip">
            {trainingModes.map((item) => {
              const Icon = item.icon;

              return (
                <div className="value-item" key={item.title}>
                  <div className="value-icon">
                    <Icon size={23} />
                  </div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* TRAINING */}
        <section className="training-section section-padding" id="training">
          <div className="container">
            <div className="training-heading-row">
              <SectionHeading
                eyebrow="OUR TRAINING PROGRAMMES"
                title="Build skills that open doors."
                description="Explore our online technology programmes and find a learning path that aligns with your goals."
              />

              <div className="training-heading-aside">
                <span className="online-indicator">
                  <span className="status-dot" />
                  ONLINE TRAINING
                </span>
                <span className="training-duration-note">
                  Multiple duration options
                </span>
              </div>
            </div>

            <div className="duration-pills" aria-label="Available training durations">
              {defaultDurations.map((duration) => (
                <span key={duration} className="duration-pill">
                  <Clock3 size={14} />
                  {duration}
                </span>
              ))}
            </div>

            {loadingCourses && (
              <div className="catalogue-status">
                <LoaderCircle className="spin" size={19} />
                <span>Loading our training programmes...</span>
              </div>
            )}

            {!loadingCourses && loadError && (
              <div className="catalogue-notice" role="status">
                <span>{loadError}</span>
                <button
                  type="button"
                  className="retry-button"
                  onClick={loadCourses}
                >
                  <RefreshCw size={15} /> Retry
                </button>
              </div>
            )}

            <div className="training-grid">
              {courses.map((course, index) => (
                <TrainingCard
                  key={course.id ?? course.slug}
                  course={course}
                  index={index}
                />
              ))}
            </div>

            <div className="training-bottom">
              <p>
                Not sure which programme is right for you?
                We can help you choose.
              </p>
              <a href="#contact" className="button button-dark">
                Discuss your learning goals
                <ArrowRight size={17} />
              </a>
            </div>
          </div>
        </section>

        {/* CONSULTANCY */}
        <section className="consultancy-section section-padding" id="consultancy">
          <div className="container consultancy-layout">
            <div className="consultancy-content">
              <span className="eyebrow eyebrow-light">
                IT CONSULTANCY
              </span>

              <h2>
                Technology solutions
                <br />
                <span>built around you.</span>
              </h2>

              <p>
                Have a technology challenge? We provide consultancy
                and development support to help businesses,
                professionals and organisations make informed
                technology decisions.
              </p>

              <ul className="consultancy-list">
                <li>
                  <CheckCircle2 size={19} />
                  Website and web application development
                </li>
                <li>
                  <CheckCircle2 size={19} />
                  Software and database solutions
                </li>
                <li>
                  <CheckCircle2 size={19} />
                  AI and machine learning consultancy
                </li>
                <li>
                  <CheckCircle2 size={19} />
                  IT advisory and technical support
                </li>
              </ul>

              <a href="#contact" className="button button-white">
                Discuss your project <ArrowRight size={18} />
              </a>
            </div>

            <div className="consultancy-visual">
              <div className="consultancy-graphic">
                <div className="graphic-ring ring-one" />
                <div className="graphic-ring ring-two" />
                <div className="graphic-center">
                  <BriefcaseBusiness size={38} />
                </div>

                <div className="graphic-node node-one">
                  <Code2 size={23} />
                </div>
                <div className="graphic-node node-two">
                  <Database size={23} />
                </div>
                <div className="graphic-node node-three">
                  <BrainCircuit size={23} />
                </div>
                <div className="graphic-node node-four">
                  <Network size={23} />
                </div>
              </div>

              <div className="graphic-caption">
                <Sparkles size={17} />
                <span>Strategy. Technology. Results.</span>
              </div>
            </div>
          </div>
        </section>

        {/* RESEARCH */}
        <section className="research-section section-padding" id="research">
          <div className="container">
            <div className="research-top">
              <SectionHeading
                eyebrow="ACADEMIC & RESEARCH SUPPORT"
                title="Stronger research starts with the right guidance."
                description="Navigate your research journey with structured academic mentoring, methodological guidance and technical support."
              />
            </div>

            <div className="research-grid">
              <article className="research-card">
                <div className="research-icon">
                  <BookOpen size={25} />
                </div>
                <span className="research-label">01 / STUDENT SUPPORT</span>
                <h3>Assignment tutoring</h3>
                <p>
                  Understand challenging concepts, strengthen
                  problem-solving skills and develop your academic
                  confidence through guided learning.
                </p>
                <a href="#contact" className="text-link">
                  Enquire about support <ChevronRight size={17} />
                </a>
              </article>

              <article className="research-card research-card-featured">
                <div className="research-icon">
                  <GraduationCap size={27} />
                </div>
                <span className="research-label">02 / POSTGRADUATE</span>
                <h3>Master's research</h3>
                <p>
                  Research title refinement, proposal development,
                  methodology consultation, dissertation guidance
                  and data analysis support.
                </p>
                <a href="#contact" className="text-link">
                  Explore research guidance <ChevronRight size={17} />
                </a>
              </article>

              <article className="research-card">
                <div className="research-icon">
                  <Microscope size={25} />
                </div>
                <span className="research-label">03 / ADVANCED RESEARCH</span>
                <h3>PhD research</h3>
                <p>
                  Research problem formulation, proposal guidance,
                  thesis consultation, research methods and
                  analytical support.
                </p>
                <a href="#contact" className="text-link">
                  Discuss your research <ChevronRight size={17} />
                </a>
              </article>
            </div>

            <div className="research-note">
              <ShieldCheck size={20} />
              <p>
                Our academic support promotes research integrity,
                independent scholarship and compliance with
                institutional requirements. Students retain
                responsibility for their own submissions.
              </p>
            </div>
          </div>
        </section>

        {/* WHY JUST SCIENCE */}
        <section className="about-section section-padding" id="about">
          <div className="container">
            <div className="about-heading-row">
              <SectionHeading
                eyebrow="WHY JUST SCIENCE"
                title="More than knowledge. Real capability."
                description="Our approach brings learning, problem-solving and research support together in one place."
              />
            </div>

            <div className="benefits-grid">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;

                return (
                  <article className="benefit-card" key={benefit.title}>
                    <div className="benefit-top">
                      <div className="benefit-icon">
                        <Icon size={24} />
                      </div>
                      <span>
                        0{index + 1}
                      </span>
                    </div>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.text}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section" id="contact">
          <div className="container">
            <div className="cta-card">
              <div className="cta-decoration cta-decoration-one" />
              <div className="cta-decoration cta-decoration-two" />

              <div className="cta-content">
                <span className="eyebrow eyebrow-light">
                  LET'S GET STARTED
                </span>
                <h2>
                  Your next chapter
                  <br />
                  starts with a conversation.
                </h2>
                <p>
                  Tell us about your training goals, technology
                  project or research needs.
                </p>
                <a
                  href="mailto:info@justscience.com?subject=Just%20Science%20Enquiry"
                  className="button button-white"
                >
                  Send us an email
                  <ArrowUpRight size={18} />
                </a>
                <span className="cta-footnote">
                  Replace the example email with your official
                  business email before publishing.
                </span>
              </div>

              <div className="cta-art" aria-hidden="true">
                <div className="cta-art-circle">
                  <div className="cta-art-inner">
                    <Sparkles size={58} strokeWidth={1.2} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default App;
