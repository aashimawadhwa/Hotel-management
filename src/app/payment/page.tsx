// PaymentScreen.tsx
import React from "react";

const PaymentScreen: React.FC = () => {
  
  return (
    
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Payment Information</h2>

      {/* Payment Form */}
      <form className="max-w-md mx-auto space-y-4">
        {/* Card Number */}
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-600">
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="1234 5678 9012 3456"
          />
        </div>

        {/* Expiry and CVV */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="expiry" className="block text-sm font-medium text-gray-600">
              Expiry Date
            </label>
            <input type="text" id="expiry" className="mt-1 p-2 w-full border rounded-md" placeholder="MM/YY" />
          </div>
          <div>
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-600">
              CVV
            </label>
            <input type="text" id="cvv" className="mt-1 p-2 w-full border rounded-md" placeholder="123" />
          </div>
        </div>

        {/* Name on Card */}
        <div>
          <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-600">
            Name on Card
          </label>
          <input
            type="text"
            id="nameOnCard"
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="John Doe"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-700 focus:outline-none"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
};

export default PaymentScreen;
