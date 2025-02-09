import React, { useState, useRef, useEffect } from 'react';

const ImageHandler = ({
    photos,
    setPhotos,
    sectionName,
    allowCamera = true,
    containerStyle = {},
    maxHeight = "190px"
}) => {
    const [previewImage, setPreviewImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startDragPosition, setStartDragPosition] = useState({ x: 0, y: 0 });
    const [modalPosition, setModalPosition] = useState({
        x: window.innerWidth / 2 - 400,
        y: window.innerHeight / 2 - 300
    });
    const [modalSize, setModalSize] = useState({
        width: Math.min(window.innerWidth - 100, 800),
        height: Math.min(window.innerHeight - 100, 600)
    });
    const [isResizing, setIsResizing] = useState(false);
    const [resizeStart, setResizeStart] = useState({ x: 0, y: 0 });
    const [initialSize, setInitialSize] = useState({ width: 800, height: 600 });
    const [imageZoom, setImageZoom] = useState(1);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [isDraggingImage, setIsDraggingImage] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const [initialModalConfig, setInitialModalConfig] = useState({
        position: { x: 0, y: 0 },
        size: { width: 0, height: 0 }
    });

    const photoInputRef = useRef(null);

    const getFileType = (file) => {
        if (file.type.startsWith('image/')) return 'imagen';
        return 'desconocido';
    };

    const handleFileUpload = (files) => {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setPhotos(prev => [...prev, {
                        name: file.name,
                        data: e.target.result,
                        type: 'imagen'
                    }]);
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const handlePhotoUpload = (event) => {
        handleFileUpload(event.target.files);
        event.target.value = '';
    };

    const handleFileDelete = (index) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };

    const handleImagePreview = (imageData, index) => {
        const img = new Image();
        img.onload = () => {
            const finalModalWidth = Math.min(window.innerWidth - 100, 500);
            const finalModalHeight = Math.min(window.innerHeight - 100, 550);

            const modalPosition = {
                x: (window.innerWidth - finalModalWidth) / 2,
                y: (window.innerHeight - finalModalHeight) / 2
            };

            setInitialModalConfig({
                position: modalPosition,
                size: {
                    width: finalModalWidth,
                    height: finalModalHeight
                }
            });

            setPreviewImage(imageData);
            setCurrentImageIndex(index);
            setIsPreviewOpen(true);
            setModalPosition(modalPosition);
            setModalSize({
                width: finalModalWidth,
                height: finalModalHeight
            });
            setImageZoom(0.75);
            setImagePosition({ x: 0, y: 0 });
        };
        img.src = imageData;
    };

    const closePreview = () => {
        setPreviewImage(null);
        setCurrentImageIndex(0);
        setIsPreviewOpen(false);
    };

    const handleNextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === photos.length - 1 ? 0 : prev + 1
        );
    };

    const handlePrevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? photos.length - 1 : prev - 1
        );
    };

    const triggerFileInput = (ref) => {
        ref.current.click();
    };

    const handleCameraCapture = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = document.createElement('video');
            video.srcObject = stream;
            await video.play();

            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);

            const dataUrl = canvas.toDataURL('image/jpeg');

            setPhotos(prev => [...prev, {
                name: `Captura_${new Date().toISOString()}.jpg`,
                data: dataUrl,
                type: 'imagen'
            }]);

            stream.getTracks().forEach(track => track.stop());
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('No se pudo acceder a la cámara');
        }
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartDragPosition({
            x: e.clientX - modalPosition.x,
            y: e.clientY - modalPosition.y
        });
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            const newX = e.clientX - startDragPosition.x;
            const newY = e.clientY - startDragPosition.y;

            const minX = 40;
            const maxX = window.innerWidth - modalSize.width - 40;

            const boundedX = Math.min(Math.max(newX, minX), maxX);

            setModalPosition({
                x: boundedX,
                y: newY
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleResizeStart = (e, direction) => {
        e.stopPropagation();
        setIsResizing(true);
        setResizeStart({ x: e.clientX, y: e.clientY });
        setInitialSize({ width: modalSize.width, height: modalSize.height });
        e.target.style.cursor = direction === 'e' ? 'e-resize' : 's-resize';
    };

    const handleResize = (e) => {
        if (!isResizing) return;
        e.preventDefault();
        e.stopPropagation();

        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;

        const maxWidth = window.innerWidth - modalPosition.x - 40;
        const minWidth = 400;
        const minHeight = 300;

        let newWidth = Math.max(minWidth, initialSize.width + deltaX);
        newWidth = Math.min(newWidth, maxWidth);

        const newHeight = Math.max(minHeight, initialSize.height + deltaY);

        setModalSize({
            width: newWidth,
            height: newHeight
        });
    };

    const handleResizeEnd = () => {
        setIsResizing(false);
    };

    useEffect(() => {
        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging]);

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleResize);
            window.addEventListener('mouseup', handleResizeEnd);
            return () => {
                window.removeEventListener('mousemove', handleResize);
                window.removeEventListener('mouseup', handleResizeEnd);
            };
        }
    }, [isResizing]);

    const handleZoomIn = () => {
        setImageZoom(prev => Math.min(3, prev + 0.25));
    };

    const handleZoomOut = () => {
        setImageZoom(prev => Math.max(0.5, prev - 0.25));
    };

    const resetZoom = () => {
        setImageZoom(1);
        setImagePosition({ x: 0, y: 0 });
        setIsDraggingImage(false);

        setModalPosition(initialModalConfig.position);
        setModalSize(initialModalConfig.size);
    };

    const handleImageMouseDown = (e) => {
        if (imageZoom > 1) {
            e.stopPropagation();
            setIsDraggingImage(true);
            setDragStart({
                x: e.clientX - imagePosition.x,
                y: e.clientY - imagePosition.y
            });
            e.preventDefault();
        }
    };

    const handleImageMouseMove = (e) => {
        if (isDraggingImage) {
            setImagePosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleImageMouseUp = () => {
        setIsDraggingImage(false);
    };

    useEffect(() => {
        if (isPreviewOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isPreviewOpen]);

    useEffect(() => {
        if (isDraggingImage) {
            window.addEventListener('mousemove', handleImageMouseMove);
            window.addEventListener('mouseup', handleImageMouseUp);
            return () => {
                window.removeEventListener('mousemove', handleImageMouseMove);
                window.removeEventListener('mouseup', handleImageMouseUp);
            };
        }
    }, [isDraggingImage]);

    return (
        <div style={{
            display: 'flex',
            gap: '1rem',
            ...containerStyle
        }}>
            <div style={{
                width: '200px',
                height: maxHeight,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                padding: '1rem',
                border: '1px dashed #ccc',
                borderRadius: '4px',
                backgroundColor: '#f9f9f9'
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
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <button
                            className="archivo-btn"
                            onClick={() => triggerFileInput(photoInputRef)}
                            style={{
                                flex: 1,
                                padding: '0.5rem',
                                backgroundColor: '#0d6efd',
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
                            Subir Foto
                        </button>
                        {allowCamera && (
                            <div style={{
                                cursor: 'pointer',
                                fontSize: '24px'
                            }}
                                onClick={handleCameraCapture}
                            >
                                📷
                            </div>
                        )}
                    </div>
                    <p style={{
                        fontSize: '0.9rem',
                        color: '#666',
                        margin: 0
                    }}>
                        Arrastre fotos aquí
                    </p>
                </div>

                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                }}>
                    {photos.map((file, index) => (
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
                            <span style={{
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                flex: 1,
                                cursor: 'pointer'
                            }}
                                onClick={() => handleImagePreview(file.data, index)}
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
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    ref={photoInputRef}
                    style={{ display: 'none' }}
                    multiple
                />
            </div>

            {isPreviewOpen && (
                <div
                    className="modal"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'transparent',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        left: '20px',
                        width: '4px',
                        top: '20px',
                        bottom: '20px',
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        borderRadius: '2px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)'
                    }} />
                    <div style={{
                        position: 'absolute',
                        right: '20px',
                        width: '4px',
                        top: '20px',
                        bottom: '20px',
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        borderRadius: '2px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)'
                    }} />
<div
    style={{
        position: 'absolute',
        top: `${modalPosition.y}px`,
        left: `${modalPosition.x}px`,
        width: `${modalSize.width}px`,
        height: `${modalSize.height}px`,
        backgroundColor: 'rgba(255, 255, 255, 0.3)', // Más transparente
        backdropFilter: 'blur(2px)', // Incrementa el desenfoque para un mejor efecto vidrio
        border: '6px solid rgba(255, 255, 255, 0.5)', // Borde más marcado con un toque de transparencia
        borderRadius: '12px', // Más redondeado para un diseño moderno
        overflow: 'hidden',
        cursor: isDragging ? 'grabbing' : 'grab',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)', // Sombra más pronunciada para destacar el modal
        padding: '20px', // Mantén el margen interno alrededor de la imagen
        boxSizing: 'border-box', // Asegura que el padding no altere el tamaño total
    }}
    onMouseDown={handleMouseDown}
>

                        <div
                            style={{
                                position: 'absolute',
                                right: 0,
                                bottom: 0,
                                width: '15px',
                                height: '15px',
                                cursor: 'se-resize',
                            }}
                            onMouseDown={(e) => handleResizeStart(e, 'se')}
                        />

                        <div
                            style={{
                                position: 'absolute',
                                right: 0,
                                top: '50%',
                                width: '10px',
                                height: '100px',
                                transform: 'translateY(-50%)',
                                cursor: 'e-resize',
                                backgroundColor: 'rgba(0, 0, 0, 0.39)',
                                zIndex: 3
                            }}
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                handleResizeStart(e, 'e');
                            }}
                        />

                        <div
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: '50%',
                                width: '100px',
                                height: '10px',
                                transform: 'translateX(-50%)',
                                cursor: 's-resize',
                                backgroundColor: 'rgba(0, 0, 0, 0.39)',
                                zIndex: 3
                            }}
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                handleResizeStart(e, 's');
                            }}
                        />

                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '10px',
                            width: '100%'
                        }}>
                            <button
                                onClick={resetZoom}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.7)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.5)'}
                                style={{
                                    position: 'absolute',
                                    left: '15px',
                                    top: '15px',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '40px',
                                    height: '40px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '28px',
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    zIndex: 4,
                                    padding: 0,
                                    lineHeight: 1,
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <span style={{
                                    display: 'block',
                                    transform: 'translate(-1px, -2px) rotate(0deg)',
                                    lineHeight: 1
                                }}>
                                    ⟲
                                </span>
                            </button>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                padding: '5px 25px',
                                borderRadius: '30px',
                                backdropFilter: 'blur(4px)',
                                transition: 'all 0.3s ease',
                                ':hover': {
                                    backgroundColor: 'rgba(0,0,0,0.7)'
                                }
                            }}>
                                <button
                                    onClick={handlePrevImage}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    style={{
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '30px',
                                        height: '30px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontSize: '24px',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    &#8249;
                                </button>

                                <div style={{
                                    display: 'flex',
                                    gap: '0',
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    borderRadius: '20px',
                                    padding: '1px',
                                    transition: 'all 0.2s',
                                }}>
                                    <button
                                        onClick={handleZoomOut}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        style={{
                                            color: 'white',
                                            border: 'none',
                                            width: '36px',
                                            height: '36px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontSize: '24px',
                                            backgroundColor: 'transparent',
                                            transition: 'all 0.2s',
                                            borderRadius: '16px 0 0 16px',
                                        }}
                                    >
                                        -
                                    </button>

                                    <div style={{
                                        width: '1px',
                                        height: '35px',
                                        backgroundColor: 'rgba(255,255,255,0.3)'
                                    }}></div>

                                    <button
                                        onClick={handleZoomIn}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        style={{
                                            color: 'white',
                                            border: 'none',
                                            width: '36px',
                                            height: '36px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontSize: '24px',
                                            backgroundColor: 'transparent',
                                            transition: 'all 0.2s',
                                            borderRadius: '0 16px 16px 0',
                                        }}
                                    >
                                        +
                                    </button>
                                </div>

                                <button
                                    onClick={handleNextImage}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    style={{
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '30px',
                                        height: '30px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        fontSize: '24px',
                                        backgroundColor: 'rgba(255,255,255,0.1)',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    &#8250;
                                </button>
                            </div>

                            <button
                                onClick={closePreview}
                                style={{
                                    backgroundColor: 'red',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '30px',
                                    height: '30px',
                                    cursor: 'pointer',
                                    position: 'absolute',
                                    right: '10px',
                                    top: '15px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    fontSize: '20px',
                                    padding: '0',
                                    lineHeight: '1'
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            height: 'calc(100% - 70px)',
                            justifyContent: 'center',
                        }}>
                            <div style={{
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                height: 'calc(100% - 70px)',
                                justifyContent: 'center',
                                overflow: 'auto'
                            }}>
                                <div style={{
                                    position: 'relative',
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    overflow: 'auto',
                                }}>
                                    <img
                                        src={photos[currentImageIndex].data}
                                        alt={`Foto ${currentImageIndex + 1}`}
                                        style={{
                                            transform: `scale(${imageZoom}) translate(${imagePosition.x}px, ${imagePosition.y}px)`,
                                            transformOrigin: 'center center',
                                            cursor: imageZoom > 1 ? 'grab' : 'default',
                                            transition: isDraggingImage ? 'none' : 'transform 0.2s',
                                            maxHeight: '90vh',
                                            maxWidth: '90%',
                                            objectFit: 'contain'
                                        }}
                                        onMouseDown={handleImageMouseDown}
                                        onMouseMove={handleImageMouseMove}
                                        onMouseUp={handleImageMouseUp}
                                        onMouseLeave={handleImageMouseUp}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{
                            position: 'absolute',
                            bottom: '10px',
                            left: '0',
                            right: '0',
                            textAlign: 'center',
                            color: '#333',
                            fontSize: '14px'
                        }}>
                            {currentImageIndex + 1} / {photos.length}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageHandler;