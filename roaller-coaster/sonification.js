// Importar datos de montañas rusas desde coaster_db.js
const coasters = coasterData;

// Rango de frecuencias (en Hz) para la sonificación
const minFrequency = 200; // Frecuencia mínima
const maxFrequency = 800; // Frecuencia máxima

// Mapea la velocidad de una montaña rusa a una frecuencia de sonido
function mapSpeedToFrequency(speed) {
    const minSpeed = Math.min(...coasters.map(coaster => coaster.Speed));
    const maxSpeed = Math.max(...coasters.map(coaster => coaster.Speed));
    return ((speed - minSpeed) / (maxSpeed - minSpeed)) * (maxFrequency - minFrequency) + minFrequency;
}

// Reproduce un sonido con efecto Doppler basado en la velocidad proporcionada usando Web Audio API
function playSoundForSpeed(speed, onComplete) {
    const frequency = mapSpeedToFrequency(speed);

    // Crear contexto de audio
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Crear oscilador para el tono principal
    const oscillator = audioContext.createOscillator();
    oscillator.type = "sine"; // Tipo de onda: seno

    // Crear ganancia para controlar el volumen
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime); // Volumen inicial

    // Conectar el oscilador a la ganancia y luego a la salida de audio
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Iniciar el oscilador
    oscillator.start();

    // Efecto Doppler: Aumentar y luego disminuir la frecuencia
    const startTime = audioContext.currentTime;
    const midTime = startTime + 1; // Punto medio (aumento)
    const endTime = startTime + 1.2; // Final (disminución)

    // Fase 1: Aumentar la frecuencia
    oscillator.frequency.setValueAtTime(frequency * 0.8, startTime); // Frecuencia inicial baja
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.2, midTime); // Aumenta al tono alto

    // Fase 2: Disminuir la frecuencia
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.2, endTime); // Vuelve al tono bajo

    // Suavizar el apagado del volumen después del descenso de frecuencia
    gainNode.gain.exponentialRampToValueAtTime(0.01, endTime);

    // Detener el oscilador después de que el sonido se desvanece
    oscillator.stop(endTime);

    // Llamar a la función `onComplete` después de que el sonido termina
    setTimeout(() => {
        if (onComplete) onComplete();
    }, 1200);
}

let synth;

// Narrar los datos de una montaña rusa seleccionada
function narrarDatos(coaster) {
    synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(
        `La montaña rusa ${coaster.coaster_name} está ubicada en ${coaster.Location}, en el parque ${coaster.Park}. 
        Su velocidad máxima es de ${coaster.Speed} kilómetros por hora.`
    );
    utterance.lang = "es-ES"; // Imposta la lingua spagnola
    synth.speak(utterance);
}

// Función principal para combinar sonificación y narración
function narrarYSonificar(coaster) {
    // Primero, reproducir el sonido basado en la velocidad
    playSoundForSpeed(coaster.Speed, () => {
        // Después, narrar los datos de la montaña rusa seleccionada
        narrarDatos(coaster);
    });
}