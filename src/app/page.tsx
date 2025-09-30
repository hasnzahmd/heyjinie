"use client";
import Image from "next/image";
import { FaApple, FaGooglePlay, FaFacebookF, FaLinkedinIn, FaInstagram, FaTiktok, FaGift, FaBars, FaTimes } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import ContactForm from "../components/ContactForm";

export default function Home() {
  // Reusable animation variants
  const sectionReveal = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }
    }
  };

  // Elegant slide from left
  const slideInLeft = {
    hidden: { opacity: 0, x: -30 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }
    }
  };

  // Elegant slide from right
  const slideInRight = {
    hidden: { opacity: 0, x: 30 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }
    }
  };

  // Playful scale and rotate
  const scaleRotate = {
    hidden: { opacity: 0, scale: 0.9 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const }
    }
  };

  // Elegant rise with slight bounce
  const elegantRise = {
    hidden: { opacity: 0, y: 25 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94] as const
      }
    }
  };

  // Classy perspective flip
  const perspectiveFlip = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const }
    }
  };

  const containerStagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } }
  };
  const [activeStep, setActiveStep] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Navigation functions for mobile arrows
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  const goToPrevStep = () => {
    setSlideDirection('left');
    setActiveStep(activeStep > 0 ? activeStep - 1 : 2);
  };

  const goToNextStep = () => {
    setSlideDirection('right');
    setActiveStep(activeStep < 2 ? activeStep + 1 : 0);
  };

  // Minimum distance for a swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeStep < 2) {
      setSlideDirection('right');
      setActiveStep(activeStep + 1);
    }
    if (isRightSwipe && activeStep > 0) {
      setSlideDirection('left');
      setActiveStep(activeStep - 1);
    }
  };

  useEffect(() => {
    const updateScrollProgress = () => {
      // Only enable scroll-based step changes on desktop (lg screens and up)
      if (window.innerWidth < 1024) return;

      const scrollTop = window.scrollY;

      // Get the sticky sections container
      const stickyContainer = document.querySelector('[data-sticky-sections]');
      if (stickyContainer) {
        const rect = stickyContainer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Check if section is in view
        const sectionInView = rect.top <= viewportHeight && rect.bottom >= 0;

        if (sectionInView) {
          // Calculate progress through the section (0 to 1)
          const sectionTop = rect.top + scrollTop;
          const sectionHeight = rect.height;
          const sectionProgress = Math.max(0, Math.min(1, (scrollTop - sectionTop) / sectionHeight));

          // Determine active step based on scroll progress
          // Each step takes 1/3 of the section
          let newStep = 0;
          if (sectionProgress >= 0.66) {
            newStep = 2; // Redeem
          } else if (sectionProgress >= 0.33) {
            newStep = 1; // Send
          } else {
            newStep = 0; // Browse
          }

          // Only update if the step actually changed
          if (newStep !== activeStep) {
            setActiveStep(newStep);
          }
        } else {
          // Section not in view, reset to first step
          if (activeStep !== 0) {
            setActiveStep(0);
          }
        }
      }
    };

    window.addEventListener('scroll', updateScrollProgress);
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, [activeStep]);

  return (
    <div className="min-h-screen bg-white">
      {/* Main Container for all content */}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white pt-4 pb-1 sm:pb-2">
          <header className="bg-white rounded-2xl mx-2 lg:mx-0 px-6 py-4 flex items-center justify-between shadow-sm border border-gray-100 relative z-40">
            {/* Logo */}
            <div className="flex items-center">
              <Image
                src="/logo-1.png"
                alt="HeyJinie Logo"
                width={150}
                height={70}
                className="w-[120px] h-auto md:w-[150px]"
              />
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="https://heyjinie.com/hey-jinie-business.html" className="text-gray-600 hover:text-gray-800 transition-colors link-underline">HeyJinie Business</a>
              <button onClick={() => setIsContactOpen(true)} className="text-gray-600 hover:text-gray-800 transition-colors link-underline">Contact us</button>
              <a href="https://heyjinie.com/blog.html" className="text-gray-600 hover:text-gray-800 transition-colors link-underline">Blog</a>
            </nav>

            {/* App Download Icons */}
            <div className="hidden lg:flex items-center gap-3">
              <a href="https://apps.apple.com/us/app/heyjinie" target="_blank" rel="noopener noreferrer" className="btn-liquid bg-white border border-gray-300 rounded-full px-4 py-2 flex items-center gap-2">
                <FaApple className="text-black w-5 h-5" />
                <span className="label text-gray-700 text-sm font-medium">App Store</span>
              </a>
              <a href="https://play.google.com/store/apps/heyjinie" target="_blank" rel="noopener noreferrer" className="btn-liquid bg-white border border-gray-300 rounded-full px-4 py-2 flex items-center gap-2">
                <Image src="/googleplay.png" alt="Google Play" width={16} height={16} className="w-4 h-4 object-contain" />
                <span className="label text-gray-700 text-sm font-medium">Google Play</span>
              </a>
            </div>

            {/* Mobile Menu Toggle + Start Gifting */}
            <div className="flex items-center gap-2">
              <button
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                className="md:hidden w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-700"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
              <a href="https://webapp.heyjinie.com/auth" className="btn-liquid bg-white border border-gray-300 rounded-full px-4 py-2 flex items-center gap-2">
                <FaGift className="text-gray-700" />
                <span className="label text-gray-700 text-sm font-medium">Start Gifting</span>
              </a>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
              <div className="absolute md:hidden top-full left-4 right-4 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 z-50">
                <div className="flex flex-col gap-3">
                  <a onClick={() => setIsMenuOpen(false)} href="https://heyjinie.com/hey-jinie-business.html" className="text-gray-700 hover:text-gray-900 transition-colors">HeyJinie Business</a>
                  <button onClick={() => { setIsMenuOpen(false); setIsContactOpen(true); }} className="text-gray-700 hover:text-gray-900 transition-colors text-left">Contact us</button>
                  <a onClick={() => setIsMenuOpen(false)} href="https://heyjinie.com/blog.html" className="text-gray-700 hover:text-gray-900 transition-colors">Blog</a>
                  <div className="h-px bg-gray-200 my-2" />
                  <div className="flex items-center gap-3">
                    <a href="https://apps.apple.com/us/app/heyjinie" target="_blank" rel="noopener noreferrer" className="btn-liquid bg-white border border-gray-300 rounded-full px-4 py-2 flex items-center gap-2 w-full justify-center">
                      <FaApple className="text-black w-5 h-5" />
                      <span className="label text-gray-700 text-sm font-medium">App Store</span>
                    </a>
                    <a href="https://play.google.com/store/apps/heyjinie" target="_blank" rel="noopener noreferrer" className="btn-liquid bg-white border border-gray-300 rounded-full px-4 py-2 flex items-center gap-2 w-full justify-center">
                      <Image src="/googleplay.png" alt="Google Play" width={16} height={16} className="w-4 h-4 object-contain" />
                      <span className="label text-gray-700 text-sm font-medium">Google Play</span>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </header>
        </div>

        {/* Hero Section */}
        <motion.main
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative px-4 py-8 md:py-16 z-10"
        >
          {/* Background Image - Behind everything in hero section */}
          <div className="absolute inset-0 z-0 w-full">
            <Image
              src="/bgbanner.png"
              alt="Hero Background"
              fill
              className="object-cover rounded-2xl"
            />
          </div>

          {/* Floating Gift Items */}
          <div className="absolute inset-0 pointer-events-none z-30">
            {/* Top left */}
            <div className="absolute left-0 xxs:left-4 top-28 xxs:top-52 sm:top-6 lg:top-16 lg:left-5 transform rotate-12 animate-float">
              <Image
                src="/Blue.png"
                alt="Blue Gift Box"
                width={200}
                height={200}
                className="lg:size-40 size-18 xxs:size-28 object-contain"
              />
            </div>

            {/* Top right */}
            <div className="absolute right-0 xxs:right-4 top-28 xxs:top-52 sm:top-6 lg:top-16 lg:right-5 transform rotate-12 animate-float2">
              <Image
                src="/Green.png"
                alt="Green Gift Box"
                width={200}
                height={200}
                className="lg:size-40 size-18 xxs:size-28 object-contain"
              />
            </div>

            {/* Middle right */}
            <div className="absolute top-108 right-0 xs:right-6 lg:top-128 lg:right-20 transform rotate-6 animate-float3">
              <Image
                src="/Sambas.png"
                alt="Sneaker"
                width={180}
                height={100}
                className="lg:size-40 size-22 xxs:size-28 object-contain"
              />
            </div>

            {/* Bottom left */}
            <div className="absolute top-108 left-0 xs:left-6 lg:top-128 lg:left-20 transform -rotate-8 animate-float">
              <Image
                src="/Headphones.png"
                alt="Headphones"
                width={140}
                height={140}
                className="lg:size-40 size-22 xxs:size-28 object-contain"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black mb-6 leading-tight">
              Effortless Shopping,<br />
              Endless Possibilities...
            </h1>

            <p className="text-lg md:text-xl text-black mb-8 max-w-2xl mx-auto">
              With Heyjinie, you can send real, fun gifts from your chat anytime, anywhere.
            </p>

            {/* App Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <motion.a
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ y: 0, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                href="https://apps.apple.com/us/app/heyjinie"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-liquid bg-white border border-gray-300 rounded-full px-6 py-3 flex items-center gap-3"
              >
                <FaApple className="text-black w-6 h-6" />
                <span className="label text-gray-700 font-medium">App Store</span>
              </motion.a>
              <motion.a
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ y: 0, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                href="https://play.google.com/store/apps/heyjinie"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-liquid bg-white border border-gray-300 rounded-full px-6 py-3 flex items-center gap-3"
              >
                <Image src="/googleplay.png" alt="Google Play" width={20} height={20} className="w-5 h-5 object-contain" />
                <span className="label text-gray-700 font-medium">Google Play</span>
              </motion.a>
            </div>
          </div>

          {/* Phone Mockup - Positioned at bottom, barely covering buttons */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-85 xxs:translate-y-100 xs:translate-y-115 sm:translate-y-120 md:translate-y-140 z-20">
            <Image
              src="/phone-1.png"
              alt="HeyJinie App on Phone"
              width={300}
              height={600}
              className="w-64 h-auto md:w-80 object-contain"
            />
          </div>
        </motion.main>

        {/* Second Section - Heyjinie Stickers */}
        <motion.section
          variants={elegantRise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="min-h-screen flex flex-col items-center justify-center px-4 pt-104 xxs:pt-120 xs:pt-135 sm:pt-140 md:pt-160"
        >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center max-w-4xl"
        >
          {/* Three Product Circles */}
          <div className="flex justify-center items-center gap-6 mb-6">
            {/* Foundation Circle */}
            <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center">
              <Image
                src="/001.png"
                alt="Foundation Bottle"
                width={40}
                height={40}
                className="w-8 h-8 object-contain"
              />
            </div>

            {/* Baseball Cap Circle */}
            <div className="w-16 h-16 bg-pink-200 rounded-full flex items-center justify-center">
              <Image
                src="/002.png"
                alt="Baseball Cap"
                width={40}
                height={40}
                className="w-8 h-8 object-contain"
              />
            </div>

            {/* Sandals Circle */}
            <div className="w-16 h-16 bg-yellow-200 rounded-full flex items-center justify-center">
              <Image
                src="/003.png"
                alt="Sandals"
                width={40}
                height={40}
                className="w-8 h-8 object-contain"
              />
            </div>
          </div>

          {/* Main Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-3xl font-bold text-black mb-1">
            Heyjinie Stickers = Real Surprises
          </h2>

          {/* Descriptive Text */}
          <div className="text-base md:text-sm text-black max-w-2xl mx-auto">
            <p className="mb-1">These aren&apos;t just cute stickers.</p>
            <p>They come with real products you or your friends can tap and claim instantly whether you&apos;re sharing a moment or treating yourself.</p>
          </div>
        </motion.div>
      </motion.section>

        {/* Third Section - Gifts for Every Occasion */}
        <motion.section
          variants={perspectiveFlip}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="px-4 mt-20 py-0 mb-20"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center text-center md:text-left">
            {/* Left Side - Text Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">
                Gifts for Every<br />Occasion
              </h2>
              <p className="text-lg text-black leading-relaxed">
                From birthdays to &quot;just because&quot; or even a little something for yourself.
                Explore our huge collection of fun and useful products ready to send, share, or shop in seconds.
              </p>
            </div>

            {/* Right Side - Sticker Grid */}
            <div className="flex justify-center md:justify-end">
              <Image
                src="/work-s.png"
                alt="Gifts Grid - Various Occasion Stickers"
                width={500}
                height={400}
                className="w-full max-w-md h-auto object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </motion.section>

        {/* Fourth Section - Celebrate, No Matter the Distance */}
        <div
          className="relative min-h-screen flex items-center justify-center px-4 py-8"
        >
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/bgbanner.png"
            alt="Background Pattern"
            fill
            className="object-cover rounded-2xl"
          />
        </div>

        {/* Floating Stickers */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
          {/* Top Left - Cheeseburger */}
          <div className="absolute hidden lg:block top-42 left-16 lg:top-28 lg:left-56 transform rotate-12 animate-float">
            <Image
              src="/01.png"
              alt="Cheeseburger"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>

          {/* Top Center-Left - Backpack */}
          <div className="absolute top-44 left-32 lg:top-22 lg:left-116 transform -rotate-6 animate-float2">
            <Image
              src="/02.png"
              alt="Backpack"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>

          {/* Top Center - High Heels */}
          <div className="absolute top-46 left-2/3 lg:top-28 lg:left-1/2 transform -translate-x-1/2 rotate-8 animate-float3">
            <Image
              src="/03.png"
              alt="High Heels"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>

          {/* Top Right - Hoodie */}
          <div className="absolute hidden lg:block top-22 right-4 lg:top-22 lg:right-116 transform -rotate-12 animate-float">
            <Image
              src="/04.png"
              alt="Hoodie"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>

          {/* Top Far Right - Iced Coffee */}
          <div className="absolute hidden lg:block lg:top-28 lg:right-56 transform rotate-6 animate-float2">
            <Image
              src="/05.png"
              alt="Iced Coffee"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>

          {/* Mid-Left - Fast Food Tray */}
          <div className="absolute top-52 left-2 lg:top-1/3 lg:left-32 transform -rotate-12 animate-float3">
            <Image
              src="/06.png"
              alt="Fast Food Tray"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>

          {/* Mid-Center-Left - Running Shoe */}
          <div className="absolute top-86 left-2 lg:top-76 lg:left-1/5 transform rotate-8 animate-float">
            <Image
              src="/07.png"
              alt="Running Shoe"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>

          {/* Mid-Center-Right - Perfume */}
          <div className="absolute top-52 right-2 lg:top-1/2 lg:right-1/6 transform -rotate-6 animate-float2">
            <Image
              src="/08.png"
              alt="Perfume"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>

          {/* Mid-Right - Red Bull */}
          <div className="absolute top-86 right-2 lg:top-1/3 lg:right-32 transform rotate-12 animate-float3">
            <Image
              src="/09.png"
              alt="Red Bull"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>

          {/* Bottom Left - Sneaker */}
          <div className="absolute bottom-48 left-2 lg:bottom-32 lg:left-28 transform -rotate-8 animate-float2">
            <Image
              src="/10.png"
              alt="Sneaker"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>

          {/* Bottom Center-Left */}
          <div className="absolute bottom-44 left-32 lg:bottom-28 lg:left-1/4 transform rotate-6 animate-float">
            <Image
              src="/11.png"
              alt="Cheeseburger"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>

          {/* Bottom Center */}
          <div className="absolute bottom-42 left-2/3 lg:bottom-16 lg:left-1/2 transform -translate-x-1/2 -rotate-12 animate-float3">
            <Image
              src="/01.png"
              alt="Backpack"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>

          {/* Bottom Center-Right */}
          <div className="absolute bottom-50 right-2 lg:bottom-28 lg:right-1/4 transform rotate-8 animate-float">
            <Image
              src="/02.png"
              alt="High Heels"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>

          {/* Bottom Right */}
          <div className="absolute hidden lg:block lg:bottom-28 lg:right-28 transform -rotate-6 animate-float2">
            <Image
              src="/03.png"
              alt="Hoodie"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>
        </div>

          {/* Main Content */}
          <div className="relative z-10 text-center">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-4 leading-tight">
              Celebrate, No Matter the<br />Distance
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto">
              Near or far, you can still make someone smile or lift your own mood.
            </p>
          </div>
        </div>

        {/* Fifth Section - Send real product stickers instantly */}
        <motion.section
          variants={slideInRight}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="px-4 py-20"
        >
          <div className="text-center">
            {/* Headline */}
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-3">
              Send real product stickers instantly
            </h2>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-600 mb-4">
              right from your keyboard inside your favorite messenger app
            </p>

          {/* Feature Blocks */}
          <motion.div
            variants={containerStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="flex justify-center gap-2"
          >
            {/* Block 1 - Search */}
            <motion.div
              variants={fadeUp}
              className="bg-white border border-gray-200 rounded-2xl w-24 h-24 flex items-center justify-center"
            >
              <Image
                src="/0001.png"
                alt="Search for products"
                width={80}
                height={80}
                className="w-24 h-24 object-contain"
              />
            </motion.div>

            {/* Block 2 - Discover */}
            <motion.div
              variants={fadeUp}
              className="bg-white border border-gray-200 rounded-2xl w-24 h-24 flex items-center justify-center"
            >
              <Image
                src="/0002.png"
                alt="Discover products"
                width={80}
                height={80}
                className="w-24 h-24 object-contain"
              />
            </motion.div>

            {/* Block 3 - Keyboard */}
            <motion.div
              variants={fadeUp}
              className="bg-white border border-gray-200 rounded-2xl w-24 h-24 flex items-center justify-center"
            >
              <Image
                src="/0003.png"
                alt="Send from keyboard"
                width={80}
                height={80}
                className="w-24 h-24 object-contain"
              />
            </motion.div>

            {/* Block 4 - Receive */}
            <motion.div
              variants={fadeUp}
              className="bg-white border border-gray-200 rounded-2xl w-24 h-24 flex items-center justify-center"
            >
              <Image
                src="/0004.png"
                alt="Receive real products"
                width={80}
                height={80}
                className="w-24 h-24 object-contain"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

        {/* Sixth Section - Send Smiles Anywhere */}
        <motion.section
          variants={perspectiveFlip}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="px-4 py-0 overflow-hidden relative backdrop-blur-sm"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%)'
          }}
        >
        <div className="flex">
          <div className="animate-scroll whitespace-nowrap text-4xl md:text-5xl font-bold text-gray-700">
            <span className="mr-12">SEND SMILES • ANYWHERE</span>
            <span className="mr-12">SEND SMILES • ANYWHERE</span>
            <span className="mr-12">SEND SMILES • ANYWHERE</span>
            <span className="mr-12">SEND SMILES • ANYWHERE</span>
            <span className="mr-12">SEND SMILES • ANYWHERE</span>
            <span className="mr-12">SEND SMILES • ANYWHERE</span>
            <span className="mr-12">SEND SMILES • ANYWHERE</span>
            <span className="mr-12">SEND SMILES • ANYWHERE</span>
          </div>
          <div className="animate-scroll whitespace-nowrap text-4xl md:text-5xl font-bold text-gray-700">
            <span className="mr-12">SEND SMILES • ANYWHERE</span>
            <span className="mr-12">SEND SMILES • ANYWHERE</span>
            <span className="mr-12">SEND SMILES • ANYWHERE</span>
            <span className="mr-12">SEND SMILES • ANYWHERE</span>
            <span className="mr-12">SEND SMILES • ANYWHERE</span>
            <span className="mr-12">SEND SMILES • ANYWHERE</span>
            <span className="mr-12">SEND SMILES • ANYWHERE</span>
            <span className="mr-12">SEND SMILES • ANYWHERE</span>
          </div>
        </div>
      </motion.section>

        {/* Seventh Section - How it works */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
          data-sticky-sections
          className="px-4 py-8 lg:min-h-[400vh]"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
        <div className="lg:sticky lg:top-2 lg:min-h-screen space-y-16 lg:space-y-0">
          {/* Content Container */}
          <div className="lg:absolute lg:inset-0">
            {/* Mobile Layout - All Steps Visible */}
            <div className="lg:hidden space-y-12">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">How it works</p>
                <h2 className="text-4xl font-bold text-black mb-6 leading-tight">
                  Choose How<br />you gift
                </h2>
              </div>

              {/* Step 1 - Browse & Discover */}
              <div className="text-center space-y-6">
                <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center mx-auto">
                  <Image
                    src="/Discover.png"
                    alt="Browse"
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-black">Browse & Discover</h3>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  Explore our curated collection of real products and find the perfect gift for your loved ones.
                </p>
                <div className="flex justify-center">
                  <Image
                    src="/Browse-1.png"
                    alt="Browse Products"
                    width={400}
                    height={300}
                    className="w-80 h-auto object-contain"
                  />
                </div>
              </div>

              {/* Step 2 - Send & Share */}
              <div className="text-center space-y-6">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mx-auto">
                  <Image
                    src="/Send.png"
                    alt="Send"
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-black">Send & Share</h3>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  Send your chosen gift instantly with a personalized message and watch their reaction in real-time.
                </p>
                <div className="flex justify-center">
                  <Image
                    src="/Send-2.png"
                    alt="Send Gift"
                    width={400}
                    height={300}
                    className="w-80 h-auto object-contain"
                  />
                </div>
              </div>

              {/* Step 3 - Redeem & Enjoy */}
              <div className="text-center space-y-6">
                <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mx-auto">
                  <Image
                    src="/Redeem.png"
                    alt="Redeem"
                    width={24}
                    height={24}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <h3 className="text-2xl font-bold text-black">Redeem & Enjoy</h3>
                <p className="text-lg text-gray-600 max-w-md mx-auto">
                  Your recipient can redeem the physical product and enjoy the surprise you&apos;ve sent them.
                </p>
                <div className="flex justify-center">
                  <Image
                    src="/Redeem-3.png"
                    alt="Redeem Products"
                    width={400}
                    height={300}
                    className="w-80 h-auto object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Desktop Layout - Side by Side */}
            <div className="hidden lg:flex lg:min-h-full lg:flex-row lg:space-x-20">
              <div className="flex-1 flex items-center">
                <div className="space-y-3 px-4 text-left">
                  <p className="text-sm text-gray-600 mb-2">How it works</p>
                  <h2 className="text-4xl md:text-5xl font-bold text-black mb-6 leading-tight">
                    Choose How<br />you gift
                  </h2>
                  <div className="flex gap-4 mb-6 justify-start">
                    <button
                      onClick={() => setActiveStep(0)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${activeStep === 0 ? 'bg-pink-200' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                      <Image
                        src="/Discover.png"
                        alt="Browse"
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain"
                      />
                    </button>
                    <button
                      onClick={() => setActiveStep(1)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${activeStep === 1 ? 'bg-blue-200' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                      <Image
                        src="/Send.png"
                        alt="Send"
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain"
                      />
                    </button>
                    <button
                      onClick={() => setActiveStep(2)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${activeStep === 2 ? 'bg-yellow-200' : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                      <Image
                        src="/Redeem.png"
                        alt="Redeem"
                        width={24}
                        height={24}
                        className="w-6 h-6 object-contain"
                      />
                    </button>
                  </div>
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="space-y-4"
                  >
                    <h3 className="text-2xl font-bold text-black">
                      {activeStep === 0 && "Browse & Discover"}
                      {activeStep === 1 && "Send & Share"}
                      {activeStep === 2 && "Redeem & Enjoy"}
                    </h3>
                    <p className="text-lg text-gray-600">
                      {activeStep === 0 && "Explore our curated collection of real products and find the perfect gift for your loved ones."}
                      {activeStep === 1 && "Send your chosen gift instantly with a personalized message and watch their reaction in real-time."}
                      {activeStep === 2 && "Your recipient can redeem the physical product and enjoy the surprise you've sent them."}
                    </p>
                  </motion.div>
                </div>
              </div>
              <div className="flex-1 flex items-center">
                <motion.div
                  key={`image-${activeStep}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="w-full flex justify-center"
                >
                  <Image
                    src={activeStep === 0 ? "/Browse-1.png" : activeStep === 1 ? "/Send-2.png" : "/Redeem-3.png"}
                    alt={activeStep === 0 ? "Browse Products" : activeStep === 1 ? "Send Gift" : "Redeem Products"}
                    width={400}
                    height={300}
                    className="w-80 h-auto object-contain"
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

        {/* Eighth Section - Deal of the Day & Event Calendar */}
        <motion.section
          variants={elegantRise}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="px-4 py-0 mb-20"
        >
          <div className="grid md:grid-cols-2 gap-8 text-center md:text-left">
            {/* Deal of the Day Card */}
            <div className="bg-gray-50 rounded-2xl p-8">
              {/* Image */}
              <div className="mb-6">
                <Image
                  src="/b1.png"
                  alt="Deal of the Day"
                  width={600}
                  height={400}
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Title and Description */}
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 leading-tight text-center">
                Deal of the Day
              </h2>
              <p className="text-lg text-black leading-relaxed text-center">
                A new surprise every day! Check out today&apos;s top pick fun, fresh, and perfect whether you&apos;re sending it or adding it to your own collection.
              </p>
            </div>

            {/* Event Calendar Card */}
            <div className="bg-gray-50 rounded-2xl p-8">
              {/* Image */}
              <div className="mb-6">
                <Image
                  src="/b3.png"
                  alt="Event Calendar"
                  width={600}
                  height={400}
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Title and Description */}
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-4 leading-tight text-center">
                Event Calendar
              </h2>
              <p className="text-lg text-black leading-relaxed text-center">
                Never miss a reason to celebrate. Keep track of all the big (and small) days that matter and stay ready to shop, share, or connect with perfect timing.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Make Every Occasion Memorable Section */}
        <motion.section
          variants={slideInLeft}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-0 mb-20"
        >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/bgbanner.png"
            alt="Background"
            fill
            className="object-cover rounded-2xl"
          />
        </div>

        {/* Floating Product Stickers */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
          {/* Top Left - Fast Food Meal */}
          <div className="absolute top-48 left-4 lg:top-22 lg:left-36 transform rotate-12 animate-float">
            <Image
              src="/01.png"
              alt="Fast Food Meal"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>

          {/* Top Center-Left - Hoodie */}
          <div className="absolute top-48 left-32 lg:top-26 lg:left-96 transform -rotate-6 animate-float2">
            <Image
              src="/02.png"
              alt="Hoodie"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>

          {/* Top Center - Nike Sneaker */}
          <div className="absolute top-48 left-64 lg:top-22 lg:left-1/2 transform -translate-x-1/2 rotate-8 animate-float3">
            <Image
              src="/03.png"
              alt="Nike Sneaker"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>

          {/* Top Center-Right - Gift Box */}
          <div className="absolute top-48 right-4 lg:top-24 lg:right-1/4 transform -rotate-12 animate-float">
            <Image
              src="/04.png"
              alt="Gift Box"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>

          {/* Top Right - Iced Coffee */}
          <div className="absolute hidden lg:block lg:top-22 lg:right-32 transform rotate-6 animate-float2">
            <Image
              src="/05.png"
              alt="Iced Coffee"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>

          {/* Mid-Left - Perfume */}
          <div className="absolute hidden lg:block lg:top-86 lg:left-96 transform -rotate-8 animate-float3">
            <Image
              src="/06.png"
              alt="Perfume"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>

          {/* Mid-Right - Cheeseburger */}
          <div className="absolute hidden lg:block lg:top-86 lg:right-96 transform -rotate-6 animate-float">
            <Image
              src="/09.png"
              alt="Cheeseburger"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>

          {/* Bottom Left - Backpack */}
          <div className="absolute bottom-48 left-4 lg:bottom-32 lg:left-48 transform rotate-8 animate-float2">
            <Image
              src="/10.png"
              alt="Backpack"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>

          {/* Bottom Center-Left - White Sneaker */}
          <div className="absolute bottom-48 left-32 lg:bottom-8 lg:left-1/4 transform -rotate-6 animate-float">
            <Image
              src="/11.png"
              alt="White Sneaker"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>

          {/* Bottom Center */}
          <div className="absolute bottom-48 left-64 lg:bottom-22 lg:left-1/2 transform -translate-x-1/2 rotate-12 animate-float3">
            <Image
              src="/01.png"
              alt="Fast Food Meal"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>

          {/* Bottom Center-Right */}
          <div className="absolute bottom-48 right-4 lg:bottom-8 lg:right-1/4 transform -rotate-8 animate-float">
            <Image
              src="/02.png"
              alt="Hoodie"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>

          {/* Bottom Right */}
          <div className="absolute hidden lg:block lg:bottom-32 lg:right-48 transform rotate-6 animate-float2">
            <Image
              src="/03.png"
              alt="Nike Sneaker"
              width={256}
              height={256}
              className="w-24 h-24 lg:w-32 lg:h-32 object-contain"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-20 text-center px-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Make Every Occasion memorable with
          </h2>

          {/* Logo */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <Image
              src="/logoicons.png"
              alt="Elephant Logo"
              width={120}
              height={120}
              className=""
            />
            <span className="text-4xl md:text-5xl lg:text-6xl font-bold" style={{ color: '#FD9399' }}>HeyJinie</span>
          </div>
        </div>
      </motion.section>

        {/* Section - Make Every Moment Personalized */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true }}
          className="relative min-h-screen flex items-center justify-center px-4 py-8"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/bgbanner.png"
              alt="Background Pattern"
              fill
              className="object-cover rounded-2xl"
            />
          </div>

          <div className="relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 flex flex-col items-center md:items-start text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
                Make Every Moment<br />Personalized
              </h1>

              {/* Bullet Points */}
              <div className="space-y-4">
                <div className="md:flex md:items-start md:gap-3">
                  <span className="hidden md:inline text-lg flex-shrink-0 text-gray-700 leading-7">•</span>
                  <p className="text-lg text-black leading-7">Products that feel just right.</p>
                </div>

                <div className="md:flex md:items-start md:gap-3">
                  <span className="hidden md:inline text-lg flex-shrink-0 text-gray-700 leading-7">•</span>
                  <p className="text-lg text-black leading-7">
                    With Heyjinie, every gesture becomes meaningful whether it&apos;s a thoughtful message for someone else or a vibe that fits your own mood.
                  </p>
                </div>

                <div className="md:flex md:items-start md:gap-3">
                  <span className="hidden md:inline text-lg flex-shrink-0 text-gray-700 leading-7">•</span>
                  <p className="text-lg text-black leading-7">Personalized templates and designs make every interaction special.</p>
                </div>
              </div>

              {/* App Download Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <a href="https://apps.apple.com/us/app/heyjinie" target="_blank" rel="noopener noreferrer" className="btn-liquid bg-white border border-gray-300 rounded-full px-6 py-3 flex items-center gap-3">
                  <FaApple className="text-black w-6 h-6" />
                  <span className="label text-gray-700 font-medium">App Store</span>
                </a>
                <a href="https://play.google.com/store/apps/heyjinie" target="_blank" rel="noopener noreferrer" className="btn-liquid bg-white border border-gray-300 rounded-full px-6 py-3 flex items-center gap-3">
                  <Image src="/googleplay.png" alt="Google Play" width={20} height={20} className="w-5 h-5 object-contain" />
                  <span className="label text-gray-700 font-medium">Google Play</span>
                </a>
              </div>

              {/* Availability Text */}
              <p className="text-gray-600 underline">Available for free</p>
            </div>

            {/* Right Phone Mockup */}
            <div className="flex justify-center md:justify-end">
              <Image
                src="/V1.png"
                alt="Personalized Phone Mockup"
                width={300}
                height={600}
                className="w-64 h-auto md:w-80 object-contain"
              />
            </div>
          </div>
        </div>
      </motion.section>

        {/* Contact Form Modal */}
        <ContactForm isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

        {/* Footer */}
        <footer className="px-4 py-16 mt-20 bg-[#88C1FD] rounded-t-2xl">
          {/* Stay Connected Section */}
          <div className="bg-white rounded-2xl p-8 mb-8 text-center md:text-left">
            <h2 className="text-2xl font-bold text-black mb-6">Stay Connected</h2>
            <div className="flex flex-col md:flex-row items-center md:items-center justify-center md:justify-between gap-6">
              {/* Logo and Contact */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
                <Image
                  src="/logo-1.png"
                  alt="HeyJinie Logo"
                  width={150}
                  height={70}
                  className=""
                />
                <a href="mailto:contact@heyjinie.com" className="text-green-600 font-medium link-underline">
                  contact@heyjinie.com
                </a>
              </div>

              {/* App Download Icons */}
              <div className="flex items-center gap-3">
                <a href="https://apps.apple.com/us/app/heyjinie" target="_blank" rel="noopener noreferrer" className="btn-liquid bg-white border border-gray-300 rounded-full px-4 py-2 flex items-center gap-2">
                  <FaApple className="text-black w-5 h-5" />
                  <span className="label text-gray-700 text-sm font-medium">App Store</span>
                </a>
                <a href="https://play.google.com/store/apps/heyjinie" target="_blank" rel="noopener noreferrer" className="btn-liquid bg-white border border-gray-300 rounded-full px-4 py-2 flex items-center gap-2">
                  <Image src="/googleplay.png" alt="Google Play" width={16} height={16} className="w-4 h-4 object-contain" />
                  <span className="label text-gray-700 text-sm font-medium">Google Play</span>
                </a>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Left Side - Address */}
            <div className="space-y-8 text-center md:text-left">
              <div>
                <h3 className="font-semibold text-white text-lg mb-4">Address</h3>
                <div className="text-white space-y-6">
                  {/* Head Office */}
                  <div>
                    <div className="md:flex md:items-start md:gap-3 md:justify-start">
                      <span className="hidden md:inline text-white text-sm mt-1 flex-shrink-0">📍</span>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Head Office</h4>
                        <p className="text-sm leading-relaxed">
                          Corporate Head Office: HMT FZE, C1-118 (f) Ajman, Free Zone, PO BOX 16881, United Arab Emirates.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Regional Office */}
                  <div>
                    <div className="md:flex md:items-start md:gap-3 md:justify-start">
                      <span className="hidden md:inline text-white text-sm mt-1 flex-shrink-0">📍</span>
                      <div>
                        <h4 className="font-semibold text-white mb-2">Regional Office</h4>
                        <p className="text-sm leading-relaxed">
                          45-K Model town, Lahore, Pakistan
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Navigation Links and Social Media */}
            <div className="space-y-8 text-center md:text-left">
              {/* Navigation Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="space-y-4">
                  <a href="https://heyjinie.com/hey-jinie-business.html" className="block text-white/90 hover:text-white transition-colors link-underline">HeyJinie Business</a>
                  <button onClick={() => setIsContactOpen(true)} className="block text-white/90 hover:text-white transition-colors link-underline w-full text-center md:text-left">Contact us</button>
                  <a href="https://heyjinie.com/blog.html" className="block text-white/90 hover:text-white transition-colors link-underline">Blog</a>
                </div>
                <div className="space-y-4">
                  <a href="https://webapp.heyjinie.com/privacy-policy" className="block text-white/90 hover:text-white transition-colors link-underline">Privacy Policy</a>
                  <a href="https://webapp.heyjinie.com/return-policy" className="block text-white/90 hover:text-white transition-colors link-underline">Return Policy</a>
                  <a href="https://webapp.heyjinie.com/terms-conditions" className="block text-white/90 hover:text-white transition-colors link-underline">Terms & Conditions</a>
                </div>
              </div>

              {/* Social Media Icons */}
              <div className="flex gap-4 justify-center md:justify-start">
                <a href="https://www.facebook.com/heyjinieofficial/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="social-icon w-10 h-10 border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:bg-opacity-20 transition-colors">
                  <FaFacebookF className="text-white" />
                </a>
                <a href="https://www.linkedin.com/company/heyjinieofficial/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="social-icon w-10 h-10 border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:bg-opacity-20 transition-colors">
                  <FaLinkedinIn className="text-white" />
                </a>
                <a href="https://www.instagram.com/heyjinieofficial/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="social-icon w-10 h-10 border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:bg-opacity-20 transition-colors">
                  <FaInstagram className="text-white" />
                </a>
                <a href="https://www.tiktok.com/@heyjinieofficial/" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="social-icon w-10 h-10 border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:bg-opacity-20 transition-colors">
                  <FaTiktok className="text-white" />
                </a>
                <a href="https://x.com/heyjinie585" target="_blank" rel="noopener noreferrer" aria-label="X" className="social-icon w-10 h-10 border-2 border-white rounded-full flex items-center justify-center hover:bg-white hover:bg-opacity-20 transition-colors">
                  <FaXTwitter className="text-white" />
                </a>
              </div>
            </div>
          </div>

            {/* Bottom Copyright & Attribution */}
            <div className="border-t border-white/20 pt-4">
              <p className="text-white/70 text-sm text-center">©{new Date().getFullYear()} HeyJinie. Created by Stack Studios</p>
            </div>
          </footer>
        </div>
      </div>
    );
  }
