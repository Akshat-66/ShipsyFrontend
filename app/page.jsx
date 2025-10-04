"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Truck, BarChart3, Users, Clock, MapPin, Shield, Zap, Globe } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const features = [
    {
      icon: <Truck className="h-8 w-8 text-blue-600" />,
      title: "Real-Time Tracking",
      description: "Stay updated with every shipment location and status in real-time with live GPS tracking.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      title: "Data-Driven Insights",
      description: "Optimize your logistics strategy with comprehensive analytics and detailed performance reports.",
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "User-Friendly Interface",
      description: "Designed for efficiency and ease, making complex shipment management simple and intuitive.",
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: "24/7 Support",
      description: "We're here whenever you need us with round-the-clock customer support and dedicated account managers.",
    },
  ]

  const advancedFeatures = [
    {
      icon: <MapPin className="h-8 w-8 text-green-600" />,
      title: "Smart Routing",
      description: "AI-powered route optimization that saves time and reduces fuel costs by up to 30%.",
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee for uninterrupted operations.",
    },
    {
      icon: <Zap className="h-8 w-8 text-green-600" />,
      title: "Fast Integration",
      description: "Seamlessly integrate with your existing systems in days, not months.",
    },
    {
      icon: <Globe className="h-8 w-8 text-green-600" />,
      title: "Global Coverage",
      description: "Manage shipments across 150+ countries with localized support and compliance.",
    },
  ]

  const handleLogin = () => {
    window.location.href = "/login"
  }

  const handleGetStarted = () => {
    window.location.href = "/login"
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Navigation */}
      <nav className={`bg-white border-b border-gray-200 sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "shadow-lg bg-white/95 backdrop-blur-sm" : ""}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="relative">
                  <Truck className="h-8 w-8 text-blue-600 mr-2" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                </div>
                <span className="font-bold text-xl text-gray-900 bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Shipsy
                </span>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  Features
                </button>
                <button
                  onClick={() => scrollToSection("about")}
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  About
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  Contact
                </button>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={handleLogin} 
                className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              >
                Login
              </Button>
              <Button 
                onClick={handleGetStarted} 
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="text-gray-600 hover:text-blue-600 p-2 transition-all duration-200"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Enhanced Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-sm border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <button 
                  onClick={() => scrollToSection("features")}
                  className="block w-full text-left px-3 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection("about")}
                  className="block w-full text-left px-3 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  About
                </button>
                <button 
                  onClick={() => scrollToSection("contact")}
                  className="block w-full text-left px-3 py-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                >
                  Contact
                </button>
                <div className="pt-4 pb-3 border-t border-gray-200 space-y-3">
                  <Button 
                    variant="ghost" 
                    onClick={handleLogin} 
                    className="w-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                  >
                    Login
                  </Button>
                  <Button 
                    onClick={handleGetStarted} 
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white transition-all duration-300 shadow-lg"
                  >
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

     {/* Hero Section */}
<section className="relative bg-gradient-to-br from-blue-500 to-cyan-400 text-white overflow-hidden">
  <div className="absolute inset-0 bg-black/10"></div>
  <div className="absolute top-0 left-0 w-full h-full">
    <div className="absolute top-10 left-10 w-20 h-20 bg-white/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce"></div>
    <div className="absolute top-40 right-10 w-16 h-16 bg-cyan-300/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
    <div className="absolute bottom-20 left-20 w-24 h-24 bg-blue-300/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce delay-75"></div>
  </div>
  
  <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
    <div className="max-w-3xl">
      <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
        <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
        <span className="text-sm font-medium text-white">Trusted by 5000+ logistics companies</span>
      </div>
      
      <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-white">
        Streamline Your Shipments with <span className="text-white">Shipsy</span>
      </h1>
      
      <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed max-w-2xl">
        Effortlessly manage your logistics with real-time tracking and optimized routes. Transform your shipping
        operations today with AI-powered insights.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <Button
          size="lg"
          onClick={handleGetStarted}
          className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl border-0"
        >
          Get Started Today
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={handleLogin}
          className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold transition-all bg-transparent backdrop-blur-sm"
        >
          Login to Dashboard
        </Button>
      </div>
      
      <div className="flex items-center gap-6 text-sm text-white/80">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>No credit card required</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>14-day free trial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>Setup in 5 minutes</span>
        </div>
      </div>
    </div>
  </div>
</section>
      {/* Enhanced Features Section */}
      <section id="features" className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Shipsy?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the powerful features that make Shipsy the preferred choice for logistics professionals
              worldwide. Built for scale, designed for simplicity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white/60 backdrop-blur-sm"
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-blue-50 rounded-2xl">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Advanced Features */}
          <div className="text-center mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Advanced Capabilities</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Take your logistics to the next level with our enterprise-grade features
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advancedFeatures.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-white to-gray-50 backdrop-blur-sm"
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-green-50 rounded-2xl">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">About Shipsy</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Founded in 2020, Shipsy has revolutionized the logistics industry with cutting-edge technology 
                and a customer-first approach. We believe that managing shipments should be simple, efficient, 
                and accessible to businesses of all sizes.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our platform combines artificial intelligence, real-time data analytics, and user-centric design 
                to deliver a comprehensive logistics solution that grows with your business.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
                  <div className="text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">150+</div>
                  <div className="text-gray-600">Countries Served</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
                  <div className="text-gray-600">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                  <div className="text-gray-600">Support</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-6">Our Mission</h3>
              <p className="text-lg mb-6 leading-relaxed">
                To democratize logistics technology and make advanced shipment management accessible to every 
                business, regardless of size or technical expertise.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Innovation-driven solutions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Customer-centric approach</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Continuous improvement</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                  <span>Global accessibility</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-500 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-300/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-bounce"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Logistics?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of logistics professionals who trust Shipsy to manage their shipments efficiently. 
            Start your journey today and experience the difference.
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold transition-all transform hover:scale-105 shadow-2xl hover:shadow-3xl"
          >
            Start Your Free Trial
          </Button>
          <p className="text-blue-200 mt-4 text-sm">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Sales</h3>
                <p className="text-gray-600 text-sm">Discuss your business needs</p>
                <p className="text-blue-600 font-medium mt-2">sales@shipsy.com</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Support</h3>
                <p className="text-gray-600 text-sm">Get technical help</p>
                <p className="text-blue-600 font-medium mt-2">support@shipsy.com</p>
              </div>
            </div>
            <div className="text-center">
              <Button 
                onClick={() => window.location.href = "mailto:hello@shipsy.com"}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white px-8 py-3 transition-all duration-300 transform hover:scale-105"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Truck className="h-8 w-8 text-cyan-400 mr-2" />
                <span className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Shipsy
                </span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md leading-relaxed">
                The leading shipment management platform trusted by logistics professionals worldwide. 
                Empowering businesses with intelligent logistics solutions.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-xs font-semibold">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-xs font-semibold">t</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <span className="text-xs font-semibold">in</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-lg">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <button onClick={() => scrollToSection("features")} className="hover:text-cyan-400 transition-colors duration-200">
                    Features
                  </button>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors duration-200">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors duration-200">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors duration-200">
                    Integrations
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-lg">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <button onClick={() => scrollToSection("about")} className="hover:text-cyan-400 transition-colors duration-200">
                    About
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection("contact")} className="hover:text-cyan-400 transition-colors duration-200">
                    Contact
                  </button>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors duration-200">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-cyan-400 transition-colors duration-200">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Shipsy. All rights reserved. | Building the future of logistics</p>
          </div>
        </div>
      </footer>
    </div>
  )
}