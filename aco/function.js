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
  var a =document.querySelector('#ant');
	var act = a.getContext("2d");
	var actimg = new Image();
	actimg.src="antR.png";
	var actimg2 = new Image();
	actimg2.src ="antR2.png";

	act.clearRect(0, 0, 1000, 500);

	 // actimg2.onload = function(){
	 // 	act.drawImage(actimg2, ant[0].x-10, ant[0].y-10, 20, 20);
	 // }

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
