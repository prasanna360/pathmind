import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { supabaseAdmin } from './supabaseClient.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readJson(file, fallback) {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, file);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2));
    return structuredClone(fallback);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(file, data) {
  ensureDataDir();
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

export function getUsers() {
  return readJson('users.json', {});
}

export function saveUsers(users) {
  writeJson('users.json', users);
}

function usesSupabaseUserStorage() {
  return Boolean(
    process.env.VERCEL
    || process.env.NODE_ENV === 'production'
    || process.env.USE_SUPABASE_USER_STORAGE === 'true',
  );
}

function requireSupabaseStorage() {
  if (usesSupabaseUserStorage() && !supabaseAdmin) {
    throw new Error('Supabase service-role configuration is required in production.');
  }
}

export async function getUser(email) {
  requireSupabaseStorage();
  if (usesSupabaseUserStorage()) {
    const { data, error } = await supabaseAdmin
      .from('app_users')
      .select('user_data')
      .eq('email', email)
      .maybeSingle();
    if (error) throw new Error(`Supabase user read failed: ${error.message}`);
    return data?.user_data || null;
  }
  return getUsers()[email] || null;
}

export async function createUser(user) {
  requireSupabaseStorage();
  if (usesSupabaseUserStorage()) {
    const { error } = await supabaseAdmin
      .from('app_users')
      .insert({ email: user.email, user_data: user });
    if (error) throw error;
    return;
  }

  const users = getUsers();
  if (users[user.email]) {
    const error = new Error('User already exists.');
    error.code = '23505';
    throw error;
  }
  users[user.email] = user;
  saveUsers(users);
}

export async function saveUser(user) {
  requireSupabaseStorage();
  if (usesSupabaseUserStorage()) {
    const { error } = await supabaseAdmin
      .from('app_users')
      .upsert({ email: user.email, user_data: user }, { onConflict: 'email' });
    if (error) throw new Error(`Supabase user save failed: ${error.message}`);
    return;
  }

  const users = getUsers();
  users[user.email] = user;
  saveUsers(users);
}

export function getResources() {
  return readJson('resources.json', null);
}

export function saveResources(resources) {
  writeJson('resources.json', resources);
}

export function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}
