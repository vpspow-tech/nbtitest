'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import RadarChart from './components/RadarChart';
import { toPng } from 'html-to-image';
import {
  questions,
  specialQuestions,
  dimensionMeta,
  dimensionOrder,
  TYPE_LIBRARY,
  NORMAL_TYPES,
  DIM_EXPLANATIONS,
  DRUNK_TRIGGER_QUESTION_ID,
  calculateDimensionScore,
} from './data';

const rarityColors: Record<string, string> = {
  SSR: '#FFD700',
  SR: '#9370DB',
  R: '#4169E1',
  N: '#808080',
};

function getRarityText(rarity: string, similarity?: number): string {
  const rarityMap: Record<string, string> = {
    SSR: '传说级！你解锁了前1%的稀有职场人格！',
    SR: '史诗级！你解锁了前5%的稀有职场人格！',
    R: '稀有级！你解锁了前20%的职场人格！',
    N: '常见级！这种职场人格随处可见~',
  };
  return rarityMap[rarity] || '';
}

const TYPE_IMAGE_MAP: Record<string, string> = {
  LATE: '/types/LATE.png',
  'Mr.Know': '/types/mr.know.png',
  MAX: '/types/MAX.png',
  NIT: '/types/NIT.png',
  FLIP: '/types/FLIP.png',
  ALL: '/types/ALL.png',
  FOMO: '/types/FOMO.png',
  MASK: '/types/mask.png',
  CALM: '/types/calm.png',
  WHY: '/types/why.png',
  EASY: '/types/easy.png',
  EYES: '/types/eyes.png',
  GHOST: '/types/ghost.png',
  SHOW: '/types/show.png',
  WEAVE: '/types/weave.png',
  OLD: '/types/old.png',
  SPIN: '/types/spin.png',
  ZEN: '/types/zen.png',
  TREND: '/types/trend.png',
  PANIC: '/types/panic.png',
  JILL: '/types/JILL.png',
  DRIFT: '/types/DRIFT.jpeg',
  POOR: '/types/POOR.png',
  PRO: '/types/PRO.jpeg',
};



type Screen = 'intro' | 'test' | 'result';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function sumToLevel(score: number, count: number): string {
  const avg = score / count;
  if (avg <= 1.5) return 'L';
  if (avg <= 2.5) return 'M';
  return 'H';
}

function levelNum(level: string): number {
  return { L: 1, M: 2, H: 3 }[level] ?? 2;
}

function parsePattern(pattern: string): number[] {
  return pattern.replace(/-/g, '').split('').map(levelNum);
}

function getVisibleQuestions(shuffled: typeof questions, answers: Record<string, number>) {
  const visible = [...shuffled];
  const gateIndex = visible.findIndex(q => q.id === 'drink_gate_q1');
  if (gateIndex !== -1 && answers['drink_gate_q1'] === 3) {
    visible.splice(gateIndex + 1, 0, specialQuestions[1]);
  }
  return visible;
}

