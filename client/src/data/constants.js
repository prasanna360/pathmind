export const INTERESTS = [
  '🎸 Music',
  '💻 Coding',
  '💃 Dance',
  '📷 Photography',
  '🍳 Cooking',
];

export function normalizeInterest(value) {
  if (INTERESTS.includes(value)) return value;
  const label = value?.split(' ').slice(1).join(' ');
  return INTERESTS.find((interest) => interest.split(' ').slice(1).join(' ') === label) || value;
}

export const INSTRUMENTS = [
  { value: '🎸', label: '🎸 Guitar' },
  { value: '🎹', label: '🎹 Piano' },
  { value: '🎻', label: '🎻 Violin' },
];

export const instrumentNames = {
  '🎸': 'Guitar',
  '🎹': 'Piano',
  '🎻': 'Violin',
};

export const CODING_TRACKS = [
  { value: 'Web Development', label: '🌐 Web Development' },
  { value: 'Python', label: '🐍 Python' },
  { value: 'Java', label: '☕ Java' },
  { value: 'JavaScript', label: '⚡ JavaScript' },
  { value: 'C++', label: '🔧 C++' },
  { value: 'Data Structures', label: '🧩 Data Structures & Algorithms' },
];

export const pathData = {
  '🎸 Music': { desc: 'Guitar, theory, songwriting & more', emoji: '🎸' },
  '💻 Coding': { desc: 'Web dev, Python, algorithms & projects', emoji: '💻' },
  '💃 Dance': { desc: 'Contemporary, hip-hop, salsa & more', emoji: '💃' },
  '📷 Photography': { desc: 'Composition, editing, portraits & street', emoji: '📷' },
  '🍳 Cooking': { desc: 'Cuisines, techniques & nutrition', emoji: '🍳' },
};

export const INSTRUMENT_CURRICULA = {
  '🎸': ['Intro & Tuning', 'Open Chords', 'Strumming Patterns', 'Reading Tabs', 'Fingerpicking', 'Barre Chords', 'Scales & Modes', 'Power Chords', 'Song Structure', 'Improvisation', 'Recording Tips', 'Final Performance'],
  '🎹': ['Posture & Keys', 'C Major Scale', 'Simple Melodies', 'Left Hand Basics', 'Both Hands', 'Chords', 'Sight Reading', 'Dynamics', 'Classical Piece', 'Jazz Intro', 'Composition', 'Recital'],
  '🎻': ['Posture & Bow Hold', 'Open Strings', 'First Position Notes', 'Bowing Techniques', 'Simple Scales', 'Vibrato Intro', 'Shifting Positions', 'Double Stops', 'Reading Music', 'Etudes', 'Solo Piece', 'Recital'],
};

export const CODING_CURRICULA = {
  'Web Development': ['HTML Foundations', 'CSS Layouts', 'Responsive Design', 'JavaScript Basics', 'DOM & Events', 'APIs & Fetch', 'Git & GitHub', 'React Foundations', 'Components & State', 'Node.js Basics', 'Databases', 'Build a Web Project'],
  Python: ['Python Syntax', 'Variables & Data Types', 'Conditions & Loops', 'Functions', 'Lists & Dictionaries', 'Files & Exceptions', 'Object-Oriented Python', 'Packages & Virtual Environments', 'APIs with Python', 'Testing & Debugging', 'Data Processing', 'Build a Python Project'],
  Java: ['Java Syntax', 'Variables & Control Flow', 'Methods', 'Arrays & Strings', 'Classes & Objects', 'Inheritance', 'Interfaces & Polymorphism', 'Collections', 'Exceptions', 'Files & I/O', 'Testing', 'Build a Java Project'],
  JavaScript: ['JavaScript Syntax', 'Variables & Functions', 'Arrays & Objects', 'DOM Manipulation', 'Events', 'Async JavaScript', 'Fetch & APIs', 'Modules', 'Testing', 'Node.js', 'Express APIs', 'Build a JavaScript Project'],
  'C++': ['C++ Syntax', 'Variables & Control Flow', 'Functions', 'Arrays & Strings', 'Pointers & References', 'Classes & Objects', 'Inheritance', 'STL Containers', 'Algorithms', 'Memory Management', 'Debugging', 'Build a C++ Project'],
  'Data Structures': ['Big-O Complexity', 'Arrays & Strings', 'Linked Lists', 'Stacks & Queues', 'Hash Tables', 'Recursion', 'Trees', 'Binary Search Trees', 'Heaps & Priority Queues', 'Graphs', 'Sorting & Searching', 'Algorithm Project'],
};

export const topicMap = {
  '🎸 Music': INSTRUMENT_CURRICULA['🎸'],
  '💻 Coding': CODING_CURRICULA['Web Development'],
  '💃 Dance': ['Warm-Up & Stretch', 'Rhythm & Beat', 'Basic Steps', 'Footwork', 'Body Isolation', 'Arm Styling', 'Turns & Spins', 'Partner Work', 'Freestyle', 'Performance Tips', 'Choreography', 'Showcase'],
  '📷 Photography': ['Camera Settings', 'Composition', 'Lighting Basics', 'Portrait Mode', 'Street Photography', 'Editing in Lightroom', 'Color Grading', 'Night Photography', 'Action Shots', 'Macro', 'Photo Essay', 'Portfolio Review'],
  '🍳 Cooking': ['Kitchen Safety', 'Knife Skills', 'Stocks & Sauces', 'Vegetables', 'Proteins', 'Baking Basics', 'World Cuisines', 'Plating', 'Nutrition', 'Meal Prep', 'Fusion Cooking', 'Final Dish'],
};

