import {
  FEED_UPDATE_V2_SELECTOR,
} from '~/lib/constants';
import {  loadStyles, positionDropdown, positionDropdownViewPort, showTooltip } from '~/lib/utils';
import { getPostDetail } from './linkedinUtils';
let isProfileSyncDialogVisible = false; // New flag for profile sync dialog

// async function showSyncManagerDialog(button, container, shadowRoot) {
//   const options: DropdownOptions = {
//     title: 'Manage Post Sync',
//     buttons: [],
//   };

//   const dropdown = createDropdown(shadowRoot, options, button);
//   dropdown.style.left = '50%';
//   dropdown.style.top = '20%';
//   dropdown.style.position = 'fixed';
//   // positionDropdown(dropdown, button, container,'above');
//   await loadSyncContent(dropdown, shadowRoot);
// }

let isDropdownVisible = false;

async function showSyncManagerDialog(button, container, shadowRoot) {
  const dropdown = shadowRoot.querySelector('#action-dropdown');

  if (isDropdownVisible && dropdown) {
    // If the dropdown is visible, hide it and update the flag
    dropdown.style.display = 'none';
    isDropdownVisible = false;
    return; // Exit early
  } else if (dropdown) {
    // If the dropdown exists but is hidden, show it and update the flag
    dropdown.style.display = 'block';
    isDropdownVisible = true;
    return;
  }

  // Dropdown not created yet, create it
  const options: DropdownOptions = {
    title: 'Manage Post Sync',
    buttons: [],
  };

  const newDropdown = createDropdown(shadowRoot, options, button);
  newDropdown.style.left = '50%';
  newDropdown.style.top = '20%';
  newDropdown.style.position = 'fixed';
  // positionDropdown(dropdown, button, container,'above');
  await loadSyncContent(newDropdown, shadowRoot);
  isDropdownVisible = true; // Update the flag after creating the dropdown
}

async function showProfileSyncDialog(button) {

  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.bottom = '100px';
  container.style.right = '80px';
  container.style.zIndex = '1000';
  const shadowRoot = container.attachShadow({ mode: 'open' });

  // Load existing styles
  await loadStyles(shadowRoot, 'contentstyle.css');

  const profileSyncDialog = shadowRoot.querySelector('#profile-sync-dialog');

  if (isProfileSyncDialogVisible && profileSyncDialog) {
    // If the dialog is visible, hide it and update the flag
    profileSyncDialog.style.display = 'none';
    isProfileSyncDialogVisible = false;
    return; // Exit early
  } else if (profileSyncDialog) {
    // If the dialog exists but is hidden, show it and update the flag
    profileSyncDialog.style.display = 'block';
    isProfileSyncDialogVisible = true;
    return;
  }


  // Dialog not created yet, create it
  const newDialog = await createProfileSyncDialog(shadowRoot);
  
  shadowRoot.appendChild(newDialog);
  positionDropdownViewPort(newDialog, button, 'below',shadowRoot);
  button.parentNode.appendChild(container);
 

  isProfileSyncDialogVisible = true;
}

function removeProfileSyncDialog(shadowRoot: ShadowRoot) {
  const profileSyncDialog = shadowRoot.querySelector('#profile-sync-dialog');
  if (profileSyncDialog) {
    shadowRoot.removeChild(profileSyncDialog);
    isProfileSyncDialogVisible = false;
  }
}

async function createProfileSyncDialog(shadowRoot: ShadowRoot): Promise<HTMLElement> {
  const dialog = document.createElement('div');
  dialog.id = 'profile-sync-dialog';
  dialog.className = 'custom-modal-container profile-sync-dialog';
  dialog.style.width = 'fit-content';
  dialog.style.maxWidth = '70vh';
  dialog.style.display = 'block';

  const content = document.createElement('div');
  content.className = 'modal-body';

  const header = createProfileSyncHeader(() => removeProfileSyncDialog(shadowRoot));
  const profileInfo = await getProfileInfo();

  if (profileInfo) {
    content.append(createProfileBasicInfo(profileInfo));
    content.append(createSyncButton());
  } else {
    content.innerHTML = '<div>Error loading profile information.</div>';
  }

  dialog.append(header, content);

  return dialog;
}


