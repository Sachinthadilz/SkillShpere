import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const AboutUs = () => {
  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      bio: "Former education tech director with 10+ years experience in digital learning platforms.",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      bio: "Ex-Google engineer with a passion for building tools that connect people and knowledge.",
    },
    {
      name: "Priya Sharma",
      role: "Head of Content",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
      bio: "Curriculum developer with expertise in creating engaging learning experiences.",
    },
    {
      name: "David Wilson",
      role: "Director of Community",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      bio: "Community builder who specializes in fostering collaborative learning environments.",
    },
  ];

  const values = [
    {
      title: "Accessibility",
      description: "Education should be accessible to everyone, regardless of background or location.",
      icon: "🌐",
    },
    {
      title: "Excellence",
      description: "We're committed to providing the highest quality learning resources and experiences.",
      icon: "⭐",
    },
    {
      title: "Community",
      description: "Learning is enhanced through connection, support, and diverse perspectives.",
      icon: "👥",
    },
    {
      title: "Innovation",
      description: "We continuously evolve our platform to meet learners' changing needs.",
      icon: "💡",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/20 -z-10">
          <div className="absolute inset-0 opacity-20 dark:opacity-10">
            <svg className="h-full w-full" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 0 10 L 40 10 M 10 0 L 10 40" fill="none" stroke="currentColor" strokeOpacity="0.3" />
                </pattern>
              </defs>
              <rect width="800" height="800" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="inline-block text-sm font-semibold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-4 py-1 rounded-full mb-4">
              Our Mission
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Empowering Skills Development for Everyone
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              We're building a global community where everyone can learn, share, and grow together through shared knowledge and skills.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Our Story</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  SkillSphere began with a simple question: Why is it so hard to learn practical skills online? Our founders, tired of fragmented tutorials and theoretical courses, envisioned a platform where people could learn by doing and connecting.
                </p>
                <p>
                  Founded in 2022, we've grown from a small team with big dreams to a thriving community of learners and educators. Our platform has evolved based on feedback from our users, always focused on creating meaningful learning experiences.
                </p>
                <p>
                  Today, SkillSphere connects thousands of skill enthusiasts across the globe, enabling them to learn from each other and grow together. We believe in the power of community-driven education and continue to build tools that make skill development accessible, engaging, and effective.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg -z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3"
                alt="Team collaboration"
                className="w-full h-auto rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-purple-100 dark:bg-purple-900/30 rounded-lg -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block text-sm font-semibold bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 px-4 py-1 rounded-full mb-4">
              What We Stand For
            </span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              These principles guide everything we do as we build a platform for skills development and community learning.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="inline-block text-sm font-semibold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 px-4 py-1 rounded-full mb-4">
              Meet Our Team
            </span>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">The People Behind SkillSphere</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Our diverse team brings together expertise in education, technology, and community building.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden group"
              >
                <div className="h-64 overflow-hidden">
                  <img
                    src={`${member.image}?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80`}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-400">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us CTA Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Join Us on This Journey
            </h2>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              We're building the future of skills development and we'd love for you to be part of it. Join our community today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-indigo-600 font-bold px-8 py-4 rounded-xl shadow-lg hover:bg-gray-50 transition-all"
                >
                  Join SkillSphere
                </motion.button>
              </Link>
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-xl hover:bg-white/10 transition-all"
                >
                  Contact Us
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;