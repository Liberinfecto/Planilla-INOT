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
    sexo: '',
    talla: '',
    peso: '',
    fractura: '',
    fracturaFecha: '', 
    fracturaDetalles: '',  // Para comentarios de fractura
    osteosintesis: '',              // para el SI/NO principal
    osteosinesisFecha: '', // para la fecha de osteosintesis
    osteosintesisDetalles: '',      // para los comentarios de osteosintesis
    osteosintesisTipos: [],         // array de objetos con: { tipo, fechaColocacion, extraido, fechaExtraccion }
    fracturaTipo: '',      // 'unica' o 'multiple'
    // Para fractura única
    fracturaHueso: '',     // el hueso seleccionado
    fracturaHuesoTipo: '', // 'cerrada' o 'expuesta'
    fracturaHuesoDesplazamiento: '', // 'desplazada' o 'noDesplazada' (si es cerrada)
    fracturaHuesoGustilo: '',  // 'I', 'II', etc (si es expuesta)
    // Para fracturas múltiples
    fracturaHuesos: [], // Array de objetos, cada uno con: { hueso, tipo, desplazamiento, gustilo }
    irfTipo: '',
    irfFecha: '',
    irfDetalles: '',
    factorRiesgoDiabetes: '',
    factorRiesgoDiabetesDetalles: '',
    factorRiesgoTabaquismo: '',
    factorRiesgoTabaquismoDetalles: '',
    factorRiesgoObesidad: '',
    factorRiesgoObesidadDetalles: '',
    factorRiesgoAR: '',
    factorRiesgoARDetalles: '',
    factorRiesgoERC: '',
    factorRiesgoERCDetalles: '',
    factorRiesgoCorticoides: '',
    factorRiesgoCorticioidesDetalles: '',
    factorRiesgoIS: '',
    factorRiesgoISDetalles: '',
    factorRiesgoRecambioProtesis: '',
    factorRiesgoRecambioProtesisDetalles: '',
    factorRiesgoColonizadoMR: '',
    factorRiesgoColonizadoMRDetalles: '',
    isqFecha: '',
    isqTipoHQ: '',
    isqTipo: '',
    isqDetalles: '',
    osteomielitisFecha: '',
    osteomielitisTipo: '',
    osteomielitisDetalles: '',
    artritisSepticaFecha: '',
    artritisSepticaTipo: '',
    artritisSepticaDetalles: '',
    ippColocacionFecha: '',
    ippSintomasFecha: '',
    ippTipo: '',
    ippDetalles: '',
    // campos para espondilodiscitis
    espondilodiscitisFecha: '',
    espondilodiscitisTipo: '',
    espondilodiscitisDetalles: '',
    espondilodiscitisOS: '',
    espondilodiscitisOSFecha: '',   
    espondilodiscitisOSDetalles: '',
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
   },
   retiroImplante: '',              
   retiroImplanteFecha: {           
       comentarios: ''
   },
   protesis: '',              // SI/NO de prótesis
   protesisTipo: '',          // tipo de prótesis (rodilla/cadera/otros)
   protesisFecha: {           // para fecha y comentarios
       comentarios: ''
   },
   recambioProtesis: '',      // SI/NO de recambio
   recambioProtesisFecha: {   // para fecha y comentarios
       comentarios: ''
   },
   isq: '',                   // para el SI/NO de ISQ
   isqDetalles: {             // para comentarios de ISQ
       comentarios: ''
   },
   lq: '',                    // para el SI/NO de LQ
   lqDetalles: {              // para comentarios de LQ
       comentarios: ''
   },
   aislamiento: '',           // para el SI/NO de aislamiento
   aislamientoDetalles: {     // para detalles de aislamiento
       comentarios: ''
   },
   antibioticos: '',           // para el SI/NO de antibióticos previos
   antibioticosDetalles: {     // para detalles de antibióticos
        comentarios: ''
    }
});

