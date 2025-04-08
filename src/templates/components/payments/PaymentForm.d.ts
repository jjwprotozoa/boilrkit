import React from 'react';
interface PaymentFormProps {
    amount: number;
    onSuccess: (paymentIntent: any) => void;
}
declare const PaymentForm: React.FC<PaymentFormProps>;
export default PaymentForm;
