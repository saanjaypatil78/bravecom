# Antigravity Project Workspace

## Overview

**Project:** BRAVEECOM_STITCH  
**Version:** 1.1.0  
**Status:** Active  
**QA Lead:** opencode  

---

## Project Structure

```
docs/antigravity/
├── workspace.json          # Main workspace configuration
├── PRD.md                 # Product Requirements Document
├── QA_CHECKLIST.md        # QA Validation Checklist
├── engine.py              # Core Antigravity Engine
├── gemini_integration.py  # Gemini AI Integration
├── human_verify.py        # Manual Human Verification CLI
└── verification_tasks.json # Task storage (auto-generated)
```

---

## Quick Start

### 1. Validate a Product Review

```bash
# Using Gemini AI
python docs/antigravity/gemini_integration.py

# Or use the validation engine
python docs/antigravity/engine.py
```

### 2. Manual Human Verification

```bash
# Interactive mode
python docs/antigravity/human_verify.py --interactive

# Add test task
python docs/antigravity/human_verify.py --add-test "Sony Headphones" "Great product" 85

# List pending tasks
python docs/antigravity/human_verify.py --list

# Generate report
python docs/antigravity/human_verify.py --report
```

---

## Configuration

### Environment Variables

Add to `.env`:

```env
# Gemini AI
GEMINI_API_KEY=your-gemini-api-key

# Workspace
ANTIGRAVITY_WORKSPACE=./docs/antigravity
ANTIGRAVITY_ENABLED=true
ANTIGRAVITY_AUTO_SYNC=true
ANTIGRAVITY_SYNC_INTERVAL=300

# QA Lead
QA_LEAD_NAME=opencode
QA_LEAD_ROLE=primary_tester

# Validation
ANTIGRAVITY_MATCH_THRESHOLD=90
ANTIGRAVITY_MIN_SOURCES=3
```

### Workspace Settings (`workspace.json`)

```json
{
  "version": "1.1.0",
  "project": "Antigravity",
  "qa_lead": {
    "name": "opencode",
    "role": "primary_tester",
    "ai_assistant": {
      "enabled": true,
      "provider": "gemini",
      "model": "gemini-2.0-flash"
    }
  },
  "validation": {
    "matchThreshold": 90,
    "requireOpencodeApproval": true
  },
  "auto_sync": {
    "enabled": true,
    "interval_seconds": 300
  }
}
```

---

## Human Verification Workflow (Required Before Pre-listing)

### Complete Pre-listing Verification

**Before any product can be listed, complete ALL 5 phases:**

```bash
# Start interactive verification wizard
python docs/antigravity/human_verification.py --interactive

# Or check status of existing verification
python docs/antigravity/human_verification.py --status PRD-00001

# Generate final report
python docs/antigravity/human_verification.py --report PRD-00001
```

### 5-Phase Verification Protocol

#### Phase 1: Deep Research Validation (Pre-Listing)
- [ ] **FR-01**: At least 3 external source URLs attached
- [ ] **FR-01b**: Sources from manufacturer, distributor, competitor
- [ ] **FR-02**: Technical specs match manufacturer official
- [ ] **FR-02b**: Image rights verified for copyright
- [ ] **FR-03**: Competitor pricing documented
- [ ] **FR-03b**: Antigravity Gate prevents saving without research
- [ ] **FR-03c**: opencode verified research sources

#### Phase 2: Product Title & Metadata Integrity
- [ ] **FR-09**: Title follows [Brand] + [Model] + [Key Feature] + [Color/Size]
- [ ] **FR-09b**: No keyword stuffing in title
- [ ] **FR-09c**: Variant mapping correct (e.g., 'Blue' maps to Blue SKU)
- [ ] **FR-10**: No broken HTML entities in title
- [ ] **FR-10b**: Price matches target region currency format
- [ ] **FR-11**: SKU validates against WMS in real-time

#### Phase 3: Review-Title Precision Match
- [ ] **FR-04**: Pre-populated reviews can be uploaded in Antigravity Mode
- [ ] **FR-05**: Review contradicts title triggers immediate error
- [ ] **FR-06**: Match score >90% for approval
- [ ] **FR-07**: All QA reviews tagged seed_data=true
- [ ] **FR-08**: Failed seed reviews notify opencode

#### Phase 4: UI/UX & Responsiveness
- [ ] **UI-01**: Mobile view truncates title gracefully
- [ ] **UI-02**: Reviews sort correctly (Newest/Helpful)
- [ ] **UI-03**: Images load at high resolution without CLS
- [ ] **UI-04**: Add to Cart activates only after validation passes

#### Phase 5: Production Safety Lock
- [ ] **NFR-02**: Production API does NOT return seed_data reviews
- [ ] **NFR-02b**: Export to Google Shopping excludes seed reviews
- [ ] **NFR-03**: Warning banner if attempting prod migration
- [ ] **NFR-04**: Only opencode can bypass Antigravity Mode

---

## Features

### 1. NLP Semantic Scanning
- Analyzes review text against product title keywords
- Detects contradictions (e.g., "wired" vs "wireless")
- Match score >90% required for approval

### 2. Deep Research Gate
- Requires 3+ verification URLs
- Blocks publication without opencode approval

### 3. Synthetic Data Sandbox
- QA reviews tagged with `seed_data=true`
- Never pushed to production

### 4. Gravity Well Validation
- Final check for orphaned metadata
- opencode sign-off required

### 5. Gemini AI Integration
- Uses gemini-2.0-flash (free tier)
- Context: 1M tokens
- Vision support for image validation

### 6. Auto-Sync
- Syncs every 5 minutes
- Backs up validation results
- Notifies on failures

### 7. Manual Human Verification
- CLI tool for manual QA
- Approval/rejection with notes
- Generates verification reports

---

## API Usage

### Validate Review

```python
from docs.antigravity.gemini_integration import GeminiAIValidator

validator = GeminiAIValidator()

result = validator.validate_review_with_gemini(
    product_title="Sony WH-1000XM5 Wireless Headphones",
    review_text="Great wireless headphones!"
)

print(f"Match Score: {result['match_score']}%")
print(f"Approved: {result['is_approved']}")
```

### Run Engine

```python
from docs.antigravity.engine import AntigravityEngine, Environment

engine = AntigravityEngine(Environment.STAGING)

# Create product
product_id = engine.create_product(
    title="Apple AirPods Pro",
    brand="Apple",
    category="Electronics"
)

# Check if can publish
status = engine.can_publish_product(product_id)
print(f"Can Publish: {status['can_publish']}")
```

---

## Commands

| Command | Description |
|---------|-------------|
| `--list` | List pending verifications |
| `--interactive` | Interactive verification mode |
| `--approve <id>` | Approve a task |
| `--reject <id>` | Reject a task |
| `--report` | Generate verification report |
| `--add-test` | Add test verification task |

---

## Acceptance Criteria

- [x] Product cannot be saved without 3 verification links
- [x] Review contradicts title triggers error
- [x] `seed_data` invisible in Production
- [x] Deep Research summary visible on dashboard
- [x] opencode credentials required for final validation

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Fake Reviews in Prod | Hard-coded API block on `seed_data` |
| NLP False Positives | Manual override by opencode |
| Scraping Blocks | Allow manual PDF upload |

---

*Last Updated: 2026-02-25*  
*Managed by: opencode*
