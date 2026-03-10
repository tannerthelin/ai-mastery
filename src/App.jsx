import React, { useState, useEffect, useRef } from 'react'
import Marquee from 'react-fast-marquee'
import Squares from './components/Squares'

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
)

const StarRow = () => (
  <div className="star-row" style={{ color: 'var(--accent)' }}>
    {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
  </div>
)

const ChevronIcon = () => (
  <svg className="faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M6 9l6 6 6-6"/>
  </svg>
)

function Countdown() {
  const [time, setTime] = useState({ d: '--', h: '--', m: '--', s: '--' })
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const target = new Date('2026-04-21T16:00:00Z')
    function update() {
      const now = new Date()
      const diff = target - now
      if (diff <= 0) {
        setStarted(true)
        return
      }
      setTime({
        d: Math.floor(diff / 86400000),
        h: String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'),
        m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'),
        s: String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'),
      })
    }
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [])

  if (started) {
    return (
      <div className="countdown">
        <span className="cd-label">COHORT STARTED</span>
      </div>
    )
  }

  return (
    <div className="countdown">
      <span className="cd-label">NEXT COHORT &rarr;</span>
      <div className="cd-units">
        <div className="cd-unit">
          <span className="cd-num">{time.d}</span>
          <span className="cd-lbl">DAYS</span>
        </div>
        <div className="cd-unit">
          <span className="cd-num">{time.h}</span>
          <span className="cd-lbl">HRS</span>
        </div>
        <div className="cd-unit">
          <span className="cd-num">{time.m}</span>
          <span className="cd-lbl">MIN</span>
        </div>
        <div className="cd-unit">
          <span className="cd-num">{time.s}</span>
          <span className="cd-lbl">SEC</span>
        </div>
      </div>
    </div>
  )
}

