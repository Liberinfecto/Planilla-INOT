import { useState } from "react";

function DatosPaciente({ setDatoPaciente }) {
    const [selectedSex, setSelectedSex] = useState(null); // Estado para el botón seleccionado
    const [edad, setEdad] = useState('');
    const [peso, setPeso] = useState('');
    const [talla, setTalla] = useState('');

    const toggleSex = (sex) => {
        const newSex = selectedSex === sex ? null : sex;
        setSelectedSex(newSex); // Actualiza estado local
        setDatoPaciente(prev => ({
            ...prev,
            sexo: newSex // Actualiza estado global
        }));
    };

    return (
        <div className="container">
            {/* Encabezados */}
            <h1 className="header">CATEDRA DE ENFERMEDADES INFECCIOSAS</h1>
            <h2 className="subheader">ASISTENCIA DE PACIENTES EN INOT</h2>

            {/* Formulario */}
            <div className="row">
                {/* Piso/Cama */}
                <div className="input-group compact">
                    <label>Piso/Cama:</label>
                    <input
                        type="number"
                        className="small-input"
                        onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                                e.preventDefault();
                            }
                        }}
                    />
                </div>

                {/* Sexo */}
                <div className="input-group compact">
                    <label>Sexo:</label>
                    <div className="radio-group">
                        <button
                            type="button"
                            className={`radio-button ${selectedSex === "H" ? "active" : ""}`}
                            onClick={() => toggleSex("H")}
                        >
                            H
                        </button>
                        <button
                            type="button"
                            className={`radio-button ${selectedSex === "M" ? "active" : ""}`}
                            onClick={() => toggleSex("M")}
                        >
                            M
                        </button>
                    </div>
                </div>

                {/* Edad */}
                <div className="input-group compact">
                    <label>Edad:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                            type="number"
                            min="0"
                            max="150"
                            className="small-input"
                            value={edad}
                            onChange={(e) => {
                                setEdad(e.target.value);
                                setDatoPaciente(prev => ({
                                    ...prev,
                                    edad: e.target.value
                                }));
                            }}
                        />
                        <span className="unit">años</span>
                    </div>
                </div>

                {/* Peso */}
                <div className="input-group compact">
                    <label>Peso:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                            type="number"
                            min="0"
                            step="0.1"
                            className="small-input"
                            value={peso}
                            onChange={(e) => {
                                setPeso(e.target.value);
                                setDatoPaciente(prev => ({
                                    ...prev,
                                    peso: e.target.value
                                }));
                            }}
                        />
                        <span className="unit">kg</span>
                    </div>
                </div>

                {/* Talla */}
                <div className="input-group compact">
                    <label>Talla:</label>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <input
                            type="number"
                            min="0"
                            max="250"
                            className="small-input"
                            value={talla}
                            onChange={(e) => {
                                setTalla(e.target.value);
                                setDatoPaciente(prev => ({
                                    ...prev,
                                    talla: e.target.value
                                }));
                            }}
                        />
                        <span className="unit">cm</span>
                    </div>
                </div>
            </div>

            {/* Nombre y Procedencia */}
            <div className="row">
                <div className="input-group">
                    <label>Nombre:</label>
                    <input type="text" />
                </div>
                <div className="input-group">
                    <label>Procedencia:</label>
                    <input type="text" />
                </div>
            </div>

            {/* CI y Otro Documento */}
            <div className="row">
                <div className="input-group">
                    <label>CI:</label>
                    <input
                        type="number"
                        className="small-input"
                        onKeyPress={(e) => {
                            if (!/[0-9]/.test(e.key)) {
                                e.preventDefault(); // Bloquea cualquier carácter que no sea número
                            }
                        }}
                    />
                </div>
                <div className="input-group">
                    <label>Otros Documentos/Comentarios:</label>
                    <textarea
                        style={{
                            width: '96%',
                            height: '17px', // Mismo alto que small-input
                            padding: '0.5rem',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            resize: 'vertical',
                            backgroundColor: 'white',
                            color: '#333',
                            fontSize: '14px'
                        }}
                    />
                </div>
            </div>

            {/* Fechas */}
            <div className="date-container">
                <div className="input-group">
                    <label>FI:</label>
                    <input type="date" />
                </div>
                <div className="input-group">
                    <label>F consulta infecto:</label>
                    <input type="date" />
                </div>
                <div className="input-group">
                    <label>FE:</label>
                    <input type="date" />
                </div>
            </div>
        </div>
    );
}

export default DatosPaciente;
