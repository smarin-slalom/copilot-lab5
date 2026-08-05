---
description: "Execute instructions from the current GitHub Issue step"
agent: "tdd-developer"
tools: ["search", "read", "edit", "execute", "web", "todo"]
---

# Execute GitHub Issue Step Instructions

You are executing a step from the current GitHub Issue exercise. Follow the activity instructions systematically and apply Test-Driven Development principles.

## Task

1. **Find the Exercise Issue**
   - Issue number: ${input:issue-number:Enter the issue number (leave blank to auto-detect)}
   - If no issue number provided, use `gh issue list --state open` to find the exercise issue
   - Look for an issue with "Exercise:" in the title
   - If found, use that issue number

2. **Get Issue Details**
   - Use `gh issue view <issue-number> --comments` to get the full issue with all steps
   - Parse the content to find the latest step instructions
   - Identify all `:keyboard: Activity:` sections in the current step

3. **Execute Activities Systematically**
   - Follow each activity instruction in order
   - Apply **Test-Driven Development** principles from project instructions:
     * **Test First**: Write tests BEFORE implementation code for new features
     * **Red-Green-Refactor**: Write failing test (RED) → Implement minimal code (GREEN) → Refactor
     * **Incremental**: Make small, testable changes
   - **CRITICAL TESTING CONSTRAINTS** (from project instructions):
     * Use existing test infrastructure: Jest (backend), React Testing Library (frontend)
     * **NEVER suggest or install**: Playwright, Cypress, Selenium, or other e2e frameworks
     * **NEVER suggest**: Browser automation tools
     * **Reason**: Keep lab focused on unit/integration tests without e2e complexity
     * For full UI flows, recommend manual browser testing
   - Use todo lists to track progress for multi-step activities
   - Reference project documentation:
     * [docs/project-overview.md](../../docs/project-overview.md) - Architecture and tech stack
     * [docs/testing-guidelines.md](../../docs/testing-guidelines.md) - Test patterns
     * [docs/workflow-patterns.md](../../docs/workflow-patterns.md) - Development workflows
     * [.github/memory/patterns-discovered.md](../.github/memory/patterns-discovered.md) - Code patterns

4. **Document Your Work**
   - Take notes in `.github/memory/scratch/working-notes.md` as you work:
     * Current Task: What step/activity you're executing
     * Approach: Your TDD strategy
     * Key Findings: Discoveries during implementation
     * Decisions Made: Why you chose certain approaches
     * Blockers: Any issues encountered

5. **DO NOT Commit or Push**
   - This prompt focuses on execution only
   - Changes should remain staged but uncommitted
   - User will run `/commit-and-push` separately to handle git operations
   - **NEVER run git commit or git push commands**

6. **Complete and Report**
   - After completing all activities, provide a summary of:
     * What was implemented
     * Tests written and their status (passing/failing)
     * Any patterns discovered
     * Current state of the codebase
   - Inform the user: "Step execution complete. Run `/validate-step` to verify success criteria."

## Testing Workflow Reminders

**Backend API Changes:**
- Write Jest + Supertest tests FIRST
- Run tests to see them fail (RED)
- Implement minimal code to pass (GREEN)
- Refactor while keeping tests green

**Frontend Component Changes:**
- Write React Testing Library tests FIRST for component behavior
- Test rendering, user interactions, conditional logic
- Run tests to see them fail (RED)
- Implement minimal code to pass (GREEN)
- Refactor while keeping tests green
- Recommend manual browser testing for complete UI flows

**General TDD Principles:**
- Test first, code second (never reverse this)
- Break solutions into small increments
- Run tests after each change
- Refactor after tests pass

## GitHub CLI Reference

These commands are available (defined in Workflow Utilities section of project instructions):
- List open issues: `gh issue list --state open`
- Get issue details: `gh issue view <issue-number>`
- Get issue with comments: `gh issue view <issue-number> --comments`

## Important Constraints

- ✅ Use Jest for backend testing
- ✅ Use React Testing Library for frontend testing
- ✅ Write tests BEFORE implementation
- ✅ Follow Red-Green-Refactor cycle
- ✅ Make incremental changes
- ❌ DO NOT install Playwright, Cypress, or Selenium
- ❌ DO NOT suggest browser automation tools
- ❌ DO NOT commit or push changes (separate workflow)

Execute the step activities now, following TDD principles and project constraints.
