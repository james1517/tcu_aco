
var canvas=document.querySelector('#bkimg');
var context = canvas.getContext('2d');
img=new Image();
img.onload=function(){
  context.drawImage(bgimg_sample.jpg,0,0);
}
