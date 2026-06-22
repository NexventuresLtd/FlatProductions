import React, { useState } from 'react';

const ADMIN_EMAIL    = 'admin@flatproduction.rw';
const ADMIN_PASSWORD = 'admin123';

/* ─── Puzzle generators ─────────────────────────────────────────── */
type MathPuzzle = { kind: 'math'; question: string; answer: number };
type SeqPuzzle  = { kind: 'seq';  terms: number[];  answer: number };
type WordPuzzle = { kind: 'word'; word: string };
type AnyPuzzle  = MathPuzzle | SeqPuzzle | WordPuzzle;

const WORDS = ['FLAT', 'PHOTO', 'STUDIO', 'VIDEO', 'SCENE', 'FRAME', 'LIGHT', 'VISUAL'];
const OPS   = ['+', '−', '×'] as const;
const rand  = (lo: number, hi: number) => Math.floor(Math.random() * (hi - lo + 1)) + lo;

function makePuzzles(): [MathPuzzle, SeqPuzzle, WordPuzzle] {
  const op = OPS[rand(0, 2)];
  let a: number, b: number, ans: number;
  if (op === '+')       { a = rand(5, 20); b = rand(5, 20); ans = a + b; }
  else if (op === '−')  { a = rand(12, 28); b = rand(2, 9); ans = a - b; }
  else                  { a = rand(2, 9);  b = rand(2, 9);  ans = a * b; }

  const start = rand(1, 8), step = rand(2, 7);
  const terms  = [start, start + step, start + 2 * step];
  const seqAns = start + 3 * step;

  const word = WORDS[rand(0, WORDS.length - 1)];

  return [
    { kind: 'math', question: `${a} ${op} ${b}`, answer: ans },
    { kind: 'seq',  terms,  answer: seqAns },
    { kind: 'word', word },
  ];
}

/* ─── Static info per puzzle type ───────────────────────────────── */
const PUZZLE_META = [
  {
    label: 'Arithmetic',
    desc:  'Solve a simple math equation',
    accent: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe',
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        <line x1="5" y1="6" x2="10" y2="6"/>
      </svg>
    ),
  },
  {
    label: 'Number Sequence',
    desc:  'Find the next number in the pattern',
    accent: '#9333ea', bg: '#faf5ff', border: '#d8b4fe',
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    label: 'Word Copy',
    desc:  'Type the word shown in the display box',
    accent: '#ea580c', bg: '#fff7ed', border: '#fed7aa',
    Icon: () => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M8 12h.01M12 12h.01M16 12h.01"/>
      </svg>
    ),
  },
] as const;

