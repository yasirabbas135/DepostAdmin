import { LOCAL_BASE_URL, PROD_BASE_URL } from '~/lib/constants';

type ApiEndpoint = {
  BASE_URL: string;
  ENDPOINTS: {
    [key: string]: string;
  };
};

const BASE_URL = LOCAL_BASE_URL; // process.env.NODE_ENV === 'production' ? PROD_BASE_URL : LOCAL_BASE_URL;
const API_CONFIG: { [key: string]: ApiEndpoint } = {
  AUTH_API: {
    BASE_URL: `${BASE_URL}`,
    ENDPOINTS: {
      register: '/signup',
      registerSocialAccount: '/login/google/extension',
      login: '/login',
      logout: '/logout',
      refreshTokens: '/refresh-tokens',
      forgotPassword: '/forgot-password',
      resetPassword: '/reset-password',
      sendVerificationEmail: '/send-verification-email',
    },
  },
  USERS_API: {
    BASE_URL: `${BASE_URL}/users`,
    ENDPOINTS: {
      getUserById: '/{userId}', // Placeholder for userId
      updateUser: '/{userId}', // Placeholder for userId
      updateUserPreferences: '/update-preferences',
      getUserMembership: '/memberships',
      verifyEmail: '/verify-email',
      completeOnboarding: '/onboarding',
    },
  },
  RECOMMENDATION_API: {
    BASE_URL: `${BASE_URL}`,
    ENDPOINTS: {
      getViralPosts: '/viral-posts',
    },
  },
  BOOKMARKS_API: {
    BASE_URL: `${BASE_URL}/bookmarks`,
    ENDPOINTS: {
      createBookmark: '/',
      updateBookmark: '/{bookmarkId}',
      deleteBookmark: '/{bookmarkId}',
      getBookmarkById: '/{bookmarkId}',
      getAllBookmarks: '/',
    },
  },
  ACCOUNT_API: {
    BASE_URL: `${BASE_URL}/accounts`,
    ENDPOINTS: {
      getCreditUsage: '/usage', // Placeholder for userId
    },
  },
};

export default API_CONFIG;