function createProfileBasicInfo(profileInfo: any): HTMLDivElement {
  const profileInfoDiv = document.createElement('div');
  profileInfoDiv.className = 'profile-basic-info';

  // Container for image + info
  const profileContainer = document.createElement('div');
  profileContainer.className = 'profile-container';

  // Image Container
  const imageContainer = document.createElement('div');
  imageContainer.className = 'profile-image-container';

  // Profile Image
  const profileImage = document.createElement('img');
  profileImage.src = profileInfo.avatarUrl;
  profileImage.alt = 'Profile Image';
  profileImage.className = 'profile-image';

  // Right Side Info
  const profileInfoRight = document.createElement('div');
  profileInfoRight.className = 'profile-info-right';

  // Profile Name
  const profileName = document.createElement('h3');
  profileName.textContent = profileInfo.name;
  profileName.className = 'profile-name';

  // Headline
  const headline = document.createElement('p');
  headline.textContent = profileInfo.headline;
  headline.className = 'profile-headline';

  // Followers Card
  const followersCard = document.createElement('div');
  followersCard.className = 'profile-followers-card';
  followersCard.textContent = `${profileInfo.followers} followers`;

  // Build structure
  imageContainer.appendChild(profileImage);
  profileInfoRight.append(profileName, headline, followersCard);
  profileContainer.append(imageContainer, profileInfoRight);
  profileInfoDiv.appendChild(profileContainer);

  return profileInfoDiv;
}

