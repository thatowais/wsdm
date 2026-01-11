import { useState } from 'react';
import { ArrowRight, Lightbulb, BookOpen, Brain, ArrowUpRight, Shield, Github, ChevronDown, ChevronUp, HardDrive, Cloud } from 'lucide-react';
import { Link } from 'react-router-dom';


interface LandingPageProps {
  onLogin: () => void;
  onGuestLogin: () => void;
}

const FAQS = [
  {
    question: "How do I know if this is for me?",
    answer: "If you only take notes once and never revisit them, or you just want a place to dump information, this probably isnt for you. wsdm is best for people who want their ideas to grow into something beyond themselves."
  },
  {
    question: "Is my data secure?",
    answer: "Yes! wsdm prioritizes your privacy. Your notes are stored locally in your browser by default. If you choose to sign in with Google, your notes are stored in your own Google Drive. wsdm does not store your data on any servers."
  },
  {
    question: "How is this different, really?",
    answer: "Most tools help you write things down. This helps you think with what you’ve written. The emphasis isn’t on folders, tags, or volume; it’s on creating a system where ideas can connect, evolve, and teach you something later."
  },
  {
    question: "Why Zettelkasten specifically?",
    answer: "It treats notes as living things, not documents. Each note exists in relation to others, which makes the system grow more useful the longer you use it."
  }
];

