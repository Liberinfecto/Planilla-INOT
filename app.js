const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

function Form() {
    // Estado del formulario
    const [formData, setFormData] = React.useState({
        name: '',
        floor: '',
        ci: '',
        age: '',
        origin: '',
        fi: '',
        fConsult: '',
        fe: ''
    });

    // Manejador de cambios en los inputs
    const handleInputChange = (fieldName, value) => {
        setFormData(prevData => ({
            ...prevData,
            [fieldName]: value
        }));
    };

    return React.createElement('div', { style: { maxWidth: '1024px', margin: '0 auto', padding: '1rem' } },
        // Header
        React.createElement('h1', { style: { fontSize: '1.25rem', fontWeight: 'bold', textAlign: 'center' } }, 
            'CATEDRA DE ENFERMEDADES INFECCIOSAS'
        ),
        React.createElement('h2', { style: { fontSize: '1rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' } }, 
            'ASISTENCIA DE PACIENTES EN INOT'
        ),
        
        // Formulario
        React.createElement('div', { style: { border: '1px solid #333', padding: '1rem' } },
            // Primera sección de campos
            React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' } },
                // Campo Nombre
                React.createElement('div', { style: { display: 'flex', alignItems: 'center' } },
                    React.createElement('span', { style: { fontWeight: 'bold', minWidth: '100px' } }, 'Nombre:'),
                    React.createElement('input', { 
                        type: 'text',
                        value: formData.name,
                        onChange: (e) => handleInputChange('name', e.target.value),
                        style: { flex: 1, borderBottom: '1px solid black', padding: '0.25rem' }
                    })
                ),
                // Campo Piso/Cama
                React.createElement('div', { style: { display: 'flex', alignItems: 'center' } },
                    React.createElement('span', { style: { fontWeight: 'bold', minWidth: '100px' } }, 'Piso/Cama:'),
                    React.createElement('input', { 
                        type: 'text',
                        value: formData.floor,
                        onChange: (e) => handleInputChange('floor', e.target.value),
                        style: { flex: 1, borderBottom: '1px solid black', padding: '0.25rem' }
                    })
                ),
                // Campo CI
                React.createElement('div', { style: { display: 'flex', alignItems: 'center' } },
                    React.createElement('span', { style: { fontWeight: 'bold', minWidth: '100px' } }, 'CI:'),
                    React.createElement('input', { 
                        type: 'text',
                        value: formData.ci,
                        onChange: (e) => handleInputChange('ci', e.target.value),
                        style: { flex: 1, borderBottom: '1px solid black', padding: '0.25rem' }
                    })
                ),
                // Campo Edad
                React.createElement('div', { style: { display: 'flex', alignItems: 'center' } },
                    React.createElement('span', { style: { fontWeight: 'bold', minWidth: '100px' } }, 'Edad:'),
                    React.createElement('input', { 
                        type: 'text',
                        value: formData.age,
                        onChange: (e) => handleInputChange('age', e.target.value),
                        style: { flex: 1, borderBottom: '1px solid black', padding: '0.25rem' }
                    })
                )
            )
        )
    );
}

root.render(React.createElement(Form));
