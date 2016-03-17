

window.onload = function(){
	document.body.style.height = game.view().h + 'px';

	game.pageAnimation();
	game.musicBtn();
	game.createNum();
	game.event();
}


var game = {} //命名空间



/********************************************
/*
				通用工具
*/

game.id = function(id){
	return document.getElementById(id);
}

game.tag = function(obj,tagName){
	return obj.getElementsByTagName(tagName);
}

//获取可视区的宽高
game.view = function(){
	return {
		w : document.documentElement.clientWidth,
		h : document.documentElement.clientHeight
	}
}

game.addClass = function(obj,sClass){
	if(!obj.className.length){
		obj.className = sClass ;
	}else{
		var arr = obj.className.split(" ");
		arr.push(sClass);
		obj.className = arr.join(" ");
	}
}

game.removeClass = function(obj,sClass){
	if(!obj.className.length){
		return false ;
	}else{
		var arr = obj.className.split(" ");
		for(var i=0;i<arr.length;i++){
			if(arr[i] == sClass ){
				arr.splice(i,1);
			} 
		}
		obj.className = arr.join(" ");
	}
}

game.randomNum=function(min,max,num){
	var value = 0 ;
	var arr = [] ;
	for(var i=0;i<num;i++){
		value = Math.round(Math.random() * (max-min)) + min;
		arr.push(value);
	}
	return arr ;
}

game.findNum = function(str){
	return str.match(/\d/g);
}

/******************************************************/


//页面切换 
game.changePage=function(objIn,objOut,classIn,classOut,Class2In,objPrev,classPrev){
	var startY = 0;
	objOut.addEventListener('touchstart',function(ev){
		ev = ev.changedTouches[0];
		startY = ev.pageY;
	},false);

	objOut.addEventListener('touchend',function(ev){
		ev = ev.changedTouches[0];
		if(ev.pageY<startY){
			game.addClass(objOut,classOut);
			setTimeout(function(){
			game.removeClass(objOut,'pageShow');
			game.addClass(objIn,'pageShow');
			game.removeClass(objOut,classIn);
			setTimeout(function(){
					game.addClass(objIn,Class2In);
					game.removeClass(objOut,classOut);
				},30)
			},500)
		}else{
		  if(objPrev){
			game.addClass(objOut,classOut);
			setTimeout(function(){
			game.removeClass(objOut,'pageShow');
			game.addClass(objPrev,'pageShow');
			game.removeClass(objOut,classIn);
			setTimeout(function(){
					game.addClass(objPrev,classPrev);
					game.removeClass(objOut,classOut);
				},30)
			},500)
		}
	 }
	},false);
}

//控制每个页面动画出场
game.pageAnimation=function(){
	var oIndex = game.id('index');
	var oPage1 = game.id('page1');
	var oPage2 = game.id('page2');
	var oPage3 = game.id('page3');
	var oGamePage = game.id('gamePage');
	game.changePage(oPage1,oIndex,'indexIn','indexOut','page1In');
	game.changePage(oPage2,oPage1,'page1In','page1Out','page2In',oIndex,'IndexIn');
	game.changePage(oPage3,oPage2,'page2In','page2Out','page3In',oPage1,'page1In');
	game.changePage(oGamePage,oPage3,'page3In','page3Out','',oPage2,'page2In');
}

//音乐开关
game.musicBtn = function(){
	var oMusic =game.id('music');
		oMusic.addEventListener('touchend',function(){
			if(game.tag(oMusic,'audio')[0].paused){
				game.tag(oMusic,'audio')[0].play();
			}else{
				game.tag(oMusic,'audio')[0].pause();
			}
		},false);
}
//控制怪物运行的定时器
game.btn  = false ; 

game.start = function(){
	var oPop = document.getElementsByClassName("popup")[0];
	oPop.style.display = 'none';
	game.gamePage();
	game.btn = true ;
}

game.gamePage = function(){
	//设置canvas宽高
	game.id("game").width = game.view().w ;
	game.id("game").height = game.view().h ;

	game.id("score").innerHTML = 'X'+ game.score ;
    game.createMon();
    game.timeDown();
   // game.event();
     
  
  }

