
var tortuga;
var liebre;
var terreno = "";		//string que representa la pista en la que se corre
var mensaje = "";		//string que muestra un mensaje cuando hay un choque
const TAMANO = 70;
var tiempo = null;
var imgTortuga = '<img src="./img/img1.gif" width="20" height="20"/>';
var imgLiebre = '<img src="./img/img2.gif" width="20" height="20"/>';
var imgPelea = '<img src="./img/img3.gif" width="20" height="20"/>';


window.onload = function(){
    var movimientosTortuga = {rapido:3, desliza:-6, lento:1};
    var movimientosLiebre = {duerme:0, granSalto:8, deslizaGrande:-12, saltoPeque:1, deslizaPeque:-2};

    tortuga = new Tortuga("tortuga", movimientosTortuga);
    liebre = new Liebre("liebre", movimientosLiebre);
    
    for (i = 0; i < TAMANO; i++) {
        terreno += "_";
    }
    document.getElementById("carrera").innerHTML = terreno;
};


function Animal(nombre, movimientos){
  this.nombre = nombre;
  this.movimientos = movimientos;
  this.posicion = 0;
}


function Tortuga(nombre, movimientos) {
  Animal.call(this, nombre, movimientos);
}


function Liebre(nombre, movimientos) {
  Animal.call(this, nombre, movimientos);
}


Tortuga.prototype = Object.create(Animal.prototype);
Liebre.prototype = Object.create(Animal.prototype);


Animal.prototype.mueve = function(valorMovimiento) {
    this.posicion += valorMovimiento;
    if (this.posicion < 0)
        this.posicion = 0;
    else if (this.posicion >= (TAMANO-1)){
        this.posicion = TAMANO-1;
        document.getElementById("botonMueve").disabled = true;
        document.getElementById("botonMuevetodo").disabled = true;
		document.getElementById("botonAutomatico").disabled = true;
		clearInterval(tiempo);
		
		resultado =  "Ganó la " + this.nombre;
		if (this.nombre == "tortuga")
			resultado += "! YEAH!";
		else
			resultado += "... qué bien!! yuhu";
		
        document.getElementById("resultado").innerHTML = resultado;
    }
}


Tortuga.prototype.tiempos = function(numAleatorio) {
    var valorMovimiento = 0;
    switch (true) {
        case (numAleatorio <= 5):
            valorMovimiento = this.movimientos["rapido"];
            break;
        case (numAleatorio > 5 && numAleatorio <= 7):
            valorMovimiento = this.movimientos["desliza"];
            break;
        case (numAleatorio > 7 && numAleatorio <= 10):
            valorMovimiento = this.movimientos["lento"];
            break;
        default:
            break;
    }
    return valorMovimiento;
}


Liebre.prototype.tiempos = function(numAleatorio) {
    var valorMovimiento = 0;
    switch (true) {
        case (numAleatorio <= 2):
            valorMovimiento = this.movimientos["duerme"];
            break;
        case (numAleatorio > 2 && numAleatorio <= 4):
            valorMovimiento = this.movimientos["granSalto"];
            break;
        case (numAleatorio > 4 && numAleatorio <= 5):
            valorMovimiento = this.movimientos["deslizaGrande"];
            break;
        case (numAleatorio > 5 && numAleatorio <= 8):
            valorMovimiento = this.movimientos["saltoPeque"];
            break;
        case (numAleatorio > 8 && numAleatorio <= 10):
            valorMovimiento = this.movimientos["deslizaPeque"];
            break;
        default:
            break;
    }
    return valorMovimiento;
}


document.getElementById("botonReinicia").onclick = 
function reinicia() {
    location.reload();
};


document.getElementById("botonMueve").onclick = function (){ movimiento(false);};


function movimiento(modo){		//con el modo diferencio si estoy en el modo paso a paso o dibujar toda la traza
	mensaje = "";
	var numAleatorio = aleatorio();
    movimientoAnimal(tortuga, numAleatorio);
    movimientoAnimal(liebre, numAleatorio);
    dibuja(modo);
    compruebaEmpate();
}


document.getElementById("botonAutomatico").onclick = 
function mueveAutomatico(){
    if (tiempo == null){
		document.getElementById("botonAutomatico").innerHTML = "Parar";
		tiempo = setInterval(movimiento, 250);
    }
	else{
		document.getElementById("botonAutomatico").innerHTML = "Automático";
		clearInterval(tiempo);
		tiempo = null;
	}
};


document.getElementById("botonMuevetodo").onclick =
function mueveTodo(){
    
    do{
       movimiento(true);
    }
    while ((tortuga.posicion != TAMANO-1) && (liebre.posicion != TAMANO-1));
};


function movimientoAnimal(animal, numAleatorio){
    var valorMovimiento = 0;
    var valorMovimientoAnterior = animal.posicion;

    valorMovimiento = animal.tiempos(numAleatorio);
    animal.mueve(valorMovimiento); 
}


//dibuja según la opción de mostrar todo o mostrar una sola línea
function dibuja(opcion){
	terreno = "";
    for (i = 0; i < TAMANO; i++) {
        terreno += "_";
    }
	
	terreno = terreno.reemplazarEn(tortuga.posicion, "T");
    terreno = terreno.reemplazarEn(liebre.posicion, "L");
    if (tortuga.posicion == liebre.posicion){
        terreno = terreno.reemplazarEn(tortuga.posicion, "X");
		mensaje = "   OUCH!";
	}

    console.log(terreno + mensaje);
	
	if (liebre.posicion < tortuga.posicion){	//es importante quien va primero, porque habrá que sumar los caracteres que ocupa el código de la imagen del adversario
		terreno = terreno.reemplazarEn(liebre.posicion, imgLiebre);
		terreno = terreno.reemplazarEn(tortuga.posicion + imgLiebre.length -1, imgTortuga);
	}

	else if (liebre.posicion > tortuga.posicion){
		terreno = terreno.reemplazarEn(tortuga.posicion, imgTortuga);
		terreno = terreno.reemplazarEn(liebre.posicion + imgTortuga.length -1, imgLiebre);
	}
	else if (liebre.posicion == tortuga.posicion)
		terreno = terreno.reemplazarEn(liebre.posicion, imgPelea);

    if (opcion)
        document.getElementById("resultadoTotal").innerHTML += '<p>' + terreno + mensaje + '</p>';
    else
        document.getElementById("carrera").innerHTML = terreno + mensaje;
}


function compruebaEmpate(){
    if ((tortuga.posicion == TAMANO-1) && (liebre.posicion == TAMANO-1))
        document.getElementById("resultado").innerHTML = "Han empatado!";
}

//funcion flecha para calcular numero aleatorio entre 0 y 10, que sea entero
var aleatorio = () => (parseFloat(Math.round(Math.random() * 10) / 10).toFixed(1))*10;

//extiendo la clase string, reemplaza un caracter del string con otro string
String.prototype.reemplazarEn = function(indice, reemplazo) {
    return this.substr(0, indice) + reemplazo + this.substr(indice +1);
}


