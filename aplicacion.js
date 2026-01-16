class Tanque {
    constructor(diametro, altura, nivelLiquido, densidad) {
        this.diametro = diametro;
        this.altura = altura;
        this.nivelLiquido = Math.min(nivelLiquido, altura);
        this.densidad = densidad;
        this.radio = diametro / 2;
    }

    calcularVolumenTotal() {
        throw new Error("Método debe ser implementado por la clase hija");
    }

    calcularVolumenLiquido() {
        throw new Error("Método debe ser implementado por la clase hija");
    }

    calcularVolumenVacio() {
        return this.calcularVolumenTotal() - this.calcularVolumenLiquido();
    }

    calcularMasa() {
        return this.calcularVolumenLiquido() * this.densidad * 1000;
    }

    obtenerPorcentajeLlenado() {
        return (this.nivelLiquido / this.altura) * 100;
    }
}

class TanqueCilindricoVertical extends Tanque {
    constructor(diametro, altura, nivelLiquido, densidad, tipoCabezal = 'plano') {
        super(diametro, altura, nivelLiquido, densidad);
        this.tipoCabezal = tipoCabezal;
    }

    calcularVolumenTotal() {
        const volumenCilindro = Math.PI * this.radio * this.radio * this.altura;
        
        if (this.tipoCabezal === 'conico') {
            const volumenCono = (Math.PI * this.radio * this.radio * (this.diametro / 3));
            return volumenCilindro + (volumenCono * 2);
        }
        
        return volumenCilindro;
    }

    calcularVolumenLiquido() {
        const volumenCilindricoLiquido = Math.PI * this.radio * this.radio * this.nivelLiquido;
        
        if (this.tipoCabezal === 'conico' && this.nivelLiquido > 0) {
            const volumenConoCompleto = (Math.PI * this.radio * this.radio * (this.diametro / 3));
            const volumenConoParcial = (Math.PI * this.radio * this.radio * this.nivelLiquido) / 3;
            return volumenCilindricoLiquido + Math.min(volumenConoCompleto, volumenConoParcial);
        }
        
        return volumenCilindricoLiquido;
    }
}

class TanqueCilindricoHorizontal extends Tanque {
    constructor(diametro, altura, nivelLiquido, densidad, tipoCabezal = 'plano') {
        super(diametro, altura, nivelLiquido, densidad);
        this.tipoCabezal = tipoCabezal;
    }

    calcularVolumenTotal() {
        const volumenCilindro = Math.PI * this.radio * this.radio * this.altura;
        
        if (this.tipoCabezal === 'conico') {
            const volumenConos = (2 * Math.PI * this.radio * this.radio * this.radio) / 3;
            return volumenCilindro + volumenConos;
        }
        
        return volumenCilindro;
    }

    calcularVolumenLiquido() {
        const alturaLlenado = Math.min(this.nivelLiquido, this.diametro);
        const theta = 2 * Math.acos((this.radio - alturaLlenado) / this.radio);
        const areaSegmento = (this.radio * this.radio / 2) * (theta - Math.sin(theta));
        return areaSegmento * this.altura;
    }
}

class TanqueRectangular extends Tanque {
    calcularVolumenTotal() {
        return this.diametro * this.diametro * this.altura;
    }

    calcularVolumenLiquido() {
        return this.diametro * this.diametro * this.nivelLiquido;
    }
}

class TanqueCapsula extends Tanque {
    constructor(diametro, altura, nivelLiquido, densidad) {
        super(diametro, altura, nivelLiquido, densidad);
        this.alturaTotal = altura + diametro;
        this.nivelLiquido = Math.min(nivelLiquido, this.alturaTotal);
    }

    calcularVolumenTotal() {
        const volumenCilindro = Math.PI * this.radio * this.radio * this.altura;
        const volumenEsfera = (4/3) * Math.PI * Math.pow(this.radio, 3);
        return volumenCilindro + volumenEsfera;
    }

