import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import ClaudeRefundTool from './ClaudeRefundTool.jsx';
import { startAnalytics } from '../analytics.js';

startAnalytics();

createRoot(document.getElementById('claude-refund-tool')).render(
  <StrictMode><ClaudeRefundTool /></StrictMode>,
);
