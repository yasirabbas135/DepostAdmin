export const LOCAL_BASE_URL: string = `http://localhost:3000/v1`;
//export const LOCAL_BASE_URL: string = `https://api.depost.ai/v1`;

export const PROD_BASE_URL: string = `https://api.depost.ai/v1`;

export const POST_EDITOR_PLACEHOLDER =
  'Type your LinkedIn topic or content idea here to start crafting your next standout post...';
export const POST_EDITOR_PLACEHOLDER_URL =
  'Paste your article or news URL here, then click to generate a compelling post...';

export const POST_EDITOR_PLACEHOLDER_REPOST = 'Enter your own thoughts draft or specific instructions (optional)...';
export const COMMENT_BOX_SELECTOR: string = '.comments-comment-box__form';
export const FEED_UPDATE_V2_SELECTOR: string = '.feed-shared-update-v2';
export const TWEET_SELECTOR: string = '[data-testid="tweet]';

export const FEED_RESHARED_UPDATE_V2_SELECTOR: string = '.update-components-mini-update-v2';
export const FEED_UPDATE_V2_DIALOGUE_SELECTOR: string = '.feed-shared-update-detail-viewer__content';
export const MSG_CONTAINER_EDITOR: string = '.msg-form__contenteditable > p:last-of-type';
export const MSG_CONTAINER: string = '.msg-form__contenteditable';
export const EDITOR_SELECTOR = '.ql-editor';
export const MENTION_SELECTOR = '.ql-mention';
export const MSG_CONTAINER_EDITOR_PARAGRAPH: string = '.msg-form__contenteditable > p';
export const MSG_FORM_PLACEHOLDER: string = '.msg-form__placeholder';
export const POST_EDITOR_ELEMENT: string = '.ql-editor.ql-blank > p';
export const COMMENT_BOX_SELECTOR_CR = '.comments-comment-box--cr';
export const ENTITY_RESULT_CONTENT_SELECTOR: string = '.entity-result__content-container';
export const PULSE_URL_PART: string = 'pulse';
export const KEYWORDS_URL_PART: string = 'keywords';
export const DEFAULT_WORD_LIMIT: number = 25;
export const DEFAULT_TYPING_SPEED: number = 1;
export const BASE_URL: string = 'https://www.linkedin.com/feed/';

export const ELEMENT_TYPE_COMMENT: string = 'comment';
export const ELEMENT_TYPE_POST: string = 'post';
export const ELEMENT_TYPE_MSG: string = 'msg';

export const MESSAGE_LIST_CONTAINER_CLASS = 'msg-overlay-conversation-bubble__content-wrapper';
export const MESSAGE_CONVO_CONTAINER_CLASS = 'msg-convo-wrapper';

export const MESSAGE_LIST_ITEM_CLASS = 'msg-s-message-list__event';
export const SENDER_META_CLASS = 'msg-s-message-group__meta';
export const SENDER_NAME_CLASS = 'msg-s-message-group__name';
export const MESSAGE_BUBBLE_CLASS = 'msg-s-event-listitem__message-bubble';
export const MESSAGE_BODY_CLASS = 'msg-s-event-listitem__body';

export const MESSAGE_LIST_HEADER_CLASS = 'msg-overlay-conversation-bubble-header';
export const PROFILE_LINK_SELECTOR = 'h2.msg-overlay-bubble-header__title > a > span';

export const SHARE_BOX_MODAL_CLASS = 'share-box-v2__modal share-box-v2__modal-phoenix-redesign';
export const INTERACT_AI_POST_ID = 'interactAiPost';
export const DEPOST_CAPTURE_ICON = 'depost-capture-icon';
export const GENERATE_AI_POST_BUTTON_ID = 'generate-ai-post';
export const GENERATE_POST_MSG = 'generate linkedin post';

export const GENERATE_MSG_REPLY = 'generate reply of this conversation ';

// export constants for messages and prompts
export const GENERATING_MESSAGE_TEXT: string = 'Generating message...';
export const GENERATING_POST_TEXT: string = 'Generating post...';
export const FORMATTING_POST_TEXT: string = 'Formatting post...';
export const REGENERATE_BUTTON_TEXT: string = 'Regenerate';
export const REFORMAT_BUTTON_TEXT: string = 'Reformat';
// export constant selectors for easier maintenance
export const COMMENT_ITEM_SELECTOR: string = '.comments-thread-item';
export const MAIN_CONTENT_SELECTOR: string =
  '.comments-comment-item__main-content, .feed-shared-main-content--highlighted-comment';
export const COMMENTARY_SELECTOR: string = 'update-components-update-v2__commentary';
export const IMAGE_SELECTOR: string = '.update-components-image';
export const IMAGE_TAG_SELECTOR: string = 'img';

// export constants for messages and reply
export const GENERATING_REPLY_TEXT: string = 'Generating reply...';
export const REGENERATE_REPLY_BUTTON_TEXT: string = 'Regenerate Reply';
// Define export constants for query selectors
export const POLL_ELEMENT_SELECTOR: string = '.update-components-poll > div > div > h5';
export const OPTIONS_SELECTOR: string = '.update-components-poll-option__text-container > span';

// export constants for generate post
export const POST_TEXT_AREA_PLACEHOLDER =
  'Write a LinkedIn post to celebrate a personal milestone (i.e. giving kudos, a project launch, a work anniversary, a job update, a new educational milestone, or a new certification). Keep it humble, but the output should be crisp and clear. Write in a way that can go viral on LinkedIn. Be specific if you want it to include any emojis and hashtags. Keep it around 250 words and complete the section within the word limit.';

// export constants for selector strings and messages
export const ERROR_MESSAGE: string = 'Error fetching response. Please try again.';
export const READING_MESSAGE: string = 'Reading post...';

export const BUTTON_STYLES = {
  backgroundColor: '#0d59ae',
  textColor: 'white',
  border: 'none',
  padding: '10px 10px',
  margin: '10px',
  cursor: 'pointer',
} as const;

