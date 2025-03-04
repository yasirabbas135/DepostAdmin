// vite.config.ts
import webExtension from "file:///Users/mac/RemoteenProjects/DepostAdmin/node_modules/@samrum/vite-plugin-web-extension/dist/index.mjs";
import react from "file:///Users/mac/RemoteenProjects/DepostAdmin/node_modules/@vitejs/plugin-react/dist/index.mjs";
import path from "path";
import { defineConfig } from "file:///Users/mac/RemoteenProjects/DepostAdmin/node_modules/vite/dist/node/index.js";

// package.json
var package_default = {
  name: "depost-ai-admin",
  version: "1.0.0",
  displayName: "Depost AI: Admin",
  author: "Remoteen Inc",
  description: "Depost AI: Admin controller",
  type: "module",
  scripts: {
    build: "vite build --mode production --minify true && npx webpack",
    watch: "vite build --watch --mode development --minify false",
    dev: "vite",
    "serve:firefox": 'web-ext run --start-url "about:debugging#/runtime/this-firefox"  --source-dir ./dist/',
    "serve:chrome": 'web-ext run -t chromium --start-url "https://example.com" --source-dir ./dist/',
    prettier: "prettier --write '**/*.js' '**/*.ts'"
  },
  license: "Remoteen",
  devDependencies: {
    "@samrum/vite-plugin-web-extension": "^5.0.0",
    "@types/chrome": "^0.0.254",
    "@types/markdown-it": "^14.1.2",
    "@types/node": "^20.12.8",
    "@types/react": "^18.2.37",
    "@types/react-dom": "^18.2.15",
    "@types/webextension-polyfill": "^0.10.6",
    "@vitejs/plugin-react": "^4.2.0",
    autoprefixer: "^10.4.19",
    "css-loader": "^7.1.2",
    postcss: "^8.4.47",
    "postcss-loader": "^8.1.1",
    prettier: "^3.3.3",
    "style-loader": "^4.0.0",
    tailwindcss: "^3.4.14",
    "ts-loader": "^9.5.1",
    typescript: "^5.6.3",
    vite: "^5.0.0",
    "web-ext": "^7.8.0",
    webpack: "^5.95.0",
    "webpack-cli": "^5.1.4"
  },
  dependencies: {
    "@google/generative-ai": "^0.20.0",
    "@headlessui/react": "^2.2.0",
    "@heroicons/react": "^2.2.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@tailwindcss/line-clamp": "^0.4.4",
    axios: "^1.7.7",
    "class-variance-authority": "^0.7.0",
    clsx: "^2.1.1",
    "convert-unicode-fonts": "^1.0.1",
    "groq-sdk": "^0.5.0",
    "isomorphic-dompurify": "^2.16.0",
    "jwt-decode": "^4.0.0",
    "lucide-react": "^0.377.0",
    "markdown-it": "^14.1.0",
    "next-themes": "^0.3.0",
    react: "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^7.0.2",
    "react-toastify": "^10.0.6",
    sortablejs: "^1.15.6",
    "string-to-unicode-variant": "^1.0.9",
    "tailwind-merge": "^2.3.0",
    "tailwindcss-animate": "^1.0.7",
    "webextension-polyfill": "^0.10.0"
  }
};

