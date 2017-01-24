//创建数组
var musicModel=[];

var player=new Player();
player.updateRange();

$(".footer .pause img").click(function () {
	player.playOrPause();
});
$(".footer .pre img").click(function () {
	player.preMusic();
});
$(".footer .next img").click(function () {
	player.nextMusic();
});

getJsonData();

function Music () {
	this.src;
	this.img;
	this.num;
	this.musicName;
	this.name;
}

//获取数据
function getJsonData () {
	$.getJSON("pbl.json",function(data){
		for (var i=0;i<data.length;i++) {
			var music=new Music();
			music.src=data[i].src;
			music.img=data[i].img;
			
			music.num=data[i].num;
			music.musicName=data[i].musicName;
			music.name=data[i].name;
			//把音乐存放到数组中
			musicModel.push(music);
		}
		console.log("数组大小",musicModel.length);
		insertData();
		
		//播放
		player.playerPlay();
	})
}
//插入数据
function insertData(){
	for (var i=0;i<musicModel.length;i++) {
		var $div=$("<div class='music' data-index="+i+"></div>");
		$(".page_slide .content").append($div);
		
		var $img=$("<img src="+musicModel[i].img+">");
		console.log(musicModel[i].img);
		$div.append($img);
		
		var $p=$("<p>"+musicModel[i].musicName+"-"+musicModel[i].name+"</p>");
		$div.append($p);
		
		if(i==0){
			$div.addClass("playing");
		}
		$div.click(function () {
			//siblings()内容中其余的div
			$(this).addClass("playing").siblings().removeClass("playing");
			
			player.playIndex=$(this).data("index");
			
			player.playerPlay();
		});
	}
}
//播放器类
function Player(){
	//获取audio
	this.audio=document.getElementById("player");
	//播放音乐的编号
	this.playIndex=0;
	//播放音乐
	this.playerPlay=function(){
		$(this.audio).attr("src",musicModel[this.playIndex].src);
		this.audio.play();
		$(".footer .picture img").attr("src",musicModel[this.playIndex].img);
		$(".footer .pause img").attr("src","img/stop.png");
		
		
	}
	
	this.updateRange=function(){
		
		//替换引用 防止冲突
		var _this=this;
		this.audio.ontimeupdate=function(){
			$(".range").attr("max",this.duration);
			$(".range").val(this.currentTime);
			//当歌曲播放完后
			if (this.currentTime==this.duration) {
				if (_this.playIndex<musicModel.length-1) {
					_this.playIndex++;
				}else{
					_this.playIndex=0;
				}
				_this.playerPlay();
				//选中编号为index的标签 siblings其余的标签
				$(".content .music").eq(_this.playIndex).addClass("playing").siblings().removeClass("playing");
			}
		}
	}
	//上一首
	this.preMusic=function() {
		this.playIndex--;
		if (this.playIndex<0) {
			this.playIndex=musicModel.length-1;
		}
		this.playerPlay();
		//选择当前div
		$(".content .music").eq(this.playIndex).addClass("playing").siblings().removeClass("playing");
	}
	
	this.nextMusic=function(){
		this.playIndex++;
		if (this.playIndex>musicModel.length-1) {
			this.playIndex=0;
		}
		this.playerPlay();
		//选择当前div
		$(".content .music").eq(this.playIndex).addClass("playing").siblings().removeClass("playing");
	}
	//播放暂停
	this.playOrPause=function() {
		if(this.audio.paused){
			this.audio.play();
			$(".footer .pause img").attr("src","img/stop.png");
		}else{
			this.audio.pause();
			$(".footer .pause img").attr("src","img/play.png");
		}
	}
}
