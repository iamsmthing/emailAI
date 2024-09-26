
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { AlertCircle } from 'lucide-react';
// import { FaGoogle, FaMicrosoft } from 'react-icons/fa';

// const InboxComponent: React.FC = () => {
//   const [emails, setEmails] = useState<Record<string, any[]>>({});
//   const [msEmails, setMsEmails] = useState<Record<string, any[]>>({});
//   const [expandedAuthors, setExpandedAuthors] = useState<{ [key: string]: boolean }>({});
//   const [expandedMsSenders, setExpandedMsSenders] = useState<{ [key: string]: boolean }>({});
  
//   function convertTimestampToDate(timestamp: number): string {
//     const date = new Date(timestamp);
//     const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
//     const day = date.getUTCDate();
//     const month = months[date.getUTCMonth()];
//     const year = date.getUTCFullYear();
//     return `${day} ${month}, ${year}`;
//   }
  
//   function checkReadStatus(arr: string[]): string {
//     return arr.includes("UNREAD") ? "UNREAD" : "READ";
//   }
  
//   function checkReadImp(arr: string[]): boolean {
//     return arr.includes("IMPORTANT") ? true : false;
//   }
//   function capitalizeFirstLetter(str:string) {
//     if (str.length === 0) return str; // Return the original string if it's empty
//     return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
// }

//   useEffect(() => {
//     const token = Cookies.get('access_token_g');
//     const token_ms = Cookies.get('access_token_ms');

//     const fetchOutlookEmails = async (accessToken: string) => {
//       const endpoint = 'https://graph.microsoft.com/v1.0/me/messages';
//       try {
//         const response = await axios.get(endpoint, {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         const messages = response.data.value;
//         const msEmailsGroupedBySender = messages.reduce((acc: Record<string, any[]>, email: any) => {
//           const sender = email.sender.emailAddress.name || 'Unknown Sender';
//           if (!acc[sender]) {
//             acc[sender] = [];
//           }
//           acc[sender].push(email);
//           return acc;
//         }, {});
        
//         setMsEmails(msEmailsGroupedBySender);
//       } catch (error) {
//         console.error('Error fetching Outlook emails:', error);
//       }
//     };

//     const fetchGmailEmails = async (accessToken: string) => {
//       try {
//         const response = await axios.get(
//           'https://gmail.googleapis.com/gmail/v1/users/me/messages',
//           {
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//             },
//             params: { maxResults: 10 },
//           }
//         );

//         const messages = response.data.messages;
//         if (messages && messages.length > 0) {
//           const emailDetails = await Promise.all(
//             messages.map((message: { id: any }) =>
//               axios
//                 .get(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`, {
//                   headers: { Authorization: `Bearer ${accessToken}` },
//                 })
//                 .then((emailDetailResponse) => emailDetailResponse.data)
//             )
//           );

//           const emailsGroupedByAuthor = emailDetails.reduce((acc: Record<string, any[]>, email) => {
//             const fromHeader = email.payload.headers.find(
//               (header: { name: string }) => header.name === 'From'
//             );
//             const author = fromHeader ? fromHeader.value : 'Unknown Author';
//             if (!acc[author]) {
//               acc[author] = [];
//             }
//             acc[author].push(email);
//             return acc;
//           }, {});

//           setEmails(emailsGroupedByAuthor);
//         }
//       } catch (error) {
//         console.error('Error fetching Gmail emails:', error);
//       }
//     };

//     if (token_ms) {
//       fetchOutlookEmails(token_ms);
//     }

//     if (token) {
//       fetchGmailEmails(token);
//     }
//   }, []);

//   const toggleExpandGmail = (author: string) => {
//     setExpandedAuthors((prev) => ({
//       ...prev,
//       [author]: !prev[author],
//     }));
//   };

//   const toggleExpandOutlook = (sender: string) => {
//     setExpandedMsSenders((prev) => ({
//       ...prev,
//       [sender]: !prev[sender],
//     }));
//   };

//   return (
//     <div className="py-2 bg-gray-900 text-white">
//       <div className="grid grid-cols-2 gap-6 h-[90vh]">
//         {/* Gmail Emails Section */}
//         <div className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-lg h-[100%] overflow-y-auto">
//           <div className="flex items-center space-x-2 text-2xl font-semibold">
//             <FaGoogle className="text-blue-400" />
//             <h3>Gmail Mails</h3>
//           </div>

