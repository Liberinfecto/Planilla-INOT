import React, { useState, useRef, useEffect } from 'react';
import ImageHandler from './Shared/Images';
import PDFHandler from './Shared/PDF';

function DescripcionOperatoria() {
    const [descripcionGeneral, setDescripcionGeneral] = useState('');
    const [bacteriologia, setBacteriologia] = useState('');
    const [puncionCitoquimica, setPuncionCitoquimica] = useState('');

    const [pdfsDescripcion, setPdfsDescripcion] = useState([]);
    const [fotosDescripcion, setFotosDescripcion] = useState([]);
    const [pdfsBacteriologia, setPdfsBacteriologia] = useState([]);
    const [fotosBacteriologia, setFotosBacteriologia] = useState([]);
    const [pdfsPuncion, setPdfsPuncion] = useState([]);
    const [fotosPuncion, setFotosPuncion] = useState([]);

    const [bacteriologiaAbierta, setBacteriologiaAbierta] = useState(false);
    const [puncionAbierta, setPuncionAbierta] = useState(false);

    const toggleBacteriologia = () => {
        setBacteriologiaAbierta(!bacteriologiaAbierta);
    };

    const togglePuncion = () => {
        setPuncionAbierta(!puncionAbierta);
    };

    const getFileCount = (section) => {
        const counts = {
            descripcion: {
                pdfs: pdfsDescripcion.length,
                fotos: fotosDescripcion.length
            },
            bacteriologia: {
                pdfs: pdfsBacteriologia.length,
                fotos: fotosBacteriologia.length
            },
            puncion: {
                pdfs: pdfsPuncion.length,
                fotos: fotosPuncion.length
            }
        };
        return counts[section];
    };

    return (
        <div className="container">
            <h3 style={{
                margin: '0 0 1rem',
                textAlign: 'left',
                color: '#333'
            }}>
                Descripción Operatoria
            </h3>
            <hr style={{
                border: 'none',
                borderTop: '2px solid #333',
                margin: '0 0 1rem'
            }} />

            <div className="descripcion-operatoria" style={{
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
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'stretch'
                }}>
                    <textarea
                        className="operatoria-textarea"
                        value={descripcionGeneral}
                        onChange={(e) => setDescripcionGeneral(e.target.value)}
                        placeholder="Ingrese la descripción operatoria..."
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

                    <PDFHandler
                        pdfs={pdfsDescripcion}
                        setPdfs={setPdfsDescripcion}
                        sectionName="descripcion"
                    />

                    <ImageHandler
                        photos={fotosDescripcion}
                        setPhotos={setFotosDescripcion}
                        sectionName="descripcion"
                        allowCamera={true}
                    />
                </div>

                {/* Sección Bacteriología */}
                <div className="seccion-operatoria">
                    <button
                        className="btn-desplegable"
                        onClick={toggleBacteriologia}
                    >
                        <span className={`flecha-desplegable ${bacteriologiaAbierta ? 'abierto' : ''}`}>
                            ▶
                        </span>
                        Bacteriología
                        <span className="contador-archivos">
                            PDFs: {getFileCount('bacteriologia').pdfs} |
                            Fotos: {getFileCount('bacteriologia').fotos}
                        </span>
                    </button>
                    {bacteriologiaAbierta && (
                        <div className="seccion-desplegable">
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                alignItems: 'stretch'
                            }}>
                                <textarea
                                    className="operatoria-textarea"
                                    value={bacteriologia}
                                    onChange={(e) => setBacteriologia(e.target.value)}
                                    placeholder="Ingrese detalles de bacteriología..."
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

                                <PDFHandler
                                    pdfs={pdfsBacteriologia}
                                    setPdfs={setPdfsBacteriologia}
                                    sectionName="bacteriologia"
                                />

                                <ImageHandler
                                    photos={fotosBacteriologia}
                                    setPhotos={setFotosBacteriologia}
                                    sectionName="bacteriologia"
                                    allowCamera={true}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Sección Punción/Citoquímica */}
                <div className="seccion-operatoria">
                    <button
                        className="btn-desplegable"
                        onClick={togglePuncion}
                    >
                        <span className={`flecha-desplegable ${puncionAbierta ? 'abierto' : ''}`}>
                            ▶
                        </span>
                        Punción/Citoquímica
                        <span className="contador-archivos">
                            PDFs: {getFileCount('puncion').pdfs} |
                            Fotos: {getFileCount('puncion').fotos}
                        </span>
                    </button>
                    {puncionAbierta && (
                        <div className="seccion-desplegable">
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                alignItems: 'stretch'
                            }}>
                                <textarea
                                    className="operatoria-textarea"
                                    value={puncionCitoquimica}
                                    onChange={(e) => setPuncionCitoquimica(e.target.value)}
                                    placeholder="Ingrese detalles de punción/citoquímica..."
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

                                <PDFHandler
                                    pdfs={pdfsPuncion}
                                    setPdfs={setPdfsPuncion}
                                    sectionName="puncion"
                                />

                                <ImageHandler
                                    photos={fotosPuncion}
                                    setPhotos={setFotosPuncion}
                                    sectionName="puncion"
                                    allowCamera={true}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DescripcionOperatoria;
