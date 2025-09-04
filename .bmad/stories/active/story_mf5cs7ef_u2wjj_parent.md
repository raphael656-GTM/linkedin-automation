# [SPLIT] n8n Connection Acceptance Webhook Handler

**ID:** story_mf5cs7ef_u2wjj_parent
**Type:** feature
**Priority:** high
**Complexity:** medium
**Status:** split
**Created:** 2025-09-04T11:59:07.383Z

**Tags:** n8n, webhook, personalization, ai

## Description
Build webhook-triggered n8n workflow that handles LinkedIn connection acceptances with research and AI personalization

## Requirements
- Webhook trigger from Lemlist
- Extract connection data (email, name, company, linkedinUrl)
- Parallel research with Apify LinkedIn scraper
- Serper.dev company news search
- Cache research data for 7 days
- OpenAI GPT-4 message generation (3 messages)
- Add to engagement campaign with personalized variables
- Remove from connection campaign
- Update tracking sheet

## Constraints
- Response time under 5 minutes
- Message quality for healthcare executives
- Cache reuse if data < 7 days old

## Acceptance Criteria
1. Webhook responds in < 5 minutes
2. Generates 3 personalized messages
3. Successfully moves to engagement campaign
4. Research data properly cached

## Overview
_TODO: Fill in this section_

## Requirements
_TODO: Fill in this section_

## Acceptance Criteria
_TODO: Fill in this section_

## Technical Approach
_TODO: Fill in this section_

## Split Stories
This story has been split into the following subtasks:
- story_mf5cs7ef_u2wjj_1
- story_mf5cs7ef_u2wjj_2

### Execution Order
1. story_mf5cs7ef_u2wjj_1
2. story_mf5cs7ef_u2wjj_2

## Notes
_Add implementation notes, decisions, and updates here_

## Progress
- [ ] Story analysis complete
- [ ] Implementation started
- [ ] Implementation complete
- [ ] Testing complete
- [ ] Story closed
