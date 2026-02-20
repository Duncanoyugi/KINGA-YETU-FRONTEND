import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routing/routes';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

const ResourcesPage: React.FC = () => {
  return (
    <div className="relative min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
      {/* Unsplash Hero Background */}
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
        alt="Resources Hero"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-60 z-0"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-700/70 via-secondary-700/60 to-accent-700/50 z-10" />
      {/* Content */}
      <div className="relative z-20 max-w-5xl mx-auto space-y-10">
        <header className="space-y-2 text-center py-8">
          <p className="text-sm font-semibold text-accent-600 uppercase tracking-wide">Resources</p>
          <h1 className="text-4xl font-extrabold text-primary-900 dark:text-white drop-shadow-lg">Vaccine Information & User Guides</h1>
          <p className="text-secondary-800 dark:text-secondary-200 max-w-2xl mx-auto">
            Trusted information to help parents, health workers, and administrators use ImmuniTrack Kenya effectively and understand the KEPI immunization schedule.
          </p>
        </header>

        {/* KEPI schedule summary */}
        <Card>
          <Card.Header title="Kenya Expanded Programme on Immunization (KEPI) overview" />
          <Card.Body>
            <p className="text-sm text-gray-700 mb-3">
              KingaYetu&apos;s scheduling engine is built directly on KEPI guidelines. For every
              registered child, the system calculates the correct vaccines and due dates based on
              age, birth details, and special considerations.
            </p>
            <ul className="grid gap-3 text-sm text-gray-700 md:grid-cols-2">
              <li>
                <span className="font-semibold">Birth:</span> BCG, OPV 0
              </li>
              <li>
                <span className="font-semibold">6 weeks:</span> OPV 1, Penta 1, PCV 1, Rota 1
              </li>
              <li>
                <span className="font-semibold">10 weeks:</span> OPV 2, Penta 2, PCV 2, Rota 2
              </li>
              <li>
                <span className="font-semibold">14 weeks:</span> OPV 3, Penta 3, PCV 3, IPV
              </li>
              <li>
                <span className="font-semibold">9 months:</span> Measles/Rubella 1
              </li>
              <li>
                <span className="font-semibold">18 months and above:</span> Booster doses as
                recommended.
              </li>
            </ul>
            <p className="mt-3 text-xs text-gray-500">
              Exact timing and recommended windows are configured centrally by system admins and can
              be updated when KEPI guidelines change.
            </p>
          </Card.Body>
        </Card>

        {/* Role-based guides */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <Card.Header title="For Parents & Guardians" />
            <Card.Body>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>How to create an account and add children</li>
                <li>Understanding your child&apos;s vaccine timeline</li>
                <li>Receiving and managing reminders</li>
                <li>Viewing growth charts and digital certificates</li>
              </ul>
              <div className="mt-4">
                <Button variant="outline" fullWidth>
                  <Link to={ROUTES.REGISTER}>Create parent account</Link>
                </Button>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header title="For Health Workers" />
            <Card.Body>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>Daily workflow: search, check-in, record vaccines</li>
                <li>Using eligibility checks and vaccine batch details</li>
                <li>Managing facility vaccine inventory</li>
                <li>Generating end-of-day and weekly reports</li>
              </ul>
              <div className="mt-4">
                <Button variant="outline" fullWidth>
                  <Link to={ROUTES.HEALTH_WORKER_DASHBOARD}>Open health worker dashboard</Link>
                </Button>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header title="For Administrators" />
            <Card.Body>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>Monitoring coverage, dropout and timeliness</li>
                <li>Managing facilities, users and roles</li>
                <li>Configuring KEPI schedule, reminders and security</li>
                <li>Exporting DHIS2-ready reports</li>
              </ul>
              <div className="mt-4">
                <Button variant="outline" fullWidth>
                  <Link to={ROUTES.REPORTS_DASHBOARD}>View reports dashboard</Link>
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* FAQ snippet */}
        <Card>
          <Card.Header title="Frequently asked questions" />
          <Card.Body>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <p className="font-semibold">Do I still need the paper clinic card?</p>
                <p className="text-gray-600">
                  Yes. KingaYetu complements, but does not replace, existing Ministry of Health
                  documentation. The digital record helps prevent loss of information and supports
                  follow-up and planning.
                </p>
              </div>
              <div>
                <p className="font-semibold">How are my child&apos;s records protected?</p>
                <p className="text-gray-600">
                  All data is encrypted in transit and at rest, with strict role-based access and
                  full audit logging. The system complies with Kenya&apos;s Data Protection Act
                  2019.
                </p>
              </div>
              <div>
                <p className="font-semibold">What if I change facility or county?</p>
                <p className="text-gray-600">
                  Because KingaYetu is a national system, your child&apos;s immunization history is
                  available at any participating facility, ensuring continuity of care.
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ResourcesPage;

