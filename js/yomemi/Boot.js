BasicGame={};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
	init:function(){this.M.BootInit(!1,{
		GAME_TITLE:document.title,
		GAME_TITLE_EN:'Hi-Potion',
		MAIN_COLOR:'#ffffff',
		MAIN_TINT:0xffffff,
		MAIN_TEXT_COLOR:'#000000',
		MAIN_STROKE_COLOR:'#000000',
		WHITE_COLOR:'#ffffff',
		curLang:'jp',
		// curLang:getQuery('lang')=='en'?'en':'jp',
		endTut:!1,
		tw:'',//TODO
		yt:'',//TODO
	})},
	preload:function(){var p=(__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/')+'images/loading/loading.';this.load.atlasJSONHash('loading',p+'png',p+'json')},
	create:function(){
		this.M.G.Words=this.genWords();
		this.M.G.ItemInfo=this.genItemInfo();
		this.M.G.Recipe=this.genRecipe();
		this.M.NextScene('Preloader');
	},
	genItemInfo:function(){
		return {
			1:{name:'',},
			2:{name:'',},
			3:{name:'',},
			4:{name:'',},
			5:{name:'',},
			6:{name:'',},
			7:{name:'',},
			8:{name:'',},
			9:{name:'',},
			10:{name:'',},
			11:{name:'',},
			12:{name:'',},
			13:{name:'',},
			14:{name:'',},
			15:{name:'',},
			16:{name:'',},
			17:{name:'',},
			18:{name:'',},
			19:{name:'',},
			20:{name:'',},
			21:{name:'',},
			22:{name:'',},
			23:{name:'',},
			24:{name:'',},
			25:{name:'',},
		};
	},
	genRecipe:function(){
		return {

		};
	},
	genWords:function(){
		////// var touchJP=this.M.G.TOUCH_WORD;
		////// var touchEN=this.M.G.TOUCH_WORD_EN;
		return {
			jp:{
				/*
				Start:'スタート',
				OtherGames:'他のゲーム',
				ScoreFront:'香典',
				ScoreBack:'万円',
				ScoreBillion:'億',
				End:'終了',
				Time:'Time',
				HowTo:'bbbbbbbbbbb',
				Again:'もう一度！',
				TwBtn:'結果をツイート',
				Back:'もどる',
				TwTtl:'『'+this.M.G.GAME_TITLE+'』で遊んだよ！',
				TwHT:'aaaaaaaaaa',
				*/
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
			'wp':'images/icotsu/wp.jpg',
			'twp':'images/icotsu/twp60.png',




		};
		for(var k in a)this.load.image(k,a[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		var p=__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/';
		var s={
			/*
			TitleBGM:p+'sounds/BGM/C/CandyBouquet',
			PlayBGM:'sounds/icotsu/Desert2',
			OnBtn:p+'sounds/SE/LabJP/Btn/decision13',
			OnStart:p+'sounds/SE/LabJP/Btn/decision27',
			Back:p+'sounds/SE/LabJP/Btn/decision23',
			missile:'sounds/icotsu/missile',
			explode:p+'sounds/SE/Explode/explode',
			fetch:p+'sounds/SE/LabJP/System/cancel1',
			fire:p+'sounds/SE/Fire/Flame_1',
			showpandei:p+'sounds/SE/Cartoon/ApricotJumpBounce',
			fin:p+'sounds/SE/LabJP/Btn/decision6',
			start:p+'sounds/SE/LabJP/Btn/decision5',
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