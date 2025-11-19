import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import logo from '../../assets/Logo4.png';

const stats = [
    { label: 'Assignments Evaluated', value: '480K+', trend: '+12% this month' },
    { label: 'Average Grading Time', value: '3.2 min', trend: '-78% vs manual' },
    { label: 'AI-Detected Cheating', value: '2,140', trend: 'flagged & zeroed automatically' },
];

const features = [
    {
        icon: 'fa-robot',
        title: 'RAG + Gemini Scoring',
        description: 'Compare submissions against faculty reference packs using retrieval-augmented evaluation and Groq reasoning.'
    },
    {
        icon: 'fa-pen-nib',
        title: 'Handwritten Intelligence',
        description: 'DeepSeek OCR validates handwritten uploads and rejects typed responses when handwriting is required.'
    },
    {
        icon: 'fa-database',
        title: 'Pinecone Similarity',
        description: 'FAISS-grade searches via Pinecone instantly surface cross-student plagiarism with contextual evidence.'
    },
    {
        icon: 'fa-bell',
        title: 'Smart Alerts',
        description: 'Real-time email + dashboard updates on submissions, suspicious matches, and grading progress.'
    },
    {
        icon: 'fa-chart-pie',
        title: 'Role-Based Dashboards',
        description: 'Faculty, students, and admins each get tailored analytics and workflows without extra clicks.'
    },
    {
        icon: 'fa-lock',
        title: 'Secure By Design',
        description: 'Firebase storage, signed URLs, and strict auth keep every submission safe end-to-end.'
    }
];

const workflowSteps = [
    { title: 'Upload & Configure', detail: 'Faculty drop a PDF, toggle "Handwritten Required", attach reference material, and launch.' },
    { title: 'Students Submit', detail: 'Learners upload scanned work; OCR + embeddings run automatically in the background.' },
    { title: 'AI Evaluates', detail: 'RAG grading, plagiarism checks, and handwriting validation complete within minutes.' },
    { title: 'Insights & Feedback', detail: 'Grades sync to dashboards, zeroed cheaters get notified, and faculty can override anytime.' }
];

