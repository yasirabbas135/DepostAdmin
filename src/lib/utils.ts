import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { COMMENTARY_SELECTOR, OPTIONS_SELECTOR, POLL_ELEMENT_SELECTOR, SHARE_BOX_MODAL_CLASS } from './constants';

import { getUserPreferencesData } from '~/entries/background/apiRequestService';
import { string_to_unicode_variant } from 'string-to-unicode-variant';
import { jwtDecode } from 'jwt-decode';
import { platform } from 'os';
import { CrossIcon } from 'lucide-react';
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


/**
 * Highlights the first non-empty paragraph inside a container.
 * If no valid paragraph is found, removes any existing highlight hooks.
 *
 * @param {Object} [options] - Configuration options.
 * @param {string} [options.containerSelector='.editor-content > .ql-editor'] - The container where paragraphs reside.
 * @param {string} [options.paragraphSelector='p'] - The selector for paragraphs within the container.
 * @param {function} [options.hook=highlightHook] - The function to call to highlight the paragraph.
 * @param {number} [options.skipCount=0] - Number of initial paragraphs to skip (if needed).
 * @returns {HTMLElement|null} The highlighted paragraph element, or null if none was found.
 */
export function getFirstValidParagraph({
  containerSelector = '.editor-content > .ql-editor',
  paragraphSelector = 'p',
  skipCount = 0,
} = {}) {

  // Select all paragraphs within the specified container.
  const paragraphs = document.querySelectorAll(`${containerSelector} > ${paragraphSelector}`);
  let firstValidParagraph = null;
  
  // Loop through paragraphs (skipping the first 'skipCount' if necessary)
  for (let i = skipCount; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    const text = paragraph.textContent.trim();
    const html = paragraph.innerHTML.trim();
    
    // Check if the paragraph has meaningful text (ignoring paragraphs that are empty or contain only <br> tags)
    if (text !== '' && !/^(<br\s*\/?>)+$/i.test(html)) {
      firstValidParagraph = paragraph;
      break;
    }
  }
  
  return firstValidParagraph;
}

export async function loadStyles(shadowRoot, cssFile) {
  // Get the full URL of the CSS file
  const cssUrl = chrome.runtime.getURL(cssFile);
  try {
    // Fetch the CSS file content
    const response = await fetch(cssUrl);
    const cssContent = await response.text();

    // Create a <style> element
    const styleElement = document.createElement('style');
    styleElement.textContent = cssContent;

    // Append the <style> element to the Shadow DOM
    shadowRoot.appendChild(styleElement);
  } catch (error) {
    console.error('Failed to load styles:', error);
  }
}
export function toggleExpand(items: HTMLElement, button: HTMLElement, currentState: boolean): boolean {
  const newState = !currentState;

  items.style.transform = newState ? 'scaleX(1)' : 'scaleX(0)';
  button.style.borderTopRightRadius = newState ? '0px' : '';
  button.style.borderBottomRightRadius = newState ? '0px' : '';
  button.style.borderRight = newState ? 'none' : '';

  return newState;
}



export function replaceUserNameWithMention(element, authors) {
  const authorsArray = Array.isArray(authors) ? authors : [authors]; // Ensure authors is an array

  authorsArray.forEach(author => {
    const { name, profileUrl } = author;
    // Extract profile URN from profileUrl
    const urnMatch = profileUrl.match(/(?:urn%3Ali%3Afsd_profile%3A|urn:li:fsd_profile:)([^\s&]+)/);
     const profileUrn = urnMatch ? `urn:li:fsd_profile:${urnMatch[1]}` : null;

    if (!profileUrn) {
      console.error('Invalid profile URL. Could not extract profile URN.');
      return;
    }

    // Create the mention tag
    const mentionTag = `<a class="ql-mention" href="#" data-entity-urn="${profileUrn}" data-guid="0" data-object-urn="${profileUrn}" data-original-text="${name}" spellcheck="false" data-test-ql-mention="true">${name}</a>`;

    // Traverse the DOM and replace text nodes
    traverseAndReplace(element, name, mentionTag);
  });
}

