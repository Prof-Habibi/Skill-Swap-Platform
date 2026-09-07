const { v4: uuid } = require('uuid');
const bcrypt = require('bcryptjs');

/**
 * Realistic seed data for SkillSwap.
 * 8 users, 15 skills, user-skill relationships with 5 reciprocal matches,
 * 3 swaps, 3 projects, 2 classes, 4 learning sessions.
 */
exports.seed = async function (knex) {
  // Clean tables in reverse dependency order
  await knex('session_participants').del();
  await knex('learning_sessions').del();
  await knex('class_members').del();
  await knex('classes').del();
  await knex('project_members').del();
  await knex('projects').del();
  await knex('swaps').del();
  await knex('user_skills').del();
  await knex('skills').del();
  await knex('users').del();

  const hash = await bcrypt.hash('skillswap2024', 10);

  // ── Users ──────────────────────────────────────────────
  const users = [
    { id: uuid(), name: 'Aarav Sharma', username: 'aarav', email: 'aarav@skillswap.dev', password_hash: hash, bio: 'Full-stack developer who loves teaching Python and learning visual arts.', location: 'Mumbai, India' },
    { id: uuid(), name: 'Riya Patel', username: 'riya', email: 'riya@skillswap.dev', password_hash: hash, bio: 'Photographer and visual storyteller. Eager to pick up programming.', location: 'Delhi, India' },
    { id: uuid(), name: 'Kawal Singh', username: 'kawal', email: 'kawal@skillswap.dev', password_hash: hash, bio: 'Data scientist by day, guitarist by night.', location: 'Bangalore, India' },
    { id: uuid(), name: 'Priya Nair', username: 'priya', email: 'priya@skillswap.dev', password_hash: hash, bio: 'UI/UX designer passionate about accessible interfaces.', location: 'Chennai, India' },
    { id: uuid(), name: 'Vikram Joshi', username: 'vikram', email: 'vikram@skillswap.dev', password_hash: hash, bio: 'Public speaking coach and aspiring data scientist.', location: 'Pune, India' },
    { id: uuid(), name: 'Meera Gupta', username: 'meera', email: 'meera@skillswap.dev', password_hash: hash, bio: 'Chef and food blogger exploring digital marketing.', location: 'Hyderabad, India' },
    { id: uuid(), name: 'Arjun Reddy', username: 'arjun', email: 'arjun@skillswap.dev', password_hash: hash, bio: 'Web developer interested in machine learning and Spanish.', location: 'Kolkata, India' },
    { id: uuid(), name: 'Zara Khan', username: 'zara', email: 'zara@skillswap.dev', password_hash: hash, bio: 'Creative writer and yoga instructor.', location: 'Jaipur, India' },
  ];
  await knex('users').insert(users);

  // ── Skills ─────────────────────────────────────────────
  const skills = [
    { id: uuid(), name: 'Python', slug: 'python', description: 'General-purpose programming language.', category: 'Programming' },
    { id: uuid(), name: 'Photography', slug: 'photography', description: 'Digital and film photography techniques.', category: 'Arts' },
    { id: uuid(), name: 'Guitar', slug: 'guitar', description: 'Acoustic and electric guitar playing.', category: 'Music' },
    { id: uuid(), name: 'UI/UX Design', slug: 'ui-ux-design', description: 'User interface and experience design.', category: 'Design' },
    { id: uuid(), name: 'Data Science', slug: 'data-science', description: 'Statistical analysis and data modeling.', category: 'Programming' },
    { id: uuid(), name: 'Public Speaking', slug: 'public-speaking', description: 'Effective communication and presentation skills.', category: 'Communication' },
    { id: uuid(), name: 'Cooking', slug: 'cooking', description: 'Culinary arts and food preparation.', category: 'Lifestyle' },
    { id: uuid(), name: 'Graphic Design', slug: 'graphic-design', description: 'Visual design using digital tools.', category: 'Design' },
    { id: uuid(), name: 'Web Development', slug: 'web-development', description: 'Building websites and web applications.', category: 'Programming' },
    { id: uuid(), name: 'Creative Writing', slug: 'creative-writing', description: 'Fiction, poetry, and narrative non-fiction.', category: 'Arts' },
    { id: uuid(), name: 'Machine Learning', slug: 'machine-learning', description: 'Building intelligent systems from data.', category: 'Programming' },
    { id: uuid(), name: 'Digital Marketing', slug: 'digital-marketing', description: 'Online marketing strategies and analytics.', category: 'Business' },
    { id: uuid(), name: 'Video Editing', slug: 'video-editing', description: 'Post-production video editing and effects.', category: 'Arts' },
    { id: uuid(), name: 'Spanish', slug: 'spanish', description: 'Spanish language conversation and grammar.', category: 'Languages' },
    { id: uuid(), name: 'Yoga', slug: 'yoga', description: 'Physical postures, breathing, and meditation.', category: 'Lifestyle' },
  ];
  await knex('skills').insert(skills);

  // Helper: find user/skill by name
  const u = (name) => users.find((x) => x.name.startsWith(name)).id;
  const s = (name) => skills.find((x) => x.name === name).id;

  // ── User-Skill Relationships ───────────────────────────
  // 5 reciprocal match pairs:
  //   Aarav (Python) ↔ Riya (Photography)
  //   Kawal (Data Science) ↔ Vikram (Public Speaking)
  //   Priya (UI/UX) ↔ Arjun (Web Dev)
  //   Meera (Cooking) ↔ Zara (Creative Writing)
  //   Kawal (Guitar) ↔ Zara (Yoga)
  const userSkills = [
    // Aarav: teaches Python, Web Dev. Wants Photography, Guitar
    { id: uuid(), user_id: u('Aarav'), skill_id: s('Python'), relationship_type: 'CAN_TEACH', proficiency_level: 'EXPERT' },
    { id: uuid(), user_id: u('Aarav'), skill_id: s('Web Development'), relationship_type: 'CAN_TEACH', proficiency_level: 'ADVANCED' },
    { id: uuid(), user_id: u('Aarav'), skill_id: s('Photography'), relationship_type: 'WANTS_TO_LEARN', proficiency_level: 'BEGINNER' },
    { id: uuid(), user_id: u('Aarav'), skill_id: s('Guitar'), relationship_type: 'WANTS_TO_LEARN', proficiency_level: 'BEGINNER' },

    // Riya: teaches Photography, Video Editing. Wants Python
    { id: uuid(), user_id: u('Riya'), skill_id: s('Photography'), relationship_type: 'CAN_TEACH', proficiency_level: 'EXPERT' },
    { id: uuid(), user_id: u('Riya'), skill_id: s('Video Editing'), relationship_type: 'CAN_TEACH', proficiency_level: 'ADVANCED' },
    { id: uuid(), user_id: u('Riya'), skill_id: s('Python'), relationship_type: 'WANTS_TO_LEARN', proficiency_level: 'BEGINNER' },

    // Kawal: teaches Data Science, Guitar. Wants Public Speaking, Yoga
    { id: uuid(), user_id: u('Kawal'), skill_id: s('Data Science'), relationship_type: 'CAN_TEACH', proficiency_level: 'ADVANCED' },
    { id: uuid(), user_id: u('Kawal'), skill_id: s('Guitar'), relationship_type: 'CAN_TEACH', proficiency_level: 'INTERMEDIATE' },
    { id: uuid(), user_id: u('Kawal'), skill_id: s('Public Speaking'), relationship_type: 'WANTS_TO_LEARN', proficiency_level: 'BEGINNER' },
    { id: uuid(), user_id: u('Kawal'), skill_id: s('Yoga'), relationship_type: 'WANTS_TO_LEARN', proficiency_level: 'BEGINNER' },

    // Priya: teaches UI/UX, Graphic Design. Wants Web Dev, Machine Learning
    { id: uuid(), user_id: u('Priya'), skill_id: s('UI/UX Design'), relationship_type: 'CAN_TEACH', proficiency_level: 'EXPERT' },
    { id: uuid(), user_id: u('Priya'), skill_id: s('Graphic Design'), relationship_type: 'CAN_TEACH', proficiency_level: 'ADVANCED' },
    { id: uuid(), user_id: u('Priya'), skill_id: s('Web Development'), relationship_type: 'WANTS_TO_LEARN', proficiency_level: 'BEGINNER' },
    { id: uuid(), user_id: u('Priya'), skill_id: s('Machine Learning'), relationship_type: 'WANTS_TO_LEARN', proficiency_level: 'BEGINNER' },

    // Vikram: teaches Public Speaking. Wants Data Science
    { id: uuid(), user_id: u('Vikram'), skill_id: s('Public Speaking'), relationship_type: 'CAN_TEACH', proficiency_level: 'EXPERT' },
    { id: uuid(), user_id: u('Vikram'), skill_id: s('Data Science'), relationship_type: 'WANTS_TO_LEARN', proficiency_level: 'BEGINNER' },

    // Meera: teaches Cooking. Wants Digital Marketing, Creative Writing
    { id: uuid(), user_id: u('Meera'), skill_id: s('Cooking'), relationship_type: 'CAN_TEACH', proficiency_level: 'EXPERT' },
    { id: uuid(), user_id: u('Meera'), skill_id: s('Digital Marketing'), relationship_type: 'WANTS_TO_LEARN', proficiency_level: 'BEGINNER' },
    { id: uuid(), user_id: u('Meera'), skill_id: s('Creative Writing'), relationship_type: 'WANTS_TO_LEARN', proficiency_level: 'BEGINNER' },

    // Arjun: teaches Web Dev, Machine Learning. Wants UI/UX, Spanish
    { id: uuid(), user_id: u('Arjun'), skill_id: s('Web Development'), relationship_type: 'CAN_TEACH', proficiency_level: 'ADVANCED' },
    { id: uuid(), user_id: u('Arjun'), skill_id: s('Machine Learning'), relationship_type: 'CAN_TEACH', proficiency_level: 'INTERMEDIATE' },
    { id: uuid(), user_id: u('Arjun'), skill_id: s('UI/UX Design'), relationship_type: 'WANTS_TO_LEARN', proficiency_level: 'BEGINNER' },
    { id: uuid(), user_id: u('Arjun'), skill_id: s('Spanish'), relationship_type: 'WANTS_TO_LEARN', proficiency_level: 'BEGINNER' },

    // Zara: teaches Creative Writing, Yoga. Wants Cooking, Guitar
    { id: uuid(), user_id: u('Zara'), skill_id: s('Creative Writing'), relationship_type: 'CAN_TEACH', proficiency_level: 'ADVANCED' },
    { id: uuid(), user_id: u('Zara'), skill_id: s('Yoga'), relationship_type: 'CAN_TEACH', proficiency_level: 'EXPERT' },
    { id: uuid(), user_id: u('Zara'), skill_id: s('Cooking'), relationship_type: 'WANTS_TO_LEARN', proficiency_level: 'BEGINNER' },
    { id: uuid(), user_id: u('Zara'), skill_id: s('Guitar'), relationship_type: 'WANTS_TO_LEARN', proficiency_level: 'BEGINNER' },
  ];
  await knex('user_skills').insert(userSkills);

  // ── Swaps ──────────────────────────────────────────────
  const swaps = [
    { id: uuid(), requester_id: u('Aarav'), recipient_id: u('Riya'), requester_skill_id: s('Python'), recipient_skill_id: s('Photography'), status: 'ACCEPTED' },
    { id: uuid(), requester_id: u('Kawal'), recipient_id: u('Vikram'), requester_skill_id: s('Data Science'), recipient_skill_id: s('Public Speaking'), status: 'PENDING' },
    { id: uuid(), requester_id: u('Meera'), recipient_id: u('Zara'), requester_skill_id: s('Cooking'), recipient_skill_id: s('Creative Writing'), status: 'COMPLETED' },
  ];
  await knex('swaps').insert(swaps);

  // ── Projects ───────────────────────────────────────────
  const projects = [
    { id: uuid(), title: 'SkillSwap Mobile App', description: 'Cross-platform mobile app for the SkillSwap platform.', owner_id: u('Aarav'), status: 'ACTIVE', visibility: 'PUBLIC' },
    { id: uuid(), title: 'Photography Portfolio Site', description: 'A portfolio website showcasing photography work.', owner_id: u('Riya'), status: 'ACTIVE', visibility: 'PUBLIC' },
    { id: uuid(), title: 'Data Viz Dashboard', description: 'Interactive data visualization dashboard for learning analytics.', owner_id: u('Kawal'), status: 'DRAFT', visibility: 'PRIVATE' },
  ];
  await knex('projects').insert(projects);

  const projectMembers = [
    { id: uuid(), project_id: projects[0].id, user_id: u('Aarav'), role: 'OWNER' },
    { id: uuid(), project_id: projects[0].id, user_id: u('Arjun'), role: 'CONTRIBUTOR' },
    { id: uuid(), project_id: projects[0].id, user_id: u('Priya'), role: 'MEMBER' },
    { id: uuid(), project_id: projects[1].id, user_id: u('Riya'), role: 'OWNER' },
    { id: uuid(), project_id: projects[1].id, user_id: u('Zara'), role: 'CONTRIBUTOR' },
    { id: uuid(), project_id: projects[2].id, user_id: u('Kawal'), role: 'OWNER' },
    { id: uuid(), project_id: projects[2].id, user_id: u('Vikram'), role: 'MEMBER' },
  ];
  await knex('project_members').insert(projectMembers);

  // ── Classes ────────────────────────────────────────────
  const classes = [
    { id: uuid(), title: 'Python Fundamentals', description: 'Learn Python from scratch in 4 sessions.', skill_id: s('Python'), owner_id: u('Aarav'), max_participants: 10, status: 'OPEN', start_at: new Date('2026-09-15T10:00:00Z'), end_at: new Date('2026-10-15T10:00:00Z') },
    { id: uuid(), title: 'Photography Masterclass', description: 'Composition, lighting, and post-processing.', skill_id: s('Photography'), owner_id: u('Riya'), max_participants: 8, status: 'ACTIVE', start_at: new Date('2026-09-10T14:00:00Z'), end_at: new Date('2026-10-10T14:00:00Z') },
  ];
  await knex('classes').insert(classes);

  const classMembers = [
    { id: uuid(), class_id: classes[0].id, user_id: u('Aarav'), role: 'INSTRUCTOR' },
    { id: uuid(), class_id: classes[0].id, user_id: u('Riya'), role: 'LEARNER' },
    { id: uuid(), class_id: classes[0].id, user_id: u('Priya'), role: 'LEARNER' },
    { id: uuid(), class_id: classes[0].id, user_id: u('Meera'), role: 'LEARNER' },
    { id: uuid(), class_id: classes[1].id, user_id: u('Riya'), role: 'INSTRUCTOR' },
    { id: uuid(), class_id: classes[1].id, user_id: u('Aarav'), role: 'LEARNER' },
    { id: uuid(), class_id: classes[1].id, user_id: u('Zara'), role: 'LEARNER' },
  ];
  await knex('class_members').insert(classMembers);

  // ── Learning Sessions ──────────────────────────────────
  const sessions = [
    { id: uuid(), title: 'Python Basics: Variables & Types', description: 'First session covering Python fundamentals.', skill_id: s('Python'), swap_id: swaps[0].id, class_id: null, created_by: u('Aarav'), start_time: new Date('2026-09-16T10:00:00Z'), end_time: new Date('2026-09-16T11:30:00Z'), status: 'COMPLETED' },
    { id: uuid(), title: 'Photography Composition 101', description: 'Rule of thirds, leading lines, framing.', skill_id: s('Photography'), swap_id: swaps[0].id, class_id: null, created_by: u('Riya'), start_time: new Date('2026-09-17T14:00:00Z'), end_time: new Date('2026-09-17T15:30:00Z'), status: 'COMPLETED' },
    { id: uuid(), title: 'Python Fundamentals: Session 1', description: 'Class session — intro to Python.', skill_id: s('Python'), swap_id: null, class_id: classes[0].id, created_by: u('Aarav'), start_time: new Date('2026-09-15T10:00:00Z'), end_time: new Date('2026-09-15T11:30:00Z'), status: 'SCHEDULED' },
    { id: uuid(), title: 'Creative Writing Workshop', description: 'Short story structure and character development.', skill_id: s('Creative Writing'), swap_id: swaps[2].id, class_id: null, created_by: u('Zara'), start_time: new Date('2026-09-20T16:00:00Z'), end_time: new Date('2026-09-20T17:30:00Z'), status: 'SCHEDULED' },
  ];
  await knex('learning_sessions').insert(sessions);

  const sessionParticipants = [
    { id: uuid(), session_id: sessions[0].id, user_id: u('Aarav'), role: 'TEACHER' },
    { id: uuid(), session_id: sessions[0].id, user_id: u('Riya'), role: 'LEARNER' },
    { id: uuid(), session_id: sessions[1].id, user_id: u('Riya'), role: 'TEACHER' },
    { id: uuid(), session_id: sessions[1].id, user_id: u('Aarav'), role: 'LEARNER' },
    { id: uuid(), session_id: sessions[2].id, user_id: u('Aarav'), role: 'TEACHER' },
    { id: uuid(), session_id: sessions[2].id, user_id: u('Riya'), role: 'LEARNER' },
    { id: uuid(), session_id: sessions[2].id, user_id: u('Priya'), role: 'LEARNER' },
    { id: uuid(), session_id: sessions[2].id, user_id: u('Meera'), role: 'LEARNER' },
    { id: uuid(), session_id: sessions[3].id, user_id: u('Zara'), role: 'TEACHER' },
    { id: uuid(), session_id: sessions[3].id, user_id: u('Meera'), role: 'LEARNER' },
  ];
  await knex('session_participants').insert(sessionParticipants);

  console.log('[SEED] Inserted 8 users, 15 skills, 27 user-skill relationships, 3 swaps, 3 projects, 7 project members, 2 classes, 7 class members, 4 sessions, 10 session participants');
};
