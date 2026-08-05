import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

// Create a test query client
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

// Mock fetch for tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

test('renders TODO App heading', async () => {
  const testQueryClient = createTestQueryClient();

  render(
    <QueryClientProvider client={testQueryClient}>
      <App />
    </QueryClientProvider>
  );

  const headingElement = await screen.findByText(/TODO App/i);
  expect(headingElement).toBeInTheDocument();
});

describe('Delete functionality', () => {
  test('should call DELETE API when delete button is clicked', async () => {
    const testQueryClient = createTestQueryClient();
    const mockTodos = [
      { id: 1, title: 'Test Todo', completed: false, createdAt: '2024-01-01' },
    ];

    // Mock fetch to return a todo initially, then empty array after delete
    global.fetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTodos),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTodos[0]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
      });

    render(
      <QueryClientProvider client={testQueryClient}>
        <App />
      </QueryClientProvider>
    );

    // Wait for todo to appear
    const todoText = await screen.findByText('Test Todo');
    expect(todoText).toBeInTheDocument();

    // Find and click delete button using accessible query
    const deleteButtons = screen.getAllByRole('button');
    const deleteButton = deleteButtons[deleteButtons.length - 1]; // Last button is delete
    
    await userEvent.click(deleteButton);

    // Verify DELETE API was called
    await waitFor(() => {
      const deleteCalls = global.fetch.mock.calls.filter(
        (call) => call[1]?.method === 'DELETE'
      );
      expect(deleteCalls.length).toBeGreaterThan(0);
    });

    // Verify the DELETE call was to the correct endpoint
    const deleteCalls = global.fetch.mock.calls.filter(
      (call) => call[1]?.method === 'DELETE'
    );
    expect(deleteCalls[0][0]).toContain('/api/todos/1');
  });
});

describe('Stats calculation', () => {
  test('should display correct count of incomplete items', async () => {
    const testQueryClient = createTestQueryClient();
    const mockTodos = [
      { id: 1, title: 'Todo 1', completed: false },
      { id: 2, title: 'Todo 2', completed: false },
      { id: 3, title: 'Todo 3', completed: true },
    ];

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTodos),
    });

    render(
      <QueryClientProvider client={testQueryClient}>
        <App />
      </QueryClientProvider>
    );

    // Wait for stats to update
    await waitFor(() => {
      expect(screen.getByText('2 items left')).toBeInTheDocument();
    });
  });

  test('should display correct count of completed items', async () => {
    const testQueryClient = createTestQueryClient();
    const mockTodos = [
      { id: 1, title: 'Todo 1', completed: false },
      { id: 2, title: 'Todo 2', completed: true },
      { id: 3, title: 'Todo 3', completed: true },
    ];

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockTodos),
    });

    render(
      <QueryClientProvider client={testQueryClient}>
        <App />
      </QueryClientProvider>
    );

    // Wait for stats to update
    await waitFor(() => {
      expect(screen.getByText('2 completed')).toBeInTheDocument();
    });
  });
});

describe('Empty state', () => {
  test('should display empty state message when no todos exist', async () => {
    const testQueryClient = createTestQueryClient();

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });

    render(
      <QueryClientProvider client={testQueryClient}>
        <App />
      </QueryClientProvider>
    );

    // Wait for empty state message
    await waitFor(() => {
      expect(screen.getByText(/no todos yet/i)).toBeInTheDocument();
    });
  });
});

afterEach(() => {
  jest.clearAllMocks();
});
