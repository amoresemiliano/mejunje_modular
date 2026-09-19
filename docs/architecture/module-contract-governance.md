# MEJUNJE — Module Contract Governance

## 1. Purpose

This document outlines the governance protocol for communication, shared contracts, and integration requests between MEJUNJE module agents and the Core Backend.

---

## 2. Rules of Engagement

1. **Domain Encapsulation**:
   - Each module agent owns its internal business logic and database tables (see `docs/architecture/data-ownership.md`).
   - Module agents do not modify tables belonging to other modules or Core.

2. **Integration Requests**:
   - When a module requires a new shared table, cross-domain relationship, shared type, or Core infrastructure change, it must submit an **INTEGRATION REQUEST** to `MEJUNJE MASTER / NEXUS`.
   - Master assigns the integration task to `Agent 00 (Core)` or the relevant domain agent via a Work Package.

3. **Public Contracts (`packages/contracts`)**:
   - Data transfer objects (DTOs) and shared interfaces consumed by more than one application or module are registered in `@mejunje/contracts`.
   - Breaking changes to public contracts require formal deprecation cycles and Master approval.

4. **Shared Types (`packages/types`)**:
   - Common foundational primitives (User IDs, Actor Types, Timestamp standards, Base Enums) reside in `@mejunje/types`.
   - Domain-specific types reside within their respective module or app packages unless promoted to shared status.

---

## 3. Workflow for Backend Extension

```
┌────────────────────────┐
│  Module Agent (01-10)  │
└───────────┬────────────┘
            │ 1. Submits DATA / INTEGRATION REQUEST
            ▼
┌────────────────────────┐
│  MEJUNJE MASTER/NEXUS  │
└───────────┬────────────┘
            │ 2. Issues Work Package (WP)
            ▼
┌────────────────────────┐
│  Agent 00 (CORE/DB)    │
│  - Author migration    │
│  - Update contracts    │
│  - Define RLS policies │
└────────────────────────┘
```
