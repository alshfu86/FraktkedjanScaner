//Mail Script lib
let newScript = document.createElement("script");
newScript.setAttribute("src", "https://smtpjs.com/v3/smtp.js");
document.body.appendChild(newScript);

//injectScript
let newScannerScript = document.createElement("script");
newScannerScript.setAttribute("src", chrome.runtime.getURL("injectScript/scanner.js"));
document.body.appendChild(newScannerScript);



window.onload = function () {
    console.log(label);
    console.log(description);
    terminalSetter();
    let {main, mainTab, errorMsg, readyButton, barCode, details} = curentViewReader();
    newView(main, mainTab, errorMsg, readyButton, barCode, details);
    startTime();
    if (!errorMsgChecker(errorMsg)) {
        detailsChecker(details);
    }

};

