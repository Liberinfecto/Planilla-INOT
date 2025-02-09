import React from 'react';
import { X, Calendar, Beaker } from 'lucide-react';

const VOModal = ({
    isOpen,
    onClose,
    atb,
    onViaChange,
    onHistoryClick,
    position = { top: 0, left: 0 },
    tratamientoEstado // Nueva prop
}) => {
    if (!isOpen) return null;

    const viaActual = atb?.via || 'IV';
    const nuevaVia = viaActual === 'IV' ? 'VO' : 'IV';
    const puedeModificar = tratamientoEstado === 'en_curso'; // Nueva validación

    const handleConfirm = () => {
        onViaChange(atb, nuevaVia);
        onClose();
    };

    return (
        <div
            style={{
                position: 'absolute',
                top: position.top,
                left: position.left,
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
                border: '1px solid #eee',
                zIndex: 1000,
                width: '280px',
                maxWidth: '280px',
                boxSizing: 'border-box',
                overflow: 'hidden'
            }}
        >
            {/* Header con ícono y nombre del antibiótico */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px'
            }}>
                <div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <Beaker size={18} />
                        <h3 style={{
                            fontSize: '16px',
                            fontWeight: 'bold',
                            margin: 0,
                            color: '#333'
                        }}>
                            Cambio de vía
                        </h3>
                    </div>
                    <p style={{
                        fontSize: '14px',
                        color: '#666',
                        margin: '4px 0 0 0'
                    }}>
                        {atb?.nombre} ({atb?.abreviatura})
                    </p>
                    <div style={{
                        display: 'inline-block',
                        padding: '4px 8px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        marginTop: '8px',
                        fontSize: '13px'
                    }}>
                        {viaActual} → {nuevaVia}
                    </div>
                </div>
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

            {/* Botón de historial */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onHistoryClick(e, atb);
                    onClose();
                }}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'none',
                    border: 'none',
                    padding: '8px 0',
                    cursor: 'pointer',
                    color: '#2196F3',
                    fontSize: '14px'
                }}
            >
                <Calendar size={16} />
                Ver historial de cambios
            </button>

            {/* Botones de acción */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '8px',
                marginTop: '16px',
                borderTop: '1px solid #eee',
                paddingTop: '16px'
            }}>
                <button
                    onClick={onClose}
                    style={{
                        flex: '1',
                        padding: '8px 16px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        backgroundColor: '#fff',
                        color: '#333',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    Cancelar
                </button>
                <button
                    onClick={handleConfirm}
                    disabled={!puedeModificar}
                    style={{
                        flex: '1',
                        padding: '8px 16px',
                        border: 'none',
                        borderRadius: '6px',
                        backgroundColor: !puedeModificar ? '#ccc' :
                            (nuevaVia === 'VO' ? '#4CAF50' : '#2196F3'),
                        color: 'white',
                        cursor: puedeModificar ? 'pointer' : 'not-allowed',
                        fontSize: '14px',
                        opacity: puedeModificar ? 1 : 0.7
                    }}
                >
                    {!puedeModificar ? 'Inicie tratamiento' : 'Cambiar vía'}
                </button>
            </div>
        </div>
    );
};

export default VOModal;
