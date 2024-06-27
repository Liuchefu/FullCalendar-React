


//ブロックボタンクリックした際にパラメータ渡し
async function parameter() {
    // URLを取得
    const url = new URL(window.location.href);

    const params = url.searchParams;

    const username = params.get("username");
 
    const shippingid = params.get("shippingplanid");
    let res = await fetch(`${protocol}://${host}:${port}/getshippingtabledata?shippingid='${shippingid}'`);
    let shippedinfo = await res.json();
    const bansen = shippedinfo.rows[0].ship_num;
    const block = shippedinfo.rows[0].block_name;
    const startpoint = shippedinfo.rows[0].start_point;
    const centralpoint = shippedinfo.rows[0].central_point;
    const endpoint = shippedinfo.rows[0].end_point;
    const car_num = shippedinfo.rows[0].wagon_num;

    await IsCreateLabel(bansen, block, startpoint, centralpoint, endpoint);
    shipped(username, car_num, shippingid);
}

function IsCreateLabel(bansen, block_name, startpoint, centralpoint, endpoint) {
    if (centralpoint == '') { }
    else { centralpoint = centralpoint + '>' }
    document.getElementById("text").innerText = `　　番船 :${bansen}\nブロック :${block_name}\n　　場所 :${startpoint + ">" + centralpoint + endpoint}`;
}

async function shipped( username, car_num, shippingid) {

    let res = await fetch(`${protocol}://${host}:${port}/getshippingtabledata?shippingid='${shippingid}'`);
    let shippedinfo = await res.json();

    //情報更新
    var shipflag = shippedinfo.rows[0].ship_flag;
    var receivingflag = shippedinfo.rows[0].receiving_flag;
    var departureflag = shippedinfo.rows[0].departure_flag;
    var comment1 = shippedinfo.rows[0].comment1;
    var comment2 = shippedinfo.rows[0].comment2;
    document.getElementById("comment1Id").innerText = "コメント１:" + comment1;
    document.getElementById(" comment2Id").innerText = "コメント２:" + comment2;

    let achievementres = await fetch(`${protocol}://${host}:${port}/getachievement?shippingid='${shippingid}'`);
    let achievementinfo = await achievementres.json();

    if (shippedinfo.rows[0].departure_flag) {
        document.getElementById("startid").style.backgroundColor = "red";
    }

    if (shippedinfo.rows[0].receiving_flag) {
        document.getElementById("receivingid").style.backgroundColor = "magenta";
    }

    if (shippedinfo.rows[0].ship_flag) {
        document.getElementById("deliveryId").style.backgroundColor = "gray";
    }

    if (shipflag === false & receivingflag === false & departureflag === false) {
        document.getElementById("startid").style.backgroundColor = "";
        document.getElementById("receivingid").style.backgroundColor = "";
        document.getElementById("deliveryId").style.backgroundColor = "";
        document.getElementById("registratorid").innerText = username;
        document.getElementById("carnumid").innerText = car_num;
    }
    else if (shipflag === false & receivingflag === false & departureflag) {
        document.getElementById("registratorid").innerText = achievementinfo.rows[0].driving_person;
        document.getElementById("carnumid").innerText = achievementinfo.rows[0].wagon_num;
        document.getElementById("departureid").innerText = TimeZoneSetting(achievementinfo.rows[0].departure_time);

    }
    else if (shipflag === false & receivingflag & departureflag) {
        document.getElementById("registratorid").innerText = achievementinfo.rows[0].driving_person;
        document.getElementById("departureid").innerText = TimeZoneSetting(achievementinfo.rows[0].departure_time);
        document.getElementById("carnumid").innerText = achievementinfo.rows[0].wagon_num;
        document.getElementById("receiveid").innerText = TimeZoneSetting(achievementinfo.rows[0].receiving_achievement);
    }
    else if (shipflag & receivingflag & departureflag) {
        document.getElementById("receiveid").innerText = TimeZoneSetting(achievementinfo.rows[0].receiving_achievement);
        document.getElementById("deliveryid").innerText = TimeZoneSetting(achievementinfo.rows[0].delivery_achievement);
        document.getElementById("registratorid").innerText = achievementinfo.rows[0].driving_person;
        document.getElementById("departureid").innerText = TimeZoneSetting(achievementinfo.rows[0].departure_time);
        document.getElementById("carnumid").innerText = achievementinfo.rows[0].wagon_num;
    }

    else {
        return
    }
}


