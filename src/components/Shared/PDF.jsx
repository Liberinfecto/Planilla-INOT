import React, { useRef } from 'react';

const PDFHandler = ({
    pdfs,
    setPdfs,
    sectionName,
    containerStyle = {},
    maxHeight = "190px"
}) => {
    const pdfInputRef = useRef(null);

    const handleFileUpload = (files) => {
        Array.from(files).forEach(file => {
            if (file.type === 'application/pdf') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setPdfs(prev => [...prev, {
                        name: file.name,
                        data: e.target.result,
                        type: 'pdf'
                    }]);
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const handlePdfUpload = (event) => {
        handleFileUpload(event.target.files);
        event.target.value = '';
    };

    const handleFileDelete = (index) => {
        setPdfs(prev => prev.filter((_, i) => i !== index));
    };

    const handleFilePreview = (file) => {
        const newWindow = window.open('', '_blank');
        newWindow.document.write(`
            <html>
                <head>
                    <title>Vista Previa PDF</title>
                    <style>
                        body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
                        object { width: 100%; height: 100%; }
                    </style>
                </head>
                <body>
                    <object data="${file.data}" type="application/pdf">
                        Tu navegador no soporta la visualización de PDFs
                    </object>
                </body>
            </html>
        `);
        newWindow.document.close();
    };

    const triggerFileInput = () => {
        pdfInputRef.current.click();
    };

    return (
        <div style={{
            width: '200px',
            height: maxHeight,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            padding: '1rem',
            border: '1px dashed #ccc',
            borderRadius: '4px',
            backgroundColor: '#f9f9f9',
            ...containerStyle
        }}
            onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.backgroundColor = '#e9ecef';
            }}
            onDragLeave={(e) => {
                e.preventDefault();
                e.currentTarget.style.backgroundColor = '#f9f9f9';
            }}
            onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.backgroundColor = '#f9f9f9';
                handleFileUpload(e.dataTransfer.files);
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <button
                    className="archivo-btn"
                    onClick={triggerFileInput}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginBottom: '0.5rem',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontWeight: '500'
                    }}
                >
                    Seleccionar PDF
                </button>
                <p style={{
                    fontSize: '0.9rem',
                    color: '#666',
                    margin: 0
                }}>
                    Arrastre PDFs aquí
                </p>
            </div>

            <div style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem'
            }}>
                {pdfs.map((file, index) => (
                    <div
                        key={index}
                        style={{
                            padding: '0.5rem',
                            backgroundColor: 'white',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}
                    >
                        <span
                            style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: 1,
                                cursor: 'pointer'
                            }}
                            onClick={() => handleFilePreview(file)}
                        >
                            {file.name}
                        </span>
                        <button
                            onClick={() => handleFileDelete(index)}
                            style={{
                                border: 'none',
                                background: 'none',
                                color: 'red',
                                cursor: 'pointer',
                                padding: '0 0.25rem',
                                fontSize: '1.2rem',
                                fontWeight: 'bold'
                            }}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
            <input
                type="file"
                accept="application/pdf"
                onChange={handlePdfUpload}
                ref={pdfInputRef}
                style={{ display: 'none' }}
                multiple
            />
        </div>
    );
};

export default PDFHandler;