    calcularVolumenLiquido() {
        const r = this.radio;
        const h = this.nivelLiquido;
        
        if (h <= r) {
            return (Math.PI * h * h / 3) * (3 * r - h);
        }
        
        if (h <= this.altura + r) {
            const hCilindro = h - r;
            const volumenHemisferioInferior = (2/3) * Math.PI * Math.pow(r, 3);
            const volumenCilindrico = Math.PI * r * r * hCilindro;
            return volumenHemisferioInferior + volumenCilindrico;
        }
        
        const volumenHemisferioInferior = (2/3) * Math.PI * Math.pow(r, 3);
        const volumenCilindrico = Math.PI * r * r * this.altura;
        const hSuperior = h - this.altura - r;
        const volumenCasqueteSuperior = (Math.PI * hSuperior * hSuperior / 3) * (3 * r - hSuperior);
        return volumenHemisferioInferior + volumenCilindrico + volumenCasqueteSuperior;
    }
    
    obtenerPorcentajeLlenado() {
        return (this.nivelLiquido / this.alturaTotal) * 100;
    }
}

class ConvertidorUnidades {
    static aMetros(valor, unidad) {
        return unidad === 'metrico' ? valor / 1000 : valor * 0.0254;
    }

    static densidadAGrCm3(valor, unidad) {
        return unidad === 'metrico' ? valor : valor * 0.016018463;
    }

    static m3ALitros(m3) {
        return m3 * 1000;
    }

    static m3AGalones(m3) {
        return m3 * 264.172;
    }
}

class VisualizacionTanque {
    constructor() {
        this.inicializarElementosComunes();
        this.inicializarTanqueVertical();
        this.inicializarTanqueHorizontal();
        this.inicializarTanqueRectangular();
        this.inicializarTanqueCapsula();
    }

    inicializarElementosComunes() {
        this.lineaNivel = document.getElementById('lineaNivel');
        this.textoNivel = document.getElementById('textoNivel');
        this.lineaDiametro = document.getElementById('lineaDiametro');
        this.lineaAltura = document.getElementById('lineaAltura');
    }

    inicializarTanqueVertical() {
        this.tanqueVertical = document.getElementById('tanqueVertical');
        this.llenadoLiquido = document.getElementById('llenadoLiquido');
        this.elipseLiquidoSuperior = document.getElementById('elipseLiquidoSuperior');
        this.elipseLiquidoInferior = document.getElementById('elipseLiquidoInferior');
        this.cabezalSuperior = document.getElementById('cabezalSuperior');
        this.cabezalInferior = document.getElementById('cabezalInferior');
        this.elipseSupVertical = document.getElementById('elipseSupVertical');
    }

    inicializarTanqueHorizontal() {
        this.tanqueHorizontal = document.getElementById('tanqueHorizontal');
        this.llenadoLiquidoHorizontal = document.getElementById('llenadoLiquidoHorizontal');
        this.elipseLiquidoIzq = document.getElementById('elipseLiquidoIzq');
        this.elipseLiquidoDer = document.getElementById('elipseLiquidoDer');
        this.cabezalIzquierdoPlano = document.getElementById('cabezalIzquierdoPlano');
        this.cabezalDerechoPlano = document.getElementById('cabezalDerechoPlano');
        this.cabezalIzquierdoConico = document.getElementById('cabezalIzquierdoConico');
        this.cabezalDerechoConico = document.getElementById('cabezalDerechoConico');
    }

    inicializarTanqueRectangular() {
        this.tanqueRectangular = document.getElementById('tanqueRectangular');
        this.llenadoLiquidoRectangular = document.getElementById('llenadoLiquidoRectangular');
        this.llenadoLiquidoRectLateral = document.getElementById('llenadoLiquidoRectLateral');
        this.llenadoLiquidoRectSuperior = document.getElementById('llenadoLiquidoRectSuperior');
    }

    inicializarTanqueCapsula() {
        this.tanqueCapsula = document.getElementById('tanqueCapsula');
        this.llenadoLiquidoCapsula = document.getElementById('llenadoLiquidoCapsula');
        this.elipseLiquidoCapsula = document.getElementById('elipseLiquidoCapsula');
        this.hemisferioLiquidoInferior = document.getElementById('hemisferioLiquidoInferior');
        this.baseLiquidoCapsula = document.getElementById('baseLiquidoCapsula');
    }

