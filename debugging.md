# 🔧 Debugging Report for ATMOS – Weather Finder App (Vite + React)

---

## 1. Git Issues

### Problem: Rebase Conflict
- **Error Message:**
  ```
  fatal: It seems that there is already a rebase-merge directory...
  ```
- **Fix:**
  - Used `git rebase --abort` or deleted `.git/rebase-merge` folder.
  - Resolved conflicts manually in `README.md`.
  - Ran `git add <file>` and `git rebase --continue`.

### Problem: Push Rejected (Non-Fast-Forward)
- **Error Message:**
  ```
  error: failed to push some refs to ...
  Updates were rejected because a pushed branch tip is behind...
  ```
- **Fix:**
  - Pulled remote changes using `git pull origin main --rebase`.
  - Resolved merge conflicts.
  - Pushed successfully after resolving.

---

## 2. Unexpected `vite/deps` Folder

### Problem:
- Many `chunk.js` files appeared in the `vite/deps` folder at project root (not in `dist`).

### Cause:
- Vite pre-bundles and caches dependencies for faster HMR (Hot Module Replacement).

### Fix:
- Added `vite/` to `.gitignore` to avoid pushing it to GitHub.

---

## 3. File Exclusion from Git

### Requirement:
- Prevent `Home.jsx` from being pushed.

### Fix:
- Added relative path to `.gitignore`, e.g.:
  ```
  src/pages/Home.jsx
  ```

---

## 4. Weather Background Gradients

### Task:
- Implement weather-based gradient backgrounds (`clear sky`, `partly cloudy`, `fog`, etc.).

### Problem:
- White text was not visible on lighter gradients.

### Fix:
- Adjusted gradients to **darker color tones** for improved text contrast.


---

✅ **Final Status:**
- Git issues resolved.
- Vite cache excluded.
- File exclusion set up.
- Background gradients adjusted.

