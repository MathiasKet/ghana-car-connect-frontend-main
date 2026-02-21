/**
 * SMS Service for CarConnect Ghana
 * This service handles sending SMS notifications to users.
 * In production, this would integrate with a provider like Twilio, Hubtel, or Arkesel.
 */

class SMSService {
    private static instance: SMSService;
    private isDevelopment = import.meta.env.DEV;

    static getInstance(): SMSService {
        if (!SMSService.instance) {
            SMSService.instance = new SMSService();
        }
        return SMSService.instance;
    }

    /**
     * Send an SMS notification
     * @param phone The recipient's phone number in international format (+233...)
     * @param message The message content
     */
    async sendSMS(phone: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
        console.log(`[SMS Service] To: ${phone}, Message: ${message}`);

        if (this.isDevelopment) {
            // Mock successful send in development
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        messageId: `mock_${Date.now()}`
                    });
                }, 1000);
            });
        }

        try {
            // Logic for production SMS provider would go here
            // Example:
            // const response = await fetch('https://api.sms-provider.com/v1/send', {
            //   method: 'POST',
            //   body: JSON.stringify({ to: phone, message, ... })
            // });

            return { success: true, messageId: `msg_${Date.now()}` };
        } catch (error: any) {
            console.error('SMS sending failed:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Send inquiry notification to seller
     */
    async sendInquiryNotification(sellerPhone: string, buyerName: string, carModel: string) {
        const message = `CarConnect Ghana: You have a new inquiry on your ${carModel} from ${buyerName}. Check your inbox for details!`;
        return this.sendSMS(sellerPhone, message);
    }

    /**
     * Send payment confirmation to user
     */
    async sendPaymentConfirmation(phone: string, amount: number, reference: string) {
        const message = `CarConnect Ghana: Payment of GHS ${amount} confirmed (Ref: ${reference}). Your listing is now active!`;
        return this.sendSMS(phone, message);
    }
}

export default SMSService.getInstance();
