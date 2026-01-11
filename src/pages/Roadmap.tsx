import { ArrowLeft, Github, CheckCircle2, Circle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Roadmap() {
    const features = [
        { name: "Plug-ins system", status: "planned" },
        { name: "Accessibility settings", status: "planned" },
        { name: "Desktop and mobile apps", status: "planned" },
        { name: "Share notes", status: "planned" },
        { name: "Semantic search", status: "planned" },
        { name: "Chrome extension", status: "planned" },
        { name: "Raspberry Pi / Linux / Docker deployment", status: "planned" }
    ];

    return (
        <div className="min-h-screen bg-white font-sans">
            <header className="px-6 py-4 flex items-center max-w-4xl mx-auto w-full">
                <Link to="/" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-normal font-['Instrument_Serif'] text-gray-900 mb-4">
                    Roadmap
                </h1>
                <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl">
                    wsdm is a living project. There are bugs, missing features and future plans. Here's what I'm working on next to make it the best tool for thought.
                </p>

                <div className="grid gap-4 mb-16">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
                        >
                            <div className="text-gray-400">
                                {feature.status === 'done' ? (
                                    <CheckCircle2 size={24} className="text-green-600" />
                                ) : (
                                    <Circle size={24} />
                                )}
                            </div>
                            <span className={`text-lg ${feature.status === 'done' ? 'text-gray-900' : 'text-gray-700'}`}>
                                {feature.name}
                            </span>
                            {feature.status === 'planned' && (
                                <span className="ml-auto text-xs font-medium px-2 py-1 bg-gray-200 text-gray-600 rounded-full">
                                    Planned
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                <section className="bg-black text-white rounded-3xl p-8 md:p-12 text-center">
                    <h2 className="text-3xl font-normal font-['Instrument_Serif'] mb-4">
                        Help Build wsdm
                    </h2>
                    <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                        I am NOT a programmer or quite frankly even know what im doing. If you're a developer, designer, or maker who wants to contribute, check out the project on GitHub.
                    </p>
                    <a
                        href="https://github.com/thatowais/wsdm"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <Github size={20} />
                        Contribute on GitHub
                    </a>
                </section>
            </main>
        </div>
    );
}
