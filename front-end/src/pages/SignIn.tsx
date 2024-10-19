
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'

import { signInUser } from '../dataFetch/apiClient'

export type SignInFormData = {
  email: string
  password: string
}

const SignInPage = () => {

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>()

  const mutation = useMutation({
    mutationFn: signInUser,
    onSuccess: async () => {
      toast.success('Sign-in successful!')
      await queryClient.invalidateQueries({queryKey: ["verifyToken"]})
      navigate('/')
    },
    onError: () => {
      toast.error('There was an error during sign-in.')
    },
  })

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data)
  })

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 | container">
      <section className="w-full max-w-md p-6 bg-white shadow-md rounded-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Sign In</h1>
        
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
              {...register('password', { required: 'Password is required' })}
              className="border-2 p-2 rounded"
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="bg-sky-500 text-white py-2 rounded-md hover:bg-sky-600"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {mutation.isError && (
          <p className="text-red-500 text-center mt-4">
            Sign-in failed. Please try again.
          </p>
        )}

        <p className="text-center mt-4">
          Don't have an account?{' '}
          <Link to="/register" className="text-sky-500 hover:underline">
            Register here
          </Link>
        </p>
      </section>
    </main>
  )
}

export default SignInPage
