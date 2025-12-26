import React, { useState } from 'react';
import { MdHelpOutline, MdSearch, MdExpandMore, MdExpandLess, MdEmail, MdPhone } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { FaQuestionCircle } from 'react-icons/fa';

function SupportPage() {
  const [openFaq, setOpenFaq] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      title: 'Account & Profile',
      icon: '👤',
      faqs: [
        {
          question: 'How do I create an account?',
          answer: 'Click on the "Login" button in the top right corner, then select "Register" to create a new account. Fill in your details including name, email, and password, and you\'re all set!'
        },
        {
          question: 'How do I update my profile information?',
          answer: 'Go to your dashboard and click on "Profile Information". You can edit your name and mobile number by clicking the "Edit" button next to each field.'
        },
        {
          question: 'Can I change my email address?',
          answer: 'For security reasons, email addresses cannot be changed once registered. If you need to use a different email, please contact our support team.'
        }
      ]
    },
    {
      title: 'Orders & Shipping',
      icon: '📦',
      faqs: [
        {
          question: 'How long does shipping take?',
          answer: 'Standard shipping typically takes 3-7 business days. Express shipping options are available at checkout for faster delivery (1-3 business days).'
        },
        {
          question: 'Can I track my order?',
          answer: 'Yes! Once your order is shipped, you\'ll receive a tracking number via email. You can track your order status in the "My Orders" section of your dashboard.'
        },
        {
          question: 'What if I receive a damaged product?',
          answer: 'We\'re sorry to hear that! Please contact our support team within 48 hours of delivery with photos of the damaged item. We\'ll arrange for a replacement or refund immediately.'
        },
        {
          question: 'Can I cancel my order?',
          answer: 'You can cancel your order within 24 hours of placing it, as long as it hasn\'t been shipped yet. Go to "My Orders" and click "Cancel Order" next to the item.'
        }
      ]
    },
    {
      title: 'Payments & Refunds',
      icon: '💳',
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit/debit cards, UPI, net banking, and popular digital wallets. Cash on delivery is also available for eligible orders.'
        },
        {
          question: 'How do I get a refund?',
          answer: 'Refunds are processed automatically for cancelled orders. For returns, once we receive and verify the returned item, your refund will be processed within 5-7 business days to your original payment method.'
        },
        {
          question: 'Is my payment information secure?',
          answer: 'Absolutely! We use industry-standard encryption to protect all payment information. We never store your complete card details on our servers.'
        }
      ]
    },
    {
      title: 'Products & Shopping',
      icon: '🛍️',
      faqs: [
        {
          question: 'How do I add items to my wishlist?',
          answer: 'Simply click the heart icon on any product card or product detail page. You can view all your saved items in the "Wishlist" section of your dashboard.'
        },
        {
          question: 'Can I save multiple addresses?',
          answer: 'Yes! Go to "Manage Addresses" in your dashboard to add, edit, or delete delivery addresses. You can set one as your default address for faster checkout.'
        },
        {
          question: 'What if a product is out of stock?',
          answer: 'If a product is out of stock, you\'ll see a notification on the product page. You can click "Notify Me" to receive an email when it\'s back in stock.'
        }
      ]
    },
    {
      title: 'Returns & Exchanges',
      icon: '↩️',
      faqs: [
        {
          question: 'What is your return policy?',
          answer: 'You can return most items within 7 days of delivery for a full refund or exchange. Items must be unused, in original packaging, and with all tags attached.'
        },
        {
          question: 'How do I initiate a return?',
          answer: 'Go to "My Orders", select the order you want to return, and click "Return Item". Fill out the return form and we\'ll send you a return shipping label.'
        },
        {
          question: 'Are there any items that cannot be returned?',
          answer: 'Yes, certain items like perishables, personalized products, and items marked as "non-returnable" cannot be returned. This will be clearly indicated on the product page.'
        }
      ]
    }
  ];

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  const toggleFaq = (categoryIndex, faqIndex) => {
    const key = `${categoryIndex}-${faqIndex}`;
    setOpenFaq(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
          <MdHelpOutline className="text-blue-600 text-4xl" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          How Can We Help?
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find answers to common questions or contact our support team for assistance.
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-12">
        <div className="relative max-w-2xl mx-auto">
          <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-2xl" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help..."
            className="w-full pl-14 pr-4 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
          />
        </div>
      </div>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Link
          to="/contact"
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <MdEmail className="text-blue-600 text-3xl mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">Email Support</h3>
          <p className="text-gray-600 text-sm">Get help via email</p>
        </Link>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
          <MdPhone className="text-green-600 text-3xl mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">Phone Support</h3>
          <p className="text-gray-600 text-sm">Call us: +91 123 456 7890</p>
        </div>
        
        <Link
          to="/contact"
          className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 hover:shadow-lg transition-shadow"
        >
          <FaQuestionCircle className="text-purple-600 text-3xl mb-3" />
          <h3 className="font-bold text-gray-900 mb-2">Live Chat</h3>
          <p className="text-gray-600 text-sm">Chat with our team</p>
        </Link>
      </div>

      {/* FAQ Sections */}
      <div className="space-y-8">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No results found. Try a different search term.</p>
          </div>
        ) : (
          filteredFaqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  {category.title}
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {category.faqs.map((faq, faqIndex) => {
                  const key = `${categoryIndex}-${faqIndex}`;
                  const isOpen = openFaq[key];
                  
                  return (
                    <div key={faqIndex} className="transition-all">
                      <button
                        onClick={() => toggleFaq(categoryIndex, faqIndex)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                        {isOpen ? (
                          <MdExpandLess className="text-gray-500 text-2xl flex-shrink-0" />
                        ) : (
                          <MdExpandMore className="text-gray-500 text-2xl flex-shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-6 py-4 bg-gray-50">
                          <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Still Need Help Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Still Need Help?</h2>
        <p className="mb-6 text-blue-100">
          Can't find what you're looking for? Our support team is here to help!
        </p>
        <Link
          to="/contact"
          className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}

export default SupportPage;

