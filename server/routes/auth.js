import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { createUser, getUser, sanitizeUser } from '../db.js';
import { signToken, authRequired } from '../middleware/auth.js';

const router = Router();
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/signup', async (req, res) => {
  try {
    const { name, email, age, password, interests, freeTime, goal, skillLevel, instrument, codingTrack, codingTracks } = req.body;

    if (!name?.trim()) return res.status(400).json({ error: 'Please enter your name.' });
    if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (!age || age < 18 || age > 35) return res.status(400).json({ error: 'Age must be between 18 and 35.' });
    if (!password || password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    if (!interests?.length) return res.status(400).json({ error: 'Please select at least one interest.' });

    const key = email.trim().toLowerCase();

    const user = {
      name: name.trim(),
      email: key,
      age,
      password: await bcrypt.hash(password, 10),
      interests,
      freeTime: freeTime || 60,
      goal: goal?.trim() || null,
      skillLevel: skillLevel || 'Beginner',
      instrument: interests.includes('🎸 Music') ? instrument : null,
      codingTracks: interests.includes('💻 Coding') ? (Array.isArray(codingTracks) && codingTracks.length ? codingTracks : [codingTrack || 'Web Development']) : [],
      codingTrack: interests.includes('💻 Coding') ? codingTracks?.[0] || codingTrack || 'Web Development' : null,
      streak: 1,
      hours: 0,
      badges: 0,
      examHistory: [],
      createdAt: new Date().toISOString(),
    };

    await createUser(user);

    const safe = sanitizeUser(user);
    const token = signToken(user);
    res.status(201).json({ user: safe, token });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'already_registered' });
    console.error(err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (typeof email !== 'string' || !EMAIL_PATTERN.test(email.trim()) || !password) {
      return res.status(400).json({ error: 'Please enter a valid email address and password.' });
    }
    const key = email.trim().toLowerCase();
    const user = await getUser(key);
    if (!user) return res.status(401).json({ error: 'No account found with this email.' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Incorrect password.' });

    const safe = sanitizeUser(user);
    const token = signToken(user);
    res.json({ user: safe, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/me', authRequired, (req, res) => {
  res.json({ user: req.user });
});

export default router;
