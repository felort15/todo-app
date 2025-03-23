'use client'

import { CheckCircleIcon, CalendarIcon, TrashIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate: Date | null;
  notified?: boolean;
}

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
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

  const handleToggle = () => {
    onToggle(todo.id)
    if (!todo.completed) {
      toast.success(`Completed: ${todo.text}`, {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#10B981',
          color: '#fff',
        },
      })
    }
  }

  return (
    <li className="p-4 bg-white rounded-lg shadow flex items-center justify-between gap-3">
      <button
        onClick={handleToggle}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
          todo.completed 
            ? 'border-green-500 bg-green-500 text-white' 
            : 'border-gray-300 hover:border-green-500'
        }`}
        aria-label="Toggle todo"
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
        onClick={() => onDelete(todo.id)}
        className="flex-shrink-0 text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
        aria-label="Delete todo"
      >
        <TrashIcon className="w-5 h-5" />
      </button>
    </li>
  )
} 