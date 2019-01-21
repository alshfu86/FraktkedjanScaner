//simple helper method to read String///////////////////////////////
let varReader = function (anyVar) {
    console.log(anyVar);
};
//simple helper method to read String from some array
let arrayREader = function (anyArrya) {
    for (let anyArryaElement of anyArrya) {
        anyArryaElement.remove();
        console.log(anyArryaElement);
    }
};
//////////////////////////////////////////////////////////////////
//Steg 0
// Väljer rätt Termenal - Göteborg id 120
function terminalSetter() {
    let terminalId = document.getElementById("TerminalId");
    terminalId.value = 120;
}

//Steg 1
//Läser in, plockar fram, och lägerr till (id eller class) atributes vid behov av  de viktiga DOM elementer från scaning hem sida.
function curentViewReader() {
    //huved dom elemnt
    let main = document.getElementsByClassName("page")[0];
    //main Table
    let mainTab = document.getElementsByTagName("table")[1];
    mainTab.setAttribute("id", "maintab");
    //Error msg
    let errorMsg = document.getElementById("errorMsg");
    //ReadyButton
    let readyButton = document.getElementById("ReadyButton");
    //BarCode
    let barCode = document.getElementById("barCode");
    //DETAILS
    let details = document.getElementById("Details");
    return {main, mainTab, errorMsg, readyButton, barCode, details};
}

//Steg 2
//Skapar och lägger till på sidan nya DOM elementer
function newView(main, mainTab, errorMsg, readyButton, barCode, details) {
    let newView = document.createElement("div");
    newView.setAttribute("id", "newView");
    newView.setAttribute("class", "newView");

    let wereIs = document.createElement("div");
    wereIs.setAttribute("id", "wereIs");
    wereIs.innerHTML = "Här kommer information om vilken bil tillhör packet";

    let input = document.createElement("div");
    input.setAttribute("id", "input");

    let info = document.createElement("div");
    info.setAttribute("id", "info");
    info.innerHTML = "Här kommer information om motagare";

    let infoTime = document.createElement("div");
    infoTime.setAttribute("id", "infoTime");

    let antalkoliText = document.createElement("div");
    antalkoliText.setAttribute("id", "antalkoliText");
    antalkoliText.innerHTML = "Antal";

    let antalkoli = document.createElement("div");
    antalkoli.setAttribute("id", "antalkoli");
    antalkoli.innerHTML = "0";

    let newInfoTab = document.createElement("TABLE");
    newInfoTab.setAttribute("id", "newInfoTable");
    newInfoTab.setAttribute("class", "redTable");

    input.appendChild(barCode);
    newView.appendChild(wereIs);
    newView.appendChild(readyButton);
    newView.appendChild(input);
    newView.appendChild(antalkoliText);
    newView.appendChild(antalkoli);
    newView.appendChild(infoTime);
    newView.appendChild(info);
    newView.appendChild(details);
    newView.appendChild(newInfoTab);
    main.appendChild(newView);
}

//Steg 3
//Efter scaning kontrolerar att det inte komer up någon medelande om felet (errorMsg)
//true - "STOP"  false gå vidare till steg 4
function errorMsgChecker(errorMsg) {
    let error = false;
    $(errorMsg).bind("DOMSubtreeModified", function () {
        console.log(errorMsg.innerHTML);
        if (errorMsg.innerHTML !== undefined) {
            if (errorMsg.innerHTML.split(" ")[1] === "ej") {
                info.innerHTML = errorMsg.innerHTML;
                let src = chrome.runtime.getURL("sounds/CHORD.WAV");
                soundPlay(src);
                error = true
            }

        }
    });

    return error
}

//Steg 4
//läser in och plockar fram  informatin om adressen  som ska visas om den inskanade packet
//lägger till viktiga atributer som class och id där det behövs
function detailsChecker(details) {
    $(details).bind("DOMSubtreeModified", function () {
        idSetter(details);
        addressReader(infoReader(document.getElementById("infoAddress")));
    });
}

//Steg 5
// Kontrolerar att information om adress fins och sickar den tilbacka den
function infoReader(infoAddress) {
    let motagareInfo;
    if (infoAddress !== undefined && infoAddress !== null) {
        motagareInfo = infoAddress.getElementsByTagName("td")[1];
        return motagareInfo.innerHTML
    } else return false
}

//Steg 6
//Om adresen fins kontorer att packet till hör övriga, stora eller filialǘilsr
//Efter som div element med id - Detaljer updateras minst 7 gånger per packer
//Skapade jag en extra variabl oldData för att jamföra information och inköra scrip i onödan flera gånger
let oldData = " ";
let addressReader = function (data) {
    if (oldData !== data && data !== undefined && data !== false) {
        info.innerHTML = addressToString(data)[0];

        if (!filialFinder(data)) {
            standartView();
            bilFinder(addressToString(data)[2]);
            addToScanList(data);
            let src = chrome.runtime.getURL("sounds/DING.WAV");
            soundPlay(src)
        } else {
            addToScanList(data);

        }
    } //else if (data === false) info.innerHTML = "Skana om den valda packet eller  lägg den åt sida";
    oldData = data;
};

