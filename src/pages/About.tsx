import { ArrowLeft, Github, Globe, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
    return (
        <div className="min-h-screen bg-white font-sans">
            <header className="px-6 py-4 flex items-center max-w-4xl mx-auto w-full">
                <Link to="/" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="max-w-2xl">
                    <h1 className="text-5xl font-normal font-['Instrument_Serif'] text-gray-900 mb-8">
                        About wsdm
                    </h1>

                    <p className="text-gray-600 mb-4 leading-relaxed">
                        I made wsdm because I could'nt find a note taking app that conveniently let
                        me create a zettelkasten system. I needed something I could ignore. For it to just work
                        so I can work. No distractions, bells and whistles and i wanted my data to be my data.
                    </p>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                        Modern note-taking tools optimize for capture, because capture is easy to sell.
                        But thinking doesn’t happen at the moment of capture.
                        It happens later; when ideas collide, contradict, and resurface at the wrong moment.
                    </p>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                        I believe a note that never changes you was never worth writing.
                        And a system that doesn’t force ideas to meet is just a prettier archive.
                    </p>
                    <p className="text-gray-600 mb-12 leading-relaxed">
                        wsdm is for people who expect their thoughts to fight back.
                    </p>

                    <div className="space-y-12">
                        <section>
                            <h2 className="text-2xl font-medium text-gray-900 mb-4">How it works</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                wsdm doesn’t optimize for neatness.
                                It optimizes for friction, return, and reuse.
                                Designs for revisiting, because memory is associative, not hierarchical.
                                Keeps everything local, private, and open-source because your thinking should never be held hostage by a tool,
                                sold to a company, or God forbid; something stupid like being used to train a AI model.

                                The system is intentionally uncomfortable for people who want closure.
                                It rewards those who are willing to come back, rethink, and change their mind.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-medium text-gray-900 mb-4">Open Source</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                Wsdm is completely open source. I believe tools for thought should be transparent and
                                community-driven. You can inspect the code, contribute features, or even self-host your own instance.
                            </p>
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <Github size={20} />
                                View on GitHub
                            </a>
                        </section>

                        <section>
                            <h2 className="text-2xl font-medium text-gray-900 mb-4">Made by Owais Awan</h2>
                            <p className="text-gray-600 leading-relaxed mb-6">
                                A multidiciplinary art director who who mistook a thinking problem for a design problem.
                            </p>
                            <div className="flex gap-4">
                                <a
                                    href="https://www.instagram.com/thatowais/?hl=en"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                                >
                                    <Instagram size={24} />
                                </a>
                                <a
                                    href="https://thatowais.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                                >
                                    <Globe size={24} />
                                </a>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
}
