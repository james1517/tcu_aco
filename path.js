const NODE_NUMBER = 3; //ノードの数
const AXIS = 4; //軸の数
const START_NODE_X = 50; //アリの巣のx座標
const START_NODE_Y = Math.floor(Math.random() * 1000) + 100; //アリの巣のy座標
const RANDOM_MIN_Y = 80; //y座標のランダム下限範囲
const RANDOM_MAX_Y = 250; //y座標のランダム上限範囲
const GOAL_Y = Math.floor(Math.random() * 1000); //エサのy座標

///////////////////////////////////////////////////////////////////////////////////////////////
//アリの情報
var ant = [
    {
        last_pos_x: START_NODE_X,
        last_pos_y: START_NODE_Y,
        x: 10,
        y: 10
	}
];

var node = [
    {
        //座標，長さ，フェロモン量
        x: START_NODE_X,
        y: START_NODE_Y,
        length: 50,
        pheromon: 1
	}
];

//各エッジの座標の保持,フェロモン情報
let edge = [];
//////////////////////////////////////////////////////////////////////////////////////////////////

//座標の決定
route_y = new Array(AXIS);
for (let y = 0; y < AXIS; y++) {
    route_y[y] = new Array(NODE_NUMBER).fill(0);

    //ランダムで座標の決定
    for (let z = 0; z < NODE_NUMBER; z++) {
        if (z == 0) {
            route_y[y][z] = Math.floor(Math.random() * (RANDOM_MAX_Y - RANDOM_MIN_Y)) + RANDOM_MIN_Y;
            
            //間隔を空けるためのランダムリセット
            if (route_y[y][z] - START_NODE_Y < 50) {
                route_y[y][z] += 100;
            }
        } else {
            route_y[y][z] = Math.floor(Math.random() * (RANDOM_MAX_Y - RANDOM_MIN_Y)) + route_y[y][z - 1] + 50;
            
            //間隔を空けるためのランダムリセット
            if (route_y[y][z] - route_y[y][z - 1] < 150) {
                z--;
            }
        }

        //座標デバッグ
        console.log("軸：" + y + "　,上から" + z);
        console.log(route_y[y][z]);
    }
}

//経路の長さを計算
function calculationPath(x1, y1, x2, y2) {
    let length;

    length = Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));

    return length;
}

//経路の描画
function drawPath(x1, y1, x2, y2) {
    var p = document.getElementById("path"); //IDの取得
    var pct = p.getContext("2d"); //二軸（x,y）指定

    pct.moveTo(x1, y1); //始点設定
    pct.lineTo(x2, y2); //終点設定
    pct.stroke(); //経路の形の指定，描画
}

let bifurcation = 200; //分岐の軸のx座標
let length = 0; //経路の長さ

//開始地点からの経路の描画
for (let z = 0; z < NODE_NUMBER; z++) {
    drawPath(START_NODE_X, START_NODE_Y, bifurcation, route_y[0][z]);

    length = calculationPath(START_NODE_X, START_NODE_Y, bifurcation, route_y[0][z]);
    console.log("bif: "+bifurcation);
    console.log("y: "+route_y[0][z]);
    //エッジの保持
    edge.push({
        last_pos_x: START_NODE_X,
        last_pos_y: START_NODE_Y,
        x: bifurcation,
        y: route_y[0][z],
        length: length,
        pheromon: 1
    });
}

let random_point = 0; //ランダムの判断値

//軸は3つ
//経路の描画
for (let y = 0; y < AXIS - 1; y++) { //軸の分だけ回す
    random_point = Math.floor(Math.random() * NODE_NUMBER);
    for (let z = 0; z < NODE_NUMBER; z++) { //座標の分だけ回す        
        drawPath(bifurcation, route_y[y][z], bifurcation + 200, route_y[y + 1][z]);

        length = calculationPath(bifurcation, route_y[y][z], bifurcation + 200, route_y[y + 1][z]);
        //エッジの保持
        edge.push({
            last_pos_x: bifurcation,
            last_pos_y: route_y[y][z],
            x: bifurcation + 200,
            y: route_y[y + 1][z],
            length: length,
            pheromon: 1
        });

        //分岐の生成
        if (random_point == z) {
            if (random_point == 0) {
                drawPath(bifurcation, route_y[y][z], bifurcation + 200, route_y[y + 1][z + 1]);

                length = calculationPath(bifurcation, route_y[y][z], bifurcation + 200, route_y[y + 1][z + 1]);
                //エッジの保持
                edge.push({
                    last_pos_x: bifurcation,
                    last_pos_y: route_y[y][z],
                    x: bifurcation + 200,
                    y: route_y[y + 1][z + 1],
                    length: length,
                    pheromon: 1
                });

            } else {
                drawPath(bifurcation, route_y[y][z], bifurcation + 200, route_y[y + 1][z - 1]);

                length = calculationPath(bifurcation, route_y[y][z], bifurcation + 200, route_y[y + 1][z - 1]);
                //エッジの保持
                edge.push({
                    last_pos_x: bifurcation,
                    last_pos_y: route_y[y][z],
                    x: bifurcation + 200,
                    y: route_y[y + 1][z - 1],
                    length: length,
                    pheromon: 1
                });
            }
        }
    }
    bifurcation += 200;
}

//経路からゴールへの描画
for (let z = 0; z < NODE_NUMBER; z++) {
    drawPath(bifurcation, route_y[AXIS - 1][z], bifurcation + 200, GOAL_Y);
    
    length = calculationPath(bifurcation, route_y[AXIS - 1][z], bifurcation + 200, GOAL_Y);
    //エッジの保持
    edge.push({
        last_pos_x: bifurcation,
        last_pos_y: route_y[AXIS - 1][z],
        x: bifurcation + 200,
        y: GOAL_Y,
        length: length,
        pheromon: 1
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////



function moveAnt(ant_num, node_num) {
    edge[ant_num].x += (edge[node_num].x - edge[ant_num].last_pos_x);
    edge[ant_num].y += (edge[node_num].y - edge[ant_num].last_pos_y);
    //ant[ant_num].x += (ant[node_num].x - edge[ant_num].last_pos_x) / edge[node_num].length;
    //ant[ant_num].y += (ant[node_num].y - edge[ant_num].last_pos_y) / edge[node_num].length;
    //console.log("x: "+edge[ant_num].x);
    //console.log("y: "+edge[ant_num].y);
}

function drawAnt() {
    var a = document.getElementById("ant");
    var act = a.getContext("2d");

    act.clearRect(0, 0, 1200, 1200);
    act.beginPath();
    act.arc(edge[0].x, edge[0].y, 10, 0, 2 * Math.PI);
    act.stroke();
    act.closePath();

    moveAnt(0, 0);
    //ant[0].x += (300 - 10) / 100;
    //ant[0].y += (100 - 10) / 100;

}

setInterval(drawAnt, 10);
