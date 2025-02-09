// dateUtils.js

export const convertirAFecha = (fechaString) => {
    if (!fechaString) return null;
    if (fechaString.includes('/')) {
        const [dia, mes, anio] = fechaString.split('/');
        return new Date(anio, mes - 1, dia);
    } else {
        const [anio, mes, dia] = fechaString.split('-');
        return new Date(anio, mes - 1, dia);
    }
};

export const formatearFecha = (fecha) => {
    if (!fecha) return '--/--/--';

    // Si ya está en formato dd/mm/aaaa, devolverlo tal cual
    if (fecha.includes('/')) return fecha;

    // Convertir de aaaa-mm-dd a dd/mm/aaaa
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
};

export const convertirAFormatoInput = (fecha) => {
    if (!fecha) return '';

    // Si ya está en formato aaaa-mm-dd, devolverlo tal cual
    if (fecha.includes('-')) return fecha;

    // Convertir de dd/mm/aaaa a aaaa-mm-dd
    const [day, month, year] = fecha.split('/');
    return `${year}-${month}-${day}`;
};

export const validarSecuenciaFechas = (fechaAnterior, fechaPosterior) => {
    const fecha1 = convertirAFecha(fechaAnterior);
    const fecha2 = convertirAFecha(fechaPosterior);

    if (!fecha1 || !fecha2) return false;

    fecha1.setHours(0, 0, 0, 0);
    fecha2.setHours(0, 0, 0, 0);

    return fecha2 >= fecha1;
};

export const validarFechaHistorial = (fecha, historicoActual, fechaVinculante) => {
    // Solo validamos la alternancia de vías ya que las fechas se controlan en el selector
    if (historicoActual.length > 0) {
        const ultimaVia = historicoActual[historicoActual.length - 1].via;
        const nuevaVia = determinarViaInicial(historicoActual);
        if (nuevaVia === ultimaVia) {
            return { valido: false, mensaje: 'Debe alternar entre vías IV y VO' };
        }
    }
    return { valido: true };
};

export const determinarTipoEvento = (historicoActual) => {
    return historicoActual.length === 0 ? 'inicio' : 'switch';
};

export const determinarViaInicial = (historicoActual) => {
    if (historicoActual.length === 0) return 'IV';
    return historicoActual[historicoActual.length - 1].via === 'IV' ? 'VO' : 'IV';
};

// Nuevas funciones agregadas

export const updateInitialEventDate = (historicoRetrospectivo, tratamiento, nuevaFecha, getAbreviatura) => {
    const nuevoHistorico = { ...historicoRetrospectivo };

    tratamiento.antibioticos.forEach(atb => {
        const abreviatura = getAbreviatura(atb);
        if (nuevoHistorico[abreviatura]?.length > 0) {
            nuevoHistorico[abreviatura] = [
                {
                    ...nuevoHistorico[abreviatura][0],
                    fecha: formatearFecha(nuevaFecha)
                },
                ...nuevoHistorico[abreviatura].slice(1)
            ];
        }
    });

    return nuevoHistorico;
};

export const createInitialEvent = (fechaInicio) => ({
    fecha: formatearFecha(fechaInicio),
    via: 'IV',
    tipo: 'inicio'
});

export const updateTreatmentDate = (tratamientos, tratamientoId, nuevaFecha) => {
    return tratamientos.map(tto =>
        tto.id === tratamientoId ? {
            ...tto,
            fechaInicio: nuevaFecha,
            fechaInicioVinculante: nuevaFecha,
            antibioticos: tto.antibioticos.map(atb => ({
                ...atb,
                fecha: nuevaFecha
            }))
        } : tto
    );
};