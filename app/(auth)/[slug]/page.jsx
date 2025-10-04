"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Truck, ArrowLeft, Eye, EyeOff } from "lucide-react"

export default function AuthPage() {
  const router = useRouter()
  const { slug } = useParams() // "login" or "signup"

  const [formData, setFormData] = useState({ username: "", password: "" })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const api_url = process.env.NEXT_PUBLIC_API_BASE_URL

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.username.trim()) newErrors.username = "Username is required"
    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    
    // Clear any previous errors
    setErrors({})

    try {
      const url = slug === "signup" 
        ? `${api_url}/auth/register`
        : `${api_url}/auth/login`

      console.log("Making request to:", url) // Debug log

      const response = await axios.post(url, {
        username: formData.username,
        password: formData.password
      }
    )

      console.log("Response received:", response.data) // Debug log

      // Handle different possible response structures
      const isSuccess = 
        response.status === 200 || 
        response.status === 201 || 
        response.data?.success === true ||
        response.data?.status === 'success' ||
        (response.data && !response.data.error && !response.data.message?.includes('failed'))

      if (isSuccess) {
        // Store authentication data safely
        try {
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem("isAuthenticated", "true")
            localStorage.setItem("username", formData.username);

            // Store Bearer token
            if (response.data.token) {
              localStorage.setItem("token", response.data.token); // <--- store token here
            }
          }
        } catch (storageError) {
          console.warn("localStorage not available:", storageError)
        }

        // Store token if provided
        if (response.data?._id) {
          try {
            localStorage.setItem("userId", response.data._id)
          } catch (storageError) {
            console.warn("Could not store token:", storageError)
          }
        }

        console.log("Authentication successful, redirecting to dashboard") // Debug log
        
        // Use replace to prevent back navigation to auth page
       // With this:
          router.push("/dashboard")
      } else {
        // Handle API error response
        const errorMessage = 
          response.data?.message || 
          response.data?.error || 
          `${slug === "signup" ? "Registration" : "Login"} failed`
        
        setErrors({ general: errorMessage })
      }
    } catch (error) {
      console.error("Authentication error:", error) // Debug log
      
      let errorMessage = "Something went wrong. Please try again."
      
      if (error.response) {
        // Server responded with error status
        if (error.response.status === 401) {
          errorMessage = "Invalid username or password"
        } else if (error.response.status === 409) {
          errorMessage = "Username already exists"
        } else if (error.response.status >= 500) {
          errorMessage = "Server error. Please try again later."
        } else {
          errorMessage = 
            error.response.data?.message || 
            error.response.data?.error || 
            `${slug === "signup" ? "Registration" : "Login"} failed`
        }
      } else if (error.request) {
        // Network error
        errorMessage = "Network error. Please check your connection."
      }

      setErrors({ general: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToHome = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={handleBackToHome}
          className="mb-6 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Button>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-600 p-3 rounded-full">
                <Truck className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {slug === "signup" ? "Create Your Account" : "Welcome to Shipsy"}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {slug === "signup"
                ? "Sign up for your shipment management account"
                : "Sign in to your shipment management account"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {errors.general && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{errors.general}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`${
                    errors.username
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-500"
                  }`}
                  placeholder="Enter your username"
                />
                {errors.username && (
                  <p className="text-sm text-red-600">{errors.username}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`pr-10 ${
                      errors.password
                        ? "border-red-300 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 font-medium"
                >
                  {isLoading
                    ? slug === "signup"
                      ? "Signing up..."
                      : "Signing in..."
                    : slug === "signup"
                    ? "Sign Up"
                    : "Sign In"}
                </Button>
              </div>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Don't have an account? <br/>
                Please sign up first before signing in.</h4>
              <p className="text-sm text-blue-700">
                   </p>
            </div>

            <div className="mt-6 text-center">
              {slug === "login" ? (
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    onClick={() => router.replace("/signup")}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    onClick={() => router.replace("/login")}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}