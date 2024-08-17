import { Navigate, Route, Routes } from 'react-router-dom'

import { Toaster } from 'react-hot-toast'

import FloatingShape from './components/FloatingShape'

import LoginPage from './pages/LoginPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'
import DashboardPage from './pages/DashboardPage'
import LoadingSpinner from './components/LoadingSpinner'
import SignUpPage from './pages/SignupPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

// Protect routes that required authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) {
    return <Navigate to='/login' replace />
  }

  if (!user.isVerified) {
    return <Navigate to='/verify-email' replace />
  }

  return children
}

// Redirect authenticated user to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore()
  console.log({
    isAuthenticated,
    user
  })
  if (isAuthenticated && user.isVerified) {
    return <Navigate to='/' replace />
  }

  return children
}
function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth) {
    return <LoadingSpinner />
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-grey-900 via-green-900 to bg-emerald-900 flex items-center justify-center relative overflow-hidden'>
      <FloatingShape
        color='bg-green-500'
        size='w-64 h-64'
        top='-5%'
        left='10%'
        delay={0}
      />
      <FloatingShape
        color='bg-emerald-500'
        size='w-48 h-48'
        top='70%'
        left='80%'
        delay={5}
      />
      <FloatingShape
        color='bg-lime-500'
        size='w-32 h-32'
        top='-10%'
        left='-10%'
        delay={2}
      />
      <Routes>
        <Route
          path='/'
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/signup'
          element={
            <RedirectAuthenticatedUser>
              <SignUpPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path='/login'
          element={
            <RedirectAuthenticatedUser>
              <LoginPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <RedirectAuthenticatedUser>
              <ForgotPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path='/verify-email' element={<VerifyEmailPage />} />
        <Route
          path='/reset-password/:token'
          element={
            <RedirectAuthenticatedUser>
              <ResetPasswordPage />
            </RedirectAuthenticatedUser>
          }
        />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
      <Toaster />
    </div>
  )
}

export default App
