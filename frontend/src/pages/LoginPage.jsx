import { motion } from 'framer-motion'
import Input from '../components/Input'
import { Loader, Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'
const Login = () => {
  const { isLoading, login, error } = useAuthStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const handleSubmitLogin = async (event) => {
    event.preventDefault()
    try {
      await login({ ...form })
      navigate('/')
      toast.success('Login successful')
    } catch (error) {
      console.log(error)
    }
  }
  const handleOnChange = (type, e) => {
    setForm({ ...form, [type]: e.target.value })
  }
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='max-w-md w-full bg-gray-900 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
      <div className='p-8'>
        <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
          Login
        </h2>
        <form onSubmit={handleSubmitLogin}>
          <Input
            icon={Mail}
            type='email'
            placeholder='Email Address'
            value={form.email}
            onChange={(e) => handleOnChange('email', e)}
          />
          <Input
            icon={Lock}
            type='password'
            placeholder='Password'
            value={form.password}
            onChange={(e) => handleOnChange('password', e)}
          />
          <div className='flex items-center mb-6'>
            <Link
              to='/forgot-password'
              className='text-sm text-green-400 hover:underline'>
              Forgot password?
            </Link>
          </div>
          {error && (
            <p className='text-red-500 font-semibold text-xs mt-2'>{error}</p>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{
              scale: 0.95
            }}
            disabled={isLoading}
            className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 cursor-pointer'>
            {isLoading ? (
              <Loader className='size-6 animate-spin mx-auto' />
            ) : (
              'Login'
            )}
          </motion.button>
        </form>
      </div>

      <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
        <p className='text-sm text-gray-400'>
          Don&apos;t have an account?{' '}
          <Link
            to={'/signup'}
            className='text-green-400 hover:text-green-500 hover:underline'>
            Sign up
          </Link>
        </p>
      </div>
    </motion.div>
  )
}

export default Login
