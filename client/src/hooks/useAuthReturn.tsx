import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useAuthReturn = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Only run this effect when user becomes authenticated
    if (isAuthenticated) {
      const pendingPurchase = localStorage.getItem('pendingPurchase');
      
      if (pendingPurchase) {
        try {
          const planContext = JSON.parse(pendingPurchase);
          
          // Check if we're on the same page they were trying to purchase from
          if (planContext.returnUrl === window.location.pathname + window.location.search) {
            // Clear the pending purchase context
            localStorage.removeItem('pendingPurchase');
            
            // Show a toast or notification that they can now proceed with payment
            // The PaystackPayment component will automatically show the payment form
            // since the user is now authenticated
          } else {
            // Redirect them back to the plan they were trying to purchase
            navigate(planContext.returnUrl);
          }
        } catch (error) {
          console.error('Error parsing pending purchase context:', error);
          localStorage.removeItem('pendingPurchase');
        }
      }
    }
  }, [isAuthenticated, navigate]);
};
