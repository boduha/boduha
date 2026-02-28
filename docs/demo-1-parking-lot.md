# Parking Lot – After Demo 1

This document records ideas, enhancements and architectural notes
intentionally deferred from Demo 1 (Practice MVP).

Items listed here are **not part of Demo 1 scope**.
They may be discussed, prioritized, refined or discarded in future milestones.

---

## 1. Product Enhancements

### 1.1 Scoring
- Introduce scoring mechanism per attempt.
- May connect with future features:
  - Observation (progress tracking)
  - Competition (ranking, leaderboards)

### 1.2 Explanation (Pedagogical Core)
- Provide detailed explanation after incorrect answer.
- Essential to complete the pedagogical package.
- Must go beyond simple feedback (“Correct / Not quite”).
- Should support structured reasoning (e.g., step decomposition).
- Future consideration: support long-form explanations.

### 1.3 Support for Long-Form Questions (e.g., ENADE-style)
- Handle long statements and complex text.
- Adapt UI for reading comfort (scroll, layout, separation of sections).
- Consider “exam mode” for institutional usage.

---

## 2. Domain Model Evolution

### 2.1 Introduce Exercise (Server-side Aggregation)
- Aggregate:
  - Question
  - CorrectAnswer
  - Explanation
- Internal domain object.
- Must not expose correct answer via API.
- Exercise should not traverse network boundaries.

---

## 3. Security Hardening (Intellectual Honesty)

Security measures to be introduced after MVP validation.

### 3.1 Prevent Client-Side Gabarito Construction
- Do not expose correctAnswer in API payload.
- Server must validate all submissions.

### 3.2 Attempt-Based Identification
- Same question should receive different identifiers across attempts.
- Introduce `AttemptId` in submission flow.

### 3.3 Identifier Strategy
- Avoid direct exposure of database IDs.
- Consider UUID/ULID or other non-sequential identifiers.
- Ensure backend authorization checks.

---

## 4. Observation & Competition (Future Features)

- Progress tracking per learner.
- Aggregated results per class.
- Leaderboards and ranking.
- Events, challenges, team competitions.

---

## Notes

- Items here are intentionally deferred.
- They are not commitments.
- They exist to preserve ideas without expanding current scope.
- Demo 1 remains focused exclusively on the Practice MVP.