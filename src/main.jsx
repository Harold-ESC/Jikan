import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import "./styles/base.css";
import "./styles/components/activity-card.css";
import "./styles/components/stats.css";
import "./styles/components/day-selector.css";
import "./styles/components/detail.css";
import "./styles/components/header.css";
import "./styles/components/wheel.css";
import "./styles/components/reminders.css";
import "./styles/components/theme-toggle.css";

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
