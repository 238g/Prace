BasicGame={};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
	init:function(){this.M.BootInit(!1,{
		GAME_TITLE:document.title,
		GAME_TITLE_EN:'YahiroGame',
		MAIN_COLOR:'#A0D7C0',
		MAIN_TINT:0xA0D7C0,
		MAIN_TEXT_COLOR:'#33435C',
		MAIN_STROKE_COLOR:'#33435C',
		WHITE_COLOR:'#ffffff',
		curLang:'jp',
		// curLang:getQuery('lang')=='en'?'en':'jp',
		endTut:!1,
		tw:'https://twitter.com/saekiyahiro',
		yt:'https://www.youtube.com/channel/UCp-8cPCziyRz2OXJWBOjsCQ',
	})},
	preload:function(){var p=(__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/')+'images/loading/loading.';this.load.atlasJSONHash('loading',p+'png',p+'json')},
	create:function(){
		this.M.G.Words=this.genWords();
		this.M.G.LevelInfo=this.genLevelInfo();
		this.M.NextScene('Preloader');
	},
	genLevelInfo:function(){
		return {
			1:{respawnTimer:8E3,nextLevel:2,speed:1},
			2:{respawnTimer:7E3,nextLevel:4,speed:1.2},
			3:{respawnTimer:6500,nextLevel:6,speed:1.4},
			4:{respawnTimer:6E3,nextLevel:8,speed:1.6},
			5:{respawnTimer:5500,nextLevel:11,speed:1.8},
			6:{respawnTimer:4500,nextLevel:14,speed:2},
			7:{respawnTimer:4E3,nextLevel:17,speed:2.2},
			8:{respawnTimer:3500,nextLevel:20,speed:2.4},
			9:{respawnTimer:3500,nextLevel:24,speed:2.6},
			10:{respawnTimer:3500,nextLevel:28,speed:2.8},
			11:{respawnTimer:3E3,nextLevel:32,speed:3},
			12:{respawnTimer:3E3,nextLevel:36,speed:3.2},
			13:{respawnTimer:2500,nextLevel:40,speed:3.4},
			14:{respawnTimer:2500,nextLevel:45,speed:3.6},
			15:{respawnTimer:2E3,nextLevel:50,speed:3.8},
			16:{respawnTimer:2E3,nextLevel:null,speed:4},
		};
	},
	genWords:function(){
		var touchJP=this.M.G.TOUCH_WORD;
		////// var touchEN=this.M.G.TOUCH_WORD_EN;
		return {
			jp:{
				Start:'スタート',
				GameOver:'終了！',
				ScoreBack:'人',
				Res:'結果',
				HowTo:'＜ 遊び方 ＞\n走ってくるやひろちゃんを\nゴールまで届けよう！\nあみだくじの道路は\n'+touchJP+'すると\n横にスライドするよ\n10人落ちてしまうと終了\n頭をフル回転させて\nたくさんのやひろちゃんを\n送り出しましょう！\n五年生に幸あれ！',
				Again:'もう一度！',
				TwBtn:'結果をツイート',
				Back:'もどる',
				OtherGames:'他のゲーム',
				TwTtl:'『'+this.M.G.GAME_TITLE+'』で遊んだよ！',
				TwHT:'やひろゲーム',
				ResScoreBack:'を送り出したよ！',
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
			'title':'images/saekiyahiro/title.png',
			'yahiro_1':'images/saekiyahiro/yahiro_1.png',
			'yahiro_2':'images/saekiyahiro/yahiro_2.png',
			'yahiro_3':'images/saekiyahiro/yahiro_3.png',
			'yahiro_4':'images/saekiyahiro/yahiro_4.png',
			'yahiro_5':'images/saekiyahiro/yahiro_5.png',
			'road_1':'images/saekiyahiro/road_1.jpg',
			'road_2':'images/saekiyahiro/road_2.jpg',
			'road_3':'images/saekiyahiro/road_3.jpg',
			'road_4':'images/saekiyahiro/road_4.jpg',
			'road_5':'images/saekiyahiro/road_5.jpg',
			'res_1':'images/saekiyahiro/res_1.png',
			'res_2':'images/saekiyahiro/res_2.png',
			'res_3':'images/saekiyahiro/res_3.png',
		};
		for(var i=1;i<=19;i++)this.load.image('bg'+i,'images/mochi_hiyoko/bg/'+i+'.jpg');
		for(var k in a)this.load.image(k,a[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		var p=__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/';
		var s={
			TitleBGM:'sounds/saekiyahiro/nagagutsudeodekake',
			PlayBGM:'sounds/saekiyahiro/Exotic',
			start:p+'sounds/SE/LabJP/Life/Other/police-whistle1',
			end:p+'sounds/SE/LabJP/Life/Other/police-whistle2',
			OnBtn:p+'sounds/SE/LabJP/Btn/decision26',
			slide:p+'sounds/SE/LabJP/Battle/Fight/setup1',
			miss:p+'sounds/SE/LabJP/Battle/Fight/highspeed-movement1',
			goal:p+'sounds/SE/LabJP/Performance/Anime/eye-shine1',
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