function traverseAndReplace(node, name, mentionTag) {
  if (node.nodeType === Node.TEXT_NODE) {
    replaceNameInTextNode(node, name, mentionTag);
  } else {
    node.childNodes.forEach((child) => traverseAndReplace(child, name, mentionTag));
  }
}

function replaceNameInTextNode(node, name, mentionTag) {
  const text = node.textContent;
  let index = text.indexOf(name);
  while (index !== -1) {
    // Check if the name is preceded by a word boundary
    const prevChar = index > 0 ? text.charAt(index - 1) : null;
    const isPrecededByWordBoundary = prevChar === null || isBoundaryChar(prevChar);
    // Check if the name is followed by a word boundary
    const nextChar = index + name.length < text.length ? text.charAt(index + name.length) : null;
    const isFollowedByWordBoundary = nextChar === null || isBoundaryChar(nextChar);
    // If both boundaries are word boundaries, replace the name
    if (isPrecededByWordBoundary && isFollowedByWordBoundary) {
      // Split the text node into three parts: before, name, and after
      const before = text.substring(0, index);
      const after = text.substring(index + name.length);
      // Replace the name with the mention tag
      const newNode = document.createTextNode(before);
      node.parentNode.insertBefore(newNode, node);
      const mentionElement = document.createElement('span');
      mentionElement.innerHTML = mentionTag;
      node.parentNode.insertBefore(mentionElement, node);
      node.textContent = after;
      // Move the node reference to the next part
      node = node.nextSibling;
      // Adjust index for the next search
      index = newNode.textContent.indexOf(name);
    } else {
      // Move past this occurrence to check the next one
      index += name.length;
    }
  }
}

function isBoundaryChar(char) {
  return !char.match(/[a-zA-Z0-9\u00C0-\u1FFF\u2C00-\uD7FF\w]/);
}



// Function to escape special characters in the name
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function isUnicode(text) {
  // Define ranges to ignore
  const ignoreRanges = [
    { start: 0x2190, end: 0x21ff }, // Arrows
    { start: 0x2600, end: 0x26ff }, // Miscellaneous symbols
  ];

  // Define specific characters to ignore
  const ignoreChars = new Set([
    '|',
    '➔',
    '➞',
    '➡',
    '↪',
    '-',
    '*',
    '•',
    '☑',
    '→',
    '⤴',
    '⤵',
    '⤹',
    '⤻',
    '⟳',
    '↳',
    '↓',
    '↕',
    '⤷',
    '↔',
    '⇨',
    '➤',
    '✨',
    '✦',
    '👉',
    '⭐',
    '✔',
    '➡️',
    '✅',
    '➞',
    '♻️',
    '❌',
    '🟢',
    '🔴',
    '⇢',
    '⇗',
    '↗',
    '↱',
    '➙',
    '➥',
  ]);

  // Helper function to check if a character is ignored
  function isIgnored(char) {
    const code = char.charCodeAt(0);
    return ignoreChars.has(char) || ignoreRanges.some((range) => code >= range.start && code <= range.end);
  }

  // Check remaining characters for Unicode
  return [...text].some((char) => {
    const code = char.charCodeAt(0);
    return code > 127 && !isIgnored(char);
  });
}