const handleAntecedentesChange = (campo, valor, parteFecha, campoFecha = 'fracturaFecha') => {
    if (parteFecha) {
        setAntecedentes(prev => ({
            ...prev,
            [campoFecha]: {
                ...prev[campoFecha],
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
const [paraclinicaData, setParaclinicaData] = React.useState({
    columnas: [
        {
            fecha: formData.fi || '',  // Solo la columna FI
            tipo: 'fi'
        }
    ],
    valores: {
        hb: { unidad: 'g/dL', valores: [] },
        gb: { unidad: 'x10³/µL', valores: [] },
        pcr: { unidad: 'mg/L', valores: [] },
        ves: { unidad: 'mm/h', valores: [] },
        azo: { unidad: 'mg/dL', valores: [] },
        cr: { unidad: 'mg/dL', valores: [] },
        bt: { unidad: 'mg/dL', valores: [] },
        bd: { unidad: 'mg/dL', valores: [] },
        bi: { unidad: 'mg/dL', valores: [] },
        alb: { unidad: 'g/dL', valores: [] },
        fa: { unidad: 'UI/L', valores: [] },
        gto: { unidad: 'UI/L', valores: [] },
        gtp: { unidad: 'UI/L', valores: [] },
        ggt: { unidad: 'UI/L', valores: [] }
    }
});

const rangosNormales = {
    hb: { min: 12, max: 16 },  // g/dL
    gb: { min: 4, max: 11 },   // x10³/µL
    pcr: { min: 0, max: 10 },  // mg/L
    ves: { min: 0, max: 20 },  // mm/h
    azo: { min: 10, max: 50 }, // mg/dL
    cr: { min: 0.5, max: 1.2 },// mg/dL
    bt: { min: 0.3, max: 1.2 },// mg/dL
    bd: { min: 0, max: 0.3 },  // mg/dL
    bi: { min: 0, max: 0.9 },  // mg/dL
    alb: { min: 3.5, max: 5.2 },// g/dL
    fa: { min: 35, max: 104 }, // UI/L
    gto: { min: 10, max: 40 }, // UI/L
    gtp: { min: 10, max: 40 }, // UI/L
    ggt: { min: 5, max: 55 }   // UI/L
};

const hoy = new Date().toISOString().split('T')[0]; 

    const handleInputChange = (fieldName, value) => {
        setFormData(prevData => ({
            ...prevData,
            [fieldName]: value
        }));
        
    // Si el campo que se está modificando es 'fi', actualizamos paraclinicaData
    if (fieldName === 'fi') {
        setParaclinicaData(prev => ({
            ...prev,
            columnas: prev.columnas.map(col => 
                col.tipo === 'fi' 
                    ? { ...col, fecha: value }
                    : col
            )
        }));
    }
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

const calcularClasificacionTsukayama = (fechaColocacion, fechaSintomas) => {
    if (!fechaColocacion || !fechaSintomas) return '';
    const colocacion = new Date(fechaColocacion);
    const sintomas = new Date(fechaSintomas);
    const diferenciaMeses = (sintomas - colocacion) / (1000 * 60 * 60 * 24 * 30.44);
    if (diferenciaMeses < 1) return 'aguda';
    return 'cronica';
};

const calcularClasificacionIRF = (fechaFractura, fechaSintomas) => {
    if (!fechaFractura || !fechaSintomas) return '';
    
    const fractura = new Date(fechaFractura);
    const sintomas = new Date(fechaSintomas);
    const diferenciaDias = (sintomas - fractura) / (1000 * 60 * 60 * 24);
    const diferenciaSemanas = diferenciaDias / 7;

    if (diferenciaSemanas <= 2) return 'aguda';
    if (diferenciaSemanas <= 10) return 'retrasada';
    return 'tardia';
};

const calcularClasificacionOMA = (fechaSintomas) => {
    if (!fechaSintomas) return '';
    
    const sintomas = new Date(fechaSintomas);
    const hoy = new Date();
    const diferenciaDias = (hoy - sintomas) / (1000 * 60 * 60 * 24);
    const diferenciaSemanas = diferenciaDias / 7;

    if (diferenciaSemanas <= 3) return 'aguda';
    return 'cronica';
};
    const calcularClasificacionEspondilodiscitis = (fechaOS, fechaSintomas, tieneOS) => {
    if (!fechaSintomas) return '';
    
    if (tieneOS === 'si' && fechaOS) {
        // Cálculo con material de OS
        const colocacion = new Date(fechaOS);
        const sintomas = new Date(fechaSintomas);
        const diferenciaSemanas = (sintomas - colocacion) / (1000 * 60 * 60 * 24 * 7);
        
        if (diferenciaSemanas <= 2) return 'temprana';
        if (diferenciaSemanas <= 10) return 'retrasada';
        return 'tardia';
    } else {
        // Cálculo sin material de OS
        const sintomas = new Date(fechaSintomas);
        const hoy = new Date();
        const diferenciaSemanas = (hoy - sintomas) / (1000 * 60 * 60 * 24 * 7);
        
        if (diferenciaSemanas <= 2) return 'aguda';
        return 'cronica';
    }
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
        smallInput: {
            flex: 0,
            borderBottom: '1px solid black',
            padding: '0.25rem',
            width: '80px'
        },
        mediumInput: {
        flex: 0,
        borderBottom: '1px solid black',
        padding: '0.25rem',
        width: '200px'
        },
        compact: {
            marginBottom: '0.5rem'
        },
        smallLabel: {
            fontWeight: 'bold',
            minWidth: '70px',
            marginRight: '0.5rem'
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
        },
         labelContainerStyle: {
            display: 'flex',
            alignItems: 'center',
            width: '300px'
        },
        dateInputStyle: {
            marginRight: '1rem',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.875rem',
            border: '1px solid #dc3545',
            backgroundColor: '#ffebeb',
            color: '#dc3545',
            width: '150px'
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
            // Primera columna (izquierda)
            // Piso/Cama
            React.createElement('div', { style: {...styles.inputGroup, ...styles.compact} },
                React.createElement('span', { style: styles.smallLabel }, 'Piso/Cama:'),
                React.createElement('input', { 
                    type: 'text',
                    value: formData.floor,
                    onChange: (e) => handleInputChange('floor', e.target.value),
                    style: styles.smallInput
                })
            ),
            
                // Campo Sexo
                React.createElement('div', { style: {...styles.inputGroup, ...styles.compact} },
                    React.createElement('span', { style: styles.smallLabel }, 'Sexo:'),
                    React.createElement('div', { style: { display: 'flex', gap: '1rem' } },
                        React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' } },
                            'H',
                            React.createElement('input', {
                                type: 'radio',
                                name: 'sexo',
                                style: styles.radio,
                                checked: radioSelections['sexo'] === 'H',
                                onChange: () => {},
                                onClick: () => {
                                    if (radioSelections['sexo'] === 'H') {
                                        handleRadioClick('sexo', '');
                                    } else {
                                        handleRadioClick('sexo', 'H');
                                    }
                                }
                            })
                        ),
                        React.createElement('label', { style: { display: 'flex', alignItems: 'center', gap: '0.5rem' } },
                            'M',
                            React.createElement('input', {
                                type: 'radio',
                                name: 'sexo',
                                style: styles.radio,
                                checked: radioSelections['sexo'] === 'M',
                                onChange: () => {},
                                onClick: () => {
                                    if (radioSelections['sexo'] === 'M') {
                                        handleRadioClick('sexo', '');
                                    } else {
                                        handleRadioClick('sexo', 'M');
                                    }
                                }
                            })
                        )
                    )
                ),
            
            // Fila de campos numéricos (Edad, Peso, Talla)
            React.createElement('div', { style: { display: 'flex', gap: '1rem', marginBottom: '0.5rem' } },
                // Edad
                React.createElement('div', { style: styles.compact },
                    React.createElement('span', { style: styles.smallLabel }, 'Edad:'),
                    React.createElement('input', {
                        type: 'number',
                        value: formData.age,
                        onChange: (e) => handleInputChange('age', e.target.value),
                        style: styles.smallInput,
                        min: '0',
                        max: '150'
                    })
                ),
                // Peso
                React.createElement('div', { style: styles.compact },
                    React.createElement('span', { style: styles.smallLabel }, 'Peso:'),
                    React.createElement('input', {
                        type: 'number',
                        value: formData.peso,
                        onChange: (e) => handleInputChange('peso', e.target.value),
                        style: styles.smallInput,
                        min: '0',
                        max: '500',
                        step: '0.1'
                    })
                ),
                // Talla
                React.createElement('div', { style: styles.compact },
                    React.createElement('span', { style: styles.smallLabel }, 'Talla:'),
                    React.createElement('input', {
                        type: 'number',
                        value: formData.talla,
                        onChange: (e) => handleInputChange('talla', e.target.value),
                        style: styles.smallInput,
                        min: '0',
                        max: '300',
                        step: '1'
                    })
                )
            ),
            
            // Segunda columna (derecha)
            // Campo Procedencia
            React.createElement('div', { style: styles.inputGroup },
                React.createElement('span', { style: styles.label }, 'Procedencia:'),
                React.createElement('input', { 
                    type: 'text',
                    value: formData.origin,
                    onChange: (e) => handleInputChange('origin', e.target.value),
                    style: styles.mediumInput
                })
            ),
            
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
            
            // Campo CI
            React.createElement('div', { style: styles.inputGroup },
                React.createElement('span', { style: styles.label }, 'CI:'),
                React.createElement('input', { 
                    type: 'text',
                    value: formData.ci,
                    onChange: (e) => handleInputChange('ci', e.target.value),
                    style: styles.mediumInput
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

// Sección de Factores de Riesgo
                React.createElement('div', { style: { marginTop: '2rem', border: '1px solid #333', padding: '1rem' } },
                    React.createElement('table', { style: styles.table },
                        React.createElement('thead', null,
                            React.createElement('tr', null,
                                React.createElement('th', { style: styles.tableHeader }, 'Factores de Riesgo para Infección'),
                                React.createElement('th', { style: styles.tableHeader }, 'SI'),
                                React.createElement('th', { style: styles.tableHeader }, 'NO'),
                                React.createElement('th', { style: styles.tableHeader }, 'Detalles')
                            )
                        ),
                        React.createElement('tbody', null,
                            ['Diabetes', 'Tabaquismo', 'Obesidad', 'AR', 'ERC', 'Corticoides', 'IS', 'Recambio prótesis', 'Colonizado por MR'].map(factor =>
                                React.createElement('tr', null,
                                    React.createElement('td', { style: styles.tableCell }, factor),
                                    React.createElement('td', { style: styles.tableCell },
                                        React.createElement('input', {
                                            type: 'radio',
                                            name: `factorRiesgo${factor}`,
                                            style: styles.radio,
                                            checked: formData[`factorRiesgo${factor}`] === 'si',
                                            onChange: () => {},
                                            onClick: () => {
                                                if (formData[`factorRiesgo${factor}`] === 'si') {
                                                    handleInputChange(`factorRiesgo${factor}`, '');
                                                } else {
                                                    handleInputChange(`factorRiesgo${factor}`, 'si');
                                                }
                                            }
                                        })
                                    ),
                                    React.createElement('td', { style: styles.tableCell },
                                        React.createElement('input', {
                                            type: 'radio',
                                            name: `factorRiesgo${factor}`,
                                            style: styles.radio,
                                            checked: formData[`factorRiesgo${factor}`] === 'no',
                                            onChange: () => {},
                                            onClick: () => {
                                                if (formData[`factorRiesgo${factor}`] === 'no') {
                                                    handleInputChange(`factorRiesgo${factor}`, '');
                                                } else {
                                                    handleInputChange(`factorRiesgo${factor}`, 'no');
                                                }
                                            }
                                        })
                                    ),
                                    React.createElement('td', { style: styles.tableCell },
                                        React.createElement('textarea', {
                                            placeholder: 'Comentarios',
                                            style: {
                                                ...styles.input,
                                                width: '100%',
                                                minHeight: '2rem',
                                                resize: 'vertical',
                                                overflow: 'auto'
                                            },
                                            value: formData[`factorRiesgo${factor}Detalles`] || '',
                                            onChange: (e) => handleInputChange(`factorRiesgo${factor}Detalles`, e.target.value)
                                        })
                                    )
                                )
                            )
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


// Fila de Osteosíntesis (aparece solo si hay fractura)
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
                            React.createElement('div', {
                                style: {
                                    display: 'flex',
                                    gap: '1rem',
                                    alignItems: 'center'
                                }
                            },
                                antecedentes.osteosintesis === 'si' && React.createElement('select', {
                                    style: { ...styles.input, width: '150px' },
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
                                    onChange: (e) => handleAntecedentesChange(null, e.target.value, 'comentarios', 'osteosintesisFecha')
                                })
                            )
                        )
                    ),

// PROTESIS - Nivel principal
                    React.createElement('tr', null,
                        React.createElement('td', { style: styles.tableCell }, 'Prótesis'),
                        React.createElement('td', { style: styles.tableCell },
                            React.createElement('input', {
                                type: 'radio',
                                name: 'antecedenteProtesis',
                                style: styles.radio,
                                checked: antecedentes.protesis === 'si',
                                onChange: () => {},
                                onClick: () => {
                                    if (antecedentes.protesis === 'si') {
                                        handleAntecedentesChange('protesis', '');
                                    } else {
                                        handleAntecedentesChange('protesis', 'si');
                                    }
                                }
                            })
                        ),
                        React.createElement('td', { style: styles.tableCell },
                            React.createElement('input', {
                                type: 'radio',
                                name: 'antecedenteProtesis',
                                style: styles.radio,
                                checked: antecedentes.protesis === 'no',
                                onChange: () => {},
                                onClick: () => {
                                    if (antecedentes.protesis === 'no') {
                                        handleAntecedentesChange('protesis', '');
                                    } else {
                                        handleAntecedentesChange('protesis', 'no');
                                    }
                                }
                            })
                        ),
                        React.createElement('td', { style: styles.tableCell },
                            antecedentes.protesis === 'si' && React.createElement('div', {
                                style: {
                                    display: 'flex',
                                    gap: '1rem',
                                    alignItems: 'center'
                                }
                            },
                                React.createElement('select', {
                                    style: { ...styles.input, width: '150px' },
                                    value: antecedentes.protesisTipo || '',
                                    onChange: (e) => handleAntecedentesChange('protesisTipo', e.target.value)
                                },
                                    React.createElement('option', { value: '' }, 'Seleccionar tipo...'),
                                    React.createElement('option', { value: 'rodilla' }, 'Rodilla'),
                                    React.createElement('option', { value: 'cadera' }, 'Cadera'),
                                    React.createElement('option', { value: 'otros' }, 'Otros')
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
                                    value: antecedentes.protesisFecha.comentarios || '',
                                    onChange: (e) => handleAntecedentesChange(null, e.target.value, 'comentarios', 'protesisFecha')
                                })
                            )
                        )
                    ),
                    // Fila de Recambio de prótesis (aparece solo si prótesis es sí)
                    antecedentes.protesis === 'si' && React.createElement('tr', null,
                        React.createElement('td', { 
                            style: { 
                                ...styles.tableCell,
                                paddingLeft: '2rem'
                            } 
                        }, '↳ Recambio de prótesis:'),
                        React.createElement('td', { style: styles.tableCell },
                            React.createElement('input', {
                                type: 'radio',
                                name: 'antecedenteRecambioProtesis',
                                style: styles.radio,
                                checked: antecedentes.recambioProtesis === 'si',
                                onChange: () => {},
                                onClick: () => {
                                    if (antecedentes.recambioProtesis === 'si') {
                                        handleAntecedentesChange('recambioProtesis', '');
                                    } else {
                                        handleAntecedentesChange('recambioProtesis', 'si');
                                    }
                                }
                            })
                        ),
                        React.createElement('td', { style: styles.tableCell },
                            React.createElement('input', {
                                type: 'radio',
                                name: 'antecedenteRecambioProtesis',
                                style: styles.radio,
                                checked: antecedentes.recambioProtesis === 'no',
                                onChange: () => {},
                                onClick: () => {
                                    if (antecedentes.recambioProtesis === 'no') {
                                        handleAntecedentesChange('recambioProtesis', '');
                                    } else {
                                        handleAntecedentesChange('recambioProtesis', 'no');
                                    }
                                }
                            })
                        ),
                        React.createElement('td', { style: styles.tableCell },
                            React.createElement('textarea', {
                                placeholder: 'Fecha/Comentarios',
                                style: {
                                    ...styles.input,
                                    width: '100%',
                                    minHeight: '2rem',
                                    resize: 'vertical',
                                    overflow: 'auto'
                                },
                                value: antecedentes.recambioProtesisFecha.comentarios || '',
                                onChange: (e) => handleAntecedentesChange(null, e.target.value, 'comentarios', 'recambioProtesisFecha')
                            })
                        )
                    ),
// ISQ Row
                    React.createElement('tr', null,
                        React.createElement('td', { style: styles.tableCell }, 'ISQ Previas al Ingreso Actual'),
                        React.createElement('td', { style: styles.tableCell },
                            React.createElement('input', {
                                type: 'radio',
                                name: 'antecedenteIsq',
                                style: styles.radio,
                                checked: antecedentes.isq === 'si',
                                onChange: () => {},
                                onClick: () => {
                                    if (antecedentes.isq === 'si') {
                                        handleAntecedentesChange('isq', '');
                                    } else {
                                        handleAntecedentesChange('isq', 'si');
                                    }
                                }
                            })
                        ),
                        React.createElement('td', { style: styles.tableCell },
                            React.createElement('input', {
                                type: 'radio',
                                name: 'antecedenteIsq',
                                style: styles.radio,
                                checked: antecedentes.isq === 'no',
                                onChange: () => {},
                                onClick: () => {
                                    if (antecedentes.isq === 'no') {
                                        handleAntecedentesChange('isq', '');
                                    } else {
                                        handleAntecedentesChange('isq', 'no');
                                    }
                                }
                            })
                        ),
                        React.createElement('td', { style: styles.tableCell },
                            React.createElement('textarea', {
                                placeholder: 'Fecha/Comentarios',
                                style: {
                                    ...styles.input,
                                    width: '100%',
                                    minHeight: '2rem',
                                    resize: 'vertical',
                                    overflow: 'auto'
                                },
                                value: antecedentes.isqDetalles.comentarios || '',
                                onChange: (e) => handleAntecedentesChange(null, e.target.value, 'comentarios', 'isqDetalles')
                            })
                        )
                    ),

// LQ Row
                   React.createElement('tr', null,
                       React.createElement('td', { style: styles.tableCell }, 'LQ Previas al Ingreso Actual'),
                       React.createElement('td', { style: styles.tableCell },
                           React.createElement('input', {
                               type: 'radio',
                               name: 'antecedenteLq',
                               style: styles.radio,
                               checked: antecedentes.lq === 'si',
                               onChange: () => {},
                               onClick: () => {
                                   if (antecedentes.lq === 'si') {
                                       handleAntecedentesChange('lq', '');
                                   } else {
                                       handleAntecedentesChange('lq', 'si');
                                   }
                               }
                           })
                       ),
                       React.createElement('td', { style: styles.tableCell },
                           React.createElement('input', {
                               type: 'radio',
                               name: 'antecedenteLq',
                               style: styles.radio,
                               checked: antecedentes.lq === 'no',
                               onChange: () => {},
                               onClick: () => {
                                   if (antecedentes.lq === 'no') {
                                       handleAntecedentesChange('lq', '');
                                   } else {
                                       handleAntecedentesChange('lq', 'no');
                                   }
                               }
                           })
                       ),
                       React.createElement('td', { style: styles.tableCell },
                           React.createElement('textarea', {
                               placeholder: 'Fecha/Comentarios',
                               style: {
                                   ...styles.input,
                                   width: '100%',
                                   minHeight: '2rem',
                                   resize: 'vertical',
                                   overflow: 'auto'
                               },
                               value: antecedentes.lqDetalles.comentarios || '',
                               onChange: (e) => handleAntecedentesChange(null, e.target.value, 'comentarios', 'lqDetalles')
                           })
                       )
                   ),

// Aislamiento Microbiológico Row
                   React.createElement('tr', null,
                       React.createElement('td', { style: styles.tableCell }, 'Aislamiento Microbiológico Previo'),
                       React.createElement('td', { style: styles.tableCell },
                           React.createElement('input', {
                               type: 'radio',
                               name: 'antecedenteAislamiento',
                               style: styles.radio,
                               checked: antecedentes.aislamiento === 'si',
                               onChange: () => {},
                               onClick: () => {
                                   if (antecedentes.aislamiento === 'si') {
                                       handleAntecedentesChange('aislamiento', '');
                                   } else {
                                       handleAntecedentesChange('aislamiento', 'si');
                                   }
                               }
                           })
                       ),
                       React.createElement('td', { style: styles.tableCell },
                           React.createElement('input', {
                               type: 'radio',
                               name: 'antecedenteAislamiento',
                               style: styles.radio,
                               checked: antecedentes.aislamiento === 'no',
                               onChange: () => {},
                               onClick: () => {
                                   if (antecedentes.aislamiento === 'no') {
                                       handleAntecedentesChange('aislamiento', '');
                                   } else {
                                       handleAntecedentesChange('aislamiento', 'no');
                                   }
                               }
                           })
                       ),
                       React.createElement('td', { style: styles.tableCell },
                           React.createElement('textarea', {
                               placeholder: 'Microorganismo/Comentarios',
                               style: {
                                   ...styles.input,
                                   width: '100%',
                                   minHeight: '2rem',
                                   resize: 'vertical',
                                   overflow: 'auto'
                               },
                               value: antecedentes.aislamientoDetalles.comentarios || '',
                               onChange: (e) => handleAntecedentesChange(null, e.target.value, 'comentarios', 'aislamientoDetalles')                          
                           })
                       )
                   ),
// Antibióticos Row
                   React.createElement('tr', null,
                       React.createElement('td', { style: styles.tableCell }, 'Antibióticos en los 3 meses previos al ingreso'),
                       React.createElement('td', { style: styles.tableCell },
                           React.createElement('input', {
                               type: 'radio',
                               name: 'antecedenteAntibioticos',
                               style: styles.radio,
                               checked: antecedentes.antibioticos === 'si',
                               onChange: () => {},
                               onClick: () => {
                                   if (antecedentes.antibioticos === 'si') {
                                       handleAntecedentesChange('antibioticos', '');
                                   } else {
                                       handleAntecedentesChange('antibioticos', 'si');
                                   }
                               }
                           })
                       ),
                       React.createElement('td', { style: styles.tableCell },
                           React.createElement('input', {
                               type: 'radio',
                               name: 'antecedenteAntibioticos',
                               style: styles.radio,
                               checked: antecedentes.antibioticos === 'no',
                               onChange: () => {},
                               onClick: () => {
                                   if (antecedentes.antibioticos === 'no') {
                                       handleAntecedentesChange('antibioticos', '');
                                   } else {
                                       handleAntecedentesChange('antibioticos', 'no');
                                   }
                               }
                           })
                       ),
                       React.createElement('td', { style: styles.tableCell },
                           React.createElement('textarea', {
                               placeholder: 'Antibióticos Recibidos/Comentarios',
                               style: {
                                   ...styles.input,
                                   width: '100%',
                                   minHeight: '2rem',
                                   resize: 'vertical',
                                   overflow: 'auto'
                               },
                               value: antecedentes.antibioticosDetalles.comentarios || '',
                               onChange: (e) => handleAntecedentesChange(null, e.target.value, 'comentarios', 'antibioticosDetalles')
                            })
                       )
                   )
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
    React.createElement('td', { style: styles.tableCell }, 
        React.createElement('div', { style: styles.labelContainerStyle },
            radioSelections['fractura'] === 'si' && React.createElement('input', {
                type: 'date',
                value: formData.fracturaFecha || '',
                onChange: (e) => {
                    const nuevaFechaFractura = new Date(e.target.value);
                    
                    // Validar fecha de osteosíntesis
                    if (formData.osteosinesisFecha) {
                        const fechaOS = new Date(formData.osteosinesisFecha);
                        if (nuevaFechaFractura > fechaOS) {
                            alert('La fecha de fractura no puede ser posterior a la fecha de osteosíntesis');
                            return;
                        }
                    }
                    
                    // Validar fecha de IRF
                    if (formData.irfFecha) {
                        const fechaIRF = new Date(formData.irfFecha);
                        if (nuevaFechaFractura > fechaIRF) {
                            alert('La fecha de fractura no puede ser posterior a la fecha de IRF');
                            return;
                        }
                        // Calcular clasificación IRF si existe fecha de IRF
                        const nuevaClasificacion = calcularClasificacionIRF(e.target.value, formData.irfFecha);
                        if (nuevaClasificacion) {
                            handleInputChange('irfTipo', nuevaClasificacion);
                        }
                    }
                    
                    handleInputChange('fracturaFecha', e.target.value);
                },
                style: styles.dateInputStyle
            }),
            'Fractura'
        )
    ),
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
                
// Sector OSTEOSINTESIS
                    radioSelections['fractura'] === 'si' && React.createElement('tr', null,
                        React.createElement('td', { 
                            style: { 
                                ...styles.tableCell,
                                paddingLeft: '2rem'
                            } 
                        }, 
                            React.createElement('div', { style: styles.labelContainerStyle },
                                radioSelections['osteosintesis'] === 'si' && React.createElement('div', {
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.25rem'
                                    }
                                },
                                    React.createElement('span', null, 'Fecha de Colocación'),
                                    React.createElement('input', {
                                        type: 'date',
                                        value: formData.osteosinesisFecha || '',
                                        onChange: (e) => {
                                            const fechaOS = new Date(e.target.value);
                                            
                                            if (formData.fracturaFecha) {
                                                const fechaFractura = new Date(formData.fracturaFecha);
                                                if (fechaOS < fechaFractura) {
                                                    alert('La fecha de colocación de osteosíntesis no puede ser anterior a la fecha de fractura');
                                                    return;
                                                }
                                            } else {
                                                // Asegurarnos que el radio de fractura quede en 'si'
                                                if (radioSelections['fractura'] !== 'si') {
                                                    handleRadioClick('fractura', 'si');
                                                }
                                                alert('No se olvide de ingresar una fecha de fractura');
                                            }
                                            
                                            handleInputChange('osteosinesisFecha', e.target.value);
                                        },
                                        style: styles.dateInputStyle
                                    })
                                ),
                                '↳ Osteosíntesis'
                            )
                        ),
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
                        React.createElement('td', { style: styles.tableCell },
                            React.createElement('textarea', {
                                value: formData.osteosintesisDetalles || '',
                                onChange: (e) => handleInputChange('osteosintesisDetalles', e.target.value),
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
               
                // Lista de tipos de osteosíntesis
                (radioSelections['fractura'] === 'si' && radioSelections['osteosintesis'] === 'si') && React.createElement('tr', null,
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
                                                    onChange: () => {},
                                                    onClick: () => {
                                                        const nuevosTipos = [...formData.osteosintesisTipos];
                                                        nuevosTipos[index] = {
                                                            ...nuevosTipos[index],
                                                            extraido: tipo.extraido === 'si' ? '' : 'si'
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
                                                    onChange: () => {},
                                                    onClick: () => {
                                                        const nuevosTipos = [...formData.osteosintesisTipos];
                                                        nuevosTipos[index] = {
                                                            ...nuevosTipos[index],
                                                            extraido: tipo.extraido === 'no' ? '' : 'no'
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
                ),
  
// Nivel 1 IRF
               React.createElement('tr', null,
                   React.createElement('td', { style: styles.tableCell }, 
                       React.createElement('div', { 
                           style: {
                               ...styles.labelContainerStyle,
                               flexDirection: 'row',  
                               gap: '1rem',  
                               alignItems: 'center'  
                           }
                       },
                           radioSelections['irf'] === 'si' && React.createElement('div', {
                               style: {
                                   display: 'flex',
                                   flexDirection: 'column',
                                   gap: '0.25rem'
                               }
                           },
                               React.createElement('span', null, 'Inicio de síntomas'),
                               React.createElement('input', {
                                   type: 'date',
                                   value: formData.irfFecha || '',
                                   onChange: (e) => {
                                       const fechaSintomas = new Date(e.target.value);
                                       
                                       if (formData.fracturaFecha) {
                                           const fechaFractura = new Date(formData.fracturaFecha);
                                           if (fechaSintomas < fechaFractura) {
                                               alert('La fecha de inicio de síntomas no puede ser anterior a la fecha de fractura');
                                               return;
                                           }
                                       } else {
                                           // En lugar de establecer la fecha, solo mostramos el recordatorio
                                            if (radioSelections['fractura'] !== 'si') {
                                            handleRadioClick('fractura', 'si');
                                            }
                                            alert('No se olvide de ingresar una fecha de fractura');
                                        }
                                       
                                       handleInputChange('irfFecha', e.target.value);
                                       const nuevaClasificacion = calcularClasificacionIRF(formData.fracturaFecha, e.target.value);
                                       if (nuevaClasificacion) {
                                           handleInputChange('irfTipo', nuevaClasificacion);
                                       }
                                   },
                                   style: styles.dateInputStyle
                               })
                           ),
                           'IRF'
                       )
                   ),
                   React.createElement('td', { style: styles.tableCell },
                       React.createElement('input', {
                           type: 'radio',
                           name: 'irf',
                           style: styles.radio,
                           checked: radioSelections['irf'] === 'si',
                           onChange: () => {},
                           onClick: () => {
                               if (radioSelections['irf'] === 'si') {
                                   handleRadioClick('irf', '');
                               } else {
                                   handleRadioClick('irf', 'si');
                                   if (radioSelections['fractura'] !== 'si') {
                                       handleRadioClick('fractura', 'si');
                                    }
                               }
                           }
                       })
                   ),
                   React.createElement('td', { style: styles.tableCell },
                       React.createElement('input', {
                           type: 'radio',
                           name: 'irf',
                           style: styles.radio,
                           checked: radioSelections['irf'] === 'no',
                           onChange: () => {},
                           onClick: () => {
                               if (radioSelections['irf'] === 'no') {
                                   handleRadioClick('irf', '');
                               } else {
                                   handleRadioClick('irf', 'no');
                               }
                           }
                       })
                   ),
                   React.createElement('td', { style: styles.tableCell },
                       React.createElement('div', {
                           style: {
                               display: 'flex',
                               gap: '1rem',
                               flexDirection: 'column'
                           }
                       },
                           radioSelections['irf'] === 'si' && React.createElement('select', {
                               style: { ...styles.input, width: '100%' },
                               value: formData.irfTipo || '',
                               onChange: (e) => handleInputChange('irfTipo', e.target.value)
                           },
                              React.createElement('option', { value: '' }, 'Seleccionar tipo...'),
                              React.createElement('option', { value: 'aguda' }, 'Aguda (1-2 semanas)'),
                              React.createElement('option', { value: 'retrasada' }, 'Retrasada (3-10 semanas)'),
                              React.createElement('option', { value: 'tardia' }, 'Tardía (>10 semanas)'),
                              React.createElement('option', { value: 'pseudoartrosis' }, 'Pseudoartrosis Infectada (6-9 meses)')
                           ),
                           React.createElement('textarea', {
                               placeholder: 'Agregar comentarios...',
                               value: formData.irfDetalles || '',
                               onChange: (e) => handleInputChange('irfDetalles', e.target.value),
                               style: {
                                   ...styles.input,
                                   width: '100%',
                                   minHeight: '2rem',
                                   resize: 'vertical',
                                   overflow: 'auto'
                               }
                           })
                       )
                   )
               ),
               
// Nivel 1 ISQ
               React.createElement('tr', null,
                    React.createElement('td', { style: styles.tableCell }, 
                        React.createElement('div', { 
                            style: {
                                ...styles.labelContainerStyle,
                                flexDirection: 'row',  
                                gap: '1rem',  
                                alignItems: 'center'  
                            }
                        },
                            radioSelections['isq'] === 'si' && React.createElement('div', {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.25rem'
                                }
                            },
                                React.createElement('span', null, 'Inicio de síntomas'),
                                React.createElement('input', {
                                    type: 'date',
                                    value: formData.isqFecha || '',
                                    onChange: (e) => handleInputChange('isqFecha', e.target.value),
                                    style: styles.dateInputStyle
                                })
                            ),
                            'ISQ'
                        )
                    ),
                    React.createElement('td', { style: styles.tableCell },
                        React.createElement('input', {
                            type: 'radio',
                            name: 'isq',
                            style: styles.radio,
                            checked: radioSelections['isq'] === 'si',
                            onChange: () => {},
                            onClick: () => {
                                if (radioSelections['isq'] === 'si') {
                                    handleRadioClick('isq', '');
                                } else {
                                    handleRadioClick('isq', 'si');
                                }
                            }
                        })
                    ),
                    React.createElement('td', { style: styles.tableCell },
                        React.createElement('input', {
                            type: 'radio',
                            name: 'isq',
                            style: styles.radio,
                            checked: radioSelections['isq'] === 'no',
                            onChange: () => {},
                            onClick: () => {
                                if (radioSelections['isq'] === 'no') {
                                    handleRadioClick('isq', '');
                                } else {
                                    handleRadioClick('isq', 'no');
                                }
                            }
                        })
                    ),
                    React.createElement('td', { style: styles.tableCell },
                        React.createElement('div', {
                            style: {
                                display: 'flex',
                                gap: '1rem',
                                flexDirection: 'column'
                            }
                        },
                            radioSelections['isq'] === 'si' && React.createElement('div', {
                                style: {
                                    display: 'flex',
                                    gap: '1rem',
                                    flexDirection: 'column'
                                }
                            },
                                React.createElement('select', {
                                    style: { ...styles.input, width: '100%' },
                                    value: formData.isqTipoHQ || '',
                                    onChange: (e) => handleInputChange('isqTipoHQ', e.target.value)
                                },
                                    React.createElement('option', { value: '' }, 'Clasificación de HQ...'),
                                    React.createElement('option', { value: 'limpia' }, 'Limpia'),
                                    React.createElement('option', { value: 'limpia-contaminada' }, 'Limpia-Contaminada'),
                                    React.createElement('option', { value: 'contaminada' }, 'Contaminada'),
                                    React.createElement('option', { value: 'sucia' }, 'Sucia')
                                ),
                                React.createElement('select', {
                                    style: { ...styles.input, width: '100%' },
                                    value: formData.isqTipo || '',
                                    onChange: (e) => handleInputChange('isqTipo', e.target.value)
                                },
                                    React.createElement('option', { value: '' }, 'Clasificación de ISQ...'),
                                    React.createElement('option', { value: 'superficial' }, 'Superficial'),
                                    React.createElement('option', { value: 'profunda' }, 'Profunda'),
                                    React.createElement('option', { value: 'organo-espacio' }, 'Organo Espacio')
                                )
                            ),
                            React.createElement('textarea', {
                                placeholder: 'Región/Características',
                                value: formData.isqDetalles || '',
                                onChange: (e) => handleInputChange('isqDetalles', e.target.value),
                                style: {
                                    ...styles.input,
                                    width: '100%',
                                    minHeight: '2rem',
                                    resize: 'vertical',
                                    overflow: 'auto'
                                }
                            })
                        )
                    )
                ),

// Nivel 1 Osteomielitis
React.createElement('tr', null,
                    React.createElement('td', { style: styles.tableCell }, 
                        React.createElement('div', { 
                            style: {
                                ...styles.labelContainerStyle,
                                flexDirection: 'row',  
                                gap: '1rem',  
                                alignItems: 'center'  
                            }
                        },
                            radioSelections['osteomielitis'] === 'si' && React.createElement('div', {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.25rem'
                                }
                            },
                                React.createElement('span', null, 'Inicio de síntomas'),
                               React.createElement('input', {
                                    type: 'date',
                                    value: formData.osteomielitisFecha || '',
                                    onChange: (e) => {
                                            const fechaSintomas = new Date(e.target.value);
                                            const fechaActual = new Date();
                                            
                                            if (fechaSintomas > fechaActual) {
                                                alert('La fecha de inicio de síntomas no puede ser posterior a la fecha actual');
                                                return;
                                            }
                                        handleInputChange('osteomielitisFecha', e.target.value);
                                        const nuevaClasificacion = calcularClasificacionOMA(e.target.value);
                                        if (nuevaClasificacion) {
                                            handleInputChange('osteomielitisTipo', nuevaClasificacion);
                                        }
                                    },
                                    style: styles.dateInputStyle
                                })
                            ),
                            'Osteomielitis'
                        )
                    ),
                    React.createElement('td', { style: styles.tableCell },
                        React.createElement('input', {
                            type: 'radio',
                            name: 'osteomielitis',
                            style: styles.radio,
                            checked: radioSelections['osteomielitis'] === 'si',
                            onChange: () => {},
                            onClick: () => {
                                if (radioSelections['osteomielitis'] === 'si') {
                                    handleRadioClick('osteomielitis', '');
                                } else {
                                    handleRadioClick('osteomielitis', 'si');
                                }
                            }
                        })
                    ),
                    React.createElement('td', { style: styles.tableCell },
                        React.createElement('input', {
                            type: 'radio',
                            name: 'osteomielitis',
                            style: styles.radio,
                            checked: radioSelections['osteomielitis'] === 'no',
                            onChange: () => {},
                            onClick: () => {
                                if (radioSelections['osteomielitis'] === 'no') {
                                    handleRadioClick('osteomielitis', '');
                                } else {
                                    handleRadioClick('osteomielitis', 'no');
                                }
                            }
                        })
                    ),
                    React.createElement('td', { style: styles.tableCell },
                        React.createElement('div', {
                            style: {
                                display: 'flex',
                                gap: '1rem',
                                flexDirection: 'column'
                            }
                        },
                            radioSelections['osteomielitis'] === 'si' && React.createElement('select', {
                                style: { ...styles.input, width: '100%' },
                                value: formData.osteomielitisTipo || '',
                                onChange: (e) => handleInputChange('osteomielitisTipo', e.target.value)
                            },
                                React.createElement('option', { value: '' }, 'Clasificación...'),
                                React.createElement('option', { value: 'aguda' }, 'Aguda (<3 semanas)'),
                                React.createElement('option', { value: 'cronica' }, 'Crónica (>3 semanas)')
                            ),
                            React.createElement('textarea', {
                                placeholder: 'Región/Características...',
                                value: formData.osteomielitisDetalles || '',
                                onChange: (e) => handleInputChange('osteomielitisDetalles', e.target.value),
                                style: {
                                    ...styles.input,
                                    width: '100%',
                                    minHeight: '2rem',
                                    resize: 'vertical',
                                    overflow: 'auto'
                                }
                            })
                        )
                    )
                ),

// Nivel 1 Artritis Séptica
React.createElement('tr', null,
                    React.createElement('td', { style: styles.tableCell }, 
                        React.createElement('div', { 
                            style: {
                                ...styles.labelContainerStyle,
                                flexDirection: 'row',  
                                gap: '1rem',  
                                alignItems: 'center'  
                            }
                        },
                            radioSelections['artritisSeptica'] === 'si' && React.createElement('div', {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.25rem'
                                }
                            },
                                React.createElement('span', null, 'Inicio de síntomas'),
                                React.createElement('input', {
                                    type: 'date',
                                    value: formData.artritisSepticaFecha || '',
                                    onChange: (e) => {
                                            const fechaSintomas = new Date(e.target.value);
                                            const fechaActual = new Date();
                                            
                                            if (fechaSintomas > fechaActual) {
                                                alert('La fecha de inicio de síntomas no puede ser posterior a la fecha actual');
                                                return;
                                            }
                                        handleInputChange('artritisSepticaFecha', e.target.value);
                                        const nuevaClasificacion = calcularClasificacionOMA(e.target.value);
                                        if (nuevaClasificacion) {
                                            handleInputChange('artritisSepticaTipo', nuevaClasificacion);
                                        }
                                    },
                                    style: styles.dateInputStyle
                                })
                            ),
                            'Artritis Séptica'
                        )
                    ),
                    React.createElement('td', { style: styles.tableCell },
                        React.createElement('input', {
                            type: 'radio',
                            name: 'artritisSeptica',
                            style: styles.radio,
                            checked: radioSelections['artritisSeptica'] === 'si',
                            onChange: () => {},
                            onClick: () => {
                                if (radioSelections['artritisSeptica'] === 'si') {
                                    handleRadioClick('artritisSeptica', '');
                                } else {
                                    handleRadioClick('artritisSeptica', 'si');
                                }
                            }
                        })
                    ),
                    React.createElement('td', { style: styles.tableCell },
                        React.createElement('input', {
                            type: 'radio',
                            name: 'artritisSeptica',
                            style: styles.radio,
                            checked: radioSelections['artritisSeptica'] === 'no',
                            onChange: () => {},
                            onClick: () => {
                                if (radioSelections['artritisSeptica'] === 'no') {
                                    handleRadioClick('artritisSeptica', '');
                                } else {
                                    handleRadioClick('artritisSeptica', 'no');
                                }
                            }
                        })
                    ),
                    React.createElement('td', { style: styles.tableCell },
                        React.createElement('div', {
                            style: {
                                display: 'flex',
                                gap: '1rem',
                                flexDirection: 'column'
                            }
                        },
                            radioSelections['artritisSeptica'] === 'si' && React.createElement('select', {
                                style: { ...styles.input, width: '100%' },
                                value: formData.artritisSepticaTipo || '',
                                onChange: (e) => handleInputChange('artritisSepticaTipo', e.target.value)
                            },
                                React.createElement('option', { value: '' }, 'Clasificación...'),
                                React.createElement('option', { value: 'aguda' }, 'Aguda (<3 semanas)'),
                                React.createElement('option', { value: 'cronica' }, 'Crónica (>3 semanas)')
                            ),
                            React.createElement('textarea', {
                                placeholder: 'Región/Características',
                                value: formData.artritisSepticaDetalles || '',
                                onChange: (e) => handleInputChange('artritisSepticaDetalles', e.target.value),
                                style: {
                                    ...styles.input,
                                    width: '100%',
                                    minHeight: '2rem',
                                    resize: 'vertical',
                                    overflow: 'auto'
                                }
                            })
                        )
                    )
                ),


                                
// Nivel 1 IPP
                React.createElement('tr', null,
                    React.createElement('td', { style: styles.tableCell }, 
                        React.createElement('div', { 
                            style: {
                                ...styles.labelContainerStyle,
                                flexDirection: 'row',  
                                gap: '1rem',  
                                alignItems: 'center'  
                            }
                        },
                            radioSelections['ipp'] === 'si' && React.createElement('div', {
                                style: {
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1rem',
                                    marginRight: '1rem'
                                }
                            },
                                // Primera fecha (Colocación del Implante)
                                React.createElement('div', {
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.25rem'
                                    }
                                },
                                    React.createElement('span', null, 'Colocación del Implante'),
                                    React.createElement('input', {
                                        type: 'date',
                                        value: formData.ippColocacionFecha || '',
                                        onChange: (e) => {
                                            const fechaColocacion = new Date(e.target.value);
                                            const fechaActual = new Date();
                                            
                                            if (fechaColocacion > fechaActual) {
                                                alert('La fecha de colocación no puede ser posterior a la fecha actual');
                                                return;
                                            }
                
                                            // Si ya existe fecha de síntomas, verificar que la nueva fecha de colocación sea anterior
                                            if (formData.ippSintomasFecha) {
                                                const fechaSintomas = new Date(formData.ippSintomasFecha);
                                                if (fechaColocacion > fechaSintomas) {
                                                    alert('La fecha de colocación debe ser anterior a la fecha de inicio de síntomas');
                                                    return;
                                                }
                                            }
                                            
                                            handleInputChange('ippColocacionFecha', e.target.value);
                                            const nuevaClasificacion = calcularClasificacionTsukayama(e.target.value, formData.ippSintomasFecha);
                                            if (nuevaClasificacion) {
                                                handleInputChange('ippTipo', nuevaClasificacion);
                                            }
                                        },
                                        style: styles.dateInputStyle
                                    })
                                ),
                                // Segunda fecha (Inicio de síntomas)
                                React.createElement('div', {
                                    style: {
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.25rem'
                                    }
                                },
                                    React.createElement('span', null, 'Inicio de síntomas'),
                                    React.createElement('input', {
                                        type: 'date',
                                        value: formData.ippSintomasFecha || '',
                                        onChange: (e) => {
                                            const fechaSintomas = new Date(e.target.value);
                                            const fechaActual = new Date();
                                            
                                            if (fechaSintomas > fechaActual) {
                                                alert('La fecha de inicio de síntomas no puede ser posterior a la fecha actual');
                                                return;
                                            }
                                            
                                            if (formData.ippColocacionFecha) {
                                                const fechaColocacion = new Date(formData.ippColocacionFecha);
                                                if (fechaSintomas < fechaColocacion) {
                                                    alert('La fecha de inicio de síntomas no puede ser anterior a la fecha de colocación del implante');
                                                    return;
                                                }
                                            }
                                            
                                            handleInputChange('ippSintomasFecha', e.target.value);
                                            const nuevaClasificacion = calcularClasificacionTsukayama(formData.ippColocacionFecha, e.target.value);
                                            if (nuevaClasificacion) {
                                                handleInputChange('ippTipo', nuevaClasificacion);
                                            }
                                        },
                                        style: styles.dateInputStyle
                                   })
                               )
                           ),
                           'IPP'
                       )
                   ),
                    React.createElement('td', { style: styles.tableCell },
                        React.createElement('input', {
                            type: 'radio',
                            name: 'ipp',
                            style: styles.radio,
                            checked: radioSelections['ipp'] === 'si',
                            onChange: () => {},
                            onClick: () => {
                                if (radioSelections['ipp'] === 'si') {
                                    handleRadioClick('ipp', '');
                                } else {
                                    handleRadioClick('ipp', 'si');
                                }
                            }
                        })
                    ),
                    React.createElement('td', { style: styles.tableCell },
                        React.createElement('input', {
                            type: 'radio',
                            name: 'ipp',
                            style: styles.radio,
                            checked: radioSelections['ipp'] === 'no',
                            onChange: () => {},
                            onClick: () => {
                                if (radioSelections['ipp'] === 'no') {
                                    handleRadioClick('ipp', '');
                                } else {
                                    handleRadioClick('ipp', 'no');
                                }
                            }
                        })
                    ),
                    React.createElement('td', { style: styles.tableCell },
                        React.createElement('div', {
                            style: {
                                display: 'flex',
                                gap: '1rem',
                                flexDirection: 'column'
                            }
                        },
                            radioSelections['ipp'] === 'si' && React.createElement('select', {
                                style: { ...styles.input, width: '100%' },
                                value: formData.ippTipo || '',
                                onChange: (e) => handleInputChange('ippTipo', e.target.value)
                            },
                                React.createElement('option', { value: '' }, 'Clasificación...'),
                                React.createElement('option', { value: 'aguda' }, 'Aguda (<1 mes)'),
                                React.createElement('option', { value: 'cronica' }, 'Crónica (>1 mes)')    
                            ),
                            React.createElement('textarea', {
                                placeholder: 'Agregar comentarios...',
                                value: formData.ippDetalles || '',
                                onChange: (e) => handleInputChange('ippDetalles', e.target.value),
                                style: {
                                    ...styles.input,
                                    width: '100%',
                                    minHeight: '2rem',
                                    resize: 'vertical',
                                    overflow: 'auto'
                                }
                            })
                        )
                    )
                ),

                                
// Nivel 1 Espondilodiscitis
                            React.createElement('tr', null,
                                React.createElement('td', { style: styles.tableCell }, 
                                    React.createElement('div', { 
                                        style: {
                                            ...styles.labelContainerStyle,
                                            flexDirection: 'row',  
                                            gap: '1rem',  
                                            alignItems: 'center'  
                                        }
                                    },
                                        radioSelections['espondilodiscitis'] === 'si' && React.createElement('div', {
                                            style: {
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.25rem'
                                            }
                                        },
                                            React.createElement('span', null, 'Inicio de síntomas'),
                                            React.createElement('input', {
                                                type: 'date',
                                                value: formData.espondilodiscitisFecha || '',
                                                onChange: (e) => {
                                                    const fechaSintomas = new Date(e.target.value);
                                                    const fechaActual = new Date();
                                                    
                                                    if (fechaSintomas > fechaActual) {
                                                        alert('La fecha de inicio de síntomas no puede ser posterior a la fecha actual');
                                                        return;
                                                    }
                                                        // Si hay OS y fecha de OS, validar que los síntomas sean posteriores
                                                        if (radioSelections['espondilodiscitisOS'] === 'si' && formData.espondilodiscitisOSFecha) {
                                                            const fechaOS = new Date(formData.espondilodiscitisOSFecha);
                                                            if (fechaSintomas < fechaOS) {
                                                                alert('La fecha de inicio de síntomas no puede ser anterior a la fecha de colocación de OS');
                                                                return;
                                                            }
                                                        }

                                                    handleInputChange('espondilodiscitisFecha', e.target.value);
                                                    const nuevaClasificacion = calcularClasificacionEspondilodiscitis(
                                                        formData.espondilodiscitisOSFecha, 
                                                        e.target.value, 
                                                        radioSelections['espondilodiscitisOS']
                                                    );
                                                    if (nuevaClasificacion) {
                                                        handleInputChange('espondilodiscitisTipo', nuevaClasificacion);
                                                    }
                                                },
                                                style: styles.dateInputStyle
                                            })
                                        ),
                                        'Espondilodiscitis'
                                    )
                                ),
                                React.createElement('td', { style: styles.tableCell },
                                    React.createElement('input', {
                                        type: 'radio',
                                        name: 'espondilodiscitis',
                                        style: styles.radio,
                                        checked: radioSelections['espondilodiscitis'] === 'si',
                                        onChange: () => {},
                                        onClick: () => {
                                            if (radioSelections['espondilodiscitis'] === 'si') {
                                                handleRadioClick('espondilodiscitis', '');
                                            } else {
                                                handleRadioClick('espondilodiscitis', 'si');
                                            }
                                        }
                                    })
                                ),
                                React.createElement('td', { style: styles.tableCell },
                                    React.createElement('input', {
                                        type: 'radio',
                                        name: 'espondilodiscitis',
                                        style: styles.radio,
                                        checked: radioSelections['espondilodiscitis'] === 'no',
                                        onChange: () => {},
                                        onClick: () => {
                                            if (radioSelections['espondilodiscitis'] === 'no') {
                                                handleRadioClick('espondilodiscitis', '');
                                            } else {
                                                handleRadioClick('espondilodiscitis', 'no');
                                            }
                                        }
                                    })
                                ),
                                React.createElement('td', { style: styles.tableCell },
                                    React.createElement('div', {
                                        style: {
                                            display: 'flex',
                                            gap: '1rem',
                                            flexDirection: 'column'
                                        }
                                    },
                                        radioSelections['espondilodiscitis'] === 'si' && React.createElement('select', {  
                                            style: { ...styles.input, width: '100%' },
                                            value: formData.espondilodiscitisTipo || '',
                                            onChange: (e) => handleInputChange('espondilodiscitisTipo', e.target.value)
                                        },
                                            React.createElement('option', { value: '' }, 'Clasificación...'),
                                            radioSelections['espondilodiscitisOS'] !== 'si' ? [
                                                React.createElement('option', { value: 'aguda' }, 'Aguda (<2 semanas)'),
                                                React.createElement('option', { value: 'cronica' }, 'Crónica (>2 semanas)')
                                            ] : [
                                                React.createElement('option', { value: 'temprana' }, 'Temprana (0-2 semanas)'),
                                                React.createElement('option', { value: 'retrasada' }, 'Retrasada (3-10 semanas)'),
                                                React.createElement('option', { value: 'tardia' }, 'Tardía (>10 semanas)')
                                            ]
                                        ),              
                                        React.createElement('textarea', {
                                            placeholder: 'Agregar comentarios...',
                                            value: formData.espondilodiscitisDetalles || '',
                                            onChange: (e) => handleInputChange('espondilodiscitisDetalles', e.target.value),
                                            style: {
                                                ...styles.input,
                                                width: '100%',
                                                minHeight: '2rem',
                                                resize: 'vertical',
                                                overflow: 'auto'
                                            }
                                        })
                                    )
                                )
                            ),

// Subnivel Osteosíntesis para Espondilodiscitis
               radioSelections['espondilodiscitis'] === 'si' && React.createElement('tr', null,
                   React.createElement('td', { 
                       style: { 
                           ...styles.tableCell,
                           paddingLeft: '2rem'
                       } 
                   }, 
                       React.createElement('div', { style: styles.labelContainerStyle },
                           radioSelections['espondilodiscitisOS'] === 'si' && React.createElement('div', {
                               style: {
                                   display: 'flex',
                                   flexDirection: 'column',
                                   gap: '0.25rem'
                               }
                           },
                               React.createElement('span', null, 'Fecha de Colocación'),
                               React.createElement('input', {
                                   type: 'date',
                                   value: formData.espondilodiscitisOSFecha || '',
                                   onChange: (e) => {
                                        const fechaOS = new Date(e.target.value);
                                        const fechaActual = new Date();
                                        
                                        if (fechaOS > fechaActual) {
                                            alert('La fecha de colocación no puede ser posterior a la fecha actual');
                                            return;
                                        }
                                        
                                        // Si ya existe fecha de síntomas, verificar que la OS sea anterior
                                        if (formData.espondilodiscitisFecha) {
                                            const fechaSintomas = new Date(formData.espondilodiscitisFecha);
                                            if (fechaOS > fechaSintomas) {
                                                alert('La fecha de colocación debe ser anterior a la fecha de inicio de síntomas');
                                                return;
                                            }
                                        }
                                        
                                        handleInputChange('espondilodiscitisOSFecha', e.target.value);
                                        if (formData.espondilodiscitisFecha) {
                                            const nuevaClasificacion = calcularClasificacionEspondilodiscitis(
                                                e.target.value, 
                                                formData.espondilodiscitisFecha, 
                                                'si'
                                            );
                                            if (nuevaClasificacion) {
                                                handleInputChange('espondilodiscitisTipo', nuevaClasificacion);
                                            }
                                        }
                                    },
                                   style: styles.dateInputStyle
                               })
                           ),
                           '↳ Osteosíntesis'
                       )
                   ),
                   React.createElement('td', { style: styles.tableCell },
                       React.createElement('input', {
                           type: 'radio',
                           name: 'espondilodiscitisOS',
                           style: styles.radio,
                           checked: radioSelections['espondilodiscitisOS'] === 'si',
                           onChange: () => {},
                           onClick: () => {
                               if (radioSelections['espondilodiscitisOS'] === 'si') {
                                   handleRadioClick('espondilodiscitisOS', '');
                                   // Al quitar OS, recalcular usando fecha de síntomas y fecha actual
                                   if (formData.espondilodiscitisFecha) {
                                       const nuevaClasificacion = calcularClasificacionEspondilodiscitis(
                                           null, 
                                           formData.espondilodiscitisFecha, 
                                           'no'
                                       );
                                       if (nuevaClasificacion) {
                                           handleInputChange('espondilodiscitisTipo', nuevaClasificacion);
                                       }
                                   }
                               } else {
                                   handleRadioClick('espondilodiscitisOS', 'si');
                                   // Al poner OS, si hay ambas fechas, recalcular usando fecha OS y fecha síntomas
                                   if (formData.espondilodiscitisFecha && formData.espondilodiscitisOSFecha) {
                                       const nuevaClasificacion = calcularClasificacionEspondilodiscitis(
                                           formData.espondilodiscitisOSFecha,
                                           formData.espondilodiscitisFecha,
                                           'si'
                                       );
                                       if (nuevaClasificacion) {
                                           handleInputChange('espondilodiscitisTipo', nuevaClasificacion);
                                       }
                                   }
                               }
                           }
                       })
                   ),
                   React.createElement('td', { style: styles.tableCell },
                       React.createElement('input', {
                           type: 'radio',
                           name: 'espondilodiscitisOS',
                           style: styles.radio,
                           checked: radioSelections['espondilodiscitisOS'] === 'no',
                           onChange: () => {},
                           onClick: () => {
                               if (radioSelections['espondilodiscitisOS'] === 'no') {
                                   handleRadioClick('espondilodiscitisOS', 'no');
                               } else {
                                   handleRadioClick('espondilodiscitisOS', 'no');
                               }
                           }
                       })
                   ),
                   React.createElement('td', { style: styles.tableCell },
                       React.createElement('textarea', {
                           placeholder: 'Agregar comentarios...',
                           value: formData.espondilodiscitisOSDetalles || '',
                           onChange: (e) => handleInputChange('espondilodiscitisOSDetalles', e.target.value),
                           style: {
                               ...styles.input,
                               width: '100%',
                               minHeight: '2rem',
                               resize: 'vertical',
                               overflow: 'auto'
                           }
                       })
                   )
               )
           ), // cierre del tbody
          
// AQUÍ COMIENZA LA NUEVA SECCIÓN DE PARACLÍNICA
           React.createElement('div', { style: { marginTop: '2rem', border: '1px solid #333', padding: '1rem' } },
               React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' } },
                   React.createElement('h3', { style: { margin: 0 } }, 'Paraclínica'),
                   React.createElement('button', {
                       onClick: () => {
                           const fechaActual = new Date().toISOString().split('T')[0];
                           setParaclinicaData(prev => ({
                               ...prev,
                               columnas: [...prev.columnas, {
                                   fecha: fechaActual,
                                   tipo: 'normal'
                               }]
                           }));
                       },
                       style: {
                           padding: '0.5rem 1rem',
                           cursor: 'pointer',
                           backgroundColor: '#f0f0f0',
                           border: '1px solid #ccc',
                           borderRadius: '4px'
                       }
                   }, '+ Agregar columna')
               ),
               React.createElement('table', { style: styles.table },
                  
                  // Cabecera de la tabla
                  React.createElement('thead', null,
                      React.createElement('tr', null,
                          React.createElement('th', { style: styles.tableHeader }, 'Variable'),
                          paraclinicaData.columnas.map((columna, index) => 
                              React.createElement('th', { 
                                  key: index, 
                                  style: styles.tableHeader 
                              },
                                  React.createElement('div', { 
                                      style: { 
                                          display: 'flex', 
                                          flexDirection: 'column',
                                          gap: '0.5rem',
                                          alignItems: 'center' 
                                      } 
                                  },
                                      React.createElement('div', {
                                          style: {
                                              display: 'flex',
                                              justifyContent: 'space-between',
                                              alignItems: 'center',
                                              width: '100%'
                                          }
                                      },
                                          columna.tipo === 'fi' ? 'FI' : (columna.tipo === 'actual' ? 'Fecha actual' : 'Fecha'),
                                          columna.tipo !== 'fi' && React.createElement('button', {
                                              onClick: () => {
                                                  setParaclinicaData(prev => ({
                                                      ...prev,
                                                      columnas: prev.columnas.filter((_, i) => i !== index)
                                                  }));
                                              },
                                              style: {
                                                  marginLeft: '0.5rem',
                                                  cursor: 'pointer',
                                                  border: 'none',
                                                  background: 'none',
                                                  color: '#ff4444',
                                                  fontSize: '1.2rem',
                                                  padding: '0.2rem'
                                              }
                                          }, '×')
                                      ),
                                      React.createElement('input', {
                                          type: 'date',
                                          value: columna.fecha || '',
                                          max: new Date().toISOString().split('T')[0],
                                          onChange: (e) => {
                                              setParaclinicaData(prev => ({
                                                  ...prev,
                                                  columnas: prev.columnas.map((col, i) => 
                                                      i === index ? { ...col, fecha: e.target.value } : col
                                                  )
                                              }));
                                          },
                                          style: {
                                              ...styles.dateInput,
                                              width: '140px',
                                              border: '1px solid #ccc',
                                              borderRadius: '4px',
                                              padding: '0.25rem'
                                          }
                                      })
                                  )
                              )
                          )
                      )
                  ),
                  
                  // Cuerpo de la tabla
                   React.createElement('tbody', null,
                       Object.entries(paraclinicaData.valores).map(([variable, datos]) => 
                           React.createElement('tr', { key: variable },
                               // Columna de variable con unidad
                               React.createElement('td', { 
                                   style: { ...styles.tableCell, fontWeight: 'bold' }
                               }, 
                                   `${variable.toUpperCase()} (${datos.unidad})`
                               ),
                               // Columnas de valores
                               paraclinicaData.columnas.map((_, colIndex) => 
                                   React.createElement('td', { 
                                       key: colIndex,
                                       style: styles.tableCell
                                   },
                                       React.createElement('input', {
                                           type: 'number',
                                           step: 'any',
                                           value: datos.valores[colIndex] || '',
                                           onChange: (e) => {
                                               const newValue = e.target.value;
                                               // Solo permitir números y punto decimal
                                               if (newValue === '' || /^\d*\.?\d*$/.test(newValue)) {
                                                   setParaclinicaData(prev => {
                                                       const newValores = { ...prev.valores };
                                                       if (!newValores[variable].valores[colIndex]) {
                                                           newValores[variable].valores = [
                                                               ...newValores[variable].valores
                                                           ];
                                                       }
                                                       newValores[variable].valores[colIndex] = newValue;
                                                       return {
                                                           ...prev,
                                                           valores: newValores
                                                       };
                                                   });
                                               }
                                           },
                                           style: {
                                               width: '100%',
                                               border: 'none',
                                               padding: '0.25rem',
                                               textAlign: 'center',
                                               backgroundColor: (() => {
                                                   const valor = parseFloat(datos.valores[colIndex]);
                                                   if (!valor) return 'white';
                                                   const rango = rangosNormales[variable];
                                                   if (valor < rango.min || valor > rango.max) {
                                                       return '#ffebee'; // rojo suave para valores anormales
                                                   }
                                                   return '#e8f5e9'; // verde suave para valores normales
                                               })()
                                           }
                                       })
                                   )
                               )
                           )
                       )
                   )
               )
           )
      )          // cierre de la tabla
  );            // cierre del div de Enfermedad Actual y el return del Form
}                // cierre de la función Form
root.render(React.createElement(Form));
