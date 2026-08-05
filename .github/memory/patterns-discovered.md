# Code Patterns Discovered

> **Purpose**: Catalog of recurring code patterns, gotchas, and solutions discovered during development. Add patterns when you find reusable solutions or encounter repeated problems.

---

## Pattern Template

```markdown
### Pattern: [Pattern Name]

**Context**: [When/where this pattern applies]

**Problem**: [The challenge or issue this pattern addresses]

**Solution**: [The approach that works]

**Example**:
```language
// Code example demonstrating the pattern
```

**Related Files**:
- `path/to/file.js` - [Where this pattern is used]
- `path/to/test.js` - [Test implementation]

**Notes**: [Additional considerations, trade-offs, or edge cases]
```

---

## Patterns

### Pattern: Service Initialization with Empty Array vs Null

**Context**: Initializing in-memory storage for REST API services (e.g., TODO service)

**Problem**: When initializing a service that stores items in memory, choosing between an empty array `[]` and `null` affects how the service handles initial state and subsequent operations.

**Solution**: Use an empty array `[]` for in-memory collections to:
- Avoid null checks in service methods
- Enable immediate use of array methods (`.find()`, `.filter()`, `.map()`)
- Match REST API semantics (empty collection is valid state)
- Simplify test setup (no need to initialize before use)

**Example**:
```javascript
// ✅ Good: Empty array initialization
class TodoService {
  constructor() {
    this.todos = []; // Ready for immediate use
  }
  
  getAll() {
    return this.todos; // Returns [] on first call, not null
  }
  
  add(todo) {
    this.todos.push(todo); // No null check needed
  }
}

// ❌ Avoid: Null initialization
class TodoService {
  constructor() {
    this.todos = null; // Requires null checks everywhere
  }
  
  getAll() {
    return this.todos || []; // Defensive coding needed
  }
  
  add(todo) {
    if (!this.todos) this.todos = []; // Must initialize first
    this.todos.push(todo);
  }
}
```

**Related Files**:
- `packages/backend/src/services/todoService.js` - Service implementation
- `packages/backend/__tests__/services/todoService.test.js` - Test coverage

**Notes**: 
- This pattern applies to any in-memory collection storage
- For database-backed services, null might indicate "not yet loaded" which is different
- Empty array is JSON-serializable and matches API contract for empty collections
- Tests are simpler when services are ready to use immediately after construction

---

### Pattern: Array-Based CRUD Delete Operation

**Context**: Deleting items from in-memory array storage in REST APIs

**Problem**: Need to find and remove an item from an array by ID, returning appropriate status codes (200 with deleted item, or 404 if not found)

**Solution**: Use `findIndex()` to locate the item, check for -1 (not found), then use `splice()` to remove and return it.

**Example**:
```javascript
// ✅ Good: findIndex + splice pattern
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);
  
  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  const deleted = todos.splice(index, 1)[0];
  res.json(deleted);
});

// ❌ Avoid: Using filter (doesn't return deleted item)
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const originalLength = todos.length;
  todos = todos.filter((t) => t.id !== id);
  
  if (todos.length === originalLength) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  res.json({}); // Can't return the deleted item!
});
```

**Related Files**:
- `packages/backend/src/app.js` - DELETE endpoint implementation
- `packages/backend/__tests__/app.test.js` - DELETE endpoint tests

**Notes**:
- `findIndex()` returns -1 if not found (clear indicator for 404 response)
- `splice(index, 1)` returns array of removed elements - use `[0]` to get the item
- This pattern allows returning the deleted item in response (useful for undo operations)
- More efficient than `filter()` which creates a new array
- Pattern applies to any array-based delete operation

---

### Pattern: Boolean Toggle Implementation

**Context**: Toggling boolean state in REST API endpoints (e.g., completed status)

**Problem**: Need to toggle a boolean value from true to false and vice versa

