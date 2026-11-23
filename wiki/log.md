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

## INGEST-B02｜2026-11-24（臺北時間）

| 項目 | SRC-03 | SRC-05 |
|---|---|---|
| 使用者核准 | 是 | 是 |
| 原始資料 | AAPOR 同一份指南的官方 PDF，2022 年 3 月版 | OpenStax 1.4 章節官方頁面 |
| 原文快照 | `raw/SRC-03-aapor-best-practices.pdf`，158,410 bytes | `raw/SRC-05-openstax-experimental-design.html`，290,483 bytes |
| SHA-256 | `7e1989f4da0cf227fe05e56e158eb4c7fec68d6b0b5fbe9e7317988e6292d702` | `9a9b9acb36f01d45962bbec1268b2061f9c8082fe2371f7284542c1db17113bd` |
| 指定範圍 | Designing your sample，PDF 第 3–4 頁 | 1.4 Experimental Design and Ethics 開頭及維生素 E 範例 |
| 概念／證據卡 | STAT-03-01／EVID-03-01 | STAT-04-01／EVID-04-01 |
| 結果 | 成功 | 成功 |

實際執行：AAPOR 網頁下載回傳 HTTP 403，改取其網頁所連結的同一指南官方 PDF，取得 HTTP 200。網路閱讀工具確認 PDF 為 9 頁，標題、版本及指定章節存在；本機檢查 PDF 標頭與檔案大小。OpenStax 官方頁取得 HTTP 200，本機解析出章節標題及潛在變數說明。

邊界：SRC-03 的 PDF 未在本機逐頁抽取文字，章節位置由網路閱讀工具核對。CASE-03、04 只有初步概念覆蓋；沒有把模擬案例當成來源數據。

## INGEST-B03｜2026-11-24（臺北時間）

| Source ID | 原文快照與大小 | SHA-256 | 驗收結果 |
|---|---|---|---|
| SRC-04 | `raw/SRC-04-openintro-ahss4.pdf`，13,271,512 bytes | `79cb40dd30bb5ae0ad323a2b8bffb4f26465abfd586cbd3c94968f9cb832480d` | 原文已取得；指定章節文字尚未核對，未計為成功 Ingest |
| SRC-06 | `raw/SRC-06-psu-simpson.html`，28,708 bytes | `88d479854af7c167c171bf9dcbd7f7d4be849510d84cc9694feb0bd9e71d9f49` | 成功 Ingest；STAT-05-01／EVID-05-01 |
| SRC-07 | `raw/SRC-07-sinica-simpson.pdf`，334,346 bytes | `7263c6153e3904894dbc35a2204c3c8fbf54e27136b64aa3b8bc51e2c35861de` | 原文已取得；全文核對尚未完成，未計為成功 Ingest |

實際執行：SRC-06 的 Python HTTPS 請求遇到憑證鏈驗證失敗；改用 Windows 內建憑證驗證的 `Invoke-WebRequest` 取得 HTTP 200，未停用憑證檢查。SRC-04、SRC-07 PDF 均具 `%PDF-` 標頭與結尾標記；但本機目前沒有 PDF 文字擷取套件，SRC-04 又超過網路閱讀工具的檔案大小限制。故只保存原始檔並標示待核對，沒有憑檔案存在就宣稱成功 Ingest。SRC-06 HTML 已可解析出指定段落及完整腎結石分組表。

累計成功 Ingest 的獨立來源為 SRC-01、02、03、05、06，共 5 份；五案均有初步知識覆蓋。SRC-04、07 仍需後續驗證。

### INGEST-B03 補充核對

使用安裝於系統暫存目錄的 PDF 文字讀取工具，核對 SRC-04 為第四版、478 頁，1.6.2 的自願回覆偏差文字位於 PDF 第 72 頁；新增 STAT-03-02／EVID-03-02。SRC-07 為 6 頁 PDF，對應期刊頁 64–69；本機中文字擷取有編碼缺損，因此只依該官方 PDF 可檢索的首頁表格與加權公式建立 STAT-05-02／EVID-05-02。兩份來源改列為**限定範圍成功 Ingest**。累計 7 份獨立來源；未核對的其他章節與段落不作教學依據。

SRC-04 的實際下載入口為 `https://openintro.org/go?id=ahss4_direct_download`，由該書官方介紹頁連結；僅下載原始 PDF 一份，沒有把章節重複計為多篇來源。

### SRC-04 指定範圍擴充｜2026-11-24

獨立內容審查指出 CASE-04 缺少可操作的數值實驗與公式。返回 N06／N07，從**已核准且成功 Ingest 的同一份 OpenIntro 第四版 PDF**核對 5.1.3 `Describing linear relationships with correlation`（PDF 第 404 頁）。該頁提供相關係數的範圍、線性關聯解讀與計算公式；新增 STAT-04-02／EVID-04-02。來源數維持 7 份，沒有將同書章節重複計為另一份。冰品、溺水與溫度的四個月數值另列為教學模擬。