/* ─── Component ─────────────────────────────────────────────────── */
const AdminLogin: React.FC = () => {
  const [step, setStep] = useState<'verify' | 'login'>('verify');

  /* puzzles generated once */
  const [puzzles] = useState(makePuzzles);

  /* which puzzle the user picked (null = not yet chosen) */
  const [selected, setSelected] = useState<0 | 1 | 2 | null>(null);
  const [answer,   setAnswer]   = useState('');
  const [dirty,    setDirty]    = useState(false);

  /* login fields */
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loginErr, setLoginErr] = useState('');
  const [loading,  setLoading]  = useState(false);

  /* ── answer checking ── */
  const checkCorrect = (idx: number | null, ans: string): boolean => {
    if (idx === null || !ans.trim()) return false;
    if (idx === 0) return parseInt(ans, 10) === (puzzles[0] as MathPuzzle).answer;
    if (idx === 1) return parseInt(ans, 10) === (puzzles[1] as SeqPuzzle).answer;
    return ans.trim().toUpperCase() === (puzzles[2] as WordPuzzle).word;
  };

  const solved = checkCorrect(selected, answer);
  const wrong  = dirty && answer.trim() !== '' && !solved;

  const pick = (i: 0 | 1 | 2) => {
    setSelected(i);
    setAnswer('');
    setDirty(false);
  };

  /* ── login submit ── */
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setLoginErr('');
    setTimeout(() => {
      const safe = email.trim().toLowerCase();
      if (safe === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        sessionStorage.setItem('flat_admin_auth', '1');
        sessionStorage.setItem('flat_admin_email', safe);
        window.location.pathname = '/admin';
        return;
      }
      setLoginErr('Invalid email or password. Please try again.');
      setLoading(false);
    }, 800);
  };

  /* ── input classes ── */
  const inputCls = `w-full rounded-xl border px-4 py-3.5 text-sm font-semibold outline-none transition-all font-[inherit] ${
    solved ? 'border-[#86efac] bg-[#f0fdf4] text-[#15803d]' :
    wrong  ? 'border-[#fca5a5] bg-[#fef2f2] text-[#dc2626]' :
             'border-[#d0d5dd] bg-white text-[#111] focus:border-[#111] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.08)]'
  }`;

  /* ── render puzzle input based on type ── */
  const renderPuzzleInput = (idx: 0 | 1 | 2) => {
    const p = puzzles[idx] as AnyPuzzle;

    if (idx === 0) {
      const math = p as MathPuzzle;
      return (
        <div className="flex items-center gap-3 mt-4">
          <div className="flex-1 bg-[#f8f9fb] border border-[#e0e3e8] rounded-xl px-5 py-3 text-center">
            <span className="text-[#111] font-bold text-lg font-mono tracking-wide">{math.question} = ?</span>
          </div>
          <input
            type="number" value={answer} placeholder="?"
            aria-label="Arithmetic answer"
            onChange={e => { setAnswer(e.target.value); setDirty(true); }}
            className={`w-20 text-center ${inputCls} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          />
        </div>
      );
    }

    if (idx === 1) {
      const seq = p as SeqPuzzle;
      return (
        <div className="flex items-center gap-2 mt-4">
          {seq.terms.map((n, i) => (
            <React.Fragment key={i}>
              <div className="flex-1 bg-[#f8f9fb] border border-[#e0e3e8] rounded-xl py-3 text-center font-bold text-[#111] font-mono text-base">{n}</div>
              <span className="text-[#bbb] font-bold">,</span>
            </React.Fragment>
          ))}
          <input
            type="number" value={answer} placeholder="?"
            aria-label="Sequence answer"
            onChange={e => { setAnswer(e.target.value); setDirty(true); }}
            className={`flex-1 text-center ${inputCls} [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          />
        </div>
      );
    }

    /* word */
    const word = (p as WordPuzzle).word;
    return (
      <div className="mt-4">
        <div className="rounded-xl overflow-hidden border border-[#e0e3e8] mb-3 select-none">
          <div className="bg-[linear-gradient(135deg,#f0f4ff,#fff4f0,#f0fff4)] py-4 px-6 text-center relative">
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" aria-hidden="true">
              {[0,1,2,3].map(i => (
                <line key={i} x1={`${rand(0,30)}%`} y1={`${rand(0,100)}%`} x2={`${rand(70,100)}%`} y2={`${rand(0,100)}%`} stroke="#555" strokeWidth="1"/>
              ))}
            </svg>
            <span className="relative font-mono font-black text-[2rem] tracking-[0.35em] text-[#1a1a2e]"
              style={{ textShadow: '1px 1px 0 rgba(0,0,0,0.12)' }}>
              {word}
            </span>
          </div>
        </div>
        <input
          type="text" value={answer} placeholder="Type the word above…" maxLength={10}
          aria-label="Word copy answer"
          onChange={e => { setAnswer(e.target.value); setDirty(true); }}
          className={inputCls}
        />
        <p className="mt-1.5 text-[#aaa] text-[0.68rem]">Case-insensitive</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">

      {/* ── Left branding panel ── */}
      <aside className="hidden lg:flex flex-col justify-between w-[44%] bg-[#f5f6f8] border-r border-[#e8eaed] p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle,#111 1px,transparent 1px)', backgroundSize: '22px 22px' }} />

        <div className="relative flex items-center gap-3">
          <img src="/flat production.jpg.jpeg" alt="Flat Productions"
            className="w-10 h-10 rounded-xl object-cover shadow-md" />
          <span className="text-[#111] font-bold text-sm tracking-wide">Flat Productions</span>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-2.5 max-w-[340px] mb-10">
            <img src="/photo3.jpg"    alt="" className="rounded-2xl h-[170px] object-cover shadow-md ring-1 ring-black/5" />
            <img src="/live1.jpeg"   alt="" className="rounded-2xl h-[170px] object-cover shadow-md ring-1 ring-black/5 mt-10" />
            <img src="/photo10.jpg"  alt="" className="rounded-2xl h-[160px] object-cover shadow-md ring-1 ring-black/5 -mt-3" />
            <img src="/graphy33.jpg" alt="" className="rounded-2xl h-[160px] object-cover shadow-md ring-1 ring-black/5 mt-5" />
          </div>
          <h2 className="text-[#111] font-bold text-[1.55rem] leading-[1.2] tracking-tight mb-3">
            Manage your creative<br />vision from one place.
          </h2>
          <p className="text-[#666] text-sm leading-relaxed max-w-[300px]">
            Edit content, manage media, and control every section of your website — saved instantly.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {['Hero', 'Services', 'Portfolio', 'Gallery', 'Team', 'Clients'].map(f => (
              <span key={f} className="bg-white border border-[#e0e3e8] text-[#555] text-[0.7rem] font-semibold px-3 py-1.5 rounded-full shadow-sm">{f}</span>
            ))}
          </div>
        </div>

        <p className="relative text-[#bbb] text-xs">© {new Date().getFullYear()} Flat Productions · Kigali, Rwanda</p>
      </aside>

      {/* ── Right panel ── */}
      <div className="flex-1 flex items-start justify-center p-6 py-12 overflow-y-auto bg-white">
        <div className="w-full max-w-[430px]">

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-10">
            <img src="/flat production.jpg.jpeg" alt="Logo" className="w-9 h-9 rounded-xl object-cover shadow" />
            <span className="text-[#111] font-bold text-sm">Flat Productions</span>
          </div>

          {/* ═══════════════════════════════════
              STEP 1 — Choose & solve one puzzle
          ═══════════════════════════════════ */}
          {step === 'verify' && (
            <div>
              <div className="mb-8">
                <div className="inline-flex items-center gap-2 bg-[#f5f6f8] border border-[#e0e3e8] rounded-full px-3.5 py-1.5 mb-4">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.3">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  <span className="text-[#111] text-[0.7rem] font-bold uppercase tracking-[0.12em]">Human Verification</span>
                </div>
                <h1 className="text-[#111] font-bold text-[1.9rem] tracking-tight mb-1.5">Verify you're human</h1>
                <p className="text-[#777] text-sm">
                  Choose <strong className="text-[#111]">one</strong> verification method below and solve it to continue.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {PUZZLE_META.map((meta, i) => {
                  const idx = i as 0 | 1 | 2;
                  const isSelected = selected === idx;
                  const { Icon } = meta;

                  return (
                    <div
                      key={i}
                      onClick={() => !isSelected && pick(idx)}
                      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                        isSelected
                          ? 'border-[#111] shadow-[0_0_0_3px_rgba(17,17,17,0.08)]'
                          : 'border-[#e0e3e8] hover:border-[#bbb] hover:shadow-sm cursor-pointer'
                      }`}
                    >
                      {/* Card header — always visible */}
                      <div
                        className={`flex items-center gap-4 px-5 py-4 ${isSelected ? 'bg-[#f8f9fb]' : 'bg-white'}`}
                      >
                        {/* Icon bubble */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                          style={{ background: isSelected ? meta.bg : '#f5f6f8', color: isSelected ? meta.accent : '#888', border: `1px solid ${isSelected ? meta.border : '#e8eaed'}` }}
                        >
                          <Icon />
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-[#111] font-bold text-sm">{meta.label}</p>
                          <p className="text-[#888] text-[0.75rem]">{meta.desc}</p>
                        </div>

                        {/* Status */}
                        {isSelected && solved && (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        )}
                        {!isSelected && (
                          <span className="text-[#ccc] text-[0.72rem] font-semibold border border-[#e8eaed] rounded-full px-2.5 py-1 flex-shrink-0">
                            Choose
                          </span>
                        )}
                        {isSelected && !solved && (
                          <div className="w-2 h-2 rounded-full bg-[#f59e0b] flex-shrink-0" />
                        )}
                      </div>

                      {/* Puzzle input — only for selected */}
                      {isSelected && (
                        <div className="px-5 pb-5 border-t border-[#e8eaed] bg-white">
                          {renderPuzzleInput(idx)}
                          {solved && (
                            <p className="mt-2.5 text-[#16a34a] text-[0.75rem] font-semibold flex items-center gap-1.5">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                              Correct! You can continue.
                            </p>
                          )}
                          {wrong && (
                            <p className="mt-2.5 text-[#dc2626] text-[0.75rem] font-semibold flex items-center gap-1.5">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M18 6 6 18M6 6l12 12"/>
                              </svg>
                              Incorrect — try again.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Continue button */}
              <button
                onClick={() => solved && setStep('login')}
                disabled={!solved}
                className={`mt-6 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all border-0 font-[inherit] ${
                  solved
                    ? 'bg-[#111] text-white cursor-pointer hover:bg-[#222] hover:-translate-y-px shadow-[0_4px_14px_rgba(17,17,17,0.16)] hover:shadow-[0_6px_20px_rgba(17,17,17,0.22)]'
                    : 'bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed'
                }`}
              >
                {selected === null
                  ? 'Select a verification method above'
                  : solved
                    ? 'Continue to Login →'
                    : 'Solve the puzzle to continue'}
              </button>
            </div>
          )}

          {/* ═══════════════════════════════════
              STEP 2 — Login form
          ═══════════════════════════════════ */}
          {step === 'login' && (
            <div>
              <button
                onClick={() => { setStep('verify'); setLoginErr(''); }}
                className="flex items-center gap-1.5 text-[#888] text-xs font-semibold hover:text-[#111] transition-colors mb-8 border-0 bg-transparent cursor-pointer font-[inherit]"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
                Back to verification
              </button>

              <div className="flex items-center gap-2 bg-[#f0fdf4] border border-[#86efac] rounded-xl px-4 py-2.5 mb-7 w-fit">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span className="text-[#15803d] text-[0.75rem] font-bold">
                  Verified via {PUZZLE_META[selected!].label}
                </span>
              </div>

              <h1 className="text-[#111] font-bold text-[2rem] tracking-tight mb-1">Welcome back</h1>
              <p className="text-[#777] text-sm mb-8">Sign in to access the admin dashboard.</p>

              <form onSubmit={submit} className="flex flex-col gap-5">
                <div>
                  <label htmlFor="adm-email" className="block text-[#333] text-[0.72rem] font-bold uppercase tracking-[0.12em] mb-2">Email</label>
                  <input
                    id="adm-email" type="email" value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@flatproduction.rw"
                    required autoComplete="email" disabled={loading}
                    className="w-full bg-white border border-[#d0d5dd] text-[#111] rounded-xl px-4 py-3.5 text-sm outline-none transition-all placeholder:text-[#bbb] focus:border-[#111] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.08)] font-[inherit] disabled:opacity-50 shadow-sm"
                  />
                </div>

                <div>
                  <label htmlFor="adm-pass" className="block text-[#333] text-[0.72rem] font-bold uppercase tracking-[0.12em] mb-2">Password</label>
                  <input
                    id="adm-pass" type="password" value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required autoComplete="current-password" disabled={loading}
                    className="w-full bg-white border border-[#d0d5dd] text-[#111] rounded-xl px-4 py-3.5 text-sm outline-none transition-all placeholder:text-[#bbb] focus:border-[#111] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.08)] font-[inherit] disabled:opacity-50 shadow-sm"
                  />
                </div>

                {loginErr && (
                  <div className="rounded-xl py-3 px-4 bg-[#fef2f2] border border-[#fca5a5] text-[#dc2626] text-sm font-medium flex items-center gap-2">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>
                    </svg>
                    {loginErr}
                  </div>
                )}

                <button
                  type="submit" disabled={loading}
                  className="mt-1 flex items-center justify-center gap-2.5 bg-[#111] hover:bg-[#222] text-white font-bold py-3.5 rounded-xl text-sm transition-all border-0 cursor-pointer font-[inherit] shadow-[0_4px_14px_rgba(17,17,17,0.18)] hover:shadow-[0_6px_20px_rgba(17,17,17,0.24)] hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none"
                >
                  {loading
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</>
                    : 'Sign in to Dashboard →'}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-[#f0f2f5] flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#22c55e] flex-shrink-0" />
                <p className="text-[#ccc] text-xs">Session secured · localStorage content sync</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
