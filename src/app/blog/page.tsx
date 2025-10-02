"use client";
import Image from "next/image";
import Link from "next/link";
import { FaApple, FaFacebookF, FaLinkedinIn, FaInstagram, FaTiktok, FaGift, FaBars, FaTimes } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ContactForm from "../../components/ContactForm";

// Image component with error handling
const SafeImage = ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => {
  const [imgSrc, setImgSrc] = useState(src);
  
  const handleError = () => {
    setImgSrc('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80');
  };

  return (
    <Image
      {...props}
      src={imgSrc}
      alt={alt}
      onError={handleError}
    />
  );
};

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface BlogPost {
  id?: string;
  _id?: string;
  title: string;
  content: string;
  coverImageUrl: string;
  tags: string[];
  createdAt: string;
  authorName: string;
}

export default function BlogPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Animation variants
  const containerStagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } }
  };

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('https://stagingbackend.heyjinie.com/api/v1/public/blogs');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.data) {
          // Check if blogs have IDs, if not, generate them
          const blogsWithIds = data.data.map((blog: BlogPost, index: number) => ({
            ...blog,
            id: blog.id || blog._id || `blog-${index}` || `generated-${Date.now()}-${index}`
          }));
          
          setBlogs(blogsWithIds);
        } else {
          setError('Failed to load blogs');
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError(`Error loading blogs: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Main Container for all content */}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white pt-4 pb-1 sm:pb-2">
          <header className="bg-white rounded-2xl mx-2 lg:mx-0 px-6 py-4 flex items-center justify-between shadow-sm border border-gray-100 relative z-40">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/">
                <Image
                  src="/logo-1.png"
                  alt="HeyJinie Logo"
                  width={150}
                  height={70}
                  className="w-[120px] h-auto md:w-[150px]"
                />
              </Link>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/business" className="text-gray-600 hover:text-gray-800 transition-colors link-underline">HeyJinie Business</Link>
              <button onClick={() => setIsContactOpen(true)} className="text-gray-600 hover:text-gray-800 transition-colors link-underline">Contact us</button>
              <Link href="/blog" className="text-gray-600 hover:text-gray-800 transition-colors link-underline">Blog</Link>
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
              <Link onClick={() => setIsMenuOpen(false)} href="/business" className="text-gray-700 hover:text-gray-900 transition-colors">HeyJinie Business</Link>
              <button onClick={() => { setIsMenuOpen(false); setIsContactOpen(true); }} className="text-gray-700 hover:text-gray-900 transition-colors text-left">Contact us</button>
              <Link onClick={() => setIsMenuOpen(false)} href="/blog" className="text-gray-700 hover:text-gray-900 transition-colors">Blog</Link>
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

        {/* Blog Content */}
        <div className="px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">Blog</h1>
              <p className="text-lg text-gray-600">Discover insights, tips, and stories from the HeyJinie community</p>
            </motion.div>

            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-4 text-gray-600">Loading blogs...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && (
              <motion.div
                variants={containerStagger}
                initial="hidden"
                animate="show"
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {blogs.map((blog, index) => (
                  <motion.div
                    key={blog.id || `blog-${index}`}
                    variants={fadeUp}
                    className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
                  >
                    <Link href={`/blog/${blog.id}`}>
                      <div className="aspect-video relative">
                        <SafeImage
                          src={blog.coverImageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'}
                          alt={blog.title || 'Blog post'}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex flex-wrap gap-2 mb-3">
                          {blog.tags?.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {blog.content?.replace(/<[^>]*>/g, '').substring(0, 120)}...
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{blog.authorName || 'HeyJinie Team'}</span>
                          <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {!loading && !error && blogs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No blog posts available at the moment.</p>
              </div>
            )}
          </div>
        </div>

        {/* Contact Form Modal */}
        <ContactForm isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

        {/* Footer */}
        <footer className="px-4 py-16 mt-20 bg-[#88C1FD] rounded-t-2xl">
          {/* Stay Connected Section */}
          <div className="bg-white rounded-2xl p-8 mb-8 text-center md:text-left">
            <h2 className="text-xl md:text-2xl font-bold text-black mb-6">Stay Connected</h2>
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
                <h3 className="font-semibold text-white text-base md:text-lg mb-4">Address</h3>
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
              <Link href="/business" className="block text-white/90 hover:text-white transition-colors link-underline">HeyJinie Business</Link>
              <button onClick={() => setIsContactOpen(true)} className="block text-white/90 hover:text-white transition-colors link-underline w-full text-center md:text-left">Contact us</button>
              <Link href="/blog" className="block text-white/90 hover:text-white transition-colors link-underline">Blog</Link>
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
            <p className="text-white/70 text-sm text-center">©2024 HeyJinie. Created by Stack Studios</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
