//データリスト初期要素追加
async function AddWorkInit() {

    let shipnumres = await fetch(`${protocol}://${host}:${port}/cmbshipnum`);
    let shipnumdata = await shipnumres.json();
    let blockres = await fetch(`${protocol}://${host}:${port}/cmbblock`);
    let blockdata = await blockres.json();
    let startPoint = await fetch(`${protocol}://${host}:${port}/startpoint`);
    let startPointData = await startPoint.json();
    let end_point = await fetch(`${protocol}://${host}:${port}/endpoint`);
    let endPointData = await end_point.json();

    AddList(shipnumdata, "bansenList");
    AddList(blockdata, "blockList");
    AddList(startPointData, "startPointList");
    AddList(endPointData, "endPointList");

}

function AddList(jsondata, id) {
    var lengthMax = jsondata.rows.length

    for (let i = 0; i < lengthMax; i++) {
        let list = document.getElementById(id);
        let option = document.createElement("option");

        if (id === "bansenList") {
            option.innerHTML = jsondata.rows[i].ship_num;
        }
        else if (id === "blockList") {
            option.innerHTML = jsondata.rows[i].block_name;
        }

        else if (id === "startPointList") {
            option.innerHTML = jsondata.rows[i].start_point;
        }
        else if (id === "endPointList") {
            option.innerHTML = jsondata.rows[i].end_point;
        }
        list.appendChild(option);
    }

}

//コンボボックス内のoption全削除
function cmbclear() {
    //コンボボックス初期化
    var selObj = document.getElementById('bansenList');
    while (selObj.lastChild) {
        selObj.removeChild(selObj.lastChild);
    }
}

//追加作業DB書き込み
async function AddWork() {
    let bansen = document.getElementById("bansenId").value;
    let block = document.getElementById("blockId").value;
    let startpoint = document.getElementById("startPointId").value;
    let endpoint = document.getElementById("endPointId").value;
    let workCount = document.getElementById("workcountid").value;

    // URLを取得
    const url = new URL(window.location.href);
    // URLSearchParamsオブジェクトを取得
    const params = url.searchParams;
    // パラメータから取得
    let drivingperson = params.get("employee");
    let carnum = params.get("carnum");



    //作業日取得 YYYY/MM/DD
    let getWorkDate = getNowYMD();

    let res = await fetch(`${protocol}://${host}:${port}/getexceptiondata?bansen='${bansen}'&blockname='${block}'&startpoint='${startpoint}'&endpoint='${endpoint}'&workcount='${workCount}'&drivingperson='${drivingperson}'&workdate='${getWorkDate}'`);
    let tabledata = await res.json();
    //work_countの値格納用変数
    let maxCount = 1;

    //取得したレコードが0以外なら受渡フラグを確認しtrueならwork_countの最大値を取得しプラス1した値をテーブルに登録する
    if (tabledata.rows.length !== 0) {

        //work_countの最大値取得
        res = await fetch(`${protocol}://${host}:${port}/getmaxcount?bansen='${bansen}'&blockname='${block}'&startpoint='${startpoint}'&endpoint='${endpoint}'&drivingperson='${drivingperson}'&workdate='${getWorkDate}'`);
        tabledata = await res.json();
        maxCount = tabledata.rows[0].max_count;
        console.log(tabledata.rows[0].max_count);

        //受渡フラグ確認
        res = await fetch(`${protocol}://${host}:${port}/getexceptiondata?bansen='${bansen}'&blockname='${block}'&startpoint='${startpoint}'&endpoint='${endpoint}'&workcount='${maxCount}'&drivingperson='${drivingperson}'&workdate='${getWorkDate}'`);
        tabledata = await res.json();
        console.log(tabledata.rows[0].ship_flag);
        //受渡フラグがfalseならreturnする。
        if (!tabledata.rows[0].ship_flag) {
            alert('受渡が完了していません');
            return;
        }

        //追加登録可能なデータ work_count 最大値+1
        maxCount = parseInt(maxCount, 10) + 1;

        //追加登録
        DataImport(bansen, block, startpoint, endpoint, drivingperson, carnum, maxCount, getWorkDate);
    }

    //レコードに存在しない場合は追加登録
    if (tabledata.rows.length === 0) {
        DataImport(bansen, block, startpoint, endpoint, drivingperson, carnum, maxCount, getWorkDate);
    }
}

