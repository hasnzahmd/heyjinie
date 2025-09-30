"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFacebookF, FaLinkedinIn, FaInstagram, FaTiktok, FaTwitter } from "react-icons/fa";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactForm({ isOpen, onClose }: ContactFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-expand textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const adjustTextarea = () => {
        if (window.innerWidth <= 767) {
          textarea.style.height = "auto";
          textarea.style.height = textarea.scrollHeight + "px";
          textarea.style.width = "100%";
          return;
        }

        textarea.style.height = "auto";
        textarea.style.height = textarea.scrollHeight + "px";

        const textLength = textarea.value.length;
        if (textLength > 0) {
          const newWidth = Math.min(38 + Math.min(textLength / 2, 42), 80);
          textarea.style.width = newWidth + "rem";
        } else {
          textarea.style.width = "38rem";
        }
      };

      adjustTextarea();
      textarea.addEventListener("input", adjustTextarea);
      window.addEventListener("resize", adjustTextarea);

      return () => {
        textarea.removeEventListener("input", adjustTextarea);
        window.removeEventListener("resize", adjustTextarea);
      };
    }
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowError(false);

    try {
      const response = await fetch("https://stagingbackend.heyjinie.com/api/v1/customer/contact-us", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          message: formData.message
        })
      });

      if (response.ok) {
        setShowSuccess(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: ""
        });
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error("Error:", error);
      setShowError(true);
      
      // Auto-hide error message after 3 seconds
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.25, 0.46, 0.45, 0.94] // cubic-bezier for smooth easing
            }}
            className="fixed bottom-0 left-0 right-0 bg-green-50 rounded-t-3xl shadow-2xl z-50 max-h-[90vh] overflow-y-auto overflow-x-hidden scrollbar-hide"
          >
            {/* Close button */}
            <div className="flex justify-end p-6 pb-2">
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 18 18" fill="none">
                  <path d="M1 1L16.9999 16.9723" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M1 17L16.9999 1.0277" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="px-4 sm:px-6 pb-8">
              {/* Heading */}
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-8" style={{ color: '#06BD96' }}>
                Let&apos;s talk
              </h1>

              {/* Form */}
              <div className="max-w-2xl mx-auto">
                <AnimatePresence mode="wait">
                  {showSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ 
                        duration: 0.3, 
                        ease: [0.25, 0.46, 0.45, 0.94] 
                      }}
                      className="text-center"
                    >
                      <div className="text-2xl font-bold mb-4" style={{ color: '#06BD96' }}>Thank you for submitting the form.</div>
                      <div className="text-xl text-gray-600">We&apos;ll talk to you soon!</div>
                    </motion.div>
                  ) : showError ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ 
                        duration: 0.3, 
                        ease: [0.25, 0.46, 0.45, 0.94] 
                      }}
                      className="text-center"
                    >
                      <div className="text-xl text-red-600">Oops! Something went wrong while submitting the form.</div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        duration: 0.3, 
                        ease: [0.25, 0.46, 0.45, 0.94] 
                      }}
                      onSubmit={handleSubmit} 
                      className="space-y-6"
                    >
                      {/* Name fields */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.4, 
                          delay: 0.1,
                          ease: [0.25, 0.46, 0.45, 0.94] 
                        }}
                      >
                      <label htmlFor="firstName" className="block text-gray-700 text-lg font-medium mb-3">
                        What&apos;s your name?
                      </label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          placeholder="First Name"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="flex-1 bg-green-50 border border-green-300 rounded-xl px-4 py-3 text-gray-700 placeholder-green-500/60 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                        />
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          placeholder="Last Name"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="flex-1 bg-green-50 border border-green-300 rounded-xl px-4 py-3 text-gray-700 placeholder-green-500/60 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                        />
                        </div>
                      </motion.div>

                      {/* Email and phone fields */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.4, 
                          delay: 0.2,
                          ease: [0.25, 0.46, 0.45, 0.94] 
                        }}
                      >
                      <label htmlFor="email" className="block text-gray-700 text-lg font-medium mb-3">
                        What&apos;s your email & phone number?
                      </label>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="flex-1 bg-green-50 border border-green-300 rounded-xl px-4 py-3 text-gray-700 placeholder-green-500/60 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                        />
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          placeholder="xxxxxxxxxxx"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="flex-1 bg-green-50 border border-green-300 rounded-xl px-4 py-3 text-gray-700 placeholder-green-500/60 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                        />
                        </div>
                      </motion.div>

                      {/* Message field */}
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.4, 
                          delay: 0.3,
                          ease: [0.25, 0.46, 0.45, 0.94] 
                        }}
                      >
                      <label htmlFor="message" className="block text-gray-700 text-lg font-medium mb-3">
                        How we can help you?
                      </label>
                      <textarea
                        ref={textareaRef}
                        id="message"
                        name="message"
                        placeholder="Example Text"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-green-50 border border-green-300 rounded-xl px-4 py-3 text-gray-700 placeholder-green-500/60 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent resize-none transition-all duration-300 ease-out"
                        style={{ minHeight: "120px" }}
                      />
                      </motion.div>

                      {/* Submit button */}
                      <motion.div 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          duration: 0.4, 
                          delay: 0.4,
                          ease: [0.25, 0.46, 0.45, 0.94] 
                        }}
                        className="flex justify-center pt-4"
                      >
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-liquid border border-green-400 rounded-full px-8 py-4 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundColor: '#06BD96' }}
                      >
                        <span className="label" style={{ color: 'white' }}>
                          {isSubmitting ? "Sending..." : "Send"}
                        </span>
                        </button>
                      </motion.div>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Contact info and social media */}
                <div className="mt-12 pt-8 border-t border-green-300">
                  {/* Contact info */}
                  <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 mb-8 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-600 flex-shrink-0 md:mt-1">
                        <path fillRule="evenodd" clipRule="evenodd" d="M15.3741 12.718L19.8801 9.663C20.5811 9.189 21.0001 8.398 21.0001 7.552V7.552C21.0001 6.142 19.8581 5 18.4491 5H5.56614C4.15714 5 3.01514 6.142 3.01514 7.551V7.551C3.01514 8.397 3.43414 9.188 4.13514 9.663L8.64114 12.718C10.6741 14.096 13.3411 14.096 15.3741 12.718V12.718Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 7.55078V16.9998C3 18.6568 4.343 19.9998 6 19.9998H18C19.657 19.9998 21 18.6568 21 16.9998V7.55178" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <a href="mailto:contact@heyjinie.com?subject=heyjinie%40heyjinie.com" className="text-gray-700 hover:text-green-600 transition-colors">
                        contact@heyjinie.com
                      </a>
                    </div>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-gray-600 flex-shrink-0 md:mt-1">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      <div className="text-gray-700 text-sm">
                        <div><strong>Head Office:</strong></div>
                        <div>HMT FZE, C1-118 (f) Ajman,</div>
                        <div>Free Zone, PO BOX 16881,</div>
                        <div>United Arab Emirates.</div>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-3 md:col-start-2">
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" className="text-gray-600 flex-shrink-0 md:mt-1">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      <div className="text-gray-700 text-sm">
                        <div><strong>Regional Office:</strong></div>
                        <div>45-K Model town, Lahore, Pakistan</div>
                      </div>
                    </div>
                  </div>

                  {/* Social media icons */}
                  <div className="flex gap-4 justify-center">
                    <a href="https://www.facebook.com/heyjinieofficial/" target="_blank" rel="noopener noreferrer" className="btn-liquid w-12 h-12 bg-green-100 rounded-full flex items-center justify-center border border-green-400">
                      <FaFacebookF className="text-gray-600" />
                    </a>
                    <a href="https://www.linkedin.com/company/heyjinieofficial/" target="_blank" rel="noopener noreferrer" className="btn-liquid w-12 h-12 bg-green-100 rounded-full flex items-center justify-center border border-green-400">
                      <FaLinkedinIn className="text-gray-600" />
                    </a>
                    <a href="https://www.instagram.com/heyjinieofficial/" target="_blank" rel="noopener noreferrer" className="btn-liquid w-12 h-12 bg-green-100 rounded-full flex items-center justify-center border border-green-400">
                      <FaInstagram className="text-gray-600" />
                    </a>
                    <a href="https://www.tiktok.com/@heyjinieofficial/" target="_blank" rel="noopener noreferrer" className="btn-liquid w-12 h-12 bg-green-100 rounded-full flex items-center justify-center border border-green-400">
                      <FaTiktok className="text-gray-600" />
                    </a>
                    <a href="https://x.com/heyjinie585" target="_blank" rel="noopener noreferrer" className="btn-liquid w-12 h-12 bg-green-100 rounded-full flex items-center justify-center border border-green-400">
                      <FaTwitter className="text-gray-600" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

