import {
  COMMENTARY_SELECTOR,
  ENTITY_RESULT_CONTENT_SELECTOR,
  FEED_UPDATE_V2_DIALOGUE_SELECTOR,
  FEED_UPDATE_V2_SELECTOR,
  OPTIONS_SELECTOR,
  POLL_ELEMENT_SELECTOR,
} from '~/lib/constants';

export function extractPostSummaryLinkedin(updateElement: HTMLElement): string {
  // Initialize the summary text variable
  let summaryText: string = '';

  // Extract commentary elements
  const commentaryElements: HTMLCollectionOf<HTMLElement> = updateElement.getElementsByClassName(COMMENTARY_SELECTOR);

    console.log('commentaryElements', commentaryElements);
  // Join the commentary text into a single string
  if (commentaryElements.length > 0) {
    summaryText = Array.from(commentaryElements)
      .map((el) => el.innerText)
      .join(' ');
  }

  return summaryText;
}

export function getRecipientNameLinkedin(button: HTMLElement, updateElement?: HTMLElement) {
  // Get the message list container
  const closestUpdate: HTMLElement | null = updateElement || (
    button?.closest(FEED_UPDATE_V2_SELECTOR) ||
    button?.closest(ENTITY_RESULT_CONTENT_SELECTOR) ||
    button?.closest(FEED_UPDATE_V2_DIALOGUE_SELECTOR))
  const acoterComponent = closestUpdate?.querySelector('.update-components-actor__container');
  if (acoterComponent) {
    // Assuming acoterComponent is your reference to the update-components-actor__container

    var nameSpans = acoterComponent.querySelectorAll('.update-components-actor__title span');
    var name = '';

    // Find the container with the user title
    var titleElement = acoterComponent.querySelector('.update-components-actor__title');

    // Look for the nested span with the aria-hidden="true" attribute
    var nameSpan = titleElement?.querySelector('span[aria-hidden="true"]');

    // Extract the text content, ensuring it is trimmed
    var name = nameSpan ? nameSpan.innerText.trim() : '';
    // Extracting the headline
    var headline = acoterComponent.querySelector('.update-components-actor__description')?.innerText?.trim();

    // Extracting the avatar URL
    var avatarUrl =
      acoterComponent.querySelector('.update-components-actor__avatar-image')?.src ||
      acoterComponent.querySelector('.ivm-view-attr__img--centered')?.src; // some where have different source and on pages , groups have different

    // Extracting the profile URL
    var profileUrl = acoterComponent.querySelector('.update-components-actor__meta-link')?.href;

    // Creating the final object
    var actorInfo = {
      name: name,
      headline: headline,
      avatarUrl: avatarUrl,
      profileUrl: profileUrl,
    };
  } else {
    actorInfo = {};
  }
  // outputs the name of the user
  return actorInfo;
}

export function getPollSummaryLinkedin(updateElement: HTMLElement): string | null {
  // Try to find the poll question element
  const pollElement: HTMLElement | null = updateElement.querySelector(POLL_ELEMENT_SELECTOR);

  if (pollElement) {
    // Extract the poll question text
    const question: string = pollElement.innerText;

    // Find all the poll options
    const options: NodeListOf<HTMLElement> = updateElement.querySelectorAll(OPTIONS_SELECTOR);

    // Collect the text of each poll option
    const optionsText: string = Array.from(options)
      .map((opt) => opt.innerText)
      .join(', ');

    // Return the formatted poll summary
    return `Respond to the following poll question: "${question}" with one of the given options: ${optionsText}. Justify your answer.`;
  }

  // If no poll question is found, return null
  return null;
}

// Function to extract comments, authors, and replies
export function extractCommentsAndRepliesLinkedin(button: HTMLElement): any {
  // Select the main comment container
  const commentSection = button.closest('.comments-comment-entity');
  if (commentSection) {
    const mainCommentElement = commentSection.querySelector('.comments-comment-item__main-content');
    const mainCommentAuthor = commentSection
      .querySelector('.comments-comment-meta__description-title')
      ?.textContent?.trim();
    const mainComment = mainCommentElement?.textContent?.trim();

    // Initialize an array to hold replies and their authors
    const replies = [];

    // Select all reply comment entities within the comment section
    const replyEntities = commentSection.querySelectorAll('.comments-comment-entity--reply');

    // Loop through each reply entity to extract text and author
    replyEntities.forEach((reply) => {
      const replyText = reply.querySelector('.comments-comment-item__main-content')?.textContent?.trim();
      const replyAuthor = reply.querySelector('.comments-comment-meta__description-title')?.textContent?.trim();
      if (replyText && replyAuthor) {
        replies.push({
          author: replyAuthor,
          text: replyText,
        });
      }
    });

    // Return an object containing the main comment, its author, and replies
    return {
      parent: {
        author: mainCommentAuthor,
        text: mainComment,
      },
      replies,
    };
  } else return {};
}

export function getPostDetail(postContainer: HTMLElement) {
  // Initialize the post detail text
  let postDetail: { author: any ; summary: string } = { author: {}, summary: '' };

if (postContainer) {
  const summaryText = extractPostSummaryLinkedin(postContainer);
  const author = getRecipientNameLinkedin(undefined, postContainer);
  postDetail.author = author;
  postDetail.summary = summaryText;
}

  return postDetail;
}

