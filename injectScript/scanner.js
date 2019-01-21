
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
        SecureToken : "SecureToken",
        To : 'some@mail.com',
        From : "your@mail.com",
        Subject : kundName + " Ankomst Rapport",
        Body : "Bilen från "+kundName+ " ankomm terminalen den "+curentDate()
    }).then(
        message => console.log(message)
    );

};

barCodeCheck = function barCodeCheck() {
    if (bControl == null)
        bControl = $("#barCode");

    var newTime = (new Date()).getTime();

    var barCode = bControl.val();
    if (oldBarCode != barCode) {
        oldBarCode = barCode; //wait until next time
        lastTimeChecked = newTime;
    } else if (newTime - lastTimeChecked < 250) {
        //Do nothing, just wait
    }

    else {
        lastTimeChecked = newTime;
        var bc = GetNextBarCode(barCode + ' ');
        if (bc != "") {
            if (ValidateBarcode(bc)) {
                if (bc === "999999999999999990"){
                    sendEpost("GDL");

                    SetError('GDL ankomst raport var sickad');
                }else if (bc ==="999999999999999991"){
                    sendEpost("Onninen");

                    SetError('Onninen ankomst raport var sickad');
                }else  if(bc === "999999999999999992"){
                    sendEpost("Storel");

                    SetError('Storel ankomst raport var sickad');
                }else  if(bc === "999999999999999993"){
                    sendEpost("Electroscandia");

                    SetError('Electroscandia ankomst raport var sickad');
                }

                RegisterNewBarCode(bc);
                console.log("IM HERE !!!!!");
                save();

            } else {

            }

            bControl.val(ltrim(bControl.val().substring(bc.length))); //Replace old text
        }
    }


    setTimeout("barCodeCheck()", 10);
};
save = function save() {
    if (barCodeList === "") {
        console.log('Finns inga streckkoder att spara.');
        return;
    }//Serialize event and save it to data repository
    else {
        var terminalId = $("#TerminalId").val();
        var par = $.param({barcodes: barCodeList, TerminalId: terminalId});
        $.post('/Consolidation/PerformArrivalScan', par, function (res) {
          //  TP_ReloadOrAlert(res);
            console.log(res);
            console.log(barCodeList);
            barCodeList = ""

        });


    }

};