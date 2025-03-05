import browser from 'webextension-polyfill';
import {
  loginUser,
  registerUser,
  logoutUser,
  isUserLoggedIn,
  refreshToken,
  getUserMembership,
  registerSocialUser,
  sendEmailVerification,
  verifyEmail,
  getViralPosts,
  createInfluencer,
  createViralPost,
  getAllInfluencers,
  getInfluencerById,
  createBatchViralPost,
} from './apiRequestService';

async function handleAuthClick() {
  const token = await new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({ interactive: true }, (token) => {
      if (chrome.runtime.lastError || !token) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(token);
      }
    });
  });
  return token;
}
// src/entries/background/main.ts
chrome.runtime.onInstalled.addListener((details) => {
  chrome.scripting.registerContentScripts([
    {
      id: 'linkedin-content-script',
      matches: ['*://*.linkedin.com/*'],
      js: ['assets/src/entries/linkedinContent.bundle.js'],
      runAt: 'document_end',
    }
  ]);

  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
});

let isSidePanelOpen = false; // This variable keeps track of the side panel state

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'apiRequest') {
    // Keep the message channel open for async response
    handleApiRequest(request.payload)
      .then((response) => {
        if (request.payload.method === 'socialLogin' || request.payload.method === 'logout') {
          sendResponse({ success: true, response: response });
        } else {
          sendResponse({ success: response.status, response: response });
        }
      })
      .catch((error) => {
        console.error('API request failed:', error);
        sendResponse({ success: false, error: error });
      });

    return true; // Indicates that we will send a response asynchronously
  } else if (request.action === 'openSidePanel') {
    try {
      if (isSidePanelOpen) {
        // The side panel is currently open, so close it
        chrome.sidePanel.setOptions({ enabled: false });
        isSidePanelOpen = false; // Update the state
      } else {
        // The side panel is not open, so open it
        chrome.sidePanel.setOptions({ enabled: true });
        chrome.sidePanel.open({ tabId: sender.tab.id });
        isSidePanelOpen = true; // Update the state
      }
      sendResponse({ success: true });
    } catch (error) {
      console.error('Error toggling side panel:', error);
      sendResponse({ success: false, error: error.message });
    }
    return true; // Indicates that the response is sent asynchronously
  } 
});

// Function to handle API requests based on the action type
const handleApiRequest = async (payload: any) => {
  switch (payload.method) {
    case 'login':
      return await loginUser(payload.credentials);
    case 'socialLogin':
      return await handleAuthClick();
    case 'register':
      return await registerUser(payload.userData);
    case 'sendVerificationEmail':
      return await sendEmailVerification(payload.userData);
    case 'verifyEmail':
      return await verifyEmail(payload.userData);
    case 'registerSocialUser':
      return await registerSocialUser(payload.userData);
    case 'createInfluencer':
      return await createInfluencer(payload.influencerData);
    case 'getInfluencerById':
      return await getInfluencerById(payload.influencerId);
    case 'getAllInfluencers':
      return await getAllInfluencers( payload.page, payload.limit, payload.term, payload.reload);
    case 'createViralPost':
      return await createViralPost(payload.viralPostData);
     case 'createBatchViralPosts':
      return await createBatchViralPost(payload.viralPostsData);
    case 'getUserMembership':
      if (await isUserLoggedIn()) {
        return await getUserMembership();
      } else {
        throw new Error('User not logged in');
      }
    case 'logout':
      logoutUser();
      return { message: 'User logged out successfully' };
    case 'getViralPosts':
      if (await isUserLoggedIn()) {
        return await getViralPosts(payload.page, payload.limit, payload.term, payload.reload);
      } else {
        throw new Error('User not logged in');
      }
    default:
      throw new Error('Unknown API method');
  }
};
