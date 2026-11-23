# DATA DETECTIVE｜技術與反思報告（部署前）

## 目前成果

七份獨立來源已分三批 Ingest；`sources.md`、`raw/`、`wiki/` 和 `cards/` 建立了 Source ID → Concept ID → Evidence ID → Slide ID → Test ID 的追溯骨架。`outline.md` 已獲使用者確認；`site/index.html` 提供 14 張主要投影片、五宗案件互動、10 題測驗（五題單案、五題跨案）、電子認證與 Local Storage。`site/lab.html` 是獨立幕後調查室。所有案件數據在 `cases/simulation.md` 標為教學模擬。

## 執行與驗證

來源批次：`INGEST-B01`、`INGEST-B02`、`INGEST-B03`。統計與 HTML 檢查見 `checks/validate.py`、`checks/interaction.cjs` 和 `test-results/HTML-V1-V2.md`。已驗算成長率、平均與中位、辛普森案例六個比例的分子分母和方向逆轉。五案的知識主張都可連到證據卡；未 Ingest 的 SRC-08 沒有用於教學。

## Before／After Graph 反思

V1 的互動檢查發現真實的解鎖頁碼錯誤。V2 把解鎖映射納入較早的內容規格檢查，並在前端核心邏輯完成時先跑 DOM 冒煙測試；局部返回 N12 修正，沒有碰觸已驗證的 Wiki。修正後相關 DOM 測試通過。此次只有一組開發執行，不能推論長期錯誤率；詳見 `.agents/workflows/graph-v2.md`。

## 尚未完成的驗收

1. 瀏覽器工具的安全政策拒絕本機 `file:` URL，故尚無真實瀏覽器的桌面／手機視覺與操作紀錄。DOM 測試不能取代排版檢查。
2. 尚未取得獨立審查者或新對話對成品與來源的內容審查。
3. GitHub Pages 尚未部署；需要功能與驗收補齊後由使用者明確授權。沒有公開網址可宣稱通過。

## 本機執行

於專案根目錄執行 `python checks/validate.py`、`npm install`、`npm run check:js`、`npm run check:interaction`。網站為純靜態檔案，正式發布需確保 `site/` 作為 Pages 發布產物，所有連結採相對路徑；本輪沒有部署。
