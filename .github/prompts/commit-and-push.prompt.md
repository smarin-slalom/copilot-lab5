---
description: "Analyze changes, generate commit message, and push to feature branch"
tools: ["read", "execute", "todo"]
---

# Commit and Push Changes to Feature Branch

You are committing and pushing changes to a feature branch. Follow Git workflow conventions from the project instructions.

## Task

1. **Get Branch Name**
   - Branch name: ${input:branch-name:Enter the feature branch name (e.g., feature/delete-endpoint)}
   - **REQUIRED**: User must provide a branch name
   - If no branch name provided, stop and ask the user for it
   - Branch naming convention (from Git Workflow in project instructions):
     * Feature branches: `feature/<descriptive-name>`
     * Example: `feature/delete-endpoint`, `feature/edit-functionality`

2. **Analyze Changes**
   - Run `git status` to see changed files
   - Run `git diff` to see the actual changes
   - Review what was added, modified, or deleted
   - Understand the scope and purpose of the changes

3. **Generate Conventional Commit Message**
   - Follow conventional commit format (from Git Workflow in project instructions):
     * `feat:` - New feature
     * `fix:` - Bug fix
     * `chore:` - Maintenance tasks (dependencies, config)
     * `docs:` - Documentation changes
     * `test:` - Test additions or modifications
     * `refactor:` - Code refactoring without behavior change
   - Structure: `<type>: <short description>`
   - Examples:
     * `feat: implement DELETE /api/todos/:id endpoint`
     * `test: add tests for todo deletion functionality`
     * `fix: handle 404 error for non-existent todos`
     * `chore: add memory system documentation`
   - Keep description concise and descriptive
   - Focus on WHAT changed, not HOW (code speaks for itself)

4. **Branch Management**
   - Check if branch exists: `git branch --list ${branch-name}`
   - If branch does NOT exist:
     * Create and switch: `git checkout -b ${branch-name}`
     * Explain: "Created new feature branch: ${branch-name}"
   - If branch DOES exist:
     * Switch to it: `git checkout ${branch-name}`
     * Explain: "Switched to existing branch: ${branch-name}"
   - **CRITICAL**: ONLY use the user-provided branch name
   - **NEVER commit to main** or any other branch

5. **Stage, Commit, and Push**
   - Stage all changes (from Git Workflow in project instructions):
     * Run: `git add .`
     * Explain: "Staged all changes for commit"
   - Commit with generated message:
     * Run: `git commit -m "<generated-message>"`
     * Display the commit message used
   - Push to the feature branch:
     * Run: `git push origin ${branch-name}`
     * If this is first push, may need: `git push -u origin ${branch-name}`
   - Display success message with branch name and commit details

6. **Report Completion**
   - Summarize what was committed:
     * Branch name
     * Commit message
     * Files changed (count)
     * Lines added/removed (from git diff --stat)
   - Confirm changes are pushed to remote
   - Next steps suggestion (e.g., "Run `/validate-step` to check success criteria")

## Git Workflow Reference

From project instructions:
- **Conventional commits**: `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`
- **Feature branches**: `feature/<descriptive-name>`
- **Stage all**: `git add .` (always stage everything before commit)
- **Push to correct branch**: `git push origin <branch-name>`

## Safety Checks

- ✅ User provided a branch name
- ✅ Branch name follows feature/* pattern (warn if not)
- ✅ NOT committing to main branch (block if attempted)
- ✅ All changes staged with `git add .`
- ✅ Commit message follows conventional format
- ✅ Push to the correct branch (user-provided name)

## Error Handling

- If no branch name provided: Stop and request it from user
- If attempting to commit to main: Error and refuse
- If git command fails: Show error and suggest fix
- If push fails (no upstream): Use `git push -u origin <branch-name>`

Proceed with the commit and push workflow now.
