import React from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';

const ContactPage: React.FC = () => {
  return (
    <div className="relative min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
      {/* Unsplash Hero Background */}
      <img
        src="https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=80"
        alt="Contact Hero"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-60 z-0"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-700/70 via-secondary-700/60 to-accent-700/50 z-10" />
      {/* Content */}
      <div className="relative z-20 max-w-4xl mx-auto space-y-10">
        <header className="space-y-2 text-center py-8">
          <p className="text-sm font-semibold text-accent-600 uppercase tracking-wide">Contact</p>
          <h1 className="text-4xl font-extrabold text-primary-900 dark:text-white drop-shadow-lg">Talk to the ImmuniTrack Kenya team</h1>
          <p className="text-secondary-800 dark:text-secondary-200 max-w-2xl mx-auto">
            For support, training, or partnership enquiries, use the channels below. Health workers and administrators can also raise tickets directly from their dashboards.
          </p>
        </header>

        {/* Contact details */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <Card.Header title="Support & help desk" />
            <Card.Body>
              <dl className="space-y-2 text-sm text-gray-700">
                <div>
                  <dt className="font-semibold">Phone</dt>
                  <dd>+254 700 123 456</dd>
                </div>
                <div>
                  <dt className="font-semibold">Email</dt>
                  <dd>support@kingayetu.co.ke</dd>
                </div>
                <div>
                  <dt className="font-semibold">Hours</dt>
                  <dd>Monday–Friday, 8:00am – 5:00pm EAT</dd>
                </div>
                <div>
                  <dt className="font-semibold">Location</dt>
                  <dd>Nairobi, Kenya</dd>
                </div>
              </dl>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header title="Training & implementation" />
            <Card.Body>
              <p className="text-sm text-gray-700 mb-3">
                County and facility teams can request onboarding, refresher training, or technical
                assistance.
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                <li>Scheduling training for health workers</li>
                <li>Administrator configuration workshops</li>
                <li>Data quality and reporting support</li>
              </ul>
              <div className="mt-4">
                <Button
                  type="button"
                  variant="primary"
                  fullWidth
                  onClick={() => window.location.href = 'mailto:support@kingayetu.co.ke?subject=Training%20request'}
                >
                  Request training
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Simple contact form (client-side only for now) */}
        <Card>
          <Card.Header title="Send us a message" />
          <Card.Body>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget as HTMLFormElement;
                const formData = new FormData(form);
                const subject = encodeURIComponent('KingaYetu enquiry');
                const body = encodeURIComponent(
                  `Name: ${formData.get('name') || ''}\n` +
                  `Email: ${formData.get('email') || ''}\n` +
                  `Subject: ${formData.get('topic') || ''}\n\n` +
                  `${formData.get('message') || ''}`,
                );
                window.location.href = `mailto:support@kingayetu.co.ke?subject=${subject}&body=${body}`;
              }}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Your name
                  </label>
                  <input
                    name="name"
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <input
                    name="email"
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  name="topic"
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Support, training, feedback, partnership..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" variant="primary">
                  Send message
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>

        <p className="text-xs text-gray-500">
          For urgent child safety or adverse event concerns, please contact your nearest health
          facility or national hotline directly in addition to using this system.
        </p>
      </div>
    </div>
  );
};

export default ContactPage;

