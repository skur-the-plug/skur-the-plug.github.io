const terminalOutput = document.querySelector('#terminal-output');
const terminalForm = document.querySelector('#terminal-form');
const terminalInput = document.querySelector('#terminal-input');
const clock = document.querySelector('#clock');
const initialTerminalMarkup = terminalOutput.innerHTML;

const commandHistory = [];
let historyIndex = 0;
let activeTheme = 'cyan';

const projectData = {
  mega: {
    title: 'Intelligent ERP / CRM',
    meta: 'Mega Rayonnage · Software Engineering Internship · 2026',
    body: 'Designed and delivered a web and mobile ERP/CRM used by 20+ people across two sites. It unified lead management, quotations, orders, planning, labour hours, productivity, invoicing, and financial reconciliation.',
    details: [
      'Built real-time operational dashboards and Gemini-powered monthly reports.',
      'Uncovered four legacy-tool discrepancies later confirmed through business review.',
      'Hardened production with JWT, granular permissions, mutation auditing, tests, CI/CD, Apache, and HTTPS.'
    ],
    tech: ['Python', 'FastAPI', 'TypeScript', 'React Native', 'Expo', 'PostgreSQL', 'Docker', 'GitHub Actions']
  },
  mindarena: {
    title: 'MindArena',
    meta: 'Microservices Web Platform · Academic Project',
    body: 'Co-developed a competitive-challenge MVP with submissions, voting, comments, XP, ranks, leaderboards, notifications, and chat.',
    details: [
      'Owned secure identity using RS256 JWT.',
      'Owned progression and leaderboard systems.',
      'Contributed to the Spring Cloud migration, Redis caching, RabbitMQ events, testing, and industrialisation.'
    ],
    tech: ['Java 21', 'Spring Boot', 'Spring Security', 'MariaDB', 'Redis', 'RabbitMQ', 'Docker']
  },
  nokia: {
    title: 'Operations Intelligence Prototype',
    meta: 'Nokia · Software Engineering Internship · 2025',
    body: 'Built a local web prototype that transformed unstructured WhatsApp histories into operational data for tracking incidents, maintenance, upgrades, and alerts.',
    details: [
      'Built the SQLite processing pipeline and REST API.',
      'Delivered search, filters, timelines, KPIs, and a React interface.',
      'Validated the solution with the internship supervisor in a controlled environment.'
    ],
    tech: ['JavaScript', 'React', 'Node.js', 'Express', 'SQLite', 'REST API']
  },
  epidemic: {
    title: 'Epidemic Tracking',
    meta: 'Mobile Application · First-year Project',
    body: 'Built a functional epidemic-tracking application for citizens, physicians, and administrators as part of a team.',
    details: [
      'Developed citizen and physician mobile journeys.',
      'Built reporting forms, the dashboard, and risk-zone mapping.',
      'Contributed to UML, API integration, and final testing.'
    ],
    tech: ['React Native', 'REST API', 'UML', 'Mapping']
  },
  tipe: {
    title: 'Inclusive Sports Simulator',
    meta: 'Individual TIPE · Recognised as Best TSI TIPE',
    body: 'Conceived an inclusive VR sports simulator built around a four-cable motion platform.',
    details: [
      'Produced the engineering study and 3D model.',
      'Covered kinematics, sizing, structural analysis, and PI control.'
    ],
    tech: ['Blender', 'Systems Design', 'Control Engineering', 'Structural Analysis', 'SysML', 'VR']
  }
};

const commands = [
  'about', 'projects', 'project', 'experience', 'skills', 'education',
  'leadership', 'contact', 'resume', 'gui', 'github', 'linkedin',
  'artstation', 'theme', 'whoami', 'ls', 'pwd', 'date', 'history',
  'neofetch', 'status', 'welcome', 'help', 'clear'
];

const aliases = {
  '?': 'help',
  commands: 'help',
  work: 'projects',
  portfolio: 'projects',
  exp: 'experience',
  cv: 'resume',
  visual: 'gui',
  cls: 'clear'
};

function saveSession() {
  try {
    sessionStorage.setItem('anas-terminal-output', terminalOutput.innerHTML);
    sessionStorage.setItem('anas-terminal-history', JSON.stringify(commandHistory));
  } catch {
    // The terminal remains fully functional when storage is unavailable.
  }
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[character]);
}