//データ書き込み前の処理
function DataImport(bansen, block, startpoint, endpoint, employee, carnum, maxCount, getWorkDate) {
    if (bansen === "" || block === "") {
        alert("番船とブロック名を入力してください!!");
        return;
    }

    addWorkregist(bansen, block, startpoint, endpoint, employee, carnum, maxCount, getWorkDate);
    alert("追加作業の登録をしました。");
    workCount();
}

//データ書き込み
function addWorkregist(bansen, block, startpoint, endpoint, employee, carnum, maxCount, getWorkDate) {

    var SelectBlock = {
        "carnum": carnum,
        "employee": employee,
        "bansen": bansen,
        "block": block,
        "startpoint": startpoint,
        "endpoint": endpoint,
        "maxCount": maxCount,
        "workDate": getWorkDate,
    };

    fetch(`${protocol}://${host}:${port}/addWorkregist`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Time-Zone':'Asia/Tokyo'
        },
        body: JSON.stringify(SelectBlock)
    })
}

//追加画面の状態更新
async function AddWorkCondition() {

    let bansen = document.getElementById("bansenId").value;
    let block = document.getElementById("blockId").value;
    let startpoint = document.getElementById("startPointId").value;
    let endpoint = document.getElementById("endPointId").value;
    let workCount = document.getElementById("workcountid").value;

    // URLを取得
    const url = new URL(window.location.href);
    // URLSearchParamsオブジェクトを取得
    const params = url.searchParams;
    // パラメータから取得
    const drivingperson = params.get("employee");

    //作業日取得 YYYY/MM/DD
    let getWorkDate = getNowYMD();


    let res = await fetch(`${protocol}://${host}:${port}/getexceptiondata?bansen='${bansen}'&blockname='${block}'&startpoint='${startpoint}'&endpoint='${endpoint}'&workcount='${workCount}'&drivingperson='${drivingperson}'&workdate='${getWorkDate}'`);
    let tabledata = await res.json();
    //番船とブロック名で絞り込んだ際になかった場合の処理
    if (tabledata.rows.length === 0) {

        document.getElementById("carnumid").innerHTML = "号車";
        document.getElementById("personid").innerHTML = "登録者";
        document.getElementById("addworkdepartureid").innerHTML = "発車時刻";
        document.getElementById("addworkreceiveid").innerHTML = "受取日時";
        document.getElementById("addworkdeliveryid").innerHTML = "受け渡し日時"

        //薄いグレー #E6E6E6
        document.getElementById("startid").style.backgroundColor = "#E6E6E6";
        document.getElementById("receiveid").style.backgroundColor = "#E6E6E6";
        document.getElementById("deliveryid").style.backgroundColor = "#E6E6E6";
        return;
    }

    var shipflag = tabledata.rows[0].ship_flag;
    var receivingflag = tabledata.rows[0].receiving_flag;
    var departureflag = tabledata.rows[0].departure_flag;

    var dpartureTime = ExchangeDate(TimeZoneSetting(tabledata.rows[0].departure_time));
    var receivingTime = ExchangeDate(TimeZoneSetting(tabledata.rows[0].receiving_achievement));
    var shipTime = ExchangeDate(TimeZoneSetting(tabledata.rows[0].delivery_achievement));

    if (shipflag === false & receivingflag === false & departureflag === false) {
        document.getElementById("addworkdepartureid").innerHTML = "発車時刻";
        document.getElementById("addworkreceiveid").innerHTML = "受取日時";
        document.getElementById("addworkdeliveryid").innerHTML = "受け渡し日時"
        document.getElementById("startid").style.backgroundColor = "#E6E6E6";
        document.getElementById("receiveid").style.backgroundColor = "#E6E6E6";
        document.getElementById("deliveryid").style.backgroundColor = "#E6E6E6";
        document.getElementById("carnumid").innerHTML = tabledata.rows[0].wagon_num;
        document.getElementById("personid").innerHTML = tabledata.rows[0].driving_person;
        document.getElementById("startPointId").value = tabledata.rows[0].start_point;
        document.getElementById("endPointId").value = tabledata.rows[0].end_point;
    }
    else if (shipflag === false & receivingflag === false & departureflag) {
        document.getElementById("startid").style.backgroundColor = "red";
        document.getElementById("addworkreceiveid").innerHTML = "受取日時";
        document.getElementById("addworkdeliveryid").innerHTML = "受け渡し日時"
        document.getElementById("receiveid").style.backgroundColor = "#E6E6E6";
        document.getElementById("deliveryid").style.backgroundColor = "#E6E6E6";
        document.getElementById("carnumid").innerHTML = tabledata.rows[0].wagon_num;
        document.getElementById("personid").innerHTML = tabledata.rows[0].driving_person;
        document.getElementById("addworkdepartureid").innerHTML = dpartureTime;
        document.getElementById("startPointId").value = tabledata.rows[0].start_point;
        document.getElementById("endPointId").value = tabledata.rows[0].end_point;
    }
    else if (shipflag === false & receivingflag & departureflag) {
        document.getElementById("startid").style.backgroundColor = "red";
        document.getElementById("addworkdeliveryid").innerHTML = "受け渡し日時"
        document.getElementById("receiveid").style.backgroundColor = "magenta";
        document.getElementById("deliveryid").style.backgroundColor = "#E6E6E6";
        document.getElementById("carnumid").innerHTML = tabledata.rows[0].wagon_num
        document.getElementById("personid").innerHTML = tabledata.rows[0].driving_person
        document.getElementById("addworkdepartureid").innerHTML = dpartureTime;
        document.getElementById("addworkreceiveid").innerHTML = receivingTime;
        document.getElementById("startPointId").value = tabledata.rows[0].start_point;
        document.getElementById("endPointId").value = tabledata.rows[0].end_point;
    }
    else if (shipflag & receivingflag & departureflag) {
        document.getElementById("startid").style.backgroundColor = "red";
        document.getElementById("receiveid").style.backgroundColor = "magenta";
        document.getElementById("deliveryid").style.backgroundColor = "gray";
        document.getElementById("carnumid").innerHTML = tabledata.rows[0].wagon_num
        document.getElementById("personid").innerHTML = tabledata.rows[0].driving_person
        document.getElementById("addworkdepartureid").innerHTML = dpartureTime;
        document.getElementById("addworkreceiveid").innerHTML = receivingTime;
        document.getElementById("addworkdeliveryid").innerHTML = shipTime;
        document.getElementById("startPointId").value = tabledata.rows[0].start_point;
        document.getElementById("endPointId").value = tabledata.rows[0].end_point;
    }
}


