import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { CODING_TRACKS, getInterestLabel, INTERESTS, INSTRUMENTS, normalizeInterest } from '../data/constants.js';

export default function EditInterests({ onClose }) {
  const { user, updateInterests, showToast } = useAuth();
  const [selected, setSelected] = useState((user.interests || []).map(normalizeInterest).filter((interest) => INTERESTS.includes(interest)));
  const [instrument, setInstrument] = useState(INSTRUMENTS.some((item) => item.value === user.instrument) ? user.instrument : '🎸');
  const [codingTrack, setCodingTrack] = useState(user.codingTrack || 'Web Development');
  const [codingTracks, setCodingTracks] = useState(user.codingTracks?.length ? user.codingTracks : [user.codingTrack || 'Web Development']);
  const [saving, setSaving] = useState(false);

  const toggle = (val) => {
    setSelected((prev) => {
      if (prev.includes(val)) return prev.filter((x) => x !== val);
      if (prev.length >= 3) {
        showToast('You can select up to 3 interests only.');
        return prev;
      }
      return [...prev, val];
    });
  };

  const save = async () => {
    if (selected.length === 0) return showToast('Please select at least one interest.');
    if (selected.includes('💻 Coding') && codingTracks.length === 0) return showToast('Select at least one coding language.');
    setSaving(true);
    try {
      await updateInterests(selected, selected.includes('🎸 Music') ? instrument : null, selected.includes('💻 Coding') ? codingTracks[0] : null, selected.includes('💻 Coding') ? codingTracks : []);
      onClose();
      showToast('Interests updated.');
    } catch (error) {
      showToast(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{ display: 'flex', position: 'fixed', inset: 0, zIndex: 260, background: 'rgba(0,0,0,.78)', backdropFilter: 'blur(14px)', alignItems: 'flex-start', justifyContent: 'center', padding: '2rem 1rem', overflowY: 'auto' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '28px', width: '100%', maxWidth: '480px', padding: '2.25rem', position: 'relative', margin: 'auto' }}>
        <button type="button" onClick={onClose} style={{ position: 'absolute', top: '1.1rem', right: '1.1rem', background: 'var(--surface2)', border: 'none', width: 34, height: 34, borderRadius: '50%', color: 'var(--muted)', cursor: 'pointer' }}>✕</button>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '.3rem' }}>Edit Your Interests</h2>
        <p style={{ color: 'var(--muted)', fontSize: '.85rem', marginBottom: '1.5rem' }}>Pick 1–3 things you want to learn. Your dashboard and exams will update.</p>
        <div className="interest-grid">
          {INTERESTS.map((item) => (
            <button type="button" key={item} className={`interest-chip${selected.includes(item) ? ' selected' : ''}`} onClick={() => toggle(item)}>{getInterestLabel(item)}</button>
          ))}
        </div>
        {selected.includes('🎸 Music') && (
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Which instrument?</label>
            <select value={instrument} onChange={(e) => setInstrument(e.target.value)}>
              {INSTRUMENTS.map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
            </select>
          </div>
        )}
        {selected.includes('💻 Coding') && (
          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label>Which coding languages?</label>
            <div className="track-grid">
              {CODING_TRACKS.map((track) => <button type="button" key={track.value} className={`track-option${codingTracks.includes(track.value) ? ' selected' : ''}`} onClick={() => { const next = codingTracks.includes(track.value) ? codingTracks.filter((value) => value !== track.value) : [...codingTracks, track.value]; setCodingTracks(next); setCodingTrack(next[0] || track.value); }}>{codingTracks.includes(track.value) ? '✓ ' : ''}{track.label}</button>)}
            </div>
          </div>
        )}
        <button type="button" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '1.25rem' }} onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Changes ✓'}</button>
      </div>
    </div>
  );
}
