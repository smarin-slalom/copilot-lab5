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
