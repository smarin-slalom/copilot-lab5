# Development Memory System

## Purpose

This memory system tracks patterns, decisions, and lessons learned during development. It serves as a knowledge base that helps maintain context across development sessions and enables AI assistants to provide more context-aware suggestions.

## Two Types of Memory

### 1. Persistent Memory (`.github/copilot-instructions.md`)
- **What**: Foundational principles, coding standards, and established workflows
- **Lifecycle**: Rarely changes; defines the project's core approach
- **Examples**: TDD principles, testing scope, git workflow conventions
- **When to update**: When establishing new project-wide standards or guidelines

### 2. Working Memory (`.github/memory/` directory)
- **What**: Discoveries, patterns, and session-specific learnings
- **Lifecycle**: Evolves continuously as development progresses
- **Examples**: Bug patterns, API quirks, test strategies that worked
- **When to update**: During and after each development session

## Directory Structure

```
.github/memory/
├── README.md                    # This file - explains the system
├── session-notes.md             # Historical summaries of completed sessions (committed)
├── patterns-discovered.md       # Accumulated code patterns and learnings (committed)
└── scratch/
    ├── .gitignore              # Ignores all files in scratch/
    └── working-notes.md        # Active session notes (NOT committed)
```

### File Purposes

#### `session-notes.md` (Committed to Git)
- **Purpose**: Historical record of completed development sessions
- **Content**: Session summaries, accomplishments, key decisions, outcomes
- **Lifecycle**: Append-only; grows over time with each session summary
- **When to update**: At the end of each development session
- **Why committed**: Provides team-wide context and historical reference

#### `patterns-discovered.md` (Committed to Git)
- **Purpose**: Catalog of recurring code patterns, gotchas, and solutions
- **Content**: Pattern definitions with context, problems, solutions, and examples
- **Lifecycle**: Accumulates over time; patterns refined as understanding deepens
- **When to update**: When you discover a new pattern or refine an existing one
- **Why committed**: Shares knowledge across the team and prevents repeated mistakes

#### `scratch/working-notes.md` (NOT Committed to Git)
- **Purpose**: Active workspace for current session thinking and exploration
- **Content**: Current task, approach, findings, decisions, blockers, next steps
- **Lifecycle**: Temporary; reset or archived at end of session
- **When to update**: Continuously during active development
- **Why not committed**: Personal workspace; ephemeral thinking that's later distilled into session-notes.md

## When to Use Each File

### During TDD Workflow (Red-Green-Refactor)

1. **Before starting**: Review `patterns-discovered.md` for relevant test patterns
2. **During Red phase** (writing failing test):
   - Note test approach in `scratch/working-notes.md` → Current Task
   - Document any unexpected test setup in → Key Findings
3. **During Green phase** (implementing feature):
   - Track implementation decisions in → Decisions Made
   - Note any blockers in → Blockers
4. **During Refactor phase**:
   - If you discover a reusable pattern → Add to `patterns-discovered.md`
   - Document why you chose this approach → `scratch/working-notes.md` → Notes
5. **After completing feature**:
   - Summarize what worked → Add to `session-notes.md`

### During Linting and Code Quality Workflow

1. **Before fixing lint errors**: Check `patterns-discovered.md` for established fix patterns
2. **While categorizing errors**: Note patterns in `scratch/working-notes.md` → Key Findings
3. **After fixing**: If you found a systematic solution → Add to `patterns-discovered.md`
4. **If errors reveal deeper issues**: Document in `scratch/working-notes.md` → Decisions Made

### During Debugging Workflow

1. **When identifying issue**: Document symptoms in `scratch/working-notes.md` → Current Task
2. **While investigating**: Track hypotheses and findings → Key Findings
3. **When discovering root cause**: Document in → Decisions Made
4. **After fixing**: 
   - If it's a common gotcha → Add to `patterns-discovered.md`
   - Summarize the debug process → Include in `session-notes.md` at end of session

## How AI Reads and Applies These Patterns

### Context Discovery
When you ask an AI assistant for help, it will:
1. Read `.github/copilot-instructions.md` for foundational principles
2. Check `patterns-discovered.md` for relevant code patterns
3. Review recent entries in `session-notes.md` for project history
4. Consider your notes in `scratch/working-notes.md` (if you mention them) for current context