export const coaches = [
  { e: '🎸', n: 'Arjun Sharma', s: 'Music & Guitar', i: 'IIT Road · ⭐ 4.9', b: 'Open Today', lat: 13.0827, lng: 80.2707 },
  { e: '💻', n: 'Priya Nair', s: 'Coding & Web Dev', i: 'Anna Nagar · ⭐ 4.8', b: '10 seats left', lat: 13.0878, lng: 80.2087 },
  { e: '💃', n: 'Divya Rajan', s: 'Dance & Choreography', i: 'T. Nagar · ⭐ 5.0', b: 'Top Rated', lat: 13.0418, lng: 80.2341 },
  { e: '📷', n: 'Sneha Kumar', s: 'Photography', i: 'Mylapore · ⭐ 4.9', b: 'Free Trial', lat: 13.0339, lng: 80.2676 },
  { e: '🍳', n: 'Chef Bala', s: 'Cooking Masterclass', i: 'Velachery · ⭐ 4.6', b: 'Open Today', lat: 12.9756, lng: 80.2209 },
];

export const examTopicLabels = {
  '🎸 Music': 'Music Theory',
  '💻 Coding': 'Programming Basics',
  '💃 Dance': 'Dance & Movement',
  '📷 Photography': 'Photography',
  '🍳 Cooking': 'Culinary Arts',
};

export const projectTasks = {
  '🎸 Music': 'Record a one-minute practice performance using this week\'s technique.',
  '💻 Coding': 'Build a small example that demonstrates this week\'s coding concept.',
  '💃 Dance': 'Record a short practice sequence focused on this week\'s movement skill.',
  '📷 Photography': 'Create a three-photo mini-series using this week\'s photography technique.',
  '🍳 Cooking': 'Prepare a simple dish that demonstrates this week\'s cooking technique.',
};

export const RES_TYPE_ICON = { video: '🎬', pdf: '📄', article: '📰' };

export function getProgressKey(key, week, codingTrack) {
  return key === '💻 Coding' && codingTrack ? `${key}|${codingTrack}|${Number(week)}` : `${key}|${Number(week)}`;
}

export function getPathProgress(_email, key, examHistory = [], completedLessons = {}, completedProjects = {}, codingTrack) {
  const keyPrefix = `${key}|${codingTrack && key === '💻 Coding' ? `${codingTrack}|` : ''}`;
  const completedLessonWeeks = Object.keys(completedLessons)
    .filter((lesson) => lesson.startsWith(keyPrefix))
    .map((lesson) => Number(lesson.split('|').pop()))
    .filter(Number.isInteger);
  const completedProjectWeeks = Object.keys(completedProjects)
    .filter((project) => project.startsWith(keyPrefix))
    .map((project) => Number(project.split('|').pop()))
    .filter(Number.isInteger);
  const highestCompletedWeek = Math.max(0, ...completedLessonWeeks, ...completedProjectWeeks);
  const passedExams = examHistory.filter((exam) => exam.topic === key && exam.score >= 60 && (key !== '💻 Coding' || exam.codingTrack === codingTrack)).length;
  const completedWeeks = Math.max(highestCompletedWeek, passedExams);
  const prog = Math.min(100, Math.round((completedWeeks / 12) * 100));
  const weeks = Math.min(completedWeeks + 1, 12);
  return { prog, weeks };
}

export function getPathDisplay(key, instrument, codingTrack) {
  let p = pathData[key] || { desc: 'Your personalized path', emoji: '📚' };
  let displayKey = key;
  if (key === '🎸 Music') {
    const safeInstrument = instrumentNames[instrument] ? instrument : '🎸';
    const iName = instrumentNames[safeInstrument];
    p = { desc: `Your personalized ${iName} learning journey`, emoji: safeInstrument };
    displayKey = `${safeInstrument} ${iName}`;
  }
  if (key === '💻 Coding' && codingTrack && CODING_CURRICULA[codingTrack]) {
    p = { desc: `Your personalized ${codingTrack} learning journey`, emoji: '💻' };
    displayKey = `💻 ${codingTrack}`;
  }
  return { ...p, displayKey };
}

export function getWeekList(key, instrument, codingTrack) {
  if (key === '🎸 Music' && instrument && INSTRUMENT_CURRICULA[instrument]) {
    return INSTRUMENT_CURRICULA[instrument];
  }
  if (key === '💻 Coding' && codingTrack && CODING_CURRICULA[codingTrack]) return CODING_CURRICULA[codingTrack];
  return topicMap[key] || Array.from({ length: 12 }, (_, i) => `Week ${i + 1} Content`);
}
