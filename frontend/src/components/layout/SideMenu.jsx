import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const SideMenu = ({ menuItems }) => {
  const location = useLocation();

  const [activeItem, setActiveItem] = useState(location.pathname);

  const handleItemClick = (url) => {
    setActiveItem(url);
  };

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