//怪物管理--4种怪物
 game.monster = {
		    mon1 : function(option){
    		var oImage = new Image();
    		oImage.src = "images/monster1.png";
    		oImage.onload = function(){
    			jc.start(option.canvas,true);
    			jc.image(oImage,-150,-150,109,113).id(option.id).level(2);
    			//level:让怪物图片盖住尸体图片
    		}
    	},
    	mon2 : function(option){
    		var oImage = new Image();
    		oImage.src = "images/monster2.png";
    		oImage.onload = function(){
    			jc.start(option.canvas,true);
    			jc.image(oImage,-150,-150,109,112).id(option.id).level(2);
    		}
    	},
    	mon3 : function(option){
    		var oImage = new Image();
    		oImage.src = "images/monster3.png";
    		oImage.onload = function(){
    			jc.start(option.canvas,true);
    			jc.image(oImage,-150,-150,107,129).id(option.id).level(2);
    		}
    	 },
    	mon4 : function(option){
    		var oImage = new Image();
    		oImage.src = "images/monster4.png";
    		oImage.onload = function(){
    			jc.start(option.canvas,true);
    			jc.image(oImage,-150,-150,126,109).id(option.id).level(2);
    		}
    	},
    	monDie:[[180,138],[146,84],[103,94],[92,107]],
    	monPos:{}
	}
  

//关数控制 1,2,2,3,3,3....
game.monNum = [] ;
game.passNum = 0 ; //当前关数
game.num = 1 ;
game.createNum = function(){
	for(var i=0;i<game.num;i++){
		game.monNum.push(game.num) ;
		}
		game.num++;
		if(game.num<20){
			game.createNum();
		}
}

//游戏时间 
game.time = 10 ;

//怪物存储
game.monM = {}

//获得的分数
game.score = 0;

//
game.deathTimer=null;

//创建怪物
game.createMon = function(){

	//怪物路径控制
	var minX = 50 ;
	var minY = 50 ;
	var maxX = game.view().w - 160 ;
	var maxY = game.view().h - 160 ;

	//每一次的变化量
	var iSpeed = 30 ;
	var roundT =10000;
	var changeNum = ((maxX - minX)+(maxY - minY))*2/(roundT/iSpeed);

	for(var i=0;i<game.monNum[game.passNum];i++){
		var mon = game.randomNum(1,4,1)[0];
		game.monster['mon'+mon]({id:'mon' + i + game.passNum,canvas:"game"});
	    game.monM['mon' + i + game.passNum] = new monMove({obj:'mon' + i + game.passNum})
	}

	function monMove(option){

		var firstPosArea = game.randomNum(1,4,1)[0];
		//怪物出现的初始位置
		var posX = 0 ;
		var posY = 0 ;

		var that = this;

		this.angle = 200 ; //角度
		this.R = game.randomNum(200,300,1)[0]; //怪物运动半径

		this.obj = option.obj;

		switch(firstPosArea){
		case 1: //第一区（上）
		posX = game.randomNum(minX,maxX,1)[0];
		posY = minY ;
		break ;
		case 2://第二区（左）
		posX = minX;
		posY = game.randomNum(minY,maxY,1)[0]; 
		break ;
		case 3://第三区（下）
		posX = game.randomNum(minX,maxX,1)[0];
		posY = maxY ;
		break ;
		case 4://第四区（右）
		posX = maxX ;
		posY = game.randomNum(minY,maxY,1)[0];
		break ;
	}
	   this.x = posX;
	   this.y = posY;

	that.timer=setInterval(function(){
		that.run();
	},iSpeed)

	}

	monMove.prototype.run = function(){  //怪物圆周转动

			this.angle += 5;
			if(!game.btn) {clearInterval(this.timer);}

		if(this.y==minY && this.x<=maxX && this.x>minX){
					this.x -= changeNum ;
					if(this.x<minX) {this.x = minX ;}
				}else if(this.x==minX && this.y<maxY && this.y>=minY){
					this.y += changeNum ;
					if(this.y>maxY) {this.y = maxY ;}
				}else if(this.y==maxY && this.x<maxX && this.x>=minX){
					this.x += changeNum ;
					if(this.x>maxX) {this.x = maxX ;}
				}else if(this.x==maxX && this.y<=maxY && this.y>minY){
					this.y -= changeNum ;
					if(this.y<minY) {this.y = minY ;}
				}

			this.X =  this.x-this.R * Math.cos(this.angle * Math.PI / 180);
			this.Y =  this.y-this.R * Math.sin(this.angle * Math.PI / 180);

			jc('#'+this.obj).animate({x:this.X,y:this.Y},1);

			game.monster.monPos[this.obj] = [];
			game.monster.monPos[this.obj][0] = this.X;
			game.monster.monPos[this.obj][1] = this.Y;


	}

	monMove.prototype.stop = function(){
		var that = this ;
		clearInterval(that.timer);
		var num = game.findNum(jc('#'+this.obj)._img.src).pop()
		//创建怪物尸体
		var oImage = new Image();
    		oImage.src = 'images/death'+num+'.png';
    		oImage.onload = function(){
    			jc.start('game',true);
    			jc.image(oImage,that.X,that.Y,game.monster.monDie[num-1][0],game.monster.monDie[num-1][1]).id("die"+that.obj).level(1);
    			//删除怪物
    			jc('#'+that.obj).del();
    			game.score ++ ;
    			game.id("score").innerHTML = 'X'+ game.score ;
    			//怪物尸体逐渐消失
    			that.changeO=function(){
    				var changeNum = 1000 / 30;
    				var i = 0
    				that.time=setInterval(function(){
    					i += 1/changeNum ;
    					jc('#die'+that.obj).opacity(1-i);
    					if(i>=1){
    						clearInterval(that.time);
    						jc('#die'+that.obj).del();
    					}
    				},30);
    			}();

    			game.monM[that.obj] = undefined;

    		if(game.btn){
 				//当所有怪物都消失时进入下一关
    			for(a in game.monM){
    				if(game.monM[a]){
    					return false;
    				}
    			}
    			game.passNum ++ ;
    			//进入下一关
    			setTimeout(function(){
    				game.nextPass();
    			},1000)
    		}
    			
	}	

}

}


