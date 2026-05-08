import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';

const ContactPage: React.FC = () => {
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [showToast, setShowToast] = useState(false);
    const whatsappLink = 'https://wa.me/250781691713?text=Hello%20Flat%20Production%2C%20I%20would%20like%20to%20book%20your%20services.';

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormStatus('submitting');

        // Simulate network delay
        setTimeout(() => {
            setFormStatus('success');
            setShowToast(true);
            
            // Hide toast after 4 seconds
            setTimeout(() => setShowToast(false), 4000);
            
            // Reset form
            setTimeout(() => setFormStatus('idle'), 4000);
            (event.target as HTMLFormElement).reset();
        }, 1500);
    };

    return (
        <div className="contact-page">
            <div className="contactpage-header-wrap">
                <Header />
            </div>

            <main className="contactpage-main">
                <div className="contact-header-content">
                    
                    <h1 className="contact-form-title">Let's Create Something<br />Extraordinary</h1>
                </div>

                <section className="contactpage-top-grid">
                    <div className="contactpage-form-wrap">
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label htmlFor="fullName">Full Name</label>
                                <input id="fullName" name="fullName" type="text" placeholder="e.g. Alex Niyongira" required disabled={formStatus === 'submitting'} />
                            </div>

                            <div className="input-group">
                                <label htmlFor="email">Email Address</label>
                                <input id="email" name="email" type="email" placeholder="e.g. alex@example.com" required disabled={formStatus === 'submitting'} />
                            </div>

                            <div className="input-group">
                                <label htmlFor="message">Project Details</label>
                                <textarea id="message" name="message" rows={5} placeholder="Tell us about your vision..." required disabled={formStatus === 'submitting'} />
                            </div>

                            <button type="submit" className={`submit-btn ${formStatus === 'submitting' ? 'loading' : ''}`}>
                                {formStatus === 'submitting' ? (
                                    <span>Sending Inquiry...</span>
                                ) : (
                                    <>Send Inquiry <i className="arrow-icon">→</i></>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="contactpage-info-wrap">
                        <article className="contact-info-item glass-card">
                            <h2>Book Us</h2>
                            <p>Schedule an appointment today for your event, production, or campaign. We are ready to bring your vision to life.</p>
                            <a className="book-us-button" href={whatsappLink} target="_blank" rel="noreferrer">
                                Message on WhatsApp
                            </a>
                        </article>
                        <article className="contact-info-item glass-card">
                            <h2>Partner With Us</h2>
                            <p>Collaborate with our creative team to build meaningful stories and impactful media experiences.</p>
                        </article>
                        <article className="contact-info-item glass-card highlight">
                            <h2>Visit Studio</h2>
                            <p>Kabeza kk 18 Ave</p>
                        </article>
                    </div>
                </section>

                <section className="contactpage-map-wrap">
                    <iframe
                        title="Flat Production location map"
                        src="https://maps.google.com/maps?q=KK%2018%20Avenue,%20Kigali,%20Rwanda&z=15&output=embed"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </section>
            </main>

            <Footer />

            {/* Custom Toast Notification */}
            <div className={`toast-notification ${showToast ? 'active' : ''}`}>
                <div className="toast-icon">✓</div>
                <div className="toast-message">
                    <h4>Inquiry Sent!</h4>
                    <p>We'll get back to you shortly.</p>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;