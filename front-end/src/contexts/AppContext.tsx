

import React from 'react'
import { useQuery } from '@tanstack/react-query'

import {verifyToken} from '../dataFetch/apiClient'


type AppContextType = {
  isSignedIn: boolean;
}

const AppContext = React.createContext<AppContextType | undefined>(undefined)


export const AppContextProvider = ({children}: {children: React.ReactNode}) => {

  const {isError} = useQuery({queryKey: ["verifyToken"], queryFn: verifyToken})

  return (
    <AppContext.Provider value={{isSignedIn: !isError}}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppContext = () => {

  const context = React.useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider')
  }

  return context
}