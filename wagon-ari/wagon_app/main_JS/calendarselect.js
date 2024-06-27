//各矩形のTopの配置位置を号車の配置に調整
const TOPPOSITION = 25;
const blockLocateTop = [280 + TOPPOSITION, 410 + TOPPOSITION, 540 + TOPPOSITION, 670 + TOPPOSITION, 800 + TOPPOSITION, 930 + TOPPOSITION];

//各予定作業ボタン生成
async function CallAPI() {
    let selectedDate = document.getElementById("selectDateID");
    let selectedDateLabel = document.getElementById("selectDateLabelID");
    //日付が選択されていなかったら今日の日付を取得
    if(!selectedDate.value){
        let now = new Date();
        now.setHours(now.getHours() + 9);
        selectedDate.value = now.toISOString().split('T')[0];
    }

    console.log(formatDate(selectedDate.value)); 
    selectedDateLabel.innerText = formatDate(selectedDate.value) + "の予定";

    let res = await fetch(`${protocol}://${host}:${port}?date=${formatDate(selectedDate.value)}`);
    let shipping_plan = await res.json();
    var sizeObj = document.getElementById("sizeid");
    //前のサイズ選択
    sizeObj.selectedIndex = localStorage.getItem("sizeIdx");
    var sizeIdx = sizeObj.selectedIndex;
    var size = sizeObj[sizeIdx].innerHTML;

    //前の号車選択
    var gousyaObj = document.getElementById("gousyaid");
    gousyaObj.selectedIndex = localStorage.getItem("gousyaIdx");
    document.documentElement.style.setProperty('--size-size', size + 'px');

    for (let i = 0; i < shipping_plan.rows.length; i++) {
        var ship_num = shipping_plan.rows[i].ship_num;
        var block_name = shipping_plan.rows[i].block_name;
        var start_point = shipping_plan.rows[i].start_point;
        var central_point = shipping_plan.rows[i].central_point;
        var end_point = shipping_plan.rows[i].end_point;
        var plan_load_time = shipping_plan.rows[i].receiving_scheduled;
        var plan_unloading_time = shipping_plan.rows[i].delivery_scheduled;
        var plan_load = MiniteExchange(plan_load_time);
        var plan_unloading = MiniteExchange(plan_unloading_time);
        var start_time = `${((plan_load - 360) / (60 / size)) + 108}`;
        var width_size = `${(plan_unloading - plan_load) / (60 / size)}`;
        var num_car = CarNumLocate(shipping_plan.rows[i].wagon_num);
        var ship_flag = shipping_plan.rows[i].ship_flag;
        var receiving_flag = shipping_plan.rows[i].receiving_flag;
        var depatrture_flag = shipping_plan.rows[i].departure_flag;
        var color = shipping_plan.rows[i].color;
        var comment1 = shipping_plan.rows[i].comment1;
        var shipping_plan_id = shipping_plan.rows[i].shipping_plan_id;
        var ship_num_change_flag = shipping_plan.rows[i].ship_num_change_flag
        var block_name_change_flag = shipping_plan.rows[i].block_name_change_flag
        var start_point_change_flag = shipping_plan.rows[i].start_point_change_flag
        var central_point_change_flag = shipping_plan.rows[i].central_point_change_flag
        var end_point_change_flag = shipping_plan.rows[i].end_point_change_flag
        var comment1_change_flag = shipping_plan.rows[i].comment1_change_flag


        if (ship_flag === false & receiving_flag === false & depatrture_flag === false) {
            var button_color = color;
        }
        else if (ship_flag === false & receiving_flag === false & depatrture_flag) {
            var button_color = "red";
        }
        else if (ship_flag === false & receiving_flag & depatrture_flag) {
            var button_color = "magenta";
        }
        else
            var button_color = "gainsboro";

        IsCreateButton(start_time, ship_num, block_name, num_car, width_size, button_color, start_point, central_point, end_point, ship_flag, comment1, shipping_plan_id,
            ship_num_change_flag, block_name_change_flag, start_point_change_flag, central_point_change_flag, end_point_change_flag, comment1_change_flag);
    }
}


