# SkillSwap API Reference & Contract Specification

**Version:** 1.0.0  
**Base URL:** `/api/v1`  
**Protocol:** HTTP/1.1 (JSON)  
**Status:** Active Foundation  

This document serves as the formal **Shared Contract** between the Backend and Frontend development tracks as defined in Section 20 & 26 of `GEMINI.md`.

---

## 1. Global API Conventions

### 1.1 Success Response Envelopes

All successful responses wrap payloads in a `data` object:

**Single Resource:**
```json
{
  "data": {
    "id": "uuid",
    ...
  }
}
```

**Collection Resource (Paginated):**
```json
{
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 42
  }
}
```

### 1.2 Error Response Envelope

All error responses adhere strictly to the Section 19 error format:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable description",
    "details": []
  }
}
```

#### Standard Error Codes:
| HTTP Status | Error Code | Description |
|---|---|---|
| `400` | `VALIDATION_ERROR` | Schema validation failed (e.g. Zod validation) |
| `404` | `NOT_FOUND` | Resource or referenced entity not found |
| `500` | `INTERNAL_ERROR` | Unexpected server error (stack trace withheld) |

---

## 2. Endpoints Reference

### 2.1 System Health

#### `GET /api/v1/health`
Check backend server status and database connectivity.

**Response `200 OK`:**
```json
{
  "data": {
    "status": "ok",
    "database": "connected",
    "timestamp": "2026-09-07T16:50:00.000Z"
  }
}
```

---

### 2.2 Skills (`/skills`)

Canonical platform skills.

#### `GET /api/v1/skills`
List skills with pagination and category filtering.

**Query Parameters:**
- `page` (number, optional, default: 1)
- `limit` (number, optional, default: 20, max: 100)
- `category` (string, optional) — Filter by skill category (e.g. `Programming`, `Arts`, `Design`, `Lifestyle`, `Business`, `Music`, `Communication`, `Languages`)

**Response `200 OK`:**
```json
{
  "data": [
    {
      "id": "2b9e6e87-b2f7-4184-a1f9-9ffc129d38c2",
      "name": "Python",
      "slug": "python",
      "description": "General-purpose programming language.",
      "category": "Programming",
      "status": "ACTIVE",
      "created_at": "2026-09-07T16:50:00.000Z",
      "updated_at": "2026-09-07T16:50:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 15
  }
}
```

#### `GET /api/v1/skills/:id`
Retrieve a single skill by UUID.

**Response `200 OK`:**
```json
{
  "data": {
    "id": "2b9e6e87-b2f7-4184-a1f9-9ffc129d38c2",
    "name": "Python",
    "slug": "python",
    "description": "General-purpose programming language.",
    "category": "Programming",
    "status": "ACTIVE",
    "created_at": "2026-09-07T16:50:00.000Z",
    "updated_at": "2026-09-07T16:50:00.000Z"
  }
}
```

---

### 2.3 Users (`/users`)

#### `GET /api/v1/users/:id`
Retrieve public profile information. Password hashes are strictly omitted.

**Response `200 OK`:**
```json
{
  "data": {
    "id": "c1f7a14e-4f05-4c6e-8219-4ad3ec881cb6",
    "name": "Aarav Sharma",
    "username": "aarav",
    "email": "aarav@skillswap.dev",
    "bio": "Full-stack developer who loves teaching Python and learning visual arts.",
    "avatar_url": null,
    "location": "Mumbai, India",
    "status": "ACTIVE",
    "created_at": "2026-09-07T16:50:00.000Z",
    "updated_at": "2026-09-07T16:50:00.000Z"
  }
}
```

#### `GET /api/v1/users/:id/skills`
Retrieve the skills associated with a user, grouped by relationship type.

**Response `200 OK`:**
```json
{
  "data": {
    "can_teach": [
      {
        "id": "97e6be95-3bc4-47f3-8b7a-9774fa191b10",
        "relationship_type": "CAN_TEACH",
        "proficiency_level": "EXPERT",
        "skill_id": "2b9e6e87-b2f7-4184-a1f9-9ffc129d38c2",
        "skill_name": "Python",
        "skill_slug": "python",
        "skill_category": "Programming"
      }
    ],
    "wants_to_learn": [
      {
        "id": "52f6f592-332a-4ce6-a2cb-3b10b004d0ef",
        "relationship_type": "WANTS_TO_LEARN",
        "proficiency_level": "BEGINNER",
        "skill_id": "71a9ec19-75a9-4678-838c-32b0a3f990ea",
        "skill_name": "Photography",
        "skill_slug": "photography",
        "skill_category": "Arts"
      }
    ]
  }
}
```

#### `GET /api/v1/users/:id/matches`
Find reciprocal skill swap matches for a user (§11 relational matching foundation).
Identifies users where User A wants X and can teach Y, and User B wants Y and can teach X.

**Response `200 OK`:**
```json
{
  "data": [
    {
      "match_user_id": "d0be774e-5a1e-4509-847e-8c38676bebb3",
      "match_user_name": "Riya Patel",
      "match_username": "riya",
      "they_teach_skill_id": "71a9ec19-75a9-4678-838c-32b0a3f990ea",
      "they_teach_skill_name": "Photography",
      "they_want_skill_id": "2b9e6e87-b2f7-4184-a1f9-9ffc129d38c2",
      "they_want_skill_name": "Python"
    }
  ]
}
```

---

### 2.4 Skill Swaps (`/swaps`)

Proposed or active peer-to-peer exchanges.

#### `POST /api/v1/swaps`
Propose a skill swap between two users.

**Request Body:**
```json
{
  "requester_id": "c1f7a14e-4f05-4c6e-8219-4ad3ec881cb6",
  "recipient_id": "d0be774e-5a1e-4509-847e-8c38676bebb3",
  "requester_skill_id": "2b9e6e87-b2f7-4184-a1f9-9ffc129d38c2",
  "recipient_skill_id": "71a9ec19-75a9-4678-838c-32b0a3f990ea"
}
```

**Response `201 Created`:**
```json
{
  "data": {
    "id": "e605d3b6-cbdf-4796-9f79-45d31481cf5d",
    "requester_id": "c1f7a14e-4f05-4c6e-8219-4ad3ec881cb6",
    "recipient_id": "d0be774e-5a1e-4509-847e-8c38676bebb3",
    "requester_skill_id": "2b9e6e87-b2f7-4184-a1f9-9ffc129d38c2",
    "recipient_skill_id": "71a9ec19-75a9-4678-838c-32b0a3f990ea",
    "status": "PENDING",
    "created_at": "2026-09-07T16:50:00.000Z",
    "updated_at": "2026-09-07T16:50:00.000Z"
  }
}
```

#### `GET /api/v1/swaps/:id`
Retrieve swap details including joined participant names and skill details.

**Response `200 OK`:**
```json
{
  "data": {
    "id": "e605d3b6-cbdf-4796-9f79-45d31481cf5d",
    "requester_id": "c1f7a14e-4f05-4c6e-8219-4ad3ec881cb6",
    "requester_name": "Aarav Sharma",
    "requester_username": "aarav",
    "recipient_id": "d0be774e-5a1e-4509-847e-8c38676bebb3",
    "recipient_name": "Riya Patel",
    "recipient_username": "riya",
    "requester_skill_id": "2b9e6e87-b2f7-4184-a1f9-9ffc129d38c2",
    "requester_skill_name": "Python",
    "recipient_skill_id": "71a9ec19-75a9-4678-838c-32b0a3f990ea",
    "recipient_skill_name": "Photography",
    "status": "ACCEPTED",
    "created_at": "2026-09-07T16:50:00.000Z",
    "updated_at": "2026-09-07T16:50:00.000Z"
  }
}
```

---

### 2.5 Projects (`/projects`)

Collaborative work created by members.

#### `GET /api/v1/projects`
List public and active projects.

**Response `200 OK`:**
```json
{
  "data": [
    {
      "id": "c2005470-ff6e-473d-82d2-28c031c26ae7",
      "title": "SkillSwap Mobile App",
      "description": "Cross-platform mobile app for the SkillSwap platform.",
      "owner_id": "c1f7a14e-4f05-4c6e-8219-4ad3ec881cb6",
      "owner_name": "Aarav Sharma",
      "owner_username": "aarav",
      "status": "ACTIVE",
      "visibility": "PUBLIC",
      "created_at": "2026-09-07T16:50:00.000Z",
      "updated_at": "2026-09-07T16:50:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 3
  }
}
```

#### `GET /api/v1/projects/:id`
Retrieve project details with its complete member roster.

**Response `200 OK`:**
```json
{
  "data": {
    "id": "c2005470-ff6e-473d-82d2-28c031c26ae7",
    "title": "SkillSwap Mobile App",
    "description": "Cross-platform mobile app for the SkillSwap platform.",
    "owner_id": "c1f7a14e-4f05-4c6e-8219-4ad3ec881cb6",
    "owner_name": "Aarav Sharma",
    "owner_username": "aarav",
    "status": "ACTIVE",
    "visibility": "PUBLIC",
    "members": [
      {
        "id": "a11a2f90-1c08-410c-99c5-654cf6075c34",
        "user_id": "c1f7a14e-4f05-4c6e-8219-4ad3ec881cb6",
        "name": "Aarav Sharma",
        "username": "aarav",
        "role": "OWNER",
        "joined_at": "2026-09-07T16:50:00.000Z"
      }
    ]
  }
}
```

#### `POST /api/v1/projects`
Create a project. Automatically records the creator as `OWNER` in `project_members`.

**Request Body:**
```json
{
  "title": "Interactive 3D Framework",
  "description": "Three.js component library for educational simulations.",
  "owner_id": "c1f7a14e-4f05-4c6e-8219-4ad3ec881cb6",
  "visibility": "PUBLIC"
}
```

**Response `201 Created`:**
```json
{
  "data": {
    "id": "e83cf305-65b3-4fe6-a70e-f4eeb1d368d1",
    "title": "Interactive 3D Framework",
    "description": "Three.js component library for educational simulations.",
    "owner_id": "c1f7a14e-4f05-4c6e-8219-4ad3ec881cb6",
    "status": "DRAFT",
    "visibility": "PUBLIC",
    "created_at": "2026-09-07T16:50:00.000Z",
    "updated_at": "2026-09-07T16:50:00.000Z"
  }
}
```

---

### 2.6 Classes (`/classes`)

Group learning experiences.

#### `GET /api/v1/classes`
List classes with skill and instructor metadata.

#### `GET /api/v1/classes/:id`
Retrieve class details with all enrolled learners and instructors.

---

### 2.7 Learning Sessions (`/learning-sessions`)

Teaching/learning sessions (one-to-one or group).

#### `GET /api/v1/learning-sessions/:id`
Retrieve session details with associated participants (`TEACHER` / `LEARNER`).
