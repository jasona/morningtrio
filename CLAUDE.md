# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is an AI prompt template toolkit for structured software development workflows. It guides AI assistants through a **Research → Create → Generate → Execute** process for building features, content, and designs.

## Workflow Phases

The toolkit follows a 4-phase workflow:

1. **Research** (`research.md`) → Produces Research Summary Document (RSD) in `/tasks/rsd-*.md`
2. **Create** (`create-prd.md`, `create-crd.md`, `create-drd.md`) → Produces requirements docs in `/tasks/prd-*.md`, `crd-*.md`, `drd-*.md`
3. **Generate** (`generate-tasks.md`) → Produces task lists in `/tasks/tasks-*.md`
4. **Execute** (`execute-tasks.md`) → Implements tasks one-by-one with user approval between steps

## Key Conventions

### Document Versioning
- All output documents use version suffixes: `prd-feature-v1.md`, `prd-feature-v2.md`
- **Never overwrite** existing RSD/PRD/CRD/DRD files - always increment version number

### Task Execution Protocol
- Work on **one sub-task at a time**
- Mark sub-tasks complete with `[x]` immediately after finishing
- **Stop and wait for user approval** before proceeding to next sub-task
- When all sub-tasks of a parent are complete, mark parent complete and commit/push to git

### Clarifying Questions Format
- Number all questions (1, 2, 3...)
- Provide multiple-choice options labeled A, B, C, D...
- Enable easy responses like "1A, 2C, 3B"

### Task List Structure
- Task 0.0 is always "Create feature branch" (unless user specifies otherwise)
- Parent tasks numbered X.0, sub-tasks numbered X.1, X.2, etc.
- Include "Relevant Files" section listing all files to create/modify

## Corporate Standards System

Standards in `/standards/` are automatically applied to workflow phases:

- **`standards-manifest.yml`** - Central config defining which standards apply to each phase
- **`global/`** - Apply to all phases (principles, security, accessibility, terminology)
- **`domains/`** - Domain-specific (code-architecture, content-voice, design-ui)
- **`phases/`** - Phase-specific rules
- **`teams/`** - Optional team-specific overlays

When using any prompt file, load applicable standards from the manifest and include a Standards Compliance section in outputs.

## Output Directory

All generated documents go to `/tasks/`:
- `rsd-*.md` - Research Summary Documents
- `prd-*.md` - Product Requirements Documents
- `crd-*.md` - Content Requirements Documents
- `drd-*.md` - Design Requirements Documents
- `tasks-*.md` - Generated task lists
