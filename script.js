/* ── Scroll Progress ── */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${scrolled / total})`;
});

/* ── Mouse Glow ── */
const glow = document.getElementById('mouse-glow');
window.addEventListener('mousemove', e => {
  glow.style.left = e.clientX + 'px';
  glow.style.top  = e.clientY + 'px';
});

/* ── Floating Nav ── */
const nav = document.getElementById('floatnav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('visible', window.scrollY > 80);
});

/* ── Smooth Scroll ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ── Typewriter ── */
const titles = [
  'Cybersecurity Analyst',
  'Threat Intelligence Specialist',
  'Ethical Hacker',
  'Penetration Tester',
];
let ti = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter-text');

function typeStep() {
  const word = titles[ti];
  if (!deleting) {
    tw.textContent = word.slice(0, ++ci);
    if (ci === word.length) { deleting = true; setTimeout(typeStep, 2200); return; }
  } else {
    tw.textContent = word.slice(0, --ci);
    if (ci === 0) { deleting = false; ti = (ti + 1) % titles.length; }
  }
  setTimeout(typeStep, deleting ? 45 : 85);
}
typeStep();

/* ── Terminal ── */
const termLines = [
  { text: '$ nmap -sV --script vuln 192.168.1.0/24', cls: 'term-cmd', delay: 200 },
  { text: 'Starting Nmap 7.93 — CVE scan in progress...', cls: 'term-info', delay: 800 },
  { text: '[!] CVE-2023-4911  CRITICAL  CVSS: 7.8', cls: 'term-warn', delay: 1600 },
  { text: '$ python3 exploit.py --target 192.168.1.105', cls: 'term-cmd', delay: 2400 },
  { text: '[+] Shell obtained. Privilege escalation initiated...', cls: 'term-info', delay: 3000 },
  { text: '[+] root@target:~#  Access granted ✓', cls: 'term-ok', delay: 3800 },
];
const termBody = document.getElementById('terminal-body');
let termFired = false;

function fireTerminal() {
  if (termFired) return;
  termFired = true;
  termLines.forEach(({ text, cls, delay }) => {
    setTimeout(() => {
      const p = document.createElement('p');
      p.className = 'term-line ' + cls;
      p.textContent = text;
      termBody.appendChild(p);
      requestAnimationFrame(() => p.classList.add('visible'));
    }, delay);
  });
}

/* ── Counter Animation ── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  let current = 0;
  const duration = 1800;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current) + suffix;
    if (current >= target) clearInterval(timer);
  }, 16);
}

/* ── Intersection Observer ── */
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;

    // Counters
    if (el.classList.contains('stat-value') && !el.dataset.counted) {
      el.dataset.counted = true;
      animateCounter(el);
    }
    // Timeline & reveal items
    if (el.classList.contains('timeline-item') || el.classList.contains('reveal')) {
      el.classList.add('in-view');
    }
    // Load animations
    if (el.hasAttribute('data-animate')) {
      el.classList.add('animated');
    }
    // Language bars
    el.querySelectorAll('.lang-fill').forEach(bar => {
      bar.style.width = bar.dataset.width + '%';
    });
    // Terminal
    if (el.id === 'terminal') fireTerminal();

    io.unobserve(el);
  });
}, { threshold: 0.15 });

document.querySelectorAll(
  '.stat-value, .timeline-item, .reveal, [data-animate], #terminal'
).forEach(el => io.observe(el));

/* ── Arsenal Tool Tabs ── */
const categories = [
  {
    name: 'Pentesting', icon: '⊕',
    tools: ['Metasploit', 'Burp Suite', 'OWASP ZAP', 'SQLmap', 'Nikto', 'BeEF', 'Mimikatz', 'Responder', 'Impacket', 'BloodHound', 'CrackMapExec', 'SET'],
  },
  {
    name: 'Network', icon: '◈',
    tools: ['Nmap', 'Wireshark', 'Netcat', 'Ettercap', 'Tcpdump', 'Masscan', 'Zmap', 'Shodan', 'Censys'],
  },
  {
    name: 'SIEM & Defense', icon: '◉',
    tools: ['Splunk', 'IBM QRadar', 'ELK Stack', 'Wazuh', 'OSSEC', 'Snort', 'Suricata', 'Fail2ban', 'ModSecurity', 'Security Onion'],
  },
  {
    name: 'OSINT', icon: '◎',
    tools: ['Maltego', 'theHarvester', 'Recon-ng', 'SpiderFoot', 'OSINT Framework', 'Amass', 'Google Dorking', 'Shodan'],
  },
  {
    name: 'Vulnerability', icon: '◆',
    tools: ['Nessus', 'OpenVAS', 'Qualys', 'Nexpose', 'WPScan', 'Nuclei', 'Acunetix'],
  },
  {
    name: 'Password', icon: '◇',
    tools: ['Hashcat', 'John the Ripper', 'Hydra', 'Medusa', 'Aircrack-ng', 'Fcrackzip'],
  },
];

const tabsEl = document.getElementById('tool-tabs');
const gridEl = document.getElementById('tool-grid');
let activeTab = 0;

function renderTools(idx) {
  gridEl.innerHTML = '';
  categories[idx].tools.forEach((tool, i) => {
    const span = document.createElement('span');
    span.className = 'tool-badge';
    span.textContent = tool;
    span.style.animationDelay = (i * 0.04) + 's';
    gridEl.appendChild(span);
  });
}

categories.forEach((cat, i) => {
  const btn = document.createElement('button');
  btn.className = 'tab-btn' + (i === 0 ? ' active' : '');
  btn.innerHTML = `<span>${cat.icon}</span>${cat.name}`;
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeTab = i;
    renderTools(i);
  });
  tabsEl.appendChild(btn);
});
renderTools(0);

/* ── Year ── */
document.getElementById('year').textContent = new Date().getFullYear();
