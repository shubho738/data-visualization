
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

import {signOutUser} from '../dataFetch/apiClient'

const SignOut = () => {

    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const {mutate} = useMutation({
        mutationFn: signOutUser,
        onSuccess: async() => {
            console.log("signed out!")
            navigate("/sign-in")
            await queryClient.invalidateQueries({queryKey: ["verifyToken"]})
        },
        onError: (err) => {
            console.error(err.message)
        }
    })

    const handleSignOut = () =>  mutate()

  return (
    <button onClick={handleSignOut} className="bg-sky-500 text-white px-4 py-1 rounded bg-slate-500 cursor-ponter">Sign Out</button>
  )
}

export default SignOut