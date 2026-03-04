import React, { useState, useEffect, useRef } from 'react'
// import PrismaticBurst from './components/PrismaticBurst'

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
  <svg className="faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
    <div className={`faq-item${open ? ' open' : ''}`}>
      <div className="faq-q" onClick={() => setOpen(!open)}>
        <h3><span style={{ color: 'var(--text-muted)', marginRight: 8 }}>faq[{index}]</span>{question}</h3>
        <ChevronIcon />
      </div>
      <div className="faq-a">
        <p dangerouslySetInnerHTML={{ __html: answer }} />
      </div>
    </div>
  )
}

function CourseScreenshot({ text }) {
  return (
    <div className="course-screenshot">
      <div>
        <div className="dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        {text}
      </div>
    </div>
  )
}

function CourseSection({ id, num, type, title, tagline, tags, roi, roiSource, cohorts, screenshot, reversed }) {
  return (
    <section className="course-section" id={id}>
      <div className="container">
        <div className={`course-layout${reversed ? ' reversed' : ''}`}>
          <div className="course-content">
            <div className="course-label">
              <span>LEVEL</span>
              <span className="num">{num}</span>
            </div>
            <h2>{title}</h2>
            <p className="course-tagline">{tagline}</p>
            <div className="course-audience">
              {tags.map((tag, i) => (
                <span className="tag" key={i}>{tag}</span>
              ))}
            </div>
            <div className="course-roi">
              <p>&ldquo;{roi}&rdquo;</p>
              <div className="source">{roiSource}</div>
            </div>
            <div className="course-cta-group">
              {cohorts.map((cohort, i) => (
                <a href="#" className={`btn ${i === 0 ? 'btn-primary' : 'btn-secondary'}`} key={i}>
                  {cohort.label}
                  <span className="arrow">&rarr;</span>
                </a>
              ))}
            </div>
          </div>
          <CourseScreenshot text={screenshot} />
        </div>
      </div>
    </section>
  )
}

