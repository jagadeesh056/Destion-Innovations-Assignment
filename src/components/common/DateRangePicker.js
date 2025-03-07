import { useState } from "react"
import "../../styles/DateRangePicker.css"

const DateRangePicker = ({ onChange }) => {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value
    setStartDate(newStartDate)

    if (newStartDate && endDate) {
      onChange({
        startDate: new Date(newStartDate),
        endDate: new Date(endDate),
      })
    } else if (!newStartDate && !endDate) {
      onChange({ startDate: null, endDate: null })
    }
  }

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value
    setEndDate(newEndDate)

    if (startDate && newEndDate) {
      onChange({
        startDate: new Date(startDate),
        endDate: new Date(newEndDate),
      })
    } else if (!startDate && !newEndDate) {
      onChange({ startDate: null, endDate: null })
    }
  }

  const clearDates = () => {
    setStartDate("")
    setEndDate("")
    onChange({ startDate: null, endDate: null })
  }

  return (
    <div className="date-range-picker">
      <div className="date-inputs">
        <div className="date-input-group">
          <label htmlFor="start-date">From:</label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={handleStartDateChange}
            max={endDate || undefined}
          />
        </div>
        <div className="date-input-group">
          <label htmlFor="end-date">To:</label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={handleEndDateChange}
            min={startDate || undefined}
          />
        </div>
      </div>
      {(startDate || endDate) && (
        <button className="clear-dates-btn" onClick={clearDates}>
          Clear
        </button>
      )}
    </div>
  )
}

export default DateRangePicker