export default function ZXTIPage() {
  const [screen, setScreen] = useState<Screen>('intro');
  const questionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [skippedId, setSkippedId] = useState<string | null>(null);
  const [shuffledQuestions, setShuffledQuestions] = useState<typeof questions>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<ReturnType<typeof computeResult> | null>(null);
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [generatingShare, setGeneratingShare] = useState(false);

  useEffect(() => {
    if (screen === 'result') {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [screen]);

  function startTest() {
    const shuffled = shuffle(questions);
    const insertIndex = Math.floor(Math.random() * shuffled.length) + 1;
    const final = [
      ...shuffled.slice(0, insertIndex),
      specialQuestions[0],
      ...shuffled.slice(insertIndex),
    ];
    setShuffledQuestions(final);
    setAnswers({});
    setScreen('test');
  }

  function computeResult() {
    const rawScores: Record<string, number> = {};
    Object.keys(dimensionMeta).forEach(dim => { 
      rawScores[dim] = calculateDimensionScore(dim, answers); 
    });

    const levels: Record<string, string> = {};
    Object.entries(rawScores).forEach(([dim, score]) => {
      const dimCount = questions.filter(q => q.dim === dim).length;
      levels[dim] = sumToLevel(score, dimCount);
    });

    const userVector = dimensionOrder.map(dim => levelNum(levels[dim]));

    const ranked = NORMAL_TYPES.map(type => {
      const vector = parsePattern(type.pattern);
      let distance = 0;
      let exact = 0;
      for (let i = 0; i < vector.length; i++) {
        const diff = Math.abs(userVector[i] - vector[i]);
        distance += diff;
        if (diff === 0) exact += 1;
      }
      const similarity = Math.max(0, Math.round((1 - distance / 30) * 100));
      return { ...type, ...TYPE_LIBRARY[type.code], distance, exact, similarity };
    }).sort((a, b) => {
      if (a.distance !== b.distance) return a.distance - b.distance;
      return b.exact - a.exact;
    });

    const bestNormal = ranked[0];
    const drunkTriggered = answers[DRUNK_TRIGGER_QUESTION_ID] === 2;

    let finalType: (typeof TYPE_LIBRARY)[string] & { distance?: number; exact?: number; similarity?: number; image?: string };
    let modeKicker = '你的主类型';
    let badge = `匹配度 ${bestNormal.similarity}% · 精准命中 ${bestNormal.exact}/15 维`;
    let sub = '维度命中度较高，当前结果可视为你的第一人格画像。';
    let special = false;

    if (drunkTriggered) {
      finalType = { ...TYPE_LIBRARY.DRIFT, distance: 0, exact: 15, similarity: 100, image: TYPE_IMAGE_MAP.DRIFT };
      modeKicker = '职业变动期检测';
      badge = '匹配度 100% · 职业不稳定因子激活';
      sub = '系统检测到你正处于职业变动期。以上结果反映的是你当前状态，建议稳定后再测一次。职场流浪汉不是终点，只是中转站。';
      special = true;
    } else if (bestNormal.similarity < 60) {
      finalType = { ...bestNormal, image: TYPE_IMAGE_MAP[bestNormal.code] };
      modeKicker = '系统强制兜底';
      badge = `标准人格库最高匹配仅 ${bestNormal.similarity}%`;
      sub = '标准人格库对你的脑回路集体罢工了，于是系统把你强制分配给了 HHHH。';
      special = true;
    } else {
      finalType = { ...bestNormal, image: TYPE_IMAGE_MAP[bestNormal.code] };
    }

    return { rawScores, levels, ranked, bestNormal, finalType, modeKicker, badge, sub, special };
  }

  async function generateShareImage() {
    if (!shareCardRef.current) return;
    setGeneratingShare(true);
    try {
      const dataUrl = await toPng(shareCardRef.current, {
        quality: 1,
        pixelRatio: 2,
        cacheBust: true,
      });
      
      // 显示预览弹窗，让用户长按保存
      const previewDiv = document.createElement('div');
      previewDiv.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.85);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 20px;
      `;
      
      const img = document.createElement('img');
      img.src = dataUrl;
      img.style.cssText = `
        max-width: 90%;
        max-height: 70vh;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      `;
      
      const hint = document.createElement('div');
      hint.textContent = '长按图片保存到相册';
      hint.style.cssText = `
        color: #fff;
        margin-top: 20px;
        font-size: 16px;
        font-weight: 600;
      `;
      
      const closeBtn = document.createElement('button');
      closeBtn.textContent = '关闭';
      closeBtn.style.cssText = `
        margin-top: 20px;
        padding: 12px 32px;
        background: #4d6a53;
        color: #fff;
        border: none;
        border-radius: 24px;
        font-size: 16px;
        font-weight: 700;
        cursor: pointer;
      `;
      
      previewDiv.appendChild(img);
      previewDiv.appendChild(hint);
      previewDiv.appendChild(closeBtn);
      document.body.appendChild(previewDiv);
      
      closeBtn.onclick = () => {
        document.body.removeChild(previewDiv);
      };
      previewDiv.onclick = (e) => {
        if (e.target === previewDiv) {
          document.body.removeChild(previewDiv);
        }
      };
    } finally {
      setGeneratingShare(false);
    }
  }

  function handleSubmit() {
    const missing = visibleQuestions.find(q => answers[q.id] === undefined);
    if (missing) {
      setSkippedId(missing.id);
      setTimeout(() => {
        const el = document.getElementById('q-' + missing.id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }
    setSkippedId(null);
    const res = computeResult();
    setResult(res);
    setScreen('result');
  }

  const visibleQuestions = getVisibleQuestions(shuffledQuestions, answers);
  const doneCount = visibleQuestions.filter(q => answers[q.id] !== undefined).length;
  const totalCount = visibleQuestions.length;
  const progress = totalCount ? (doneCount / totalCount) * 100 : 0;
  const canSubmit = doneCount === totalCount && totalCount > 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #e8eef2 0%, #dde4ea 40%, #d4dde4 100%)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
      color: '#1e2a22',
    }}>
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '12px 12px 48px' }}>
        <style>{`
          @media (max-width: 480px) {
            .mobile-shell { padding: 8px 8px 32px !important; }
            .mobile-intro { padding: 24px 16px !important; border-radius: 20px !important; }
            .mobile-intro h1 { font-size: 36px !important; }
            .mobile-intro .subtitle { font-size: 18px !important; }
            .mobile-test { padding: 16px !important; border-radius: 18px !important; }
            .mobile-question { padding: 14px !important; border-radius: 14px !important; }
            .mobile-question-text { font-size: 15px !important; }
            .mobile-option { padding: 14px 12px !important; min-height: 44px !important; }
            .mobile-option span { font-size: 15px !important; }
            .mobile-result { padding: 16px !important; border-radius: 16px !important; }
            .mobile-type-code { font-size: 32px !important; }
            .mobile-type-name { font-size: 18px !important; }
            .mobile-dim-grid { grid-template-columns: 1fr !important; }
            .mobile-actions { padding: 0 16px 16px !important; }
            .mobile-actions > div { flex-direction: column !important; width: 100% !important; }
            .mobile-actions button { width: 100% !important; }
            .mobile-radar { display: none !important; }
            .mobile-result-top { flex-direction: column !important; gap: 12px !important; }
            .mobile-type-img { width: 180px !important; height: 180px !important; }
          }
        `}</style>

        {/* INTRO */}
        {screen === 'intro' && (
              <div className="mobile-intro" style={{
            marginTop: 0,
            background: '#fff',
            border: '1px solid rgba(255,255,255,0.8)',
            borderRadius: 28,
            boxShadow: '0 20px 60px rgba(47,73,55,0.15), 0 8px 24px rgba(47,73,55,0.1)',
            padding: '32px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            minHeight: '60vh',
            justifyContent: 'center',
          }}>
            <h1 style={{ fontSize: 'clamp(28px, 6vw, 56px)', lineHeight: 1.06, letterSpacing: '-0.04em', margin: 0, fontWeight: 900 }}>
              SBTI<span style={{ color: '#4d6a53' }}>2.0</span>
            </h1>
            <div className="subtitle" style={{ fontSize: 'clamp(16px, 4vw, 26px)', fontWeight: 700, color: '#1a2e1f', marginTop: 10 }}>
              职业人格测试NBTI来了
            </div>
            <p style={{ marginTop: 8, fontSize: 13, color: '#97b59c', fontWeight: 600 }}>分享前别忘了屏蔽你的老板</p>
            <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(77,106,83,0.06)', padding: '8px 16px', borderRadius: 999, border: '1px solid rgba(77,106,83,0.12)' }}>
              <span style={{ fontSize: 16 }}>👥</span>
              <span style={{ fontSize: 14, color: '#4d6a53', fontWeight: 700 }}>已有 12,847 人参与测试</span>
            </div>
            <div style={{ marginTop: 28, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={startTest}
                style={{
                  background: '#4d6a53',
                  color: '#fff',
                  border: 0,
                  padding: '15px 28px',
                  borderRadius: 16,
                  boxShadow: '0 14px 36px rgba(77,106,83,0.25)',
                  fontWeight: 700,
                  fontSize: 16,
                  cursor: 'pointer',
                  minHeight: 48,
                }}
              >
                开始测试
              </button>
            </div>

            <div style={{ paddingTop: 24, display: 'flex', flexDirection: 'column', gap: 4, fontSize: 14, color: '#6a786f' }}>
              <a href="https://xhslink.com/m/731un2gGvJj" target="_blank" rel="noopener noreferrer" style={{ color: '#4d6a53', textDecoration: 'underline', fontWeight: 600, cursor: 'pointer' }}>
                作者：Fone
              </a>
              <span>专为职场人设计的性格测试</span>
            </div>

          </div>
        )}

        {/* TEST */}
        {screen === 'test' && (
          <div className="mobile-test" style={{
            marginTop: 22,
            background: '#fff',
            border: '1px solid rgba(255,255,255,0.8)',
            borderRadius: 24,
            boxShadow: '0 20px 56px rgba(47,73,55,0.14), 0 8px 20px rgba(47,73,55,0.08)',
            padding: 24,
          }}>
            {/* Progress */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 240, height: 10, background: '#edf3ee', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #97b59c, #5b7a62)', borderRadius: 'inherit', transition: 'width .22s ease' }} />
              </div>
              <span style={{ color: '#6a786f', fontSize: 13, whiteSpace: 'nowrap' }}>{doneCount} / {totalCount}</span>
            </div>

            {/* Questions */}
            <div style={{ display: 'grid', gap: 16 }}>
              {visibleQuestions.map((q, index) => (
                <div
                  key={q.id}
                  id={'q-' + q.id}
                  className="mobile-question"
                  style={{
                  border: '1px solid #dbe8dd',
                  borderRadius: 18,
                  padding: 18,
                  background: 'linear-gradient(180deg, #ffffff, #fbfdfb)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <span style={{ fontSize: 12, color: '#6a786f' }}>维度已隐藏</span>
                  </div>
                  <div className="mobile-question-text" style={{ fontSize: 'clamp(14px, 4vw, 16px)', lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: 14 }}>{q.text}</div>
                  <div style={{ display: 'grid', gap: 10 }}>
                    {q.options.map((opt, i) => {
                      const code = ['A', 'B', 'C', 'D'][i] || String(i + 1);
                      const checked = answers[q.id] === opt.value;
                      return (
                        <label
                          key={i}
                          className="mobile-option"
                          onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt.value }))}
                          style={{
                            display: 'flex', alignItems: 'flex-start', gap: 12,
                            padding: '16px 14px', borderRadius: 14, border: `2px solid ${checked ? '#2e7d32' : '#dbe8dd'}`,
                            background: checked ? '#c8e6c9' : '#fff',
                            boxShadow: checked ? '0 0 0 3px rgba(46,125,50,0.12)' : 'none',
                            cursor: 'pointer',
                            transition: 'border-color .16s, background .16s',
                            minHeight: 48,
                          }}
                        >
                          <input type="radio" name={q.id} value={opt.value} checked={checked} onChange={() => {}} style={{ display: 'none' }} />
                          <span style={{ fontWeight: 800, color: '#4d6a53', minWidth: 22, fontSize: 'clamp(14px, 3.5vw, 16px)' }}>{code}</span>
                          <span style={{ fontSize: 'clamp(14px, 3.5vw, 16px)' }}>{opt.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginTop: 18, paddingTop: 6 }}>
              <span style={{ color: skippedId ? '#c62828' : '#6a786f', fontSize: 13, fontWeight: skippedId ? 700 : 400 }}>
                {skippedId ? '漏了一道题还想跑？往上滚，找到那道题，做完再来！' : canSubmit ? '都做完了。现在可以把你的电子魂魄交给结果页审判。' : '全选完才会放行。世界已经够乱了，起码把题做完整。'}
              </span>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={() => setScreen('intro')}
                  style={{
                    background: '#fff', color: '#4d6a53', padding: '16px 20px',
                    borderRadius: 14, border: '1px solid #dbe8dd', fontWeight: 700, cursor: 'pointer',
                    minHeight: 48,
                  }}
                >
                  返回首页
                </button>
                <button
                  onClick={handleSubmit}
                  style={{
                    background: '#4d6a53', color: '#fff',
                    padding: '16px 20px', borderRadius: 14, border: 0, fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 12px 30px rgba(77,106,83,0.18)',
                    minHeight: 48,
                  }}
                >
                  提交并查看结果
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RESULT */}
        {screen === 'result' && result && (
          <div style={{
            marginTop: 22,
            background: '#fff',
            border: '1px solid #dbe8dd',
            borderRadius: 22,
            boxShadow: '0 16px 40px rgba(47,73,55,0.08)',
            padding: 22,
            display: 'grid',
            gap: 18,
          }}>
            {/* Header bar - merged title and badge */}
            <div style={{
              background: '#2d4a38',
              padding: '16px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: '22px 22px 0 0',
              gap: 12,
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>你的主类型</div>
                <div style={{
                  background: '#4d6a53',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                }}>
                  {result.badge}
                </div>
              </div>
            </div>

            <div style={{ padding: '16px 0', display: 'grid', gap: 18 }}>
            {/* Top section - vertical stack for easy screenshot sharing */}
            <div className="mobile-result-top" style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
              {/* Poster - enhanced image with shadow and radius */}
              <div style={{
                border: '1px solid #dbe8dd', borderRadius: 20, padding: 16,
                background: 'radial-gradient(circle at top right, rgba(127,165,134,0.16), rgba(127,165,134,0) 40%), linear-gradient(180deg, #ffffff, #f7fbf8)',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                width: '100%', maxWidth: 340, position: 'relative', overflow: 'hidden',
              }}>
                {result.finalType.image && (
                  <img
                    src={result.finalType.image}
                    alt={result.finalType.cn}
                    className="mobile-type-img"
                    style={{ width: 240, height: 240, borderRadius: 20, objectFit: 'cover', marginBottom: 0, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
                  />
                )}
                {!result.finalType.image && (
                  <div style={{
                    width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(180deg, #97b59c, #5b7a62)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 48, fontWeight: 900, color: '#fff', letterSpacing: -2,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  }}>
                    {result.finalType.code.slice(0, 4)}
                  </div>
                )}
              </div>

              {/* Type info - improved padding and hierarchy */}
              <div style={{ width: '100%', maxWidth: 340, border: '1px solid #dbe8dd', borderRadius: 18, padding: '20px 24px', background: 'linear-gradient(180deg, #ffffff, #fbfdfb)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#999', marginBottom: 6, letterSpacing: '.08em', textTransform: 'uppercase' }}>
                  {result.modeKicker}
                </div>
                {/* Chinese name emphasized, English code smaller */}
                <div className="mobile-type-name" style={{ fontSize: 28, lineHeight: 1.2, fontWeight: 900, color: '#1a1a1a' }}>
                  {result.finalType.cn}
                </div>
                <div className="mobile-type-code" style={{ fontSize: 16, lineHeight: 1.05, letterSpacing: '0.05em', fontWeight: 600, color: '#4d6a53', marginTop: 4 }}>
                  {result.finalType.code}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  {result.finalType.rarity && (
                    <div style={{
                      background: rarityColors[result.finalType.rarity],
                      color: '#fff',
                      padding: '4px 10px',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 800,
                    }}>
                      {result.finalType.rarity}
                    </div>
                  )}
                </div>
                <div style={{ fontSize: 14, color: '#6a786f', marginTop: 8 }}>
                  {getRarityText(result.finalType.rarity, result.bestNormal?.similarity)}
                </div>
                <div style={{ marginTop: 10, width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6a786f', marginBottom: 5 }}>
                    <span>匹配度</span>
                    <span style={{ fontWeight: 700, color: '#4d6a53' }}>{result.badge}</span>
                  </div>
                  <div style={{ height: 6, background: '#edf3ee', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ width: '75%', height: '100%', background: 'linear-gradient(90deg, #4d6a53, #6b8c73)', borderRadius: 'inherit', transition: 'width .4s ease' }} />
                  </div>
                </div>
                <div style={{ marginTop: 12, color: '#6a786f', fontSize: 13, lineHeight: 1.8, textAlign: 'left', width: '100%' }}>
                  {result.sub}
                </div>
              </div>
            </div>

            {/* Analysis */}
            <div style={{ border: '1px solid #dbe8dd', borderRadius: 18, padding: 18, background: 'linear-gradient(180deg, #ffffff, #fbfdfb)' }}>
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>该人格的简单解读</h3>
              <p style={{ margin: 0, color: '#304034', fontSize: 15, lineHeight: 1.9, whiteSpace: 'pre-wrap' }}>
                {result.finalType.desc}
              </p>
            </div>

            {/* Dimensions */}
            <div style={{ border: '1px solid #dbe8dd', borderRadius: 18, padding: 18, background: 'linear-gradient(180deg, #ffffff, #fbfdfb)' }}>
              <h3 style={{ fontSize: 16, marginBottom: 16 }}>人格五维图</h3>

              {/* Radar Chart */}
              <div className="mobile-radar" style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: 280, aspectRatio: '280/240', margin: '0 auto' }}>
                  <svg width="100%" height="100%" viewBox="0 0 280 240" style={{ position: 'absolute', top: 0, left: 0 }}>
                    {[50, 75, 100].map(r => (
                      <circle key={r} cx="140" cy="120" r={r} fill="none" stroke="#dbe8dd" strokeWidth="1" />
                    ))}
                    {[0, 1, 2, 3, 4].map(i => {
                      const angle = (i * 72 - 90) * Math.PI / 180;
                      return (
                        <line
                          key={i}
                          x1="140" y1="120"
                          x2={140 + 100 * Math.cos(angle)}
                          y2={120 + 100 * Math.sin(angle)}
                          stroke="#dbe8dd" strokeWidth="1"
                        />
                      );
                    })}
                    {(() => {
                      const groups = [
                        { dims: ['S1','S2','S3'] },
                        { dims: ['E2','Ac1','Ac3'] },
                        { dims: ['So1','So3'] },
                        { dims: ['A1','A3'] },
                        { dims: ['A2','So2','E1'] },
                      ];
                      const scoreMap: Record<string, number> = { L: 1, M: 2, H: 3 };
                      const points = groups.map((g, i) => {
                        const avg = g.dims.reduce((s, d) => s + (scoreMap[result.levels[d]] || 2), 0) / g.dims.length;
                        const angle = (i * 72 - 90) * Math.PI / 180;
                        return `${140 + avg * 33 * Math.cos(angle)},${120 + avg * 33 * Math.sin(angle)}`;
                      }).join(' ');
                      return <polygon points={points} fill="rgba(77,106,83,0.25)" stroke="#4d6a53" strokeWidth="2" />;
                    })()}
                  </svg>
                  {/* Labels - adjusted for mobile */}
                  <div style={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', fontSize: 11, color: '#4d6a53', fontWeight: 700, whiteSpace: 'nowrap' }}>内卷指数</div>
                  <div style={{ position: 'absolute', top: 75, right: 8, fontSize: 11, color: '#4d6a53', fontWeight: 700, whiteSpace: 'nowrap' }}>摸鱼指数</div>
                  <div style={{ position: 'absolute', bottom: 8, right: 75, fontSize: 11, color: '#4d6a53', fontWeight: 700, whiteSpace: 'nowrap' }}>向上管理</div>
                  <div style={{ position: 'absolute', bottom: 8, left: 75, fontSize: 11, color: '#4d6a53', fontWeight: 700, whiteSpace: 'nowrap' }}>社交恐惧</div>
                  <div style={{ position: 'absolute', top: 75, left: 8, fontSize: 11, color: '#4d6a53', fontWeight: 700, whiteSpace: 'nowrap' }}>甩锅指数</div>
                </div>
              </div>

              {/* Dimension cards - unified height */}
              <div className="mobile-dim-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  {
                    group: '内卷指数', icon: '🔥', color: '#c0392b',
                    dims: ['S1','S2','S3'],
                    jokes: {
                      L: '你对自己的职场价值比较佛系，不追求超额表现，完成分内事就知足。',
                      M: '你偶尔会有冲劲，但懂得适可而止，不会为了工作牺牲全部生活。',
                      H: '你对自己要求很高，总在寻找突破点，工作是你证明自我的主战场。',
                    }
                  },
                  {
                    group: '摸鱼指数', icon: '🐟', color: '#27ae60',
                    dims: ['E2','Ac1','Ac3'],
                    jokes: {
                      L: '你工作时很投入，效率也不错，很少分心做其他事。',
                      M: '你会在忙碌中找些喘息空间，但该做的事一件没落。',
                      H: '你很擅长在规则内找到放松的方式，懂得劳逸结合的真谛。',
                    }
                  },
                  {
                    group: '社交能量', icon: '😨', color: '#8e44ad',
                    dims: ['So1','So3'],
                    jokes: {
                      L: '你更享受独处或小圈子，社交对你来说是消耗而非充电。',
                      M: '你看场合社交，该出现时出现，不需要时也不会勉强自己。',
                      H: '你从人际交往中获得能量，擅长经营关系，职场人脉是你的资源。',
                    }
                  },
                  {
                    group: '向上管理', icon: '👆', color: '#e67e22',
                    dims: ['A1','A3'],
                    jokes: {
                      L: '你更关注事情本身，不太花心思在研究老板喜好上。',
                      M: '你会注意沟通方式，但不会为了讨好而违背自己的原则。',
                      H: '你善于理解上级意图，懂得在合适时机展现自己的价值。',
                    }
                  },
                  {
                    group: '责任边界', icon: '🔄', color: '#2980b9',
                    dims: ['A2','So2','E1'],
                    jokes: {
                      L: '你倾向于承担责任，有时甚至会替别人收拾烂摊子。',
                      M: '你懂得区分自己的责任范围，该扛的扛，不该扛的也会明确。',
                      H: '你很清楚自己的边界，不会轻易被别人的问题牵连。',
                    }
                  },
                ].map(({ group, dims, icon, color, jokes }) => {
                  const scoreMap: Record<string, number> = { L: 1, M: 2, H: 3 };
                  const avg = dims.reduce((s, d) => s + (scoreMap[result.levels[d]] || 2), 0) / dims.length;
                  const pct = Math.round(avg / 3 * 100);
                  const level: 'L' | 'M' | 'H' = avg >= 2 ? 'H' : avg >= 1.5 ? 'M' : 'L';
                  const joke = jokes[level];
                  return (
                    <div key={group} style={{ border: '1px solid #dbe8dd', borderRadius: 14, padding: 14, background: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{icon} {group}</span>
                        <span style={{ color, fontWeight: 800, fontSize: 14 }}>{pct}%</span>
                      </div>
                      <div style={{ height: 8, background: '#edf3ee', borderRadius: 999, overflow: 'hidden', marginBottom: 8 }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${color}cc, ${color})`, borderRadius: 'inherit', transition: 'width .3s ease' }} />
                      </div>
                      <p style={{ margin: 0, color: '#6a786f', fontSize: 12, lineHeight: 1.7, flex: 1 }}>{joke}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            </div>

            {/* Note */}
            <div style={{ border: '1px solid #dbe8dd', borderRadius: 18, padding: 18, background: 'linear-gradient(180deg, #ffffff, #fbfdfb)' }}>
              <h3 style={{ fontSize: 16, marginBottom: 12 }}>友情提示</h3>
              <p style={{ margin: 0, color: '#6a786f', fontSize: 13, lineHeight: 1.8 }}>
                {result.special
                  ? '本测试仅供娱乐，请勿把它当成职场生存手册、摸鱼指南、或者和老板吵架的理论依据。'
                  : '本测试仅供娱乐，请勿把它当成职场晋升攻略、划水手册、或者和HR吵架的呈堂证供。你可以笑，但别太当真。'}
              </p>
            </div>

            {/* Actions - primary/secondary button hierarchy */}
            <div className="mobile-actions" style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap', padding: '0 24px 24px' }}>
              <button
                onClick={generateShareImage}
                disabled={generatingShare}
                style={{
                  background: generatingShare ? '#97b59c' : '#4d6a53', color: '#fff', padding: '14px 32px',
                  borderRadius: 14, border: 0, fontWeight: 700, cursor: generatingShare ? 'wait' : 'pointer',
                  boxShadow: '0 12px 32px rgba(77,106,83,0.3)',
                  transition: 'all .2s',
                  opacity: generatingShare ? 0.7 : 1,
                  minHeight: 52,
                  fontSize: 16,
                  flex: '1 1 200px',
                  maxWidth: 280,
                }}
                onMouseOver={e => { if (!generatingShare) { (e.target as HTMLButtonElement).style.background = '#3d5a43'; } }}
                onMouseOut={e => { if (!generatingShare) { (e.target as HTMLButtonElement).style.background = '#4d6a53'; } }}
              >
                {generatingShare ? '生成中...' : '✨ 生成分享图'}
              </button>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  onClick={startTest}
                  style={{
                    background: 'transparent', color: '#4d6a53', padding: '12px 20px',
                    borderRadius: 12, border: '1.5px solid #c5d5c8', fontWeight: 600, cursor: 'pointer',
                    transition: 'all .2s',
                    minHeight: 44,
                    fontSize: 14,
                  }}
                  onMouseOver={e => { (e.target as HTMLButtonElement).style.borderColor = '#4d6a53'; (e.target as HTMLButtonElement).style.background = 'rgba(77,106,83,0.05)'; }}
                  onMouseOut={e => { (e.target as HTMLButtonElement).style.borderColor = '#c5d5c8'; (e.target as HTMLButtonElement).style.background = 'transparent'; }}
                >
                  重新测试
                </button>
                <button
                  onClick={() => setScreen('intro')}
                  style={{
                    background: 'transparent', color: '#6a786f', padding: '12px 20px',
                    borderRadius: 12, border: '1.5px solid #dbe8dd', fontWeight: 600, cursor: 'pointer',
                    transition: 'all .2s',
                    minHeight: 44,
                    fontSize: 14,
                  }}
                  onMouseOver={e => { (e.target as HTMLButtonElement).style.borderColor = '#97b59c'; (e.target as HTMLButtonElement).style.color = '#4d6a53'; }}
                  onMouseOut={e => { (e.target as HTMLButtonElement).style.borderColor = '#dbe8dd'; (e.target as HTMLButtonElement).style.color = '#6a786f'; }}
                >
                  回到首页
                </button>
              </div>
            </div>

            {/* Hidden Share Card */}
            <div
              ref={shareCardRef}
              style={{
                position: 'absolute',
                left: '-9999px',
                width: 375,
                minHeight: 667,
                height: 'auto',
                background: 'linear-gradient(180deg, #1a2e1f 0%, #2d4a38 40%, #1a2e1f 100%)',
                padding: '24px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
                boxSizing: 'border-box',
                overflow: 'visible',
              }}
            >
              {/* Top badge */}
              <div style={{
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                padding: '5px 14px',
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
              }}>
                NBTI 职业人格测试
              </div>

              {/* Type image with rarity background - enlarged */}
              <div style={{
                position: 'relative',
                padding: '8px',
                borderRadius: 24,
                background: result.finalType.rarity === 'SSR'
                  ? 'linear-gradient(135deg, #FFD700, #FFA500, #FF6347)'
                  : result.finalType.rarity === 'SR'
                  ? 'linear-gradient(135deg, #9370DB, #8A2BE2, #4B0082)'
                  : result.finalType.rarity === 'R'
                  ? 'linear-gradient(135deg, #4169E1, #1E90FF, #00BFFF)'
                  : 'linear-gradient(135deg, #808080, #A9A9A9, #D3D3D3)',
                boxShadow: result.finalType.rarity === 'SSR'
                  ? '0 8px 32px rgba(255, 215, 0, 0.4)'
                  : result.finalType.rarity === 'SR'
                  ? '0 8px 32px rgba(147, 112, 219, 0.4)'
                  : result.finalType.rarity === 'R'
                  ? '0 8px 32px rgba(65, 105, 225, 0.4)'
                  : '0 8px 32px rgba(128, 128, 128, 0.3)',
              }}>
                {result.finalType.image && (
                  <img
                    src={result.finalType.image}
                    alt={result.finalType.cn}
                    style={{ width: 220, height: 220, borderRadius: 18, objectFit: 'cover', display: 'block' }}
                  />
                )}
                {!result.finalType.image && (
                  <div style={{
                    width: 220, height: 220, borderRadius: 18,
                    background: 'linear-gradient(180deg, #97b59c, #5b7a62)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 48, fontWeight: 900, color: '#fff',
                  }}>
                    {result.finalType.code.slice(0, 4)}
                  </div>
                )}
                {/* Rarity badge */}
                <div style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  background: 'rgba(0,0,0,0.75)',
                  color: result.finalType.rarity === 'SSR' ? '#FFD700'
                    : result.finalType.rarity === 'SR' ? '#9370DB'
                    : result.finalType.rarity === 'R' ? '#4169E1'
                    : '#808080',
                  padding: '3px 8px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 900,
                  border: `2px solid ${result.finalType.rarity === 'SSR' ? '#FFD700'
                    : result.finalType.rarity === 'SR' ? '#9370DB'
                    : result.finalType.rarity === 'R' ? '#4169E1'
                    : '#808080'}`,
                }}>
                  {result.finalType.rarity}
                </div>
                {/* Match percentage badge - with label */}
                <div style={{
                  position: 'absolute',
                  bottom: -4,
                  left: -4,
                  background: 'linear-gradient(135deg, #ff6b6b, #ee5a5a)',
                  color: '#fff',
                  padding: '4px 8px',
                  borderRadius: 10,
                  fontSize: 11,
                  fontWeight: 800,
                  boxShadow: '0 4px 12px rgba(238,90,90,0.4)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  lineHeight: 1.2,
                }}>
                  <span style={{ fontSize: 9, opacity: 0.9 }}>匹配度</span>
                  <span>{result.bestNormal?.similarity || 87}%</span>
                </div>
              </div>

              {/* Type name - Chinese emphasized */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: '#fff',
                  lineHeight: 1.2,
                  textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}>
                  {result.finalType.cn}
                </div>
                <div style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: '#97b59c',
                  marginTop: 4,
                  letterSpacing: '0.05em',
                }}>
                  {result.finalType.code}
                </div>
              </div>

              {/* Rarity text */}
              <div style={{
                fontSize: 12,
                color: result.finalType.rarity === 'SSR' ? '#FFD700'
                  : result.finalType.rarity === 'SR' ? '#9370DB'
                  : result.finalType.rarity === 'R' ? '#4169E1'
                  : '#808080',
                fontWeight: 700,
                textAlign: 'center',
                padding: '0 8px',
              }}>
                {getRarityText(result.finalType.rarity, result.bestNormal?.similarity)}
              </div>

              {/* Personality description - full text, no truncation */}
              <div style={{
                background: 'rgba(255,255,255,0.12)',
                borderRadius: 14,
                padding: '14px 16px',
                width: '100%',
                wordWrap: 'break-word',
                wordBreak: 'break-all',
              }}>
                <div style={{ fontSize: 12, color: '#97b59c', marginBottom: 6, fontWeight: 700, letterSpacing: '0.05em' }}>💡 人格解析</div>
                <div style={{ fontSize: 13, color: '#fff', lineHeight: 1.8, fontWeight: 400, whiteSpace: 'pre-wrap' }}>
                  {result.finalType.desc || result.finalType.intro}
                </div>
              </div>

              {/* Radar Chart - static SVG with real data */}
              {(() => {
                const scoreMap: Record<string, number> = { L: 1, M: 2, H: 3 };
                const dims = ['S1', 'E2', 'A1', 'So1', 'A2'];
                const labels = ['内卷', '摸鱼', '向上', '社恐', '甩锅'];
                const values = dims.map(dim => scoreMap[result.levels[dim] || 'M'] || 2);
                
                // Pre-calculate all coordinates
                const center = 90;
                const maxR = 120;
                const coords = values.map((v, i) => {
                  const angle = (i * 72 - 90) * Math.PI / 180;
                  const r = (v / 3) * maxR;
                  return {
                    x: center + r * Math.cos(angle),
                    y: center + r * Math.sin(angle),
                    labelX: center + maxR * 1.15 * Math.cos(angle),
                    labelY: center + maxR * 1.15 * Math.sin(angle),
                  };
                });
                
                const points = coords.map(c => `${c.x},${c.y}`).join(' ');
                
                return (
                  <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '8px 0' }}>
                    <svg width="180" height="180" viewBox="0 0 180 180" style={{ display: 'block' }}>
                      {/* Grid rings */}
                      <circle cx="90" cy="90" r="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                      <circle cx="90" cy="90" r="80" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                      <circle cx="90" cy="90" r="120" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                      {/* Axes */}
                      {coords.map((_, i) => {
                        const angle = (i * 72 - 90) * Math.PI / 180;
                        return (
                          <line key={`axis-${i}`} x1="90" y1="90" x2={90 + 120 * Math.cos(angle)} y2={90 + 120 * Math.sin(angle)} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                        );
                      })}
                      {/* Data polygon */}
                      <polygon points={points} fill="rgba(151,181,156,0.35)" stroke="#97b59c" strokeWidth="2" />
                      {/* Data points */}
                      {coords.map((c, i) => (
                        <circle key={`point-${i}`} cx={c.x} cy={c.y} r="4" fill="#97b59c" stroke="#fff" strokeWidth="1.5" />
                      ))}
                      {/* Labels */}
                      {coords.map((c, i) => (
                        <text key={`label-${i}`} x={c.labelX} y={c.labelY} textAnchor="middle" dominantBaseline="middle" fill="#97b59c" fontSize="11" fontWeight="700">
                          {labels[i]}
                        </text>
                      ))}
                    </svg>
                  </div>
                );
              })()}

              {/* Bottom area with QR code placeholder */}
              <div style={{
                marginTop: 'auto',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 0 0',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                gap: 12,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: '#97b59c', marginBottom: 4, fontWeight: 600 }}>
                    扫码测测你的职场人格
                  </div>
                  <div style={{ fontSize: 10, color: '#6a786f' }}>
                    nbittest.com · 分享前别忘了屏蔽老板
                  </div>
                </div>
                {/* QR code placeholder */}
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1.5px dashed rgba(255,255,255,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: 20 }}>📱</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
