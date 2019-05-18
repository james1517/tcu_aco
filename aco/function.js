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

function drawAnt() {
	var a = document.getElementById("ant");
	var act = a.getContext("2d");

	act.clearRect(0, 0, 800, 500);
	act.beginPath();
	act.arc(ant[0].x, ant[0].y, 10, 0, 2 * Math.PI);
	act.stroke();
	act.closePath();

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
