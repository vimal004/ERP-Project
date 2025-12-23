import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

/**
 * LoginPage - Material Design 3 (Google Store Aesthetic)
 *
 * Design principles applied:
 * - Clean, calm, premium aesthetic
 * - Google Sans typography with proper hierarchy
 * - Surface-based card with subtle elevation
 * - Pill-shaped tabs and buttons
 * - Generous spacing (8dp grid)
 * - Subtle, smooth animations (200-250ms)
 */
const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("Admin");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login(email, password, role);

      if (result.success) {
        navigate("/home");
      } else {
        setError(result.error || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col">
      {/* Main Content - Centered */}
      <main className="flex-1 flex items-center justify-center px-[24px] py-[48px]">
        <div className="w-full max-w-[440px] animate-fade-up">
          {/* Logo & Brand */}
          <div className="text-center mb-[40px]">
            {/* Google-style Logo */}
            <div className="inline-flex items-center justify-center w-[72px] h-[72px] bg-primary rounded-[20px] mb-[24px] shadow-elevation-2">
              <svg
                className="w-[40px] h-[40px] text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>

            {/* Headline - Large, confident, breathable */}
            <h1 className="text-headline-large text-onSurface mb-[8px]">
              Sign in
            </h1>
            <p className="text-body-large text-onSurface-variant">
              to continue to ERP System
            </p>
          </div>

          {/* Login Card */}
          <div
            className="p-10"
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "28px",
              boxShadow:
                "0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15)",
            }}
          >
            {/* Role Selector - Pill-style tabs with clear active state */}
            <div
              className="flex gap-2 p-1 mb-8"
              style={{
                backgroundColor: "#e8eaed",
                borderRadius: "9999px",
              }}
            >
              <button
                type="button"
                onClick={() => setRole("Admin")}
                style={{
                  backgroundColor: role === "Admin" ? "#1a73e8" : "transparent",
                  color: role === "Admin" ? "#ffffff" : "#5f6368",
                  borderRadius: "9999px",
                  fontWeight: 500,
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 text-sm transition-all duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
                Admin
              </button>
              <button
                type="button"
                onClick={() => setRole("User")}
                style={{
                  backgroundColor: role === "User" ? "#1a73e8" : "transparent",
                  color: role === "User" ? "#ffffff" : "#5f6368",
                  borderRadius: "9999px",
                  fontWeight: 500,
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 text-sm transition-all duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Staff
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-[24px] p-[16px] bg-error-container rounded-[12px] animate-fade-in">
                <p className="text-body-medium text-error text-center">
                  {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-[24px]">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-label-large text-onSurface mb-[8px]"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-[16px] py-[14px] bg-white text-onSurface text-body-large border border-outline rounded-[8px] placeholder-onSurface-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  placeholder="you@company.com"
                />
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-label-large text-onSurface mb-[8px]"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-[16px] py-[14px] pr-[48px] bg-white text-onSurface text-body-large border border-outline rounded-[8px] placeholder-onSurface-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-[16px] top-1/2 -translate-y-1/2 text-onSurface-muted hover:text-onSurface-variant transition-colors duration-200"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <svg
                        className="w-[20px] h-[20px]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-[20px] h-[20px]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-label-large text-primary hover:text-primary-dark transition-colors duration-200"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button - Pill-shaped, Google Blue */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: loading ? "#8ab4f8" : "#1a73e8",
                  borderRadius: "9999px",
                }}
                className={`w-full py-4 px-6 text-white font-medium text-sm transition-all duration-200 ${
                  loading
                    ? "cursor-not-allowed"
                    : "hover:brightness-90 active:scale-[0.98]"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <footer className="text-center mt-[40px]">
            <p className="text-body-small text-onSurface-muted">
              © 2024 ERP System. All rights reserved.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
