import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// const Dashboard = () => {
//   const location = useLocation();
//   const [emails, setEmails] = useState<any>([]);
//   const navigate = useNavigate();

// useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const token = params.get('token');

//     if (token) {
//       // Store access token in localStorage
//       localStorage.setItem('access_token', token);

//       // Fetch the first 100 emails using the Gmail API
//       axios
//         .get('https://gmail.googleapis.com/gmail/v1/users/me/messages', {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           params: {
//             maxResults: 10, // Set limit to fetch the first 100 emails
//           },
//         })
//         .then(response => {
//           console.log('Emails:', response.data.messages);

//           // Optionally, you can process the response to extract email details
//           const messages = response.data.messages;
          
//           if (messages && messages.length > 0) {
//             // Fetch email details for each message
//             const fetchEmailDetails = messages.map((message: { id: any; }) =>
//               axios
//                 .get(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`, {
//                   headers: {
//                     Authorization: `Bearer ${token}`,
//                   },
//                 })
//                 .then(emailDetailResponse => {
//                   // Log individual email details
//                 //   console.log('Email details:', emailDetailResponse.data);
//                   return emailDetailResponse.data;
//                 })
//                 .catch(error => {
//                   console.error(`Error fetching email ${message.id}:`, error);
//                 })
//             );

//             // Process all email detail promises
//             Promise.all(fetchEmailDetails)
//               .then(emails => {
//                 console.log('All email details:', emails);
//                 setEmails(emails)
//                 // You can store or display the emails in the component's state
//               })
//               .catch(error => {
//                 console.error('Error fetching email details:', error);
//               });
//           }
//         })
//         .catch(error => {
//           console.error('Error fetching emails:', error);
//         });
//     }
//   }, [location]);
//     // Logout function
//     const handleLogout = () => {
//         // Clear tokens from localStorage
//         localStorage.removeItem('access_token');
    
//         // Redirect to login page
//         navigate('/');
//       };

//   return (
//     <div>
//       <h1>Dashboard</h1>
//       <button onClick={handleLogout}>Logout</button> {/* Logout Button */}
//       <h2>Your Emails:</h2>
//       <ul>
//         {emails.map((email:any) => (
//           <li key={email.id}>{email.snippet}</li>
//         ))}
//       </ul>
//     </div>
//   );
// };

