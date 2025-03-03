import {
  FEED_UPDATE_V2_SELECTOR,
  ENTITY_RESULT_CONTENT_SELECTOR,
  FEED_UPDATE_V2_DIALOGUE_SELECTOR,
  DEPOST_CAPTURE_ICON,
} from '~/lib/constants';
import { getIcon, positionDropdown, showToast, loadStyles } from '~/lib/utils';
import { isUserLoggedIn } from '../../../background/apiRequestService';
import { extractPostSummaryLinkedin } from './linkedinUtils';
import { createFloatingButton, startScraping, stopScraping } from './findAndGetPosts';

type DropdownOption = {
  text: string;
  action: () => void;
};

const createShadowContainer = async (): Promise<{ shadowContainer: HTMLDivElement; shadowRoot: ShadowRoot }> => {
  const shadowContainer = document.createElement('div');
  const shadowRoot = shadowContainer.attachShadow({ mode: 'open' });
  await loadStyles(shadowRoot, 'contentstyle.css');
  shadowContainer.style.position = 'absolute';
  shadowContainer.style.top = '0';
  shadowContainer.style.right = '0';
  return { shadowContainer, shadowRoot };
};

// export async function addPostCaptureActions(): Promise<void> {
//   const postDivs =
//     document.querySelectorAll<HTMLElement>(FEED_UPDATE_V2_SELECTOR) ||
//     document.querySelectorAll<HTMLElement>(ENTITY_RESULT_CONTENT_SELECTOR) ||
//     document.querySelectorAll<HTMLElement>(FEED_UPDATE_V2_DIALOGUE_SELECTOR);

//   postDivs.forEach((div) => {
//     div.style.position = 'relative';
//     let shadowContainer: HTMLDivElement | null = null;

//     div.addEventListener('mouseenter', async () => {
//       if (!shadowContainer) {
//         const { shadowContainer: sc, shadowRoot } = await createShadowContainer();
//         shadowContainer = sc;
//         div.appendChild(shadowContainer);
//       }

//       const shadowRoot = shadowContainer.shadowRoot;
//       if (!shadowRoot.querySelector(`.${DEPOST_CAPTURE_ICON}`)) {
//         const toggleIcon = createToggleIcon();
//         const dropdown = createSaveTemplateDropdown(div);

//         shadowRoot.appendChild(toggleIcon);
//         shadowRoot.appendChild(dropdown);

//         positionDropdown(dropdown, toggleIcon, shadowContainer);

//         toggleIcon.addEventListener('click', async () => {
//           if (!(await isUserLoggedIn())) {
//             showToast(toggleIcon, 'Log in to Depost AI to save templates');
//           } else {
//             dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
//             positionDropdown(dropdown, toggleIcon, shadowContainer);
//           }
//         });
//       }
//     });

//     div.addEventListener('mouseleave', () => {
//       if (shadowContainer) {
//         const shadowRoot = shadowContainer.shadowRoot;
//         const elementsToRemove = [
//           ...shadowRoot.querySelectorAll(`.${DEPOST_CAPTURE_ICON}`),
//           ...shadowRoot.querySelectorAll('.my-custom-dropdown'),
//         ];
//         elementsToRemove.forEach((element) => element.remove());
//       }
//     });
//   });
// }

// function createToggleIcon(): HTMLSpanElement {
//   const toggleIcon = document.createElement('span');
//   toggleIcon.className = `li-toggle-app-icon ${DEPOST_CAPTURE_ICON}`;
//   toggleIcon.appendChild(getIcon(22, 22));
//   toggleIcon.style.cursor = 'pointer';
//   return toggleIcon;
// }


export async function addPostCaptureActions(): Promise<void> {
  const postDivs =
    document.querySelectorAll<HTMLElement>(FEED_UPDATE_V2_SELECTOR) ||
    document.querySelectorAll<HTMLElement>(ENTITY_RESULT_CONTENT_SELECTOR) ||
    document.querySelectorAll<HTMLElement>(FEED_UPDATE_V2_DIALOGUE_SELECTOR);

  postDivs.forEach((div) => {
    div.style.position = 'relative';
    let shadowContainer: HTMLDivElement | null = null;

    // Find the existing LinkedIn menu icon container
    const menuIconContainer = div.querySelector<HTMLElement>('.feed-shared-control-menu');
    if (!menuIconContainer) return;

    // Check if the toggle icon already exists
    if (menuIconContainer.querySelector(`.${DEPOST_CAPTURE_ICON}`)) return;

    // Create and append the toggle icon to the left of the menu icon
    const toggleIcon = createToggleIcon();
    menuIconContainer.insertBefore(toggleIcon, menuIconContainer.firstChild);

    // Initialize the shadow container and dropdown
    toggleIcon.addEventListener('click', async () => {
      if (!shadowContainer) {
        const { shadowContainer: sc, shadowRoot } = await createShadowContainer();
        shadowContainer = sc;
        div.appendChild(shadowContainer);
      }

      const shadowRoot = shadowContainer.shadowRoot;
      if (!shadowRoot.querySelector('.my-custom-dropdown')) {
        const dropdown = createSaveTemplateDropdown(div);
        shadowRoot.appendChild(dropdown);
        positionDropdown(dropdown, toggleIcon, shadowContainer);
      }

      if (!(await isUserLoggedIn())) {
        showToast(toggleIcon, 'Log in to Depost AI to save templates');
      } else {
        const dropdown = shadowRoot.querySelector('.my-custom-dropdown') as HTMLElement;
        dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        positionDropdown(dropdown, toggleIcon, shadowContainer);
      }
    });
  });
}

