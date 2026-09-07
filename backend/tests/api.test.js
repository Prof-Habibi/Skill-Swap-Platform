const request = require('supertest');
const app = require('../src/app');
const db = require('../src/database/connection');

describe('SkillSwap API Test Suite', () => {
  let seededUserAarav;
  let seededUserRiya;
  let seededSkillPython;
  let seededSkillPhotography;
  let seededSwap;
  let seededProject;
  let seededClass;
  let seededSession;

  beforeAll(async () => {
    // Fetch seeded entities from the database for testing
    seededUserAarav = await db('users').where({ username: 'aarav' }).first();
    seededUserRiya = await db('users').where({ username: 'riya' }).first();
    seededSkillPython = await db('skills').where({ slug: 'python' }).first();
    seededSkillPhotography = await db('skills').where({ slug: 'photography' }).first();
    seededSwap = await db('swaps').first();
    seededProject = await db('projects').first();
    seededClass = await db('classes').first();
    seededSession = await db('learning_sessions').first();
  });

  afterAll(async () => {
    await db.destroy();
  });

  // ── 1. Health Endpoint (§18) ──────────────────────────
  describe('GET /api/v1/health', () => {
    it('should return 200 with status ok and connected database', async () => {
      const res = await request(app).get('/api/v1/health');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data.status).toBe('ok');
      expect(res.body.data.database).toBe('connected');
      expect(res.body.data).toHaveProperty('timestamp');
    });
  });

  // ── 2. Skills Endpoints (§9, §18) ─────────────────────
  describe('Skills Endpoints', () => {
    it('GET /api/v1/skills should return paginated skills list', async () => {
      const res = await request(app).get('/api/v1/skills?page=1&limit=5');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('meta');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeLessThanOrEqual(5);
      expect(res.body.meta.page).toBe(1);
      expect(res.body.meta.limit).toBe(5);
      expect(res.body.meta.total).toBeGreaterThanOrEqual(15);
    });

    it('GET /api/v1/skills?category=Programming should filter skills', async () => {
      const res = await request(app).get('/api/v1/skills?category=Programming');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBeGreaterThan(0);
      for (const skill of res.body.data) {
        expect(skill.category).toBe('Programming');
      }
    });

    it('GET /api/v1/skills/:id should return a specific skill', async () => {
      const res = await request(app).get(`/api/v1/skills/${seededSkillPython.id}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(seededSkillPython.id);
      expect(res.body.data.name).toBe('Python');
      expect(res.body.data.slug).toBe('python');
    });

    it('GET /api/v1/skills/:id with invalid/unknown UUID should return 404', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const res = await request(app).get(`/api/v1/skills/${nonExistentId}`);
      expect(res.status).toBe(404);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  // ── 3. Users Endpoints (§8, §10, §11) ─────────────────
  describe('Users Endpoints', () => {
    it('GET /api/v1/users/:id should return user profile without password_hash', async () => {
      const res = await request(app).get(`/api/v1/users/${seededUserAarav.id}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(seededUserAarav.id);
      expect(res.body.data.name).toBe(seededUserAarav.name);
      expect(res.body.data.email).toBe(seededUserAarav.email);
      expect(res.body.data.password_hash).toBeUndefined();
    });

    it('GET /api/v1/users/:id with unknown ID should return 404', async () => {
      const res = await request(app).get('/api/v1/users/00000000-0000-0000-0000-000000000000');
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('GET /api/v1/users/:id/skills should return categorized user skills', async () => {
      const res = await request(app).get(`/api/v1/users/${seededUserAarav.id}/skills`);
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveProperty('can_teach');
      expect(res.body.data).toHaveProperty('wants_to_learn');
      expect(Array.isArray(res.body.data.can_teach)).toBe(true);
      expect(Array.isArray(res.body.data.wants_to_learn)).toBe(true);

      const canTeachPython = res.body.data.can_teach.some((s) => s.skill_name === 'Python');
      const wantsPhotography = res.body.data.wants_to_learn.some((s) => s.skill_name === 'Photography');
      expect(canTeachPython).toBe(true);
      expect(wantsPhotography).toBe(true);
    });

    it('GET /api/v1/users/:id/matches should return reciprocal swap matches (§11)', async () => {
      // Aarav wants Photography & teaches Python. Riya wants Python & teaches Photography.
      const res = await request(app).get(`/api/v1/users/${seededUserAarav.id}/matches`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBeGreaterThan(0);

      const riyaMatch = res.body.data.find((m) => m.match_user_name === 'Riya Patel');
      expect(riyaMatch).toBeDefined();
      expect(riyaMatch.they_teach_skill_name).toBe('Photography');
      expect(riyaMatch.they_want_skill_name).toBe('Python');
    });
  });

  // ── 4. Swaps Endpoints (§12, §18) ─────────────────────
  describe('Swaps Endpoints', () => {
    it('GET /api/v1/swaps/:id should return swap with user & skill relations', async () => {
      const res = await request(app).get(`/api/v1/swaps/${seededSwap.id}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(seededSwap.id);
      expect(res.body.data).toHaveProperty('requester_name');
      expect(res.body.data).toHaveProperty('recipient_name');
      expect(res.body.data).toHaveProperty('requester_skill_name');
      expect(res.body.data).toHaveProperty('recipient_skill_name');
    });

    it('GET /api/v1/swaps/:id with unknown ID should return 404', async () => {
      const res = await request(app).get('/api/v1/swaps/00000000-0000-0000-0000-000000000000');
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('POST /api/v1/swaps should create a new swap successfully', async () => {
      const newSwapData = {
        requester_id: seededUserAarav.id,
        recipient_id: seededUserRiya.id,
        requester_skill_id: seededSkillPython.id,
        recipient_skill_id: seededSkillPhotography.id,
      };

      const res = await request(app).post('/api/v1/swaps').send(newSwapData);
      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.status).toBe('PENDING');
      expect(res.body.data.requester_id).toBe(seededUserAarav.id);
      expect(res.body.data.recipient_id).toBe(seededUserRiya.id);
    });

    it('POST /api/v1/swaps should reject self-swap validation', async () => {
      const selfSwap = {
        requester_id: seededUserAarav.id,
        recipient_id: seededUserAarav.id,
        requester_skill_id: seededSkillPython.id,
        recipient_skill_id: seededSkillPhotography.id,
      };

      const res = await request(app).post('/api/v1/swaps').send(selfSwap);
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      expect(res.body.error.details.length).toBeGreaterThan(0);
    });

    it('POST /api/v1/swaps should return 404 for invalid user reference', async () => {
      const invalidRefSwap = {
        requester_id: '00000000-0000-0000-0000-000000000000',
        recipient_id: seededUserRiya.id,
        requester_skill_id: seededSkillPython.id,
        recipient_skill_id: seededSkillPhotography.id,
      };

      const res = await request(app).post('/api/v1/swaps').send(invalidRefSwap);
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  // ── 5. Projects Endpoints (§15, §18) ───────────────────
  describe('Projects Endpoints', () => {
    it('GET /api/v1/projects should return paginated projects', async () => {
      const res = await request(app).get('/api/v1/projects');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body).toHaveProperty('meta');
      expect(res.body.meta.total).toBeGreaterThanOrEqual(2);
    });

    it('GET /api/v1/projects/:id should return project details with members', async () => {
      const res = await request(app).get(`/api/v1/projects/${seededProject.id}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(seededProject.id);
      expect(res.body.data).toHaveProperty('owner_name');
      expect(Array.isArray(res.body.data.members)).toBe(true);
      expect(res.body.data.members.length).toBeGreaterThan(0);
    });

    it('POST /api/v1/projects should create project and auto-assign owner member', async () => {
      const newProject = {
        title: 'AI Assisted Learning Tools',
        description: 'Collaborative project building interactive learning aids.',
        owner_id: seededUserAarav.id,
        visibility: 'PUBLIC',
      };

      const res = await request(app).post('/api/v1/projects').send(newProject);
      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.title).toBe(newProject.title);

      // Verify membership
      const getRes = await request(app).get(`/api/v1/projects/${res.body.data.id}`);
      expect(getRes.status).toBe(200);
      const ownerMember = getRes.body.data.members.find((m) => m.user_id === seededUserAarav.id);
      expect(ownerMember).toBeDefined();
      expect(ownerMember.role).toBe('OWNER');
    });

    it('POST /api/v1/projects should return 400 on validation failure', async () => {
      const res = await request(app).post('/api/v1/projects').send({
        // missing title and owner_id
        description: 'Incomplete project',
      });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  // ── 6. Classes Endpoints (§14, §18) ───────────────────
  describe('Classes Endpoints', () => {
    it('GET /api/v1/classes should return paginated classes', async () => {
      const res = await request(app).get('/api/v1/classes');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta.total).toBeGreaterThanOrEqual(2);
    });

    it('GET /api/v1/classes/:id should return class details with members and instructors', async () => {
      const res = await request(app).get(`/api/v1/classes/${seededClass.id}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(seededClass.id);
      expect(res.body.data).toHaveProperty('skill_name');
      expect(res.body.data).toHaveProperty('owner_name');
      expect(Array.isArray(res.body.data.members)).toBe(true);
      expect(res.body.data.members.length).toBeGreaterThan(0);
    });
  });

  // ── 7. Learning Sessions Endpoints (§13, §18) ─────────
  describe('Learning Sessions Endpoints', () => {
    it('GET /api/v1/learning-sessions/:id should return session details and participants', async () => {
      const res = await request(app).get(`/api/v1/learning-sessions/${seededSession.id}`);
      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe(seededSession.id);
      expect(res.body.data).toHaveProperty('skill_name');
      expect(res.body.data).toHaveProperty('creator_name');
      expect(Array.isArray(res.body.data.participants)).toBe(true);
      expect(res.body.data.participants.length).toBeGreaterThan(0);
    });

    it('GET /api/v1/learning-sessions/:id with unknown ID should return 404', async () => {
      const res = await request(app).get('/api/v1/learning-sessions/00000000-0000-0000-0000-000000000000');
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  // ── 8. Error Handling & Contract Integrity (§19) ───────
  describe('Error Handling Contract (§19)', () => {
    it('should return standard error structure for unknown routes', async () => {
      const res = await request(app).get('/api/v1/unknown-endpoint');
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        error: {
          code: 'NOT_FOUND',
          message: expect.any(String),
          details: [],
        },
      });
    });
  });
});
