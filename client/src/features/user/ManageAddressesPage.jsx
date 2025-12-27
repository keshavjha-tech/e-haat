import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@/api/axiosInstance';
import summaryApi from '@/api/summaryApi';
import toast from 'react-hot-toast';
import useMobile from '@/hooks/useMobile';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaHome, FaBriefcase, FaMapMarkerAlt } from 'react-icons/fa';
import { MdLocationOn, MdPhone, MdCheckCircle } from 'react-icons/md';

function ManageAddressesPage() {
  const [isMobile] = useMobile();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pinCode: '',
    country: 'India',
    mobile: '',
    addressType: 'Home',
    isDefault: false
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance({
        ...summaryApi.getAddresses
      });

      if (res?.data?.statusCode === 200) {
        setAddresses(res.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch addresses: ", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address line 1 is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.pinCode.trim()) {
      newErrors.pinCode = 'Pin code is required';
    } else if (!/^\d{6}$/.test(formData.pinCode.trim())) {
      newErrors.pinCode = 'Pin code must be 6 digits';
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required';
    }
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      
      if (editingAddress) {
        // Update address
        const res = await axiosInstance({
          ...summaryApi.updateAddress(editingAddress._id),
          data: formData
        });

        if (res?.data?.statusCode === 200) {
          toast.success("Address updated successfully");
          resetForm();
          fetchAddresses();
        }
      } else {
        // Add new address
        const res = await axiosInstance({
          ...summaryApi.addAddress,
          data: formData
        });

        if (res?.data?.statusCode === 201 || res?.data?.statusCode === 200) {
          toast.success("Address added successfully");
          resetForm();
          fetchAddresses();
        }
      }
    } catch (error) {
      console.error("Address operation failed: ", error);
      toast.error(error?.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      fullName: address.fullName || '',
      addressLine1: address.addressLine1 || '',
      addressLine2: address.addressLine2 || '',
      city: address.city || '',
      state: address.state || '',
      pinCode: address.pinCode || '',
      country: address.country || 'India',
      mobile: address.mobile || '',
      addressType: address.addressType || 'Home',
      isDefault: address.isDefault || false
    });
    setShowForm(true);
    setErrors({});
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const res = await axiosInstance({
        ...summaryApi.deleteAddress(addressId)
      });

      if (res?.data?.statusCode === 200) {
        toast.success("Address deleted successfully");
        fetchAddresses();
      }
    } catch (error) {
      console.error("Failed to delete address: ", error);
      toast.error(error?.response?.data?.message || "Failed to delete address");
    }
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pinCode: '',
      country: 'India',
      mobile: '',
      addressType: 'Home',
      isDefault: false
    });
    setEditingAddress(null);
    setShowForm(false);
    setErrors({});
  };

  const getAddressIcon = (type) => {
    switch (type) {
      case 'Home':
        return <FaHome className="text-blue-600" />;
      case 'Work':
        return <FaBriefcase className="text-green-600" />;
      default:
        return <FaMapMarkerAlt className="text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className='container mx-auto p-4'>
        <div className='flex justify-center items-center min-h-[400px]'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
            <div className='text-lg text-gray-600'>Loading addresses...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4 md:p-8 max-w-6xl'>
      {/* Mobile Header */}
      {isMobile && (
        <div className='p-4 border-b flex items-center gap-4 mb-6'>
          <button onClick={() => navigate(-1)} className='hover:text-blue-600 transition-colors'>
            <FaArrowLeft className='text-xl' />
          </button>
          <h1 className='text-xl font-bold'>Manage Addresses</h1>
        </div>
      )}

      {/* Desktop Header */}
      {!isMobile && (
        <div className='mb-8'>
          <div className='flex items-center justify-between'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900 mb-2'>Manage Addresses</h1>
              <p className='text-gray-600'>Add, edit, or remove your delivery addresses</p>
            </div>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className='flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl'
              >
                <FaPlus />
                Add New Address
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className='bg-white rounded-lg shadow-md border border-gray-200 p-6 md:p-8 mb-8'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-2xl font-bold text-gray-900'>
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h2>
            <button
              onClick={resetForm}
              className='text-gray-500 hover:text-gray-700 text-xl'
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Full Name */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Full Name <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='fullName'
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Enter full name'
                />
                {errors.fullName && (
                  <p className='text-sm text-red-500 mt-1'>{errors.fullName}</p>
                )}
              </div>

              {/* Mobile */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Mobile Number <span className='text-red-500'>*</span>
                </label>
                <input
                  type='tel'
                  name='mobile'
                  value={formData.mobile}
                  onChange={handleChange}
                  maxLength={10}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.mobile ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='10-digit mobile number'
                />
                {errors.mobile && (
                  <p className='text-sm text-red-500 mt-1'>{errors.mobile}</p>
                )}
              </div>

              {/* Address Line 1 */}
              <div className='md:col-span-2'>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Address Line 1 <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='addressLine1'
                  value={formData.addressLine1}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='House/Flat No., Building Name, Street'
                />
                {errors.addressLine1 && (
                  <p className='text-sm text-red-500 mt-1'>{errors.addressLine1}</p>
                )}
              </div>

              {/* Address Line 2 */}
              <div className='md:col-span-2'>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Address Line 2 (Optional)
                </label>
                <input
                  type='text'
                  name='addressLine2'
                  value={formData.addressLine2}
                  onChange={handleChange}
                  className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  placeholder='Area, Landmark, etc.'
                />
              </div>

              {/* City */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  City <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='city'
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Enter city'
                />
                {errors.city && (
                  <p className='text-sm text-red-500 mt-1'>{errors.city}</p>
                )}
              </div>

              {/* State */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  State <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='state'
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Enter state'
                />
                {errors.state && (
                  <p className='text-sm text-red-500 mt-1'>{errors.state}</p>
                )}
              </div>

              {/* Pin Code */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Pin Code <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='pinCode'
                  value={formData.pinCode}
                  onChange={handleChange}
                  maxLength={6}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.pinCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='6-digit pin code'
                />
                {errors.pinCode && (
                  <p className='text-sm text-red-500 mt-1'>{errors.pinCode}</p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Country <span className='text-red-500'>*</span>
                </label>
                <input
                  type='text'
                  name='country'
                  value={formData.country}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.country ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Enter country'
                />
                {errors.country && (
                  <p className='text-sm text-red-500 mt-1'>{errors.country}</p>
                )}
              </div>

              {/* Address Type */}
              <div className='md:col-span-2'>
                <label className='block text-sm font-semibold text-gray-700 mb-2'>
                  Address Type
                </label>
                <div className='flex gap-4'>
                  {['Home', 'Work', 'Other'].map((type) => (
                    <label key={type} className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='radio'
                        name='addressType'
                        value={type}
                        checked={formData.addressType === type}
                        onChange={handleChange}
                        className='w-4 h-4 text-blue-600'
                      />
                      <span className='text-gray-700'>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Default Address */}
              <div className='md:col-span-2'>
                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    name='isDefault'
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className='w-4 h-4 text-blue-600 rounded focus:ring-blue-500'
                  />
                  <span className='text-gray-700 font-medium'>Set as default address</span>
                </label>
              </div>
            </div>

            {/* Form Actions */}
            <div className='flex gap-4 pt-4'>
              <button
                type='submit'
                disabled={submitting}
                className='flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {submitting ? 'Saving...' : editingAddress ? 'Update Address' : 'Add Address'}
              </button>
              <button
                type='button'
                onClick={resetForm}
                className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors'
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Mobile Add Button */}
      {isMobile && !showForm && (
        <button
          onClick={() => setShowForm(true)}
          className='fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-10'
        >
          <FaPlus className='text-2xl' />
        </button>
      )}

      {/* Addresses List */}
      {addresses.length === 0 && !showForm ? (
        <div className='text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200'>
          <MdLocationOn className='text-6xl text-gray-400 mx-auto mb-4' />
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>No addresses yet</h2>
          <p className='text-gray-600 mb-6'>Add your first address to get started</p>
          <button
            onClick={() => setShowForm(true)}
            className='bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors'
          >
            Add Address
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {addresses.map((address) => (
            <div
              key={address._id}
              className={`bg-white rounded-lg shadow-md border-2 p-6 relative ${
                address.isDefault ? 'border-blue-500' : 'border-gray-200'
              }`}
            >
              {/* Default Badge */}
              {address.isDefault && (
                <div className='absolute top-4 right-4 flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold'>
                  <MdCheckCircle />
                  Default
                </div>
              )}

              {/* Address Type Icon */}
              <div className='flex items-center gap-3 mb-4'>
                {getAddressIcon(address.addressType)}
                <span className='font-semibold text-gray-900'>{address.addressType}</span>
              </div>

              {/* Address Details */}
              <div className='space-y-2 mb-4'>
                <p className='font-semibold text-gray-900'>{address.fullName}</p>
                <p className='text-gray-600 flex items-start gap-2'>
                  <MdLocationOn className='text-gray-400 mt-1 flex-shrink-0' />
                  <span>
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                  </span>
                </p>
                <p className='text-gray-600'>
                  {address.city}, {address.state} - {address.pinCode}
                </p>
                <p className='text-gray-600'>{address.country}</p>
                <p className='text-gray-600 flex items-center gap-2'>
                  <MdPhone className='text-gray-400' />
                  {address.mobile}
                </p>
              </div>

              {/* Actions */}
              <div className='flex gap-3 pt-4 border-t border-gray-200'>
                <button
                  onClick={() => handleEdit(address)}
                  className='flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors'
                >
                  <FaEdit />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(address._id)}
                  className='flex items-center justify-center gap-2 px-4 py-2 border border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-colors'
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ManageAddressesPage;

