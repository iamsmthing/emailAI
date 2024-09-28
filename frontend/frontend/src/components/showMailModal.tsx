// components/ShowMailModal.tsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import  { useEffect, useState } from 'react';
import decode from 'decode-base64';
interface ShowMailModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: any;
}

const ShowMailModal: React.FC<ShowMailModalProps> = ({ isOpen, onClose, email }) => {
    
  if (!email) return null;
  const [htmlContent, setHtmlContent] = useState('');
  console.log(email);

  useEffect(() => {
    const base64Data=email.parts[1].body?.data;
    console.log(base64Data);
    const cleanedBase64 = base64Data.replace(/\s/g, '');

      // Check if the Base64 string is valid
      if (!/^[A-Za-z0-9+/]+={0,2}$/.test(cleanedBase64)) {
        throw new Error('Invalid Base64 string');
      }
    
    // Decode the Base64 string
    const decoded = decode(cleanedBase64);
    
    // Convert Uint8Array to a string
    const decodedString = new TextDecoder().decode(decoded);
    
    // Set the decoded HTML content
    setHtmlContent(decodedString);
  }, [email]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{email.subject}</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          {/* <p><strong>From:</strong> {email.author}</p>
          <p><strong>Date:</strong> {new Date(email.date).toLocaleDateString()}</p>
          <p><strong>Snippet:</strong> {email.snippet}</p> */}
           <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShowMailModal;
