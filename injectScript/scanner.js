
let curentDate = function(){
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1; //January is 0!
    let yyyy = today.getFullYear();
    let hh = today.getHours();
    let min = today.getMinutes();

    if(dd<10) {
        dd = '0'+dd
    }

    if(mm<10) {
        mm = '0'+mm
    }

    today = mm + '/' + dd + '/' + yyyy + " kl. " +hh+":"+min;
    return today;
};
let sendEpost = function (kundName) {

    Email.send({
        SecureToken : "5860333e-9fe2-4bc7-86a5-6037bcf6f2e8",
        To : 'alshfu86@gmail.com    ',
        From : "alshfu@gmail.com",
        Subject : kundName + " Ankomst Rapport",
        Body : "Bilen från "+kundName+ " ankomm terminalen den "+curentDate()
    }).then(
        message => console.log(message)
    );

};
window.onload = function () {
    console.log("hello inject hire ");


};
// barCodeCheck = function barCodeCheck() {
//     if (bControl == null)
//         bControl = $("#barCode");
//
//     var newTime = (new Date()).getTime();
//
//     var barCode = bControl.val();
//     if (oldBarCode != barCode) {
//         oldBarCode = barCode; //wait until next time
//         lastTimeChecked = newTime;
//     } else if (newTime - lastTimeChecked < 250) {
//         //Do nothing, just wait
//     }
//
//     else {
//         lastTimeChecked = newTime;
//         var bc = GetNextBarCode(barCode + ' ');
//         if (bc != "") {
//             if (ValidateBarcode(bc)) {
//                 //$("#soundsGood")[0].play();
//                 //setTimeout($("#soundsGood")[0].play(), 10);
//                 //util_playAudioFile(Const_GoodSoundFile);
//                 //NewBarCodeEntered();
//                 if (bc === "999999999999999990"){
//                     sendEpost("GDL");
//
//                     SetError('GDL ankomst raport var sickad');
//                 }else if (bc ==="999999999999999991"){
//                     sendEpost("Onninen");
//
//                     SetError('Onninen ankomst raport var sickad');
//                 }else  if(bc === "999999999999999992"){
//                     sendEpost("Storel");
//
//                     SetError('Storel ankomst raport var sickad');
//                 }else  if(bc === "999999999999999993"){
//                     sendEpost("Electroscandia");
//
//                     SetError('Electroscandia ankomst raport var sickad');
//                 }
//
//                 RegisterNewBarCode(bc);
//                 console.log("IM HERE !!!!!");
//                 save();
//
//             } else {
//                 //setTimeout($("#soundsBad")[0].play(), 10);
//
//                 //util_playAudioFile(Const_BadSoundFile);
//             }
//
//             bControl.val(ltrim(bControl.val().substring(bc.length))); //Replace old text
//         }
//     }
//
//     //setTimeout("barCodeCheck()", util_GetSetting('BarCodeIdleTimeout', 100));
//     setTimeout("barCodeCheck()", 10);
// };
// save = function save() {
//     if (barCodeList === "") {
//         console.log('Finns inga streckkoder att spara.');
//         return;
//     }//Serialize event and save it to data repository
//     else {
//         var terminalId = $("#TerminalId").val();
//         var par = $.param({barcodes: barCodeList, TerminalId: terminalId});
//         $.post('/Consolidation/PerformArrivalScan', par, function (res) {
//           //  TP_ReloadOrAlert(res);
//             console.log(res);
//             console.log(barCodeList);
//             barCodeList = ""
//
//         });
//
//
//     }
//
// };