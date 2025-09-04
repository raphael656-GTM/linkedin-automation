# n8n Campaign Assignment Router Workflow

**ID:** story_mf5cs7ee_09q1u
**Type:** feature
**Priority:** high
**Complexity:** medium
**Status:** active
**Created:** 2025-09-04T11:59:07.382Z

**Tags:** n8n, routing, campaigns

## Description
Build hourly n8n workflow that routes enriched prospects to appropriate Lemlist campaigns based on title

## Requirements
- Hourly trigger
- Read enriched prospects with status=enriched
- Title-based routing logic (C-Suite, IT/Digital, Patient Experience, Operations/Revenue, General)
- Batch prospects by campaign type (max 50)
- Add to appropriate Lemlist connection campaign
- Update tracking sheet
- Set status to in_campaign

## Constraints
- Max 50 prospects per batch
- Lemlist API rate limits
- Must complete within 10 minutes

## Acceptance Criteria
1. Routes prospects to correct campaigns
2. Updates tracking accurately
3. Handles all 5 campaign types
4. Respects batch limits

## Overview
_TODO: Fill in this section_

## Requirements
_TODO: Fill in this section_

## Acceptance Criteria
_TODO: Fill in this section_

## Technical Approach
_TODO: Fill in this section_

## Notes
_Add implementation notes, decisions, and updates here_

## Progress
- [ ] Story analysis complete
- [ ] Implementation started
- [ ] Implementation complete
- [ ] Testing complete
- [ ] Story closed
