        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        //  STORAGE
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        const USERS_KEY = 'pathmind_users_v2';
        const SESSION_KEY = 'pathmind_session_v2';
        let currentUser = null;
        let selectedInterests = [];

        const getUsers = () => JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
        const saveUsers = u => localStorage.setItem(USERS_KEY, JSON.stringify(u));
        const getSession = () => JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
        const saveSession = s => localStorage.setItem(SESSION_KEY, JSON.stringify(s));
        const clearSession = () => localStorage.removeItem(SESSION_KEY);

        function refreshUser() {
            if (!currentUser) return;
            const u = getUsers()[currentUser.email];
            if (u) { currentUser = u; saveSession(u); }
        }

        window.addEventListener('DOMContentLoaded', () => {
            const s = getSession();
            if (s && getUsers()[s.email]) { currentUser = getUsers()[s.email]; showDashboard(); }
        });

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        //  PAGE NAV
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        function showPage(id) {
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(id).classList.add('active');
            window.scrollTo(0, 0);
        }
        function goHome() {
            if (currentUser) showDashboard(); else showPage('landing');
        }
        function goToDashboard() {
            refreshUser();
            showDashboard();
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        //  MODAL
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        function openModal(tab) {
            document.getElementById('authModal').classList.add('open');
            switchTab(tab);
        }
        function closeModal() {
            document.getElementById('authModal').classList.remove('open');
            clearErrors();
        }
        document.getElementById('authModal').addEventListener('click', function (e) { if (e.target === this) closeModal(); });

        function switchTab(tab) {
            clearErrors();
            document.getElementById('tabLogin').classList.toggle('active', tab === 'login');
            document.getElementById('tabSignup').classList.toggle('active', tab === 'signup');
            document.getElementById('loginForm').style.display = tab === 'login' ? 'block' : 'none';
            document.getElementById('signupForm').style.display = tab === 'signup' ? 'block' : 'none';
            document.getElementById('modalTitle').textContent = tab === 'login' ? 'Welcome back' : 'Join Personalized AI Learning Path';
            document.getElementById('modalSub').textContent = tab === 'login' ? 'Sign in to continue your journey' : 'Free account Â· Takes 60 seconds';
            if (tab === 'signup') {
                document.getElementById('alreadyRegWall').style.display = 'none';
                document.getElementById('signupStepsWrap').style.display = 'block';
                document.getElementById('instrumentGroup').style.display =
                    selectedInterests.includes('ðŸŽ¸ Music') ? 'block' : 'none';
            }
        }

        function resetAlreadyReg() {
            document.getElementById('alreadyRegWall').style.display = 'none';
            document.getElementById('signupStepsWrap').style.display = 'block';
            document.getElementById('signupEmail').value = '';
            clearErrors();
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        //  INTERESTS
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        function toggleInterest(el, val) {
            if (el.classList.contains('selected')) {
                el.classList.remove('selected');
                selectedInterests = selectedInterests.filter(x => x !== val);
            } else {
                if (selectedInterests.length >= 3) {
                    toast('âš ï¸ You can select up to 3 interests only.');
                    return;
                }
                el.classList.add('selected');
                selectedInterests.push(val);
            }
            document.getElementById('instrumentGroup').style.display =
                selectedInterests.includes('ðŸŽ¸ Music') ? 'block' : 'none';
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        //  ERRORS
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        function showError(m) { const e = document.getElementById('authError'); e.textContent = m; e.classList.add('show'); }
        function showSuccess(m) { const e = document.getElementById('authSuccess'); e.textContent = m; e.classList.add('show'); }
        function clearErrors() { ['authError', 'authSuccess'].forEach(id => document.getElementById(id).classList.remove('show')); }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        //  SIGNUP STEP 1
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        function signupStep1() {
            clearErrors();
            const name = document.getElementById('signupName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const age = parseInt(document.getElementById('signupAge').value);
            const pwd = document.getElementById('signupPassword').value;

            if (!name) return showError('Please enter your name.');
            if (!email || !email.includes('@')) return showError('Please enter a valid email address.');
            if (!age || age < 18 || age > 35) return showError('Age must be between 18 and 35.');
            if (pwd.length < 6) return showError('Password must be at least 6 characters.');

            // â˜… ALREADY REGISTERED CHECK â˜…
            if (getUsers()[email]) {
                clearErrors();
                document.getElementById('signupStepsWrap').style.display = 'none';
                document.getElementById('alreadyRegWall').style.display = 'block';
                return;
            }

            document.getElementById('signupStep1').style.display = 'none';
            document.getElementById('signupStep2').style.display = 'block';
            document.getElementById('dot1').classList.remove('active');
            document.getElementById('dot2').classList.add('active');
        }

        function backToStep1() {
            document.getElementById('signupStep2').style.display = 'none';
            document.getElementById('signupStep1').style.display = 'block';
            document.getElementById('dot2').classList.remove('active');
            document.getElementById('dot1').classList.add('active');
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        //  SIGNUP FINAL
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        function handleSignup() {
            clearErrors();
            if (selectedInterests.length === 0) return showError('Please select at least one interest.');

            const name = document.getElementById('signupName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const age = parseInt(document.getElementById('signupAge').value);
            const pwd = document.getElementById('signupPassword').value;
            const ft = document.getElementById('freeTime').value;
            const instrument = selectedInterests.includes('ðŸŽ¸ Music') ? document.getElementById('instrumentSelect').value : null;

            const users = getUsers();
            // Safety double-check
            if (users[email]) {
                document.getElementById('signupStepsWrap').style.display = 'none';
                document.getElementById('alreadyRegWall').style.display = 'block';
                return;
            }

            users[email] = {
                name, email, age, pwd, freeTime: ft, instrument,
                interests: [...selectedInterests],
                joinDate: new Date().toISOString(),
                streak: 1, hours: 0, badges: 0, examHistory: []
            };
            saveUsers(users);
            currentUser = users[email];
            saveSession(currentUser);
            closeModal();
            showDashboard();
            toast('ðŸŽ‰ Welcome to Personalized AI Learning Path! Your journey begins now.');
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        //  LOGIN
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        function handleLogin() {
            clearErrors();
            const email = document.getElementById('loginEmail').value.trim();
            const pwd = document.getElementById('loginPassword').value;
            if (!email || !pwd) return showError('Please fill in all fields.');
            const users = getUsers();
            if (!users[email]) return showError('No account found. Sign up first!');
            if (users[email].pwd !== pwd) return showError('Incorrect password. Try again.');
            currentUser = users[email];
            saveSession(currentUser);
            closeModal();
            showDashboard();
            toast(`ðŸ‘‹ Welcome back, ${currentUser.name.split(' ')[0]}!`);
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        //  LOGOUT
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        function logout() {
            clearSession(); currentUser = null;
            showPage('landing');
            document.getElementById('navUser').classList.remove('visible');
            document.getElementById('navLoginBtn').style.display = '';
            document.getElementById('navSignupBtn').style.display = '';
            toast('ðŸ‘‹ Logged out. See you soon!');
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        //  DASHBOARD
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        function showDashboard() {
            refreshUser();
            showPage('dashboard');
            const fn = currentUser.name.split(' ')[0];
            document.getElementById('navUser').classList.add('visible');
            document.getElementById('navAvatar').textContent = currentUser.name[0].toUpperCase();
            document.getElementById('navName').textContent = fn;
            document.getElementById('navLoginBtn').style.display = 'none';
            document.getElementById('navSignupBtn').style.display = 'none';
            document.getElementById('dashName').textContent = fn;
            document.getElementById('dashMeta').textContent =
                `Joined ${new Date(currentUser.joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Â· ${currentUser.interests.length} active path${currentUser.interests.length !== 1 ? 's' : ''}`;
            document.getElementById('qsDays').textContent = currentUser.streak || 1;
            document.getElementById('qsHours').textContent = (currentUser.hours || 0) + 'h';
            document.getElementById('qsBadges').textContent = currentUser.badges || 0;

            const hist = currentUser.examHistory || [];
            document.getElementById('qsScore').textContent = hist.length
                ? Math.round(hist.reduce((a, b) => a + b.score, 0) / hist.length) + '%' : 'â€”';

            const topicMap = { 'ðŸŽ¸ Music': 'Music Theory', 'ðŸ’» Coding': 'Programming Basics', 'ðŸŽ¨ Crafting': 'Creative Arts', 'ðŸ’ƒ Dance': 'Dance & Movement', 'ðŸ“· Photography': 'Photography', 'âœï¸ Writing': 'Creative Writing', 'ðŸ³ Cooking': 'Culinary Arts', 'ðŸŽ­ Acting': 'Drama & Acting' };
            const chipsWrap = document.getElementById('examTopicChips');
            chipsWrap.innerHTML = '';
            const ints = currentUser.interests.length ? currentUser.interests : ['ðŸŽ¸ Music'];
            ints.forEach(key => {
                const span = document.createElement('span');
                span.className = 'exam-chip';
                span.style.cursor = 'pointer';
                span.style.transition = 'all .2s';
                let label = topicMap[key] || 'General';
                if (key === 'ðŸŽ¸ Music' && currentUser.instrument) {
                    label = `${instrumentNames[currentUser.instrument] || 'Music'} Basics`;
                }
                span.textContent = `${key} Â· ${label} â†’`;
                span.onclick = () => startExam(key);
                chipsWrap.appendChild(span);
            });

            buildPaths(); buildCoaches(); buildExamHistory();
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        //  PATH CARDS
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        const pathData = {
            'ðŸŽ¸ Music': { desc: 'Guitar, theory, songwriting & more', emoji: 'ðŸŽ¸' },
            'ðŸ’» Coding': { desc: 'Web dev, Python, algorithms & projects', emoji: 'ðŸ’»' },
            'ðŸŽ¨ Crafting': { desc: 'DIY art, origami, pottery & macramÃ©', emoji: 'ðŸŽ¨' },
            'ðŸ’ƒ Dance': { desc: 'Contemporary, hip-hop, salsa & more', emoji: 'ðŸ’ƒ' },
            'ðŸ“· Photography': { desc: 'Composition, editing, portraits & street', emoji: 'ðŸ“·' },
            'âœï¸ Writing': { desc: 'Creative writing, essays, storytelling', emoji: 'âœï¸' },
            'ðŸ³ Cooking': { desc: 'Cuisines, techniques & nutrition', emoji: 'ðŸ³' },
            'ðŸŽ­ Acting': { desc: 'Improvisation, script, stage presence', emoji: 'ðŸŽ­' },
        };
        function buildPaths() {
            const grid = document.getElementById('pathGrid');
            grid.innerHTML = '';
            const interests = currentUser.interests.length > 0 ? currentUser.interests : ['ðŸŽ¸ Music'];
            interests.forEach(key => {
                let p = pathData[key] || { desc: 'Your personalized path', emoji: 'ðŸ“š' };
                let displayKey = key;
                if (key === 'ðŸŽ¸ Music' && currentUser.instrument) {
                    const iName = instrumentNames[currentUser.instrument] || 'Music';
                    p = { desc: `Your personalized ${iName} learning journey`, emoji: currentUser.instrument };
                    displayKey = `${currentUser.instrument} ${iName}`;
                }
                const seed = (currentUser.email + key).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
                const prog = (seed % 55) + 10; const weeks = Math.floor(prog / 10) + 1;
                const div = document.createElement('div');
                div.className = 'path-card';
                div.dataset.pathkey = key;
                div.style.cursor = 'pointer';
                div.innerHTML = `
      <div class="path-emoji">${p.emoji}</div>
      <div class="path-title">${displayKey}</div>
      <div class="path-desc">${p.desc}</div>
      <div class="progress-bar"><div class="progress-fill" style="width:${prog}%"></div></div>
      <div class="path-meta"><span>${prog}% complete</span><span>Week ${weeks} of 12</span></div>
      <div style="margin-top:.75rem;display:inline-flex;align-items:center;gap:.35rem;font-size:.8rem;color:var(--accent);font-weight:600;">Open Path &rarr;</div>
    `;
                div.addEventListener('click', () => openPathDetail(key, prog, weeks));
                grid.appendChild(div);
            });
        }

        const INSTRUMENT_CURRICULA = {
            'ðŸŽ¸': ['Intro & Tuning', 'Open Chords', 'Strumming Patterns', 'Reading Tabs', 'Fingerpicking', 'Barre Chords', 'Scales & Modes', 'Power Chords', 'Song Structure', 'Improvisation', 'Recording Tips', 'Final Performance'],
            'ðŸŽ¹': ['Posture & Keys', 'C Major Scale', 'Simple Melodies', 'Left Hand Basics', 'Both Hands', 'Chords', 'Sight Reading', 'Dynamics', 'Classical Piece', 'Jazz Intro', 'Composition', 'Recital'],
            'ðŸŽ»': ['Posture & Bow Hold', 'Open Strings', 'First Position Notes', 'Bowing Techniques', 'Simple Scales', 'Vibrato Intro', 'Shifting Positions', 'Double Stops', 'Reading Music', 'Etudes', 'Solo Piece', 'Recital'],
            'ðŸª•': ['Tuning & Posture', 'First Chords (C, Am, F)', 'Strumming Patterns', 'Chord Transitions', 'Fingerpicking Basics', 'Campanella Style', 'Reading Chord Charts', 'Common Songs', 'Rhythm Variations', 'Improvisation', 'Performance Prep', 'Recital'],
            'ðŸ¥': ['Posture & Grip', 'Basic Rhythms', 'Rudiments Intro', 'Hi-Hat & Kick Coordination', 'Snare Techniques', 'Fills & Accents', 'Reading Drum Notation', 'Groove Practice', 'Genre Styles', 'Dynamics & Ghost Notes', 'Solo Practice', 'Performance'],
        };

        // â”€â”€ PATH DETAIL PAGE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
        function openPathDetail(key, prog, currentWeek) {
            let p = pathData[key] || { desc: 'Your personalized path', emoji: 'ðŸ“š' };
            let displayKey = key;
            if (key === 'ðŸŽ¸ Music' && currentUser.instrument) {
                const iName = instrumentNames[currentUser.instrument] || 'Music';
                p = { desc: `Your personalized ${iName} learning journey`, emoji: currentUser.instrument };
                displayKey = `${currentUser.instrument} ${iName}`;
            }
            const emoji = p.emoji;
            const desc = p.desc;

            const topicMap = {
                'ðŸŽ¸ Music': (currentUser.instrument && INSTRUMENT_CURRICULA[currentUser.instrument]) || INSTRUMENT_CURRICULA['ðŸŽ¸'],
                'ðŸ’» Coding': ['HTML Basics', 'CSS Styling', 'JavaScript Intro', 'DOM Manipulation', 'Functions & Loops', 'Arrays & Objects', 'Async & Fetch', 'React Intro', 'Node.js Basics', 'REST APIs', 'Databases', 'Full Project'],
                'ðŸŽ¨ Crafting': ['Color Theory', 'Sketching Basics', 'Watercolor Intro', 'Acrylic Painting', 'Origami', 'MacramÃ© Knots', 'Pottery Basics', 'Printmaking', 'Mixed Media', 'Upcycling', 'Portfolio', 'Exhibition Prep'],
                'ðŸ’ƒ Dance': ['Warm-Up & Stretch', 'Rhythm & Beat', 'Basic Steps', 'Footwork', 'Body Isolation', 'Arm Styling', 'Turns & Spins', 'Partner Work', 'Freestyle', 'Performance Tips', 'Choreography', 'Showcase'],
                'ðŸ“· Photography': ['Camera Settings', 'Composition', 'Lighting Basics', 'Portrait Mode', 'Street Photography', 'Editing in Lightroom', 'Color Grading', 'Night Photography', 'Action Shots', 'Macro', 'Photo Essay', 'Portfolio Review'],
                'âœï¸ Writing': ['Freewriting', 'Characters', 'Plot Structure', 'Dialogue', 'Setting & Tone', 'Point of View', 'Scene Building', 'Editing Basics', 'Short Story', 'Flash Fiction', 'Essay Writing', 'Final Draft'],
                'ðŸ³ Cooking': ['Kitchen Safety', 'Knife Skills', 'Stocks & Sauces', 'Vegetables', 'Proteins', 'Baking Basics', 'World Cuisines', 'Plating', 'Nutrition', 'Meal Prep', 'Fusion Cooking', 'Final Dish'],
                'ðŸŽ­ Acting': ['Warm-Ups', 'Voice Projection', 'Improvisation', 'Script Reading', 'Character Study', 'Stage Presence', 'Emotions', 'Monologue', 'Scene Work', 'Cold Reading', 'Camera Acting', 'Showcase'],
            };
            const weekList = topicMap[key] || Array.from({ length: 12 }, (_, i) => `Week ${i + 1} Content`);

            const weekRows = weekList.map((topic, i) => {
                const wNum = i + 1;
                const done = wNum < currentWeek;
                const current = wNum === currentWeek;
                const icon = done ? 'âœ…' : current ? 'â–¶ï¸' : 'ðŸ”’';
                const status = done ? 'Completed' : current ? 'In Progress' : 'Locked';
                const sCol = done ? 'var(--accent3)' : current ? 'var(--accent2)' : 'var(--muted)';
                const border = current ? 'var(--accent)' : 'var(--border)';
                const startBtn = current
                    ? `<button class="btn btn-primary" style="font-size:.78rem;padding:.35rem .9rem;border-radius:8px;" onclick="openLesson('${key}', ${wNum}, '${topic.replace(/'/g, "\\'")}')">Start â†’</button>`
                    : '';
                return `<div style="display:flex;align-items:center;gap:1rem;padding:.9rem 1.1rem;background:var(--surface2);border-radius:14px;border:1px solid ${border};margin-bottom:.6rem;">
      <span style="font-size:1.25rem;">${icon}</span>
      <div style="flex:1;">
        <div style="font-weight:700;font-size:.95rem;">Week ${wNum}: ${topic}</div>
        <div style="font-size:.78rem;color:${sCol};margin-top:.15rem;">${status}</div>
      </div>
      ${startBtn}
    </div>`;
            }).join('');

            const content = document.getElementById('pathDetailContent');
            content.innerHTML = `
    <div style="display:flex;align-items:center;gap:1rem;margin-bottom:1.75rem;">
      <div style="font-size:3rem;">${emoji}</div>
      <div>
        <h2 style="font-size:1.7rem;font-weight:800;margin-bottom:.25rem;">${displayKey}</h2>
        <p style="color:var(--muted);font-size:.9rem;">${desc}</p>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.75rem;">
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:14px;padding:1rem;text-align:center;">
        <div style="font-size:1.8rem;font-weight:800;color:var(--accent);">${prog}%</div>
        <div style="font-size:.78rem;color:var(--muted);margin-top:.2rem;">Progress</div>
      </div>
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:14px;padding:1rem;text-align:center;">
        <div style="font-size:1.8rem;font-weight:800;color:var(--accent2);">Wk ${currentWeek}</div>
        <div style="font-size:.78rem;color:var(--muted);margin-top:.2rem;">Current Week</div>
      </div>
      <div style="background:var(--surface2);border:1px solid var(--border);border-radius:14px;padding:1rem;text-align:center;">
        <div style="font-size:1.8rem;font-weight:800;color:var(--accent3);">12</div>
        <div style="font-size:.78rem;color:var(--muted);margin-top:.2rem;">Total Weeks</div>
      </div>
    </div>
    <div style="background:var(--surface2);border-radius:12px;height:8px;overflow:hidden;margin-bottom:1.75rem;">
      <div style="height:100%;width:${prog}%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:12px;"></div>
    </div>
    <h3 style="font-weight:700;margin-bottom:1rem;">ðŸ“… 12-Week Curriculum</h3>
    ${weekRows}
    <div style="display:flex;gap:1rem;margin-top:1.75rem;flex-wrap:wrap;">
      <button class="btn btn-primary" onclick="startExam('${key}')" style="flex:1;justify-content:center;">ðŸ“ Take Weekly Exam â†’</button>
      <button class="btn btn-outline" onclick="closePath()" style="flex:1;justify-content:center;">â† Back to Dashboard</button>
    </div>
  `;
            const overlay = document.getElementById('pathDetailOverlay');
            overlay.style.display = 'flex';
        }

        function closePath() {
            document.getElementById('pathDetailOverlay').style.display = 'none';
        }

        // Close overlay when clicking the dark backdrop
        document.getElementById('pathDetailOverlay').addEventListener('click', function (e) {
            if (e.target === this) closePath();
        });

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        //  COACHES
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        const coaches = [
            { e: 'ðŸŽ¸', n: 'Arjun Sharma', s: 'Music & Guitar', i: 'IIT Road, 2.1 km Â· â­ 4.9', b: 'Open Today' },
            { e: 'ðŸ’»', n: 'Priya Nair', s: 'Coding & Web Dev', i: 'Anna Nagar, 3.4 km Â· â­ 4.8', b: '10 seats left' },
            { e: 'ðŸ’ƒ', n: 'Divya Rajan', s: 'Dance & Choreography', i: 'T. Nagar, 1.8 km Â· â­ 5.0', b: 'Top Rated' },
            { e: 'ðŸŽ¨', n: 'Ravi Menon', s: 'Crafting & Art', i: 'Adyar, 4.2 km Â· â­ 4.7', b: 'Weekend Batches' },
            { e: 'ðŸ“·', n: 'Sneha Kumar', s: 'Photography', i: 'Mylapore, 2.9 km Â· â­ 4.9', b: 'Free Trial' },
            { e: 'ðŸ³', n: 'Chef Bala', s: 'Cooking Masterclass', i: 'Velachery, 5 km Â· â­ 4.6', b: 'Open Today' },
        ];
        function buildCoaches() {
            const g = document.getElementById('coachGrid'); g.innerHTML = '';
            coaches.slice(0, 4).forEach(c => {
                g.innerHTML += `<div class="coach-card" onclick="toast('ðŸ“ Contacting ${c.n}â€¦')">
      <div class="coach-avatar">${c.e}</div>
      <div><div class="coach-name">${c.n}</div><div class="coach-skill">${c.s}</div>
      <div class="coach-info">${c.i}</div><div class="coach-badge">${c.b}</div></div></div>`;
            });
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        //  EXAM HISTORY
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        function buildExamHistory() {
            const hist = currentUser.examHistory || [];
            const sec = document.getElementById('examHistorySection');
            const g = document.getElementById('examHistGrid');
            if (!hist.length) { sec.style.display = 'none'; return; }
            sec.style.display = 'block'; g.innerHTML = '';
            [...hist].reverse().slice(0, 6).forEach(h => {
                const pass = h.score >= 60;
                const bar = pass ? 'linear-gradient(90deg,#1aff8c,#00c97a)' : 'linear-gradient(90deg,var(--accent2),#ff8c5c)';
                g.innerHTML += `<div class="exam-hist-card">
      <div class="eh-topic">${h.topic}</div>
      <div class="eh-score ${pass ? 'pass' : 'fail'}">${h.score}%</div>
      <div style="font-size:.78rem;color:var(--muted);">${h.correct}/15 correct Â· ${h.timeTaken}</div>
      <div class="eh-date">${new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
      <div class="progress-bar" style="margin-top:.6rem;"><div class="progress-fill" style="width:${h.score}%;background:${bar}"></div></div>
    </div>`;
            });
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        //  QUESTION BANKS  (15 per topic)
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        const QB = {
            'ðŸŽ¸ Music': [
                { q: "What does 'forte' mean in music?", o: ["Soft", "Loud", "Fast", "Slow"], a: 1 },
                { q: "What is the 4/4 time signature also called?", o: ["Waltz time", "Cut time", "Common time", "March time"], a: 2 },
                { q: "Which clef is most commonly used for treble melodies?", o: ["Bass clef", "Alto clef", "Treble clef", "Tenor clef"], a: 2 },
                { q: "What note comes after G in the musical alphabet?", o: ["H", "A", "B", "C"], a: 1 },
                { q: "How many semitones are in an octave?", o: ["8", "10", "12", "14"], a: 2 },
                { q: "What is a 'chord'?", o: ["Single note", "Two notes", "Three or more notes together", "A type of rhythm"], a: 2 },
                { q: "What does 'BPM' stand for?", o: ["Bass Per Measure", "Beats Per Minute", "Beat Pattern Method", "Bass Pitch Mode"], a: 1 },
                { q: "Which instrument is NOT a string instrument?", o: ["Violin", "Cello", "Clarinet", "Harp"], a: 2 },
                { q: "What does 'pianissimo' (pp) mean?", o: ["Very loud", "Moderately soft", "Very soft", "Medium"], a: 2 },
                { q: "How many lines does a musical staff have?", o: ["3", "4", "5", "6"], a: 2 },
                { q: "What is a 'rest' in music notation?", o: ["A pause in sound", "A fast tempo", "A type of chord", "A long note"], a: 0 },
                { q: "Which genre originated in the Mississippi Delta?", o: ["Jazz", "Blues", "Classical", "Rock"], a: 1 },
                { q: "What does 'tempo' refer to?", o: ["Volume", "Pitch", "Speed of music", "Key signature"], a: 2 },
                { q: "What is an 'arpeggio'?", o: ["A chord played all at once", "Notes of a chord played in sequence", "A type of rhythm", "A musical rest"], a: 1 },
                { q: "What is a 'scale'?", o: ["A weighing tool", "A sequence of notes in ascending or descending order", "A type of rest", "A chord progression only"], a: 1 },
            ],
            'ðŸ’» Coding': [
                { q: "What does HTML stand for?", o: ["HyperText Markup Language", "High Tech Machine Learning", "HyperText Machine Language", "Hyperlink Text Mode Language"], a: 0 },
                { q: "Which symbol starts a comment in Python?", o: ["//", "/*", "#", "--"], a: 2 },
                { q: "What does CSS stand for?", o: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Colorful Site Styles"], a: 1 },
                { q: "What is the output of print(2**3) in Python?", o: ["6", "8", "9", "5"], a: 1 },
                { q: "Which data structure follows LIFO?", o: ["Queue", "Stack", "Array", "Linked List"], a: 1 },
                { q: "What does API stand for?", o: ["Application Programming Interface", "App Process Integration", "Automated Program Interface", "Applied Programming Index"], a: 0 },
                { q: "Which HTML tag creates the largest heading?", o: ["<h6>", "<head>", "<h1>", "<title>"], a: 2 },
                { q: "What is a 'loop' in programming?", o: ["A function call", "Repeating a block of code", "A variable type", "An error"], a: 1 },
                { q: "What does 'null' represent?", o: ["Zero", "Empty string", "Absence of value", "Boolean false"], a: 2 },
                { q: "Which language runs natively in web browsers?", o: ["Python", "Java", "JavaScript", "C++"], a: 2 },
                { q: "What is 'debugging'?", o: ["Writing new code", "Finding and fixing errors", "Deploying an app", "Designing UI"], a: 1 },
                { q: "Which is NOT a programming language?", o: ["Ruby", "Rust", "RAM", "Go"], a: 2 },
                { q: "What does a 'boolean' store?", o: ["Numbers", "Text", "True/False", "Lists"], a: 2 },
                { q: "What is an 'array'?", o: ["Single value", "Collection of ordered values", "A loop", "A class"], a: 1 },
                { q: "Which HTTP method retrieves data?", o: ["POST", "PUT", "DELETE", "GET"], a: 3 },
            ],
            'ðŸ’ƒ Dance': [
                { q: "Where did Flamenco originate?", o: ["Brazil", "Argentina", "Spain", "Italy"], a: 2 },
                { q: "What is a 'pirouette'?", o: ["A jump", "A spin on one foot", "A floor slide", "A hand gesture"], a: 1 },
                { q: "Which dance style is associated with Brazil?", o: ["Tango", "Salsa", "Samba", "Waltz"], a: 2 },
                { q: "What does 'choreography' mean?", o: ["Dance music", "Designing a sequence of dance moves", "A type of stage", "Dance costume"], a: 1 },
                { q: "Which dance is known as the 'dance of love'?", o: ["Hip-hop", "Tango", "Ballet", "Breakdance"], a: 1 },
                { q: "What is the 'barre' in ballet?", o: ["A dance move", "A horizontal rail for balance exercises", "A type of music", "Footwear"], a: 1 },
                { q: "What does 'freestyle' mean in dance?", o: ["Dancing alone", "Improvised dance without set choreography", "A dance style", "A competition type"], a: 1 },
                { q: "Which dance originated in Harlem, NYC?", o: ["Lindy Hop", "Waltz", "Ballet", "Salsa"], a: 0 },
                { q: "What is 'rhythm' in dance?", o: ["Dance costumes", "The pattern of movements matching the beat", "A jump move", "Stage direction"], a: 1 },
                { q: "Which body part is the core of most ballet movements?", o: ["Feet", "Hips", "Core/torso", "Hands"], a: 2 },
                { q: "What is 'pointe work' in ballet?", o: ["Dancing on tiptoes in special shoes", "A hand gesture", "A jump sequence", "A partner lift"], a: 0 },
                { q: "Hip-hop dance originated in which decade?", o: ["1950s", "1960s", "1970s", "1980s"], a: 2 },
                { q: "What is a 'duet' in dance?", o: ["Solo performance", "Two dancers performing together", "Group of four", "Dance competition"], a: 1 },
                { q: "Which dance style uses a 'box step'?", o: ["Hip-hop", "Waltz", "Breakdance", "Flamenco"], a: 1 },
                { q: "What is 'body isolation' in dance?", o: ["Dancing alone", "Moving one body part independently of others", "A stretch", "A jump"], a: 1 },
            ],
            'ðŸŽ¨ Crafting': [
                { q: "What are the three primary colors?", o: ["Red, Green, Blue", "Red, Yellow, Blue", "Orange, Purple, Green", "Black, White, Gray"], a: 1 },
                { q: "What material is used in origami?", o: ["Cloth", "Metal", "Paper", "Wood"], a: 2 },
                { q: "What does 'macramÃ©' involve?", o: ["Painting", "Knotting cord or rope", "Pottery", "Weaving fabric"], a: 1 },
                { q: "What is 'decoupage'?", o: ["A painting style", "Decorating surfaces with cut paper", "A pottery technique", "A knitting pattern"], a: 1 },
                { q: "What is 'firing' in pottery?", o: ["Starting a kiln", "Baking clay to harden it", "A painting technique", "A glaze type"], a: 1 },
                { q: "What is a 'mood board'?", o: ["A dance floor", "A visual collection for inspiration", "A cutting board", "A painting canvas"], a: 1 },
                { q: "Which stitch is the most basic in embroidery?", o: ["French knot", "Chain stitch", "Running stitch", "Satin stitch"], a: 2 },
                { q: "What does 'upcycling' mean?", o: ["Throwing away materials", "Creating new items from waste materials", "Buying new supplies", "Recycling paper"], a: 1 },
                { q: "What is 'gouache'?", o: ["A type of clay", "Opaque watercolor paint", "A weaving tool", "A knitting pattern"], a: 1 },
                { q: "Which technique uses wax to resist dye?", o: ["Tie-dye", "Batik", "Screen printing", "Block printing"], a: 1 },
                { q: "What is 'negative space' in art?", o: ["Dark colors", "The space around the main subject", "An empty canvas", "Shadow effects"], a: 1 },
                { q: "Linocut is a form of which art?", o: ["Sculpture", "Printmaking", "Weaving", "Photography"], a: 1 },
                { q: "What does 'acrylic' refer to in crafting?", o: ["A type of yarn", "Fast-drying water-based paint", "A clay type", "A weaving material"], a: 1 },
                { q: "What is a 'sketch'?", o: ["A final painting", "A rough drawing or draft", "A photography term", "A sculpture tool"], a: 1 },
                { q: "What is 'mixed media' art?", o: ["Using only one material", "Combining different materials and techniques", "Digital art only", "Oil painting"], a: 1 },
            ],
            'ðŸ“· Photography': [
                { q: "What does 'ISO' control in a camera?", o: ["Focus distance", "Sensor sensitivity to light", "Shutter speed", "Lens zoom"], a: 1 },
                { q: "What is 'aperture'?", o: ["The camera's screen", "The opening that controls light entering the lens", "A type of lens", "The shutter button"], a: 1 },
                { q: "What does a wider aperture (lower f-number) create?", o: ["Less light, more depth of field", "More light, shallower depth of field", "No light change", "Slower shutter"], a: 1 },
                { q: "What is the 'rule of thirds'?", o: ["A lighting technique", "A composition guideline dividing the frame into a 3x3 grid", "A camera setting", "An editing filter"], a: 1 },
                { q: "What does 'shutter speed' control?", o: ["Color balance", "How long the sensor is exposed to light", "Lens focal length", "Image resolution"], a: 1 },
                { q: "What is 'white balance' used for?", o: ["Sharpening images", "Correcting color casts from lighting", "Zooming in", "Reducing noise"], a: 1 },
                { q: "Which type of light is best for portraits, generally?", o: ["Harsh midday sun", "Soft diffused light", "Direct flash only", "No light"], a: 1 },
                { q: "What is 'bokeh'?", o: ["A camera brand", "The aesthetic quality of out-of-focus blur", "A type of lens cap", "A printing method"], a: 1 },
                { q: "What does 'RAW' format mean in photography?", o: ["A compressed image file", "An unprocessed image file with all sensor data", "A black & white filter", "A video format"], a: 1 },
                { q: "What is 'depth of field'?", o: ["The camera's weight", "The range of distance that appears in focus", "The image file size", "The lens diameter"], a: 1 },
                { q: "Which software is commonly used for photo editing?", o: ["Excel", "Lightroom", "PowerPoint", "Notepad"], a: 1 },
                { q: "What is a 'leading line' in composition?", o: ["A line of text", "A visual line that guides the viewer's eye", "A camera strap", "A border around the photo"], a: 1 },
                { q: "What does 'macro photography' focus on?", o: ["Wide landscapes", "Extreme close-up shots of small subjects", "Night skies", "Group portraits"], a: 1 },
                { q: "What is 'exposure' in photography?", o: ["The lens brand", "The amount of light that reaches the sensor", "The photo's file name", "The camera's weight"], a: 1 },
                { q: "What does 'street photography' typically capture?", o: ["Studio portraits", "Candid moments of everyday life in public", "Product shots", "Astrophotography"], a: 1 },
            ],
            'âœï¸ Writing': [
                { q: "What is 'freewriting'?", o: ["Editing a final draft", "Writing continuously without worrying about structure", "Writing only poetry", "Copying another text"], a: 1 },
                { q: "What is 'plot' in a story?", o: ["The setting", "The sequence of events that make up a narrative", "The author's biography", "The book cover"], a: 1 },
                { q: "What is 'dialogue'?", o: ["A character's inner thoughts", "Conversation between characters", "The story's title", "A type of font"], a: 1 },
                { q: "What does 'point of view' refer to?", o: ["The book's price", "The perspective from which a story is told", "The page count", "The genre"], a: 1 },
                { q: "What is 'foreshadowing'?", o: ["A flashback", "A hint about events that will happen later", "The story's ending", "A character's name"], a: 1 },
                { q: "What is a 'protagonist'?", o: ["The villain", "The main character of a story", "The setting", "The narrator only"], a: 1 },
                { q: "What is 'flash fiction'?", o: ["A very long novel", "An extremely short story, often under 1000 words", "A type of poem", "A movie script"], a: 1 },
                { q: "What does 'show, don't tell' mean in writing?", o: ["Use only dialogue", "Convey emotions/info through action and detail rather than direct statement", "Write in first person only", "Avoid descriptions"], a: 1 },
                { q: "What is the 'climax' of a story?", o: ["The opening scene", "The point of highest tension or turning point", "The author's note", "The table of contents"], a: 1 },
                { q: "What is an 'antagonist'?", o: ["The hero", "A character who opposes the protagonist", "The narrator", "The setting"], a: 1 },
                { q: "What is 'tone' in writing?", o: ["The font size", "The author's attitude conveyed through word choice", "The page margin", "The chapter number"], a: 1 },
                { q: "What is a 'first draft'?", o: ["The final published version", "An initial, unpolished version of a written work", "A book review", "An outline only"], a: 1 },
                { q: "What is 'setting' in a story?", o: ["The main character", "The time and place where the story occurs", "The book's price", "The plot twist"], a: 1 },
                { q: "What is an 'essay'?", o: ["A poem", "A short piece of writing on a particular subject", "A novel", "A screenplay"], a: 1 },
                { q: "What does 'editing' primarily focus on?", o: ["Writing the first draft", "Improving clarity, grammar, and structure", "Choosing a title", "Designing the cover"], a: 1 },
            ],
            'ðŸ³ Cooking': [
                { q: "What is the first rule of kitchen safety?", o: ["Cook fast", "Wash hands and surfaces before cooking", "Use lots of oil", "Cook everything on high heat"], a: 1 },
                { q: "What does 'mise en place' mean?", o: ["A French dessert", "Having all ingredients prepped and ready before cooking", "A type of knife", "A cooking temperature"], a: 1 },
                { q: "What is 'sautÃ©ing'?", o: ["Boiling food slowly", "Cooking food quickly in a small amount of fat over high heat", "Freezing food", "Steaming vegetables"], a: 1 },
                { q: "What is a 'stock' in cooking?", o: ["A type of pan", "A flavorful liquid made by simmering bones/vegetables", "A spice blend", "A dessert sauce"], a: 1 },
                { q: "What does 'al dente' mean for pasta?", o: ["Overcooked and soft", "Cooked firm to the bite", "Raw", "Burnt"], a: 1 },
                { q: "What is 'searing' meat?", o: ["Slow boiling", "Browning the surface quickly over high heat", "Marinating overnight", "Freezing"], a: 1 },
                { q: "What is the safe internal temperature for cooked chicken?", o: ["50Â°C", "60Â°C", "74Â°C", "100Â°C"], a: 2 },
                { q: "What does 'blanching' involve?", o: ["Deep frying", "Briefly boiling then plunging into cold water", "Slow roasting", "Smoking"], a: 1 },
                { q: "What is 'plating'?", o: ["Washing dishes", "The art of arranging food on a plate for presentation", "Measuring ingredients", "Storing leftovers"], a: 1 },
                { q: "What is a 'roux'?", o: ["A type of fish", "A mixture of flour and fat used to thicken sauces", "A dessert", "A cooking method for vegetables"], a: 1 },
                { q: "Which knife skill involves cutting food into small cubes?", o: ["Julienne", "Dicing", "Zesting", "Filleting"], a: 1 },
                { q: "What is 'umami'?", o: ["A sour taste", "A savory, rich fifth taste", "A sweet flavor", "A bitter aftertaste"], a: 1 },
                { q: "What does 'marinating' do to food?", o: ["Cooks it instantly", "Infuses flavor and can tenderize before cooking", "Freezes it", "Removes all flavor"], a: 1 },
                { q: "What is 'meal prep'?", o: ["Eating out every day", "Preparing meals or ingredients in advance", "Ordering delivery", "Skipping meals"], a: 1 },
                { q: "What is 'fusion cooking'?", o: ["Cooking only one cuisine", "Combining elements from different culinary traditions", "Using only raw ingredients", "A type of baking"], a: 1 },
            ],
            'ðŸŽ­ Acting': [
                { q: "What is the purpose of a vocal warm-up?", o: ["To memorize lines", "To prepare and protect the voice before performing", "To choose costumes", "To build the set"], a: 1 },
                { q: "What is 'improvisation' in acting?", o: ["Reading from a script word-for-word", "Performing without a prepared script, spontaneously", "Memorizing lines in advance", "Designing lighting"], a: 1 },
                { q: "What is a 'monologue'?", o: ["A conversation between two characters", "A long speech delivered by one character", "Stage directions", "A type of costume"], a: 1 },
                { q: "What does 'stage presence' refer to?", o: ["The size of the stage", "An actor's ability to command attention on stage", "The number of actors", "The lighting setup"], a: 1 },
                { q: "What is 'cold reading'?", o: ["Reading a script for the first time, often during auditions", "Memorizing a script overnight", "Reading without emotion", "Reading backstage only"], a: 0 },
                { q: "What is 'character study'?", o: ["Studying the script's history", "Deeply analyzing a character's motivations and traits", "Memorizing blocking", "Choosing costumes"], a: 1 },
                { q: "What does 'projection' mean for an actor's voice?", o: ["Speaking very softly", "Making the voice carry clearly to the audience", "Using a microphone only", "Whispering"], a: 1 },
                { q: "What is 'blocking' in theatre?", o: ["A type of stage curtain", "The planned movement and positioning of actors on stage", "A lighting cue", "A costume change"], a: 1 },
                { q: "What is 'method acting'?", o: ["Reading lines quickly", "An approach where actors deeply identify with their character's emotions", "Acting without rehearsal", "Acting only in comedies"], a: 1 },
                { q: "What is a 'scene partner'?", o: ["The director", "Another actor performing in the same scene with you", "The audience", "The stage manager"], a: 1 },
                { q: "What does 'camera acting' require differently from stage acting?", o: ["Louder voice projection", "More subtle, naturalistic expressions for close-ups", "Bigger gestures always", "No emotions"], a: 1 },
                { q: "What is 'breaking character'?", o: ["Staying fully in role", "Unintentionally stepping out of the role during a performance", "Changing costumes", "Ending a play"], a: 1 },
                { q: "What is 'subtext' in acting?", o: ["The literal words spoken", "The underlying meaning or emotion behind the dialogue", "Stage directions", "The title of the play"], a: 1 },
                { q: "What is a 'table read'?", o: ["A meal break", "A read-through of the script by the cast, often seated", "A type of prop", "A costume fitting"], a: 1 },
                { q: "What is 'improv comedy' commonly based on?", o: ["Scripted jokes only", "Spontaneous scenes often built on audience suggestions", "Pre-recorded audio", "Silent acting only"], a: 1 },
            ],
        };

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        //  INSTRUMENT-SPECIFIC MUSIC QUESTION BANKS
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        const MUSIC_QB = {
            'ðŸŽ¸': [
                { q: "How many strings does a standard guitar have?", o: ["4", "5", "6", "7"], a: 2 },
                { q: "What is a 'fret' on a guitar?", o: ["The body of the guitar", "Raised metal strips on the neck used to change pitch", "The strings", "The tuning pegs"], a: 1 },
                { q: "What is 'strumming'?", o: ["Plucking one string at a time", "Sweeping across multiple strings with a pick or fingers", "Tuning the guitar", "Cleaning the strings"], a: 1 },
                { q: "What does 'fingerpicking' involve?", o: ["Using a pick only", "Plucking individual strings with fingers", "Strumming loudly", "Tuning by ear"], a: 1 },
                { q: "What is a 'barre chord'?", o: ["A chord using one finger across all strings on a fret", "An open chord", "A chord with no fingers", "A drum pattern"], a: 0 },
                { q: "Which string is typically the thickest on a guitar?", o: ["High E", "Low E", "B string", "G string"], a: 1 },
                { q: "What is 'tablature' (tabs)?", o: ["Standard musical notation", "A simplified notation showing frets and strings", "A type of chord", "A tuning method"], a: 1 },
                { q: "What does 'capo' do?", o: ["Tunes the guitar electronically", "Clamps the strings to raise the pitch", "Cleans the fretboard", "Amplifies the sound"], a: 1 },
                { q: "What is an 'open chord'?", o: ["A chord played without any fretted notes on some strings", "A chord with all strings muted", "A barre chord", "An electric-only chord"], a: 0 },
                { q: "What is 'palm muting'?", o: ["Removing strings", "Resting the palm on strings near the bridge to dampen sound", "Playing very loudly", "Tuning down"], a: 1 },
                { q: "Standard guitar tuning from low to high is?", o: ["E A D G B E", "A D G C E A", "E B G D A E", "G C E A D G"], a: 0 },
                { q: "What is a 'power chord'?", o: ["A full 5-note chord", "A simplified two or three-note chord, common in rock", "A chord played with effects only", "A drum fill"], a: 1 },
                { q: "What does 'bending' a string do?", o: ["Breaks the string", "Raises the pitch by pushing the string sideways", "Mutes the note", "Lowers the volume"], a: 1 },
                { q: "What is 'tuning by ear'?", o: ["Using an electronic tuner", "Adjusting pitch by listening and comparing to a reference note", "Reading tabs", "Watching a video"], a: 1 },
                { q: "What is the 'bridge' on a guitar?", o: ["The neck", "The part that anchors the strings to the body", "The tuning pegs", "The pick"], a: 1 },
            ],
            'ðŸŽ¹': [
                { q: "What is correct piano posture?", o: ["Slouched with wrists low", "Straight back, relaxed shoulders, wrists level with keys", "Standing up", "Leaning on the keys"], a: 1 },
                { q: "How many notes are in a C Major scale?", o: ["5", "6", "7", "8"], a: 2 },
                { q: "Which keys are the black keys on a piano?", o: ["Naturals", "Sharps and flats", "Octaves", "Rests"], a: 1 },
                { q: "What does the left hand typically play in basic piano pieces?", o: ["Melody only", "Bass notes and chords", "Nothing", "High treble notes only"], a: 1 },
                { q: "What is a 'chord'?", o: ["A single note", "Three or more notes played together", "A scale", "A rest"], a: 1 },
                { q: "What is 'sight reading'?", o: ["Memorizing music by ear", "Playing music from notation on first viewing", "Playing with eyes closed", "Composing new music"], a: 1 },
                { q: "What does 'dynamics' refer to in music?", o: ["The tempo", "Variations in loudness and softness", "The key signature", "The time signature"], a: 1 },
                { q: "What is the C Major scale's first note?", o: ["A", "B", "C", "D"], a: 2 },
                { q: "What does 'legato' mean?", o: ["Play short and detached", "Play smoothly and connected", "Play very loudly", "Play with a pause"], a: 1 },
                { q: "What is a 'time signature'?", o: ["The key of the piece", "Numbers indicating beats per measure and note value", "The tempo marking", "The dynamics marking"], a: 1 },
                { q: "What is 'improvisation' in jazz piano?", o: ["Playing exactly as written", "Spontaneously creating music while performing", "Reading sheet music only", "Tuning the piano"], a: 1 },
                { q: "What is a 'recital'?", o: ["A practice session", "A formal performance of music, often for an audience", "A music theory exam", "A piano tuning session"], a: 1 },
                { q: "What does 'both hands together' practice help develop?", o: ["Only memory", "Coordination between melody and accompaniment", "Only sight-reading", "Only dynamics"], a: 1 },
                { q: "What is 'composition' in music?", o: ["Performing someone else's piece", "The process of creating an original piece of music", "Tuning an instrument", "Reading music"], a: 1 },
                { q: "Which hand usually plays the melody in beginner piano pieces?", o: ["Left hand", "Right hand", "Neither", "Both equally always"], a: 1 },
            ],
            'ðŸŽ»': [
                { q: "How many strings does a standard violin have?", o: ["3", "4", "5", "6"], a: 1 },
                { q: "What is used to produce sound on a violin?", o: ["Fingers only", "A bow drawn across the strings", "A pick", "Air"], a: 1 },
                { q: "What is 'pizzicato'?", o: ["Bowing technique", "Plucking the strings with fingers instead of bowing", "Tuning method", "A type of rosin"], a: 1 },
                { q: "What is 'rosin' used for?", o: ["Cleaning the violin", "Applying to the bow for grip on strings", "Tuning the strings", "Polishing the body"], a: 1 },
                { q: "What is 'vibrato'?", o: ["A static pitch", "A slight wavering in pitch for expressive effect", "A tuning method", "A bowing direction"], a: 1 },
                { q: "What are the open string notes on a standard violin (low to high)?", o: ["C G D A", "G D A E", "E A D G", "A D G C"], a: 1 },
                { q: "What is the 'chin rest' used for?", o: ["Tuning", "Supporting the violin under the chin while playing", "Holding the bow", "Storing rosin"], a: 1 },
                { q: "What does 'arco' mean in notation?", o: ["Pluck the strings", "Play with the bow", "Mute the strings", "Tune the violin"], a: 1 },
                { q: "What is 'shifting' on a violin?", o: ["Changing the bow grip", "Moving the left hand to a different position on the fingerboard", "Tuning the strings", "Switching instruments"], a: 1 },
                { q: "What is the 'bridge' on a violin?", o: ["The neck", "A wooden piece that supports the strings and transmits vibration", "The tuning pegs", "The chin rest"], a: 1 },
                { q: "What is a 'double stop'?", o: ["Stopping the bow twice", "Playing two strings simultaneously", "A rest", "Tuning twice"], a: 1 },
                { q: "What does 'staccato' indicate?", o: ["Smooth and connected notes", "Short, detached notes", "Very loud playing", "Slow tempo"], a: 1 },
                { q: "What is the violin's smallest, highest-pitched string?", o: ["G string", "D string", "A string", "E string"], a: 3 },
                { q: "What is 'tuning by fifths'?", o: ["Tuning each string a fifth apart from the next", "Tuning only the E string", "A bowing technique", "A type of vibrato"], a: 0 },
                { q: "What is the purpose of a 'mute' on a violin?", o: ["Increase volume", "Soften and dampen the sound", "Tune the instrument", "Clean the strings"], a: 1 },
            ],
            'ðŸª•': [
                { q: "How many strings does a standard ukulele have?", o: ["3", "4", "5", "6"], a: 1 },
                { q: "What is the standard tuning for a soprano ukulele?", o: ["G C E A", "E A D G", "A D G C", "D G B E"], a: 0 },
                { q: "What is 'strumming pattern'?", o: ["A tuning method", "A rhythmic sequence of up and down strokes", "A chord shape", "A picking style"], a: 1 },
                { q: "What is a common first chord taught to ukulele beginners?", o: ["C chord", "B7 chord", "F#m chord", "Bb chord"], a: 0 },
                { q: "What is 'fingerpicking' on ukulele?", o: ["Strumming with a pick", "Plucking individual strings with fingers", "Tuning by ear", "Muting all strings"], a: 1 },
                { q: "Where did the ukulele originate?", o: ["Mexico", "Hawaii", "Spain", "Japan"], a: 1 },
                { q: "What is the smallest common ukulele size?", o: ["Baritone", "Tenor", "Concert", "Soprano"], a: 3 },
                { q: "What does a 'chord chart' show?", o: ["Song lyrics only", "Finger placement for chords on the fretboard", "Tuning instructions", "Strumming speed"], a: 1 },
                { q: "What is 'muting' a string?", o: ["Tuning it higher", "Pressing lightly to stop it from ringing", "Removing it", "Playing it louder"], a: 1 },
                { q: "What material are ukulele strings traditionally made from?", o: ["Steel", "Nylon", "Copper wire", "Silk"], a: 1 },
                { q: "What is a 'transition' between chords?", o: ["A type of strum", "Smoothly moving fingers from one chord shape to another", "A tuning step", "A rest in the song"], a: 1 },
                { q: "What does 'palm muting' do on ukulele?", o: ["Increases volume", "Dampens the sound for a percussive effect", "Tunes the strings", "Changes the key"], a: 1 },
                { q: "What is a 'campanella' style?", o: ["A strumming technique", "A picking style that lets notes ring together like bells", "A tuning method", "A chord type"], a: 1 },
                { q: "What is the 're-entrant tuning' on a ukulele?", o: ["Strings tuned in strict ascending pitch order", "A tuning where the highest pitch isn't on the outer string (e.g. G C E A)", "Tuning all strings to the same note", "Tuning by fifths"], a: 1 },
                { q: "What is a good first song style to practice strumming?", o: ["Complex jazz solos", "Simple 3-4 chord songs", "Atonal compositions", "Drum solos"], a: 1 },
            ],
            'ðŸ¥': [
                { q: "What is the 'snare drum' known for?", o: ["A deep bass sound", "A sharp, crisp sound from wires against the bottom head", "A ringing cymbal sound", "Silence"], a: 1 },
                { q: "What does 'BPM' stand for in drumming?", o: ["Beats Per Measure", "Beats Per Minute", "Bass Pedal Motion", "Bar Per Minute"], a: 1 },
                { q: "What is a 'drum fill'?", o: ["A pause in playing", "A short rhythmic phrase that connects sections of a song", "Tuning the drums", "A type of cymbal"], a: 1 },
                { q: "Which part of the drum kit keeps the basic beat, typically?", o: ["Crash cymbal", "Hi-hat and kick drum", "Floor tom only", "Cowbell"], a: 1 },
                { q: "What is 'paradiddle'?", o: ["A type of cymbal", "A basic drum rudiment pattern (RLRR LRLL)", "A tuning method", "A drum brand"], a: 1 },
                { q: "What does the 'kick drum' control with your body?", o: ["Hands", "Foot via a pedal", "Elbows", "Knees"], a: 1 },
                { q: "What is 'ghost notes' in drumming?", o: ["Notes played very loudly", "Very quiet notes played between main beats for groove", "Missed beats", "Notes played on cymbals only"], a: 1 },
                { q: "What is a 'drum rudiment'?", o: ["A type of drum", "A basic sticking pattern used to build technique", "A tuning key", "A cymbal stand"], a: 1 },
                { q: "What does 'time signature' tell a drummer?", o: ["The drum brand", "How many beats are in each measure", "The tuning pitch", "The cymbal size"], a: 1 },
                { q: "What is 'rudimental' drumming most associated with?", o: ["Jazz only", "Marching bands and snare drum technique", "Electronic music", "Classical orchestras only"], a: 1 },
                { q: "What is the purpose of a 'metronome' for drummers?", o: ["To tune drums", "To keep consistent tempo while practicing", "To amplify sound", "To clean cymbals"], a: 1 },
                { q: "What is a 'hi-hat'?", o: ["A type of drum stick", "A pair of cymbals operated by a foot pedal", "The bass drum", "A tuning tool"], a: 1 },
                { q: "What does 'dynamics' mean for a drummer?", o: ["Tuning the drums", "Varying the volume/intensity of playing", "Changing drum heads", "Switching sticks"], a: 1 },
                { q: "What is a 'crash cymbal' typically used for?", o: ["Keeping steady time quietly", "Accenting strong beats or transitions loudly", "Tuning reference", "Muting other drums"], a: 1 },
                { q: "What grip style involves holding sticks with palms facing down?", o: ["Traditional grip", "Matched grip", "French grip", "Reverse grip"], a: 1 },
            ],
        };

        const genericBank = [
            { q: "What does AI stand for?", o: ["Automated Intelligence", "Artificial Intelligence", "Applied Interaction", "Automated Integration"], a: 1 },
            { q: "How many hours are in a week?", o: ["148", "156", "168", "172"], a: 2 },
            { q: "Which planet is known as the Red Planet?", o: ["Venus", "Jupiter", "Mars", "Saturn"], a: 2 },
            { q: "What is H2O?", o: ["Salt", "Water", "Hydrogen gas", "Oxygen"], a: 1 },
            { q: "How many continents are there?", o: ["5", "6", "7", "8"], a: 2 },
            { q: "What is the capital of France?", o: ["Berlin", "London", "Rome", "Paris"], a: 3 },
            { q: "Which is the largest ocean?", o: ["Atlantic", "Indian", "Arctic", "Pacific"], a: 3 },
            { q: "How many sides does a hexagon have?", o: ["5", "6", "7", "8"], a: 1 },
            { q: "What is the powerhouse of the cell?", o: ["Nucleus", "Ribosome", "Mitochondria", "Golgi body"], a: 2 },
            { q: "What does DNA stand for?", o: ["Data and Analysis", "Deoxyribonucleic Acid", "Dynamic Nucleic Array", "Digital Network Architecture"], a: 1 },
            { q: "What is photosynthesis?", o: ["Animal respiration", "Plants making food from sunlight", "Water filtration", "Soil nutrition"], a: 1 },
            { q: "How many bones are in the adult human body?", o: ["196", "206", "216", "226"], a: 1 },
            { q: "What is the boiling point of water at sea level?", o: ["90Â°C", "95Â°C", "100Â°C", "105Â°C"], a: 2 },
            { q: "Who invented the telephone?", o: ["Edison", "Tesla", "Bell", "Marconi"], a: 2 },
            { q: "How many colors are in a rainbow?", o: ["5", "6", "7", "8"], a: 2 },
        ];

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        //  EXAM ENGINE
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        let examQs = [], examAnswers = [], currentQ = 0;
        let examStartTime = null, timerInterval = null, timerSec = 720, examTopic = '', lastExamInterest = '';

        const topicNames = { 'ðŸŽ¸ Music': 'Music Theory', 'ðŸ’» Coding': 'Programming Basics', 'ðŸŽ¨ Crafting': 'Creative Arts', 'ðŸ’ƒ Dance': 'Dance & Movement', 'ðŸ“· Photography': 'Photography', 'âœï¸ Writing': 'Creative Writing', 'ðŸ³ Cooking': 'Culinary Arts', 'ðŸŽ­ Acting': 'Drama & Acting' };
        const instrumentNames = { 'ðŸŽ¸': 'Guitar', 'ðŸŽ¹': 'Piano', 'ðŸŽ»': 'Violin', 'ðŸª•': 'Ukulele', 'ðŸ¥': 'Drums' };

        function startExam(interestKey) {
            if (!currentUser) { openModal('login'); return; }
            refreshUser();
            const interest = interestKey || currentUser.interests[0] || 'ðŸŽ¸ Music';
            lastExamInterest = interest;
            if (interest === 'ðŸŽ¸ Music' && currentUser.instrument && MUSIC_QB[currentUser.instrument]) {
                examQs = MUSIC_QB[currentUser.instrument].slice(0, 15);
                examTopic = `${instrumentNames[currentUser.instrument] || 'Music'} Basics`;
            } else {
                examQs = (QB[interest] || genericBank).slice(0, 15);
                examTopic = topicNames[interest] || 'General Knowledge';
            }
            examAnswers = new Array(15).fill(null);
            currentQ = 0; examStartTime = Date.now(); timerSec = 720;
            document.getElementById('examPageTitle').textContent = `Weekly Exam â€“ ${examTopic}`;
            document.getElementById('timerBadge').classList.remove('urgent');
            showPage('examPage');
            renderQ();
            clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                timerSec--;
                const m = Math.floor(timerSec / 60), s = timerSec % 60;
                document.getElementById('timerText').textContent = `${m}:${s.toString().padStart(2, '0')}`;
                if (timerSec <= 60) document.getElementById('timerBadge').classList.add('urgent');
                if (timerSec <= 0) { clearInterval(timerInterval); submitExam(); }
            }, 1000);
        }

        function renderQ() {
            const q = examQs[currentQ];
            const answered = examAnswers[currentQ] !== null;
            const pct = ((currentQ + 1) / 15) * 100;
            document.getElementById('examProgressBar').style.width = pct + '%';
            document.getElementById('qCounter').textContent = `Question ${currentQ + 1} of 15`;
            // Prev: visible on any question after the first
            document.getElementById('prevBtn').style.display = (currentQ > 0) ? 'inline-flex' : 'none';
            // Next: visible once answered and not the last question
            document.getElementById('nextBtn').style.display = (answered && currentQ < 14) ? 'inline-flex' : 'none';
            // Submit: visible only on last question after answering
            document.getElementById('submitBtn').style.display = (answered && currentQ === 14) ? 'inline-flex' : 'none';

            const sel = examAnswers[currentQ];
            const optsHtml = q.o.map((opt, i) => {
                let cls = 'option-btn';
                if (answered) {
                    if (i === q.a) cls += ' correct';
                    else if (i === sel) cls += ' wrong';
                }
                return `<button class="${cls}" onclick="selectAns(${i})" ${answered ? 'disabled' : ''}>${opt}</button>`;
            }).join('');

            let fb = '';
            if (answered) {
                const ok = sel === q.a;
                fb = `<div class="feedback-box ${ok ? 'correct-fb' : 'wrong-fb'} show">
      ${ok ? 'âœ… Correct! Well done.' : 'âŒ Incorrect. The right answer is: <strong>' + q.o[q.a] + '</strong>'}
    </div>`;
            }

            document.getElementById('questionArea').innerHTML = `
    <div class="question-card">
      <div class="q-number">Question ${currentQ + 1} of 15</div>
      <div class="q-text">${q.q}</div>
      <div class="options-grid">${optsHtml}</div>
      ${fb}
    </div>`;
        }

        function selectAns(idx) {
            if (examAnswers[currentQ] !== null) return;
            examAnswers[currentQ] = idx;
            renderQ();
        }

        function prevQuestion() {
            if (currentQ > 0) { currentQ--; renderQ(); }
        }

        function nextQuestion() {
            if (currentQ < 14) { currentQ++; renderQ(); }
        }

        function submitExam() {
            clearInterval(timerInterval);
            const elapsed = Math.round((Date.now() - examStartTime) / 1000);
            const m = Math.floor(elapsed / 60), s = elapsed % 60;
            const timeStr = `${m}m ${s}s`;
            let correct = 0;
            examAnswers.forEach((a, i) => { if (a === examQs[i].a) correct++; });
            const wrong = 15 - correct;
            const score = Math.round((correct / 15) * 100);

            // Persist to user
            const users = getUsers();
            const u = users[currentUser.email];
            if (!u.examHistory) u.examHistory = [];
            u.examHistory.push({ score, correct, wrong, timeTaken: timeStr, date: new Date().toISOString(), topic: examTopic });
            if (score >= 80) u.badges = (u.badges || 0) + 1;
            u.streak = (u.streak || 1) + (score >= 40 ? 1 : 0);
            u.hours = (u.hours || 0) + Math.max(1, Math.ceil(elapsed / 3600));
            saveUsers(users);
            currentUser = u; saveSession(u);

            showResult(score, correct, wrong, timeStr);
        }

        function showResult(score, correct, wrong, timeStr) {
            showPage('resultPage');
            const icon = score >= 80 ? 'ðŸ†' : score >= 60 ? 'ðŸŽ‰' : score >= 40 ? 'ðŸ“š' : 'ðŸ’ª';
            const title = score >= 80 ? 'Outstanding!' : score >= 60 ? 'Well Done!' : score >= 40 ? 'Keep Going!' : "Don't Give Up!";
            const msg = score >= 80
                ? 'Exceptional performance! A badge has been added to your profile and your learning path has been advanced.'
                : score >= 60
                    ? 'You passed this week\'s exam! Keep up the momentum and aim even higher next time.'
                    : score >= 40
                        ? 'A good attempt! Review the areas where you lost marks and come back stronger.'
                        : 'Every expert was once a beginner. Review your learning path and retake the exam â€” you\'ve got this!';

            document.getElementById('resultIcon').textContent = icon;
            document.getElementById('resultTitle').textContent = title;
            document.getElementById('resultMsg').textContent = msg;
            document.getElementById('rsCorrect').textContent = correct;
            document.getElementById('rsWrong').textContent = wrong;
            document.getElementById('rsTime').textContent = timeStr;
            document.getElementById('ringPct').textContent = score + '%';

            const rf = document.getElementById('ringFill');
            rf.style.stroke = score >= 80 ? '#1aff8c' : score >= 60 ? '#7c5cfc' : score >= 40 ? '#fc5c7d' : '#666';
            rf.style.strokeDashoffset = 377;
            setTimeout(() => { rf.style.strokeDashoffset = 377 - ((score / 100) * 377); }, 100);
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        //  RESOURCES (shared community library)
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        const RES_KEY = 'pathmind_resources_v2';

        const RES_TYPE_ICON = { video: 'ðŸŽ¬', pdf: 'ðŸ“„', article: 'ðŸ“°' };

        function getResources() {
            return JSON.parse(localStorage.getItem(RES_KEY) || 'null') || seedResources();
        }
        function saveResources(r) { localStorage.setItem(RES_KEY, JSON.stringify(r)); }

        function seedResources() {
            const seed = {
                'ðŸ’» Coding|1': [
                    { title: 'HTML Crash Course For Absolute Beginners', url: 'https://www.youtube.com/watch?v=UB1O30fR-EE', type: 'video', by: 'Personalized AI Learning Path Team' },
                    { title: 'MDN: HTML Basics Guide', url: 'https://developer.mozilla.org/en-US/docs/Learn/HTML', type: 'article', by: 'Personalized AI Learning Path Team' }
                ],
                'ðŸ’» Coding|2': [
                    { title: 'CSS Crash Course For Beginners', url: 'https://www.youtube.com/watch?v=yfoY53QXEnI', type: 'video', by: 'Personalized AI Learning Path Team' },
                    { title: 'CSS Cheat Sheet (PDF)', url: 'https://www.wpkube.com/wp-content/uploads/2017/03/css-cheat-sheet.pdf', type: 'pdf', by: 'Personalized AI Learning Path Team' }
                ],
                'ðŸŽ¸ Music|1': [
                    { title: 'Music Theory Basics in 10 Minutes', url: 'https://www.youtube.com/watch?v=2pjJ8h6sNRA', type: 'video', by: 'Personalized AI Learning Path Team' }
                ],
                'ðŸŽ¹ Piano|1': [
                    { title: 'Piano Basics For Complete Beginners', url: 'https://www.youtube.com/watch?v=ZbWiAaSPRMc', type: 'video', by: 'Personalized AI Learning Path Team' }
                ],
                'ðŸ“· Photography|1': [
                    { title: 'Camera Settings Explained', url: 'https://www.youtube.com/watch?v=V2QQS2qJ8mQ', type: 'video', by: 'Personalized AI Learning Path Team' }
                ],
                'âœï¸ Writing|1': [
                    { title: 'Freewriting Technique Guide', url: 'https://owl.purdue.edu/owl/general_writing/the_writing_process/freewriting.html', type: 'article', by: 'Personalized AI Learning Path Team' }
                ],
                'ðŸ³ Cooking|1': [
                    { title: 'Kitchen Safety Basics', url: 'https://www.youtube.com/watch?v=3RuKQzqyk-Q', type: 'video', by: 'Personalized AI Learning Path Team' }
                ],
                'ðŸŽ­ Acting|1': [
                    { title: 'Actor Warm-Up Exercises', url: 'https://www.youtube.com/watch?v=2gWasn5JJ8I', type: 'video', by: 'Personalized AI Learning Path Team' }
                ],
                'ðŸ’ƒ Dance|1': [
                    { title: 'Dance Warm-Up & Stretch Routine', url: 'https://www.youtube.com/watch?v=g_tea8ZNk5A', type: 'video', by: 'Personalized AI Learning Path Team' }
                ],
                'ðŸŽ¨ Crafting|1': [
                    { title: 'Color Theory Basics', url: 'https://www.youtube.com/watch?v=_2LLXnUdUIc', type: 'video', by: 'Personalized AI Learning Path Team' }
                ]
            };
            saveResources(seed);
            return seed;
        }

        let lessonCtx = { key: '', week: 0 };

        function openLesson(key, week, topic) {
            lessonCtx = { key, week };
            renderLesson(topic);
            document.getElementById('lessonOverlay').style.display = 'flex';
        }
        function closeLesson() {
            document.getElementById('lessonOverlay').style.display = 'none';
        }
        document.getElementById('lessonOverlay').addEventListener('click', function (e) {
            if (e.target === this) closeLesson();
        });

        function renderLesson(topic) {
            const all = getResources();
            const list = all[`${lessonCtx.key}|${lessonCtx.week}`] || [];
            const resHtml = list.length
                ? list.map(r => `
        <div class="res-card">
          <div class="res-icon">${RES_TYPE_ICON[r.type] || 'ðŸ”—'}</div>
          <div style="flex:1;">
            <div class="res-title">${r.title}</div>
            <div class="res-meta">${r.type.toUpperCase()} Â· Shared by ${r.by}</div>
          </div>
          <a class="res-link" href="${r.url}" target="_blank" rel="noopener">Open â†’</a>
        </div>`).join('')
                : `<p style="color:var(--muted);font-size:.88rem;margin-bottom:.5rem;">No resources yet for this week. Be the first to add one!</p>`;

            document.getElementById('lessonContent').innerHTML = `
        <div style="margin-bottom:1.5rem;">
          <div style="font-size:.78rem;color:var(--accent);text-transform:uppercase;letter-spacing:.08em;font-weight:600;margin-bottom:.3rem;">${lessonCtx.key} Â· Week ${lessonCtx.week}</div>
          <h2 style="font-size:1.5rem;font-weight:800;">${topic}</h2>
        </div>
        <h3 style="font-weight:700;margin-bottom:.8rem;font-size:1rem;">ðŸ“š Free Resources</h3>
        <div id="resList">${resHtml}</div>
        <button class="btn btn-outline" style="width:100%;justify-content:center;margin-top:.5rem;" onclick="toggleAddRes()">+ Add a Resource</button>
        <div class="add-res-form" id="addResForm">
          <div class="form-group"><label>Title</label><input type="text" id="resTitle" placeholder="e.g. Beginner's Guide to..."></div>
          <div class="form-group"><label>URL</label><input type="text" id="resUrl" placeholder="https://..."></div>
          <div class="form-group"><label>Type</label>
            <select id="resType">
              <option value="video">ðŸŽ¬ Video</option>
              <option value="pdf">ðŸ“„ PDF</option>
              <option value="article">ðŸ“° Article</option>
            </select>
          </div>
          <button class="btn btn-primary" style="width:100%;justify-content:center;" onclick="submitResource('${topic.replace(/'/g, "\\'")}')">Submit Resource</button>
        </div>
        <div style="display:flex;gap:1rem;margin-top:1.5rem;flex-wrap:wrap;">
          <button class="btn btn-outline" style="flex:1;justify-content:center;" onclick="closeLesson()">â† Back to Path</button>
        </div>`;
        }

        function toggleAddRes() {
            document.getElementById('addResForm').classList.toggle('show');
        }

        function submitResource(topic) {
            const title = document.getElementById('resTitle').value.trim();
            const url = document.getElementById('resUrl').value.trim();
            const type = document.getElementById('resType').value;
            if (!title || !url) return toast('âš ï¸ Please fill in title and URL.');
            if (!/^https?:\/\//i.test(url)) return toast('âš ï¸ Please enter a valid URL starting with http(s)://');

            const all = getResources();
            const k = `${lessonCtx.key}|${lessonCtx.week}`;
            if (!all[k]) all[k] = [];
            all[k].push({ title, url, type, by: currentUser ? currentUser.name.split(' ')[0] : 'Anonymous' });
            saveResources(all);
            document.getElementById('resTitle').value = '';
            document.getElementById('resUrl').value = '';
            renderLesson(topic);
            toast('ðŸŽ‰ Resource added! Thanks for contributing.');
        }

        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        //  EDIT INTERESTS
        // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
        let editSelectedInterests = [];

        function openEditInterests() {
            refreshUser();
            editSelectedInterests = [...currentUser.interests];
            document.querySelectorAll('#editInterestGrid .interest-chip').forEach(chip => {
                chip.classList.toggle('selected', editSelectedInterests.includes(chip.dataset.key));
            });
            document.getElementById('editInstrumentGroup').style.display =
                editSelectedInterests.includes('ðŸŽ¸ Music') ? 'block' : 'none';
            if (currentUser.instrument) document.getElementById('editInstrumentSelect').value = currentUser.instrument;
            document.getElementById('editInterestsOverlay').style.display = 'flex';
        }
        function closeEditInterests() {
            document.getElementById('editInterestsOverlay').style.display = 'none';
        }
        document.getElementById('editInterestsOverlay').addEventListener('click', function (e) {
            if (e.target === this) closeEditInterests();
        });

        function toggleEditInterest(el) {
            const key = el.dataset.key;
            if (el.classList.contains('selected')) {
                el.classList.remove('selected');
                editSelectedInterests = editSelectedInterests.filter(x => x !== key);
            } else {
                if (editSelectedInterests.length >= 3) {
                    toast('âš ï¸ You can select up to 3 interests only.');
                    return;
                }
                el.classList.add('selected');
                editSelectedInterests.push(key);
            }
            document.getElementById('editInstrumentGroup').style.display =
                editSelectedInterests.includes('ðŸŽ¸ Music') ? 'block' : 'none';
        }

        function saveEditInterests() {
            if (editSelectedInterests.length === 0) { toast('âš ï¸ Please select at least one interest.'); return; }
            const instrument = editSelectedInterests.includes('ðŸŽ¸ Music') ? document.getElementById('editInstrumentSelect').value : null;
            const users = getUsers();
            const u = users[currentUser.email];
            u.interests = [...editSelectedInterests];
            u.instrument = instrument;
            saveUsers(users);
            currentUser = u; saveSession(u);
            closeEditInterests();
            showDashboard();
            toast('âœ… Interests updated!');
        }


        let tt;
        function toast(msg) {
            const t = document.getElementById('toast');
            document.getElementById('toastMsg').textContent = msg;
            clearTimeout(tt); t.classList.add('show');
            tt = setTimeout(() => t.classList.remove('show'), 3200);
        }