export default function LandingPage({ onLogin, onGuestLogin }: LandingPageProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 font-sans">
        <header className="px-6 py-4 flex justify-between items-center max-w-7xl mx-auto w-full">
          <h1 className="text-2xl font-normal font-['Instrument_Serif'] text-gray-900">wsdm</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={onGuestLogin}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-transparent border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Sign in as Guest
            </button>
            <button
              onClick={onLogin}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>
            <button
              onClick={onLogin}
              className="sm:hidden inline-flex items-center justify-center p-2 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Sign in with Google"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </button>
          </div>
        </header>

        <section className="px-6 py-24 sm:py-32 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#fff1f2_0%,transparent_100%)] opacity-70" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#ede9fe_0%,transparent_100%)] opacity-70" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#e0f2fe_0%,transparent_100%)] opacity-70" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-white/50" />
          </div>
          <div className="max-w-7xl mx-auto relative text-center">
            <h1 className="text-5xl sm:text-7xl font-normal text-gray-900 mb-8 font-['Instrument_Serif'] leading-tight">
              Writing Notes Is Easy
              <br />
              <span className="italic">Building Knowledge Isn’t</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              For people who expect their notes to stay useful, to resurface, recombine, and inform future thinking.
            </p>
            <button
              onClick={onLogin}
              className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-white bg-black rounded-lg hover:bg-gray-900 transition-all hover:scale-105 shadow-lg"
            >
              Get Started
              <ArrowRight size={18} />
            </button>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl font-normal font-['Instrument_Serif'] text-gray-900 mb-16 text-center">
              For Notes That <span className="italic">Expect a Future</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Feature 1: Note Types (Large, spans 2 columns) */}
              <div className="md:col-span-2 bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
                <div className="h-full flex flex-col">
                  <div className="mb-8">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 text-blue-600">
                      <Brain size={24} />
                    </div>
                    <h3 className="text-2xl font-medium text-gray-900 mb-2">Structured Thinking</h3>
                    <p className="text-gray-600">A system that respects the natural lifecycle of an idea: capture it, challenge it, then let it mature. The framework is inspired by the Zettelkasten note-taking system.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-auto">
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-2 text-orange-600">
                        <Lightbulb size={18} />
                        <span className="font-medium text-sm">Fleeting</span>
                      </div>
                      <p className="text-xs text-gray-500">For half-formed ideas, shower thoughts, and sparks that aren’t ready yet.</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-2 text-green-600">
                        <BookOpen size={18} />
                        <span className="font-medium text-sm">Literature</span>
                      </div>
                      <p className="text-xs text-gray-500">For external ideas that inspire you.</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-2 text-blue-600">
                        <Brain size={18} />
                        <span className="font-medium text-sm">Permanent</span>
                      </div>
                      <p className="text-xs text-gray-500">Where external ideas are translated into your own words and connect to others.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 2: Privacy (Medium) */}
              {/* Feature 2: Privacy (Medium) - Redesigned */}
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-lg transition-all relative overflow-hidden group">
                {/* Background Watermark */}
                <div className="absolute -right-8 -bottom-8 text-emerald-100/50 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500">
                  <Shield size={200} />
                </div>

                <div className="relative z-10">
                  <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 text-emerald-600 shadow-sm border border-emerald-100">
                    <Shield size={24} />
                  </div>

                  <h3 className="text-2xl font-medium text-gray-900 mb-2">Private by Default</h3>
                  <p className="text-gray-600 mb-6 max-w-sm">
                    Your thinking belongs to you. No accounts required, no data harvested, no servers holding your ideas hostage.
                  </p>

                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-emerald-100/50 shadow-sm group-hover:translate-x-1 transition-transform">
                      <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                        <HardDrive size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Local Storage</div>
                        <div className="text-xs text-emerald-600">Fast, local, and entirely under your control.</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-emerald-100/50 shadow-sm group-hover:translate-x-1 transition-transform delay-75">
                      <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <Cloud size={18} />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">Google Drive</div>
                        <div className="text-xs text-blue-600">Sync across devices without giving up ownership.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature 3: Open Source (Medium) */}
              <div className="bg-gray-900 rounded-3xl p-8 border border-gray-800 text-white hover:shadow-md transition-shadow md:col-span-1">
                <div className="w-12 h-12 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 text-white">
                  <Github size={24} />
                </div>
                <h3 className="text-2xl font-medium mb-2">Open Source</h3>
                <p className="text-gray-400 mb-6">
                  Transparent, community-driven, and free forever. Released under the GNU GPL license. Inspect the code, contribute, or host it yourself.
                </p>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-gray-300 transition-colors"
                >
                  View on GitHub <ArrowUpRight size={16} />
                </a>
              </div>

              {/* Feature 4: Graph View (Large, spans 2 columns) */}
              <div className="md:col-span-2 bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:shadow-md transition-shadow overflow-hidden relative group">
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 text-purple-600">
                    <Brain size={24} />
                  </div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-2">Visual Knowledge Graph</h3>
                  <p className="text-gray-600 max-w-md">
                    A living map of your ideas as they intersect, cluster, and drift over time. Explore how notes relate to each other instead of hunting through folders.
                  </p>
                </div>
                {/* Decorative Graph Background */}
                <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <svg width="100%" height="100%" viewBox="0 0 200 200">
                    <circle cx="150" cy="50" r="4" fill="currentColor" />
                    <circle cx="100" cy="100" r="4" fill="currentColor" />
                    <circle cx="180" cy="120" r="4" fill="currentColor" />
                    <circle cx="50" cy="150" r="4" fill="currentColor" />
                    <line x1="150" y1="50" x2="100" y2="100" stroke="currentColor" strokeWidth="1" />
                    <line x1="100" y1="100" x2="180" y2="120" stroke="currentColor" strokeWidth="1" />
                    <line x1="100" y1="100" x2="50" y2="150" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-4xl font-normal font-['Instrument_Serif'] text-gray-900 mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {FAQS.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-200"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    {openFaqIndex === index ? (
                      <ChevronUp size={20} className="text-gray-500" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-500" />
                    )}
                  </button>
                  {openFaqIndex === index && (
                    <div className="px-6 pb-4 text-gray-600 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="py-12 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-8">
              <div>
                <div className="text-gray-900 font-['Instrument_Serif'] text-2xl mb-2">wsdm</div>
                <p className="text-gray-500 text-sm max-w-xs">
                  A minimal, open-source tool for thought. Build your second brain with privacy and simplicity.
                </p>
              </div>

              <div className="flex flex-wrap gap-8">
                <div className="flex flex-col gap-2">
                  <h3 className="font-medium text-gray-900 text-sm">Product</h3>
                  <a href="#" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Features</a>
                  <Link to="/roadmap" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Roadmap</Link>
                  <Link to="/about" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">About</Link>
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">GitHub</a>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-medium text-gray-900 text-sm">Legal</h3>
                  <Link to="/privacy" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Privacy Policy</Link>
                  <Link to="/terms" className="text-gray-500 hover:text-gray-900 text-sm transition-colors">Terms & Conditions</Link>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-500 text-sm">
                wsdm is open source software licensed under the GNU GPL.
              </div>
              <div className="text-gray-500 text-sm">
                Created by{' '}
                <a
                  href="https://www.instagram.com/thatowais/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-900 hover:text-gray-700 transition-colors font-medium"
                >
                  thatowais
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}