function TimeZoneSetting(date) {

    date = new Date(date);
    // date = date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
    var month = (date.getMonth() + 1).toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');
    var hours = date.getHours().toString().padStart(2, '0');
    var minutes = date.getMinutes().toString().padStart(2, '0');

    const formattedDate = `${month}/${day} ${hours}:${minutes}`;
    return formattedDate;
}

async function Receive() {

    const url = new URL(window.location.href);

    // URLSearchParamsオブジェクトを取得
    const params = url.searchParams;

    const shippingid = params.get("shippingplanid");


    let res = await fetch(`${protocol}://${host}:${port}/getshippingtabledata?shippingid='${shippingid}'`);
    let shippedinfo = await res.json();

    if (shippedinfo.rows[0].departure_flag & shippedinfo.rows[0].receiving_flag === false) {
        Receiveflag();
        document.getElementById("receiveid").innerText = GetTime();
        alert("受け取りました。");
    }
    DataComparison(shippingid);
}

//計画データと実績データの比較処理(計画が途中で変更になっている可能性があるため)
async function DataComparison(shippingid){

    //shipping_idを元に実績テーブルからデータ取得
    let achievementData = await fetch(`${protocol}://${host}:${port}/getCurrentAchievementData?shippingid='${shippingid}'`);
    let achievementCurrentJsonData = await achievementData.json();
    
    var achievementShipNum      = achievementCurrentJsonData.rows[0].ship_num
    var achievementBlockName    = achievementCurrentJsonData.rows[0].block_name
    var achievementStartPoint   = achievementCurrentJsonData.rows[0].start_point
    var achievementCentralPoint = achievementCurrentJsonData.rows[0].central_point
    var achievementEndPoint     = achievementCurrentJsonData.rows[0].end_point


    //shipping_idを元に計画テーブルからデータ取得
    let shippingplanData = await fetch(`${protocol}://${host}:${port}/getCurrentShippingPlanData?shippingid='${shippingid}'`);
    let shippingplanCurrentJsonData = await shippingplanData.json();
    
    var shippingplanShipNum      = shippingplanCurrentJsonData.rows[0].ship_num
    var shippingplanBlockName    = shippingplanCurrentJsonData.rows[0].block_name
    var shippingplanStartPoint   = shippingplanCurrentJsonData.rows[0].start_point
    var shippingplanCentralPoint = shippingplanCurrentJsonData.rows[0].central_point
    var shippingplanEndPoint     = shippingplanCurrentJsonData.rows[0].end_point

    var result = [];

    if(achievementShipNum != shippingplanShipNum){
        result.push(shippingplanShipNum);
    }
    if(achievementBlockName != shippingplanBlockName){
        result.push(shippingplanBlockName);
    }
    if(achievementStartPoint != shippingplanStartPoint){
        result.push(shippingplanStartPoint);
    }
    if(achievementCentralPoint != shippingplanCentralPoint){
        result.push(shippingplanCentralPoint);
    }
    if(achievementEndPoint != shippingplanEndPoint){
        result.push(shippingplanEndPoint);
    }
    console.log(result);

    if(result.length == 0){
        return;
    }
    TargetAchievementDataUpdate(shippingplanShipNum, shippingplanBlockName, shippingplanStartPoint, shippingplanCentralPoint, shippingplanEndPoint, shippingid);
}

//登録対象の実績テーブルと計画テーブルに変更が
//途中で合った際に実績データを計画データに更新
function TargetAchievementDataUpdate(shippingplanShipNum, shippingplanBlockName, shippingplanStartPoint, shippingplanCentralPoint, shippingplanEndPoint, shippingid) {

    var SelectBlock = {
        "shippingplanShipNum"     : shippingplanShipNum,
        "shippingplanBlockName"   : shippingplanBlockName,
        "shippingplanStartPoint"  : shippingplanStartPoint,
        "shippingplanCentralPoint": shippingplanCentralPoint,
        "shippingplanEndPoint"    : shippingplanEndPoint,
        "shippingid"              : shippingid,
    };

    fetch(`${protocol}://${host}:${port}/TargetRecord`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(SelectBlock)
    })
}