//各予定ブロックのボタン作成
function IsCreateButton(start_time, ship_num, block_name, num_car, width_size, button_color, start_point, central_point, end_point, ship_flag, comment1, shipping_plan_id,
    ship_num_change_flag, block_name_change_flag, start_point_change_flag, central_point_change_flag, end_point_change_flag, comment1_change_flag) {
       
    // 要素を作成する
    var element = document.createElement("button");
    element.id = "blockid";

    ship_num = (ship_num_change_flag) ? `<span style='background-color:white ; color:red;'>${ship_num}</span><br>` : `${ship_num}<br>`;
    block_name = (block_name_change_flag) ? `<span style='background-color:white; color:red;'>${block_name}</span><br>` : `${block_name}<br>`;
    start_point = (start_point_change_flag) ? `<span style='background-color: white; color:red;'>${start_point}</span>` : `${start_point}`;
    central_point = (central_point_change_flag) ? `<span style='background-color: white; color:red;'>${central_point}</span>>` : `${central_point}>`;
    end_point = (end_point_change_flag) ? `<span style='background-color: white; color:red;'>${end_point}</span><br>` : `${end_point}<br>`;
    comment1 = (comment1_change_flag) ? `<span style='color:black; background-color:white; color:red; font-size:15px'>${comment1}</span>` : `<span style='color:black;font-size:15px '>${comment1}</span>`;
    if (central_point == 'null' || central_point == '>') { central_point = '' };
    if (comment1 == 'null') { comment1 = '' };
    let result = ship_num + block_name + start_point + ">" + central_point + end_point + comment1;

    element.innerHTML = result;
    if (width_size < 100) {
        element.style = style = `width: ${width_size}px ; height: 120px; position: absolute; left: ${start_time}px; top: ${num_car}px; background-color:${button_color} ; border-color:black; border-radius:10px;  font-size:10px`
    }
    else
        element.style = style = `width: ${width_size}px ; height: 120px; position: absolute; left: ${start_time}px; top: ${num_car}px; background-color:${button_color} ; border-color:black; border-radius:10px;  font-size:15px`

    // 要素にクリックイベントを追加する
    element.onclick = function () {

        let gousyaObj = document.getElementById("gousyaid");
        let employeeObj = document.getElementById("employee");
        let companyObj = document.getElementById("company");
        let gousyaIdx = gousyaObj.selectedIndex;
        let gousya = gousyaObj[gousyaIdx].innerHTML;
        let employeeIdx = employeeObj.selectedIndex;
        let companyIdx = companyObj.selectedIndex;
        let targetCompany = companyObj[companyIdx].innerHTML;
        let targetEmployee;
        if (targetCompany === '選択してください' & ship_flag === false) { alert("会社と運転者の選択をしてください‼"); return };
        if (employeeIdx >= 0) {
            targetEmployee = employeeObj[employeeIdx].innerHTML;
        }

        var block_info = element.innerText
        var blockInfo = block_info.split(/\n/);
        var point = blockInfo[2].split(">");

        let start_point = point[0];
        let central_point = point[1];
        let end_point = point[2]

        if (point.length === 2) {
            central_point = '';
            end_point = point[1];
        }
        // window.open(`./registration.html?carnum=${gousya}&username=${targetEmployee}&bansen=${blockInfo[0]}&block=${blockInfo[1]}&startpoint=${start_point}&centralpoint=${central_point}&endpoint=${end_point}&shippingplanid=${shipping_plan_id}`);
    };

    // 要素を追加する「親要素」を指定する。
    var parent = document.getElementById("parent");
    // 要素を追加する
    parent.appendChild(element);

}


async function buttonCondition() {
    let res = await fetch(`${protocol}://${host}:${port}?date=${formatDate(selectedDate.value)}`);
    let shipping_plan = await res.json();
    for (let i = 0; i < shipping_plan.rows.length; i++) {
        var ship_num = shipping_plan.rows[i].ship_num;
        var block_name = shipping_plan.rows[i].block_name;
        var start_point = shipping_plan.rows[i].start_point;
        var central_point = shipping_plan.rows[i].central_point;
        var end_point = shipping_plan.rows[i].end_point;
        var comment1 = shipping_plan.rows[i].comment1;
        var ship_num_change_flag = shipping_plan.rows[i].ship_num_change_flag
        var block_name_change_flag = shipping_plan.rows[i].block_name_change_flag
        var start_point_change_flag = shipping_plan.rows[i].start_point_change_flag
        var central_point_change_flag = shipping_plan.rows[i].central_point_change_flag
        var end_point_change_flag = shipping_plan.rows[i].end_point_change_flag
        var comment1_change_flag = shipping_plan.rows[i].comment1_change_flag
        var ship_flag = shipping_plan.rows[i].ship_flag;
        var receiving_flag = shipping_plan.rows[i].receiving_flag;
        var depatrture_flag = shipping_plan.rows[i].departure_flag;
        var color = shipping_plan.rows[i].color;


        ship_num = (ship_num_change_flag) ? `<span style='background-color:white; color:red;'>${ship_num}</span><br>` : `${ship_num}<br>`;
        block_name = (block_name_change_flag) ? `<span style='background-color:white; color:red;'>${block_name}</span><br>` : `${block_name}<br>`;
        start_point = (start_point_change_flag) ? `<span style='background-color: white; color:red;'>${start_point}</span>` : `${start_point}`;
        central_point = (central_point_change_flag) ? `<span style='background-color: white; color:red;'>${central_point}</span>>` : `${central_point}>`;
        end_point = (end_point_change_flag) ? `<span style='background-color: white; color:red;'>${end_point}</span><br>` : `${end_point}<br>`;
        comment1 = (comment1_change_flag) ? `<span style='color:red; background-color:white;font-size:15px '>${comment1}</span>` : `<span style='color:black;font-size:15px '>${comment1}</span>`;

        if (central_point == 'null' || central_point == '>') { central_point = '' };
        if (comment1 == 'null') { comment1 = '' };
        var result = ship_num + block_name + start_point + ">" + central_point  + end_point + comment1;

        if (ship_flag === false & receiving_flag === false & depatrture_flag === false) {
            var button_color = color;
        }
        else if (ship_flag === false & receiving_flag === false & depatrture_flag) {
            var button_color = "red";
        }
        else if (ship_flag === false & receiving_flag & depatrture_flag) {
            var button_color = "magenta";
        }
        else
            var button_color = "gainsboro";
        try {
            getChiledElemnt(i, button_color, result);
        }
        catch (e) { }

    }
}

