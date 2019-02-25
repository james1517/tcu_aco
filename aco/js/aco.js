'use strict'

/////////////////定数の定義//////////////////////////////////////////////////////

const REPEAT_NUM = 1000; //繰り返し回数
const ANT_NUM = 100; //アリの数
const PHERO_Q = 10; //1回の巡回で分泌するフェロモン値
const EVA_R = 0.05; //フェロモン蒸発率
const PHERO_R = 0.95; //フェロモンに基づいて経路を選択する確率
const PHERO_L = 1; //フェロモンを考慮する度合い
const HFU_L = 1; //ヒューリスティック情報を考慮する度合い
const NODE_NUMBER = 8; //ノードの数

//０～１の実数乱数
const RAND_01 = Math.random();

//////////////////////////////////////////////////////////////////////////////////


///////////////変数の定義//////////////////

let count;
//let node_length = [];//エッジの長さ

let nume = []; //経路選択確率の分子

//let node_num = Math.pow(NODE_NUMBER, 2); //ノード数
let distance = []; //ノード間距離
let pheromone = []; //エッジのフェロモン量

let route; //経路
let total_dis; //総移動距離
let candidate; //未訪問ノード

//console.log(RAND_01);


///////////////配列の初期化/////////////////

//配列の数はノード数で決定
candidate = new Array(NODE_NUMBER);
total_dis = new Array(ANT_NUM);

nume = new Array(NODE_NUMBER);
for (let y = 0; y < NODE_NUMBER; y++) {
    nume[y] = new Array(NODE_NUMBER).fill(0);
}

pheromone = new Array(NODE_NUMBER);
for (let y = 0; y < NODE_NUMBER; y++) {
    pheromone[y] = new Array(8).fill(0);
}

route = new Array(ANT_NUM);
for (let y = 0; y < ANT_NUM; y++) {
    route[y] = new Array(NODE_NUMBER).fill(0);
}

distance = new Array(NODE_NUMBER);
for (let y = 0; y < NODE_NUMBER; y++) {
    distance[y] = new Array(NODE_NUMBER).fill(3);
}

////////////////////// データの読み込み ///////////////////////////////

//CSVファイルを読み込む関数getCSV()の定義
function getCSV() {
    let req = new XMLHttpRequest(); // HTTPでファイルを読み込むためのXMLHttpRrequestオブジェクトを生成
    req.open("get", "./../sample.csv", true); // アクセスするファイルを指定
    req.send(null); // HTTPリクエストの発行

    // レスポンスが返ってきたらconvertCSVtoArray()を呼ぶ
    req.onload = function () {
        convertCSVtoArray(req.responseText); // 渡されるのは読み込んだCSVデータ
    }
}

// 読み込んだCSVデータを二次元配列に変換する関数convertCSVtoArray()の定義
function convertCSVtoArray(str) { // 読み込んだCSVデータが文字列として渡される

    let tmp = str.split("\n"); // 改行を区切り文字として行を要素とした配列を生成

    // 各行ごとにカンマで区切った文字列を要素とした二次元配列を生成
    for (let i = 0; i < tmp.length - 1; ++i) {
        distance[i] = tmp[i].split(',');

    }
}

/////////////////////// 経路の選択 /////////////////////////////////////

function selectRoute() {
    let i;
    let j;

    //確率の分子を算出する
    for (i = 0; i < NODE_NUMBER; i++) {
        for (j = 1; j < i; j++) {
            nume[i][j] = Math.pow(pheromone[j][i], PHERO_L) * Math.pow((1 / distance[i][j]), HFU_L);
            console.log(i+","+j+": "+nume[i][j]);
        }
        for (j = i + 1; j < NODE_NUMBER; j++) {
            nume[i][j] = Math.pow(pheromone[i][j], PHERO_L) * Math.pow((1 / distance[i][j]), HFU_L);
            console.log(i+","+j+": "+nume[i][j]);
        }
    }

    for (let num = 0; num < ANT_NUM; num++) {
        antSelectRoute(num);
    }

}

