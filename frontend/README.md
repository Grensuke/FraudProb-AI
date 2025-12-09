# Veritas Frontend

React + Vite frontend for the Veritas scam detection system.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Frontend will run at `http://localhost:5173`

## 📁 Structure

```
src/
├── pages/
│   ├── Home.jsx        # Main scanner page
│   ├── Report.jsx      # Submit scam reports
│   ├── Admin.jsx       # Admin dashboard
│   └── About.jsx       # About & disclaimer
├── components/
│   ├── Navigation.jsx  # Top navbar
│   ├── Footer.jsx      # Footer + about modal
│   └── ResultCard.jsx  # Result display
├── App.jsx             # Main app component
├── App.css             # Component styles
├── index.css           # Global styles
└── main.jsx            # React entry point
```

## 🎨 Design

- **Color Scheme**: Blue gradients (#646cff to #2563eb)
- **Responsive**: Mobile-first design
- **Animations**: Smooth transitions and fade-ins
- **Accessibility**: High contrast, readable fonts

## 🔧 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔌 API Connection

Frontend connects to backend at `http://localhost:3000/api`

Make sure backend is running before starting frontend!

## 📦 Dependencies

- react: ^19.2.0
- react-dom: ^19.2.0
- react-router-dom: ^7.1.0

## 🌐 Pages

### Home Page
- URL/message input form
- Real-time scam analysis
- Risk score display
- Technical analysis details
- Example URLs to try
- How it works section

### Report Page
- Simple reporting form
- Category selection
- Email confirmation
- Privacy information

### Admin Dashboard
- Admin authentication
- View statistics
- Manage reports
- Manage scam database
- Add/delete entries

### About Page
- How Veritas works
- Why it's important
- Disclaimer & warnings
- Contact information

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
