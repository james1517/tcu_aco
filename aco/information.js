// アリと経路の情報

// アリの数を取得し、表示する
var AntNumberSlider = document.getElementById("AntNumber");

// Update the current slider value (each time you drag the slider handle)
AntNumberSlider.oninput = function() {
	document.getElementById("AntNumberText").innerHTML = this.value;
}
AntNumberSlider.value = ANT_NUMBER.toString();

// 経路の難易度を取得し、表示する
var NodeNumberSlider = document.getElementById("NodeNumber");
// Update the current slider value (each time you drag the slider handle)
NodeNumberSlider.oninput = function() {
	document.getElementById("NodeNumberText").innerHTML = this.value;
}
NodeNumberSlider.value = NODE_NUMBER.toString();