export const applyFont = (dataStyle: string, text: string): string => {  
  if (dataStyle !== 'changecase') {
    if (isUnicode(text)) {
       return text.normalize('NFKC');
    }
  }
    switch (dataStyle) {
      case 'serif.bold':
        return string_to_unicode_variant(text, 'b');
      case 'serif.italic':
        return string_to_unicode_variant(text, 'i');
      case 'serif.bold-italic':
        return string_to_unicode_variant(text, 'bi');
      case 'sans-serif.normal':
        return string_to_unicode_variant(text, 's');
      case 'sans-serif.bold':
        return string_to_unicode_variant(text, 'bs');
      case 'sans-serif.italic':
        return string_to_unicode_variant(text, 'is');
      case 'sans-serif.bold-italic':
        return string_to_unicode_variant(text, 'bis');
      case 'script.normal':
        return string_to_unicode_variant(text, 'c');
      case 'script.bold':
        return string_to_unicode_variant(text, 'bc');
      case 'fraktur.normal':
        return string_to_unicode_variant(text, 'g');
      case 'fraktur.bold':
        return string_to_unicode_variant(text, 'bg');
      case 'mono-space.normal':
        return string_to_unicode_variant(text, 'm');
      case 'double-struck':
        return string_to_unicode_variant(text, 'd');
      case 'fullwidth':
        return string_to_unicode_variant(text, 'w');
      case 'square':
        return string_to_unicode_variant(text, 'q');
      case 'circle':
        return string_to_unicode_variant(text, 'o');
      case 'strikethrough':
        return string_to_unicode_variant(text, 'sans', 'strike');
      case 'underline':
        return string_to_unicode_variant(text, 'sans', 'underline');
      case 'changecase':
        return text.toUpperCase();
      default:
        return text; // Return the original text if no match is found
    }
};

export function createDropdownOption(text: string, action: () => void): HTMLDivElement {
  const option = document.createElement('div');
  option.innerText = text;
  option.className = 'my-custom-dropdown-option';
  option.addEventListener('click', action);
  return option;
}



/**
 * Creates a button if it does not already exist in the specified div.
 * @param div - The div element to append the button to.
 * @param buttonText - The text to display on the button.
 * @param buttonClass - The class name to identify the button.
 * @param clickHandler - The function to handle button clicks.
 */
export function createButtonIfNotExists(
  div: CommentDivElement,
  buttonText: string,
  buttonClass: string,
  isReplyBox: boolean,
  clickHandler: (e: MouseEvent, button: HTMLButtonElement, isReplyBox: boolean) => void,
): void {
  if (!div.querySelector(`.${buttonClass}`)) {
    const button = createButtonElement(buttonText, buttonClass, isReplyBox, clickHandler);
    div.appendChild(button);
  }
}
export type CommentDivElement = HTMLElement & {
  closest: (selector: string) => HTMLElement | null;
};

/**
 * Creates a button element with the specified properties.
 * @param buttonText - The text to display on the button.
 * @param buttonClass - The class name to identify the button.
 * @param clickHandler - The function to handle button clicks.
 * @returns The created button element.
 */
export function createButtonElement(
  buttonText: string,
  buttonClass: string,
  isReplyBox: boolean,
  clickHandler: (e: MouseEvent, button: HTMLButtonElement, isReplyBox: boolean) => void,
): HTMLButtonElement {
  const button = document.createElement('button');
  button.innerText = buttonText;
  //button.classList.add(buttonClass, 'transparent-button'); // Add CSS class for styling
  button.classList.add(buttonClass, 'transparent-custom-button', 'custom-border');
  button.onclick = (e) => clickHandler(e, button, isReplyBox);
  return button;
}

export function createToggleSwitch(options = {}) {
  const {
    id = 'toggleSwitch', // Default ID
    labelText = 'Toggle Switch', // Default label text
  } = options;

  // Create input (toggle switch)
  const toggleSwitch = document.createElement('input');
  toggleSwitch.type = 'checkbox';
  toggleSwitch.className = 'li-toggle-switch';
  toggleSwitch.id = id;

  // Create label
  const toggleLabel = document.createElement('label');
  toggleLabel.className = 'li-toggle-label text-sm font-medium text-gray-700 ml-2';
  toggleLabel.setAttribute('for', id);

  // Create indicator span
  const switchIndicator = document.createElement('span');
  switchIndicator.className = 'li-toggle-indicator';

  // Append toggle switch, indicator, and text to label
  toggleLabel.appendChild(toggleSwitch);
  toggleLabel.appendChild(switchIndicator);
  toggleLabel.appendChild(document.createTextNode(labelText));

  return toggleLabel;
  // Append label to the containe
}

