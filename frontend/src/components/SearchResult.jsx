import React from 'react'
import { Search, X } from 'lucide-react'

const SearchResult = ({ 
  SearchInput, 
  setSearchInput, 
  handleSubmit, 
  onReset, 
  hasActiveSearch 
}) => {

  const SearchText = [
    'MERN Stack Development', 
    'React for Beginners', 
    'Advanced JavaScript', 
    'Node.js Essentials'
  ]

  return (
    <div className='bg-[#F7F7FB] border-b border-gray-200 flex items-center'>
      <div className='page-shell w-full flex flex-col items-center gap-6 py-8'>
        <form onSubmit={handleSubmit} className='w-full max-w-2xl flex items-center gap-4 justify-center'>
          <div className='relative flex-1'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]' />

            <input
              value={SearchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              type='text'
              placeholder='Search courses...'
              className='w-full pl-10 pr-10 py-3 rounded-xl'
            />

            {SearchInput && (
              <button
                type='button'
                onClick={() => setSearchInput('')}
                className='absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-lg transition-colors'
              >
                <X className='w-4 h-4 text-[#6B7280] hover:text-[#1F2937]' />
              </button>
            )}
          </div>

          <button type='submit' className='btn-primary'>
            Search
          </button>
        </form>

        <div className='flex flex-wrap justify-center gap-3'>
          {SearchText.map((item, index) => (
            <button
              key={index}
              onClick={() => setSearchInput(item)}
              className='btn-secondary'
            >
              {item}
            </button>
          ))}
        </div>

        {hasActiveSearch && (
          <button onClick={onReset} className='btn-secondary'>
            Reset filter
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchResult



