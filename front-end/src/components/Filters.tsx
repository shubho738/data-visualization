
import React from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

import { type Filter, type DateRange } from '../dataFetch/apiClient'
import { savePreferences, fetchPreferences, clearPreferences } from '../dataFetch/apiClient'
import { generateShareableUrl } from '../libs/utils'

type Props = {
  setFilters: (filters: Filter) => void;
  setDateRange: (dateRange: DateRange) => void;
  filters: Filter;
  dateRange: DateRange; 
}

const Filters = ({ setFilters, setDateRange, filters, dateRange}: Props) => {
  
  const [age, setAge] = React.useState<string | undefined>(sessionStorage.getItem('age') || undefined)
  const [gender, setGender] = React.useState<string | undefined>(sessionStorage.getItem('gender') || undefined)
  const [startDate, setStartDate] = React.useState<Date | null>(() => {
    const date = sessionStorage.getItem('startDate')
    return date ? new Date(date) : null
  })
  const [endDate, setEndDate] = React.useState<Date | null>(() => {
    const date = sessionStorage.getItem('endDate')
    return date ? new Date(date) : null
  })

  const [showMessage, setShowMessage] = React.useState(false)


  const { data: preferences, refetch } = useQuery({
    queryKey: ['fetchPreferences'],
    queryFn: fetchPreferences,
  })

  React.useEffect(() => {
    if (preferences) {
      if (!age && !gender && !startDate && !endDate) {
        setShowMessage(true)
      }
      const { filters: savedFilters, dateRange: savedDateRange } = preferences.preferences || {}
      if (savedFilters) {
        setFilters(savedFilters)
        
      }
      if (Object.keys(savedDateRange).length > 0) {
        setDateRange(savedDateRange)
        
      }

    }
  }, [preferences, setFilters, setDateRange])

 
  const { mutate } = useMutation({
    mutationFn: async () => {
      const filters = { age, gender }
      const dateRange = {
        startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
        endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
      }
      return await savePreferences(filters, dateRange)
    },
    onSuccess: () => {
      console.log('Preferences saved successfully')
      refetch()
    },
    onError: (error) => {
      console.log('Error saving preferences:', error)
    },
  })

  const applyFilters = () => {
    setShowMessage(false)

    const filters = { age, gender }
    setFilters(filters)

    sessionStorage.setItem('age', age || '')
    sessionStorage.setItem('gender', gender || '')
    sessionStorage.setItem('startDate', startDate ? startDate.toISOString() : '')
    sessionStorage.setItem('endDate', endDate ? endDate.toISOString() : '')

    if (startDate && endDate) {
      const formattedStartDate = format(startDate, 'yyyy-MM-dd')
      const formattedEndDate = format(endDate, 'yyyy-MM-dd')
      setDateRange({ startDate: formattedStartDate, endDate: formattedEndDate })
    }

    mutate()
  }


  const resetPreferences = async () => {
    try {
      await clearPreferences()

      setShowMessage(false)

      console.log('Preferences cleared successfully')
    } 
    
    catch (error) {
      console.error('Error clearing preferences:', error);
    }
  }


  const handleShare = () => {
    const filters = { age, gender }

    const adjustedStartDate = startDate ? format(new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60000), 'yyyy-MM-dd') : ''
    const adjustedEndDate = endDate ? format(new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000), 'yyyy-MM-dd') : ''

    const shareableUrl = generateShareableUrl(window.location.origin, filters, { startDate: adjustedStartDate, endDate: adjustedEndDate })
    console.log('Shareable URL:', shareableUrl)
    navigator.clipboard.writeText(shareableUrl).then(() => {
      toast.success('Shareable URL copied to clipboard!')
    })
  }

  const isDisabled = !age && !gender && !(startDate && endDate)

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">Filters</h2>

      <p className="text-sm text-gray-600 mb-4">
        Note: Data is available only from <strong>04 Oct 2022</strong> to <strong>29 Oct 2022</strong>.
      </p>

      {showMessage && (
        <aside>
          <div className="bg-yellow-200 text-yellow-800 p-2 rounded mb-2">
            <span>Previous preferences saved in cookies are being used</span>.
            <button type="button" onClick={resetPreferences} className="bg-red-500 text-white ml-6 px-4 py-1 rounded">Reset</button>
          </div>
        </aside>
      )}

      <header className="flex flex-wrap gap-4 bg-slate-400 text-white py-4 px-2">
        <span className="text-base md:text-lg">Filters applied:</span>
        {filters.age && (
          <span className="text-sm md:text-base">Age: {filters.age}</span>
        )}
        {filters.gender && (
          <span className="text-sm md:text-base">Gender: {filters.gender.toUpperCase()}</span>
        )}
        {dateRange && (
          <span className="text-sm md:text-base">
            Date Range: {dateRange.startDate} -&gt; {dateRange.endDate}
          </span>
        )}
      </header>


      <div className="flex flex-wrap mt-8 mb-4">
        <div className="w-1/2 pr-2">
          <label htmlFor="age" className="block">Select Age:</label>
          <select
            id="age"
            value={age || ''}
            onChange={(e) => setAge(e.target.value || undefined)}
            className="block w-full border rounded p-2"
          >
            <option value="">Select Age</option>
            <option value="15-25">15-25</option>
            <option value=">25">&gt;25</option>
          </select>
        </div>

        <div className="w-1/2 pl-2">
          <label htmlFor="gender" className="block">Select Gender:</label>
          <select
            id="gender"
            value={gender || ''}
            onChange={(e) => setGender(e.target.value || undefined)}
            className="block w-full border rounded p-2"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap mb-4">
        <div className="w-1/2 pr-2">
          <label htmlFor="startDate" className="block">Start Date:</label>
          <DatePicker
            id="startDate"
            selected={startDate}
            onChange={(date: Date | null) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select Start Date"
            selectsStart
            startDate={startDate as Date | undefined}
            endDate={endDate as Date | undefined}
            showPopperArrow={false}
            showYearDropdown
            yearDropdownItemNumber={15}
            scrollableYearDropdown
            className="block w-full border rounded p-2"
          />
        </div>

        <div className="w-1/2 pl-2">
          <label htmlFor="endDate" className="block">End Date:</label>
          <DatePicker
            id="endDate"
            selected={endDate}
            onChange={(date: Date | null) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="Select End Date"
            selectsEnd
            startDate={startDate as Date | undefined}
            endDate={endDate as Date | undefined}
            showPopperArrow={false}
            showYearDropdown
            yearDropdownItemNumber={15}
            scrollableYearDropdown
            className="block w-full border rounded p-2"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={applyFilters}
          disabled={isDisabled}
          className="disabled:cursor-not-allowed bg-blue-500 text-white rounded py-2 px-4"
        >
          Apply Filters
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="bg-green-500 text-white rounded py-2 px-4"
        >
          Share Chart
        </button>
      </div>

    </section>
  )
}

export default Filters