import { render, screen, fireEvent } from '@testing-library/react'
import TodoItem from '../TodoItem'

describe('TodoItem', () => {
  const mockTodo = {
    id: 1,
    text: 'Test todo',
    completed: false,
    dueDate: new Date('2024-12-31T12:00:00'),
  }

  const mockOnToggle = jest.fn()
  const mockOnDelete = jest.fn()

  beforeEach(() => {
    mockOnToggle.mockClear()
    mockOnDelete.mockClear()
  })

  it('renders todo text and due date', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('Test todo')).toBeInTheDocument()
    expect(screen.getByText(/Dec 31, 2024/i)).toBeInTheDocument()
  })

  it('toggles completion when clicking the checkbox', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    const checkbox = screen.getByRole('button', { name: /toggle todo/i })
    fireEvent.click(checkbox)

    expect(mockOnToggle).toHaveBeenCalledWith(1)
  })

  it('deletes todo when clicking delete button', () => {
    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    const deleteButton = screen.getByRole('button', { name: /delete todo/i })
    fireEvent.click(deleteButton)

    expect(mockOnDelete).toHaveBeenCalledWith(1)
  })

  it('shows completed state correctly', () => {
    const completedTodo = { ...mockTodo, completed: true }
    
    render(
      <TodoItem
        todo={completedTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('Test todo')).toHaveClass('line-through')
    expect(screen.getByText('Test todo')).toHaveClass('text-gray-500')
  })
}) 