    actualizar(porcentajeLlenado, tipoCabezal, geometria) {
        this.ocultarTodosTanques();
        
        const actualizadores = {
            vertical: () => this.actualizarTanqueVertical(porcentajeLlenado, tipoCabezal),
            horizontal: () => this.actualizarTanqueHorizontal(porcentajeLlenado, tipoCabezal),
            rectangular: () => this.actualizarTanqueRectangular(porcentajeLlenado),
            capsula: () => this.actualizarTanqueCapsula(porcentajeLlenado)
        };

        actualizadores[geometria]?.();
    }

    ocultarTodosTanques() {
        this.tanqueVertical.style.display = 'none';
        this.tanqueHorizontal.style.display = 'none';
        this.tanqueRectangular.style.display = 'none';
        this.tanqueCapsula.style.display = 'none';
    }
    
    actualizarTanqueVertical(porcentajeLlenado, tipoCabezal) {
        this.tanqueVertical.style.display = 'block';
        
        const alturaMaxima = 200;
        const alturaLlenado = (porcentajeLlenado / 100) * alturaMaxima;
        const posicionY = 250 - alturaLlenado;

        this.llenadoLiquido.setAttribute('y', posicionY);
        this.llenadoLiquido.setAttribute('height', alturaLlenado);
        this.elipseLiquidoSuperior.setAttribute('cy', posicionY);
        
        this.actualizarLineaNivel(posicionY, porcentajeLlenado);
        this.actualizarCabezales(tipoCabezal);
        this.mostrarDimensionesVerticales();
    }

    mostrarDimensionesVerticales() {
        this.lineaDiametro.style.display = 'block';
        this.lineaAltura.style.display = 'block';
    }

    ocultarDimensiones() {
        this.lineaDiametro.style.display = 'none';
        this.lineaAltura.style.display = 'none';
    }

    actualizarCabezales(tipoCabezal) {
        const esConico = tipoCabezal === 'conico';
        this.cabezalSuperior.style.display = esConico ? 'block' : 'none';
        this.cabezalInferior.style.display = esConico ? 'block' : 'none';
        this.elipseSupVertical.style.display = esConico ? 'none' : 'block';
    }
    
    actualizarTanqueHorizontal(porcentajeLlenado, tipoCabezal) {
        this.tanqueHorizontal.style.display = 'block';
        
        const alturaMaxima = 100;
        const alturaLlenado = (porcentajeLlenado / 100) * alturaMaxima;
        const posicionY = 200 - alturaLlenado;
        
        this.llenadoLiquidoHorizontal.setAttribute('y', posicionY);
        this.llenadoLiquidoHorizontal.setAttribute('height', alturaLlenado);
        
        const centroY = posicionY + (alturaLlenado / 2);
        const radioY = alturaLlenado / 2;
        
        this.elipseLiquidoIzq.setAttribute('cy', centroY);
        this.elipseLiquidoIzq.setAttribute('ry', radioY);
        this.elipseLiquidoDer.setAttribute('cy', centroY);
        this.elipseLiquidoDer.setAttribute('ry', radioY);
        
        this.actualizarCabezalesHorizontal(tipoCabezal);
        this.actualizarLineaNivel(posicionY, porcentajeLlenado);
        this.ocultarDimensiones();
    }

    actualizarCabezalesHorizontal(tipoCabezal) {
        const esConico = tipoCabezal === 'conico';
        this.cabezalIzquierdoPlano.style.display = esConico ? 'none' : 'block';
        this.cabezalDerechoPlano.style.display = esConico ? 'none' : 'block';
        this.cabezalIzquierdoConico.style.display = esConico ? 'block' : 'none';
        this.cabezalDerechoConico.style.display = esConico ? 'block' : 'none';
    }
    
