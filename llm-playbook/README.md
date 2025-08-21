# Agentic Engineering Playbook — Indexed Summary (README)

> A concise, navigable summary of **The Agentic Engineering Playbook: A Guide to Building and Maintaining Codebases with LLM Agents**. Use this as your quick-start reference and table of contents.

---

## Table of Contents (Index)

- [Agentic Engineering Playbook — Indexed Summary (README)](#agentic-engineering-playbook--indexed-summary-readme)
  - [Table of Contents (Index)](#table-of-contents-index)
  - [Overview](#overview)
  - [Core Principles](#core-principles)
    - [Specification-Driven Development](#specification-driven-development)
    - [Test-First Prompting \& Acceptance Criteria](#test-first-prompting--acceptance-criteria)
    - [Definition of Done (DoD)](#definition-of-done-dod)
    - [Architectural Decision Records (ADRs)](#architectural-decision-records-adrs)
  - [Repository Architecture](#repository-architecture)
    - [Monorepo vs Polyrepo](#monorepo-vs-polyrepo)
    - [Modularity \& Layering](#modularity--layering)
    - [Naming \& Prompt Libraries](#naming--prompt-libraries)
  - [End-to-End Agentic Workflow](#end-to-end-agentic-workflow)
  - [Prompting Personas \& Schemas](#prompting-personas--schemas)
  - [Core Techniques for Reliability](#core-techniques-for-reliability)
    - [Repo Maps \& Symbol Graphs](#repo-maps--symbol-graphs)
    - [RAG for Codebases](#rag-for-codebases)
    - [Structured Output \& Function Calling](#structured-output--function-calling)
    - [Patch/Diff \& Guardrails](#patchdiff--guardrails)
  - [Starter Templates](#starter-templates)
    - [Python Template](#python-template)
    - [TypeScript Template](#typescript-template)
  - [Automation Toolkit](#automation-toolkit)
  - [Evaluation \& Maintenance](#evaluation--maintenance)
    - [Lightweight SWE-bench Harness](#lightweight-swe-bench-harness)
    - [KPIs for Coding Agents](#kpis-for-coding-agents)
    - [Triage for Failures](#triage-for-failures)
  - [Troubleshooting Cheat Sheet](#troubleshooting-cheat-sheet)
  - [Appendix \& References](#appendix--references)
    - [How to Use This README](#how-to-use-this-readme)

---

## Overview

The playbook reframes LLMs from code completion tools to **active collaborators**. Reliability hinges on:

1) **Clear, machine-executable specs**, 2) **deliberate repo architecture**, and 3) **guardrailed workflows**. Ambiguity—not model capability—is the dominant failure source.

---

## Core Principles

### Specification-Driven Development

Treat specs as **source code for agents**. User stories, AC, and ADRs become formal inputs that shape plans and constrain behavior. Poor or ambiguous specs = predictable failure.

### Test-First Prompting & Acceptance Criteria

Adopt a TDD-style approach: supply **failing tests** (or explicit AC) in prompts to formalize success. AC should span:

- Functional correctness (all unit/integration tests pass)
- Performance thresholds
- Security posture (no new vulns; project standards)
- Maintainability/readability (conventions, lint grades)
- Integration contracts (APIs/data)

**AC Template snippet (example focus):**

- Endpoint contracts, status codes, security requirements (e.g., Argon2)
- Must pass named tests (e.g., `tests/test_auth.py` cases)
- Non-functional budgets (e.g., latency under load)

### Definition of Done (DoD)

A repository **checklist** (e.g., `DEFINITION_OF_DONE.md`) that verifies: AC met, formatted code, tests added/passing, coverage non-regression, docs updated, no high/critical vulns, staged deploy, **human review complete**.

### Architectural Decision Records (ADRs)

Lightweight, persistent guardrails capturing context/decision/consequences (e.g., “PostgreSQL over MongoDB”). ADRs improve agent consistency and prevent architectural drift.

---

## Repository Architecture

### Monorepo vs Polyrepo

**Monorepo** favored for agents: unified context, easier cross-cutting changes, standardized tooling/conventions, and better RAG/repo-mapping.

### Modularity & Layering

Use Clean/Hexagonal/DDD boundaries. Small, well-defined modules let agents work with minimal context and enable safe, iterative loops.

### Naming & Prompt Libraries

Enforce strict naming conventions. Maintain a project prompt library (e.g., `prompts.md` or `.prompts/`) with canonical **system prompts, task templates, and output schemas** for reproducibility.

---

## End-to-End Agentic Workflow

1. **Idea → Spec**: Architect Agent drafts spec, ADRs, and AC; human refines.
2. **Spec → Scaffold**: Scaffolder Agent generates folders/files/tests/configs.
3. **Core Iteration Loop**:
   - Pick a small sub-task (ideally one AC)
   - Write a failing test
   - Implementer Agent writes code (with tests/spec/ADRs/conventions context)
   - Output as **git diff**; review/apply; run tests; repeat
4. **Tests → Docs**: Documenter Agent updates docs/comments/usage examples.
5. **Review → Release**: Agent-generated PR with spec/ADR references; go through CI/CD.

---

## Prompting Personas & Schemas

- **Planner/Architect**: decomposes requests; outputs JSON plan + affected files + optional ADR draft.
- **Implementer/Coder**: executes a single plan step; emits **one tool call** JSON or final message.
- **Tester**: writes comprehensive `pytest` suites covering positive/negative/edge cases.
- **Reviewer/Refactorer**: inspects diffs for convention/security/perf issues; outputs structured review JSON.

Each persona uses **strict schemas** to ensure machine-parsable, predictable outputs.

---

## Core Techniques for Reliability

### Repo Maps & Symbol Graphs

- **Repo map**: concise file + symbol index for quick, low-token navigation.
- **Symbol graph**: entity-relationship view enabling impact analysis (e.g., call sites).

### RAG for Codebases

Index by AST-aware chunks → embed → store in vector DB → retrieve relevant code for prompts. Combine **repo map (fast)** + **RAG (deep)** for context quality and token efficiency.

### Structured Output & Function Calling

Constrain outputs to JSON models (e.g., Pydantic/Zod). Prefer native function/tool calling to drive file ops with validated parameters.

### Patch/Diff & Guardrails

Never write directly. Emit **unified diffs**; gate with formatters/linters/type-checkers/tests. Add **filesystem allowlists** and CI gates to block unsafe changes.

---

## Starter Templates

### Python Template

**Tech:** Poetry, `pyproject.toml`, Ruff, Mypy, Pytest, Devcontainer, CI.

**CI example (extract):**

- Setup Python 3.11
- `pip install poetry && poetry install`
- `poetry run ruff check src tests`
- `poetry run mypy src`
- `poetry run pytest --cov=src`

**Skeleton highlights:** `.github/workflows/ci.yml`, `.prompts/`, `adr/`, `src/`, `tests/`, `DEFINITION_OF_DONE.md`.

### TypeScript Template

**Tech:** PNPM monorepo style, Turbo, ESLint, Prettier, Jest, strict TS config.

**Root scripts:**

- `build`: `turbo run build`
- `test`: `turbo run test`
- `lint`: `turbo run lint`
- `format`: `prettier --write "**/*.{ts,tsx,md}"`

**Skeleton highlights:** `packages/core`, `.prompts/`, `adr/`, `pnpm-workspace.yaml`, `.github/workflows/ci.yml`, `DEFINITION_OF_DONE.md`.

---

## Automation Toolkit

- **`scaffold.py`**: generate project from language template; safe if target dir absent.
- **`repo_map.py`**: build JSON map of files + Python symbols; skip ignored dirs.
- **`indexer.py`**: RAG indexing for code with LangChain + Chroma; AST-aware chunking.
- **CI PR Validator**: script step to validate structured PR body (e.g., JSON block).
- **`guardrail.py`**: wrapper enforcing **write allowlists** (e.g., only `src/`, `tests/`).

---

## Evaluation & Maintenance

### Lightweight SWE-bench Harness

Define tasks (prompt, start commit, allowed files, test command). Harness resets repo, runs agent, applies patch, executes tests, and records pass/fail + metrics.

### KPIs for Coding Agents

- **Task Success Rate** (primary correctness)
- **Diff Size/Churn**
- **Turns/Tool Calls**
- **Token Cost**
- **HITL Interventions** (human corrections)

### Triage for Failures

1) Classify via failure taxonomy → 2) Inspect traces → 3) Root cause → 4) Remediate (prompts, RAG, tools) → 5) Add regression.

---

## Troubleshooting Cheat Sheet

| Failure Mode | Symptom | Likely Cause | Mitigation |
|---|---|---|---|
| **Specification Drift** | Solves wrong problem | Ambiguous prompt/spec | Strict spec/AC templates; human approval of plan |
| **Context Loss** | Forgets constraints | Context overflow / weak retrieval | Robust RAG; break into smaller stateful steps |
| **File Thrashing** | Loops on same file / bad paths | Poor repo awareness | Use listFiles; emit diffs; FS allowlists |
| **Flaky Tests** | Non-deterministic failures | Env drift / test design | Devcontainers; deterministic tests with mocks |
| **Tool Errors** | Bad tool use/handling | Tool docs unclear / no error handling | Document tools; require try/except patterns |

---

## Appendix & References

- **Works Cited:** See the source playbook’s *Works cited* section for references to research, frameworks, and tooling.
- **Templates to copy:** `DEFINITION_OF_DONE.md`, `adr/template.md`, persona prompt templates in `.prompts/`.
- **Security Guardrails:** Treat any write/exec actions as destructive; gate with CI tests, SAST, and allowlists. Never store secrets in the repo; use `.env` patterns and secret managers.

---

### How to Use This README

- Start here to **navigate** concepts and find the right template or script.
- Copy checklists/templates into your repo and **enforce via CI**.
- When prompting agents, **always include**: spec/AC, relevant ADRs, conventions, and failing tests.
