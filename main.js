// ── Cookie Consent ──
(function () {
  if (localStorage.getItem('cookie_consent')) return;

  const banner = document.createElement('div');
  banner.id = 'cookieBanner';
  banner.innerHTML = `
    <div style="
      position:fixed;bottom:0;left:0;right:0;z-index:9999;
      background:#1c1c24;color:#e8eaf0;
      padding:1rem 2rem;display:flex;align-items:center;
      justify-content:space-between;gap:1rem;flex-wrap:wrap;
      border-top:2px solid #6891f8;font-family:inherit;font-size:0.9rem;
      box-shadow:0 -4px 20px rgba(0,0,0,0.3);
    ">
      <p style="margin:0;flex:1;min-width:200px;">
        이 사이트는 서비스 개선 및 맞춤형 광고 제공을 위해 쿠키를 사용합니다.
        <a href="/privacy.html" style="color:#6891f8;text-decoration:underline;">개인정보처리방침</a>
      </p>
      <div style="display:flex;gap:0.5rem;flex-shrink:0;">
        <button id="cookieAccept" style="
          background:#6891f8;color:#fff;border:none;
          padding:0.5rem 1.25rem;border-radius:0.4rem;
          cursor:pointer;font-weight:700;font-size:0.875rem;font-family:inherit;
        ">동의</button>
        <button id="cookieDecline" style="
          background:transparent;color:#9ca3af;border:1px solid #4b5563;
          padding:0.5rem 1.25rem;border-radius:0.4rem;
          cursor:pointer;font-size:0.875rem;font-family:inherit;
        ">거부</button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);

  document.getElementById('cookieAccept').addEventListener('click', () => {
    localStorage.setItem('cookie_consent', 'accepted');
    banner.remove();
  });
  document.getElementById('cookieDecline').addEventListener('click', () => {
    localStorage.setItem('cookie_consent', 'declined');
    banner.remove();
  });
})();

// ── Theme Toggle ──
const toggle = document.getElementById('themeToggle');
const html = document.documentElement;
const saved = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', saved);
if (toggle) toggle.textContent = saved === 'dark' ? '☀️' : '🌙';

toggle?.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  toggle.textContent = next === 'dark' ? '☀️' : '🌙';
});

// ── Home: Category Filter ──
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const selected = btn.textContent.trim();
    document.querySelectorAll('.posts-grid .post-card').forEach(card => {
      const cat = card.dataset.category || '';
      card.style.display = selected === '전체' || cat === selected ? '' : 'none';
    });
  });
});

// ── Tags: Tag Filter ──
const tagBtns = document.querySelectorAll('.tag-cloud-btn');
const tagPosts = document.querySelectorAll('#tagPosts .post-card');

tagBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tagBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const selected = btn.dataset.tag;
    tagPosts.forEach(card => {
      const tags = card.dataset.tags || '';
      const visible = selected === 'all' || tags.includes(selected);
      card.style.display = visible ? '' : 'none';
    });
  });
});

// ── Login: Tab Switch ──
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

loginTab?.addEventListener('click', () => {
  loginTab.classList.add('active');
  signupTab.classList.remove('active');
  loginForm.classList.remove('hidden');
  signupForm.classList.add('hidden');
});

signupTab?.addEventListener('click', () => {
  signupTab.classList.add('active');
  loginTab.classList.remove('active');
  signupForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
});

// ── Login: Password Toggle ──
document.querySelectorAll('.pw-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    if (!input) return;
    input.type = input.type === 'password' ? 'text' : 'password';
    btn.textContent = input.type === 'password' ? '👁' : '🙈';
  });
});

// ── Signup: Password Strength ──
const signupPw = document.getElementById('signupPw');
const pwStrength = document.getElementById('pwStrength');

signupPw?.addEventListener('input', () => {
  const val = signupPw.value;
  let score = 0;
  if (val.length >= 8) score++;
  if (/[A-Z]/.test(val)) score++;
  if (/[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;

  const levels = [
    { width: '0%',   color: '#e3e6ea' },
    { width: '25%',  color: '#EA5B5B' },
    { width: '50%',  color: '#f59e0b' },
    { width: '75%',  color: '#6891f8' },
    { width: '100%', color: '#2ED573' },
  ];
  const level = levels[score];
  pwStrength.style.setProperty('--strength', level.width);
  pwStrength.style.setProperty('--strength-color', level.color);
});

// ── Comments Module ──
const Comments = {
  KEY: 'mailissue_comments',
  getAll() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; }
    catch { return []; }
  },
  getBySlug(slug) {
    return this.getAll().filter(c => c.slug === slug);
  },
  add(slug, content, author) {
    const all = this.getAll();
    const c = {
      id: Date.now().toString(),
      slug,
      authorName: author.name,
      authorEmail: author.email,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };
    all.push(c);
    localStorage.setItem(this.KEY, JSON.stringify(all));
    return c;
  },
  delete(id, email) {
    const filtered = this.getAll().filter(c => !(c.id === id && c.authorEmail === email));
    localStorage.setItem(this.KEY, JSON.stringify(filtered));
  },
  formatDate(iso) {
    const d = new Date(iso);
    return `${d.getFullYear()}. ${String(d.getMonth()+1).padStart(2,'0')}. ${String(d.getDate()).padStart(2,'0')}`;
  },
};

// ── Auth Helpers ──
const Auth = {
  USERS_KEY: 'mailissue_users',
  SESSION_KEY: 'mailissue_session',

  getUsers() {
    try { return JSON.parse(localStorage.getItem(this.USERS_KEY)) || []; }
    catch { return []; }
  },
  saveUsers(users) {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  },
  getSession() {
    try { return JSON.parse(sessionStorage.getItem(this.SESSION_KEY)); }
    catch { return null; }
  },
  setSession(user) {
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));
  },
  clearSession() {
    sessionStorage.removeItem(this.SESSION_KEY);
  },
  // 단방향 해시 (간단 demo — 실서비스엔 bcrypt 등 사용)
  hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = Math.imul(31, h) + str.charCodeAt(i) | 0;
    return h.toString(16);
  },
};

// ── Header: 로그인 상태 반영 ──
function updateHeaderAuth() {
  const session = Auth.getSession();
  const loginBtn = document.querySelector('.btn-login');
  if (!loginBtn) return;

  if (session) {
    const chip = document.createElement('div');
    chip.className = 'user-chip';
    chip.innerHTML = `
      <a href="/mypage.html" class="user-chip-avatar" title="내 정보">${session.name.charAt(0)}</a>
      <a href="/mypage.html" class="user-chip-name">${session.name}</a>
      <button class="btn-logout" id="logoutBtn">로그아웃</button>
    `;
    loginBtn.replaceWith(chip);
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
      Auth.clearSession();
      location.href = '/index.html';
    });
  }
}
updateHeaderAuth();

// ── 폼 알림 헬퍼 ──
function showFormMsg(el, msg, isError = false) {
  if (!el) return;
  el.textContent = msg;
  el.style.cssText = `display:block;margin-top:0.75rem;padding:0.65rem 1rem;border-radius:0.4rem;
    font-size:0.875rem;font-weight:600;
    background:${isError ? '#fef2f2' : '#f0fdf4'};
    color:${isError ? '#dc2626' : '#16a34a'};
    border:1px solid ${isError ? '#fecaca' : '#bbf7d0'};`;
}

// ── Login Form Submit ──
loginForm?.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('loginEmail')?.value.trim();
  const pw    = document.getElementById('loginPw')?.value;
  const msg   = document.getElementById('loginMsg');

  const users = Auth.getUsers();
  const user  = users.find(u => u.email === email && u.password === Auth.hash(pw));

  if (!user) {
    showFormMsg(msg, '이메일 또는 비밀번호가 올바르지 않습니다.', true);
    return;
  }

  Auth.setSession(user);
  showFormMsg(msg, `${user.name}님, 환영합니다! 잠시 후 이동합니다.`);
  setTimeout(() => location.href = '/index.html', 1200);
});

// ── Signup Form Submit ──
signupForm?.addEventListener('submit', e => {
  e.preventDefault();
  const name    = document.getElementById('signupName')?.value.trim();
  const email   = document.getElementById('signupEmail')?.value.trim();
  const pw      = document.getElementById('signupPw')?.value;
  const confirm = document.getElementById('signupPwConfirm')?.value;
  const msg     = document.getElementById('signupMsg');

  if (pw !== confirm) {
    showFormMsg(msg, '비밀번호가 일치하지 않습니다.', true);
    return;
  }
  if (pw.length < 8) {
    showFormMsg(msg, '비밀번호는 8자 이상이어야 합니다.', true);
    return;
  }

  const users = Auth.getUsers();
  if (users.find(u => u.email === email)) {
    showFormMsg(msg, '이미 사용 중인 이메일입니다.', true);
    return;
  }

  const newUser = { name, email, password: Auth.hash(pw), createdAt: new Date().toISOString() };
  users.push(newUser);
  Auth.saveUsers(users);
  Auth.setSession(newUser);

  showFormMsg(msg, `${name}님, 가입을 환영합니다! 잠시 후 이동합니다.`);
  setTimeout(() => location.href = '/index.html', 1200);
});

// ── Post: 브레드크럼 자동 주입 ──
(function injectBreadcrumb() {
  const wrapper = document.querySelector('.post-wrapper');
  if (!wrapper) return;

  const firstTag = document.querySelector('.post-header .tag')?.textContent?.trim() || '';
  const title    = document.querySelector('.post-h1')?.textContent?.trim() || '';
  if (!title) return;

  // 태그 → 카테고리명 매핑
  const catLabel = (['생활꿀팁','건강','재테크','절약','요리'].includes(firstTag))
    ? '생활꿀팁'
    : (['뉴스요약','경제','사회'].includes(firstTag))
    ? '뉴스요약'
    : 'IT테크';

  const shortTitle = title.length > 45 ? title.slice(0, 45) + '…' : title;

  // 시각적 브레드크럼
  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', '브레드크럼');
  nav.className = 'breadcrumb-nav';
  nav.innerHTML = `
    <ol class="breadcrumb">
      <li><a href="/index.html">홈</a></li>
      <li><a href="/category.html">${catLabel}</a></li>
      <li><span>${shortTitle}</span></li>
    </ol>`;

  const backLink = wrapper.querySelector('.post-back');
  if (backLink) backLink.after(nav);
  else wrapper.prepend(nav);

  // BreadcrumbList JSON-LD 스키마 동적 주입
  const pageUrl = 'https://mailissue.co.kr' + location.pathname;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: '홈', item: 'https://mailissue.co.kr/' },
      { '@type': 'ListItem', position: 2, name: catLabel, item: 'https://mailissue.co.kr/category.html' },
      { '@type': 'ListItem', position: 3, name: title, item: pageUrl },
    ],
  };
  const s = document.createElement('script');
  s.type = 'application/ld+json';
  s.textContent = JSON.stringify(schema);
  document.head.appendChild(s);
})();

// ── Post: 저자(Author) 박스 자동 주입 ──
(function injectAuthorBox() {
  const article = document.querySelector('.post-article');
  if (!article) return;

  const dateEl = document.querySelector('.post-meta span');
  const dateText = dateEl ? dateEl.textContent.replace('📅', '').trim() : '';

  const box = document.createElement('div');
  box.className = 'author-box';
  box.setAttribute('itemscope', '');
  box.setAttribute('itemtype', 'https://schema.org/Person');
  box.innerHTML = `
    <div class="author-avatar" aria-hidden="true">매</div>
    <div class="author-info">
      <div class="author-label">작성자</div>
      <div class="author-name" itemprop="name">매일이슈 편집팀</div>
      <p class="author-desc">생활 꿀팁, IT 테크 트렌드, 자격증 정보 등 실용적인 정보를 핵심만 골라 전달합니다. 어렵고 복잡한 내용도 누구나 쉽게 이해할 수 있도록 정리하는 것이 목표입니다.</p>
      <div class="author-meta">
        <a href="/about.html" itemprop="url">운영자 소개</a>
        ${dateText ? `<span class="sep">·</span><span>발행일 ${dateText}</span>` : ''}
        <span class="sep">·</span>
        <a href="mailto:contact@mailissue.co.kr">contact@mailissue.co.kr</a>
      </div>
    </div>`;

  const content = article.querySelector('.post-content');
  if (content) content.after(box);
  else article.appendChild(box);
})();

// ── Post: Comments 자동 주입 ──
(function injectComments() {
  const article = document.querySelector('.post-article');
  if (!article) return;

  // URL에서 slug 추출 (/posts/foo.html → foo)
  const slug = location.pathname.split('/').pop().replace('.html', '');
  const session = Auth.getSession();

  function buildCommentHTML(c) {
    const canDelete = session && session.email === c.authorEmail;
    return `
      <div class="comment-item" data-id="${c.id}">
        <div class="comment-avatar">${c.authorName.charAt(0)}</div>
        <div class="comment-body">
          <div class="comment-meta">
            <span class="comment-name">${c.authorName}</span>
            <span class="comment-date">${Comments.formatDate(c.createdAt)}</span>
            ${canDelete ? `<button class="btn-comment-delete" data-id="${c.id}">삭제</button>` : ''}
          </div>
          <p class="comment-text">${c.content.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p>
        </div>
      </div>`;
  }

  function renderList(container) {
    const list = container.querySelector('.comment-list');
    const items = Comments.getBySlug(slug);
    list.innerHTML = items.length
      ? items.map(buildCommentHTML).join('')
      : '<p class="comment-empty">첫 번째 댓글을 남겨보세요!</p>';

    list.querySelectorAll('.btn-comment-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        if (!confirm('댓글을 삭제할까요?')) return;
        Comments.delete(btn.dataset.id, session.email);
        renderList(container);
        updateCount(container);
      });
    });
  }

  function updateCount(container) {
    const cnt = Comments.getBySlug(slug).length;
    container.querySelector('.comments-title').textContent = `댓글 ${cnt}개`;
  }

  const section = document.createElement('section');
  section.className = 'comments-section';
  section.innerHTML = `
    <h2 class="comments-title">댓글 0개</h2>
    ${session
      ? `<div class="comment-form">
           <div class="comment-form-footer" style="margin-top:0;margin-bottom:0.6rem;">
             <span class="comment-author-label" id="commentAuthorLabel">${session.name}</span>
             <label class="anon-check-label">
               <input type="checkbox" id="anonCheck"> 익명으로 달기
             </label>
           </div>
           <textarea id="commentTextarea" placeholder="댓글을 입력하세요..." rows="3"></textarea>
           <div class="comment-form-footer">
             <span style="font-size:0.8rem;color:var(--text-muted);">Enter로 줄바꿈</span>
             <button class="btn-comment-submit" id="commentSubmit">등록</button>
           </div>
         </div>`
      : `<div class="comment-login-prompt">
           댓글을 남기려면 <a href="/login.html">로그인</a>이 필요합니다.
         </div>`
    }
    <div class="comment-list"></div>
  `;

  article.parentElement.appendChild(section);

  renderList(section);
  updateCount(section);

  // 익명 체크박스 토글
  document.getElementById('anonCheck')?.addEventListener('change', (e) => {
    document.getElementById('commentAuthorLabel').textContent = e.target.checked ? '익명' : session.name;
  });

  document.getElementById('commentSubmit')?.addEventListener('click', () => {
    const ta = document.getElementById('commentTextarea');
    if (!ta.value.trim()) { ta.focus(); return; }
    const isAnon = document.getElementById('anonCheck')?.checked;
    const author = isAnon ? { name: '익명', email: null } : session;
    Comments.add(slug, ta.value, author);
    ta.value = '';
    renderList(section);
    updateCount(section);
  });
})();

// ── TOEFL Writing Practice ──
(function () {
  if (!document.getElementById('toeflPractice')) return;

  const PROMPTS = {
    integrated: [
      {
        passage: `Remote work, defined as completing job duties outside a traditional office, has grown rapidly over the past decade. Proponents argue that it offers significant benefits for both employees and employers. Workers gain flexibility to manage their schedules, leading to improved work-life balance and reduced commuting time—often exceeding one hour per day. Studies suggest remote employees report higher job satisfaction and lower stress levels. From an employer's perspective, remote work enables access to a global talent pool, reduces overhead costs associated with office space, and has been linked to measurable productivity gains in knowledge-based industries. Several large technology firms have reported that remote teams meet or exceed performance benchmarks set in traditional office settings.`,
        question: `Summarize the points made in the reading passage and explain how they relate to the broader debate about remote work. How might critics challenge the claims presented?`,
      },
      {
        passage: `Renewable energy sources—primarily solar and wind power—have become increasingly cost-competitive with fossil fuels. The cost of solar photovoltaic panels has fallen by more than 89% over the past decade, making solar one of the cheapest sources of electricity in history. Governments worldwide have implemented subsidies and renewable portfolio standards to accelerate adoption. Environmentally, renewables produce little to no greenhouse gas emissions during operation, directly addressing concerns about climate change. Nations that invest heavily in renewable infrastructure also benefit from energy independence, reducing reliance on imported fossil fuels and insulating their economies from volatile global energy markets.`,
        question: `The reading passage presents several arguments in favor of renewable energy. Summarize those arguments and discuss what challenges or counterarguments a skeptic might raise regarding large-scale renewable energy adoption.`,
      },
      {
        passage: `Bilingual education programs—where instruction is provided in both a student's native language and a second language—have been the subject of considerable debate among educators. Supporters contend that these programs ease the transition for non-native speakers, preserve cultural identity, and ultimately produce students who are more proficient in both languages. Research from immersion programs in Canada and Europe indicates that students in well-designed bilingual programs perform at or above the level of peers educated entirely in one language. Additionally, bilingualism has been associated with cognitive benefits, including enhanced executive function and delayed onset of dementia in later life.`,
        question: `Summarize the main advantages of bilingual education described in the passage. How might opponents of such programs respond to these claims?`,
      },
    ],
    independent: [
      {
        passage: null,
        question: `Do you agree or disagree with the following statement?\n\n"Modern technology has made it easier for people to connect with one another, but it has also made human relationships less meaningful."\n\nUse specific reasons and examples to support your answer.`,
      },
      {
        passage: null,
        question: `Some people believe that universities should focus primarily on providing students with practical job skills. Others think that universities should offer a broad education that covers many academic subjects. Which approach do you think is more beneficial? Use specific reasons and examples to explain your choice.`,
      },
      {
        passage: null,
        question: `Do you agree or disagree with the following statement?\n\n"The most important quality of a successful leader is the ability to make decisions quickly, even without complete information."\n\nUse specific reasons and examples to support your answer.`,
      },
      {
        passage: null,
        question: `Some people prefer to live in a large city, while others prefer a smaller town or rural area. Which do you prefer and why? Use specific details and examples to support your answer.`,
      },
      {
        passage: null,
        question: `Do you agree or disagree with the following statement?\n\n"Children today spend too much time on digital devices and not enough time engaging with the physical world."\n\nUse specific reasons and examples to develop your essay.`,
      },
    ],
  };

  const TIPS = {
    integrated: [
      { icon: '📝', title: '핵심 논점만 추려라', desc: '지문의 주요 주장 2–3개를 파악하고, 각각에 대해 어떻게 응답할지 간략히 메모하세요.' },
      { icon: '🔗', title: '연결어로 구조화', desc: 'Furthermore, However, In contrast 같은 연결어로 지문의 주장과 나의 응답을 명확히 연결하세요.' },
      { icon: '🚫', title: '개인 의견 삽입 금지', desc: 'Integrated Task에서는 지문 내용을 요약·분석하는 것이 목표입니다. 개인 의견은 넣지 마세요.' },
      { icon: '🔢', title: '150–225 단어 유지', desc: '너무 짧으면 감점, 너무 길면 핵심이 흐려집니다. 목표 단어 수를 지키세요.' },
    ],
    independent: [
      { icon: '🎯', title: '명확한 thesis 제시', desc: '첫 단락에서 자신의 입장을 한 문장으로 명확하게 밝히세요. 채점관은 thesis를 가장 먼저 확인합니다.' },
      { icon: '📐', title: '5단락 구조 추천', desc: '도입 → 본론1 → 본론2 → (선택) 반론 인정 → 결론. 각 본론 단락은 주제문 + 구체적 예시로 구성하세요.' },
      { icon: '💡', title: '구체적 예시 사용', desc: '추상적 주장보다 개인 경험, 역사적 사례, 가상의 시나리오를 활용하면 설득력이 높아집니다.' },
      { icon: '⏱', title: '시간 배분 전략', desc: '계획 3분 → 작성 24분 → 검토 3분. 검토 시간을 반드시 남겨 문법·철자 오류를 수정하세요.' },
    ],
  };

  let currentType = 'integrated';
  let currentPromptIdx = 0;
  let totalSeconds = 20 * 60;
  let remaining = totalSeconds;
  let timerInterval = null;
  let running = false;

  const typeBtns   = document.querySelectorAll('.toefl-type-btn');
  const badge      = document.getElementById('toeflBadge');
  const passageWrap = document.getElementById('toeflPassageWrap');
  const passageEl  = document.getElementById('toeflPassage');
  const questionEl = document.getElementById('toeflQuestion');
  const newBtn     = document.getElementById('toeflNewPrompt');
  const timerText  = document.getElementById('toeflTimerText');
  const progressBar = document.getElementById('toeflProgressBar');
  const startBtn   = document.getElementById('toeflStart');
  const pauseBtn   = document.getElementById('toeflPause');
  const resetBtn   = document.getElementById('toeflReset');
  const editor     = document.getElementById('toeflEditor');
  const wordCount  = document.getElementById('toeflWordCount');
  const wordLabel  = document.getElementById('toeflWordLabel');
  const wordStatus = document.getElementById('toeflWordStatus');
  const saveBtn    = document.getElementById('toeflSave');
  const clearBtn   = document.getElementById('toeflClear');
  const saveMsg    = document.getElementById('toeflSaveMsg');
  const tipsGrid   = document.getElementById('toeflTipsGrid');

  function getDuration() { return currentType === 'integrated' ? 20 * 60 : 30 * 60; }
  function getMinWords() { return currentType === 'integrated' ? 150 : 300; }

  function formatTime(s) {
    const m = String(Math.floor(s / 60)).padStart(2, '0');
    const sec = String(s % 60).padStart(2, '0');
    return `${m}:${sec}`;
  }

  function updateTimerDisplay() {
    timerText.textContent = formatTime(remaining);
    const ratio = remaining / totalSeconds;
    progressBar.style.width = (ratio * 100) + '%';

    const urgent = remaining <= 60;
    const warning = remaining <= totalSeconds * 0.2;

    timerText.classList.toggle('danger', urgent);
    timerText.classList.toggle('warning', warning && !urgent);
    progressBar.classList.toggle('danger', urgent);
    progressBar.classList.toggle('warning', warning && !urgent);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    running = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
  }

  function loadPrompt() {
    const list = PROMPTS[currentType];
    currentPromptIdx = Math.floor(Math.random() * list.length);
    const p = list[currentPromptIdx];

    if (p.passage) {
      passageWrap.style.display = '';
      passageEl.textContent = p.passage;
    } else {
      passageWrap.style.display = 'none';
    }
    questionEl.textContent = p.question;
  }

  function loadTips() {
    tipsGrid.innerHTML = TIPS[currentType].map(t => `
      <div class="toefl-tip-card">
        <span class="toefl-tip-icon">${t.icon}</span>
        <div class="toefl-tip-title">${t.title}</div>
        <div class="toefl-tip-desc">${t.desc}</div>
      </div>
    `).join('');
  }

  function switchType(type) {
    currentType = type;
    totalSeconds = getDuration();
    remaining = totalSeconds;
    stopTimer();
    startBtn.disabled = false;

    typeBtns.forEach(b => b.classList.toggle('active', b.dataset.type === type));
    badge.textContent = type === 'integrated' ? 'Integrated Task' : 'Independent Task';
    wordLabel.textContent = `/ 최소 ${getMinWords()} words`;

    loadPrompt();
    updateTimerDisplay();
    updateWordCount();
    loadTips();
  }

  function countWords(text) {
    return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  }

  function updateWordCount() {
    const count = countWords(editor.value);
    const min   = getMinWords();
    wordCount.textContent = count;
    if (count === 0) {
      wordStatus.textContent = '';
      wordStatus.className = 'toefl-word-status';
    } else if (count >= min) {
      wordStatus.textContent = '✓ 목표 달성';
      wordStatus.className = 'toefl-word-status met';
    } else {
      wordStatus.textContent = `${min - count} 단어 더`;
      wordStatus.className = 'toefl-word-status not-met';
    }
  }

  // Events
  typeBtns.forEach(btn => {
    btn.addEventListener('click', () => switchType(btn.dataset.type));
  });

  newBtn.addEventListener('click', () => {
    if (running && !confirm('타이머가 실행 중입니다. 새 문제로 바꾸면 초기화됩니다. 계속할까요?')) return;
    stopTimer();
    remaining = getDuration();
    updateTimerDisplay();
    loadPrompt();
  });

  startBtn.addEventListener('click', () => {
    if (remaining <= 0) return;
    running = true;
    startBtn.disabled = true;
    pauseBtn.disabled = false;
    timerInterval = setInterval(() => {
      remaining--;
      updateTimerDisplay();
      if (remaining <= 0) {
        stopTimer();
        timerText.textContent = '종료!';
        timerText.classList.add('danger');
      }
    }, 1000);
  });

  pauseBtn.addEventListener('click', () => {
    stopTimer();
    startBtn.disabled = false;
  });

  resetBtn.addEventListener('click', () => {
    stopTimer();
    remaining = getDuration();
    updateTimerDisplay();
    startBtn.disabled = false;
  });

  editor.addEventListener('input', updateWordCount);

  saveBtn.addEventListener('click', () => {
    localStorage.setItem('toefl_draft_' + currentType, editor.value);
    saveMsg.textContent = '✓ 임시저장 완료 (' + new Date().toLocaleTimeString('ko-KR') + ')';
    setTimeout(() => { saveMsg.textContent = ''; }, 3000);
  });

  clearBtn.addEventListener('click', () => {
    if (editor.value && !confirm('작성 내용을 모두 지울까요?')) return;
    editor.value = '';
    updateWordCount();
  });

  // Load saved draft on init
  const saved = localStorage.getItem('toefl_draft_' + currentType);
  if (saved) editor.value = saved;

  // Init
  switchType('integrated');
})();

