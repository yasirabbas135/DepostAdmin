# depost-ai

> **Introduction**: 
Depost AI is a browser extension that leverages the power of ai to generate engaging posts, content and replies for linkediin  growth. 

## Features

- **Powerful AI** 🧠: Uses the different models for generating content, posts, replies.
- **Browser Extension** 🌐: Easy to use directly in your chromium browser.
- **Customizable** ⚙️: Configurable to use any  model and adapt the answers to your needs

## Technologies

depost-ai is a react-based browser extension built using the following technologies:

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn-ui](https://shadcn-ui.com/)
- [@samrum/vite-plugin-web-extension](https://github.com/samrum/vite-plugin-web-extension)

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- A Chromium based Browser

### Installation Steps


5. **Load the Extension**:
   - Open Google Chrome (or other chromium browser) and navigate to `chrome://extensions/`.
   - Enable Developer Mode by toggling the switch at the top-right.
   - Click on "Load unpacked" and select the `dist` folder inside the unzipped folder of this repository.

## Usage

Once installed, navigate to any post on LinkedIn, and you will see an additional button labeled "Generate". Clicking this button will use ai to generate a contextually relevant reply.

## Configuration

## Development

This project uses [@samrum/vite-plugin-web-extension](https://github.com/samrum/vite-plugin-web-extension). Refer to the plugin documentation for more information.

### Project Setup

```sh
npm install
```

### Commands

Hot Module Reloading is used to load changes inline without requiring extension rebuilds and extension/page reloads
Currently only works in Chromium based browsers.
```sh
npm run dev
```

#### Development, Watch

Rebuilds extension on file changes. Requires a reload of the extension (and page reload if using content scripts)
```sh
npm run watch
```

#### Production

Minifies and optimizes extension build
```sh
npm run build
```

### Load extension in browser

Loads the contents of the dist directory into the specified browser
```sh
npm run serve:chrome
```

```sh
npm run serve:firefox
```
