# Meta-Workflows: A Guide to Creating Workflows

## 1. Purpose
Workflows are executable, step-by-step guides that act as the tactical implementation of `Rules`. They provide the "how" for recurring tasks, ensuring precision and reliability.

## 2. Language
All `Workflows` **MUST** be written in English.

## 3. Standard Workflow Structure
Every workflow **MUST** follow this Markdown structure for machine readability.

---

# Workflow: [Title]

## Objective
*A concise, one-sentence description of the workflow's goal.*

## Trigger
*Describe the specific situations or keywords that should trigger this workflow.*
**Examples:** "create a new React component", "module not found error".

## Pre-checks
*A checklist of conditions that must be met before starting.*
- [ ] **Condition 1**: *e.g., User has provided a required filename.*
- [ ] **Condition 2**: *e.g., A specific tool like `npm` is installed.*

## Steps
*A numbered list of clear, sequential, and executable instructions. Each step should be a single action.*

1.  **Action 1**: `tool_name`
    *   **Details**: *Clear description of the action.*
    *   **Command/Code**:
        ```sh
        # Example command
        echo "Hello, World"
        ```

2.  **Action 2**: `write_to_file`
    *   **Details**: *Describe the next action, like writing content to a file.*
    *   **Path**: `/path/to/filename`
    *   **Content**:
        ```typescript
        // Example code to write
        export const newFunction = () => {};
        ```

## Validation
*Describe the specific, verifiable outcomes that confirm successful execution.*

**Success Criteria:**
*   A file is created at the specified path.
*   A command executes without errors.
*   The user confirms the output is correct.

---
