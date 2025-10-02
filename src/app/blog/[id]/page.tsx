"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaApple, FaFacebookF, FaLinkedinIn, FaInstagram, FaTiktok, FaGift, FaBars, FaTimes, FaArrowLeft } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import ContactForm from "../../../components/ContactForm";

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

export default function BlogDetailPage() {
  const params = useParams();
  const blogId = params?.id as string;
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [blog, setBlog] = useState<{
    id: string;
    title: string;
    content: string;
    coverImageUrl: string;
    createdAt: string;
    authorName: string;
    tags?: string[];
  } | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<{
    id: string;
    title: string;
    coverImageUrl: string;
    createdAt: string;
  }[]>([]);
  const [comments, setComments] = useState<{
    id: string;
    authorName: string;
    authorEmail: string;
    content: string;
    createdAt: string;
    status: string;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentForm, setCommentForm] = useState({
    name: '',
    email: '',
    comment: ''
  });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchBlogData = async () => {
      if (!blogId || blogId === 'undefined') {
        setError('Invalid blog ID');
        setLoading(false);
        return;
      }

      try {
        // Fetch blog detail
        const blogResponse = await fetch(`https://stagingbackend.heyjinie.com/api/v1/public/blogs/${blogId}`);
        const blogData: {
          success: boolean;
          data: {
            id: string;
            title: string;
            content: string;
            coverImageUrl: string;
            createdAt: string;
            authorName: string;
            tags?: string[];
          };
        } = await blogResponse.json();
        
        if (blogData.success && blogData.data) {
          setBlog(blogData.data);
        } else {
          setError('Blog not found');
        }

        // Fetch recent blogs
        const recentResponse = await fetch('https://stagingbackend.heyjinie.com/api/v1/public/blogs');
        const recentData = await recentResponse.json();
        
        if (recentData.success && recentData.data) {
          setRecentBlogs(recentData.data.slice(0, 3));
        }

        // Fetch comments
        const commentsResponse = await fetch(`https://stagingbackend.heyjinie.com/api/v1/public/blogs/${blogId}/comments`);
        const commentsData = await commentsResponse.json();
        
        if (commentsData.success && commentsData.data) {
          setComments(commentsData.data.filter((comment: { status?: string }) => 
            comment.status === 'approved' || !comment.status
          ));
        }
      } catch {
        setError('Error loading blog');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [blogId]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingComment(true);

    try {
      // Create new comment object
      const newComment = {
        id: `comment-${Date.now()}`,
        authorName: commentForm.name,
        authorEmail: commentForm.email,
        content: commentForm.comment,
        createdAt: new Date().toISOString(),
        status: 'pending'
      };

      // Add comment to local state immediately
      setComments(prevComments => [...prevComments, newComment]);
      
      // Clear form
      setCommentForm({ name: '', email: '', comment: '' });
      
      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);

      // Try to submit to API (optional - for backend storage)
      try {
        const response = await fetch(`https://stagingbackend.heyjinie.com/api/v1/public/blogs/${blogId}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            authorName: commentForm.name,
            authorEmail: commentForm.email,
            content: commentForm.comment,
          }),
        });

        if (response.ok) {
          // Comment submitted to backend successfully
          console.log('Comment saved to backend');
        }
      } catch {
        // API error - comment is still saved locally
        console.log('Comment saved locally only');
      }

    } catch {
      alert('An error occurred. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-6">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/blog" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Container for all content */}
      <div className="max-w-6xl mx-auto">
        {/* Header - SAME AS BLOG PAGE */}
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

        {/* Back Button */}
        <div className="px-4 py-4">
          <Link href="/blog" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors">
            <FaArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>

        {/* Blog Content */}
        <div className="px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm"
                >
                  {/* Featured Image */}
                  <div className="aspect-video relative">
                    <SafeImage
                      src={blog.coverImageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'}
                      alt={blog.title || 'Blog post'}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="p-8">
                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                      {blog.title || 'Untitled Blog Post'}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
                      <span>By {blog.authorName || 'HeyJinie Team'}</span>
                      <span>•</span>
                      <span>{blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Unknown date'}</span>
                    </div>

                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {blog.tags.map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Content */}
                    <div 
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: blog.content || '<p>No content available.</p>' }}
                    />
                  </div>
                </motion.article>

                {/* Comment Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="mt-8 bg-white rounded-2xl p-8 shadow-sm"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Leave a Comment</h2>
                  
                  {showSuccessMessage && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                      ✅ Comment posted successfully! It will appear below.
                    </div>
                  )}
                  
                  <form onSubmit={handleCommentSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={commentForm.name}
                        onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-gray-900"
                      />
                      <input
                        type="email"
                        placeholder="Your Email"
                        value={commentForm.email}
                        onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-gray-900"
                      />
                    </div>
                    <textarea
                      placeholder="Your Comment..."
                      rows={5}
                      value={commentForm.comment}
                      onChange={(e) => setCommentForm({ ...commentForm, comment: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-gray-900"
                    />
                    <button
                      type="submit"
                      disabled={submittingComment}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {submittingComment ? 'Posting...' : 'Post Comment'}
                    </button>
                  </form>

                  {/* Comments List */}
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Comments ({comments.length})</h3>
                    <div className="space-y-4">
                      {comments.map((comment, index) => (
                        <div key={comment.id || index} className="border-b border-gray-200 pb-4 last:border-b-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold text-gray-900">{comment.authorName || 'Anonymous'}</span>
                            <span className="text-gray-500 text-sm">
                              • {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Unknown date'}
                            </span>
                            {comment.status === 'pending' && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                Pending
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700">{comment.content || ''}</p>
                        </div>
                      ))}
                      {comments.length === 0 && (
                        <p className="text-gray-500 italic">No comments yet. Be the first to comment!</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Sidebar - Recent Blogs */}
              <div className="lg:col-span-1">
                <motion.aside
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-white rounded-2xl p-6 shadow-sm"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Blogs</h3>
                  <div className="space-y-4">
                    {recentBlogs.length > 0 ? (
                      recentBlogs.map((recentBlog, index) => (
                        <Link
                          key={recentBlog.id || `recent-${index}`}
                          href={`/blog/${recentBlog.id}`}
                          className="block group"
                        >
                          <div className="flex gap-3">
                            <div className="w-16 h-16 relative flex-shrink-0">
                              <SafeImage
                                src={recentBlog.coverImageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=200&q=80'}
                                alt={recentBlog.title || 'Blog post'}
                                fill
                                className="object-cover rounded-lg"
                                unoptimized
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {recentBlog.title || 'Untitled'}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {recentBlog.createdAt ? new Date(recentBlog.createdAt).toLocaleDateString() : 'Unknown date'}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">No recent blogs available</p>
                    )}
                  </div>
                </motion.aside>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Modal */}
        <ContactForm isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />

        {/* Footer - SAME AS BLOG PAGE */}
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
