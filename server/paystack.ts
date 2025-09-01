
import Paystack from 'paystack-node';

// Initialize Paystack with your secret key
const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY || '');

export interface PaymentData {
  email: string;
  amount: number; // Amount in kobo (multiply by 100)
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, any>;
}

export interface PaymentVerification {
  status: boolean;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    amount: number;
    message: string | null;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Record<string, any>;
    log: any;
    fees: number | null;
    fees_split: any | null;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string | null;
    };
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      customer_code: string;
      phone: string;
      metadata: Record<string, any>;
      risk_action: string;
      international_format_phone: string | null;
    };
    plan: any;
    split: any;
    order_id: any;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data: any;
    source: any;
    fees_breakdown: any;
  };
}

export class PaystackService {
  // Initialize payment transaction
  static async initializePayment(paymentData: PaymentData) {
    try {
      const response = await paystack.transaction.initialize({
        email: paymentData.email,
        amount: paymentData.amount,
        reference: paymentData.reference,
        callback_url: paymentData.callback_url,
        metadata: paymentData.metadata,
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error('Paystack initialization error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment initialization failed',
      };
    }
  }

  // Verify payment transaction
  static async verifyPayment(reference: string): Promise<PaymentVerification | null> {
    try {
      const response = await paystack.transaction.verify(reference);
      return response;
    } catch (error) {
      console.error('Paystack verification error:', error);
      return null;
    }
  }

  // Generate payment reference
  static generateReference(): string {
    return `ref_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }
}
