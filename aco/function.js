const WIDTH = 800;
const HEIGHT = 500;
const ANT_NUMBER = 5;
const NODE_NUMBER = 3; //ノードの数
const AXIS = 4; //軸の数
const START_NODE_X = 30; //アリの巣のx座標
const START_NODE_Y = Math.floor(Math.random() * HEIGHT); //アリの巣のy座標
const RANDOM_MIN_Y = 30; //y座標のランダム下限範囲
const RANDOM_MAX_Y = HEIGHT - 120; //y座標のランダム上限範囲
const GOAL_Y = Math.floor(Math.random() * HEIGHT); //エサのy座標
const GOAL_X = WIDTH - 30;

///////////////////////////////////////////////////////////////////////////////////////////////
//アリの情報
var ant = [];
for (let i = 0; i < ANT_NUMBER; i++) {
	ant.push(
		{
			x: START_NODE_X,
	        y: START_NODE_Y,
			path: []
		}
	);
}

//各エッジの座標の保持,フェロモン情報
var edge = [];
//////////////////////////////////////////////////////////////////////////////////////////////////

//座標の決定
route_y = new Array(AXIS);
for (let y = 0; y < AXIS; y++) {
    route_y[y] = new Array(NODE_NUMBER).fill(0);

	route_y[y][0] = Math.floor(Math.random() * (RANDOM_MAX_Y - RANDOM_MIN_Y)) + RANDOM_MIN_Y;

    //ランダムで座標の決定
    for (let z = 1; z < NODE_NUMBER; z++) {
        route_y[y][z] = Math.floor(Math.random() * (RANDOM_MAX_Y - route_y[y][z-1]) + 60) + route_y[y][z-1];
    }
}

//経路の長さを計算
function calculationPath(x1, y1, x2, y2) {
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

var bifurcation = Math.floor((WIDTH - 2 * 30) / (AXIS + 1)); //分岐の軸のx座標

var route_x = bifurcation + 30;

//開始地点からの経路の描画
for (let z = 0; z < NODE_NUMBER; z++) {
	let length = 0; //経路の長さ
    drawPath(START_NODE_X, START_NODE_Y, route_x, route_y[0][z]);

    length = calculationPath(START_NODE_X, START_NODE_Y, route_x, route_y[0][z]);

    //エッジの保持
    edge.push({
        last_pos_x: START_NODE_X,
        last_pos_y: START_NODE_Y,
        x: route_x,
        y: route_y[0][z],
        length: length,
        pheromon: 1
    });
}


//軸は3つ
//経路の描画

for (let y = 0; y < AXIS - 1; y++) { //軸の分だけ回す
	//ランダムの判断値
    let random_point = Math.floor(Math.random() * NODE_NUMBER);
    for (let z = 0; z < NODE_NUMBER; z++) { //座標の分だけ回す
        drawPath(route_x, route_y[y][z], route_x + bifurcation, route_y[y + 1][z]);

        length = calculationPath(bifurcation, route_y[y][z], route_x + bifurcation, route_y[y + 1][z]);
        //エッジの保持
        edge.push({
            last_pos_x: route_x,
            last_pos_y: route_y[y][z],
            x: route_x + bifurcation,
            y: route_y[y + 1][z],
            length: length,
            pheromon: 1
        });

        //分岐の生成
        if (random_point != z) {
            drawPath(route_x, route_y[y][z], route_x + bifurcation, route_y[y + 1][random_point]);

            length = calculationPath(route_x, route_y[y][z], route_x + bifurcation, route_y[y + 1][random_point]);
            //エッジの保持
            edge.push({
                last_pos_x: route_x,
                last_pos_y: route_y[y][z],
                x: route_x + bifurcation,
                y: route_y[y + 1][random_point],
                length: length,
                pheromon: 1
            });

        }
    }
	route_x += bifurcation;
}


//経路からゴールへの描画
for (let z = 0; z < NODE_NUMBER; z++) {
    drawPath(route_x, route_y[AXIS - 1][z], GOAL_X, GOAL_Y);

    length = calculationPath(route_x, route_y[AXIS - 1][z], GOAL_X, GOAL_Y);
    //エッジの保持
    edge.push({
        last_pos_x: route_x,
        last_pos_y: route_y[AXIS - 1][z],
        x: GOAL_X,
        y: GOAL_Y,
        length: length,
        pheromon: 1
    });
}

/////////////////////////////////////////////////////////////////////////////////////////////



function moveAnt(ant_num, edge_num) {
	ant[ant_num].x += (edge[edge_num].x - edge[edge_num].last_pos_x) / edge[edge_num].length;
	ant[ant_num].y += (edge[edge_num].y - edge[edge_num].last_pos_y) / edge[edge_num].length;

}

function nextEdge(edge1, edge2) {
	if (edge1.x == edge2.last_pos_x && edge1.y == edge2.last_pos_y) {
		return true;
	}
	else {
		return false;
	}
}

var edge_num = 0;
function drawAnt() {
    var a = document.getElementById("ant");
    var act = a.getContext("2d");


	act.clearRect(0, 0, 800, 500);
	act.beginPath();
	act.arc(ant[0].x, ant[0].y, 10, 0, 2 * Math.PI);
	act.stroke();
	act.closePath();


	if (ant[0].x < edge[edge_num].x && ant[0].y < edge[edge_num].y) {
		moveAnt(0, edge_num);
	}
	else {
		for (let i = edge_num + 1; i < edge.length; i++) {
			if (nextEdge(edge[edge_num], edge[i]) == true) {
				edge_num = i;
				break;
			}
		}
	}

}

setInterval(drawAnt, 10);
