// types/paystack.d.ts

declare module '@paystack/inline-js' {
  interface CustomField {
    display_name: string;
    variable_name: string;
    value: string;
  }

  interface TransactionMetadata {
    custom_fields: CustomField[];
    [key: string]: any;
  }

  interface TransactionOptions {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    ref?: string;
    metadata?: TransactionMetadata;
    onSuccess?: (response: { reference: string; [key: string]: any }) => void;
    onCancel?: () => void;
    [key: string]: any;
  }

  export default class PaystackPop {
    constructor();
    newTransaction(options: TransactionOptions): void;
  }
}