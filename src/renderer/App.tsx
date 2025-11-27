import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useTranslation } from 'react-i18next';
import { syncWithLocalTheme } from '@/actions/theme';
import '@/localization/i18n';
import { RouterProvider } from '@tanstack/react-router';
import { updateAppLanguage } from '@/actions/language';
import { router } from '@/utils/routes';

export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    syncWithLocalTheme();
    updateAppLanguage(i18n);
  }, [i18n]);

  return <RouterProvider router={router} />;
}

const container = document.getElementById('app');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
