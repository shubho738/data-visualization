
import React from 'react'
import { useLocation } from 'react-router-dom'

import {type Filter, type DateRange} from '../dataFetch/apiClient'
import Filters from './Filters'
import Charts from './Charts'
import { useAnalyticsData } from '../hooks/useAnalyticsData'


const Dashboard = () => {

  const defaultEndDate = "2022-10-10"
  const defaultStartDate = "2022-10-10"

  const location = useLocation()
  const params = new URLSearchParams(location.search)

  const initialFilters: Filter = {
    age: params.get('age') || undefined,
    gender: params.get('gender') || undefined,
  };

  const initialDateRange: DateRange = {
    startDate: params.get('startDate') || defaultStartDate,
    endDate: params.get('endDate') || defaultEndDate,
  };

  const [filters, setFilters] =  React.useState<Filter>(initialFilters)
  const [dateRange, setDateRange] = React.useState<DateRange>(initialDateRange)

  console.log(filters, dateRange)


  const { transformedData, lineData, isLoading, isError } = useAnalyticsData(filters, dateRange)


  React.useEffect(() => {
    
    setFilters(initialFilters)
    setDateRange(initialDateRange)
  }, [location.search])


  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error fetching data</div>
  }

 
  return (
    <>
      <Filters setFilters={setFilters} setDateRange={setDateRange} filters={filters} dateRange={dateRange} />
      <Charts data={transformedData} lineData={lineData} />
    </>
  )
}

export default Dashboard
