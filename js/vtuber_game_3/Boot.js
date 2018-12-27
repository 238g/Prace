BasicGame={};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
	init:function(){this.M.BootInit(!0,{
		GAME_TITLE:document.title,
		GAME_TITLE_EN:'VTuber-Pazzle',
		MAIN_COLOR:'#ffffff',
		MAIN_TINT:0xffffff,
		MAIN_TEXT_COLOR:'#000000',
		MAIN_STROKE_COLOR:'#000000',
		WHITE_COLOR:'#ffffff',
		curLang:'jp',
		// curLang:getQuery('lang')=='en'?'en':'jp',
		endTut:!1,
		curPuzzle:1,
		curChar:1,
		frameWidth:600,
		frameHeight:300,
	})},
	preload:function(){var p=(__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/')+'images/loading/loading.';this.load.atlasJSONHash('loading',p+'png',p+'json')},
	create:function(){
		this.M.G.Words=this.genWords();
		this.M.G.PuzzleInfo=this.genPuzzleInfo();
		this.M.G.CharInfo=this.genCharInfo();
		this.M.NextScene('Preloader');
	},
	genPuzzleInfo:function(){
		return {
			1:{size:this.M.G.frameHeight/3,col:6,row:3,},
			2:{size:this.M.G.frameHeight/4,col:8,row:4,},
			3:{size:this.M.G.frameHeight/5,col:10,row:5,},
		};
	},
	genCharInfo:function(){
		//tw,yt
		return {
			1:{name:'',img:'todo_1',},
			2:{name:'',img:'todo_1',},
			3:{name:'',img:'todo_1',},
			4:{name:'',img:'todo_1',},
			5:{name:'',img:'todo_1',},
			6:{name:'',img:'todo_1',},
			7:{name:'',img:'todo_1',},
			8:{name:'',img:'todo_1',},
			9:{name:'',img:'todo_1',},
			10:{name:'',img:'todo_1',},
			11:{name:'',img:'todo_1',},
			12:{name:'',img:'todo_1',},
			13:{name:'',img:'todo_1',},
			14:{name:'',img:'todo_1',},
		};
	},
	genWords:function(){
		////// var touchJP=this.M.G.TOUCH_WORD;
		////// var touchEN=this.M.G.TOUCH_WORD_EN;
		return {
			jp:{
				Start:'スタート',
				TimeA:'Time: ',
				Clear:'クリア！',
				Again:'もう一度！',
				Back:'もどる',
				HowTo:'',
				OtherGames:'他のゲーム',
				TwBtn:'結果をツイート',
				TwTtl:'『'+this.M.G.GAME_TITLE+'』で遊んだよ！',
				TwHT:'',
			},
			en:{
			},
		};
	},
};
////////////////////////////////////////////////////////////////////////////////////////////////////////
BasicGame.Preloader=function(){};
BasicGame.Preloader.prototype={
	create:function(){
		this.sounds={};
		this.M.S.load();
		this.load.onLoadComplete.add(this.loadComplete,this);
		this.loadAssets();
		this.load.start();
	},
	loadAssets:function(){
		var p=__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/';
		this.load.atlasXML('greySheet',p+'images/public/sheets/greySheet.png',p+'images/public/sheets/greySheet.xml');
		this.load.atlasXML('GameIconsWhite',p+'images/public/sheets/GameIconsWhite.png',p+'images/public/sheets/GameIconsWhite.xml');
		this.load.atlasJSONHash('VolumeIcon',p+'images/public/VolumeIcon/VolumeIconW.png',p+'images/public/VolumeIcon/VolumeIconW.json');
		var a={
			'PubLogo':p+'images/public/logo/logo.png',
			'wp':'images/odanoharukasu/wp.jpg',
			'twp':'images/odanoharukasu/twp70.png',


		};
		for(var k in a)this.load.image(k,a[k]);
		this.loadPicture();
		this.loadAudio();
	},
	loadPicture:function(){
		var info=this.M.G.PuzzleInfo;
		this.load.spritesheet('todo_1','images/vtuber_game_3/TEST.jpg',info[1].size,info[1].size);
	},
	loadAudio:function(){
		var p=__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/';
		var s={
			/*
			TitleBGM:'sounds/saekiyahiro/nagagutsudeodekake',
			PlayBGM:'sounds/saekiyahiro/Exotic',
			start:p+'sounds/SE/LabJP/Life/Other/police-whistle1',
			end:p+'sounds/SE/LabJP/Life/Other/police-whistle2',
			OnBtn:p+'sounds/SE/LabJP/Btn/decision26',
			slide:p+'sounds/SE/LabJP/Battle/Fight/setup1',
			miss:p+'sounds/SE/LabJP/Battle/Fight/highspeed-movement1',
			goal:p+'sounds/SE/LabJP/Performance/Anime/eye-shine1',
			*/
		};
		for(var k in s){
			var f=s[k];
			this.sounds[k]=1;
			this.load.audio(k,[f+'.mp3',f+'wav']);
		}
	},
	loadComplete:function(){
		// this.stage.disableVisibilityChange=!1;
		// this.input.maxPointers=2;
		this.game.device.desktop&&(document.body.style.cursor='pointer');
		this.M.S.txt(this.world.centerX,this.world.height*.85,this.M.G.TOUCH_WORD+'してスタート\n'+this.M.G.TOUCH_WORD_EN+' TO PLAY',this.M.S.styl(25));
		this.M.SE.setSounds(this.sounds);
		this.sound.volume=.5;
		getQuery('mute')&&(this.sound.mute=!0);
		this.game.input.onDown.addOnce(__ENV!='prod'?this.start:this.M.S.logo,this);
	},
	start:function(){this.M.NextScene(__ENV!='prod'?getQuery('s')||'Title':'Title')},
};