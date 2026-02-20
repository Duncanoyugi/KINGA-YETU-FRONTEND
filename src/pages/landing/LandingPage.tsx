import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/routing/routes';
import { 
  Calendar, 
  Shield, 
  TrendingUp, 
  Package, 
  Users, 
  Activity,
  ChevronRight,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Award,
  BarChart3,
  Bell,
  UserCheck,
  Syringe,
  Baby,
  BookOpen,
  Video
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { value: '150K+', label: 'Children Protected', icon: Baby, color: 'from-blue-400 to-blue-600' },
    { value: '500+', label: 'Health Facilities', icon: Activity, color: 'from-green-400 to-green-600' },
    { value: '47', label: 'Counties Covered', icon: MapPin, color: 'from-purple-400 to-purple-600' },
    { value: '98%', label: 'Vaccination Rate', icon: TrendingUp, color: 'from-orange-400 to-orange-600' }
  ];

  const features = [
    {
      title: 'Smart Scheduling',
      description: 'AI-powered vaccine scheduling aligned with KEPI guidelines',
      icon: Calendar,
      color: 'bg-blue-50 text-blue-600',
      features: ['Auto-generates due dates', 'SMS/Email reminders', 'Catch-up schedules']
    },
    {
      title: 'Parent Dashboard',
      description: 'Comprehensive tools for tracking child health',
      icon: Users,
      color: 'bg-green-50 text-green-600',
      features: ['Growth tracking', 'Digital certificates', 'Appointment history']
    },
    {
      title: 'Real-time Analytics',
      description: 'Data-driven insights for better decision making',
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
      features: ['Coverage analytics', 'Dropout rates', 'Performance metrics']
    },
    {
      title: 'Stock Management',
      description: 'End-to-end vaccine inventory control',
      icon: Package,
      color: 'bg-orange-50 text-orange-600',
      features: ['Expiry tracking', 'Wastage monitoring', 'Automated alerts']
    }
  ];

  const userTypes = [
    {
      role: 'Parents',
      icon: Users,
      color: 'from-blue-400 to-blue-600',
      features: [
        'Never miss a vaccine with smart reminders',
        'Digital immunization certificates',
        'Track growth & development',
        'Access health resources'
      ]
    },
    {
      role: 'Health Workers',
      icon: UserCheck,
      color: 'from-green-400 to-green-600',
      features: [
        'Daily clinic management',
        'One-click vaccination records',
        'Eligibility verification',
        'Stock monitoring'
      ]
    },
    {
      role: 'Administrators',
      icon: BarChart3,
      color: 'from-purple-400 to-purple-600',
      features: [
        'Real-time coverage analytics',
        'Facility performance dashboards',
        'DHIS2 integration',
        'Resource optimization'
      ]
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Register Your Child',
      description: 'Create a secure profile and add your child\'s details in minutes',
      icon: UserCheck,
      color: 'bg-blue-500'
    },
    {
      step: 2,
      title: 'Get Smart Reminders',
      description: 'Receive timely notifications for upcoming vaccines',
      icon: Bell,
      color: 'bg-green-500'
    },
    {
      step: 3,
      title: 'Visit Health Facility',
      description: 'Check in and get vaccines recorded instantly',
      icon: Syringe,
      color: 'bg-purple-500'
    },
    {
      step: 4,
      title: 'Track Progress',
      description: 'Monitor growth and download digital certificates',
      icon: Award,
      color: 'bg-orange-500'
    }
  ];

  const resources = [
    {
      title: 'KEPI Schedule Guide',
      description: 'Complete vaccination schedule for Kenya',
      icon: Calendar,
      link: '#',
      category: 'Guide'
    },
    {
      title: 'Parent Handbook',
      description: 'Everything you need to know about childhood vaccines',
      icon: BookOpen,
      link: '#',
      category: 'PDF'
    },
    {
      title: 'Training Videos',
      description: 'Step-by-step tutorials for health workers',
      icon: Video,
      link: '#',
      category: 'Video'
    },
    {
      title: 'Safety Information',
      description: 'Vaccine safety and side effects explained',
      icon: Shield,
      link: '#',
      category: 'Info'
    }
  ];

  const testimonials = [
    {
      quote: "KingaYetu has transformed how we track immunizations. No more missed vaccines!",
      author: "Mary Wanjiku",
      role: "Mother of two",
      image: "https://images.unsplash.com/photo-1494790108777-766fde9e3b1a?auto=format&fit=crop&w=150&q=80"
    },
    {
      quote: "The dashboard gives me real-time insights into our facility's coverage rates.",
      author: "Dr. James Otieno",
      role: "Clinical Officer",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=150&q=80"
    },
    {
      quote: "Finally, a system that understands our local context and needs.",
      author: "Sarah Kimani",
      role: "Public Health Nurse",
      image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=150&q=80"
    }
  ];

  const partners = [
    { name: 'Ministry of Health', logo: '🏛️' },
    { name: 'UNICEF', logo: '🤝' },
    { name: 'WHO', logo: '🌍' },
    { name: 'KEPI', logo: '💉' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' : 'bg-transparent py-5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <span className={`font-bold text-2xl tracking-tight transition-colors ${
                scrolled ? 'text-primary-600' : 'text-white'
              }`}>
                KingaYetu
              </span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                scrolled ? 'bg-primary-100 text-primary-600' : 'bg-white/20 text-white'
              }`}>
                Beta
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {['Home', 'About', 'Solutions', 'Resources'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`text-sm font-medium transition-colors hover:opacity-100 ${
                    scrolled ? 'text-gray-600 hover:text-primary-600' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Link
                to={ROUTES.LOGIN}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  scrolled
                    ? 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Sign In
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="px-5 py-2 rounded-full bg-accent-400 text-primary-900 text-sm font-bold hover:bg-accent-300 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className={scrolled ? 'text-gray-600' : 'text-white'} />
              ) : (
                <Menu className={scrolled ? 'text-gray-600' : 'text-white'} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden animate-fade-in">
            <div className="px-4 py-6 space-y-4">
              {['Home', 'About', 'Solutions', 'Resources'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block text-gray-600 hover:text-primary-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <hr className="border-gray-200" />
              <Link
                to={ROUTES.LOGIN}
                className="block text-gray-600 hover:text-primary-600 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to={ROUTES.REGISTER}
                className="block bg-accent-400 text-primary-900 text-center font-bold px-4 py-2 rounded-full"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 opacity-90"></div>
          <img
            src="https://images.unsplash.com/photo-1584515933487-779824d8a30a?auto=format&fit=crop&w=2000&q=80"
            alt="Healthcare in Kenya"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-transparent to-transparent"></div>
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-6 animate-fade-in">
                <Shield className="w-4 h-4 mr-2" />
                Trusted by 500+ Health Facilities
              </div>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-slide-up">
                Protecting Kenya's
                <span className="block text-accent-400">Future Generation</span>
              </h1>
              
              <p className="text-xl text-primary-100 mb-8 max-w-xl animate-slide-up delay-200">
                Kenya's premier digital immunization platform connecting parents, 
                health workers, and administrators to ensure no child misses a vaccine.
              </p>

              <div className="flex flex-wrap gap-4 mb-12 animate-slide-up delay-300">
                <Link
                  to={ROUTES.REGISTER}
                  className="group px-8 py-4 rounded-full bg-accent-400 text-primary-900 font-bold hover:bg-accent-300 transition-all hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
                >
                  Start Protecting Your Child
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to={ROUTES.LOGIN}
                  className="px-8 py-4 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all backdrop-blur-sm"
                >
                  Watch Demo
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-8 animate-slide-up delay-500">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-primary-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image/Card */}
            <div className="hidden lg:block animate-float">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-accent-400/30 to-blue-400/30 rounded-3xl transform rotate-6 scale-105 blur-2xl"></div>
                <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
                    alt="Healthcare worker with child"
                    className="rounded-2xl shadow-lg mb-6"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                      <div className="text-2xl font-bold text-white mb-1">98%</div>
                      <div className="text-xs text-primary-200">Vaccination Rate</div>
                    </div>
                    <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
                      <div className="text-2xl font-bold text-white mb-1">24/7</div>
                      <div className="text-xs text-primary-200">Support Available</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-scroll"></div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
            Trusted by leading health organizations
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {partners.map((partner, index) => (
              <div key={index} className="text-4xl opacity-50 hover:opacity-100 transition-opacity">
                <span className="text-2xl font-bold text-gray-400">{partner.logo} {partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="solutions" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to{' '}
              <span className="text-primary-600">Keep Children Safe</span>
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive tools designed for Kenya's unique healthcare landscape
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-500">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="w-5 h-5 text-primary-600" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How <span className="text-primary-600">KingaYetu</span> Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to protect your child's health
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-200 to-transparent"></div>
                )}
                <div className="relative flex flex-col items-center text-center">
                  <div className={`w-20 h-20 ${step.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg transform rotate-45`}>
                    <div className="transform -rotate-45">
                      <step.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Designed for{' '}
              <span className="text-primary-600">Everyone</span>
            </h2>
            <p className="text-xl text-gray-600">
              Tailored experiences for each user role
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {userTypes.map((user, index) => (
              <div
                key={index}
                className="group bg-gray-50 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${user.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <user.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{user.role}</h3>
                <ul className="space-y-3">
                  {user.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={ROUTES.REGISTER}
                  className="mt-6 inline-flex items-center text-primary-600 font-semibold group-hover:translate-x-2 transition-transform"
                >
                  Learn more
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Trusted by Healthcare Heroes
            </h2>
            <p className="text-xl text-primary-100">
              See what our users have to say about KingaYetu
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white hover:bg-white/20 transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-white/50"
                  />
                  <div className="ml-4">
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-primary-200">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-primary-100 italic">"{testimonial.quote}"</p>
                <div className="mt-4 flex text-accent-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section id="resources" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Helpful{' '}
              <span className="text-primary-600">Resources</span>
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about childhood immunization
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resources.map((resource, index) => (
              <a
                key={index}
                href={resource.link}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                  <resource.icon className="w-6 h-6 text-primary-600" />
                </div>
                <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
                  {resource.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-2 mb-2 group-hover:text-primary-600 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                <span className="inline-flex items-center text-primary-600 font-semibold text-sm">
                  Access resource
                  <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-600 to-primary-800 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-400/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Protect Your Child's Future?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of Kenyan parents who never miss a vaccine
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to={ROUTES.REGISTER}
              className="group px-8 py-4 rounded-full bg-accent-400 text-primary-900 font-bold hover:bg-accent-300 transition-all hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
            >
              Create Free Account
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to={ROUTES.LOGIN}
              className="px-8 py-4 rounded-full border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition-all"
            >
              Schedule a Demo
            </Link>
          </div>

          <p className="mt-6 text-sm text-primary-200">
            Free for public health facilities • No credit card required • 24/7 Support
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">KingaYetu</h3>
              <p className="text-sm text-gray-400">
                Protecting Kenya's future, one vaccine at a time. A digital immunization platform in collaboration with Kenya's Ministry of Health.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.104c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 0021.775-3.774 13.94 13.94 0 001.543-6.187c0-.21-.005-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.771-.773 1.771-1.729V1.729C24 .774 23.204 0 22.225 0z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#solutions" className="text-gray-400 hover:text-white transition-colors">Solutions</a></li>
                <li><a href="#resources" className="text-gray-400 hover:text-white transition-colors">Resources</a></li>
                <li><Link to={ROUTES.TERMS} className="text-gray-400 hover:text-white transition-colors">Terms of Use</Link></li>
                <li><Link to={ROUTES.PRIVACY} className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="text-gray-400">+254 700 123 456</span>
                </li>
                <li className="flex items-center">
                  <Mail className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="text-gray-400">support@kingayetu.co.ke</span>
                </li>
                <li className="flex items-center">
                  <MapPin className="w-5 h-5 mr-3 text-gray-400" />
                  <span className="text-gray-400">Nairobi, Kenya</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Stay Updated</h4>
              <p className="text-sm text-gray-400 mb-4">
                Subscribe to our newsletter for vaccination updates and tips.
              </p>
              <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center text-gray-400">
            <p>© {new Date().getFullYear()} KingaYetu. All rights reserved. In partnership with Ministry of Health Kenya.</p>
          </div>
        </div>
      </footer>

      <style>
        {`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes scroll {
          0% { transform: translateY(0); opacity: 1; }
          75% { transform: translateY(15px); opacity: 0; }
          100% { transform: translateY(0); opacity: 0; }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-slide-up {
          opacity: 0;
          animation: slide-up 0.6s ease-out forwards;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .delay-500 {
          animation-delay: 0.5s;
        }

        .delay-1000 {
          animation-delay: 1s;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }
        `}
      </style>
    </div>
  );
};

export default LandingPage;