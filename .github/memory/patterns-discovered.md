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
