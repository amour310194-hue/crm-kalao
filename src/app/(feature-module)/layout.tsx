"use client";

import Header from "@/core/common/header/header";
import Sidebar from "@/core/common/sidebar/sidebar";
import ThemeSettings from "@/core/common/theme-settings/themeSettings";
import store from "@/core/redux/store";
import { Provider, useSelector } from "react-redux";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import { applyMiniSidebar } from "@/lib/mini-sidebar";


// Child component for Redux hooks
function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const { miniSidebar, mobileSidebar, expandMenu } = useSelector(
    (state: any) => state.sidebarSlice
  );
  // Add these if you store them in Redux, otherwise fetch from document.documentElement
  const themeSettings = useSelector((state: any) => state.theme.themeSettings);
  const dataLayout = themeSettings?.["data-layout"] || "";
  const dataSize = themeSettings?.["data-size"] || "";
  const dataWidth = themeSettings?.["data-width"] || "";
  const dir = themeSettings?.dir || "";

  // Simple menu state reset when route changes
  useEffect(() => {
    // Reset mobile sidebar when route changes to prevent mobile menu issues
    if (mobileSidebar) {
      // Only reset if mobile sidebar is currently open
      const mobileSidebarElement = document.querySelector('.sidebar');
      if (mobileSidebarElement) {
        document.body.classList.remove('menu-opened', 'slide-nav');
      }
    }
  }, [pathname, mobileSidebar]);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(themeSettings).forEach(([key, value]) => {
      if (key === "data-layout") return;
      root.setAttribute(key, String(value));
    });
    const mini =
      miniSidebar ||
      themeSettings["data-layout"] === "mini" ||
      themeSettings["data-size"] === "compact";
    applyMiniSidebar(mini);
  }, [themeSettings, miniSidebar]);

  // Handle close-filter-btn clicks
  useEffect(() => {
    const handleCloseFilterClick = (event: Event) => {
      const target = event.target as HTMLElement;
      
      // Check if the clicked element has the .close-filter-btn class
      if (target.classList.contains('close-filter-btn')) {
        // Find the closest parent .dropdown-menu
        const dropdownMenu = target.closest('.dropdown-menu');
        
        if (dropdownMenu) {
          // Remove the .show class from the dropdown-menu
          dropdownMenu.classList.remove('show');
          
          // Optionally remove .show from the toggle button or dropdown wrapper
          const dropdownWrapper = dropdownMenu.closest('.dropdown');
          if (dropdownWrapper) {
            const toggleButton = dropdownWrapper.querySelector('[data-bs-toggle="dropdown"]');
            if (toggleButton) {
              toggleButton.classList.remove('show');
            }
            dropdownWrapper.classList.remove('show');
          }
        }
      }
    };

    // Add event listener to document for event delegation
    document.addEventListener('click', handleCloseFilterClick);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener('click', handleCloseFilterClick);
    };
  }, []);

  return (
    <div
      className={`
        ${
          miniSidebar || dataLayout === "mini" || dataSize === "compact"
            ? "mini-sidebar"
            : ""
        }
        ${
          (expandMenu && miniSidebar) || (expandMenu && dataLayout === "mini")
            ? "expand-menu"
            : ""
        }
        ${mobileSidebar ? "menu-opened slide-nav" : ""}
        ${dataWidth === "box" ? "layout-box-mode mini-sidebar" : ""}
        ${dir === "rtl" ? "layout-mode-rtl" : ""}
        main-wrapper
      `}
    >
      <Header />
      <Sidebar />
      <ThemeSettings />
      {children}
    </div>
  );
}

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Provider store={store}>
      <AuthGuard>
        <LayoutContent>{children}</LayoutContent>
      </AuthGuard>
    </Provider>
  );
}
