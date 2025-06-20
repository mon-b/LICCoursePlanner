# LICCoursePlanner

Course planner for the **Bachelor's in Computer Science** at UC Chile. It didn't exist, so we made it :)

Originally a messy side project to learn vanilla JS and organize the academic chaos I had. Now a proper TypeScript + React app that actually works and helps other CS students avoid the same planning disasters.

## 🚀 What it does

- **🖱️ Drag and drop interface** for organizing courses between semesters
- **🌐 Bilingual support** - switch between Spanish and English course names
- **🔗 Prerequisite tracking** - visual indicators for course dependencies
- **🎨 Multiple color themes** for customization
- **➕ Custom course creation** for special cases not in the standard curriculum
- **✅ Progress tracking** - mark completed courses
- **💾 Persistent state** - your planning is automatically saved

## 📦 Getting Started

```bash
git clone https://github.com/mon-b/LICCoursePlanner.git
cd LICCoursePlanner
npm install
npm run dev
```

Open `http://localhost:5173` and start organizing your academic chaos.

## ⚡ Tech Stack

- **React 18** + **TypeScript** because we're civilized now
- **Vite** for fast builds
- **React Router** for navigation
- **i18next** for Spanish/English switching
- **CSS Modules** because styled-components felt like overkill
- **GitHub Pages** for free hosting

## 📁 Project Structure

```
src/
├── components/          # UI pieces
├── pages/              # HomePage and PlannerPage
├── context/            # State management with useReducer
├── data/               # Course data and curriculum
├── types/              # TypeScript definitions
├── i18n/               # Language switching config
└── utils/              # Helper functions
```

## 🤝 Contributing

Found a bug? Course data wrong? Want to add a new color theme? PRs welcome! 

The course data lives in `src/data/` and is pretty straightforward to modify.

## 🚀 Deployment

Merging to `main` automatically deploys to GitHub Pages via the `gh-pages` branch.

## 📄 License

MIT - do whatever you want with this

---

Made with 💖 by [Mon 🌸](https://instagram.com/w1ndtempos) and [fña🧙‍♂️](https://www.instagram.com/fercooncha)

*Disclaimer: This planner is still being improved. Double-check course prerequisites and details with official UC sources because we're students, not the registrar's office.*