//timezone日本に設定
function TimeZoneSetting(date) {
    date = new Date(date)
    date = date.toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
    date = new Date(date);
    return (date);
}

//表示用の時間作成
function ExchangeDate(targetDate) {
    //変数にyyyy/M/DDを格納して/でsplitを行う
    var isLocalDate = targetDate.toLocaleDateString().split('/');
    //変数にdd:mm:ssを格納して:でsplitを行う
    var isLocalTime = targetDate.toLocaleTimeString().split(':');

    if (isLocalTime[0] < 10) {
        isLocalTime[0] = '0' + isLocalTime[0];
    }

    //上記の結果から必要な分結合して返す
    var dateString = isLocalDate[1] + '/' + isLocalDate[2] + ' ' + isLocalTime[0] + ':' + isLocalTime[1];
    return (dateString);
}


async function callRegistWork(buttonid, apiWord) {
    document.getElementById('startid').disabled = false;
    let bansen = document.getElementById("bansenId").value;
    let block = document.getElementById("blockId").value;
    let startpoint = document.getElementById("startPointId").value;
    let endpoint = document.getElementById("endPointId").value;
    let workCount = document.getElementById("workcountid").value;

    //作業日取得 YYYY/MM/DD
    let getWorkDate = getNowYMD();
    // URLを取得
    const url = new URL(window.location.href);
    // URLSearchParamsオブジェクトを取得
    const params = url.searchParams;
    // パラメータから取得
    const drivingperson = params.get("employee");

    let res = await fetch(`${protocol}://${host}:${port}/getexceptiondata?bansen='${bansen}'&blockname='${block}'&startpoint='${startpoint}'&endpoint='${endpoint}'&workcount='${workCount}'&drivingperson='${drivingperson}'&workdate='${getWorkDate}'`);
    let tabledata = await res.json();

    if (tabledata.rows.length === 0) {
        alert("追加作業データ書き込みを行ってください")
        document.getElementById(buttonid).disabled = false;
        return;
    }
    var shipflag = tabledata.rows[0].ship_flag;
    var receivingflag = tabledata.rows[0].receiving_flag;
    var departureflag = tabledata.rows[0].departure_flag;
    if (departureflag === false & receivingflag === false & shipflag === false) {
        if (apiWord != 'addworkdepar') { return; }
        RegistWork(bansen, block, apiWord, startpoint, endpoint, workCount, getWorkDate, drivingperson);
        alert("出発しました。");
        return;
    }
    else if (departureflag & receivingflag === false & shipflag === false) {
        if (apiWord != 'addworkreceive') { return; }
        RegistWork(bansen, block, apiWord, startpoint, endpoint, workCount, getWorkDate, drivingperson);
        alert("受け取りました。")
        return
    }
    else if (departureflag & receivingflag & shipflag === false) {
        if (apiWord != 'addworkdelivery') { return; }
        RegistWork(bansen, block, apiWord, startpoint, endpoint, workCount, getWorkDate, drivingperson);
        alert("実績登録しました。")
    }
    document.getElementById(buttonid).disabled = false;
}




