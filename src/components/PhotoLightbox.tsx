"use client";

import { useEffect } from "react";
import Image from "next/image";

interface Photo {
    src: string;
    alt: string;
    caption?: string;
    location?: string;
}

interface PhotoLightboxProps {
    photos: Photo[];
    isOpen: boolean;
    currentIndex: number;
    onClose: () => void;
    onNext: () => void;
    onPrevious: () => void;
}

export default function PhotoLightbox({ 
    photos, 
    isOpen, 
    currentIndex, 
    onClose, 
    onNext, 
    onPrevious 
}: PhotoLightboxProps) {


    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
            if (!isOpen) return;
            
            switch (e.key) {
                case 'Escape':
                    onClose();
                    break;
                case 'ArrowRight':
                    onNext();
                    break;
                case 'ArrowLeft':
                    onPrevious();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeydown);
        return () => document.removeEventListener('keydown', handleKeydown);
    }, [isOpen, onClose, onNext, onPrevious]);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen || !photos[currentIndex]) return null;

    const currentPhoto = photos[currentIndex];

    return (
        <div 
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: 'rgba(0, 0, 0, 0.95)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'fadeIn 0.3s ease-out'
            }}
            onClick={onClose}
        >
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { transform: scale(0.8) translateY(20px); opacity: 0; }
                    to { transform: scale(1) translateY(0); opacity: 1; }
                }
            `}</style>
            
            {/* Close button */}
            <button
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    width: '50px',
                    height: '50px',
                    border: 'none',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: '24px',
                    cursor: 'pointer',
                    zIndex: 10001,
                    transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                    (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.2)';
                    (e.target as HTMLButtonElement).style.transform = 'scale(1.1)';
                }}
                onMouseOut={(e) => {
                    (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.1)';
                    (e.target as HTMLButtonElement).style.transform = 'scale(1)';
                }}
            >
                ×
            </button>

            {/* Previous button */}
            {photos.length > 1 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onPrevious();
                    }}
                    style={{
                        position: 'absolute',
                        left: '20px',
                        width: '50px',
                        height: '50px',
                        border: 'none',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        fontSize: '24px',
                        cursor: 'pointer',
                        zIndex: 10001,
                        transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                        (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.2)';
                    }}
                    onMouseOut={(e) => {
                        (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                >
                    ‹
                </button>
            )}

            {/* Next button */}
            {photos.length > 1 && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onNext();
                    }}
                    style={{
                        position: 'absolute',
                        right: '20px',
                        width: '50px',
                        height: '50px',
                        border: 'none',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        fontSize: '24px',
                        cursor: 'pointer',
                        zIndex: 10001,
                        transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                        (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.2)';
                    }}
                    onMouseOut={(e) => {
                        (e.target as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.1)';
                    }}
                >
                    ›
                </button>
            )}

            {/* Main image container */}
            <div 
                onClick={(e) => e.stopPropagation()}
                style={{
                    position: 'relative',
                    maxWidth: '90vw',
                    maxHeight: '90vh',
                    animation: 'slideIn 0.3s ease-out'
                }}
            >
                <Image
                    src={currentPhoto.src}
                    alt={currentPhoto.alt}
                    width={1200}
                    height={800}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '80vh',
                        width: 'auto',
                        height: 'auto',
                        objectFit: 'contain'
                    }}

                />

                {/* Caption */}
                {(currentPhoto.caption || currentPhoto.location) && (
                    <div style={{
                        position: 'absolute',
                        bottom: '-60px',
                        left: 0,
                        right: 0,
                        color: '#fff',
                        textAlign: 'center'
                    }}>
                        {currentPhoto.caption && (
                            <div style={{ 
                                fontSize: '16px', 
                                fontWeight: '600',
                                marginBottom: '4px'
                            }}>
                                {currentPhoto.caption}
                            </div>
                        )}
                        {currentPhoto.location && (
                            <div style={{ 
                                fontSize: '14px', 
                                opacity: 0.8,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px'
                            }}>
                                📍 {currentPhoto.location}
                            </div>
                        )}
                    </div>
                )}

                {/* Counter */}
                {photos.length > 1 && (
                    <div style={{
                        position: 'absolute',
                        top: '-40px',
                        right: 0,
                        color: '#fff',
                        fontSize: '14px',
                        opacity: 0.8
                    }}>
                        {currentIndex + 1} / {photos.length}
                    </div>
                )}
            </div>
        </div>
    );
}