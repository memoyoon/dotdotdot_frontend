import type { BeforeInstallPromptEvent } from '../types/pwa';

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export function setupA2HSButton(button: HTMLButtonElement) {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    button.style.display = 'block';
  });

  button.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    button.style.display = 'none';
  });
}