**Solution**: Use the logical NOT operator (`!`) to toggle the current value

**Example**:
```javascript
// ✅ Good: Toggle using logical NOT
app.patch('/api/todos/:id/toggle', (req, res) => {
  const todo = todos.find((t) => t.id === id);
  todo.completed = !todo.completed;  // Toggles true ↔ false
  res.json(todo);
});

// ❌ Avoid: Always setting to same value
app.patch('/api/todos/:id/toggle', (req, res) => {
  const todo = todos.find((t) => t.id === id);
  todo.completed = true;  // Bug: always sets to true
  res.json(todo);
});

// ❌ Avoid: Overly complex toggle logic
app.patch('/api/todos/:id/toggle', (req, res) => {
  const todo = todos.find((t) => t.id === id);
  if (todo.completed) {
    todo.completed = false;
  } else {
    todo.completed = true;
  }
  res.json(todo);
});
```

**Related Files**:
- `packages/backend/src/app.js` - PATCH /api/todos/:id/toggle endpoint
- `packages/backend/__tests__/app.test.js` - Toggle tests

**Notes**:
- `!value` is the idiomatic way to toggle booleans in JavaScript
- Clear, concise, and impossible to get wrong
- Works regardless of current state
- Avoids unnecessary if/else branching
- Pattern applies to any boolean toggle operation (dark mode, visibility, enabled/disabled, etc.)

---

### Pattern: React Query Delete Mutation with Error Handling

**Context**: Implementing delete functionality in React Query for API mutations

**Problem**: Need to call DELETE API endpoint and handle errors gracefully while invalidating cache on success

**Solution**: Use `useMutation` with async `mutationFn`, check `response.ok`, throw errors, and invalidate queries in `onSuccess`

**Example**:
```javascript
// ✅ Good: Complete delete mutation with error handling
const deleteTodoMutation = useMutation({
  mutationFn: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }
    return response.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});

// ❌ Avoid: Missing error handling
const deleteTodoMutation = useMutation({
  mutationFn: async (id) => {
    console.log('Delete todo:', id);
    // No actual API call!
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['todos'] });
  },
});
```

**Related Files**:
- `packages/frontend/src/App.js` - Delete mutation implementation
- `packages/frontend/src/__tests__/App.test.js` - Delete mutation tests

**Notes**:
- Always check `response.ok` before processing response
- Throw errors to trigger React Query's error handling
- Use `invalidateQueries` to refetch data after mutation
- Pattern applies to all destructive mutations (DELETE, but also PUT/PATCH that remove data)

---

### Pattern: Array Filter for Calculated Stats

**Context**: Displaying statistics derived from an array of items (e.g., todo counts)

**Problem**: Need to calculate and display counts of items matching certain criteria (incomplete vs completed)

**Solution**: Use `Array.filter()` with a predicate to count items, accessing the `.length` property

**Example**:
```javascript
// ✅ Good: Calculate stats from array
const incompleteTodos = todos.filter(todo => !todo.completed).length;
const completedTodos = todos.filter(todo => todo.completed).length;

<Chip label={`${incompleteTodos} items left`} color="primary" />
<Chip label={`${completedTodos} completed`} color="success" />

// ❌ Avoid: Hardcoded values
<Chip label={`${0} items left`} color="primary" />
<Chip label={`${0} completed`} color="success" />

// ❌ Avoid: Manual counting with loops
let incompleteTodos = 0;
for (let i = 0; i < todos.length; i++) {
  if (!todos[i].completed) {
    incompleteTodos++;
  }
}
```

**Related Files**:
- `packages/frontend/src/App.js` - Stats calculation implementation
- `packages/frontend/src/__tests__/App.test.js` - Stats display tests

**Notes**:
- `filter()` + `.length` is idiomatic JavaScript for counting
- More declarative than imperative loops
- Easy to test and verify
- Can be memoized with `useMemo()` if performance is a concern
- Pattern applies to any derived statistics from array data