//怪物点击死亡
game.monDie = function(ev){
	var touch = ev.changedTouches[0];
		var touchX = touch.pageX;
		var touchY = touch.pageY;
		for(a in game.monster.monPos){
			if(touchX>game.monster.monPos[a][0]&&touchX<game.monster.monPos[a][0]+110&&
				touchY>game.monster.monPos[a][1]&&touchY<game.monster.monPos[a][1]+110){
				game.monM[a].stop();
			}
		}	
}

game.event = function(){
	var oPop = document.getElementsByClassName("popup")[0];
	var oBtn = oPop.getElementsByClassName("btn")[0];
	document.removeEventListener("touchend",game.monDie);
	document.addEventListener("touchend",game.monDie);
	oBtn.removeEventListener("touchend",game.start);
	oBtn.addEventListener("touchend",game.start);
}

//进入下一关
game.nextPass = function(){
	game.monM = {}  ;
	game.monster.monPos = {} ;
	game.gamePage();
}

//倒计时
game.timeDown = function(){
	clearInterval(game.deathTimer);
	var oGamePage = game.id('gamePage');
	var oBlist = oGamePage.getElementsByClassName('b_list')[0];
	var aSpan = oBlist.getElementsByTagName('span');
	var oPop = document.getElementsByClassName("popup")[0];
	var count = 10 ;
	aSpan[0].innerHTML = count + '秒'
	game.deathTimer=setInterval(function(){
		count -- ;
		aSpan[0].innerHTML = count + '秒'
		if(count == 0) {
			clearInterval(game.deathTimer);
			game.passNum = 0 ;
			//让屏幕上的怪物消失
			try{
				for(a in game.monM){
				//jc('#'+(game.monM[a].obj)).del();
				game.monM[a].stop();
				}
			}catch(err){
				console.log(err)
			}
			
			game.score = 0 ; 
			game.monM = {}  ;
			game.monster.monPos = {} ; 
			oPop.style.display = 'block';
			game.btn = false ;
		}
	},1000)
}


