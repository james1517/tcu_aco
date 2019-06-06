// ボタンなどの機能の設定

// アリの数と経路の難易度による生成
function reset() {
	// サイクルにいるアリの描画を削除
	location.reload();
	for (let i = 0; i < ANT_NUMBER; i++) {
		act[i] = document.getElementById(a[i]).getContext("2d");
		act[i].clearRect(0, 0, 800, 500);
	}

	// 設定されたアリの数と経路の難易度をブラウザのストレージに格納する
	sessionStorage.setItem("SavedAntNumber", AntNumberSlider.value.toString());
	sessionStorage.setItem("SavedNodeNumber", NodeNumberSlider.value.toString());

	// アリの情報を再初期化する
	for (let i = 0; i < ANT_NUMBER; i++) {
		ant[i].x = START_NODE_X;
		ant[i].y = START_NODE_Y;
		ant[i].total_dis = 0;
		ant[i].path = [];

		// 巣からエッジ選択を行う
		now_edge_num[i] = StartChoicePath(i);
	}
}

// 背景を変える
var bg_num = 0;
function change_bg() {
	var change_bg = document.getElementById("path");
	change_bg.style.background = "url(./img/base"+ bg_num + ".png)";
	if (bg_num >= 3) {
		bg_num = 0;
	}
	else {
		bg_num++;
	}
}
