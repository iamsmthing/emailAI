// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import Cookies from 'js-cookie';


// import { motion } from 'framer-motion';
// import { Mail, Calendar, Mic, Globe, Clock, RefreshCw, BarChart2, PieChart, User, Settings, LogOut, Inbox, AlertCircle } from 'lucide-react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import InboxComponent from '../components/Inbox';

// const mockChartData = [
//   { name: 'Mon', emails: 120 },
//   { name: 'Tue', emails: 180 },
//   { name: 'Wed', emails: 150 },
//   { name: 'Thu', emails: 200 },
//   { name: 'Fri', emails: 170 },
//   { name: 'Sat', emails: 80 },
//   { name: 'Sun', emails: 60 },
// ];

// const msLogin = () => {
//   window.location.href = 'http://localhost:4000/auth/microsoft';
// };



// const mockEmails = [
//   { id: 1, subject: 'Weekly Team Meeting', sender: 'boss@company.com', preview: 'Let\'s discuss our progress...', urgent: true },
//   { id: 2, subject: 'New Product Launch', sender: 'marketing@company.com', preview: 'Exciting news! Our new product...', urgent: false },
//   { id: 3, subject: 'Vacation Request', sender: 'hr@company.com', preview: 'Your vacation request has been...', urgent: false },
// ];

// const EmailSummaryDashboard: React.FC = () => {
  
// useEffect(() => {
//   const cookieValue = Cookies.get('access_token_g');
//   console.log(cookieValue);
//     }, []);
//   const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
//     const location = useLocation();
//   const [emails, setEmails] = useState<any>([]);
//   const navigate = useNavigate();
//   //     // Logout function
// //     const handleLogout = () => {
// //         // Clear tokens from localStorage
// //         localStorage.removeItem('access_token');
    
// //         // Redirect to login page
// //         navigate('/');
// //       };


//   const menuItems = [
//     { id: 'dashboard', icon: <BarChart2 className="w-5 h-5" />, label: 'Dashboard' },
//     { id: 'inbox', icon: <Inbox className="w-5 h-5" />, label: 'Inbox' },
//     { id: 'calendar', icon: <Calendar className="w-5 h-5" />, label: 'Calendar' },
//     { id: 'analytics', icon: <PieChart className="w-5 h-5" />, label: 'Analytics' },
//     { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
//   ];

//   const renderActiveComponent = () => {
//     switch (activeMenuItem) {
//       case 'dashboard':
//         return <DashboardComponent />;
//       case 'inbox':
//         return <InboxComponent />;
//       case 'calendar':
//         return <CalendarComponent />;
//       case 'analytics':
//         return <AnalyticsComponent />;
//       case 'settings':
//         return <SettingsComponent />;
//       default:
//         return <DashboardComponent />;
//     }
//   };

//     const handleLogout = () => {
//         // Clear tokens from localStorage
//         localStorage.removeItem('access_token');
    
//         // Redirect to login page
//         navigate('/');
//       };


//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-slate-700 text-white p-6">
//         <div className="flex items-center mb-8">
//           <Mail className="w-8 h-8 mr-2" />
//           <h1 className="text-2xl font-bold">EmailAI</h1>
//         </div>
//         <nav>
//           {menuItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => setActiveMenuItem(item.id)}
//               className={`flex items-center w-full p-3 mb-2 rounded-lg transition-colors ${
//                 activeMenuItem === item.id ? 'bg-purple-600' : 'hover:bg-purple-600'
//               }`}
//             >
//               {item.icon}
//               <span className="ml-3">{item.label}</span>
//             </button>
//           ))}
//         </nav>
//         <div className="mt-auto">
//           <button className="flex items-center w-full p-3 rounded-lg hover:bg-purple-600 transition-colors" onClick={handleLogout}>
//             <LogOut className="w-5 h-5" />
//             <span className="ml-3">Logout</span>
//           </button>
//         </div>
//       </aside>

//       {/* Main content */}
//       <main className="flex-1 p-8 overflow-y-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h2 className="text-3xl font-bold">{activeMenuItem.charAt(0).toUpperCase() + activeMenuItem.slice(1)}</h2>
//           <div className="flex items-center">
//             <span className="mr-4">John Doe</span>
//             <User className="w-8 h-8 text-gray-500" />
//           </div>
//         </div>

//         {renderActiveComponent()}
//       </main>
//     </div>
//   );
// };

