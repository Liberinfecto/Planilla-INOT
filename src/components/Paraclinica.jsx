import React, { useState, useEffect } from 'react';

// Definición de rangos normales
const rangosNormales = {
    hb: { min: 12, max: 16 },
    hto: { min: 37, max: 47 },
    gb: { min: 4000, max: 10000 },
    plt: { min: 150, max: 400 },
    pcr: { min: 0, max: 5 },
    na: { min: 135, max: 145 },
    k: { min: 3.5, max: 5 },
    cl: { min: 98, max: 107 },
    bt: { min: 0, max: 1 },
    bd: { min: 0, max: 0.3 },
    bi: { min: 0, max: 0.7 },
    alb: { min: 3.5, max: 5 },
    fa: { min: 45, max: 129 },
    gto: { min: 10, max: 50 },
    gtp: { min: 10, max: 50 },
    ggt: { min: 7, max: 32 },
    cr: { min: 0.7, max: 1.2 },
    ves: { min: 0, max: 20 },
    azo: { min: 10, max: 50 },
    fg: { min: 90, max: 120 }
};

// Función para calcular el filtrado glomerular
const calcularFiltradoGlomerular = (creatinina, edad, peso, talla, sexo) => {
    if (!creatinina || !edad || !peso || !talla || !sexo) return '';

    // Convertir valores a números
    creatinina = parseFloat(creatinina);
    edad = parseFloat(edad);
    peso = parseFloat(peso);
    talla = parseFloat(talla);

    // Fórmula CKD-EPI
    const k = sexo === 'M' ? 0.7 : 0.9;
    const a = sexo === 'M' ? -0.329 : -0.411;

    const superficieCorporal = Math.sqrt((peso * talla) / 3600); // Fórmula de Mosteller

    let fg = 142 *
             Math.min(creatinina/k, 1)**a *
             Math.max(creatinina/k, 1)**-1.209 *
             0.993**edad;

    if (sexo === 'M') fg *= 1.018;

    // Ajustar por superficie corporal
    fg = fg * superficieCorporal / 1.73;

    return Math.round(fg);
};

// Función para recalcular todos los FG
const recalcularTodosFG = (datosActuales, formDataActual) => {
    const newValores = { ...datosActuales.valores };

    // Verificar que tengamos todos los datos necesarios
    if (!formDataActual.edad || !formDataActual.peso ||
        !formDataActual.talla || !formDataActual.sexo) {
        return newValores;
    }

    // Recorrer todas las columnas
    Object.keys(newValores.cr.valores).forEach(index => {
        const creatinina = newValores.cr.valores[index];
        if (creatinina) {
            const fgValue = calcularFiltradoGlomerular(
                creatinina,
                formDataActual.edad,
                formDataActual.peso,
                formDataActual.talla,
                formDataActual.sexo
            );

            if (!newValores['fg']) {
                newValores['fg'] = { valores: [] };
            }
            newValores['fg'].valores[index] = fgValue.toString();
        }
    });

    return newValores;
};