function createProfileSyncHeader(onClose: () => void): HTMLDivElement {
  const header = document.createElement('div');
  header.className = 'modal-header';

  const titleElement = document.createElement('h2');
  titleElement.textContent = 'Profile Sync';

  const closeBtn = createButton('', 'close-modal', onClose);
  closeBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 0 24 24" width="16px">
      <path d="M0 0h24v24H0V0z" fill="none"/>
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
    </svg>
  `;

  const headerRight = document.createElement('div');
  headerRight.className = 'dropdown-header-right';

  headerRight.append(closeBtn);
  header.append(titleElement, headerRight);

  return header;
}
type ProfileInfo = {
  profileId: string | null;
  name: string;
  headline: string; 
  avatarUrl: string;
  coverUrl: string;
  followers: number;
  location: string;
  about: string;
  profileUrl: string;

}

function getFsdProfileId() {
  // Select the anchor tag that contains the profile URL
  const linkElement = document.querySelector(
    '.pvs-entity__tertiary-action-with-vertical-alignment a[href*="profileUrn="]',
  );

  if (linkElement) {
    // Extract the 'profileUrn' parameter from the URL
    const profileUrl = new URL(linkElement.href);
    console.log('URL:', profileUrl);
    const profileUrn = profileUrl.searchParams.get('profileUrn');

    if (profileUrn) {
      // Extract the actual profile ID after 'urn:li:fsd_profile:'
      const profileId = profileUrn.split(':').pop();
      return profileId; // Return the profileId;
    }
  }

  return getFsdProfileFromActivityId(); // Return null if not found
}
function getFsdProfileFromActivityId() {
  // Find the activity section using stable class names
  const activitySection = document.querySelector('.feed-shared-update-v2__control-menu-container');
console.log('activitySection:', activitySection);
  if (!activitySection) return null;

  // Find the first profile image link containing the FSD profile ID
  const profileLink = activitySection.querySelector('a.update-components-actor__image[href*="miniProfileUrn"]');
console.log('profileLink:', profileLink);
  if (!profileLink) return null;
 const profileUrl = profileLink.getAttribute('href');
  // Extract and decode the URN parameter from the URL
  const urlParams = new URLSearchParams(profileLink.href.split('?')[1]);
  const miniProfileUrn = urlParams.get('miniProfileUrn');
console.log('miniProfileUrn:', miniProfileUrn);
  if (!miniProfileUrn) return null;

  // Decode and parse the URN to get the FSD profile ID
  const decodedUrn = decodeURIComponent(miniProfileUrn);
  const profileId = decodedUrn.split(':').pop();

  return profileId;
}

// Example usage
console.log(getFsdProfileId());

function getAboutDescription() {
  // 1. Find all header elements that may indicate a section title.
  const headers = document.querySelectorAll('h2.pvs-header__title');
  let aboutHeader = null;

  // Use includes() in case innerText returns "About About" or similar.
  for (const header of headers) {
    if (header.innerText.toLowerCase().includes('about')) {
      aboutHeader = header;
      break;
    }
  }

  if (!aboutHeader) {
    console.log('About header not found.');
    return null;
  }

  // 2. Get the section element that contains the "About" header.
  const section = aboutHeader.closest('section');
  if (!section) {
    console.log('About section container not found.');
    return null;
  }

  // 3. Within this section, the description is typically in the next structural container.
  // In our sample, it's the direct child with classes "display-flex ph5 pv3".
  const textContainer = section.querySelector(':scope > div.display-flex.ph5.pv3');
  if (!textContainer) {
    console.log('About text container not found.');
    return null;
  }

  // 4. Drill down to the inner container that holds the text.
  // We assume the first descendant <div> contains the description.
  const descriptionDiv = textContainer.querySelector('div');
  if (!descriptionDiv) {
    console.log('Description div not found.');
    return null;
  }

  // Remove potential "see more" buttons: clone the node, remove buttons, then get text.
  const clone = descriptionDiv.cloneNode(true);
  const buttons = clone.querySelectorAll('button');
  buttons.forEach((btn) => btn.remove());

  return clone.innerText.trim();
}

// Example usage:
console.log(getAboutDescription());




async function getProfileInfo(): Promise<ProfileInfo | null> {
  try {
    const profileSection = document.querySelector('section.artdeco-card');
    if (!profileSection) return null;

    // Extract profile image URL
    const profileImageElement =
      profileSection.querySelector('img.pv-top-card-profile-picture__image--show') ||
      profileSection.querySelector('img.profile-photo-edit__preview');
    const profileImageUrl = profileImageElement?.getAttribute('src') || '';

    // Extract profile name
    // const profileNameElement = profileSection.querySelector('h1.text-heading-xlarge');
    // const profileName = profileNameElement?.textContent?.trim() || '';

      const profileName = document.querySelector('div.mt2 h1')?.textContent?.trim() || '';

    // Extract headline
    const headlineElement = profileSection.querySelector('div.text-body-medium.break-words');
    const headline = headlineElement?.textContent?.trim() || '';

    // Extract followers count
    // const followersElement = profileSection.querySelector('ul.pv-top-card--list-bullet li:first-child span.t-bold');
    // const followersText = followersElement?.textContent?.trim() || '';
    // const followers = parseInt(followersText.replace(/,/g, ''), 10) || 0;

    const followersText =
      Array.from(document.querySelectorAll('ul li'))
        .find((li) => li.textContent?.includes('followers'))
        ?.querySelector('span.t-bold')?.textContent || '0';
    var followers = parseInt(followersText.replace(/,/g, ''), 10) || 0;

    if (!followers) {
      const followersElement = document.querySelector(".pvs-header__optional-link .pvs-entity__caption-wrapper");

if (followersElement) {
   followers = followersElement.textContent.match(/\d[\d,]*/)?.[0].replace(/,/g, '');
  console.log(`Followers: ${followers}`);
} else {
  console.log("Followers count not found.");
}
    }


    // Extract location
    const locationElement = profileSection.querySelector('span.text-body-small.inline.t-black--light');
    const location = locationElement?.textContent?.trim() || '';

    // Extract about section


    // Extract profile URL
    const profileUrlElement = profileSection.querySelector('a[data-test-app-aware-link]');

    // Extract cover image URL
    const coverImageElement = profileSection.querySelector('img.profile-background-image__image');
    const coverUrl = coverImageElement?.getAttribute('src') || '';

    // Extract profile ID (if available)
    const profileId = getFsdProfileId();
    const profileUrl = window.location.href;
    // Prepare JSON response
    const profileInfo: ProfileInfo = {
      profileId: profileId,
      name: profileName,
      headline,
      avatarUrl: profileImageUrl,
      coverUrl,
      profileUrl: profileUrl || '',
      location,
      about: getAboutDescription(),
      followers,
    };
    console.log('Profile Info:', profileInfo);

    return profileInfo;
  } catch (error) {
    console.error('Error extracting profile information:', error);
    return null;
  }
}

// Helper function to extract profile ID (if available)


function createSyncButton(): HTMLButtonElement {
  const syncButton = document.createElement('button');
  syncButton.textContent = 'Sync Profile';
  syncButton.className = 'btn-primary sync-profile-button';
  //   syncButton.addEventListener('click', () => {
  //     // Sync influencers
  //     handleSync(shadowRoot);
  //   });
  return syncButton;
}





function removeDropdown(shadowRoot: ShadowRoot) {
  const dropdown = shadowRoot.querySelector('#action-dropdown');
  if (dropdown) {
    shadowRoot.removeChild(dropdown);
    isDropdownVisible = false;
  }
}

function createDropdown(shadowRoot: ShadowRoot, options: DropdownOptions, triggerElement: HTMLElement) {
  const dropdown = document.createElement('div');
  dropdown.id = 'action-dropdown';
  dropdown.className = 'custom-modal-container';
  dropdown.style.width = 'fit-content';
  dropdown.style.maxWidth = '70vh';

  const content = document.createElement('div');
  content.className = 'modal-body';
  // Pass triggerElement into createHeader so that it’s available when we want to reload the list.
  const header = createHeader(
    options,  
    () => removeDropdown(shadowRoot),
  );
  dropdown.append(header, content);

  shadowRoot.appendChild(dropdown);

  return dropdown;
}

function createHeader(
  options: DropdownOptions,
  onClose: () => void,
) {
  const header = document.createElement('div');
  header.className = 'modal-header';

  const titleElement = document.createElement('h2');
  titleElement.textContent = options.title;

  const closeBtn = createButton('', 'close-modal', onClose);
  closeBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 0 24 24" width="16px">
      <path d="M0 0h24v24H0V0z" fill="none"/>
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
    </svg>
  `;

  const headerRight = document.createElement('div');
  headerRight.className = 'dropdown-header-right';

  headerRight.append(closeBtn);
  header.append(titleElement, headerRight);

  return header;
}


