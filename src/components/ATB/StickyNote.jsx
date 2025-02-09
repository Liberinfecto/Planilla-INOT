import React, { useState } from 'react';
import { StickyNote as StickyIcon, Plus, X, Maximize2 } from 'lucide-react';

const COLORS = ['#feff9c', '#fff740', '#7afcff', '#ff65a3', '#ff7eb9'];
const NOTE_WIDTH = 70; // Ancho de la nota incluyendo márgenes
const MAX_NOTES_BEFORE_RESET = 5; // Número máximo de notas antes de volver al origen

const StickyNote = ({ 
    initialNotes = [], 
    position = { x: 0, y: 0 } 
}) => {
    const [notes, setNotes] = useState(initialNotes.map(note => ({
        ...note,
        text: note.text || ''
    })));
    const [selectedNote, setSelectedNote] = useState(null);

    const addNote = () => {
        if (notes.length >= 5) {
            alert('Máximo 5 notas permitidas');
            return;
        }
    
        const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        
        // Calcular la posición de la nueva nota
        const newNoteX = calculateNextNoteX();
        
        const newNote = {
            id: Date.now(),
            text: '', 
            position: { 
                x: newNoteX, 
                y: position.y 
            },
            color: randomColor,
            isEditing: true
        };
        
        setNotes(prevNotes => [...prevNotes, newNote]);
        setSelectedNote(newNote);
    };

    const calculateNextNoteX = () => {
        const addButtonX = position.x;
        
        // Ordenar notas por posición X de derecha a izquierda
        const sortedNotes = [...notes].sort((a, b) => b.position.x - a.position.x);
        
        if (sortedNotes.length === 0) {
            return addButtonX;
        }
        
        const lastNoteX = sortedNotes[0].position.x;
        const cyclePositions = [
            addButtonX,  // 1ra posición
            addButtonX - NOTE_WIDTH,  // 2da posición
            addButtonX - (NOTE_WIDTH * 2),  // 3ra posición
            addButtonX - (NOTE_WIDTH * 3),  // 4ta posición
            addButtonX - (NOTE_WIDTH * 4),  // 5ta posición
        ];
    
        // Calcular la posición basada en el número de notas
        return cyclePositions[sortedNotes.length % cyclePositions.length];
    };

    const updateNotePosition = (id, newPosition) => {
        setNotes(prevNotes => 
            prevNotes.map(note => 
                note.id === id 
                    ? { ...note, position: newPosition } 
                    : note
            )
        );
    };

    const updateNoteText = (id, text) => {
        setNotes(prevNotes => 
            prevNotes.map(note => 
                note.id === id 
                    ? { ...note, text } 
                    : note
            )
        );
    };

    const deleteNote = (id) => {
        setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
        setSelectedNote(null);
    };

    const openNoteModal = (note, e) => {
        // Solo abrir modal si no se está arrastrando
        if (!e.target.closest('[data-drag-handle="true"]')) {
            setSelectedNote(note);
        }
    };

    const closeNoteModal = () => {
        setSelectedNote(null);
    };

    return (
        <>
            <div
                style={{
                    position: 'relative',
                    height: '100%',
                    width: '100%'
                }}
            >
<button
    onClick={addNote}
    style={{
        position: 'absolute',
        top: '-10px',
        right: '-500px',
        border: 'none',
        background: 'rgba(13, 110, 253, 0.2)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        transition: 'all 0.3s ease',
        zIndex: 10
    }}
>
<span style={{
    fontSize: '24px',
    color: '#0d6efd',
    fontWeight: 'bold'
}}>+</span>
</button>

                {notes.map(note => (
                    <div
                        key={note.id}
                        title={note.text.split('\n')[0]} // Mostrar primera línea al pasar el cursor
                        style={{
                            position: 'absolute',
                            left: `${note.position.x}px`,
                            top: `${note.position.y}px`,
                            width: '50px',
                            height: '50px',
                            padding: '10px',
                            backgroundColor: note.color,
                            boxShadow: '2px 2px 8px rgba(0,0,0,0.1)',
                            zIndex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            cursor: 'pointer'
                        }}
                        onClick={(e) => openNoteModal(note, e)}
                    >
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteNote(note.id);
                            }}
                            style={{
                                position: 'absolute',
                                top: '0',
                                right: '0',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '2px'
                            }}
                        >
                            <X size={16} color="red" />
                        </button>
                        <div 
                            data-drag-handle="true"
                            onMouseDown={(e) => {
                                e.stopPropagation();
                                
                                const startX = e.clientX - note.position.x;
                                const startY = e.clientY - note.position.y;

                                const onMouseMove = (moveEvent) => {
                                    const newX = moveEvent.clientX - startX;
                                    const newY = moveEvent.clientY - startY;
                                    updateNotePosition(note.id, { x: newX, y: newY });
                                };

                                const onMouseUp = () => {
                                    document.removeEventListener('mousemove', onMouseMove);
                                    document.removeEventListener('mouseup', onMouseUp);
                                };

                                document.addEventListener('mousemove', onMouseMove);
                                document.addEventListener('mouseup', onMouseUp);
                            }}
                            style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                padding: '2px',
                                cursor: 'move',
                                userSelect: 'none',
                                marginLeft: '2px'
                            }}
                        >
                            ↔️
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal para notas */}
            {selectedNote && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: selectedNote.color,
                        padding: '20px',
                        borderRadius: '10px',
                        width: '300px',
                        position: 'relative',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}>
                        <button 
                            onClick={closeNoteModal}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <X />
                        </button>
                        <textarea 
                            autoFocus
                            value={selectedNote.text || ''}
                            onChange={(e) => {
                                const newText = e.target.value;
                                updateNoteText(selectedNote.id, newText);
                                
                                setSelectedNote(prev => ({
                                    ...prev,
                                    text: newText
                                }));
                            }}
                            placeholder="Escribe tu nota aquí..."
                            style={{
                                width: '100%',
                                height: '200px',
                                border: 'none',
                                backgroundColor: 'transparent',
                                resize: 'vertical',
                                outline: 'none',
                                fontSize: '16px',
                                color: '#000'
                            }}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default StickyNote;