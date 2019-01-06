BasicGame={};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
	init:function(){this.M.BootInit(!1,{
		GAME_TITLE:document.title,
		GAME_TITLE_EN:'NatoriGame',
		MAIN_COLOR:'#FFCCE2',
		MAIN_TINT:0xFFCCE2,
		MAIN_TEXT_COLOR:'#ff69b4',
		MAIN_STROKE_COLOR:'#ff69b4',
		WHITE_COLOR:'#ffffff',
		endTut:!1,
		curLang:'jp',
		// curLang:getQuery('lang')=='en'?'en':'jp',
		yt:'https://www.youtube.com/channel/UCIdEIHpS0TdkqRkHL5OkLtA',
		tw:'https://twitter.com/sana_natori',
	})},
	preload:function(){var p=(__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/')+'images/loading/loading.';this.load.atlasJSONHash('loading',p+'png',p+'json')},
	create:function(){
		this.M.G.Words=this.genWords();
		this.M.NextScene('Preloader');
	},
	genWords:function(){
		////// var touchJP=this.M.G.TOUCH_WORD;
		////// var touchEN=this.M.G.TOUCH_WORD_EN;
		return {
			jp:{
				Start:'スタート',
				ScoreBack:'列',
				HowTo:'遊び方\n\n',
				TwBtn:'結果をツイート',
				TwTtl:'『'+this.M.G.GAME_TITLE+'』で遊んだよ！',
				TwHT:'',
				Again:'もう一度！',
				Back:'もどる',
				OtherGames:'他のゲーム',
				End:'終了！',
				HP:'HP: ',
				/*
				TwResF:'',
				TwResB:'',
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
			'natori_1':'images/natori/natori_1.png',
			'bg_1':'images/natori/bg_1.jpg',
			/*
			'ball_1':'images/matsuri_kzmy/ball_1.png',
			'ball_2':'images/matsuri_kzmy/ball_2.png',
			'bg_2':'images/matsuri_kzmy/bg_2.png',
			'bg_3':'images/matsuri_kzmy/bg_3.jpg',
			'burn':'images/matsuri_kzmy/burn.png',
			'title':'images/matsuri_kzmy/title.png',
			*/
		};
		for(var k in a)this.load.image(k,a[k]);
		this.loadAudio();
	},
	loadAudio:function(){
		var p=__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/';
		var s={
			/*
			TitleBGM:'sounds/matsuri_kzmy/harunoumi',
			PlayBGM_1:'sounds/matsuri_kzmy/kabuki_dancing',
			PlayBGM_2:'sounds/matsuri_kzmy/Neu_Kabuki',
			OnBtn:p+'sounds/SE/LabJP/Performance/Japan/hyoushigi1',
			odanobu_bomb:'sounds/matsuri_kzmy/odanobu_bomb',
			start:p+'sounds/SE/LabJP/Performance/Japan/drum-japanese2',
			hit_1:p+'sounds/SE/LabJP/Battle/Fight/kick-low1',
			hit_2:p+'sounds/SE/LabJP/Battle/Fight/punch-middle2',
			criticalhit:p+'sounds/SE/LabJP/Battle/Fight/punch-high2',
			missswing:p+'sounds/SE/LabJP/Battle/Fight/punch-swing1',
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