// const DashboardComponent: React.FC = () => {
//   return (
//     <>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//         <AnalyticsCard title="Total Emails" value="1,234" icon={<Mail className="w-8 h-8" />} />
//         <AnalyticsCard title="Categorized" value="89%" icon={<PieChart className="w-8 h-8" />} />
//         <AnalyticsCard title="Response Rate" value="76%" icon={<RefreshCw className="w-8 h-8" />} />
//       </div>

//       <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//         <h3 className="text-xl font-semibold mb-4">Weekly Email Volume</h3>
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={mockChartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Line type="monotone" dataKey="emails" stroke="#8884d8" strokeWidth={2} />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         <FeatureCard
//           icon={<Mic className="w-6 h-6" />}
//           title="Voice Commands"
//           description="Use voice to control email actions"
//         />
//         <FeatureCard
//           icon={<Globe className="w-6 h-6" />}
//           title="Multi-Language Support"
//           description="Summarize and draft replies in different languages"
//         />
//         <FeatureCard
//           icon={<Clock className="w-6 h-6" />}
//           title="Schedule Emails"
//           description="Send emails at optimal times"
//         />
//       </div>
//     </>
//   );
// };


// const CalendarComponent: React.FC = () => {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <h3 className="text-xl font-semibold mb-4">Calendar</h3>
//       <p className="text-gray-600">Calendar integration coming soon...</p>
//     </div>
//   );
// };

// const AnalyticsComponent: React.FC = () => {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <h3 className="text-xl font-semibold mb-4">Analytics</h3>
//       <p className="text-gray-600">Detailed email analytics coming soon...</p>
//     </div>
//   );
// };

// const SettingsComponent: React.FC = () => {
//   return (
//     <div className="bg-white rounded-lg shadow-md p-6">
//       <h3 className="text-xl font-semibold mb-4">Settings</h3>
//       {/* <p className="text-gray-600">Account and app settings coming soon...</p> */}
//       <button
//         onClick={msLogin}
//         className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
//       >
//         Add Outlook Account
//       </button>
//     </div>
//   );
// };

// interface AnalyticsCardProps {
//   title: string;
//   value: string;
//   icon: React.ReactNode;
// }

// const AnalyticsCard: React.FC<AnalyticsCardProps> = ({ title, value, icon }) => {
//   return (
//     <motion.div
//       whileHover={{ scale: 1.03 }}
//       className="bg-white p-6 rounded-lg shadow-md"
//     >
//       <div className="flex justify-between items-center">
//         <div>
//           <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
//           <p className="text-3xl font-bold mt-2">{value}</p>
//         </div>
//         <div className="text-purple-600">{icon}</div>
//       </div>
//     </motion.div>
//   );
// };

// interface FeatureCardProps {
//   icon: React.ReactNode;
//   title: string;
//   description: string;
// }

// const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
//   return (
//     <motion.div
//       whileHover={{ scale: 1.05 }}
//       className="bg-white p-6 rounded-lg shadow-md transition-shadow duration-200 hover:shadow-lg"
//     >
//       <div className="text-purple-600 mb-4">{icon}</div>
//       <h3 className="text-lg font-semibold mb-2">{title}</h3>
//       <p className="text-gray-600">{description}</p>
//     </motion.div>
//   );
// };

// export default EmailSummaryDashboard;

// // export default Dashboard;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { Mail, Calendar, PieChart, Settings, LogOut, Inbox,  UserIcon, MicIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import InboxComponent from '../components/Inbox';
import VoiceToText from './VoiceToText';
import GoogleUserInfo from '../components/Profile'

const mockChartData = [
  { name: 'Mon', emails: 120 },
  { name: 'Tue', emails: 180 },
  { name: 'Wed', emails: 150 },
  { name: 'Thu', emails: 200 },
  { name: 'Fri', emails: 170 },
  { name: 'Sat', emails: 80 },
  { name: 'Sun', emails: 60 },
];
const msLogin = () => {
  window.location.href = 'http://localhost:4000/auth/microsoft';
};

const EmailSummaryDashboard: React.FC = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    const cookieValue = Cookies.get('access_token_g');
    console.log(cookieValue);
  }, []);

  const menuItems = [
    { id: 'dashboard', icon: <PieChart className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'assistant', icon: <MicIcon className="w-5 h-5" />, label: 'Voice AI' },
    { id: 'inbox', icon: <Inbox className="w-5 h-5" />, label: 'Inbox' },
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
    { id: 'profile', icon: <UserIcon className="w-5 h-5" />, label: 'Profile' },
  ];

  const renderActiveComponent = () => {
    switch (activeMenuItem) {
      case 'dashboard':
        return <DashboardComponent />;
      case 'assistant':
        return <VoiceToText />;  
      case 'inbox':
        return <InboxComponent />;
      case 'settings':
        return <SettingsComponent />;
      case 'profile':
      return <GoogleUserInfo />;
      default:
        return <DashboardComponent />;
    }
  };

  const handleLogout = () => {
    Cookies.remove('access_token_g', { path: '/' });
    Cookies.remove('connect.sid', { path: '/' });
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="w-64 bg-gray-800 p-6 flex flex-col"
      >
        <div className="flex items-center mb-8">
          <Mail className="w-8 h-8 mr-2 text-purple-400" />
          <h1 className="text-2xl font-bold">EmailAI</h1>
        </div>
        <nav className="flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenuItem(item.id)}
              className={`flex items-center w-full p-3 mb-2 rounded-lg transition-colors ${
                activeMenuItem === item.id ? 'bg-purple-600' : 'hover:bg-purple-500'
              }`}
            >
              {item.icon}
              <span className="ml-3">{item.label}</span>
            </button>
          ))}
        </nav>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="flex items-center w-full p-3 mt-4 bg-red-600 rounded-lg transition-colors hover:bg-red-700"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          <span className="ml-3">Logout</span>
        </motion.button>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1 p-8 overflow-y-auto"
      >
        <div className="flex justify-between items-center ">
          {/* <h2 className="text-3xl font-bold">{activeMenuItem.charAt(0).toUpperCase() + activeMenuItem.slice(1)}</h2>
          <div className="flex items-center">
            <span className="mr-4">John Doe</span>
            <User className="w-8 h-8 text-gray-500" />
          </div> */}
        </div>
        {renderActiveComponent()}
      </motion.main>
    </div>
  );
};