function Paraclinica({ formData }) {
    // Estado inicial...
    const [paraclinicaData, setParaclinicaData] = useState({
        columnas: [
            { fecha: new Date().toISOString().split('T')[0], tipo: 'fi' },
            { fecha: '', tipo: 'protected' },
            { fecha: '', tipo: 'protected' },
            { fecha: '', tipo: 'protected' }
        ],
        valores: {
            // Valores fijos
            hb: { unidad: 'g/dL', valores: [], visible: true, display: 'Hb' },
            gb: { unidad: '/mm³', valores: [], visible: true, display: 'GB' },
            azo: { unidad: 'mg/dL', valores: [], visible: true, display: 'Azo' },
            cr: { unidad: 'mg/dL', valores: [], visible: true, display: 'Cr' },
            fg: { unidad: 'mL/min/1.73m²', valores: [], visible: true, display: 'FG' },
            ves: { unidad: 'mm/h', valores: [], visible: true, display: 'VES' },
            pcr: { unidad: 'mg/L', valores: [], visible: true, display: 'PCR' },

            // Primer grupo desplegable
            hto: { unidad: '%', valores: [], visible: false, display: 'Hto' },
            plt: { unidad: '/mm³', valores: [], visible: false, display: 'PLT' },
            'Na/K': { unidad: 'mEq/L', valores: [], visible: false, display: 'Na/K' },
            cl: { unidad: 'mEq/L', valores: [], visible: false, display: 'Cl' },

            // Grupo BT
            bt: { unidad: 'mg/dL', valores: [], visible: false, display: 'BT' },
            bd: { unidad: 'mg/dL', valores: [], visible: false, display: 'BD' },
            bi: { unidad: 'mg/dL', valores: [], visible: false, display: 'BI' },
            alb: { unidad: 'g/dL', valores: [], visible: false, display: 'Alb' },
            fa: { unidad: 'UI/L', valores: [], visible: false, display: 'FA' },
            gto: { unidad: 'UI/L', valores: [], visible: false, display: 'GOT' },
            gtp: { unidad: 'UI/L', valores: [], visible: false, display: 'GPT' },
            ggt: { unidad: 'UI/L', valores: [], visible: false, display: 'GGT' }
        }
    });

    const [startColumn, setStartColumn] = useState(1); // Empezamos después de FI
    const [grupoHematologiaVisible, setGrupoHematologiaVisible] = useState(false);

    const COLUMN_WIDTH = '160px';
    const VISIBLE_COLUMNS = 5; // Total de columnas visibles (2 fijas + 2 variables)

    const visibleColumns = [
        // Siempre incluir Variables y FI
        paraclinicaData.columnas[0],
        // Mostrar TODAS las columnas restantes, no solo un subconjunto
        ...paraclinicaData.columnas.slice(1)
    ];

    // Estilos base para la tabla
    const styles = {
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '1rem',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0'
        },
        tableHeader: {
            padding: '0.5rem',
            backgroundColor: '#f8f9fa',
            borderBottom: '2px solid #eaeaea',
            textAlign: 'center',
            color: '#333',
            position: 'relative',
            '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '1px',
                background: 'linear-gradient(to right, transparent, rgba(0,0,0,0.1), transparent)'
            }
        }
    };

    // Función para agregar nueva columna
    const agregarColumna = () => {
        const fechaActual = new Date().toISOString().split('T')[0];
        setParaclinicaData(prev => ({
            ...prev,
            columnas: [...prev.columnas, {
                fecha: fechaActual,
                tipo: 'normal'
            }]
        }));

        // Agregamos un setTimeout para asegurar que el DOM se ha actualizado
        setTimeout(() => {
            const container = document.querySelector('.scrollable-column');
            if (container) {
                container.scrollTo({
                    left: container.scrollWidth,
                    behavior: 'smooth'
                });
            }
        }, 100);
    };

    // Añade estas funciones de navegación
    const scrollLeft = () => {
        const container = document.querySelector('.scrollable-column');
        if (container) {
            container.scrollBy({ left: -192, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        const container = document.querySelector('.scrollable-column');
        if (container) {
            container.scrollBy({ left: 192, behavior: 'smooth' });
        }
    };

    // useEffect para desplazar automáticamente al agregar una nueva columna
    useEffect(() => {
        const container = document.querySelector('.scrollable-column');
        if (container) {
            container.scrollTo({
                left: container.scrollWidth,
                behavior: 'smooth'
            });
        }
    }, [paraclinicaData.columnas.length]);

    const handleRemoveColumn = (index) => {
        const container = document.querySelector('.scrollable-column');
        const scrollPosition = container.scrollLeft; // Guarda la posición actual del scroll

        setParaclinicaData(prev => ({
            ...prev,
            columnas: prev.columnas.filter((_, i) => i !== index + 1)
        }));

        // Restaura la posición del scroll después de eliminar la columna
        setTimeout(() => {
            container.scrollTo({
                left: scrollPosition,
                behavior: 'auto'
            });
        }, 0);
    };

    // useEffect para recalcular todos los FG cuando cambien los datos del formulario
    useEffect(() => {
        // Solo procedemos si hay alguna creatinina ingresada
        if (Object.keys(paraclinicaData.valores.cr.valores).length > 0) {
            const nuevosValores = recalcularTodosFG(paraclinicaData, formData);
            setParaclinicaData(prev => ({
                ...prev,
                valores: nuevosValores
            }));
        }
    }, [formData]); // Se ejecutará cuando cambien los datos del formulario

    // Nuevo useEffect para posición inicial
    useEffect(() => {
        const container = document.querySelector('.scrollable-column');
        if (container) {
            container.scrollLeft = 0;
        }
    }, []);

    // Modificación 2: Contenedor Principal
    return (
        <div className="container">
            <h3 style={{
                margin: '0 0 1rem',
                textAlign: 'left',
                color: '#333'
            }}>
                Paraclínica
            </h3>
            <hr style={{
                border: 'none',
                borderTop: '2px solid #333',
                margin: '0 0 1rem'
            }} />

            {/* Aquí agregamos el div con el botón */}
            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginBottom: '1rem'
            }}>
                <span style={{
                    marginRight: '1rem',
                    color: '#666',
                    fontSize: '0.9rem'
                }}>
                    {paraclinicaData.columnas.length} columnas
                </span>
                <button
                    onClick={agregarColumna}
                    style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    <span>+</span> Agregar columna
                </button>
            </div>

            {/* Aquí sigue el container principal */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '320px 1fr',
                alignItems: 'start',
                gap: '0',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '1rem',
                backgroundColor: '#fff',
                maxWidth: '900px',
                margin: '0 auto',
                position: 'relative'  // Añadimos esta línea
            }}>
                <div style={{
                    width: '320px',
                    overflowX: 'hidden',
                    borderLeft: '4px solid #eee',     // Agregamos borde izquierdo
                    borderRight: '1px solid #eee',
                    borderTop: '2px solid #e0e0e0',   // Agregamos borde superior
                    borderBottom: '2px solid #e0e0e0', // Agregamos borde inferior
                    boxShadow: 'inset 10px 0 8px -8px rgba(0,0,0,0.1)' // Agregamos sombra interna solo a la izquierda

                }}>

                    <table style={{
                        width: '100%',
                        tableLayout: 'fixed',
                        borderCollapse: 'collapse'
                    }}>
                        <thead>
                            <tr style={{ height: '70px' }}>
                                <th style={styles.tableHeader}>Variable</th>
                                <th style={styles.tableHeader}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                            <span>FI</span>
                                        </div>
                                        <input
                                            type="date"
                                            value={paraclinicaData.columnas[0].fecha}
                                            onChange={(e) => {
                                                const newColumnas = [...paraclinicaData.columnas];
                                                newColumnas[0].fecha = e.target.value;
                                                setParaclinicaData(prev => ({
                                                    ...prev,
                                                    columnas: newColumnas
                                                }));
                                            }}
                                            style={{
                                                width: '10%',
                                                minWidth: '120px',
                                                padding: '0.25rem',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                                marginLeft: '-25px',
                                            }}
                                        />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(paraclinicaData.valores).map(([variable, datos], index) => {
                                // Primero verificamos si es una variable que debería mostrarse
                                const isHematologiaVar = ['hto', 'plt', 'Na/K', 'cl'].includes(variable);
                                const isHepaticaVar = ['bd', 'bi', 'alb', 'fa', 'gto', 'gtp', 'ggt'].includes(variable);
                                const isFixed = ['hb', 'gb', 'azo', 'cr', 'fg', 'ves', 'pcr'].includes(variable);

                                // No mostrar variables ocultas que dependen de cada grupo
                                if ((isHematologiaVar && !grupoHematologiaVisible) ||
                                    (isHepaticaVar && !datos.visible)) {
                                    return null;
                                }

                                if (variable === 'pcr') {
                                    return (
                                        <>
                                            <tr key={variable}>
                                                <td style={{
                                                    ...styles.tableCell,
                                                    fontWeight: 'bold',
                                                    paddingLeft: (isHematologiaVar || isHepaticaVar) ? '2rem' : '0.5rem',
                                                    borderLeft: variable === 'bt' ? '3px solid #4a5568' : '1px solid #333'
                                                }}>
                                                    {variable === 'Na/K' ? 'Na/K' :
                                                     variable === 'cl' ? 'Cl' :
                                                     datos.display} {datos.unidad && `(${datos.unidad})`}
                                                </td>
                                                <td style={styles.tableCell}>
                                                    {variable === 'Na/K' ? (
                                                        // Render especial para Na/K
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                            <input
                                                                type="number"
                                                                step="0.1"
                                                                placeholder="Na"
                                                                value={datos.valores[0]?.na || ''}
                                                                onKeyPress={(e) => {
                                                                    if (!/[\d.]|\Backspace|\Tab/i.test(e.key)) {
                                                                        e.preventDefault();
                                                                    }
                                                                    if (e.key === '.' && e.target.value.includes('.')) {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                                onChange={(e) => {
                                                                    const newValue = e.target.value;
                                                                    if (newValue === '' || /^\d*\.?\d*$/.test(newValue)){
                                                                        setParaclinicaData(prev => {
                                                                            const newValores = { ...prev.valores };
                                                                            if (!newValores['Na/K'].valores[0]) {
                                                                                newValores['Na/K'].valores[0] = { na: '', k: '' };
                                                                            }
                                                                            newValores['Na/K'].valores[0] = {
                                                                                ...newValores['Na/K'].valores[0],
                                                                                na: newValue
                                                                            };
                                                                            return {
                                                                                ...prev,
                                                                                valores: newValores
                                                                            };
                                                                        });
                                                                    }
                                                                }}
                                                                style={{
                                                                    width: '28%',
                                                                    margin: '0 5px',
                                                                    border: 'none',
                                                                    padding: '0.25rem',
                                                                    textAlign: 'center',
                                                                    color: '#333',  // Agregado para el texto
                                                                    '::placeholder': { color: '#333' },  // Para el placeholder
                                                                    backgroundColor: (() => {
                                                                        const valor = parseFloat(datos.valores[0]?.na);
                                                                        if (!valor) return 'white';
                                                                        const rango = rangosNormales.na;
                                                                        if (valor < rango.min || valor > rango.max) {
                                                                            return '#ffebee';
                                                                        }
                                                                        return '#e8f5e9';
                                                                    })()
                                                                }}
                                                            />
                                                            <span style={{ color: '#333' }}>/</span>
                                                            <input
                                                                type="number"
                                                                step="0.1"
                                                                placeholder="K"
                                                                value={datos.valores[0]?.k || ''}
                                                                onKeyPress={(e) => {
                                                                    if (!/[\d.]|\Backspace|\Tab/i.test(e.key)) {
                                                                        e.preventDefault();
                                                                    }
                                                                    if (e.key === '.' && e.target.value.includes('.')) {
                                                                        e.preventDefault();
                                                                    }
                                                                }}
                                                                onChange={(e) => {
                                                                    const newValue = e.target.value;
                                                                    if (newValue === '' || /^\d*\.?\d*$/.test(newValue) ) {
                                                                        setParaclinicaData(prev => {
                                                                            const newValores = { ...prev.valores };
                                                                            if (!newValores['Na/K'].valores[0]) {
                                                                                newValores['Na/K'].valores[0] = { na: '', k: '' };
                                                                            }
                                                                            newValores['Na/K'].valores[0] = {
                                                                                ...newValores['Na/K'].valores[0],
                                                                                k: newValue
                                                                            };
                                                                            return {
                                                                                ...prev,
                                                                                valores: newValores
                                                                            };
                                                                        });
                                                                    }
                                                                }}
                                                                style={{
                                                                    width: '26%',
                                                                    margin: '0 5px',
                                                                    border: 'none',
                                                                    padding: '0.25rem',
                                                                    textAlign: 'center',
                                                                    color: '#333',  // Agregado para el texto
                                                                    '::placeholder': { color: '#333' },  // Para el placeholder
                                                                    backgroundColor: (() => {
                                                                        const valor = parseFloat(datos.valores[0]?.k);
                                                                        if (!valor) return 'white';
                                                                        const rango = rangosNormales.k;
                                                                        if (valor < rango.min || valor > rango.max) {
                                                                            return '#ffebee';
                                                                        }
                                                                        return '#e8f5e9';
                                                                    })()
                                                                }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        // Render normal para otros campos
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            value={datos.valores[0] || ''}
                                                            onKeyPress={(e) => {
                                                                if (!/[\d.]|\Backspace|\Tab/i.test(e.key)) {
                                                                    e.preventDefault();
                                                                }
                                                                if (e.key === '.' && e.target.value.includes('.')) {
                                                                    e.preventDefault();
                                                                }
                                                            }}
                                                            onChange={(e) => {
                                                                const newValue = e.target.value;
                                                                if (newValue === '' || /^\d*\.?\d*$/.test(newValue) ) {
                                                                    const newValores = { ...paraclinicaData.valores };
                                                                    newValores[variable].valores[0] = newValue;

                                                                    // Si es creatinina, calculamos el FG automáticamente
                                                                    if (variable === 'cr') {
                                                                        const fgValue = calcularFiltradoGlomerular(
                                                                            newValue,
                                                                            formData.edad,
                                                                            formData.peso,
                                                                            formData.talla,
                                                                            formData.sexo
                                                                        );
                                                                        if (!newValores['fg']) {
                                                                            newValores['fg'] = { valores: [] };
                                                                        }
                                                                        newValores['fg'].valores[0] = fgValue.toString();
                                                                    }

                                                                    setParaclinicaData(prev => ({
                                                                        ...prev,
                                                                        valores: newValores
                                                                    }));
                                                                }
                                                            }}
                                                            style={{
                                                                width: '70%',
                                                                margin: '0 5px',
                                                                border: '1px solid #ccc',  // Agregar un borde
                                                                borderRadius: '4px',  // Bordes redondeados
                                                                padding: '0.25rem',
                                                                textAlign: 'center',
                                                                color: '#333',  // Agregado color
                                                                backgroundColor: (() => {
                                                                    const valor = parseFloat(datos.valores[0]);
                                                                    if (!valor) return 'white';
                                                                    const rango = rangosNormales[variable];
                                                                    if (!rango) return 'white';
                                                                    if (valor < rango.min || valor > rango.max) {
                                                                        return '#ffebee';
                                                                    }
                                                                    return '#e8f5e9';
                                                                })()
                                                            }}
                                                        />
                                                    )}
                                                </td>
                                            </tr>
                                            {/* Flecha después de PCR */}
                                            <tr>

                                                    <td style={{
    ...styles.tableCell,
    fontWeight: 'bold',
    paddingLeft: '0.5rem',
    borderLeft: '1px solid #333'
}}>
    <button
        onClick={() => setGrupoHematologiaVisible(!grupoHematologiaVisible)}
        style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            padding: '0.1rem',
            color: '#333'
        }}
    >
        ▶
    </button>
</td>
<td style={styles.tableCell}></td>
</tr>
</>
);
}

return (
<tr key={variable}>
    <td style={{
        ...styles.tableCell,
        fontWeight: 'bold',
        paddingLeft: '0.5rem',
        borderLeft: variable === 'bt' ? '3px solid #4a5568' : '1px solid #333',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    }}>
        {/* Flecha expandible solo para BT */}
        {variable === 'bt' && (
            <button
                onClick={() => {
                    setParaclinicaData(prev => ({
                        ...prev,
                        valores: {
                            ...prev.valores,
                            bd: { ...prev.valores.bd, visible: !prev.valores.bd.visible },
                            bi: { ...prev.valores.bi, visible: !prev.valores.bi.visible },
                            alb: { ...prev.valores.alb, visible: !prev.valores.alb.visible },
                            fa: { ...prev.valores.fa, visible: !prev.valores.fa.visible },
                            gto: { ...prev.valores.gto, visible: !prev.valores.gto.visible },
                            gtp: { ...prev.valores.gtp, visible: !prev.valores.gtp.visible },
                            ggt: { ...prev.valores.ggt, visible: !prev.valores.ggt.visible }
                        }
                    }));
                }}
                style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    padding: '0.1rem',
                    color: '#333'
                }}
            >
                ▶
            </button>
        )}
        {/* Flecha para variables anidadas */}
        {(isHematologiaVar || isHepaticaVar) && <span>↳</span>}
        <span>
            {datos.display} {datos.unidad && `(${datos.unidad})`}
        </span>
    </td>
    <td style={styles.tableCell}>
        {variable === 'Na/K' ? (
            // Render especial para Na/K
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                <input
                    type="number"
                    step="0.1"
                    placeholder="Na"
                    value={datos.valores[0]?.na || ''}
                    onKeyPress={(e) => {
                        if (!/[\d.]|\Backspace|\Tab/i.test(e.key)) {
                            e.preventDefault();
                        }
                        if (e.key === '.' && e.target.value.includes('.')) {
                            e.preventDefault();
                        }
                    }}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        if (newValue === '' || /^\d*\.?\d*$/.test(newValue)){
                            setParaclinicaData(prev => {
                                const newValores = { ...prev.valores };
                                if (!newValores['Na/K'].valores[0]) {
                                    newValores['Na/K'].valores[0] = { na: '', k: '' };
                                }
                                newValores['Na/K'].valores[0] = {
                                    ...newValores['Na/K'].valores[0],
                                    na: newValue
                                };
                                return {
                                    ...prev,
                                    valores: newValores
                                };
                            });
                        }
                    }}
                    style={{
                        width: '28%',
                        margin: '0 5px',
                        border: 'none',
                        padding: '0.25rem',
                        textAlign: 'center',
                        color: '#333',  // Agregado para el texto
                        '::placeholder': { color: '#333' },  // Para el placeholder
                        backgroundColor: (() => {
                            const valor = parseFloat(datos.valores[0]?.na);
                            if (!valor) return 'white';
                            const rango = rangosNormales.na;
                            if (valor < rango.min || valor > rango.max) {
                                return '#ffebee';
                            }
                            return '#e8f5e9';
                        })()
                    }}
                />
                <span style={{ color: '#333' }}>/</span>
                <input
                    type="number"
                    step="0.1"
                    placeholder="K"
                    value={datos.valores[0]?.k || ''}
                    onKeyPress={(e) => {
                        if (!/[\d.]|\Backspace|\Tab/i.test(e.key)) {
                            e.preventDefault();
                        }
                        if (e.key === '.' && e.target.value.includes('.')) {
                            e.preventDefault();
                        }
                    }}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        if (newValue === '' || /^\d*\.?\d*$/.test(newValue) ) {
                            setParaclinicaData(prev => {
                                const newValores = { ...prev.valores };
                                if (!newValores['Na/K'].valores[0]) {
                                    newValores['Na/K'].valores[0] = { na: '', k: '' };
                                }
                                newValores['Na/K'].valores[0] = {
                                    ...newValores['Na/K'].valores[0],
                                    k: newValue
                                };
                                return {
                                    ...prev,
                                    valores: newValores
                                };
                            });
                        }
                    }}
                    style={{
                        width: '26%',
                        margin: '0 5px',
                        border: 'none',
                        padding: '0.25rem',
                        textAlign: 'center',
                        color: '#333',  // Agregado para el texto
                        '::placeholder': { color: '#333' },  // Para el placeholder
                        backgroundColor: (() => {
                            const valor = parseFloat(datos.valores[0]?.k);
                            if (!valor) return 'white';
                            const rango = rangosNormales.k;
                            if (valor < rango.min || valor > rango.max) {
                                return '#ffebee';
                            }
                            return '#e8f5e9';
                        })()
                    }}
                />
            </div>
        ) : (
            // Render normal para otros campos
            <input
                type="number"
                step="any"
                value={datos.valores[0] || ''}
                onKeyPress={(e) => {
                    if (!/[\d.]|\Backspace|\Tab/i.test(e.key)) {
                        e.preventDefault();
                    }
                    if (e.key === '.' && e.target.value.includes('.')) {
                        e.preventDefault();
                    }
                }}
                onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue === '' || /^\d*\.?\d*$/.test(newValue) ) {
                        const newValores = { ...paraclinicaData.valores };
                        newValores[variable].valores[0] = newValue;

                        // Si es creatinina, calculamos el FG automáticamente
                        if (variable === 'cr') {
                            const fgValue = calcularFiltradoGlomerular(
                                newValue,
                                formData.edad,
                                formData.peso,
                                formData.talla,
                                formData.sexo
                            );
                            if (!newValores['fg']) {
                                newValores['fg'] = { valores: [] };
                            }
                            newValores['fg'].valores[0] = fgValue.toString();
                        }

                        setParaclinicaData(prev => ({
                            ...prev,
                            valores: newValores
                        }));
                    }
                }}
                style={{
                    width: '70%',
                    margin: '0 5px',
                    border: '1px solid #ccc',  // Agregar un borde
                    borderRadius: '4px',  // Bordes redondeados
                    padding: '0.25rem',
                    textAlign: 'center',
                    color: '#333',  // Agregado color
                    backgroundColor: (() => {
                        const valor = parseFloat(datos.valores[0]);
                        if (!valor) return 'white';
                        const rango = rangosNormales[variable];
                        if (!rango) return 'white';
                        if (valor < rango.min || valor > rango.max) {
                            return '#ffebee';
                        }
                        return '#e8f5e9';
                    })()
                }}
            />
        )}
    </td>