const LandingPage = () => {
    return (
        <div className="landing-container">
            <header className="landing-header">
                <div className="landing-logo">
                    <img src={logo} alt="AI Evaluation Logo" />
                    <span>AI Evaluation</span>
                </div>
                <nav className="landing-nav">
                    <a href="#features">Features</a>
                    <a href="#workflow">Workflow</a>
                    <a href="#demo">Demo</a>
                </nav>
                <Link to="/login" className="login-button">
                    Launch App <i className="fas fa-arrow-right ms-2"></i>
                </Link>
            </header>

            <main className="landing-main">
                <section className="hero-section">
                    <div className="hero-content">
                        <span className="hero-pill">
                            <i className="fas fa-sparkles"></i>
                            New: Handwritten verification + Pinecone similarity
                        </span>
                        <h1>Grade smarter with AI that understands every submission.</h1>
                        <p>
                            Our end-to-end evaluation stack ingests PDFs, performs Gemini embeddings, runs RAG grading,
                            and flags plagiarism instantly. Educators stay in control while students get transparent, fast feedback.
                        </p>
                        <div className="cta-group">
                            <Link to="/login" className="btn-primary">
                                Get Started
                                <i className="fas fa-arrow-right"></i>
                            </Link>
                            <a href="#demo" className="btn-secondary">
                                Watch Demo
                                <i className="fas fa-play"></i>
                            </a>
                        </div>
                        <div className="hero-metrics">
                            {stats.map((stat) => (
                                <div key={stat.label} className="metric-card">
                                    <div className="metric-value">{stat.value}</div>
                                    <div className="metric-label">{stat.label}</div>
                                    <span className="metric-trend">{stat.trend}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="hero-preview">
                        <div className="preview-card glass-card">
                            <div className="preview-heading">
                                <span>Live Assignment</span>
                                <strong>Data Structures Lab</strong>
                            </div>
                            <div className="preview-chart">
                                {['Originality', 'Handwriting', 'RAG Score', 'Feedback Ready'].map((label, idx) => (
                                    <div key={label} className="preview-bar">
                                        <div className="preview-bar-label">{label}</div>
                                        <div className="preview-bar-track">
                                            <div
                                                className="preview-bar-fill"
                                                style={{ width: `${85 - idx * 12}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="preview-tags">
                                <span><i className="fas fa-pen"></i> Handwritten Verified</span>
                                <span><i className="fas fa-shield-alt"></i> Plagiarism Clear</span>
                            </div>
                        </div>
                        <div className="preview-card status-card">
                            <h4>Today&apos;s Pulse</h4>
                            <ul>
                                <li><span>26</span> submissions auto-graded</li>
                                <li><span>3</span> plagiarism matches zeroed</li>
                                <li><span>12</span> handwritten scans awaiting review</li>
                            </ul>
                            <p>Faculty get notified instantly when AI spots suspicious work.</p>
                        </div>
                    </div>
                </section>

                <section id="features" className="section feature-section">
                    <div className="section-head">
                        <span>Core capabilities</span>
                        <h2>Everything faculty & students need in one workspace.</h2>
                        <p>Modular microservices keep grading resilient while the UI stays delightfully simple.</p>
                    </div>
                    <div className="feature-grid">
                        {features.map((feature) => (
                            <div key={feature.title} className="feature-card interactive-card">
                                <div className="feature-icon">
                                    <i className={`fas ${feature.icon}`}></i>
                                </div>
                                <h3>{feature.title}</h3>
                                <p>{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="workflow" className="section workflow-section">
                    <div className="section-head">
                        <span>Workflow</span>
                        <h2>From upload to insights in under five minutes.</h2>
                    </div>
                    <div className="workflow-steps">
                        {workflowSteps.map((step, index) => (
                            <div key={step.title} className="workflow-step">
                                <div className="step-index">{index + 1}</div>
                                <div>
                                    <h4>{step.title}</h4>
                                    <p>{step.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="demo" className="section demo-section">
                    <div className="demo-content">
                        <div>
                            <span className="hero-pill subtle">See it in action</span>
                            <h2>Interactive landing + dashboards your team will love.</h2>
                            <p>
                                The platform ships with role-based layouts, drag-and-drop uploads, real-time plagiarism alerts,
                                and a polished onboarding flow. No more clunky portals—just click “Launch App” to explore.
                            </p>
                            <div className="cta-group">
                                <Link to="/login" className="btn-primary">Launch App</Link>
                                <a
                                    href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-secondary"
                                >
                                    Play Full Demo
                                </a>
                            </div>
                        </div>
                        <div className="demo-preview">
                            <div className="demo-screen">
                                <div className="demo-toolbar">
                                    <span className="dot red"></span>
                                    <span className="dot yellow"></span>
                                    <span className="dot green"></span>
                                </div>
                                <div className="demo-body">
                                    <div className="demo-card">
                                        <span>Faculty Snapshot</span>
                                        <strong>92%</strong>
                                        <p>Submissions graded in the last 24h</p>
                                    </div>
                                    <div className="demo-card">
                                        <span>Handwritten Compliance</span>
                                        <strong>87%</strong>
                                        <p>Detected as handwritten when required</p>
                                    </div>
                                    <div className="demo-card">
                                        <span>AI Zeroed</span>
                                        <strong>3</strong>
                                        <p>Flagged & auto-notified today</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="landing-footer">
                <div className="footer-content">
                    <div className="footer-section">
                        <div className="footer-logo">
                            <img src={logo} alt="Logo" />
                            <span>AI Evaluation</span>
                        </div>
                        <p className="footer-description">
                            Transforming education through AI-powered assessment and evaluation solutions.
                        </p>
                    </div>

                    <div className="footer-section">
                        <h4 className="text-white font-semibold mb-2">Quick Links</h4>
                        <div className="footer-links">
                            <a href="#features">
                                <i className="fas fa-bolt"></i>
                                Features
                            </a>
                            <a href="#workflow">
                                <i className="fas fa-route"></i>
                                Workflow
                            </a>
                            <Link to="/login">
                                <i className="fas fa-sign-in-alt"></i>
                                Login
                            </Link>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4 className="text-white font-semibold mb-2">Contact</h4>
                        <div className="footer-links">
                            <a href="mailto:contact@aievaluation.com">
                                <i className="fas fa-envelope"></i>
                                contact@aievaluation.com
                            </a>
                            <a href="tel:+1234567890">
                                <i className="fas fa-phone"></i>
                                +1 (234) 567-890
                            </a>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4 className="text-white font-semibold mb-2">Follow Us</h4>
                        <div className="social-links">
                            <a href="#" className="social-link">
                                <i className="fab fa-twitter"></i>
                            </a>
                            <a href="#" className="social-link">
                                <i className="fab fa-linkedin-in"></i>
                            </a>
                            <a href="#" className="social-link">
                                <i className="fab fa-instagram"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} AI Evaluation Platform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;