//Steg 7
//skapa ulicka varianter av adress information
let addressToString = function (data) {
    let varianter = [];
    varianter.push(data.split("<br>")[1].trim() + " " + data.split("<br>")[2].trim() + " " + data.split("<br>")[3].trim()); //namn adresss postnumer ort
    varianter.push(data.split("<br>")[2].trim() + " " + data.split("<br>")[3].trim()); ///postnumer ort
    varianter.push(data.split("<br>")[4].trim().split(" ")[0]);// post numer
    return varianter
};
//steg 8
//kontrolerar om packet till höra filial bil eller övrigt
let filialFinder = function (data) {
    if (data !== undefined && data !== null) {
        let isFilial = false;
        console.log(addressToString(data)[1]);
        for (let filialerElement of filialer) {
            for (let string of filialerElement) {
                if (string === addressToString(data)[1]) {
                    filiaDetect();
                    wereIs.innerHTML = filialerElement[0];
                    isFilial = true;
                }
            }
        }
        return isFilial

    }
};
//Steg 8.a
//Om packetet är övrig hitatar och visar information vilken bl ska köara packetet
//spelar up ljud Chimes.wav och ändrar utseende om det ett ;
let filiaDetect = function () {
    let src = chrome.runtime.getURL("sounds/CHIMES.WAV");
    soundPlay(src);
    wereIs.style.background = "darkcyan";
    info.style.background = "darkcyan";
    document.body.style.background = "#84b732";
};

//Steg 9
//ändrar utseende till standart eftet filial
function standartView() {
    wereIs.style.background = "beige";
    info.style.background = "beige";
    document.body.style.background = "#bbc3ae";
}

//steg 10
//bilFinder visar vilken bil ska köra den valda packet
let bilFinder = function (zipCode) {
    if (zipCode !== undefined) {
        let back = "???";
        let bakar = [
            ["Center", "402", "411", "412", "413", "414", "416"],
            ["Mölndal", "431"],
            ["Västra Frölunda", "421", "426", "436"],
            ["Hisinge", "405", "418", "417", "422", "423", "425", ""],
            ["Angered", "415", "424", "433"],
            ["Kungsbacka", "428", "429", "434", "437", "439"],
            ["På Bordet", "430"],
            ["Mölnlycke", "435", "438"],
            ["Kungälv", "442"],
            ["45:", "443", "445", "446", "448", "449"],
            ["Stenungsund", "444", "471", "472", "473"],
            ["Hönö", "475"]
        ];

        for (let bakarElement of bakar) {
            for (let string of bakarElement) {
                if (zipCode.slice(0, -2) === string) {
                    back = bakarElement[0];
                    wereIs.innerHTML = bakarElement[0];
                    return bakarElement[0];
                } else {

                }
            }
        }
    }

};

//spelar up den valda ljudet
let soundPlay = function (sound) {
    var audio = new Audio(sound);
    audio.play();

};




//lägger till informatiom om de skanade packet
let addToScanList = function (data) {
    let newInfoTab = document.getElementById("newInfoTable");

    let infoTR = document.createElement("TR");
    infoTR.setAttribute("class", "infoTr");

    newInfoTab.insertBefore(infoTR, newInfoTab.children[0]);

    let kundName = document.createElement("TD");
    let addressTD = document.createElement("TD");
    let bakTD = document.createElement("TD");

    kundName.innerHTML = document.getElementById("infoKund").getElementsByTagName("td")[1].innerHTML;
    addressTD.innerHTML = addressToString(data)[1];
    bakTD.innerHTML = wereIs.innerHTML;

    infoTR.appendChild(kundName);
    infoTR.appendChild(addressTD);
    infoTR.appendChild(bakTD);

    antalkoli.innerHTML = newInfoTab.getElementsByTagName("TR").length;
};


//lägger till id-atribute till details elementer
let idSetter = function (element) {
    if (element.getElementsByTagName("table")[0] !== undefined) {
        let infoTable = element.getElementsByTagName("table")[0];
        infoTable.setAttribute("id", "infoTable");
        let infoAddress = infoTable.getElementsByTagName("tr")[3];
        if (infoTable.getElementsByTagName("tr")[0] !== undefined) {
            infoTable.getElementsByTagName("tr")[0].setAttribute("id", "infoKund");
            infoTable.getElementsByTagName("tr")[1].setAttribute("id", "infoSandningsnr");
            infoTable.getElementsByTagName("tr")[2].setAttribute("id", "infoTime");
            infoTable.getElementsByTagName("tr")[3].setAttribute("id", "infoAddress");
            infoTable.getElementsByTagName("tr")[4].setAttribute("id", "infoAboutKoli");
            infoTable.getElementsByTagName("tr")[5].setAttribute("id", "infoVikt");
        }
    }

};

//Lässer in motagare addres information, jamför med gamla och kallar in functioner filialFinder och zipCodeExtactor










