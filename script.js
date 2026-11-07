const elementos = {
    botaoPlay: document.querySelector("#botao-play"),
    botaoReiniciar: document.querySelector("#botao-reiniciar"),
    tabuleiro: document.querySelector(".tabuleiro"),
    painelVidas: document.querySelector(".vidas"),
    alterarDificuldade: document.querySelector("#dificuldade"),
    alterarModo: document.querySelector("#modo"),
    telaMorte: document.querySelector("#tela-morte")
}

const estado = {
  jogando: false,
  intervalo: null,
  vidas: 3,
  dificuldade: "facil",
  modo: "normal",
  direcao: { x: 1, y: 0 }
};

const dificuldades = {
    facil: { nome: "Fácil", vidas: 3, frutas: 5 },
    medio: { nome: "Médio", vidas: 2, frutas: 3 },
    dificil: { nome: "Difícil", vidas: 1, frutas: 1 }
}

const modos = {
    normal: { nome: "Normal", intervalo: 300 },
    rapido: { nome: "Rápido", intervalo: 150 }
}


let snake = [
    { coluna: 10, linha: 10 },
    { coluna: 9, linha: 10 },
    { coluna: 8, linha: 10 },
    { coluna: 7, linha: 10 }
]

let frutas = [
    { coluna: 5, linha: 8, tipo: "🍎" }
]

function iniciar() {
    const regrasDificuldade = dificuldades[estado.dificuldade]
    const regrasModo = modos[estado.modo]

    estado.vidas = regrasDificuldade.vidas
    atualizarVidas()

    resetarCobrinha()

    frutas = []
    for (let i = 0; i < regrasDificuldade.frutas; i++) {
        frutas.push(sortearFruta())
    }

    elementos.telaMorte.classList.remove("ativa")
    elementos.botaoPlay.textContent = "Parar"
    elementos.botaoPlay.classList.add("encerrar")

    estado.jogando = true

    clearInterval(estado.intervalo)

    desenhar()

    estado.intervalo = setInterval(() => {
        mover()
        desenhar()
    }, regrasModo.intervalo)
}

function parar() {
    clearInterval(estado.intervalo)
    elementos.tabuleiro.innerHTML = ""
    estado.jogando = false
    elementos.botaoPlay.textContent = "Play"
    elementos.botaoPlay.classList.remove("encerrar")
}

function desenhar() {
    elementos.tabuleiro.innerHTML = ""

    snake.forEach((item, indice) => {

        const corpo = document.createElement("div")

        if (indice === 0) {
            corpo.classList.add("cabeca")
        }
        else {
            corpo.classList.add("corpo")
        }

        corpo.style.gridColumn = item.coluna
        corpo.style.gridRow = item.linha

        elementos.tabuleiro.appendChild(corpo)
    });

    frutas.forEach((item) => {
        const fruta = document.createElement("div")

        fruta.classList.add("fruta")
        fruta.textContent = item.tipo
        fruta.style.gridColumn = item.coluna
        fruta.style.gridRow = item.linha

        elementos.tabuleiro.appendChild(fruta)
    })
}

function mover() {
    const cabecaAtual = snake[0]
    const cabecaNova = {
        coluna: cabecaAtual.coluna + estado.direcao.x,
        linha: cabecaAtual.linha + estado.direcao.y
    }

    if (cabecaNova.coluna < 1 || cabecaNova.coluna > 20 || cabecaNova.linha < 1 || cabecaNova.linha > 20) {
        perderVida()
        return
    }

    if (posicaoOcupada(cabecaNova.coluna, cabecaNova.linha)) {
        perderVida()
        return
    }

    const indiceFruta = frutas.findIndex((fruta) =>
        fruta.coluna === cabecaNova.coluna && fruta.linha === cabecaNova.linha
    )

    const comeu = indiceFruta !== -1

    snake.unshift(cabecaNova)

    if (!comeu) {
        snake.pop()
    }

    if (comeu) {
        frutas[indiceFruta] = sortearFruta()
    }
}

function morte() {
    parar()
    elementos.telaMorte.classList.add("ativa")
}

function posicaoOcupada(coluna, linha) {
    return snake.some((pedaco) => pedaco.coluna === coluna && pedaco.linha === linha)
}

function ocupadoPorFruta(coluna, linha) {
    return frutas.some((pedaco) => pedaco.coluna === coluna && pedaco.linha === linha)
}


function sortearFruta() {
    let coluna
    let linha

    do {
        coluna = Math.floor(Math.random() * 20) + 1
        linha = Math.floor(Math.random() * 20) + 1
    } while (posicaoOcupada(coluna, linha) || ocupadoPorFruta(coluna, linha))

    return { coluna: coluna, linha: linha, tipo: "🍎" }
}

(function comandos() {
    elementos.botaoPlay.addEventListener("click", () => {
        if (estado.jogando) {
            parar()
        } else {
            iniciar()
        }
    })

    elementos.botaoReiniciar.addEventListener("click", () => {
        iniciar()
    })

    elementos.alterarDificuldade.addEventListener("click", () => {
        if (estado.jogando) {
            return
        }
        proximaDificuldade()
    })

    elementos.alterarModo.addEventListener("click", () => {
        if (estado.jogando) {
            return
        }
        proximoModo()
    })
    
    document.addEventListener("keydown", (evento) => {
        if (evento.key === "ArrowUp") mudarDirecao({ x: 0, y: -1 })
        if (evento.key === "ArrowDown") mudarDirecao({ x: 0, y: 1 })
        if (evento.key === "ArrowLeft") mudarDirecao({ x: -1, y: 0 })
        if (evento.key === "ArrowRight") mudarDirecao({ x: 1, y: 0 })
    })
})()

function mudarDirecao(nova) {
    const oposta = estado.direcao.x + nova.x === 0 && estado.direcao.y + nova.y === 0

    if (oposta) return

    estado.direcao = nova
}

function atualizarVidas() {
    elementos.painelVidas.textContent = "❤️".repeat(estado.vidas)
}

function resetarCobrinha() {
    snake = [
        { coluna: 10, linha: 10 },
        { coluna: 9, linha: 10 },
        { coluna: 8, linha: 10 },
        { coluna: 7, linha: 10 }
    ]

    estado.direcao = { x: 1, y: 0 }
}

function perderVida() {
    estado.vidas = estado.vidas - 1
    atualizarVidas()

    if (estado.vidas === 0) {
        morte()
    } else {
        resetarCobrinha()
    }
}

function proximaDificuldade() {
    const chaves = Object.keys(dificuldades)
    const posicao = chaves.indexOf(estado.dificuldade)
    estado.dificuldade = chaves[(posicao + 1) % chaves.length]
    document.querySelector("#dificuldade").textContent = dificuldades[estado.dificuldade].nome
}

function proximoModo() {
    const chaves = Object.keys(modos)
    const posicao = chaves.indexOf(estado.modo)
    estado.modo = chaves[(posicao + 1) % chaves.length]
    document.querySelector("#modo").textContent = modos[estado.modo].nome
}