function antSelectRoute(ant) {
    let i, j, next, next2, denom, r, prob;
console.log(ant);
    //未訪問ノードの初期化
    for (i = 0; i < NODE_NUMBER; i++) {
        candidate[i] = 1; //未訪問ノードは１，訪問ノードは０
    }

    //経路を選択する
    console.log(ant);
    total_dis[ant] = 0.0;
    console.log(total_dis[ant]);
    for (i = 0; i < NODE_NUMBER; i++) {
        //確率の分母の算出
        denom = 0.0;
        for (j = 1; j < NODE_NUMBER; j++) {
            if (candidate[j] === 1) {
                console.log(ant);
                console.log(i+","+j);
                denom += nume[route[ant][i]][j];
                //console.log(i+","+j+", denom: "+denom);
            }
        }

        //次のノードの選択
        next = -1;
        if ((denom !== 0.0) && (RAND_01 <= PHERO_R)) {
            //フェロモン量に基づいて選択
            r = RAND_01;
            for (next = 1; next < NODE_NUMBER; next++) {
                if (candidate[next] === 1) {
                    prob = nume[route[ant][i]][next] / denom;
                    if (r <= prob) {
                        break;
                    }
                    r = -prob;
                }
            }
            if (next === NODE_NUMBER) {
                next = -1;
            }
        }
        if (next == -1) {
            //ランダムに選択
            next2 = Math.floor(Math.random()) % (NODE_NUMBER - i - 1);
            for (next = 1; next < NODE_NUMBER; next++) {
                if (candidate[next] === 1) {
                    if (next2 === 0) {
                        break;
                    } else {
                        next2--;
                    }
                }
            }
        }
        route[ant][i + 1] = next;
        candidate[next] = 0;
        total_dis[ant] += distance[route[ant][i]][next];
    }

    //最後の１ノードを探索
    for (next = 1; next < NODE_NUMBER; next++) {
        if (candidate[next] == 1) {
            break;
        }
    }
    route[ant][NODE_NUMBER - 1] = next;
    total_dis[ant] += distance[route[ant][NODE_NUMBER - 2]][next];

    //出発地点への距離を加算
    total_dis[ant] += distance[next][0];
}

/////////////////////////フェロモン量の更新///////////////////////////////

function renewPheromone() {
    let i, j;

    //蒸発
    for (i = 0; i < NODE_NUMBER; i++) {
        for (j = i + 1; j < NODE_NUMBER; j++) {
            pheromone[i][j] *= 1 - EVA_R;
        }
    }

    //アリによる追加分の加算
    for (i = 0; i < ANT_NUM; i++) {
        putPheromone(i);
    }
}

//フェロモンの分泌
function putPheromone(ant) {
    let i, p;

    p = PHERO_Q / total_dis[ant];
    for (i = 0; i < NODE_NUMBER; i++) {
        if (route[ant][i] < route[ant][i + 1]) {
            pheromone[route[ant][i]][route[ant][i + 1]] += p;
        } else {
            pheromone[route[ant][i + 1]][route[ant][i]] += p;
        }
    }
    pheromone[0][route[ant][NODE_NUMBER - 1]] += p;
}

/////////////////////////フェロモン量の表示////////////////////////////

function printPheromone() {
    let i, j;
    for (i = 0; i < NODE_NUMBER; i++) {
        for (j = 0; j < NODE_NUMBER; j++) {
            console.log(pheromone[i][j]);
        }
    }
}

///////////////////////////メイン関数/////////////////////////////////////


//getCSV(); //エッジの読み込み

/*for (let k = 0; k < NODE_NUMBER; k++) {
    for (let h = 0; h < NODE_NUMBER; h++) {
        parseFloat(distance[k][h].replace('"', ''))
    }
}*/


console.log(distance[3][1]);

for (count = 1; count <= REPEAT_NUM; count++) {
    selectRoute(); //経路を選択する
    renewPheromone(); //フェロモン量を更新する
    printPheromone(); //フェロモン量を表示する
    console.log(count);
}

console.log("end");