### Pattern Application
AI assistants use these files to:
- **Suggest solutions** that align with discovered patterns
- **Avoid known pitfalls** documented in patterns-discovered.md
- **Maintain consistency** with previous decisions in session-notes.md
- **Provide context-aware recommendations** based on your current task

### Best Practices for AI Collaboration
- **Be explicit**: When asking for help, mention relevant patterns or sessions
- **Update promptly**: Keep working-notes.md current so AI has fresh context
- **Document decisions**: Record why you chose an approach, not just what you did
- **Link related work**: Reference file paths and issue numbers in notes

## Workflow Example

### Session Start (9:00 AM)
```markdown
# scratch/working-notes.md

## Current Task
Implement delete functionality for TODO items (Issue #42)

## Approach
- TDD: Write DELETE /api/todos/:id test first
- Follow existing CRUD pattern from patterns-discovered.md
```

### During Development (10:30 AM)
```markdown
## Key Findings
- Need to handle 404 for non-existent IDs
- Should return deleted item in response (matches POST/PUT pattern)

## Decisions Made
- Using findIndex instead of find for delete operation
- Return 404 status code for not found (consistent with GET /:id)
```

### Discovery Moment (11:15 AM)
→ Add to `patterns-discovered.md`:
```markdown
### Pattern: Array-based CRUD Error Handling
**Context**: In-memory array storage without database
**Problem**: Need to handle not-found cases gracefully
**Solution**: Use findIndex to check existence before operation
```

### Session End (12:00 PM)
→ Summarize in `session-notes.md`:
```markdown
## Session: DELETE Endpoint Implementation (2026-08-05)

### Accomplished
- Implemented DELETE /api/todos/:id with TDD
- Added 404 error handling for non-existent items
- All tests passing

### Key Decisions
- Return deleted item in response for confirmation
- Use 404 status for not-found (not 204)
- Applied array-based CRUD pattern consistently

### Outcomes
- Feature complete and tested
- Pattern documented for future CRUD operations
```

→ Clear or archive `scratch/working-notes.md` for next session

## Difference Between session-notes.md and scratch/working-notes.md

### `session-notes.md` (Persistent Historical Record)
- **Content**: Completed, finalized session summaries
- **Audience**: Future you, team members, AI assistants
- **Style**: Polished, structured, outcome-focused
- **Git**: Committed and pushed to repository
- **Lifecycle**: Permanent; part of project history
- **Example entry**: "We implemented the DELETE endpoint using TDD, discovered a consistent error handling pattern, and documented it for future use."

### `scratch/working-notes.md` (Ephemeral Working Space)
- **Content**: Live, in-progress thinking and exploration
- **Audience**: Current you during active development
- **Style**: Raw, unstructured, process-focused
- **Git**: Ignored (not committed)
- **Lifecycle**: Temporary; reset after session ends
- **Example entry**: "Trying findIndex... wait, what about splice? Need to test both. Maybe filter is cleaner?"

**Think of it this way**: 
- `scratch/working-notes.md` = Your notepad while coding (scratchpad)
- `session-notes.md` = Your lab notebook entry after the experiment (documentation)

## Getting Started

### First Session
1. Read through `patterns-discovered.md` example
2. Open `scratch/working-notes.md` in a split pane
3. Start working and jot down findings as you go
4. At end of session, create your first entry in `session-notes.md`

### Subsequent Sessions
1. Review last entry in `session-notes.md` to recall context
2. Check `patterns-discovered.md` for relevant patterns
3. Clear/reset `scratch/working-notes.md` for new session
4. Continue the cycle

## Maintenance Tips

- **Keep it lightweight**: Don't let note-taking slow down development
- **Be consistent**: Make it a habit to update at natural breakpoints
- **Refine over time**: Patterns become clearer after seeing them multiple times
- **Don't over-document**: Focus on insights, not obvious actions
- **Use templates**: Copy from existing entries to maintain structure

## Questions?

This system is designed to be flexible. Adapt it to your workflow, but maintain the core distinction:
- **Persistent memory** (committed): Patterns and summaries for long-term reference
- **Working memory** (ignored): Active thinking for current session

The goal is to capture knowledge without creating documentation burden.