    actualizarTanqueRectangular(porcentajeLlenado) {
        this.tanqueRectangular.style.display = 'block';
        
        const alturaMaxima = 200;
        const alturaLlenado = (porcentajeLlenado / 100) * alturaMaxima;
        const posicionY = 250 - alturaLlenado;
        const yLateralSup = posicionY - 15;

        this.llenadoLiquidoRectangular.setAttribute('y', posicionY);
        this.llenadoLiquidoRectangular.setAttribute('height', alturaLlenado);
        
        this.llenadoLiquidoRectLateral.setAttribute('d', 
            `M 170 ${posicionY} L 190 ${yLateralSup} L 190 235 L 170 250 Z`);
        
        this.llenadoLiquidoRectSuperior.setAttribute('d', 
            `M 70 ${posicionY} L 90 ${yLateralSup} L 190 ${yLateralSup} L 170 ${posicionY} Z`);
        
        this.actualizarLineaNivel(posicionY, porcentajeLlenado);
        this.mostrarDimensionesVerticales();
    }
    
    actualizarTanqueCapsula(porcentajeLlenado) {
        this.tanqueCapsula.style.display = 'block';
        
        const alturaCilindro = 120;
        const radioHemisferio = 40;
        const alturaTotal = alturaCilindro + (2 * radioHemisferio);
        const alturaLlenado = (porcentajeLlenado / 100) * alturaTotal;
        
        let posicionY;
        
        if (alturaLlenado <= radioHemisferio) {
            posicionY = 250 - alturaLlenado;
            this.llenadoLiquidoCapsula.setAttribute('height', 0);
            this.elipseLiquidoCapsula.style.display = 'none';
            this.baseLiquidoCapsula.style.display = 'block';
        } else if (alturaLlenado <= radioHemisferio + alturaCilindro) {
            const alturaCilindrica = alturaLlenado - radioHemisferio;
            posicionY = 210 - alturaCilindrica;
            this.llenadoLiquidoCapsula.setAttribute('y', posicionY);
            this.llenadoLiquidoCapsula.setAttribute('height', alturaCilindrica);
            this.elipseLiquidoCapsula.setAttribute('cy', posicionY);
            this.elipseLiquidoCapsula.style.display = 'block';
            this.baseLiquidoCapsula.style.display = 'block';
        } else {
            posicionY = 90;
            this.llenadoLiquidoCapsula.setAttribute('y', posicionY);
            this.llenadoLiquidoCapsula.setAttribute('height', alturaCilindro);
            this.elipseLiquidoCapsula.setAttribute('cy', posicionY);
            this.elipseLiquidoCapsula.style.display = 'block';
            this.baseLiquidoCapsula.style.display = 'block';
        }
        
        this.actualizarLineaNivel(posicionY, porcentajeLlenado);
        this.mostrarDimensionesVerticales();
    }

    actualizarLineaNivel(posicionY, porcentajeLlenado) {
        this.lineaNivel.setAttribute('y1', posicionY);
        this.lineaNivel.setAttribute('y2', posicionY);
        this.textoNivel.setAttribute('y', posicionY + 5);
        this.textoNivel.textContent = porcentajeLlenado.toFixed(1) + '%';
    }
}

class ControladorInterfaz {
    constructor() {
        this.unidadActual = 'metrico';
        this.visualizacion = new VisualizacionTanque();
        this.inicializarElementos();
        this.adjuntarEventos();
    }

    inicializarElementos() {
        this.inicializarBotones();
        this.inicializarSelectores();
        this.inicializarCampos();
        this.inicializarEtiquetas();
        this.inicializarResultados();
    }

    inicializarBotones() {
        this.botonMetrico = document.getElementById('botonMetrico');
        this.botonImperial = document.getElementById('botonImperial');
    }

    inicializarSelectores() {
        this.selectorGeometria = document.getElementById('geometria');
        this.selectorTipoCabezal = document.getElementById('tipoCabezal');
        this.grupoTipoCabezal = document.getElementById('grupoTipoCabezal');
    }

    inicializarCampos() {
        this.campoDiametro = document.getElementById('diametro');
        this.campoAlturaTotal = document.getElementById('alturaTotal');
        this.campoNivelLiquido = document.getElementById('nivelLiquido');
        this.campoDensidad = document.getElementById('densidad');
    }

