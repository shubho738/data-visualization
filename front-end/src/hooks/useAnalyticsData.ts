
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import {format} from 'date-fns'

import { type Filter, type DateRange } from '../dataFetch/apiClient'
import { fetchAnalyticsData } from '../dataFetch/apiClient'

export type TransformedData = {
  feature: string
  totalTime: number
}

export type LineDataPoint = {
  date: string 
  value: number
}

export type LineData = Record<string, LineDataPoint[]> 

export const useAnalyticsData = (filters: Filter, dateRange: DateRange) => {
  
  const { data: analyticsData, isLoading, isError } = useQuery({
    queryKey: ['analyticsData', filters, dateRange],
    queryFn: () => fetchAnalyticsData(filters, dateRange),
  })


  const transformedData = useMemo<TransformedData[]>(() => {
    if (!analyticsData) return []

    return [
      { feature: 'A', totalTime: analyticsData.reduce((acc: number, item: any) => acc + item.a, 0) },
      { feature: 'B', totalTime: analyticsData.reduce((acc: number, item: any) => acc + item.b, 0) },
      { feature: 'C', totalTime: analyticsData.reduce((acc: number, item: any) => acc + item.c, 0) },
      { feature: 'D', totalTime: analyticsData.reduce((acc: number, item: any) => acc + item.d, 0) },
      { feature: 'E', totalTime: analyticsData.reduce((acc: number, item: any) => acc + item.e, 0) },
      { feature: 'F', totalTime: analyticsData.reduce((acc: number, item: any) => acc + item.f, 0) },
    ]
  }, [analyticsData])


  const lineData = useMemo<LineData>(() => {
    if (!analyticsData) return {}

    
    const lineDataAccumulation: LineData = {}

    analyticsData.forEach((item: any) => {
      const dateKey = item.date 
      const formattedDate = format(new Date(dateKey), 'MMM dd, yyyy')
      const features = ['a', 'b', 'c', 'd', 'e', 'f']

      features.forEach((feature) => {

        if (!lineDataAccumulation[feature]) {
          lineDataAccumulation[feature] = []
        }

      
        const existingPoint = lineDataAccumulation[feature].find(point => point.date === formattedDate)

        if (existingPoint) {
          
          existingPoint.value += item[feature] || 0
        } else {
          
          lineDataAccumulation[feature].push({
            date: formattedDate,
            value: item[feature] || 0,
          })
        }
      })
    })

    return lineDataAccumulation
  }, [analyticsData])

  return { transformedData, lineData, isLoading, isError }
}
