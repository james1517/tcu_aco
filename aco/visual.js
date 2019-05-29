//
// var canvas=document.querySelector('#bkimg');
// var context = canvas.getContext('2d');
// img=new Image();
// img.onload=function(){
//   context.drawImage(bgimg_sample.jpg,0,0);
// }

function draw(){
  var canvas=document.querySelector('#canvas');
  var context = canvas.getContext('2d');

  var img =new Image();
  img.src="bkimg.jpg";
  img.onload = function(){
    context.drawImage(img, 0, 0, 1000, 500);
  }
}
