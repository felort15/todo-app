'use client'

import { useState, useEffect, KeyboardEvent } from 'react'
import { PlusCircleIcon, CheckCircleIcon, CalendarIcon } from '@heroicons/react/24/solid'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate: Date | null;
  notified?: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [dueDate, setDueDate] = useState<Date | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        setNotificationsEnabled(permission === "granted")
      })
    }
  }, [])

  // Check for due dates every minute
  useEffect(() => {
    const checkDueDates = () => {
      const now = new Date()
      todos.forEach(todo => {
        if (todo.dueDate && !todo.completed && !todo.notified) {
          const dueTime = new Date(todo.dueDate).getTime()
          const timeUntilDue = dueTime - now.getTime()
          
          // Notify if due in 30 minutes or less
          if (timeUntilDue <= 30 * 60 * 1000 && timeUntilDue > 0) {
            if (notificationsEnabled) {
              new Notification("Todo Due Soon!", {
                body: `"${todo.text}" is due in ${Math.round(timeUntilDue / 60000)} minutes`,
                icon: "/favicon.ico"
              })
              // Mark as notified
              setTodos(prev => prev.map(t => 
                t.id === todo.id ? { ...t, notified: true } : t
              ))
            }
          }
        }
      })
    }

    const interval = setInterval(checkDueDates, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [todos, notificationsEnabled])

  // Load todos from localStorage
  useEffect(() => {
    try {
      const storedTodos = localStorage.getItem('todos')
      if (storedTodos) {
        const parsedTodos = JSON.parse(storedTodos)
        setTodos(parsedTodos.map((todo: any) => ({
          ...todo,
          dueDate: todo.dueDate ? new Date(todo.dueDate) : null
        })))
      }
    } catch (error) {
      console.warn('Error reading from localStorage:', error)
    }
    setIsLoading(false)
  }, [])

  // Save todos to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('todos', JSON.stringify(todos))
    }
  }, [todos, isLoading])

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: input.trim(),
        completed: false,
        dueDate: dueDate
      }])
      setInput('')
      setDueDate(null)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTodo()
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date)
  }

  if (isLoading) {
    return (
      <main className="min-h-screen p-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">Todo App</h1>
          <div className="flex justify-center">
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Todo App</h1>
        
        {!notificationsEnabled && (
          <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg">
            Please enable notifications to receive due date reminders
          </div>
        )}

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
              onClick={addTodo}
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

        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="p-4 bg-white rounded-lg shadow flex items-center justify-between gap-3"
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  todo.completed 
                    ? 'border-green-500 bg-green-500 text-white' 
                    : 'border-gray-300 hover:border-green-500'
                }`}
              >
                {todo.completed && <CheckCircleIcon className="w-5 h-5" />}
              </button>
              <div className="flex-grow flex flex-col items-center">
                <span className={`text-center ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                  {todo.text}
                </span>
                {todo.dueDate && (
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <CalendarIcon className="w-4 h-4" />
                    {formatDate(todo.dueDate)}
                  </span>
                )}
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="flex-shrink-0 text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
} 