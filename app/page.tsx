'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  questions,
  specialQuestions,
  dimensionMeta,
  dimensionOrder,
  TYPE_LIBRARY,
  NORMAL_TYPES,
  DIM_EXPLANATIONS,
  DRUNK_TRIGGER_QUESTION_ID,
} from './data';

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

function sumToLevel(score: number): string {
  if (score <= 3) return 'L';
  if (score <= 4) return 'M';
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
    Object.keys(dimensionMeta).forEach(dim => { rawScores[dim] = 0; });

    questions.forEach(q => {
      if (q.dim && answers[q.id]) {
        rawScores[q.dim] += answers[q.id];
      }
    });

    const levels: Record<string, string> = {};
    Object.entries(rawScores).forEach(([dim, score]) => {
      levels[dim] = sumToLevel(score);
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
      modeKicker = '隐藏人格已激活';
      badge = '匹配度 100% · 酒精异常因子已接管';
      sub = '乙醇亲和性过强，系统已直接跳过常规人格审判。';
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

        {/* INTRO */}
        {screen === 'intro' && (
              <div style={{
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
            <h1 style={{ fontSize: 'clamp(32px, 6vw, 56px)', lineHeight: 1.06, letterSpacing: '-0.04em', margin: 0, fontWeight: 900 }}>
              SBTI<span style={{ color: '#4d6a53' }}>2.0</span>
            </h1>
            <div style={{ fontSize: 'clamp(18px, 4vw, 26px)', fontWeight: 700, color: '#1a2e1f', marginTop: 10 }}>
              职业人格测试NBTI来了
            </div>
            <p style={{ marginTop: 8, fontSize: 13, color: '#97b59c', fontWeight: 600 }}>分享前别忘了屏蔽你的老板</p>
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
                }}
              >
                开始测试
              </button>
              <button
                onClick={() => {
                  const codes = Object.keys(TYPE_LIBRARY);
                  const randomCode = codes[Math.floor(Math.random() * codes.length)];
                  const type = TYPE_LIBRARY[randomCode];
                  setResult({
                    finalType: { ...type, image: TYPE_IMAGE_MAP[randomCode] || type.image },
                    modeKicker: '随机预览模式',
                    badge: `随机展示 · ${type.cn}`,
                    sub: '（随机展示一种人格，实际结果取决于你的答题）',
                    special: false,
                    levels: {},
                    ranked: [],
                    bestNormal: null as any,
                    rawScores: {},
                  });
                  setScreen('result');
                }}
                style={{
                  background: '#fff',
                  color: '#4d6a53',
                  border: '1.5px solid #4d6a53',
                  padding: '14px 20px',
                  borderRadius: 16,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                }}
              >
                随机预览结果
              </button>
            </div>

          </div>
        )}

        {/* TEST */}
        {screen === 'test' && (
          <div style={{
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
                  style={{
                  border: '1px solid #dbe8dd',
                  borderRadius: 18,
                  padding: 18,
                  background: 'linear-gradient(180deg, #ffffff, #fbfdfb)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <span style={{ fontSize: 12, color: '#6a786f' }}>维度已隐藏</span>
                  </div>
                  <div style={{ fontSize: 16, lineHeight: 1.7, whiteSpace: 'pre-wrap', marginBottom: 14 }}>{q.text}</div>
                  <div style={{ display: 'grid', gap: 10 }}>
                    {q.options.map((opt, i) => {
                      const code = ['A', 'B', 'C', 'D'][i] || String(i + 1);
                      const checked = answers[q.id] === opt.value;
                      return (
                        <label
                          key={i}
                          onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt.value }))}
                          style={{
                            display: 'flex', alignItems: 'flex-start', gap: 12,
                            padding: '14px', borderRadius: 14, border: `2px solid ${checked ? '#2e7d32' : '#dbe8dd'}`,
                            background: checked ? '#c8e6c9' : '#fff',
                            boxShadow: checked ? '0 0 0 3px rgba(46,125,50,0.12)' : 'none',
                            cursor: 'pointer',
                            transition: 'border-color .16s, background .16s',
                          }}
                        >
                          <input type="radio" name={q.id} value={opt.value} checked={checked} onChange={() => {}} style={{ display: 'none' }} />
                          <span style={{ fontWeight: 800, color: '#4d6a53', minWidth: 22 }}>{code}</span>
                          <span>{opt.label}</span>
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
                    background: '#fff', color: '#4d6a53', padding: '14px 20px',
                    borderRadius: 14, border: '1px solid #dbe8dd', fontWeight: 700, cursor: 'pointer',
                  }}
                >
                  返回首页
                </button>
                <button
                  onClick={handleSubmit}
                  style={{
                    background: '#4d6a53', color: '#fff',
                    padding: '14px 20px', borderRadius: 14, border: 0, fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 12px 30px rgba(77,106,83,0.18)',
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
            {/* Header bar */}
            <div style={{
              background: '#2d4a38',
              padding: '16px 24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: '22px 22px 0 0',
            }}>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>你的主类型</div>
              <div style={{
                background: '#4d6a53',
                color: '#fff',
                padding: '6px 14px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 700,
              }}>
                {result.badge}
              </div>
            </div>

            <div style={{ padding: '16px 0', display: 'grid', gap: 18 }}>
            {/* Top section - vertical stack for easy screenshot sharing */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center' }}>
              {/* Poster */}
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
                    style={{ width: 240, height: 240, borderRadius: 20, objectFit: 'cover', marginBottom: 0 }}
                  />
                )}
                {!result.finalType.image && (
                  <div style={{
                    width: 120, height: 120, borderRadius: '50%', background: 'linear-gradient(180deg, #97b59c, #5b7a62)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 48, fontWeight: 900, color: '#fff', letterSpacing: -2,
                  }}>
                    {result.finalType.code.slice(0, 4)}
                  </div>
                )}
              </div>

              {/* Type info */}
              <div style={{ width: '100%', maxWidth: 340, border: '1px solid #dbe8dd', borderRadius: 18, padding: '16px 20px', background: 'linear-gradient(180deg, #ffffff, #fbfdfb)', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#999', marginBottom: 6, letterSpacing: '.08em', textTransform: 'uppercase' }}>
                  {result.modeKicker}
                </div>
                <div style={{ fontSize: 42, lineHeight: 1.05, letterSpacing: '-0.02em', fontWeight: 900, color: '#1a1a1a' }}>
                  {result.finalType.code}
                </div>
                <div style={{ fontSize: 20, lineHeight: 1.2, fontWeight: 700, color: '#4d6a53', marginTop: 4 }}>
                  {result.finalType.cn}
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
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: 320, aspectRatio: '320/280', margin: '0 auto' }}>
                  <svg width="100%" height="100%" viewBox="0 0 320 280" style={{ position: 'absolute', top: 0, left: 0 }}>
                    {[60, 90, 120].map(r => (
                      <circle key={r} cx="160" cy="140" r={r} fill="none" stroke="#dbe8dd" strokeWidth="1" />
                    ))}
                    {[0, 1, 2, 3, 4].map(i => {
                      const angle = (i * 72 - 90) * Math.PI / 180;
                      return (
                        <line
                          key={i}
                          x1="160" y1="140"
                          x2={160 + 120 * Math.cos(angle)}
                          y2={140 + 120 * Math.sin(angle)}
                          stroke="#dbe8dd" strokeWidth="1"
                        />
                      );
                    })}
                    {(() => {
                      const groups = [
                        { dims: ['S1','S2','E1','E3'] },
                        { dims: ['E2','Ac3'] },
                        { dims: ['So1','So3'] },
                        { dims: ['A1','A3'] },
                        { dims: ['A2','So2'] },
                      ];
                      const scoreMap: Record<string, number> = { L: 1, M: 2, H: 3 };
                      const points = groups.map((g, i) => {
                        const avg = g.dims.reduce((s, d) => s + (scoreMap[result.levels[d]] || 2), 0) / g.dims.length;
                        const angle = (i * 72 - 90) * Math.PI / 180;
                        return `${160 + avg * 40 * Math.cos(angle)},${140 + avg * 40 * Math.sin(angle)}`;
                      }).join(' ');
                      return <polygon points={points} fill="rgba(77,106,83,0.25)" stroke="#4d6a53" strokeWidth="2" />;
                    })()}
                  </svg>
                  {/* Fixed position labels - exactly at pentagon vertices */}
                  {/* Pentagon vertices in 320x280 viewBox with center(160,140) and r=120:
                      i=0(内卷): top=(160,20), i=1(摸鱼): topRight=(275,103)
                      i=2(向上): bottomRight=(231,237), i=3(社交): bottomLeft=(89,237)
                      i=4(甩锅): topLeft=(45,103) */}
                  <div style={{ position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)', fontSize: 12, color: '#4d6a53', fontWeight: 700, whiteSpace: 'nowrap' }}>内卷指数</div>
                  <div style={{ position: 'absolute', top: 91, right: 6, fontSize: 12, color: '#4d6a53', fontWeight: 700, whiteSpace: 'nowrap' }}>摸鱼指数</div>
                  <div style={{ position: 'absolute', bottom: 10, right: 8, fontSize: 12, color: '#4d6a53', fontWeight: 700, whiteSpace: 'nowrap' }}>向上管理</div>
                  <div style={{ position: 'absolute', bottom: 10, left: 8, fontSize: 12, color: '#4d6a53', fontWeight: 700, whiteSpace: 'nowrap' }}>社交恐惧</div>
                  <div style={{ position: 'absolute', top: 91, left: 6, fontSize: 12, color: '#4d6a53', fontWeight: 700, whiteSpace: 'nowrap' }}>甩锅指数</div>
                </div>
              </div>

              {/* Dimension cards */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  {
                    group: '内卷指数', icon: '🔥', color: '#c0392b',
                    dims: ['S1','S2','E1','E3'],
                    jokes: {
                      L: '你是来上班的还是来渡劫的？卷不动就算了，躺平也是一种美德。',
                      M: '还行，偶尔卷一下，但大部分时间在摸鱼和假装忙碌之间横跳。',
                      H: '你不是卷王转世就是工作狂投胎。你的人生简历可以写：曾为工作活过。',
                    }
                  },
                  {
                    group: '摸鱼指数', icon: '🐟', color: '#27ae60',
                    dims: ['E2','Ac3'],
                    jokes: {
                      L: '摸鱼？不存在的。你是那种周末加班会觉得充实的人，病得不轻。',
                      M: '你摸鱼属于"战略性摸鱼"，该干的活也没落下，就是过程有点曲折。',
                      H: '你上班的唯一目的就是下班。你的人生哲学是：工资到手，及时行乐。',
                    }
                  },
                  {
                    group: '社交恐惧', icon: '😨', color: '#8e44ad',
                    dims: ['So1','So3'],
                    jokes: {
                      L: '你是社恐界的"卷王"，宁可开会也不愿午餐社交。你的工位就是你的安全区。',
                      M: '你社交属于"选择性社恐"——熟人就话多，生人就装高冷。',
                      H: '你是部门的气氛组长，午餐约饭永远有你的位置。职场政治你门儿清。',
                    }
                  },
                  {
                    group: '向上管理', icon: '👆', color: '#e67e22',
                    dims: ['A1','A3'],
                    jokes: {
                      L: '你对老板的态度是"惹不起躲得起"。汇报？不存在的，老板没找你就是好消息。',
                      M: '你会适当表现，但不会太舔。你懂"老板喜欢什么"，但不想全说。',
                      H: '你是老板肚子里的蛔虫，知道老板下一秒想要什么。你不属于你，你属于老板。',
                    }
                  },
                  {
                    group: '甩锅指数', icon: '🔄', color: '#2980b9',
                    dims: ['A2','So2'],
                    jokes: {
                      L: '你是部门的背锅侠，永远在为别人的错误买单。吃亏是福，但小心福报太多。',
                      M: '你甩锅属于"技术性甩锅"——明面上没甩，实际上甩得干干净净。',
                      H: '你是职场太极高手，永远四两拨千斤。出了问题，你永远在"调查原因"。',
                    }
                  },
                ].map(({ group, dims, icon, color, jokes }) => {
                  const scoreMap: Record<string, number> = { L: 1, M: 2, H: 3 };
                  const avg = dims.reduce((s, d) => s + (scoreMap[result.levels[d]] || 2), 0) / dims.length;
                  const pct = Math.round(avg / 3 * 100);
                  const level: 'L' | 'M' | 'H' = avg >= 2 ? 'H' : avg >= 1.5 ? 'M' : 'L';
                  const joke = jokes[level];
                  return (
                    <div key={group} style={{ border: '1px solid #dbe8dd', borderRadius: 14, padding: 14, background: '#fff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 14 }}>{icon} {group}</span>
                        <span style={{ color, fontWeight: 800, fontSize: 14 }}>{pct}%</span>
                      </div>
                      <div style={{ height: 8, background: '#edf3ee', borderRadius: 999, overflow: 'hidden', marginBottom: 8 }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${color}cc, ${color})`, borderRadius: 'inherit', transition: 'width .3s ease' }} />
                      </div>
                      <p style={{ margin: 0, color: '#6a786f', fontSize: 12, lineHeight: 1.7 }}>{joke}</p>
                    </div>
                  );
                })}
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

            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', padding: '0 24px 24px' }}>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <button
                  onClick={startTest}
                  style={{
                    background: '#fff', color: '#4d6a53', padding: '12px 20px',
                    borderRadius: 12, border: '1.5px solid #4d6a53', fontWeight: 700, cursor: 'pointer',
                    transition: 'all .2s',
                  }}
                  onMouseOver={e => { (e.target as HTMLButtonElement).style.background = '#4d6a53'; (e.target as HTMLButtonElement).style.color = '#fff'; }}
                  onMouseOut={e => { (e.target as HTMLButtonElement).style.background = '#fff'; (e.target as HTMLButtonElement).style.color = '#4d6a53'; }}
                >
                  重新测试
                </button>
                <button
                  onClick={() => setScreen('intro')}
                  style={{
                    background: '#2d4a38', color: '#fff', padding: '12px 20px',
                    borderRadius: 12, border: 0, fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(45,74,56,0.25)',
                    transition: 'all .2s',
                  }}
                  onMouseOver={e => { (e.target as HTMLButtonElement).style.background = '#1e3327'; }}
                  onMouseOut={e => { (e.target as HTMLButtonElement).style.background = '#2d4a38'; }}
                >
                  回到首页
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
