var ant = [
	{
		last_pos_x: 10,
		last_pos_y: 10,
		x: 10,
		y: 10
	},
	{
		x: 10,
		y: 10
	},
];

var node = [
	{
		x: 300,
		y: 100,
		length: 50,
		pheromon: 1
	}
];

function selectEdge(pheromon1, pheromon2) {

}

function moveAnt(ant_num, node_num) {
	ant[ant_num].x += (node[node_num].x - ant[ant_num].last_pos_x) / node[node_num].length;
	ant[ant_num].y += (node[node_num].y - ant[ant_num].last_pos_y) / node[node_num].length;
}
//
// function chgimg(){
// 		var chgb = document.getElementById('#btn-chg');
// 		chgb.addEventListener('click', function(){
//
// 		}
// }




function drawAnt() {
	var actimg = new Image();
　var actimg_src = new Array("antR.png", "antR2.png");
	var btn_chg = document.getElementById('btn-chg');
	var btn_chg2 = document.getElementById('btn-chg2');
  var a =document.querySelector('#ant');
	var act = a.getContext("2d");

	actimg.src = actimg_src[ 0 ];

	// btn_chg.addEventListener('click',function(){
	// 	x=0;
	// });
	// btn_chg2.addEventListener('click',function(){
	// 	x=1;);

	act.clearRect(0, 0, 1000, 500);

	actimg.onload = function(){
		act.drawImage(actimg, ant[0].x, ant[0].y, 20, 20);
	}

	moveAnt(0, 0);
	// ant[0].x += (300 - 10) / 100;
	// ant[0].y += (100 - 10) / 100;
}

setInterval(drawAnt, 10);

function drawPath(x1, y1, x2, y2) {
	var p = document.getElementById("path");
	var pct = p.getContext("2d");

	pct.moveTo(x1, y1);
	pct.lineTo(x2, y2);
	pct.stroke();
}

drawPath(10, 10, 300, 100);