---

### Pattern: Conditional Empty State Rendering in React

**Context**: Displaying helpful messages when data arrays are empty in UI components

**Problem**: Empty state (no data) can confuse users - need to show guidance instead of blank screen

**Solution**: Use conditional rendering with logical AND (`&&`) to show empty state message when array is empty

**Example**:
```javascript
// ✅ Good: Conditional empty state
{!isLoading && !isError && todos.length === 0 && (
  <Card sx={{ mb: 3 }}>
    <CardContent>
      <Typography align="center" color="text.secondary">
        No todos yet. Add one to get started!
      </Typography>
    </CardContent>
  </Card>
)}

{!isLoading && !isError && todos.length > 0 && (
  <Card>
    <List>
      {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
    </List>
  </Card>
)}

// ❌ Avoid: No empty state handling
<Card>
  <List>
    {todos.map(todo => <TodoItem key={todo.id} todo={todo} />)}
  </List>
</Card>
```

**Related Files**:
- `packages/frontend/src/App.js` - Empty state implementation
- `packages/frontend/src/__tests__/App.test.js` - Empty state test

**Notes**:
- Check loading and error states before showing empty state
- Provide actionable guidance (e.g., "Add one to get started!")
- Use semantic HTML and accessible typography
- Pattern applies to any list/collection display in React
- Consider adding illustrations or call-to-action buttons for better UX

---

### Pattern: Error Handling in React Query useQuery

**Context**: Fetching data from API using React Query with proper error handling

**Problem**: Network failures or API errors should be caught and displayed to users gracefully

**Solution**: Check `response.ok`, throw errors in `queryFn`, and use `isError`/`error` from `useQuery` result

**Example**:
```javascript
// ✅ Good: Complete error handling
const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }
      return response.json();
    },
  });
};

// In component:
const { data: todos = [], isLoading, isError, error } = useTodos();

{isError && (
  <Card>
    <CardContent>
      <Typography color="error" align="center">
        Error loading todos: {error.message}
      </Typography>
    </CardContent>
  </Card>
)}

// ❌ Avoid: Missing error checks
const useTodos = () => {
  return useQuery({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await fetch(API_URL);
      const data = await response.json(); // Might fail!
      return data;
    },
  });
};
```

**Related Files**:
- `packages/frontend/src/App.js` - useQuery with error handling
- `packages/frontend/src/__tests__/App.test.js` - Query tests

**Notes**:
- Always check `response.ok` before calling `.json()`
- Throw errors to trigger React Query's error state
- Display error messages to users in accessible way
- React Query provides retry logic by default
- Pattern applies to all data fetching with React Query

---

### Pattern: Relative API URLs for Environment Portability

**Context**: Configuring API URLs in frontend applications that may run in different environments

**Problem**: Hardcoded absolute URLs (e.g., `http://localhost:3001`) break when deployed or in different environments

**Solution**: Use relative URLs (e.g., `/api/todos`) and rely on proxy configuration in development

**Example**:
```javascript
// ✅ Good: Relative URL
const API_URL = '/api/todos';

// Works with proxy in package.json:
// "proxy": "http://localhost:3001"

// ❌ Avoid: Hardcoded absolute URL
const API_URL = 'http://localhost:3001/api/todos';
```

**Related Files**:
- `packages/frontend/src/App.js` - API URL configuration
- `packages/frontend/package.json` - Proxy configuration

**Notes**:
- Relative URLs work with development proxy and production same-origin deployment
- For different origins in production, use environment variables: `process.env.REACT_APP_API_URL`
- Development proxy configured in frontend package.json
- Pattern applies to all frontend API configurations
- Makes app portable across environments without code changes

---

### Pattern: [Your Next Pattern]

**Context**: 

**Problem**: 

**Solution**: 

**Example**:
```javascript
// Your code example
```

**Related Files**:
- 

**Notes**: 