function FaqItem({ question, answer, index }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item${open ? ' open' : ''}`} onClick={() => setOpen(!open)}>
      <span className="faq-index">{String(index + 1).padStart(2, '0')}</span>
      <div className="faq-body">
        <div className="faq-q">
          <h3>{question}</h3>
          <ChevronIcon />
        </div>
        <div className="faq-a">
          <p dangerouslySetInnerHTML={{ __html: answer }} />
        </div>
      </div>
    </div>
  )
}

function CourseAccordionItem({ course, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`accordion-item${open ? ' open' : ''}`}>
      <div className="accordion-header" onClick={() => setOpen(!open)}>
        <div className="accordion-header-left">
          <span className="accordion-level">LEVEL {course.num}</span>
          <h3 className="accordion-title">{course.title}</h3>
          <p className="accordion-tagline">{course.tagline.split('.')[0]}.</p>
        </div>
        <div className="accordion-header-right">
          <a href="https://www.joinleland.com/checkout?bootcampCohort=urn%3AbootcampCohort%3A(urn%3Abootcamp%3A69af7e391104a7bb1cbf5715%2C69af7ea5b3a78d3ad6852270)" className="accordion-enroll-link" onClick={(e) => e.stopPropagation()}>Enroll &rarr;</a>
          <ChevronIcon />
        </div>
      </div>
      <div className="accordion-body">
        <div className="accordion-sessions">
          <div className="course-sessions-label">Curriculum</div>
          {course.sessions.map((session, i) => (
            <div className="course-session" key={i}>
              <span className="course-session-num">{String(i + 1).padStart(2, '0')}</span>
              <div className="course-session-text">
                <span className="course-session-title">{session.title}</span>
                <span className="course-session-sub">{session.sub}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="accordion-meta">
          <div className="accordion-meta-row">
            <span className="accordion-meta-label">Schedule</span>
            <span className="accordion-meta-value">Tuesdays & Fridays &middot; 3 Weeks</span>
          </div>
          <div className="accordion-meta-row">
            <span className="accordion-meta-label">Next Cohort</span>
            <span className="accordion-meta-value">{course.cohorts[0].date}</span>
          </div>
          {course.cohorts.length > 1 && (
            <div className="accordion-meta-row">
              <span className="accordion-meta-label">Also runs</span>
              <span className="accordion-meta-value">{course.cohorts.slice(1).map(c => c.date).join(' & ')}</span>
            </div>
          )}
          <div className="accordion-meta-row">
            <span className="accordion-meta-label">Price</span>
            <span className="accordion-meta-value accordion-price">{course.price}</span>
          </div>
          <a href="https://www.joinleland.com/checkout?bootcampCohort=urn%3AbootcampCohort%3A(urn%3Abootcamp%3A69af7e391104a7bb1cbf5715%2C69af7ea5b3a78d3ad6852270)" className="btn btn-primary" style={{ textTransform: 'uppercase', marginTop: 12 }}>
            Enroll Now
            <span className="arrow">&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  )
}

function App() {
  const heroRef = useRef(null)
  const [showSticky, setShowSticky] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState(null)

  const navSections = [
    { id: 'courses', label: 'Courses' },
    { id: 'about', label: 'About' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'faq', label: 'FAQ' },
  ]

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const stickyObserver = new IntersectionObserver((entries) => {
      setShowSticky(!entries[0].isIntersecting)
    }, { threshold: 0 })
    stickyObserver.observe(hero)
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      stickyObserver.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (!scrolled) { setActiveSection(null); return }
    const sectionIds = navSections.map(s => s.id)
    const handleScroll = () => {
      let current = null
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120) current = id
        }
      }
      setActiveSection(current)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrolled])

  const courses = [
    {
      id: 'course-1', num: '01', type: 'LIVE COURSE',
      title: 'Foundations',
      tagline: "Learn the fundamentals you need to save hours every week with AI. Best for knowledge workers new to AI, professionals building a foundation, and teams preparing for the series.",
      tags: ['Tuesdays and Fridays', '3 Weeks'],
      sessions: [
        { title: 'Transform How You Work Forever', sub: 'AI tool selection, iterative prompting, and turning messy notes into structured outputs.' },
        { title: 'Let AI Research and Synthesize for You', sub: 'Use AI to research markets, synthesize findings, and produce strategic deliverables.' },
        { title: 'Analyze Data in Minutes, Not Hours', sub: 'Work with spreadsheets, build financial models, and create visualizations using AI.' },
        { title: 'Build a Workflow That Runs Daily', sub: 'Chain prompts into repeatable workflows that surface leads and opportunities automatically.' },
        { title: 'Train AI to Write Emails That Sound Like You', sub: 'Teach AI your voice and build personalized multi-touch communication sequences.' },
        { title: 'Build an End-to-End Process Workflow', sub: 'Connect research inputs to automated outputs with human-in-the-loop checkpoints.' },
      ],
      cohorts: [
        { month: 'APR', day: '21', date: 'April 21' },
        { month: 'MAY', day: '19', date: 'May 19' },
        { month: 'JUN', day: '16', date: 'June 16' },
      ],
      levelIndex: 0,
      price: '$999',
      reversed: false,
    },
    {
      id: 'course-2', num: '02', type: 'BOOTCAMP',
      title: 'Intelligent Automation',
      tagline: 'Make AI work for you. Automate the tasks eating your week. Best for operators and managers, anyone with repetitive workflows, and professionals who want measurable time back.',
      tags: ['Tuesdays and Fridays', '3 Weeks'],
      sessions: [
        { title: 'Automate the Task You Do Every Week', sub: 'Build your first connected automation that handles a recurring task without you.' },
        { title: 'Reframe Your Work as a System', sub: 'Map your recurring work as a system and build a prioritized automation backlog.' },
        { title: 'Build a Tool or Webpage Without a Developer', sub: 'Use vibe coding to build and publish a working tool or page with AI.' },
        { title: 'Automate Tasks That Span 5+ Tools', sub: 'Build multi-tool workflows with AI processing, error handling, and parallel outputs.' },
        { title: 'Build a Content or Reporting Engine', sub: 'Turn one input into multiple formatted outputs across destinations on a schedule.' },
        { title: 'Ship Your Operating Stack', sub: 'Connect your automations into a coherent system where inputs flow and exceptions surface.' },
      ],
      cohorts: [
        { month: 'APR', day: '21', date: 'April 21' },
        { month: 'MAY', day: '19', date: 'May 19' },
      ],
      levelIndex: 1,
      price: '$999',
      reversed: true,
    },
    {
      id: 'course-3', num: '03', type: 'LIVE COURSE',
      title: 'Agentic Workflows',
      tagline: 'Build AI agents that plan, decide, and execute without babysitting. Best for technical professionals, product builders, and anyone ready to go beyond prompts.',
      tags: ['Tuesdays and Fridays', '3 Weeks'],
      sessions: [
        { title: 'Ship Your First Autonomous Agent', sub: 'Build a research agent that takes an input and returns a structured brief autonomously.' },
        { title: 'Run an Agent Across a List', sub: 'Process entire lists with an agent that enriches each row with structured data at scale.' },
        { title: 'Build an Agent That Writes', sub: 'Create an agent that reads context and writes personalized messages for each recipient.' },
        { title: 'Connect an Agent to Your Tools', sub: 'Build an agent that logs activity and updates records in external systems like a CRM.' },
        { title: 'Build Software With AI', sub: 'Spec and build a working tool or dashboard through natural language, no code required.' },
        { title: 'Build Your Full Agent Pipeline', sub: 'Chain agents into one pipeline that researches, personalizes, logs, and follows up.' },
      ],
      cohorts: [
        { month: 'MAY', day: '19', date: 'May 19' },
      ],
      levelIndex: 2,
      price: '$999',
      reversed: false,
    },
    {
      id: 'course-4', num: '04', type: 'BOOTCAMP',
      title: 'AI Systems Design',
      tagline: 'Design AI-powered systems that scale across your org. Best for team leads and architects, operations and strategy, and professionals designing org-level AI.',
      tags: ['Tuesdays and Fridays', '3 Weeks'],
      sessions: [
        { title: 'Give an Agent a Goal, Not a Script', sub: 'Design goal-directed agents that plan and execute steps toward an objective autonomously.' },
        { title: 'Build an Eval System', sub: 'Define rubrics and score agent outputs to measure and improve performance over time.' },
        { title: 'Build an Agent That Improves Software', sub: 'Give an agent a codebase and improvement goal, let it build, test, and iterate.' },
        { title: 'Build an Orchestration Layer', sub: 'Build an orchestrator that delegates subtasks to specialized agents and assembles results.' },
        { title: 'Build a QA Layer for Autonomous Systems', sub: 'Monitor agent outputs, score quality, and alert when something needs human review.' },
        { title: 'Ship a Goal-Directed Delivery System', sub: 'Deploy an end-to-end autonomous pipeline with evals and human checkpoints.' },
      ],
      cohorts: [
        { month: 'JUN', day: '16', date: 'June 16' },
      ],
      levelIndex: 3,
      price: '$999',
      reversed: true,
    },
    {
      id: 'course-5', num: '05', type: 'LIVE COURSE',
      title: 'Advanced AI Architecture',
      tagline: 'Orchestrate multi-agent systems and enterprise-grade AI infrastructure. Best for senior technical leaders, AI/ML engineers, and enterprise architects.',
      tags: ['Tuesdays and Fridays', '3 Weeks'],
      sessions: [
        { title: 'Give Your Agents Institutional Memory', sub: 'Build a retrieval system so agents have real organizational context when they act.' },
        { title: 'Build an Agent That Works Toward a Long-Horizon Goal', sub: 'Design agents that maintain context across days with checkpointing and drift prevention.' },
        { title: 'Build an Agent That Builds and Tests Software', sub: 'Give an agent a product goal and let it write, test, and iterate autonomously.' },
        { title: 'Build a System That Self-Corrects', sub: 'Create feedback loops that detect errors, attempt corrections, and escalate when needed.' },
        { title: 'Evaluate a System You\'re Not Watching', sub: 'Build a live dashboard with KPIs, anomaly detection, and decision-support alerts.' },
        { title: 'Build a System That Runs the Business', sub: 'Connect all layers into one autonomous system that pursues goals with minimal human input.' },
      ],
      cohorts: [
        { month: 'JUL', day: '14', date: 'July 14' },
      ],
      levelIndex: 4,
      price: '$999',
      reversed: false,
    },
  ]

  const faqs = [
    {
      q: 'Do I need coding experience?',
      a: 'No. The series is designed for knowledge workers, not engineers. You will learn technical concepts, but everything is taught in a way that prioritizes practical application over code. That said, if you do have a technical background, the later courses (Agentic Workflows and Advanced Architecture) go deep enough to challenge experienced builders.',
    },
    {
      q: 'Can I take just one course?',
      a: 'Yes. Each course stands alone. But the series is designed to build on itself, and enrolling in all five gives you the best price and the most complete skill set.',
    },
    {
      q: 'What if I miss a live session?',
      a: 'Every session is recorded and available within 24 hours. You also get access to async discussion and coach support between sessions.',
    },
    {
      q: 'Is this for individuals or teams?',
      a: 'Both. Individuals can enroll directly. Teams of 5+ get volume pricing, a dedicated account manager, and custom use case workshops. <a href="#enterprise">Learn more about team training.</a>',
    },
    {
      q: "What's included in each course?",
      a: '6 live sessions, recorded replays, hands-on projects, a course community, and direct access to your instructor.',
    },
    {
      q: 'How is this different from free AI tutorials?',
      a: 'Free content teaches you features. This series teaches you systems. You will build real workflows, get expert feedback, and leave with tools you actually use at work. The cohort format keeps you accountable, and the live instruction means you can ask questions in real time.',
    },
    {
      q: 'What tools will I learn?',
      a: 'You\'ll work with ChatGPT, Claude, automation platforms like n8n and Zapier, coding tools, and more. We update the curriculum as tools evolve, so you\'re always learning what\'s current, not what was popular six months ago.',
    },
    {
      q: 'How long is each course?',
      a: 'Each course runs for 3 weeks with 6 live sessions (Tuesdays and Fridays). Sessions are 60-90 minutes. Plan for 3-5 hours per week including hands-on work.',
    },
    {
      q: "What's the Best Course Guarantee?",
      a: 'Complete our course, then take a competitor\'s course and complete it too. If you think theirs was better, we\'ll refund you up to the value of that competitor course. We\'re that confident in the quality.',
    },
    {
      q: 'Can I retake the course?',
      a: 'Yes. You can retake any course for a full year after your original enrollment. The curriculum updates as tools change, so retaking isn\'t just a refresher, it\'s new content.',
    },
    {
      q: 'What if AI tools change after I take the course?',
      a: 'They will, and that\'s exactly why we built the retake policy. Our curriculum is updated continuously. When you retake, you get the latest version with new tools, new techniques, and new workflows.',
    },
    {
      q: 'Is there a payment plan?',
      a: 'Yes. Payment plans are available at checkout. Reach out to our team if you need a custom arrangement.',
    },
    {
      q: 'What happens after I enroll?',
      a: 'You\'ll receive a welcome email with access to the course community, pre-work materials, and calendar invites for all live sessions. Everything you need to hit the ground running on day one.',
    },
    {
      q: 'Will I get a certificate?',
      a: 'Yes. Each course includes a verified certificate of completion. Finish all five courses and earn the full AI Mastery designation, a credential you can add to LinkedIn and your resume.',
    },
    {
      q: 'Who are the instructors?',
      a: 'Our instructors are practitioners from companies like OpenAI, Google, Spotify, and Amazon. They don\'t just teach AI, they build with it every day. You\'ll also get weekly office hours for direct Q&A.',
    },
  ]

  const trackItems = [
    { num: '01', name: 'Learn Foundations', tagline: 'Learn the fundamentals you need to save hours every week with AI.', href: '#course-1' },
    { num: '02', name: 'Intelligent Automation', tagline: 'Make AI work for you. Automate the tasks eating your week.', href: '#course-2' },
    { num: '03', name: 'Agentic Workflows', tagline: 'Build AI agents that plan, decide, and execute without babysitting.', href: '#course-3' },
    { num: '04', name: 'AI Systems Design', tagline: 'Design AI-powered systems that scale across your org.', href: '#course-4' },
    { num: '05', name: 'Advanced AI Architecture', tagline: 'Orchestrate multi-agent systems and enterprise-grade AI infrastructure.', href: '#course-5' },
  ]

  return (
    <>
      {/* ====== 1. Navigation ====== */}
      <nav className={scrolled ? 'nav-scrolled' : ''}>
        <div className="container">
          <a href="https://www.joinleland.com" className="logo">
            <img src={`${import.meta.env.BASE_URL}assets/logo-white.svg`} alt="Leland" style={{ height: 22, width: 'auto' }} />
          </a>
          <div className={`nav-default${scrolled ? ' hidden' : ''}`}>
            <a
              href="https://www.joinleland.com/checkout?bootcampCohort=urn%3AbootcampCohort%3A(urn%3Abootcamp%3A69af7e391104a7bb1cbf5715%2C69af7ea5b3a78d3ad6852270)"
              className="btn btn-primary btn-sm"
              style={{ textTransform: 'uppercase', borderRadius: '4px', fontSize: '12px' }}
            >
              Enroll Now
            </a>
          </div>
          <div className={`nav-tabs${scrolled ? '' : ' hidden'}`}>
            {navSections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`nav-tab${activeSection === s.id ? ' active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                {s.label}
              </a>
            ))}
            <a href="#pricing" className="btn btn-primary btn-sm nav-enroll-btn" onClick={(e) => {
              e.preventDefault()
              document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
            }}>Enroll Now</a>
          </div>
        </div>
      </nav>

      {/* ====== 2. Hero ====== */}
      <section className="hero" id="hero" ref={heroRef}>
        <div className="hero-bg">
          <Squares
            direction="diagonal"
            borderColor="#1a1a1a"
            hoverFillColor="#111111"
            squareSize={40}
            speed={0.5}
          />
        </div>
        <div className="container">
          <Countdown />

          <h1>AI is here.<br />Don't get left behind.</h1>

          <p className="hero-sub">Our mastery program helps you build tools that 100x your output, so you have more time and leverage to pursue what you love.</p>

          <div className="logo-ticker" style={{ marginTop: 24, marginBottom: 64 }}>
            <span className="logo-ticker-label">Taught by experts from places like:</span>
            <Marquee gradient gradientColor="#000000" gradientWidth={80} speed={35}>
              {[...Array(2)].flatMap((_, round) => [
                { file: 'OpenAI Logo 1.svg', alt: 'OpenAI', className: 'logo-ticker-img logo-ticker-lg' },
                { file: 'Spotify Logo 2024.svg', alt: 'Spotify', className: 'logo-ticker-img logo-ticker-lg' },
                { file: 'Fabletics Logo Vector.svg', alt: 'Fabletics', className: 'logo-ticker-img' },
                { file: 'google.svg', alt: 'Google', className: 'logo-ticker-img logo-ticker-lg' },
                { file: 'meta.svg', alt: 'Meta', className: 'logo-ticker-img' },
                { file: 'intiut.svg', alt: 'Intuit', className: 'logo-ticker-img' },
                { file: 'Amazon_logo.svg', alt: 'Amazon', className: 'logo-ticker-img' },
              ].map(({ file, alt, className }) => (
                <img key={`${alt}-${round}`} src={`${import.meta.env.BASE_URL}assets/logos/${file}`} alt={alt} className={className} />
              )))}
            </Marquee>
          </div>

          <div className="track-cards-section" id="courses">
            <h2 className="track-cards-headline">You only know 1% of what's possible</h2>
            <p className="track-cards-subtext">Our 5-course series is designed to take you from someone who uses ChatGPT for one-off tasks to an AI-native builder who runs agentic workflows to accelerate all aspects of their work.</p>
            <div className="track-cards">
              {trackItems.map((item) => (
                <div className={`track-card${item.num === '01' ? ' track-card-featured' : ''}`} key={item.num} onClick={() => document.querySelector(item.href)?.scrollIntoView({ behavior: 'smooth' })}>
                  {item.num === '01' && <div className="track-card-badge">Start Here</div>}
                  <div className="track-card-img"></div>
                  <div className="track-card-body">
                    <div className="track-label">
                      <span className="track-label-text">LEVEL</span>
                      <span className="track-label-num">{item.num}</span>
                    </div>
                    <div className="track-title">{item.name}</div>
                    <div className="track-desc">{item.tagline}</div>
                    <div className="track-tags">
                      <span className="track-tag">3 Weeks</span>
                      <span className="track-tag">6 Sessions</span>
                      {item.seats && <span className="track-tag track-tag-accent">{item.seats} Seats Left!</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====== 3. Problem/Solution — "Why This Course" ====== */}
      <section className="why-section" id="about">
        <div className="container">
          <h2 className="why-headline">Why This Course</h2>
          <div className="why-grid">
            <div className="why-content">
              <div className="why-point">
                <h3>All sessions recorded</h3>
                <p>Attend live or watch on your schedule. Every session is available within 24 hours, so there's no pressure to be there in real time.</p>
              </div>
              <div className="why-point">
                <h3>Retake as much as you want for 1 year</h3>
                <p>Tools change fast. Your enrollment includes a full year of retakes with updated curriculum, so you're always current.</p>
              </div>
              <div className="why-outcome">
                <p>Save 5-10 hours per week and get more time with your family and to do things you love.</p>
              </div>
            </div>
            <div className="why-stat-box">
              <span className="why-stat-number">4+ hrs</span>
              <span className="why-stat-label">saved per week by workers who use AI every day</span>
              <span className="why-stat-source">Source: Federal Reserve Bank of St. Louis</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====== 4. Solution — 3 Value Prop Half-Sections ====== */}
      <section className="value-props-section">
        <div className="container">
          <div className="value-prop-row">
            <div className="value-prop-text">
              <span className="section-label">01</span>
              <h2>Build cutting-edge skills</h2>
              <p>Do more than chat with ChatGPT. We'll help you get ahead, so you're using AI better than your peers. Build workflows, automate tasks, and create tools, not just prompts.</p>
            </div>
            <div className="value-prop-image">
              <img src={`${import.meta.env.BASE_URL}assets/images/value-prop-1.png`} alt="Team working with AI" />
            </div>
          </div>
          <div className="value-prop-row value-prop-row-reversed">
            <div className="value-prop-text">
              <span className="section-label">02</span>
              <h2>Build AI credibility</h2>
              <p>Be the leading voice for AI on your team. Earn a credential your boss and colleagues will notice. Each course includes a verified certificate. Finish all five for the full AI Mastery designation.</p>
            </div>
            <div className="value-prop-image">
              <img src={`${import.meta.env.BASE_URL}assets/images/value-prop-2.png`} alt="Professional working with AI" />
            </div>
          </div>
          <div className="value-prop-row">
            <div className="value-prop-text">
              <span className="section-label">03</span>
              <h2>Build something real</h2>
              <p>You won't just learn theory. You'll build real tools you use at work. Automations, agents, dashboards, and workflows that save you hours every week.</p>
            </div>
            <div className="value-prop-image">
              <img src={`${import.meta.env.BASE_URL}assets/images/value-prop-3.png`} alt="Building with AI" />
            </div>
          </div>
        </div>
      </section>

      {/* ====== 6. Competitor Comparison ====== */}
      <section className="comparison-section">
        <div className="container">
          <h2 className="comparison-headline">How we compare</h2>
          <p className="comparison-subtext">This is a 5-course program designed for knowledge workers, not a single workshop or a 400-hour academic curriculum.</p>
          <div className="comparison-table-wrap">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th></th>
                  <th className="comparison-highlight">Leland AI Mastery</th>
                  <th>eCornell AI 360</th>
                  <th>Agentic AI PM (Maven)</th>
                  <th>Building Agentic AI (Maven)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="comparison-row-label">Price</td>
                  <td className="comparison-highlight"><strong>$999</strong></td>
                  <td>$3,600+</td>
                  <td>$3,000</td>
                  <td>$3,000</td>
                </tr>
                <tr>
                  <td className="comparison-row-label">Time to complete</td>
                  <td className="comparison-highlight">3 weeks</td>
                  <td>420-480 hrs</td>
                  <td>7 weeks</td>
                  <td>Cohort-based</td>
                </tr>
                <tr>
                  <td className="comparison-row-label">Format</td>
                  <td className="comparison-highlight">Hands-on, live</td>
                  <td>24-course curriculum</td>
                  <td>Live cohort</td>
                  <td>Live cohort</td>
                </tr>
                <tr>
                  <td className="comparison-row-label">Level</td>
                  <td className="comparison-highlight">Beginner–Intermediate</td>
                  <td>Comprehensive</td>
                  <td>Advanced</td>
                  <td>Advanced</td>
                </tr>
                <tr>
                  <td className="comparison-row-label">Certification</td>
                  <td className="comparison-highlight">&#10003;</td>
                  <td>&#10003;</td>
                  <td>&#10003;</td>
                  <td>&#10003;</td>
                </tr>
                <tr>
                  <td className="comparison-row-label">Always up to date</td>
                  <td className="comparison-highlight">&#10003;</td>
                  <td>&#10007;</td>
                  <td>&#10007;</td>
                  <td>&#10007;</td>
                </tr>
                <tr>
                  <td className="comparison-row-label">Best course guarantee</td>
                  <td className="comparison-highlight">&#10003;</td>
                  <td>&#10007;</td>
                  <td>&#10007;</td>
                  <td>&#10007;</td>
                </tr>
                <tr>
                  <td className="comparison-row-label">Built for knowledge workers</td>
                  <td className="comparison-highlight">&#10003;</td>
                  <td>&#10007;</td>
                  <td>&#10007;</td>
                  <td>&#10007;</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ====== 7. Price Box (Value Stack) ====== */}
      <section className="value-stack" id="pricing">
        <div className="container">
          <h2 className="value-stack-headline">Everything you get with AI Mastery</h2>
          <div className="value-stack-list">
            <div className="value-stack-item">
              <span className="value-stack-check">&#10003;</span>
              <span className="value-stack-label">12+ hours of live, cohort-based instruction</span>
            </div>
            <div className="value-stack-item">
              <span className="value-stack-check">&#10003;</span>
              <span className="value-stack-label">5+ hands-on deliverables (AI Opportunity Map, Context Templates, Collaboration Protocol, working AI-powered workflow, system blueprints)</span>
            </div>
            <div className="value-stack-item">
              <span className="value-stack-check">&#10003;</span>
              <span className="value-stack-label">Access to private community</span>
            </div>
            <div className="value-stack-item">
              <span className="value-stack-check">&#10003;</span>
              <span className="value-stack-label">Weekly office hours with instructors</span>
            </div>
            <div className="value-stack-item">
              <span className="value-stack-check">&#10003;</span>
              <span className="value-stack-label">Full session recordings</span>
            </div>
            <div className="value-stack-item">
              <span className="value-stack-check">&#10003;</span>
              <span className="value-stack-label">Certification upon completion</span>
            </div>
            <div className="value-stack-item">
              <span className="value-stack-check">&#10003;</span>
              <span className="value-stack-label">Best Course Guarantee, money-back if you find better</span>
            </div>
            <div className="value-stack-item">
              <span className="value-stack-check">&#10003;</span>
              <span className="value-stack-label">Retake for 1 year, always up-to-date curriculum</span>
            </div>
          </div>
          <div className="value-stack-pricing">
            <span className="value-stack-crossed">$2,500+ value</span>
            <span className="value-stack-price">$999</span>
          </div>
          <a href="https://www.joinleland.com/checkout?bootcampCohort=urn%3AbootcampCohort%3A(urn%3Abootcamp%3A69af7e391104a7bb1cbf5715%2C69af7ea5b3a78d3ad6852270)" className="btn btn-primary btn-lg value-stack-cta" style={{ textTransform: 'uppercase' }}>
            Enroll Now
            <span className="arrow">&rarr;</span>
          </a>
          <span className="value-stack-subtext">Payment plans available</span>
        </div>
      </section>

      {/* ====== 8. When & Where ====== */}
      <section className="when-where-section">
        <div className="container">
          <h2>When &amp; Where</h2>
          <div className="when-where-grid">
            <div className="when-where-item">
              <span className="when-where-icon">&#128197;</span>
              <div>
                <h3>Next cohort: April 21</h3>
                <p>New cohorts start regularly. Pick the date that works for you.</p>
              </div>
            </div>
            <div className="when-where-item">
              <span className="when-where-icon">&#128187;</span>
              <div>
                <h3>100% online</h3>
                <p>Attend live or watch recordings. All sessions available within 24 hours.</p>
              </div>
            </div>
            <div className="when-where-item">
              <span className="when-where-icon">&#128338;</span>
              <div>
                <h3>6 live sessions per course</h3>
                <p>Tuesdays &amp; Fridays, 60-90 minutes each. 3 weeks per course.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== 9. 5-Course Program — Collapsible Accordion ====== */}
      <section className="accordion-section" id="course-accordion">
        <div className="container">
          <h2 className="accordion-section-headline">The 5-Course Program</h2>
          <p className="accordion-section-sub">Each course builds on the last. Start wherever matches your level.</p>
          <div className="accordion-list">
            {courses.map((course, i) => (
              <CourseAccordionItem key={course.id} course={course} defaultOpen={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* ====== 10. Instructor Credibility ====== */}
      <section className="instructors-section">
        <div className="container">
          <h2>Meet the Instructors</h2>
          <div className="instructors-grid">
            <div className="instructor-card">
              <img className="instructor-photo-img" src={`${import.meta.env.BASE_URL}assets/instructors/kristen-h.jpg`} alt="Kristen H." />
              <h3>Kristen H.</h3>
              <span className="instructor-role">Lead Instructor</span>
              <p>AI-native builder who's taught dozens of non-technical professionals how to transform their work with AI.</p>
            </div>
            <div className="instructor-card">
              <img className="instructor-photo-img" src={`${import.meta.env.BASE_URL}assets/instructors/andrew-q.jpg`} alt="Andrew Q." />
              <h3>Andrew Q.</h3>
              <span className="instructor-role">Ex-OpenAI</span>
              <p>Expert in helping you build a custom AI stack that compounds.</p>
            </div>
            <div className="instructor-card">
              <img className="instructor-photo-img" src={`${import.meta.env.BASE_URL}assets/instructors/dessy-k.jpg`} alt="Dessy K." />
              <h3>Dessy K.</h3>
              <span className="instructor-role">TikTok Head of Product</span>
              <p>Expert at vibecoding and using AI to grow companies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== 11. Meet with an Advisor ====== */}
      <section className="advisor-section">
        <div className="container">
          <div className="advisor-card">
            <h2>Not sure which course is right for you?</h2>
            <p>Book a free call with an advisor to find the right fit.</p>
            <a href="https://joinleland.typeform.com/to/a4DMXJjV#" className="btn btn-primary btn-lg" style={{ textTransform: 'uppercase' }}>
              Schedule a Call
              <span className="arrow">&rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* ====== 12. Enterprise / For Teams ====== */}
      <section className="enterprise" id="enterprise">
        <div className="container">
          <div className="enterprise-card">
            <div className="enterprise-card-content">
              <h2>For Teams</h2>
              <p className="enterprise-desc">
                Train your team on AI. See ROI in weeks. We work with companies from 10-person startups to Fortune 500 to design custom AI training programs. Volume pricing, custom use cases, dedicated support.
              </p>
              <div className="enterprise-bottom">
                <ul className="enterprise-points">
                  <li><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1h3v1H2v2H1V1zM10 1h3v3h-1V2h-2V1zM1 10v3h3v-1H2v-2H1zM13 10v3h-3v-1h2v-2h1z" fill="currentColor"/><rect x="5" y="5" width="4" height="4" fill="currentColor"/></svg> Team licenses from 5 seats</li>
                  <li><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="1" width="10" height="3" fill="currentColor"/><rect x="2" y="5.5" width="10" height="3" fill="currentColor"/><rect x="2" y="10" width="10" height="3" fill="currentColor"/></svg> Custom workshops available</li>
                  <li><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="5" y="1" width="4" height="4" fill="currentColor"/><rect x="3" y="6" width="8" height="2" fill="currentColor"/><rect x="1" y="9" width="12" height="4" fill="currentColor"/></svg> Dedicated account manager</li>
                </ul>
                <a href="mailto:teams@joinleland.com" className="btn btn-primary btn-lg">
                  Talk to Our Team
                  <span className="arrow">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====== 13. Guarantees ====== */}
      <section className="guarantees-section">
        <div className="container">
          <div className="guarantees-grid">
            <div className="guarantee-card">
              <h3>Best Course Guarantee</h3>
              <p>Complete our course, then take a competitor's course and complete it too. If you think theirs was better, we'll refund you up to the value of that course. We're that confident in the quality.</p>
            </div>
            <div className="guarantee-card">
              <h3>Retake for 1 Year</h3>
              <p>Retake any course for a full year. Curriculum updates as tools change, so you're always current. It's not just a refresher, it's new content every time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====== 14. FAQ ====== */}
      <section className="faq" id="faq">
        <div className="container">
          <div className="faq-header">
            <h2>Frequently Asked Questions</h2>
          </div>

          <div className="faq-grid">
            {faqs.map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ====== 15. Footer Social Proof — Testimonials + Enroll CTA ====== */}
      <section className="testimonials-section" id="testimonials">
        <div className="container">
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <StarRow />
              <p className="testimonial-quote">&ldquo;AI used to feel overwhelming and too complicated. This course broke it down in a way that finally made sense. I walked away with real tools I use every day.&rdquo;</p>
              <span className="testimonial-author">Chimerika A.</span>
            </div>
            <div className="testimonial-card">
              <StarRow />
              <p className="testimonial-quote">&ldquo;You couldn't make this box long enough for me to describe what I got out of this program. The live instruction, the hands-on projects, the community. It completely changed how I work.&rdquo;</p>
              <span className="testimonial-author">Christina G.</span>
            </div>
            <div className="testimonial-card">
              <StarRow />
              <p className="testimonial-quote">&ldquo;From learning how to prompt, vibe coding an app, to building AI agents, this series took me from curious to competent in weeks. Best investment in my career this year.&rdquo;</p>
              <span className="testimonial-author">Caroline D.</span>
            </div>
          </div>
          <div className="testimonials-cta">
            <a href="#pricing" className="btn btn-primary btn-lg" style={{ textTransform: 'uppercase' }} onClick={(e) => {
              e.preventDefault()
              document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
            }}>
              Enroll Now
              <span className="arrow">&rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* ====== 16. Footer ====== */}
      <footer>
        <div className="container">
          <p>&copy; 2026 <a href="https://www.joinleland.com">Leland</a>. All rights reserved.</p>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <div className="sticky-cta" style={{ display: showSticky ? 'block' : 'none' }}>
        <div className="container">
          <div>
            <div className="sticky-text">AI Mastery Series</div>
            <div className="sticky-sub">Next cohort: April 21</div>
          </div>
          <a href="#courses" className="btn btn-primary btn-sm">
            Explore Courses
            <span className="arrow">&rarr;</span>
          </a>
        </div>
      </div>
    </>
  )
}

export default App