async function loadSyncContent(dropdown: HTMLElement, shadowRoot: ShadowRoot) {
  const content = dropdown.querySelector('.modal-body')!;
  content.classList.add('sync-manager-content');

  // Influencers list
  const influencers = [
    {
      id: 1,
      name: 'Justin Welsh',
      memberId: 'ACoAABrK2RkB8fRbk_HsFICTX8kCvOpP79skShQ',
    },
    {
      id: 2,
      name: 'Jane Smith',
      memberId: 'ACoAAAwp1RMBxG26M3Qkhm4klqLNr1bIplo6GhY',
    },
    {
      id: 3,
      name: 'Bob Johnson',
      memberId: 'ACoAAACGGz8B4INu9V_hVH2WSp0gKcPe4ad0M1s',
    },
    {
      id: 4,
      name: 'Emily Davis',
      memberId: 'ACoAAAD4GX4BScENIji6QoTu7_m8vC9m_doapuA',
    },
    {
      id: 5,
      name: 'Michael Brown',
      memberId: '',
    },
  ];

  const influencerList = createInfluencerList(influencers);
  content.appendChild(influencerList);

  // Date filters
  content.appendChild(createDateFilter());

  // Sync button
  const syncButton = document.createElement('button');
  syncButton.textContent = 'Sync Now';
  syncButton.className = 'btn-primary';
  syncButton.addEventListener('click', () => {
    // Sync influencers
    handleSync(shadowRoot);
  });
  content.appendChild(syncButton);
}