/*

game.ui.musicPlay = function(obj){

	if(obj.paused){
		obj.play();
	}else{
		obj.pause();
	}

}

game.changePage=function(objIn,objOut,classIn,classOut,Class2In,objPrev,classPrev){
	var startY = 0;
	objOut.addEventListener('touchstart',function(ev){
		ev = ev.changedTouches[0];
		startY = ev.pageY;
	},false);

	objOut.addEventListener('touchend',function(ev){
		ev = ev.changedTouches[0];
		if(ev.pageY<startY){
			game.tools.addClass(objOut,classOut);
			setTimeout(function(){
			game.tools.removeClass(objOut,'pageShow');
			game.tools.addClass(objIn,'pageShow');
			game.tools.removeClass(objOut,classIn);
			setTimeout(function(){
					game.tools.addClass(objIn,Class2In);
					game.tools.removeClass(objOut,classOut);
				},30)
			},500)
		}else{
		  if(objPrev){
			game.tools.addClass(objOut,classOut);
			setTimeout(function(){
			game.tools.removeClass(objOut,'pageShow');
			game.tools.addClass(objPrev,'pageShow');
			game.tools.removeClass(objOut,classIn);
			setTimeout(function(){
					game.tools.addClass(objPrev,classPrev);
					game.tools.removeClass(objOut,classOut);
				},30)
			},500)
		}
	 }
	},false);
}
 
 game.apps = {} 
  
game.apps.musicCtr=function(){
	var oMusic =game.tools.id('music');
	oMusic.addEventListener('touchend',function(){
		game.ui.musicPlay(game.tools.tag(oMusic,'audio')[0]);
	},false);
}

game.pageAnimation=function(){
	var oIndex = game.tools.id('index');
	var oPage1 = game.tools.id('page1');
	var oPage2 = game.tools.id('page2');
	var oPage3 = game.tools.id('page3');
	var oGamePage = game.tools.id('gamePage');
	game.ui.pageAnimation(oPage1,oIndex,'indexIn','indexOut','page1In');
	game.ui.pageAnimation(oPage2,oPage1,'page1In','page1Out','page2In',oIndex,'IndexIn');
	game.ui.pageAnimation(oPage3,oPage2,'page2In','page2Out','page3In',oPage1,'page1In');
	game.ui.pageAnimation(oGamePage,oPage3,'page3In','page3Out','',oPage2,'page2In');
}




game.apps.getPos = function(minX,maxX,minY,maxY){ //获得怪物出现位置
	
	var num = game.tools.randomNum(1,4,1)[0];
	var posX = 0 ;
	var posY = 0 ;
	switch(num){
		case 1: //第一区（上）
		posX = game.tools.randomNum(minX,maxX,1)[0];
		posY = minY ;
		break ;
		case 2://第二区（左）
		posX = minX;
		posY = game.tools.randomNum(minY,maxY,1)[0]; 
		break ;
		case 3://第三区（下）
		posX = game.tools.randomNum(minX,maxX,1)[0];
		posY = maxY ;
		break ;
		case 4://第四区（右）
		posX = maxX ;
		posY = game.tools.randomNum(minY,maxY,1)[0];
		break ;
	}

	return {
		x : posX ,
		y : posY 
	}

}

game.apps.monMove = function(){
	var oC = game.tools.id('game');
	var oGc = oC.getContext('2d');
	var minX = 50 ;
	var minY = 50 ;
	var maxX = game.tools.view().w - 160 ;
	var maxY = game.tools.view().h - 160 ;
	var iSpeed = 30 ;
	var monList = [] ;
	var i = 0 ;
	var j = 0 ;
	var monNum = game.step
	var oImage = new Image() ;
	var posX = 0;
	var posY = 0 ;
	var roundT =10000;
	var changeNum = ((maxX - minX)+(maxY - minY))*2/(roundT/iSpeed);
	var cacheCanvas = document.createElement('canvas');
	var ctx = cacheCanvas.getContext('2d');
	var monDeathSrc = ["images/death1.png","images/death2.png","images/death3.png","images/death4.png"]
	oC.width = game.tools.view().w ;
	oC.height = game.tools.view().h ;

	cacheCanvas.width = oC.width ;
	cacheCanvas.height = oC.height ;

	createMon();
	monMove();

	oC.addEventListener('touchend',monDeath,false);
			
	function monDeath(ev){
			ev = ev.changedTouches[0];
			var tempPosX  = 0 ;
			var tempPosY  = 0 ;
			   for(var t=0;t<monList.length;t++){
			   	oGc.beginPath();
				oGc.rect(monList[t].posX,monList[t].posY,120,120);
				oGc.closePath();
				if(oGc.isPointInPath(ev.pageX,ev.pageY)){
					clearInterval(game.timer);	
					tempPosX = monList[t].posX;
					tempPosY = monList[t].posY;
					var numSrc = monList[t].src.match(/\d/)[0];
					monList.splice(t,1);
					var oImg = new Image();
					oImg.src = monDeathSrc[numSrc-1];
					oImg.onload = function(){
						oGc.clearRect(tempPosX-20,tempPosY-20,160,160);
						oGc.drawImage(oImg,tempPosX,tempPosY);
					}
					if(!monList.length) {oGc.clearRect(0, 0, oC.width, oC.height);
										clearInterval(game.timer);
										if(game.step<10){
											game.step ++ ;
											setTimeout(function(){
												clearInterval(game.deathTimer);
												clearInterval(game.timer);
												game.apps.tenSec();
												game.apps.monMove(game.apps.step);
											},1500)
											
										}else{
											game.apps.step = 1;  
										}
										}

					setTimeout(function(){
						oGc.clearRect(tempPosX,tempPosY,140,140);
						monMove();
					},500)						
				}
			}
		}

function monMove(){	
 if(monList.length){
	  game.timer = setInterval(function(){ //怪物运动
	   		i = 0 ;
	   		prevLoad(); 
	   		oGc.clearRect(0, 0, oC.width, oC.height);
	        oGc.drawImage(cacheCanvas, 0, 0, cacheCanvas.width, cacheCanvas.height);
	        ctx.clearRect(0, 0, oC.width, oC.height);
		},iSpeed);
	}
}
  function prevLoad(){
  	if(monList.length){
   		oImage.src = monList[i].src;
		oImage.onload = function(){
			if(monList.length) {monList[i].angle += 5;}
				if(monList.length){
				if(posY==minY && posX<=maxX && posX>minX){
					posX -= changeNum ;
					if(posX<minX) {posX = minX ;}
				}
				if(posX==minX && posY<maxY && posY>=minY){
					posY += changeNum ;
					if(posY>maxY) {posY = maxY ;}
				}
				if(posY==maxY && posX<maxX && posX>=minX){
					posX += changeNum ;
					if(posX>maxX) {posX = maxX ;}
				}
				if(posX==maxX && posY<=maxY && posY>minY){
					posY -= changeNum ;
					if(posY<minY) {posY = minY ;}
				}
			}	
			if(monList.length){
			 	posX =  posX-monList[i].R * Math.cos(monList[i].angle * Math.PI / 180);
				posY =  posY-monList[i].R * Math.sin(monList[i].angle * Math.PI / 180);
				monList[i].posX = posX;
				monList[i].posY = posY;
			}
				//oGc.drawImage(oImage,posX,posY);
			 	ctx.drawImage(oImage,posX,posY);
			 
			i++;
			if(i<monList.length) {prevLoad();}
		}
	}
  }

	function createMon (){
		var minX = 50 ;
		var minY = 50 ;
		var maxX = game.tools.view().w - 160 ;
		var maxY = game.tools.view().h - 160 ;
		var monSrc = ["images/monster1.png","images/monster2.png","images/monster3.png","images/monster4.png"]
		var pos = game.apps.getPos(minX,maxX,minY,maxY);
		var src = monSrc[game.tools.randomNum(0,3,1)[0]];
		var R = game.tools.randomNum(200,300,1)[0];
		var temp = {};
		temp.x =  pos.x ;
		temp.y =  pos.y ;
		temp.src =  src ;
		temp.angle =  300 ;
		temp.R = R ;
		monList.push(temp);
		j++;

		setTimeout(function(){  //先后出现不同的怪物
		if(j<monNum) {createMon();}
		},500)
	}
}

game.apps.createStep = function(){
	var step = 30 ;
	var arr = [] ;
	for(var i=1;i<=step;i++){
		arr.push(i);
	}
	return arr ;
}

game.apps.gameStart = function(){
	var oGamePage = game.tools.id('gamePage');
	var oPop = oGamePage.getElementsByClassName('popup')[0];
	var oBtn = oPop.getElementsByClassName('btn')[0];
	game.step = 1;
	game.timer = null ;
	oBtn.addEventListener('touchend',fnStart,false);

	function fnStart(){
		oPop.style.display = 'none';
		game.apps.tenSec();
		game.apps.monMove();
	}
}

game.apps.tenSec = function(){
	game.deathTimer = null ;
	var oGamePage = game.tools.id('gamePage');
	var oBlist = oGamePage.getElementsByClassName('b_list')[0];
	var aSpan = oBlist.getElementsByTagName('span');
	//now = (new Date()).getTime() - startTime;
	var count = 10 ;
	aSpan[0].innerHTML = count + '秒'
	clearInterval(game.deathTimer);
	game.deathTimer=setInterval(function(){
		count -- ;
		aSpan[0].innerHTML = count + '秒'
		if(count == 0) {
			clearInterval(game.deathTimer);
			clearInterval(game.timer);
		}
	},1000)
}

*/


