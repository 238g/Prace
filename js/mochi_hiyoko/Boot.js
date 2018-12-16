BasicGame={};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
	init:function(){this.M.BootInit(!1,{
		GAME_TITLE:document.title,
		GAME_TITLE_EN:'MochiHiyoGame',
		MAIN_COLOR:'#FAE3C4',
		MAIN_TINT:0xFAE3C4,
		MAIN_TEXT_COLOR:'#BC96D1',
		MAIN_STROKE_COLOR:'#734D80',
		WHITE_COLOR:'#ffffff',
		curLang:'jp',
		// curLang:getQuery('lang')=='en'?'en':'jp',
		endTut:!1,
		curLevel:1,
		tw:'https://twitter.com/mochi8hiyoko',
		yt:'https://www.youtube.com/channel/UCZ1WJDkMNiZ_QwHnNrVf7Pw',
	})},
	preload:function(){var p=(__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/')+'images/loading/loading.';this.load.atlasJSONHash('loading',p+'png',p+'json')},
	create:function(){
		this.M.G.Words=this.genWords();
		this.M.G.LevelInfo=this.genLevelInfo();
		this.M.NextScene('Preloader');
	},
	genLevelInfo:function(){
		return {
			1:{respawnTimer:1E3,respawnCount:1,speed:.3,nextLevel:8,},
			2:{respawnTimer:900,respawnCount:2,speed:.3,nextLevel:15,},
			3:{respawnTimer:800,respawnCount:1,speed:.3,nextLevel:22,},
			4:{respawnTimer:700,respawnCount:2,speed:.3,nextLevel:30,},
			5:{respawnTimer:700,respawnCount:1,speed:.4,nextLevel:38,},
			6:{respawnTimer:700,respawnCount:2,speed:.5,nextLevel:50,},
			7:{respawnTimer:600,respawnCount:1,speed:.4,nextLevel:60,},
			8:{respawnTimer:600,respawnCount:2,speed:.5,nextLevel:70,},
			9:{respawnTimer:500,respawnCount:1,speed:.6,nextLevel:80,},
			10:{respawnTimer:500,respawnCount:2,speed:.4,nextLevel:90,},
			11:{respawnTimer:500,respawnCount:2,speed:.5,nextLevel:100,},
			12:{respawnTimer:500,respawnCount:2,speed:.6,nextLevel:120,},
			13:{respawnTimer:500,respawnCount:2,speed:.7,nextLevel:140,},
			14:{respawnTimer:500,respawnCount:2,speed:.8,nextLevel:160,},
			15:{respawnTimer:500,respawnCount:3,speed:.9,nextLevel:200,},
			16:{respawnTimer:500,respawnCount:3,speed:1,nextLevel:null,},
		};
	},
	genWords:function(){
		////// var touchJP=this.M.G.TOUCH_WORD;
		////// var touchEN=this.M.G.TOUCH_WORD_EN;
		return {
			jp:{
				Start:'スタート',
				KillCount:'ロリコンホイホイ',
				GameOver:'終了！',
				Res:'結果',
				HowTo:'遊び方\n\nもちひよこを操作して\nモーニングスターをふりまわそう\n\n近づいてくるロリコンを\n叩いてホイホイしてね！\n\nかわいい壁紙に見とれて\nスコアを逃さぬように注意！\n目指せ高得点！',
				Again:'もう一度！',
				TwBtn:'結果をツイート',
				Back:'もどる',
				OtherGames:'他のゲーム',
				TwTtl:'『'+this.M.G.GAME_TITLE+'』で遊んだよ！',
				TwHT:'もちひよゲーム',
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
			'hiyoko':'images/mochi_hiyoko/hiyoko.png',
			'weapon':'images/mochi_hiyoko/weapon.png',
			'title':'images/mochi_hiyoko/title.png',
			'otaku1':p+'images/UMI/Bullets/FujoshiA.png',
			'otaku2':p+'images/UMI/Bullets/FujoshiB.png',
			'otaku3':p+'images/UMI/Bullets/OtakuA.png',
			'otaku4':p+'images/UMI/Bullets/OtakuB.png',
			'otaku5':p+'images/UMI/Bullets/OtakuC.png',
			'otaku6':p+'images/UMI/Bullets/OtakuD.png',
			'otaku7':p+'images/UMI/Enemies/You.png',
		};
		for(var i=1;i<=19;i++)this.load.image('bg'+i,'images/mochi_hiyoko/bg/'+i+'.jpg');
		for(var k in a)this.load.image(k,a[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		var p=__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/';
		var s={
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