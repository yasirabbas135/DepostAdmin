import { useState, useEffect } from 'react';
import { isUserLoggedIn, getUserSession } from '../entries/background/apiRequestService';
import Sidebar from './sidebar';
import AuthForm from './AuthForm';
import FeedComponent from './FeedComponent';

export default function Home( { userLogged ,isInstalled } ) {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('auth'); // Default view is 'auth'
  const [selectedContent, setSelectedContent] = useState('home'); // Default content


   

  useEffect(() => {
    const checkLogin = async () => {
      const userSession = await isUserLoggedIn();
 
      setUserLoggedIn(!!userSession);
      if (userSession) {

        const sessionData = await getUserSession();
        if (!sessionData.onboarding) {
          setCurrentView('onboarding');
        } else {
         setCurrentView('home');
        }
      }
    };
    checkLogin();
   
  }, []);

  const menuItems = [
    {
      id: 'home',
      label: 'Home',
      icon: 'M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z',
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: 'M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm160-80v-80h400v80H440Zm160-160v-240h80v80h160v80H680v80h-80Zm-480-80v-80h400v80H120Z',
    },
  ];

  const handleMenuClick = (id) => {
    setSelectedContent(id);
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    chrome.runtime.sendMessage({ action: 'apiRequest', payload: { method: 'logout' } }, (response) => {
      if (response.success) {
        setUserLoggedIn(false);
        setCurrentView('auth');
      }
    });
  };

  const contentMap = {
    home: <FeedComponent />,
  };


  if (currentView === 'auth') {
       return (
         <div className="flex justify-center items-center h-full bg-gray-50">
           {<AuthForm userLogged = {userLogged} setView={setCurrentView} isInstalled={isInstalled} />}
         </div>
       );

  } else {

    return (
      <div className="side-panel-main h-screen flex flex-col">
        {/* Main Content and Sidebar */}
        <div className="flex flex-grow">
          {/* Content Section */}
          <div className="main-content flex flex-col flex-grow relative">
            {/* Content */}
            <div className="flex-grow p-2 overflow-auto">{contentMap[selectedContent] || <div>Content Not Found</div>}</div>
          </div>

          {/* Sidebar */}
          <Sidebar
            menuItems={menuItems}
            onMenuClick={handleMenuClick}
            logo={chrome.runtime.getURL('icons/icon128.png')}
            onLogout={handleLogout}
          />
        </div>
      </div>
    );

  }
}
