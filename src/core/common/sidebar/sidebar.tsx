"use client";
/* eslint-disable @next/next/no-img-element */
import { useDispatch, useSelector } from "react-redux";
import ImageWithBasePath from "../imageWithBasePath";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import "overlayscrollbars/overlayscrollbars.css";
import { SidebarData } from "./sidebarData";
import React from "react";
import { all_routes } from "@/router/all_routes";
import { updateTheme } from "@/core/redux/themeSlice";
import { setExpandMenu, setMobileSidebar } from "@/core/redux/sidebarSlice";
import Link from "next/link";
import Cookies from "js-cookie";


const Sidebar = () => {
  const route = all_routes;
  const pathname = usePathname();
  // Track open state for each menu by label
  const [openMenus, setOpenMenus] = useState<{ [label: string]: boolean }>({});
  const dispatch = useDispatch();


  // On mount or pathname change, auto-open submenus with an active link
  useEffect(() => {
    const newOpenMenus: { [label: string]: boolean } = {};
    SidebarData.forEach((mainLabel) => {
      mainLabel.submenuItems?.forEach((title: any) => {
        // If any submenu link is active, open this menu
        const isActive =
          title.link === pathname ||
          (title.relatedRoutes && title.relatedRoutes.includes(pathname)) ||
          (title.submenuItems && title.submenuItems.some((item: any) =>
            item.link === pathname ||
            (item.relatedRoutes && item.relatedRoutes.includes(pathname)) ||
            (item.submenuItems && item.submenuItems.some((subitem: any) =>
              subitem.link === pathname ||
              (subitem.relatedRoutes && subitem.relatedRoutes.includes(pathname))
            ))
          ));
        if (isActive) {
          newOpenMenus[title.label] = true;
        }
      });
    });
    // Reset the open menus state completely instead of extending it
    setOpenMenus(newOpenMenus);
  }, [pathname]);

  // Toggle logic for main menus
  const handleMenuToggle = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const handleClick = (label: any) => {
    handleMenuToggle(label);
  };

  const themeSettings = useSelector((state: any) => state.theme.themeSettings);

  const handleMiniSidebar = () => {
    const rootElement = document.documentElement;
    const isMini = rootElement.getAttribute("data-layout") === "mini";
    const updatedLayout = isMini ? "default" : "mini";
    dispatch(
      updateTheme({
        "data-layout": updatedLayout,
      })
    );
    if (isMini) {
      rootElement.classList.remove("mini-sidebar");
    } else {
      rootElement.classList.add("mini-sidebar");
    }
  };
  const onMouseEnter = () => {
    dispatch(setExpandMenu(true));
  };
  const onMouseLeave = () => {
    dispatch(setExpandMenu(false));
  };

  const handleLayoutClick = (layout: string) => {
    const layoutSettings: any = {
      "data-layout": "default",
      dir: "ltr",
    };

    let redirectUrl = "/deals-dashboard"; // default

    switch (layout) {
      case "Default":
        layoutSettings["data-layout"] = "default";
        redirectUrl = "/layout-default";
        break;
      case "Hidden":
        layoutSettings["data-layout"] = "hidden";
        redirectUrl = "/layout-hidden";
        break;
      case "Mini":
        layoutSettings["data-layout"] = "mini";
        redirectUrl = "/layout-mini";
        break;
      case "Hover View":
        layoutSettings["data-layout"] = "hoverview";
        redirectUrl = "/layout-hoverview";
        break;
      case "Full Width":
        layoutSettings["data-layout"] = "full-width";
        redirectUrl = "/layout-full-width";
        break;
      case "Dark":
        layoutSettings["data-bs-theme"] = "dark";
        redirectUrl = "/layout-dark";
        console.log("Dark layout selected, settings:", layoutSettings);
        break;
      case "RTL":
        layoutSettings.dir = "rtl";
        redirectUrl = "/layout-rtl";
        break;
      default:
        break;
    }

    // Dispatch the theme update (this will handle persistence via cookies)
    dispatch(updateTheme(layoutSettings));
    
    // Apply settings immediately to the DOM
    const rootElement = document.documentElement;
    Object.entries(layoutSettings).forEach(([key, value]) => {
      rootElement.setAttribute(key, String(value));
    });
    
    // Navigate to the layout page
    window.location.href = redirectUrl;
  };
  const mobileSidebar = useSelector(
    (state: any) => state.sidebarSlice.mobileSidebar
  );
  const toggleMobileSidebar = () => {
    dispatch(setMobileSidebar(!mobileSidebar));
  };
  // Theme management is now handled in the layout component
  // useEffect(() => {
  //   const rootElement: any = document.documentElement;
  //   
  //   // Apply theme settings from Redux
  //   Object.entries(themeSettings).forEach(([key, value]) => {
  //     if (key === "data-layout") {
  //       // Handle layout separately to avoid conflicts
  //       if (value === "mini") {
  //         rootElement.classList.add("mini-sidebar");
  //       } else {
  //         rootElement.classList.remove("mini-sidebar");
  //       }
  //     } else {
  //       rootElement.setAttribute(key, value);
  //     }
  //   });
  // }, [themeSettings]);

  

  return (
    <>
      {/* Sidenav Menu Start */}
      <div
        className="sidebar"
        id="sidebar"
        onMouseEnter={() => dispatch(setExpandMenu(true))}
        onMouseLeave={() => dispatch(setExpandMenu(false))}
      >
        {/* Start Logo */}
        <div className="sidebar-logo">
          <div>
            {/* Logo Normal */}
            <Link href={route.dealsDashboard} className="logo logo-normal">
              <ImageWithBasePath src="assets/img/logo.svg" alt="Logo" />
            </Link>
            {/* Logo Small */}
            <Link href={route.dealsDashboard} className="logo-small">
              <ImageWithBasePath src="assets/img/logo-small.svg" alt="Logo" />
            </Link>
            {/* Logo Dark */}
            <Link href={route.dealsDashboard} className="dark-logo">
              <ImageWithBasePath src="assets/img/logo-white.svg" alt="Logo" />
            </Link>
          </div>
          <button
            className="sidenav-toggle-btn btn border-0 p-0 active"
            id="toggle_btn"
            onClick={handleMiniSidebar}
          >
            <i className="ti ti-arrow-bar-to-left" />
          </button>
          {/* Sidebar Menu Close */}
          <button className="sidebar-close" onClick={toggleMobileSidebar}>
            <i className="ti ti-x align-middle" />
          </button>
        </div>
        {/* End Logo */}
        {/* Sidenav Menu */}

        <div className="sidebar-inner" data-simplebar="">
          <OverlayScrollbarsComponent style={{ height: "100%", width: "100%" }}>
            <div id="sidebar-menu" className="sidebar-menu">
              <ul>
                {SidebarData?.map((mainLabel, index) => (
                  <React.Fragment key={`main-${index}`}>
                    <li className="menu-title">
                      <span>{mainLabel?.tittle}</span>
                    </li>
                    <li>
                      <ul>
                        {mainLabel?.submenuItems?.map((title: any, i) => {
                          // If any submenu link is active
                          const isSubmenuActive =
                            (title?.submenuItems &&
                              title.submenuItems.some(
                                (item: any) =>
                                  item?.link === pathname ||
                                  (item?.submenuItems &&
                                    item.submenuItems.some(
                                      (subitem: any) => subitem?.link === pathname
                                    ))
                              )) ||
                            false;

                          const isActive =
                            (title.relatedRoutes && title.relatedRoutes.includes(pathname)) ||
                            title.link === pathname ||
                            isSubmenuActive;

                          const isOpen = !!openMenus[title.label];

                          return (
                            <li className="submenu" key={`title-${i}`}> 
                              <Link
                                href={title?.submenu ? "#" : (title?.link || "#")}
                                onClick={e => {
                                  if (title?.submenu) {
                                    e.preventDefault();
                                    handleMenuToggle(title.label);
                                  } else {
                                    // If not a submenu, let navigation happen
                                  }
                                }}
                                className={`${isActive ? "active" : ""} ${isOpen ? "subdrop" : ""}`}
                              >
                                <i className={`ti ti-${title.icon}`}></i>
                                <span>{title?.label}</span>
                                {(title?.submenu || title?.customSubmenuTwo) && (
                                  <span className="menu-arrow"></span>
                                )}
                                {title?.submenu === false &&
                                  title?.version === "v2.0" && (
                                    <span className="badge bg-danger ms-2 rounded-2 badge-md fs-12 fw-medium">
                                      v2.0
                                    </span>
                                  )}
                              </Link>

                              {title?.submenu !== false && (
                                <ul
                                  style={{
                                    display: isOpen ? "block" : "none",
                                  }}
                                >
                                  {title?.submenuItems?.map(
                                    (item: any, j: any) => {
                                      const isSubActive =
                                        item?.submenuItems
                                          ?.map((link: any) => link?.link)
                                          .includes(pathname) ||
                                        item?.link === pathname;

                                      return (
                                        <li
                                          className={`${
                                            item?.submenuItems
                                              ? "submenu submenu-two"
                                              : ""
                                          } `}
                                          key={`item-${j}`}
                                        >
                                          <Link
                                            href={
                                              item?.submenu ? "#" : (item?.link || "#")
                                            }
                                            className={`${
                                              isSubActive
                                                ? "active subdrop"
                                                : ""
                                            }`}
                                            // Add submenu toggle logic here if you want nested toggles
                                          >
                                            {item?.label}
                                            {(item?.submenu ||
                                              item?.customSubmenuTwo) && (
                                              <span className="menu-arrow"></span>
                                            )}
                                          </Link>
                                          {item?.submenuItems ? (
                                            <ul
                                              style={{
                                                display: false ? "block" : "none", // Add nested submenu open logic if needed
                                              }}
                                            >
                                              {item?.submenuItems?.map(
                                                (items: any, k: any) => {
                                                  const isSubSubActive =
                                                    items?.submenuItems
                                                      ?.map(
                                                        (link: any) => link.link
                                                      )
                                                      .includes(
                                                        pathname
                                                      ) ||
                                                    items?.link ===
                                                      pathname;

                                                  return (
                                                    <li
                                                      key={`submenu-item-${k}`}
                                                    >
                                                      <Link
                                                        href={
                                                          items?.submenu
                                                            ? "#"
                                                            : (items?.link || "#")
                                                        }
                                                        className={`${
                                                          isSubSubActive
                                                            ? "active"
                                                            : ""
                                                        }`}
                                                      >
                                                        {items?.label}
                                                      </Link>
                                                    </li>
                                                  );
                                                }
                                              )}
                                            </ul>
                                          ) : null}
                                        </li>
                                      );
                                    }
                                  )}
                                </ul>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  </React.Fragment>
                ))}
              </ul>
            </div>
          </OverlayScrollbarsComponent>
        </div>
      </div>
      {/* Sidenav Menu End */}
    </>
  );
};

export default Sidebar;
