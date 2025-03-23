import { render, screen, fireEvent } from '@testing-library/react'
import TodoList from '../TodoList'

describe('TodoList', () => {
  const mockTodos = [
    {
      id: 1,
      text: 'First todo',
      completed: false,
      dueDate: new Date('2024-12-31T12:00:00'),
    },
    {
      id: 2,
      text: 'Second todo',
      completed: true,
      dueDate: new Date('2024-12-31T13:00:00'),
    },
  ]

  const mockOnToggle = jest.fn()
  const mockOnDelete = jest.fn()

  beforeEach(() => {
    mockOnToggle.mockClear()
    mockOnDelete.mockClear()
  })

  it('renders all todos', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    expect(screen.getByText('First todo')).toBeInTheDocument()
    expect(screen.getByText('Second todo')).toBeInTheDocument()
  })

  it('renders correct number of todo items', () => {
    render(
      <TodoList
        todos={mockTodos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    const todoItems = screen.getAllByRole('listitem')
    expect(todoItems).toHaveLength(2)
  })

  it('handles empty todos array', () => {
    render(
      <TodoList
        todos={[]}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
      />
    )

    const todoItems = screen.queryAllByRole('listitem')
    expect(todoItems).toHaveLength(0)
  })
}) 