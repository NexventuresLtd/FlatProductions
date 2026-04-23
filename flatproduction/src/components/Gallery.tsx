import React from 'react';

const Gallery: React.FC = () => {
    const images = [
        { src: '/photo1.jpg', alt: 'Gallery image 1' },
        { src: '/photo2.jpg', alt: 'Gallery image 2' },
        { src: '/photo3.jpg', alt: 'Gallery image 3' },
        { src: '/photo4.jpg', alt: 'Gallery image 4' },
        { src: '/photo5.jpg', alt: 'Gallery image 5' },
        { src: '/photo6.jpg', alt: 'Gallery image 6' },
        { src: '/photo8.jpg', alt: 'Gallery image 7' },
        { src: '/photo9.jpg', alt: 'Gallery image 8' },
        { src: '/photo10.jpg', alt: 'Gallery image 9' },
        { src: '/photo12.jpg', alt: 'Gallery image 10' },
        { src: '/photo14.jpg', alt: 'Gallery image 11' },
        { src: '/live1.jpeg', alt: 'Gallery image 12' },
    ];

    return (
        <div id="gallery" className="gallery-section">
            <div className="gallery-header">
                <h2>Gallery</h2>
            </div>
            <div className="gallery">
                {images.map((image, index) => (
                    <div className="gallery-item" key={index}>
                        <img src={image.src} alt={image.alt} className="gallery-image" />
                        <div className="gallery-overlay"></div>
                    </div>
                ))}
            </div>
            <div className="gallery-actions">
                <button type="button" className="view-all-button" aria-label="View all gallery images">
                    View All
                </button>
            </div>
        </div>
    );
};

export default Gallery;