import React from 'react'
const Search = ({searchTerm,setSearchTerm}) => {

  return (
    <div className="search">
      <img src='src/assets/search1.svg' alt='search'/>
      <input 
        type="text"
        placeholder="Search for movies, shows, and more"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="font-bold text-lg text-white"
      />

    </div>
  )
}

export default Search
