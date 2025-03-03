import Home from './home';
import { useState } from 'react';

export default function Login() {
    const [userLoggedIn, setUserLoggedIn] = useState(false);

  function userLogged() {
setUserLoggedIn(true);
  }

  return (
    <div
      className="max-w-md position-relative mx-auto bg-primary-25 border border-primary-300 rounded-lg shadow-lg"
      style={{ marginTop: '70px', height: 'calc(100vh - 100px)' }}>
      {userLoggedIn ? (
        <div className="onboarding-message">
          <div className="shrink-0 text-center">
            <div
              className="inline-flex items-center p-4 rounded-full bg-white"
              style={{ boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 16px' }}>
              <img className="size-[40px]" src={chrome.runtime.getURL('icons/icon128.png')} alt="Logo" />
            </div>
            <div className="text-text-primary-1 mt-[12px] text-[24px] title-font">{'Welcome to Depost AI!'}</div>
          </div>
          <div className="box">
            <p className="text-[18px] welcome-box">
              → Start using Depost AI to boost your LinkedIn engagement and productivity. 
            </p>
            <br />
            <p className="text-[18px] welcome-box">
             → Follow the steps in sidepanel to
              complete your onboarding
            </p>
          </div>
          <div className="box">
            <h3 className="text-lg font-bold welcome-box">Depost AI Features</h3>
            <ul className="list-disc pl-5 text-primary-700">
              <li>Generate engaging posts</li>
              <li>Format posts for better readability</li>
              <li>Create reposts with unique angles</li>
              <li>Generate quick comments with default settings</li>
              <li>Use custom comment types for unique perspectives</li>
              <li>Reply to LinkedIn DMs with AI assistance</li>
            </ul>
          </div>
          <div className="box">
            <h3 className="text-lg font-bold welcome-box">How to Get Started</h3>
            <ol className="list-decimal pl-5 text-primary-700">
              <li>
                <strong>Pin the Extension:</strong> Open your Chrome Extensions menu and pin Depost AI for quick access.
              </li>
              <li>
                <strong>Go to LinkedIn:</strong> Navigate to LinkedIn and open the post editor,comment or DM.
              </li>
              <li>
                <strong>Access Depost AI Sidepanel for preferences</strong>
              </li>
            </ol>
          </div>
        </div>
      ) : (
        <Home userLogged={userLogged} isInstalled={true} />
      )}
    </div>
  );
}
