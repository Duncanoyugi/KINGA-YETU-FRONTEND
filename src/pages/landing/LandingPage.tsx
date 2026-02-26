import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/images/hero-image.jpg';
import { 
  Calendar, Shield, TrendingUp, Package, Users, Activity,
  ChevronRight, Menu, X, Mail, Phone, MapPin, CheckCircle,
  Award, BarChart3, Bell, UserCheck, Syringe, Baby, BookOpen, Video, Star
} from 'lucide-react';
import { ROUTES } from '@/routing/routes';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignIn = () => {
    navigate(ROUTES.LOGIN);
  };

  const handleGetStarted = () => {
    navigate(ROUTES.REGISTER);
  };

  const stats = [
    { value: '150K+', label: 'Children Protected', icon: Baby },
    { value: '500+', label: 'Health Facilities', icon: Activity },
    { value: '47', label: 'Counties Covered', icon: MapPin },
    { value: '98%', label: 'Vaccination Rate', icon: TrendingUp }
  ];

  const features = [
    {
      title: 'Smart Scheduling',
      description: 'AI-powered vaccine scheduling aligned with KEPI guidelines',
      icon: Calendar,
      items: ['Auto-generates due dates', 'SMS/Email reminders', 'Catch-up schedules']
    },
    {
      title: 'Parent Dashboard',
      description: 'Comprehensive tools for tracking child health',
      icon: Users,
      items: ['Growth tracking', 'Digital certificates', 'Appointment history']
    },
    {
      title: 'Real-time Analytics',
      description: 'Data-driven insights for better decision making',
      icon: TrendingUp,
      items: ['Coverage analytics', 'Dropout rates', 'Performance metrics']
    },
    {
      title: 'Stock Management',
      description: 'End-to-end vaccine inventory control',
      icon: Package,
      items: ['Expiry tracking', 'Wastage monitoring', 'Automated alerts']
    }
  ];

  const howItWorks = [
    { step: 1, title: 'Register Your Child', description: "Create a secure profile and add your child's details in minutes", icon: UserCheck },
    { step: 2, title: 'Get Smart Reminders', description: 'Receive timely notifications for upcoming vaccines', icon: Bell },
    { step: 3, title: 'Visit Health Facility', description: 'Check in and get vaccines recorded instantly', icon: Syringe },
    { step: 4, title: 'Track Progress', description: 'Monitor growth and download digital certificates', icon: Award }
  ];

  const resources = [
    { title: 'KEPI Schedule Guide', description: 'Complete vaccination schedule for Kenya', icon: Calendar, category: 'Guide' },
    { title: 'Parent Handbook', description: 'Everything you need to know about childhood vaccines', icon: BookOpen, category: 'PDF' },
    { title: 'Training Videos', description: 'Step-by-step tutorials for health workers', icon: Video, category: 'Video' },
    { title: 'Safety Information', description: 'Vaccine safety and side effects explained', icon: Shield, category: 'Info' }
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
    { name: 'Ministry of Health', icon: '🏛️' },
    { name: 'UNICEF', icon: '🤝' },
    { name: 'WHO', icon: '🌍' },
    { name: 'KEPI', icon: '💉' }
  ];

  const navItems = ['Home', 'About', 'Solutions', 'Resources'];

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className={`text-2xl font-bold tracking-tight ${
                scrolled ? 'text-emerald-700' : 'text-white'
              }`}>
                KingaYetu
              </span>
              <span className="text-xs font-semibold px-2 py-1 rounded-full bg-amber-400 text-amber-900">
                Beta
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map(item => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  className={`text-sm font-medium transition-colors hover:text-emerald-600 ${
                    scrolled ? 'text-gray-700' : 'text-white/90'
                  }`}
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button 
                onClick={handleSignIn}
                className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                  scrolled ? 'text-gray-700 hover:text-emerald-600' : 'text-white/90 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button 
                onClick={handleGetStarted}
                className="text-sm font-semibold px-5 py-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-md"
              >
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} 
              className="md:hidden p-2"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? 
                <X className={`w-6 h-6 ${scrolled ? 'text-gray-900' : 'text-white'}`} /> : 
                <Menu className={`w-6 h-6 ${scrolled ? 'text-gray-900' : 'text-white'}`} />
              }
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 animate-fade-in">
            <div className="px-4 py-4 space-y-2">
              {navItems.map(item => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`} 
                  onClick={() => setIsMenuOpen(false)} 
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                >
                  {item}
                </a>
              ))}
              <div className="pt-3 border-t border-gray-200 flex flex-col gap-2">
                <button onClick={handleSignIn} className="block text-center py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium">
                  Sign In
                </button>
                <button onClick={handleGetStarted} className="block text-center py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with Clear Background Image */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Image - Now with minimal overlay for clarity */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Kenyan mother and child at health facility" 
            className="w-full h-full object-cover"
          />
          {/* Very subtle dark overlay - just enough for text readability without blocking the image */}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left side content */}
            <div className="space-y-8 max-w-xl">
              {/* Trust badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                <Shield className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium text-white">
                  Trusted by 500+ Health Facilities
                </span>
              </div>

              {/* Main headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                Protecting{' '}
                <span className="text-amber-400">Kenya's Future</span>
                <br />
                Generation
              </h1>

              {/* Description */}
              <p className="text-xl text-white/90 max-w-xl leading-relaxed">
                Kenya's premier digital immunization platform connecting parents, health workers, and administrators to ensure no child misses a vaccine.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleGetStarted}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-amber-400 text-amber-900 font-bold text-lg hover:bg-amber-500 transition-all shadow-lg shadow-amber-400/30"
                >
                  Start Protecting Your Child
                  <ChevronRight className="w-5 h-5" />
                </button>
                <a 
                  href="#" 
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/40 text-white font-semibold text-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  Watch Demo
                </a>
              </div>

              {/* Stats - moved here from the card */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                {stats.map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs text-white/70 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - empty to push card to bottom right */}
            <div className="hidden lg:block"></div>
          </div>

          {/* Minimized Status Card - Positioned at bottom right */}
          <div className="hidden lg:block absolute bottom-8 right-8">
            <div className="relative">
              <div className="absolute -inset-2 bg-white/10 rounded-2xl blur-md" />
              <div className="relative bg-white/15 backdrop-blur-md rounded-xl border border-white/30 p-4 w-64">
                {/* Status header */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-medium text-white/80">System Active</span>
                </div>

                {/* Mini stats grid */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="bg-white/10 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-white">98%</p>
                    <p className="text-[10px] text-white/60">Vaccination</p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-2 text-center">
                    <p className="text-lg font-bold text-white">24/7</p>
                    <p className="text-[10px] text-white/60">Support</p>
                  </div>
                </div>

                {/* Status items - compact */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-3 h-3 text-green-400 shrink-0" />
                    <span className="text-xs">Schedule on track</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-3 h-3 text-green-400 shrink-0" />
                    <span className="text-xs">Next: 3 days</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <CheckCircle className="w-3 h-3 text-green-400 shrink-0" />
                    <span className="text-xs">Growth normal</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:hidden">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-white/50 animate-scroll-indicator" />
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600 mb-8 font-medium">
            Trusted by leading health organizations
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12">
            {partners.map((partner, i) => (
              <div key={i} className="flex items-center gap-2 text-gray-500 text-lg font-medium">
                <span className="text-3xl">{partner.icon}</span>
                <span>{partner.name}</span>
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
              <span className="text-emerald-600">Keep Children Safe</span>
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive tools designed for Kenya's unique healthcare landscape
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Smart Scheduling */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Scheduling</h3>
                  <p className="text-gray-600">AI-powered vaccine scheduling aligned with KEPI guidelines</p>
                </div>
              </div>
              <ul className="space-y-3">
                {features[0].items.map((item, j) => (
                  <li key={j} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Parent Dashboard */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Parent Dashboard</h3>
                  <p className="text-gray-600">Comprehensive tools for tracking child health</p>
                </div>
              </div>
              <ul className="space-y-3">
                {features[1].items.map((item, j) => (
                  <li key={j} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Real-time Analytics */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Real-time Analytics</h3>
                  <p className="text-gray-600">Data-driven insights for better decision making</p>
                </div>
              </div>
              <ul className="space-y-3">
                {features[2].items.map((item, j) => (
                  <li key={j} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Stock Management */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <Package className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Stock Management</h3>
                  <p className="text-gray-600">End-to-end vaccine inventory control</p>
                </div>
              </div>
              <ul className="space-y-3">
                {features[3].items.map((item, j) => (
                  <li key={j} className="flex items-center gap-3 text-gray-700">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How <span className="text-emerald-600">KingaYetu</span> Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to protect your child's health
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <div key={i} className="relative text-center">
                {i < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-emerald-200 to-transparent" />
                )}
                <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-emerald-100 mb-6">
                  <step.icon className="w-10 h-10 text-emerald-600" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-600 text-white text-sm font-bold flex items-center justify-center">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Designed for <span className="text-emerald-600">Everyone</span>
            </h2>
            <p className="text-xl text-gray-600">
              Tailored experiences for each user role
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Parents */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center mb-6">
                <Users className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Parents</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  Never miss a vaccine with smart reminders
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  Digital immunization certificates
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  Track growth & development
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  Eligibility verification
                </li>
              </ul>
              <a href="#" className="inline-flex items-center gap-1 text-emerald-600 font-semibold hover:text-emerald-700">
                Learn more <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Health Workers */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center mb-6">
                <UserCheck className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Health Workers</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  Daily clinic management
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  One-click vaccination records
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  Eligibility verification
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  DHIS2 integration
                </li>
              </ul>
              <a href="#" className="inline-flex items-center gap-1 text-emerald-600 font-semibold hover:text-emerald-700">
                Learn more <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Administrators */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center mb-6">
                <BarChart3 className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Administrators</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  Real-time coverage analytics
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  Facility performance dashboards
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  DHIS2 integration
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  Stock monitoring
                </li>
              </ul>
              <a href="#" className="inline-flex items-center gap-1 text-emerald-600 font-semibold hover:text-emerald-700">
                Learn more <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by <span className="text-emerald-600">Healthcare Heroes</span>
            </h2>
            <p className="text-xl text-gray-600">
              See what our users have to say about KingaYetu
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={t.image} 
                    alt={t.author} 
                    className="w-16 h-16 rounded-full object-cover border-2 border-emerald-100"
                  />
                  <div>
                    <p className="font-bold text-gray-900">{t.author}</p>
                    <p className="text-sm text-gray-600">{t.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 text-lg leading-relaxed italic mb-6">"{t.quote}"</p>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section id="resources" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Helpful <span className="text-emerald-600">Resources</span>
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about childhood immunization
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((r, i) => (
              <a 
                key={i} 
                href="#" 
                className="group bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 block"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
                  <r.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 mb-3">
                  {r.category}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{r.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{r.description}</p>
                <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold group-hover:gap-2 transition-all">
                  Access resource <ChevronRight className="w-4 h-4" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-br from-emerald-700 to-emerald-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Protect Your Child's Future?
          </h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of Kenyan parents who never miss a vaccine
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button 
              onClick={handleGetStarted}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-amber-400 text-amber-900 font-bold text-lg hover:bg-amber-500 transition-all shadow-lg shadow-amber-400/30"
            >
              Create Free Account
              <ChevronRight className="w-5 h-5" />
            </button>
            <a 
              href="#" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/30 text-white font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              Schedule a Demo
            </a>
          </div>
          
          <p className="text-white/60 text-sm">
            Free for public health facilities • No credit card required • 24/7 Support
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-gray-800">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">KingaYetu</h3>
              <p className="text-sm leading-relaxed text-gray-400 mb-6">
                Protecting Kenya's future, one vaccine at a time. A digital immunization platform in collaboration with Kenya's Ministry of Health.
              </p>
              <div className="flex gap-3">
                {['twitter', 'facebook', 'linkedin'].map(s => (
                  <a 
                    key={s} 
                    href="#" 
                    className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center hover:bg-emerald-600 transition-colors group"
                  >
                    <Mail className="w-5 h-5 text-gray-400 group-hover:text-white" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                {['Home', 'About Us', 'Solutions', 'Resources', 'Terms of Use', 'Privacy Policy'].map(l => (
                  <li key={l}>
                    <a href="#" className="hover:text-emerald-400 transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-bold text-white mb-4">Contact Us</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 shrink-0" />
                  +254 700 123 456
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 shrink-0" />
                  support@kingayetu.co.ke
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 shrink-0" />
                  Nairobi, Kenya
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-bold text-white mb-4">Stay Updated</h4>
              <p className="text-sm text-gray-400 mb-4">
                Subscribe to our newsletter for vaccination updates and tips.
              </p>
              <form onSubmit={e => e.preventDefault()} className="flex">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  className="flex-1 px-4 py-3 rounded-l-lg bg-gray-800 border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                />
                <button 
                  type="submit" 
                  className="px-6 py-3 rounded-r-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* Copyright */}
          <p className="pt-8 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} KingaYetu. All rights reserved. In partnership with Ministry of Health Kenya.
          </p>
        </div>
      </footer>

      {/* Add animation styles */}
      <style>{`
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
        
        @keyframes scroll-indicator {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          75% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 0;
            transform: translateY(10px);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
        
        .animate-scroll-indicator {
          animation: scroll-indicator 2s infinite;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
        
        .delay-500 {
          animation-delay: 500ms;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
