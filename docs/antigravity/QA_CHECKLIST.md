# QA Checklist: Antigravity Product Listing Protocol
**Environment:** Staging / QA (Antigravity Mode Active)  
**Date:** _______________  
**QA Lead:** opencode  
**Tester:** opencode  
**Product ID:** _______________  

---

## ⚠️ Critical Warning
**DO NOT** push `seed_data` reviews to Production. This checklist validates the *system's ability* to handle precise data, not to deceive customers. **opencode** is solely responsible for final sign-off.

---

## Phase 1: Deep Research Validation (Pre-Listing)
*Objective: Ensure the product data is grounded in reality before entry.*

- [ ] **Source Verification:** Are at least 3 external URLs attached to the product draft?
- [ ] **Spec Consistency:** Do the ingested specs (Weight, Dimensions, Material) match the Manufacturer's official PDF/Website?
- [ ] **Image Rights:** Are product images verified for copyright usage based on research?
- [ ] **Competitor Pricing:** Is the pricing strategy documented based on market research collected in the module?
- [ ] **Antigravity Gate:** Did the system prevent saving when research fields were empty? (Expected: Yes)
- [ ] **Lead Approval:** Has **opencode** verified the research sources?

## Phase 2: Product Title & Metadata Integrity
*Objective: The Title is the source of truth for the Review Matcher.*

- [ ] **Title Structure:** Does the title follow `[Brand] + [Model] + [Key Feature] + [Color/Size]`?
- [ ] **Keyword Density:** Are critical search terms present without keyword stuffing?
- [ ] **Variant Mapping:** If the title says "Blue," is the selected variant ID mapped to the Blue SKU?
- [ ] **Special Characters:** Are there no broken HTML entities or forbidden characters in the title?
- [ ] **Tester Verification:** Has **opencode** confirmed the title matches the physical product specs?

## Phase 3: Review-Title Precision Match (Antigravity Core)
*Objective: Verify the NLP engine rejects mismatched seed data.*

- [ ] **Positive Test:** Upload a seed review that **matches** the title (e.g., Title: "Sony XM5", Review: "Love my XM5s"). 
    - *Result:* Accepted.
- [ ] **Negative Test:** Upload a seed review that **contradicts** the title (e.g., Title: "Wireless Mouse", Review: "Great cable length"). 
    - *Result:* Rejected/Flagged by Antigravity Engine.
- [ ] **Attribute Check:** If Title specifies "500ml", ensure seed reviews do not mention "1 Liter".
- [ ] **Tag Verification:** Inspect the database entry. Is `seed_data=true` present?
- [ ] **Front-End Display:** Verify the review displays correctly in the UI with the "Verified QA" badge (if applicable in staging).
- [ ] **Precision Log:** Has **opencode** reviewed the NLP confidence score log for the matched reviews?

## Phase 4: UI/UX & Responsiveness
- [ ] **Mobile View:** Does the long product title truncate gracefully on mobile?
- [ ] **Review Sorting:** Do the pre-populated reviews sort correctly (Newest/Helpful)?
- [ ] **Image Zoom:** Do the researched images load at high resolution without layout shift (CLS)?
- [ ] **Add to Cart:** Does the button activate only after all Antigravity validation checks pass?

## Phase 5: Production Safety Lock
*Objective: Ensure QA data stays in QA.*

- [ ] **API Check:** Call the Production Product API. Does it return the `seed_data` reviews? (Expected: No/Null).
- [ ] **Export Test:** Export product data for feed (Google Shopping). Are seed reviews excluded from the feed?
- [ ] **Permission Check:** Can a standard 'Editor' role bypass Antigravity Mode? (Expected: No).
- [ ] **Final Sign-Off:** **opencode** confirms all safety locks are engaged.

---

## Sign-Off

| Role | Name | Signature | Date |
| :--- | :--- | :--- | :--- |
| **QA Lead** | opencode | __________________ | ________ |
| **Tester** | opencode | __________________ | ________ |
| **Product Owner** | __________________ | __________________ | ________ |
| **Compliance** | __________________ | __________________ | ________ |

---
*Antigravity Protocol Version 1.1 | Managed by opencode*
