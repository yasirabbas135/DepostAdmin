import React from 'react';

const Sidebar = ({ onMenuClick,menuItems, logo, onLogout }) => {
  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="h-16 flex items-center w-full">
        <a className="h-6 w-6 mx-auto" href="#">
          <img
            className="h-6 w-6 mx-auto"
            src={
              logo ||
              'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Svelte_Logo.svg/512px-Svelte_Logo.svg.png'
            }
            alt="logo"
          />
        </a>
      </div>

      {/* Menu Items */}
      <ul className="flex-grow">
        {menuItems.map((item, index) => (
          <li key={index} className="px-4">
            <button onClick={() => onMenuClick(item.id)} className="menu-item group focus:outline-none">
              {/* Icon with Animated Hover and Focus Effects */}
              <div className="menu-icon group-hover:bg-white group-focus:bg-white group-active:bg-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-focus:scale-110 group-hover:fill-orange-500 group-focus:fill-orange-500">
                  <path d={item.icon} />
                </svg>
              </div>
            </button>
          </li>
        ))}
      </ul>

      {/* Logout or Bottom Action */}
      <div className="mt-auto h-16 flex items-center w-full">
        <button onClick={onLogout} className="menu-item group focus:outline-none">
          {/* Icon with Animated Hover and Focus Effects */}
          <div className="menu-icon group-hover:bg-white group-focus:bg-white group-active:bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              className="w-5 h-5 transition-transform duration-300 group-hover:scale-110 group-focus:scale-110 group-hover:fill-orange-500 group-focus:fill-orange-500">
              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
            </svg>
          </div>
          {/* Label with Dynamic Styles */}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
