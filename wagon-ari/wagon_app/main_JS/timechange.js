// 次の要素を選択する処理
function selectNextOption(selectId) {
    var selectElement = document.getElementById(selectId);
    var selectedIndex = selectElement.selectedIndex;
    if (selectedIndex === selectElement.options.length - 1) {
        selectedIndex = 0; // 最初のオプションに移動する
    } else {
        selectedIndex++;
    }
    selectElement.selectedIndex = selectedIndex;
}

// 前の要素を選択する処理
function selectPreviousOption(selectId) {
    var selectElement = document.getElementById(selectId);
    var selectedIndex = selectElement.selectedIndex;
    if (selectedIndex === 0) {
        selectedIndex = selectElement.options.length - 1; // 最後のオプションに移動する
    } else {
        selectedIndex--;
    }
    selectElement.selectedIndex = selectedIndex;

}


//変更箇所名表示関数
function getTheme() {

    const url = new URL(window.location.href);
    const params = url.searchParams;
    const selectedChangeDate = params.get("TargetChangeDate");
    const getTime = params.get("Time");
    // let hour_minite = getTime.split(":");
    // let minute = adjustTime(hour_minite[1]);
    hour_minite = adjustTime(getTime);

    if (hour_minite.length == 2) {
        document.getElementById("hour-select").value = hour_minite[0];
        document.getElementById("minute-select").value = hour_minite[1];
    }
    if (selectedChangeDate === 'Departure' || selectedChangeDate === 'AddWorkDeparture') {
        document.getElementById('themeid').innerText = '発車時刻変更'
    } else if (selectedChangeDate === 'Receive' || selectedChangeDate === 'AddWorkReceive') {
        document.getElementById('themeid').innerText = '受け日時変更'
    } else if (selectedChangeDate === 'Shipping' || selectedChangeDate === 'AddWorkDelivery') {
        document.getElementById('themeid').innerText = '渡し日時変更'
    } else {
        console.log('例外が発生しました。')
    }
}

//調整した分取得
function adjustTime(getTime) {
    let hour_minite = getTime.split(":");
    if (hour_minite[1] >= 0 && hour_minite[1] <= 2) {
        hour_minite[1] = "00";
        return hour_minite;
    } else if (hour_minite[1] >= 3 && hour_minite[1] <= 7) {
        hour_minite[1] = "05";
        return hour_minite;
    } else if (hour_minite[1] >= 8 && hour_minite[1] <= 12) {
        hour_minite[1] = "10";
        return hour_minite;
    } else if (hour_minite[1] >= 13 && hour_minite[1] <= 17) {
        hour_minite[1] = "15";
        return hour_minite;
    } else if (hour_minite[1] >= 18 && hour_minite[1] <= 22) {
        hour_minite[1] = "20";
        return hour_minite;
    } else if (hour_minite[1] >= 23 && hour_minite[1] <= 27) {
        hour_minite[1] = "25";
        return hour_minite;
    } else if (hour_minite[1] >= 28 && hour_minite[1] <= 32) {
        hour_minite[1] = "30";
        return hour_minite;
    } else if (hour_minite[1] >= 33 && hour_minite[1] <= 37) {
        hour_minite[1] = "35";
        return hour_minite;
    } else if (hour_minite[1] >= 38 && hour_minite[1] <= 42) {
        hour_minite[1] = "40";
        return hour_minite;
    } else if (hour_minite[1] >= 43 && hour_minite[1] <= 47) {
        hour_minite[1] = "45";
        return hour_minite;
    } else if (hour_minite[1] >= 48 && hour_minite[1] <= 52) {
        hour_minite[1] = "50";
        return hour_minite;
    } else if (hour_minite[1] >= 53 && hour_minite[1] <= 57) {
        hour_minite[1] = "55";
        return hour_minite;
    } else if(hour_minite[1] >= 58){
        if(hour_minite[0] == "23" || hour_minite[0] ==""){
            hour_minite[1] = "00"; 
            hour_minite[0] = "00";
        }
        else {
            hour_minite[0] = `${parseInt(hour_minite[0], 10) + 1}`;
            hour_minite[0] = hour_minite[0].padStart(2, '0');
            hour_minite[1] = hour_minite[1] = "00";
        }
        return hour_minite;
    } else{
        hour_minite[1] = "00"; 
        hour_minite[0] = "00";
        return hour_minite;
    }
}

//「登録」ボタン押下時各時間変更処理まとめ関数
async function ChangeStartTimeResult() {

    const url = new URL(window.location.href);
    const params = url.searchParams;
    const selectedChangeDate = params.get("TargetChangeDate");

    if (selectedChangeDate === 'Departure') {
        let hasShippingId = await getAchievementData();
        UpdateStartTime(hasShippingId);
    } else if (selectedChangeDate === 'Receive') {
        ReceiveChangeTime();
    } else if (selectedChangeDate === 'Shipping') {
        ShipChangeTime();
    } else if (selectedChangeDate === 'AddWorkDeparture') {
        targetTimeChange('addworkdepar');
    } else if (selectedChangeDate === 'AddWorkReceive') {
        targetTimeChange('addworkreceive');
    } else if (selectedChangeDate === 'AddWorkDelivery') {
        targetTimeChange('addworkdelivery');
    } else {
        console.log('例外が発生しました。')
    }
}