import { motion } from 'framer-motion';
import { Mail, Calendar, Mic, Globe, Clock, RefreshCw, BarChart2, PieChart, User, Settings, LogOut, Inbox, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import InboxComponent from '../components/Inbox';

const mockChartData = [
  { name: 'Mon', emails: 120 },
  { name: 'Tue', emails: 180 },
  { name: 'Wed', emails: 150 },
  { name: 'Thu', emails: 200 },
  { name: 'Fri', emails: 170 },
  { name: 'Sat', emails: 80 },
  { name: 'Sun', emails: 60 },
];

const mockEmails = [
  { id: 1, subject: 'Weekly Team Meeting', sender: 'boss@company.com', preview: 'Let\'s discuss our progress...', urgent: true },
  { id: 2, subject: 'New Product Launch', sender: 'marketing@company.com', preview: 'Exciting news! Our new product...', urgent: false },
  { id: 3, subject: 'Vacation Request', sender: 'hr@company.com', preview: 'Your vacation request has been...', urgent: false },
];

const EmailSummaryDashboard: React.FC = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
    const location = useLocation();
  const [emails, setEmails] = useState<any>([]);
  const navigate = useNavigate();
  //     // Logout function
//     const handleLogout = () => {
//         // Clear tokens from localStorage
//         localStorage.removeItem('access_token');
    
//         // Redirect to login page
//         navigate('/');
//       };


  const menuItems = [
    { id: 'dashboard', icon: <BarChart2 className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'inbox', icon: <Inbox className="w-5 h-5" />, label: 'Inbox' },
    { id: 'calendar', icon: <Calendar className="w-5 h-5" />, label: 'Calendar' },
    { id: 'analytics', icon: <PieChart className="w-5 h-5" />, label: 'Analytics' },
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
  ];

  const renderActiveComponent = () => {
    switch (activeMenuItem) {
      case 'dashboard':
        return <DashboardComponent />;
      case 'inbox':
        return <InboxComponent />;
      case 'calendar':
        return <CalendarComponent />;
      case 'analytics':
        return <AnalyticsComponent />;
      case 'settings':
        return <SettingsComponent />;
      default:
        return <DashboardComponent />;
    }
  };

    const handleLogout = () => {
        // Clear tokens from localStorage
        localStorage.removeItem('access_token');
    
        // Redirect to login page
        navigate('/');
      };


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-700 text-white p-6">
        <div className="flex items-center mb-8">
          <Mail className="w-8 h-8 mr-2" />
          <h1 className="text-2xl font-bold">EmailAI</h1>
        </div>
        <nav>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenuItem(item.id)}
              className={`flex items-center w-full p-3 mb-2 rounded-lg transition-colors ${
                activeMenuItem === item.id ? 'bg-purple-600' : 'hover:bg-purple-600'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto">
          <button className="flex items-center w-full p-3 rounded-lg hover:bg-purple-600 transition-colors" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">{activeMenuItem.charAt(0).toUpperCase() + activeMenuItem.slice(1)}</h2>
          <div className="flex items-center">
            <span className="mr-4">John Doe</span>
            <User className="w-8 h-8 text-gray-500" />
          </div>
        </div>

        {renderActiveComponent()}
      </main>
    </div>
  );
};

const DashboardComponent: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <AnalyticsCard title="Total Emails" value="1,234" icon={<Mail className="w-8 h-8" />} />
        <AnalyticsCard title="Categorized" value="89%" icon={<PieChart className="w-8 h-8" />} />
        <AnalyticsCard title="Response Rate" value="76%" icon={<RefreshCw className="w-8 h-8" />} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Weekly Email Volume</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="emails" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FeatureCard
          icon={<Mic className="w-6 h-6" />}
          title="Voice Commands"
          description="Use voice to control email actions"
        />
        <FeatureCard
          icon={<Globe className="w-6 h-6" />}
          title="Multi-Language Support"
          description="Summarize and draft replies in different languages"
        />
        <FeatureCard
          icon={<Clock className="w-6 h-6" />}
          title="Schedule Emails"
          description="Send emails at optimal times"
        />
      </div>
    </>
  );
};

// const InboxComponent: React.FC = () => {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <h3 className="text-xl font-semibold mb-4">Inbox</h3>
//       <div className="space-y-4">
//         {mockEmails.map((email) => (
//           <div key={email.id} className="flex items-center p-4 border-b border-gray-200 last:border-b-0">
//             {email.urgent && <AlertCircle className="w-5 h-5 text-red-500 mr-3" />}
//             <div className="flex-1">
//               <h4 className="font-semibold">{email.subject}</h4>
//               <p className="text-sm text-gray-600">{email.sender}</p>
//               <p className="text-sm text-gray-500 truncate">{email.preview}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

const CalendarComponent: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Calendar</h3>
      <p className="text-gray-600">Calendar integration coming soon...</p>
    </div>
  );
};

const AnalyticsComponent: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Analytics</h3>
      <p className="text-gray-600">Detailed email analytics coming soon...</p>
    </div>
  );
};

const SettingsComponent: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4">Settings</h3>
      <p className="text-gray-600">Account and app settings coming soon...</p>
    </div>
  );
};

interface AnalyticsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
}

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, value, icon }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-purple-600">{icon}</div>
      </div>
    </motion.div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white p-6 rounded-lg shadow-md transition-shadow duration-200 hover:shadow-lg"
    >
      <div className="text-purple-600 mb-4">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
};

export default EmailSummaryDashboard;

// export default Dashboard;
