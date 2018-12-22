BasicGame={};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
	init:function(){this.M.BootInit(!1,{
		GAME_TITLE:document.title,
		GAME_TITLE_EN:'',//TODO
		MAIN_COLOR:'#FAE3C4',//TODO
		MAIN_TINT:0xFAE3C4,//TODO
		MAIN_TEXT_COLOR:'#BC96D1',//TODO
		MAIN_STROKE_COLOR:'#734D80',//TODO
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
		this.M.G.LevelInfo=this.genLevelInfo();
		this.M.NextScene('Preloader');
	},
	genLevelInfo:function(){
		return {
			// 1:{respawnTimer:54E3,},
			1:{respawnTimer:5E3,},
			// 1:{respawnTimer:500,},
		};
	},
	genWords:function(){
		////// var touchJP=this.M.G.TOUCH_WORD;
		////// var touchEN=this.M.G.TOUCH_WORD_EN;
		return {
			jp:{
				Start:'スタート',
				/*
				KillCount:'ロリコンホイホイ',
				GameOver:'終了！',
				Res:'結果',
				HowTo:'遊び方\n\nもちひよこを操作して\nモーニングスターをふりまわそう\n\n近づいてくるロリコンを\n叩いてホイホイしてね！\n\nかわいい壁紙に見とれて\nスコアを逃さぬように注意！\n目指せ高得点！',
				Again:'もう一度！',
				TwBtn:'結果をツイート',
				Back:'もどる',
				OtherGames:'他のゲーム',
				TwTtl:'『'+this.M.G.GAME_TITLE+'』で遊んだよ！',
				TwHT:'',
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
		};
		for(var i=1;i<=19;i++)this.load.image('bg'+i,'images/mochi_hiyoko/bg/'+i+'.jpg');
		for(var k in a)this.load.image(k,a[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		var p=__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/';
		var s={
			/*
			TitleBGM:p+'sounds/BGM/Animare/chocolatedaisakusen',
			PlayBGM:p+'sounds/BGM/F/famipop2',
			OnBtn:p+'sounds/SE/LabJP/Btn/decision22',
			OnStart:p+'sounds/SE/LabJP/Btn/decision5',
			attack1:p+'sounds/SE/LabJP/Battle/Fight/kick-high1',
			attack2:p+'sounds/SE/LabJP/Battle/Fight/kick-middle1',
			attack3:p+'sounds/SE/LabJP/Battle/Fight/punch-high1',
			hitNme:p+'sounds/SE/LabJP/Battle/Fight/punch-middle2',
			end:'sounds/mochi_hiyoko/ko1',
			levelUp:p+'sounds/SE/LabJP/Performance/Anime/shakin1',
			*/
		};
		for(var k in s){
			var f=s[k];
			this.sounds[k]=1;
			this.load.audio(k,[f+'.mp3',f+'wav']);
		}
	},
	loadComplete:function(){
		this.stage.disableVisibilityChange=!1;
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