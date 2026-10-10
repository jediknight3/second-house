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
  const PLAN = {
    f1: {
      title: '1층 평면도', sub: '프라이빗 엔터테인먼트 · 게스트', W: 9.6, D: 6.2,
      rooms: [
        R('파티룸', 0, 0, 4.3, 6.2, { c: '#EDE3D1' }),
        R('계단', 4.3, 0, 2.1, 2.8, { c: '#E3DDD2', stair: 1, noArea: 0 }),
        R('현관', 6.4, 0, 3.2, 2.0, { c: '#E6E1D9' }),
        R('욕실', 7.6, 2.0, 2.0, 1.8, { c: '#DEE5E8' }),
        R('세탁실', 4.3, 4.4, 1.3, 1.8, { c: '#DEE5E8' }),
        R('침실', 5.6, 3.8, 4.0, 2.4, { c: '#E9DFCB' }),
        { n: '복도', pts: [[4.3, 2.8], [6.4, 2.8], [6.4, 2.0], [7.6, 2.0], [7.6, 3.8], [5.6, 3.8], [5.6, 4.4], [4.3, 4.4]], c: '#EEEAE3', small: 1 },
      ],
      win: [ // [x1,y1,x2,y2, 'w'(창)|'d'(현관문)|'s'(슬라이딩)]
        [0.3, 6.2, 4.0, 6.2, 's'], [0, 1.2, 0, 4.8, 'w'], [6.2, 6.2, 9.2, 6.2, 'w'], [9.6, 4.2, 9.6, 5.8, 'w'],
        [9.6, 2.4, 9.6, 3.4, 'w'], [7.4, 0, 8.4, 0, 'd'], [8.6, 0, 9.2, 0, 'w'], [4.5, 0, 6.2, 0, 'w'], [4.5, 6.2, 5.4, 6.2, 'w'],
      ],
      doors: [ // [힌지x, 힌지y, 폭, 방향(deg 시작), 스윕]
        [4.3, 2.95, 1.25, 90, -90], [7.6, 2.25, 0.8, 180, -90], [6.05, 3.8, 0.8, 0, 90], [4.45, 4.4, 0.8, 0, 90],
      ],
      furn: [
        { t: 'rect', x: 0.25, y: 0.2, w: 3.8, h: 0.55, c: '#6B4F3A', l: '와인셀러·바' },
        { t: 'rect', x: 0.9, y: 1.45, w: 2.4, h: 0.75, c: '#B8AEA0', l: '바 아일랜드' },
        { t: 'sofa', x: 0.35, y: 3.75, w: 2.9, h: 0.85, ret: 1.1 },
        { t: 'rect', x: 1.4, y: 4.85, w: 1.2, h: 0.6, c: '#CFC4B2', r: 0.3 },
        { t: 'rect', x: 4.0, y: 3.4, w: 0.2, h: 2.4, c: '#3A3F48', l: '' },
        { t: 'bed', x: 7.4, y: 4.0, w: 1.6, h: 2.0 },
        { t: 'rect', x: 5.7, y: 3.95, w: 0.6, h: 2.1, c: '#CFC4B2', l: '' },
        { t: 'wc', x: 9.05, y: 2.15 }, { t: 'rect', x: 7.75, y: 3.2, w: 1.1, h: 0.5, c: '#C9D3D8', l: '' },
        { t: 'rect', x: 8.95, y: 2.95, w: 0.55, h: 0.75, c: '#C9D3D8', l: '' },
        { t: 'rect', x: 4.4, y: 5.4, w: 0.55, h: 0.6, c: '#C9D3D8', l: '' }, { t: 'rect', x: 4.98, y: 5.4, w: 0.55, h: 0.6, c: '#C9D3D8', l: '' },
        { t: 'rect', x: 6.6, y: 0.15, w: 1.2, h: 0.45, c: '#CFC4B2', l: '' },
      ],
      label: { '파티룸': [2.15, 2.9], '침실': [6.5, 5.6], '복도': [6.9, 3.3], '계단': [5.35, 1.4] },
      upArrow: [[4.8, 2.6], [4.8, 0.6], [5.9, 0.6], [5.9, 2.5]],
    },
    f2: {
      title: '2층 평면도', sub: '대면형 LDK · 파노라마 조망', W: 9.6, D: 6.2, bodyW: 8.0,
      rooms: [
        { n: 'LDK', pts: [[1.6, 0], [4.3, 0], [4.3, 2.8], [8.0, 2.8], [8.0, 6.2], [0, 6.2], [0, 2.2], [1.6, 2.2]], c: '#EFE7D8' },
        R('계단', 4.3, 0, 2.1, 2.8, { c: '#E3DDD2', stair: 1 }),
        R('욕실', 6.4, 0, 1.6, 2.8, { c: '#DEE5E8' }),
        R('다용도실', 0, 0, 1.6, 2.2, { c: '#DEE5E8' }),
        R('테라스', 8.0, 0, 1.6, 6.2, { c: '#D9CBB4', terrace: 1 }),
      ],
      win: [
        [0.4, 6.2, 3.6, 6.2, 'w'], [4.6, 6.2, 7.6, 6.2, 'w'], [0, 3.4, 0, 5.8, 'w'], [0, 0.6, 0, 1.6, 'w'],
        [2.0, 0, 4.0, 0, 'w'], [6.8, 0, 7.6, 0, 'w'], [8.0, 3.4, 8.0, 5.6, 's'], [4.5, 0, 6.2, 0, 'w'],
      ],
      doors: [[1.6, 0.6, 0.8, 90, 90], [6.4, 2.0, 0.75, 90, 90]],
      furn: [
        { t: 'rect', x: 1.7, y: 0.1, w: 2.5, h: 0.6, c: '#BCB2A3', l: '주방' },
        { t: 'rect', x: 1.7, y: 2.55, w: 2.4, h: 0.8, c: '#9C9285', l: '아일랜드 (대면형)' },
        { t: 'stool', xs: [2.0, 2.6, 3.2, 3.8], y: 3.55 },
        { t: 'sofa', x: 0.3, y: 4.9, w: 3.0, h: 0.85, ret: 0 },
        { t: 'rect', x: 1.2, y: 4.2, w: 1.2, h: 0.55, c: '#CFC4B2', r: 0.25 },
        { t: 'table', x: 5.1, y: 3.7, w: 1.8, h: 0.9 },
        { t: 'wc', x: 7.45, y: 0.15 }, { t: 'rect', x: 6.5, y: 0.1, w: 0.75, h: 1.0, c: '#C9D3D8', l: '' },
        { t: 'rect', x: 6.5, y: 1.6, w: 1.4, h: 1.1, c: '#C9D3D8', l: '샤워' },
        { t: 'rect', x: 0.1, y: 0.1, w: 0.6, h: 0.6, c: '#C9D3D8', l: '' },
        { t: 'deckchair', x: 8.4, y: 4.3 }, { t: 'deckchair', x: 8.4, y: 1.4 },
      ],
      label: { 'LDK': [6.0, 5.45], '테라스': [8.8, 3.2], '계단': [5.35, 1.4] },
      upArrow: [[4.8, 2.6], [4.8, 0.6], [5.9, 0.6], [5.9, 2.5]],
    },
    f3: {
      title: '다락 평면도', sub: '천창 아래 감성 침실', W: 9.6, D: 6.2, bodyW: 8.0,
      rooms: [
        { n: '다락 침실', pts: [[0, 0], [4.3, 0], [4.3, 2.8], [6.4, 2.8], [6.4, 0], [8.0, 0], [8.0, 6.2], [0, 6.2]], c: '#EEE6D6', areaText: '유효 약 30.1㎡ · 9.1평 (높이 1.5m 이상)' },
        R('계단', 4.3, 0, 2.1, 2.8, { c: '#E3DDD2', stair: 1 }),
      ],
      win: [[0, 2.4, 0, 3.8, 'w'], [8.0, 2.4, 8.0, 3.8, 'w']],
      doors: [],
      furn: [
        { t: 'bed', x: 1.3, y: 2.2, w: 1.6, h: 2.0, rot: 1 },
        { t: 'rect', x: 6.7, y: 3.4, w: 1.0, h: 1.6, c: '#CFC4B2', l: '라운지', r: 0.2 },
        { t: 'sky', x: 1.5, y: 4.3, w: 1.0, h: 0.9 }, { t: 'sky', x: 4.9, y: 4.3, w: 1.0, h: 0.9 },
      ],
      label: { '다락 침실': [2.3, 1.2], '계단': [5.35, 1.4] },
      hatch: [[0, 0, 8.0, 1.1], [0, 5.1, 8.0, 1.1]],
      upArrow: null,
    },
  };

  // ── 평면도 SVG ──
  function planSVG(key) {
    const P = PLAN[key], S = 54, pad = 46, W = P.W, D = P.D;
    const vw = W * S + pad * 2, vh = D * S + pad * 2 + 30;
    const X = x => pad + x * S, Y = y => pad + y * S;
    const poly = pts => pts.map(p => X(p[0]).toFixed(1) + ',' + Y(p[1]).toFixed(1)).join(' ');
    let g = '';
    // 1층 윤곽(2층·다락에서는 점선으로)
    if (key !== 'f1') g += `<rect x="${X(0)}" y="${Y(0)}" width="${W * S}" height="${D * S}" fill="none" stroke="#B9B1A4" stroke-dasharray="4 4" stroke-width="1"/>`;
    P.rooms.forEach(r => {
      g += `<polygon points="${poly(r.pts)}" fill="${r.c}" stroke="#7D766C" stroke-width="${r.terrace ? 1 : 1.4}" ${r.terrace ? 'stroke-dasharray="5 3"' : ''}/>`;
      if (r.terrace) for (let i = 0.3; i < 6.2; i += 0.3) g += `<line x1="${X(8.0)}" y1="${Y(i)}" x2="${X(9.6)}" y2="${Y(i)}" stroke="#C7B79D" stroke-width="0.8"/>`;
    });
    // 계단 디딤판
    P.rooms.filter(r => r.stair).forEach(r => {
      const [x0, y0] = r.pts[0];
      for (let k = 0; k < 8; k++) { const yy = y0 + 1.0 + k * 0.225; g += `<line x1="${X(x0)}" y1="${Y(yy)}" x2="${X(x0 + 1.0)}" y2="${Y(yy)}" stroke="#A39B8E" stroke-width="0.8"/><line x1="${X(x0 + 1.1)}" y1="${Y(yy)}" x2="${X(x0 + 2.1)}" y2="${Y(yy)}" stroke="#A39B8E" stroke-width="0.8"/>`; }
      g += `<line x1="${X(x0 + 1.05)}" y1="${Y(y0 + 1.0)}" x2="${X(x0 + 1.05)}" y2="${Y(y0 + 2.8)}" stroke="#7D766C" stroke-width="1.2"/>`;
    });
    if (P.upArrow) g += `<polyline points="${poly(P.upArrow)}" fill="none" stroke="#8C6D45" stroke-width="1.4" marker-end="url(#arr)"/>`;
    // 다락 낮은 천장(수납) 해치
    (P.hatch || []).forEach(([x, y, w, h]) => {
      g += `<rect x="${X(x)}" y="${Y(y)}" width="${w * S}" height="${h * S}" fill="url(#hatch)" opacity=".55"/>`;
      g += `<text x="${X(x + w / 2)}" y="${Y(y + h / 2) + 4}" text-anchor="middle" font-size="10.5" fill="#7D766C">수납 (천장 높이 1.5m 미만)</text>`;
    });
    // 가구
    P.furn.forEach(f => {
      if (f.t === 'rect') g += `<rect x="${X(f.x)}" y="${Y(f.y)}" width="${f.w * S}" height="${f.h * S}" rx="${(f.r || 0.05) * S}" fill="${f.c}" opacity=".9"/>${f.l ? `<text x="${X(f.x + f.w / 2)}" y="${Y(f.y + f.h / 2) + 3.5}" text-anchor="middle" font-size="9.5" fill="${/^#[4-7]/.test(f.c) ? '#F3EBDD' : '#4A443C'}">${f.l}</text>` : ''}`;
      else if (f.t === 'sofa') { g += `<rect x="${X(f.x)}" y="${Y(f.y)}" width="${f.w * S}" height="${f.h * S}" rx="6" fill="#9E8F7D"/><rect x="${X(f.x) + 4}" y="${Y(f.y) + 4}" width="${f.w * S - 8}" height="${f.h * S - 14}" rx="4" fill="#B5A693"/>`; if (f.ret) g += `<rect x="${X(f.x)}" y="${Y(f.y + f.h) - 2}" width="${0.85 * S}" height="${f.ret * S}" rx="6" fill="#9E8F7D"/>`; }
      else if (f.t === 'bed') { const w = (f.rot ? f.h : f.w) * S, h = (f.rot ? f.w : f.h) * S; g += `<rect x="${X(f.x)}" y="${Y(f.y)}" width="${w}" height="${h}" rx="4" fill="#F4EFE6" stroke="#A39B8E"/>`; g += f.rot ? `<rect x="${X(f.x) + 4}" y="${Y(f.y) + 6}" width="${0.4 * S}" height="${h - 12}" rx="3" fill="#D8CFC2"/>` : `<rect x="${X(f.x) + 6}" y="${Y(f.y) + 4}" width="${w - 12}" height="${0.4 * S}" rx="3" fill="#D8CFC2"/>`; g += `<rect x="${X(f.x) + (f.rot ? 0.6 * S : 3)}" y="${Y(f.y) + (f.rot ? 3 : 0.75 * S)}" width="${f.rot ? w - 0.6 * S - 3 : w - 6}" height="${f.rot ? h - 6 : h - 0.75 * S - 3}" rx="3" fill="#C8B79E" opacity=".65"/>`; }
      else if (f.t === 'wc') g += `<ellipse cx="${X(f.x + 0.22)}" cy="${Y(f.y + 0.38)}" rx="${0.19 * S}" ry="${0.26 * S}" fill="#F7F7F5" stroke="#9AA4A8"/><rect x="${X(f.x + 0.02)}" y="${Y(f.y)}" width="${0.4 * S}" height="${0.15 * S}" fill="#F7F7F5" stroke="#9AA4A8"/>`;
      else if (f.t === 'stool') f.xs.forEach(x => g += `<circle cx="${X(x)}" cy="${Y(f.y)}" r="${0.17 * S}" fill="#6B5A48"/>`);
      else if (f.t === 'table') { g += `<rect x="${X(f.x)}" y="${Y(f.y)}" width="${f.w * S}" height="${f.h * S}" rx="5" fill="#8A6A4C"/>`; [0.3, 0.9, 1.5].forEach(dx => { g += `<circle cx="${X(f.x + dx)}" cy="${Y(f.y) - 7}" r="7" fill="#B5A693"/><circle cx="${X(f.x + dx)}" cy="${Y(f.y + f.h) + 7}" r="7" fill="#B5A693"/>`; }); }
      else if (f.t === 'deckchair') g += `<rect x="${X(f.x)}" y="${Y(f.y)}" width="${0.8 * S}" height="${1.4 * S}" rx="6" fill="#F4EFE6" stroke="#A39B8E"/>`;
      else if (f.t === 'sky') g += `<rect x="${X(f.x)}" y="${Y(f.y)}" width="${f.w * S}" height="${f.h * S}" fill="#CFE0EE" stroke="#6F8FA8" stroke-dasharray="4 2"/><text x="${X(f.x + f.w / 2)}" y="${Y(f.y + f.h) + 12}" text-anchor="middle" font-size="9.5" fill="#56707F">천창</text>`;
    });
    // 외벽
    const bw = P.bodyW || W;
    g += `<rect x="${X(0)}" y="${Y(0)}" width="${bw * S}" height="${D * S}" fill="none" stroke="#2E2A26" stroke-width="7"/>`;
    // 창·문
    P.win.forEach(([x1, y1, x2, y2, t]) => {
      const hz = y1 === y2;
      g += `<line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="#FFFFFF" stroke-width="8"/>`;
      if (t === 'd') g += `<line x1="${X(x1)}" y1="${Y(y1)}" x2="${X(x2)}" y2="${Y(y2)}" stroke="#8C6D45" stroke-width="4"/>`;
      else {
        const o = 2.2;
        g += hz ? `<line x1="${X(x1)}" y1="${Y(y1) - o}" x2="${X(x2)}" y2="${Y(y2) - o}" stroke="#5B7C93" stroke-width="1.3"/><line x1="${X(x1)}" y1="${Y(y1) + o}" x2="${X(x2)}" y2="${Y(y2) + o}" stroke="#5B7C93" stroke-width="1.3"/>`
          : `<line x1="${X(x1) - o}" y1="${Y(y1)}" x2="${X(x2) - o}" y2="${Y(y2)}" stroke="#5B7C93" stroke-width="1.3"/><line x1="${X(x1) + o}" y1="${Y(y1)}" x2="${X(x2) + o}" y2="${Y(y2)}" stroke="#5B7C93" stroke-width="1.3"/>`;
        if (t === 's') g += hz ? `<line x1="${X((x1 + x2) / 2)}" y1="${Y(y1) - 4}" x2="${X((x1 + x2) / 2)}" y2="${Y(y1) + 4}" stroke="#5B7C93" stroke-width="1.3"/>` : `<line x1="${X(x1) - 4}" y1="${Y((y1 + y2) / 2)}" x2="${X(x1) + 4}" y2="${Y((y1 + y2) / 2)}" stroke="#5B7C93" stroke-width="1.3"/>`;
      }
    });
    P.doors.forEach(([hx, hy, w, a0, sw]) => {
      const rad = d => d * Math.PI / 180, a1 = a0 + sw;
      const p1 = [hx + w * Math.cos(rad(a0)), hy + w * Math.sin(rad(a0))], p2 = [hx + w * Math.cos(rad(a1)), hy + w * Math.sin(rad(a1))];
      g += `<line x1="${X(hx)}" y1="${Y(hy)}" x2="${X(p1[0])}" y2="${Y(p1[1])}" stroke="#FFFFFF" stroke-width="3"/>`;
      g += `<line x1="${X(hx)}" y1="${Y(hy)}" x2="${X(p2[0])}" y2="${Y(p2[1])}" stroke="#6B645A" stroke-width="1.3"/><path d="M${X(p1[0])},${Y(p1[1])} A${w * S},${w * S} 0 0 ${sw > 0 ? 1 : 0} ${X(p2[0])},${Y(p2[1])}" fill="none" stroke="#A39B8E" stroke-width="0.9" stroke-dasharray="3 2"/>`;
    });
    // 실명·면적
    P.rooms.forEach(r => {
      const a = area(r.pts);
      const c = (P.label && P.label[r.n]) || [r.pts.reduce((s, p) => s + p[0], 0) / r.pts.length, r.pts.reduce((s, p) => s + p[1], 0) / r.pts.length];
      const big = !r.small && a > 4;
      g += `<text x="${X(c[0])}" y="${Y(c[1])}" text-anchor="middle" font-size="${big ? 13.5 : 11}" font-weight="700" fill="#2E2A26">${r.n}</text>`;
      if (!r.stair) g += `<text x="${X(c[0])}" y="${Y(c[1]) + 14}" text-anchor="middle" font-size="10" fill="#7D766C">${r.areaText || f1(a) + '㎡ · ' + f1(a / PYC) + '평'}</text>`;
    });
    // 치수
    const dim = (x1, y1, x2, y2, t, vert) => vert
      ? `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#8C6D45" stroke-width="0.9"/><line x1="${x1 - 4}" y1="${y1}" x2="${x1 + 4}" y2="${y1}" stroke="#8C6D45"/><line x1="${x1 - 4}" y1="${y2}" x2="${x1 + 4}" y2="${y2}" stroke="#8C6D45"/><text x="${x1 - 6}" y="${(y1 + y2) / 2}" font-size="10.5" fill="#8C6D45" text-anchor="middle" transform="rotate(-90 ${x1 - 6} ${(y1 + y2) / 2})">${t}</text>`
      : `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#8C6D45" stroke-width="0.9"/><line x1="${x1}" y1="${y1 - 4}" x2="${x1}" y2="${y1 + 4}" stroke="#8C6D45"/><line x1="${x2}" y1="${y2 - 4}" x2="${x2}" y2="${y2 + 4}" stroke="#8C6D45"/><text x="${(x1 + x2) / 2}" y="${y1 - 5}" font-size="10.5" fill="#8C6D45" text-anchor="middle">${t}</text>`;
    g += dim(X(0), Y(0) - 22, X(bw), Y(0) - 22, (bw * 1000).toLocaleString());
    if (bw < W) g += dim(X(bw), Y(0) - 22, X(W), Y(0) - 22, ((W - bw) * 1000).toLocaleString());
    g += dim(X(0) - 22, Y(0), X(0) - 22, Y(D), (D * 1000).toLocaleString(), 1);
    // 방위·축척
    const nx = vw - 34, ny = vh - 46;
    g += `<g transform="translate(${nx},${ny})"><circle r="14" fill="none" stroke="#2E2A26" stroke-width="1"/><path d="M0,-12 L5,6 L0,2 L-5,6 Z" fill="#2E2A26"/><text y="-17" text-anchor="middle" font-size="10" font-weight="700" fill="#2E2A26">N</text></g>`;
    g += `<g transform="translate(${pad},${vh - 20})"><rect width="${S}" height="5" fill="#2E2A26"/><rect x="${S}" width="${S}" height="5" fill="none" stroke="#2E2A26"/><rect x="${2 * S}" width="${S * 2}" height="5" fill="#2E2A26"/><text x="0" y="-4" font-size="9" fill="#7D766C">0</text><text x="${S * 4}" y="-4" font-size="9" fill="#7D766C">4m</text></g>`;
    return `<svg viewBox="0 0 ${vw} ${vh}" class="dz-svg" role="img" aria-label="${P.title}"><defs>${defs()}</defs><rect width="${vw}" height="${vh}" fill="#F7F3EC"/>${g}</svg>`;
  }
  function defs() {
    return `<marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#8C6D45"/></marker>
      <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="#A39B8E" stroke-width="1.2"/></pattern>
      <pattern id="stone" width="46" height="18" patternUnits="userSpaceOnUse"><rect width="46" height="18" fill="#3E4147"/><rect x="1" y="1" width="27" height="7" fill="#4A4D54"/><rect x="30" y="1" width="15" height="7" fill="#45484F"/><rect x="1" y="10" width="13" height="7" fill="#46494F"/><rect x="16" y="10" width="29" height="7" fill="#4C4F56"/></pattern>
      <pattern id="stoneL" width="30" height="12" patternUnits="userSpaceOnUse"><rect width="30" height="12" fill="#8E9095"/><rect x=".5" y=".5" width="18" height="5" fill="#9A9CA1"/><rect x="19.5" y=".5" width="10" height="5" fill="#94969B"/><rect x=".5" y="6.5" width="9" height="5" fill="#96989D"/><rect x="10.5" y="6.5" width="19" height="5" fill="#A0A2A7"/></pattern>
      <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE7BD"/><stop offset=".55" stop-color="#F6C27A"/><stop offset="1" stop-color="#D99A52"/></linearGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9D6E2"/><stop offset="1" stop-color="#8FA4B8"/></linearGradient>
      <radialGradient id="lamp"><stop offset="0" stop-color="#FFE6B0" stop-opacity=".95"/><stop offset=".35" stop-color="#FFCF85" stop-opacity=".45"/><stop offset="1" stop-color="#FFB960" stop-opacity="0"/></radialGradient>`;
  }

  // ── 높이 (m) ──
  const Hh = { fl1: 0.3, fl2: 3.3, fl3: 6.2, eave: 6.6, ridge: 9.4 };

  // ── 입면도 ──
  function elevSVG(side) {
    const S = 40, pad = 56, base = 9.9 * S + pad; // 지면 y
    const Wd = side === 'S' ? 9.6 : 6.2, vw = (Wd + 2) * S + pad * 2 - 40, vh = base + 46;
    const X = x => pad + x * S, Z = z => base - z * S;
    let g = `<rect width="${vw}" height="${vh}" fill="#F7F3EC"/>`;
    g += `<line x1="10" y1="${Z(0)}" x2="${vw - 10}" y2="${Z(0)}" stroke="#2E2A26" stroke-width="2"/>`;
    const rect = (x1, z1, x2, z2, fill, st) => `<rect x="${X(x1)}" y="${Z(z2)}" width="${(x2 - x1) * S}" height="${(z2 - z1) * S}" fill="${fill}" stroke="${st || '#2E2A26'}" stroke-width="1.2"/>`;
    const win = (x1, z1, x2, z2, div) => { let s = rect(x1, z1, x2, z2, 'url(#glass)', '#2E2A26'); for (let i = 1; i < (div || 1); i++) { const xx = x1 + (x2 - x1) * i / div; s += `<line x1="${X(xx)}" y1="${Z(z2)}" x2="${X(xx)}" y2="${Z(z1)}" stroke="#2E2A26" stroke-width="1.6"/>`; } return s; };
    if (side === 'S') {
      g += rect(0, 0, 9.6, Hh.fl2, 'url(#stoneL)');                  // 1층 석재
      g += rect(-0.1, Hh.fl2 - 0.25, 9.7, Hh.fl2, '#2E2A26');          // 층간 밴드
      g += rect(0, Hh.fl2, 8.0, Hh.eave, '#FBFAF7');                   // 2층 화이트 패널
      for (let x = 1.0; x < 8; x += 1.0) g += `<line x1="${X(x)}" y1="${Z(Hh.eave)}" x2="${X(x)}" y2="${Z(Hh.fl2)}" stroke="#E2DED6" stroke-width="0.8"/>`;
      // 지붕 (남측 경사면)
      g += `<polygon points="${X(-0.35)},${Z(6.28)} ${X(8.35)},${Z(6.28)} ${X(8.35)},${Z(Hh.ridge + 0.15)} ${X(-0.35)},${Z(Hh.ridge + 0.15)}" fill="#2B2F35" stroke="#1D2024" stroke-width="1.2"/>`;
      for (let x = -0.1; x < 8.3; x += 0.45) g += `<line x1="${X(x)}" y1="${Z(6.28)}" x2="${X(x)}" y2="${Z(Hh.ridge + 0.15)}" stroke="#3A3F46" stroke-width="0.9"/>`;
      g += rect(1.4, 7.4, 2.4, 8.4, '#5D7891', '#1D2024') + rect(5.0, 7.4, 6.0, 8.4, '#5D7891', '#1D2024');   // 천창
      // 창
      g += win(0.3, Hh.fl1, 4.0, 2.9, 4) + win(6.2, 0.9, 9.2, 2.6, 3) + win(4.5, 1.6, 5.4, 2.5, 1);
      g += win(0.4, 3.7, 3.6, 6.2, 3) + win(4.6, 4.0, 7.6, 6.2, 3);
      g += rect(3.75, 3.7, 4.45, 6.2, '#A9784E', '#6B4A30'); for (let x = 3.83; x < 4.45; x += 0.12) g += `<line x1="${X(x)}" y1="${Z(6.2)}" x2="${X(x)}" y2="${Z(3.7)}" stroke="#7E5636" stroke-width="1.4"/>`;
      // 테라스 유리 난간
      g += `<rect x="${X(8.0)}" y="${Z(4.4)}" width="${1.6 * S}" height="${1.1 * S}" fill="#BFD0DD" opacity=".55" stroke="#2E2A26"/>`;
      // 데크
      g += rect(-0.8, 0, 6.2, Hh.fl1, '#A88664', '#6B4A30');
      [4.2, 5.8, 9.45].forEach(x => g += `<circle cx="${X(x)}" cy="${Z(2.7)}" r="10" fill="url(#lamp)"/><rect x="${X(x) - 2}" y="${Z(2.75)}" width="4" height="7" fill="#2E2A26"/>`);
      // 높이 치수
      g += levels(X(9.6) + 18, Z, [`1FL +${Hh.fl1} (GL+0.3)`, `2FL +${Hh.fl2}`, `다락 +${Hh.fl3}`, `최고 +${Hh.ridge}`], [Hh.fl1, Hh.fl2, Hh.fl3, Hh.ridge]);
    } else { // 서측 (박공면) — 왼쪽이 북, 오른쪽이 남
      g += rect(0, 0, 6.2, Hh.fl2, 'url(#stoneL)');
      g += rect(-0.1, Hh.fl2 - 0.25, 6.3, Hh.fl2, '#2E2A26');
      g += `<polygon points="${X(0)},${Z(Hh.fl2)} ${X(6.2)},${Z(Hh.fl2)} ${X(6.2)},${Z(Hh.eave)} ${X(3.1)},${Z(Hh.ridge)} ${X(0)},${Z(Hh.eave)}" fill="#FBFAF7" stroke="#2E2A26" stroke-width="1.2"/>`;
      g += `<polyline points="${X(-0.4)},${Z(6.24)} ${X(3.1)},${Z(Hh.ridge + 0.22)} ${X(6.6)},${Z(6.24)}" fill="none" stroke="#1D2024" stroke-width="7" stroke-linejoin="miter"/>`;
      g += win(1.4, 0.9, 5.0, 2.6, 3) + win(3.4, 3.8, 5.8, 6.0, 2) + win(0.6, 4.6, 1.6, 5.6, 1) + win(2.5, 6.9, 3.7, 8.4, 1);
      g += rect(5.95, 0, 7.6, Hh.fl1, '#A88664', '#6B4A30');
      g += levels(X(6.6) + 22, Z, ['GL ±0', `2FL +${Hh.fl2}`, `처마 +${Hh.eave}`, `최고 +${Hh.ridge}`], [0, Hh.fl2, Hh.eave, Hh.ridge]);
      g += `<text x="${X(0)}" y="${Z(0) + 16}" font-size="10" fill="#7D766C">북</text><text x="${X(6.2)}" y="${Z(0) + 16}" font-size="10" fill="#7D766C" text-anchor="end">남</text>`;
    }
    return `<svg viewBox="0 0 ${vw} ${vh}" class="dz-svg"><defs>${defs()}</defs>${g}</svg>`;
  }
  function levels(x, Z, labels, zs) {
    return zs.map((z, i) => `<line x1="${x - 6}" y1="${Z(z)}" x2="${x + 6}" y2="${Z(z)}" stroke="#8C6D45"/><path d="M${x - 4},${Z(z) - 6} L${x + 4},${Z(z) - 6} L${x},${Z(z)} Z" fill="#8C6D45"/><text x="${x + 9}" y="${Z(z) + 3.5}" font-size="10" fill="#8C6D45">${labels[i]}</text>`).join('');
  }

  // ── 단면도 A-A (x=2.0 m 절단, 서→동 방향으로 봄: 왼쪽 북, 오른쪽 남) ──
  function sectionSVG() {
    const S = 40, pad = 56, base = 9.9 * S + pad, vw = 11.6 * S + pad * 2, vh = base + 70;
    const X = y => pad + y * S, Z = z => base - z * S;
    let g = `<rect width="${vw}" height="${vh}" fill="#F7F3EC"/>`;
    g += `<rect x="10" y="${Z(0)}" width="${vw - 20}" height="38" fill="#E6DCCB"/><line x1="10" y1="${Z(0)}" x2="${vw - 10}" y2="${Z(0)}" stroke="#2E2A26" stroke-width="2"/>`;
    const cut = (y1, z1, y2, z2) => `<rect x="${X(y1)}" y="${Z(z2)}" width="${(y2 - y1) * S}" height="${(z2 - z1) * S}" fill="#2E2A26"/>`;
    // 실내 공간
    const room = (y1, z1, y2, z2, fill, name, h) => `<rect x="${X(y1)}" y="${Z(z2)}" width="${(y2 - y1) * S}" height="${(z2 - z1) * S}" fill="${fill}"/><text x="${X((y1 + y2) / 2)}" y="${Z((z1 + z2) / 2)}" text-anchor="middle" font-size="12.5" font-weight="700" fill="#2E2A26">${name}</text>${h ? `<text x="${X((y1 + y2) / 2)}" y="${Z((z1 + z2) / 2) + 15}" text-anchor="middle" font-size="10" fill="#7D766C">${h}</text>` : ''}`;
    g += room(0, Hh.fl1, 6.2, Hh.fl2 - 0.3, '#F0E7D8', '파티룸', '천장고 2.7m');
    g += room(0, Hh.fl2, 6.2, Hh.fl3 - 0.3, '#F3ECE0', '', '');
    g += `<text x="${X(3.1)}" y="${Z(5.35)}" text-anchor="middle" font-size="12.5" font-weight="700" fill="#2E2A26">2층 LDK</text><text x="${X(3.1)}" y="${Z(5.35) + 15}" text-anchor="middle" font-size="10" fill="#7D766C">천장고 2.6m</text>`;
    g += `<polygon points="${X(0)},${Z(Hh.fl3)} ${X(6.2)},${Z(Hh.fl3)} ${X(6.2)},${Z(Hh.eave)} ${X(3.1)},${Z(Hh.ridge)} ${X(0)},${Z(Hh.eave)}" fill="#F5EFE4"/>`;
    g += `<text x="${X(3.1)}" y="${Z(7.6)}" text-anchor="middle" font-size="12.5" font-weight="700" fill="#2E2A26">다락 침실</text><text x="${X(3.1)}" y="${Z(7.6) + 15}" text-anchor="middle" font-size="10" fill="#7D766C">평균 높이 1.8m (최고 3.2m)</text>`;
    // 구조체(절단면)
    g += cut(-0.25, -0.5, 6.45, Hh.fl1);                 // 기초·바닥
    g += cut(-0.25, Hh.fl2 - 0.3, 6.45, Hh.fl2);         // 2층 바닥
    g += cut(-0.25, Hh.fl3 - 0.3, 6.2, Hh.fl3);          // 다락 바닥
    g += cut(-0.25, Hh.fl1, 0, Hh.eave); g += cut(6.2, Hh.fl1, 6.45, Hh.eave);   // 외벽
    g += `<polygon points="${X(-0.6)},${Z(6.18)} ${X(3.1)},${Z(Hh.ridge + 0.32)} ${X(6.8)},${Z(6.18)} ${X(6.8)},${Z(5.9)} ${X(3.1)},${Z(Hh.ridge + 0.02)} ${X(-0.6)},${Z(5.9)}" fill="#2E2A26"/>`; // 지붕
    // 남측 창(절단면에서 보이는 개구부) 표시
    g += `<rect x="${X(6.2)}" y="${Z(2.9)}" width="${0.25 * S}" height="${2.6 * S}" fill="#9FB6C8"/><rect x="${X(6.2)}" y="${Z(6.2) + 0.3 * S}" width="${0.25 * S}" height="${2.2 * S}" fill="#9FB6C8"/>`;
    // 천창
    const sp = t => [X(6.6 - t * 3.5), Z(6.18 + t * 3.24)];
    const a = sp(0.3), b = sp(0.55);
    g += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#7FA6C4" stroke-width="6"/><text x="${b[0] + 14}" y="${b[1] - 6}" font-size="10" fill="#56707F">천창</text>`;
    // 가구 실루엣
    g += `<rect x="${X(0.3)}" y="${Z(Hh.fl1 + 2.2)}" width="${0.55 * S}" height="${2.2 * S}" fill="#6B4F3A"/><text x="${X(0.58)}" y="${Z(Hh.fl1 + 2.4)}" font-size="9" text-anchor="middle" fill="#6B4F3A">와인월</text>`;
    g += `<rect x="${X(1.5)}" y="${Z(Hh.fl1 + 1.0)}" width="${0.75 * S}" height="${1.0 * S}" fill="#9C9285"/>`;
    g += `<rect x="${X(3.8)}" y="${Z(Hh.fl1 + 0.75)}" width="${1.9 * S}" height="${0.75 * S}" rx="6" fill="#B5A693"/>`;
    g += `<rect x="${X(0.1)}" y="${Z(Hh.fl2 + 0.9)}" width="${0.6 * S}" height="${0.9 * S}" fill="#BCB2A3"/><rect x="${X(2.55)}" y="${Z(Hh.fl2 + 0.95)}" width="${0.8 * S}" height="${0.95 * S}" fill="#9C9285"/>`;
    g += `<rect x="${X(4.9)}" y="${Z(Hh.fl2 + 0.8)}" width="${0.9 * S}" height="${0.8 * S}" rx="6" fill="#B5A693"/>`;
    g += `<rect x="${X(2.2)}" y="${Z(Hh.fl3 + 0.45)}" width="${2.0 * S}" height="${0.45 * S}" rx="4" fill="#E9E1D3" stroke="#A39B8E"/>`;
    // 데크
    g += `<rect x="${X(6.45)}" y="${Z(Hh.fl1)}" width="${2.6 * S}" height="${Hh.fl1 * S}" fill="#A88664"/><text x="${X(7.75)}" y="${Z(Hh.fl1) - 6}" text-anchor="middle" font-size="10" fill="#6B4A30">데크</text>`;
    // 레벨
    g += levels(X(9.4), Z, [`1FL +${Hh.fl1} (GL+0.3)`, `2FL +${Hh.fl2}`, `다락 +${Hh.fl3}`, `최고 +${Hh.ridge}`], [Hh.fl1, Hh.fl2, Hh.fl3, Hh.ridge]);
    g += `<text x="${X(0)}" y="${vh - 10}" font-size="10" fill="#7D766C">북</text><text x="${X(6.2)}" y="${vh - 10}" font-size="10" fill="#7D766C" text-anchor="end">남 (정원·조망)</text>`;
    return `<svg viewBox="0 0 ${vw} ${vh}" class="dz-svg"><defs>${defs()}</defs>${g}</svg>`;
  }

  // ── 외관 투시도 (간이 3D 투영) ──
  function exteriorSVG(mode) {
    const VW = 1200, VH = 720;
    const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], nrm = a => { const l = Math.hypot(...a); return a.map(v => v / l); };
    const cam = mode === 'day' ? [-15, 29, 3.4] : [-13.5, 27.5, 3.0], tgt = [4.4, 3.6, 3.9];
    const f = nrm(sub(tgt, cam)), r = nrm(cross([0, 0, 1], f)), u = cross(f, r), FL = 1500;
    const CX = mode === 'day' ? VW / 2 : VW * 0.62;
    const P = p => { const d = sub(p, cam), z = dot(d, f); return [CX + FL * dot(d, r) / z, VH * 0.58 - FL * dot(d, u) / z]; };
    const pg = (pts, fill, extra) => `<polygon points="${pts.map(P).map(q => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' ')}" fill="${fill}" ${extra || ''}/>`;
    const ln = (a, b, st, w) => { const p = P(a), q = P(b); return `<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="${st}" stroke-width="${w}"/>`; };
    const night = mode !== 'day';
    const WIN = night ? 'url(#glowX)' : 'url(#glassX)';
    // 면 위 사각형: 남측면(y=6.2) x1..x2, z1..z2 / 서측면(x=0) y1..y2
    const sq = (x1, z1, x2, z2, y, fill, ex) => pg([[x1, y, z1], [x2, y, z1], [x2, y, z2], [x1, y, z2]], fill, ex);
    const wq = (y1, z1, y2, z2, x, fill, ex) => pg([[x, y1, z1], [x, y2, z1], [x, y2, z2], [x, y1, z2]], fill, ex);
    const mull = (x1, z1, x2, z2, y, n) => { let s = ''; for (let i = 1; i < n; i++) { const xx = x1 + (x2 - x1) * i / n; s += ln([xx, y, z1], [xx, y, z2], '#1E2125', 2.2); } return s; };
    let g = '';
    // 하늘·산·숲
    g += `<rect width="${VW}" height="${VH}" fill="url(#sky${night ? 'N' : 'D'})"/>`;
    g += `<path d="M0,410 C150,330 260,360 380,320 C520,270 640,330 760,300 C900,262 1040,320 1200,292 L1200,470 L0,470 Z" fill="${night ? '#2A3448' : '#9FB3B8'}" opacity=".85"/>`;
    for (let i = 0; i < 26; i++) { const x = i * 48 + (i % 3) * 9, h = 120 + (i * 37 % 90); g += `<path d="M${x},${470} L${x + 24},${470 - h} L${x + 48},470 Z" fill="${night ? '#16231E' : '#3F5E4A'}" opacity="${0.75 + (i % 2) * 0.2}"/>`; }
    g += `<rect y="455" width="${VW}" height="${VH - 455}" fill="${night ? '#1C2A20' : '#5E7F55'}"/>`;
    // 지면·데크
    g += pg([[-6, 6.2, 0], [12, 6.2, 0], [14, 14, 0], [-8, 14, 0]], night ? '#24331F' : '#6E8F5C');
    g += pg([[-0.9, 6.2, 0.3], [6.4, 6.2, 0.3], [6.4, 8.9, 0.3], [-0.9, 8.9, 0.3]], night ? '#6E5642' : '#B08D69');
    g += pg([[-0.9, 8.9, 0], [6.4, 8.9, 0], [6.4, 8.9, 0.3], [-0.9, 8.9, 0.3]], night ? '#4A3A2D' : '#8A6A4C');
    g += pg([[-0.9, 6.2, 0], [-0.9, 8.9, 0], [-0.9, 8.9, 0.3], [-0.9, 6.2, 0.3]], night ? '#4A3A2D' : '#8A6A4C');
    for (let x = -0.6; x < 6.4; x += 0.35) g += ln([x, 6.2, 0.3], [x, 8.9, 0.3], night ? '#5E4938' : '#9C7B5B', 0.8);
    // 1층 서측·남측(석재)
    g += wq(0, 0, 6.2, 3.3, 0, night ? 'url(#stoneN)' : 'url(#stoneD)');
    g += sq(0, 0, 9.6, 3.3, 6.2, night ? 'url(#stoneN)' : 'url(#stoneD)');
    // 테라스 바닥
    g += pg([[8.0, 0, 3.3], [9.6, 0, 3.3], [9.6, 6.2, 3.3], [8.0, 6.2, 3.3]], night ? '#5A4636' : '#A88664');
    // 층간 밴드
    g += sq(-0.08, 3.05, 9.68, 3.33, 6.28, '#1E2125'); g += wq(-0.08, 3.05, 6.28, 3.33, -0.08, '#25282D');
    // 2층 서측·남측(화이트)
    g += wq(0, 3.3, 6.2, 6.6, 0, night ? '#C9CCD1' : '#ECEBE7');
    g += sq(0, 3.3, 8.0, 6.6, 6.2, night ? '#DCDDE0' : '#FBFAF7');
    for (let x = 1; x < 8; x++) g += ln([x, 6.2, 3.33], [x, 6.2, 6.6], night ? '#C3C5C9' : '#E4E1DA', 0.8);
    // 박공(서측)
    g += pg([[0, 0, 6.6], [0, 6.2, 6.6], [0, 3.1, 9.4]], night ? '#C2C5CA' : '#E8E7E2');
    // 지붕 남측 경사면
    const rp = (x, t) => [x, 6.55 - t * 3.45, 6.28 + t * 3.27];
    g += pg([rp(-0.4, 0), rp(8.4, 0), rp(8.4, 1), rp(-0.4, 1)], night ? '#1B1E22' : '#2C3036');
    for (let x = -0.15; x < 8.4; x += 0.42) g += ln(rp(x, 0), rp(x, 1), night ? '#262A2F' : '#3B4047', 1);
    g += pg([rp(1.4, 0.36), rp(2.4, 0.36), rp(2.4, 0.62), rp(1.4, 0.62)], night ? '#8FB4D6' : '#6E8FAA') + pg([rp(5.0, 0.36), rp(6.0, 0.36), rp(6.0, 0.62), rp(5.0, 0.62)], night ? '#8FB4D6' : '#6E8FAA');
    // 박공 처마(검정 후레싱)
    g += `<polyline points="${[[-0.4, 6.55, 6.28], [-0.4, 3.1, 9.62], [-0.4, -0.35, 6.28]].map(P).map(q => q.join(',')).join(' ')}" fill="none" stroke="#111316" stroke-width="9" stroke-linejoin="miter"/>`;
    g += ln(rp(-0.4, 0), rp(8.4, 0), '#111316', 5);
    // 창 — 1층
    g += sq(0.3, 0.3, 4.0, 2.9, 6.21, WIN) + mull(0.3, 0.3, 4.0, 2.9, 6.21, 4);
    g += sq(6.2, 0.9, 9.2, 2.6, 6.21, WIN) + mull(6.2, 0.9, 9.2, 2.6, 6.21, 3);
    g += sq(4.5, 1.6, 5.4, 2.5, 6.21, night ? '#C79A62' : 'url(#glassX)');
    g += wq(1.2, 0.9, 4.8, 2.6, -0.01, WIN);
    // 창 — 2층
    g += sq(0.4, 3.7, 3.6, 6.2, 6.21, WIN) + mull(0.4, 3.7, 3.6, 6.2, 6.21, 3);
    g += sq(4.6, 4.0, 7.6, 6.2, 6.21, WIN) + mull(4.6, 4.0, 7.6, 6.2, 6.21, 3);
    g += sq(3.75, 3.7, 4.45, 6.2, 6.215, '#9A6B45'); for (let x = 3.8; x < 4.45; x += 0.11) g += ln([x, 6.22, 3.7], [x, 6.22, 6.2], '#6E4A2E', 1.6);
    g += wq(3.4, 3.8, 5.8, 6.0, -0.01, WIN) + wq(0.6, 4.6, 1.6, 5.6, -0.01, WIN);
    g += wq(2.5, 6.9, 3.7, 8.4, -0.01, WIN);
    // 테라스 유리 난간
    g += pg([[8.0, 6.2, 3.3], [9.6, 6.2, 3.3], [9.6, 6.2, 4.4], [8.0, 6.2, 4.4]], '#B8CCDA', 'opacity=".35"') + ln([8.0, 6.2, 4.4], [9.6, 6.2, 4.4], '#1E2125', 2);
    // 조명
    if (night) {
      [[4.2, 6.25, 2.7], [5.8, 6.25, 2.7], [9.45, 6.25, 2.7], [-0.05, 0.5, 2.7], [-0.05, 5.5, 2.7]].forEach(p => { const q = P(p); g += `<circle cx="${q[0]}" cy="${q[1] + 16}" r="46" fill="url(#lampX)"/><rect x="${q[0] - 3}" y="${q[1] - 4}" width="6" height="12" fill="#111316"/>`; });
      [[0.3, 6.25, 0.3], [4.0, 6.25, 0.3]].forEach(p => { const q = P(p); g += `<ellipse cx="${q[0]}" cy="${q[1] + 4}" rx="90" ry="16" fill="url(#lampX)" opacity=".6"/>`; });
      [[-1.6, 9.6, 0], [3.0, 9.8, 0], [7.4, 9.4, 0]].forEach(p => { const q = P(p); g += `<rect x="${q[0] - 3}" y="${q[1] - 26}" width="6" height="26" fill="#2A2D31"/><circle cx="${q[0]}" cy="${q[1] - 26}" r="20" fill="url(#lampX)"/>`; });
    }
    // 데크 위 야외 소파 (박스)
    const box = (x1, y1, x2, y2, z, c1, c2) => pg([[x1, y2, 0.3], [x2, y2, 0.3], [x2, y2, z], [x1, y2, z]], c1) + pg([[x1, y1, z], [x2, y1, z], [x2, y2, z], [x1, y2, z]], c2) + pg([[x1, y1, 0.3], [x1, y2, 0.3], [x1, y2, z], [x1, y1, z]], c1);
    g += box(0.4, 7.2, 2.6, 8.0, 0.75, night ? '#8E8478' : '#CFC6B8', night ? '#A79C8E' : '#E6DED2');
    g += box(3.4, 7.3, 4.6, 8.1, 0.65, night ? '#4A3A2D' : '#7A5C44', night ? '#5C4838' : '#93705A');
    // 앞쪽 나무
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
      // 박공 천장 방
      g += `<rect width="${W}" height="${H}" fill="#2A2724"/>`;
      g += `<polygon points="0,400 0,250 160,250 320,95 480,250 640,250 640,400" fill="#E9E2D6"/>`;
      g += `<polygon points="0,0 320,0 320,95 160,250 0,250" fill="#D9D0C2"/><polygon points="320,0 640,0 640,250 480,250 320,95" fill="#CFC5B6"/>`;
      g += `<polygon points="160,250 320,95 480,250" fill="#EFE9DF"/>`;
      g += `<polygon points="0,400 160,250 480,250 640,400" fill="#A07D5C"/>`;
      for (let i = 0; i < 9; i++) g += `<line x1="${160 + i * 40}" y1="250" x2="${-40 + i * 90}" y2="400" stroke="#8D6C4E" stroke-width="1"/>`;
      g += `<polygon points="70,60 190,25 225,120 105,160" fill="#1B2A44"/><polygon points="70,60 190,25 225,120 105,160" fill="none" stroke="#3B342D" stroke-width="6"/>`;
      [[110, 70], [150, 55], [170, 100], [130, 115], [195, 80]].forEach(([x, y]) => g += `<circle cx="${x}" cy="${y}" r="1.6" fill="#FFF"/>`);
      g += `<rect x="292" y="165" width="56" height="62" fill="#3B4B63" stroke="#3B342D" stroke-width="4"/>`;
      g += `<polygon points="200,330 440,330 470,372 170,372" fill="#F4EFE6"/><rect x="170" y="372" width="300" height="10" fill="#8D7A66"/><polygon points="215,312 425,312 440,330 200,330" fill="#E7DED0"/><rect x="230" y="296" width="80" height="22" rx="8" fill="#FFFDF8"/><rect x="330" y="296" width="80" height="22" rx="8" fill="#FFFDF8"/>`;
      g += `<polygon points="250,335 470,335 480,372 230,372" fill="#B79E7E" opacity=".75"/>`;
      g += `<rect x="128" y="318" width="34" height="40" fill="#8D7A66"/><rect x="478" y="318" width="34" height="40" fill="#8D7A66"/>`;
      g += `<circle cx="145" cy="300" r="60" fill="url(#lamp)"/><rect x="138" y="292" width="14" height="22" rx="3" fill="#F7E8CC"/><circle cx="495" cy="300" r="60" fill="url(#lamp)"/><rect x="488" y="292" width="14" height="22" rx="3" fill="#F7E8CC"/>`;
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
    const a1 = sum('f1'), a2 = sum('f2'), att = 8.0 * (6.2 - 2 * 1.1 / 0.903 * 1);
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
          <div class="dz-copy">아래층은 함께, 위층은 쉼 — 힐링과 연회를 위한 완벽한 공간 분리</div>
        </div>
        <div class="dz-stats"><div><b>${f1(a1 / PYC)}평</b><span>1층 · ${f1(a1)}㎡</span></div><div><b>${f1(a2 / PYC)}평</b><span>2층 · ${f1(a2)}㎡</span></div><div><b>${f1((a1 + a2) / PYC)}평</b><span>연면적 · ${f1(a1 + a2)}㎡</span></div><div><b>+ 다락</b><span>유효 약 ${f1(att / PYC)}평</span></div></div>
      </section>

      ${sec('01', 'CONCEPT', '공간 컨셉', `<div class="dz-grid4">
        <div class="dz-card"><div class="dz-ic">🍷</div><b>PRIVATE ENTERTAINMENT</b><span>1층 8평 파티룸 — 와인셀러 월과 바 아일랜드, 시네마 스크린, 데크로 열리는 3.7m 슬라이딩 도어</span></div>
        <div class="dz-card"><div class="dz-ic">🏞️</div><b>PANORAMA LDK</b><span>2층 10.8평 대면형 LDK — 아일랜드에서 거실과 남측 산 조망을 마주하고, 동측 3평 테라스로 이어지는 동선</span></div>
        <div class="dz-card"><div class="dz-ic">✨</div><b>ATTIC BEDROOM</b><span>박공 아래 다락 침실 — 천창으로 별을 보며 잠드는 공간, 양쪽 박공창으로 맞통풍</span></div>
        <div class="dz-card"><div class="dz-ic">🛏️</div><b>GUEST SUITE</b><span>1층 침실·욕실·세탁실 — 파티가 끝나도 서로 방해 없는 게스트 동선, 정원 쪽 세탁실 창</span></div>
      </div>`)}

      ${sec('02', 'EXTERIOR', '외관 투시도', `<div class="dz-ext2">${exteriorSVG('day')}</div><div class="dz-cap">석재 1층 · 화이트 2층 · 블랙 징크 박공지붕 · 우드 루버 포인트 — 낮의 표정</div>`)}

      ${sec('03', 'FLOOR PLAN', '평면도', `<div class="dz-plans">
        <figure>${planSVG('f1')}<figcaption><b>1F</b> 파티룸 · 게스트 침실 · 욕실 · 세탁실 · 현관 — ${f1(a1 / PYC)}평</figcaption></figure>
        <figure>${planSVG('f2')}<figcaption><b>2F</b> 대면형 LDK · 욕실 · 다용도실 + 테라스 3평 — ${f1(a2 / PYC)}평</figcaption></figure>
        <figure>${planSVG('f3')}<figcaption><b>ATTIC</b> 다락 침실 · 천창 2개 · 박공창 2개 — 유효 약 ${f1(att / PYC)}평</figcaption></figure>
      </div>`, 'dz-paper')}

      ${sec('04', 'ELEVATION & SECTION', '입면도 · 단면도', `<div class="dz-plans dz-2col">
        <figure>${elevSVG('S')}<figcaption><b>남측 입면도</b> 정원·조망면 — 1층 전면 슬라이딩, 2층 파노라마 창</figcaption></figure>
        <figure>${elevSVG('W')}<figcaption><b>서측 입면도</b> 박공면 — 블랙 후레싱 라인</figcaption></figure>
        <figure class="dz-wide">${sectionSVG()}<figcaption><b>단면도 A-A</b> 파티룸 천장고 2.7m · LDK 2.6m · 다락 평균 1.8m (경사지붕 다락 기준)</figcaption></figure>
      </div>`, 'dz-paper')}

      ${sec('05', 'MODEL HOUSE', '모델하우스 연출', `<div class="dz-grid3">
        <figure class="dz-int-f">${interiorSVG('party')}<figcaption><b>1층 파티룸</b> 월넛 와인월 · 바 아일랜드 · 펜던트 조명</figcaption></figure>
        <figure class="dz-int-f">${interiorSVG('ldk')}<figcaption><b>2층 LDK</b> 대면형 아일랜드 너머 파노라마 창</figcaption></figure>
        <figure class="dz-int-f">${interiorSVG('attic')}<figcaption><b>다락 침실</b> 천창과 박공 천장의 아늑함</figcaption></figure>
      </div><div class="dz-cap">※ 연출 예시 일러스트 — 실제 마감·가구는 설계 단계에서 확정</div>`)}

      ${sec('06', 'SPEC & AREA', '마감 사양 · 면적표', `<div class="dz-2col-t">
        <table class="dz-spec">
          <tr><th>외장</th><td>1층 현무암톤 석재 타일 · 2층 화이트 세라믹 패널 · 우드 루버 포인트</td></tr>
          <tr><th>지붕</th><td>블랙 징크(스탠딩심) 박공지붕, 천창 2개소</td></tr>
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
          <tr><td>다락</td><td>유효(높이 1.5m 이상)</td><td class="r">${f1(att)}</td><td class="r">${f1(att / PYC)}</td></tr>
        </tbody></table>
      </div>${est}
      <div class="dz-legal">본 자료는 <b>개념 설계(계획안)</b>입니다. 건폐율·용적률·이격거리·주차, 구조·설비 및 다락 면적 산입 기준(경사지붕 평균 높이 1.8m 이하 등)은 대지 조건과 법규에 따라 달라지므로 <b>건축사 설계와 인허가 검토</b>가 필요합니다. 치수 단위 mm, 높이 단위 m.</div>`)}

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