export function createCustomCheckbox(options = {}) {
  const {
    id = 'customCheckbox', // Default ID
    labelText = 'Custom Checkbox', // Default label text
    onChange = () => {},
  } = options;

  // Create a shadow host element
  const checkboxWrapper = document.createElement('div');

  // Attach shadow DOM to the wrapper
  const shadow = checkboxWrapper.attachShadow({ mode: 'open' });

  // Link to external CSS file (shadow DOM requires linking external stylesheets like this)

  // Create the checkbox input
  const toggleSwitch = document.createElement('input');
  toggleSwitch.type = 'checkbox';
  toggleSwitch.className = 'custom-checkbox';
  toggleSwitch.id = id;

  toggleSwitch.addEventListener('change', onChange);

  // Create the label for the checkbox
  const toggleLabel = document.createElement('label');
  toggleLabel.className = 'custom-label';
  toggleLabel.setAttribute('for', id);
  toggleLabel.textContent = labelText;

  // Create a wrapper for the checkbox and label
  const customCheckboxContainer = document.createElement('div');
  customCheckboxContainer.className = 'custom-checkbox-container';

  // Append checkbox and label to the container
  customCheckboxContainer.appendChild(toggleSwitch);
  customCheckboxContainer.appendChild(toggleLabel);

  // Append the link to external CSS and the checkbox container to shadow DOM
  shadow.appendChild(customCheckboxContainer);

  // Return the checkbox wrapper (shadow host element)
  return checkboxWrapper;
}

export function createCustomToggleIcon(customButtonClass, icon = ''): HTMLSpanElement {
  const toggleIcon = document.createElement('span');
  toggleIcon.className = `li-button-app-icon ${customButtonClass}`;
  toggleIcon.appendChild(icon ? getIcon(18, 18, icon) : getIcon(18, 18));
  toggleIcon.style.cursor = 'pointer'; // Optional: Add pointer cursor for better UX
  toggleIcon.style.display = 'block'; // Set display to inline-block

  return toggleIcon;
}

// utils/storage.js

const getLocalStorage = async (key) => {
  const result = await chrome.storage.local.get(key);
  return result[key];
};


const setLocalStorage = async (key, value) => {
  await chrome.storage.local.set({ [key]: value });
};

export async function updatePreference(settingName, settingValue) {
  var preferences = await getUserPreferencesData();

  if (!preferences) {
    preferences = { preferences: { linkedin: {} } };
  }

  if (!preferences.preferences?.linkedin) {
    preferences.preferences.linkedin = {};
  }

  if (!preferences.preferences?.linkedin[settingName]) {
    preferences.preferences.linkedin[settingName] = {};
  }

  Object.assign(preferences.preferences?.linkedin[settingName], settingValue);

  const response = await chrome.runtime.sendMessage({
    action: 'apiRequest',
    payload: { method: 'updateUserPreferences', preferences },
  });
}

export const getTokenExpiry = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const expiry = decodedToken.exp;
    return expiry;
  } catch (error) {
    return null;
  }
};
export const decodeToken = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const expiry = decodedToken.exp * 1000; // convert to milliseconds
    const now = Date.now();

    if (expiry < now) {
      throw new Error('Token has expired');
    }

    return {
      id: decodedToken.sub,
      workspaceId: decodedToken.iss,
      role: decodedToken.role,
      admin: decodedToken.admin,
      userId: decodedToken.uid,
      accountId: decodedToken.aid,
    };
  } catch (error) {
    if (error.message === 'Token has expired') {
      return { error: 'Token has expired' };
    } else {
      return { error: 'Invalid token' };
    }
  }
};

