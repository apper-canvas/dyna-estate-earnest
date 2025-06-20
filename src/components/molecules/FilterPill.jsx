import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const FilterPill = ({ label, onRemove, variant = 'default' }) => {
  const variants = {
    default: 'bg-surface-100 text-gray-700 border-gray-200',
    primary: 'bg-primary/10 text-primary border-primary/20',
    accent: 'bg-accent/10 text-accent border-accent/20'
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
        border transition-all duration-200 hover:shadow-sm
        ${variants[variant]}
      `}
    >
      <span>{label}</span>
      <button
        onClick={onRemove}
        className="p-0.5 hover:bg-black/10 rounded-full transition-colors"
      >
        <ApperIcon name="X" className="w-3 h-3" />
      </button>
    </motion.div>
  );
};

export default FilterPill;