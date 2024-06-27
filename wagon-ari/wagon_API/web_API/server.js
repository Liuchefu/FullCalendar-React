//ポート設定
const port = 3005;

// express初期設定
const express = require('express');
const app = express();
app.use(express.json());

//cors設定
const cors = require('cors');
app.use(cors());

//body-parser設定
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//ポスグレ接続設定
const { Client } = require("pg");
const client = new Client({
    user: "postgres",
    host: "192.168.50.200",
    database: "postgres",
    password: "test",
    port: 9432,
    timezone: 'Asia/Tokyo',
});
client.connect();

//httpsの設定
const fs = require('fs');

const server = require('https').createServer({
    key: fs.readFileSync('key/my-server.key'),
    cert: fs.readFileSync('key/my-server.crt'),
}, app);


app.get('/', (req, res) => {
    // const sql = `select * from public.shipping_plan left JOIN color_master ON shipping_plan.ship_num = color_master.ship_num where shipping_plan.work_date = '${req.query.date}' AND shipping_plan.delete_flag = false ORDER BY shipping_plan.id ASC`;
    const sql = `
    SELECT *, shipping_plan.id AS shipping_plan_id
    FROM public.shipping_plan
    LEFT JOIN color_master ON shipping_plan.ship_num = color_master.ship_num
    WHERE shipping_plan.work_date = '${req.query.date}'
    AND shipping_plan.delete_flag = false
    ORDER BY shipping_plan.id ASC;
    `;

    client.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
});

//実績テーブルから取得
app.get('/getachievement', (req, res) => {
    const sql = `select * from achievement_data where shipping_plan_id = ${req.query.shippingid} `;
    client.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
})

app.get('/flagtrue', (req, res) => {
    const sql = "select * from public.shipping_plan where delete_flag = true  ";
    client.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
});


app.get('/color', (req, res) => {
    const sql = `select * from public.color_master where ship_num = '${req.query.color}'  `;

    client.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
});


//会社名取得
app.get('/company', (req, res) => {
    const sql = `select company_name from company order by id ASC`;
    client.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
})

//運転者取得
app.get('/emp', (req, res) => {
    // const sql = `select employee.employee_name from company left join employee on company.company_name = employee.company_name where company.company_name = ${req.query.company}`;
    const sql = `
    SELECT employee.employee_name
    FROM company
    LEFT JOIN employee ON company.company_name = employee.company_name
    WHERE company.company_name = ${req.query.company};
    `;

    client.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
})

// ブロックサイズ取得
//会社名取得
app.get('/blocksize', (req, res) => {
    const sql = `select block_size from block_size order by id ASC`;
    client.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
})

app.get('/getshippingtabledata', (req, res) => {
    const sql = `select * from shipping_plan where id=${req.query.shippingid} `;
    client.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
})

//実績テーブルから取得
app.get('/getCurrentAchievementData', (req, res) => {
    const sql = `select ship_num, block_name, start_point, central_point, end_point from achievement_data where shipping_plan_id=${req.query.shippingid} `;
    client.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
})
//計画テーブルから取得
app.get('/getCurrentShippingPlanData', (req, res) => {
    const sql = `select ship_num, block_name, start_point, central_point, end_point from shipping_plan where id=${req.query.shippingid} `;
    client.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
})


//実績テーブルの対象レコード更新(計画データに合わせるため)
//POSTで受取フラグをtrueにする
app.post('/TargetRecord/', (req, res) => {
    const sql = `update public.achievement_data 
    set 
    ship_num      = '${req.body.shippingplanShipNum}', 
    block_name    = '${req.body.shippingplanBlockName}',
    start_point   = '${req.body.shippingplanStartPoint}',
    central_point = '${req.body.shippingplanCentralPoint}',
    end_point     = '${req.body.shippingplanEndPoint}'
    where shipping_plan_id='${req.body.shippingid}'`;
    client.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
});

