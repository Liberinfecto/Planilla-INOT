import React, { useState } from 'react';
import { X, Plus, Trash } from 'lucide-react';
import { validarFechaHistorial, formatearFecha } from './dateUtils';

const HistoryModal = ({
    isOpen,
    onClose,
    atb,
    position = { top: 0, left: 0 },
    tratamientoActual,
    historicoRetrospectivo = [],
    setHistoricoRetrospectivo,
    setTratamientos,
    tratamientoActivo,
    getAbreviatura,
    editable = true
}) => {
    if (!isOpen || !atb) return null;

    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [nuevoEvento, setNuevoEvento] = useState({
        fecha: '',
        via: historicoRetrospectivo.length === 0 ? 'IV' :
             (historicoRetrospectivo[historicoRetrospectivo.length - 1].via === 'IV' ? 'VO' : 'IV'),
        tipo: historicoRetrospectivo.length === 0 ? 'inicio' : 'switch'
    });

    const handleHistoricoEventGlobal = (accion, datos) => {
        const { abreviatura, historicoActualizado } = datos;

        setHistoricoRetrospectivo(prev => {
            const nuevoHistorico = { ...prev };
            if (historicoActualizado.length === 0) {
                delete nuevoHistorico[abreviatura];
            } else {
                nuevoHistorico[abreviatura] = historicoActualizado;
            }
            return nuevoHistorico;
        });

        setTratamientos(prev => prev.map(tto => {
            if (tto.id === tratamientoActivo) {
                return {
                    ...tto,
                    antibioticos: tto.antibioticos.map(ab =>
                        getAbreviatura(ab) === abreviatura
                            ? { ...ab, via: historicoActualizado[historicoActualizado.length - 1]?.via || 'IV' }
                            : ab
                    ),
                    historialCompleto: {
                        ...tto.historialCompleto,
                        [abreviatura]: historicoActualizado.length > 0
                            ? { eventos: historicoActualizado }
                            : undefined
                    }
                };
            }
            return tto;
        }));
    };

    const handleHistoricoEvent = (accion, evento) => {
        const abreviatura = atb.type === 'biterapia' ?
            `${atb.items[0]}_${atb.items[1]}` : atb.abreviatura;

        if (accion === 'eliminar') {
            const nuevoHistorico = historicoRetrospectivo.filter((_, i) => i !== evento);

            if (nuevoHistorico.length > 0) {
                const ultimoEvento = nuevoHistorico[nuevoHistorico.length - 1];
                setNuevoEvento(prev => ({
                    ...prev,
                    via: ultimoEvento.via === 'IV' ? 'VO' : 'IV'
                }));
            } else {
                setNuevoEvento({
                    fecha: '',
                    via: 'IV',
                    tipo: 'inicio'
                });
            }

            handleHistoricoEventGlobal('eliminar', {
                abreviatura,
                historicoActualizado: nuevoHistorico
            });
        }

        if (accion === 'agregar') {
            const eventoFormateado = {
                ...evento,
                fecha: formatearFecha(evento.fecha),
                tipo: historicoRetrospectivo.length === 0 ? 'inicio' : 'switch'
            };

            const nuevoHistorico = [...historicoRetrospectivo, eventoFormateado];

            handleHistoricoEventGlobal('agregar', {
                abreviatura,
                historicoActualizado: nuevoHistorico
            });

            setMostrarFormulario(false);
            setNuevoEvento({
                fecha: '',
                via: nuevoHistorico[nuevoHistorico.length - 1].via === 'IV' ? 'VO' : 'IV',
                tipo: 'switch'
            });
        }
    };

    const renderHistorial = () => {
        const tieneOpcionVO = atb.vias?.includes('VO');
        const ultimaVia = historicoRetrospectivo.length > 0 ?
            historicoRetrospectivo[historicoRetrospectivo.length - 1].via : 'IV';

        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: '1rem'
            }}>
                {historicoRetrospectivo.map((evento, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '8px',
                            borderBottom: '1px solid #e5e7eb',
                            backgroundColor: evento.tipo === 'inicio' ? '#f0f9ff' : '#ffffff',
                            position: 'relative'
                        }}
                    >
                        <div style={{
                            minWidth: '85px',
                            fontSize: '14px',
                            color: '#4b5563',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                        }}>
                            {evento.tipo === 'inicio' && (
                                <div
                                    title="Fecha vinculada al tratamiento"
                                    style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        backgroundColor: '#3b82f6',
                                        marginRight: '4px'
                                    }}
                                />
                            )}
                            {evento.fecha}
                        </div>
                        <div style={{
                            fontSize: '14px',
                            fontWeight: evento.tipo === 'inicio' ? '600' : '500',
                            color: '#111827'
                        }}>
                            {evento.tipo === 'inicio' ? `Inicio en ${evento.via}` : `Switch a ${evento.via}`}
                        </div>
                        {index > 0 && (
                            <div style={{
                                marginLeft: 'auto',
                                fontSize: '12px',
                                color: '#6b7280'
                            }}>
                                {`${historicoRetrospectivo[index-1].via} → ${evento.via}`}
                            </div>
                        )}

                        {editable && (index === historicoRetrospectivo.length - 1) && (index !== 0) && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleHistoricoEvent('eliminar', index);
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: '4px',
                                    cursor: 'pointer',
                                    color: '#ef4444'
                                }}
                            >
                                <Trash size={16} />
                            </button>
                        )}

                        {(index === 0 && tieneOpcionVO) && (
                            <div
                                style={{
                                    position: 'relative',
                                    width: '24px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    backgroundColor: '#f0f0f0',
                                    marginLeft: 'auto',
                                    padding: '2px',
                                    cursor: historicoRetrospectivo.length > 1 ? 'not-allowed' : 'pointer',
                                    opacity: historicoRetrospectivo.length > 1 ? 0.6 : 1
                                }}
                                onClick={() => {
                                    if (historicoRetrospectivo.length > 1) return;

                                    const nuevaVia = evento.via === 'IV' ? 'VO' : 'IV';
                                    const nuevoHistorico = [...historicoRetrospectivo];
                                    nuevoHistorico[0] = {
                                        ...nuevoHistorico[0],
                                        via: nuevaVia
                                    };

                                    setNuevoEvento(prev => ({
                                        ...prev,
                                        via: nuevaVia === 'IV' ? 'VO' : 'IV'
                                    }));

                                    handleHistoricoEventGlobal('agregar', {
                                        abreviatura: getAbreviatura(atb),
                                        historicoActualizado: nuevoHistorico
                                    });
                                }}
                            >
                                <div
                                    style={{
                                        position: 'absolute',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        backgroundColor: 'white',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                        transition: 'transform 0.3s ease',
                                        transform: `translateY(${evento.via === 'IV' ? '2px' : '24px'})`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '12px',
                                        fontWeight: 'bold',
                                        color: evento.via === 'IV' ? '#2196F3' : '#4CAF50'
                                    }}
                                >
                                    {evento.via}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {editable && tieneOpcionVO && (
                    !mostrarFormulario ? (
                        <button
                            onClick={() => setMostrarFormulario(true)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                marginTop: '1rem'
                            }}
                        >
                            <Plus size={16} />
                            Registrar Switch
                        </button>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
<div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
    <input
        type="date"
        value={nuevoEvento.fecha}
        onChange={(e) => setNuevoEvento({
            ...nuevoEvento,
            fecha: e.target.value,
            via: tieneOpcionVO ? nuevoEvento.via : 'IV'
        })}
        disabled={historicoRetrospectivo.length === 0 && tratamientoActual?.fechaInicioVinculante}
        min={historicoRetrospectivo.length > 0 ? 
            (() => {
                const ultimaFecha = new Date(historicoRetrospectivo[historicoRetrospectivo.length - 1].fecha.split('/').reverse().join('-'));
                ultimaFecha.setDate(ultimaFecha.getDate() + 1);
                return ultimaFecha.toISOString().split('T')[0];
            })() :
            tratamientoActual?.fechaInicioVinculante
        }
        max={new Date().toISOString().split('T')[0]}
        style={{
            padding: '0.5rem',
            border: `1px solid ${!nuevoEvento.fecha ? '#ef4444' : '#d1d5db'}`,
            borderRadius: '0.375rem',
            width: '130px',
            opacity: historicoRetrospectivo.length === 0 && tratamientoActual?.fechaInicioVinculante ? 0.7 : 1
        }}
    />

    {tieneOpcionVO && (
        <div
            style={{
                position: 'relative',
                width: '24px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#f0f0f0',
                padding: '2px',
                cursor: 'default' // Ya no es clickeable
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    transition: 'transform 0.3s ease',
                    transform: historicoRetrospectivo.length === 0 
                        ? `translateY(${nuevoEvento.via === 'IV' ? '2px' : '24px'})`
                        : `translateY(${historicoRetrospectivo[historicoRetrospectivo.length - 1].via === 'IV' ? '24px' : '2px'})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: historicoRetrospectivo.length === 0 
                        ? (nuevoEvento.via === 'IV' ? '#2196F3' : '#4CAF50')
                        : (historicoRetrospectivo[historicoRetrospectivo.length - 1].via === 'IV' ? '#4CAF50' : '#2196F3')
                }}
            >
                {historicoRetrospectivo.length === 0 
                    ? nuevoEvento.via 
                    : (historicoRetrospectivo[historicoRetrospectivo.length - 1].via === 'IV' ? 'VO' : 'IV')}
            </div>
        </div>
    )}
</div>

                            {historicoRetrospectivo.length === 0 && tratamientoActual?.fechaInicioVinculante && (
                                <div style={{
                                    backgroundColor: '#f0f9ff',
                                    border: '1px solid #93c5fd',
                                    borderRadius: '4px',
                                    padding: '8px',
                                    fontSize: '0.8rem',
                                    color: '#1e40af',
                                    marginTop: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    <svg
                                        width="16" height="16" viewBox="0 0 16 16" fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412l-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"
                                            fill="#3b82f6"
                                        />
                                    </svg>
                                    Fecha de inicio vinculada al tratamiento: {formatearFecha(tratamientoActual.fechaInicioVinculante)}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    onClick={() => {
                                        if (!nuevoEvento.fecha) {
                                            alert('Debe seleccionar una fecha');
                                            return;
                                        }
                                        handleHistoricoEvent('agregar', nuevoEvento);
                                    }}
                                    style={{
                                        flex: 1,
                                        padding: '0.5rem',
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.375rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {tieneOpcionVO ? 'Agregar' : 'Confirmar'}
                                </button>
                                <button
                                    onClick={() => setMostrarFormulario(false)}
                                    style={{
                                        flex: 1,
                                        padding: '0.5rem',
                                        backgroundColor: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '0.375rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    )
                )}
            </div>
        );
    };

    return (
        <div
            className="modal-content"
            style={{
                position: 'absolute',
                top: position.top,
                left: position.left,
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '16px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                border: '1px solid #ccc',
                zIndex: 1000,
                width: '80%',
                maxWidth: '250px',
                maxHeight: '60vh',
                overflowY: 'auto',
            }}
        >
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px'
            }}>
                <h3 style={{
                    margin: 0,
                    fontSize: '16px',
                    fontWeight: 'bold'
                }}>
                    {atb?.nombre} ({atb?.abreviatura})
                </h3>
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        padding: '4px',
                        cursor: 'pointer'
                    }}
                >
                    <X size={20} color="#666" />
                </button>
            </div>

            <div className="mt-4">
                {renderHistorial()}
            </div>
        </div>
    );
};

export default HistoryModal;
