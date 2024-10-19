
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'

import { registerUser } from '../dataFetch/apiClient'

export type RegisterFormData = {
  email: string
  password: string
  confirmPassword: string
}

const RegisterPage = () => {

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>()

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: async () => {
      toast.success('Registration successful!')
      await queryClient.invalidateQueries({queryKey: ["verifyToken"]})
      navigate('/')
    },
    onError: () => {
      toast.error('There was an error during registration.')
    },
  })

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data)
  })

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 | container">
      <section className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Create an Account</h1>
        
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label htmlFor="email" className="mb-1">Email</label>
            <input
              type="email"
              id="email"
              {...register('email', { required: 'Email is required' })}
              className="border-2 p-2 rounded"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email.message}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="mb-1">Password</label>
            <input
              type="password"
              id="password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long',
                },
              })}
              className="border-2 p-2 rounded"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password.message}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="confirmPassword" className="mb-1">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', {
                validate: (value) => value === watch('password') || 'Passwords do not match',
                required: 'Please confirm your password',
              })}
              className="border-2 p-2 rounded"
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Registering...' : 'Register'}
          </button>
        </form>

        {mutation.isError && (
          <p className="text-red-500 text-center mt-4">
            Registration failed. Please try again.
          </p>
        )}

        <p className="text-center mt-4">
          Already have an account?{' '}
          <Link to="/sign-in" className="text-sky-500 hover:underline">
            Sign in here
          </Link>
        </p>
      </section>
    </main>
  )
}

export default RegisterPage
