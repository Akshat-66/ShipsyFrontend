"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Truck, BarChart3, Users, Clock } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const features = [
    {
      icon: <Truck className="h-8 w-8 text-blue-600" />,
      title: "Real-Time Tracking",
      description: "Stay updated with every shipment location and status in real-time.",
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-blue-600" />,
      title: "Data-Driven Insights",
      description: "Optimize your logistics strategy with comprehensive analytics and reports.",
    },
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "User-Friendly Interface",
      description: "Designed for efficiency and ease, making shipment management simple.",
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-600" />,
      title: "24/7 Support",
      description: "We're here whenever you need us with round-the-clock customer support.",
    },
  ]

  const handleLogin = () => {
    window.location.href = "/login"
  }

  const handleGetStarted = () => {
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <Truck className="h-8 w-8 text-blue-600 mr-2" />
                <span className="font-bold text-xl text-gray-900">Shipsy</span>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  href="#features"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Features
                </Link>
                <Link
                  href="#about"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  About
                </Link>
                <Link
                  href="#contact"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" onClick={handleLogin} className="text-gray-600 hover:text-blue-600">
                Login
              </Button>
              <Button onClick={handleGetStarted} className="bg-blue-600 hover:bg-cyan-500 text-white transition-colors">
                Get Started
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-blue-600 p-2">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200">
                <Link href="#features" className="block px-3 py-2 text-gray-600 hover:text-blue-600">
                  Features
                </Link>
                <Link href="#about" className="block px-3 py-2 text-gray-600 hover:text-blue-600">
                  About
                </Link>
                <Link href="#contact" className="block px-3 py-2 text-gray-600 hover:text-blue-600">
                  Contact
                </Link>
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <Button variant="ghost" onClick={handleLogin} className="w-full mb-2">
                    Login
                  </Button>
                  <Button onClick={handleGetStarted} className="w-full bg-blue-600 hover:bg-cyan-500">
                    Get Started
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div
          className="relative min-h-[600px] flex items-center bg-cover bg-center"
          style={{
            backgroundImage: `url('/placeholder.svg?height=600&width=1200')`,
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Streamline Your Shipments with <span className="text-cyan-400">Shipsy</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-100 leading-relaxed">
                Effortlessly manage your logistics with real-time tracking and optimized routes. Transform your shipping
                operations today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-4 text-lg font-semibold transition-all transform hover:scale-105"
                >
                  Get Started Today
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleLogin}
                  className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold transition-all bg-transparent"
                >
                  Login
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose Shipsy?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the powerful features that make Shipsy the preferred choice for logistics professionals
              worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Logistics?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of logistics professionals who trust Shipsy to manage their shipments efficiently.
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-4 text-lg font-semibold transition-all transform hover:scale-105"
          >
            Start Your Free Trial
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <Truck className="h-8 w-8 text-blue-400 mr-2" />
                <span className="font-bold text-xl">Shipsy</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                The leading shipment management platform trusted by logistics professionals worldwide.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Shipsy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
