BasicGame.Play=function(){};
BasicGame.Play.prototype={
	init:function(){ 
		// Game
		this.isPlaying=this.inputEnabled=!1;
		// Conf
		this.curLang=this.M.G.curLang;
		this.Words=this.M.G.Words;
		this.curWords=this.Words[this.curLang];
		// Val

		// Obj
		null;
		this.Tween={};
	},
	create:function(){
		console.log(3333333333333);
		this.time.events.removeAll();
		// this.stage.backgroundColor='#000';
		// this.playBgm();

		// this.genContents();
		// this.M.gGlb('endTut')?this.genStart():this.genTut();
		// this.test();
	},
};