    inicializarEtiquetas() {
        this.etiquetaUnidadDim = document.getElementById('unidadDim');
        this.etiquetaUnidadAltura = document.getElementById('unidadAltura');
        this.etiquetaUnidadNivel = document.getElementById('unidadNivel');
        this.etiquetaUnidadDensidad = document.getElementById('unidadDensidad');
    }

    inicializarResultados() {
        this.elementosResultado = {
            volumenTotal: document.getElementById('volumenTotal'),
            volumenTotalSec: document.getElementById('volumenTotalSec'),
            volumenLiquido: document.getElementById('volumenLiquido'),
            volumenLiquidoSec: document.getElementById('volumenLiquidoSec'),
            volumenVacio: document.getElementById('volumenVacio'),
            volumenVacioSec: document.getElementById('volumenVacioSec'),
            masaTotal: document.getElementById('masaTotal'),
            porcentajeLlenado: document.getElementById('porcentajeLlenado'),
            tablaM3Total: document.getElementById('tablaM3Total'),
            tablaM3Liquido: document.getElementById('tablaM3Liquido'),
            tablaLTotal: document.getElementById('tablaLTotal'),
            tablaLLiquido: document.getElementById('tablaLLiquido'),
            tablaGalTotal: document.getElementById('tablaGalTotal'),
            tablaGalLiquido: document.getElementById('tablaGalLiquido')
        };
    }

    adjuntarEventos() {
        this.botonMetrico.addEventListener('click', () => this.establecerUnidad('metrico'));
        this.botonImperial.addEventListener('click', () => this.establecerUnidad('imperial'));
        
        this.selectorGeometria.addEventListener('change', () => {
            this.actualizarVisibilidadCabezales();
            this.calcular();
        });
        
        this.selectorTipoCabezal.addEventListener('change', () => this.calcular());
        this.campoDiametro.addEventListener('input', () => this.calcular());
        this.campoAlturaTotal.addEventListener('input', () => this.calcular());
        this.campoNivelLiquido.addEventListener('input', () => this.calcular());
        this.campoDensidad.addEventListener('input', () => this.calcular());
    }

    actualizarVisibilidadCabezales() {
        const geometria = this.selectorGeometria.value;
        const mostrarCabezales = geometria === 'vertical' || geometria === 'horizontal';
        this.grupoTipoCabezal.style.display = mostrarCabezales ? 'block' : 'none';
    }

    establecerUnidad(unidad) {
        this.unidadActual = unidad;
        this.botonMetrico.classList.toggle('activo', unidad === 'metrico');
        this.botonImperial.classList.toggle('activo', unidad === 'imperial');

        const etiquetas = unidad === 'metrico' 
            ? { dim: 'mm', altura: 'mm', nivel: 'mm', densidad: 'gr/cm³' }
            : { dim: 'in', altura: 'in', nivel: 'in', densidad: 'lb/ft³' };

        this.etiquetaUnidadDim.textContent = etiquetas.dim;
        this.etiquetaUnidadAltura.textContent = etiquetas.altura;
        this.etiquetaUnidadNivel.textContent = etiquetas.nivel;
        this.etiquetaUnidadDensidad.textContent = etiquetas.densidad;
        
        this.calcular();
    }

    calcular() {
        const valores = this.obtenerValoresEntrada();
        const tanque = this.crearTanque(valores);
        const resultados = this.calcularResultados(tanque);
        
        this.actualizarResultados(resultados);
        this.visualizacion.actualizar(
            resultados.porcentajeLlenado, 
            valores.tipoCabezal, 
            valores.geometria
        );
    }

    obtenerValoresEntrada() {
        return {
            geometria: this.selectorGeometria.value,
            tipoCabezal: this.selectorTipoCabezal.value,
            diametro: ConvertidorUnidades.aMetros(
                parseFloat(this.campoDiametro.value) || 0, 
                this.unidadActual
            ),
            altura: ConvertidorUnidades.aMetros(
                parseFloat(this.campoAlturaTotal.value) || 0, 
                this.unidadActual
            ),
            nivelLiquido: ConvertidorUnidades.aMetros(
                parseFloat(this.campoNivelLiquido.value) || 0, 
                this.unidadActual
            ),
            densidad: ConvertidorUnidades.densidadAGrCm3(
                parseFloat(this.campoDensidad.value) || 1.0, 
                this.unidadActual
            )
        };
    }