//POSTで受取フラグをtrueにする
app.post('/receiveflag/', (req, res) => {
    const sql = `update public.shipping_plan set receiving_flag = true where id = '${req.body.shippingid}'`;
    client.query(sql, (err, result, fields) => {
        if (err) throw err;

        const update_sql = `update  public.achievement_data set receiving_achievement = '${req.body.delivery}' where shipping_plan_id = '${req.body.shippingid}'`;
        client.query(update_sql, (err, result, fields) => {
            if (err) throw err;
            res.json(result);
        });
    });
});

//POSTで配達完了フラグを更新する
app.post('/shipflag/', (req, res) => {
    const sql = `update public.shipping_plan set ship_flag = true where id = '${req.body.shippingid}'`;
    client.query(sql, (err, result, fields) => {
        if (err) throw err;

        const update_sql = `update public.achievement_data set delivery_achievement='${req.body.delivery}' where shipping_plan_id = '${req.body.shippingid}'`;
        client.query(update_sql, (err, result, fields) => {
            if (err) throw err;
            res.json(result);
        });
    });
});

//POSTで配達完了フラグを更新する(取り消し)
app.post('/ActualCancel/', (req, res) => {
    const sql = `update public.shipping_plan set ship_flag = false, receiving_flag = false, departure_flag = false  where  id = '${req.body.shippingid}'`;
    client.query(sql, (err, result, fields) => {
        if (err) throw err;

        const delete_sql = `DELETE FROM public.achievement_data where shipping_plan_id='${req.body.shippingid}'`;
        client.query(delete_sql, (err, result, fields) => {
            if (err) throw err;
            res.json(result);
        });
    });
});

// POSTで配達出発時間記録
app.post('/StartTimeRec/', (req, res) => {
    const sql = `Insert into public.achievement_data (shipping_plan_id, departure_time, ship_num, block_name, start_point, central_point, end_point, wagon_num, driving_person) VALUES ('${req.body.shippingid}', '${req.body.departureTime}', '${req.body.bansen}', '${req.body.block}', '${req.body.startpoint}', '${req.body.centralpoint}','${req.body.endpoint}', '${req.body.carnum}', '${req.body.username}')`;
    client.query(sql, (err, result, fields) => {
        if (err) throw err;

        const update_sql = `update public.shipping_plan set departure_flag = true where  id = '${req.body.shippingid}'`;
        client.query(update_sql, (err, result, fields) => {
            if (err) throw err;
            res.json(result);
        });
    });
});


//achievement_dataの出発時刻更新
// POSTで配達出発時間記録
app.post('/StartTimeUpdate/', (req, res) => {
    const sql = `update public.achievement_data set departure_time = '${req.body.departureTime}' where shipping_plan_id = '${req.body.shippingid}'`;
    client.query(sql, (err, result, fields) => {
        if (err) throw err;

        const update_sql = `update public.shipping_plan set departure_flag = true where  id = '${req.body.shippingid}'`;
        client.query(update_sql, (err, result, fields) => {
            if (err) throw err;
            res.json(result);
        });
    });
});

//DBの実績テーブルからshipping_plan_idが登録されているか取得する
app.get('/getachievementdata', (req, res) => {
    const sql = `select * from achievement_data where shipping_plan_id = '${req.query.shippingid}'`;
    client.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
})

//POSTで例外テーブルにインサートする
app.post('/addWorkregist/', (req, res) => {
    // const sql = `Insert into public.exception_work (ship_num,block_name,start_point,end_point,wagon_num,driving_person) VALUES('${req.body.bansen}','${req.body.block}','${req.body.startpoint}','${req.body.endpoint}','${req.body.carnum}','${req.body.employee}') `;
    const sql = `
    INSERT INTO public.exception_work (ship_num, block_name, start_point, end_point, wagon_num, driving_person, work_count, work_date)
    VALUES ('${req.body.bansen}', '${req.body.block}', '${req.body.startpoint}', '${req.body.endpoint}', '${req.body.carnum}', '${req.body.employee}', '${req.body.maxCount}', '${req.body.workDate}');
    `;
    client.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
});

//例外作業テーブル情報
app.get('/getexceptiondata', (req, res) => {
    const sql = `
        select * from public.exception_work 
        where ship_num = ${req.query.bansen} 
          and block_name = ${req.query.blockname}
          and start_point = ${req.query.startpoint}
          and end_point = ${req.query.endpoint}
          and work_count = ${req.query.workcount}
          and driving_person = ${req.query.drivingperson}
          and work_date = ${req.query.workdate}
        `;
    client.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
})

