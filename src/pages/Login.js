"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "../api/axios"
import "../styles/auth.css"

const Login = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: "",
    password: "",
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await axios.get("/sanctum/csrf-cookie")
      const res = await axios.post("/api/auth/login", form)

      const user = res.data.data.user
      const token = res.data.data.token
      const role = user.roles?.[0]?.name || "Client"

      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("token", token)

      // Show success state briefly
      setSuccess(true)

      // Navigate based on role after a short delay
      setTimeout(() => {
        if (role === "Admin") {
          navigate("/admin")
        } else if (role === "Expert") {
          navigate("/expert")
        } else {
          navigate("/dashboard")
        }
      }, 1000)
    } catch (err) {
      console.error(err?.response?.data || err)
      setError(err?.response?.data?.message || "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="modern-auth-container">
      {/* Background decorative elements */}
      <div className="auth-background">
        <div className="floating-orb orb-1"></div>
        <div className="floating-orb orb-2"></div>
        <div className="floating-orb orb-3"></div>
      </div>

      <div className="modern-auth-card">
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" fill="currentColor" />
              </svg>
            </div>
          </div>
          <h2 className="auth-title">Repair Your Car</h2>
          <p className="auth-subtitle">Sign in to access your account</p>
        </div>

        <div className="auth-content">
          {/* Error Alert */}
          {error && (
            <div className="alert alert-error">
              <svg
                className="alert-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2" />
                <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Success Alert */}
          {success && (
            <div className="alert alert-success">
              <svg
                className="alert-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" fill="none" />
                <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
              <span>Login successful! Redirecting...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <svg
                  className="input-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
                <input
                  name="email"
                  type="email"
                  className="modern-input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <svg
                  className="input-icon"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle cx="12" cy="16" r="1" fill="currentColor" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" fill="none" />
                </svg>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="modern-input"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                      />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="form-options">
              <Link to="/forgot-password" className="forgot-link">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="modern-btn modern-btn-primary" disabled={isLoading || success}>
              {isLoading ? (
                <div className="btn-loading">
                  <div className="spinner"></div>
                  <span>Signing in...</span>
                </div>
              ) : success ? (
                <div className="btn-success">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2" fill="none" />
                    <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                  <span>Success!</span>
                </div>
              ) : (
                <div className="btn-content">
                  <span>Sign In</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" />
                    <polyline points="12,5 19,12 12,19" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              )}
            </button>
          </form>

          <div className="auth-footer">
            <span>Don't have an account? </span>
            <Link to="/register" className="register-link">
              Create one now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
