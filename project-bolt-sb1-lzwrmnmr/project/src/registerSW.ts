import { registerSW } from 'virtual:pwa-register';

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    registerSW({
      onNeedRefresh() {
        if (confirm('Nova versão disponível. Deseja atualizar?')) {
          window.location.reload();
        }
      },
      onOfflineReady() {
        console.log('App pronto para uso offline');
      },
    });
  }
}