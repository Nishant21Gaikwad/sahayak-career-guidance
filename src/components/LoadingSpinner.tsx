import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mx-auto mb-4"
        >
          <GraduationCap className="h-12 w-12 text-primary" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg text-muted-foreground"
        >
          Loading Sahayak...
        </motion.p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
