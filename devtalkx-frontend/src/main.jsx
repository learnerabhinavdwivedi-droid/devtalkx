import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux"; 
import appStore from "./utils/appStore"; // 🚀 Corrected: Points back to your actual store file
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 🚀 Wrapping App in Provider enables Redux hooks like useSelector across all components */}
    <Provider store={appStore}>
      <App />
    </Provider>
  </StrictMode>,
);