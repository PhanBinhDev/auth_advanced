import { motion } from 'framer-motion'
import Input from '../components/Input'
import { Loader, Lock, Mail, User } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PasswordStrengthMeter from '../components/PasswordStrengthMeter'
import { useAuthStore } from '../store/authStore'
const SignUpPage = () => {
  const { signup, isLoading, error } = useAuthStore()
  const navigate = useNavigate()
  const handleSubmitSignup = async (event) => {
    event.preventDefault()
    // TODO: call signup API with form data
    try {
      await signup({ ...form })
      navigate('/verify-email')
    } catch (error) {
      console.log(error)
    }
  }
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: ''
  })
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
          Create Account
        </h2>
        <form onSubmit={handleSubmitSignup}>
          <Input
            icon={User}
            type='text'
            placeholder='Full Name'
            value={form.name}
            onChange={(e) => handleOnChange('name', e)}
          />
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
          {error && <p className='text-rose-500 font-semibold mt-2'>{error}</p>}
          <PasswordStrengthMeter password={form.password} />
          <motion.button
            disabled={
              isLoading ||
              Object.values(form).some((value) => value.trim() === '')
            }
            whileTap={{
              scale: 0.95
            }}
            whileHover={{ scale: 1.05 }}
            className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-default'>
            {isLoading ? (
              <Loader className='size-6 animate-spin mx-auto' />
            ) : (
              'Sign In'
            )}
          </motion.button>
        </form>
      </div>

      <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
        <p className='text-sm text-gray-400'>
          Already have an account?{' '}
          <Link
            to={'/login'}
            className='text-green-400 hover:text-green-500 hover:underline'>
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  )
}

export default SignUpPage