function getChiledElemnt(i, button_color, result) {
    var list_element = document.getElementById('parent');
    list_element.children[i].style.backgroundColor = button_color;
    list_element.children[i].innerHTML = result;
    // //変更フラグコントロールで
    // list_element.children[i].style.borderColor = "red";
    // list_element.children[i].style.borderWidth = "4px";
}

function MiniteExchange(plan_time) {
    hms = plan_time;
    let a = hms.split(':');
    let minutes = (a[0]) * 60 + (a[1]) * 1;  // minutes are worth 60 seconds. Hours are worth 60 minutes.
    return minutes;
}

//各ブロックの号車位置の調整
function CarNumLocate(car_num) {

    if (car_num === "1") {
        return blockLocateTop[0];
    }

    else if (car_num === "2") {
        return blockLocateTop[1];
    }

    else if (car_num === "3") {
        return blockLocateTop[2];
    }

    else if (car_num === "4") {
        return blockLocateTop[3];
    }

    else if (car_num === "5") {
        return blockLocateTop[4];
    }

    else if (car_num === "6") {
        return blockLocateTop[5];
    }
}


//日付をYYYY-MM-DDをYYYY/MM/DDの形に変換
function formatDate(dateString){
    //日付文字列をDateオブジェクトに変換
    const date = new Date(dateString);

    //年、月、日取得
    let year = date.getFullYear();
    let month = ('0' + (date.getMonth() + 1)).slice(-2); //月は0から始まるため1を加えて1から始まるようにする
    let day  = ('0' + date.getDate()).slice(-2); //日も0から始まるため、2桁に揃える

    return year + '/' + month + '/' + day;
}

//日付取得関数 YYYY/MM/DD
function getTommorowYMD() {
    var dt = new Date();
    dt.setDate(dt.getDate() + 1);
    var y = dt.getFullYear();
    var m = ("00" + (dt.getMonth() + 1)).slice(-2);
    var d = ("00" + dt.getDate()).slice(-2);
    var result = y + "/" + m + "/" + d;
    return result;
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
        displayElement = document.getElementById('realTimeid'),
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

//ブロック削除
function RemoveBlock() {

    //親要素取得
    var parent = document.getElementById('parent');
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }

}

//サイズ 前回の選択した要素の情報をローカルストレージに保存
function SavePreSizeIdx() {
    let sizeSelectIdx = document.getElementById("sizeid");
    let selectedIndex = sizeSelectIdx.selectedIndex;
    localStorage.setItem('sizeIdx', selectedIndex.toString());
}

//号車 前回の選択した要素の情報をローカルストレージに保存
function SavePreGousyaIdx() {
    let gousyaSelectIdx = document.getElementById("gousyaid");
    let selectedIndex = gousyaSelectIdx.selectedIndex;
    localStorage.setItem('gousyaIdx', selectedIndex.toString());
}

function AddWork() {
    let companyObj = document.getElementById("company");
    let companyIdx = companyObj.selectedIndex;
    let targetCompany = companyObj[companyIdx].innerHTML;
    if (targetCompany === '選択してください') { alert("会社と運転者の選択をしてください‼"); return };
    var gousyaObj = document.getElementById("gousyaid");
    var gousyaIdx = gousyaObj.selectedIndex;
    var gousyanum = gousyaObj[gousyaIdx].innerHTML;
    var employeeObj = document.getElementById("employee")
    var employeeIdx = employeeObj.selectedIndex;
    var targetEmployee = employeeObj[employeeIdx].innerHTML;

    window.open(`./addwork.html?carnum=${gousyanum}&employee=${targetEmployee}`)
}

//台車位置情報遷移
function mapPlot(){
    window.open ('http://172.28.8.180:5080/map_plot/map_plot.html');
}
