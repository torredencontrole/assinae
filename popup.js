document.addEventListener('DOMContentLoaded', function() {
  const signatureInput = document.getElementById('signature');
  const saveButton = document.getElementById('save');

  // Load saved signature
  chrome.storage.sync.get(['signature'], function(result) {
    if (result.signature) {
      signatureInput.value = result.signature;
    }
  });

  // Save signature
  saveButton.addEventListener('click', function() {
    const signature = signatureInput.value;
    chrome.storage.sync.set({
      signature: signature
    }, function() {
      // Visual feedback
      console.log(`salvo => ${signature}`)
      saveButton.textContent = 'Salvo!';
      setTimeout(() => {
        saveButton.textContent = 'Salvar Assinatura';
      }, 2000);
    });
  });
});