    crearTanque(valores) {
        const constructores = {
            vertical: () => new TanqueCilindricoVertical(
                valores.diametro, valores.altura, valores.nivelLiquido, 
                valores.densidad, valores.tipoCabezal
            ),
            horizontal: () => new TanqueCilindricoHorizontal(
                valores.diametro, valores.altura, valores.nivelLiquido, 
                valores.densidad, valores.tipoCabezal
            ),
            rectangular: () => new TanqueRectangular(
                valores.diametro, valores.altura, valores.nivelLiquido, valores.densidad
            ),
            capsula: () => new TanqueCapsula(
                valores.diametro, valores.altura, valores.nivelLiquido, valores.densidad
            )
        };

        return constructores[valores.geometria]();
    }

    calcularResultados(tanque) {
        const volumenTotal = tanque.calcularVolumenTotal();
        const volumenLiquido = tanque.calcularVolumenLiquido();
        const volumenVacio = tanque.calcularVolumenVacio();
        const masa = tanque.calcularMasa();
        const porcentajeLlenado = tanque.obtenerPorcentajeLlenado();

        return {
            volumenTotal,
            volumenLiquido,
            volumenVacio,
            masa,
            porcentajeLlenado,
            totalLitros: ConvertidorUnidades.m3ALitros(volumenTotal),
            liquidoLitros: ConvertidorUnidades.m3ALitros(volumenLiquido),
            vacioLitros: ConvertidorUnidades.m3ALitros(volumenVacio),
            totalGalones: ConvertidorUnidades.m3AGalones(volumenTotal),
            liquidoGalones: ConvertidorUnidades.m3AGalones(volumenLiquido),
            vacioGalones: ConvertidorUnidades.m3AGalones(volumenVacio)
        };
    }

    actualizarResultados(datos) {
        this.actualizarTarjetasResultado(datos);
        this.actualizarTablaResultados(datos);
    }

    actualizarTarjetasResultado(datos) {
        this.elementosResultado.volumenTotal.textContent = `${datos.volumenTotal.toFixed(2)} m³`;
        this.elementosResultado.volumenTotalSec.textContent = 
            `${datos.totalLitros.toFixed(2)} L / ${datos.totalGalones.toFixed(2)} gal`;
        
        this.elementosResultado.volumenLiquido.textContent = `${datos.volumenLiquido.toFixed(2)} m³`;
        this.elementosResultado.volumenLiquidoSec.textContent = 
            `${datos.liquidoLitros.toFixed(2)} L / ${datos.liquidoGalones.toFixed(2)} gal`;
        
        this.elementosResultado.volumenVacio.textContent = `${datos.volumenVacio.toFixed(2)} m³`;
        this.elementosResultado.volumenVacioSec.textContent = 
            `${datos.vacioLitros.toFixed(2)} L / ${datos.vacioGalones.toFixed(2)} gal`;
        
        this.elementosResultado.masaTotal.textContent = `${datos.masa.toFixed(2)} kg`;
        this.elementosResultado.porcentajeLlenado.textContent = 
            `${datos.porcentajeLlenado.toFixed(1)}% llenado`;
    }

    actualizarTablaResultados(datos) {
        this.elementosResultado.tablaM3Total.textContent = datos.volumenTotal.toFixed(2);
        this.elementosResultado.tablaM3Liquido.textContent = datos.volumenLiquido.toFixed(2);
        this.elementosResultado.tablaLTotal.textContent = datos.totalLitros.toFixed(2);
        this.elementosResultado.tablaLLiquido.textContent = datos.liquidoLitros.toFixed(2);
        this.elementosResultado.tablaGalTotal.textContent = datos.totalGalones.toFixed(2);
        this.elementosResultado.tablaGalLiquido.textContent = datos.liquidoGalones.toFixed(2);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const aplicacion = new ControladorInterfaz();
    aplicacion.actualizarVisibilidadCabezales();
    aplicacion.calcular();
});