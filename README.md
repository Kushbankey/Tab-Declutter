# 🚀 Tab Declutter: Your Ultimate Tab Management Powerhouse! 🧹

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/) [![Chrome Extension](https://img.shields.io/badge/Chrome_Extension-DEE1E6?style=for-the-badge&logo=google-chrome&logoColor=4285F4)](https://developer.chrome.com/docs/extensions/)

**Tired of tab chaos? Drowning in a sea of open browser windows? Tab Declutter is here to rescue your sanity and supercharge your productivity!**

Tab Declutter is a feature-rich Chrome extension built with React, TypeScript, and Vite, designed to give you unparalleled control over your browser tabs. Effortlessly organize, manage, and save your browsing sessions with an intuitive and powerful interface.

## ✨ Key Features

### 👁️ Crystal-Clear Tab Overview & Navigation

- **Window-by-Window View:** See all your open tabs neatly organized into expandable/collapsible accordions for each browser window.
- **Instant Search:** Find any tab in seconds! Search by title, URL, or category (domain name).
- **Powerful Filtering:**
  - **Tab Status:** Show only 'Active' or 'Inactive' (discarded) tabs.
  - **Pinned Status:** Focus on 'Pinned' or 'Unpinned' tabs.
  - **Tab Groups:** Isolate specific Chrome Tab Groups or view only ungrouped tabs.
- **Detailed Tab Display:** Each tab entry shows its favicon, category (e.g., `github.com`, `google.com`), full title, and current status.
- **Quick Actions:**
  - **Switch to Tab:** Double-click any tab in the list or use the action menu to instantly jump to it.
  - **Close Tab:** Quickly close unneeded tabs from the action menu.
  - **Pin/Unpin Tab:** Easily pin important tabs or unpin them.
- **Bulk Selection:** Select multiple tabs using checkboxes for mass actions.
- **Select All:** Instantly select or deselect all tabs visible in the current window's view.

### 🗂️ Advanced Chrome Tab Group Management

- **Create Groups On-the-Fly:** Select tabs and click "Group Selected" to create a new Chrome Tab Group with a custom name.
- **Filter by Your Groups:** Use the "Tab Group" filter to see tabs belonging to any of your existing Chrome groups.
- **Full Group Control (when a group is filtered):**
  - **Rename Group:** Change the name of an existing Chrome Tab Group.
  - **Ungroup Tabs:** Remove all tabs from a Chrome group, keeping the tabs open and ungrouped.
  - **Delete Group & Close Tabs:** Permanently remove a group and close all tabs within it in one go.

### 💾 Effortless Session Saving & Restoration

- **Save Your Sessions:** Click "Save Session" to preserve your current browsing setup.
  - **Custom Naming:** Give your sessions memorable names (e.g., "Work Project Q3", "Holiday Research").
  - **Flexible Scope:** Choose to save tabs from _all_ open windows or just a _specific window_.
- **View Saved Sessions:** Switch to the "Saved Sessions" view to see all your stored sessions, complete with timestamps, tab counts, and window counts.
- **One-Click Restore:** Bring back an entire browsing session! Tabs are restored into new windows, maintaining the original multi-window structure if it was saved that way.
- **Delete Old Sessions:** Easily remove sessions you no longer need.

### 🎨 Intuitive & User-Friendly Interface

- **Detachable View:** Pop out the extension into its own dedicated, resizable window for a more spacious and persistent management experience.
- **Help Guide Panel:** The detached view includes a comprehensive help guide to get you started and master all features.
- **Responsive Design:** Clean, modern UI that's easy to navigate.
- **Toast Notifications:** Get clear feedback for actions like creating groups, saving sessions, or encountering errors.
- **Contextual Footer:** Always know how many tabs are selected and the context of your active window view.
- **Active Filter Pills:** See your currently applied filters at a glance and clear them individually or all at once.

## 🚀 Why Tab Declutter?

- **Boost Productivity:** Spend less time hunting for tabs and more time getting things done.
- **Reduce Clutter:** Keep your browser workspace clean and organized.
- **Prevent Lost Work:** Save important browsing sessions before closing windows or restarting your computer.
- **Lightweight & Modern:** Built with the latest web technologies for a smooth and fast experience.

## 🛠️ Building the Extension

This project is built using Vite. To build the extension:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd tab-declutter
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```
3.  **Build the extension for production:**

    ```bash
    npm run build
    # or
    yarn build
    # or
    pnpm build
    ```

    This will create a `dist` folder with all the necessary files for the Chrome extension.

4.  **Load the extension in Chrome:**
    - Open Chrome and navigate to `chrome://extensions`.
    - Enable "Developer mode" (usually a toggle in the top right).
    - Click "Load unpacked".
    - Select the `dist` folder generated in the previous step.

## 📖 Basic Usage

1.  **Click the Tab Declutter icon** in your Chrome toolbar to open the popup.
2.  **For more space, click "Detach View"** in the header to open it in a new window.
3.  **Browse your tabs:** They are listed by window. Expand a window to see its tabs.
4.  **Search & Filter:** Use the controls at the top to find specific tabs or narrow down your view.
5.  **Manage Tabs:**
    - Double-click a tab to switch to it.
    - Use checkboxes to select tabs.
    - Click the "..." (ellipsis) icon on a tab row for actions like Pin, Unpin, or Close.
6.  **Group Tabs:**
    - Select tabs and click "Group Selected (...)".
    - Filter by a group and click "Manage '[Group Name]'" for more options.
7.  **Save/Restore Sessions:**
    - Click "Save Session", name it, and choose the scope.
    - Click "View Saved Sessions" to see your list. Restore or delete as needed.

---

Conquer your tabs with Tab Declutter!
