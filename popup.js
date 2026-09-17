document.addEventListener('DOMContentLoaded', () => {
  const signatureInput = document.getElementById('signature');
  const saveButton = document.getElementById('save');
  const status = document.getElementById('status');

  const MAX_SIGNATURE_LENGTH = 300;

  function setStatus(message, type = 'success') {
    status.textContent = message;
    status.dataset.type = type;
  }

  chrome.storage.sync.get(['signature'], (result) => {
    if (typeof result.signature === 'string') {
      signatureInput.value = result.signature;
    }
  });

  signatureInput.addEventListener('input', () => {
    if (signatureInput.value.length > MAX_SIGNATURE_LENGTH) {
      signatureInput.value = signatureInput.value.slice(0, MAX_SIGNATURE_LENGTH);
    }

    status.textContent = '';
    status.dataset.type = '';
  });

  saveButton.addEventListener('click', () => {
    const signature = signatureInput.value.trim();

    if (signature.length > MAX_SIGNATURE_LENGTH) {
      setStatus(`A assinatura pode ter no máximo ${MAX_SIGNATURE_LENGTH} caracteres.`, 'error');
      return;
    }

    chrome.storage.sync.set({ signature }, () => {
      if (chrome.runtime.lastError) {
        setStatus('Não foi possível salvar a assinatura.', 'error');
        return;
      }

      saveButton.textContent = 'Salvo!';
      setStatus('Assinatura salva com sucesso.');

      setTimeout(() => {
        saveButton.textContent = 'Salvar Assinatura';
      }, 1800);
    });
  });
});
