// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  length: 0,
  key: jest.fn(),
}
global.localStorage = localStorageMock

// Mock Notification API
global.Notification = {
  requestPermission: jest.fn(),
  permission: 'default',
} 