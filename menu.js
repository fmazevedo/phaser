var telas = ["menu"];
var larguraJogo = 800;
var alturaJogo = 600;

function menu() {
	
	var setas;
	var teclaTiro;
	var horaParaOProximoTiro;
	var tiros;
	var frutas;
	var dude;
	var pontuacao;
	var texto;
	
	this.preload = function () {
		
		// Define a cor do fundo para azul claro.
		game.stage.backgroundColor = "#0066ff";
		
		// Carrega imagem do fundo (o primeiro parâmetro é como
		// nós iremos chamar a imagem no nosso jogo).
		game.load.image("fundo", "assets/background2.png");
		
		// Carrega imagem dos tiros (o primeiro parâmetro é como
		// nós iremos chamar a imagem no nosso jogo).
		game.load.image("tiro", "assets/bullet0.png");
		
		// Carrega imagem das frutas (o primeiro parâmetro é como
		// nós iremos chamar a imagem no nosso jogo).
		game.load.spritesheet("frutas", "assets/fruitnveg32wh37.png", 32, 32); 
		
		// Carrega a imagem de um sprite (o primeiro parâmetro é como
		// nós iremos chamar a imagem no nosso jogo, e os dois últimos
		// são a largura e a altura de cada quadro na imagem, em pixels).
		//
		
		game.load.spritesheet("dude", "assets/dude.png", 32, 48);
		
		// Para que o tiro não ocorra apenas no momento em que a
		// tecla foi pressionada, mas também não aconteça em todos
		// os quadros, vamos utilizar o horário do jogo, dado em
		// milissegundos, como cadenciador.
		horaParaOProximoTiro = game.time.now;
		
	};
	
	this.create = function () {
		
		var i;
		
		// Adiciona a imagem de fundo na coordenada (0, 0) da
		// tela, com 800 pixels de largura e 600 pixels de altura.
		// Contudo, se o tamanho original da imagem não for o
		// desejado, em vez de esticar a imagem, ela será repetida
		// várias vezes, lado a lado.
		game.add.tileSprite(0, 0, 800, 600, "fundo");
		
		// Cria um objeto para tratar as teclas direcionais
		// do teclado (cima, baixo, esquerda, direita).
		//
		// Mais atributos e métodos de entrada (game.input.xxx):
		// https://phaser.io/docs/2.6.2/Phaser.Input.html
		//
		// Mais atributos e métodos do teclado (game.input.keyboard.xxx):
		// http://phaser.io/docs/2.6.2/Phaser.Keyboard.html
		setas = game.input.keyboard.createCursorKeys();
		
		// Cria um objeto para tratar a barra de espaços, mas
		// *não* atribui uma função para ser executada quando a
		// tecla for pressionada.
		//
		// Mais teclas disponíveis:
		// https://phaser.io/docs/2.6.2/Phaser.KeyCode.html
		//
		// Mais atributos e métodos das teclas (tecla.xxx):
		// https://phaser.io/docs/2.6.2/Phaser.Key.html
		teclaTiro = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
		
		// Adiciona o sprite na coordenada (20, 100) da tela,
		// lembrando que (0, 0) está no canto superior esquerdo!
		//
		// Diferença entre sprites e imagens no Phaser 2: imagens
		// não podem ter animação nem física!
		//
		// Como iremos trabalhar com o sprite depois, precisamos
		// armazenar em uma variável.
		dude = game.add.sprite(20, 100, "dude");
		
		// Habilita o motor de física tradicional.
		game.physics.arcade.enable(dude);
		
		// Cria três animações chamadas "esquerda", "parado" e "direita"
		// para o sprite, com seus respectivos quadros, a uma velocidade
		// de 8 quadros por segundo, repetindo para sempre.
		dude.animations.add("esquerda", [0, 1, 2, 3], 8, true);
		dude.animations.add("parado", [4], 1, true);
		dude.animations.add("direita", [5, 6, 7, 8], 8, true);
		// Inicia a animação "parado".
		dude.animations.play("parado");
		
		// Previne que o sprite saia da tela.
		dude.body.collideWorldBounds = true;
		// Configura a gravidade (em pixels/s²) aplicada ao sprite,
		// lembrando que valores positivos apontam para baixo!
		dude.body.gravity.y = 800;
		// Configura o fator de rebatimento do sprite, definido
		// como o percentual da velocidade que ele terá quando
		// colidir com algum obstáculo.
		dude.body.bounce.x = 0.5;
		dude.body.bounce.y = 0;
		// Configura a velocidade horizontal máxima do sprite,
		// porque agora iremos trabalhar com a aceleração do
		// sprite, sem alterar sua velocidade diretamente.
		dude.body.maxVelocity.x = 500;
		// Configura o arrasto/desaceleração horizontal do sprite.
		dude.body.drag.x = 2000;
		// É comum assumir que as coordenadas x e y de um personagem
		// se refiram ao ponto inferior/central em jogos de plataforma,
		// o que pode facilitar os cálculos em alguns momentos.
		dude.anchor.x = 0.5;
		dude.anchor.y = 1;
		
		// Outros atributos comuns de body:
		// dude.body.velocity.x (em pixels/s)
		// dude.body.velocity.y (em pixels/s)
		// dude.body.acceleration.x (em pixels/s²)
		// dude.body.acceleration.y (em pixels/s²)
		// dude.body.drag.y (arrasto/desaceleração em pixels/s²)
		// dude.body.maxVelocity.y (em pixels/s)
		//
		// Mais atributos e métodos de body (dude.body.xxx):
		// https://phaser.io/docs/2.6.2/Phaser.Physics.Arcade.Body.html
		//
		// Mais informações relacionados à física de arcade:
		// https://phaser.io/docs/2.6.2/index#arcadephysics
		
		// O Phaser 2 possui o conceito de grupo de objetos, que
		// são objetos com comportamentos e significados similares.
		// Os grupos são utilizados para facilitar a execução de
		// tarefas repetidas sobre vários objetos diferentes, mas
		// que possuem mesma funcionalidade no jogo.
		//
		// Mais atributos e métodos dos grupos (tiros.xxx):
		// https://phaser.io/docs/2.6.2/Phaser.Group.html
		//
		// Como todos os objetos do grupo devem ter física,
		// usamos game.add.physicsGroup() em vez de game.add.group().
		// https://phaser.io/docs/2.6.2/Phaser.GameObjectFactory.html#physicsGroup
		tiros = game.add.physicsGroup();
		
		// Vamos deixar 5 tiros já criados. Esse valor será
		// a quantidade máxima de tiros na tela em um dado
		// momento.
		for (i = 0; i < 5; i++) {
			// Cria um novo tiro na coordenada (0, 0) da tela,
			// o que não importa, porque o tiro não aparecerá
			// ainda, nem terá a física processada (exists = false
			// e visible = false).
			var tiro = tiros.create(0, 0, "tiro");
			tiro.exists = false;
			tiro.visible = false;
			// Assim como com o personagem, vamos definir a âncora
			// dos tiros para facilitar.
			tiro.anchor.x = 0.5;
			tiro.anchor.y = 1;
			// Quando o tiro sair da tela ele deve ser destruído.
			// Caso contrário, ele ficaria ativo para sempre, mesmo
			// não estando mais visível!
			tiro.checkWorldBounds = true;
			tiro.events.onOutOfBounds.add(destruirTiro);
		}
		
		// Idem ao processo dos tiros, acima.
		frutas = game.add.physicsGroup();
		
		// Vamos criar 50 frutas, mas, diferente dos tiros, elas
		// já iniciarão visíveis na tela.
		for (i = 0; i < 50; i++) {
			// game.world.randomX escolhe uma posição x aleatória
			// da tela.
			//
			// Em vez de utilizar game.world.randomY, estamos
			// utilizando Math.random() * 500, para garantir que
			// nunca uma fruta seja posicionada nos 100 pixels
			// da parte de baixo da tela.
			//
			// Para que todas as frutas não fiquem iguais na tela,
			// utilizamos game.rnd.integerInRange(0, 36) para escolher
			// o quadro inicial do sprite das frutas. Como elas não
			// serão animadas, o quadro inicial é o que permanecerá.
			frutas.create(game.world.randomX, Math.random() * 500, "frutas", game.rnd.integerInRange(0, 36));
		}

		// As frutas não devem se mover quando forem acertadas
		// por um tiro, diferente de uma bola de bilhar, que
		// deve ser movida quando for acertada por outra bola.
		frutas.setAll("body.immovable", true);
		
		// Especifica o formato básico do texto de forma similar
		// ao atributo font do CSS normal. A diferença é que a cor
		// é determinada pelo atributo fill, e não color como
		// ocorre no CSS normal.
		//
		// Mais atributos e métodos dos textos e seus estilos:
		// https://phaser.io/docs/2.6.2/Phaser.Text.html
		var estilo = {
			font: "bold 20px Arial",
			fill: "#ffffff"
		};
		
		// Adiciona um texto na coordenada (0, 0) da tela,
		// lembrando que (0, 0) está no canto superior esquerdo!
		//
		// Como iremos trabalhar com o sprite depois, precisamos
		// armazenar em uma variável.
		texto = game.add.text(0, 0, "Pontuação: 0", estilo);
		
		// Nossa pontuação inicial.
		pontuacao = 0;
		
	};
	
	this.update = function () {
		
		// Usamos overlap() porque não queremos que os tiros/frutas
		// rebatam uns nos outros... Nós queremos apenas saber se um
		// tiro está sobre uma fruta. Se fosse algo como um jogo de
		// bilhar, usaríamos collide().
		//
		// Mais informações:
		// https://phaser.io/docs/2.6.2/Phaser.Physics.Arcade.html#collide
		// https://phaser.io/docs/2.6.2/Phaser.Physics.Arcade.html#overlap
		game.physics.arcade.overlap(tiros, frutas, tiroAcertouFruta);
		
		// Controle de movimentos simples. Se a seta esquerda estiver
		// pressionada, aplica uma aceleração negativa (esquerda) ao
		// o sprite. Se a seta direita estiver pressionada, aplica uma
		// aceleração positiva (direita) ao sprite. Se nenhuma tecla
		// estiver pressionada, remove a aceleração do sprite, deixando
		// que o arrasto/desaceleração (drag) pare o sprite.
		//
		// Além disso, define a animação correta do sprite dependendo
		// da seta que estiver pressionada.
		if (setas.left.isDown) {
			dude.body.acceleration.x = -3000;
			dude.animations.play("esquerda");
		} else {
			if (setas.right.isDown) {
				dude.body.acceleration.x = 3000;
				dude.animations.play("direita");
			} else {
				dude.body.acceleration.x = 0;
				dude.animations.play("parado");
			}
		}
		
		// Poderíamos também alterar a animação do sprite não apenas com
		// base no teclado, mas com base em sua velocidade, ou uma combinação
		// de ambos! :)
		
		var agora = game.time.now;
		
		// Neste exemplo, o tiro será executada sempre que a tecla
		// estiver pressionada, mas apenas se já tiver passado o
		// intervalo de tempo desejado. No nosso caso, um novo tiro
		// deve ser liberado a cada 100 milissegundos.
		if (teclaTiro.isDown && agora >= horaParaOProximoTiro) {
			// Nós criamos 5 tiros, assim, só poderão existir no
			// máximo 5 tiros na tela, em qualquer momento!
			var tiro = tiros.getFirstExists(false);
			
			if (tiro) {
				// Caso exista ao menos um tiro disponível,
				// devemos posicionar o sprite do tiro na
				// posicão correta, com a velocidade correta.
				tiro.reset(dude.x, dude.y - 20);
				tiro.body.velocity.y = -500;
				
				horaParaOProximoTiro = agora + 100;
			}
		}
		
	};
	
	function tiroAcertouFruta(tiro, fruta) {
		
		// Quando um tiro acerta uma fruta, nós destruímos
		// ambos e incrementamos a pontuação.
		tiro.kill();
		fruta.kill();
		
		pontuacao = pontuacao + 1;
		texto.setText("Pontuação: " + pontuacao);
		
	}
	
	function destruirTiro(tiro) {
		
		// Quando o tiro sair da tela ele deve ser destruído.
		// Caso contrário, ele ficaria ativo para sempre, mesmo
		// não estando mais visível!
		tiro.kill();
		
	}
	
}
