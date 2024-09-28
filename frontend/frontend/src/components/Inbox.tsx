import React, { useEffect, useState } from 'react';
import { FaSync } from "react-icons/fa";
import { FaGoogle, FaMicrosoft } from 'react-icons/fa';
import { fetchEmails } from '../util/helper';
import ShowMailModal from './showMailModal';
import { MdOutlineDrafts } from "react-icons/md";
import { Button } from './ui/button';
import axios from 'axios';
import Cookies from 'js-cookie';

interface Email {
  author: string;
  id: string;
  threadId: string;
  subject: string;
  snippet: string;
  date: number;
  labelIds: string[];
  source: string;
}


const InboxComponent: React.FC = () => {
  const [emails, setEmails] = useState<Record<string, any[]>>({});
  const [expandedAuthors, setExpandedAuthors] = useState<{ [key: string]: boolean }>({});
  const [synced, setSynced] = useState(false);
  const [loading, setLoading] = useState(true);
   // State for modal
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [selectedEmail, setSelectedEmail] = useState<any>(null);
  // Function to be called when button is clicked
  const cookieValue = Cookies.get('access_token_g')!;
  const handleButtonClick = () => {
    setLoading(true)
    setEmails({})
    setSynced((prev) => !prev); // Toggle state to trigger useEffect
  };



  const showEmailContent = (email: any) => {
    setSelectedEmail(email); // Set the email that was clicked
    setIsModalOpen(true);    // Open the modal
  };


  async function createDraftEmail(
    accessToken: string, 
    recipientName: string, 
    subject: string, 
    threadId:string,
    body: string, 
  ): Promise<string> {
    console.log(recipientName, subject, body);
  
    try {
      const emailContent = `To: ${recipientName}\r\nSubject: ${subject}\r\n\r\n${body}`;
      // const raw = Buffer.from(emailContent)
      //       .toString('base64')
      //       .replace(/\+/g, '-')
      //       .replace(/\//g, '_')
      //       .replace(/=+$/, '');
      const raw = btoa(unescape(encodeURIComponent(emailContent)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

      // Define the draft data to be sent
      const draftData = {
        message: {
          raw:raw,
          threadId:threadId  // If part of a thread, assign threadId
        },
      };
  
      // Send request to Gmail API using Axios
      const res = await axios.post(
        'https://gmail.googleapis.com/gmail/v1/users/me/drafts', 
        draftData, 
        {
          headers: { Authorization: `Bearer ${accessToken}` }  // Pass the OAuth token in the header
        }
      );
  
      return JSON.stringify({ draftId: res.data.id, status: `Draft created successfully for ${recipientName}` });
    } catch (error: any) {
      console.error("Error creating draft email:", error.response?.data || error.message);
      return JSON.stringify({ error: "Failed to create draft email" });
    }
  }

  const createDraft=async (event:any,email:any)=>{
    event.stopPropagation();
    console.log(email)
    

    const requestBody={
      emailContent:email.snippet
    }
     let res = await fetch(
      'http://localhost:4000/auth/draftSummarize',
       { method: 'POST',
         headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
         });
      res = await res.json();

    const createDraft=await createDraftEmail(cookieValue,email.author,email.subject,email.threadId,res?.emailContent,)
    console.log(createDraft);
  }

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

  // function checkReadImp(arr: string[]): boolean {
  //   return arr.includes("IMPORTANT");
  // }
  
  useEffect(() => {
    async function fetchAndSetEmails() {
      try {
        // const currentDate = new Date();
        // const dateAWeekAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000);
        // const fromDateFilter = encodeURIComponent(dateAWeekAgo.toISOString().split('T')[0]);
        // const toDateFilter = encodeURIComponent(currentDate.toISOString().split('T')[0]);
        // const combinedEmails = await fetchEmails({fromDateFilter,toDateFilter,maxmails:200,fetchAll:true});
        const combinedEmails = await fetchEmails({});
        setEmails(combinedEmails);
      } catch (error) {
        console.error(error);
      }
    }
    fetchAndSetEmails();
    console.log("Emails on Inbox",emails)
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 5000); // 3 seconds

    console.log(emails)
    return () => clearTimeout(timeoutId);

  }, [synced]);

  const toggleExpandEmail = (author: string) => {
    setExpandedAuthors((prev) => ({
      ...prev,
      [author]: !prev[author],
    }));
  };

  return (
    <div className="py-2 bg-gray-900 text-white">
      <div className="space-y-4 bg-gray-800 px-6 pb-6 rounded-lg shadow-lg h-[90vh] overflow-y-auto">

        {/* Fixed header */}
        <div className="sticky flex justify-between content-center top-0 z-10 bg-gray-800 py-2">
          <div className="flex items-center space-x-2 text-2xl font-semibold">
            {/* {token && <FaGoogle className="text-blue-400" />}
            {token_ms && <FaMicrosoft className="text-green-400" />} */}
            <h3>INBOX</h3>
          </div>
          <div className='flex flex-row gap-2 items-center justify-center'>
            {/* <ShowMailModal/> */}
            <FaSync className='text-purple-500 text-lg cursor-pointer' onClick={handleButtonClick} />
          </div>
        </div>

        {/* Scrollable emails section */}
        {Object.keys(emails).length > 0 ?
          (
            Object.keys(emails).map((author) => (
              <div
                key={author}
                className={`bg-slate-700 p-4 rounded-lg shadow border-l-4 ${emails[author][0].source === 'Gmail'
                  ? 'border-blue-400'
                  : 'border-green-400'
                  }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <div className="flex row gap-2 items-center">
                      {emails[author][0].source === 'Gmail'
                        ? <FaGoogle className="text-blue-400" />
                        : <FaMicrosoft className="text-green-400" />
                      }

                      <h4 className="font-semibold text-lg text-white">{author}</h4></div>
                    <div className="flex items-center space-x-4">
                      <p className="text-sm text-gray-400">
                        {emails[author].length} email(s)
                      </p>
                      <p className="text-sm text-gray-400">
                        {convertTimestampToDate(emails[author][0].date)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleExpandEmail(author)}
                    className="text-blue-400 font-semibold"
                  >
                    {expandedAuthors[author] ? 'Collapse' : 'Expand'}
                  </button>
                </div>

                {/* Emails from this author */}
                {expandedAuthors[author] && (
                  <div className="space-y-2 mt-4">
                    {emails[author].map((email) => (
                      <div
                      onClick={()=>showEmailContent(email)}
                        style={{ backgroundColor: 'rgb(23 29 75)' }}
                        key={email.id}
                        className={`p-3 cursor-pointer rounded-lg flex items-start border-l-4 ${email.source === 'Gmail'
                          ? 'border-blue-400'
                          : 'border-green-400'
                          }`}
                      >
                        {/* Icon for Gmail or Outlook */}
                        {email.source === 'Gmail' ? (
                          <FaGoogle className="text-blue-400 mr-2" />
                        ) : (
                          <FaMicrosoft className="text-green-400 mr-2" />
                        )}
                        <div className="flex-1">
                          {/* Display read/unread status for Gmail */}
                          {(
                            <div className='flex flex-row content-center justify-between'>

                            <p
                              className={`text-sm font-semibold ${checkReadStatus(email.labelIds) === 'UNREAD'
                                ? 'text-red-400'
                                : 'text-emerald-500'
                                }`}
                            >
                              {capitalizeFirstLetter(checkReadStatus(email.labelIds))}
                            </p>
                            <Button variant="default" onClick={(e:any)=>createDraft(e,email)}>Create Draft</Button>

                            </div>
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
          ) :
          (
            <div role="status" className="flex items-center justify-center h-[90%]">
              <svg
                aria-hidden="true"
                className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>              
            </div>
          )}
          {/* Modal for showing email content */}
        {selectedEmail && (
          <ShowMailModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} email={selectedEmail} />
        )}
      </div>
    </div>

  );
};

export default InboxComponent;