// =================================================発車時刻変更関連処理=========================================================
//実績登録テーブルに登録されているか比較し確認
async function getAchievementData() {

    const url = new URL(window.location.href);

    // URLSearchParamsオブジェクトを取得
    const params = url.searchParams;
    const shippingid = params.get("shippingplanid");
    let res = await fetch(`${protocol}://${host}:${port}/getachievementdata?shippingid=${shippingid}`);
    let result = await res.json();
    return result.rowCount;
}


// 変更時間更新
function UpdateStartTime(hasShippingId) {
    let formattedDate = getFormatData();
    hasShippingId == 1 ? StartTimeUpdate(formattedDate) : StartTimeRec(formattedDate);
}


//出発ボタン呼び出し(未登録の場合)
function StartTimeRec(formattedDate) {

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


    var SelectBlock = {
        "carnum": carnum,
        "username": username,
        "bansen": bansen,
        "block": block,
        "startpoint": startpoint,
        "centralpoint": centralpoint,
        "endpoint": endpoint,
        "shippingid": shippingid,
        "departureTime": formattedDate,
    };

    //実績テーブルに登録者、出発時間、番船、ブロック名、移動先を登録
    fetch(`${protocol}://${host}:${port}/StartTimeRec`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(SelectBlock)
    }).then(() => {
        window.close();
    })
}


//出発ボタン呼び出し(登録済みの場合)
function StartTimeUpdate(formattedDate) {

    const url = new URL(window.location.href);

    // URLSearchParamsオブジェクトを取得
    const params = url.searchParams;

    // パラメータから取得
    const shippingid = params.get("shippingplanid");


    var SelectBlock = {
        "shippingid": shippingid,
        "departureTime": formattedDate,
    };

    //実績テーブルに登録者、出発時間、番船、ブロック名、移動先を登録
    fetch(`${protocol}://${host}:${port}/StartTimeUpdate`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(SelectBlock)
    }).then(() => {
        window.close();
    })
}
// =================================================受け日時変更関連処理=========================================================

function ReceiveChangeTime() {

    // URLを取得
    const url = new URL(window.location.href);

    // URLSearchParamsオブジェクトを取得
    const params = url.searchParams;

    // consoleに受け取ったパラメータを出力

    // パラメータから取得
    const shippingid = params.get("shippingplanid");

    var SelectBlock = {
        "shippingid": shippingid,
        "delivery": getFormatData()
    };

    fetch(`${protocol}://${host}:${port}/receiveflag`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(SelectBlock)
    }).then(() => {
        window.close();
    })
}

// =================================================渡し日時変更関連処理=========================================================

function ShipChangeTime() {
    // URLを取得
    const url = new URL(window.location.href);

    // URLSearchParamsオブジェクトを取得
    const params = url.searchParams;

    // パラメータから取得
    const shippingid = params.get("shippingplanid");

    var SelectBlock = {
        "shippingid": shippingid,
        "delivery": getFormatData()
    };

    fetch(`${protocol}://${host}:${port}/shipflag`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(SelectBlock)
    }).then(() => {
        window.close();
    })
}
// =======================================================================================================================================


//追加作業の発車時刻変更
//追加作業の受け日時変更
//追加作業の渡し日時変更
function targetTimeChange(apiword) {

    const url = new URL(window.location.href);

    // URLSearchParamsオブジェクトを取得
    const params = url.searchParams;

    // パラメータから取得
    const bansen = params.get("bansen");
    const blockname = params.get("blockname");
    const startpoint = params.get("startpoint");
    const endpoint = params.get("endpoint");
    const workcount = params.get("workcount");
    const workdate = params.get("workdate");
    const drivingperson = params.get("employee");

    RegistWork(bansen, blockname, apiword, startpoint, endpoint, workcount, workdate, drivingperson);
}




//DBに例外作業実績時間更新
function RegistWork(bansen, blockname, apiword, startpoint, endpoint, workcount, workdate, drivingperson) {


    var SelectBlock = {
        "bansen": bansen,
        "block": blockname,
        "startpoint": startpoint,
        "endpoint": endpoint,
        "workcount": workcount,
        "workdate": workdate,
        "drivingperson": drivingperson,
        "UpdateTime": getFormatData()
    };

    console.log(SelectBlock);

    fetch(`${protocol}://${host}:${port}/${apiword}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(SelectBlock)
    }).then(() => {
        window.close();
    })
}


//登録用の時間を生成する関数
function getFormatData() {
    let hour = document.getElementById("hour-select");
    let minite = document.getElementById("minute-select");
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (date.getMonth() + 1)).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);
    var formattedDate = year + "/" + month + "/" + day + ' ' + hour.value + ':' + minite.value;
    alert('出発時刻を' + formattedDate + 'で更新しました。');
    return (formattedDate);
}
