function pasteText(element, text) {
  element.focus();
  deleteAll(element);  
  const pasteEvent = new ClipboardEvent("paste", {
      bubbles: true,
      cancelable: true,
      clipboardData: new DataTransfer(),
  });

  pasteEvent.clipboardData.setData("text", text);
  element.dispatchEvent(pasteEvent);
}

function deleteAll(element){
  var isMac;
  if(navigator.userAgent.indexOf('Mac OS X') != -1){
    isMac = true;
  }else{
    isMac = false;
  };
  const ctrlA = new KeyboardEvent("keydown", {
    key: "a",
    code: "KeyA",
    keyCode: 65,
    which: 65,
    ctrlKey: !isMac, // Usa Ctrl no Windows/Linux
    metaKey: isMac, // Usa Cmd no macOS
    bubbles: true
  });

  const apagar = new KeyboardEvent("keydown", {
    key: "Backspace",
    keyCode: 8,
    code: "Backspace",
    which: 8,
    bubbles: true
  });
  element.dispatchEvent(ctrlA);
  element.dispatchEvent(apagar); 
}

function WhatsappCheckingAssignature(){
  const inputField = document.querySelector('footer div[role="textbox"] p');
  //const input = document.querySelector('footer div[role="textbox"]');
  if (!inputField) {
    console.log(`input vazio!`)
    return;
  }
  chrome.storage.sync.get(['signature'], function(result) {
    if(result.signature != '' && result.signature != null && result.signature != undefined) {
      const inputField2 = document.querySelector('footer div[role="textbox"]');
        const someTwo = inputField2.querySelectorAll('p')
        if(someTwo.length == 1 && someTwo[0].textContent != ""){
          if(someTwo[0].textContent != `*${result.signature}*`){
            const inputFieldFinal = document.querySelector('footer div[role="textbox"] p');
            pasteText(inputFieldFinal, `*${result.signature}*\n${someTwo[0].textContent}`);
          }else{
            const inputFieldFinal = document.querySelector('footer div[role="textbox"] p');
            deleteAll(inputFieldFinal);
          }
        }
    }
  });
}


function startBot() {
    WhatsappCheckingAssignature();
    setTimeout(() => {startBot();}, 200)
}


window.onload = function() {
  const intervalChecking = setInterval(() => {
    const check = document.querySelector('header header h2')?.textContent
    if (check != undefined) {
      startBot();
      clearInterval(intervalChecking);
    }
  }, 100)
}

