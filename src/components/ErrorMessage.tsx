import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
    {message}
  </div>
);

export default ErrorMessage;