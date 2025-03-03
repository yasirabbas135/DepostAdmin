// apiService.ts
import API_CONFIG from './apiConfig';

interface RequestOptions extends RequestInit {
  token?: string; // Optional Bearer token
}

// Generic function to handle HTTP requests
async function request(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  body?: any,
  token?: string,
): Promise<{ success: boolean; data?: any; error?: { message: string; status?: number } }> {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    // Check for HTTP errors
    if (!response.ok || !data.status) {
      return {
        success: false,
        error: {
          message: data || `HTTP error: ${response.statusText}`,
          status: response.status,
        },
      };
    }

    // Parse and return successful response
    return data;
  } catch (error) {
    // Handle network or unexpected errors
    console.error(`Request failed------>: ${error.status} ${method} ${url}`, error);
    return {
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unexpected error occurred',
        status: 500,
      },
    };
  }
}

// Function for POST requests
async function post(api: keyof typeof API_CONFIG, endpoint: string, body: any, token?: string): Promise<any> {
  if (!API_CONFIG[api]) {
    return {
      success: false,
      error: { message: `API configuration for ${api} not found.` },
    };
  }

  const url = `${API_CONFIG[api].BASE_URL}${API_CONFIG[api].ENDPOINTS[endpoint]}`;
  return await request('POST', url, body, token);
}

// Function for GET requests
async function get(
  api: keyof typeof API_CONFIG,
  endpoint: string,
  params?: Record<string, any>,
  token?: string,
): Promise<any> {
  if (!API_CONFIG[api]) {
    return {
      success: false,
      error: { message: `API configuration for ${api} not found.` },
    };
  }
  let url = `${API_CONFIG[api].BASE_URL}${API_CONFIG[api].ENDPOINTS[endpoint]}`;
  // Replace placeholders with actual parameter values
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, value);
    });
  }
  // Handle query params for GET request
  if (params && Object.keys(params).length > 0) {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    url += `?${queryParams.toString()}`;
  }
  return await request('GET', url, undefined, token);
}

// Function for PUT requests
async function put(
  api: keyof typeof API_CONFIG,
  endpoint: string,
  body: any,
  params?: Record<string, any>,
  token?: string,
): Promise<any> {
  if (!API_CONFIG[api]) {
    return {
      success: false,
      error: { message: `API configuration for ${api} not found.` },
    };
  }
  let url = `${API_CONFIG[api].BASE_URL}${API_CONFIG[api].ENDPOINTS[endpoint]}`;

  // Replace placeholders with actual parameter values
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, value);
    });
  }

  return await request('PUT', url, body, token);
}

// Function for DELETE requests
async function del(
  api: keyof typeof API_CONFIG,
  endpoint: string,
  params?: Record<string, any>,
  token?: string,
): Promise<any> {
  if (!API_CONFIG[api]) {
    return {
      success: false,
      error: { message: `API configuration for ${api} not found.` },
    };
  }
  let url = `${API_CONFIG[api].BASE_URL}${API_CONFIG[api].ENDPOINTS[endpoint]}`;
  // Replace placeholders with actual parameter values
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`{${key}}`, value);
    });
  }
  return await request('DELETE', url, undefined, token);
}

// Export the functions for external use
export { post, get, put, del };
