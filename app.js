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

    // Estilos base
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
        
        // Formulario
        React.createElement('div', { style: styles.formContainer },
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
                )
            )
        )
    );
}

root.render(React.createElement(Form));