//例外テーブルのwork_countの最大値取得
app.get('/getmaxcount', (req, res) => {
    const sql = `
        select max(CAST(work_count As decimal)) as max_count from exception_work 
        where ship_num = ${req.query.bansen} 
          and block_name = ${req.query.blockname}
          and start_point = ${req.query.startpoint}
          and end_point = ${req.query.endpoint}
          and driving_person = ${req.query.drivingperson}
          and work_date = ${req.query.workdate}
        `;
    client.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
})

//POSTで配達完了フラグを更新する
app.post('/addworkdepar', (req, res) => {
    const sql = `update public.exception_work set departure_time = '${req.body.UpdateTime}',departure_flag = true where ship_num = '${req.body.bansen}' and block_name = '${req.body.block}' and start_point = '${req.body.startpoint}' and end_point = '${req.body.endpoint}' and driving_person = '${req.body.drivingperson}' and work_count = '${req.body.workcount}' and work_date = '${req.body.workdate}'`;
    client.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
});

//POSTで配達完了フラグを更新する
app.post('/addworkreceive', (req, res) => {
    const sql = `update public.exception_work set receiving_achievement = '${req.body.UpdateTime}',receiving_flag = true where ship_num = '${req.body.bansen}' and block_name = '${req.body.block}' and start_point = '${req.body.startpoint}' and end_point = '${req.body.endpoint}' and driving_person = '${req.body.drivingperson}' and work_count = '${req.body.workcount}' and work_date = '${req.body.workdate}'`;
    client.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
});

//POSTで配達完了フラグを更新する
app.post('/addworkdelivery', (req, res) => {
    const sql = `update public.exception_work set delivery_achievement = '${req.body.UpdateTime}',ship_flag = true where ship_num = '${req.body.bansen}' and block_name = '${req.body.block}' and start_point = '${req.body.startpoint}' and end_point = '${req.body.endpoint}' and driving_person = '${req.body.drivingperson}' and work_count = '${req.body.workcount}' and work_date = '${req.body.workdate}'`;
    client.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
});

//POSTで配達完了フラグを更新する(取り消し)
app.post('/AddWorkDleate/', (req, res) => {

    const delete_sql = `DELETE FROM public.exception_work where ship_num = '${req.body.bansen}' and block_name = '${req.body.block}' and start_point = '${req.body.startpoint}' and end_point = '${req.body.endpoint}' and driving_person = '${req.body.drivingperson}' and work_count = '${req.body.workcount}' and work_date = '${req.body.workdate}'`;
    client.query(delete_sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });

});

//番船コンボボックス
app.get('/cmbshipnum', (req, res) => {
    const sql = `select * from public.ship_num order by id ASC `;
    client.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
})

//ブロックコンボボックス
app.get('/cmbblock', (req, res) => {
    const sql = `select * from public.block_name order by id ASC `;
    client.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
})

//開始地点コンボボックス
app.get('/startpoint', (req, res) => {
    const sql = `select * from public.start_point order by id ASC `;
    client.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
})

//終了地点コンボボックス
app.get('/endpoint', (req, res) => {
    const sql = `select * from public.end_point  order by id ASC`;
    client.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
})

//追加作業画面の回数コンボボックス
app.get('/workcount', (req, res) => {
    const sql = `
    select work_count 
    from public.exception_work 
    where ship_num = ${req.query.shipnum} 
      and block_name = ${req.query.blockname} 
      and start_point = ${req.query.startpoint} 
      and end_point = ${req.query.endpoint} 
      and driving_person = ${req.query.drivingperson} 
      and work_date = ${req.query.workdate} 
    order by work_count desc
  `;
    client.query(sql, (err, result, fields) => {
        if (err) throw err;
        res.json(result);
    });
})

// ポート3005でサーバを立てる
app.listen(port, () => console.log(`Listening on port ${port}`));
// server.listen(port, () => console.log('https Server'));

