import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import EncryptedMessagingComponent from '@/components/messaging/EncryptedMessaging';

const EncryptedMessagingPage = () => {
  return (
    <MainLayout>
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-1">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Encrypted Messaging</h2>
            <p className="text-sm text-muted-foreground">
              Secure, end-to-end encrypted communications
            </p>
          </div>
        </div>
        
        <EncryptedMessagingComponent />
      </div>
    </MainLayout>
  );
};

export default EncryptedMessagingPage;
