import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routing/routes';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary-600 uppercase tracking-wide">
            Legal
          </p>
          <h1 className="text-3xl font-bold text-gray-900">
            Terms of use
          </h1>
          <p className="text-gray-600 text-sm">
            Summary of how ImmuniTrack Kenya (KingaYetu) should be used by parents, health workers,
            and administrators. This is a non-binding placeholder; replace with official Ministry of
            Health legal text during deployment.
          </p>
        </header>

        <section className="space-y-3 text-sm text-gray-800">
          <h2 className="font-semibold text-gray-900">1. Purpose of the system</h2>
          <p>
            KingaYetu is a digital immunization tracking platform intended to support clinical
            decision-making, public health reporting, and parental engagement. It does not replace
            clinical judgement or official Ministry of Health registers.
          </p>
        </section>

        <section className="space-y-3 text-sm text-gray-800">
          <h2 className="font-semibold text-gray-900">2. Acceptable use</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Only authorized users may access clinical and administrative modules.</li>
            <li>Login credentials must not be shared with unauthorized individuals.</li>
            <li>
              Data must be entered accurately and promptly to reflect real immunization events.
            </li>
            <li>
              The system must not be used to discriminate against any patient or community.
            </li>
          </ul>
        </section>

        <section className="space-y-3 text-sm text-gray-800">
          <h2 className="font-semibold text-gray-900">3. Data accuracy & limitations</h2>
          <p>
            While every effort is made to ensure accuracy, KingaYetu is provided &quot;as is&quot;.
            Health workers remain responsible for verifying vaccine eligibility, contraindications,
            and clinical decisions using national guidelines and clinical training.
          </p>
        </section>

        <section className="space-y-3 text-sm text-gray-800">
          <h2 className="font-semibold text-gray-900">4. Changes to these terms</h2>
          <p>
            These terms may be updated as the system evolves. Continued use after changes are
            communicated will constitute acceptance of the updated terms.
          </p>
        </section>

        <p className="text-xs text-gray-500">
          For detailed legal wording, please consult the official documentation provided by the
          Ministry of Health Kenya.
        </p>

        <p className="text-xs text-gray-500">
          See also our{' '}
          <Link to={ROUTES.PRIVACY} className="text-primary-600 hover:text-primary-700">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default TermsPage;

