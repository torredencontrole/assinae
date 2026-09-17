function pasteText(element, text) {
    element.focus();
  
    const pasteEvent = new ClipboardEvent("paste", {
        bubbles: true,
        cancelable: true,
        clipboardData: new DataTransfer(),
    });
  
    pasteEvent.clipboardData.setData("text", text);
    element.dispatchEvent(pasteEvent);
  }
  
  async function WhatsappCheckingAssignature(){
    const inputField = document.querySelector('footer div[role="textbox"] p');
    //const input = document.querySelector('footer div[role="textbox"]');
    if (!inputField) {
      return new Promise(resolve => setTimeout(() => {
        resolve();
      }, 100));
    }
    chrome.storage.sync.get(['signature'], function(result) {
      if(result.signature != '' && result.signature != null && result.signature != undefined) {
        const inputField2 = document.querySelector('footer div[role="textbox"]');
        const someTwo = inputField2.querySelectorAll('p')
        if(someTwo.length == 1 && someTwo[0].textContent == ""){
          setTimeout(() => {
            const inputFieldFinal = document.querySelector('footer div[role="textbox"] p');
            pasteText(inputFieldFinal, `*${result.signature}*\n`);
          },200)
        }
      }
    })
    return new Promise(resolve => setTimeout(() => {
      resolve();
    }, 100));
  }
  
  
  async function startBot() {
      await WhatsappCheckingAssignature();
      setTimeout(() => {startBot();}, 500)
  }
  
  
  window.onload = function() {
    const intervalChecking = setInterval(() => {
      const check = document.querySelector('header header h1')?.textContent
      if (check != undefined) {
        startBot();
        clearInterval(intervalChecking);
      }
    }, 100)
  }
  
  