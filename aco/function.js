const WIDTH = 800;
const HEIGHT = 500;
const NODE_NUMBER = 3; //ノードの数
const ANT_NUMBER = 10; //アリの数
const AXIS = 4; //軸の数
const START_NODE_X = 30; //アリの巣のx座標
const START_NODE_Y = Math.floor(Math.random() * HEIGHT); //アリの巣のy座標
const RANDOM_MIN_Y = 30; //y座標のランダム下限範囲
const RANDOM_MAX_Y = HEIGHT - 120; //y座標のランダム上限範囲
const GOAL_Y = Math.floor(Math.random() * HEIGHT); //エサのy座標
const GOAL_X = WIDTH - 30;
const RAND_01 = Math.random(); //ルーレット選択に使用する
const PHERO_Q = 10; //アリの一回の分泌量
const EVA_R = 0.05; //フェロモンの蒸発率


///////////////////////////////////////////////////////////////////////////////////////////////
//アリの情報
var ant = [
    {
        x: START_NODE_X,
        y: START_NODE_Y,
        path: [],
        total_dis: 0
	}
];

//各エッジの座標の保持,フェロモン情報
var edge = [];
//////////////////////////////////////////////////////////////////////////////////////////////////
var edge_num = 0;

//経路の長さを計算
function calculatePath(x1, y1, x2, y2) {
    let length;

    length = Math.floor(Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2)));

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

/////////////////////////////////////////////////////////////////////////////////////////////

function moveAnt(ant_num, edge_num) {
    ant[ant_num].x += (edge[edge_num].x - edge[edge_num].last_pos_x) / edge[edge_num].length;
    ant[ant_num].y += (edge[edge_num].y - edge[edge_num].last_pos_y) / edge[edge_num].length;
}

function drawAnt() {
    var a = document.getElementById("ant");
    var act = a.getContext("2d");

    act.clearRect(0, 0, 800, 500);
    act.beginPath();
    act.arc(ant[0].x, ant[0].y, 10, 0, 2 * Math.PI);
    act.stroke();
    act.closePath();

    if (ant[0].x == START_NODE_X) {
        edge_num = choicePath(edge_num);
    }

    if (ant[0].x < edge[edge_num].x) {
        console.log("これから " + edge_num + " に向かう");
        moveAnt(0, edge_num);
    } else {
        edge_num = choicePath(edge_num);
        console.log("選択されたedge_num: " + edge_num);
    }

    if (ant[0].x >= GOAL_X) {
        //初期化
        //for(let i = 0; i < ANT_NUMBER; i++){
        for (let i = 0; i < 1; i++) {
            ant[i].x = START_NODE_X;
            ant[i].y = START_NODE_Y;
            ant[i].total_dis = 0;

            let path_len = ant[i].path.length;

            for (let j = 0; j < path_len; j++) {
                ant[i].path[0].pop;
            }
        }
        for (let i = 0; i < edge.length; i++) {
            edge[i].pheromone = 1;
        }
        edge_num = 0;
    }

}

//////////////////////////////////////////////////////////////////////////////////////////////////////


function nextEdge(edge1, edge2) {
    if (edge1.x == edge2.last_pos_x && edge1.y == edge2.last_pos_y) {
        return true;
    } else {
        return false;
    }
}

//ルーレット選択
function rouletteChoice(choice_edge) {
    let denom = 0;

    //適応度に変換
    for (let i = 0; i < choice_edge.length; i++) {
        choice_edge[i].pheromone = 1 / choice_edge[i].pheromone;
        denom += choice_edge[i].pheromone;
    }

    //ソート
    for (let i = 0; i < choice_edge.length; i++) {
        for (let j = choice_edge.length - 1; j > i; j--) {
            if (choice_edge[j].pheromone < choice_edge[j - 1].pheromone) {
                let swap = choice_edge[j].pheromone;
                choice_edge[j].pheromone = choice_edge[j - 1].pheromone;
                choice_edge[j - 1].pheromone = swap;
            }
        }
    }

    //ルーレット選択
    let rank;
    let prob;
    let r = RAND_01;

    for (rank = 1; rank < choice_edge.length; rank++) {
        prob = choice_edge[rank - 1].pheromone / denom;
        if (r <= prob) {
            break;
        }
        r -= prob;
    }

    return choice_edge[rank - 1].edge_num;
}

//経路選択(最初)