// src/manifest.ts
var manifest = {
  action: {
    default_icon: {
      128: "icons/icon128.png"
    },
    default_title: "Click to open panel"
    //default_popup: 'src/entries/popup/index.html',
  },
  background: {
    service_worker: "src/entries/background/main.ts"
  },
  side_panel: {
    default_path: "src/entries/sidePanel/index.html"
  },
  content_scripts: [],
  content_security_policy: {
    extension_pages: "script-src 'self'; object-src 'self';"
  },
  host_permissions: ["*://*.linkedin.com/*", "*://*.x.com/*", "*://*.reddit.com/*"],
  icons: {
    16: "icons/icon16.png",
    32: "icons/icon32.png",
    48: "icons/icon48.png",
    128: "icons/icon128.png"
  },
  // options_page: 'src/entries/options/index.html', // Add this line
  permissions: ["tabs", "storage", "activeTab", "scripting", "alarms", "identity", "sidePanel"],
  oauth2: {
    // client_id: '34058180382-g5vaau8t1shosjtr5tb25qriohm6nq2g.apps.googleusercontent.com', // production my key
    client_id: "34058180382-1uuvirh1ivtnqb5u6haaprqg2oip8t3h.apps.googleusercontent.com",
    // Yasir local key
    //  client_id: '905941577193-kda6unkvd0cq0eeqc63n9l3gfvvbcleh.apps.googleusercontent.com', // production key
    //  client_id: '34058180382-h4a2j41ed64seuj3jsaeku6tj0g92ikl.apps.googleusercontent.com', // Atta local key
    scopes: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"]
  },
  web_accessible_resources: [
    {
      resources: [
        "icons/icon16.png",
        "icons/icon48.png",
        "icons/icon128.png",
        "icons/suggestion.png",
        "icons/setting150.png",
        "icons/close150.png",
        "icons/depostwhite-icon.png",
        "icons/google_logo.svg",
        "icons/book.png",
        "icons/quickreply.png",
        "icons/quickphrases.png",
        "icons/summarize.png",
        "icons/settings.png",
        "icons/book_fill.png",
        "icons/quickreply_fill.png",
        "icons/quickphrases_fill.png",
        "icons/summarize_fill.png",
        "icons/settings_fill.png",
        "icons/email-round-icon.svg",
        "icons/lock-check.svg",
        "icons/like.svg",
        "icons/support.svg",
        "icons/celebrate.svg",
        "icons/love.svg",
        "icons/insightful.svg",
        "icons/funny.svg",
        "icons/welcome_2d.png",
        "icons/post_2d.png",
        "poststyle.css",
        "toolbar.css",
        "contentstyle.css"
      ],
      matches: ["*://*.linkedin.com/*", "*://*.x.com/*", "*://*.reddit.com/*"]
    }
  ]
};
function getManifest() {
  return {
    author: package_default.author,
    description: package_default.description,
    name: package_default.displayName ?? package_default.name,
    version: package_default.version,
    manifest_version: 3,
    ...manifest
  };
}