export const isTokenExpiryValid = (token) => {
  try {
    const decodedToken = jwtDecode(token);
    const expiry = decodedToken.exp * 1000; // convert to milliseconds
    const now = Date.now();

    if (expiry < now) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

export function deleteTemplatesFromStorage(count: number): Promise<void> {
  return new Promise((resolve, reject) => {
    // Fetch stored templates
    chrome.storage.local.get({ templates: [] }, (result) => {
      if (chrome.runtime.lastError) {
        return reject('Failed to retrieve templates from storage: ' + chrome.runtime.lastError.message);
      }

      let templates: Template[] = result.templates || [];

      if (count > templates.length) {
        return reject('Cannot delete more templates than stored.');
      }

      // Remove the specified number of templates
      templates = templates.slice(0, templates.length - count);

      // Save the updated array back to storage
      chrome.storage.local.set({ templates }, () => {
        if (chrome.runtime.lastError) {
          return reject('Failed to save updated templates: ' + chrome.runtime.lastError.message);
        }
        resolve(); // Success
      });
    });
  });
}

export function fetchStoredTemplates(): Promise<Template[]> {
  //deleteTemplatesFromStorage(15);
  return new Promise((resolve, reject) => {
    chrome.storage.local.get({ templates: [] }, (result) => {
      if (chrome.runtime.lastError) {
        return reject('Failed to retrieve templates from storage: ' + chrome.runtime.lastError.message);
      }
      resolve(result.templates || []); // Return stored templates
    });
  });
}

// Function to create an image element with the Chrome extension icon
export function getIcon(width = 48, hieght = 48, name = 'icons/icon128.png', className = '') {
  // Create an image element
  const img = document.createElement('img');

  if (className) {
    img.className = className;
  }
  // Set the source to your icon
  img.src = chrome.runtime.getURL(name); // or whichever size you need
  img.alt = 'Extension Icon';
  img.style.width = width + 'px'; // Set desired width
  img.style.height = hieght + 'px'; // Set desired height

  // Append the image to the body (or any other desired element)
  return img;
}

export function getChangAbleIcon(width, height, beforeIcon, hoverIcon, className = '',platform: string = 'linkedin') {
  const icon = document.createElement('img');
  icon.src = chrome.runtime.getURL(beforeIcon);
  icon.alt = 'Icon';
  icon.style.width = width + 'px';
  icon.style.height = height + 'px';
  icon.className = className;

  const container = document.createElement('span');
      if (platform === 'twitter') {
        container.style.padding = '2px';
        container.style.background = 'white';
      }
  container.appendChild(icon);

  container.addEventListener('mouseover', () => {
    icon.src = chrome.runtime.getURL(hoverIcon);
  });

  container.addEventListener('mouseout', () => {
    icon.src = chrome.runtime.getURL(beforeIcon);
  });

  return container;
}

// Function to create a tooltip
export function showTooltip(element, message, position = 'above', shadowRoot?: ShadowRoot,timeout?: number) {
  // Check if a tooltip already exists for this element
  if (element.dataset.hasTooltip) {
    return;
  }

  // Create a tooltip element
  const tooltip = document.createElement('span');
  tooltip.className = 'custom-d-tooltip'; // Add a class for styling
  if (!shadowRoot) {
    tooltip.style.position = 'absolute'; // Set the position to absolute  
    tooltip.style.opacity = '0'; // Start invisible
    tooltip.style.transition = 'opacity 0.3s'; // Add a transition effect
    tooltip.style.zIndex = '100000'; // Ensure tooltip appears above other elements
    tooltip.style.backgroundColor = 'black'; // Set the background color
    tooltip.style.color = '#fff'; // Set the text color
    tooltip.style.textAlign = 'center'; // Center the text
    tooltip.style.borderRadius = '5px'; // Add rounded corners
    tooltip.style.padding = '5px 10px'; // Add padding
    tooltip.style.fontSize = '12px'; // Set the font size
  }
  tooltip.innerText = message; // Set the tooltip text
  (shadowRoot)?shadowRoot.appendChild(tooltip):document.body.appendChild(tooltip); // Append tooltip to body

  // Mark the element as having a tooltip
  element.dataset.hasTooltip = true;

  // Remove tooltip on mouseleave
  element.addEventListener('mouseleave', () => {
    if (tooltip.parentNode) {
      tooltip.parentNode.removeChild(tooltip);
    }
    delete element.dataset.hasTooltip;
  });

  // Position the tooltip
  positionDropdownViewPort(tooltip, element, position,shadowRoot);

  // Fade in the tooltip
  tooltip.style.opacity = 1;
  tooltip.style.display = 'block';
  tooltip.style.zIndex = '100000';

  if (timeout) {
    setTimeout(() => {
      if (tooltip.parentNode) {
        tooltip.parentNode.removeChild(tooltip);
      }
      delete element.dataset.hasTooltip;
    }, timeout);
  }
}

export interface Template {
  name: string;
  template: string;
}

export function extractStringArray(response) {
  try {
    // Check if response is an object; if so, convert it to a string
    if (typeof response === 'object') {
      response = JSON.stringify(response);
    }

    // Parse the JSON response
    const jsonResponse = JSON.parse(response);

    // Extract the output string from the response property
    const outputString = jsonResponse.response;

    // Use a regular expression to find the array within the output string
    const arrayMatch = outputString.match(/\[(.*?)\]/s);

    if (arrayMatch) {
      // Parse the array from the matched string
      const stringArray = JSON.parse(arrayMatch[0]);
      return stringArray;
    }

    return []; // Return an empty array if no match is found
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return []; // Return an empty array if parsing fails
  }
}

// utils/toast.js

// utils/toast.ts
function createToastElement(buttonText = 'Login Now'): HTMLElement {
  const toastElement = document.createElement('div');
  toastElement.classList.add('my-extension-toast');
  toastElement.style.background = 'rgba(255, 255, 255)'; // transparent black background
  toastElement.style.color = 'rgba(0, 0, 0, 0.87);'; // white text
  toastElement.style.padding = '10px';
  toastElement.style.borderRadius = '5px';
  toastElement.style.boxShadow =
    ' rgba(0, 0, 0, 0.2) 0px 5px 5px -3px,rgba(0, 0, 0, 0.14) 0px 8px 10px 1px,rgba(0, 0, 0, 0.12) 0px 3px 14px 2px';
  toastElement.style.position = 'fixed';
  toastElement.style.borderRadius = '15px';
  toastElement.style.top = '50%';
  toastElement.style.left = '50%';
  toastElement.style.transform = 'translate(-50%, -50%)';
  toastElement.style.zIndex = '100000';

  const messageElement = document.createElement('span');
  messageElement.id = 'toast-notification-message';
  messageElement.textContent = 'You need to be logged in to create posts.';

  const loginNowButton = document.createElement('button');
  loginNowButton.id = 'toast-login-now';
  loginNowButton.classList.add('login-now', 'btn-primary');
  loginNowButton.style.fontWeight = 'bold';
  loginNowButton.textContent = buttonText;

  const closeButton = document.createElement('span');
  closeButton.id = 'toast-notification-close';
  closeButton.classList.add('custom-close-icon');

  closeButton.addEventListener('click', () => {
    hideToast(toastElement);
  });

  toastElement.appendChild(messageElement);
  toastElement.appendChild(loginNowButton);
  toastElement.appendChild(closeButton);

  document.body.appendChild(toastElement);

  return toastElement;
}

export function getErrorMessage(error) {
  const status = error?.status;
  switch (status) {
    case 400:
      return 'Please check your input and try again.';
    case 401:
      return 'Your session has expired. Please log in again.';
    case 402:
      return 'You exceeded your current word limit. Please check your plan and billing details.';
    case 403:
      return "You don't have permission to perform this action.";
    case 404:
      return 'The requested resource could not be found.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return "We're experiencing technical difficulties. Please try again later.";
    case 503:
      return 'The service is temporarily unavailable. Please try again shortly.';
    default:
      return error?.message || 'An unexpected error occurred. Please try again.';
  }
}

function applyDarkModeStyles(shadowRoot) {
  const isDarkMode = document.documentElement.classList.contains('theme--dark');

  const style = shadowRoot.querySelector('style') || document.createElement('style');
  style.textContent = isDarkMode
    ? `
        .toolbar button {
            color: #ffffff !important;
        }
        .settings-btn svg,
        .template-btn svg {  
            fill: #ffffff !important;      
        }
        .create-post-box textarea {
            background: none !important;
            color: #ffffff !important;
        }
        .template-btn {
            background: none !important;
        }
        .template-btn:hover {
            background-color: #2d2d2d !important;
        }
        .settings-btn {
            background: none !important;
        }
        .settings-btn:hover {
            background-color: #2d2d2d !important;
        }
    `
    : `
        .toolbar button {
            color: #000000;
        }
        .settings-btn svg,
        .template-btn svg {  
            fill: #333333;      
        }
        .create-post-box textarea {
            background: none ;
            color: #000000;
        }
        .template-btn {
            background: none;
        }
        .template-btn:hover {
            background-color: #f0f0f0;
        }
        .settings-btn {
            background: none ;
        }
        .settings-btn:hover {
            background-color: #f0f0f0 ;
        }
    `;

  shadowRoot.appendChild(style);
}

// Attach observer to detect LinkedIn theme changes
export function observeDarkMode(shadowRoot) {
  const observer = new MutationObserver(() => {
    applyDarkModeStyles(shadowRoot);
  });

  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

  // Apply styles initially
  applyDarkModeStyles(shadowRoot);
}

  export function updateCreditUsage(creditUsage, shadowRoot) {
    if (creditUsage?.account) {
      const { totalCredits, usedCredits, creditsRenewalDate } = creditUsage.account;

      let remainingCredits;
      let renewalDate = '';

      if (!totalCredits || totalCredits === 0) {
        remainingCredits = 'Unlimited';
      } else {
        remainingCredits = totalCredits - usedCredits;
        renewalDate = formatDate(creditsRenewalDate, 'dd MMM yyyy');
      }

      // Update the credit number in the trigger
      shadowRoot.getElementById('remainingCredit').textContent = remainingCredits;

      // Update the popup values
      shadowRoot.getElementById('popupRemainingCredit').textContent = remainingCredits;

      if (renewalDate) {
        shadowRoot.getElementById('popupRenewalDate').textContent = renewalDate;
      } else {
        shadowRoot.getElementById('popupRenewalDate').parentElement.style.display = 'none'; // Hide renewal row for unlimited credits
      }
    }
  }

// Call this function when you create your Shadow DOM



function showToast(button: HTMLElement, message: string, buttonText: string = 'Login Now',shadowRoot?: any): void {
  let toastElement = shadowRoot ? shadowRoot.querySelector('.my-extension-toast'): document.body.querySelector('.my-extension-toast');

  if (!toastElement) {
    toastElement = createToastElement(buttonText);
  }

  const toastLoginNowButton = toastElement.querySelector('#toast-login-now');

  toastLoginNowButton?.addEventListener('click', () => {
    if (buttonText == 'Login Now') {
      chrome.runtime.sendMessage({ action: 'openOptionsPage' });
    } else {
      if (shadowRoot) {
        toastElement.classList.remove('show');
      } else {
        toastElement.style.display = 'none';
      }

    }
  });

  const toastNotificationMessage = toastElement.querySelector('#toast-notification-message');
  if (toastNotificationMessage) {
    toastNotificationMessage.textContent = message;
    toastElement.classList.add('show');
  }

  positionDropdownViewPort(toastElement as HTMLElement, button, 'above',shadowRoot);
}

function hideToast(toastElement: HTMLElement): void {
  toastElement.classList.remove('show');
}

export function positionDropdownTwitter(dropdown, type){
  dropdown.style.top = type ? `-450px` : `-320px`;
  dropdown.style.left = `250px`;
  dropdown.style.maxHeight = '60vh';
}

export function positionDropdownLinked(dropdown, type) {
  dropdown.style.top = type ? `172px` : `-40px`;
  dropdown.style.left = `250px`;
  dropdown.style.maxHeight = '80vh';
}
export function positionDropdownViewPort(
  dropdown: HTMLElement,
  toggleIcon: HTMLElement,
  placement: 'above' | 'below' | 'left' | 'right' = 'below',
  shadowRoot?: ShadowRoot,
  offsetX: number = 0,
  offsetY: number = 0,
): void {
  const iconRect = toggleIcon.getBoundingClientRect();
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;

  dropdown.style.position = 'fixed';
  let top, left;

  switch (placement) {
    case 'above':
      top = iconRect.top - dropdown.offsetHeight + offsetY;
      if (top < 0) {
        top = iconRect.bottom + offsetY; // Fallback to below
      }
      dropdown.style.top = `${top}px`;
      dropdown.style.left = `${iconRect.left + offsetX}px`;
      break;

    case 'below':
      top = iconRect.bottom + offsetY;
      if (top + dropdown.offsetHeight > viewportHeight) {
        top = iconRect.top - dropdown.offsetHeight + offsetY; // Fallback to above
      }
      dropdown.style.top = `${Math.max(0, top)}px`;
      dropdown.style.left = `${iconRect.left + offsetX}px`;
      break;

    case 'left':
      left = iconRect.left - dropdown.offsetWidth + offsetX;
      if (left < 0) {
        left = iconRect.right + offsetX; // Fallback to right
      }
      dropdown.style.top = `${iconRect.top + offsetY}px`;
      dropdown.style.left = `${left}px`;
      break;

    case 'right':
      left = iconRect.right + offsetX;
      if (left + dropdown.offsetWidth > viewportWidth) {
        left = iconRect.left - dropdown.offsetWidth + offsetX; // Fallback to left
      }
      dropdown.style.top = `${iconRect.top + offsetY}px`;
      dropdown.style.left = `${Math.max(0, left)}px`;
      break;
  }

  if (shadowRoot) {
    shadowRoot.appendChild(dropdown);
  } else {
    document.body.appendChild(dropdown);
  }
}

export function positionDropdown(
  dropdown: HTMLDivElement | HTMLElement,
  toggleIcon: HTMLElement,
  parentDiv: HTMLElement,
  placement: 'above' | 'below' | 'left' | 'right' = 'below',
): void {
  // Get bounding rectangle of the toggle icon and the parent div
  const iconRect = toggleIcon.getBoundingClientRect();
  const parentRect = parentDiv.getBoundingClientRect();
  const dropdownRect = dropdown.getBoundingClientRect(); // Get the bounding rectangle of the dropdown

  // Calculate the position of the dropdown based on the parent div's position
  switch (placement) {
    case 'above':
      dropdown.style.top = `${iconRect.top - parentRect.top - dropdownRect.height}px`;
      dropdown.style.left = `${iconRect.left - parentRect.left}px`;
      break;
    case 'below':
      dropdown.style.top = `${iconRect.bottom - parentRect.top}px`;
      dropdown.style.left = `${iconRect.left - parentRect.left}px`;
      break;
    case 'left':
      dropdown.style.top = `${iconRect.top - parentRect.top}px`;
      dropdown.style.left = `${iconRect.left - parentRect.left - dropdownRect.width}px`;
      break;
    case 'right':
      dropdown.style.top = `${iconRect.top - parentRect.top}px`;
      dropdown.style.left = `${iconRect.right - parentRect.left}px`;
      break;
    default:
      throw new Error(`Invalid placement: ${placement}`);
  }
}


  export const formatDate = (dateString, format) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
function formatText(line: string): string {
  return line
    .replace(/\*\*\*(.*?)\*\*\*/g, (match, p1) => p1) // Bold + Italic
    .replace(/\*\*(.*?)\*\*/g, (match, p1) => p1) // Bold
    .replace(/\*(.*?)\*/g, (match, p1) => p1) // Italic
    .replace(/__(.*?)__/g, (match, p1) => p1) // Bold using underscores
    .replace(/_(.*?)_/g, (match, p1) => p1) // Italic using underscores
    .replace(/`(.*?)`/g, '<code>$1</code>') // Inline code
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>') // Links
    .replace(/@(\w+)/g, '<strong>@$1</strong>') // Mentions
    .replace(/#(\w+)/g, '<span class="hashtag">#$1</span>') // Hashtags
    .replace(/^\* (.*)/gm, '• $1')
    .replace(/(•.*?)(?=\n*•)/g, '$1<br>') // Converts "* item" to "• item" without bolding it
    .trim();
}

export function formatCurrency(amount: number, min = 2, max = 2, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  }).format(amount);
}

export function formatNumber(num: number, min = 2, max = 2) {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: min,
    maximumFractionDigits: max,
  }).format(num);
}

export {
  createToastElement,
  showToast,
  hideToast,
  formatText,
  getLocalStorage,
  setLocalStorage,
};