function appendEntry(command, html) {
  const entry = document.createElement('div');
  entry.className = 'command-entry';
  entry.innerHTML = `<p class="prompt-line"><span>visitor</span>@anas:~$ ${escapeHtml(command)}</p><div class="response">${html}</div>`;
  terminalOutput.append(entry);
  terminalOutput.scrollTo({ top: terminalOutput.scrollHeight, behavior: 'smooth' });
  saveSession();
}

function commandButton(command, label = command) {
  return `<button class="choice" type="button" data-command="${command}">${label}</button>`;
}

function tagList(items) {
  return `<div class="tech-tags">${items.map((item) => `<span>${item}</span>`).join('')}</div>`;
}

function renderHelp() {
  const rows = [
    ['about', 'Profile and current objective'],
    ['projects', 'List all selected projects'],
    ['project &lt;name&gt;', 'Open a project case study'],
    ['experience', 'Professional experience'],
    ['skills', 'Technical capability index'],
    ['education', 'Education and engineering path'],
    ['leadership', 'Student leadership roles'],
    ['resume', 'English, French, and ATS résumés'],
    ['contact', 'Email, phone, and social links'],
    ['gui', 'Launch the visual portfolio'],
    ['theme', 'Change terminal accent'],
    ['neofetch', 'Compact system/profile summary'],
    ['status', 'Portfolio availability status'],
    ['welcome', 'Restore the welcome screen'],
    ['clear', 'Clear terminal output']
  ];
  return `<p><strong>Available commands</strong></p><div class="command-grid">${rows.map(([name, description]) => `<div class="command-row">${name.includes('&lt;') ? `<span class="accent">${name}</span>` : commandButton(name)}<span>${description}</span></div>`).join('')}</div><p class="nested-hint">Tip: use <kbd>Tab</kbd> to autocomplete and <kbd>↑</kbd>/<kbd>↓</kbd> to revisit commands.</p>`;
}

function renderAbout() {
  return `<div class="output-card"><h3>Anas Houhou</h3><p class="meta">SOFTWARE ENGINEERING STUDENT · ENSIAS</p><p>I build backend, full-stack, and mobile products from requirements analysis through production. My work spans operational software, secure APIs, distributed systems, and practical product delivery.</p><p>I’m seeking a <strong>six-month final-year internship from January 18, 2027</strong>, in Morocco or internationally.</p>${tagList(['Backend', 'Full-stack', 'Mobile', 'Product delivery'])}</div>`;
}

function renderProjects() {
  const items = [
    ['01', 'mega', 'Intelligent ERP / CRM', 'Production operations platform · 2026'],
    ['02', 'mindarena', 'MindArena', 'Microservices challenge platform'],
    ['03', 'nokia', 'Operations Intelligence', 'WhatsApp-to-structured-data prototype · 2025'],
    ['04', 'epidemic', 'Epidemic Tracking', 'Multi-role mobile application'],
    ['05', 'tipe', 'Inclusive Sports Simulator', 'VR and control engineering · Best TSI TIPE']
  ];
  return `<p><strong>Selected projects</strong> — choose one to inspect:</p>${items.map(([number, key, title, description]) => `<div class="project-item"><span>${number}</span><div><strong>${title}</strong><small>${description}</small></div>${commandButton(`project ${key}`, 'open')}</div>`).join('')}<p class="nested-hint">Example: <code>project mega</code></p>`;
}

function findProject(query) {
  const cleaned = query.toLowerCase().replace(/[^a-z0-9]/g, '');
  const mapping = {
    '1': 'mega', mega: 'mega', erp: 'mega', crm: 'mega',
    '2': 'mindarena', mindarena: 'mindarena', mind: 'mindarena',
    '3': 'nokia', nokia: 'nokia', operations: 'nokia',
    '4': 'epidemic', epidemic: 'epidemic', tracking: 'epidemic',
    '5': 'tipe', tipe: 'tipe', simulator: 'tipe', vr: 'tipe'
  };
  return mapping[cleaned];
}

