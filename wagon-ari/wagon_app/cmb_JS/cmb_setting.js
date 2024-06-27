
//会社名一覧をDBから取得しコンボボックスに格納
async function Company() {
    let res = await fetch(`${protocol}://${host}:${port}/company`);
    let comp = await res.json();

    for (let i = 0; i < comp.rows.length; i++) {
        let option = document.createElement("option");
        option.setAttribute("value", i + 1);
        option.innerHTML = comp.rows[i].company_name;
        company.appendChild(option);
    }

    var companyOption = document.getElementById("company");
    companyOption.selectedIndex = localStorage.getItem("companyIdx");
    empl(companyOption.options[localStorage.getItem("companyIdx")].innerHTML);
}

//コンボボックス内の会社が選択されたら動作する
function selPref(obj) {
    let idx = obj.selectedIndex;
    localStorage.setItem("companyIdx", idx);

    if (idx === 0) {
        cmbclear();
        return
    };

    var targetCompany = obj[idx].innerHTML;
    empl(targetCompany);
}

//会社から社員の絞り込み
async function empl(targetCompany) {

    cmbclear();
    //会社で絞り込んだ作業員をコンボボックスに入れる。
    let res = await fetch(`${protocol}://${host}:${port}/emp?company='${targetCompany}'`);
    let emp = await res.json();
    for (let i = 0; i < emp.rows.length; i++) {
        let option = document.createElement("option");
        option.setAttribute("value", i + 1);
        option.innerHTML = emp.rows[i].employee_name;
        employee.appendChild(option);
    }
    var employeeOption = document.getElementById("employee");
    employeeOption.selectedIndex = localStorage.getItem("employeeIdx");
}

function getEmployeeSelectInfo() {
    var employee = document.getElementById("employee");
    var idx = employee.options.selectedIndex;
    localStorage.setItem("employeeIdx", idx);
}

//ブロックサイズマスターをブロックサイズコンボボックスに反映
async function BlockSize() {
    let res = await fetch(`${protocol}://${host}:${port}/blocksize`);
    let blockDataJson = await res.json();

    for (let i = 0; i < blockDataJson.rows.length; i++) {
        let option = document.createElement("option");
        option.setAttribute("value", i + 1);
        option.innerHTML = blockDataJson.rows[i].block_size;
        sizeid.appendChild(option);
    }
}

//追加作業登録画面 回数コンボボックスにfetchしたwork_countを格納
//ブロックサイズマスターをブロックサイズコンボボックスに反映
async function workCount() {

    workcountid.innerHTML = '';

    let shipnum = document.getElementById("bansenId").value;
    let blockname = document.getElementById("blockId").value;
    let startpoint = document.getElementById("startPointId").value;
    let endpoint = document.getElementById("endPointId").value;


    // URLを取得
    const url = new URL(window.location.href);
    // URLSearchParamsオブジェクトを取得
    const params = url.searchParams;
    // パラメータから取得
    const drivingperson = params.get("employee");

    //作業日取得 YYYY/MM/DD
    let getWorkDate = getNowYMD();

    let res = await fetch(`${protocol}://${host}:${port}/workcount?shipnum='${shipnum}'&blockname='${blockname}'&startpoint='${startpoint}'&endpoint='${endpoint}'&drivingperson='${drivingperson}'&workdate='${getWorkDate}'`);
    let workCountJson = await res.json();
    console.log(workCountJson)
    for (let i = 0; i < workCountJson.rows.length; i++) {
        let option = document.createElement("option");
        // option.setAttribute("value", i + 1);
        option.innerHTML = workCountJson.rows[i].work_count;
        console.log(option)
        workcountid.appendChild(option);
    }
}
//TODO:addwork.jsの回数コンボボックスに回数を反映させる
//DB addテーブルに回数カラム、仕事日カラムを追加
//server.jsに回数取得APIコードを追加
//追加ボタンを押した際にテーブルに回数番船ブロック名登録者をキーに存在確認


//コンボボックス初期化
function cmbclear() {
    //コンボボックス初期化
    var selObj = document.getElementById('employee');
    while (selObj.lastChild) {
        selObj.removeChild(selObj.lastChild);
    }
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
