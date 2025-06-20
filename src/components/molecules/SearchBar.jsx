import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const SearchBar = ({ onSearch, placeholder = "Search by location, address, or features..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="relative flex items-center max-w-2xl mx-auto"
    >
      <div className="relative flex-1">
        <ApperIcon 
          name="Search" 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" 
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 text-sm border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ApperIcon name="X" className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>
      
      <Button
        type="submit"
        variant="primary"
        className="rounded-l-none px-8 py-4 shadow-sm"
      >
        <ApperIcon name="Search" className="w-5 h-5" />
        <span className="hidden sm:inline ml-2">Search</span>
      </Button>
    </motion.form>
  );
};

export default SearchBar;