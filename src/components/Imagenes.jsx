import React, { useState, useEffect } from 'react';
import ImageHandler from './Shared/Images';
import PDFHandler from './Shared/PDF';

function Imagenes() {
    // Estados para RX y HQ
    const [pdfsRX, setPdfsRX] = useState([]);
    const [photosRX, setPhotosRX] = useState([]);
    const [pdfsHQ, setPdfsHQ] = useState([]);
    const [photosHQ, setPhotosHQ] = useState([]);

    // Estados para TC
    const [pdfsTC, setPdfsTC] = useState([]);
    const [photosTC, setPhotosTC] = useState([]);
    const [informeTC, setInformeTC] = useState('');

    // Estados para RNM
    const [pdfsRNM, setPdfsRNM] = useState([]);
    const [photosRNM, setPhotosRNM] = useState([]);
    const [informeRNM, setInformeRNM] = useState('');

    // Estados para Centellograma
    const [pdfsCentellograma, setPdfsCentellograma] = useState([]);
    const [photosCentellograma, setPhotosCentellograma] = useState([]);
    const [informeCentellograma, setInformeCentellograma] = useState('');

    // Estados para manejar los estudios activos y el menú desplegable
    const [estudiosActivos, setEstudiosActivos] = useState([]);
    const [menuAbierto, setMenuAbierto] = useState(false);

    const agregarEstudio = (tipo) => {
        if (!estudiosActivos.includes(tipo)) {
            setEstudiosActivos([...estudiosActivos, tipo]);
        }
    };

    const eliminarEstudio = (tipo) => {
        setEstudiosActivos(estudiosActivos.filter(estudio => estudio !== tipo));
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Verificamos si el clic fue fuera del botón y del menú
            const button = document.querySelector('.add-study-button');
            const menu = document.querySelector('.study-menu');

            if (button && menu &&
                !button.contains(event.target) &&
                !menu.contains(event.target)) {
                setMenuAbierto(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        // Limpiamos el event listener cuando el componente se desmonte
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); // Array de dependencias vacío porque solo queremos que se ejecute una vez

    return (
        <div className="container">
            <h3 style={{margin: '0 0 1rem', textAlign: 'left', color: '#333'}}>Imágenes</h3>
            <hr style={{border: 'none', borderTop: '2px solid #333', margin: '0 0 1rem'}} />

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '1rem',
                backgroundColor: '#fff',
                maxWidth: '900px',
                margin: '0 auto'
            }}>
                {/* Contenedor RX y HQ (siempre visible) */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                }}>
                    {/* Container RX */}
                    <div style={{
                        flex: '1',
                        minWidth: '300px', // Ancho mínimo para evitar que se compriman demasiado
                        maxWidth: 'calc(50% - 0.5rem)', // Asegura que no exceda el 50% del espacio
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '1rem',
                        backgroundColor: '#f9f9f9',
                        overflow: 'hidden' // Evita desbordamiento
                    }}>
                        <h3 style={{marginBottom: '1rem'}}>RX</h3>
                        <ImageHandler
                            photos={photosRX}
                            setPhotos={setPhotosRX}
                            sectionName="rx"
                            allowCamera={true}
                            maxHeight="190px"
                            containerStyle={{
                                width: '400px'  // Doble del tamaño original
                            }}
                        />
                    </div>

                    {/* Container HQ */}
                    <div style={{
                        flex: '1',
                        minWidth: '300px', // Ancho mínimo para evitar que se compriman demasiado
                        maxWidth: 'calc(50% - 0.5rem)', // Asegura que no exceda el 50% del espacio
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '1rem',
                        backgroundColor: '#f9f9f9',
                        overflow: 'hidden' // Evita desbordamiento
                    }}>
                        <h3 style={{marginBottom: '1rem'}}>Herida Quirúrgica</h3>
                        <ImageHandler
                            photos={photosHQ}
                            setPhotos={setPhotosHQ}
                            sectionName="hq"
                            allowCamera={true}
                            maxHeight="190px"
                            containerStyle={{
                                width: '400px'  // Doble del tamaño original
                            }}
                        />
                    </div>
                </div>

                {/* Estudios adicionales */}
                {estudiosActivos.map(tipo => (
                    <div key={tipo} style={{
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '1rem',
                        backgroundColor: '#f9f9f9',
                        position: 'relative'
                    }}>
                        {/* Botón eliminar más grande */}
                        <button
                            onClick={() => eliminarEstudio(tipo)}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '10px',
                                border: 'none',
                                background: 'rgba(220, 53, 69, 0.1)',
                                color: '#dc3545',
                                cursor: 'pointer',
                                width: '32px',
                                height: '32px',
                                borderRadius: '50%',
                                fontSize: '24px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(220, 53, 69, 0.2)';
                                e.target.style.transform = 'scale(1.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(220, 53, 69, 0.1)';
                                e.target.style.transform = 'scale(1)';
                            }}
                        >
                            ×
                        </button>

                        {/* Contenido del estudio */}
                        <h3 style={{marginBottom: '1rem', paddingRight: '40px'}}>{tipo}</h3>
                        <div style={{display: 'flex', gap: '1rem', alignItems: 'stretch'}}>
                            <textarea
                                value={tipo === 'TC' ? informeTC : tipo === 'RNM' ? informeRNM : informeCentellograma}
                                onChange={(e) => tipo === 'TC' ? setInformeTC(e.target.value) : tipo === 'RNM' ? setInformeRNM(e.target.value) : setInformeCentellograma(e.target.value)}
                                placeholder={`Ingrese el informe de ${tipo}...`}
                                style={{
                                    flex: 1,
                                    backgroundColor: 'white',
                                    height: '200px',
                                    resize: 'vertical',
                                    padding: '0.5rem',
                                    border: '1px solid #ccc',
                                    color: 'black',
                                    borderRadius: '4px'
                                }}
                            />
                            <div style={{display: 'flex', gap: '1rem'}}>
                                <PDFHandler
                                    pdfs={tipo === 'TC' ? pdfsTC : tipo === 'RNM' ? pdfsRNM : pdfsCentellograma}
                                    setPdfs={tipo === 'TC' ? setPdfsTC : tipo === 'RNM' ? setPdfsRNM : setPdfsCentellograma}
                                    sectionName={tipo.toLowerCase()}
                                />
                                <ImageHandler
                                    photos={tipo === 'TC' ? photosTC : tipo === 'RNM' ? photosRNM : photosCentellograma}
                                    setPhotos={tipo === 'TC' ? setPhotosTC : tipo === 'RNM' ? setPhotosRNM : setPhotosCentellograma}
                                    sectionName={tipo.toLowerCase()}
                                    allowCamera={true}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {/* Botón Agregar Estudio siempre al final */}
                <div style={{
                    position: 'relative',
                    marginTop: '1rem'
                }}>
                    <button
                        className="add-study-button"  // Agregamos esta clase
                        onClick={() => setMenuAbierto(!menuAbierto)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '1rem',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#0056b3'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#007bff'}
                    >
                        <span>+ Agregar Estudio</span>
                    </button>

                    {menuAbierto && (
                        <div
                            className="study-menu"  // Agregamos esta clase
                            style={{
                                position: 'absolute',
                                top: '100%',
                                left: '0',
                                backgroundColor: 'white',
                                border: '1px solid #ccc',
                                borderRadius: '4px',
                                padding: '0.5rem',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                zIndex: 10,
                                marginTop: '0.5rem',
                                minWidth: '200px'
                            }}
                        >
                            {['TC', 'RNM', 'Centellograma'].map(tipo => (
                                <div
                                    key={tipo}
                                    onClick={() => {
                                        agregarEstudio(tipo);
                                        setMenuAbierto(false);
                                    }}
                                    style={{
                                        padding: '0.75rem 1rem',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s',
                                        borderRadius: '4px'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    {tipo}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Imagenes;
