'use client'

import { useState } from 'react'
import { PlusCircleIcon, CheckCircleIcon } from '@heroicons/react/24/solid'

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, {
        id: Date.now(),
        text: input.trim(),
        completed: false
      }])
      setInput('')
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

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Todo App</h1>
        
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
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
              <span className={`flex-grow text-center ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.text}
              </span>
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