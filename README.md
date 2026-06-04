# ETF 家庭配息追蹤 Netlify 版

## 部署

把這個資料夾 `etf-netlify` 連接 GitHub 後部署，或使用 Netlify CLI 部署。

重要：如果只用 Netlify Drop 拖拉上傳靜態檔，網頁可以看，但「儲存到雲端」通常不會正常運作，因為雲端儲存需要 Netlify Functions。

Netlify 需要的檔案/資料夾：

- `index.html`
- `data.json`
- `netlify.toml`
- `package.json`
- `netlify/functions/data.mjs`

## 管理 PIN 設定

到 Netlify 網站後台設定環境變數：

- Key: `ADMIN_PIN`
- Value: 你自己設定一組管理 PIN，例如 6 位數字

這組 PIN 只有儲存資料時需要。家人查看網站不需要 PIN。

設定完 `ADMIN_PIN` 後，請重新部署一次，Function 才會讀到新的環境變數。

## 每週更新

1. 開啟網站。
2. 在畫面上更新 ETF 股數或每週配息率。
3. 按「儲存到雲端」。
4. 輸入管理 PIN。
5. 全家重新整理同一個網址後，就會看到最新資料。

「匯出資料檔」可以當備份使用。平常不需要每週重新上傳 `data.json`。
