import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';
import { Mail, Calendar, PieChart, Settings, LogOut, Inbox, MicIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import InboxComponent from '../components/Inbox';
import VoiceToText from './VoiceToText';
import { fetchEmails } from '../util/helper';
import ProfileSettingsPage from '../components/ProfileSettingPage';






const msLogin = () => {
  window.location.href = 'http://localhost:4000/auth/microsoft';
};

const EmailSummaryDashboard: React.FC = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const navigate = useNavigate();


  useEffect(() => {
   
    
    const cookieValue = Cookies.get('access_token_g');
    console.log("cookie value at the Dashboard", cookieValue);
  }, []);

  const menuItems = [
    { id: 'dashboard', icon: <PieChart className="w-5 h-5" />, label: 'Dashboard' },
    { id: 'assistant', icon: <MicIcon className="w-5 h-5" />, label: 'Voice AI' },
    { id: 'inbox', icon: <Inbox className="w-5 h-5" />, label: 'Inbox' },
    { id: 'profile settings', icon: <Settings className="w-5 h-5" />, label: 'Profile Settings' },
    // { id: 'profile', icon: <UserIcon className="w-5 h-5" />, label: 'Profile' },
  ];

  const renderActiveComponent = () => {
    switch (activeMenuItem) {
      case 'dashboard':
        return <DashboardComponent />;
      case 'assistant':
        return <VoiceToText />;
      case 'inbox':
        return <InboxComponent />;
      case 'profile settings':
        return <ProfileSettingsPage />;
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
          <h1 className="text-2xl font-bold">MailSense</h1>
        </div>
        <nav className="flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenuItem(item.id)}
              className={`flex items-center w-full p-3 mb-2 rounded-lg transition-colors ${activeMenuItem === item.id ? 'bg-purple-600' : 'hover:bg-purple-500'
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
  const currentDate = new Date();
  const dateAWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fromDateFilter = encodeURIComponent(dateAWeekAgo.toISOString().split('T')[0]);
  const toDateFilter = encodeURIComponent(currentDate.toISOString().split('T')[0]);
  const [totalMail, setTotalMail] = useState(0);
  const [readCount,setReadCount] = useState(0);
  const [mockChartData, setMockChartData] = useState<any>([]);
  

  useEffect(() => {  
    var fn=async () => {
      var emails = await fetchEmails({ fromDateFilter, toDateFilter, maxmails: 1500, fetchAll: true })
      console.log("emails",emails);
      const emailArray = [...Object.values(emails)].flat();
  
      const newTotalMail = emailArray.length
      var newreadCount=0;
  
    const freqArray: any[] = [0, 0, 0, 0, 0, 0, 0];
    emailArray.forEach((email: any) => {
      freqArray[new Date(email.date).getDay()]++;
      if(email.source == "Gmail"){
        if (!email.labelIds.includes("UNREAD")) {
          newreadCount++;
        }        
      }else{
       if(email.labels){
        newreadCount++;
       }
      }
    });

    var readPercent = (newreadCount / emailArray.length) * 100
    readPercent = parseFloat(readPercent.toFixed(2));
    console.log("read count",newreadCount)
    const newMockChartData = [
      { name: 'Mon', emails: freqArray[1] },
      { name: 'Tue', emails: freqArray[2] },
      { name: 'Wed', emails: freqArray[3] },
      { name: 'Thu', emails: freqArray[4] },
      { name: 'Fri', emails: freqArray[5] },
      { name: 'Sat', emails: freqArray[6] },
      { name: 'Sun', emails: freqArray[0] },
    ];
  
    setTotalMail(newTotalMail);
    setMockChartData(newMockChartData);
    setReadCount(readPercent);
    };
    fn();
  }, []);
 
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <AnalyticsCard title="Total Emails" value={totalMail==0?"Fetching...":totalMail.toString()} icon={<Mail className="w-8 h-8" />} />
        <AnalyticsCard title="Important" value="15.43%" icon={<PieChart className="w-8 h-8" />} />
        <AnalyticsCard title="Read Rate" value={`${readCount}%`} icon={<Calendar className="w-8 h-8" />} />
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

const AnalyticsCard: React.FC<{ title: string; value: string; icon: React.ReactNode;fetching?: boolean }> = ({
  title,
  value,
  icon,
  fetching
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gray-800 p-6 rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
          {fetching ? <p className="text font-bold mt-2 text-white">{value}</p>:<p className="text-3xl font-bold mt-2 text-white">{value}</p>}
          
        </div>
        <div className="text-purple-500">{icon}</div>
      </div>
    </motion.div>
  );
};


export const SettingsComponent: React.FC = () => {
  const token_ms = Cookies.get('access_token_ms');
  const [isChecked, setIsChecked] = useState(false);
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
        {token_ms ? <button className="px-4 py-2 bg-emerald-700 text-white rounded-lg">Outlook Added</button> : <button className="px-4 py-2 bg-blue-500 text-white rounded-lg" onClick={msLogin}>Add Outlook Account</button>}

      </div>
      <div className="bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-violet-600">Permissions</h3>
        <div className="flex items-center justify-between mb-4">
          <label htmlFor="default-checkbox" className="text-lg font-medium  dark:text-gray-100">
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