function renderProject(query) {
  if (!query) return renderProjects();
  const key = findProject(query);
  if (!key) return `<p class="error">Project “${escapeHtml(query)}” was not found.</p><p>Try ${commandButton('projects')} to see the valid options.</p>`;
  const project = projectData[key];
  return `<div class="output-card"><h3>${project.title}</h3><p class="meta">${project.meta}</p><p>${project.body}</p><ul class="output-list">${project.details.map((detail) => `<li>${detail}</li>`).join('')}</ul>${tagList(project.tech)}</div><div class="link-row">${commandButton('projects', '← all projects')}${commandButton('contact', 'discuss this project')}</div>`;
}

function renderExperience(query) {
  const mega = `<div class="output-card"><h3>Software Engineering Intern · Mega Rayonnage</h3><p class="meta">JULY — SEPTEMBER 2026 · TANGIER, MOROCCO</p><p>Owned the technical design and end-to-end delivery of an intelligent web and mobile ERP/CRM deployed across two sites.</p>${tagList(['FastAPI', 'React Native', 'PostgreSQL', 'Docker', 'CI/CD'])}</div>`;
  const nokia = `<div class="output-card"><h3>Software Engineering Intern · Nokia</h3><p class="meta">JULY — AUGUST 2025 · SALÉ, MOROCCO</p><p>Owned a local prototype that converted unstructured message histories into searchable operational intelligence, timelines, and KPIs.</p>${tagList(['React', 'Node.js', 'Express', 'SQLite'])}</div>`;
  if (!query) return `${mega}${nokia}<p class="nested-hint">Use <code>experience mega</code> or <code>experience nokia</code> for a focused view.</p>`;
  if (query.includes('mega') || query === '1') return mega;
  if (query.includes('nokia') || query === '2') return nokia;
  return `<p class="error">Unknown experience. Try <code>experience mega</code> or <code>experience nokia</code>.</p>`;
}

function renderSkills() {
  const groups = [
    ['LANGUAGES', 'Python · Java · C · TypeScript · SQL'],
    ['BACKEND', 'FastAPI · Spring Boot · Spring Security · Express · REST APIs · SQLAlchemy'],
    ['WEB / MOBILE', 'React · React Native · Expo'],
    ['DATA', 'PostgreSQL · MariaDB · SQLite · Redis'],
    ['ENGINEERING', 'Docker · GitHub Actions · Git · Linux · Apache · Pytest'],
    ['FAMILIAR WITH', 'Kubernetes · Jenkins · Flutter']
  ];
  return `<div class="command-grid">${groups.map(([name, values]) => `<div class="output-card"><p class="meta">${name}</p><p>${values}</p></div>`).join('')}</div>`;
}

function renderEducation() {
  return `<div class="output-card"><h3>Software Engineering Degree</h3><p class="meta">ENSIAS · RABAT · 2024 — 2027</p><p>École Nationale Supérieure d’Informatique et d’Analyse des Systèmes.</p></div><div class="output-card"><h3>TSI Preparatory Programme</h3><p class="meta">CENTRE CPGE TÉTOUAN · 2022 — 2024</p></div>`;
}

function renderLeadership() {
  return `<div class="project-item"><span>01</span><div><strong>Vice President · ADEI</strong><small>November 2024 — November 2025</small></div></div><div class="project-item"><span>02</span><div><strong>Design & Outreach Lead · Forum GENI Entreprises</strong><small>November 2024 — present</small></div></div><div class="project-item"><span>03</span><div><strong>Public Relations · Junior Entreprise ENSIAS</strong><small>March 2025 — January 2026</small></div></div>`;
}

function renderContact() {
  return `<div class="output-card"><h3>Let’s build something useful.</h3><p class="meta">AVAILABLE FOR A SIX-MONTH PFE FROM JANUARY 18, 2027</p><p>Rabat, Morocco · Internationally mobile</p><div class="link-row"><a class="terminal-link" href="mailto:anas_houhou@um5.ac.ma">email ↗</a><a class="terminal-link" href="tel:+212666999597">phone ↗</a><a class="terminal-link" href="https://github.com/skur-the-plug" target="_blank" rel="noopener">github ↗</a><a class="terminal-link" href="https://ma.linkedin.com/in/anas-houhou-27b7081b3/" target="_blank" rel="noopener">linkedin ↗</a></div></div>`;
}