function createInfluencerList(influencers: any) {
  const wrapper = document.createElement('div');
  wrapper.className = 'selection-group influencer-list-container';

  // Select All
  const selectAll = document.createElement('label');
  selectAll.className = 'checkbox-item select-all';
  selectAll.innerHTML = `
    <input type="checkbox" id="select-all">
    <span class="check-label">Select All Influencers</span>
  `;
  selectAll.querySelector('input')!.addEventListener('change', toggleSelectAll);
  wrapper.appendChild(selectAll);

  // Influencers list
  const list = document.createElement('div');
  list.className = 'scroll-container';

  influencers.forEach((inf: any) => {
    if (inf.memberId) {
      // Ensure only influencers with memberIds are selectable
      const item = document.createElement('label');
      item.className = 'checkbox-item';
      item.innerHTML = `
        <input type="checkbox" value="${inf.memberId}">
        <span class="check-label">${inf.name}</span>
      `;
      list.appendChild(item);
    }
  });

  wrapper.appendChild(list);
  return wrapper;
}

async function handleSync(shadowRoot) {
  const selectedInfluencers = Array.from(shadowRoot.querySelectorAll('.influencer-list-container input:checked'))
    .flatMap((cb) => cb.value.split(',')) // Flatten the array in case multiple memberIds exist
    .filter((id) => id.trim() !== ''); // Remove empty values

  const selectedDate = shadowRoot.querySelector('input[name="date-filter"]:checked')?.value || 'past-24h';

  if (selectedInfluencers.length === 0) {
    alert('Please select at least one influencer.');
    return;
  }

  const encodedMemberIds = encodeURIComponent(JSON.stringify(selectedInfluencers));

  const searchUrl = `https://www.linkedin.com/search/results/content/?datePosted=%22${selectedDate}%22&fromMember=${encodedMemberIds}&origin=FACETED_SEARCH&sid=5x8&sortBy=%22date_posted%22&scrp=true`;

  console.log('Redirecting to:', searchUrl);
  window.location.href = searchUrl; // Refresh with the new search URL
}

function toggleSelectAll(e: Event) {
  const checkboxes = document.querySelectorAll('.influencer-list input[type="checkbox"]');
  const checked = (e.target as HTMLInputElement).checked;
  checkboxes.forEach((cb: HTMLInputElement) => (cb.checked = checked));
}

export async function createFloatingButton() {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.bottom = '100px';
  container.style.right = '80px';
  container.style.zIndex = '1000';
  const shadowRoot = container.attachShadow({ mode: 'open' });

  // Load existing styles
  await loadStyles(shadowRoot, 'contentstyle.css');

  const button = document.createElement('div');
  button.id = 'sync-manager-btn';
  button.innerHTML = `<img src="${chrome.runtime.getURL('icons/icon128.png')}" width="32" height="32">`;

  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.1)';
    button.style.transition = 'transform 0.2s';
  });
  showTooltip(button, 'Sync Manager');
  button.addEventListener('click', () => {
    showSyncManagerDialog(button, container, shadowRoot);
  });

  shadowRoot.appendChild(button);
  document.body.appendChild(container);
}


export async function addProfileButton() {
  if (!window.location.pathname.startsWith('/in/')) {
    return;
  }
  const profileActions = document.querySelector('.pv-top-card--photo-resize');
  if (!profileActions) {
    return;
  }

  // Check if the button already exists
  if (document.querySelector('.depost-profile-button')) {
   return;
  }

  // Create the button
  const button = document.createElement('button');
  button.className =
    'artdeco-button artdeco-button--circle artdeco-button--muted artdeco-button--3 artdeco-button--tertiary ember-view profile-top-card__subscribe-button depost-profile-button';
  button.type = 'button';
  button.innerHTML = `<img src="${chrome.runtime.getURL('icons/icon128.png')}" width="24" height="24">`;
  button.style.marginLeft = '10px';

  
  // Add click event listener (currently just logs to console)
  button.addEventListener('click', () => {
    showProfileSyncDialog(button);
  });

  // Insert the button before the first child of the profileHeader
  profileActions.parentNode.insertBefore(button, profileActions.nextSibling);
   }

