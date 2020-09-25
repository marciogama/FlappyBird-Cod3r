function novoElemento(tagName, className) {  
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem;
}

function Barreira(reversa = false) { // função construtora 
    this.elemento = novoElemento('div', 'barreira');

    const borda = novoElemento('div', 'borda');
    const corpo = novoElemento('div', 'corpo');

    this.elemento.appendChild(reversa ? corpo : borda);
    this.elemento.appendChild(reversa ? borda : corpo);
    this.setAltura = altura => corpo.style.height = `${altura}px`;
}

// testando
// const b = new Barreira(true);
// b.setAltura(200);
// document.querySelector('[wm-flappy]').appendChild(b.elemento);

function ParDeBarreiras(altura, abertura, x) { // função construtora
    this.elemento = novoElemento('div', 'par-de-barreiras');

    this.superior = new Barreira(true);
    this.inferior = new Barreira(false);

    this.elemento.appendChild(this.superior.elemento);
    this.elemento.appendChild(this.inferior.elemento);

    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura);
        const alturaInferior = altura - abertura - alturaSuperior;
        this.superior.setAltura(alturaSuperior);
        this.inferior.setAltura(alturaInferior);
    }

    this.getX = () => parseInt(this.elemento.style.left.split('px')[0]);
    this.setX = x => this.elemento.style.left = `${x}px`;
    this.getLargura = () => this.elemento.clientWidth;
    
    this.sortearAbertura();
    this.setX(x);
}

// testando a criação das barreiras
// const b = new ParDeBarreiras(700, 200, 400);
// document.querySelector('[wm-flappy]').appendChild(b.elemento)

function Barreiras(altura, largura, abertura, espaco, notificarPonto) { // função construtora
    this.pares = [
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),
        new ParDeBarreiras(altura, abertura, largura + espaco * 3),
    ];

    const deslocamento = 3;
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento) // barreira anda para esquerda

            // quando o elemento sair da área do jogo, ele volta para a área inicial
            // com uma nova abertura aleatória
            if (par.getX() < -par.getLargura()) {
                par.setX(par.getX() + espaco * this.pares.length);
                par.sortearAbertura();
            }

            const meio = largura / 2;
            const cruzouOMeio = par.getX() + deslocamento >= meio && par.getX() < meio;
            if(cruzouOMeio){
                notificarPonto();
            }                    
        });
    };
}

// testando o deslocamento das barreiras
const barreiras = new Barreiras(700, 1200, 200, 400);
const areaDoJogo = document.querySelector('[wm-flappy]');
barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento));
setInterval(() => {
    barreiras.animar()
},20)