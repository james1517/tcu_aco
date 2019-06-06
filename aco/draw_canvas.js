// 経路とアリの描画

// アリの数を取得する
if (sessionStorage.getItem("SavedAntNumber") == null) {
	var ANT_NUMBER = 10;//アリの数
}
else {
	ANT_NUMBER = Number(sessionStorage.getItem("SavedAntNumber"));
}
document.getElementById("AntNumberText").innerHTML = ANT_NUMBER;

// 経路の難易度を表すy軸におけるノードの数を取得する
if (sessionStorage.getItem("SavedNodeNumber") == null) {
	var NODE_NUMBER = 3; //ノードの数
}
else {
	NODE_NUMBER = Number(sessionStorage.getItem("SavedNodeNumber"));
}
document.getElementById("NodeNumberText").innerHTML = NODE_NUMBER;
const WIDTH = 800; //canvasのサイズ
const HEIGHT = 500; //canvasのサイズ
const AXIS = 4; //巣とエサ以外の軸の数
const START_NODE_X = 30; //アリの巣のx座標
const START_NODE_Y = Math.floor(Math.random() * HEIGHT); //アリの巣のy座標
const RANDOM_MIN_Y = 30; //y座標のランダム下限範囲
const RANDOM_MAX_Y = HEIGHT - 50 * NODE_NUMBER; //y座標のランダム上限範囲
const GOAL_Y = Math.floor(Math.random() * HEIGHT); //エサのy座標
const GOAL_X = WIDTH - 30; //エサのx座標
const PHERO_Q = 10; //アリの一回の分泌量
const EVA_R = 0.05;//フェロモンの蒸発率
const PHERO_R = 0.8;//ヒューリスティック情報を考慮する割合

// アリcanvasの宣言用
var a = ["ant0", "ant1", "ant2", "ant3", "ant4", "ant5", "ant6", "ant7", "ant8", "ant9",
"ant10", "ant11", "ant12", "ant13", "ant14", "ant15", "ant16", "ant17", "ant18", "ant19"];
var act = new Array();

// 経路canvasの宣言
var p = document.getElementById("path"); //IDの取得
var pct = p.getContext("2d"); //二軸（x,y）指定

// 巣の画像の設定
var start_img = new Image();
start_img.src = "img/antman.png";

// エサの画像の設定
var goal_img = new Image();
goal_img.src = "img/goal.png";

// アリの画像の設定
var img = new Array();
for (var i = 0; i < ANT_NUMBER; i++) {
	let rd = Math.floor(Math.random() * 4);
    img[i] = new Image();
    img[i].src = "img/ant" + rd + ".png";
}

//アリの情報を初期化
var ant = [];
for (let i = 0; i < 20; i++) {
	ant.push(
		{
			x: START_NODE_X, //アリの現在座標
	        y: START_NODE_Y, //アリの現在座標
			path: [], //アリがサイクルで通ったエッジのリスト
            total_dis: 0 //アリが通った経路の長さ
		}
	);
}

//各エッジの座標の保持,フェロモン情報
var edge = [];

// アリ毎の現在位置
var now_edge_num = [ANT_NUMBER];

//x軸における分岐軸の空間
var bifurcation = Math.floor((WIDTH - 2 * 30) / (AXIS + 1));

// マイン軸のx座標に計算用
var route_x = bifurcation;

//座標の決定
var route_y = new Array(AXIS);
for (let y = 0; y < AXIS; y++) {
    route_y[y] = new Array(NODE_NUMBER).fill(0);

    //ランダムで座標の決定
    route_y[y][0] = Math.floor(Math.random() * (RANDOM_MAX_Y - RANDOM_MIN_Y)) + RANDOM_MIN_Y;
    for (let z = 1; z < NODE_NUMBER; z++) {
        route_y[y][z] = Math.floor(Math.random() * (RANDOM_MAX_Y - route_y[y][z - 1]) + 60) + route_y[y][z - 1];
    }
}



