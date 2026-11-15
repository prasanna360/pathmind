import { Router } from 'express';
import asyncHandler from '../asyncHandler.js';
import { getUser, saveUser, sanitizeUser } from '../db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.post('/lesson-complete', authRequired, asyncHandler(async (req, res) => {
  const { key, week, codingTrack } = req.body;
  if (!key || !Number.isInteger(Number(week)) || Number(week) < 1 || Number(week) > 12) {
    return res.status(400).json({ error: 'A valid learning path and week are required.' });
  }

  const user = await getUser(req.userEmail);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (!user.completedLessons) user.completedLessons = {};
  const storageKey = key === '💻 Coding' && codingTrack ? `${key}|${codingTrack}|${Number(week)}` : `${key}|${Number(week)}`;
  user.completedLessons[storageKey] = true;
  await saveUser(user);
  res.json({ user: sanitizeUser(user) });
}));

router.post('/project-complete', authRequired, asyncHandler(async (req, res) => {
  const { key, week, codingTrack, title, description, url } = req.body;
  if (!key || !Number.isInteger(Number(week)) || Number(week) < 1 || Number(week) > 12) {
    return res.status(400).json({ error: 'A valid learning path and week are required.' });
  }
  if (!title?.trim() || !description?.trim()) {
    return res.status(400).json({ error: 'Project title and description are required.' });
  }
  if (url?.trim() && !/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: 'Project links must start with http:// or https://.' });
  }

  const user = await getUser(req.userEmail);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (!user.completedProjects) user.completedProjects = {};
  const storageKey = key === '💻 Coding' && codingTrack ? `${key}|${codingTrack}|${Number(week)}` : `${key}|${Number(week)}`;
  user.completedProjects[storageKey] = {
    title: title.trim(),
    description: description.trim(),
    url: url?.trim() || null,
    completedAt: new Date().toISOString(),
  };
  await saveUser(user);
  res.json({ user: sanitizeUser(user) });
}));

router.put('/interests', authRequired, asyncHandler(async (req, res) => {
  const { interests, instrument, codingTrack, codingTracks } = req.body;
  if (!interests?.length) return res.status(400).json({ error: 'Please select at least one interest.' });

  const user = await getUser(req.userEmail);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.interests = interests;
  user.instrument = interests.includes('🎸 Music') ? instrument : null;
  user.codingTracks = interests.includes('💻 Coding') ? (Array.isArray(codingTracks) && codingTracks.length ? codingTracks : [codingTrack || 'Web Development']) : [];
  user.codingTrack = interests.includes('💻 Coding') ? user.codingTracks[0] : null;
  await saveUser(user);
  res.json({ user: sanitizeUser(user) });
}));

router.post('/exam-result', authRequired, asyncHandler(async (req, res) => {
  const { score, correct, wrong, writtenSubmitted, timeTaken, topic, codingTrack } = req.body;
  const user = await getUser(req.userEmail);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (!user.examHistory) user.examHistory = [];
  user.examHistory.push({
    score,
    correct,
    wrong,
    writtenSubmitted: writtenSubmitted || 0,
    timeTaken,
    date: new Date().toISOString(),
    topic,
    codingTrack: topic === '💻 Coding' ? codingTrack || null : null,
  });

  if (score >= 80) user.badges = (user.badges || 0) + 1;
  user.streak = (user.streak || 1) + (score >= 40 ? 1 : 0);
  user.hours = (user.hours || 0) + 1;

  await saveUser(user);
  res.json({ user: sanitizeUser(user) });
}));

export default router;
