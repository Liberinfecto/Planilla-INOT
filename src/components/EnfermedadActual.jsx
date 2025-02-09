import { useState, useEffect } from 'react';
import 'regenerator-runtime/runtime';
import { Mic, MicOff } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function EnfermedadActual() {
    const [selecciones, setSelecciones] = useState({
        sintomas: {
            dolor: '',
            fiebre: '',
            supuracion: '',
            signosfluxivos: '',
            impotenciafuncional: '',
            fistula: '',
            dehiscenciaherida: '',
            detalles: ''
        },
        fractura: {
            value: '',
            fecha: '',
            tipo: '',
            detalles: '',
            hueso: {
                value: '',
                tipo: '',
                desplazamiento: '',
                gustilo: '',
            },
            huesos: []
        },
        osteosintesis: {
            value: '',
            fecha: '',
            detalles: '',
            tipos: []
        },
        irf: {
            value: '',
            fecha: '',
            tipo: '',
            detalles: ''
        },
        isq: {
            value: '',
            fecha: '',
            tipoHq: '',
            tipo: '',
            detalles: ''
        },
        osteomielitis: {
            value: '',
            fecha: '',
            tipo: '',
            detalles: ''
        },
        artritisSeptica: {
            value: '',
            fecha: '',
            tipo: '',
            detalles: ''
        },
        ipp: {
            value: '',
            fechaColocacion: '',
            fechaSintomas: '',
            tipo: '',
            detalles: ''
        },
        espondilodiscitis: {
            value: '',
            fecha: '',
            tipo: '',
            detalles: '',
            osteosintesis: {
                value: '',
                fecha: '',
                detalles: ''
            }
        }
    });

    const [isListening, setIsListening] = useState(false);
    const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    const handleSeleccionChange = (campo, subcampo, valor) => {
        setSelecciones(prev => ({
            ...prev,
            [campo]: {
                ...prev[campo],
                [subcampo]: valor
            }
        }));
    };

    const handleNestedChange = (campo, subcampo, nestedCampo, valor) => {
        setSelecciones(prev => ({
            ...prev,
            [campo]: {
                ...prev[campo],
                [subcampo]: {
                    ...prev[campo][subcampo],
                    [nestedCampo]: valor
                }
            }
        }));
    };

    const handleArrayChange = (campo, arrayName, index, valor) => {
        setSelecciones(prev => {
            const newArray = [...prev[campo][arrayName]];
            newArray[index] = { ...newArray[index], ...valor };
            return {
                ...prev,
                [campo]: {
                    ...prev[campo],
                    [arrayName]: newArray
                }
            };
        });
    };

    const handleAddArrayItem = (campo, arrayName, itemTemplate) => {
        setSelecciones(prev => ({
            ...prev,
            [campo]: {
                ...prev[campo],
                [arrayName]: [...prev[campo][arrayName], itemTemplate]
            }
        }));
    };

    const handleRemoveArrayItem = (campo, arrayName, index) => {
        setSelecciones(prev => ({
            ...prev,
            [campo]: {
                ...prev[campo],
                [arrayName]: prev[campo][arrayName].filter((_, i) => i !== index)
            }
        }));
    };

    const handleFechaChange = (campo, subcampo, fecha, validaciones) => {
        const fechaNueva = new Date(fecha);

        if (fechaNueva > new Date()) {
            alert('La fecha no puede ser posterior a hoy');
            return;
        }

        if (validaciones) {
            for (const validacion of validaciones) {
                // Normalizar el formato de la fecha a comparar
                const fechaComparar = validacion.campo === 'fractura' ?
                    new Date(selecciones[validacion.campo][validacion.subcampo].split('/').reverse().join('-')) :
                    new Date(selecciones[validacion.campo][validacion.subcampo]);

                if (validacion.tipo === 'anterior' && fechaNueva < fechaComparar) {
                    alert(validacion.mensaje);
                    return;
                }
                if (validacion.tipo === 'posterior' && fechaNueva < fechaComparar) {
                    alert('La fecha de IRF no puede ser anterior a la fecha de fractura');
                    return;
                }
            }
        }

        handleSeleccionChange(campo, subcampo, fecha);
    };

    const calcularClasificacion = (tipoInfeccion, fechas) => {
        const { fechaInicial, fechaSintomas } = fechas;
        const diferenciaDias = Math.floor((new Date(fechaSintomas) - new Date(fechaInicial)) / (1000 * 60 * 60 * 24));

        switch (tipoInfeccion) {
            case 'irf':
                if (diferenciaDias <= 14) return 'aguda';
                if (diferenciaDias <= 70) return 'retrasada';
                return 'tardia';
            case 'osteomielitis':
            case 'artritisSeptica':
                return diferenciaDias <= 21 ? 'aguda' : 'cronica';
            case 'ipp':
                return diferenciaDias <= 30 ? 'aguda' : 'cronica';
            case 'espondilodiscitis':
                if (!fechaInicial) return diferenciaDias <= 14 ? 'aguda' : 'cronica';
                if (diferenciaDias <= 14) return 'temprana';
                if (diferenciaDias <= 70) return 'retrasada';
                return 'tardia';
            default:
                return '';
        }
    };

    const huesos = {
        'Miembro Superior': ['Húmero', 'Radio', 'Cúbito', 'Clavícula', 'Escápula', 'Carpo'],
        'Cadera/Pelvis': ['Pelvis', 'Acetábulo', 'Cabeza Femoral', 'Cuello Femoral', 'Intertrocantérica', 'Subtrocantérica', 'Ilíaco', 'Isquion', 'Pubis', 'Sacro'],
        'Miembro Inferior': ['Fémur', 'Rótula', 'Tibia', 'Pilón Tibial', 'Peroné', 'Tobillo', 'Calcáneo', 'Tarso']
    };

    const tiposOsteosintesis = [
        'FFEE', 'EEM', 'Placas', 'Tornillos', 'Fijador Ilizarov',
        'Alambres de Kirschner', 'Grapas metálicas', 'Otros'
    ];

    const clasificacionGustilo = ['I', 'II', 'IIIa', 'IIIb', 'IIIc'];

    const clasificacionHQ = [
        'Limpia', 'Limpia-Contaminada', 'Contaminada', 'Sucia'
    ];

    const clasificacionISQ = [
        'Superficial', 'Profunda', 'Organo-Espacio'
    ];

    const handleListen = () => {
        if (!isListening) {
            setIsListening(true);
            SpeechRecognition.startListening({ continuous: true, language: 'es-ES' });
        } else {
            setIsListening(false);
            SpeechRecognition.stopListening();
        }
    };

    useEffect(() => {
        if (transcript) {
            handleSeleccionChange('sintomas', 'detalles',
                (selecciones.sintomas?.detalles || '') + ' ' + transcript);
        }
    }, [transcript]);

    return (
        <div className="container">
            <h3 style={{
                margin: '0 0 1rem',
                textAlign: 'left',
                color: '#333'
            }}>
                Enfermedad Actual
            </h3>
            <hr style={{
                border: 'none',
                borderTop: '2px solid #333',
                margin: '0 0 1rem'
            }} />

            <div className="enfermedad-container">
                <table className="risk-table">
                    <thead>
                        <tr>
                            <th style={{ width: '15%' }}>Síntomas</th>
                            <th style={{ width: '85%' }}>Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {['Dolor', 'Fiebre', 'Supuración', 'Signos Fluxivos', 'Impotencia Funcional', 'Fístula', 'Dehiscencia de la Herida'].map((sintoma) => (
                            <tr key={sintoma}>
                                <td
                                    onClick={() => handleSeleccionChange('sintomas', sintoma.toLowerCase(),
                                        selecciones.sintomas?.[sintoma.toLowerCase()] ? '' : 'si')}
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: selecciones.sintomas?.[sintoma.toLowerCase()] ? '#ff9999' : 'transparent',
                                        transition: 'background-color 0.3s',
                                        width: '25%'
                                    }}
                                >
                                    {sintoma}
                                </td>
                                {sintoma === 'Dolor' && (
                                    <td rowSpan="7">
                                        <div style={{ position: 'relative' }}>
                                            <textarea
                                                value={selecciones.sintomas?.detalles || ''}
                                                onChange={(e) => handleSeleccionChange('sintomas', 'detalles', e.target.value)}
                                                placeholder="Detalles de síntomas..."
                                                style={{ height: '100%', minHeight: '200px', resize: 'vertical', width: '100%' }}
                                            />
                                            <button
                                                onClick={handleListen}
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '10px',
                                                    right: '10px',
                                                    padding: '8px',
                                                    borderRadius: '50%',
                                                    border: 'none',
                                                    backgroundColor: isListening ? '#ff4444' : '#4CAF50',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                {isListening ? <MicOff color="white" /> : <Mic color="white" />}
                                            </button>
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div style={{ marginTop: '2rem' }}></div>

                <table className="risk-table">
                    <thead>
                        <tr>
                            <th style={{ width: '35%' }}>Variable</th>
                            <th style={{ width: '65%' }}>Detalles</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Fractura */}
                        <tr>
                            <td
                                onClick={() => handleSeleccionChange('fractura', 'value',
                                    selecciones.fractura.value ? '' : 'si')}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: selecciones.fractura.value ? '#ff9999' : 'transparent',
                                    transition: 'background-color 0.3s'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {selecciones.fractura.value && (
                                        <input
                                            type="date"
                                            value={selecciones.fractura.fecha}
                                            max={selecciones.irf.fecha ?
                                                new Date(new Date(selecciones.irf.fecha).setDate(new Date(selecciones.irf.fecha).getDate() - 1)).toISOString().split('T')[0]
                                                : new Date().toISOString().split('T')[0]
                                            }
                                            onChange={(e) => {
                                                handleFechaChange('fractura', 'fecha', e.target.value);
                                                if (selecciones.irf.fecha) {
                                                    const clasificacion = calcularClasificacion('irf', {
                                                        fechaInicial: e.target.value,
                                                        fechaSintomas: selecciones.irf.fecha
                                                    });
                                                    handleSeleccionChange('irf', 'tipo', clasificacion);
                                                }
                                            }}
                                            style={{ minWidth: '130px', height: '20px' }}
                                            onClick={e => e.stopPropagation()}
                                        />
                                    )}
                                    <span>Fractura</span>
                                </div>
                            </td>
                            <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <textarea
                                        value={selecciones.fractura.detalles}
                                        onChange={(e) => handleSeleccionChange('fractura', 'detalles', e.target.value)}
                                        placeholder="Comentarios..."
                                    />
                                    {selecciones.fractura.value && (
                                        <div className="radio-group">
                                            <button
                                                type="button"
                                                className={`radio-button ${selecciones.fractura.tipo === 'unica' ? "active" : ""}`}
                                                onClick={() => handleSeleccionChange('fractura', 'tipo',
                                                    selecciones.fractura.tipo === 'unica' ? '' : 'unica')}
                                                style={{ width: '200px', height: '30px', fontSize: '16px' }}
                                            >
                                                Única
                                            </button>
                                            <button
                                                type="button"
                                                className={`radio-button ${selecciones.fractura.tipo === 'multiple' ? "active" : ""}`}
                                                onClick={() => {
                                                    handleSeleccionChange('fractura', 'tipo',
                                                        selecciones.fractura.tipo === 'multiple' ? '' : 'multiple');
                                                    // Si se está seleccionando múltiple, inicializar el array con un hueso vacío
                                                    if (selecciones.fractura.tipo !== 'multiple') {
                                                        handleSeleccionChange('fractura', 'huesos', [{
                                                            value: '',
                                                            tipo: '',
                                                            desplazamiento: '',
                                                            gustilo: ''
                                                        }]);
                                                    }
                                                }}
                                                style={{ width: '200px', height: '30px', fontSize: '16px' }}
                                            >
                                                Múltiple
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>

                        {/* Campos cuando fractura es única */}
                        {selecciones.fractura.value && selecciones.fractura.tipo === 'unica' && (
                            <tr className="nested-row">
                                <td>↳ Hueso</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                                        <select
                                            value={selecciones.fractura.hueso.value}
                                            onChange={(e) => handleNestedChange('fractura', 'hueso', 'value', e.target.value)}
                                            style={{ flex: 2 }}
                                        >
                                            <option value="">Seleccionar hueso...</option>
                                            {Object.entries(huesos).map(([grupo, huesosGrupo]) => (
                                                <optgroup key={grupo} label={grupo}>
                                                    {huesosGrupo.map(hueso => (
                                                        <option key={hueso} value={hueso.toLowerCase()}>{hueso}</option>
                                                    ))}
                                                </optgroup>
                                            ))}
                                        </select>

                                        {selecciones.fractura.hueso.value && (
                                            <>
                                                <select
                                                    value={selecciones.fractura.hueso.tipo}
                                                    onChange={(e) => handleNestedChange('fractura', 'hueso', 'tipo', e.target.value)}
                                                    style={{ flex: 1, minWidth: '120px' }}
                                                >
                                                    <option value="">Tipo...</option>
                                                    <option value="cerrada">Cerrada</option>
                                                    <option value="expuesta">Expuesta</option>
                                                </select>

                                                {selecciones.fractura.hueso.tipo === 'cerrada' && (
                                                    <select
                                                        value={selecciones.fractura.hueso.desplazamiento}
                                                        onChange={(e) => handleNestedChange('fractura', 'hueso', 'desplazamiento', e.target.value)}
                                                        style={{ flex: 1, minWidth: '120px' }}
                                                    >
                                                        <option value="">Desplazamiento...</option>
                                                        <option value="desplazada">Desplazada</option>
                                                        <option value="noDesplazada">No desplazada</option>
                                                    </select>
                                                )}

                                                {selecciones.fractura.hueso.tipo === 'expuesta' && (
                                                    <select
                                                        value={selecciones.fractura.hueso.gustilo}
                                                        onChange={(e) => handleNestedChange('fractura', 'hueso', 'gustilo', e.target.value)}
                                                        style={{ flex: 1, minWidth: '120px' }}
                                                    >
                                                        <option value="">Gustilo...</option>
                                                        {clasificacionGustilo.map(tipo => (
                                                            <option key={tipo} value={tipo}>Gustilo {tipo}</option>
                                                        ))}
                                                    </select>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}

                        {/* Campos cuando fractura es múltiple */}
                        {selecciones.fractura.value && selecciones.fractura.tipo === 'multiple' && (
                            <tr className="nested-row">
                                <td>↳ Huesos</td>
                                <td>
                                    <div className="controls-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {selecciones.fractura.huesos.map((hueso, index) => (
                                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                                                <select
                                                    value={hueso.value}
                                                    onChange={(e) => handleArrayChange('fractura', 'huesos', index, { value: e.target.value })}
                                                    style={{ flex: 2 }}
                                                >
                                                    <option value="">Seleccionar hueso...</option>
                                                    {Object.entries(huesos).map(([grupo, huesosGrupo]) => (
                                                        <optgroup key={grupo} label={grupo}>
                                                            {huesosGrupo.map(h => (
                                                                <option key={h} value={h.toLowerCase()}>{h}</option>
                                                            ))}
                                                        </optgroup>
                                                    ))}
                                                </select>

                                                {hueso.value && (
                                                    <>
                                                        <select
                                                            value={hueso.tipo}
                                                            onChange={(e) => handleArrayChange('fractura', 'huesos', index, { tipo: e.target.value })}
                                                            style={{ flex: 1, minWidth: '120px' }}
                                                        >
                                                            <option value="">Tipo...</option>
                                                            <option value="cerrada">Cerrada</option>
                                                            <option value="expuesta">Expuesta</option>
                                                        </select>

                                                        {hueso.tipo === 'cerrada' && (
                                                            <select
                                                                value={hueso.desplazamiento}
                                                                onChange={(e) => handleArrayChange('fractura', 'huesos', index, { desplazamiento: e.target.value })}
                                                                style={{ flex: 1, minWidth: '120px' }}
                                                            >
                                                                <option value="">Desplazamiento...</option>
                                                                <option value="desplazada">Desplazada</option>
                                                                <option value="noDesplazada">No desplazada</option>
                                                            </select>
                                                        )}

                                                        {hueso.tipo === 'expuesta' && (
                                                            <select
                                                                value={hueso.gustilo}
                                                                onChange={(e) => handleArrayChange('fractura', 'huesos', index, { gustilo: e.target.value })}
                                                                style={{ flex: 1, minWidth: '120px' }}
                                                            >
                                                                <option value="">Gustilo...</option>
                                                                {clasificacionGustilo.map(tipo => (
                                                                    <option key={tipo} value={tipo}>Gustilo {tipo}</option>
                                                                ))}
                                                            </select>
                                                        )}
                                                    </>
                                                )}
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    {index !== 0 && (
                                                        <button
                                                            className="action-button"
                                                            onClick={() => handleRemoveArrayItem('fractura', 'huesos', index)}
                                                            style={{ padding: '0.25rem 0.5rem', minWidth: '80px', height: '32px' }}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    )}
                                                    {index === selecciones.fractura.huesos.length - 1 && (
                                                        <button
                                                            className="action-button"
                                                            onClick={() => handleAddArrayItem('fractura', 'huesos', { value: '', tipo: '', desplazamiento: '', gustilo: '' })}
                                                            style={{ padding: '0.25rem 0.5rem', minWidth: '80px', height: '32px' }}
                                                        >
                                                            + Agregar
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        )}

                        {/* Osteosíntesis */}
                        {selecciones.fractura.value && (
                            <tr className="nested-row">
                                <td
                                    onClick={() => {
                                        const newValue = selecciones.osteosintesis.value ? '' : 'si';
                                        handleSeleccionChange('osteosintesis', 'value', newValue);
                                        // Inicializar el array de tipos si se está activando osteosíntesis
                                        if (newValue === 'si') {
                                            handleSeleccionChange('osteosintesis', 'tipos', [{ tipo: '' }]);
                                        }
                                    }}
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: selecciones.osteosintesis.value ? '#ff9999' : 'transparent',
                                        transition: 'background-color 0.3s'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        {selecciones.osteosintesis.value && (
                                            <input
                                                type="date"
                                                value={selecciones.osteosintesis.fecha}
                                                onChange={(e) => handleFechaChange('osteosintesis', 'fecha', e.target.value)}
                                                style={{ minWidth: '130px', height: '20px' }}
                                                onClick={e => e.stopPropagation()}
                                            />
                                        )}
                                        <span>↳ Osteosíntesis</span>
                                    </div>
                                </td>
                                <td>
                                    <textarea
                                        value={selecciones.osteosintesis.detalles}
                                        onChange={(e) => handleSeleccionChange('osteosintesis', 'detalles', e.target.value)}
                                        placeholder="Comentarios..."
                                    />
                                </td>
                            </tr>
                        )}

                        {/* Tipos de osteosíntesis */}
                        {selecciones.fractura.value && selecciones.osteosintesis.value && (
                            <tr className="nested-row">
                                <td>↳ Tipos</td>
                                <td>
                                    <div className="controls-container" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {selecciones.osteosintesis.tipos.map((tipo, index) => (
                                            <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                                                <select
                                                    value={tipo.tipo || ''}
                                                    onChange={(e) => handleArrayChange('osteosintesis', 'tipos', index, { tipo: e.target.value })}
                                                    style={{ flex: 2 }}
                                                >
                                                    <option value="">Seleccionar tipo...</option>
                                                    {tiposOsteosintesis.map(t => (
                                                        <option key={t} value={t.toLowerCase()}>{t}</option>
                                                    ))}
                                                </select>

                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    {index !== 0 && (
                                                        <button
                                                            className="action-button"
                                                            onClick={() => handleRemoveArrayItem('osteosintesis', 'tipos', index)}
                                                            style={{ padding: '0.25rem 0.5rem', minWidth: '80px', height: '32px' }}
                                                        >
                                                            Eliminar
                                                        </button>
                                                    )}
                                                    {index === selecciones.osteosintesis.tipos.length - 1 && (
                                                        <button
                                                            className="action-button"
                                                            onClick={() => handleAddArrayItem('osteosintesis', 'tipos', { tipo: '' })}
                                                            style={{ padding: '0.25rem 0.5rem', minWidth: '80px', height: '32px' }}
                                                        >
                                                            + Agregar
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        )}

                        {/* IRF */}
                        <tr>
                            <td
                                onClick={() => handleSeleccionChange('irf', 'value',
                                    selecciones.irf.value ? '' : 'si')}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: selecciones.irf.value ? '#ff9999' : 'transparent',
                                    transition: 'background-color 0.3s'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {selecciones.irf.value && (
                                        <input
                                            type="date"
                                            value={selecciones.irf.fecha}
                                            min={selecciones.fractura.fecha ?
                                                new Date(new Date(selecciones.fractura.fecha).setDate(new Date(selecciones.fractura.fecha).getDate() + 1)).toISOString().split('T')[0]
                                                : undefined
                                            }
                                            max={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => {
                                                handleFechaChange('irf', 'fecha', e.target.value, [
                                                    {
                                                        campo: 'fractura',
                                                        subcampo: 'fecha',
                                                        tipo: 'posterior',
                                                        mensaje: 'La fecha de IRF no puede ser anterior a la fecha de fractura'
                                                    }
                                                ]);
                                                if (selecciones.fractura.fecha) {
                                                    const clasificacion = calcularClasificacion('irf', {
                                                        fechaInicial: selecciones.fractura.fecha,
                                                        fechaSintomas: e.target.value
                                                    });
                                                    handleSeleccionChange('irf', 'tipo', clasificacion);
                                                }
                                            }}
                                            style={{ minWidth: '130px', height: '20px' }}
                                            onClick={e => e.stopPropagation()}
                                        />
                                    )}
                                    <span>IRF</span>
                                </div>
                            </td>
                            <td>
                                <div className="controls-container">
                                    {selecciones.irf.value && (
                                        <select
                                            value={selecciones.irf.tipo}
                                            onChange={(e) => handleSeleccionChange('irf', 'tipo', e.target.value)}
                                            style={{
                                                backgroundColor: '#f5f5f5',
                                                cursor: 'default',
                                                opacity: 0.9,
                                                width: '90%',
                                                maxWidth: '100%',
                                                boxSizing: 'border-box',
                                                padding: '0.5rem'
                                            }}
                                            readOnly
                                        >
                                            <option value="">Clasificación...</option>
                                            <option value="aguda">Aguda (1-2 semanas)</option>
                                            <option value="retrasada">Retrasada (3-10 semanas)</option>
                                            <option value="tardia">Tardía (más de 10 semanas)</option>
                                        </select>
                                    )}
                                    <textarea
                                        value={selecciones.irf.detalles}
                                        onChange={(e) => handleSeleccionChange('irf', 'detalles', e.target.value)}
                                        placeholder="Comentarios..."
                                    />
                                </div>
                            </td>
                        </tr>

                        {/* ISQ */}
                        <tr>
                            <td
                                onClick={() => handleSeleccionChange('isq', 'value',
                                    selecciones.isq.value ? '' : 'si')}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: selecciones.isq.value ? '#ff9999' : 'transparent',
                                    transition: 'background-color 0.3s'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {selecciones.isq.value && (
                                        <input
                                            type="date"
                                            value={selecciones.isq.fecha}
                                            max={new Date().toISOString().split('T')[0]}
                                            onChange={(e) => handleFechaChange('isq', 'fecha', e.target.value)}
                                            style={{ minWidth: '130px', height: '20px' }}
                                            onClick={e => e.stopPropagation()}
                                        />
                                    )}
                                    <span>ISQ</span>
                                </div>
                            </td>
                            <td>
                                <div className="controls-container">
                                    {selecciones.isq.value && (
                                        <div style={{
                                            display: 'flex',
                                            gap: '0.5rem',
                                            marginBottom: '0.5rem'
                                        }}>
                                            <select
                                                value={selecciones.isq.tipoHq}
                                                onChange={(e) => handleSeleccionChange('isq', 'tipoHq', e.target.value)}
                                                style={{
                                                    flex: 1,
                                                    padding: '0.5rem',
                                                    backgroundColor: '#f5f5f5',
                                                    boxSizing: 'border-box',
                                                    minWidth: '250px'  // Añadido para hacer el select más largo
                                                }}
                                            >
                                                <option value="">Clasificación HQ...</option>
                                                {clasificacionHQ.map(tipo => (
                                                    <option key={tipo} value={tipo.toLowerCase()}>{tipo}</option>
                                                ))}
                                            </select>
                                            <select
                                                value={selecciones.isq.tipo}
                                                onChange={(e) => handleSeleccionChange('isq', 'tipo', e.target.value)}
                                                style={{
                                                    flex: 1,
                                                    padding: '0.5rem',
                                                    backgroundColor: '#f5f5f5',
                                                    boxSizing: 'border-box',
                                                    minWidth: '250px'  // Añadido para hacer el select más largo
                                                }}
                                            >
                                                <option value="">Clasificación ISQ...</option>
                                                {clasificacionISQ.map(tipo => (
                                                    <option key={tipo} value={tipo.toLowerCase()}>{tipo}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                    <textarea
                                        value={selecciones.isq.detalles}
                                        onChange={(e) => handleSeleccionChange('isq', 'detalles', e.target.value)}
                                        placeholder="Región/Características..."
                                    />
                                </div>
                            </td>
                        </tr>

                        {/* Osteomielitis */}
                        <tr>
                            <td
                                onClick={() => handleSeleccionChange('osteomielitis', 'value',
                                    selecciones.osteomielitis.value ? '' : 'si')}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: selecciones.osteomielitis.value ? '#ff9999' : 'transparent',
                                    transition: 'background-color 0.3s'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {selecciones.osteomielitis.value && (
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.8rem', color: '#666', marginBottom: '2px' }}>
                                                Inicio de Síntomas
                                            </span>
                                            <input
                                                type="date"
                                                value={selecciones.osteomielitis.fecha}
                                                max={new Date().toISOString().split('T')[0]}
                                                onChange={(e) => {
                                                    const nuevaFecha = e.target.value;
                                                    const hoy = new Date();
                                                    const fechaSintomas = new Date(nuevaFecha);
                                                    const diferenciaDias = Math.floor((hoy - fechaSintomas) / (1000 * 60 * 60 * 24));

                                                    handleFechaChange('osteomielitis', 'fecha', nuevaFecha);

                                                    // Calcular clasificación: ≤ 21 días es aguda, > 21 días es crónica
                                                    handleSeleccionChange('osteomielitis', 'tipo',
                                                        diferenciaDias <= 21 ? 'aguda' : 'cronica'
                                                    );
                                                }}
                                                style={{ minWidth: '130px', height: '20px' }}
                                                onClick={e => e.stopPropagation()}
                                            />
                                        </div>
                                    )}
                                    <span>Osteomielitis</span>
                                </div>
                            </td>
                            <td>
                                <div className="controls-container">
                                    {selecciones.osteomielitis.value && (
                                        <select
                                            value={selecciones.osteomielitis.tipo}
                                            onChange={(e) => handleSeleccionChange('osteomielitis', 'tipo', e.target.value)}
                                            style={{
                                                width: '100%',
                                                maxWidth: '90%',
                                                boxSizing: 'border-box',
                                                padding: '0.5rem',
                                                marginBottom: '0.5rem',
                                                backgroundColor: '#f5f5f5'
                                            }}
                                            readOnly
                                        >
                                            <option value="">Clasificación...</option>
                                            <option value="aguda">Aguda (menos de 3 semanas)</option>
                                            <option value="cronica">Crónica (más de 3 semanas)</option>
                                        </select>
                                    )}
                                    <textarea
                                        value={selecciones.osteomielitis.detalles}
                                        onChange={(e) => handleSeleccionChange('osteomielitis', 'detalles', e.target.value)}
                                        placeholder="Región/Características..."
                                    />
                                </div>
                            </td>
                        </tr>

                        {/* Artritis Séptica */}
                        <tr>
                            <td
                                onClick={() => handleSeleccionChange('artritisSeptica', 'value',
                                    selecciones.artritisSeptica.value ? '' : 'si')}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: selecciones.artritisSeptica.value ? '#ff9999' : 'transparent',
                                    transition: 'background-color 0.3s'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {selecciones.artritisSeptica.value && (
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.8rem', color: '#666', marginBottom: '2px' }}>
                                                Inicio de Síntomas
                                            </span>
                                            <input
                                                type="date"
                                                value={selecciones.artritisSeptica.fecha}
                                                max={new Date().toISOString().split('T')[0]}
                                                onChange={(e) => {
                                                    const nuevaFecha = e.target.value;
                                                    const hoy = new Date();
                                                    const fechaSintomas = new Date(nuevaFecha);
                                                    const diferenciaDias = Math.floor((hoy - fechaSintomas) / (1000 * 60 * 60 * 24));

                                                    handleFechaChange('artritisSeptica', 'fecha', nuevaFecha);

                                                    // Calcular clasificación: ≤ 21 días es aguda, > 21 días es crónica
                                                    handleSeleccionChange('artritisSeptica', 'tipo',
                                                        diferenciaDias <= 21 ? 'aguda' : 'cronica'
                                                    );
                                                }}
                                                style={{ minWidth: '130px', height: '20px' }}
                                                onClick={e => e.stopPropagation()}
                                            />
                                        </div>
                                    )}
                                    <span>Artritis Séptica</span>
                                </div>
                            </td>
                            <td>
                                <div className="controls-container">
                                    {selecciones.artritisSeptica.value && (
                                        <select
                                            value={selecciones.artritisSeptica.tipo}
                                            onChange={(e) => handleSeleccionChange('artritisSeptica', 'tipo', e.target.value)}
                                            style={{
                                                width: '100%',
                                                maxWidth: '90%',
                                                boxSizing: 'border-box',
                                                padding: '0.5rem',
                                                marginBottom: '0.5rem',
                                                backgroundColor: '#f5f5f5'
                                            }}
                                            readOnly
                                        >
                                            <option value="">Clasificación...</option>
                                            <option value="aguda">Aguda (menos de 3 semanas)</option>
                                            <option value="cronica">Crónica (más de 3 semanas)</option>
                                        </select>
                                    )}
                                    <textarea
                                        value={selecciones.artritisSeptica.detalles}
                                        onChange={(e) => handleSeleccionChange('artritisSeptica', 'detalles', e.target.value)}
                                        placeholder="Región/Características..."
                                    />
                                </div>
                            </td>
                        </tr>

                        {/* IPP */}
                        <tr>
                            <td
                                onClick={() => handleSeleccionChange('ipp', 'value',
                                    selecciones.ipp.value ? '' : 'si')}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: selecciones.ipp.value ? '#ff9999' : 'transparent',
                                    transition: 'background-color 0.3s'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {selecciones.ipp.value && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '0.8rem', color: '#666', marginBottom: '2px' }}>
                                                    Fecha Colocación PT
                                                </span>
                                                <input
                                                    type="date"
                                                    value={selecciones.ipp.fechaColocacion}
                                                    max={selecciones.ipp.fechaSintomas || new Date().toISOString().split('T')[0]}
                                                    onChange={(e) => {
                                                        const nuevaFecha = e.target.value;

                                                        // Validar que la fecha de colocación sea anterior a síntomas si existen
                                                        if (selecciones.ipp.fechaSintomas &&
                                                            new Date(nuevaFecha) >= new Date(selecciones.ipp.fechaSintomas)) {
                                                            alert('La fecha de colocación debe ser anterior a la fecha de síntomas');
                                                            return;
                                                        }

                                                        handleFechaChange('ipp', 'fechaColocacion', nuevaFecha);

                                                        // Recalcular clasificación si hay fecha de síntomas
                                                        if (selecciones.ipp.fechaSintomas) {
                                                            const clasificacion = calcularClasificacion('ipp', {
                                                                fechaInicial: nuevaFecha,
                                                                fechaSintomas: selecciones.ipp.fechaSintomas
                                                            });
                                                            handleSeleccionChange('ipp', 'tipo', clasificacion);
                                                        }
                                                    }}
                                                    style={{ minWidth: '130px', height: '20px' }}
                                                    onClick={e => e.stopPropagation()}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '0.8rem', color: '#666', marginBottom: '2px' }}>
                                                    Inicio de Síntomas
                                                </span>
                                                <input
                                                    type="date"
                                                    value={selecciones.ipp.fechaSintomas}
                                                    min={selecciones.ipp.fechaColocacion ?
                                                        new Date(new Date(selecciones.ipp.fechaColocacion).setDate(new Date(selecciones.ipp.fechaColocacion).getDate() + 1)).toISOString().split('T')[0]
                                                        : undefined}
                                                    max={new Date().toISOString().split('T')[0]}
                                                    onChange={(e) => {
                                                        const nuevaFecha = e.target.value;

                                                        // Validar que la fecha de síntomas sea posterior a la colocación si existe
                                                        if (selecciones.ipp.fechaColocacion &&
                                                            new Date(nuevaFecha) <= new Date(selecciones.ipp.fechaColocacion)) {
                                                            alert('La fecha de síntomas debe ser posterior a la fecha de colocación');
                                                            return;
                                                        }

                                                        handleFechaChange('ipp', 'fechaSintomas', nuevaFecha);

                                                        // Calcular clasificación si tenemos fecha de colocación
                                                        if (selecciones.ipp.fechaColocacion) {
                                                            const clasificacion = calcularClasificacion('ipp', {
                                                                fechaInicial: selecciones.ipp.fechaColocacion,
                                                                fechaSintomas: nuevaFecha
                                                            });
                                                            handleSeleccionChange('ipp', 'tipo', clasificacion);
                                                        }
                                                    }}
                                                    style={{ minWidth: '130px', height: '20px' }}
                                                    onClick={e => e.stopPropagation()}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <span>IPP</span>
                                </div>
                            </td>
                            <td>
                                <div className="controls-container">
                                    {selecciones.ipp.value && (
                                        <select
                                            value={selecciones.ipp.tipo}
                                            onChange={(e) => handleSeleccionChange('ipp', 'tipo', e.target.value)}
                                            style={{
                                                width: '100%',
                                                maxWidth: '90%',
                                                boxSizing: 'border-box',
                                                padding: '0.5rem',
                                                marginBottom: '0.5rem',
                                                backgroundColor: '#f5f5f5'
                                            }}
                                            readOnly
                                        >
                                            <option value="">Clasificación...</option>
                                            <option value="aguda">Aguda (menos de 1 mes)</option>
                                            <option value="cronica">Crónica (más de 1 mes)</option>
                                        </select>
                                    )}
                                    <textarea
                                        value={selecciones.ipp.detalles}
                                        onChange={(e) => handleSeleccionChange('ipp', 'detalles', e.target.value)}
                                        placeholder="Comentarios..."
                                    />
                                </div>
                            </td>
                        </tr>

                        {/* Espondilodiscitis */}
                        <tr>
                            <td
                                onClick={() => handleSeleccionChange('espondilodiscitis', 'value',
                                    selecciones.espondilodiscitis.value ? '' : 'si')}
                                style={{
                                    cursor: 'pointer',
                                    backgroundColor: selecciones.espondilodiscitis.value ? '#ff9999' : 'transparent',
                                    transition: 'background-color 0.3s'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    {selecciones.espondilodiscitis.value && (
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <span style={{ fontSize: '0.8rem', color: '#666', marginBottom: '2px' }}>
                                                Inicio de Síntomas
                                            </span>
                                            <input
                                                type="date"
                                                value={selecciones.espondilodiscitis.fecha}
                                                max={new Date().toISOString().split('T')[0]}
                                                onChange={(e) => {
                                                    const nuevaFecha = e.target.value;

                                                    // Si hay fecha de osteosíntesis, validar que sea posterior
                                                    if (selecciones.espondilodiscitis.osteosintesis.value === 'si' &&
                                                        selecciones.espondilodiscitis.osteosintesis.fecha &&
                                                        new Date(nuevaFecha) <= new Date(selecciones.espondilodiscitis.osteosintesis.fecha)) {
                                                        alert('La fecha de síntomas debe ser posterior a la fecha de osteosíntesis');
                                                        return;
                                                    }

                                                    handleFechaChange('espondilodiscitis', 'fecha', nuevaFecha);

                                                    // Calcular clasificación
                                                    const clasificacion = calcularClasificacion('espondilodiscitis', {
                                                        fechaInicial: selecciones.espondilodiscitis.osteosintesis.fecha || null,
                                                        fechaSintomas: nuevaFecha
                                                    });
                                                    handleSeleccionChange('espondilodiscitis', 'tipo', clasificacion);
                                                }}
                                                style={{ minWidth: '130px', height: '20px' }}
                                                onClick={e => e.stopPropagation()}
                                            />
                                        </div>
                                    )}
                                    <span>Espondilodiscitis</span>
                                </div>
                            </td>
                            <td>
                                <div className="controls-container">
                                    {selecciones.espondilodiscitis.value && (
                                        <select
                                            value={selecciones.espondilodiscitis.tipo}
                                            onChange={(e) => handleSeleccionChange('espondilodiscitis', 'tipo', e.target.value)}
                                            style={{
                                                width: '100%',
                                                maxWidth: '90%',
                                                boxSizing: 'border-box',
                                                padding: '0.5rem',
                                                marginBottom: '0.5rem',
                                                backgroundColor: '#f5f5f5'
                                            }}
                                            readOnly
                                        >
                                            <option value="">Clasificación...</option>
                                            {selecciones.espondilodiscitis.osteosintesis.value === 'si' ? (
                                                <>
                                                    <option value="temprana">Temprana (0-2 semanas)</option>
                                                    <option value="retrasada">Retrasada (3-10 semanas)</option>
                                                    <option value="tardia">Tardía (más de 10 semanas)</option>
                                                </>
                                            ) : (
                                                <>
                                                    <option value="aguda">Aguda (menos de 2 semanas)</option>
                                                    <option value="cronica">Crónica (más de 2 semanas)</option>
                                                </>
                                            )}
                                        </select>
                                    )}
                                    <textarea
                                        value={selecciones.espondilodiscitis.detalles}
                                        onChange={(e) => handleSeleccionChange('espondilodiscitis', 'detalles', e.target.value)}
                                        placeholder="Región/Características..."
                                    />
                                </div>
                            </td>
                        </tr>

                        {/* Osteosíntesis para Espondilodiscitis */}
                        {selecciones.espondilodiscitis.value && (
                            <tr className="nested-row">
                                <td
                                    onClick={() => handleNestedChange('espondilodiscitis', 'osteosintesis', 'value',
                                        selecciones.espondilodiscitis.osteosintesis.value ? '' : 'si')}
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: selecciones.espondilodiscitis.osteosintesis.value ? '#ff9999' : 'transparent',
                                        transition: 'background-color 0.3s'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        {selecciones.espondilodiscitis.osteosintesis.value && (
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <span style={{ fontSize: '0.8rem', color: '#666', marginBottom: '2px' }}>
                                                    Fecha Colocación OS
                                                </span>
                                                <input
                                                    type="date"
                                                    value={selecciones.espondilodiscitis.osteosintesis.fecha}
                                                    max={selecciones.espondilodiscitis.fecha || new Date().toISOString().split('T')[0]}
                                                    onChange={(e) => {
                                                        const nuevaFecha = e.target.value;

                                                        // Si hay fecha de síntomas, validar que sea anterior
                                                        if (selecciones.espondilodiscitis.fecha &&
                                                            new Date(nuevaFecha) >= new Date(selecciones.espondilodiscitis.fecha)) {
                                                            alert('La fecha de osteosíntesis debe ser anterior a la fecha de síntomas');
                                                            return;
                                                        }

                                                        handleNestedChange('espondilodiscitis', 'osteosintesis', 'fecha', nuevaFecha);

                                                        // Recalcular clasificación si hay fecha de síntomas
                                                        if (selecciones.espondilodiscitis.fecha) {
                                                            const clasificacion = calcularClasificacion('espondilodiscitis', {
                                                                fechaInicial: nuevaFecha,
                                                                fechaSintomas: selecciones.espondilodiscitis.fecha
                                                            });
                                                            handleSeleccionChange('espondilodiscitis', 'tipo', clasificacion);
                                                        }
                                                    }}
                                                    style={{ minWidth: '130px', height: '20px' }}
                                                    onClick={e => e.stopPropagation()}
                                                />
                                            </div>
                                        )}
                                        <span>↳ Osteosíntesis</span>
                                    </div>
                                </td>
                                <td>
                                    <textarea
                                        value={selecciones.espondilodiscitis.osteosintesis.detalles}
                                        onChange={(e) => handleNestedChange('espondilodiscitis', 'osteosintesis', 'detalles', e.target.value)}
                                        placeholder="Comentarios..."
                                    />
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EnfermedadActual;