function renderNeofetch() {
  return `<div class="neofetch"><pre>       /\\
      /  \\
     / /\\ \\
    / ____  \\
   /_/    \\__\\</pre><dl><div><dt>user</dt><dd>Anas Houhou</dd></div><div><dt>school</dt><dd>ENSIAS · Software Engineering</dd></div><div><dt>focus</dt><dd>Backend · Full-stack · Mobile</dd></div><div><dt>experience</dt><dd>Mega Rayonnage · Nokia</dd></div><div><dt>availability</dt><dd class="success">PFE · January 18, 2027</dd></div><div><dt>shell</dt><dd>portfolio-terminal 1.0</dd></div></dl></div>`;
}

function renderStatus() {
  return `<p><span class="success">● ONLINE</span> Portfolio systems operational.</p><div class="command-grid"><div class="command-row"><span>terminal</span><span class="success">ready</span></div><div class="command-row"><span>visual GUI</span><span class="success">ready</span></div><div class="command-row"><span>résumés</span><span class="success">4 editions</span></div><div class="command-row"><span>PFE</span><span class="success">available Jan 2027</span></div></div>`;
}

function renderResume(query) {
  const options = {
    en: ['Cv_EN.pdf', 'English résumé'],
    fr: ['Cv.pdf', 'French résumé'],
    'ats-en': ['Cv_ATS_EN.pdf', 'ATS English'],
    'ats-fr': ['Cv_ATS_FR.pdf', 'ATS French']
  };
  const key = query.toLowerCase();
  if (options[key]) {
    const [href, label] = options[key];
    window.open(href, '_blank', 'noopener');
    return `<p class="success">Opening ${label}...</p><p>If it did not open, <a class="terminal-link" href="${href}" target="_blank" rel="noopener">open manually ↗</a></p>`;
  }
  return `<p><strong>Choose a résumé edition:</strong></p><div class="link-row">${commandButton('resume en', 'English')}${commandButton('resume fr', 'Français')}${commandButton('resume ats-en', 'ATS English')}${commandButton('resume ats-fr', 'ATS Français')}</div><p class="nested-hint">Example: <code>resume en</code></p>`;
}

function nearestCommand(input) {
  return commands.find((command) => command.startsWith(input[0] || '')) || 'help';
}

function executeCommand(rawCommand) {
  const raw = rawCommand.trim();
  if (!raw) return;

  commandHistory.push(raw);
  historyIndex = commandHistory.length;

  const parts = raw.toLowerCase().split(/\s+/);
  let command = aliases[parts.shift()] || raw.toLowerCase().split(/\s+/)[0];
  const argument = parts.join(' ').trim();

  if (command === 'clear') {
    terminalOutput.innerHTML = '';
    saveSession();
    return;
  }

  if (command === 'welcome') {
    terminalOutput.innerHTML = initialTerminalMarkup;
    terminalOutput.scrollTop = 0;
    saveSession();
    return;
  }

  let response = '';
  switch (command) {
    case 'help': response = renderHelp(); break;
    case 'about': response = renderAbout(); break;
    case 'projects': response = argument ? renderProject(argument) : renderProjects(); break;
    case 'project': response = renderProject(argument); break;
    case 'experience': response = renderExperience(argument); break;
    case 'skills': response = renderSkills(); break;
    case 'education': response = renderEducation(); break;
    case 'leadership': response = renderLeadership(); break;
    case 'contact': response = renderContact(); break;
    case 'resume': response = renderResume(argument); break;
    case 'gui':
      response = '<p class="success">Launching visual portfolio...</p><p>Terminal state will remain available when you return.</p>';
      setTimeout(() => { window.location.href = 'gui.html'; }, 650);
      break;
    case 'github':
      window.open('https://github.com/skur-the-plug', '_blank', 'noopener');
      response = '<p class="success">Opening GitHub...</p>';
      break;
    case 'linkedin':
      window.open('https://ma.linkedin.com/in/anas-houhou-27b7081b3/', '_blank', 'noopener');
      response = '<p class="success">Opening LinkedIn...</p>';
      break;
    case 'artstation':
      window.open('https://www.artstation.com/skurdaplug', '_blank', 'noopener');
      response = '<p class="success">Opening ArtStation...</p>';
      break;
    case 'whoami': response = '<p><span class="accent">visitor</span> — currently exploring the portfolio of <strong>Anas Houhou</strong>.</p>'; break;
    case 'pwd': response = '<p>/home/anas/portfolio</p>'; break;
    case 'ls': response = '<p>about/ &nbsp; projects/ &nbsp; experience/ &nbsp; skills/ &nbsp; education/ &nbsp; leadership/ &nbsp; contact/ &nbsp; resume/ &nbsp; gui.html</p>'; break;
    case 'date': response = `<p>${new Date().toString()}</p>`; break;
    case 'history': response = `<ol class="output-list">${commandHistory.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ol>`; break;
    case 'neofetch': response = renderNeofetch(); break;
    case 'status': response = renderStatus(); break;
    case 'theme': {
      const available = ['cyan', 'violet', 'amber'];
      const requested = argument || available[(available.indexOf(activeTheme) + 1) % available.length];
      if (!available.includes(requested)) {
        response = `<p class="error">Unknown theme. Available: cyan, violet, amber.</p>`;
      } else {
        activeTheme = requested;
        document.body.dataset.theme = requested === 'cyan' ? '' : requested;
        try { localStorage.setItem('anas-terminal-theme', requested); } catch {}
        response = `<p class="success">Theme changed to ${requested}.</p>`;
      }
      break;
    }
    case 'sudo':
      response = argument === 'hire anas' ? '<p class="success">Access granted. Excellent decision. Run <button class="inline-command" data-command="contact">contact</button> to continue.</p>' : '<p class="error">Permission denied. Try something more constructive.</p>';
      break;
    case 'echo': response = `<p>${escapeHtml(argument)}</p>`; break;
    default:
      response = `<p class="error">command not found: ${escapeHtml(command)}</p><p>Did you mean ${commandButton(nearestCommand(command))}? Type ${commandButton('help')} for the full list.</p>`;
  }

  appendEntry(raw, response);
}