function Receiveflag() {

    // URLを取得
    const url = new URL(window.location.href);

    // URLSearchParamsオブジェクトを取得
    const params = url.searchParams;

    // consoleに受け取ったパラメータを出力

    // パラメータから取得
    const shippingid = params.get("shippingplanid");

    //受取、受け渡し日時取得
    const receivedate = document.getElementById("receiveid").innerText;

    var SelectBlock = {
        "shippingid": shippingid,
        "delivery": GetNowTime()
    };

    fetch(`${protocol}://${host}:${port}/receiveflag`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(SelectBlock)
    })
}


// M/D hh:mm方式
function GetTime() {
    var dateObj = new Date(),
        dateMonth = dateObj.getMonth() + 1,
        dateDay = dateObj.getDate(),
        timeHour = dateObj.getHours(),
        timeMinutes = dateObj.getMinutes(),
        timeSeconds = dateObj.getSeconds(),
        str = '';

    // 一桁の場合は0を追加
    if (timeHour < 10) timeHour = '0' + timeHour;
    if (timeMinutes < 10) timeMinutes = '0' + timeMinutes;
    if (timeSeconds < 10) timeSeconds = '0' + timeSeconds;

    // 文字列の結合
    str = dateMonth + '/' + dateDay;
    str += " " + timeHour + ':' + timeMinutes;
    return str;
}

async function Delivery() {

    // URLを取得
    const url = new URL(window.location.href);

    // URLSearchParamsオブジェクトを取得
    const params = url.searchParams;

    // パラメータから取得
    const shippingid = params.get("shippingplanid");


    let res = await fetch(`${protocol}://${host}:${port}/getshippingtabledata?shippingid='${shippingid}'`);
    let shippedinfo = await res.json();

    if (shippedinfo.rows[0].ship_flag === false & shippedinfo.rows[0].receiving_flag & shippedinfo.rows[0].departure_flag) {
        Ship_Fin();
        alert(document.getElementById("text").innerText + "\n作業が終了しました。");
    }
    DataComparison(shippingid);
}

function Ship_Fin() {
    // URLを取得
    const url = new URL(window.location.href);

    // URLSearchParamsオブジェクトを取得
    const params = url.searchParams;

    // パラメータから取得
    const shippingid = params.get("shippingplanid");

    var SelectBlock = {
        "shippingid": shippingid,
        "delivery": GetNowTime()
    };

    fetch(`${protocol}://${host}:${port}/shipflag`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(SelectBlock)
    })
}

//発車フラグがfalseだとボタンを押すとStartTimeRec関数が呼び出される
async function DepartureButton() {
    const url = new URL(window.location.href);

    // URLSearchParamsオブジェクトを取得
    const params = url.searchParams;

    // パラメータから取得
    const shippingid = params.get("shippingplanid");

    let res = await fetch(`${protocol}://${host}:${port}/getshippingtabledata?shippingid='${shippingid}'`);
    let shippedinfo = await res.json();

    if (shippedinfo.rows[0].departure_flag === false) {
        await StartTimeRec();
        alert("発車しました。");
    }
}

//出発ボタン呼び出し
function StartTimeRec() {

    const url = new URL(window.location.href);

    // URLSearchParamsオブジェクトを取得
    const params = url.searchParams;

    // パラメータから取得
    const carnum = params.get("carnum");
    const username = params.get("username");
    const bansen = params.get("bansen");
    const block = params.get("block");
    const startpoint = params.get("startpoint");
    const centralpoint = params.get("centralpoint");
    const endpoint = params.get("endpoint");
    const shippingid = params.get("shippingplanid");

    //受取、受け渡し日時取得
    // const departureTime = GetNowTime();

    var SelectBlock = {
        "carnum": carnum,
        "username": username,
        "bansen": bansen,
        "block": block,
        "startpoint": startpoint,
        "centralpoint": centralpoint,
        "endpoint": endpoint,
        "shippingid": shippingid,
        "departureTime": GetNowTime(),
    };

    //実績テーブルに登録者、出発時間、番船、ブロック名、移動先を登録
    fetch(`${protocol}://${host}:${port}/StartTimeRec`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(SelectBlock)
    })
}

//実績取り消し処理するか選択
function ActualCancel() {
    var result = window.confirm("実績を取り消しますか？");
    if (result === false) return;
    var targetBlock = document.getElementById("text").innerText;
    Remove_Achievement();
    alert(targetBlock + '\n' + "実績を取り消しました。");
    location.reload();
}

