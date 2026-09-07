import { Router } from 'express';
import { QB, MUSIC_QB } from '../data/questions.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/questions/:topic', authRequired, (req, res) => {
  const { topic } = req.params;
  const { instrument, week, codingTrack } = req.query;

  let questions = QB[topic];
  if (topic === '🎸 Music' && instrument && MUSIC_QB[instrument]) {
    questions = MUSIC_QB[instrument];
  }

  if (!questions) {
    return res.status(404).json({ error: 'No questions found for this topic.' });
  }

  const writtenPrompts = {
    '🎸 Music': [
      `Write a short practice plan for a skill from week ${week || 1}. Include your goal, steps, and how you would check your progress.`,
      `Explain one idea from week ${week || 1} in your own words, then apply it to a real music example.`,
    ],
    '💻 Coding': [
      `Write a short example or pseudocode that demonstrates a week ${week || 1} ${codingTrack || 'coding'} concept, and explain how it works.`,
      `Describe a likely mistake related to week ${week || 1} of ${codingTrack || 'coding'}, then give the steps you would use to debug it.`,
    ],
    '🎨 Crafting': [
      'Describe the materials and steps you would use to make a small project from this week’s skill.',
      'Explain one design choice you would make and why it improves the finished piece.',
    ],
    '💃 Dance': [
      'Describe a short practice sequence that develops this week’s movement skill.',
      'Explain one technique or safety point that matters when practising this skill.',
    ],
    '📷 Photography': [
      'Describe how you would use this week’s camera skill in a real photo assignment.',
      'Explain one creative decision you would make and how it changes the image.',
    ],
    '✍️ Writing': [
      'Write a short example that demonstrates this week’s writing skill.',
      'Explain how you would revise a draft using this week’s technique.',
    ],
    '🍳 Cooking': [
      'Describe how you would apply this week’s cooking technique in a simple dish.',
      'Explain one safety or quality check you would make while using this skill.',
    ],
    '🎭 Acting': [
      'Describe a short acting exercise that develops this week’s performance skill.',
      'Explain how an actor can apply this skill during a scene or audition.',
    ],
  };

  res.json({
    questions: [
      ...questions.slice(0, 10).map((question) => ({ ...question, type: 'mcq' })),
      ...(writtenPrompts[topic] || []).map((question) => ({ q: question, type: 'written' })),
    ],
  });
});

export default router;
