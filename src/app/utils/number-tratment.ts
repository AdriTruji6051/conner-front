export function roundNumber(numero: number): number {
    // Extraer la parte entera y los decimales del número
    let entero = Math.floor(numero);
    let decimales = numero - entero;

    if (decimales === 0){
        return entero + .00;
    }else if (decimales <= 0.50) {
        return entero + 0.50;
    } else {
        return Math.ceil(numero) + .00;
    }
}