// vite.config.ts
var __vite_injected_original_dirname = "/Users/mac/RemoteenProjects/DepostAdmin";
var vite_config_default = defineConfig(() => {
  return {
    plugins: [
      react(),
      webExtension({
        manifest: getManifest()
      })
    ],
    resolve: {
      alias: {
        "~": path.resolve(__vite_injected_original_dirname, "./src"),
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    },
    build: {
      rollupOptions: {
        input: {
          // options: resolve(__dirname, '/src/entries/onboarding/index.html'),
        }
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIiwgInNyYy9tYW5pZmVzdC50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9tYWMvUmVtb3RlZW5Qcm9qZWN0cy9EZXBvc3RBZG1pblwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL21hYy9SZW1vdGVlblByb2plY3RzL0RlcG9zdEFkbWluL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tYWMvUmVtb3RlZW5Qcm9qZWN0cy9EZXBvc3RBZG1pbi92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB3ZWJFeHRlbnNpb24gZnJvbSAnQHNhbXJ1bS92aXRlLXBsdWdpbi13ZWItZXh0ZW5zaW9uJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgZ2V0TWFuaWZlc3QgfSBmcm9tICcuL3NyYy9tYW5pZmVzdCc7XG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCc7XG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCgpID0+IHtcbiAgcmV0dXJuIHtcbiAgICBwbHVnaW5zOiBbXG4gICAgICByZWFjdCgpLFxuICAgICAgd2ViRXh0ZW5zaW9uKHtcbiAgICAgICAgbWFuaWZlc3Q6IGdldE1hbmlmZXN0KCksXG4gICAgICB9KSxcbiAgICBdLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICd+JzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICB9LFxuICAgIH0sXG4gICAgYnVpbGQ6IHtcbiAgICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgICAgaW5wdXQ6IHtcbiAgICAgICAgIC8vIG9wdGlvbnM6IHJlc29sdmUoX19kaXJuYW1lLCAnL3NyYy9lbnRyaWVzL29uYm9hcmRpbmcvaW5kZXguaHRtbCcpLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9O1xufSk7XG4iLCAie1xuICBcIm5hbWVcIjogXCJkZXBvc3QtYWktYWRtaW5cIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMS4wLjBcIixcbiAgXCJkaXNwbGF5TmFtZVwiOiBcIkRlcG9zdCBBSTogQWRtaW5cIixcbiAgXCJhdXRob3JcIjogXCJSZW1vdGVlbiBJbmNcIixcbiAgXCJkZXNjcmlwdGlvblwiOiBcIkRlcG9zdCBBSTogQWRtaW4gY29udHJvbGxlclwiLFxuICBcInR5cGVcIjogXCJtb2R1bGVcIixcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImJ1aWxkXCI6IFwidml0ZSBidWlsZCAtLW1vZGUgcHJvZHVjdGlvbiAtLW1pbmlmeSB0cnVlICYmIG5weCB3ZWJwYWNrXCIsXG4gICAgXCJ3YXRjaFwiOiBcInZpdGUgYnVpbGQgLS13YXRjaCAtLW1vZGUgZGV2ZWxvcG1lbnQgLS1taW5pZnkgZmFsc2VcIixcbiAgICBcImRldlwiOiBcInZpdGVcIixcbiAgICBcInNlcnZlOmZpcmVmb3hcIjogXCJ3ZWItZXh0IHJ1biAtLXN0YXJ0LXVybCBcXFwiYWJvdXQ6ZGVidWdnaW5nIy9ydW50aW1lL3RoaXMtZmlyZWZveFxcXCIgIC0tc291cmNlLWRpciAuL2Rpc3QvXCIsXG4gICAgXCJzZXJ2ZTpjaHJvbWVcIjogXCJ3ZWItZXh0IHJ1biAtdCBjaHJvbWl1bSAtLXN0YXJ0LXVybCBcXFwiaHR0cHM6Ly9leGFtcGxlLmNvbVxcXCIgLS1zb3VyY2UtZGlyIC4vZGlzdC9cIixcbiAgICBcInByZXR0aWVyXCI6IFwicHJldHRpZXIgLS13cml0ZSAnKiovKi5qcycgJyoqLyoudHMnXCJcbiAgfSxcbiAgXCJsaWNlbnNlXCI6IFwiUmVtb3RlZW5cIixcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQHNhbXJ1bS92aXRlLXBsdWdpbi13ZWItZXh0ZW5zaW9uXCI6IFwiXjUuMC4wXCIsXG4gICAgXCJAdHlwZXMvY2hyb21lXCI6IFwiXjAuMC4yNTRcIixcbiAgICBcIkB0eXBlcy9tYXJrZG93bi1pdFwiOiBcIl4xNC4xLjJcIixcbiAgICBcIkB0eXBlcy9ub2RlXCI6IFwiXjIwLjEyLjhcIixcbiAgICBcIkB0eXBlcy9yZWFjdFwiOiBcIl4xOC4yLjM3XCIsXG4gICAgXCJAdHlwZXMvcmVhY3QtZG9tXCI6IFwiXjE4LjIuMTVcIixcbiAgICBcIkB0eXBlcy93ZWJleHRlbnNpb24tcG9seWZpbGxcIjogXCJeMC4xMC42XCIsXG4gICAgXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiOiBcIl40LjIuMFwiLFxuICAgIFwiYXV0b3ByZWZpeGVyXCI6IFwiXjEwLjQuMTlcIixcbiAgICBcImNzcy1sb2FkZXJcIjogXCJeNy4xLjJcIixcbiAgICBcInBvc3Rjc3NcIjogXCJeOC40LjQ3XCIsXG4gICAgXCJwb3N0Y3NzLWxvYWRlclwiOiBcIl44LjEuMVwiLFxuICAgIFwicHJldHRpZXJcIjogXCJeMy4zLjNcIixcbiAgICBcInN0eWxlLWxvYWRlclwiOiBcIl40LjAuMFwiLFxuICAgIFwidGFpbHdpbmRjc3NcIjogXCJeMy40LjE0XCIsXG4gICAgXCJ0cy1sb2FkZXJcIjogXCJeOS41LjFcIixcbiAgICBcInR5cGVzY3JpcHRcIjogXCJeNS42LjNcIixcbiAgICBcInZpdGVcIjogXCJeNS4wLjBcIixcbiAgICBcIndlYi1leHRcIjogXCJeNy44LjBcIixcbiAgICBcIndlYnBhY2tcIjogXCJeNS45NS4wXCIsXG4gICAgXCJ3ZWJwYWNrLWNsaVwiOiBcIl41LjEuNFwiXG4gIH0sXG4gIFwiZGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcIkBnb29nbGUvZ2VuZXJhdGl2ZS1haVwiOiBcIl4wLjIwLjBcIixcbiAgICBcIkBoZWFkbGVzc3VpL3JlYWN0XCI6IFwiXjIuMi4wXCIsXG4gICAgXCJAaGVyb2ljb25zL3JlYWN0XCI6IFwiXjIuMi4wXCIsXG4gICAgXCJAcmFkaXgtdWkvcmVhY3Qtc2xvdFwiOiBcIl4xLjAuMlwiLFxuICAgIFwiQHJhZGl4LXVpL3JlYWN0LXRvb2x0aXBcIjogXCJeMS4wLjdcIixcbiAgICBcIkB0YWlsd2luZGNzcy9saW5lLWNsYW1wXCI6IFwiXjAuNC40XCIsXG4gICAgXCJheGlvc1wiOiBcIl4xLjcuN1wiLFxuICAgIFwiY2xhc3MtdmFyaWFuY2UtYXV0aG9yaXR5XCI6IFwiXjAuNy4wXCIsXG4gICAgXCJjbHN4XCI6IFwiXjIuMS4xXCIsXG4gICAgXCJjb252ZXJ0LXVuaWNvZGUtZm9udHNcIjogXCJeMS4wLjFcIixcbiAgICBcImdyb3Etc2RrXCI6IFwiXjAuNS4wXCIsXG4gICAgXCJpc29tb3JwaGljLWRvbXB1cmlmeVwiOiBcIl4yLjE2LjBcIixcbiAgICBcImp3dC1kZWNvZGVcIjogXCJeNC4wLjBcIixcbiAgICBcImx1Y2lkZS1yZWFjdFwiOiBcIl4wLjM3Ny4wXCIsXG4gICAgXCJtYXJrZG93bi1pdFwiOiBcIl4xNC4xLjBcIixcbiAgICBcIm5leHQtdGhlbWVzXCI6IFwiXjAuMy4wXCIsXG4gICAgXCJyZWFjdFwiOiBcIl4xOC4yLjBcIixcbiAgICBcInJlYWN0LWRvbVwiOiBcIl4xOC4yLjBcIixcbiAgICBcInJlYWN0LXJvdXRlci1kb21cIjogXCJeNy4wLjJcIixcbiAgICBcInJlYWN0LXRvYXN0aWZ5XCI6IFwiXjEwLjAuNlwiLFxuICAgIFwic29ydGFibGVqc1wiOiBcIl4xLjE1LjZcIixcbiAgICBcInN0cmluZy10by11bmljb2RlLXZhcmlhbnRcIjogXCJeMS4wLjlcIixcbiAgICBcInRhaWx3aW5kLW1lcmdlXCI6IFwiXjIuMy4wXCIsXG4gICAgXCJ0YWlsd2luZGNzcy1hbmltYXRlXCI6IFwiXjEuMC43XCIsXG4gICAgXCJ3ZWJleHRlbnNpb24tcG9seWZpbGxcIjogXCJeMC4xMC4wXCJcbiAgfVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbWFjL1JlbW90ZWVuUHJvamVjdHMvRGVwb3N0QWRtaW4vc3JjXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbWFjL1JlbW90ZWVuUHJvamVjdHMvRGVwb3N0QWRtaW4vc3JjL21hbmlmZXN0LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9tYWMvUmVtb3RlZW5Qcm9qZWN0cy9EZXBvc3RBZG1pbi9zcmMvbWFuaWZlc3QudHNcIjtpbXBvcnQgcGtnIGZyb20gJy4uL3BhY2thZ2UuanNvbic7XG5cbmNvbnN0IG1hbmlmZXN0ID0ge1xuICBhY3Rpb246IHtcbiAgICBkZWZhdWx0X2ljb246IHtcbiAgICAgIDEyODogJ2ljb25zL2ljb24xMjgucG5nJyxcbiAgICB9LFxuICAgIGRlZmF1bHRfdGl0bGU6ICdDbGljayB0byBvcGVuIHBhbmVsJyxcbiAgICAvL2RlZmF1bHRfcG9wdXA6ICdzcmMvZW50cmllcy9wb3B1cC9pbmRleC5odG1sJyxcbiAgfSxcbiAgYmFja2dyb3VuZDoge1xuICAgIHNlcnZpY2Vfd29ya2VyOiAnc3JjL2VudHJpZXMvYmFja2dyb3VuZC9tYWluLnRzJyxcbiAgfSxcbiAgc2lkZV9wYW5lbDoge1xuICAgIGRlZmF1bHRfcGF0aDogJ3NyYy9lbnRyaWVzL3NpZGVQYW5lbC9pbmRleC5odG1sJyxcbiAgfSxcbiAgY29udGVudF9zY3JpcHRzOiBbXSxcbiAgY29udGVudF9zZWN1cml0eV9wb2xpY3k6IHtcbiAgICBleHRlbnNpb25fcGFnZXM6IFwic2NyaXB0LXNyYyAnc2VsZic7IG9iamVjdC1zcmMgJ3NlbGYnO1wiLFxuICB9LFxuICBob3N0X3Blcm1pc3Npb25zOiBbJyo6Ly8qLmxpbmtlZGluLmNvbS8qJywgJyo6Ly8qLnguY29tLyonLCAnKjovLyoucmVkZGl0LmNvbS8qJ10sXG4gIGljb25zOiB7XG4gICAgMTY6ICdpY29ucy9pY29uMTYucG5nJyxcbiAgICAzMjogJ2ljb25zL2ljb24zMi5wbmcnLFxuICAgIDQ4OiAnaWNvbnMvaWNvbjQ4LnBuZycsXG4gICAgMTI4OiAnaWNvbnMvaWNvbjEyOC5wbmcnLFxuICB9LFxuICAvLyBvcHRpb25zX3BhZ2U6ICdzcmMvZW50cmllcy9vcHRpb25zL2luZGV4Lmh0bWwnLCAvLyBBZGQgdGhpcyBsaW5lXG4gIHBlcm1pc3Npb25zOiBbJ3RhYnMnLCAnc3RvcmFnZScsICdhY3RpdmVUYWInLCAnc2NyaXB0aW5nJywgJ2FsYXJtcycsICdpZGVudGl0eScsICdzaWRlUGFuZWwnXSxcbiAgb2F1dGgyOiB7XG4gICAgLy8gY2xpZW50X2lkOiAnMzQwNTgxODAzODItZzV2YWF1OHQxc2hvc2p0cjV0YjI1cXJpb2htNm5xMmcuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20nLCAvLyBwcm9kdWN0aW9uIG15IGtleVxuICAgIGNsaWVudF9pZDogJzM0MDU4MTgwMzgyLTF1dXZpcmgxaXZ0bnFiNXU2aGFhcHJxZzJvaXA4dDNoLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tJywgLy8gWWFzaXIgbG9jYWwga2V5XG4gICAgLy8gIGNsaWVudF9pZDogJzkwNTk0MTU3NzE5My1rZGE2dW5rdmQwY3EwZWVxYzYzbjlsM2dmdnZiY2xlaC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbScsIC8vIHByb2R1Y3Rpb24ga2V5XG4gICAgLy8gIGNsaWVudF9pZDogJzM0MDU4MTgwMzgyLWg0YTJqNDFlZDY0c2V1ajNqc2Fla3U2dGowZzkyaWtsLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tJywgLy8gQXR0YSBsb2NhbCBrZXlcbiAgICBzY29wZXM6IFsnaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vYXV0aC91c2VyaW5mby5lbWFpbCcsICdodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL3VzZXJpbmZvLnByb2ZpbGUnXSxcbiAgfSxcbiAgd2ViX2FjY2Vzc2libGVfcmVzb3VyY2VzOiBbXG4gICAge1xuICAgICAgcmVzb3VyY2VzOiBbXG4gICAgICAgICdpY29ucy9pY29uMTYucG5nJyxcbiAgICAgICAgJ2ljb25zL2ljb240OC5wbmcnLFxuICAgICAgICAnaWNvbnMvaWNvbjEyOC5wbmcnLFxuICAgICAgICAnaWNvbnMvc3VnZ2VzdGlvbi5wbmcnLFxuICAgICAgICAnaWNvbnMvc2V0dGluZzE1MC5wbmcnLFxuICAgICAgICAnaWNvbnMvY2xvc2UxNTAucG5nJyxcbiAgICAgICAgJ2ljb25zL2RlcG9zdHdoaXRlLWljb24ucG5nJyxcbiAgICAgICAgJ2ljb25zL2dvb2dsZV9sb2dvLnN2ZycsXG4gICAgICAgICdpY29ucy9ib29rLnBuZycsXG4gICAgICAgICdpY29ucy9xdWlja3JlcGx5LnBuZycsXG4gICAgICAgICdpY29ucy9xdWlja3BocmFzZXMucG5nJyxcbiAgICAgICAgJ2ljb25zL3N1bW1hcml6ZS5wbmcnLFxuICAgICAgICAnaWNvbnMvc2V0dGluZ3MucG5nJyxcbiAgICAgICAgJ2ljb25zL2Jvb2tfZmlsbC5wbmcnLFxuICAgICAgICAnaWNvbnMvcXVpY2tyZXBseV9maWxsLnBuZycsXG4gICAgICAgICdpY29ucy9xdWlja3BocmFzZXNfZmlsbC5wbmcnLFxuICAgICAgICAnaWNvbnMvc3VtbWFyaXplX2ZpbGwucG5nJyxcbiAgICAgICAgJ2ljb25zL3NldHRpbmdzX2ZpbGwucG5nJyxcbiAgICAgICAgJ2ljb25zL2VtYWlsLXJvdW5kLWljb24uc3ZnJyxcbiAgICAgICAgJ2ljb25zL2xvY2stY2hlY2suc3ZnJyxcbiAgICAgICAgJ2ljb25zL2xpa2Uuc3ZnJyxcbiAgICAgICAgJ2ljb25zL3N1cHBvcnQuc3ZnJyxcbiAgICAgICAgJ2ljb25zL2NlbGVicmF0ZS5zdmcnLFxuICAgICAgICAnaWNvbnMvbG92ZS5zdmcnLFxuICAgICAgICAnaWNvbnMvaW5zaWdodGZ1bC5zdmcnLFxuICAgICAgICAnaWNvbnMvZnVubnkuc3ZnJyxcbiAgICAgICAgJ2ljb25zL3dlbGNvbWVfMmQucG5nJyxcbiAgICAgICAgJ2ljb25zL3Bvc3RfMmQucG5nJyxcbiAgICAgICAgJ3Bvc3RzdHlsZS5jc3MnLFxuICAgICAgICAndG9vbGJhci5jc3MnLFxuICAgICAgICAnY29udGVudHN0eWxlLmNzcycsXG4gICAgICBdLFxuICAgICAgbWF0Y2hlczogWycqOi8vKi5saW5rZWRpbi5jb20vKicsICcqOi8vKi54LmNvbS8qJywgJyo6Ly8qLnJlZGRpdC5jb20vKiddLFxuICAgIH0sXG4gIF0sXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWFuaWZlc3QoKTogY2hyb21lLnJ1bnRpbWUuTWFuaWZlc3RWMyB7XG4gIHJldHVybiB7XG4gICAgYXV0aG9yOiBwa2cuYXV0aG9yLFxuICAgIGRlc2NyaXB0aW9uOiBwa2cuZGVzY3JpcHRpb24sXG4gICAgbmFtZTogcGtnLmRpc3BsYXlOYW1lID8/IHBrZy5uYW1lLFxuICAgIHZlcnNpb246IHBrZy52ZXJzaW9uLFxuICAgIG1hbmlmZXN0X3ZlcnNpb246IDMsXG4gICAgLi4ubWFuaWZlc3QsXG4gIH07XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVTLE9BQU8sa0JBQWtCO0FBQ2hVLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyxvQkFBb0I7OztBQ0g3QjtBQUFBLEVBQ0UsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLEVBQ1gsYUFBZTtBQUFBLEVBQ2YsUUFBVTtBQUFBLEVBQ1YsYUFBZTtBQUFBLEVBQ2YsTUFBUTtBQUFBLEVBQ1IsU0FBVztBQUFBLElBQ1QsT0FBUztBQUFBLElBQ1QsT0FBUztBQUFBLElBQ1QsS0FBTztBQUFBLElBQ1AsaUJBQWlCO0FBQUEsSUFD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
