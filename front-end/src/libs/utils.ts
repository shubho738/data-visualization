
import { type Filter, type DateRange } from "../dataFetch/apiClient"

export const generateShareableUrl = (baseUrl: string, filters: Filter, dateRange: DateRange) => {
    const params = new URLSearchParams()
    if (filters.age) params.append('age', filters.age)
    if (filters.gender) params.append('gender', filters.gender)
    if (dateRange.startDate) params.append('startDate', dateRange.startDate)
    if (dateRange.endDate) params.append('endDate', dateRange.endDate)
    return `${baseUrl}/dashboard?${params.toString()}`
  }