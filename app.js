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
        fracturaHueso: ''
    });

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
        
        // Sección de Antecedentes Traumatológicos (nuevo contenedor separado)
        React.createElement('div', { style: { marginTop: '2rem', border: '1px solid #333', padding: '1rem' } },
            React.createElement('table', { style: styles.table },
                // Cabecera de la tabla
// Fractura
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
                            React.createElement('input', {
                                type: 'text',
                                placeholder: 'Hueso',
                                style: styles.input,
                                value: formData.fracturaHueso || '',
                                onChange: (e) => handleInputChange('fracturaHueso', e.target.value)
                            })
                        )
                    )
                )
            )
        )
    );
}
root.render(React.createElement(Form));
