import React from 'react';
import { MdShoppingBag, MdPeople, MdLocalShipping, MdSecurity, MdStar } from 'react-icons/md';
import { FaAward, FaHandshake } from 'react-icons/fa';

function AboutPage() {
  const features = [
    {
      icon: <MdShoppingBag className="text-4xl" />,
      title: 'Wide Product Range',
      description: 'Thousands of products across multiple categories to meet all your needs.'
    },
    {
      icon: <MdLocalShipping className="text-4xl" />,
      title: 'Fast Delivery',
      description: 'Quick and reliable shipping to get your orders to you as fast as possible.'
    },
    {
      icon: <MdSecurity className="text-4xl" />,
      title: 'Secure Shopping',
      description: 'Your data and payments are protected with industry-leading security measures.'
    },
    {
      icon: <MdStar className="text-4xl" />,
      title: 'Quality Products',
      description: 'We partner with trusted sellers to ensure you get only the best quality items.'
    },
    {
      icon: <FaHandshake className="text-4xl" />,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We\'re here to help whenever you need us.'
    },
    {
      icon: <FaAward className="text-4xl" />,
      title: 'Best Prices',
      description: 'Competitive pricing and regular deals to give you the best value for your money.'
    }
  ];

  const stats = [
    { number: '100K+', label: 'Happy Customers' },
    { number: '50K+', label: 'Products' },
    { number: '500+', label: 'Sellers' },
    { number: '99%', label: 'Satisfaction Rate' }
  ];

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mb-6 shadow-lg">
          <MdShoppingBag className="text-white text-5xl" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">eHaat</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Your trusted online marketplace connecting buyers and sellers across India. 
          We're committed to making online shopping simple, secure, and enjoyable for everyone.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 text-center border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
              {stat.number}
            </div>
            <div className="text-gray-600 font-medium">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Our Story */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-8 md:p-12 mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            eHaat was founded with a simple mission: to create an online marketplace that truly serves 
            both buyers and sellers. We started as a small team passionate about e-commerce and technology, 
            and we've grown into a platform trusted by thousands of customers and hundreds of sellers.
          </p>
          <p>
            Our journey began when we noticed that many online marketplaces were either too complex for 
            sellers or didn't offer enough value to buyers. We set out to change that by building a 
            platform that's easy to use, secure, and focused on creating great experiences for everyone.
          </p>
          <p>
            Today, eHaat continues to evolve, adding new features and improving our services based on 
            feedback from our community. We're proud of what we've built and excited about what's to come.
          </p>
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <MdPeople className="text-blue-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Customer First</h3>
            <p className="text-gray-600">
              Every decision we make is guided by what's best for our customers. Your satisfaction is our success.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <FaHandshake className="text-green-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Integrity</h3>
            <p className="text-gray-600">
              We believe in doing business honestly and transparently. Trust is the foundation of everything we do.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 text-center hover:shadow-lg transition-shadow">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <MdStar className="text-purple-600 text-2xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Excellence</h3>
            <p className="text-gray-600">
              We're committed to continuous improvement and delivering the best possible experience to our users.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Why Choose eHaat?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-all hover:border-blue-300"
            >
              <div className="text-blue-600 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white rounded-lg shadow-md p-8 md:p-12 border border-gray-200">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">Our Team</h2>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          eHaat is built and maintained by a dedicated team of developers, designers, and support staff 
          who are passionate about creating the best online shopping experience.
        </p>
        <div className="text-center">
          <p className="text-gray-700 font-medium">
            Created by <span className="font-bold text-blue-600">Keshav Jha</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            © 2025 E-Haat Group. All rights reserved.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 md:p-12 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the eHaat Community</h2>
        <p className="text-blue-100 mb-6 text-lg max-w-2xl mx-auto">
          Whether you're looking to shop or sell, we'd love to have you as part of our growing community.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Start Shopping
          </a>
          <a
            href="/contact"
            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;