</tr>
);
})
}
</tbody>
</table>
</div>

{/* Columna Móvil con Scroll */}
<div className="scrollable-column"
    style={{
        overflowX: 'auto',
        width: '100%',
        display: 'inline-block',
        verticalAlign: 'top',
        position: 'relative',
        borderLeft: '4px solid #eee',
        borderRight: '2px solid #e0e0e0', // Borde derecho
        borderTop: '2px solid #e0e0e0',
        borderBottom: '2px solid #e0e0e0',
        maxWidth: 'calc(100% - 20px)',
        maxWidth: '100%',    // Cambiamos a 100%
        scrollSnapType: 'x mandatory', // Agregamos scroll snap
        scrollBehavior: 'smooth'
    }}
    onMouseEnter={(e) => {
        e.currentTarget.style.overflowX = 'auto';
        const buttons = document.querySelector('.navigation-buttons');
        if (buttons) buttons.style.opacity = '1';
    }}
    onMouseLeave={(e) => {
        const buttons = document.querySelector('.navigation-buttons');
        const isOverButtons = e.relatedTarget && (
            e.relatedTarget.closest('.navigation-buttons') ||
            e.relatedTarget.closest('button')
        );

        if (!isOverButtons) {
            e.currentTarget.style.overflowX = 'hidden';
            if (buttons) buttons.style.opacity = '0';
        }
    }}
