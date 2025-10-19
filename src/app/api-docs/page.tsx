'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center p-8">Loading API Documentation...</div>
});

// Import SwaggerUI CSS
import 'swagger-ui-react/swagger-ui.css';

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              ClipCommerce API Documentation
            </h1>
            <p className="text-lg text-gray-600">
              Complete API reference for developers
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <SwaggerUI
          url="/api/swagger.json"
          docExpansion="list"
          defaultModelsExpandDepth={2}
          defaultModelExpandDepth={2}
          tryItOutEnabled={true}
          supportedSubmitMethods={['get', 'post', 'put', 'delete', 'patch']}
          requestInterceptor={(request) => {
            // Add authentication header if available
            const token = localStorage.getItem('auth-token');
            if (token) {
              request.headers.Authorization = `Bearer ${token}`;
            }
            return request;
          }}
          responseInterceptor={(response) => {
            // Handle responses
            return response;
          }}
        />
      </div>
    </div>
  );
}
