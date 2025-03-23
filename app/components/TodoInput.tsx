'use client'

import { useState, KeyboardEvent } from 'react'
import { PlusCircleIcon } from '@heroicons/react/24/solid'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

interface TodoInputProps {
  onAdd: (text: string, dueDate: Date | null) => void;
}

export default function TodoInput({ onAdd }: TodoInputProps) {
  const [input, setInput] = useState('')
  const [dueDate, setDueDate] = useState<Date | null>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  const handleAdd = () => {
    if (input.trim()) {
      onAdd(input.trim(), dueDate)
      setInput('')
      setDueDate(null)
    }
  }

  return (
    <div className="flex flex-col gap-2 mb-8">
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new todo..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAdd}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <PlusCircleIcon className="w-6 h-6" />
        </button>
      </div>
      <DatePicker
        selected={dueDate}
        onChange={(date) => setDueDate(date)}
        placeholderText="Set due date and time (optional)"
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        minDate={new Date()}
        isClearable
        showTimeSelect
        timeFormat="hh:mm aa"
        timeIntervals={15}
        timeCaption="Time"
        dateFormat="MMM d, yyyy h:mm aa"
      />
    </div>
  )
} 