function App() {
  const heroRef = useRef(null)
  const [showSticky, setShowSticky] = useState(false)

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return
    const observer = new IntersectionObserver((entries) => {
      if (window.innerWidth <= 768) {
        setShowSticky(!entries[0].isIntersecting)
      }
    }, { threshold: 0 })
    observer.observe(hero)
    return () => observer.disconnect()
  }, [])

  const courses = [
    {
      id: 'course-1', num: '01', type: 'LIVE COURSE',
      title: 'Foundations',
      tagline: "Understand what's possible with AI and start using it today. Best for knowledge workers new to AI, professionals building a foundation, and teams preparing for the series.",
      tags: ['Tuesdays and Fridays', '3 Weeks'],
      roi: 'Workers with AI skills earn a 56% wage premium over peers in the same role without them.',
      roiSource: 'PwC, 2025',
      cohorts: [
        { date: 'April 21', label: 'Enroll — April 21' },
        { date: 'May 19', label: 'Enroll — May 19' },
        { date: 'June 16', label: 'Enroll — June 16' },
      ],
      screenshot: 'Foundations: AI fluency, prompt engineering, tool selection',
      reversed: false,
    },
    {
      id: 'course-2', num: '02', type: 'BOOTCAMP',
      title: 'Intelligent Automation',
      tagline: 'Make AI work for you. Automate the tasks eating your week. Best for operators and managers, anyone with repetitive workflows, and professionals who want measurable time back.',
      tags: ['Tuesdays and Fridays', '3 Weeks'],
      roi: 'AI-powered automation can reduce task completion time by up to 70%.',
      roiSource: 'McKinsey, 2024',
      cohorts: [
        { date: 'April 21', label: 'Enroll — April 21' },
        { date: 'May 19', label: 'Enroll — May 19' },
      ],
      screenshot: 'Automation: workflow mapping, trigger design, integration',
      reversed: true,
    },
    {
      id: 'course-3', num: '03', type: 'LIVE COURSE',
      title: 'Agentic Workflows',
      tagline: 'Build AI agents that plan, decide, and execute without babysitting. Best for technical professionals, product builders, and anyone ready to go beyond prompts.',
      tags: ['Tuesdays and Fridays', '3 Weeks'],
      roi: 'Agentic AI is projected to handle 15% of day-to-day work decisions by 2028.',
      roiSource: 'Gartner, 2025',
      cohorts: [
        { date: 'May 19', label: 'Enroll — May 19' },
      ],
      screenshot: 'Agents: multi-step reasoning, tool use, autonomous execution',
      reversed: false,
    },
    {
      id: 'course-4', num: '04', type: 'BOOTCAMP',
      title: 'AI Systems Design',
      tagline: 'Design AI-powered systems that scale across your org. Best for team leads and architects, operations and strategy, and professionals designing org-level AI.',
      tags: ['Tuesdays and Fridays', '3 Weeks'],
      roi: 'Companies with structured AI deployment see 3x faster ROI than those using AI ad hoc.',
      roiSource: 'Harvard Business Review, 2024',
      cohorts: [
        { date: 'June 16', label: 'Enroll — June 16' },
      ],
      screenshot: 'Systems: architecture patterns, governance, org-wide deployment',
      reversed: true,
    },
    {
      id: 'course-5', num: '05', type: 'LIVE COURSE',
      title: 'Advanced AI Architecture',
      tagline: 'Orchestrate multi-agent systems and enterprise-grade AI infrastructure. Best for senior technical leaders, AI/ML engineers, and enterprise architects.',
      tags: ['Tuesdays and Fridays', '3 Weeks'],
      roi: 'Organizations deploying multi-agent systems report 40% improvement in complex workflow efficiency.',
      roiSource: 'Deloitte, 2025',
      cohorts: [
        { date: 'July 14', label: 'Enroll — July 14' },
      ],
      screenshot: 'Architecture: multi-agent orchestration, RAG, enterprise infra',
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
  ]

  const testimonials = [
    {
      headline: 'I automated 6 hours of weekly reporting in the first week.',
      quote: 'My manager asked how I did it. The automation module alone paid for the entire course. I went from copying data between spreadsheets to having AI handle the entire pipeline while I focus on analysis.',
      initials: 'SK', name: 'Sarah K.', role: 'Operations Lead',
    },
    {
      headline: "This wasn't another 'intro to ChatGPT' course.",
      quote: 'I built real systems I still use every day. The agentic workflows module changed how I think about product development entirely. We shipped a feature in 2 days that would have taken 2 weeks before.',
      initials: 'MT', name: 'Marcus T.', role: 'Product Manager',
    },
    {
      headline: 'Zero to agentic workflows in production within a month.',
      quote: 'Our team went from no AI adoption to running agentic workflows in production. The systems design course gave us the architecture to do it right. Best investment our engineering org made this year.',
      initials: 'RL', name: 'Rachel L.', role: 'Director of Engineering',
    },
  ]

  const trackItems = [
    { num: '01', name: 'Learn Foundations', tagline: "Understand what's possible with AI and start using it today.", href: '#course-1' },
    { num: '02', name: 'Intelligent Automation', tagline: 'Make AI work for you. Automate the tasks eating your week.', href: '#course-2' },
    { num: '03', name: 'Agentic Workflows', tagline: 'Build AI agents that plan, decide, and execute without babysitting.', href: '#course-3' },
    { num: '04', name: 'AI Systems Design', tagline: 'Design AI-powered systems that scale across your org.', href: '#course-4' },
    { num: '05', name: 'Advanced AI Architecture', tagline: 'Orchestrate multi-agent systems and enterprise-grade AI infrastructure.', href: '#course-5' },
  ]

  return (
    <>
      {/* Navigation */}
      <nav>
        <div className="container">
          <a href="https://www.joinleland.com" className="logo">
            <img src="/assets/logo-white.svg" alt="Leland" style={{ height: 22, width: 'auto' }} />
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
            <a href="#courses" className="btn btn-secondary btn-sm" style={{ borderRight: 'none' }}>Explore Courses</a>
            <a href="#enterprise" className="btn btn-primary btn-sm">Enroll</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="hero" ref={heroRef}>
        <div className="container">
          <Countdown />

          <h1>Become a top 1% AI user</h1>

          <p className="hero-sub">Our five-course series is designed to help any knowledge worker 100x their output with an AI-first approach.</p>

          <div className="hero-grid" id="courses">
            <div className="proof-bar">
              <div><span className="star">&#9733;</span> <span className="rating">4.9/5</span> AVERAGE RATING</div>
              <div>COHORT-BASED LIVE INSTRUCTION</div>
              <div>
                <svg className="proof-icon" width="14" height="14" viewBox="0 0 24 24" fill="var(--accent)" stroke="none">
                  <rect x="2" y="5" width="14" height="14" rx="0"/>
                  <polygon points="18,7 23,4 23,20 18,17"/>
                </svg>
                RECORDED
              </div>
            </div>
            <div className="modules-row">
              <div className="modules-label">MODULES</div>
              <div className="modules-cells">
                {trackItems.map((item) => (
                  <a href={item.href} className="track-item" key={item.num}>
                    <div className="track-label">
                      <span className="track-label-text">LEVEL</span>
                      <span className="track-label-num">{item.num}</span>
                    </div>
                    <div className="track-title">{item.name}</div>
                    <div className="track-desc">{item.tagline}</div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Sections */}
      {courses.map((course) => (
        <CourseSection key={course.id} {...course} />
      ))}

      {/* Enterprise Section */}
      <section className="enterprise" id="enterprise">
        <div className="container">
          <div className="section-label">// 06 &mdash; teams</div>
          <h2>For Teams</h2>
          <p className="section-intro">Train your team on AI. See ROI in weeks.</p>
          <p style={{ color: 'var(--text-tertiary)', marginTop: 12, fontSize: '0.85rem' }}>
            We work with companies from 10-person startups to Fortune 500 to design custom AI training programs. Volume pricing, custom use cases, dedicated support.
          </p>

          <div className="enterprise-grid">
            <div className="enterprise-points">
              <div className="ent-point">
                <div className="ent-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="1"/>
                    <circle cx="19" cy="12" r="1"/>
                    <circle cx="5" cy="12" r="1"/>
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </div>
                <div>
                  <h4>Team licenses from 5 seats</h4>
                  <p>Enroll your team together. Volume discounts start at 5 seats.</p>
                </div>
              </div>

              <div className="ent-point">
                <div className="ent-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <div>
                  <h4>Custom workshops available</h4>
                  <p>We tailor curriculum to your team&apos;s tools, workflows, and industry.</p>
                </div>
              </div>

              <div className="ent-point">
                <div className="ent-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div>
                  <h4>Dedicated account manager</h4>
                  <p>A single point of contact for onboarding, scheduling, and support.</p>
                </div>
              </div>
            </div>

            <div className="enterprise-visual">
              <div>
                Dashboard showing team progress, completion rates, and ROI metrics
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <a href="mailto:teams@joinleland.com" className="btn btn-primary btn-lg">
              Talk to Our Team
              <span className="arrow">&rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="section-label">// 07 &mdash; testimonials</div>
          <h2>What People Say</h2>
          <p className="section-intro">Results that speak for themselves.</p>

          <div className="testimonial-grid">
            {testimonials.map((t, i) => (
              <div className="testimonial-card" key={i}>
                <StarRow />
                <p className="review-headline">{t.headline}</p>
                <blockquote>{t.quote}</blockquote>
                <div className="author">
                  <div className="avatar">{t.initials}</div>
                  <div>
                    <div className="name">{t.name}</div>
                    <div className="role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq">
        <div className="container">
          <div className="section-label" style={{ textAlign: 'center' }}>// 08 &mdash; faq</div>
          <h2 style={{ textAlign: 'center' }}>Questions</h2>
          <p className="section-intro" style={{ textAlign: 'center' }}>Frequently asked questions.</p>

          <div className="faq-list">
            {faqs.map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="final-cta">
        <div className="container">
          <h2>Start building with AI.</h2>
          <p>The next cohort begins April 21. Spots are limited.</p>
          <div className="cta-row">
            <a href="#courses" className="btn btn-primary btn-lg">
              Enroll Now
              <span className="arrow">&rarr;</span>
            </a>
            <a href="#enterprise" className="btn btn-secondary btn-lg">
              Train Your Team
              <span className="arrow">&rarr;</span>
            </a>
          </div>
        </div>
      </section>

      {/* Sources */}
      <div className="sources">
        <p>1 PwC, &ldquo;AI Jobs Barometer: Global Report,&rdquo; 2025.</p>
        <p>2 McKinsey &amp; Company, &ldquo;The State of AI in 2024: Gen AI Adoption and Impact,&rdquo; 2024.</p>
        <p>3 Gartner, &ldquo;Top Strategic Technology Trends for 2025: Agentic AI,&rdquo; 2025.</p>
        <p>4 Harvard Business Review, &ldquo;How Companies Are Getting AI Deployment Right,&rdquo; 2024.</p>
        <p>5 Deloitte, &ldquo;Enterprise AI Trends: Multi-Agent Systems in Practice,&rdquo; 2025.</p>
      </div>

      {/* Footer */}
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
