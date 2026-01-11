import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
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
                    Terms and Conditions
                </h1>

                <div className="prose prose-gray max-w-none">
                    <p className="text-lg text-gray-600 mb-8">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-medium text-gray-900 mb-4">1. Agreement to Terms</h2>
                        <p className="text-gray-600 mb-4">
                            By accessing or using wsdm, you agree to be bound by these Terms and Conditions.
                            If you disagree with any part of these terms, you may not access the service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-medium text-gray-900 mb-4">2. Intellectual Property</h2>
                        <p className="text-gray-600 mb-4">
                            wsdm is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
                        </p>
                        <p className="text-gray-600 mb-4">
                            Wsdm is an open-source project. You may view the license information in our GitHub repository.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-medium text-gray-900 mb-4">3. User Content</h2>
                        <p className="text-gray-600 mb-4">
                            You retain all rights to the content you create on wsdm. Since notes are stored locally or in your
                            personal cloud storage, you maintain full control and ownership of your data.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-medium text-gray-900 mb-4">4. Limitation of Liability</h2>
                        <p className="text-gray-600 mb-4">
                            In no event shall wsdm, nor its directors, employees, partners, agents, suppliers, or affiliates,
                            be liable for any indirect, incidental, special, consequential or punitive damages, including without
                            limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your
                            access to or use of or inability to access or use the service.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-medium text-gray-900 mb-4">5. Changes</h2>
                        <p className="text-gray-600 mb-4">
                            We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                            What constitutes a material change will be determined at our sole discretion.
                        </p>
                    </section>
                </div>
            </main>
        </div>
    );
}
