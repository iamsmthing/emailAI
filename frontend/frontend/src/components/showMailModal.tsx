// components/ShowMailModal.tsx
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';

interface ShowMailModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: any;
}

const ShowMailModal: React.FC<ShowMailModalProps> = ({ isOpen, onClose, email }) => {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    console.log(email)
    setHtmlContent('');
    if (!email) return;

    let base64Data = email.parts?.[1]?.body?.data;

    if (base64Data) {
      try {
        // Fix for URL-safe Base64 (replace `-` with `+` and `_` with `/`)
        base64Data = base64Data.replace(/-/g, '+').replace(/_/g, '/');

        // Add padding if necessary
        while (base64Data.length % 4 !== 0) {
          base64Data += '=';
        }

        // Decode the Base64 string using `atob`
        const decoded = atob(base64Data);
        setHtmlContent(decoded);
      } catch (error) {
        console.error("Error decoding Base64 data:", error);
      }
    }
  }, [email]);

  if (!email) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{email.subject}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
        
        <div className="">
          <div
            style={{
              height: '60vh', // Adjust height as needed
              overflowY: 'auto',   // Enable vertical scrolling
              padding: '1rem',
              border: '1px solid #ccc', // Optional styling for better visibility
              borderRadius: '5px',
              maxWidth:'100%'
            }}
          >
            {email.source=='Outlook'?<div dangerouslySetInnerHTML={{ __html: email.parts }} />:
            
           email.parts === undefined ?  <div dangerouslySetInnerHTML={{ __html: email.snippet }} /> : <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            }
          </div>
        </div>
      </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};

export default ShowMailModal;
