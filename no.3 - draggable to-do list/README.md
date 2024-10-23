# Draggable To-Do List

## 關鍵重點
- 套件[draggable](https://shopify.github.io/draggable/examples/)


--- 
## 需求
1. **ToDo List 功能**
   - 使用者能夠新增 ToDo 項目。
   - 使用者能夠標記 ToDo 項目為完成。
   - 使用者能夠刪除 ToDo 項目。

2. **拖曳功能**
   - 實現 ToDo 項目的拖曳功能，允許使用者調整項目順序。
   - 使用者可以透過拖曳來調整 ToDo 項目的緊急性與重要性。

3. **LocalStorage 儲存**
   - 使用 LocalStorage 紀錄 ToDo List 狀態（順序與完成狀態）。
   - 在頁面重載時，自動載入上次儲存的 ToDo List 狀態。

4. **限制筆數功能**
   - 設定最大筆數限制：
     - 緊急類別最多 5 筆。
     - 重要類別最多 3 筆。
   - 超過限制時，使用者無法新增或拖曳項目至該類別。

## 待做功能
- todo list 可以拖曳調整排序
- 使用 LocalStorage 來記錄 todo list 狀態（順序、完成）
- 加入限制筆數功能，超過就無法在拖曳進去。（緊急 5 筆、重要 3 筆）

## 步驟拆解
- LocalStorage：存、取
- 改變init的內容，初始化取得LocalStorage的資料||內建預設
- 將存LocalStorage的觸發，放入renderTodo
- doneToggle新增觸發renderTodo
- 重構原本的事件監聽，將function 獨立出來
