import pkg from '../package.json';

const manifest = {
  action: {
    default_icon: {
      128: 'icons/icon128.png',
    },
    default_title: 'Click to open panel',
    //default_popup: 'src/entries/popup/index.html',
  },
  background: {
    service_worker: 'src/entries/background/main.ts',
  },
  side_panel: {
    default_path: 'src/entries/sidePanel/index.html',
  },
  content_scripts: [],
  content_security_policy: {
    extension_pages: "script-src 'self'; object-src 'self';",
  },
  host_permissions: ['*://*.linkedin.com/*', '*://*.x.com/*', '*://*.reddit.com/*'],
  icons: {
    16: 'icons/icon16.png',
    32: 'icons/icon32.png',
    48: 'icons/icon48.png',
    128: 'icons/icon128.png',
  },
  // options_page: 'src/entries/options/index.html', // Add this line
  permissions: ['tabs', 'storage', 'activeTab', 'scripting', 'alarms', 'identity', 'sidePanel'],
  oauth2: {
    // client_id: '34058180382-g5vaau8t1shosjtr5tb25qriohm6nq2g.apps.googleusercontent.com', // production my key
    client_id: '34058180382-is5626jpr3fqi7ncce6cgoiivc5o9489.apps.googleusercontent.com', // Yasir local key
    //  client_id: '905941577193-kda6unkvd0cq0eeqc63n9l3gfvvbcleh.apps.googleusercontent.com', // production key
    //  client_id: '34058180382-h4a2j41ed64seuj3jsaeku6tj0g92ikl.apps.googleusercontent.com', // Atta local key
    scopes: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'],
  },
  web_accessible_resources: [
    {
      resources: [
        'icons/icon16.png',
        'icons/icon48.png',
        'icons/icon128.png',
        'icons/suggestion.png',
        'icons/setting150.png',
        'icons/close150.png',
        'icons/depostwhite-icon.png',
        'icons/google_logo.svg',
        'icons/book.png',
        'icons/quickreply.png',
        'icons/quickphrases.png',
        'icons/summarize.png',
        'icons/settings.png',
        'icons/book_fill.png',
        'icons/quickreply_fill.png',
        'icons/quickphrases_fill.png',
        'icons/summarize_fill.png',
        'icons/settings_fill.png',
        'icons/email-round-icon.svg',
        'icons/lock-check.svg',
        'icons/like.svg',
        'icons/support.svg',
        'icons/celebrate.svg',
        'icons/love.svg',
        'icons/insightful.svg',
        'icons/funny.svg',
        'icons/welcome_2d.png',
        'icons/post_2d.png',
        'poststyle.css',
        'toolbar.css',
        'contentstyle.css',
      ],
      matches: ['*://*.linkedin.com/*', '*://*.x.com/*', '*://*.reddit.com/*'],
    },
  ],
};

export function getManifest(): chrome.runtime.ManifestV3 {
  return {
    author: pkg.author,
    description: pkg.description,
    name: pkg.displayName ?? pkg.name,
    version: pkg.version,
    manifest_version: 3,
    ...manifest,
  };
}
