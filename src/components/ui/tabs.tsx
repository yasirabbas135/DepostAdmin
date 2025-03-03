import React, { useState } from 'react';

export default function Tabs({ tabs, onTabChange }) {
  const [selectedTab, setSelectedTab] = useState(tabs.find((tab) => tab.current)?.name || tabs[0].name);

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
    if (onTabChange) {
      onTabChange(tabName); // Notify parent of the selected tab
    }
  };

  return (
    <div>
      <nav aria-label="Tabs" className="flex flex-wrap gap-2  pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => handleTabClick(tab.name)}
            aria-current={selectedTab === tab.name ? 'page' : undefined}
            className={`px-4 py-2 rounded-md font-medium text-sm ${
              selectedTab === tab.name
                ? 'bg-primary-100 border border-primary-300 text-black'
                : 'bg-white border border-gray-300 text-black hover:bg-gray-100'
            }`}>
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
}
