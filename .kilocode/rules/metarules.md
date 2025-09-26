# Meta Rules: Governing Principles

Defines core principles for content within the `.kilocode/` directory, ensuring `Rules` and `Workflows` are consistent, clear, and link strategy to implementation.

---

## Core Mandates

These are non-negotiable.

### 1. Language: English Only
All content, including `Rules`, `Workflows`, filenames, and commits, **MUST** be in English for universal understanding.

### 2. Separation of Concerns: `Rules` vs. `Workflows`
*   **`Rules` (The "Why"):** Define high-level philosophy, strategic principles, and design goals.
*   **`Workflows` (The "How"):** Provide concrete, step-by-step instructions to implement a `Rule`.

### 3. Structure: One Topic Per Rule
Each `Rule` file (`rules/**/*.md`) must focus on a single, well-defined topic to keep principles focused and easy to reference.

### 4. Indexing: Rules as Workflow Hubs
Every `Rule` file **MUST** serve as a master index for all related `Workflows`. When a new `Workflow` is created, it **MUST** be registered in the corresponding `Rule` file to link principles to practice.

---

## New Rule File Template

All new `Rule` documents **MUST** adhere to this structure.

```markdown
# [Topic Name] Rule

*   **Status:** [Draft | Active | Deprecated]
*   **Owner:** @username
*   **Last Updated:** YYYY-MM-DD

## 1. Philosophy & Core Principles

[Explain the "Why." The high-level goal, guiding philosophy, and fundamental principles. This section is strategic and abstract.]

## 2. Scope

[Define the rule's boundaries. What it applies to and what it explicitly does not, to prevent ambiguity.]

## 3. Related Workflows Index

[List all Workflows that execute the principles defined above. Add new entries as they are created.]

*   **[Workflow Name 1](../workflows/workflow-name-1.md):** A one-sentence description of what this workflow accomplishes.
*   **[Workflow Name 2](../workflows/workflow-name-2.md):** A one-sentence description of what this workflow accomplishes.
