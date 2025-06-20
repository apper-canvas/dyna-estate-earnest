import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';

const AgentContactCard = ({ agent }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\d\s\-\(\)\+]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Message sent to ${agent.name}! They'll get back to you soon.`);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    window.location.href = `tel:${agent.phone}`;
  };

  const handleEmail = () => {
    window.location.href = `mailto:${agent.email}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-lg shadow-card p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Agent</h3>
      
      {/* Agent Info */}
      <div className="flex items-start space-x-4 mb-6">
        <div className="flex-shrink-0">
          <img
            src={agent.photo}
            alt={agent.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-100"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900 mb-1">{agent.name}</h4>
          <p className="text-sm text-gray-600 mb-1">{agent.company}</p>
          <p className="text-xs text-gray-500 mb-2">{agent.license}</p>
          
          <div className="flex space-x-2">
            <button
              onClick={handleCall}
              className="flex items-center px-2 py-1 text-xs bg-accent/10 text-accent rounded hover:bg-accent/20 transition-colors"
            >
              <ApperIcon name="Phone" className="w-3 h-3 mr-1" />
              Call
            </button>
            <button
              onClick={handleEmail}
              className="flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              <ApperIcon name="Mail" className="w-3 h-3 mr-1" />
              Email
            </button>
          </div>
        </div>
      </div>

      {/* Quick Message Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={errors.name ? 'border-error' : ''}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-error">{errors.name}</p>
          )}
        </div>

        <div>
          <Input
            type="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={errors.email ? 'border-error' : ''}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-error">{errors.email}</p>
          )}
        </div>

        <div>
          <Input
            type="tel"
            placeholder="Your Phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={errors.phone ? 'border-error' : ''}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-error">{errors.phone}</p>
          )}
        </div>

        <div>
          <textarea
            placeholder="I'm interested in this property..."
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            rows={3}
            className={`
              w-full px-3 py-2 text-sm border rounded-lg bg-white transition-colors
              focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent
              ${errors.message ? 'border-error' : 'border-gray-300 hover:border-gray-400'}
            `}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-error">{errors.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          loading={loading}
        >
          <ApperIcon name="Send" className="w-4 h-4 mr-2" />
          Send Message
        </Button>
      </form>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{agent.phone}</span>
          <span>{agent.email}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default AgentContactCard;