>
    <table style={{
        width: 'max-content',
        tableLayout: 'fixed',
        borderCollapse: 'collapse',
        marginRight: '0',
        display: 'block',
        overflowX: 'auto',
        borderLeft: '2px solid #ccc'
    }}>
        <thead>
            <tr style={{ height: '70px' }}>
                {visibleColumns.slice(1).map((columna, index) => (
                    <th key={index} style={{
                        ...styles.tableHeader,
                        width: '160px',
                        borderRight: '2px solid #eee',
                        background: index % 2 === 0 ? '#f8f9fa' : '#fff', // Alternancia de colores
                        scrollSnapAlign: 'start',
                        position: 'relative',
                        '&::after': {
                            content: '""',
                            position: 'absolute',
                            right: 0,
                            top: 0,
                            bottom: 0,
                            width: '1px',
                            background: 'rgba(0,0,0,0.1)'
                        }
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                <span>{columna.tipo === 'fi' ? 'FI' : ''}</span>
                                <button
                                    onClick={() => handleRemoveColumn(index)}  // Cambia esto
                                    style={{
                                        width: '24px',
                                        height: '24px',
                                        cursor: 'pointer',
                                        border: 'none',
                                        background: 'rgba(255, 68, 68, 0.1)',
                                        color: '#ff4444',
                                        fontSize: '16px',
                                        padding: '0',
                                        borderRadius: '50%',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s ease',
                                        visibility: columna.tipo === 'fi' || columna.tipo === 'protected' ? 'hidden' : 'visible',
                                        marginLeft: '4px',
                                        verticalAlign: 'middle'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(255, 68, 68, 0.2)';
                                        e.target.style.transform = 'scale(1.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'rgba(255, 68, 68, 0.1)';
                                        e.target.style.transform = 'scale(1)';
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                            <input
                                type="date"
                                value={columna.fecha}
                                onChange={(e) => {
                                    const newColumnas = [...paraclinicaData.columnas];
                                    newColumnas[index + 1].fecha = e.target.value;
                                    setParaclinicaData(prev => ({
                                        ...prev,
                                        columnas: newColumnas
                                    }));
                                }}
                                style={{
                                    width: '10%',
                                    minWidth: '120px',
                                    padding: '0.25rem',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px'
                                }}
                            />
                        </div>
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {Object.entries(paraclinicaData.valores).map(([variable, datos], index) => {
                // Misma lógica de agrupación
                const isHematologiaVar = ['hto', 'plt', 'Na/K', 'cl'].includes(variable);
                const isHepaticaVar = ['bd', 'bi', 'alb', 'fa', 'gto', 'gtp', 'ggt'].includes(variable);
                const isFixed = ['hb', 'gb', 'azo', 'cr', 'fg', 'ves', 'pcr'].includes(variable);

                // No mostrar variables ocultas
                if ((isHematologiaVar && !grupoHematologiaVisible) ||
                    (isHepaticaVar && !datos.visible)) {
                    return null;
                }

                if (variable === 'pcr') {
                    return (
                        <>
                            <tr key={variable}>
                            {visibleColumns.slice(1).map((_, colIndex) => (
    <td key={colIndex} style={{
        ...styles.tableCell,
        width: '160px',
        paddingLeft: '30px',
        borderRight: '1px solid #ccc',

    }}>
                                        {variable === 'Na/K' ? (
                                            // Render especial para Na/K - se mantiene igual
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="Na"
                                                    value={datos.valores[colIndex + 1]?.na || ''}
                                                    onKeyPress={(e) => {
                                                        if (!/[\d.]|\Backspace|\Tab/i.test(e.key)) {
                                                            e.preventDefault();
                                                        }
                                                        if (e.key === '.' && e.target.value.includes('.')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const newValue = e.target.value;
                                                        if (newValue === '' || /^\d*\.?\d*$/.test(newValue) ) {
                                                            setParaclinicaData(prev => {
                                                                const newValores = { ...prev.valores };
                                                                if (!newValores['Na/K'].valores[colIndex + 1]) {
                                                                    newValores['Na/K'].valores[colIndex + 1] = { na: '', k: '' };
                                                                }
                                                                newValores['Na/K'].valores[colIndex + 1] = {
                                                                    ...newValores['Na/K'].valores[colIndex + 1],
                                                                    na: newValue
                                                                };
                                                                return {
                                                                    ...prev,
                                                                    valores: newValores
                                                                };
                                                            });
                                                        }
                                                    }}
                                                    style={{
                                                        width: '28%',
                                                        margin: '0 5px',
                                                        border: 'none',
                                                        padding: '0.25rem',
                                                        textAlign: 'center',
                                                        color: '#333',  // Agregado para el texto
                                                        '::placeholder': { color: '#333' },  // Para el placeholder
                                                        backgroundColor: (() => {
                                                            const valor = parseFloat(datos.valores[colIndex + 1]?.na);
                                                            if (!valor) return 'white';
                                                            const rango = rangosNormales.na;
                                                            if (valor < rango.min || valor > rango.max) {
                                                                return '#ffebee';
                                                            }
                                                            return '#e8f5e9';
                                                        })()
                                                    }}
                                                />
                                                <span style={{ color: '#333' }}>/</span>
                                                <input
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="K"
                                                    value={datos.valores[colIndex + 1]?.k || ''}
                                                    onKeyPress={(e) => {
                                                        if (!/[\d.]|\Backspace|\Tab/i.test(e.key)) {
                                                            e.preventDefault();
                                                        }
                                                        if (e.key === '.' && e.target.value.includes('.')) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                    onChange={(e) => {
                                                        const newValue = e.target.value;
                                                        if (newValue === '' || /^\d*\.?\d*$/.test(newValue) ) {
                                                            setParaclinicaData(prev => {
                                                                const newValores = { ...prev.valores };
                                                                if (!newValores['Na/K'].valores[colIndex + 1]) {
                                                                    newValores['Na/K'].valores[colIndex + 1] = { na: '', k: '' };
                                                                }
                                                                newValores['Na/K'].valores[colIndex + 1] = {
                                                                    ...newValores['Na/K'].valores[colIndex + 1],
                                                                    k: newValue
                                                                };
                                                                return {
                                                                    ...prev,
                                                                    valores: newValores
                                                                };
                                                            });
                                                        }
                                                    }}
                                                    style={{
                                                        width: '26%',
                                                        margin: '0 5px',
                                                        border: 'none',
                                                        padding: '0.25rem',
                                                        textAlign: 'center',
                                                        color: '#333',  // Agregado para el texto
                                                        '::placeholder': { color: '#333' },  // Para el placeholder
                                                        backgroundColor: (() => {
                                                            const valor = parseFloat(datos.valores[colIndex + 1]?.k);
                                                            if (!valor) return 'white';
                                                            const rango = rangosNormales.k;
                                                            if (valor < rango.min || valor > rango.max) {
                                                                return '#ffebee';
                                                            }
                                                            return '#e8f5e9';
                                                        })()
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            // Render normal para otros campos
                                            <input
                                                type="number"
                                                step="0.1"
                                                value={datos.valores[colIndex + 1] || ''}
                                                onKeyPress={(e) => {
                                                    if (!/[\d.]|\Backspace|\Tab/i.test(e.key)) {
                                                        e.preventDefault();
                                                    }
                                                    if (e.key === '.' && e.target.value.includes('.')) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    const newValue = e.target.value;
                                                    if (newValue === '' || /^\d*\.?\d*$/.test(newValue) ) {
                                                        const newValores = { ...paraclinicaData.valores };
                                                        newValores[variable].valores[colIndex + 1] = newValue;

                                                        // Si es creatinina, calculamos el FG automáticamente
                                                        if (variable === 'cr') {
                                                            const fgValue = calcularFiltradoGlomerular(
                                                                newValue,
                                                                formData.edad,
                                                                formData.peso,
                                                                formData.talla,
                                                                formData.sexo
                                                            );
                                                            if (!newValores['fg']) {
                                                                newValores['fg'] = { valores: [] };
                                                            }
                                                            newValores['fg'].valores[colIndex + 1] = fgValue.toString();
                                                        }

                                                        setParaclinicaData(prev => ({
                                                            ...prev,
                                                            valores: newValores
                                                        }));
                                                    }
                                                }}
                                                style={{
                                                    width: '70%',
                                                    margin: '0 5px',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px',
                                                    padding: '0.25rem',
                                                    textAlign: 'center',
                                                    color: '#333',
                                                    backgroundColor: (() => {
                                                        const valor = parseFloat(datos.valores[colIndex + 1]);
                                                        if (!valor) return 'white';
                                                        const rango = rangosNormales[variable];
                                                        if (!rango) return 'white';
                                                        if (valor < rango.min || valor > rango.max) {
                                                            return '#ffebee';
                                                        }
                                                        return '#e8f5e9';
                                                    })()
                                                }}
                                            />
                                        )}
                                    </td>
                                ))}
                            </tr>
                            {/* Flecha después de PCR */}
                            <tr>
                                {visibleColumns.slice(1).map((_, colIndex) => (
                                    <td key={colIndex} style={{
                                        ...styles.tableCell,
                                        width: '160px',
                                        paddingLeft: '30px',
                                        borderRight: '1px solid #ccc'
                                    }}>
                                        <button
                                            onClick={() => setGrupoHematologiaVisible(!grupoHematologiaVisible)}
                                            style={{
                                                border: 'none',
                                                background: 'none',
                                                cursor: 'pointer',
                                                padding: '0.1rem',
                                                color: '#333'
                                            }}
                                        >
                                        </button>
                                    </td>
                                ))}
                            </tr>
                        </>
                    );
                }

                return (
                    <tr key={variable}>
                        {visibleColumns.slice(1).map((_, colIndex) => (
                            <td key={colIndex} style={{
                                ...styles.tableCell,
                                width: '160px',
                                paddingLeft: '30px',
                                borderRight: '1px solid #ccc',
                                // Agregar padding extra para variables anidadas
                                paddingLeft: (isHematologiaVar || isHepaticaVar) ? '30px' : '30px'
                            }}>
                                {variable === 'Na/K' ? (
                                    // Render especial para Na/K - se mantiene igual
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                                        <input
                                            type="number"
                                            step="0.1"
                                            placeholder="Na"
                                            value={datos.valores[colIndex + 1]?.na || ''}
                                            onKeyPress={(e) => {
                                                if (!/[\d.]|\Backspace|\Tab/i.test(e.key)) {
                                                    e.preventDefault();
                                                }
                                                if (e.key === '.' && e.target.value.includes('.')) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                if (newValue === '' || /^\d*\.?\d*$/.test(newValue) ) {
                                                    setParaclinicaData(prev => {
                                                        const newValores = { ...prev.valores };
                                                        if (!newValores['Na/K'].valores[colIndex + 1]) {
                                                            newValores['Na/K'].valores[colIndex + 1] = { na: '', k: '' };
                                                        }
                                                        newValores['Na/K'].valores[colIndex + 1] = {
                                                            ...newValores['Na/K'].valores[colIndex + 1],
                                                            na: newValue
                                                        };
                                                        return {
                                                            ...prev,
                                                            valores: newValores
                                                        };
                                                    });
                                                }
                                            }}
                                            style={{
                                                width: '28%',
                                                margin: '0 5px',
                                                border: 'none',
                                                padding: '0.25rem',
                                                textAlign: 'center',
                                                color: '#333',  // Agregado para el texto
                                                '::placeholder': { color: '#333' },  // Para el placeholder
                                                backgroundColor: (() => {
                                                    const valor = parseFloat(datos.valores[colIndex + 1]?.na);
                                                    if (!valor) return 'white';
                                                    const rango = rangosNormales.na;
                                                    if (valor < rango.min || valor > rango.max) {
                                                        return '#ffebee';
                                                    }
                                                    return '#e8f5e9';
                                                })()
                                            }}
                                        />
                                        <span style={{ color: '#333' }}>/</span>
                                        <input
                                            type="number"
                                            step="0.1"
                                            placeholder="K"
                                            value={datos.valores[colIndex + 1]?.k || ''}
                                            onKeyPress={(e) => {
                                                if (!/[\d.]|\Backspace|\Tab/i.test(e.key)) {
                                                    e.preventDefault();
                                                }
                                                if (e.key === '.' && e.target.value.includes('.')) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                if (newValue === '' || /^\d*\.?\d*$/.test(newValue) ) {
                                                    setParaclinicaData(prev => {
                                                        const newValores = { ...prev.valores };
                                                        if (!newValores['Na/K'].valores[colIndex + 1]) {
                                                            newValores['Na/K'].valores[colIndex + 1] = { na: '', k: '' };
                                                        }
                                                        newValores['Na/K'].valores[colIndex + 1] = {
                                                            ...newValores['Na/K'].valores[colIndex + 1],
                                                            k: newValue
                                                        };
                                                        return {
                                                            ...prev,
                                                            valores: newValores
                                                        };
                                                    });
                                                }
                                            }}
                                            style={{
                                                width: '26%',
                                                margin: '0 5px',
                                                border: 'none',
                                                padding: '0.25rem',
                                                textAlign: 'center',
                                                color: '#333',  // Agregado para el texto
                                                '::placeholder': { color: '#333' },  // Para el placeholder
                                                backgroundColor: (() => {
                                                    const valor = parseFloat(datos.valores[colIndex + 1]?.k);
                                                    if (!valor) return 'white';
                                                    const rango = rangosNormales.k;
                                                    if (valor < rango.min || valor > rango.max) {
                                                        return '#ffebee';
                                                    }
                                                    return '#e8f5e9';
                                                })()
                                            }}
                                        />
                                    </div>
                                ) : (
                                    // Render normal para otros campos
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={datos.valores[colIndex + 1] || ''}
                                        onKeyPress={(e) => {
                                            if (!/[\d.]|\Backspace|\Tab/i.test(e.key)) {
                                                e.preventDefault();
                                            }
                                            if (e.key === '.' && e.target.value.includes('.')) {
                                                e.preventDefault();
                                            }
                                        }}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            if (newValue === '' || /^\d*\.?\d*$/.test(newValue) ) {
                                                const newValores = { ...paraclinicaData.valores };
                                                newValores[variable].valores[colIndex + 1] = newValue;

                                                // Si es creatinina, calculamos el FG automáticamente
                                                if (variable === 'cr') {
                                                    const fgValue = calcularFiltradoGlomerular(
                                                        newValue,
                                                        formData.edad,
                                                        formData.peso,
                                                        formData.talla,
                                                        formData.sexo
                                                    );
                                                    if (!newValores['fg']) {
                                                        newValores['fg'] = { valores: [] };
                                                    }
                                                    newValores['fg'].valores[colIndex + 1] = fgValue.toString();
                                                }

                                                setParaclinicaData(prev => ({
                                                    ...prev,
                                                    valores: newValores
                                                }));
                                            }
                                        }}
                                        style={{
                                            width: '70%',
                                            margin: '0 5px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            padding: '0.25rem',
                                            textAlign: 'center',
                                            color: '#333',
                                            backgroundColor: (() => {
                                                const valor = parseFloat(datos.valores[colIndex + 1]);
                                                if (!valor) return 'white';
                                                const rango = rangosNormales[variable];
                                                if (!rango) return 'white';
                                                if (valor < rango.min || valor > rango.max) {
                                                    return '#ffebee';
                                                }
                                                return '#e8f5e9';
                                            })()
                                        }}
                                    />
                                )}
                            </td>
                        ))}
                    </tr>
                );
            })}
        </tbody>
    </table>
</div>

{/* Botones de navegación */}
<div
    className="navigation-buttons"
    style={{
        opacity: 0,
        transition: 'opacity 0.3s ease',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 100
    }}
>
    {paraclinicaData.columnas.length > 1 && (
        <>
            <button
                onClick={scrollLeft}
                style={{
                    position: 'absolute',
                    left: '342px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    backgroundColor: 'rgba(13, 110, 253, 0.15)',
                    border: 'none',
                    width: '40px',
                    height: '60px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(4px)',
                    pointerEvents: 'auto',
                    boxShadow: '0 2px 8px rgba(13, 110, 253, 0.15)',
                    clipPath: 'path("M 30 0 L 0 30 L 30 60 C 35 60 40 55 40 50 L 40 10 C 40 5 35 0 30 0")', // Flecha hacia la izquierda
                    color: 'rgba(13, 110, 253, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(13, 110, 253, 0.25)';
                    e.target.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(13, 110, 253, 0.15)';
                    e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
            >
                ❮
            </button>

            <button
                onClick={scrollRight}
                style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 10,
                    backgroundColor: 'rgba(13, 110, 253, 0.15)',
                    border: 'none',
                    width: '40px',
                    height: '60px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    backdropFilter: 'blur(4px)',
                    pointerEvents: 'auto',
                    boxShadow: '0 2px 8px rgba(13, 110, 253, 0.15)',
                    clipPath: 'path("M 10 0 L 40 30 L 10 60 C 5 60 0 55 0 50 L 0 10 C 0 5 5 0 10 0")', // Flecha hacia la derecha
                    color: 'rgba(13, 110, 253, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(13, 110, 253, 0.25)';
                    e.target.style.transform = 'translateY(-50%) scale(1.1)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(13, 110, 253, 0.15)';
                    e.target.style.transform = 'translateY(-50%) scale(1)';
                }}
            >
                ❯
            </button>
        </>
    )}
</div>

{/* Efecto de sombra para indicar más columnas a la derecha */}
{paraclinicaData.columnas.length > visibleColumns.length && (
    <div style={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '20px',
        background: 'linear-gradient(to right, rgba(255,255,255,0), rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.1))',
        pointerEvents: 'none',
        zIndex: 10
    }}/>
)}
</div>
</div>
);
}

export default Paraclinica;
