
// Paystack service using direct HTTP API calls
// Based on official Paystack API documentation: https://api.paystack.co/transaction/initialize

export interface PaymentData {
  email: string;
  amount: number; // Amount in kobo (multiply by 100)
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, any>;
  planId?: string;
  packageType?: string;
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
  private static readonly PAYSTACK_BASE_URL = 'https://api.paystack.co';
  private static readonly SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

  // Initialize payment transaction
  static async initializePayment(paymentData: PaymentData) {
    try {
      console.log('=== PAYSTACK SERVICE DEBUG ===');
      console.log('PAYSTACK_SECRET_KEY exists:', !!this.SECRET_KEY);
      console.log('PAYSTACK_SECRET_KEY length:', this.SECRET_KEY?.length || 0);
      console.log('Payment data received:', paymentData);
      
      // Check if Paystack is properly configured
      if (!this.SECRET_KEY) {
        throw new Error('PAYSTACK_SECRET_KEY not configured. Please set your Paystack secret key in .env file');
      }

      console.log('Using real Paystack API...');
      console.log('Making request to:', `${this.PAYSTACK_BASE_URL}/transaction/initialize`);
      
      const response = await fetch(`${this.PAYSTACK_BASE_URL}/transaction/initialize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: paymentData.email,
          amount: paymentData.amount,
          reference: paymentData.reference,
          callback_url: paymentData.callback_url,
          metadata: paymentData.metadata,
        }),
      });

      console.log('Paystack API response status:', response.status);
      console.log('Paystack API response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Paystack API error response:', errorText);
        throw new Error(`Paystack API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Paystack API response data:', responseData);

      if (!responseData.status) {
        throw new Error(`Paystack API returned error: ${responseData.message || 'Unknown error'}`);
      }

      return {
        success: true,
        data: responseData.data,
      };
    } catch (error) {
      console.error('Paystack initialization error:', error);
      console.error('Error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      throw error;
    }
  }

  // Verify payment transaction
  static async verifyPayment(reference: string): Promise<PaymentVerification | null> {
    try {
      console.log('=== PAYSTACK VERIFICATION DEBUG ===');
      console.log('Verifying payment with reference:', reference);
      console.log('PAYSTACK_SECRET_KEY exists:', !!this.SECRET_KEY);
      
      if (!reference || reference.trim() === '') {
        throw new Error('Payment reference is required and cannot be empty');
      }
      
      // Check if Paystack is properly configured
      if (!this.SECRET_KEY) {
        throw new Error('PAYSTACK_SECRET_KEY not configured. Please set your Paystack secret key in .env file');
      }

      console.log('Making verification request to:', `${this.PAYSTACK_BASE_URL}/transaction/verify/${reference}`);
      
      const response = await fetch(`${this.PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Paystack verification response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Paystack verification error response:', errorText);
        throw new Error(`Paystack verification error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Paystack verification response data:', responseData);

      if (!responseData.status) {
        console.log('Paystack API returned status false:', responseData.message);
        throw new Error(`Paystack verification returned error: ${responseData.message || 'Unknown error'}`);
      }

      // Additional validation for successful payments
      if (responseData.data && responseData.data.status !== 'success') {
        console.log('Payment status is not success:', responseData.data.status);
        throw new Error(`Payment not successful. Status: ${responseData.data.status}`);
      }

      console.log('Payment verification successful');
      return responseData;
    } catch (error) {
      console.error('Paystack verification error:', error);
      throw error;
    }
  }

  // Generate payment reference
  static generateReference(): string {
    return `ref_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }
}
