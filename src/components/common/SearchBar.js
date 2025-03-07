import { useState } from "react"
import "../../styles/SearchBar.css"

const SearchBar = ({ placeholder, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("")

  const handleChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  const handleClear = () => {
    setSearchTerm("")
    onSearch("")
  }

  return (
    <div className="search-bar">
      <input type="text" placeholder={placeholder || "Search..."} value={searchTerm} onChange={handleChange} />
      {searchTerm && (
        <button className="clear-search" onClick={handleClear}>
          ×
        </button>
      )}
    </div>
  )
}

export default SearchBar

