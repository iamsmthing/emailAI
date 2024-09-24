import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle } from 'lucide-react';
const InboxComponent: React.FC = () => {


      const location = useLocation();
  const [emails, setEmails] = useState<any>([]);
  const navigate = useNavigate();

useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // Store access token in localStorage
      localStorage.setItem('access_token', token);

      // Fetch the first 100 emails using the Gmail API
      axios
        .get('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            maxResults: 10, // Set limit to fetch the first 100 emails
          },
        })
        .then(response => {
          console.log('Emails:', response.data.messages);

          // Optionally, you can process the response to extract email details
          const messages = response.data.messages;
          
          if (messages && messages.length > 0) {
            // Fetch email details for each message
            const fetchEmailDetails = messages.map((message: { id: any; }) =>
              axios
                .get(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                })
                .then(emailDetailResponse => {
                  // Log individual email details
                //   console.log('Email details:', emailDetailResponse.data);
                  return emailDetailResponse.data;
                })
                .catch(error => {
                  console.error(`Error fetching email ${message.id}:`, error);
                })
            );

            // Process all email detail promises
            Promise.all(fetchEmailDetails)
              .then(emails => {
                console.log('All email details:', emails);
                setEmails(emails)
                // You can store or display the emails in the component's state
              })
              .catch(error => {
                console.error('Error fetching email details:', error);
              });
          }
        })
        .catch(error => {
          console.error('Error fetching emails:', error);
        });
    }
  }, [location]);


    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Inbox</h3>
        <div className="space-y-4">
          {emails.map((email:any) => (
            <div key={email.id} className="flex items-center p-4 border-b border-gray-200 last:border-b-0">
              {email.urgent && <AlertCircle className="w-5 h-5 text-red-500 mr-3" />}
              <div className="flex-1">
                <h4 className="font-semibold">{email.subject}</h4>
                <p className="text-sm text-slate-700">{email.sender}</p>
                <p className="text-sm text-slate-700  font-bold">{email.snippet}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  

  export default InboxComponent;