//経路選択
function choicePath(edge_num) {
    let path_num //選択する経路の添え字
    let choice_edge = []; //選択できる経路の保持

    //蟻が通れる経路を探す
    for (let i = edge_num; i < edge.length; i++) {
        //x座標，y座標が合致するエッジを探す
        if (nextEdge(edge[edge_num], edge[i]) == true) {
            choice_edge.push({
                pheromone: edge[i].pheromone,
                edge_num: i
            });
        }
    }
    console.log("選択できる経路: ");
    console.log(choice_edge);

    //複数ある場合
    if (choice_edge.length > 1) {
        path_num = rouletteChoice(choice_edge);
    } else {
        path_num = choice_edge[0].edge_num;
    }

    return path_num;
}


//フェロモンの分泌
function putpheromone(ant_num) {
    let i;
    let p = PHERO_Q / ant[ant_num].total_dis;

    for (let z = 0; z < ant[ant_num].path.length; z++) {
        edge[ant[ant_num].path[z]].pheromone += p * edge[ant[ant_num].path[z]].length;
    }
}

//フェロモン量の更新
function renewpheromone() {
    //フェロモン蒸発
    for (let i = 0; i < edge.length; i++) {
        edge[i].pheromone *= 1 - EVA_R;
    }

    //フェロモン加算
    for (let j = 0; j < ANT_NUMBER; j++) {
        putpheromone(j);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////

//座標の決定
route_y = new Array(AXIS);
for (let y = 0; y < AXIS; y++) {
    route_y[y] = new Array(NODE_NUMBER).fill(0);

    route_y[y][0] = Math.floor(Math.random() * (RANDOM_MAX_Y - RANDOM_MIN_Y)) + RANDOM_MIN_Y;

    //ランダムで座標の決定
    for (let z = 1; z < NODE_NUMBER; z++) {
        route_y[y][z] = Math.floor(Math.random() * (RANDOM_MAX_Y - route_y[y][z - 1]) + 60) + route_y[y][z - 1];
    }
}

var bifurcation = Math.floor((WIDTH - 2 * 30) / (AXIS + 1)); //分岐の軸のx座標

var route_x = bifurcation;

//開始地点からの経路の描画
for (let z = 0; z < NODE_NUMBER; z++) {
    let length = 0; //経路の長さ
    drawPath(START_NODE_X, START_NODE_Y, route_x, route_y[0][z]);

    length = calculatePath(START_NODE_X, START_NODE_Y, route_x, route_y[0][z]);

    //エッジの保持
    edge.push({
        last_pos_x: START_NODE_X,
        last_pos_y: START_NODE_Y,
        x: route_x,
        y: route_y[0][z],
        length: length,
        pheromone: 1
    });
}

//軸は3つ
//経路の描画

for (let y = 0; y < AXIS - 1; y++) { //軸の分だけ回す
    //ランダムの判断値
    let random_point = Math.floor(Math.random() * NODE_NUMBER);
    for (let z = 0; z < NODE_NUMBER; z++) { //座標の分だけ回す
        drawPath(route_x, route_y[y][z], route_x + bifurcation, route_y[y + 1][z]);

        length = calculatePath(bifurcation, route_y[y][z], route_x + bifurcation, route_y[y + 1][z]);
        //エッジの保持
        edge.push({
            last_pos_x: route_x,
            last_pos_y: route_y[y][z],
            x: route_x + bifurcation,
            y: route_y[y + 1][z],
            length: length,
            pheromone: 1
        });

        //分岐の生成
        // if (random_point == z) {
        if (random_point != z) {
            drawPath(route_x, route_y[y][z], route_x + bifurcation, route_y[y + 1][random_point]);

            length = calculatePath(route_x, route_y[y][z], route_x + bifurcation, route_y[y + 1][random_point]);
            //エッジの保持
            edge.push({
                last_pos_x: route_x,
                last_pos_y: route_y[y][z],
                x: route_x + bifurcation,
                y: route_y[y + 1][random_point],
                length: length,
                pheromone: 1
            });

        }
        // }

    }
    route_x += bifurcation;
}


//経路からゴールへの描画
for (let z = 0; z < NODE_NUMBER; z++) {
    drawPath(route_x, route_y[AXIS - 1][z], GOAL_X, GOAL_Y);

    length = calculatePath(route_x, route_y[AXIS - 1][z], GOAL_X, GOAL_Y);
    //エッジの保持
    edge.push({
        last_pos_x: route_x,
        last_pos_y: route_y[AXIS - 1][z],
        x: GOAL_X,
        y: GOAL_Y,
        length: length,
        pheromone: 1
    });
}


edge_num = 0;
var timer;

timer = setInterval(drawAnt, 10);