function createToggleIcon(): HTMLSpanElement {
  const toggleIcon = document.createElement('span');
  toggleIcon.className = `li-toggle-app-icon ${DEPOST_CAPTURE_ICON}`;
  toggleIcon.appendChild(getIcon(20, 20));
  toggleIcon.style.cursor = 'pointer';
  toggleIcon.style.marginRight = '8px'; // Add some spacing between the toggle icon and the menu icon
  toggleIcon.style.marginTop = '4px'; // Add some spacing between the toggle icon and the menu icon
  return toggleIcon;
}

function createSaveTemplateDropdown(div: HTMLElement): HTMLDivElement {
  const dropdown = document.createElement('div');
  dropdown.className = 'my-custom-dropdown';
  dropdown.style.display = 'none';

  const options: DropdownOption[] = [
    {
      text: 'Bookmark Post',
      action: () => {
        dropdown.style.display = 'none';
        saveTemplate(div);
      },
    },
    { text: 'Bookmark Influencer', action: () => extractPostSummaryLinkedin(div) },
  ];

  options.forEach((option) => {
    const optionElement = createDropdownOption(option.text, option.action);
    dropdown.appendChild(optionElement);
  });

  return dropdown;
}



function createModal(postElement): HTMLElement {
  // Define and insert the modal HTML structure
  const modalHTML = `
  <div class="custom-template-modal" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDescription" style="display: none;">
      <div class="custom-modal-content">
          <input type="text" id="customTemplateName" class="custom-template-input" placeholder="Enter template name" aria-required="true">
          <div id="customErrorMessage" class="custom-error-message"></div> <!-- Moved error message here, below input -->
          <div class="custom-modal-footer">
              <span id="customConfirmSaveButton" class="custom-confirm-button">&#10003;</span> <!-- Tick icon -->
              <span id="customCancelButton" class="custom-cancel-button">&#10006;</span> <!-- Cross icon -->
          </div>
      </div>
  </div>
  `;
  postElement.insertAdjacentHTML('beforeend', modalHTML);

  return postElement.querySelector('.custom-template-modal');
}

function saveTemplate(postElement: HTMLElement) {
  const templateText = extractPostSummaryLinkedin(postElement);
  let modal = document.querySelector('.custom-template-modal');

  if (!modal) {
    modal = createModal(postElement);
  }
  modal.style.display = 'flex'; // Use flex for centering

  const templateNameInput = modal.querySelector('#customTemplateName') as HTMLInputElement;
  const errorMessage = modal.querySelector('#customErrorMessage') as HTMLElement;

  // Reset input and error message
  templateNameInput.value = '';
  errorMessage.textContent = ''; // Clear error message initially

  // Save button event listener
  modal.querySelector('#customConfirmSaveButton').onclick = async () => {
    const templateName = templateNameInput.value.trim();
    errorMessage.textContent = ''; // Clear previous error

    if (!templateName) {
      errorMessage.textContent = 'Template name cannot be empty.'; // Show error directly under input
      return;
    }

    const newTemplate = { name: templateName, content: templateText };
    saveTemplateToStorage(
      newTemplate,
      (errMsg: string) => {
        // Error callback
        errorMessage.textContent = errMsg; // Show error in modal under the input
      },
      () => {
        // Success callback
        modal.style.display = 'none'; // Hide the modal
        modal.remove(); // Remove the modal from the DOM
        showSuccessMessageInModal('Template saved successfully!', modal, postElement); // Replace modal with success message
      },
    );
  };

  // Cancel button event listener
  modal.querySelector('#customCancelButton').onclick = () => {
    modal.style.display = 'none'; // Close modal
    modal.remove(); // Remove from DOM if needed
  };
}

function showSuccessMessageInModal(message: string, modal: HTMLElement, parentDiv: HTMLElement) {
  // Create the success message element
  const successMessage = document.createElement('div');
  successMessage.className = 'custom-success-message';
  successMessage.textContent = message;
  successMessage.style.display = 'block';

  // Append the success message to the parent div
  parentDiv.appendChild(successMessage);

  // Set a timeout to hide and remove the success message and modal
  setTimeout(() => {
    // Fade out the success message before removing it
    successMessage.style.opacity = '0';

    setTimeout(() => {
      successMessage.style.display = 'none';
      successMessage.remove(); // Remove success message after fading out
    }, 500); // Wait for fade-out effect (500ms for transition)
  }, 2000); // Success message stays visible for 3 seconds
}

function createDropdownOption(text: string, action: () => void): HTMLDivElement {
  const option = document.createElement('div');
  option.innerText = text;
  option.className = 'my-custom-dropdown-option';
  option.addEventListener('click', action);
  return option;
}

if (window.location.hostname.includes('linkedin.com')) {
  createFloatingButton();
}
if (window.location.search.includes('scrp=true')) {
  // Wait for initial content
  setTimeout(() => {
    startScraping();

    // Add safety timeout
    setTimeout(stopScraping, 600000); // 5-minute timeout
  }, 3000);
}
