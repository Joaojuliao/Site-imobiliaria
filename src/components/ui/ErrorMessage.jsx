import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

const ErrorMessage = ({ message, onRetry }) => {
    return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
            <div className="text-center max-w-md">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Ops! Algo deu errado
                </h3>
                <p className="text-gray-600 mb-6">
                    {message || 'Não foi possível carregar os dados. Por favor, tente novamente.'}
                </p>
                {onRetry && (
                    <Button onClick={onRetry} className="gap-2">
                        <RefreshCw className="h-4 w-4" />
                        Tentar Novamente
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ErrorMessage;
