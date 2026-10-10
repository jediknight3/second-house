/* ═══════════════════════════════════════════════════════════
   설계안 브로셔 — 「쉼표의 집 THE PAUSE」 (개념 설계)
   1F 18평 · 2F 15평 · 다락 — 평면 / 입면 / 단면 / 모델하우스 연출
   모든 도면은 m 단위 좌표로 그리고 SVG로 렌더링
   ═══════════════════════════════════════════════════════════ */
(function () {
  const PYC = 3.3058;
  const R = (n, x, y, w, h, o) => Object.assign({ n, pts: [[x, y], [x + w, y], [x + w, y + h], [x, y + h]] }, o || {});
  const area = pts => Math.abs(pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0) / 2);
  const f1 = (v, d = 1) => (Math.round(v * 10 ** d) / 10 ** d).toFixed(d);

  // ── 층별 계획 (x: 서→동, y: 북→남, 단위 m) ──
  // door: [x1,y1,x2,y2, nx,ny] → 힌지 (x1,y1), 닫힌 끝 (x2,y2), 열리는 방향 (nx,ny)
  // open: [x1,y1,x2,y2] → 벽 없이 트인 구간
  const PLAN = {
    f1: {
      title: '1층 평면도', W: 9.6, D: 6.2,
      rooms: [
        R('파티룸', 0, 0, 4.3, 6.2, { c: '#EFE5D3' }),
        R('계단', 4.3, 0, 2.1, 2.8, { c: '#E8E2D8', stair: 'up' }),
        R('현관', 6.4, 0, 2.2, 2.8, { c: '#E4DFD6', tile: 1 }),
        R('세탁실', 8.6, 0, 1.0, 2.8, { c: '#E1E7EA', tile: 1 }),
        R('복도', 4.3, 2.8, 5.3, 1.0, { c: '#EEE9E1', small: 1 }),
        R('침실', 4.3, 3.8, 3.6, 2.4, { c: '#EBE1CE' }),
        R('욕실', 7.9, 3.8, 1.7, 2.4, { c: '#E1E7EA', tile: 1 }),
      ],
      open: [[4.3, 2.8, 5.3, 2.8], [6.6, 2.8, 8.4, 2.8]],
      doors: [
        [4.3, 2.85, 4.3, 3.75, -1, 0],       // 복도 → 파티룸
        [8.7, 2.8, 9.5, 2.8, 0, -1],         // 복도 → 세탁실
        [6.4, 3.8, 7.2, 3.8, 0, 1],          // 복도 → 침실
        [8.0, 3.8, 8.75, 3.8, 0, 1],         // 복도 → 욕실
        [7.8, 0, 6.8, 0, 0, 1, 'ext'],       // 현관문
      ],
      win: [
        [0.3, 6.2, 4.0, 6.2, 's'], [0, 1.0, 0, 5.0, 'w'], [4.55, 0, 6.15, 0, 'w'], [7.95, 0, 8.3, 0, 'w'],
        [9.6, 0.7, 9.6, 2.1, 'w'], [4.8, 6.2, 7.4, 6.2, 'w'], [8.3, 6.2, 9.3, 6.2, 'w'], [9.6, 4.3, 9.6, 5.5, 'w'],
      ],
      furn: [
        { t: 'rect', x: 0.2, y: 0.15, w: 3.9, h: 0.6, c: '#6B4F3A', l: '와인셀러 · 바 카운터' },
        { t: 'rect', x: 0.9, y: 1.55, w: 2.4, h: 0.8, c: '#B9AFA1', l: '바 아일랜드', r: 0.08 },
        { t: 'stool', xs: [1.2, 1.8, 2.4, 3.0], y: 2.6 },
        { t: 'sofaV', x: 0.2, y: 3.35, w: 0.9, h: 2.4 },
        { t: 'rect', x: 1.55, y: 3.95, w: 0.75, h: 1.25, c: '#CFC4B2', r: 0.12 },
        { t: 'rect', x: 4.08, y: 4.0, w: 0.14, h: 2.0, c: '#30353D', l: '' },
        { t: 'txt', x: 3.82, y: 5.0, l: '스크린', rot: 90 },
        { t: 'rect', x: 8.1, y: 0.75, w: 0.42, h: 1.95, c: '#CFC4B2', l: '' }, { t: 'txt', x: 8.31, y: 1.75, l: '신발장', rot: 90 },
        { t: 'washer', x: 8.75, y: 0.15 }, { t: 'washer', x: 8.75, y: 0.92 },
        { t: 'bedH', x: 4.4, y: 4.25, w: 2.0, h: 1.6 },
        { t: 'rect', x: 4.4, y: 3.92, w: 0.45, h: 0.3, c: '#CFC4B2', l: '' }, { t: 'rect', x: 4.4, y: 5.88, w: 0.45, h: 0.28, c: '#CFC4B2', l: '' },
        { t: 'closet', x: 7.28, y: 3.9, w: 0.55, h: 2.2 },
        { t: 'shower', x: 7.98, y: 5.3, w: 1.55, h: 0.82 }, { t: 'wc', x: 9.12, y: 3.92 }, { t: 'vanity', x: 7.98, y: 4.65, w: 0.45, h: 0.6 },
      ],
      label: { '파티룸': [2.3, 3.2], '침실': [5.4, 5.25], '복도': [7.0, 3.32], '현관': [7.25, 1.55], '세탁실': [9.1, 1.9], '욕실': [8.85, 4.8] },
    },
    f2: {
      title: '2층 평면도', W: 9.6, D: 6.2, bodyW: 8.0,
      rooms: [
        { n: 'LDK', pts: [[1.6, 0], [4.3, 0], [4.3, 2.8], [6.4, 2.8], [8.0, 2.8], [8.0, 6.2], [0, 6.2], [0, 2.2], [1.6, 2.2]], c: '#F0E8DA' },
        R('계단', 4.3, 0, 2.1, 2.8, { c: '#E8E2D8', stair: 'updn' }),
        R('욕실', 6.4, 0, 1.6, 2.8, { c: '#E1E7EA', tile: 1 }),
        R('다용도실', 0, 0, 1.6, 2.2, { c: '#E1E7EA', tile: 1 }),
        R('테라스', 8.0, 0, 1.6, 6.2, { c: '#DCCDB5', terrace: 1 }),
      ],
      open: [[4.3, 2.8, 6.4, 2.8]],
      doors: [
        [1.6, 1.55, 1.6, 0.75, 1, 0],        // 주방 → 다용도실
        [6.5, 2.8, 7.25, 2.8, 0, -1],        // LDK → 욕실
      ],
      win: [
        [0.4, 6.2, 3.6, 6.2, 'w'], [4.6, 6.2, 7.6, 6.2, 'w'], [0, 3.6, 0, 5.8, 'w'], [0, 0.6, 0, 1.6, 'w'],
        [2.0, 0, 4.0, 0, 'w'], [4.55, 0, 6.15, 0, 'w'], [6.8, 0, 7.6, 0, 'w'], [8.0, 3.4, 8.0, 5.6, 's'],
      ],
      above: [[0, 0, 4.3, 3.2, '상부 : 다락 (주방 위)']],
      ridge: 1,
      furn: [
        { t: 'counter', x: 1.65, y: 0.08, w: 2.6, h: 0.62 },
        { t: 'rect', x: 1.75, y: 2.3, w: 2.4, h: 0.85, c: '#A69C8F', l: '아일랜드 (대면형)', r: 0.06 },
        { t: 'stool', xs: [2.1, 2.7, 3.3, 3.9], y: 3.4 },
        { t: 'sofaS', x: 0.4, y: 3.85, w: 2.9, h: 0.9 },
        { t: 'rect', x: 1.2, y: 5.0, w: 1.3, h: 0.6, c: '#CFC4B2', r: 0.28 },
        { t: 'chair', x: 3.45, y: 4.95 },
        { t: 'table', x: 5.0, y: 3.85, w: 1.8, h: 0.9 },
        { t: 'rect', x: 0.08, y: 0.1, w: 0.7, h: 0.7, c: '#CDD7DC', l: '' }, { t: 'txt', x: 0.43, y: 0.52, l: '보일러' },
        { t: 'wc', x: 7.45, y: 0.12 }, { t: 'vanity', x: 6.48, y: 0.12, w: 0.5, h: 0.8 }, { t: 'shower', x: 6.48, y: 1.0, w: 1.45, h: 0.9 },
        { t: 'deckchair', x: 8.4, y: 4.2 }, { t: 'deckchair', x: 8.4, y: 1.3 },
        { t: 'note', x: 6.0, y: 5.95, l: '거실·식당 보이드 — 천장고 최고 5.0m' },
      ],
      label: { 'LDK': [6.0, 5.3], '테라스': [8.8, 3.3], '욕실': [7.62, 2.2], '다용도실': [0.8, 1.45] },
    },
    f3: {
      title: '다락 평면도', W: 9.6, D: 6.2, bodyW: 8.0,
      rooms: [
        { n: '다락 침실', pts: [[0, 0], [5.3, 0], [5.3, 0.45], [4.3, 0.45], [4.3, 3.2], [0, 3.2]], c: '#EFE7D7', areaText: '바닥 14.2㎡ · 4.3평 (높이 1.5m 이상 약 1.8평)' },
        R('계단', 4.3, 0, 2.1, 2.8, { c: '#E8E2D8', stair: 'loft' }),
      ],
      voids: [[[0, 3.2], [4.3, 3.2], [4.3, 2.8], [6.4, 2.8], [6.4, 0], [8.0, 0], [8.0, 6.2], [0, 6.2]]],
      rail: [[0, 3.2, 4.3, 3.2], [4.3, 0.45, 4.3, 3.2]],
      open: [], doors: [],
      win: [[2.6, 0, 3.9, 0, 'w']],
      ridge: 1,
      furn: [
        { t: 'bedV', x: 2.55, y: 0.6, w: 1.6, h: 2.0 },
        { t: 'rect', x: 1.95, y: 0.65, w: 0.45, h: 0.4, c: '#CFC4B2', l: '' },
        { t: 'rect', x: 0.45, y: 1.6, w: 1.2, h: 1.2, c: '#D8CCBA', l: '좌식 쿠션', r: 0.25 },
        { t: 'sky', x: 0.7, y: 3.9, w: 1.0, h: 0.8 }, { t: 'sky', x: 0.7, y: 5.1, w: 1.0, h: 0.8 },
        { t: 'note', x: 5.6, y: 4.7, l: '보이드 (아래로 거실·식당)' },
      ],
      label: { '다락 침실': [3.1, 2.72] },
      hatch: [[0, 0, 1.9, 3.2]], hatchText: [[0.95, 0.45, '수납 · 낮은 천장']],
    },
  };

  // ── 평면도 SVG ──
  function planSVG(key) {
    const P = PLAN[key], S = 56, pad = 48, W = P.W, D = P.D, bw = P.bodyW || W;
    const vw = W * S + pad * 2, vh = D * S + pad * 2 + 30;
    const X = x => pad + x * S, Y = y => pad + y * S;
    const poly = pts => pts.map(p => X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1)).join(' ');
    const L = (x1, y1, x2, y2, st, w, ex) => `<line x1="${X(x1).toFixed(1)}" y1="${Y(y1).toFixed(1)}" x2="${X(x2).toFixed(1)}" y2="${Y(y2).toFixed(1)}" stroke="${st}" stroke-width="${w}" ${ex || ''}/>`;
    const T = (x, y, s, size, col, w, rot) => `<text x="${X(x).toFixed(1)}" y="${Y(y).toFixed(1)}" text-anchor="middle" font-size="${size}" ${w ? `font-weight="${w}"` : ''} fill="${col}" ${rot ? `transform="rotate(${rot} ${X(x).toFixed(1)} ${Y(y).toFixed(1)})"` : ''}>${s}</text>`;
    const WALL = '#3A352F', FLOOR_GAP = '#EEE8DE';
    let g = '';
    if (key !== 'f1') g += `<rect x="${X(0)}" y="${Y(0)}" width="${W * S}" height="${D * S}" fill="none" stroke="#BDB5A8" stroke-dasharray="5 4" stroke-width="1"/><text x="${X(W) - 4}" y="${Y(D) + 14}" text-anchor="end" font-size="9.5" fill="#A39B8E">점선: 1층 외곽</text>`;
    // 바닥
    P.rooms.forEach(r => {
      g += `<polygon points="${poly(r.pts)}" fill="${r.c}"/>`;
      if (r.tile) g += `<polygon points="${poly(r.pts)}" fill="url(#tile)" opacity=".55"/>`;
      if (r.terrace) for (let i = 0.25; i < 6.2; i += 0.25) g += L(8.0, i, 9.6, i, '#CBBA9F', 0.8);
    });
    // 낮은 천장 해치
    (P.hatch || []).forEach(([x, y, w, h]) => {
      g += `<rect x="${X(x)}" y="${Y(y)}" width="${w * S}" height="${h * S}" fill="url(#hatch)" opacity=".5"/>`;
    });
    (P.hatchText || []).forEach(([x, y, t]) => g += T(x, y, t, 9.5, '#7D766C'));
    // 보이드 (아래층이 보이는 오픈 공간)
    (P.voids || []).forEach(pts => { g += `<polygon points="${poly(pts)}" fill="url(#voidP)" stroke="#A39B8E" stroke-width="1" stroke-dasharray="6 4"/>`; });
    // 계단 (U자, 폭 1.0m × 2 + 중앙벽)
    P.rooms.filter(r => r.stair).forEach(r => {
      const [x0, y0] = r.pts[0], top = y0 + 1.0, bot = y0 + 2.8;
      for (let k = 0; k <= 7; k++) { const yy = top + k * 0.257; g += L(x0, yy, x0 + 1.0, yy, '#9C9488', 0.9) + L(x0 + 1.1, yy, x0 + 2.1, yy, '#9C9488', 0.9); }
      g += `<rect x="${X(x0 + 1.0)}" y="${Y(top)}" width="${0.1 * S}" height="${1.8 * S}" fill="${WALL}"/>`;
      const arrow = (pts, lab, lx, ly) => `<polyline points="${poly(pts)}" fill="none" stroke="#8C6D45" stroke-width="1.5" marker-end="url(#arr)"/>` + T(lx, ly, lab, 10, '#8C6D45', 700);
      if (r.stair === 'up') g += arrow([[x0 + 0.5, bot - 0.15], [x0 + 0.5, y0 + 0.5], [x0 + 1.6, y0 + 0.5], [x0 + 1.6, bot - 0.35]], 'UP', x0 + 0.5, bot - 0.25);
      if (r.stair === 'updn') { g += arrow([[x0 + 0.5, bot - 0.15], [x0 + 0.5, y0 + 0.25]], 'UP 다락', x0 + 0.5, bot - 0.25) + arrow([[x0 + 1.6, bot - 0.15], [x0 + 1.6, y0 + 0.55]], 'DN', x0 + 1.6, bot - 0.25); }
      if (r.stair === 'loft') { g += `<rect x="${X(x0 + 1.1)}" y="${Y(top)}" width="${1.0 * S}" height="${1.8 * S}" fill="url(#voidP)"/>` + arrow([[x0 + 0.5, y0 + 0.6], [x0 + 0.5, bot - 0.2]], 'DN', x0 + 0.5, y0 + 0.35) + T(x0 + 1.6, top + 1.0, '오픈', 9.5, '#7D766C'); }
      if (r.stair === 'dn') { g += `<rect x="${X(x0)}" y="${Y(top)}" width="${1.0 * S}" height="${1.8 * S}" fill="url(#hatch)" opacity=".35"/>` + L(x0, bot, x0 + 1.0, bot, '#5B7C93', 2.5) + arrow([[x0 + 1.6, bot - 0.15], [x0 + 1.6, y0 + 0.55]], 'DN', x0 + 1.6, bot - 0.25) + T(x0 + 0.5, top + 1.0, '오픈', 9.5, '#7D766C'); }
    });
    // 가구·설비
    P.furn.forEach(f => {
      const rx = (x, y, w, h, fill, r, st) => `<rect x="${X(x).toFixed(1)}" y="${Y(y).toFixed(1)}" width="${(w * S).toFixed(1)}" height="${(h * S).toFixed(1)}" rx="${((r || 0.04) * S).toFixed(1)}" fill="${fill}" ${st ? `stroke="${st}" stroke-width="0.9"` : ''}/>`;
      if (f.t === 'rect') { g += rx(f.x, f.y, f.w, f.h, f.c, f.r); if (f.l) g += T(f.x + f.w / 2, f.y + f.h / 2 + 0.06, f.l, 9.5, /^#[3-7]/.test(f.c) ? '#F3EBDD' : '#4A443C'); }
      else if (f.t === 'txt') g += T(f.x, f.y, f.l, 9, '#7D766C', 0, f.rot);
      else if (f.t === 'note') g += T(f.x, f.y, f.l, 10.5, '#8C6D45', 700);
      else if (f.t === 'sofaV') g += rx(f.x, f.y, f.w, f.h, '#9E8F7D', 0.12) + rx(f.x + 0.22, f.y + 0.08, f.w - 0.3, f.h - 0.16, '#B7A895', 0.08);
      else if (f.t === 'sofaS') g += rx(f.x, f.y, f.w, f.h, '#9E8F7D', 0.12) + rx(f.x + 0.08, f.y + 0.22, f.w - 0.16, f.h - 0.3, '#B7A895', 0.08);
      else if (f.t === 'chair') g += rx(f.x, f.y, 0.75, 0.75, '#B7A895', 0.18);
      else if (f.t === 'bedH') g += rx(f.x, f.y, f.w, f.h, '#F6F2EA', 0.05, '#A39B8E') + rx(f.x + 0.06, f.y + 0.1, 0.42, f.h - 0.2, '#DED5C8', 0.06) + rx(f.x + 0.75, f.y + 0.05, f.w - 0.8, f.h - 0.1, '#CDBCA3', 0.04);
      else if (f.t === 'bedV') g += rx(f.x, f.y, f.w, f.h, '#F6F2EA', 0.05, '#A39B8E') + rx(f.x + 0.1, f.y + 0.06, f.w - 0.2, 0.42, '#DED5C8', 0.06) + rx(f.x + 0.05, f.y + 0.75, f.w - 0.1, f.h - 0.8, '#CDBCA3', 0.04);
      else if (f.t === 'closet') { g += rx(f.x, f.y, f.w, f.h, '#E2D8C8', 0.02, '#A39B8E'); g += L(f.x, f.y, f.x + f.w, f.y + f.h, '#B5AB9C', 0.8) + L(f.x + f.w, f.y, f.x, f.y + f.h, '#B5AB9C', 0.8); g += T(f.x + f.w / 2, f.y + f.h / 2, '붙박이장', 9, '#6B645A', 0, 90); }
      else if (f.t === 'wc') g += `<ellipse cx="${X(f.x + 0.2)}" cy="${Y(f.y + 0.42)}" rx="${0.18 * S}" ry="${0.25 * S}" fill="#FFFFFF" stroke="#8E999E"/>` + rx(f.x, f.y, 0.4, 0.16, '#FFFFFF', 0.03, '#8E999E');
      else if (f.t === 'vanity') g += rx(f.x, f.y, f.w, f.h, '#FFFFFF', 0.04, '#8E999E') + `<ellipse cx="${X(f.x + f.w / 2)}" cy="${Y(f.y + f.h / 2)}" rx="${0.14 * S}" ry="${0.2 * S}" fill="none" stroke="#8E999E"/>`;
      else if (f.t === 'shower') { g += rx(f.x, f.y, f.w, f.h, '#D5E2E9', 0.02, '#7E95A3'); g += L(f.x, f.y, f.x + f.w, f.y + f.h, '#9FB3BF', 0.7) + L(f.x + f.w, f.y, f.x, f.y + f.h, '#9FB3BF', 0.7) + T(f.x + f.w / 2, f.y + f.h / 2 + 0.06, '샤워', 9.5, '#56707F'); }
      else if (f.t === 'washer') g += rx(f.x, f.y, 0.7, 0.7, '#FFFFFF', 0.06, '#8E999E') + `<circle cx="${X(f.x + 0.35)}" cy="${Y(f.y + 0.38)}" r="${0.22 * S}" fill="none" stroke="#8E999E"/>`;
      else if (f.t === 'counter') { g += rx(f.x, f.y, f.w, f.h, '#C4BAAB', 0.03, '#9C9285'); g += rx(f.x + 0.35, f.y + 0.12, 0.55, 0.38, '#E8EEF1', 0.05, '#8E999E'); [1.55, 1.85].forEach(dx => [0.2, 0.42].forEach(dy => g += `<circle cx="${X(f.x + dx)}" cy="${Y(f.y + dy)}" r="${0.08 * S}" fill="none" stroke="#6B645A"/>`)); g += T(f.x + 2.3, f.y + 0.4, '주방', 9.5, '#4A443C'); }
      else if (f.t === 'stool') f.xs.forEach(x => g += `<circle cx="${X(x)}" cy="${Y(f.y)}" r="${0.16 * S}" fill="#6B5A48"/>`);
      else if (f.t === 'table') { g += rx(f.x, f.y, f.w, f.h, '#8A6A4C', 0.06); [0.3, 0.9, 1.5].forEach(dx => { g += `<circle cx="${X(f.x + dx)}" cy="${Y(f.y - 0.17)}" r="${0.14 * S}" fill="#B7A895"/><circle cx="${X(f.x + dx)}" cy="${Y(f.y + f.h + 0.17)}" r="${0.14 * S}" fill="#B7A895"/>`; }); }
      else if (f.t === 'deckchair') g += rx(f.x, f.y, 0.75, 1.5, '#F6F2EA', 0.12, '#A39B8E') + rx(f.x + 0.05, f.y + 0.05, 0.65, 0.45, '#DED5C8', 0.1);
      else if (f.t === 'sky') g += rx(f.x, f.y, f.w, f.h, '#D3E3EF', 0.01, '#6F8FA8') + T(f.x + f.w / 2, f.y + f.h / 2 + 0.06, '천창', 9.5, '#56707F');
    });
    // 내부 벽 (각 실의 경계를 굵은 선으로)
    P.rooms.filter(r => !r.terrace).forEach(r => { g += `<polygon points="${poly(r.pts)}" fill="none" stroke="${WALL}" stroke-width="4" stroke-linejoin="miter"/>`; });
    // 외벽
    g += `<rect x="${X(0)}" y="${Y(0)}" width="${bw * S}" height="${D * S}" fill="none" stroke="${WALL}" stroke-width="9"/>`;
    if (bw < W) g += `<rect x="${X(bw)}" y="${Y(0)}" width="${(W - bw) * S}" height="${D * S}" fill="none" stroke="#9C9488" stroke-width="1.5"/>`;
    (P.above || []).forEach(([x, y, w, h, t]) => { g += `<rect x="${X(x)}" y="${Y(y)}" width="${w * S}" height="${h * S}" fill="none" stroke="#8C6D45" stroke-width="1.6" stroke-dasharray="8 5"/>` + T(Math.max(x + w / 2, 2.95), 1.95, t, 10, '#8C6D45', 700); });
    if (P.ridge) g += `<line x1="${X(4.0)}" y1="${Y(-0.35)}" x2="${X(4.0)}" y2="${Y(D + 0.35)}" stroke="#8C6D45" stroke-width="1" stroke-dasharray="14 4 3 4"/>` + `<text x="${X(4.0) + 4}" y="${Y(D + 0.32)}" font-size="9.5" fill="#8C6D45">용마루 (지붕 최고점)</text>`;
    (P.rail || []).forEach(([x1, y1, x2, y2]) => g += L(x1, y1, x2, y2, '#5B7C93', 3.5) + L(x1, y1, x2, y2, '#D6E3EC', 1.2));
    // 트인 구간
    (P.open || []).forEach(([x1, y1, x2, y2]) => g += L(x1 + (x1 === x2 ? 0 : 0.06), y1 + (y1 === y2 ? 0 : 0.06), x2 - (x1 === x2 ? 0 : 0.06), y2 - (y1 === y2 ? 0 : 0.06), FLOOR_GAP, 6));
    // 창
    P.win.forEach(([x1, y1, x2, y2, t]) => {
      const hz = y1 === y2, o = 2.6;
      g += L(x1, y1, x2, y2, '#FFFFFF', 10);
      g += hz ? `<line x1="${X(x1)}" y1="${Y(y1) - o}" x2="${X(x2)}" y2="${Y(y2) - o}" stroke="#4F7189" stroke-width="1.4"/><line x1="${X(x1)}" y1="${Y(y1) + o}" x2="${X(x2)}" y2="${Y(y2) + o}" stroke="#4F7189" stroke-width="1.4"/><line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="#9DB4C4" stroke-width="0.8"/>`
        : `<line x1="${X(x1) - o}" y1="${Y(y1)}" x2="${X(x2) - o}" y2="${Y(y2)}" stroke="#4F7189" stroke-width="1.4"/><line x1="${X(x1) + o}" y1="${Y(y1)}" x2="${X(x2) + o}" y2="${Y(y2)}" stroke="#4F7189" stroke-width="1.4"/><line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="#9DB4C4" stroke-width="0.8"/>`;
      if (t === 's') { const mx = (x1 + x2) / 2, my = (y1 + y2) / 2; g += hz ? L(mx, y1 - 0.08, mx, y1 + 0.08, '#4F7189', 1.4) : L(x1 - 0.08, my, x1 + 0.08, my, '#4F7189', 1.4); }
    });
    // 문 (벽을 지우고 문짝 + 열림 호)
    P.doors.forEach(([hx, hy, cx, cy, nx, ny, ext]) => {
      const w = Math.hypot(cx - hx, cy - hy), ox = hx + nx * w, oy = hy + ny * w;
      g += L(hx, hy, cx, cy, ext ? '#FFFFFF' : FLOOR_GAP, ext ? 10 : 6);
      const cr = (cx - hx) * ny - (cy - hy) * nx; // 닫힘→열림 회전 방향
      g += L(hx, hy, ox, oy, '#5A534A', 2);
      g += `<path d="M${X(cx).toFixed(1)},${Y(cy).toFixed(1)} A${(w * S).toFixed(1)},${(w * S).toFixed(1)} 0 0 ${cr > 0 ? 1 : 0} ${X(ox).toFixed(1)},${Y(oy).toFixed(1)}" fill="none" stroke="#9C9488" stroke-width="0.9" stroke-dasharray="3 2"/>`;
      if (ext) g += T((hx + cx) / 2, hy - 0.22, '현관문', 9.5, '#8C6D45', 700);
    });
    // 실명·면적
    P.rooms.forEach(r => {
      if (r.stair) { const [x0, y0] = r.pts[0]; g += T(r.stair === 'loft' ? x0 + 1.6 : x0 + 1.05, y0 + 0.33, '계단', 11, '#2E2A26', 700); return; }
      const a = area(r.pts);
      const c = (P.label && P.label[r.n]) || [r.pts.reduce((s, p) => s + p[0], 0) / r.pts.length, r.pts.reduce((s, p) => s + p[1], 0) / r.pts.length];
      const big = !r.small && a > 5;
      g += T(c[0], c[1], r.n, big ? 14 : 11.5, '#2E2A26', 700);
      const bwid = Math.max(...r.pts.map(p => p[0])) - Math.min(...r.pts.map(p => p[0]));
      g += T(c[0], c[1] + 0.27, r.areaText || (bwid < 1.8 ? f1(a / PYC) + '평' : f1(a) + '㎡ · ' + f1(a / PYC) + '평'), 10, '#7D766C');
    });
    // 치수
    const dimH = (x1, x2, y, t) => `<line x1="${X(x1)}" y1="${y}" x2="${X(x2)}" y2="${y}" stroke="#8C6D45" stroke-width="0.9"/><line x1="${X(x1)}" y1="${y - 5}" x2="${X(x1)}" y2="${y + 5}" stroke="#8C6D45"/><line x1="${X(x2)}" y1="${y - 5}" x2="${X(x2)}" y2="${y + 5}" stroke="#8C6D45"/><text x="${(X(x1) + X(x2)) / 2}" y="${y - 5}" font-size="10.5" fill="#8C6D45" text-anchor="middle">${t}</text>`;
    const dimV = (y1, y2, x, t) => `<line x1="${x}" y1="${Y(y1)}" x2="${x}" y2="${Y(y2)}" stroke="#8C6D45" stroke-width="0.9"/><line x1="${x - 5}" y1="${Y(y1)}" x2="${x + 5}" y2="${Y(y1)}" stroke="#8C6D45"/><line x1="${x - 5}" y1="${Y(y2)}" x2="${x + 5}" y2="${Y(y2)}" stroke="#8C6D45"/><text x="${x - 6}" y="${(Y(y1) + Y(y2)) / 2}" font-size="10.5" fill="#8C6D45" text-anchor="middle" transform="rotate(-90 ${x - 6} ${(Y(y1) + Y(y2)) / 2})">${t}</text>`;
    g += dimH(0, bw, Y(0) - 24, (bw * 1000).toLocaleString());
    if (bw < W) g += dimH(bw, W, Y(0) - 24, ((W - bw) * 1000).toLocaleString());
    g += dimV(0, D, X(0) - 24, (D * 1000).toLocaleString());
    // 방위·축척
    g += `<g transform="translate(${vw - 34},${vh - 46})"><circle r="14" fill="none" stroke="#2E2A26" stroke-width="1"/><path d="M0,-12 L5,6 L0,2 L-5,6 Z" fill="#2E2A26"/><text y="-17" text-anchor="middle" font-size="10" font-weight="700" fill="#2E2A26">N</text></g>`;
    g += `<g transform="translate(${pad},${vh - 20})"><rect width="${S}" height="5" fill="#2E2A26"/><rect x="${S}" width="${S}" height="5" fill="none" stroke="#2E2A26"/><rect x="${2 * S}" width="${S * 2}" height="5" fill="#2E2A26"/><text x="0" y="-4" font-size="9" fill="#7D766C">0</text><text x="${S * 4}" y="-4" font-size="9" fill="#7D766C" text-anchor="middle">4m</text></g>`;
    return `<svg viewBox="0 0 ${vw} ${vh}" class="dz-svg" role="img" aria-label="${P.title}"><defs>${defs()}</defs><rect width="${vw}" height="${vh}" fill="#F7F3EC"/>${g}</svg>`;
  }

  function defs() {
    return `<marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#8C6D45"/></marker>
      <pattern id="tile" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M14,0 L0,0 0,14" fill="none" stroke="#B9C3C8" stroke-width=".7"/></pattern>
      <pattern id="voidP" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><rect width="10" height="10" fill="#F7F3EC"/><line x1="0" y1="0" x2="0" y2="10" stroke="#D8D0C3" stroke-width="1"/></pattern>
      <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="#A39B8E" stroke-width="1.2"/></pattern>
      <pattern id="stone" width="46" height="18" patternUnits="userSpaceOnUse"><rect width="46" height="18" fill="#3E4147"/><rect x="1" y="1" width="27" height="7" fill="#4A4D54"/><rect x="30" y="1" width="15" height="7" fill="#45484F"/><rect x="1" y="10" width="13" height="7" fill="#46494F"/><rect x="16" y="10" width="29" height="7" fill="#4C4F56"/></pattern>
      <pattern id="stoneL" width="30" height="12" patternUnits="userSpaceOnUse"><rect width="30" height="12" fill="#8E9095"/><rect x=".5" y=".5" width="18" height="5" fill="#9A9CA1"/><rect x="19.5" y=".5" width="10" height="5" fill="#94969B"/><rect x=".5" y="6.5" width="9" height="5" fill="#96989D"/><rect x="10.5" y="6.5" width="19" height="5" fill="#A0A2A7"/></pattern>
      <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE7BD"/><stop offset=".55" stop-color="#F6C27A"/><stop offset="1" stop-color="#D99A52"/></linearGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9D6E2"/><stop offset="1" stop-color="#8FA4B8"/></linearGradient>
      <radialGradient id="lamp"><stop offset="0" stop-color="#FFE6B0" stop-opacity=".95"/><stop offset=".35" stop-color="#FFCF85" stop-opacity=".45"/><stop offset="1" stop-color="#FFB960" stop-opacity="0"/></radialGradient>`;
  }

  // ── 높이 (m) ── 용마루는 남북 방향(x=4.0), 박공면이 남·북을 향함
  const Hh = { fl1: 0.3, fl2: 3.3, eave: 6.0, loft: 5.9, ridgeIn: 8.3, ridge: 8.6 };
  const RK = (Hh.ridge - Hh.eave) / 4.0;            // 지붕 경사 (외부)
  const roofZ = x => Hh.ridge - RK * Math.abs(x - 4.0); // 외부 지붕면 높이
  const roofIn = x => Hh.ridgeIn - RK * Math.abs(x - 4.0);

  function levels(x, Z, labels, zs) {
    return zs.map((z, i) => `<line x1="${x - 6}" y1="${Z(z)}" x2="${x + 6}" y2="${Z(z)}" stroke="#8C6D45"/><path d="M${x - 4},${Z(z) - 6} L${x + 4},${Z(z) - 6} L${x},${Z(z)} Z" fill="#8C6D45"/><text x="${x + 9}" y="${Z(z) + 3.5}" font-size="10" fill="#8C6D45">${labels[i]}</text>`).join('');
  }
  const LV = [['1FL +0.3', 0.3], ['2FL +3.3', 3.3], ['처마 +6.0', 6.0], ['최고 +8.6', 8.6]];

  // ── 입면도 ──
  function elevSVG(side) {
    const S = 40, pad = 56, base = 9.2 * S + pad;
    const Wd = side === 'S' ? 9.6 : 6.2, vw = (Wd + 3.2) * S + pad * 2, vh = base + 46;
    const X = x => pad + x * S, Z = z => base - z * S;
    const rect = (x1, z1, x2, z2, fill, st) => `<rect x="${X(x1)}" y="${Z(z2)}" width="${(x2 - x1) * S}" height="${(z2 - z1) * S}" fill="${fill}" stroke="${st || '#2E2A26'}" stroke-width="1.2"/>`;
    const win = (x1, z1, x2, z2, div) => { let s = rect(x1, z1, x2, z2, 'url(#glass)'); for (let i = 1; i < (div || 1); i++) { const xx = x1 + (x2 - x1) * i / div; s += `<line x1="${X(xx)}" y1="${Z(z2)}" x2="${X(xx)}" y2="${Z(z1)}" stroke="#2E2A26" stroke-width="1.6"/>`; } return s; };
    let g = `<rect width="${vw}" height="${vh}" fill="#F7F3EC"/><line x1="10" y1="${Z(0)}" x2="${vw - 10}" y2="${Z(0)}" stroke="#2E2A26" stroke-width="2"/>`;
    if (side === 'S') { // 남측 = 박공 정면
      g += rect(0, 0, 9.6, Hh.fl2, 'url(#stoneL)') + rect(-0.1, Hh.fl2 - 0.25, 9.7, Hh.fl2, '#2E2A26');
      g += `<polygon points="${X(0)},${Z(Hh.fl2)} ${X(8)},${Z(Hh.fl2)} ${X(8)},${Z(Hh.eave)} ${X(4)},${Z(Hh.ridge - 0.25)} ${X(0)},${Z(Hh.eave)}" fill="#FBFAF7" stroke="#2E2A26" stroke-width="1.2"/>`;
      // 박공 삼각창 (보이드 채광)
      g += `<polygon points="${X(1.7)},${Z(6.15)} ${X(6.3)},${Z(6.15)} ${X(4)},${Z(7.85)}" fill="url(#glass)" stroke="#2E2A26" stroke-width="1.4"/><line x1="${X(4)}" y1="${Z(6.15)}" x2="${X(4)}" y2="${Z(7.85)}" stroke="#2E2A26" stroke-width="1.6"/>`;
      g += win(0.4, 3.6, 3.6, 5.85, 3) + win(4.6, 3.9, 7.6, 5.85, 3);
      g += rect(3.75, 3.6, 4.45, 5.85, '#A9784E', '#6B4A30'); for (let x = 3.83; x < 4.45; x += 0.12) g += `<line x1="${X(x)}" y1="${Z(5.85)}" x2="${X(x)}" y2="${Z(3.6)}" stroke="#7E5636" stroke-width="1.4"/>`;
      g += `<polyline points="${X(-0.4)},${Z(roofZ(-0.4))} ${X(4)},${Z(Hh.ridge)} ${X(8.4)},${Z(roofZ(8.4))}" fill="none" stroke="#1D2024" stroke-width="8" stroke-linejoin="miter"/>`;
      g += win(0.3, Hh.fl1, 4.0, 2.9, 4) + win(4.8, 0.9, 7.4, 2.6, 3) + win(8.3, 1.7, 9.3, 2.6, 1);
      g += `<rect x="${X(8.0)}" y="${Z(4.4)}" width="${1.6 * S}" height="${1.1 * S}" fill="#BFD0DD" opacity=".55" stroke="#2E2A26"/>`;
      g += rect(-0.8, 0, 6.2, Hh.fl1, '#A88664', '#6B4A30');
      [4.4, 7.85, 9.45].forEach(x => g += `<circle cx="${X(x)}" cy="${Z(2.7)}" r="10" fill="url(#lamp)"/><rect x="${X(x) - 2}" y="${Z(2.75)}" width="4" height="7" fill="#2E2A26"/>`);
      g += levels(X(9.6) + 22, Z, LV.map(v => v[0]), LV.map(v => v[1]));
    } else { // 서측 = 긴 면 (지붕 경사면이 보임) — 왼쪽 북, 오른쪽 남
      g += rect(0, 0, 6.2, Hh.fl2, 'url(#stoneL)') + rect(-0.1, Hh.fl2 - 0.25, 6.3, Hh.fl2, '#2E2A26');
      g += rect(0, Hh.fl2, 6.2, Hh.eave, '#FBFAF7');
      g += `<polygon points="${X(-0.4)},${Z(roofZ(-0.4))} ${X(6.6)},${Z(roofZ(-0.4))} ${X(6.6)},${Z(Hh.ridge)} ${X(-0.4)},${Z(Hh.ridge)}" fill="#2B2F35" stroke="#1D2024" stroke-width="1.2"/>`;
      for (let y = -0.2; y < 6.6; y += 0.45) g += `<line x1="${X(y)}" y1="${Z(roofZ(-0.4))}" x2="${X(y)}" y2="${Z(Hh.ridge)}" stroke="#3A3F46" stroke-width="0.9"/>`;
      g += rect(3.6, 6.6, 4.6, 7.6, '#5D7891', '#1D2024') + rect(4.9, 6.6, 5.9, 7.6, '#5D7891', '#1D2024');
      g += win(1.0, 0.9, 5.0, 2.6, 3) + win(3.6, 3.7, 5.8, 5.7, 2) + win(0.6, 4.6, 1.6, 5.4, 1);
      g += rect(5.95, 0, 7.6, Hh.fl1, '#A88664', '#6B4A30');
      g += levels(X(6.6) + 22, Z, LV.map(v => v[0]), LV.map(v => v[1]));
      g += `<text x="${X(0)}" y="${Z(0) + 16}" font-size="10" fill="#7D766C">북</text><text x="${X(6.2)}" y="${Z(0) + 16}" font-size="10" fill="#7D766C" text-anchor="end">남</text>`;
    }
    return `<svg viewBox="0 0 ${vw} ${vh}" class="dz-svg"><defs>${defs()}</defs>${g}</svg>`;
  }

  // ── 단면도 ── A-A: 동서 방향 절단(y=4.2, 북쪽을 봄) / B-B: 남북 방향 절단(x=3.0, 서쪽을 봄)
  function sectionSVG(kind) {
    const S = 40, pad = 56, base = 9.2 * S + pad;
    const span = kind === 'A' ? 9.6 : 6.2, vw = (span + 3.4) * S + pad * 2, vh = base + 70;
    const X = u => pad + u * S, Z = z => base - z * S;
    const cut = (u1, z1, u2, z2) => `<rect x="${X(u1)}" y="${Z(z2)}" width="${(u2 - u1) * S}" height="${(z2 - z1) * S}" fill="#2E2A26"/>`;
    const tx = (u, z, s, size, col, w) => `<text x="${X(u)}" y="${Z(z)}" text-anchor="middle" font-size="${size}" ${w ? 'font-weight="700"' : ''} fill="${col}">${s}</text>`;
    const dim = (u, z1, z2, t) => `<line x1="${X(u)}" y1="${Z(z1)}" x2="${X(u)}" y2="${Z(z2)}" stroke="#8C6D45" stroke-width="1" marker-start="url(#arr)" marker-end="url(#arr)"/><text x="${X(u) + 6}" y="${(Z(z1) + Z(z2)) / 2}" font-size="11" font-weight="700" fill="#8C6D45">${t}</text>`;
    let g = `<rect width="${vw}" height="${vh}" fill="#F7F3EC"/><rect x="10" y="${Z(0)}" width="${vw - 20}" height="38" fill="#E6DCCB"/><line x1="10" y1="${Z(0)}" x2="${vw - 10}" y2="${Z(0)}" stroke="#2E2A26" stroke-width="2"/>`;
    if (kind === 'A') {
      // 실내
      g += `<rect x="${X(0)}" y="${Z(3.0)}" width="${4.3 * S}" height="${2.7 * S}" fill="#F0E7D8"/><rect x="${X(4.3)}" y="${Z(2.7)}" width="${5.3 * S}" height="${2.4 * S}" fill="#F3ECE1"/>`;
      g += tx(2.15, 1.8, '파티룸', 12.5, '#2E2A26', 1) + tx(2.15, 1.45, '천장고 2.7m', 10, '#7D766C') + tx(6.1, 1.5, '침실', 12, '#2E2A26', 1) + tx(8.75, 1.5, '욕실', 11, '#2E2A26', 1);
      g += `<polygon points="${X(0)},${Z(Hh.fl2)} ${X(8)},${Z(Hh.fl2)} ${X(8)},${Z(roofIn(8))} ${X(4)},${Z(Hh.ridgeIn)} ${X(0)},${Z(roofIn(0))}" fill="#F5EFE4"/>`;
      // 뒤쪽(북)에 보이는 다락: 바닥 슬래브 + 유리난간 + 침대 (박공 실내 윤곽 안으로 클리핑)
      g += `<clipPath id="gin"><polygon points="${X(0)},${Z(Hh.fl2)} ${X(8)},${Z(Hh.fl2)} ${X(8)},${Z(roofIn(8))} ${X(4)},${Z(Hh.ridgeIn)} ${X(0)},${Z(roofIn(0))}"/></clipPath><g clip-path="url(#gin)">`;
      g += `<rect x="${X(0)}" y="${Z(Hh.loft)}" width="${4.3 * S}" height="${0.25 * S}" fill="#B8AD9C"/><rect x="${X(0)}" y="${Z(Hh.loft + 1.0)}" width="${4.3 * S}" height="${1.0 * S}" fill="#BCD0DD" opacity=".55"/><line x1="${X(0)}" y1="${Z(Hh.loft + 1.0)}" x2="${X(4.3)}" y2="${Z(Hh.loft + 1.0)}" stroke="#6B7F8E" stroke-width="2"/>`;
      g += `<rect x="${X(2.6)}" y="${Z(Hh.loft + 0.55)}" width="${1.6 * S}" height="${0.5 * S}" rx="4" fill="#E9E1D3" stroke="#A39B8E"/>`;
      g += `</g>` + tx(2.5, 6.55, '다락 침실 (주방 위)', 11.5, '#2E2A26', 1);
      g += `<rect x="${X(0)}" y="${Z(Hh.loft - 0.25)}" width="${4.3 * S}" height="${2.35 * S}" fill="#E8DFD0"/>`;
      g += tx(2.15, 4.4, '주방 (다락 아래 천장고 2.35m)', 10.5, '#5E574E');
      g += tx(6.1, 4.3, '거실·식당 보이드', 12.5, '#2E2A26', 1);
      g += `<line x1="${X(4.0)}" y1="${Z(Hh.fl2)}" x2="${X(4.0)}" y2="${Z(Hh.ridgeIn)}" stroke="#8C6D45" stroke-width="1" marker-start="url(#arr)" marker-end="url(#arr)"/><text x="${X(4.0) + 14}" y="${Z(5.0)}" font-size="12" font-weight="700" fill="#8C6D45">보이드 5.0m</text>`;
      // 구조체
      g += cut(-0.25, -0.5, 9.85, Hh.fl1) + cut(-0.25, Hh.fl2 - 0.3, 9.85, Hh.fl2);
      g += cut(-0.25, Hh.fl1, 0, Hh.fl2) + cut(9.6, Hh.fl1, 9.85, Hh.fl2) + cut(4.25, Hh.fl1, 4.35, 3.0) + cut(7.85, Hh.fl1, 7.95, 2.7);
      g += cut(-0.25, Hh.fl2, 0, Hh.eave) + cut(8.0, Hh.fl2, 8.25, Hh.eave);
      g += `<polygon points="${X(-0.6)},${Z(roofZ(-0.6))} ${X(4)},${Z(Hh.ridge + 0.02)} ${X(8.6)},${Z(roofZ(8.6))} ${X(8.6)},${Z(roofZ(8.6) - 0.3)} ${X(4)},${Z(Hh.ridge - 0.28)} ${X(-0.6)},${Z(roofZ(-0.6) - 0.3)}" fill="#2E2A26"/>`;
      // 테라스
      g += `<rect x="${X(8.25)}" y="${Z(Hh.fl2 + 1.1)}" width="${1.35 * S}" height="${1.1 * S}" fill="#BCD0DD" opacity=".5"/>` + tx(8.9, Hh.fl2 + 0.3, '테라스', 10, '#6B4A30');
      g += levels(X(9.85) + 18, Z, LV.map(v => v[0]), LV.map(v => v[1]));
      g += `<text x="${X(0)}" y="${vh - 10}" font-size="10" fill="#7D766C">서</text><text x="${X(9.6)}" y="${vh - 10}" font-size="10" fill="#7D766C" text-anchor="end">동</text>`;
    } else {
      const rz = roofIn(3.0);   // x=3.0 위치의 실내 지붕 높이 (이 단면에서는 수평)
      g += `<rect x="${X(0)}" y="${Z(3.0)}" width="${6.2 * S}" height="${2.7 * S}" fill="#F0E7D8"/>` + tx(3.1, 1.8, '파티룸', 12.5, '#2E2A26', 1) + tx(3.1, 1.45, '천장고 2.7m', 10, '#7D766C');
      g += `<rect x="${X(0)}" y="${Z(Hh.loft - 0.25)}" width="${3.2 * S}" height="${(Hh.loft - 0.25 - Hh.fl2) * S}" fill="#E8DFD0"/>` + tx(1.6, 4.6, '주방', 12, '#2E2A26', 1) + tx(1.6, 4.25, '천장고 2.35m', 10, '#7D766C');
      g += `<rect x="${X(0)}" y="${Z(rz)}" width="${3.2 * S}" height="${(rz - Hh.loft) * S}" fill="#F3ECE0"/>` + tx(1.6, Hh.loft + 0.95, '다락 침실', 12, '#2E2A26', 1);
      g += `<rect x="${X(3.2)}" y="${Z(rz)}" width="${3.0 * S}" height="${(rz - Hh.fl2) * S}" fill="#F5EFE4"/>` + tx(4.2, 6.6, '거실 보이드', 12.5, '#2E2A26', 1);
      g += dim(5.3, Hh.fl2, rz, `${f1(rz - Hh.fl2)}m`) + `<text x="${X(5.3) + 6}" y="${(Z(Hh.fl2) + Z(rz)) / 2 + 14}" font-size="9.5" fill="#8C6D45">(용마루 5.0m)</text>`;
      // 다락 슬래브·난간·침대, 주방 가구
      g += cut(-0.25, Hh.loft - 0.25, 3.2, Hh.loft);
      g += `<rect x="${X(3.15)}" y="${Z(Hh.loft + 1.0)}" width="5" height="${1.0 * S}" fill="#6B7F8E"/><rect x="${X(0.6)}" y="${Z(Hh.loft + 0.5)}" width="${2.0 * S}" height="${0.5 * S}" rx="4" fill="#E9E1D3" stroke="#A39B8E"/>`;
      g += `<rect x="${X(0.1)}" y="${Z(Hh.fl2 + 0.9)}" width="${0.6 * S}" height="${0.9 * S}" fill="#BCB2A3"/><rect x="${X(2.3)}" y="${Z(Hh.fl2 + 0.95)}" width="${0.85 * S}" height="${0.95 * S}" fill="#9C9285"/><rect x="${X(3.85)}" y="${Z(Hh.fl2 + 0.8)}" width="${0.9 * S}" height="${0.8 * S}" rx="6" fill="#B5A693"/>`;
      g += `<rect x="${X(0.3)}" y="${Z(Hh.fl1 + 2.2)}" width="${0.55 * S}" height="${2.2 * S}" fill="#6B4F3A"/><rect x="${X(1.5)}" y="${Z(Hh.fl1 + 1.0)}" width="${0.75 * S}" height="${1.0 * S}" fill="#9C9285"/><rect x="${X(3.6)}" y="${Z(Hh.fl1 + 0.75)}" width="${0.85 * S}" height="${0.75 * S}" rx="6" fill="#B5A693"/>`;
      // 구조체
      g += cut(-0.25, -0.5, 6.45, Hh.fl1) + cut(-0.25, Hh.fl2 - 0.3, 6.45, Hh.fl2);
      g += cut(-0.25, Hh.fl1, 0, rz + 0.3) + cut(6.2, Hh.fl1, 6.45, rz + 0.3) + cut(-0.5, rz, 6.7, rz + 0.3);
      g += `<rect x="${X(6.2)}" y="${Z(2.9)}" width="${0.25 * S}" height="${2.6 * S}" fill="#9FB6C8"/><rect x="${X(6.2)}" y="${Z(rz - 0.1)}" width="${0.25 * S}" height="${(rz - 0.1 - 3.6) * S}" fill="#9FB6C8"/>`;
      g += `<rect x="${X(6.45)}" y="${Z(Hh.fl1)}" width="${2.4 * S}" height="${Hh.fl1 * S}" fill="#A88664"/>` + tx(7.65, Hh.fl1 + 0.15, '데크', 10, '#6B4A30');
      g += levels(X(8.9) + 10, Z, ['1FL +0.3', '2FL +3.3', `다락 +${Hh.loft}`, `지붕 +${f1(rz)}`], [0.3, 3.3, Hh.loft, rz]);
      g += `<text x="${X(0)}" y="${vh - 10}" font-size="10" fill="#7D766C">북 (주방·다락)</text><text x="${X(6.2)}" y="${vh - 10}" font-size="10" fill="#7D766C" text-anchor="end">남 (정원·조망)</text>`;
    }
    return `<svg viewBox="0 0 ${vw} ${vh}" class="dz-svg"><defs>${defs()}</defs>${g}</svg>`;
  }

  // ── 외관 투시도 (간이 3D 투영) ──
  function exteriorSVG(mode) {
    const VW = 1200, VH = 720;
    const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], nrm = a => { const l = Math.hypot(...a); return a.map(v => v / l); };
    const cam = mode === 'day' ? [-14, 29, 3.4] : [-12.5, 27.5, 3.0], tgt = [4.4, 3.6, 3.9];
    const f = nrm(sub(tgt, cam)), r = nrm(cross([0, 0, 1], f)), u = cross(f, r), FL = 1500;
    const CX = mode === 'day' ? VW / 2 : VW * 0.62;
    const P = p => { const d = sub(p, cam), z = dot(d, f); return [CX + FL * dot(d, r) / z, VH * 0.58 - FL * dot(d, u) / z]; };
    const pg = (pts, fill, extra) => `<polygon points="${pts.map(P).map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' ')}" fill="${fill}" ${extra || ''}/>`;
    const ln = (a, b, st, w) => { const p = P(a), q = P(b); return `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="${st}" stroke-width="${w}"/>`; };
    const night = mode !== 'day', WIN = night ? 'url(#glowX)' : 'url(#glassX)';
    const sq = (x1, z1, x2, z2, y, fill, ex) => pg([[x1, y, z1], [x2, y, z1], [x2, y, z2], [x1, y, z2]], fill, ex);
    const wq = (y1, z1, y2, z2, x, fill, ex) => pg([[x, y1, z1], [x, y2, z1], [x, y2, z2], [x, y1, z2]], fill, ex);
    const mull = (x1, z1, x2, z2, y, n) => { let s = ''; for (let i = 1; i < n; i++) { const xx = x1 + (x2 - x1) * i / n; s += ln([xx, y, z1], [xx, y, z2], '#1E2125', 2.2); } return s; };
    let g = `<rect width="${VW}" height="${VH}" fill="url(#sky${night ? 'N' : 'D'})"/>`;
    g += `<path d="M0,410 C150,330 260,360 380,320 C520,270 640,330 760,300 C900,262 1040,320 1200,292 L1200,470 L0,470 Z" fill="${night ? '#2A3448' : '#9FB3B8'}" opacity=".85"/>`;
    for (let i = 0; i < 26; i++) { const x = i * 48 + (i % 3) * 9, h = 120 + (i * 37 % 90); g += `<path d="M${x},470 L${x + 24},${470 - h} L${x + 48},470 Z" fill="${night ? '#16231E' : '#3F5E4A'}" opacity="${0.75 + (i % 2) * 0.2}"/>`; }
    g += `<rect y="455" width="${VW}" height="${VH - 455}" fill="${night ? '#1C2A20' : '#5E7F55'}"/>`;
    g += pg([[-6, 6.2, 0], [12, 6.2, 0], [14, 14, 0], [-8, 14, 0]], night ? '#24331F' : '#6E8F5C');
    g += pg([[-0.9, 6.2, 0.3], [6.4, 6.2, 0.3], [6.4, 8.9, 0.3], [-0.9, 8.9, 0.3]], night ? '#6E5642' : '#B08D69');
    g += pg([[-0.9, 8.9, 0], [6.4, 8.9, 0], [6.4, 8.9, 0.3], [-0.9, 8.9, 0.3]], night ? '#4A3A2D' : '#8A6A4C') + pg([[-0.9, 6.2, 0], [-0.9, 8.9, 0], [-0.9, 8.9, 0.3], [-0.9, 6.2, 0.3]], night ? '#4A3A2D' : '#8A6A4C');
    for (let x = -0.6; x < 6.4; x += 0.35) g += ln([x, 6.2, 0.3], [x, 8.9, 0.3], night ? '#5E4938' : '#9C7B5B', 0.8);
    // 1층
    g += wq(0, 0, 6.2, 3.3, 0, night ? 'url(#stoneN)' : 'url(#stoneD)') + sq(0, 0, 9.6, 3.3, 6.2, night ? 'url(#stoneN)' : 'url(#stoneD)');
    g += pg([[8.0, 0, 3.3], [9.6, 0, 3.3], [9.6, 6.2, 3.3], [8.0, 6.2, 3.3]], night ? '#5A4636' : '#A88664');
    g += sq(-0.08, 3.05, 9.68, 3.33, 6.28, '#1E2125') + wq(-0.08, 3.05, 6.28, 3.33, -0.08, '#25282D');
    // 2층 서측 긴 벽 + 지붕 서측 경사면
    g += wq(0, 3.3, 6.2, Hh.eave, 0, night ? '#C9CCD1' : '#ECEBE7');
    const rp = (y, t) => [-0.4 + 4.4 * t, y, roofZ(-0.4) + (Hh.ridge - roofZ(-0.4)) * t];
    g += pg([rp(-0.4, 0), rp(6.6, 0), rp(6.6, 1), rp(-0.4, 1)], night ? '#1B1E22' : '#2C3036');
    for (let y = -0.25; y < 6.6; y += 0.42) g += ln(rp(y, 0), rp(y, 1), night ? '#262A2F' : '#3B4047', 1);
    g += pg([rp(3.4, 0.3), rp(4.4, 0.3), rp(4.4, 0.58), rp(3.4, 0.58)], night ? '#8FB4D6' : '#6E8FAA') + pg([rp(4.9, 0.3), rp(5.9, 0.3), rp(5.9, 0.58), rp(4.9, 0.58)], night ? '#8FB4D6' : '#6E8FAA');
    // 2층 남측 박공 정면
    g += pg([[0, 6.2, 3.3], [8, 6.2, 3.3], [8, 6.2, Hh.eave], [4, 6.2, Hh.ridge - 0.2], [0, 6.2, Hh.eave]], night ? '#DCDDE0' : '#FBFAF7');
    for (let x = 1; x < 8; x++) g += ln([x, 6.2, 3.33], [x, 6.2, Math.min(Hh.eave, roofZ(x) - 0.2)], night ? '#C3C5C9' : '#E4E1DA', 0.8);
    g += pg([[1.7, 6.21, 6.15], [6.3, 6.21, 6.15], [4, 6.21, 7.85]], WIN) + ln([4, 6.21, 6.15], [4, 6.21, 7.85], '#1E2125', 2.2);
    g += `<polyline points="${[[-0.4, 6.6, roofZ(-0.4)], [4, 6.6, Hh.ridge + 0.05], [8.4, 6.6, roofZ(8.4)]].map(P).map(q => q.join(',')).join(' ')}" fill="none" stroke="#111316" stroke-width="9" stroke-linejoin="miter"/>`;
    g += ln(rp(-0.4, 0), rp(6.6, 0), '#111316', 5);
    // 창
    g += sq(0.3, 0.3, 4.0, 2.9, 6.21, WIN) + mull(0.3, 0.3, 4.0, 2.9, 6.21, 4) + sq(4.8, 0.9, 7.4, 2.6, 6.21, WIN) + mull(4.8, 0.9, 7.4, 2.6, 6.21, 3);
    g += sq(8.3, 1.7, 9.3, 2.6, 6.21, night ? '#C79A62' : 'url(#glassX)') + wq(1.0, 0.9, 5.0, 2.6, -0.01, WIN);
    g += sq(0.4, 3.6, 3.6, 5.85, 6.21, WIN) + mull(0.4, 3.6, 3.6, 5.85, 6.21, 3) + sq(4.6, 3.9, 7.6, 5.85, 6.21, WIN) + mull(4.6, 3.9, 7.6, 5.85, 6.21, 3);
    g += sq(3.75, 3.6, 4.45, 5.85, 6.215, '#9A6B45'); for (let x = 3.8; x < 4.45; x += 0.11) g += ln([x, 6.22, 3.6], [x, 6.22, 5.85], '#6E4A2E', 1.6);
    g += wq(3.6, 3.7, 5.8, 5.7, -0.01, WIN) + wq(0.6, 4.6, 1.6, 5.4, -0.01, WIN);
    g += pg([[8.0, 6.2, 3.3], [9.6, 6.2, 3.3], [9.6, 6.2, 4.4], [8.0, 6.2, 4.4]], '#B8CCDA', 'opacity=".35"') + ln([8.0, 6.2, 4.4], [9.6, 6.2, 4.4], '#1E2125', 2);
    if (night) {
      [[4.4, 6.25, 2.7], [7.85, 6.25, 2.7], [9.45, 6.25, 2.7], [-0.05, 0.5, 2.7], [-0.05, 5.5, 2.7]].forEach(p => { const q = P(p); g += `<circle cx="${q[0]}" cy="${q[1] + 16}" r="46" fill="url(#lampX)"/><rect x="${q[0] - 3}" y="${q[1] - 4}" width="6" height="12" fill="#111316"/>`; });
      [[0.3, 6.25, 0.3], [4.0, 6.25, 0.3]].forEach(p => { const q = P(p); g += `<ellipse cx="${q[0]}" cy="${q[1] + 4}" rx="90" ry="16" fill="url(#lampX)" opacity=".6"/>`; });
      [[-1.6, 9.6, 0], [3.0, 9.8, 0], [7.4, 9.4, 0]].forEach(p => { const q = P(p); g += `<rect x="${q[0] - 3}" y="${q[1] - 26}" width="6" height="26" fill="#2A2D31"/><circle cx="${q[0]}" cy="${q[1] - 26}" r="20" fill="url(#lampX)"/>`; });
    }
    const box = (x1, y1, x2, y2, z, c1, c2) => pg([[x1, y2, 0.3], [x2, y2, 0.3], [x2, y2, z], [x1, y2, z]], c1) + pg([[x1, y1, z], [x2, y1, z], [x2, y2, z], [x1, y2, z]], c2) + pg([[x1, y1, 0.3], [x1, y2, 0.3], [x1, y2, z], [x1, y1, z]], c1);
    g += box(0.4, 7.2, 2.6, 8.0, 0.75, night ? '#8E8478' : '#CFC6B8', night ? '#A79C8E' : '#E6DED2') + box(3.4, 7.3, 4.6, 8.1, 0.65, night ? '#4A3A2D' : '#7A5C44', night ? '#5C4838' : '#93705A');
    g += `<path d="M1050,720 C1020,560 1080,470 1060,380 C1110,470 1150,560 1140,720 Z" fill="${night ? '#0F1A14' : '#2F4B37'}" opacity=".9"/><path d="M60,720 C40,600 90,520 70,430 C120,520 150,610 140,720 Z" fill="${night ? '#0F1A14' : '#2F4B37'}" opacity=".9"/>`;
    const defsX = `<linearGradient id="skyN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#121B2E"/><stop offset=".55" stop-color="#3A4A68"/><stop offset="1" stop-color="#B8907A"/></linearGradient>
      <linearGradient id="skyD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FB3D4"/><stop offset="1" stop-color="#E8EEF0"/></linearGradient>
      <linearGradient id="glowX" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE8C2"/><stop offset=".6" stop-color="#F4BE76"/><stop offset="1" stop-color="#C98A46"/></linearGradient>
      <linearGradient id="glassX" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#C7D7E3"/><stop offset=".5" stop-color="#8EA6BA"/><stop offset="1" stop-color="#5E7488"/></linearGradient>
      <radialGradient id="lampX"><stop offset="0" stop-color="#FFE3A8" stop-opacity=".95"/><stop offset=".3" stop-color="#FFC874" stop-opacity=".5"/><stop offset="1" stop-color="#FFB050" stop-opacity="0"/></radialGradient>
      <pattern id="stoneN" width="40" height="16" patternUnits="userSpaceOnUse"><rect width="40" height="16" fill="#2E3136"/><rect x="1" y="1" width="23" height="6" fill="#383B41"/><rect x="26" y="1" width="13" height="6" fill="#34373D"/><rect x="1" y="9" width="11" height="6" fill="#35383E"/><rect x="14" y="9" width="25" height="6" fill="#3B3E44"/></pattern>
      <pattern id="stoneD" width="40" height="16" patternUnits="userSpaceOnUse"><rect width="40" height="16" fill="#4A4D53"/><rect x="1" y="1" width="23" height="6" fill="#585B62"/><rect x="26" y="1" width="13" height="6" fill="#52555C"/><rect x="1" y="9" width="11" height="6" fill="#54575D"/><rect x="14" y="9" width="25" height="6" fill="#5C5F66"/></pattern>`;
    return `<svg viewBox="0 0 ${VW} ${VH}" class="dz-hero" preserveAspectRatio="xMidYMid slice"><defs>${defsX}</defs>${g}</svg>`;
  }

  // ── 모델하우스 연출 (실내 일러스트) ──
  function interiorSVG(kind) {
    const W = 640, H = 400;
    let g = '';
    const night = kind === 'party';
    if (kind === 'attic') {
      // 다락 침실: 오른쪽 낮은 경사천장, 앞쪽 유리난간 너머 보이드와 남측 박공 삼각창
      g += `<rect width="${W}" height="${H}" fill="#2A2724"/>`;
      g += `<polygon points="0,0 ${W},0 ${W},40 330,40 120,170 0,230" fill="#CFC5B6"/>`;            // 경사 천장
      g += `<polygon points="120,170 330,40 640,40 640,210 120,210" fill="#3A4152"/>`;               // 보이드 너머 어두운 공간
      g += `<polygon points="300,200 470,70 640,200" fill="#22324F"/><polygon points="300,200 470,70 640,200" fill="none" stroke="#2A2724" stroke-width="6"/><line x1="470" y1="70" x2="470" y2="200" stroke="#2A2724" stroke-width="4"/>`;
      [[400, 150], [440, 120], [500, 130], [540, 160], [470, 100], [585, 175]].forEach(([x, y]) => g += `<circle cx="${x}" cy="${y}" r="1.6" fill="#FFF"/>`);
      g += `<polygon points="0,230 120,170 120,210 0,290" fill="#D9D0C2"/>`;
      g += `<polygon points="0,400 0,290 120,210 640,210 640,400" fill="#A07D5C"/>`;
      for (let i = 0; i < 9; i++) g += `<line x1="${120 + i * 65}" y1="210" x2="${-60 + i * 95}" y2="400" stroke="#8D6C4E" stroke-width="1"/>`;
      g += `<rect x="300" y="200" width="340" height="80" fill="#BFD3E0" opacity=".28"/><line x1="300" y1="200" x2="640" y2="200" stroke="#6B7F8E" stroke-width="3"/><line x1="300" y1="280" x2="640" y2="280" stroke="#6B7F8E" stroke-width="2"/>`;
      g += `<polygon points="40,330 300,330 330,372 10,372" fill="#F4EFE6"/><rect x="10" y="372" width="320" height="10" fill="#8D7A66"/><polygon points="55,312 285,312 300,330 40,330" fill="#E7DED0"/><rect x="70" y="296" width="85" height="22" rx="8" fill="#FFFDF8"/><rect x="175" y="296" width="85" height="22" rx="8" fill="#FFFDF8"/>`;
      g += `<polygon points="90,335 310,335 320,372 70,372" fill="#B79E7E" opacity=".75"/>`;
      g += `<circle cx="330" cy="300" r="60" fill="url(#lamp)"/><rect x="323" y="292" width="14" height="22" rx="3" fill="#F7E8CC"/>`;
      g += `<text x="470" y="245" text-anchor="middle" font-size="11" fill="#E8DFD0" opacity=".8">보이드 · 박공 삼각창</text>`;
    } else if (kind === 'ldk') {
      // 2층 거실에서 북쪽(주방)을 바라봄: 박공 천장 5m, 주방 위 다락과 유리난간
      g += `<rect width="${W}" height="${H}" fill="#F2EEE7"/>`;
      g += `<polygon points="0,0 320,0 320,26 110,150 0,190" fill="#E2DACD"/><polygon points="320,0 ${W},0 ${W},190 530,150 320,26" fill="#D8CFC1"/>`;   // 경사 천장
      for (let i = 1; i < 6; i++) { const t = i / 6; g += `<line x1="${320 - 210 * t}" y1="${26 + 124 * t}" x2="${320 - 320 * t}" y2="${26 - 26 * t}" stroke="#C9BFAF" stroke-width="2"/><line x1="${320 + 210 * t}" y1="${26 + 124 * t}" x2="${320 + 320 * t}" y2="${26 - 26 * t}" stroke="#C9BFAF" stroke-width="2"/>`; }
      g += `<polygon points="110,150 320,26 530,150 530,330 110,330" fill="#EFE9DF"/>`;                                   // 북측 박공벽
      g += `<polygon points="0,190 110,150 110,330 0,400" fill="#E6DED1"/><polygon points="${W},190 530,150 530,330 ${W},400" fill="#E6DED1"/>`;
      g += `<polygon points="0,400 110,330 530,330 ${W},400" fill="#B89773"/>`;
      for (let i = 0; i <= 10; i++) g += `<line x1="${110 + 42 * i}" y1="330" x2="${64 * i}" y2="400" stroke="#A88866" stroke-width="1"/>`;
      // 다락 (왼쪽 55%, 주방 위)
      g += `<polygon points="0,232 110,205 350,205 350,222 110,222 0,252" fill="#8B7B68"/>`;                                // 다락 슬래브
      g += `<polygon points="0,162 110,150 350,150 350,205 110,205 0,232" fill="#BFD3E0" opacity=".35"/><polyline points="0,162 110,150 350,150 350,205" fill="none" stroke="#6B7F8E" stroke-width="2.5"/>`;
      g += `<rect x="190" y="170" width="120" height="30" rx="6" fill="#F4EFE6"/><rect x="198" y="163" width="40" height="12" rx="5" fill="#FFFDF8"/><rect x="250" y="163" width="40" height="12" rx="5" fill="#FFFDF8"/>`;
      g += `<rect x="225" y="78" width="70" height="56" fill="#3B4B63" stroke="#2B2B2B" stroke-width="3"/>`;               // 북측 창
      // 다락 아래 주방
      g += `<polygon points="0,252 110,222 350,222 350,330 110,330 0,400" fill="#D9D1C4" opacity=".55"/>`;
      g += `<rect x="120" y="240" width="220" height="50" fill="#CFC6B8"/><rect x="120" y="290" width="220" height="40" fill="#B9AFA1"/><rect x="150" y="248" width="70" height="30" fill="#3B4B63" opacity=".7"/>`;
      // 계단 (오른쪽)
      for (let i = 0; i < 9; i++) g += `<rect x="${372 + i * 15}" y="${318 - i * 18}" width="40" height="5" fill="#8A6A4C"/>`;
      g += `<line x1="365" y1="318" x2="510" y2="160" stroke="#6B7F8E" stroke-width="2"/>`;
      // 펜던트 (용마루에서)
      [250, 330, 410].forEach(x => g += `<line x1="${x}" y1="${x === 330 ? 26 : 60}" x2="${x}" y2="200" stroke="#2B2B2B" stroke-width="1"/><circle cx="${x}" cy="210" r="55" fill="url(#lamp)"/><ellipse cx="${x}" cy="206" rx="13" ry="7" fill="#E7C27F"/>`);
      // 아일랜드 (앞쪽)
      g += `<polygon points="70,320 400,320 425,350 45,350" fill="#F2EEE8"/><rect x="45" y="350" width="380" height="50" fill="#D9D2C6"/>`;
      [95, 175, 255, 335].forEach(x => g += `<rect x="${x}" y="368" width="26" height="7" rx="3" fill="#8A6A4C"/><rect x="${x + 11}" y="375" width="4" height="30" fill="#8A6A4C"/>`);
      g += `<text x="230" y="140" text-anchor="middle" font-size="11" fill="#6B645A">다락 (주방 위)</text>`;
    } else {
      const bx1 = 150, by1 = 90, bx2 = 490, by2 = 280; // 뒷벽
      const wall = night ? '#3A2E26' : '#EEE8DE', side = night ? '#2E251F' : '#E3DCCF', floor = night ? '#5A4434' : '#B89773', ceil = night ? '#241D18' : '#F4F0E8';
      g += `<polygon points="0,0 ${W},0 ${bx2},${by1} ${bx1},${by1}" fill="${ceil}"/>`;
      g += `<polygon points="0,0 ${bx1},${by1} ${bx1},${by2} 0,${H}" fill="${side}"/><polygon points="${W},0 ${bx2},${by1} ${bx2},${by2} ${W},${H}" fill="${side}"/>`;
      g += `<polygon points="0,${H} ${bx1},${by2} ${bx2},${by2} ${W},${H}" fill="${floor}"/>`;
      for (let i = 0; i <= 10; i++) g += `<line x1="${bx1 + (bx2 - bx1) * i / 10}" y1="${by2}" x2="${W * i / 10}" y2="${H}" stroke="${night ? '#4B392C' : '#A88866'}" stroke-width="1"/>`;
      g += `<rect x="${bx1}" y="${by1}" width="${bx2 - bx1}" height="${by2 - by1}" fill="${wall}"/>`;
      // 뒷벽 창 (풍경)
      const wx1 = kind === 'ldk' ? bx1 + 10 : 300, wx2 = bx2 - 10, wy1 = by1 + 14, wy2 = by2 - 6;
      g += `<rect x="${wx1}" y="${wy1}" width="${wx2 - wx1}" height="${wy2 - wy1}" fill="url(#land${night ? 'N' : 'D'})"/>`;
      g += `<path d="M${wx1},${wy2 - 40} C${wx1 + 60},${wy2 - 85} ${wx1 + 120},${wy2 - 60} ${(wx1 + wx2) / 2},${wy2 - 90} C${wx2 - 80},${wy2 - 110} ${wx2 - 30},${wy2 - 70} ${wx2},${wy2 - 80} L${wx2},${wy2} L${wx1},${wy2} Z" fill="${night ? '#1B2433' : '#7E9A86'}"/>`;
      g += `<path d="M${wx1},${wy2 - 15} C${wx1 + 80},${wy2 - 45} ${wx2 - 100},${wy2 - 25} ${wx2},${wy2 - 45} L${wx2},${wy2} L${wx1},${wy2} Z" fill="${night ? '#131A22' : '#5B7A62'}"/>`;
      for (let i = 1; i < 3; i++) { const x = wx1 + (wx2 - wx1) * i / 3; g += `<line x1="${x}" y1="${wy1}" x2="${x}" y2="${wy2}" stroke="#2B2B2B" stroke-width="3"/>`; }
      g += `<rect x="${wx1}" y="${wy1}" width="${wx2 - wx1}" height="${wy2 - wy1}" fill="none" stroke="#2B2B2B" stroke-width="4"/>`;
      if (kind === 'party') {
        // 왼쪽 와인월
        g += `<polygon points="20,40 140,98 140,282 20,370" fill="#1D1713"/>`;
        for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) { const x = 30 + c * 21, y0 = 70 + r * 40 + c * 4.5; g += `<rect x="${x}" y="${y0}" width="16" height="30" fill="#2E241D" stroke="#7A5A3A" stroke-width=".8"/><circle cx="${x + 8}" cy="${y0 + 22}" r="4" fill="#6B1F2A"/>`; }
        g += `<rect x="18" y="38" width="124" height="4" fill="#E6B873" opacity=".7"/>`;
        // 바 아일랜드
        g += `<polygon points="170,300 420,300 440,340 150,340" fill="#CFC7BA"/><rect x="150" y="340" width="290" height="44" fill="#3A332D"/>`;
        [190, 250, 310, 370].forEach(x => g += `<rect x="${x}" y="350" width="24" height="6" rx="3" fill="#B08D5E"/><rect x="${x + 10}" y="356" width="4" height="40" fill="#B08D5E"/>`);
        // 펜던트
        [215, 295, 375].forEach(x => g += `<line x1="${x}" y1="0" x2="${x}" y2="190" stroke="#111" stroke-width="1"/><circle cx="${x}" cy="200" r="60" fill="url(#lamp)"/><path d="M${x - 14},190 L${x + 14},190 L${x + 8},204 L${x - 8},204 Z" fill="#E7C27F"/>`);
        // 소파 (오른쪽)
        g += `<rect x="470" y="300" width="160" height="60" rx="14" fill="#6E5B49"/><rect x="480" y="285" width="140" height="30" rx="12" fill="#806A55"/>`;
        // 스크린 빛
        g += `<rect x="160" y="100" width="130" height="78" fill="#8FA9C6" opacity=".25"/>`;
      } else {
        // 아일랜드 (앞쪽, 대면형)
        g += `<polygon points="90,300 380,300 405,335 65,335" fill="#F2EEE8"/><rect x="65" y="335" width="340" height="50" fill="#D9D2C6"/><rect x="65" y="335" width="340" height="6" fill="#BDB4A6"/>`;
        [110, 180, 250, 320].forEach(x => g += `<rect x="${x}" y="355" width="26" height="7" rx="3" fill="#8A6A4C"/><rect x="${x + 11}" y="362" width="4" height="38" fill="#8A6A4C"/>`);
        g += `<rect x="40" y="96" width="98" height="170" fill="#D7CFC2"/><rect x="48" y="104" width="38" height="160" fill="#CBC2B4"/><rect x="92" y="104" width="38" height="160" fill="#CBC2B4"/>`;
        // 거실 소파·러그
        g += `<polygon points="400,292 600,292 640,330 380,330" fill="#E2D9CB"/><rect x="420" y="270" width="190" height="34" rx="12" fill="#CDBFAE"/><rect x="410" y="295" width="210" height="24" rx="10" fill="#D9CDBC"/>`;
        g += `<line x1="150" y1="40" x2="420" y2="40" stroke="#2B2B2B" stroke-width="5" stroke-linecap="round"/><ellipse cx="285" cy="44" rx="150" ry="8" fill="#FFE6B6" opacity=".55"/>`;
        g += `<path d="M560,250 C548,210 572,190 566,160 C590,190 594,220 584,250 Z" fill="#4D6B4E"/><rect x="560" y="248" width="26" height="30" fill="#BFB3A3"/>`;
      }
    }
    const d = `<radialGradient id="lamp"><stop offset="0" stop-color="#FFE6B0" stop-opacity=".95"/><stop offset=".35" stop-color="#FFCF85" stop-opacity=".45"/><stop offset="1" stop-color="#FFB960" stop-opacity="0"/></radialGradient>
      <linearGradient id="landD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9D2E4"/><stop offset="1" stop-color="#E9F0EC"/></linearGradient>
      <linearGradient id="landN" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1A2540"/><stop offset="1" stop-color="#5A5F78"/></linearGradient>`;
    return `<svg viewBox="0 0 ${W} ${H}" class="dz-int"><defs>${d}</defs>${g}</svg>`;
  }

  // ── 면적표 ──
  function areaRows() {
    const out = [];
    ['f1', 'f2', 'f3'].forEach(k => PLAN[k].rooms.forEach(r => out.push([k, r.n, area(r.pts)])));
    return out;
  }

  // ── 브로셔 화면 ──
  window.vDesign = function () {
    ensureStyle();
    const rows = areaRows();
    const sum = k => rows.filter(r => r[0] === k && !/테라스/.test(r[1])).reduce((s, r) => s + r[2], 0);
    const a1 = sum('f1'), a2 = sum('f2'), loftA = area(PLAN.f3.rooms[0].pts), att = 1.865 * 3.2;
    let est = '';
    try {
      const o = typeof scopeTotals === 'function' ? scopeTotals() : null;
      if (o && o.build.forecast) est = `<div class="dz-note">현재 앱 기준 순수 건축비 예상 <b>${fmtW(o.build.forecast)}</b> → 이 설계 연면적 33평 기준 평당 <b>${fmtW(o.build.forecast / ((a1 + a2) / PYC))}</b></div>`;
    } catch (e) {}
    const sec = (no, en, ko, body, cls) => `<section class="dz-page ${cls || ''}"><div class="dz-sec-h"><span class="dz-no">${no}</span><div><div class="dz-en">${en}</div><div class="dz-ko">${ko}</div></div></div>${body}</section>`;
    const tbl = (k, t) => rows.filter(r => r[0] === k).map(r => `<tr><td>${t}</td><td>${r[1]}</td><td class="r">${f1(r[2])}㎡</td><td class="r">${f1(r[2] / PYC)}평</td></tr>`).join('');
    return `<div class="dz">
      <div class="dz-bar no-print"><button class="btn sm" onclick="window.print()">🖨 인쇄 · PDF 저장</button><button class="btn sm" onclick="applyDesignArea()">📏 이 설계 면적을 프로젝트에 적용</button></div>
      <section class="dz-cover">
        ${exteriorSVG('night')}
        <div class="dz-cover-tx">
          <div class="dz-brand">THE PAUSE</div>
          <div class="dz-title">쉼표의 집</div>
          <div class="dz-tag">A Luxury Second House for Leisure &amp; Rest · 양평</div>
          <div class="dz-line"></div>
          <div class="dz-copy">아래층은 함께, 위층은 쉼 — 5m 박공 보이드 아래 펼쳐지는 세컨하우스</div>
        </div>
        <div class="dz-stats"><div><b>${f1(a1 / PYC)}평</b><span>1층 · ${f1(a1)}㎡</span></div><div><b>${f1(a2 / PYC)}평</b><span>2층 · ${f1(a2)}㎡</span></div><div><b>${f1((a1 + a2) / PYC)}평</b><span>연면적 · ${f1(a1 + a2)}㎡</span></div><div><b>5.0m</b><span>2층 박공 보이드</span></div></div>
      </section>

      ${sec('01', 'CONCEPT', '공간 컨셉', `<div class="dz-grid4">
        <div class="dz-card"><div class="dz-ic">🍷</div><b>PRIVATE ENTERTAINMENT</b><span>1층 8평 파티룸 — 와인셀러 월과 바 아일랜드, 시네마 스크린, 데크로 열리는 3.7m 슬라이딩 도어</span></div>
        <div class="dz-card"><div class="dz-ic">🏞️</div><b>PANORAMA LDK</b><span>2층 10.8평 대면형 LDK — 박공지붕을 그대로 드러낸 최고 5m 보이드, 남측 박공 삼각창 너머 산 조망과 동측 3평 테라스</span></div>
        <div class="dz-card"><div class="dz-ic">✨</div><b>LOFT BEDROOM</b><span>주방 위 다락 침실 — 유리난간 너머로 거실 보이드와 박공 삼각창이 보이는, 거실에서 올려다보이는 다락</span></div>
        <div class="dz-card"><div class="dz-ic">🛏️</div><b>GUEST SUITE</b><span>1층 남향 침실과 욕실 — 일자 복도로 파티룸과 분리돼 파티가 끝나도 서로 방해 없는 게스트 동선</span></div>
      </div>`)}

      ${sec('02', 'EXTERIOR', '외관 투시도', `<div class="dz-ext2">${exteriorSVG('day')}</div><div class="dz-cap">석재 1층 · 화이트 2층 · 블랙 징크 박공지붕 · 우드 루버 포인트 — 낮의 표정</div>`)}

      ${sec('03', 'FLOOR PLAN', '평면도', `<div class="dz-plans">
        <figure>${planSVG('f1')}<figcaption><b>1F</b> 현관 → 복도 → 파티룸 축 · 남향 게스트 침실 · 욕실 · 세탁실 — ${f1(a1 / PYC)}평</figcaption></figure>
        <figure>${planSVG('f2')}<figcaption><b>2F</b> 대면형 LDK · 거실·식당 5m 보이드 · 주방 위 다락 · 욕실 · 다용도실 + 테라스 3평 — ${f1(a2 / PYC)}평</figcaption></figure>
        <figure>${planSVG('f3')}<figcaption><b>LOFT</b> 주방 위 다락 침실 (바닥 ${f1(loftA / PYC)}평 · 높이 1.5m 이상 약 ${f1(att / PYC)}평) · 유리난간 · 거실 보이드 조망</figcaption></figure>
      </div>`, 'dz-paper')}

      ${sec('04', 'ELEVATION & SECTION', '입면도 · 단면도', `<div class="dz-plans dz-2col">
        <figure>${elevSVG('S')}<figcaption><b>남측 입면도</b> 박공 정면 — 박공 삼각창 · 1층 전면 슬라이딩 · 2층 파노라마 창</figcaption></figure>
        <figure>${elevSVG('W')}<figcaption><b>서측 입면도</b> 블랙 징크 경사지붕 · 천창 2개</figcaption></figure>
        <figure class="dz-wide">${sectionSVG('A')}<figcaption><b>단면도 A-A (동서)</b> 박공을 그대로 드러낸 2층 보이드 5.0m — 뒤로 주방 위 다락과 유리난간이 보임</figcaption></figure>
        <figure class="dz-wide">${sectionSVG('B')}<figcaption><b>단면도 B-B (남북)</b> 북쪽 주방(천장고 2.35m) 위 다락 · 남쪽 거실 보이드 · 1층 파티룸 천장고 2.7m</figcaption></figure>
      </div>`, 'dz-paper')}

      ${sec('05', 'MODEL HOUSE', '모델하우스 연출', `<div class="dz-grid3">
        <figure class="dz-int-f">${interiorSVG('party')}<figcaption><b>1층 파티룸</b> 월넛 와인월 · 바 아일랜드 · 펜던트 조명</figcaption></figure>
        <figure class="dz-int-f">${interiorSVG('ldk')}<figcaption><b>2층 LDK</b> 5m 박공 천장 아래, 주방 위로 보이는 다락</figcaption></figure>
        <figure class="dz-int-f">${interiorSVG('attic')}<figcaption><b>다락 침실</b> 유리난간 너머 보이드와 박공 삼각창</figcaption></figure>
      </div><div class="dz-cap">※ 연출 예시 일러스트 — 실제 마감·가구는 설계 단계에서 확정</div>`)}

      ${sec('06', 'SPEC & AREA', '마감 사양 · 면적표', `<div class="dz-2col-t">
        <table class="dz-spec">
          <tr><th>외장</th><td>1층 현무암톤 석재 타일 · 2층 화이트 세라믹 패널 · 우드 루버 포인트</td></tr>
          <tr><th>지붕</th><td>블랙 징크(스탠딩심) 박공지붕(약 30°) · 2층 노출 박공천장 · 천창 2개소</td></tr>
          <tr><th>창호</th><td>알루미늄 시스템 창호 · 삼중유리(로이), 1층 리프트 슬라이딩</td></tr>
          <tr><th>단열</th><td>외단열 + 고성능 단열재 — 에너지 효율 1++ 목표</td></tr>
          <tr><th>바닥</th><td>파티룸 포세린 타일 · 2층/다락 원목마루</td></tr>
          <tr><th>파티룸</th><td>와인셀러 월 · 바 아일랜드 · 빔프로젝터/스크린 · 방음 천장</td></tr>
          <tr><th>주방</th><td>대면형 아일랜드(세라믹 상판) · 인덕션 · 식기세척기 빌트인</td></tr>
          <tr><th>설비</th><td>LPG 콘덴싱 보일러 + 바닥난방 · 스마트 원격제어 · 정화조</td></tr>
          <tr><th>외부</th><td>남측 데크 · 2층 동측 테라스(유리난간) · 외부 조명</td></tr>
        </table>
        <table class="dz-area"><thead><tr><th>층</th><th>실</th><th class="r">㎡</th><th class="r">평</th></tr></thead><tbody>
          ${tbl('f1', '1F')}<tr class="sum"><td colspan="2">1층 합계</td><td class="r">${f1(a1)}</td><td class="r">${f1(a1 / PYC)}</td></tr>
          ${tbl('f2', '2F')}<tr class="sum"><td colspan="2">2층 합계 (테라스 제외)</td><td class="r">${f1(a2)}</td><td class="r">${f1(a2 / PYC)}</td></tr>
          <tr class="sum big"><td colspan="2">연면적</td><td class="r">${f1(a1 + a2)}</td><td class="r">${f1((a1 + a2) / PYC)}</td></tr>
          <tr><td>다락</td><td>바닥 (주방 위)</td><td class="r">${f1(loftA)}</td><td class="r">${f1(loftA / PYC)}</td></tr><tr><td></td><td>높이 1.5m 이상</td><td class="r">${f1(att)}</td><td class="r">${f1(att / PYC)}</td></tr>
        </tbody></table>
      </div>${est}
      <div class="dz-legal">본 자료는 <b>개념 설계(계획안)</b>입니다. 건폐율·용적률·이격거리·주차, 구조·설비 및 다락 면적 산입 기준(경사지붕 평균 높이 1.8m 이하 등 — 본안 다락 평균 약 1.3m)은 대지 조건과 법규에 따라 달라지므로 <b>건축사 설계와 인허가 검토</b>가 필요합니다. 치수 단위 mm, 높이 단위 m.</div>`)}

      <div class="dz-foot">HIGH-END SECOND HOUSE PROJECT · THE PAUSE · 양평</div>
    </div>`;
  };

  window.applyDesignArea = function () {
    const rows = areaRows();
    const a1 = rows.filter(r => r[0] === 'f1').reduce((s, r) => s + r[2], 0);
    const a2 = rows.filter(r => r[0] === 'f2' && r[1] !== '테라스').reduce((s, r) => s + r[2], 0);
    if (!confirm(`프로젝트 정보를 이 설계안 면적으로 바꿀까요?\n· 연면적 ${f1(a1 + a2)}㎡ (${f1((a1 + a2) / PYC)}평)\n· 건축면적 ${f1(a1)}㎡ (${f1(a1 / PYC)}평)\n\n평당 건축비, 조경 계획, 난방 계산이 이 면적으로 다시 계산돼요.`)) return;
    upsert('project', Object.assign({}, proj(), { id: 'main', floorArea: +(a1 + a2).toFixed(2), buildArea: +a1.toFixed(2) }));
    toast('설계안 면적을 프로젝트에 적용했어요');
  };
  window.designThumb = function () { return exteriorSVG('night').replace('class="dz-hero"', 'style="display:block;width:100%;height:210px"'); };

  let styled = false;
  function ensureStyle() {
    if (styled) return; styled = true;
    const css = `
    .dz { --ink:#EDE6DA; --gold:#C2A574; --navy:#1C2129; --navy2:#242A33; margin:-16px; }
    @media (min-width:1024px){ .dz { margin:-24px; } }
    .dz-bar { display:flex; gap:8px; justify-content:flex-end; padding:10px 16px; background:var(--navy); flex-wrap:wrap; }
    .dz-cover { position:relative; background:var(--navy); color:var(--ink); overflow:hidden; }
    .dz-hero { display:block; width:100%; height:auto; min-height:300px; }
    .dz-cover-tx { position:absolute; left:0; top:0; right:0; padding:28px 28px 0; background:linear-gradient(180deg, rgba(18,22,30,.85), rgba(18,22,30,0)); }
    .dz-brand { font-family:'Cormorant Garamond','Noto Serif KR',Georgia,serif; letter-spacing:.32em; color:var(--gold); font-size:15px; }
    .dz-title { font-family:'Noto Serif KR',Georgia,serif; font-size:clamp(30px,6vw,54px); font-weight:700; color:#F3ECDF; margin-top:4px; letter-spacing:.04em; }
    .dz-tag { font-family:'Cormorant Garamond',Georgia,serif; font-size:clamp(14px,2.2vw,19px); color:#D9CDB8; margin-top:2px; }
    .dz-line { width:56px; height:2px; background:var(--gold); margin:14px 0 10px; }
    .dz-copy { font-size:14px; color:#E4DACA; }
    .dz-stats { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); background:var(--navy2); border-top:1px solid rgba(194,165,116,.35); }
    .dz-stats div { padding:14px 10px; text-align:center; border-right:1px solid rgba(194,165,116,.18); }
    .dz-stats div:last-child { border-right:none; }
    .dz-stats b { display:block; font-family:'Noto Serif KR',Georgia,serif; font-size:clamp(17px,3vw,24px); color:var(--gold); }
    .dz-stats span { font-size:11.5px; color:#B9AF9F; }
    .dz-page { background:var(--navy); color:var(--ink); padding:30px 22px; border-top:1px solid rgba(194,165,116,.2); }
    .dz-paper { background:#EFE9DF; color:#2E2A26; }
    .dz-sec-h { display:flex; align-items:center; gap:14px; margin-bottom:18px; }
    .dz-no { font-family:'Cormorant Garamond',Georgia,serif; font-size:40px; color:var(--gold); line-height:1; }
    .dz-en { font-family:'Cormorant Garamond',Georgia,serif; letter-spacing:.22em; font-size:13px; color:var(--gold); }
    .dz-ko { font-family:'Noto Serif KR',Georgia,serif; font-size:21px; font-weight:700; }
    .dz-grid4 { display:grid; gap:12px; grid-template-columns:repeat(auto-fit,minmax(210px,1fr)); }
    .dz-card { background:var(--navy2); border:1px solid rgba(194,165,116,.22); border-radius:4px; padding:18px; display:flex; flex-direction:column; gap:8px; }
    .dz-card b { font-family:'Cormorant Garamond',Georgia,serif; letter-spacing:.12em; color:var(--gold); font-size:15px; }
    .dz-card span { font-size:13.5px; line-height:1.65; color:#DDD3C3; }
    .dz-ic { font-size:24px; }
    .dz-ext2 svg { width:100%; height:auto; display:block; border-radius:4px; }
    .dz-cap { font-size:12.5px; color:#B9AF9F; margin-top:10px; text-align:center; }
    .dz-paper .dz-cap { color:#7D766C; }
    .dz-plans { display:grid; gap:18px; grid-template-columns:repeat(auto-fit,minmax(min(100%,440px),1fr)); }
    .dz-plans figure { margin:0; background:#F7F3EC; border:1px solid #DCD3C4; border-radius:4px; overflow:hidden; }
    .dz-plans .dz-wide { grid-column:1/-1; }
    .dz-svg { display:block; width:100%; height:auto; }
    .dz-plans figcaption { padding:10px 14px; font-size:13px; color:#5E574E; border-top:1px solid #E3DACB; background:#FBF8F3; }
    .dz-plans figcaption b { font-family:'Noto Serif KR',Georgia,serif; color:#2E2A26; margin-right:6px; }
    .dz-grid3 { display:grid; gap:14px; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); }
    .dz-int-f { margin:0; background:var(--navy2); border:1px solid rgba(194,165,116,.22); border-radius:4px; overflow:hidden; }
    .dz-int { display:block; width:100%; height:auto; }
    .dz-int-f figcaption { padding:10px 14px; font-size:13px; color:#DDD3C3; }
    .dz-int-f figcaption b { color:var(--gold); margin-right:6px; font-family:'Noto Serif KR',Georgia,serif; }
    .dz-2col-t { display:grid; gap:18px; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); }
    .dz-spec, .dz-area { width:100%; border-collapse:collapse; font-size:13px; }
    .dz-spec th { text-align:left; color:var(--gold); font-weight:700; padding:9px 8px; border-bottom:1px solid rgba(194,165,116,.2); white-space:nowrap; vertical-align:top; width:64px; }
    .dz-spec td { padding:9px 8px; border-bottom:1px solid rgba(194,165,116,.2); color:#E1D8C9; line-height:1.55; }
    .dz-area th { text-align:left; color:var(--gold); font-size:12px; padding:7px 6px; border-bottom:1px solid rgba(194,165,116,.4); }
    .dz-area td { padding:6px; border-bottom:1px solid rgba(194,165,116,.12); color:#E1D8C9; }
    .dz-area .r { text-align:right; font-variant-numeric:tabular-nums; }
    .dz-area tr.sum td { color:var(--gold); font-weight:700; border-bottom:1px solid rgba(194,165,116,.35); }
    .dz-area tr.big td { font-size:15px; }
    .dz-note { margin-top:16px; padding:12px 14px; border:1px solid rgba(194,165,116,.35); border-radius:4px; font-size:13.5px; color:#E4DACA; }
    .dz-note b { color:var(--gold); }
    .dz-legal { margin-top:14px; font-size:12px; line-height:1.7; color:#A99F8F; }
    .dz-foot { background:#14181E; color:var(--gold); text-align:center; padding:16px; font-family:'Cormorant Garamond',Georgia,serif; letter-spacing:.24em; font-size:12px; }
    @media (max-width:560px) {
      .dz-stats { grid-template-columns:repeat(2,minmax(0,1fr)); }
      .dz-stats div:nth-child(2) { border-right:none; }
      .dz-stats div { border-bottom:1px solid rgba(194,165,116,.18); }
      .dz-cover-tx { padding:18px 18px 0; }
      .dz-page { padding:24px 14px; }
      .dz-plans, .dz-2col-t, .dz-grid3 { grid-template-columns:minmax(0,1fr); }
    }
    @media print {
      .side, .bnav, .fab, .hdr, .no-print, #layer, .toast { display:none !important; }
      .main { margin:0 !important; padding:0 !important; } .view { padding:0 !important; max-width:none !important; }
      .dz { margin:0; } body, html { background:#fff !important; }
      .dz-page, .dz-cover { break-inside:avoid; page-break-inside:avoid; }
      .dz-page { page-break-before:always; }
      * { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    }`;
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    if (!document.getElementById('dzFont')) { const l = document.createElement('link'); l.id = 'dzFont'; l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Noto+Serif+KR:wght@500;700&display=swap'; document.head.appendChild(l); }
  }
})();
