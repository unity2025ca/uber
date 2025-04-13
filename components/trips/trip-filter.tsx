"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface TripFilterProps {
  activeFilter: string
  setActiveFilter: (filter: string) => void
  dateRange: { from: Date | null; to: Date | null }
  setDateRange: (range: { from: Date | null; to: Date | null }) => void
}

export function TripFilter({ activeFilter, setActiveFilter, dateRange, setDateRange }: TripFilterProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  const handleSelect = (date: Date | undefined) => {
    if (!date) return

    const { from, to } = dateRange

    if (from && to) {
      // Reset the range if both dates are already selected
      setDateRange({ from: date, to: null })
    } else if (from) {
      // If only 'from' is selected, set 'to' date
      if (date < from) {
        // If the new date is before the 'from' date, swap them
        setDateRange({ from: date, to: from })
      } else {
        setDateRange({ from, to: date })
      }
    } else {
      // If no dates are selected, set 'from' date
      setDateRange({ from: date, to: null })
    }
  }

  const clearDateRange = () => {
    setDateRange({ from: null, to: null })
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full sm:w-auto">
            <TabsList className="grid grid-cols-3 w-full sm:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal w-full sm:w-auto",
                    !dateRange.from && !dateRange.to && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    "Select date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  selected={{ from: dateRange.from || undefined, to: dateRange.to || undefined }}
                  onSelect={(range) => {
                    setDateRange({
                      from: range?.from || null,
                      to: range?.to || null,
                    })
                  }}
                  numberOfMonths={2}
                  defaultMonth={dateRange.from || new Date()}
                />
                <div className="flex items-center justify-end gap-2 p-3 border-t">
                  <Button variant="outline" size="sm" onClick={clearDateRange}>
                    Clear
                  </Button>
                  <Button size="sm" onClick={() => setIsCalendarOpen(false)}>
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {(dateRange.from || dateRange.to) && (
              <Button variant="ghost" size="icon" onClick={clearDateRange} className="h-8 w-8">
                <X className="h-4 w-4" />
                <span className="sr-only">Clear date range</span>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
