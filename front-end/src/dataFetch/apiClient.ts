
import axios from 'axios'
import { RegisterFormData } from '../pages/Register'
import { SignInFormData } from '../pages/SignIn'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''


export const registerUser = async (formData: RegisterFormData) => {

  try {
    await axios.post(`${API_BASE_URL}/auth/register`, {
      ...formData
    }, {
      withCredentials: true
    })
  }

  catch(err: any) {

    if (err.response && err.response.data) {
      throw new Error(err.response.data.message)
    }

    throw new Error('Registration failed.')
  }
}


export const signInUser = async (formData: SignInFormData) => {

  try {
    await axios.post(`${API_BASE_URL}/auth/sign-in`, {
      ...formData
    }, {
      withCredentials: true
    })
  }

  catch(err: any) {

    if (err.response && err.response.data) {
      throw new Error(err.response.data.error)
    }

    throw new Error('Sign in failed.')
  }
}

export const signOutUser = async () => {

  try {
    await axios.post(`${API_BASE_URL}/auth/sign-out`, {}, {
      withCredentials: true
    })
  }

  catch(err: any) {

    if (err.response && err.response.data) {
      throw new Error(err.response.data.error)
    }

    throw new Error("Sign out failed.")
  }
}



export const verifyToken = async () => {

  try {
    const res = await axios.get(`${API_BASE_URL}/auth/verify-token`, {
      withCredentials: true
    })
    return res.data
  }

  catch(err: any) {
  
    if (err.response && err.response.data) {
      throw new Error(err.response.data.error)
    }

    throw new Error('Unauthorized.')
  }
}



export type Filter = {
  age?: string; 
  gender?: string;
}

export type DateRange = {
  startDate?: string; 
  endDate?: string;
}


export const fetchAnalyticsData = async (filters: Filter, dateRange: DateRange) => {

  try {
    const params = {
      ...filters,
      ...dateRange
    }

    const res = await axios.get(`${API_BASE_URL}/data`, {params})
    
    return res.data
  }

  catch(err: any) {
  
    if (err.response && err.response.data) {
      throw new Error(err.response.data.error)
    }

    throw new Error('Error fetching data.')
  }
}



export const savePreferences = async (filters: Filter, dateRange: DateRange) => {

  try {

    const res = await axios.post(`${API_BASE_URL}/preferences`, {filters, dateRange}, 
    {withCredentials: true})
    
    return res.data
  }

  catch(err: any) {
  
    if (err.response && err.response.data) {
      throw new Error(err.response.data.error)
    }

    throw new Error('Error saving preferences.')
  }
}


export const fetchPreferences = async () => {

  try {

    const res = await axios.get(`${API_BASE_URL}/preferences`, {withCredentials: true})
    
    return res.data
  }

  catch(err: any) {
  
    if (err.response && err.response.data) {
      throw new Error(err.response.data.error)
    }

    throw new Error('Error fetching preferences.')
  }
}


export const clearPreferences = async () => {

  try {

    await axios.delete(`${API_BASE_URL}/preferences`, {withCredentials: true})
  }

  catch(err: any) {
  
    if (err.response && err.response.data) {
      throw new Error(err.response.data.error)
    }

    throw new Error('Error clearing preferences cookie.')
  }
}