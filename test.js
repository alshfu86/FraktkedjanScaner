
$("input:text:visible:first").focus();

//Stolen from mobile
var barCodeList = "";
var barCodeListDelimiter = '\n';
var checkIfIsNumber = true; //util_GetSetting('CheckIsNumber', false);
var oldBarCode = '';
var bControl = null;
var lastTimeChecked = (new Date()).getTime();
var allowedLengths = '9,10,11,12,13,14,15,16,17,18,19,20,21'; //util_GetSetting('AllowedBarCodeLength', Config_AllowedBarCodeLength);

function barCodeCheck() {
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
                //$("#soundsGood")[0].play();
                //setTimeout($("#soundsGood")[0].play(), 10);
                //util_playAudioFile(Const_GoodSoundFile);
                //NewBarCodeEntered();
                RegisterNewBarCode(bc);
            } else {
                //setTimeout($("#soundsBad")[0].play(), 10);

                //util_playAudioFile(Const_BadSoundFile);
            }

            bControl.val(ltrim(bControl.val().substring(bc.length))); //Replace old text
        }
    }

    //setTimeout("barCodeCheck()", util_GetSetting('BarCodeIdleTimeout', 100));
    setTimeout("barCodeCheck()", 10);
}


function GetNextBarCode(bc) {
    if (bc.trim() == '')
        return '';

    while (bc.charAt(0) == ' ')  //Perform ltrim
        bc = bc.substring(1);
    bc = bc.replace('\n', ' ');

    if (bc.substring(0, 2) == "00" && bc.length >= 20)
        return bc.substring(0, 20);

    if (bc.split(' ').length > 1) {
        return bc.split(' ')[0];
    }


    //if (bc.trim().length == 10) //TspDocNo
    //    return bc;

    return "";
}


function ValidateBarcode(bc) {
    //TODO: Check if it already scanned
    bc = bc.trim();
    if (bc == '') {
        //SetError('Tom streckkod.');
        return false;
    }

    if (IsInBarCodeList(bc)) {
        SetError(bc + ' finns redan i listan.');
        return false;
    }

    if (checkIfIsNumber)
        if (!isNumber(bc)) {
            SetError(bc + ' ej numeriskt');
            return false;
        }

    //TODO: Gör inställning så att LBS kan använda den
    var l = bc.length;
    //Check Length
    //var allowedLengths = util_GetSetting('AllowedBarCodeLength', Config_AllowedBarCodeLength);
    if (allowedLengths != '' && allowedLengths != undefined) {
        var lengths = allowedLengths.split(',');
        if ($.inArray(l.toString(), lengths) < 0) {
            //if (!(l == 10 || l == 17 || l == 18 || l == 20)) {
            SetError(bc + ' har fel längd.');
            return false;
        }
    }
    SetError('');
    return true;
}

function SetError(msg) {
    $("#errorMsg").html(msg);
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function RegisterNewBarCode(bc) {
    if (ValidateBarcode(bc)) {
        //add to barCodeList
        AddToBarCodeList(bc);
        RefreshBarCodeList();

        //    if (PhoneMode) {
        //        DoBeepAsynch();
        //    }
    } else {
        //navigator.notification.beep(1);
        //if (PhoneMode) navigator.notification.vibrate(2000);

    }
}

//Move to library
function ltrim(stringToTrim) {
    return stringToTrim.replace(/^\s+/, "");
}


function RefreshBarCodeList() {
    $("#barCodes").val(barCodeList);
    return;

    var wrk = "<table>";
    var bcs = barCodeList.split(barCodeListDelimiter);
    if (barCodeList != '') {
        wrk += "<tr><td><b>Antal: " + bcs.length + "</b></td></tr>";
        var rowHtml;
        for (var i = 0; i < bcs.length; i++) {
            if (bcs[i] != '') {
                rowHtml = "";
                rowHtml += "<tr>";
                rowHtml += "<td>" + bcs[i] + "</td>";
                rowHtml += "<td><img alt='' src='img/Delete.png' onclick=\"RemoveBC(" + i + ")\" /></td>";
                rowHtml += "</tr>";

                wrk += rowHtml;
            }
        }
    }
    wrk += "</table>";
    $("#barcodes").html(wrk);

}


function ClearBarCodeList() {
    barCodeList = "";
}

function IsInBarCodeList(bc) {
    var bcs = barCodeList.split(barCodeListDelimiter);
    for (var i = 0; i < bcs.length; i++)
        if (bcs[i] == bc)
            return true;

    return false;
}

function AddToBarCodeList(bc) {
    //Add in the beginning (easier for user to control)
    if (barCodeList != "")
        barCodeList = bc + barCodeListDelimiter + barCodeList;
    else
        barCodeList = bc;
    AddToLog('Barcode ' + bc + ' scanned.');

    ShowBarCodeDetails(bc);
}

function ShowBarCodeDetails(barcode) {
    $("#Details").html('');
    $.get('/Consolidation/GetBookingDetailsFromScan?barcode=' + barcode, function (res) {
        $("#Details").html(res);
    });
}

function RemoveBC(idx) {
    var bcs = barCodeList.split(barCodeListDelimiter);
    var bc = bcs[idx];
    if (confirm('Ta bort ' + bc + ' ur listan?')) {
        //barCodeList = (barCodeListDelimiter + barCodeList + barCodeListDelimiter).replace(barCodeListDelimiter + bc + barCodeListDelimiter, barCodeListDelimiter);
        //barCodeList = barCodeList.replace(barCodeListDelimiter + barCodeListDelimiter, barCodeListDelimiter); //Replace duplicates
        //Instead, more visible and debugable code:cpu
        AddToLog('Barcode ' + bc + ' removed.');
        ClearBarCodeList();
        for (var i = 0; i < bcs.length; i++) {
            if (i != idx) {
                AddToBarCodeList(bcs[i]);
            }
        }
        RefreshBarCodeList();
    }
}

function AddToLog(txt) {

}

//Initialize
setTimeout("barCodeCheck()", 2000);
setTimeout("$('#barCode').focus();", 1000);



function cancel() {
    if (barCodeList != "")
        if (!confirm("Vill du avbryta?"))
            return;

    AddToLog('Scanning cancelled.');
    top.location = '/home/menu';

}

function save() {
    if (barCodeList == "") {
        alert('Finns inga streckkoder att spara.');
        return;
    }
    //Serialize event and save it to data repository
    if (confirm('Vill du spara?')) {
        var terminalId = $("#TerminalId").val();
        var par = $.param({ barcodes: barCodeList, TerminalId : terminalId});
        $.post('/Consolidation/PerformArrivalScan', par, function (res) {
            TP_ReloadOrAlert(res);
        });
    }
}