//経路の描画
function drawMap() {
    // 巣の描画
    start_img.onload = function() {
    	pct.drawImage(start_img, 0, 0, 300, 600, START_NODE_X - 40, START_NODE_Y - 50, 60, 100);
    }

    // エサの描画
    goal_img.onload = function() {
    	pct.drawImage(goal_img, 0, 0, 450, 450, GOAL_X - 30, GOAL_Y - 30, 60, 60);
    }

	//開始地点からの経路の描画
	for (let z = 0; z < NODE_NUMBER; z++) {
	    let length = 0; //経路の長さ
	    drawPath(START_NODE_X, START_NODE_Y, route_x, route_y[0][z]);

	    length = calculatePath(START_NODE_X, START_NODE_Y, route_x, route_y[0][z]);

	    //エッジの保持
	    edge.push({
	        last_pos_x: START_NODE_X, //右側の点の座標
	        last_pos_y: START_NODE_Y, //右側の点の座標
	        x: route_x, //左側の点の座標
	        y: route_y[0][z], //左側の点の座標
	        length: length, //エッジの長さ
	        pheromone: 1 //エッジのフェロモン量
	    });
	}

    // 真中の軸の描画
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
	    }
	    route_x += bifurcation;
	}

	//ゴールへの最終軸の描画
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
}
drawMap();


// 巣からエッジ選択により移動
for (var i = 0; i < ANT_NUMBER; i++) {
    now_edge_num[i] = StartChoicePath(i);
	ant[i].path.push(now_edge_num[i]);
}


// アリの動きを描画
function drawAnt() {
	for (let j = 0; j < ANT_NUMBER; j++) {
		act[j] = document.getElementById(a[j]).getContext("2d");

        // canvasをクリアする
		act[j].clearRect(0, 0, 800, 500);

	    for (let i = 0; i < ANT_NUMBER; i++) {
            // 各アリの現在地で描画する
	        act[j].drawImage(img[i], 0, 0, 400, 300, ant[i].x - 25, ant[i].y - 15, 50, 30);

            // エッジの中にいるとき、エッジに沿って移動する
	        if (ant[i].x < edge[now_edge_num[i]].x) {
	            moveAnt(i, now_edge_num[i]);
	        }
            // エサに着いたら、サイクルの終了まで待つ
	        else if (ant[i].x >= GOAL_X) {

	        }
            // それ以外、分岐点にいるとき、エッジ選択を行って移動する
	        else {
	            now_edge_num[i] = choicePath(now_edge_num[i]);
				ant[i].path.push(now_edge_num[i]);
	        }
	    }

        // 全てのアリがエサに着いたかどうかをチェックする
		let end_of_circle = true;
		for (let i = 0; i < ANT_NUMBER; i++) {
			if (ant[i].x < GOAL_X) {
				end_of_circle = false;
				break;
			}
		}

        // 全てのアリがエサに着いたらサイクルを終了し、アリが巣に戻るため、初期化する
	    if (end_of_circle == true) {
			renewpheromone();
	        //初期化
	        for (let i = 0; i < ANT_NUMBER; i++) {
	            ant[i].x = START_NODE_X;
	            ant[i].y = START_NODE_Y;
	            ant[i].total_dis = 0;
				ant[i].path = [];

                // 次のサイクルの最初からエッジ選択を行っておく
				now_edge_num[i] = StartChoicePath(i);
				ant[i].path.push(now_edge_num[i]);
	        }
	    }
	}

}

// 時間とともに描画する
setInterval(drawAnt, ANT_NUMBER * 5);



// アリのエッジでの移動
function moveAnt(ant_num, edge_num) {
	ant[ant_num].x += (edge[edge_num].x - edge[edge_num].last_pos_x) / edge[edge_num].length;
	ant[ant_num].y += (edge[edge_num].y - edge[edge_num].last_pos_y) / edge[edge_num].length;

}

//エッジの描画
function drawPath(x1, y1, x2, y2) {

    pct.moveTo(x1, y1); //始点設定
    pct.lineTo(x2, y2); //終点設定
	pct.lineWidth = 3;
	pct.strokeStyle = "blue";
    pct.stroke(); //経路の形の指定，描画
}

//エッジの長さを計算
function calculatePath(x1, y1, x2, y2) {
    let length;

    length = Math.floor(Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2)));

    return length;
}

// 二つのエッジが接しているかのチェック
function nextEdge(edge1, edge2) {
	if (edge1.x == edge2.last_pos_x && edge1.y == edge2.last_pos_y) {
		return true;
	}
	else {
		return false;
	}
}

//ルーレット選択
function rouletteChoice(choice_edge) {
	let denom = 0;
    //適応度に変換
    for (let i = 0; i < choice_edge.length; i++) {
        //choice_edge[i].pheromone = 1 / choice_edge[i].pheromone;
        denom += choice_edge[i].pheromone;
    }
    //ソート
    for (let i = 0; i < choice_edge.length; i++) {
        for (let j = choice_edge.length - 1; j > i; j--) {
            if (choice_edge[j].pheromone > choice_edge[j - 1].pheromone) {
                let swap = choice_edge[j].pheromone;
                choice_edge[j].pheromone = choice_edge[j - 1].pheromone;
                choice_edge[j - 1].pheromone = swap;
            }
        }
    }
    //ルーレット選択
    let rank;
    let prob;
    let r = Math.random();
    if ((denom != 0) && (r <= PHERO_R)) {
        for (rank = 1; rank < choice_edge.length; rank++) {
            prob = choice_edge[rank - 1].pheromone / denom;
            if (r <= prob) {
                break;
            }
            r -= prob;
        }
    }else{
        rank = Math.floor(Math.random() * choice_edge.length) + 1;
    }
    return choice_edge[rank - 1].edge_num;
}