//           {Object.keys(emails).length > 0 ? (
//             Object.keys(emails).map((author) => (
//               <div key={author} className="bg-gray-700 p-4 rounded-lg shadow border-l-4 border-blue-400">
//                 {/* Author Section */}
//                 <div className="flex justify-between items-center mb-2">
//                   <div>
//                     <p className={`text-sm font-semibold ${checkReadStatus(emails[author][0].labelIds) === "UNREAD" ? "text-red-400" : "text-emerald-500"}`}>
//                       {capitalizeFirstLetter(checkReadStatus(emails[author][0].labelIds))}
//                     </p>
//                     <h4 className="font-semibold text-lg text-white">{author}</h4>
//                     <div className="flex items-center space-x-4">
//                       <p className="text-sm text-gray-400">{emails[author].length} email(s)</p>
//                       <p className="text-sm text-gray-400">{convertTimestampToDate(Number(emails[author][0].internalDate))}</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={() => toggleExpandGmail(author)}
//                     className="text-blue-400 font-semibold"
//                   >
//                     {expandedAuthors[author] ? 'Collapse' : 'Expand'}
//                   </button>
//                 </div>

//                 {/* Emails from this author */}
//                 {expandedAuthors[author] && (
//                   <div className="space-y-2 mt-4">
//                     {emails[author].map((email) => (
//                       <div key={email.id} className="bg-gray-600 p-3 rounded-lg flex items-start border-l-4 border-blue-300">
                        
//                         {checkReadImp(email.labelIds) && <AlertCircle className="w-6 h-6 text-red-500 mr-3" />}
//                         <div className="flex-1">
//                         <p className={`text-sm font-semibold text-right ${checkReadStatus(email.labelIds) === "UNREAD" ? "text-red-400" : "text-emerald-500"}`}>
//                       {capitalizeFirstLetter(checkReadStatus(email.labelIds))}
//                     </p>
//                           <h5 className="font-semibold text-md">
//                             {email.payload.headers.find((header: { name: string }) => header.name === 'Subject')?.value || 'No Subject'}
//                           </h5>
//                           <p className="text-sm text-gray-400">{email.snippet}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">No Gmail emails found</p>
//           )}
//         </div>

//         {/* Outlook Emails Section */}
//         <div className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-lg h-[100%] overflow-y-auto">
//           <div className="flex items-center space-x-2 text-2xl font-semibold">
//             <FaMicrosoft className="text-green-400" />
//             <h3>Outlook Mails</h3>
//           </div>

//           {Object.keys(msEmails).length > 0 ? (
//             Object.keys(msEmails).map((sender) => (
//               <div key={sender} className="bg-gray-700 p-4 rounded-lg shadow border-l-4 border-green-400">
//                 <div className="flex justify-between items-center mb-2">
//                   <div>
//                     <h4 className="font-semibold text-lg text-white">{sender}</h4>
//                     <div className="flex items-center space-x-4">
//                       <p className="text-sm text-gray-400">{msEmails[sender].length} emails</p>
//                       <p className="text-sm text-gray-400">{convertTimestampToDate(new Date(msEmails[sender][0].receivedDateTime).getTime())}</p>
//                     </div>
//                   </div>
//                   <button onClick={() => toggleExpandOutlook(sender)} className="text-green-400 font-semibold">
//                     {expandedMsSenders[sender] ? 'Collapse' : 'Expand'}
//                   </button>
//                 </div>

//                 {expandedMsSenders[sender] && (
//                   <div className="space-y-2 mt-4">
//                     {msEmails[sender].map((email: any) => (
//                       <div key={email.id} className="bg-gray-600 p-3 rounded-lg flex items-start border-l-4 border-green-300">
//                         <div className="flex-1">
//                           <h5 className="font-semibold text-md">{email.subject || 'No Subject'}</h5>
//                           <p className="text-sm text-gray-400">{email.bodyPreview}</p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">No Outlook emails found</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InboxComponent;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { AlertCircle } from 'lucide-react';
import { FaGoogle, FaMicrosoft } from 'react-icons/fa';

