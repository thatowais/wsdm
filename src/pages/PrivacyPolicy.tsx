import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white font-sans">
            <header className="px-6 py-4 flex items-center max-w-4xl mx-auto w-full">
                <Link to="/" className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                    <ArrowLeft size={20} />
                    Back to Home
                </Link>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-normal font-['Instrument_Serif'] text-gray-900 mb-8">
                    Privacy Policy
                </h1>

                <div className="prose prose-gray max-w-none">
                    <p className="text-lg text-gray-600 mb-8">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-medium text-gray-900 mb-4">1. Who we are</h2>
                        <p className="text-gray-600 mb-4">
                            wsdm is an open-source project created by Owais Awan. We believe in software that serves the user, not the other way around.
                            Being open-source means our code is public and verifiable by anyone.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-medium text-gray-900 mb-4">2. What this app does</h2>
                        <p className="text-gray-600 mb-4">
                            wsdm is a tool for thought that helps you connect your ideas. It allows you to create notes, link them together,
                            and visualize your knowledge graph, all while keeping your data under your complete control.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-medium text-gray-900 mb-4">3. Data we do NOT collect</h2>
                        <p className="text-gray-600 mb-4">
                            We are radically privacy-focused. We <strong>do not</strong> collect:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 space-y-2">
                            <li>Your notes or content.</li>
                            <li>Usage analytics or tracking pixels.</li>
                            <li>Your IP address or device information.</li>
                            <li>We do not sell or share data with advertisers.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-medium text-gray-900 mb-4">4. Data we collect (by choice)</h2>
                        <p className="text-gray-600 mb-4">
                            If you choose to use the Sync feature:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 space-y-2">
                            <li>
                                <strong>Authentication Profile:</strong> We authenticate you via Google, receiving only your name, email,
                                and profile picture to display in the UI.
                            </li>
                            <li>
                                <strong>Drive Access:</strong> We access <strong>only</strong> the specific file folder we create in your
                                Google Drive to sync your notes. We cannot see other files in your Drive.
                            </li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-medium text-gray-900 mb-4">5. Where data lives</h2>
                        <p className="text-gray-600 mb-4">
                            Your data lives in two places, and nowhere else:
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 space-y-2">
                            <li><strong>Local Storage:</strong> On your device's browser, for instant access.</li>
                            <li><strong>Google Drive:</strong> In your personal cloud storage (if sync is enabled).</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-medium text-gray-900 mb-4">6. Third parties</h2>
                        <p className="text-gray-600 mb-4">
                            We rely on <strong>Google</strong> solely for authentication and storage services that you authorize.
                            We use no other third-party processors.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-medium text-gray-900 mb-4">7. User rights</h2>
                        <p className="text-gray-600 mb-4">
                            Since you own your data, you have complete control. You can modify, export, or delete your notes at any time
                            directly through the app or by accessing your Google Drive.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-medium text-gray-900 mb-4">8. Data retention</h2>
                        <p className="text-gray-600 mb-4">
                            We do not retain your data because we never have it. Your notes exist as long as you keep them on your device
                            or in your Google Drive.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-medium text-gray-900 mb-4">9. Security limitations (honest ones)</h2>
                        <p className="text-gray-600 mb-4">
                            While we build for privacy, no system is perfect.
                        </p>
                        <ul className="list-disc pl-6 text-gray-600 space-y-2">
                            <li>
                                <strong>Local Access:</strong> Data stored in your browser is accessible to anyone with physical access
                                to your unlocked device.
                            </li>
                            <li>
                                <strong>Google Account:</strong> Your sync security depends on your Google Account security (e.g., strong passwords, 2FA).
                            </li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-medium text-gray-900 mb-4">10. Policy changes</h2>
                        <p className="text-gray-600 mb-4">
                            As an open-source project, any changes to how we handle data will be reflected here and in our public code repository.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