terminalForm.addEventListener('submit', (event) => {
  event.preventDefault();
  executeCommand(terminalInput.value);
  terminalInput.value = '';
});

document.addEventListener('click', (event) => {
  const commandTarget = event.target.closest('[data-command]');
  if (!commandTarget) return;
  executeCommand(commandTarget.dataset.command);
  terminalInput.focus({ preventScroll: true });
});

terminalInput.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    historyIndex = Math.max(0, historyIndex - 1);
    terminalInput.value = commandHistory[historyIndex] || '';
  }
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    historyIndex = Math.min(commandHistory.length, historyIndex + 1);
    terminalInput.value = commandHistory[historyIndex] || '';
  }
  if (event.key === 'Tab') {
    event.preventDefault();
    const current = terminalInput.value.trim().toLowerCase();
    if (!current || current.includes(' ')) return;
    const matches = commands.filter((command) => command.startsWith(current));
    if (matches.length === 1) terminalInput.value = `${matches[0]} `;
    if (matches.length > 1) appendEntry(current, `<p>${matches.join(' &nbsp; ')}</p>`);
  }
});

document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'l') {
    event.preventDefault();
    terminalOutput.innerHTML = '';
    saveSession();
  }
  if (event.key === 'Escape') terminalInput.focus({ preventScroll: true });
});

function updateClock() {
  clock.textContent = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  }).format(new Date());
}

updateClock();
setInterval(updateClock, 1000);
document.querySelector('#year').textContent = new Date().getFullYear();

try {
  const savedOutput = sessionStorage.getItem('anas-terminal-output');
  const savedHistory = JSON.parse(sessionStorage.getItem('anas-terminal-history') || '[]');
  const savedTheme = localStorage.getItem('anas-terminal-theme');
  if (savedOutput) terminalOutput.innerHTML = savedOutput;
  if (Array.isArray(savedHistory)) commandHistory.push(...savedHistory.slice(-40));
  historyIndex = commandHistory.length;
  if (['violet', 'amber'].includes(savedTheme)) {
    activeTheme = savedTheme;
    document.body.dataset.theme = savedTheme;
  }
} catch {
  // Storage is an enhancement, never a requirement.
}

const sharedCommand = new URLSearchParams(window.location.search).get('cmd');
if (sharedCommand) {
  setTimeout(() => executeCommand(sharedCommand), 120);
  window.history.replaceState({}, '', window.location.pathname);
}

if (window.matchMedia('(pointer: fine)').matches) terminalInput.focus({ preventScroll: true });