const InboxComponent: React.FC = () => {
  const [emails, setEmails] = useState<Record<string, any[]>>({});
  const [expandedAuthors, setExpandedAuthors] = useState<{ [key: string]: boolean }>({});

  function convertTimestampToDate(timestamp: number): string {
    const date = new Date(timestamp);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    return `${day} ${month}, ${year}`;
  }

  function capitalizeFirstLetter(str: string) {
    if (str.length === 0) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  function checkReadStatus(arr: string[]): string {
    return arr.includes("UNREAD") ? "UNREAD" : "READ";
  }

  function checkReadImp(arr: string[]): boolean {
    return arr.includes("IMPORTANT");
  }

  useEffect(() => {
    const token = Cookies.get('access_token_g');
    const token_ms = Cookies.get('access_token_ms');

    const fetchOutlookEmails = async (accessToken: string) => {
      const endpoint = 'https://graph.microsoft.com/v1.0/me/messages';
      try {
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        const messages = response.data.value;
        const outlookEmailsGroupedBySender = messages.reduce((acc: Record<string, any[]>, email: any) => {
          const sender = email.sender.emailAddress.name || 'Unknown Sender';
          if (!acc[sender]) {
            acc[sender] = [];
          }
          acc[sender].push({
            id: email.id,
            subject: email.subject || 'No Subject',
            snippet: email.bodyPreview || 'No Preview',
            date: new Date(email.receivedDateTime).getTime(),
            source: 'Outlook',
          });
          return acc;
        }, {});
        
        return outlookEmailsGroupedBySender;
      } catch (error) {
        console.error('Error fetching Outlook emails:', error);
        return {};
      }
    };

    const fetchGmailEmails = async (accessToken: string) => {
      try {
        const response = await axios.get(
          'https://gmail.googleapis.com/gmail/v1/users/me/messages',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: { maxResults: 10 },
          }
        );

        const messages = response.data.messages;
        if (messages && messages.length > 0) {
          const emailDetails = await Promise.all(
            messages.map((message: { id: any }) =>
              axios
                .get(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`, {
                  headers: { Authorization: `Bearer ${accessToken}` },
                })
                .then((emailDetailResponse) => emailDetailResponse.data)
            )
          );

          const gmailEmailsGroupedByAuthor = emailDetails.reduce((acc: Record<string, any[]>, email) => {
            const fromHeader = email.payload.headers.find(
              (header: { name: string }) => header.name === 'From'
            );
            const author = fromHeader ? fromHeader.value : 'Unknown Author';
            if (!acc[author]) {
              acc[author] = [];
            }
            acc[author].push({
              id: email.id,
              subject: email.payload.headers.find((header: { name: string }) => header.name === 'Subject')?.value || 'No Subject',
              snippet: email.snippet || 'No Preview',
              date: Number(email.internalDate),
              labelIds: email.labelIds, // Read/unread status
              source: 'Gmail',
            });
            return acc;
          }, {});

          return gmailEmailsGroupedByAuthor;
        }
      } catch (error) {
        console.error('Error fetching Gmail emails:', error);
        return {};
      }
    };

    const fetchEmails = async () => {
      const token = Cookies.get('access_token_g');
      const token_ms = Cookies.get('access_token_ms');

      const gmailEmails = token ? await fetchGmailEmails(token) : {};
      const outlookEmails = token_ms ? await fetchOutlookEmails(token_ms) : {};

      // Combine both Gmail and Outlook emails grouped by author/sender
      const combinedEmails = { ...gmailEmails, ...outlookEmails };
      setEmails(combinedEmails);
    };

    fetchEmails();
  }, []);

  const toggleExpandEmail = (author: string) => {
    setExpandedAuthors((prev) => ({
      ...prev,
      [author]: !prev[author],
    }));
  };

  return (
    <div className="py-2 bg-gray-900 text-white">
      <div className="space-y-4 bg-gray-800 p-6 rounded-lg shadow-lg h-[90vh] overflow-y-auto">
        <div className="flex items-center space-x-2 text-2xl font-semibold">
          <FaGoogle className="text-blue-400" />
          <FaMicrosoft className="text-green-400" />
          <h3>All Emails </h3>
        </div>

        {Object.keys(emails).length > 0 ? (
          Object.keys(emails).map((author) => (
            <div key={author} className={`bg-slate-700 p-4 rounded-lg shadow border-l-4 ${emails[author][0].source === 'Gmail' ? 'border-blue-400' : 'border-green-400'}`}>
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h4 className="font-semibold text-lg text-white">{author}</h4>
                  <div className="flex items-center space-x-4">
                    <p className="text-sm text-gray-400">{emails[author].length} email(s)</p>
                    <p className="text-sm text-gray-400">{convertTimestampToDate(emails[author][0].date)}</p>
                  </div>
                </div>
                <button onClick={() => toggleExpandEmail(author)} className="text-blue-400 font-semibold">
                  {expandedAuthors[author] ? 'Collapse' : 'Expand'}
                </button>
              </div>

              {/* Emails from this author */}
              {expandedAuthors[author] && (
                <div className="space-y-2 mt-4">
                  {emails[author].map((email) => (
                    <div style={{backgroundColor:'rgb(23 29 75)'}} key={email.id} className={` p-3 rounded-lg flex items-start border-l-4 ${email.source === 'Gmail' ? 'border-blue-400' : 'border-green-400'}`}>
                      {/* Icon for Gmail or Outlook */}
                      {email.source === 'Gmail' ? (
                        <FaGoogle className="text-blue-400 mr-2" />
                      ) : (
                        <FaMicrosoft className="text-green-400 mr-2" />
                      )}
                      <div className="flex-1">
                        {/* Display read/unread status for Gmail */}
                        {email.source === 'Gmail' && (
                          <p className={`text-sm font-semibold ${checkReadStatus(email.labelIds) === "UNREAD" ? "text-red-400" : "text-emerald-500"}`}>
                            {capitalizeFirstLetter(checkReadStatus(email.labelIds))}
                          </p>
                        )}
                        <h5 className="font-semibold text-md">{email.subject}</h5>
                        <p className="text-sm text-gray-300">{email.snippet}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No emails found</p>
        )}
      </div>
    </div>
  );
};

export default InboxComponent;
