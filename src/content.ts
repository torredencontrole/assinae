(() => {
  'use strict';

  type ChromeApi = typeof globalThis & {
    chrome: {
      storage: {
        sync: {
          get: (keys: string[], callback: (result: Record<string, unknown>) => void) => void;
        };
        onChanged: {
          addListener: (callback: (changes: Record<string, { newValue?: unknown }>, areaName: string) => void) => void;
        };
      };
    };
  };

  const extensionChrome = (globalThis as ChromeApi).chrome;
  let signature = '';
  let boundComposer: HTMLElement | null = null;
  let lastProcessedText: string | null = null;
  let processing = false;

  function pasteText(element: HTMLElement, text: string): void {
    element.focus();
    deleteAll(element);

    const pasteEvent = new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      clipboardData: new DataTransfer(),
    });

    pasteEvent.clipboardData?.setData('text', text);
    element.dispatchEvent(pasteEvent);
  }

  function deleteAll(element: HTMLElement): void {
    const isMac = navigator.userAgent.includes('Mac OS X');

    element.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'a',
      code: 'KeyA',
      keyCode: 65,
      which: 65,
      ctrlKey: !isMac,
      metaKey: isMac,
      bubbles: true,
    }));

    element.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Backspace',
      keyCode: 8,
      code: 'Backspace',
      which: 8,
      bubbles: true,
    }));
  }

  function getComposer(): HTMLElement | null {
    return document.querySelector<HTMLElement>('footer div[role="textbox"]');
  }

  function getComposerParagraph(composer: HTMLElement | null): HTMLParagraphElement | null {
    if (!composer) return null;

    const paragraphs = composer.querySelectorAll('p');
    return paragraphs.length === 1 ? paragraphs[0] : null;
  }

  function applySignature(): void {
    if (processing || !signature) return;

    const paragraph = getComposerParagraph(getComposer());
    if (!paragraph) return;

    const text = paragraph.textContent ?? '';
    if (!text || text === lastProcessedText) return;

    const formattedSignature = `*${signature}*`;

    if (text === formattedSignature) {
      lastProcessedText = text;
      deleteAll(paragraph);
      return;
    }

    if (text.startsWith(`${formattedSignature}\n`)) {
      lastProcessedText = text;
      return;
    }

    processing = true;
    lastProcessedText = text;

    try {
      pasteText(paragraph, `${formattedSignature}\n${text}`);
    } finally {
      processing = false;
    }
  }

  function bindComposer(): void {
    const composer = getComposer();
    if (!composer || composer === boundComposer) return;

    boundComposer = composer;
    lastProcessedText = null;

    composer.addEventListener('input', () => {
      lastProcessedText = null;
      applySignature();
    }, true);

    composer.addEventListener('focus', () => {
      lastProcessedText = null;
    }, true);
  }

  function loadSignature(): void {
    extensionChrome.storage.sync.get(['signature'], (result) => {
      signature = typeof result.signature === 'string' ? result.signature.trim() : '';
      lastProcessedText = null;
      applySignature();
    });
  }

  extensionChrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'sync' || !changes.signature) return;

    signature = typeof changes.signature.newValue === 'string'
      ? changes.signature.newValue.trim()
      : '';

    lastProcessedText = null;
  });

  function initialize(): void {
    loadSignature();
    bindComposer();

    const observer = new MutationObserver(bindComposer);
    observer.observe(document.body, { childList: true, subtree: true });

    document.addEventListener('focusin', (event) => {
      if (event.target instanceof Element && event.target.closest('footer div[role="textbox"]')) {
        bindComposer();
      }
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize, { once: true });
  } else {
    initialize();
  }
})();
