import {
  FEED_UPDATE_V2_SELECTOR,
} from '~/lib/constants';
import {  loadStyles, showTooltip } from '~/lib/utils';
import { getPostDetail } from './linkedinUtils';

async function showSyncManagerDialog(button, container, shadowRoot) {
  const options: DropdownOptions = {
    title: 'Manage Post Sync',
    buttons: [],
  };

  const dropdown = createDropdown(shadowRoot, options, button);
  dropdown.style.left = '50%';
  dropdown.style.top = '20%';
  dropdown.style.position = 'fixed';
  // positionDropdown(dropdown, button, container,'above');
  await loadSyncContent(dropdown, shadowRoot);
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
    content,
    dropdown,
    shadowRoot,
    () => shadowRoot.removeChild(dropdown),
    triggerElement,
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