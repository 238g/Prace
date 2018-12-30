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
		return {
			1:{name:'ウル=ケン・ノース',tw:'https://twitter.com/shiroken_2900',yt:'https://www.youtube.com/channel/UC2zuO8mkXTI5l-s6TL7uzuw',},
			2:{name:'ユメノシオリ',tw:'https://twitter.com/Yumeno_Shiori',yt:'https://www.youtube.com/channel/UCH0ObmokE-zUOeihkKwWySA',},
			3:{name:'花園セレナ',tw:'https://twitter.com/hanazono_serena',yt:'https://www.youtube.com/channel/UCRXBTd80F5IIWWY4HatJ5Ug',},
			4:{name:'神楽めあ',tw:'https://twitter.com/Freeze_Mea',yt:'https://www.youtube.com/channel/UCWCc8tO-uUl_7SJXIKJACMw',},
			5:{name:'高槻りつ',tw:'https://twitter.com/re2_takatsuki',yt:'https://www.youtube.com/channel/UCL9dLCVvHyMiqjp2RDgowqQ',},
			6:{name:'桜咲',tw:'https://twitter.com/oishicookieman',yt:'https://www.youtube.com/channel/UCT7oPK_pbb3qxvmDm-6jsuA',},
			7:{name:'夜野とばり',tw:'https://twitter.com/yrn__tbr',yt:'https://www.youtube.com/channel/UC2JMXD8btPtvJafM3dawF-Q',},
			8:{name:'シスター・クレア',tw:'https://twitter.com/SisterCleaire',yt:'https://www.youtube.com/channel/UC1zFJrfEKvCixhsjNSb1toQ',},
			9:{name:'華京院つばき',tw:'https://twitter.com/kakyoin_tsubaki',yt:'https://www.youtube.com/channel/UCI-xaXiiRD_2l8qxQRIpeEw',},
			10:{name:'日ノ隈らん',tw:'https://twitter.com/Ran_Hinokuma',yt:'https://www.youtube.com/channel/UCRvpMpzAXBRKJQuk-8-Sdvg',},
			11:{name:'宗谷いちか',tw:'https://twitter.com/Ichika_Souya',yt:'https://www.youtube.com/channel/UC2kyQhzGOB-JPgcQX9OMgEw',},
			12:{name:'狗尾',tw:'https://twitter.com/22_enokoro_22',yt:'https://www.youtube.com/channel/UCdSN2CZvZUSdAsfjmauSZpQ',},
			13:{name:'岩流小次郎',tw:'https://twitter.com/ganryukojiroV',yt:'https://www.youtube.com/channel/UCluNBS8ELjpKedBmax3pg0A',},
			14:{name:'天開司',tw:'https://twitter.com/tenkaitukasa',yt:'https://www.youtube.com/channel/UCZYyhgoV314CM14zBD6vd4A',},
			15:{name:'肯定ちゃん。',tw:'https://twitter.com/foLo1AdAMllmXja',yt:'https://www.youtube.com/channel/UCbDdx6Tb9ZZNNt4dpG3UKzA',},
			16:{name:'アネネ',tw:'https://twitter.com/anene_Vtuber',yt:'https://www.youtube.com/channel/UCXZT-ezVmaLSazjE1Tr_gKA',},
			17:{name:'小町ノノ',tw:'https://twitter.com/komachi_nono',yt:'https://www.youtube.com/channel/UCnvoQdObCS2VsmciF4LnvYw',},
			18:{name:'伏黒しのぶ',tw:'https://twitter.com/shinobu_work',yt:'https://www.youtube.com/channel/UC3h_TxlJPpmFSv1gxBQsYEQ',},
			19:{name:'名取さな',tw:'https://twitter.com/sana_natori',yt:'https://www.youtube.com/channel/UCIdEIHpS0TdkqRkHL5OkLtA',},
			20:{name:'犬桜ひとつ',tw:'https://twitter.com/Hitotsu_Dog',yt:'https://www.youtube.com/channel/UCxAgnZjDzMqcIA5gbryZkdg',},
			21:{name:'天野ヒカリ',tw:'https://twitter.com/amanohikari_ch',yt:'https://www.youtube.com/channel/UCVMD_K2OoIeoPAeavlha0_A',},
			22:{name:'白百合リリィ',tw:'https://twitter.com/SRYR_0',yt:'https://www.youtube.com/channel/UCl-3q6t6zdZwgIsFZELb7Zg',},
			23:{name:'夕陽リリ',tw:'https://twitter.com/Yuuhi_Riri',yt:'https://www.youtube.com/channel/UC48jH1ul-6HOrcSSfoR02fQ',},
			24:{name:'ギルザレンⅢ世',tw:'https://twitter.com/Gilzaren_III',yt:'https://www.youtube.com/channel/UCUzJ90o1EjqUbk2pBAy0_aw',},
			25:{name:'伏見ガク',tw:'https://twitter.com/gaku_fushimi',yt:'https://www.youtube.com/channel/UCXU7YYxy_iQd3ulXyO-zC2w',},
			26:{name:'白上フブキ',tw:'https://twitter.com/shirakamifubuki',yt:'https://www.youtube.com/channel/UCdn5BQ06XqgXoAxIhbqw5Rg',},
			27:{name:'道明寺晴翔',tw:'https://twitter.com/Haruto_gamebu',yt:'https://www.youtube.com/channel/UC2ZVDmnoZAOdLt7kI7Uaqog',},
			28:{name:'勇者ことね',tw:'https://twitter.com/kotone_vtuber',yt:'https://www.youtube.com/channel/UCHR0kaG6d7eU1wm17fx9Mvw',},
			29:{name:'夏実萌恵',tw:'https://twitter.com/Vtuber_Moe',yt:'https://www.youtube.com/channel/UCBePKUYNhoMcjBi-BRmjarQ',},
			30:{name:'華紅羅ルイ',tw:'https://twitter.com/sangaku_kagura',yt:'https://www.youtube.com/channel/UCme8gk6CxcpTjJXniwFV2yA',},
			31:{name:'倡カナタ',tw:'https://twitter.com/sangaku_kanata',yt:'https://www.youtube.com/channel/UCme8gk6CxcpTjJXniwFV2yA',},
			32:{name:'技藝タクト',tw:'https://twitter.com/sangaku_takuto',yt:'https://www.youtube.com/channel/UCme8gk6CxcpTjJXniwFV2yA',},
			33:{name:'魂鎮ユータ',tw:'https://twitter.com/sangaku_tama',yt:'https://www.youtube.com/channel/UCme8gk6CxcpTjJXniwFV2yA',},
		};
	},
	genWords:function(){
		////// var touchJP=this.M.G.TOUCH_WORD;
		////// var touchEN=this.M.G.TOUCH_WORD_EN;
		return {
			jp:{
				Start:'スタート',
				TimeA:'経過時間: ',
				TimeB:'秒',
				Clear:'クリア！',
				Again:'もう一度！',
				Back:'もどる',
				HowTo:'遊び方\nピースを空白にスライドさせて\nパズルを完成させよう！\n何秒でクリアできるかな？',
				OtherGames:'他のゲーム',
				TwBtn:'結果をツイート',
				TwTtl:'『'+this.M.G.GAME_TITLE+'』で遊んだよ！',
				TwHT:'Vtuberゲーム',
				Piece:'ピース',
				SelectedChar:'選んだVTuber: ',
				ResTitle:'結果',
				ChallengeBack:'に挑戦しました',
				SelectChar:'VTuber選択',
				SelectStage:'パズル選択',
				GiveUp:'ギブアップ',
				GiveUpConfirm:'本当にギブアップしますか？',
				Yes:'はい',
				No:'いいえ',
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
			'title':'images/vtuber_game_3/title.png',
		};
		for(var k in a)this.load.image(k,a[k]);
		this.loadPicture();
		this.loadAudio();
	},
	loadPicture:function(){
		for(var l in this.M.G.CharInfo){
			for(var k in this.M.G.PuzzleInfo){
				var pi=this.M.G.PuzzleInfo[k];
				this.load.image(l+'_full','images/vtuber_game_3/panel/'+l+'.jpg');
				this.load.spritesheet(l+'_'+k,'images/vtuber_game_3/panel/'+l+'.jpg',pi.size,pi.size);
			}
			this.load.image('char_'+l,'images/vtuber_game_3/char/'+l+'.jpg');
		}
	},
	loadAudio:function(){
		var p=__ENV!='prod'?'../Parace/':'https://238g.github.io/Parace/';
		var s={
			TitleBGM:'sounds/vtuber_game_3/yukiusaginokakekko',
			PlayBGM:p+'sounds/BGM/WaveMenuLoop',
			OnBtn:p+'sounds/SE/LabJP/Btn/decision9',
			page:p+'sounds/SE/LabJP/Btn/decision3',
			start:p+'sounds/SE/LabJP/Life/Other/police-whistle1',
			end:p+'sounds/SE/LabJP/Life/Other/police-whistle2',
			match:p+'sounds/SE/LabJP/Performance/Anime/eye-shine1',
			slide:p+'sounds/SE/LabJP/System/cursor7',
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