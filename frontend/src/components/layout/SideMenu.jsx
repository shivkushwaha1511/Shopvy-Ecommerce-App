import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const SideMenu = () => {
  const location = useLocation();

  const [activeItem, setActiveItem] = useState(location.pathname);

  const handleItemClick = (url) => {
    setActiveItem(url);
  };

  const menuItems = [
    {
      name: "Profile",
      url: "/me/profile",
      icon: "fas fa-user",
    },
    {
      name: "Update Profile",
      url: "/me/update_profile",
      icon: "fas fa-user",
    },
    {
      name: "Upload Avatar",
      url: "/me/upload_avatar",
      icon: "fas fa-user-circle",
    },
    {
      name: "Update Password",
      url: "/me/password",
      icon: "fas fa-lock",
    },
  ];
  return (
    <div class="list-group mt-5 pl-4">
      {menuItems.map((item, idx) => (
        <Link
          to={item.url}
          className={`fw-bold list-group-item list-group-item-action ${
            activeItem.includes(item.url) ? "active" : null
          }`}
          key={idx}
          onClick={() => handleItemClick(item.url)}
          aria-current={activeItem.includes(item.url) ? true : false}
        >
          <i class={`${item.icon} fa-fw pe-2`}></i> {item.name}
        </Link>
      ))}
    </div>
  );
};

export default SideMenu;