const DashboardComponent: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <AnalyticsCard title="Total Emails" value="1,234" icon={<Mail className="w-8 h-8" />} />
        <AnalyticsCard title="Categorized" value="89%" icon={<PieChart className="w-8 h-8" />} />
        <AnalyticsCard title="Response Rate" value="76%" icon={<Calendar className="w-8 h-8" />} />
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
      >
        <h3 className="text-xl font-semibold mb-4 text-gray-200">Weekly Email Volume</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={mockChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#ddd" />
            <YAxis stroke="#ddd" />
            <Tooltip />
            <Line type="monotone" dataKey="emails" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </>
  );
};

const AnalyticsCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({
  title,
  value,
  icon,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gray-800 p-6 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
          <p className="text-3xl font-bold mt-2 text-white">{value}</p>
        </div>
        <div className="text-purple-500">{icon}</div>
      </div>
    </motion.div>
  );
};


export const SettingsComponent: React.FC = () => {
  const token_ms = Cookies.get('access_token_ms');
  const [isChecked,setIsChecked]=useState(false);
  useEffect(() => {
    const allowSensitive = localStorage.getItem('allow-sensitive');
    if (allowSensitive) {
        setIsChecked(JSON.parse(allowSensitive));
    }
  })
  const handleCheckboxChange = () => {
    setIsChecked(prevChecked => {
        const newChecked = !prevChecked; // Toggle the value
        localStorage.setItem('allow-sensitive', String(newChecked)); // Update localStorage
        return newChecked; // Return the new state
    });
}
  return (
    <div className='flex flex-col gap-2'>
    <div className="bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-violet-600">Configure</h3>
      {token_ms?<button className="px-4 py-2 bg-emerald-700 text-white rounded-lg">Outlook Added</button>:<button className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={msLogin}>Add Outlook Account</button>}
      
    </div>
    <div className="bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-violet-600">Permissions</h3>
      <div className="flex items-center justify-between mb-4">
            <label htmlFor="default-checkbox" className="text-lg font-medium text-gray-900 dark:text-gray-100">
                Summarize sensitive emails
            </label>
            <input
                id="default-checkbox"
                type="checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
        </div>
      
    </div>
    </div>
  );
};


// const ProfileComponent: React.FC = () => {
//   return (
//     <div className="bg-gray-800 rounded-lg shadow-md p-6">
//       <h3 className="text-xl font-semibold mb-4 text-gray-200">Profile</h3>
//       <p className="text-gray-400">Profile integration coming soon...</p>
      
//     </div>
//   );
// };

export default EmailSummaryDashboard;
