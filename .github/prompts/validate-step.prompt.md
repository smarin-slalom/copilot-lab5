---
description: "Validate that all success criteria for the current step are met"
agent: "code-reviewer"
tools: ["search", "read", "execute", "web", "todo"]
---

# Validate GitHub Issue Step Success Criteria

You are validating that all success criteria for a specific step have been met. Follow a systematic review process to verify completion.

## Task

1. **Get Step Number**
   - Step number: ${input:step-number:Enter the step number (e.g., "5-0", "5-1", "6-0")}
   - **REQUIRED**: User must provide a step number
   - Format: Usually "X-Y" where X is major step, Y is sub-step
   - Example: "5-0" (Step 5.0), "5-1" (Step 5.1)

2. **Find the Exercise Issue**
   - Use `gh issue list --state open` to find the main exercise issue
   - Look for an issue with "Exercise:" in the title
   - This is the issue containing all step instructions

3. **Get Issue with Comments**
   - Use `gh issue view <issue-number> --comments` to get full content
   - Issue body contains the initial description
   - Comments contain individual step instructions

4. **Locate the Specific Step**
   - Search through the issue content for: `# Step ${step-number}:`
   - Example: If step-number is "5-0", search for "# Step 5-0:"
   - Extract the complete step section including:
     * Step title/description
     * Activity instructions
     * **Success Criteria** section
     * Any additional context

5. **Extract Success Criteria**
   - Find the "Success Criteria" section within the step
   - Parse each criterion (usually a bulleted or numbered list)
   - Each criterion defines what must be true for the step to be complete
   - Examples of criteria:
     * "Tests are passing"
     * "Endpoint returns 404 for non-existent ID"
     * "Component renders error message"
     * "No lint errors"

6. **Validate Each Criterion Systematically**
   
   For each success criterion:
   
   **Check Tests**
   - Run: `npm test` (backend and/or frontend as appropriate)
   - Verify: All tests pass with no failures
   - Report: Pass/fail status and any failing test names
   
   **Check Lint Errors**
   - Run: `npm run lint` (if applicable)
   - Verify: No ESLint errors (warnings may be acceptable)
   - Report: Error count and categories if present
   
   **Check Code Implementation**
   - Read relevant files mentioned in criteria
   - Verify: Expected code exists and functions as described
   - Report: Present/absent, correct/incorrect
   
   **Check API Endpoints** (if applicable)
   - Review: Route definitions in backend code
   - Verify: Endpoints exist with correct HTTP methods
   - Check: Response status codes and data structures
   
   **Check Component Behavior** (if applicable)
   - Review: Component code for expected functionality
   - Verify: Event handlers, state management, rendering logic
   - Check: Props validation, error handling
   
   **Check File Structure**
   - Verify: Expected files exist in correct locations
   - Check: File naming conventions followed
   
   **Check Documentation** (if applicable)
   - Verify: Required comments or docs present
   - Check: Memory system updated if patterns discovered

7. **Report Validation Results**
   
   For each criterion, provide:
   - ✅ **PASS**: Criterion is fully met
   - ⚠️ **PARTIAL**: Criterion partially met, needs refinement
   - ❌ **FAIL**: Criterion not met, requires work
   
   Structure the report:
   ```markdown
   ## Step ${step-number} Validation Results
   
   ### Success Criteria Status
   
   1. [Criterion description]
      - Status: ✅ PASS / ⚠️ PARTIAL / ❌ FAIL
      - Details: [What was checked and what was found]
      - Evidence: [Test output, file paths, code snippets]
   
   2. [Next criterion...]
   
   ### Overall Status
   - X of Y criteria met
   - Step status: COMPLETE / INCOMPLETE / BLOCKED
   
   ### Next Actions (if incomplete)
   - [Specific guidance on what needs to be done]
   - [Which files to modify]
   - [What tests to fix]
   ```

8. **Provide Specific Guidance**
   
   If any criteria are not met:
   - **Be specific**: Don't just say "fix tests", say which test file and which test
   - **Suggest actions**: Provide concrete next steps
   - **Reference patterns**: Point to relevant docs or memory files
   - **Prioritize**: List critical issues first
   
   Examples:
   - ❌ FAIL: "Run `npm test` in packages/backend to see the specific test failure"
   - ⚠️ PARTIAL: "Endpoint exists but returns 200 instead of 404 for not found cases"
   - ✅ PASS: "All 15 tests passing, including new DELETE endpoint tests"

9. **Document Validation**
   
   If step is complete:
   - Update `.github/memory/scratch/working-notes.md` with completion status
   - Suggest adding patterns to `.github/memory/patterns-discovered.md` if applicable
   - Recommend updating session notes at end of session

## Validation Checklist

For a complete validation, check:
- ✅ Tests run and pass (backend/frontend as applicable)
- ✅ Lint check passes (no errors)
- ✅ Code implements required functionality
- ✅ API contracts correct (status codes, response format)
- ✅ Error handling present
- ✅ Edge cases covered
- ✅ File structure correct
- ✅ No regressions in existing functionality

## GitHub CLI Reference

From Workflow Utilities in project instructions:
- List open issues: `gh issue list --state open`
- Get issue details: `gh issue view <issue-number>`
- Get issue with comments: `gh issue view <issue-number> --comments`

## Code Review Principles

Apply systematic code review from your agent instructions:
- Check tests BEFORE checking implementation
- Verify lint errors resolved
- Look for code smells and anti-patterns
- Ensure idiomatic JavaScript/React patterns
- Validate consistent with project standards

## Important Notes

- **Be thorough**: Don't skip criteria or make assumptions
- **Run commands**: Actually execute tests and lints, don't guess
- **Provide evidence**: Show output, file contents, test results
- **Be constructive**: If incomplete, guide toward completion
- **Reference docs**: Point to project standards when relevant

Begin validation for Step ${step-number} now.
