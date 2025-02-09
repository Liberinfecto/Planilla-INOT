import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { antibioticosIVFrecuentes, biterapiasFrecuentes, antibioticosVOFrecuentes, antibioticosSelector, esColorClaro } from './ATB/antibioticosData';
import HistoryModal from './ATB/HistoryModal';
import { Clock } from 'lucide-react';
import VOModal from './ATB/VOModal';
import StickyNote from './ATB/StickyNote'; // Asegúrate de importar el componente StickyNote
import {
    formatearFecha,
    convertirAFecha,
    updateInitialEventDate,
    createInitialEvent,
    updateTreatmentDate
} from "./ATB/dateUtils";

const TREATMENT_HEIGHT = 80;
const TREATMENT_SPACING = 12;
const MIN_TREATMENTS = 1.2;
const MAX_TREATMENTS = 5;
const SNAP_THRESHOLD = 20;

const initialTratamiento = {
    id: 1,
    antibioticos: [],
    estado: 'no_iniciado',
    fechaInicio: null,
    fechaFin: null,
    diasTratamiento: 0,
    historialCompleto: {},
    fechaInicioVinculante: null,
    primerATBConFecha: null
};

const Antibioticoterapia = () => {
    const [inputValue, setInputValue] = useState('');
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const [filteredAntibiotics, setFilteredAntibiotics] = useState([]);
    const [tratamientos, setTratamientos] = useState([initialTratamiento]);
    const [tratamientoActivo, setTratamientoActivo] = useState(1);
    const [containerHeight, setContainerHeight] = useState(110);
    const [historyModal, setHistoryModal] = useState({
        isOpen: false,
        atb: null,
        position: { top: 0, left: 0 }
    });
    const [voModalState, setVOModalState] = useState({
        isOpen: false,
        atb: null,
        position: { top: 0, left: 0 }
    });
    const [historicoRetrospectivo, setHistoricoRetrospectivo] = useState({});

    let offsetY = 0;

    const tieneOpcionVO = (atb) => atb.vias?.includes('VO');
    const getAbreviatura = (atb) => {
        if (atb.type === 'biterapia') {
            return `${atb.items[0]}_${atb.items[1]}`;
        }
        return atb.abreviatura;
    };

    const addAntibiotic = (atb) => {
        const tratamientoActual = tratamientos.find(t => t.id === tratamientoActivo);
        if (!tratamientoActual || tratamientoActual.estado === 'finalizado' || tratamientoActual.estado === 'en_curso') {
            alert('No se pueden agregar antibióticos');
            return;
        }

        const abreviatura = getAbreviatura(atb);
        if (tratamientoActual.antibioticos.some(selected => getAbreviatura(selected) === abreviatura)) {
            return;
        }

        if (getAntibioticCount(tratamientoActual.antibioticos) + (atb.type === 'biterapia' ? 2 : 1) > 6) {
            alert('Máximo 6 antibióticos por tratamiento');
            return;
        }

        const fechaInicio = tratamientoActual.fechaInicio || new Date().toLocaleDateString('en-CA');
        const eventoInicial = {
            fecha: formatearFecha(fechaInicio),
            via: 'IV',
            tipo: 'inicio'
        };

        setHistoricoRetrospectivo(prev => ({
            ...prev,
            [abreviatura]: [eventoInicial]
        }));

        setTratamientos(prev => prev.map(tto =>
            tto.id === tratamientoActivo
                ? {
                    ...tto,
                    antibioticos: [...tto.antibioticos, {
                        ...atb,
                        via: 'IV',
                        fecha: fechaInicio
                    }],
                    fechaInicio: tto.antibioticos.length === 0 ? fechaInicio : tto.fechaInicio,
                    fechaInicioVinculante: fechaInicio
                }
                : tto
        ));
    };

    const removeAntibiotic = (index) => {
        const tratamientoActual = tratamientos.find(t => t.id === tratamientoActivo);

        if (tratamientoActual.estado !== 'no_iniciado' && tratamientoActual.estado !== 'modificando') {
            alert('No se pueden eliminar antibióticos durante un tratamiento en curso');
            return;
        }

        setTratamientos(prev =>
            prev.map(tto =>
                tto.id === tratamientoActivo
                    ? {
                        ...tto,
                        antibioticos: tto.antibioticos.filter((_, i) => i !== index)
                    }
                    : tto
            )
        );
    };

    const handleVOClick = (atb, index, event) => {
        const { top, left, width } = event.currentTarget.getBoundingClientRect();
        const modalPosition = {
            top: top + window.scrollY - 120,
            left: left + window.scrollX + width + 10
        };

        setVOModalState({
            isOpen: true,
            atb,
            position: modalPosition
        });
    };

    const handleFilter = (value) => {
        setInputValue(value);
        if (!value.trim()) {
            setFilteredAntibiotics([]);
            return;
        }

        const filtered = antibioticosSelector.filter(
            (atb) =>
                atb.nombre.toLowerCase().startsWith(value.toLowerCase()) ||
                atb.abreviatura.toLowerCase().startsWith(value.toLowerCase())
        );

        if (filtered.length === 0 && value.trim().length >= 3) {
            const customAtb = {
                abreviatura: value.slice(0, 3).toUpperCase(),
                nombre: value,
                color: ["#E0E0E0", "#E0E0E0"],
                vias: ["IV"],
                dosisHabitual: "No especificada",
                type: 'custom'
            };
            setFilteredAntibiotics([customAtb]);
        } else {
            setFilteredAntibiotics(filtered);
        }
    };

    const handleAddAntibiotic = (atb) => {
        const tratamientoActual = tratamientos.find(t => t.id === tratamientoActivo);

        if (!tratamientoActual || tratamientoActual.estado === 'finalizado' || tratamientoActual.estado === 'en_curso') {
            alert('No se puede agregar antibióticos a tratamientos en curso, si necesita corregir un error presione "Modificar" para habilitar la edición');
            return;
        }

        addAntibiotic(atb);
        setInputValue('');
        setFilteredAntibiotics([]);
        setIsDropdownVisible(false);
    };

    const agregarBiterapia = (biterapia) => {
        const atb1 = antibioticosSelector.find(atb => atb.abreviatura === biterapia.atb1);
        const atb2 = antibioticosSelector.find(atb => atb.abreviatura === biterapia.atb2);
        if (atb1 && atb2) {
            addAntibiotic(atb1);
            addAntibiotic(atb2);
        }
    };

    const handleRemoveAntibiotic = (index) => {
        removeAntibiotic(index);
    };

    const getAntibioticCount = (antibiotics) =>
        antibiotics.reduce((total, atb) => total + (atb.type === 'biterapia' ? 2 : 1), 0);

    const iniciarNuevoTratamiento = () => {
        const nuevoId = tratamientos.length + 1;
        setTratamientos(prev => [...prev, {
            id: nuevoId,
            antibioticos: [],
            estado: 'no_iniciado',
            fechaInicio: null,
            fechaFin: null,
            diasTratamiento: 0,
            historialCompleto: {}
        }]);
        setTratamientoActivo(nuevoId);

        setTimeout(() => {
            const container = document.querySelector('.tratamientos-container');
            const lastTreatment = container.lastElementChild;
            if (container && lastTreatment) {
                const scrollPosition = lastTreatment.offsetTop -
                    ((container.clientHeight - TREATMENT_HEIGHT) / 2);
                container.scrollTo({
                    top: scrollPosition,
                    behavior: 'smooth'
                });
            }
        }, 100);
    };

    const confirmarTratamiento = (tratamientoId) => {
        const tratamiento = tratamientos.find(t => t.id === tratamientoId);

        if (tratamiento.antibioticos.length === 0) {
            alert('Debe agregar al menos un antibiótico antes de confirmar');
            return;
        }

        const fechasInicio = new Set();
        tratamiento.antibioticos.forEach(atb => {
            fechasInicio.add(atb.fecha);
        });

        if (fechasInicio.size > 1) {
            alert('Todos los antibióticos deben tener la misma fecha de inicio');
            return;
        }

        let fechaInicio;
        if (fechasInicio.size === 1) {
            fechaInicio = Array.from(fechasInicio)[0];
        } else {
            fechaInicio = tratamiento.fechaInicio;
        }

        const hoy = new Date();
        let fechaInicioObj = convertirAFecha(fechaInicio);
        const diasTranscurridos = Math.floor(
            (hoy - fechaInicioObj) / (1000 * 60 * 60 * 24)
        );

        tratamiento.antibioticos.forEach(atb => {
            const abreviatura = getAbreviatura(atb);
            if (!historicoRetrospectivo[abreviatura]) {
                const nuevoHistorico = [{
                    fecha: fechaInicio,
                    via: atb.via,
                    tipo: 'inicio'
                }];
                setHistoricoRetrospectivo(prev => ({
                    ...prev,
                    [abreviatura]: nuevoHistorico
                }));
            }
        });

        setTratamientos(prev => prev.map(tto =>
            tto.id === tratamientoId ? {
                ...tto,
                estado: 'en_curso',
                fechaInicio: fechaInicio,
                diasTratamiento: diasTranscurridos,
                historialCompleto: {}
            } : tto
        ));
        setTratamientoActivo(tratamientoId);
    };

    const modificarTratamiento = (tratamientoId) => {
        const tratamiento = tratamientos.find(t => t.id === tratamientoId);

        if (tratamiento.estado !== 'en_curso') {
            alert('Solo se pueden modificar tratamientos en curso');
            return;
        }

        setTratamientos(prev =>
            prev.map(tto =>
                tto.id === tratamientoId
                    ? { ...tto, estado: 'modificando' }
                    : tto
            )
        );
    };

    const finalizarTratamiento = (tratamientoId) => {
        const confirmacion = window.confirm('¿Está seguro que desea finalizar el tratamiento?');

        if (confirmacion) {
            setTratamientos(prev => prev.map(tto => {
                if (tto.id === tratamientoId) {
                    const fechaFin = new Date().toLocaleDateString('en-CA');
                    let fechaInicio = convertirAFecha(tto.fechaInicio);

                    fechaInicio.setHours(0, 0, 0, 0);
                    const fechaFinObj = new Date(fechaFin);
                    fechaFinObj.setHours(0, 0, 0, 0);

                    const diasTotal = Math.floor(
                        (fechaFinObj - fechaInicio) / (1000 * 60 * 60 * 24)
                    ) + 1;

                    return {
                        ...tto,
                        estado: 'finalizado',
                        fechaFin: fechaFin,
                        diasTratamiento: diasTotal
                    };
                }
                return tto;
            }));
            setTratamientoActivo(null);
        }
    };

    const eliminarTratamiento = (tratamientoId) => {
        const confirmacion = window.confirm('¿Está seguro que desea eliminar el tratamiento?');
        if (confirmacion) {
            setTratamientos(prev => prev.filter(tto => tto.id !== tratamientoId));
            if (tratamientoActivo === tratamientoId) {
                setTratamientoActivo(null);
            }
        }
    };

    const confirmarModificaciones = (tratamientoId) => {
        // Primero verificamos si hay antibióticos
        const tratamiento = tratamientos.find(t => t.id === tratamientoId);
        
        if (tratamiento.antibioticos.length === 0) {
            alert('Debe tener al menos un antibiótico para confirmar el tratamiento');
            return; // Salimos completamente de la función
        }
    
        setTratamientos(prev => prev.map(tto => {
            if (tto.id === tratamientoId) {
                const hoy = new Date();
                const fechaInicioObj = convertirAFecha(tto.fechaInicio);
    
                if (fechaInicioObj) {
                    const diasTranscurridos = Math.floor(
                        (hoy - fechaInicioObj) / (1000 * 60 * 60 * 24)
                    );
    
                    const fechasAntibioticos = new Set(tto.antibioticos.map(atb => atb.fecha));
                    if (fechasAntibioticos.size > 1 ||
                        (fechasAntibioticos.size === 1 &&
                         Array.from(fechasAntibioticos)[0] !== tto.fechaInicio)) {
                        alert('Todas las fechas deben coincidir con la fecha de inicio (FI)');
                        return tto;
                    }
    
                    return {
                        ...tto,
                        estado: 'en_curso',
                        diasTratamiento: diasTranscurridos,
                        historialCompleto: {}
                    };
                }
                return tto;
            }
            return tto;
        }));
    };

    const handleResizeStart = (e) => {
        e.preventDefault();

        const containerTop = document.querySelector('.tratamientos-container').getBoundingClientRect().top;
        offsetY = e.clientY - containerTop - containerHeight;

        document.addEventListener('mousemove', handleResize);
        document.addEventListener('mouseup', handleResizeEnd);
    };

    const handleResize = useCallback((e) => {
        const containerTop = document.querySelector('.tratamientos-container').getBoundingClientRect().top;
        let newHeight = e.clientY - containerTop - offsetY;

        const treatmentsWithSpacing = TREATMENT_HEIGHT + TREATMENT_SPACING;
        const visibleTreatments = Math.round(newHeight / treatmentsWithSpacing);

        if (visibleTreatments >= 2) {
            const snapHeight = visibleTreatments * treatmentsWithSpacing;
            if (Math.abs(newHeight - snapHeight) < SNAP_THRESHOLD) {
                newHeight = snapHeight;
            }
        }

        const minHeight = treatmentsWithSpacing * MIN_TREATMENTS;
        const maxHeight = treatmentsWithSpacing * MAX_TREATMENTS;
        newHeight = Math.max(minHeight, Math.min(newHeight, maxHeight));

        setContainerHeight(newHeight);
    }, []);

    const handleResizeEnd = useCallback(() => {
        document.removeEventListener('mousemove', handleResize);
        document.removeEventListener('mouseup', handleResizeEnd);
    }, [handleResize]);

    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleResize);
            document.removeEventListener('mouseup', handleResizeEnd);
        };
    }, [handleResize, handleResizeEnd]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            const dropdown = document.querySelector('.antibiotics-dropdown');
            const input = document.querySelector('.antibiotics-input');

            if (dropdown && input &&
                !dropdown.contains(event.target) &&
                !input.contains(event.target)) {
                setIsDropdownVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const container = document.querySelector('.tratamientos-container');
        if (container) {
            container.style.scrollBehavior = 'smooth';
        }
    }, []);

    const commonStyles = useMemo(() => ({
        padding: '0.75rem 1rem',
        cursor: 'pointer',
        borderBottom: '1px solid rgba(229, 231, 235, 0.5)',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    }), []);

    const capsulaStyles = useMemo(() => ({
        width: '40px',
        height: '20px',
        borderRadius: '10px',
        flexShrink: '0',
        border: '1px solid #000',
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
    }), []);

    const handleHistoryClick = (e, atb) => {
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();

        const abreviatura = atb.type === 'biterapia'
            ? `${atb.items[0]}_${atb.items[1]}`
            : atb.abreviatura;

        setHistoryModal({
            isOpen: true,
            atb,
            position: {
                top: rect.top + window.scrollY - 120,
                left: rect.left + window.scrollX + 30
            }
        });
    };

    const handleViaChange = (atb, nuevaVia) => {
        const fechaActual = new Date().toLocaleDateString('en-CA');
        const abreviatura = getAbreviatura(atb);

        setHistoricoRetrospectivo(prev => {
            const historicoActual = prev[abreviatura] || [];
            return {
                ...prev,
                [abreviatura]: [
                    ...historicoActual,
                    {
                        fecha: formatearFecha(fechaActual),
                        via: nuevaVia,
                        tipo: 'switch'
                    }
                ]
            };
        });

        setTratamientos(prev => prev.map(tto => {
            if (tto.id === tratamientoActivo) {
                return {
                    ...tto,
                    antibioticos: tto.antibioticos.map(ab =>
                        ab === atb ? { ...ab, via: nuevaVia } : ab
                    )
                };
            }
            return tto;
        }));

        setVOModalState({ isOpen: false, atb: null, position: { top: 0, left: 0 } });
    };

    const renderTratamiento = (tratamiento, index) => {
        const tratamientoActual = tratamientos.find(t => t.id === tratamientoActivo);
        const isEditable = tratamiento.estado === 'no_iniciado' || tratamiento.estado === 'modificando';

        return (
            <div
                key={tratamiento.id}
                style={{
                    display: 'grid',
                    gridTemplateColumns: '50% 50%',
                    alignItems: 'start',
                    border: '1px solid #ccc',
                    borderRadius: '10px',
                    padding: '1.25rem',
                    backgroundColor: tratamiento.id === tratamientoActivo ? '#f0f8ff' : '#fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    height: TREATMENT_HEIGHT - 15,
                    minHeight: TREATMENT_HEIGHT - 15,
                    overflow: 'hidden',
                    scrollSnapAlign: 'start',
                    marginTop: tratamiento.id === 1 && tratamientos.length === 1 ?
                        `${(containerHeight - TREATMENT_HEIGHT) / 2}px` : '1rem',
                    marginTop: '0rem',
                    marginBottom: index === tratamientos.length - 1 ? '0' : '1rem'
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.1rem'}}>
                        {tratamiento.antibioticos.map((block, index) => {
                            return (
                                <div
                                    key={index}
                                    className="capsulas-ATB"
                                    title={block.nombre}
                                    onClick={() => {
                                        if (isEditable) {
                                            handleRemoveAntibiotic(index);
                                        }
                                    }}
                                    style={{
                                        background: `linear-gradient(to right, ${block.color[0]} 50%, ${block.color[1]} 50%)`,
                                        color: esColorClaro(block.color[0]) ? '#000' : '#fff',
                                        position: 'relative',
                                        cursor: isEditable ? 'pointer' : 'default'
                                    }}
                                >
                                    {block.abreviatura}

                                    <div
                                        className="history-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleHistoryClick(e, block);
                                        }}
                                    >
                                        <Clock size={20} />
                                    </div>

                                    {tieneOpcionVO(block) && (
                                        <div
                                            className={block.via === 'VO' ? "vo-label" : "vo-hover-button"}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleVOClick(block, index, e);
                                            }}
                                        >
                                            VO
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {tratamiento.estado === 'finalizado' ? (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '1rem',
                                whiteSpace: 'nowrap'
                            }}>
                                <span>
                                    <strong>FI:</strong> {tratamiento.fechaInicio}
                                </span>
                                <span>
                                    <strong>FF:</strong> {tratamiento.fechaFin}
                                </span>
                                <span style={{
                                    color: '#dc3545',
                                    fontWeight: 'bold',
                                    marginLeft: '0.25rem'
                                }}>
                                    {tratamiento.diasTratamiento} Días de Tratamiento
                                </span>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>FI: </span>
                                    {(tratamiento.estado === 'no_iniciado' || tratamiento.estado === 'modificando') ? (
                                        <input
                                            type="date"
                                            value={tratamiento.fechaInicio}
                                            onChange={(e) => {
                                                const nuevaFecha = e.target.value;
                                                setTratamientos(prev => updateTreatmentDate(prev, tratamiento.id, nuevaFecha));
                                                setHistoricoRetrospectivo(prev =>
                                                    updateInitialEventDate(prev, tratamiento, nuevaFecha, getAbreviatura)
                                                );
                                            }}
                                            max={new Date().toLocaleDateString('en-CA')}
                                            style={{
                                                padding: '0.01rem',
                                                borderRadius: '4px',
                                                border: '1px solid #ccc',
                                                fontSize: '0.8rem',
                                                height: '24px',
                                                width: '115px'
                                            }}
                                        />
                                    ) : (
                                        <span>{tratamiento.fechaInicio}</span>
                                    )}
                                </div>
                                {tratamiento.estado === 'en_curso' && (
                                    <div style={{ color: '#dc3545', fontWeight: 'bold' }}>
                                        D{tratamiento.diasTratamiento} de TTO
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                        {tratamiento.estado === 'no_iniciado' && (
                            <button
                                onClick={() => confirmarTratamiento(tratamiento.id)}
                                style={{
                                    padding: '0.25rem 0.75rem',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    height: '28px'
                                }}
                            >
                                Confirmar Tratamiento
                            </button>
                        )}
                        {tratamiento.estado === 'en_curso' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => modificarTratamiento(tratamiento.id)}
                                        style={{
                                            padding: '0.25rem 0.75rem',
                                            backgroundColor: '#ffa500',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem',
                                            height: '28px'
                                        }}
                                    >
                                        Modificar
                                    </button>
                                    <button
                                        onClick={() => eliminarTratamiento(tratamiento.id)}
                                        style={{
                                            padding: '0.25rem 0.75rem',
                                            backgroundColor: '#dc3545',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem',
                                            height: '28px'
                                        }}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                                <button
                                    onClick={() => finalizarTratamiento(tratamiento.id)}
                                    style={{
                                        padding: '0.25rem 0.75rem',
                                        backgroundColor: '#4CAF50',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        width: '100%',
                                        fontSize: '0.8rem',
                                        height: '28px'
                                    }}
                                >
                                    Finalizar Tratamiento
                                </button>
                            </div>
                        )}
                        {tratamiento.estado === 'modificando' && (
                            <button
                                onClick={() => confirmarModificaciones(tratamiento.id)}
                                style={{
                                    padding: '0.25rem 0.75rem',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    marginTop: '0.5rem',
                                    fontSize: '0.8rem',
                                    height: '28px'
                                }}
                            >
                                Confirmar Cambios
                            </button>
                        )}
                        {tratamiento.estado === 'finalizado' && (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => {
                                        const confirmar = window.confirm('¿Desea modificar este tratamiento finalizado?');
                                        if (confirmar) {
                                            setTratamientos(prev => prev.map(tto =>
                                                tto.id === tratamiento.id
                                                    ? { ...tto, estado: 'modificando' }
                                                    : tto
                                            ));
                                            setTratamientoActivo(tratamiento.id);
                                        }
                                    }}
                                    style={{
                                        padding: '0.25rem 0.75rem',
                                        backgroundColor: '#ffa500',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem',
                                        height: '28px'
                                    }}
                                >
                                    Editar
                                </button>
                                <span style={{ color: '#666', alignSelf: 'center' }}>
                                    Tratamiento Finalizado
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const getEstadoStyle = (estado) => {
        switch (estado) {
            case 'en_curso':
                return {
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: '2px solid #45a049'
                };
            case 'finalizado':
                return {
                    backgroundColor: '#607d8b',
                    color: 'white',
                    border: '2px solid #546e7a'
                };
            case 'modificando':
                return {
                    backgroundColor: '#ffa726',
                    color: 'white',
                    border: '2px solid #fb8c00'
                };
            default:
                return {
                    backgroundColor: '#90caf9',
                    color: 'white',
                    border: '2px solid #64b5f6'
                };
        }
    };

    const getEstadoLabel = (estado) => {
        switch (estado) {
            case 'en_curso':
                return '⚡ En Curso';
            case 'finalizado':
                return '✓ Finalizado';
            case 'modificando':
                return '✎ Modificando';
            default:
                return '⭐ Nuevo';
        }
    };

    return (
<div className="container">
<div style={{ 
    display: 'flex', 
    alignItems: 'start',
    gap: '2rem',
    marginBottom: '0.5rem', 
    position: 'relative' // Añade esta línea
}}>
    <div style={{ flexGrow: 1 }}>
        <h3 style={{
            margin: '0 0 0.5rem',
            textAlign: 'left',
            color: '#333'
        }}>
            Antibioticoterapia
        </h3>
        <hr style={{
            border: 'none',
            borderTop: '2px solid #333',
            margin: '0 0 0.5rem'
        }} />
    </div>
    <div style={{ 
    width: '430px', 
    height: '100px', 
    position: 'absolute', 
    top: '-10px', 
    left: '0' // O right: '0' según prefieras
}}>
<StickyNote 
    position={{ x: 800, y: -20 }}
/>
</div>
</div>

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '1rem',
                backgroundColor: '#fff',
                maxWidth: '900px',
                margin: '0 auto'
            }}>
                <div
                    className="tratamientos-container"
                    style={{
                        border: '1px solid #ddd',
                        borderRadius: '12px 12px 0 0',
                        borderBottom: 'none',
                        padding: '1rem',
                        backgroundColor: '#f9f9f9',
                        height: `${containerHeight}px`,
                        overflowY: 'auto',
                        position: 'relative',
                        scrollSnapType: 'y mandatory',
                        scrollPadding: '1rem',
                        scrollBehavior: 'smooth'
                    }}
                >
                    {tratamientos.map(renderTratamiento)}
                </div>

                <div
                    style={{
                        width: '100%',
                        height: '10px',
                        backgroundColor: '#e0e0e0',
                        borderRadius: '0 0 12px 12px',
                        cursor: 'ns-resize',
                        position: 'relative',
                        borderTop: '1px solid #ccc',
                        border: '1px solid #ddd',
                        borderTop: 'none',
                        marginTop: '-1px'
                    }}
                    onMouseDown={handleResizeStart}
                >
                    <div style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '50px',
                        height: '4px',
                        backgroundColor: '#999',
                        borderRadius: '2px',
                        top: '3px'
                    }} />
                </div>
            </div>

            <div style={{
                marginTop: '1rem',
                position: 'relative',
                zIndex: 50,
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
            }}>
                <input
                    className="antibiotics-input"
                    type="text"
                    value={inputValue}
                    onChange={(e) => handleFilter(e.target.value)}
                    placeholder="Buscar antibiótico..."
                    style={{
                        width: '245px',
                        padding: '0.4rem 0.2rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.2s',
                        backgroundColor: 'white',
                        height: '15px'
                    }}
                    onFocus={() => setIsDropdownVisible(true)}
                />

                {isDropdownVisible && filteredAntibiotics.length > 0 && (
                    <div
                        className="antibiotics-dropdown"
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            width: '250px',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            backgroundColor: 'rgba(255, 255, 255, 0.98)',
                            borderRadius: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            border: '1px solid rgba(229, 231, 235, 0.8)',
                            marginTop: '0.25rem',
                            backdropFilter: 'blur(8px)',
                            zIndex: 51
                        }}
                    >
                        {filteredAntibiotics.map((atb, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    handleAddAntibiotic(atb);
                                    setInputValue('');
                                    setIsDropdownVisible(false);
                                }}
                                style={{
                                    ...commonStyles,
                                    padding: '0.4rem 0.75rem',
                                    fontSize: '0.75rem'
                                }}
                            >
                                <div style={{
                                    ...capsulaStyles,
                                    background: `linear-gradient(to right, ${atb.color[0]} 50%, ${atb.color[1]} 50%)`,
                                }} />
                                <div>
                                    <strong style={{ fontSize: '0.75rem' }}>{atb.abreviatura}</strong>
                                    <span style={{ color: '#666', marginLeft: '0.5rem', fontSize: '0.75rem' }}>
                                        {atb.nombre}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <button
                    onClick={iniciarNuevoTratamiento}
                    disabled={tratamientos.some(t => t.estado !== 'finalizado')}
                    style={{
                        marginLeft: '0.5rem',
                        padding: '0.25rem 0.75rem',
                        backgroundColor: tratamientos.some(t => t.estado !== 'finalizado') ? '#cccccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: tratamientos.some(t => t.estado !== 'finalizado') ? 'not-allowed' : 'pointer',
                        opacity: tratamientos.some(t => t.estado !== 'finalizado') ? 0.7 : 1,
                        fontSize: '0.8rem',
                        height: '28px'
                    }}
                >
                    Nuevo Tratamiento
                </button>
                <div style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '16px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    height: '24px',
                    ...getEstadoStyle(tratamientoActivo ? tratamientos.find(t => t.id === tratamientoActivo).estado : '')
                }}>
                    <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'currentColor',
                        opacity: 0.8
                    }}></span>
                    {getEstadoLabel(tratamientoActivo ? tratamientos.find(t => t.id === tratamientoActivo).estado : '')}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', marginTop: '1rem' }}>
                <div style={{ flex: '1', margin: '0', textAlign: 'center', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                    <h3>IV</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', justifyItems: 'center' }}>
                        {antibioticosIVFrecuentes.map((atb, index) => (
                            <div
                                key={index}
                                title={atb.nombre}
                                className="capsulas-ATB"
                                onClick={() => handleAddAntibiotic(atb)}
                                style={{
                                    background: `linear-gradient(to right, ${atb.color[0]} 50%, ${atb.color[1]} 50%)`,
                                    color: esColorClaro(atb.color[0]) ? '#000' : '#fff',
                                    cursor: 'pointer',
                                }}
                            >
                                {atb.abreviatura}
                            </div>
                        ))}
                    </div>
                </div>
                <div style={{ flex: '1', margin: '0 0.5rem', textAlign: 'center', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                    <h3>Biterapia</h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '1rem',
                        justifyItems: 'center',
                    }}>
                        {biterapiasFrecuentes.map((bt, index) => {
                            const atb1Data = antibioticosIVFrecuentes.find(atb => atb.abreviatura === bt.atb1);
                            const atb2Data = antibioticosIVFrecuentes.find(atb => atb.abreviatura === bt.atb2);

                            return (
                                <div
                                    key={index}
                                    className="combinacion-container"
                                    onClick={() => agregarBiterapia(bt)}
                                >
                                    {atb1Data && (
                                        <div
                                            className="capsulas-ATB"
                                            title={atb1Data.nombre}
                                            style={{
                                                background: `linear-gradient(to right, ${atb1Data.color[0]} 50%, ${atb1Data.color[1]} 50%)`,
                                                color: esColorClaro(atb1Data.color[0]) ? '#000' : '#fff',
                                            }}
                                        >
                                            {atb1Data.abreviatura}
                                        </div>
                                    )}
                                    {atb2Data && (
                                        <div
                                            className="capsulas-ATB"
                                            title={atb2Data.nombre}
                                            style={{
                                                background: `linear-gradient(to right, ${atb2Data.color[0]} 50%, ${atb2Data.color[1]} 50%)`,
                                                color: esColorClaro(atb2Data.color[0]) ? '#000' : '#fff',
                                            }}
                                        >
                                            {atb2Data.abreviatura}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div style={{ flex: '1', margin: '0', textAlign: 'center', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                    <h3>VO</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', justifyItems: 'center' }}>
                        {antibioticosVOFrecuentes.map((atb, index) => (
                            <div
                                key={index}
                                title={atb.nombre}
                                className="capsulas-ATB"
                                onClick={() => handleAddAntibiotic(atb)}
                                style={{
                                    background: `linear-gradient(to right, ${atb.color[0]} 50%, ${atb.color[1]} 50%)`,
                                    color: esColorClaro(atb.color[0]) ? '#000' : '#fff',
                                    cursor: 'pointer',
                                }}
                            >
                                {atb.abreviatura}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <HistoryModal
                isOpen={historyModal.isOpen}
                onClose={() => setHistoryModal({ isOpen: false, atb: null })}
                atb={historyModal.atb}
                position={historyModal.position}
                tratamientoActual={tratamientos.find(t => t.id === tratamientoActivo)}
                historicoRetrospectivo={historyModal.atb ?
                    historicoRetrospectivo[getAbreviatura(historyModal.atb)] || []
                    : []
                }
                setHistoricoRetrospectivo={setHistoricoRetrospectivo}
                setTratamientos={setTratamientos}
                tratamientoActivo={tratamientoActivo}
                getAbreviatura={getAbreviatura}
                editable={true}
            />

            <VOModal
                isOpen={voModalState.isOpen}
                onClose={() => setVOModalState({ isOpen: false, atb: null, position: { top: 0, left: 0 } })}
                atb={voModalState.atb}
                onViaChange={handleViaChange}
                onHistoryClick={handleHistoryClick}
                position={voModalState.position}
                tratamientoEstado={tratamientos.find(t => t.id === tratamientoActivo)?.estado}
            />
        </div>
    );
}

export default Antibioticoterapia;
