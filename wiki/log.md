# Wiki Ingest 紀錄

## INGEST-B01｜2026-11-24 00:26–00:28（臺北時間）

| 項目 | SRC-01 | SRC-02 |
|---|---|---|
| 使用者核准 | 是 | 是 |
| 原始網址 | https://service-manual.ons.gov.uk/data-visualisation/guidance/axes-and-gridlines | https://www.itl.nist.gov/div898/handbook/eda/section3/eda351.htm |
| 原文快照 | `raw/SRC-01-ons-axes.html`，70,488 bytes | `raw/SRC-02-nist-location.html`，17,173 bytes |
| SHA-256 | `e6401370c22c1bed9aef8763b4dcda4b9c4f991612dab16dd9ab6879c885b615` | `c55c2d4863a2ac252d6ffd5e6891025faa2e3966ffdd98baeff9af7ec2525501` |
| 指定範圍 | Axis start point | 1.3.5.1 Definition of Location、Why Different Measures |
| 概念 | STAT-01-01 | STAT-02-01、STAT-02-02 |
| 證據卡 | EVID-01-01 | EVID-02-01、EVID-02-02 |
| 結果 | 成功 | 成功 |

實際執行：初次下載 SRC-02 回傳 HTTP 403；改用 NIST 官方 `www.itl.nist.gov` 網址並加入一般瀏覽器 User-Agent 後取得 HTTP 200。ONS 初次下載即取得 HTTP 200。兩份 HTML 均可解析出正確標題與指定內容。未將兩份網頁計為同一份資料。

邊界：此批只支援 CASE-01、CASE-02 的部分概念；其餘案件尚無正式 Wiki 知識。原頁圖片等外部連結未另行下載，後續教學圖表將依核准知識自行製作。網頁快照可供文字核對，不代表取得原網站所有相依資源。
