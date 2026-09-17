(() => {
  'use strict';

  let signature = '';
  let boundComposer = null;
  let lastProcessedText = null;
  let processing = false;

  function pasteText(element, text) {
    if (!element) return;

    element.focus();
    deleteAll(element);

    const pasteEvent = new ClipboardEvent('paste', {
      bubbles: true,
      cancelable: true,
      clipboardData: new DataTransfer(),
    });

    pasteEvent.clipboardData.setData('text', text);
    element.dispatchEvent(pasteEvent);
  }

  function deleteAll(element) {
    if (!element) return;

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

  function getComposer() {
    return document.querySelector('footer div[role="textbox"]');
  }

  function getComposerParagraph(composer) {
    if (!composer) return null;

    const paragraphs = composer.querySelectorAll('p');
    return paragraphs.length === 1 ? paragraphs[0] : null;
  }

  function applySignature() {
    if (processing || !signature) return;

    const composer = getComposer();
    const paragraph = getComposerParagraph(composer);

    if (!paragraph) return;

    const text = paragraph.textContent || '';
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

  function bindComposer() {
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

  function loadSignature() {
    chrome.storage.sync.get(['signature'], (result) => {
      signature = typeof result.signature === 'string' ? result.signature.trim() : '';
      lastProcessedText = null;
      applySignature();
    });
  }

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== 'sync' || !changes.signature) return;

    signature = typeof changes.signature.newValue === 'string'
      ? changes.signature.newValue.trim()
      : '';

    lastProcessedText = null;
  });

  function initialize() {
    loadSignature();
    bindComposer();

    const observer = new MutationObserver(() => {
      bindComposer();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

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
