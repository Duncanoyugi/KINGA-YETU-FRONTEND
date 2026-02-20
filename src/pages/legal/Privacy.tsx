import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routing/routes';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-wide">
            Legal
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            Privacy policy
          </h1>
          <p className="text-gray-600 text-sm">
            How ImmuniTrack Kenya (KingaYetu) handles personal and health information in line with
            Kenya&apos;s Data Protection Act 2019. This is a structured placeholder pending official
            legal review.
          </p>
        </header>

        <section className="space-y-3 text-sm text-gray-800">
          <h2 className="font-semibold text-gray-900">1. Data we collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Parent/guardian contact information (name, phone, email, location).</li>
            <li>Child demographics (name, date of birth, sex, birth details, identifiers).</li>
            <li>Immunization events (vaccine, date, facility, batch number, reactions).</li>
            <li>System usage data (logins, audit logs, technical telemetry).</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-gray-800">
          <h2 className="font-semibold text-gray-900">2. How data is used</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To generate and manage vaccination schedules and reminders.</li>
            <li>To support clinical care and continuity across facilities.</li>
            <li>To calculate immunization coverage and dropout indicators.</li>
            <li>To improve system performance, security, and user experience.</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-gray-800">
          <h2 className="font-semibold text-gray-900">3. Data protection & security</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>All data in transit is encrypted using TLS.</li>
            <li>Data at rest is protected with strong encryption and access controls.</li>
            <li>Role-based access ensures users only see information needed for their duties.</li>
            <li>All access and changes are logged for audit and accountability.</li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-gray-800">
          <h2 className="font-semibold text-gray-900">4. Your rights</h2>
          <p>
            Parents and guardians have rights under the Data Protection Act, including the right to
            access, correct, and, where appropriate, request deletion of personal data, subject to
            public health and legal record-keeping requirements.
          </p>
        </section>

        <section className="space-y-3 text-sm text-gray-800">
          <h2 className="font-semibold text-gray-900">5. Contact for privacy queries</h2>
          <p>
            For questions about how your data is handled, contact{' '}
            <a href="mailto:support@kingayetu.co.ke" className="text-primary-600 hover:text-primary-700">
              support@kingayetu.co.ke
            </a>
            .
          </p>
        </section>

        <p className="text-xs text-gray-500">
          This summary does not replace formal policy documents. For official wording, please refer
          to Ministry of Health Kenya publications.
        </p>

        <p className="text-xs text-gray-500">
          See also our{' '}
          <Link to={ROUTES.TERMS} className="text-primary-600 hover:text-primary-700">
            Terms of Use
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;

