# PRD: Antigravity Product Listing & Verification Engine
**Version:** 1.1.0  
**Status:** Approved  
**Project Codename:** Antigravity  
**Owner:** opencode  
**QA Lead:** opencode  
**Primary Tester:** opencode  

---

## 1. Executive Summary
The **Antigravity Engine** is a specialized module within the Online Shopping Mall CMS designed to enforce deep-research validation before any product goes live. Its primary differentiator is the **Semantic Review-Title Match Protocol**, ensuring that any pre-populated or seed reviews (used in QA/Staging) align precisely with the Product Title attributes. This prevents UI breakage and ensures data integrity during testing. **opencode** is designated as the primary authority for validating Antigravity Mode operations.

## 2. Antigravity Mode: Definition & Skillset
**Antigravity Mode** is a restricted permission level assigned to **opencode** (QA Lead) that activates the following skillsets within the system:

| Skillset | Description | Application |
| :--- | :--- | :--- |
| **NLP Semantic Scanning** | Natural Language Processing to analyze review text against product title keywords. | Ensures reviews mention specific model numbers/colors found in the title. |
| **Deep Research Gate** | Blocks listing publication until external data sources (manufacturer specs) are verified. | Prevents hallucinated specs. |
| **Synthetic Data Sandbox** | Generates QA-specific reviews that are tagged `internal_only`. | Allows UI testing without polluting production trust signals. |
| **Gravity Well Validation** | A final check that "pulls" all data points together to ensure no orphaned metadata exists. | Final pre-publish lock managed by **opencode**. |

## 3. Functional Requirements

### 3.1 Deep Research Module (Pre-Listing)
- **FR-01:** System must require at least 3 external source URLs (Manufacturer, Distributor, Competitor) for verification before the "List Product" button becomes active.
- **FR-02:** System must scrape/ingest technical specifications from provided URLs to auto-fill attribute fields.
- **FR-03:** Manual overrides require a "Reason Code" and **opencode** Approval.

### 3.2 Review-Title Precision Engine
- **FR-04:** In **Antigravity Mode (QA/Staging)**, users can upload pre-populated reviews.
- **FR-05:** **Critical Constraint:** The system must run a semantic check. If the Product Title contains "Wireless Noise Cancelling Headphones," a review stating "Great wired earbuds" must be **rejected** or **flagged**.
- **FR-06:** Match Score must be >90% for approval.
- **FR-07:** All pre-populated reviews must carry a metadata tag `seed_data=true` to ensure they are never pushed to Production API.
- **FR-08:** **opencode** must receive a notification if any seed review fails the Title Precision check.

### 3.3 Product Listing Integrity
- **FR-09:** Images must match the color variant specified in the Title.
- **FR-10:** Price must match the currency format of the target region.
- **FR-11:** Inventory SKU must validate against the warehouse management system (WMS) in real-time.

## 4. Non-Functional Requirements
- **NFR-01 (Performance):** Validation checks must complete within <2 seconds.
- **NFR-02 (Security):** `seed_data` reviews must be cryptographically signed to prevent leakage to production.
- **NFR-03 (Compliance):** System must display a warning banner if attempting to move `seed_data` to a Production environment.
- **NFR-04 (Role Based):** Only the user **opencode** has full access to bypass Antigravity Mode restrictions in Staging.

## 5. User Stories
1.  **opencode (QA Lead):** "I want to generate 50 reviews that specifically mention the 'Blue' color variant in the product title so I can test the filter functionality."
2.  **opencode (Tester):** "I want the system to automatically reject any seed review that does not semantically match the Product Title to ensure test data integrity."
3.  **System Admin:** "I want to ensure no synthetic reviews accidentally appear on the live site."

## 6. Acceptance Criteria (The Antigravity Standard)
- [ ] Product cannot be saved without 3 verification links.
- [ ] Uploading a review that contradicts the Product Title triggers an immediate error.
- [ ] `seed_data` is invisible on the Production Front-End.
- [ ] Deep Research summary is visible on the Backend Product Dashboard.
- [ ] **opencode** credentials are required to finalize the Antigravity Validation phase.

## 7. Risks & Mitigation
| Risk | Impact | Mitigation |
| :--- | | |
| **Fake Reviews in Prod** | High (Legal/Trust) | Hard-coded API block on `seed_data=true` in Production environment. |
| **NLP False Positives** | Medium (Workflow delay) | Allow manual override by **opencode** with 2-factor authentication. |
| **Scraping Blocks** | Medium (Delay) | Allow manual PDF upload of spec sheets as alternative. |

---
*End of PRD*