//実績取り消し
function Remove_Achievement() {
    const url = new URL(window.location.href);

    // URLSearchParamsオブジェクトを取得
    const params = url.searchParams;
    // パラメータから取得
    const shippingid = params.get("shippingplanid");

    var SelectBlock = {
        "shippingid": shippingid,
    };

    fetch(`${protocol}://${host}:${port}/ActualCancel`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(SelectBlock)
    })
}

//時間 m/d hh:mm方式
var realdatetime = function () {
    var dateObj = new Date(),
        dateMonth = (dateObj.getMonth() + 1).toString().padStart(2, "0"),
        dateDay = dateObj.getDate().toString().padStart(2, "0"),
        timeHour = dateObj.getHours().toString().padStart(2, "0"),
        timeMinutes = dateObj.getMinutes().toString().padStart(2, "0"),
        displayElement = document.getElementById('realdatetime'),
        str = '';

    // 文字列の結合
    str = dateMonth + '/' + dateDay + ' ' + timeHour + ':' + timeMinutes;

    // 出力
    if (displayElement) displayElement.innerHTML = str;

    // 繰り返し実行
    setTimeout(realdatetime, 1000);
};

realdatetime();

function GetNowTime() {
    var dateObj = new Date(),
        datayear = dateObj.getFullYear(),
        dateMonth = dateObj.getMonth() + 1,
        dateDay = dateObj.getDate(),
        timeHour = dateObj.getHours(),
        timeMinutes = dateObj.getMinutes(),
        timeSeconds = dateObj.getSeconds(),
        str = '';

    // 一桁の場合は0を追加
    if (timeHour < 10) timeHour = '0' + timeHour;
    if (timeMinutes < 10) timeMinutes = '0' + timeMinutes;
    if (timeSeconds < 10) timeSeconds = '0' + timeSeconds;

    // 文字列の結合
    str = datayear + '/' + dateMonth + '/' + dateDay;
    str += " " + timeHour + ':' + timeMinutes + ':' + timeSeconds;

    return (str);
}


async function checkFlag(buttonStatus) {

    const url = new URL(window.location.href);
    const params = url.searchParams;
    const shippingid = params.get("shippingplanid");

    let res = await fetch(`${protocol}://${host}:${port}/getshippingtabledata?shippingid='${shippingid}'`);
    let shippedinfo = await res.json();

    //受け日時の処理
    if (buttonStatus === 'receive') {
        if (shippedinfo.rows[0].departure_flag === true) {
            return true;
        }
        else {
            alert('発車ボタンが押下されていません');
            return false;
        }
    }
    //渡し日時の処理
    else if (buttonStatus === 'shipping') {
        if (shippedinfo.rows[0].receiving_flag === true && shippedinfo.rows[0].departure_flag === true) {
            return true;
        } else {
            alert('受取ボタンが押下されていません');
            return false;
        }
    }
}

//ダブルタップorダブルクリックを検知し動作
document.addEventListener("DOMContentLoaded", function () {

    //===============================実績登録画面の発車、受取、受渡の時間変更==========================================

    var departureDiv = document.getElementById('departureid');
    var receiveDiv = document.getElementById('receiveid');
    var shippingDiv = document.getElementById('deliveryid');
    var lastTapTime = 0;

    departureDiv.addEventListener('click', function () {
        var currentTime = new Date().getTime();
        if (currentTime - lastTapTime < 2000) {
            // ダブルタップ時の処理をここに書く
            let time = departureDiv.innerText.split(" ")[1];
            window.open(`./timechange.html` + location.search + `&TargetChangeDate=Departure&Time=${time}`);
        }
        lastTapTime = currentTime;
    });

    receiveDiv.addEventListener('click', function () {
        var currentTime = new Date().getTime();
        if (currentTime - lastTapTime < 2000) {
            //ダブルタップの処理をここに書く
            if (checkFlag('receive')) {
                let time = receiveDiv.innerText.split(" ")[1];
                window.open(`./timechange.html` + location.search + `&TargetChangeDate=Receive&Time=${time}`);
            }
        }
        lastTapTime = currentTime;
    });


    shippingDiv.addEventListener('click', function () {
        var currentTime = new Date().getTime();
        if (currentTime - lastTapTime < 2000) {
            // ダブルタップ時の処理をここに書く
            if (checkFlag('shipping')) {
                let time = shippingDiv.innerText.split(" ")[1];
                window.open(`./timechange.html` + location.search + `&TargetChangeDate=Shipping&Time=${time}`);
            }
        }
        lastTapTime = currentTime;
    });

});
    //===============================================================================================================