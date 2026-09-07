import { Router } from 'express';
import { getResources, saveResources } from '../db.js';
import { authRequired } from '../middleware/auth.js';
import { seedResources } from '../data/seedResources.js';
import { supabaseAdmin } from '../supabaseClient.js';

const router = Router();

function loadResources() {
  let resources = getResources();
  if (!resources) {
    resources = seedResources();
    saveResources(resources);
  }
  return resources;
}

async function getSupabaseResources(key, week) {
  const { data, error } = await supabaseAdmin
    .from('learning_resources')
    .select('title, url, type, created_by')
    .eq('key', key)
    .eq('week', Number(week))
    .order('created_at', { ascending: true });
  if (error) throw new Error(`Supabase read failed: ${error.message}`);

  if (data?.length) return data;

  const seed = seedResources()[`${key}|${week}`] || [];
  if (!seed.length) return [];

  const { data: inserted, error: insertError } = await supabaseAdmin
    .from('learning_resources')
    .insert(seed.map((resource) => ({
      key,
      week: Number(week),
      title: resource.title,
      url: resource.url,
      type: resource.type,
      created_by: resource.by,
    })))
    .select('title, url, type, created_by');
  if (insertError) throw new Error(`Supabase seed failed: ${insertError.message}`);
  return inserted || [];
}

router.get('/', authRequired, (_req, res) => {
  if (supabaseAdmin) {
    return supabaseAdmin
      .from('learning_resources')
      .select('key, week, title, url, type, created_by, created_at')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) return res.status(502).json({ error: `Supabase read failed: ${error.message}` });
        res.json({ resources: data || [] });
      });
  }

  res.json({ resources: loadResources() });
});

router.get('/:key/:week', authRequired, (req, res) => {
  const storageKey = req.query.codingTrack ? `${req.params.key}|${req.query.codingTrack}` : req.params.key;
  if (supabaseAdmin) {
    return getSupabaseResources(storageKey, req.params.week)
      .then((data) => res.json({ resources: data.map((resource) => ({ ...resource, by: resource.created_by })) }))
      .catch((error) => res.status(502).json({ error: error.message }));
  }

  const resources = loadResources();
  const lookup = `${storageKey}|${req.params.week}`;
  res.json({ resources: resources[lookup] || [] });
});

router.post('/', authRequired, (req, res) => {
  const { key, week, codingTrack, title, url, type } = req.body;
  if (!title?.trim() || !url?.trim()) {
    return res.status(400).json({ error: 'Title and URL are required.' });
  }
  if (!/^https?:\/\//i.test(url)) {
    return res.status(400).json({ error: 'Please enter a valid URL starting with http(s)://' });
  }

  const storageKey = codingTrack ? `${key}|${codingTrack}` : key;

  if (supabaseAdmin) {
    return supabaseAdmin
      .from('learning_resources')
      .insert({ key: storageKey, week: Number(week), title: title.trim(), url: url.trim(), type: type || 'article', created_by: req.user.name.split(' ')[0] })
      .select('title, url, type, created_by')
      .then(({ data, error }) => {
        if (error) return res.status(502).json({ error: `Supabase write failed: ${error.message}` });
        res.status(201).json({ resources: (data || []).map((resource) => ({ ...resource, by: resource.created_by })) });
      });
  }

  const resources = loadResources();
  const lookup = `${storageKey}|${week}`;
  if (!resources[lookup]) resources[lookup] = [];

  resources[lookup].push({
    title: title.trim(),
    url: url.trim(),
    type: type || 'article',
    by: req.user.name.split(' ')[0],
  });

  saveResources(resources);
  res.status(201).json({ resources: resources[lookup] });
});

export default router;
