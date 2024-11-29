const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

function Form() {
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
            // Campos principales
            React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' } },
                // Campo Nombre
                React.createElement('div', { style: { display: 'flex', alignItems: 'center' } },
                    React.createElement('span', { style: { fontWeight: 'bold', minWidth: '100px' } }, 'Nombre:'),
                    React.createElement('input', { 
                        type: 'text',
                        style: { flex: 1, borderBottom: '1px solid black' }
                    })
                ),
                // ... [resto de los campos]
            )
        )
    );
}

root.render(React.createElement(Form));
