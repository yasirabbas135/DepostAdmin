// apiRequestsService.ts
import {
  decodeToken,
  isTokenExpiryValid,
} from '~/lib/utils';
import { post, get, del, put } from './apiService';

const storeUserData = async (token: any, onboarding: boolean = false) => {
  const userData = decodeToken(token);
  const userSessionData = {
    user: userData,
    onboarding: onboarding,
    token: token,
  };
  await chrome.storage.local.set({ userSession: userSessionData });
  await getUserMembership();

};

const updateOnboardingStatus = async (newStatus) => {
  try {
    // Retrieve the current user session data from local storage
    const result = await chrome.storage.local.get('userSession');
    const userSession = result.userSession;

    if (userSession) {
      // Update the onboarding status
      userSession.onboarding = newStatus;

      // Save the updated user session back to local storage
      await chrome.storage.local.set({ userSession });
    } else {
      console.error('User session not found in storage.');
    }
  } catch (error) {
    console.error('Failed to update onboarding status:', error);
  }
};

const isUserLoggedIn = async () => {
  const session = await getUserSession();
  if (!session) return false;
  const token = session.token;
  return isTokenExpiryValid(token);
};

const isAdmin = async () => {

  const result = await chrome.storage.local.get('userSession');
  
  const userSession = result.userSession;
   if (!userSession) return false;
    // Update the onboarding status
  return userSession?.user?.admin;
};

const getUserSession = async () => {
  const result = await chrome.storage.local.get('userSession');
  return result.userSession;
};
const removeUserSession = async () => {
  await chrome.storage.local.remove('userSession');
  await chrome.storage.local.remove('userPreferences');
  removeTonePromtData();
};

const updateUserPreferencesData = async (preferences: any) => {
  await chrome.storage.local.set({ userPreferences: preferences });
};

const getUserPreferencesData = async () => {
  const result = await chrome.storage.local.get('userPreferences');

  return result.userPreferences;
};

const removeUserPreferences = async () => {
  await chrome.storage.local.remove('userPreferences');
};

// User Authentication Functions
const loginUser = async (credentials: any) => {
  try {
    const response = await post('AUTH_API', 'login', credentials);

    if (response.status) storeUserData(response.data, response.onboarding);

    return response;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error; // Allow caller to handle the error
  }
};

const registerUser = async (userData: any) => {
  try {
    const response = await post('AUTH_API', 'register', userData);
    if (response.status) storeUserData(response.data);

    return response;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error; // Allow caller to handle the error
  }
};

const sendEmailVerification = async (userData: any) => {
  try {
    const response = await post('AUTH_API', 'sendVerificationEmail', userData);
    return response;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error; // Allow caller to handle the error
  }
};

const registerSocialUser = async (userData: any) => {
  try {
    const response = await post('AUTH_API', 'registerSocialAccount', userData);
    if (response.status) {
      // Assuming the API returns this format
      storeUserData(response.data, response.onboarding);
    }
    return response;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error; // Allow caller to handle the error
  }
};

const verifyEmail = async (userData: any) => {
  const response = await post('USERS_API', 'verifyEmail', userData);
  return response;
};

const refreshToken = async () => {
  try {
    const session = await getUserSession();
    if (!session) return;
    const response = await post('AUTH_API', 'refreshTokens', {}, session.token);
    if (response.status) {
      // Assuming the API returns this format
      storeUserData(response.data);
    }

    return response;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error; // Allow caller to handle the error
  }
};

// User Management Functions
const getUserById = async (userId: string) => {
  const session = await getUserSession();

  const token = session.token;

  try {
    const user = await get('USERS_API', 'getUserById', { userId }, token);

    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

const getUserMembership = async () => {
  const session = await getUserSession();

  const token = session.token;

  try {
    const response = await get('USERS_API', 'getUserMembership', {}, token);

    if (response.status)
      updateUserPreferencesData({
        preferences: response?.data?.preferences,
      });

    return response;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

const updateUser = async (userId: string, userData: any) => {
  const session = await getUserSession();
  const token = session.token;

  try {
    const response = await patch('USERS_API', 'updateUser', userData, { userId }, token);

    return response;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

const updateUserPreferences = async (preferences: any) => {
  const session = await getUserSession();
  const token = session.token;
  try {
    updateUserPreferencesData(preferences);
    const response = await post('USERS_API', 'updateUserPreferences', preferences, token);

    return response;
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
};

const createTemplate = async (templateData: any) => {
  const session = await getUserSession();
  const token = session.token;

  try {
    const response = await post('TEMPLATES_API', 'createTemplate', templateData, token);

    return response;
  } catch (error) {
    console.error('Error creating template:', error);
    throw error;
  }
};

const getViralPosts = async (
  page: number = 1,
  limit: number = 100,
  term: string = '',
  type?: string,
  reload: boolean = false,
) => {
 
  const session = await getUserSession();
  const token = session.token;

  const params = { page, limit, term, type };

  try {
    const response = await get('RECOMMENDATION_API', 'getViralPosts', params, token);
    return response;
  } catch (error) {
    console.error('Error fetching all tones:', error);
    throw error;
  }
};


// Logout Function
const logoutUser = () => {
  removeUserSession();

  return 'user logout successfully';
};

export {
  loginUser,
  isAdmin,
  registerUser,
  getUserById,
  updateUser,
  isUserLoggedIn,
  logoutUser,
  getUserSession,
  refreshToken,
  getUserMembership,
  updateUserPreferencesData,
  getUserPreferencesData,
  registerSocialUser,
  createTemplate,
  sendEmailVerification,
  verifyEmail,
  updateOnboardingStatus,
  getViralPosts,
};
