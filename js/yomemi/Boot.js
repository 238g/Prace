BasicGame={};
BasicGame.Boot=function(){};
BasicGame.Boot.prototype={
	init:function(){this.M.BootInit(!1,{
		GAME_TITLE:document.title,
		GAME_TITLE_EN:'Let\'s make Hi-Potion with Yomemi!',
		MAIN_COLOR:'#ffffff',
		MAIN_TINT:0xffffff,
		MAIN_TEXT_COLOR:'#000000',
		MAIN_STROKE_COLOR:'#000000',
		WHITE_COLOR:'#ffffff',
		curLang:getQuery('lang')=='en'?'en':'jp',
		endTut:!1,
		tw:'https://twitter.com/APP_Yomemi',
		yt:'https://www.youtube.com/channel/UCy5lOmEQoivK5XK7QCaRKug',
	})},
	preload:function(){var p=(__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/')+'images/loading/loading.';this.load.atlasJSONHash('loading',p+'png',p+'json')},
	create:function(){
		this.M.G.Words=this.genWords();
		this.M.G.ItemInfo=this.genItemInfo();
		this.M.G.ResInfo=this.genResInfo();
		this.M.NextScene('Preloader');
	},
	genItemInfo:function(){
		return {
			1:{name:'リボタピンD',val:-32,name_en:'LibotapinD',},
			2:{name:'腐ったコーヒー',val:43,name_en:'RottenCoffee',},
			3:{name:'スーパーウンケル',val:1,name_en:'SuperUnker',},
			4:{name:'GoldBerry24',val:21,name_en:'GoldBerry24',},

			5:{name:'赫マムシ',val:5,name_en:'REDViper',},
			6:{name:'酢五重',val:-3,name_en:'SuGoJu',},
			7:{name:'ご苦悩',val:108,name_en:'GoKuRo',},
			8:{name:'毒',val:8,name_en:'Poison',},

			9:{name:'ラテアート',val:34,name_en:'LatteArt',},
			10:{name:'舌倫ゴールド',val:115,name_en:'UnequaledGold',},
			11:{name:'民民打破',val:80,name_en:'SleepBreaker',},
			12:{name:'アリエナミンV',val:2,name_en:'ImpossibleV',},

			13:{name:'ヂョコラDD',val:-30,name_en:'ZhocolaDD',},
			14:{name:'ハートブレイカー',val:-50,name_en:'HeartBreaker',},
			15:{name:'リボDスーパー',val:-20,name_en:'SuperRiboD',},
			16:{name:'デッドブル',val:4,name_en:'DeadBull',},

			17:{name:'ウドンの力',val:-200,name_en:'PowerOfUdon',},
			18:{name:'ヴィタミン1000',val:200,name_en:'Vitamin1000',},
			19:{name:'マヤの元気',val:33,name_en:'EnergeticMaya',},
			20:{name:'バニラエッセンス？',val:27,name_en:'VanillaEssence?',},

			21:{name:'プリンの素',val:11,name_en:'PuddingMix',},
			22:{name:'にんじん',val:-9,name_en:'Carrot',},
			23:{name:'ハンバーガー',val:6,name_en:'Hamburger',},
			24:{name:'チョコレート',val:14,name_en:'Chocolate',},
			
			25:{name:'マシュマロ',val:-7,name_en:'Marshmallow',},
			26:{name:'清楚',val:9,name_en:'Sophisticated',},
			27:{name:'馬刺し',val:-13,name_en:'BASASHI',},
			28:{name:'未来',val:29,name_en:'Future',},
			
			29:{name:'カツドン',val:-56,name_en:'WWCD',},
			30:{name:'ママ',val:88,name_en:'Mam',},
			31:{name:'シャンプー',val:-73,name_en:'Shampoo',},
			32:{name:'バ美肉',val:36,name_en:'BABINIKU',},
		};
	},
	genResInfo:function(){
		return {
			1:{name:'めのまえがまっくら',emoji:'😇😇😇😇😇😇',name_en:'Your vision grows dark',},
			2:{name:'道端にあるアレ',emoji:'🤮🤮🤮🤮🤮🤮',name_en:'Vomited...',},
			3:{name:'Nice boat.',emoji:'🚢🚢🚢🚢🚢🚢',name_en:'Nice boat.',},
			4:{name:'プリンにしよう（迷案）',emoji:'🍮🍮🍮🍮🍮🍮',name_en:'Let\'s make this a pudding!',},
			5:{name:'グミにしよう（迷案）',emoji:'🍇🍇🍇🍇🍇🍇',name_en:'Let\'s make this a gummy!',},
			6:{name:'ｹﾞﾎｯ',emoji:'🤮🤮🤮🤮🤮🤮',name_en:'*cough*',},
			7:{name:'う;@[p;:l:',emoji:'🤮🤮🤮🤮🤮🤮',name_en:'U;@[p;:l:',},
			8:{name:'＼(^o^)／ｵﾜﾀ',emoji:'😇😇😇😇😇😇',name_en:'＼(^o^)／All Over!',},
		};
	},
	genWords:function(){
		////// var touchJP=this.M.G.TOUCH_WORD;
		////// var touchEN=this.M.G.TOUCH_WORD_EN;
		return {
			jp:{
				Start:'スタート',
				HowTo:'遊び方\n\nヨメミと一緒に\nハイポーションを作ろう！\n４つの内から１つを\n８回選んでね。\n組み合わせは\n全部で65536通り！\n８パターンあるエンドを\n全て見られるかな？',
				Again:'もう一度！',
				TwBtn:'結果をツイート',
				Back:'もどる',
				OtherGames:'他のゲーム',
				TwTtl:'『'+this.M.G.GAME_TITLE+'』で遊んだよ！',
				TwHT:'ヨメミゲーム',
				WatchThisMv:'この動画を見る',
				End:'完成！',
				Res:'結果',
				Lang:'English',
			},
			en:{
				Start:'START',
				HowTo:'How To Play\n\nLet\'s make Hi-Potion\nwith Yomemi!\nChoose one out of\nthe four items.\nThere are 65,536 combinations\nin total!\nCan you see all the patterns\nwith 8 patterns?',
				Again:'Again!',
				TwBtn:'Tweet Result',
				Back:'Back',
				OtherGames:'OtherGames',
				TwTtl:'I have played the game "'+this.M.G.GAME_TITLE_EN+'".',
				TwHT:'YomemiGame',
				WatchThisMv:'Watch This MV',
				End:'Complete!',
				Res:'RESULT',
				Lang:'日本語',
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
			'title':'images/yomemi/title.png',
			'res1':'images/yomemi/res1.jpg',
			'res8':'images/yomemi/res8.jpg',
		};
		for(var k in a)this.load.image(k,a[k]);
		for(var i=1;i<=32;i++)this.load.image('item_'+i,'images/yomemi/item/'+i+'.jpg');
		for(var i=1;i<=11;i++)this.load.image('bg'+i,'images/yomemi/bg'+i+'.jpg');
		this.loadAudio();
	},
	loadAudio:function(){
		var p=__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/';
		var s={
			TitleBGM:p+'sounds/BGM/R/retrogamecenter3',
			PlayBGM:'sounds/yomemi/cook1',
			ResBGM:'sounds/yomemi/toruko',
			OnBtn:p+'sounds/SE/LabJP/Btn/decision14',
			OnStart:p+'sounds/SE/LabJP/Btn/decision8',
			selectItem:p+'sounds/SE/LabJP/Performance/Anime/jump-anime1',
			intoPot:'sounds/yomemi/threatened-lion1_edit',
			end:p+'sounds/SE/LabJP/Life/Other/police-whistle1',
			drink:'sounds/yomemi/drink1',
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