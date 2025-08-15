"use client"

import axios from "axios"
import { useEffect, useState } from "react"

export function AuthGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication status from localStorage
    const authStatus = localStorage.getItem("isAuthenticated")

    if (authStatus === "true") {
      setIsAuthenticated(true);

    } else {
      // Redirect to login if not authenticated
      window.location.href = "/login"
    }

    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return children
}

export function useAuth() {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated")
    const username = localStorage.getItem("username")

    if (authStatus === "true" && username) {
      setIsAuthenticated(true)
      setUser({ username })
    }
  }, [])

  const logout = async () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("userId")
    localStorage.removeItem("username")

    try {
      const res = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/logout`, {
        withCredentials: true
      });
      console.log("Response:", res);

    } catch (error) {
      console.error("ERROR: ", error)
    }
    window.location.href = "/"

  }

  return {
    user,
    isAuthenticated,
    logout,
  }
}