// 開始点から出発する時のエッジ選択
function StartChoicePath(ant_num) {
    let path_num; //選択する経路の添え字
    let choice_edge = []; //選択できる経路の保持

    //蟻が通れる経路を探す
    for (let i = 0; i < edge.length; i++) {
       //x座標，y座標が合致するエッジを探す
       if (nextEdge(ant[ant_num], edge[i]) == true) {
           choice_edge.push({
               pheromone: edge[i].pheromone,
               edge_num: i
           });
       }
   }

    //複数ある場合
    if (choice_edge.length > 1) {
        path_num = rouletteChoice(choice_edge);
    } else {
        path_num = choice_edge[0].edge_num;
    }

    return path_num;
}

//経路選択
function choicePath(edge_num) {
    let path_num //選択する経路の添え字
    let choice_edge = []; //選択できる経路の保持

    //蟻が通れる経路を探す
    for (let i = edge_num + 1; i < edge.length; i++) {
       //x座標，y座標が合致するエッジを探す
       if (nextEdge(edge[edge_num], edge[i]) == true) {
           choice_edge.push({
               pheromone: edge[i].pheromone,
               edge_num: i
           });
       }
   }

    //複数ある場合
    if (choice_edge.length > 1) {
        path_num = rouletteChoice(choice_edge);
    } else {
        path_num = choice_edge[0].edge_num;
    }

    return path_num;
}

//アリのフェロモンの分泌
function putpheromone(ant_num) {
    // アリが通った経路の長さを計算
	for(let i = 0; i < ant[ant_num].path.length; i++){
        ant[ant_num].total_dis += calculatePath(edge[ant[ant_num].path[i]].last_pos_x ,edge[ant[ant_num].path[i]].last_pos_y ,edge[ant[ant_num].path[i]].x ,edge[ant[ant_num].path[i]].y);
    }

    let p = PHERO_Q / ant[ant_num].total_dis;

    for(let z = 0; z < ant[ant_num].path.length; z++){
        edge[ant[ant_num].path[z]].pheromone += p * edge[ant[ant_num].path[z]].length;
    }
}

//エッジのフェロモン量の更新
function renewpheromone(){
    //フェロモン蒸発
    for(let i = 0; i < edge.length; i++){
        edge[i].pheromone *= 1 - EVA_R;
    }

    //フェロモン加算
    for(let j = 0; j < ANT_NUMBER; j++){
        putpheromone(j);
    }
}

//巣からエサまでの一番フェロモンの多い経路の検出
// function drawMainPath(x1, y1, x2, y2) {
//
//     pct.moveTo(x1, y1); //始点設定
//     pct.lineTo(x2, y2); //終点設定
// 	   pct.strokeStyle = "red";
//     pct.stroke(); //経路の形の指定，描画
// }

// var MainPath = [];
// function ShowMainPath() {
// 	let CheckNode = {
// 		x: START_NODE_X,
// 		y: START_NODE_Y
// 	};
//
// 	MainPath = [];
//
// 	while (CheckNode.x < GOAL_X) {
// 		let CheckPheromoneEdge = [];
//
// 		for (let i = 0; i < edge.length; i++) {
// 			if (nextEdge(CheckNode, edge[i]) == true) {
// 				CheckPheromoneEdge.push(edge[i]);
// 			}
// 		}
//
// 		let max = 0;
// 		let StrongEdge;
// 		for (let i = 0; i < CheckPheromoneEdge.length; i++) {
// 			if (CheckPheromoneEdge[i].pheromone > max) {
// 				max = CheckPheromoneEdge[i].pheromone;
// 				StrongEdge = CheckPheromoneEdge[i];
// 			}
// 		}
// 		drawMainPath(StrongEdge.last_pos_x, StrongEdge.last_pos_y, StrongEdge.x, StrongEdge.y);
// 		MainPath.push(StrongEdge);
//
// 		CheckNode.x = StrongEdge.x;
// 		CheckNode.y = StrongEdge.y;
// 	}
// }
