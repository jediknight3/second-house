// ══════════════════════════════════════════════════════════════
//  세컨하우스 건축노트 — Google Apps Script 백엔드
//  1) 구글 시트 새로 만들기 → 확장 프로그램 → Apps Script
//  2) 이 코드 전체 붙여넣기 → 저장
//  3) 배포 → 새 배포 → 유형: 웹 앱
//     - 실행 사용자: 나 / 액세스 권한: 모든 사용자
//  4) 발급된 /exec URL을 앱 설정 탭에 입력
//  * 사진·도면·계약서 원본은 내 구글 드라이브 "세컨하우스_자료" 폴더에 저장됩니다.
// ══════════════════════════════════════════════════════════════

const SHEETS = {
  project: '프로젝트',
  phase:   '공정',
  budget:  '예산',
  expense: '지출',
  vendor:  '업체',
  meeting: '미팅',
  todo:    '할일',
  file:    '자료',
};
const FOLDER_NAME = '세컨하우스_자료';

function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) || 'readAll';
  try {
    if (action === 'ping') return out({ ok: true });
    if (action === 'readAll') return out({ ok: true, data: readAll() });
    return out({ error: 'unknown action: ' + action });
  } catch (err) {
    return out({ error: String(err) });
  }
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return out({ error: 'bad json' });
  }
  try {
    switch (body.action) {
      case 'ping':    return out({ ok: true });
      case 'readAll': return out({ ok: true, data: readAll() });
      case 'batch':   return out(withLock(() => runBatch(body.ops || [])));
      case 'upload':  return out(upload(body));
      default:        return out({ error: 'unknown action: ' + body.action });
    }
  } catch (err) {
    return out({ error: String(err) });
  }
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function withLock(fn) {
  const lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try { return fn(); } finally { lock.releaseLock(); }
}

// ── 시트 헬퍼 ──
function ss() { return SpreadsheetApp.getActiveSpreadsheet(); }

function sheetOf(col) {
  const name = SHEETS[col];
  if (!name) throw new Error('unknown collection: ' + col);
  let sh = ss().getSheetByName(name);
  if (!sh) {
    sh = ss().insertSheet(name);
    sh.getRange(1, 1).setValue('id');
    sh.setFrozenRows(1);
  }
  return sh;
}

function headersOf(sh) {
  const lc = sh.getLastColumn();
  return lc ? sh.getRange(1, 1, 1, lc).getValues()[0].map(String) : [];
}

function idsOf(sh) {
  const n = sh.getLastRow() - 1;
  return n > 0 ? sh.getRange(2, 1, n, 1).getValues().map(r => String(r[0])) : [];
}

function readAll() {
  const data = {};
  Object.keys(SHEETS).forEach(col => {
    const sh = ss().getSheetByName(SHEETS[col]);
    if (!sh || sh.getLastRow() < 2) { data[col] = []; return; }
    const vals = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
    const h = vals[0].map(String);
    data[col] = vals.slice(1)
      .filter(r => r[0] !== '' && r[0] != null)
      .map(r => {
        const o = {};
        h.forEach((k, i) => { if (k && r[i] !== '') o[k] = r[i] instanceof Date ? fmtDate(r[i]) : r[i]; });
        return o;
      });
  });
  return data;
}

function fmtDate(d) {
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function runBatch(ops) {
  let n = 0;
  ops.forEach(op => {
    if (op.op === 'upsert') { upsertRec(op.col, op.rec); n++; }
    else if (op.op === 'delete') { deleteRec(op.col, op.id); n++; }
  });
  return { ok: true, applied: n };
}

function upsertRec(col, rec) {
  if (!rec || !rec.id) return;
  const sh = sheetOf(col);
  let h = headersOf(sh);
  const missing = Object.keys(rec).filter(k => h.indexOf(k) < 0);
  if (missing.length) {
    sh.getRange(1, h.length + 1, 1, missing.length).setValues([missing]);
    h = h.concat(missing);
  }
  const row = h.map(k => {
    const v = rec[k];
    if (v == null) return '';
    return typeof v === 'object' ? JSON.stringify(v) : String(v);
  });
  const idx = idsOf(sh).indexOf(String(rec.id));
  const r = idx >= 0 ? idx + 2 : sh.getLastRow() + 1;
  const rg = sh.getRange(r, 1, 1, h.length);
  rg.setNumberFormat('@');   // 날짜/숫자 자동변환 방지 (텍스트로 저장)
  rg.setValues([row]);
}

function deleteRec(col, id) {
  const sh = sheetOf(col);
  const idx = idsOf(sh).indexOf(String(id));
  if (idx < 0) return;
  if (col === 'file') {
    const h = headersOf(sh);
    const c = h.indexOf('driveId');
    if (c >= 0) {
      const driveId = sh.getRange(idx + 2, c + 1).getValue();
      if (driveId) {
        try { DriveApp.getFileById(String(driveId)).setTrashed(true); } catch (e) {}
      }
    }
  }
  sh.deleteRow(idx + 2);
}

// ── 드라이브 업로드 ──
function folder() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('FOLDER_ID');
  if (id) {
    try { return DriveApp.getFolderById(id); } catch (e) {}
  }
  const it = DriveApp.getFoldersByName(FOLDER_NAME);
  const f = it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
  props.setProperty('FOLDER_ID', f.getId());
  return f;
}

function upload(body) {
  if (!body.data) throw new Error('no data');
  const blob = Utilities.newBlob(
    Utilities.base64Decode(body.data),
    body.mime || 'application/octet-stream',
    body.name || ('file_' + Date.now())
  );
  const file = folder().createFile(blob);
  if (body.caption) file.setDescription(String(body.caption));
  return { ok: true, id: file.getId(), url: file.getUrl() };
}

// 최초 1회 실행해서 드라이브/시트 권한 승인용
function setup() {
  Object.keys(SHEETS).forEach(sheetOf);
  folder();
}