//DBに例外作業実績時間登録
function RegistWork(bansen, block, apiword, startpoint, endpoint, workcount, getWorkdate, drivingperson) {

    var SelectBlock = {
        "bansen": bansen,
        "block": block,
        "startpoint": startpoint,
        "endpoint": endpoint,
        "workcount": workcount,
        "workdate": getWorkdate,
        "drivingperson": drivingperson,
        "UpdateTime": GetNowTime()
    };

    fetch(`${protocol}://${host}:${port}/${apiword}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(SelectBlock)
    })
}

//実績取り消し処理
async function DleateRec() {
    let bansen = document.getElementById("bansenId").value;
    let block = document.getElementById("blockId").value;
    let startpoint = document.getElementById("startPointId").value;
    let endpoint = document.getElementById("endPointId").value;
    let workCount = document.getElementById("workcountid").value;

    //作業日取得 YYYY/MM/DD
    let getWorkDate = getNowYMD();

    // URLを取得
    const url = new URL(window.location.href);
    // URLSearchParamsオブジェクトを取得
    const params = url.searchParams;
    // パラメータから取得
    const drivingperson = params.get("employee");

    let res = await fetch(`${protocol}://${host}:${port}/getexceptiondata?bansen='${bansen}'&blockname='${block}'&startpoint='${startpoint}'&endpoint='${endpoint}'&workcount='${workCount}'&drivingperson='${drivingperson}'&workdate='${getWorkDate}'`);
    let tabledata = await res.json();
    if (tabledata.rows.length === 0) {
        alert("作業が登録されていないので取り消しできません。")
        return;
    }

    var result = window.confirm("実績を取り消しますか？");
    console.log(result);
    if (result === false) return;
    console.log("test");
    Remove_Achievement(bansen, block, startpoint, endpoint, workCount, getWorkDate, drivingperson);
    alert("実績を取り消しました。");
    location.reload();
}
//実績取り消し
function Remove_Achievement(bansen, block, startpoint, endpoint, workcount, getWorkDate, drivingperson) {

    var SelectBlock = {
        "bansen": bansen,
        "block": block,
        "startpoint": startpoint,
        "endpoint": endpoint,
        "workcount": workcount,
        "workdate": getWorkDate,
        "drivingperson": drivingperson,
        "GetNowTime": GetNowTime()
    };

    fetch(`${protocol}://${host}:${port}/AddWorkDleate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(SelectBlock)
    })

}

//日付取得関数 YYYY/MM/DD
function getNowYMD() {
    var dt = new Date();
    var y = dt.getFullYear();
    var m = ("00" + (dt.getMonth() + 1)).slice(-2);
    var d = ("00" + dt.getDate()).slice(-2);
    var result = y + "/" + m + "/" + d;
    return result;
}

//DBに登録する日付取得関数
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
    str += " " + timeHour + ':' + timeMinutes;

    return (str);
}


// 時間 yyyy/m/dd hh:mm 方式
var realtime = function () {
    var dateObj = new Date(),
        dateYear = dateObj.getFullYear(),
        dateMonth = dateObj.getMonth() + 1,
        dateDay = dateObj.getDate(),
        timeHour = dateObj.getHours(),
        timeMinutes = dateObj.getMinutes(),
        timeSeconds = dateObj.getSeconds(),
        displayElement = document.getElementById('realtimeid'),
        str = '';

    // 一桁の場合は0を追加
    if (timeHour < 10) timeHour = '0' + timeHour;
    if (timeMinutes < 10) timeMinutes = '0' + timeMinutes;
    if (timeSeconds < 10) timeSeconds = '0' + timeSeconds;

    // 文字列の結合
    str = dateYear + '/' + dateMonth + '/' + dateDay;
    str += " " + timeHour + ':' + timeMinutes;

    // 出力
    if (displayElement) displayElement.innerHTML = str;

    // 繰り返し実行
    setTimeout(realtime, 1000);
};
realtime();

//時間変更処理
async function ChangeRegistTime(targetStatus) {
    let bansen = document.getElementById("bansenId").value;
    let block = document.getElementById("blockId").value;
    let startpoint = document.getElementById("startPointId").value;
    let endpoint = document.getElementById("endPointId").value;
    let workCount = document.getElementById("workcountid").value;

    //作業日取得 YYYY/MM/DD
    let getWorkDate = getNowYMD();
    // URLを取得
    const url = new URL(window.location.href);
    // URLSearchParamsオブジェクトを取得
    const params = url.searchParams;
    // パラメータから取得
    const drivingperson = params.get("employee");

    let res = await fetch(`${protocol}://${host}:${port}/getexceptiondata?bansen='${bansen}'&blockname='${block}'&startpoint='${startpoint}'&endpoint='${endpoint}'&workcount='${workCount}'&drivingperson='${drivingperson}'&workdate='${getWorkDate}'`);
    let tabledata = await res.json();

    if (tabledata.rows.length === 0) {
        alert("追加作業データ書き込みを行ってください")
        return;
    }

    //時間取得


    //ifターゲットが発車時刻だったら
    if (targetStatus === 'AddWorkDeparture') {
        let time = document.getElementById("addworkdepartureid").innerText.split(" ")[1];
        window.open(`./timechange.html` + location.search + `&bansen=${bansen}&blockname=${block}&startpoint=${startpoint}&endpoint=${endpoint}&workcount=${workCount}&drivingperson=${drivingperson}&workdate=${getWorkDate}&TargetChangeDate=AddWorkDeparture&Time=${time}`);
    }
    //ifターゲットが受け日時だったら
    else if (targetStatus === 'AddWorkReceive') {
        //発車フラグがtrueかチェック
        if (tabledata.rows[0].departure_flag === true) {
        let time = document.getElementById("addworkreceiveid").innerText.split(" ")[1];
            window.open(`./timechange.html` + location.search + `&bansen=${bansen}&blockname=${block}&startpoint=${startpoint}&endpoint=${endpoint}&workcount=${workCount}&drivingperson=${drivingperson}&workdate=${getWorkDate}&TargetChangeDate=AddWorkReceive&Time=${time}`);
        } else {
            alert('発車されていません。')
        }
    }
    //ifターゲットが受け渡し日時だったら
    else if (targetStatus === 'AddWorkDelivery') {
        //発車フラグと受取フラグがtrueかチェック
        if (tabledata.rows[0].departure_flag === true && tabledata.rows[0].receiving_flag === true) {
            let time = document.getElementById("addworkdeliveryid").innerText.split(" ")[1];
            window.open(`./timechange.html` + location.search + `&bansen=${bansen}&blockname=${block}&startpoint=${startpoint}&endpoint=${endpoint}&workcount=${workCount}&drivingperson=${drivingperson}&workdate=${getWorkDate}&TargetChangeDate=AddWorkDelivery&Time=${time}`);
        } else {
            alert('受取されていません。')
        }
    }
}


//時間変更用ダブルタップを検知し動作
document.addEventListener("DOMContentLoaded", function () {

    var AddWorkDepartureid = document.getElementById('addworkdepartureid');
    var AddWorkReceiveid = document.getElementById('addworkreceiveid');
    var AddWorkDeliveryid = document.getElementById('addworkdeliveryid');
    var lastTapTime = 0;


    if (AddWorkDepartureid) {
        AddWorkDepartureid.addEventListener('click', function () {
            var currentTime = new Date().getTime();
            if (currentTime - lastTapTime < 300) {
                // ダブルタップ時の処理をここに書く
                ChangeRegistTime('AddWorkDeparture');
            }
            lastTapTime = currentTime;
        });
    }

    AddWorkReceiveid.addEventListener('click', function () {
        var currentTime = new Date().getTime();
        if (currentTime - lastTapTime < 300) {
            // ダブルタップ時の処理をここに書く
            ChangeRegistTime('AddWorkReceive');
        }
        lastTapTime = currentTime;
    });

    AddWorkDeliveryid.addEventListener('click', function () {
        var currentTime = new Date().getTime();
        if (currentTime - lastTapTime < 300) {
            // ダブルタップ時の処理をここに書く
            ChangeRegistTime('AddWorkDelivery');
        }
        lastTapTime = currentTime;
    });

});