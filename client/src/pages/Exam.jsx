import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { getInterestLabel } from '../data/constants.js';

export default function Exam() {
  const { user, submitExamResult } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const topic = state?.topic;
  const week = state?.week || 1;
  const codingTrack = state?.codingTrack;

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(12 * 60);
  const startTime = useRef(Date.now());
  const timerRef = useRef(null);

  useEffect(() => {
    if (!topic) {
      navigate('/dashboard', { replace: true });
      return;
    }
    (async () => {
      const instrument = topic === '🎸 Music' ? user?.instrument : undefined;
      const { questions: qs } = await api.getQuestions(topic, instrument, week, codingTrack);
      setQuestions(qs);
      setAnswers(Array(qs.length).fill(null));
    })();
  }, [topic, week, codingTrack, user, navigate]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  if (!questions.length) {
    return <div className="page active" style={{ justifyContent: 'center', alignItems: 'center' }}>Loading exam...</div>;
  }

  const q = questions[currentQ];
  const answered = answers[currentQ]?.trim?.() || answers[currentQ] !== null;
  const pct = ((currentQ + 1) / questions.length) * 100;
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');

  const selectAns = (idx) => {
    if (answers[currentQ] !== null) return;
    setAnswers((a) => { const next = [...a]; next[currentQ] = idx; return next; });
  };

  const writeAns = (value) => {
    setAnswers((a) => { const next = [...a]; next[currentQ] = value; return next; });
  };

  const goToPreviousQuestion = () => {
    setCurrentQ((question) => Math.max(0, question - 1));
  };

  const finish = async () => {
    clearInterval(timerRef.current);
    const elapsed = Math.round((Date.now() - startTime.current) / 1000);
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    const timeStr = `${m}m ${s}s`;
    const mcqQuestions = questions.filter((question) => question.type !== 'written');
    const correct = answers.reduce((total, answer, index) => total + (questions[index].type !== 'written' && answer === questions[index].a ? 1 : 0), 0);
    const writtenSubmitted = questions.reduce((total, question, index) => total + (question.type === 'written' && answers[index]?.trim().length >= 20 ? 1 : 0), 0);
    const wrong = mcqQuestions.length - correct;
    const score = Math.round((correct / mcqQuestions.length) * 100);

    await submitExamResult({ score, correct, wrong, writtenSubmitted, timeTaken: timeStr, topic, codingTrack });
    navigate('/result', { state: { score, correct, wrong, writtenSubmitted, timeStr, topic, week, codingTrack } });
  };

  return (
    <div className="page active">
      <div className="exam-container">
        <div className="exam-top">
          <h2>Week {week} Skill Assessment – {getInterestLabel(topic)}</h2>
          <div className="timer-badge"><span>{mins}:{secs}</span></div>
        </div>
        <div className="exam-progress-wrap">
          <div className="exam-progress-bar" style={{ width: `${pct}%` }} />
        </div>

        <div className="question-card">
          <div className="q-number">Question {currentQ + 1} of {questions.length}</div>
          <div className="q-text">{q.q}</div>
          {q.type === 'written' ? (
            <textarea className="written-answer" value={answers[currentQ] || ''} onChange={(e) => writeAns(e.target.value)} placeholder="Write at least 20 characters..." rows={7} />
          ) : (
            <div className="options-grid">
            {q.o.map((opt, i) => {
              let cls = 'option-btn';
              if (answered) {
                if (i === q.a) cls += ' correct';
                else if (i === answers[currentQ]) cls += ' wrong';
              }
              return (
                <button key={opt} type="button" className={cls} disabled={answered} onClick={() => selectAns(i)}>{opt}</button>
              );
            })}
            </div>
          )}
          {answered && q.type !== 'written' && (
            <div className={`feedback-box ${answers[currentQ] === q.a ? 'correct-fb' : 'wrong-fb'} show`}>
              {answers[currentQ] === q.a ? 'Correct. Well done.' : `Incorrect. The right answer is: ${q.o[q.a]}`}
            </div>
          )}
        </div>

        <div className="exam-nav">
          <span className="q-counter">Question {currentQ + 1} of {questions.length}</span>
          <div style={{ display: 'flex', gap: '.75rem', alignItems: 'center' }}>
            <button type="button" className="btn btn-outline" onClick={goToPreviousQuestion} disabled={currentQ === 0}>← Prev</button>
            {answered && currentQ < questions.length - 1 && (
              <button type="button" className="btn btn-outline" onClick={() => setCurrentQ((c) => c + 1)}>Next →</button>
            )}
            {answered && currentQ === questions.length - 1 && (
              <button type="button" className="btn btn-success" onClick={finish}>Submit Exam</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