function createDateFilter() {
  const wrapper = document.createElement('div');
  wrapper.className = 'date-filter-group';

  const options = [
    { id: 'past-24h', label: 'Last 24 hours' },
    { id: 'past-week', label: 'Past week' },
    { id: 'past-month', label: 'Past month' },
  ];

  options.forEach((opt) => {
    const div = document.createElement('label');
    div.className = 'radio-item';
    div.innerHTML = `
      <input type="radio" name="date-filter" value="${opt.id}">
      <span class="radio-label">${opt.label}</span>
    `;
    wrapper.appendChild(div);
  });

  return wrapper;
}

function createButton(text: string, className: string, onClick?: () => void) {
  const button = document.createElement('button');
  button.className = className;
  button.textContent = text;
  if (onClick) button.addEventListener('click', onClick);
  return button;
}

let isScraping = false;
let scrapedPostIds = new Set();
let scrollAttempts = 0;
let maxScrollAttempts = 5;
let observer;

export async function startScraping() {
  if (isScraping) return;
  isScraping = true;

  // Initialize Mutation Observer
  const feedContainer = document.querySelector('.scaffold-finite-scroll__content');
  if (feedContainer) {
    observer = new MutationObserver(handleMutations);
    observer.observe(feedContainer, { childList: true, subtree: true });
  }

  await processPage();
}

async function processPage() {
  while (isScraping) {
    const newPosts = getNewPosts();
    if (newPosts.length === 0) {
      if (!(await tryLoadMorePosts())) break;
      continue;
    }

    await processPosts(newPosts);
    scrollAttempts = 0; // Reset counter after finding new posts
  }

  stopScraping();
  console.log('Scraping complete. Total posts:', scrapedPostIds.size);
}

function getNewPosts() {
  return Array.from(document.querySelectorAll(FEED_UPDATE_V2_SELECTOR)).filter((post) => {
    console.log('Checking post:', post);
    const postId = getPostId(post);
    console.log('Post ID:', postId);
    return postId && !scrapedPostIds.has(postId);
  });
}

async function processPosts(posts) {
  for (const post of posts) {
    console.log(post);
    try {
      const postId = getPostId(post);
      console.log('Post ID:', postId);
      if (!postId) continue;

      scrapedPostIds.add(postId);
      post.dataset.scrapped = 'true'; // Mark element

      const postData = await getPostDetail(post);
      storePostData(postData); // Implement your storage logic
    } catch (error) {
      console.error('Error processing post:', error);
    }
  }
}

function getPostId(postElement) {
  // Implement reliable post ID extraction from element
  return postElement.getAttribute('data-urn');
}

async function tryLoadMorePosts() {
  const initialHeight = document.documentElement.scrollHeight;

  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth',
  });

  // Wait for content load
  await new Promise((resolve) => setTimeout(resolve, 2000));

  if (document.documentElement.scrollHeight === initialHeight) {
    scrollAttempts++;
    if (scrollAttempts >= maxScrollAttempts) {
      console.log('No more posts detected');
      return false;
    }
  }
  return true;
}

function handleMutations(mutations) {
  if (!isScraping) return;

  for (const mutation of mutations) {
    if (mutation.addedNodes.length) {
      processPage();
      break;
    }
  }
}

export function stopScraping() {
  isScraping = false;
  if (observer) observer.disconnect();
}
// Example storage implementation
function storePostData(postData) {
  // Implement your storage logic (e.g., send to backend, store in localStorage)
  console.log('Scraped post:', postData);
}