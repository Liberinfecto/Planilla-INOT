const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
function Form() {
const [formData, setFormData] = React.useState({
    name: '',
    floor: '',
    ci: '',
    age: '',
    origin: '',
    fi: '',
    fConsult: '',
    fe: '',
    fractura: '',
    fracturaDetalles: '',  // Para comentarios de fractura
    osteosintesis: '',              // para el SI/NO principal
    osteosintesisTipos: [],         // array de objetos con: { tipo, fechaColocacion, extraido, fechaExtraccion }
    fracturaTipo: '',      // 'unica' o 'multiple'
    // Para fractura única
    fracturaHueso: '',     // el hueso seleccionado
    fracturaHuesoTipo: '', // 'cerrada' o 'expuesta'
    fracturaHuesoDesplazamiento: '', // 'desplazada' o 'noDesplazada' (si es cerrada)
    fracturaHuesoGustilo: '',  // 'I', 'II', etc (si es expuesta)
    // Para fracturas múltiples
    fracturaHuesos: [], // Array de objetos, cada uno con: { hueso, tipo, desplazamiento, gustilo }
});

const [antecedentes, setAntecedentes] = React.useState({
    fractura: '',               // para el SI/NO
    fracturaHueso: '',         // para el hueso seleccionado
    fracturaFecha: {           // para fecha y comentarios
        comentarios: ''
    },
    fracturaExpuesta: '',      // para el SI/NO de expuesta
    fracturaGustilo: '',       // para clasificación Gustilo si es expuesta
    osteosintesis: '',         // para el SI/NO de osteosíntesis
    osteosintesisTipo: '',     // para el tipo de osteosíntesis
    osteosintesisFecha: {      // para fecha y comentarios
        comentarios: ''
    }
});

const handleAntecedentesChange = (campo, valor, parteFecha) => {
    if (parteFecha) {
        setAntecedentes(prev => ({
            ...prev,
            fracturaFecha: {
                ...prev.fracturaFecha,
                [parteFecha]: valor
            }
        }));
    } else {
        setAntecedentes(prev => ({
            ...prev,
            [campo]: valor
        }));
    }
};

const [radioSelections, setRadioSelections] = React.useState({});

    const handleInputChange = (fieldName, value) => {
        setFormData(prevData => ({
            ...prevData,
            [fieldName]: value
        }));
    };

    const handleRadioClick = (name, value) => {
        setRadioSelections(prev => {
            if (prev[name] === value) {
                const newSelections = { ...prev };
                delete newSelections[name];
                return newSelections;
            }
            return {
                ...prev,
                [name]: value
            };
        });
    };

    const styles = {
        container: {
            maxWidth: '1024px',
            margin: '0 auto',
            padding: '1rem',
            width: '100%',
            boxSizing: 'border-box'
        },
        header: {
            fontSize: '1.25rem',
            fontWeight: 'bold',
            textAlign: 'center'
        },
        subheader: {
            fontSize: '1rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '1rem'
        },
        formContainer: {
            border: '1px solid #333',
            padding: '1rem',
            width: '100%',
            boxSizing: 'border-box'
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(2, 1fr)',
            gap: '1rem',
            marginBottom: '1rem'
        },
        fullWidth: {
            gridColumn: '1 / -1',
            marginBottom: '1rem'
        },
        inputGroup: {
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0.5rem'
        },
        label: {
            fontWeight: 'bold',
            minWidth: '100px',
            marginRight: '0.5rem'
        },
        input: {
            flex: 1,
            borderBottom: '1px solid black',
            padding: '0.25rem',
            minWidth: 0
        },
        dateContainer: {
            display: 'grid',
            gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)',
            gap: '1rem',
            marginTop: '1rem'
        },
        dateGroup: {
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
        },
        dateLabel: {
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
        },
        dateInput: {
            flex: 1,
            padding: '0.25rem',
            borderBottom: '1px solid black'
        },
        // Nuevos estilos para la tabla
        table: {
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: '1rem'
        },
        tableHeader: {
            backgroundColor: '#f3f4f6',
            border: '1px solid #333',
            padding: '0.5rem',
            textAlign: 'center',
            fontWeight: 'bold'
        },
        tableCell: {
            border: '1px solid #333',
            padding: '0.5rem'
        },
        radioGroup: {
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem'
        },
        radio: {
            cursor: 'pointer'
        }
    };

    return React.createElement('div', { style: styles.container },
        // Header
        React.createElement('h1', { style: styles.header }, 
            'CATEDRA DE ENFERMEDADES INFECCIOSAS'
        ),
        React.createElement('h2', { style: styles.subheader }, 
            'ASISTENCIA DE PACIENTES EN INOT'
        ),
        
        // Formulario principal (datos del paciente)
        React.createElement('div', { style: styles.formContainer },
            // Campos en grid
            React.createElement('div', { style: styles.grid },
                // Campo Nombre
                React.createElement('div', { style: styles.inputGroup },
                    React.createElement('span', { style: styles.label }, 'Nombre:'),
                    React.createElement('input', { 
                        type: 'text',
                        value: formData.name,
                        onChange: (e) => handleInputChange('name', e.target.value),
                        style: styles.input
                    })
                ),
                // Campo Piso/Cama
                React.createElement('div', { style: styles.inputGroup },
                    React.createElement('span', { style: styles.label }, 'Piso/Cama:'),
                    React.createElement('input', { 
                        type: 'text',
                        value: formData.floor,
                        onChange: (e) => handleInputChange('floor', e.target.value),
                        style: styles.input
                    })
                ),
                // Campo CI
                React.createElement('div', { style: styles.inputGroup },
                    React.createElement('span', { style: styles.label }, 'CI:'),
                    React.createElement('input', { 
                        type: 'text',
                        value: formData.ci,
                        onChange: (e) => handleInputChange('ci', e.target.value),
                        style: styles.input
                    })
                ),
                // Campo Edad
                React.createElement('div', { style: styles.inputGroup },
                    React.createElement('span', { style: styles.label }, 'Edad:'),
                    React.createElement('input', { 
                        type: 'text',
                        value: formData.age,
                        onChange: (e) => handleInputChange('age', e.target.value),
                        style: styles.input
                    })
                ),
                // Campo Procedencia
                React.createElement('div', { style: { ...styles.inputGroup, ...styles.fullWidth } },
                    React.createElement('span', { style: styles.label }, 'Procedencia:'),
                    React.createElement('input', { 
                        type: 'text',
                        value: formData.origin,
                        onChange: (e) => handleInputChange('origin', e.target.value),
                        style: styles.input
                    })
                )
            ),
            // Contenedor de fechas
            React.createElement('div', { style: styles.dateContainer },
                // Campo FI
                React.createElement('div', { style: styles.dateGroup },
                    React.createElement('span', { style: styles.dateLabel }, 'FI:'),
                    React.createElement('input', { 
                        type: 'date',
                        value: formData.fi,
                        onChange: (e) => handleInputChange('fi', e.target.value),
                        style: styles.dateInput
                    })
                ),
                // Campo F consulta infecto
                React.createElement('div', { style: styles.dateGroup },
                    React.createElement('span', { style: styles.dateLabel }, 'F consulta infecto:'),
                    React.createElement('input', { 
                        type: 'date',
                        value: formData.fConsult,
                        onChange: (e) => handleInputChange('fConsult', e.target.value),
                        style: styles.dateInput
                    })
                ),
                // Campo FE
                React.createElement('div', { style: styles.dateGroup },
                    React.createElement('span', { style: styles.dateLabel }, 'FE:'),
                    React.createElement('input', { 
                        type: 'date',
                        value: formData.fe,
                        onChange: (e) => handleInputChange('fe', e.target.value),
                        style: styles.dateInput
                    })
                )
            )
        ),
      // Sección de Antecedentes Traumatológicos
        React.createElement('div', { style: { marginTop: '2rem', border: '1px solid #333', padding: '1rem' } },
            React.createElement('table', { style: styles.table },
                // Cabecera de la tabla
                React.createElement('thead', null,
                    React.createElement('tr', null,
                        React.createElement('th', { style: styles.tableHeader }, 'Antecedentes Traumatológicos'),
                        React.createElement('th', { style: styles.tableHeader }, 'SI'),
                        React.createElement('th', { style: styles.tableHeader }, 'NO'),
                        React.createElement('th', { style: styles.tableHeader }, 'Detalles')
                    )
                ),
                React.createElement('tbody', null,
// FRACTURA - Nivel 1
                    React.createElement('tr', null,
                        React.createElement('td', { style: styles.tableCell }, 'Fractura'),
                        React.createElement('td', { style: styles.tableCell },
                            React.createElement('input', {
                                type: 'radio',
                                name: 'antecedenteFractura',
                                style: styles.radio,
                                checked: antecedentes.fractura === 'si',
                                onChange: () => {},
                                onClick: () => {
                                    if (antecedentes.fractura === 'si') {
                                        handleAntecedentesChange('fractura', '');
                                    } else {
                                        handleAntecedentesChange('fractura', 'si');
                                    }
                                }
                            })
                        ),
                        React.createElement('td', { style: styles.tableCell },
                            React.createElement('input', {
                                type: 'radio',
                                name: 'antecedenteFractura',
                                style: styles.radio,
                                checked: antecedentes.fractura === 'no',
                                onChange: () => {},
                                onClick: () => {
                                    if (antecedentes.fractura === 'no') {
                                        handleAntecedentesChange('fractura', '');
                                    } else {
                                        handleAntecedentesChange('fractura', 'no');
                                    }
                                }
                            })
                        ),
                        React.createElement('td', { style: styles.tableCell },
                            antecedentes.fractura === 'si' && React.createElement('div', {
                                style: {
                                    display: 'flex',
                                    gap: '1rem',
                                    alignItems: 'center'
                                }
                            },
// Selector de hueso
                                React.createElement('select', {
                                    style: { ...styles.input, width: '150px' },
                                    value: antecedentes.fracturaHueso,
                                    onChange: (e) => handleAntecedentesChange('fracturaHueso', e.target.value)
                                },
                                    React.createElement('option', { value: '' }, 'Seleccionar hueso...'),
                                    // Miembro Superior
                                    React.createElement('optgroup', { label: 'Miembro Superior' },
                                        React.createElement('option', { value: 'humero' }, 'Húmero'),
                                        React.createElement('option', { value: 'radio' }, 'Radio'),
                                        React.createElement('option', { value: 'cubito' }, 'Cúbito'),
                                        React.createElement('option', { value: 'clavicula' }, 'Clavícula'),
                                        React.createElement('option', { value: 'escapula' }, 'Escápula'),
                                        React.createElement('option', { value: 'carpo' }, 'Carpo')
                                    ),
                                    // Cadera/Pelvis
                                    React.createElement('optgroup', { label: 'Cadera/Pelvis' },
                                        React.createElement('option', { value: 'pelvis' }, 'Pelvis'),
                                        React.createElement('option', { value: 'acetabulo' }, 'Acetábulo'),
                                        React.createElement('option', { value: 'cabeza_femoral' }, 'Cabeza Femoral'),
                                        React.createElement('option', { value: 'cuello_femoral' }, 'Cuello Femoral'),
                                        React.createElement('option', { value: 'intertrocanterica' }, 'Intertrocantérica'),
                                        React.createElement('option', { value: 'subtrocanterica' }, 'Subtrocantérica'),
                                        React.createElement('option', { value: 'iliaco' }, 'Ilíaco'),
                                        React.createElement('option', { value: 'isquion' }, 'Isquion'),
                                        React.createElement('option', { value: 'pubis' }, 'Pubis'),
                                        React.createElement('option', { value: 'sacro' }, 'Sacro')
                                    ),
                                    // Miembro Inferior
                                    React.createElement('optgroup', { label: 'Miembro Inferior' },
                                        React.createElement('option', { value: 'femur' }, 'Fémur'),
                                        React.createElement('option', { value: 'rotula' }, 'Rótula'),
                                        React.createElement('option', { value: 'tibia' }, 'Tibia'),
                                        React.createElement('option', { value: 'pilon_tibial' }, 'Pilón Tibial'),
                                        React.createElement('option', { value: 'perone' }, 'Peroné'),
                                        React.createElement('option', { value: 'tobillo' }, 'Tobillo'),
                                        React.createElement('option', { value: 'calcaneo' }, 'Calcáneo'),
                                        React.createElement('option', { value: 'tarso' }, 'Tarso')
                                    )
                                ),
                                // Textarea expandible para Fecha/Comentarios
                                React.createElement('textarea', {
                                    placeholder: 'Fecha/Comentarios',
                                    style: {
                                        ...styles.input,
                                        width: '200px',
                                        minHeight: '2rem',
                                        resize: 'vertical',
                                        overflow: 'auto'
                                    },
                                    value: antecedentes.fracturaFecha.comentarios || '',
                                    onChange: (e) => handleAntecedentesChange(null, e.target.value, 'comentarios')
                                })
                            )
                        )
                    ),
                    // Fila de Expuesta (aparece solo si hay fractura)
                    antecedentes.fractura === 'si' && React.createElement('tr', null,
                        React.createElement('td', { 
                            style: { 
                                ...styles.tableCell,
                                paddingLeft: '2rem'
                            } 
                        }, '↳ Expuesta:'),
                        React.createElement('td', { style: styles.tableCell },
                            React.createElement('input', {
                                type: 'radio',
                                name: 'antecedenteExpuesta',
                                style: styles.radio,
                                checked: antecedentes.fracturaExpuesta === 'si',
                                onChange: () => {},
                                onClick: () => {
                                    if (antecedentes.fracturaExpuesta === 'si') {
                                        handleAntecedentesChange('fracturaExpuesta', '');
                                    } else {
                                        handleAntecedentesChange('fracturaExpuesta', 'si');
                                    }
                                }
                            })
                        ),
                        React.createElement('td', { style: styles.tableCell },
                            React.createElement('input', {
                                type: 'radio',
                                name: 'antecedenteExpuesta',
                                style: styles.radio,
                                checked: antecedentes.fracturaExpuesta === 'no',
                                onChange: () => {},
                                onClick: () => {
                                    if (antecedentes.fracturaExpuesta === 'no') {
                                        handleAntecedentesChange('fracturaExpuesta', '');
                                    } else {
                                        handleAntecedentesChange('fracturaExpuesta', 'no');
                                    }
                                }
                            })
                        ),
                        React.createElement('td', { style: styles.tableCell },
                            antecedentes.fracturaExpuesta === 'si' && 
                            React.createElement('select', {
                                style: { ...styles.input, width: '150px' },
                                value: antecedentes.fracturaGustilo,
                                onChange: (e) => handleAntecedentesChange('fracturaGustilo', e.target.value)
                            },
                                React.createElement('option', { value: '' }, 'Gustilo-Anderson...'),
                                React.createElement('option', { value: 'I' }, 'Gustilo I'),
                                React.createElement('option', { value: 'II' }, 'Gustilo II'),
                                React.createElement('option', { value: 'IIIa' }, 'Gustilo IIIa'),
                                React.createElement('option', { value: 'IIIb' }, 'Gustilo IIIb'),
                                React.createElement('option', { value: 'IIIc' }, 'Gustilo IIIc')
                            )
                        )
                    ),

Voy a revisar nuevamente el código completo para asegurar que cada apertura tenga su correspondiente cierre. Lo ajustaré si es necesario y volveré a verificarlo línea por línea.
Revisión Detallada de Paréntesis

Aquí tienes el bloque completo, desde // OSTEOSINTESIS - Nivel 1 hasta // Sección de Enfermedad Actual, con paréntesis revisados cuidadosamente:

// OSTEOSINTESIS - Nivel 1
                    antecedentes.fractura === 'si' && React.createElement('tr', null,
                        React.createElement('td', { 
                            style: { 
                                ...styles.tableCell,
                                paddingLeft: '2rem'
                            } 
                        }, '↳ Osteosíntesis:'),
                        React.createElement('td', { style: styles.tableCell },
                            React.createElement('input', {
                                type: 'radio',
                                name: 'antecedenteOsteosintesis',
                                style: styles.radio,
                                checked: antecedentes.osteosintesis === 'si',
                                onChange: () => {},
                                onClick: () => {
                                    if (antecedentes.osteosintesis === 'si') {
                                        handleAntecedentesChange('osteosintesis', '');
                                    } else {
                                        handleAntecedentesChange('osteosintesis', 'si');
                                    }
                                }
                            })
                        ),
                        React.createElement('td', { style: styles.tableCell },
                            React.createElement('input', {
                                type: 'radio',
                                name: 'antecedenteOsteosintesis',
                                style: styles.radio,
                                checked: antecedentes.osteosintesis === 'no',
                                onChange: () => {},
                                onClick: () => {
                                    if (antecedentes.osteosintesis === 'no') {
                                        handleAntecedentesChange('osteosintesis', '');
                                    } else {
                                        handleAntecedentesChange('osteosintesis', 'no');
                                    }
                                }
                            })
                        ),
                        React.createElement('td', { style: styles.tableCell },
                            antecedentes.osteosintesis === 'si' && React.createElement('div', {
                                style: {
                                    display: 'flex',
                                    gap: '1rem',
                                    alignItems: 'center'
                                }
                            },
                                React.createElement('select', {
                                    style: { ...styles.input, width: '200px' },
                                    value: antecedentes.osteosintesisTipo || '',
                                    onChange: (e) => handleAntecedentesChange('osteosintesisTipo', e.target.value)
                                },
                                    React.createElement('option', { value: '' }, 'Tipo de Osteosíntesis...'),
                                    React.createElement('option', { value: 'FFEE' }, 'FFEE'),
                                    React.createElement('option', { value: 'EEM' }, 'EEM'),
                                    React.createElement('option', { value: 'Placas' }, 'Placas'),
                                    React.createElement('option', { value: 'Tornillos' }, 'Tornillos'),
                                    React.createElement('option', { value: 'Fijador_Ilizarov' }, 'Fijador de Ilizarov'),
                                    React.createElement('option', { value: 'Alambres_Kirschner' }, 'Alambres de Kirschner'),
                                    React.createElement('option', { value: 'Grapas_metalicas' }, 'Grapas metálicas'),
                                    React.createElement('option', { value: 'Otros' }, 'Otros')
                                ),
                                React.createElement('textarea', {
                                    placeholder: 'Fecha/Comentarios',
                                    style: {
                                        ...styles.input,
                                        width: '200px',
                                        minHeight: '2rem',
                                        resize: 'vertical',
                                        overflow: 'auto'
                                    },
                                    value: antecedentes.osteosintesisFecha.comentarios || '',
                                    onChange: (e) => handleAntecedentesChange(null, e.target.value, 'comentarios')
                                })
                            )
                        )
                    ),

// Sección de Enfermedad Actual



        React.createElement('div', { style: { marginTop: '2rem', border: '1px solid #333', padding: '1rem' } },
            React.createElement('table', { style: styles.table },
                // Cabecera de la tabla
                React.createElement('thead', null,
                    React.createElement('tr', null,
                        React.createElement('th', { style: styles.tableHeader }, 'Enfermedad Actual'),
                        React.createElement('th', { style: styles.tableHeader }, 'SI'),
                        React.createElement('th', { style: styles.tableHeader }, 'NO'),
                        React.createElement('th', { style: styles.tableHeader }, 'Detalles')
                    )
                ),
                React.createElement('tbody', null,
       // FRACTURA - Nivel 1
                    React.createElement('tr', null,
                        React.createElement('td', { style: styles.tableCell }, 'Fractura'),
                        React.createElement('td', { style: styles.tableCell },
                            React.createElement('input', {
                                type: 'radio',
                                name: 'fractura',
                                style: styles.radio,
                                checked: radioSelections['fractura'] === 'si',
                                onChange: () => {},
                                onClick: () => handleRadioClick('fractura', 'si')
                            })
                        ),
                        React.createElement('td', { style: styles.tableCell },
                            React.createElement('input', {
                                type: 'radio',
                                name: 'fractura',
                                style: styles.radio,
                                checked: radioSelections['fractura'] === 'no',
                                onChange: () => {},
                                onClick: () => handleRadioClick('fractura', 'no')
                            })
                        ),
                        React.createElement('td', { style: styles.tableCell },
                            React.createElement('textarea', {
                                value: formData.fracturaDetalles || '',
                                onChange: (e) => handleInputChange('fracturaDetalles', e.target.value),
                                placeholder: 'Agregar comentarios...',
                                style: {
                                    ...styles.input,
                                    width: '100%',
                                    minHeight: '2rem',
                                    resize: 'vertical',
                                    overflow: 'auto'
                                }
                            })
                      )
                    ),
                    // Selector Única/Múltiple
                    radioSelections['fractura'] === 'si' && React.createElement('tr', null,
                        React.createElement('td', { 
                            style: { 
                                ...styles.tableCell,
                                paddingLeft: '2rem'
                            } 
                        }, '↳ Tipo:'),
                        React.createElement('td', { colSpan: 3, style: styles.tableCell },
                            React.createElement('select', {
                                style: { ...styles.input, width: '150px' },
                                value: formData.fracturaTipo || '',
                                onChange: (e) => handleInputChange('fracturaTipo', e.target.value)
                            },
                                React.createElement('option', { value: '' }, 'Seleccionar...'),
                                React.createElement('option', { value: 'unica' }, 'Única'),
                                React.createElement('option', { value: 'multiple' }, 'Múltiple')
                            )
                        )
                    ),
                    // Selector de hueso único con sus detalles
                    (radioSelections['fractura'] === 'si' && formData.fracturaTipo === 'unica') && 
                    React.createElement('tr', null,
                        React.createElement('td', { 
                            style: { 
                                ...styles.tableCell,
                                paddingLeft: '2rem'
                            } 
                        }, '↳ Hueso:'),
                        React.createElement('td', { colSpan: 3, style: styles.tableCell },
                            React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '1rem' } },
                                // Selector de hueso
                                React.createElement('select', {
                                    style: { ...styles.input, width: '200px' },
                                    value: formData.fracturaHueso || '',
                                    onChange: (e) => handleInputChange('fracturaHueso', e.target.value)
                                },
                                    React.createElement('option', { value: '' }, 'Seleccionar hueso...'),
                                    // Miembro Superior
                                    React.createElement('optgroup', { label: 'Miembro Superior' },
                                        React.createElement('option', { value: 'humero' }, 'Húmero'),
                                        React.createElement('option', { value: 'radio' }, 'Radio'),
                                        React.createElement('option', { value: 'cubito' }, 'Cúbito'),
                                        React.createElement('option', { value: 'clavicula' }, 'Clavícula'),
                                        React.createElement('option', { value: 'escapula' }, 'Escápula'),
                                        React.createElement('option', { value: 'carpo' }, 'Carpo')
                                    ),
                                    // Cadera/Pelvis
                                    React.createElement('optgroup', { label: 'Cadera/Pelvis' },
                                        React.createElement('option', { value: 'pelvis' }, 'Pelvis'),
                                        React.createElement('option', { value: 'acetabulo' }, 'Acetábulo'),
                                        React.createElement('option', { value: 'cabeza_femoral' }, 'Cabeza Femoral'),
                                        React.createElement('option', { value: 'cuello_femoral' }, 'Cuello Femoral'),
                                        React.createElement('option', { value: 'intertrocanterica' }, 'Intertrocantérica'),
                                        React.createElement('option', { value: 'subtrocanterica' }, 'Subtrocantérica'),
                                        React.createElement('option', { value: 'iliaco' }, 'Ilíaco'),
                                        React.createElement('option', { value: 'isquion' }, 'Isquion'),
                                        React.createElement('option', { value: 'pubis' }, 'Pubis'),
                                        React.createElement('option', { value: 'sacro' }, 'Sacro')
                                    ),
                                    // Miembro Inferior
                                    React.createElement('optgroup', { label: 'Miembro Inferior' },
                                        React.createElement('option', { value: 'femur' }, 'Fémur'),
                                        React.createElement('option', { value: 'rotula' }, 'Rótula'),
                                        React.createElement('option', { value: 'tibia' }, 'Tibia'),
                                        React.createElement('option', { value: 'pilon_tibial' }, 'Pilón Tibial'),
                                        React.createElement('option', { value: 'perone' }, 'Peroné'),
                                        React.createElement('option', { value: 'tobillo' }, 'Tobillo'),
                                        React.createElement('option', { value: 'calcaneo' }, 'Calcáneo'),
                                        React.createElement('option', { value: 'tarso' }, 'Tarso')
                                    )
                                ),
                                // Tipo de fractura (Cerrada/Expuesta)
                                formData.fracturaHueso && React.createElement('div', { style: { display: 'flex', gap: '1rem', alignItems: 'center' } },
                                    React.createElement('select', {
                                        style: { ...styles.input, width: '150px' },
                                        value: formData.fracturaHuesoTipo || '',
                                        onChange: (e) => {
                                            handleInputChange('fracturaHuesoTipo', e.target.value);
                                            // Limpiar campos relacionados
                                            handleInputChange('fracturaHuesoDesplazamiento', '');
                                            handleInputChange('fracturaHuesoGustilo', '');
                                        }
                                    },
                                        React.createElement('option', { value: '' }, 'Seleccionar tipo...'),
                                        React.createElement('option', { value: 'cerrada' }, 'Cerrada'),
                                        React.createElement('option', { value: 'expuesta' }, 'Expuesta')
                                    ),
                                    // Detalles según tipo de fractura
                                    formData.fracturaHuesoTipo === 'cerrada' &&
                                    React.createElement('select', {
                                        style: { ...styles.input, width: '150px' },
                                        value: formData.fracturaHuesoDesplazamiento || '',
                                        onChange: (e) => handleInputChange('fracturaHuesoDesplazamiento', e.target.value)
                                    },
                                        React.createElement('option', { value: '' }, 'Seleccionar...'),
                                        React.createElement('option', { value: 'desplazada' }, 'Desplazada'),
                                        React.createElement('option', { value: 'noDesplazada' }, 'No desplazada')
                                    ),
                                    formData.fracturaHuesoTipo === 'expuesta' &&
                                    React.createElement('select', {
                                        style: { ...styles.input, width: '150px' },
                                        value: formData.fracturaHuesoGustilo || '',
                                        onChange: (e) => handleInputChange('fracturaHuesoGustilo', e.target.value)
                                    },
                                        React.createElement('option', { value: '' }, 'Gustilo-Anderson...'),
                                        React.createElement('option', { value: 'I' }, 'Gustilo I'),
                                        React.createElement('option', { value: 'II' }, 'Gustilo II'),
                                        React.createElement('option', { value: 'IIIa' }, 'Gustilo IIIa'),
                                        React.createElement('option', { value: 'IIIb' }, 'Gustilo IIIb'),
                                        React.createElement('option', { value: 'IIIc' }, 'Gustilo IIIc')
                                    )
                                )
                            )
                        )
                    ),
                    // Múltiples huesos con sus detalles
                    (radioSelections['fractura'] === 'si' && formData.fracturaTipo === 'multiple') && 
                    React.createElement('tr', null,
                        React.createElement('td', { 
                            style: { 
                                ...styles.tableCell,
                                paddingLeft: '2rem'
                            } 
                        }, '↳ Huesos:'),
                        React.createElement('td', { colSpan: 3, style: styles.tableCell },
                            React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '1rem' } },
                                formData.fracturaHuesos.map((hueso, index) => 
                                    React.createElement('div', { 
                                        key: index,
                                        style: { 
                                            display: 'flex', 
                                            flexDirection: 'column',
                                            gap: '0.5rem',
                                            padding: '1rem',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px'
                                        } 
                                    },
                                        // Selector de hueso y botón eliminar
                                        React.createElement('div', { 
                                            style: { 
                                                display: 'flex', 
                                                gap: '1rem',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }
                                        },
                                            React.createElement('select', {
                                                style: { ...styles.input, width: '200px' },
                                                value: hueso.hueso || '',
                                                onChange: (e) => {
                                                    const newHuesos = [...formData.fracturaHuesos];
                                                    newHuesos[index] = {
                                                        ...newHuesos[index],
                                                        hueso: e.target.value
                                                    };
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        fracturaHuesos: newHuesos
                                                    }));
                                                }
                                            },
                                                React.createElement('option', { value: '' }, 'Seleccionar hueso...'),
                                                React.createElement('optgroup', { label: 'Miembro Superior' },
                                                    React.createElement('option', { value: 'humero' }, 'Húmero'),
                                                    React.createElement('option', { value: 'radio' }, 'Radio'),
                                                    React.createElement('option', { value: 'cubito' }, 'Cúbito'),
                                                    React.createElement('option', { value: 'clavicula' }, 'Clavícula'),
                                                    React.createElement('option', { value: 'escapula' }, 'Escápula'),
                                                    React.createElement('option', { value: 'carpo' }, 'Carpo')
                                                ),
                                                React.createElement('optgroup', { label: 'Cadera/Pelvis' },
                                                    React.createElement('option', { value: 'pelvis' }, 'Pelvis'),
                                                    React.createElement('option', { value: 'acetabulo' }, 'Acetábulo'),
                                                    React.createElement('option', { value: 'cabeza_femoral' }, 'Cabeza Femoral'),
                                                    React.createElement('option', { value: 'cuello_femoral' }, 'Cuello Femoral'),
                                                    React.createElement('option', { value: 'intertrocanterica' }, 'Intertrocantérica'),
                                                    React.createElement('option', { value: 'subtrocanterica' }, 'Subtrocantérica'),
                                                    React.createElement('option', { value: 'iliaco' }, 'Ilíaco'),
                                                    React.createElement('option', { value: 'isquion' }, 'Isquion'),
                                                    React.createElement('option', { value: 'pubis' }, 'Pubis'),
                                                    React.createElement('option', { value: 'sacro' }, 'Sacro')
                                                ),
                                                React.createElement('optgroup', { label: 'Miembro Inferior' },
                                                    React.createElement('option', { value: 'femur' }, 'Fémur'),
                                                    React.createElement('option', { value: 'rotula' }, 'Rótula'),
                                                    React.createElement('option', { value: 'tibia' }, 'Tibia'),
                                                    React.createElement('option', { value: 'pilon_tibial' }, 'Pilón Tibial'),
                                                    React.createElement('option', { value: 'perone' }, 'Peroné'),
                                                    React.createElement('option', { value: 'tobillo' }, 'Tobillo'),
                                                    React.createElement('option', { value: 'calcaneo' }, 'Calcáneo'),
                                                    React.createElement('option', { value: 'tarso' }, 'Tarso')
                                                )
                                            ),
                                            React.createElement('button', {
                                                onClick: () => {
                                                    const newHuesos = formData.fracturaHuesos.filter((_, i) => i !== index);
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        fracturaHuesos: newHuesos
                                                    }));
                                                },
                                                style: { 
                                                    padding: '0.25rem 0.5rem', 
                                                    cursor: 'pointer',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px',
                                                    backgroundColor: '#f8f8f8'
                                                }
                                            }, '×')
                                        ),
                                             // Tipo de fractura y detalles
                                        hueso.hueso && React.createElement('div', { style: { display: 'flex', gap: '1rem', alignItems: 'center' } },
                                            React.createElement('select', {
                                                style: { ...styles.input, width: '150px' },
                                                value: hueso.tipo || '',
                                                onChange: (e) => {
                                                    const newHuesos = [...formData.fracturaHuesos];
                                                    newHuesos[index] = {
                                                        ...newHuesos[index],
                                                        tipo: e.target.value,
                                                        desplazamiento: '',
                                                        gustilo: ''
                                                    };
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        fracturaHuesos: newHuesos
                                                    }));
                                                }
                                            },
                                                React.createElement('option', { value: '' }, 'Seleccionar tipo...'),
                                                React.createElement('option', { value: 'cerrada' }, 'Cerrada'),
                                                React.createElement('option', { value: 'expuesta' }, 'Expuesta')
                                            ),
                                            hueso.tipo === 'cerrada' &&
                                            React.createElement('select', {
                                                style: { ...styles.input, width: '150px' },
                                                value: hueso.desplazamiento || '',
                                                onChange: (e) => {
                                                    const newHuesos = [...formData.fracturaHuesos];
                                                    newHuesos[index] = {
                                                        ...newHuesos[index],
                                                        desplazamiento: e.target.value
                                                    };
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        fracturaHuesos: newHuesos
                                                    }));
                                                }
                                            },
                                                React.createElement('option', { value: '' }, 'Seleccionar...'),
                                                React.createElement('option', { value: 'desplazada' }, 'Desplazada'),
                                                React.createElement('option', { value: 'noDesplazada' }, 'No desplazada')
                                            ),
                                            hueso.tipo === 'expuesta' &&
                                            React.createElement('select', {
                                                style: { ...styles.input, width: '150px' },
                                                value: hueso.gustilo || '',
                                                onChange: (e) => {
                                                    const newHuesos = [...formData.fracturaHuesos];
                                                    newHuesos[index] = {
                                                        ...newHuesos[index],
                                                        gustilo: e.target.value
                                                    };
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        fracturaHuesos: newHuesos
                                                    }));
                                                }
                                            },
                                                React.createElement('option', { value: '' }, 'Gustilo-Anderson...'),
                                                React.createElement('option', { value: 'I' }, 'I'),
                                                React.createElement('option', { value: 'II' }, 'II'),
                                                React.createElement('option', { value: 'IIIa' }, 'IIIa'),
                                                React.createElement('option', { value: 'IIIb' }, 'IIIb'),
                                                React.createElement('option', { value: 'IIIc' }, 'IIIc')
                                            )
                                        )
                                    )
                                ),
                                React.createElement('button', {
                                    onClick: () => {
                                        setFormData(prev => ({
                                            ...prev,
                                            fracturaHuesos: [...prev.fracturaHuesos, { hueso: '', tipo: '', desplazamiento: '', gustilo: '' }]
                                        }));
                                    },
                                    style: { 
                                        padding: '0.5rem',
                                        width: 'fit-content',
                                        cursor: 'pointer',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        backgroundColor: '#f8f8f8'
                                    }
}, '+ Agregar Hueso')
                            )
                        )
                    )
                ),
                // OSTEOSINTESIS - Nivel 1
                React.createElement('tr', null,
                    React.createElement('td', { style: styles.tableCell }, 'Osteosíntesis'),
                    React.createElement('td', { style: styles.tableCell },
                        React.createElement('input', {
                            type: 'radio',
                            name: 'osteosintesis',
                            style: styles.radio,
                            checked: radioSelections['osteosintesis'] === 'si',
                            onChange: () => {},
                            onClick: () => handleRadioClick('osteosintesis', 'si')
                        })
                    ),
                    React.createElement('td', { style: styles.tableCell },
                        React.createElement('input', {
                            type: 'radio',
                            name: 'osteosintesis',
                            style: styles.radio,
                            checked: radioSelections['osteosintesis'] === 'no',
                            onChange: () => {},
                            onClick: () => handleRadioClick('osteosintesis', 'no')
                        })
                    ),
                    React.createElement('td', { style: styles.tableCell })
                ),
                // Lista de tipos de osteosíntesis
                radioSelections['osteosintesis'] === 'si' && React.createElement('tr', null,
                    React.createElement('td', { 
                        style: { 
                            ...styles.tableCell,
                            paddingLeft: '2rem'
                        } 
                    }, '↳ Tipos:'),
                    React.createElement('td', { colSpan: 3, style: styles.tableCell },
                        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '1rem' } },
                                            formData.osteosintesisTipos.map((tipo, index) => 
                                React.createElement('div', { 
                                    key: index,
                                    style: { 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        gap: '0.5rem',
                                        padding: '1rem',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px'
                                    } 
                                },
                                    // Selector de tipo y botón eliminar
                                    React.createElement('div', {
                                        style: {
                                            display: 'flex',
                                            gap: '1rem',
                                            alignItems: 'center'
                                        }
                                    },
                                        React.createElement('select', {
                                            style: { ...styles.input, width: '200px' },
                                            value: tipo.tipo || '',
                                            onChange: (e) => {
                                                const nuevosTipos = [...formData.osteosintesisTipos];
                                                nuevosTipos[index] = {
                                                    ...nuevosTipos[index],
                                                    tipo: e.target.value
                                                };
                                                setFormData(prev => ({
                                                    ...prev,
                                                    osteosintesisTipos: nuevosTipos
                                                }));
                                            }
                                        },
                                            React.createElement('option', { value: '' }, 'Seleccionar tipo...'),
                                            React.createElement('option', { value: 'FFEE' }, 'FFEE'),
                                            React.createElement('option', { value: 'EEM' }, 'EEM'),
                                            React.createElement('option', { value: 'Placas' }, 'Placas'),
                                            React.createElement('option', { value: 'Tornillos' }, 'Tornillos'),
                                            React.createElement('option', { value: 'Fijador_Ilizarov' }, 'Fijador de Ilizarov'),
                                            React.createElement('option', { value: 'Alambres_Kirschner' }, 'Alambres de Kirschner'),
                                            React.createElement('option', { value: 'Grapas_metalicas' }, 'Grapas metálicas'),
                                            React.createElement('option', { value: 'Otros' }, 'Otros')
                                        ),
                                        React.createElement('button', {
                                            onClick: () => {
                                                const nuevosTipos = formData.osteosintesisTipos.filter((_, i) => i !== index);
                                                setFormData(prev => ({
                                                    ...prev,
                                                    osteosintesisTipos: nuevosTipos
                                                }));
                                            },
                                            style: {
                                                padding: '0.25rem 0.5rem',
                                                cursor: 'pointer',
                                                border: '1px solid #ccc',
                                                borderRadius: '4px',
                                                backgroundColor: '#f8f8f8'
                                            }
                                        }, '×')
                                    ),
                                    // Fecha de colocación
                                    React.createElement('div', {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem'
                                        }
                                    },
                                        React.createElement('span', null, 'Fecha colocación:'),
                                        React.createElement('input', {
                                            type: 'date',
                                            value: tipo.fechaColocacion || '',
                                            onChange: (e) => {
                                                const nuevosTipos = [...formData.osteosintesisTipos];
                                                nuevosTipos[index] = {
                                                    ...nuevosTipos[index],
                                                    fechaColocacion: e.target.value
                                                };
                                                setFormData(prev => ({
                                                    ...prev,
                                                    osteosintesisTipos: nuevosTipos
                                                }));
                                            },
                                            style: {...styles.input}
                                        })
                                    ),
                                    // Radio buttons ¿Se extrajo?
                                    React.createElement('div', {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem'
                                        }
                                    },
                                        React.createElement('span', null, '¿Se extrajo?'),
                                        React.createElement('div', {
                                            style: {
                                                display: 'flex',
                                                gap: '1rem'
                                            }
                                        },
                                            React.createElement('label', {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }
                                            },
                                                React.createElement('input', {
                                                    type: 'radio',
                                                    checked: tipo.extraido === 'si',
                                                    onChange: () => {
                                                        const nuevosTipos = [...formData.osteosintesisTipos];
                                                        nuevosTipos[index] = {
                                                            ...nuevosTipos[index],
                                                            extraido: 'si'
                                                        };
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            osteosintesisTipos: nuevosTipos
                                                        }));
                                                    },
                                                    style: styles.radio
                                                }),
                                                'SI'
                                            ),
                                            React.createElement('label', {
                                                style: {
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem'
                                                }
                                            },
                                                React.createElement('input', {
                                                    type: 'radio',
                                                    checked: tipo.extraido === 'no',
                                                    onChange: () => {
                                                        const nuevosTipos = [...formData.osteosintesisTipos];
                                                        nuevosTipos[index] = {
                                                            ...nuevosTipos[index],
                                                            extraido: 'no'
                                                        };
                                                        setFormData(prev => ({
                                                            ...prev,
                                                            osteosintesisTipos: nuevosTipos
                                                        }));
                                                    },
                                                    style: styles.radio
                                                }),
                                                'NO'
                                            )
                                        )
                                    ),
                                    // Fecha extracción o Alerta
                                    tipo.extraido === 'si' ?
                                    React.createElement('div', {
                                        style: {
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem'
                                        }
                                    },
                                        React.createElement('span', null, 'Fecha extracción:'),
                                        React.createElement('input', {
                                            type: 'date',
                                            value: tipo.fechaExtraccion || '',
                                            onChange: (e) => {
                                                const nuevosTipos = [...formData.osteosintesisTipos];
                                                nuevosTipos[index] = {
                                                    ...nuevosTipos[index],
                                                    fechaExtraccion: e.target.value
                                                };
                                                setFormData(prev => ({
                                                    ...prev,
                                                    osteosintesisTipos: nuevosTipos
                                                }));
                                            },
                                            style: {...styles.input}
                                        })
                                    ) :
                                    tipo.extraido === 'no' &&
                                    React.createElement('div', {
                                        style: {
                                            padding: '0.5rem',
                                            backgroundColor: '#fff3cd',
                                            color: '#856404',
                                            borderRadius: '4px',
                                            border: '1px solid #ffeeba'
                                        }
                                    }, 'Permanece con material de OS')
                                )
                            ),
                                            React.createElement('button', {
                                onClick: () => {
                                    setFormData(prev => ({
                                        ...prev,
                                        osteosintesisTipos: [...prev.osteosintesisTipos, { 
                                            tipo: '', 
                                            fechaColocacion: '', 
                                            extraido: '', 
                                            fechaExtraccion: '' 
                                        }]
                                    }));
                                },
                                style: {
                                    padding: '0.5rem',
                                    width: 'fit-content',
                                    cursor: 'pointer',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    backgroundColor: '#f8f8f8'
                                }
                            }, '+ Agregar Tipo')
                        )
                    )
                )
            )
        )
    );
}
root.render(React.createElement(Form));
