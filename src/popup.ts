(() => {
  'use strict';

  type ChromeApi = typeof globalThis & {
    chrome: {
      storage: {
        sync: {
          get: (keys: string[], callback: (result: Record<string, unknown>) => void) => void;
          set: (items: Record<string, unknown>, callback: () => void) => void;
        };
        onChanged: {
          addListener: (callback: (changes: Record<string, { newValue?: unknown }>, areaName: string) => void) => void;
        };
      };
      runtime: {
        lastError?: { message?: string };
      };
    };
  };

  const extensionChrome = (globalThis as ChromeApi).chrome;
  const MAX_SIGNATURE_LENGTH = 300;

  function getElement<T extends HTMLElement>(id: string): T {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Elemento não encontrado: ${id}`);
    return element as T;
  }

  function initialize(): void {
    const signatureInput = getElement<HTMLTextAreaElement>('signature');
    const saveButton = getElement<HTMLButtonElement>('save');
    const status = getElement<HTMLParagraphElement>('status');
    const counter = getElement<HTMLDivElement>('counter');

    const setStatus = (message: string, type: 'success' | 'error' = 'success'): void => {
      status.textContent = message;
      status.dataset.type = type;
    };

    const updateCounter = (): void => {
      counter.textContent = `${signatureInput.value.length}/${MAX_SIGNATURE_LENGTH}`;
    };

    extensionChrome.storage.sync.get(['signature'], (result) => {
      if (typeof result.signature === 'string') {
        signatureInput.value = result.signature.slice(0, MAX_SIGNATURE_LENGTH);
        updateCounter();
      }
    });

    signatureInput.addEventListener('input', () => {
      if (signatureInput.value.length > MAX_SIGNATURE_LENGTH) {
        signatureInput.value = signatureInput.value.slice(0, MAX_SIGNATURE_LENGTH);
      }

      updateCounter();
      status.textContent = '';
      status.dataset.type = '';
    });

    updateCounter();

    saveButton.addEventListener('click', () => {
      const signature = signatureInput.value.trim();

      if (signature.length > MAX_SIGNATURE_LENGTH) {
        setStatus(`A assinatura pode ter no máximo ${MAX_SIGNATURE_LENGTH} caracteres.`, 'error');
        return;
      }

      extensionChrome.storage.sync.set({ signature }, () => {
        if (extensionChrome.runtime.lastError) {
          setStatus('Não foi possível salvar a assinatura.', 'error');
          return;
        }

        saveButton.textContent = 'Salvo!';
        setStatus('Assinatura salva com sucesso.');

        window.setTimeout(() => {
          saveButton.textContent = 'Salvar Assinatura';
        }, 1800);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