// ── Text-based Thumbnail & Hero Converter ──
(function () {
  const GRADIENT_MAP = {
    '생활꿀팁':    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    'IT테크':      'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    '뉴스요약':    'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    '건강':        'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    '의료':        'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
    '재테크':      'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    '경제':        'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    '취업':        'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
    '커리어':      'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
    '생산성':      'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    '스마트폰':    'linear-gradient(135deg, #64748b 0%, #334155 100%)',
    'AI':          'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
    'JavaScript':  'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    'TypeScript':  'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    'CSS':         'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    'Design':      'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    'React':       'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    'Next.js':     'linear-gradient(135deg, #111111 0%, #374151 100%)',
    'Web':         'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    'Performance': 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
    'Security':    'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    'Python':      'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    'DevOps':      'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    'Git':         'linear-gradient(135deg, #475569 0%, #334155 100%)',
    'Database':    'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    'Backend':     'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    'Architecture':'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    'API':         'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
    'Network':     'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
    'UX':          'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
    'Tools':       'linear-gradient(135deg, #64748b 0%, #475569 100%)',
  };
  const DEFAULT_GRADIENT = 'linear-gradient(135deg, #374151 0%, #1f2937 100%)';

  function getGradient(tag) {
    return GRADIENT_MAP[tag] || DEFAULT_GRADIENT;
  }

  // 인덱스 카드 썸네일 변환
  document.querySelectorAll('.post-thumb').forEach(el => {
    const card = el.closest('.post-card');
    if (!card) return;

    const isFeatured = card.classList.contains('featured');
    const hasPhoto = el.style.backgroundImage && el.style.backgroundImage !== 'none';

    if (hasPhoto) {
      if (isFeatured) {
        const badge = document.createElement('span');
        badge.className = 'featured-badge';
        badge.textContent = 'Featured';
        el.prepend(badge);
      }
      return;
    }

    const firstTag = card.querySelector('.tag')?.textContent?.trim() || '';
    const title    = card.querySelector('.post-title')?.textContent?.trim() || '';

    el.style.background = getGradient(firstTag);
    el.classList.add('post-thumb--text');
    el.innerHTML = `
      ${isFeatured ? '<span class="featured-badge">Featured</span>' : ''}
      <span class="thumb-category">${firstTag}</span>
      <p class="thumb-title-text">${title}</p>
    `;
  });

  // 개별 포스트 히어로 이미지 변환
  const hero = document.querySelector('.post-hero-img');
  if (hero) {
    const firstTag = document.querySelector('.post-header .tag')?.textContent?.trim() || '';
    const title    = document.querySelector('.post-h1')?.textContent?.trim() || '';
    const hasPhoto = hero.style.backgroundImage && hero.style.backgroundImage !== 'none';

    if (!hasPhoto) {
      hero.style.background = getGradient(firstTag);
    }
    hero.classList.add('post-hero--text');
    hero.innerHTML = `
      <div class="post-hero-text-inner">
        <span class="post-hero-label">${firstTag}</span>
        <h2 class="post-hero-display-title">${title}</h2>
      </div>
    `;
  }
})();

// ── About: Contact Form (Formspree) ──
document.querySelector('.contact-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const notice = document.getElementById('formNotice');
  const btn = form.querySelector('button[type="submit"]');

  btn.disabled = true;
  btn.textContent = '전송 중...';

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      notice.textContent = '✅ 메시지가 전송되었습니다. 감사합니다!';
      notice.style.color = '#2ED573';
      notice.style.display = 'block';
      form.reset();
    } else {
      throw new Error();
    }
  } catch {
    notice.textContent = '❌ 전송에 실패했습니다. 잠시 후 다시 시도해주세요.';
    notice.style.color = '#EA5B5B';
    notice.style.display = 'block';
  } finally {
    btn.disabled = false;
    btn.textContent = '보내기';
  }
});
