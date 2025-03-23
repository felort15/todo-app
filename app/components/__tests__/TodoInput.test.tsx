import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoInput from '../TodoInput'

describe('TodoInput', () => {
  const mockOnAdd = jest.fn()

  beforeEach(() => {
    mockOnAdd.mockClear()
  })

  it('renders input field and add button', () => {
    render(<TodoInput onAdd={mockOnAdd} />)
    
    expect(screen.getByPlaceholderText(/add a new todo/i)).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('adds a todo when clicking the add button', async () => {
    render(<TodoInput onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText(/add a new todo/i)
    const addButton = screen.getByRole('button')

    await userEvent.type(input, 'New todo')
    await userEvent.click(addButton)

    expect(mockOnAdd).toHaveBeenCalledWith('New todo', null)
    expect(input).toHaveValue('')
  })

  it('adds a todo when pressing Enter', async () => {
    render(<TodoInput onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText(/add a new todo/i)
    
    await userEvent.type(input, 'New todo')
    await userEvent.keyboard('{enter}')

    expect(mockOnAdd).toHaveBeenCalledWith('New todo', null)
    expect(input).toHaveValue('')
  })

  it('does not add empty todos', async () => {
    render(<TodoInput onAdd={mockOnAdd} />)
    
    const input = screen.getByPlaceholderText(/add a new todo/i)
    const addButton = screen.getByRole('button')

    await userEvent.click(addButton)
    expect(mockOnAdd).not.toHaveBeenCalled()
  })
}) 