

function draw(){
  var canvas=document.querySelector('#canvas');
  var context = canvas.getContext('2d');

  var img =new Image();
  img.src="bkimg.jpg";
  img.onload = function(){
    context.drawImage(img, 0, 0, 1000, 500);
  }
}
