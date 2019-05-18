const NODE_NUMBER = 4; //ノードの数//一つの軸で
const START_NODE_X = 50;//アリの巣のx座標
const START_NODE_Y = 50;//アリの巣のy座標
const RANDOM_MIN_Y = 1;//y座標のランダム下限範囲
const RANDOM_MAX_Y = 300;//y座標のランダム上限範囲
const GOAL_Y = 300;//エサのy座標

//座標の決定
route_y = new Array(NODE_NUMBER);
for (let y = 0; y < NODE_NUMBER; y++) {
    route_y[y] = new Array(NODE_NUMBER).fill(0);

    //ランダムで座標の決定
    for(let z = 0; z < NODE_NUMBER; z++){
        if(z == 0){
            route_y[y][z] = Math.floor(Math.random() * (RANDOM_MAX_Y + 1 - RANDOM_MIN_Y)) + RANDOM_MIN_Y;
        }else{
            route_y[y][z] = Math.floor(Math.random() * (RANDOM_MAX_Y + 1 - RANDOM_MIN_Y)) + route_y[y][z - 1];
        }
        //座標デバッグ
        console.log("軸："+y+"　,上から"+z);
        console.log(route_y[y][z]);
    }
}

//経路の描画
function drawPath(x1, y1, x2, y2) {
	var p = document.getElementById("path");//IDの取得
	var pct = p.getContext("2d");//二軸（x,y）指定

	pct.moveTo(x1, y1);//始点設定
	pct.lineTo(x2, y2);//終点設定
	pct.stroke();//経路の形の指定，描画
}

let bifurcation = 200;//分岐の軸のx座標

//開始地点からの経路の描画
for(let z = 0; z < NODE_NUMBER; z++){
    drawPath(START_NODE_X, START_NODE_Y, bifurcation, route_y[0][z]);
}

let random_point = 0;//ランダムの判断値

//軸は3つ
//経路の描画
for(let y = 0; y < NODE_NUMBER - 1; y++){//軸の分だけ回す
    random_point = Math.floor(Math.random() * NODE_NUMBER);
    for(let z = 0; z < NODE_NUMBER; z++){//座標の分だけ回す        
        drawPath(bifurcation, route_y[y][z], bifurcation + 200, route_y[y + 1][z]);
        
        if(random_point == z){
            if(random_point == 0){
               drawPath(bifurcation, route_y[y][z], bifurcation + 200, route_y[y + 1][z + 1]);
            }else{
               drawPath(bifurcation, route_y[y][z], bifurcation + 200, route_y[y + 1][z - 1]);
            }
        }
    }    
    bifurcation += 200;
}

//経路からゴールへの描画
for(let z = 0; z < NODE_NUMBER; z++){
    drawPath(bifurcation, route_y[NODE_NUMBER - 1][z], bifurcation + 200, GOAL_Y);
}

