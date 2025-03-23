'use client'

import { useState, useEffect } from 'react'
import TodoInput from './components/TodoInput'
import TodoList from './components/TodoList'
import NotificationBanner from './components/NotificationBanner'
import { Toaster } from 'react-hot-toast'

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate: Date | null;
  notified?: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
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

  const addTodo = (text: string, dueDate: Date | null) => {
    setTodos([...todos, {
      id: Date.now(),
      text,
      completed: false,
      dueDate
    }])
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
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
        
        <NotificationBanner enabled={notificationsEnabled} />
        <TodoInput onAdd={addTodo} />
        <TodoList 
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
        <Toaster />
      </div>
    </main>
  )
} 