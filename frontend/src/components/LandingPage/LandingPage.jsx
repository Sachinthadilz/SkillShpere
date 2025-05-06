import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMyContext } from "../../store/ContextApi";

const LandingPage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { token } = useMyContext();

  // Handle scroll for navbar effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Stats counter animation
  const [counts, setCounts] = useState({ users: 0, skills: 0, courses: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCounts((prev) => ({
        users: prev.users >= 10000 ? 10000 : prev.users + 250,
        skills: prev.skills >= 5000 ? 5000 : prev.skills + 125,
        courses: prev.courses >= 1200 ? 1200 : prev.courses + 30,
      }));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "UX Designer",
      image: "https://i.pravatar.cc/150?img=1",
      text: "SkillSphere helped me level up my design skills and connect with amazing mentors in my field.",
    },
    {
      name: "David Kim",
      role: "Full Stack Developer",
      image: "https://i.pravatar.cc/150?img=4",
      text: "The structured learning paths made it easy to pick up new programming languages on my schedule.",
    },
    {
      name: "Maya Patel",
      role: "Marketing Specialist",
      image: "https://i.pravatar.cc/150?img=5",
      text: "I've gained valuable skills and built an incredible network of professionals through this platform.",
    },
  ];

  // Feature items with added icons
  const features = [
    {
      title: "Skill Sharing",
      desc: "Post your skills with short videos, images, and tips. Get feedback from experts around the world.",
      icon: "💫",
    },
    {
      title: "Learning Progress",
      desc: "Track your learning journey with interactive dashboards and inspire others with your growth.",
      icon: "📈",
    },
    {
      title: "Structured Plans",
      desc: "Create, share, and follow structured learning plans designed by industry professionals.",
      icon: "🗂️",
    },
    {
      title: "Community Challenges",
      desc: "Participate in weekly challenges to test your skills and learn from peers.",
      icon: "🏆",
    },
    {
      title: "Expert Feedback",
      desc: "Receive constructive feedback from professionals and improve faster.",
      icon: "🔍",
    },
    {
      title: "Live Workshops",
      desc: "Join scheduled virtual workshops and interact with instructors in real-time.",
      icon: "🔴",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Hero Section with animated background */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-6 pt-16 pb-20 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          <div className="absolute inset-0 opacity-20 dark:opacity-10">
            <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="a" gradientTransform="rotate(40)">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#A855F7" />
                </linearGradient>
              </defs>
              <path
                d="M0,1000 C300,800 400,600 500,300 C600,100 700,50 1000,0 L1000,1000 Z"
                fill="url(#a)"
              />
            </svg>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl relative z-10"
        >
          <span className="inline-block text-sm font-semibold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-4 py-1 rounded-full mb-4">
            Launching New Coding Paths
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6 leading-tight">
            Learn any skill. <br className="hidden sm:block" />
            <span className="text-gray-800 dark:text-white">
              Share your journey.
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto">
            The all-in-one platform to learn, teach, and connect with a global
            community of skill enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-12">
            {token ? (
              // Show Explore button for logged-in users
              <Link to="/explore">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/30 text-white font-semibold px-12 py-4 rounded-xl transition-all text-lg flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                  Explore
                </motion.button>
              </Link>
            ) : (
              // Show Get Started and Watch Demo buttons for logged-out users
              <>
                <Link to="/signup">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-500/30 text-white font-semibold px-8 py-4 rounded-xl transition-all text-lg"
                  >
                    Get Started Now
                  </motion.button>
                </Link>
                <Link to="/demo">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-indigo-500 hover:border-purple-600 text-indigo-600 dark:text-indigo-400 font-semibold px-8 py-4 rounded-xl transition-all flex items-center justify-center text-lg"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Watch Demo
                  </motion.button>
                </Link>
              </>
            )}
          </div>

          {/* Trust indicators */}
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              TRUSTED BY TEAMS AT
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              {["Google", "Microsoft", "Adobe", "Shopify", "Slack"].map(
                (company, i) => (
                  <span
                    key={i}
                    className="text-gray-400 dark:text-gray-500 font-semibold"
                  >
                    {company}
                  </span>
                )
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white dark:bg-gray-900 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                label: "Active Users",
                value: counts.users.toLocaleString(),
                icon: "👥",
              },
              {
                label: "Skills Shared",
                value: counts.skills.toLocaleString(),
                icon: "✨",
              },
              {
                label: "Learning Paths",
                value: counts.courses.toLocaleString(),
                icon: "🧭",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                  {stat.value}
                </p>
                <p className="text-gray-600 dark:text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Everything You Need to Master New Skills
            </motion.h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our platform provides all the tools you need to learn effectively
              and connect with others on the same journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 dark:border-gray-700 group hover:border-indigo-200 dark:hover:border-indigo-800"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              What Our Members Say
            </motion.h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join thousands of satisfied members who are advancing their
              careers and personal growth.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  "{testimonial.text}"
                </p>
                <div className="mt-4 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4"
            >
              How SkillSphere Works
            </motion.h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our simple three-step process to begin your skill development
              journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Your Profile",
                desc: "Sign up and build your profile with your existing skills and learning goals.",
              },
              {
                step: "02",
                title: "Discover Learning Paths",
                desc: "Browse curated learning paths or create your own custom skill development journey.",
              },
              {
                step: "03",
                title: "Learn & Share Progress",
                desc: "Track your progress, share achievements, and connect with others in your learning community.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="text-7xl font-bold text-indigo-100 dark:text-indigo-900 absolute -top-10 left-0">
                  {step.step}
                </div>
                <div className="pt-8 pl-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Ready to transform your skills and expand your network?
            </h2>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              Join thousands of learners who are achieving their personal and
              professional goals with SkillSphere.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {token ? (
                // For logged-in users
                <Link to="/explore">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-indigo-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-gray-50 transition-all"
                  >
                    Explore
                  </motion.button>
                </Link>
              ) : (
                // For logged-out users
                <>
                  <Link to="/signup">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-white text-indigo-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-gray-50 transition-all"
                    >
                      Get Started Now
                    </motion.button>
                  </Link>
                  <Link to="/pricing">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all"
                    >
                      View Plans
                    </motion.button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
