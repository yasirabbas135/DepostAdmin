import React, { useState } from 'react';
import { Button } from './ui/button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Make sure to include the CSS

const AuthForm = ({ setView, isInstalled,userLogged }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login'); // Track the current mode
  const [error, setError] = useState<string | null>(null);
  const [isGoogleSigningIn, setIsGoogleSigningIn] = useState(false);

  function goToLinkedIn() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length === 0) {
        return;
      }
      const currentTab = tabs[0];
      const currentUrl = currentTab.url;
      if (currentUrl && !currentUrl.includes('linkedin.com')) {
        // Redirect to LinkedIn
        chrome.tabs.update(currentTab.id, { url: 'https://www.linkedin.com/' });
      } else {
      }
    });
  }

  const handleRegisterSocial = async (userData: any) => {
    chrome.runtime.sendMessage(
      { action: 'apiRequest', payload: { method: 'registerSocialUser', userData } },
      (response) => {
        setIsGoogleSigningIn(false);
        if (response?.response?.status) {
          if (isInstalled) {
            chrome.runtime.sendMessage({ action: 'openSidePanel' });
            userLogged();
          } else {
            if (response.response.onboarding) {
              toast.success('Login successfully: Welcome to Depost AI', {
                position: 'top-center',
                autoClose: 1000,
              });
              setTimeout(() => {
                setView('home');
              }, 1000);
            } else {
              toast.success('Login successfully: Please complete obarding process', {
                position: 'top-center',
                autoClose: 1000,
              });
              setTimeout(() => {
                setView('onboarding');
              }, 1000);
            }
          }
        } else {
          setError('Error during social login. Please try again.');
        }
      },
    );
  };

  const handleGoogleSignIn = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setIsGoogleSigningIn(true);
    chrome.runtime.sendMessage({ action: 'apiRequest', payload: { method: 'socialLogin' } }, (response) => {
      if (response.success) {
        const responseData = response.response;
        const userData = {
          token: responseData,
        };
        handleRegisterSocial(userData);
      } else {
        setError('Error during social login. Please try again.');
        setIsGoogleSigningIn(false);
      }
    });
  };

  const isLogin = mode === 'login';

  return (
    <div className="absolute inset-0 z-[1000] bg-grey-layer2-normal">
      <ToastContainer />
      <div className="w-full h-full flex flex-col m-auto max-w-[430px] px-[20px]">
        {/* Spacer */}
        <div className="flex-[0.5]"></div>

        {/* Logo and Title */}
        <div className="shrink-0 text-center">
          <div
            className="inline-flex items-center p-4 rounded-full bg-white"
            style={{ boxShadow: 'rgba(0, 0, 0, 0.08) 0px 2px 16px' }}>
            <img className="size-[40px]" src={chrome.runtime.getURL('icons/icon128.png')} alt="Logo" />
          </div>
          <div className="text-text-primary-1 mt-[12px] text-[24px] title-font">{isLogin ? 'Log in' : 'Welcome'}</div>
          {!isLogin && <div className="text-text-secondary mt-[8px] text-sm">Signup for free</div>}
        </div>

        {/* Spacer */}
        <div className="shrink-0 mt-[60px]">
          <div className="text-center flex gap-3 flex-col">
            {/* Authentication Buttons */}
            <div
              className="grid gap-y-4 gap-x-4 font-semibold items-center relative"
              style={{
                gridTemplateColumns:
                  '[main-start] 1fr [icon-start] 20px [icon-end text-start] max-content [text-end] 1fr [main-end]',
                gridAutoRows: '48px',
              }}>
              <Button
                variant="outline"
                className="text-black bg-white font-semibold relative"
                onClick={(event) => handleGoogleSignIn(event)}
                disabled={isGoogleSigningIn}>
                {isGoogleSigningIn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
                    <span className="loader"></span>
                  </div>
                )}
                <img
                  src={chrome.runtime.getURL('icons/google_logo.svg')}
                  alt="Google Logo"
                  className={`h-5 mr-3 relative z-2 ${isGoogleSigningIn ? 'opacity-50' : ''}`}
                />
                <span className="relative z-2 text-base">
                  {isLogin ? 'Continue with Google' : 'Signup with Google'}
                </span>
              </Button>
              {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-[1]"></div>

        {/* Footer */}
        <div className="shrink-0 pb-8 text-sm">
          <div className="flex items-start items-center text-sm">
            <img src={chrome.runtime.getURL('icons/lock-check.svg')} alt="lock" className="h-4" />
            <span className="leading-none align-top ml-1">We never share your data. No spam messages</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
