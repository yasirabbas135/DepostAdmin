import { useEffect, useState, useMemo } from 'react';

type Theme = 'light' | 'dark' | 'system';
type PostType = 'TEXT' | 'IMAGE' | 'VIDEO' | 'CAROUSEL' | 'IMAGE' | 'POLL' | 'THREAD' | 'ARTICLE';

type Influencer = {
  id: string;
  name: string;
  headline: string;
  vanityName: string;
  profileUrl: string;
  avatarUrl: string;
  coverUrl: string;
  followers: number;
};

type Post = {
  id: string;
  content: string;
  type: PostType;
  summary: string;
  likes: number;
  comments: number;
  reposts: number;
  mediaUrls: string[];
  links: string[];
  postUrl: string;
  publishedAt: string;
  influencer: Influencer;
};

export default function FeedComponent() {  
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('all');
    const [sortBy, setSortBy] = useState('likes');

    const [theme, setTheme] = useState<Theme>(() => {
      if (typeof window === 'undefined') return 'light';
      const saved = localStorage.getItem('theme');
      return (saved || 'system') as Theme;
    });
    const [showThemeMenu, setShowThemeMenu] = useState(false);

const applyTheme = (selectedTheme: Theme) => {
  console.log('Applying theme:', selectedTheme);
  const root = document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  console.log('System prefers dark:', systemDark);

  // Clear previous classes to avoid conflicts
  root.classList.remove('dark', 'light');

  if (selectedTheme === 'system') {
    console.log('Setting system theme - dark:', systemDark);
    root.classList.toggle('dark', systemDark);
  } else {
    console.log('Setting explicit theme:', selectedTheme);
    root.classList.toggle('dark', selectedTheme === 'dark');
  }

  const colorScheme = selectedTheme === 'system' ? (systemDark ? 'dark' : 'light') : selectedTheme;
  console.log('Setting color-scheme:', colorScheme);
  root.style.colorScheme = colorScheme;
};

  useEffect(() => {
    console.log('Theme state changed to:', theme);
    applyTheme(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // System theme change listener
  useEffect(() => {
    console.log('Setting up system theme listener');
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      console.log('System theme changed, current app theme:', theme);
      if (theme === 'system') {
        console.log('Re-applying system theme');
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handler);
    return () => {
      console.log('Cleaning up system theme listener');
      mediaQuery.removeEventListener('change', handler);
    };
  }, [theme]);


  const [posts, setPosts] = useState<Post[]>([
    // Add more dummy posts as needed
  ]);

  var categories = [
    { name: 'All Posts', value: 'all', count: posts?.length },
    { name: 'Carousel', value: 'CAROUSEL', count: posts?.filter((p) => p.type === 'CAROUSEL').length },
    { name: 'Image', value: 'IMAGE', count: posts?.filter((p) => p.type === 'IMAGE').length },
    { name: 'Video', value: 'VIDEO', count: posts?.filter((p) => p.type === 'VIDEO').length },
    { name: 'Text', value: 'TEXT', count: posts?.filter((p) => p.type === 'TEXT').length },
    { name: 'Poll', value: 'POLL', count: posts?.filter((p) => p.type === 'POLL').length },
  ];

  const sortOptions = [
    { name: 'Likes', value: 'likes' },
    { name: 'Comments', value: 'comments' },
    { name: 'Reposts', value: 'reposts' },
    { name: 'Recency', value: 'publishedAt' },
  ];
    
      const fetchViralPosts = async (type, page, append = false) => {
        try {
          // Call the background script via chrome.runtime.sendMessage
          chrome.runtime.sendMessage(
            { action: 'apiRequest', payload: { method: 'getViralPosts', page, limit: 100, term: '', type } },
            (response) => {
                if (response.success) {
                  console.log(response.response?.data);
                const data = response.response?.data; // Assuming response includes `data` key
                
                if (data?.length < 10) {
                 // setHasMore(false); // No more records if the fetched data is less than the limit
                } else {
                  //setHasMore(true);
                }
                setPosts((prev) => (append ? [...prev, ...data] : data)); // Append or replace data
              } else {
                console.error('Error fetching prompts:', response.error || 'Unknown error');
              }
            },
          );
        } catch (err) {
          console.error('Error fetching data:', err);
        }
      };

    useEffect(() => {
        fetchViralPosts('all', 1);
    }, []);
    var filteredPosts = posts;
       useEffect(() => {
         if(posts?.length > 0) {
              
             filteredPosts = posts?.filter((post) => {
      const matchesSearch =
        post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.summary?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || post.type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'publishedAt') {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
      }
      return (b[sortBy as keyof Post] as number) - (a[sortBy as keyof Post] as number);
    });
             
             categories = [
               { name: 'All Posts', value: 'all', count: posts?.length },
               { name: 'Carousel', value: 'CAROUSEL', count: posts?.filter((p) => p.type === 'CAROUSEL').length },
               { name: 'Image', value: 'IMAGE', count: posts?.filter((p) => p.type === 'IMAGE').length },
               { name: 'Video', value: 'VIDEO', count: posts?.filter((p) => p.type === 'VIDEO').length },
               { name: 'Text', value: 'TEXT', count: posts?.filter((p) => p.type === 'TEXT').length },
               { name: 'Poll', value: 'POLL', count: posts?.filter((p) => p.type === 'POLL').length },
             ];
         }
       }, [posts]);
    
    filteredPosts = useMemo(() => {
      return posts
        ?.filter((post) => {
          const matchesSearch =
            post.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.summary?.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesType = selectedType === 'all' || post.type === selectedType;
          return matchesSearch && matchesType;
        })
        .sort((a, b) => {
          if (sortBy === 'publishedAt') {
            return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
          }
          return (b[sortBy as keyof Post] as number) - (a[sortBy as keyof Post] as number);
        });
    }, [posts, searchQuery, selectedType, sortBy]);

    
    const ThemeMenu = () => (
  <div className="absolute right-0 top-10 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
        <div className="p-2 space-y-1">
          {(['light', 'dark', 'system'] as Theme[]).map((t) => (
            <button
              key={t}
              onClick={() => {
                setTheme(t);
                setShowThemeMenu(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {theme === t && <CheckIcon className="h-4 w-4 text-primary-500" />}
            </button>
          ))}
        </div>
      </div>
    );

    // Modified header with theme menu
    const header = (
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 relative">
        <div className=" text-gray-900 dark:text-gray-100">
          <span className="text-xl font-bold">Viral Post Library</span>
        </div>
        <button
          className="p-1.5 text-gray-900 dark:text-gray-100 relative"
          onClick={() => setShowThemeMenu(!showThemeMenu)}>
          <SettingsIcon />
          {showThemeMenu && <ThemeMenu />}
        </button>
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-900  w-[441px] h-screen flex flex-col rounded-[6px]">
      {/* Header */}
      {header}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {/* Profile Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                className="h-14 w-14 rounded-full"
                src="https://example.com/avatar.jpg"
                alt="User avatar"
                onError={(e) => {
                  //(e.target as HTMLImageElement).src = 'https://via.placeholder.com/56';
                }}
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Yaser Abbass</h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">Last refreshed 9 days ago</span>
            </div>
          </div>
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <RefreshIcon />
          </button>
        </div>

        {/* Filters */}
        <div className="space-y-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Search posts..."
              className="w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-700 dark:placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-4">
            <Dropdown options={categories} selected={selectedType} onChange={setSelectedType} />
            <Dropdown options={sortOptions} selected={sortBy} onChange={setSortBy} />
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-4">{filteredPosts?.map((post) => <PostItem key={post.id} post={post} />)}</div>
      </div>
    </div>
  );
}

function PostItem({ post }: { post: Post }) {
  const [isExpanded, setIsExpanded] = useState(false);
   const [copiedButton, setCopiedButton] = useState<'url' | 'embed' | 'copy' | null>(null);
  const MAX_LINES = 3;
  const contentLines = post.content.split('\n');
  const needsExpansion = contentLines.length > MAX_LINES || post.content.length > 200;
 const categoryStyles: Record<PostType, string> = {
   CAROUSEL: 'bg-pink-300/80 border-pink-300 text-pink-800 dark:bg-pink-900/30 dark:border-pink-800 dark:text-pink-300',
   IMAGE: 'bg-blue-300/80 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300',
   VIDEO:
     'bg-green-300/80 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-300',
   TEXT: 'bg-purple-300/80 border-purple-300 text-purple-800 dark:bg-purple-900/30 dark:border-purple-800 dark:text-purple-300',
   POLL: 'bg-yellow-300/80 border-yellow-300 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-300',
   THREAD: 'bg-indigo-300/80 border-indigo-300 text-indigo-800 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-300',
    ARTICLE: 'bg-red-300/80 border-red-300 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-300',
   // Added fallback for text type
 };

   const copyToClipboard = async (text: string, buttonType: 'url' | 'embed' | 'copy') => {
     try {
       await navigator.clipboard.writeText(text);
       setCopiedButton(buttonType); // Set the button type that was clicked
       setTimeout(() => setCopiedButton(null), 2000); // Reset after 2 seconds
     } catch (err) {
       console.error('Failed to copy:', err);
     }
   };
 // Fallback style for unexpected post types
 const defaultCategoryStyle =
   'bg-gray-300/80 border-gray-300 text-gray-800 dark:bg-gray-900/30 dark:border-gray-800 dark:text-gray-300';

  return (
    <div className="shadow-lg p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* Post Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <img
            className="h-12 w-12 rounded-full"
            src={post.influencer.avatarUrl}
            alt="Author avatar"
            onError={(e) => {
              // (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48';
            }}
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{post.influencer.name}</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(post.publishedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-md border ${categoryStyles[post.type] || defaultCategoryStyle}`}>
          {post.type?.charAt(0)?.toUpperCase() + post.type?.slice(1)}
        </span>
      </div>

      {/* Post Content */}
      <div className="mb-4 text-gray-900 dark:text-gray-100">
        <div className={`${!isExpanded ? 'line-clamp-3' : ''} mb-2 whitespace-pre-line`}>{post.content}</div>
        {needsExpansion && (
          <button
            className="text-primary-500 hover:text-primary-600 text-sm font-medium"
            onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
        {post.mediaUrls.length > 0 && (
          <div className="grid gap-2 mt-3">
            {post.mediaUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Post media ${index + 1}`}
                className="w-full h-90 object-cover rounded-lg"
              />
            ))}
          </div>
        )}
      </div>

      {/* Engagement Metrics */}
      <div className="text-xs flex items-center justify-between mt-3 border-b pb-4 border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="flex items-center">
            <img className="bg-white rounded-full h-5 w-5" src="https://static.kleo.so/icons/like.svg" alt="Likes" />
            <img
              className="-translate-x-[5px] bg-white rounded-full h-5 w-5"
              src="https://static.kleo.so/icons/celebrate.svg"
              alt="Celebrations"
            />
            <img
              className="-translate-x-[10px] bg-white rounded-full h-5 w-5"
              src="https://static.kleo.so/icons/support.svg"
              alt="Empathy"
            />
            <span className="-ml-1.5 text-gray-800 dark:text-gray-200">{post.likes.toLocaleString()}</span>
          </div>
        </div>
        <span className="text-gray-800 dark:text-gray-200">
          {post.comments.toLocaleString()} comments • {post.reposts.toLocaleString()} reposts
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <a
          href={post.postUrl}
          className="flex items-center text-primary-500 text-sm py-2 p-3 rounded-md hover:bg-gray-100 transition-colors dark:hover:bg-gray-700"
          target="_blank"
          rel="noreferrer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="18"
            viewBox="0 0 19 18"
            fill="none"
            className="mr-1">
            <path
              d="M11.5001 9C11.5001 10.2426 10.4927 11.25 9.25006 11.25C8.00742 11.25 7.00006 10.2426 7.00006 9C7.00006 7.75736 8.00742 6.75 9.25006 6.75C10.4927 6.75 11.5001 7.75736 11.5001 9Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M2.09375 8.99997C3.04946 5.95716 5.89217 3.75 9.25039 3.75C12.6086 3.75 15.4514 5.95719 16.407 9.00003C15.4513 12.0428 12.6086 14.25 9.25041 14.25C5.89217 14.25 3.04944 12.0428 2.09375 8.99997Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          View
        </a>

        <button
          className="flex items-center text-primary-500 text-sm py-2 p-3 rounded-md hover:bg-gray-100 transition-colors dark:hover:bg-gray-700"
          onClick={() => copyToClipboard(post.postUrl, 'url')}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="18"
            viewBox="0 0 19 18"
            fill="none"
            className="mr-1">
            <path
              d="M11.1213 7.62868C9.94975 6.45711 8.05025 6.45711 6.87868 7.62868L3.87868 10.6287C2.70711 11.8003 2.70711 13.6997 3.87868 14.8713C5.05025 16.0429 6.94975 16.0429 8.12132 14.8713L8.94749 14.0451M8.37868 10.3713C9.55025 11.5429 11.4497 11.5429 12.6213 10.3713L15.6213 7.37132C16.7929 6.19975 16.7929 4.30025 15.6213 3.12868C14.4497 1.95711 12.5503 1.95711 11.3787 3.12868L10.554 3.95339"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{copiedButton === 'url' ? 'Copied!' : 'URL'}</span>
        </button>

        <button
          className="flex items-center text-primary-500 text-sm py-2 p-3 rounded-md hover:bg-gray-100 transition-colors dark:hover:bg-gray-700"
          onClick={() => copyToClipboard(`<iframe src="${post.postUrl}"></iframe>`, 'embed')}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="18"
            viewBox="0 0 19 18"
            fill="none"
            className="mr-1">
            <path
              d="M7.75 15L10.75 3M13.75 6L16.75 9L13.75 12M4.75 12L1.75 9L4.75 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{copiedButton === 'embed' ? 'Copied!' : 'Embed'}</span>
        </button>

        <button
          className="flex items-center text-primary-500 text-sm py-2 p-3 rounded-md hover:bg-gray-100 transition-colors dark:hover:bg-gray-700"
          onClick={() => copyToClipboard(post.content, 'copy')}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="18"
            viewBox="0 0 19 18"
            fill="none"
            className="mr-1">
            <path
              d="M6.75 12H5.25C4.42157 12 3.75 11.3284 3.75 10.5V4.5C3.75 3.67157 4.42157 3 5.25 3H11.25C12.0784 3 12.75 3.67157 12.75 4.5V6M8.25 15H14.25C15.0784 15 15.75 14.3284 15.75 13.5V7.5C15.75 6.67157 15.0784 6 14.25 6H8.25C7.42157 6 6.75 6.67157 6.75 7.5V13.5C6.75 14.3284 7.42157 15 8.25 15Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span>{copiedButton === 'copy' ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
}

function Dropdown({
  options,
  selected,
  onChange,
}: {
  options: Array<{ name: string; value: string; count?: number }>;
  selected: string;
  onChange: (value: string) => void;
}) {
  return (
    <select
      className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2.5 text-sm"
      value={selected}
      onChange={(e) => onChange(e.target.value)}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.name} {option.count !== undefined ? `(${option.count})` : ''}
        </option>
      ))}
    </select>
  );
}

// Icons
function SettingsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-gray-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path
        fillRule="evenodd"
        d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
        clipRule="evenodd"
      />
    </svg>
  );
}


