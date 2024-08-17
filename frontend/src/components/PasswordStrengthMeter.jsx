import { Check, X } from 'lucide-react'

const PasswordCriteria = ({ password }) => {
  const criteria = [
    {
      label: 'At least 6 characters',
      met: password.length >= 6
    },
    {
      label: 'Contain uppercase letters',
      met: /[A-Z]/.test(password)
    },
    {
      label: 'Contain lowercase letters',
      met: /[a-z]/.test(password)
    },
    {
      label: 'Contain a number',
      met: /\d/.test(password)
    },
    {
      label: 'Contain a special character',
      met: /[^A-Za-z0-9]/.test(password)
    }
  ]

  return (
    <div className='mt-2 space-y-1'>
      {criteria.map((item) => (
        <div key={item.label} className='flex items-center text-xs'>
          {item.met ? (
            <Check className='size-4 text-green-500 mr-2' />
          ) : (
            <X className='size-4 text-gray-500 mr-2' />
          )}
          <span className={item.met ? 'text-green-500' : 'text-gray-500'}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  )
}

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = (pass) => {
    let strength = 0
    if (pass.length >= 6) strength++
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) strength++
    if (/\d/.test(pass)) strength++
    if (/[^A-Za-z\d]/.test(pass)) strength++
    return strength
  }

  const strength = getStrength(password)

  const getStrengthText = (strength) => {
    switch (strength) {
      case 0:
        return 'Very Weak'
      case 1:
        return 'Weak'
      case 2:
        return 'Fair'
      case 3:
        return 'Good'
      case 4:
        return 'Strong'
      default:
        return 'Very Weak'
    }
  }

  const getColor = (strength) => {
    if (strength === 0) return 'bg-red-500'
    if (strength === 1) return 'bg-red-400'
    if (strength === 2) return 'bg-yellow-500'
    if (strength === 3) return 'bg-yellow-400'
    return 'bg-green-500'
  }
  return (
    <div className='mt-2'>
      <div className='flex items-center mb-1b justify-between mb-1'>
        <span className='text-xs text-gray-400'>Password strength</span>
        <span className='text-xs text-gray-400'>
          {getStrengthText(strength)}
        </span>
      </div>

      <div className='flex space-x-1'>
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`h-1 w-1/4 rounded-full transition-colors duration-300 ${
              index < strength ? getColor(strength) : 'bg-gray-600'
            }`}></div>
        ))}
      </div>
      <PasswordCriteria password={password} />
    </div>
  )
}

export default PasswordStrengthMeter
