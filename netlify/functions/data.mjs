const STORE_NAME = 'family-etf';
const DATA_KEY = 'site-data';

export default async (req) => {
  let store;
  try {
    const { getStore } = await import('@netlify/blobs');
    store = getStore(STORE_NAME);
  } catch (error) {
    return jsonResponse({
      error: 'Netlify Blobs 無法啟動。請確認不是只用拖拉上傳，並確認 package.json 有被 Netlify build 安裝。',
      detail: error.message
    }, 500);
  }

  if (req.method === 'GET') {
    try {
      const data = await store.get(DATA_KEY, { type: 'json' });
      if (!data) {
        return jsonResponse({ error: 'No cloud data yet' }, 404);
      }
      return jsonResponse(data);
    } catch (error) {
      return jsonResponse({
        error: '讀取雲端資料失敗',
        detail: error.message
      }, 500);
    }
  }

  if (req.method === 'POST') {
    const expectedPin = process.env.ADMIN_PIN;
    const providedPin = req.headers.get('x-admin-pin');

    if (!expectedPin) {
      return jsonResponse({ error: 'ADMIN_PIN 尚未在 Netlify 環境變數設定' }, 500);
    }
    if (providedPin !== expectedPin) {
      return jsonResponse({ error: '管理 PIN 不正確' }, 401);
    }

    let data;
    try {
      data = await req.json();
    } catch (error) {
      return jsonResponse({ error: '收到的資料不是正確 JSON' }, 400);
    }

    if (!data.members || !data.sharedRates || !data.memberEtfs) {
      return jsonResponse({ error: 'ETF 資料欄位不完整' }, 400);
    }

    try {
      await store.setJSON(DATA_KEY, data);
      return jsonResponse({ ok: true, savedAt: new Date().toISOString() });
    } catch (error) {
      return jsonResponse({
        error: '寫入雲端資料失敗',
        detail: error.message
      }, 500);
    }
  }

  return jsonResponse({ error: 'Method not allowed' }, 405);
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  });
}
