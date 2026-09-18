"use client";

import Header from "@/core/common/header/header";
import Sidebar from "@/core/common/sidebar/sidebar";
import ThemeSettings from "@/core/common/theme-settings/themeSettings";
import store from "@/core/redux/store";
import { Provider, useSelector } from "react-redux";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";


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

  // Update HTML attributes based on current route
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Remove all layout-related attributes first
    root.removeAttribute("data-layout");
    root.removeAttribute("dir");

    // Remove mini-sidebar class from body
    body.classList.remove("mini-sidebar");

    // Set theme based on Redux state (not route)
    // Special handling for dark route - ensure dark theme is applied
    if (pathname.includes("/layout-dark")) {
      root.setAttribute("data-bs-theme", "dark");
      console.log("Applied dark theme for layout-dark route");
    } else if (themeSettings["data-bs-theme"]) {
      root.setAttribute("data-bs-theme", themeSettings["data-bs-theme"]);
      console.log("Applied theme from Redux:", themeSettings["data-bs-theme"]);
    } else {
      root.setAttribute("data-bs-theme", "light"); // Default theme
      console.log("Applied default light theme");
    }

    // Set layout based on route
    if (pathname.includes("/layout-mini")) {
      root.setAttribute("data-layout", "mini");
      body.classList.add("mini-sidebar");
      
      // Initialize mini sidebar collapse functionality
      initializeMiniSidebar();
    } else if (pathname.includes("/layout-hidden")) {
      root.setAttribute("data-layout", "hidden");
    } else if (pathname.includes("/layout-hoverview")) {
      root.setAttribute("data-layout", "hoverview");
    } else if (pathname.includes("/layout-fullwidth")) {
      root.setAttribute("data-layout", "full-width");
    } else if (pathname.includes("/layout-rtl")) {
      root.setAttribute("dir", "rtl");
    } else if (pathname.includes("/layout-dark")) {
      // Dark theme route - ensure dark theme is applied
      root.setAttribute("data-bs-theme", "dark");
      root.setAttribute("data-layout", "default");
    } else {
      // Default layout
      root.setAttribute("data-layout", "default");
    }
  }, [pathname, themeSettings]);

  // Additional effect to ensure theme is always applied
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply all theme settings from Redux state
    Object.entries(themeSettings).forEach(([key, value]) => {
      if (key === "data-layout") {
        // Handle layout separately
        if (value === "mini") {
          root.classList.add("mini-sidebar");
        } else {
          root.classList.remove("mini-sidebar");
        }
      } else if (key === "dir") {
        root.setAttribute("dir", String(value));
      } else {
        root.setAttribute(key, String(value));
      }
    });
  }, [themeSettings]);

  // Mini sidebar collapse functionality
  const initializeMiniSidebar = () => {
    const sidebar = document.querySelector('.sidebar');
    const body = document.body;
    
    if (!sidebar) return;

    // Hover to expand functionality
    let hoverTimeout: NodeJS.Timeout;
    
    const handleMouseEnter = () => {
      clearTimeout(hoverTimeout);
      body.classList.add('expand-menu');
    };

    const handleMouseLeave = () => {
      hoverTimeout = setTimeout(() => {
        body.classList.remove('expand-menu');
      }, 300); // Delay to prevent flickering
    };

    sidebar.addEventListener('mouseenter', handleMouseEnter);
    sidebar.addEventListener('mouseleave', handleMouseLeave);

    // Click to toggle functionality
    const toggleBtn = document.getElementById('toggle_btn');
    let handleToggleClick: (() => void) | undefined;
    
    if (toggleBtn) {
      handleToggleClick = () => {
        const isExpanded = body.classList.contains('expand-menu');
        if (isExpanded) {
          body.classList.remove('expand-menu');
        } else {
          body.classList.add('expand-menu');
        }
      };
      
      toggleBtn.addEventListener('click', handleToggleClick);
    }

    // Close on outside click
    const handleOutsideClick = (e: Event) => {
      if (!sidebar.contains(e.target as Node) && !toggleBtn?.contains(e.target as Node)) {
        body.classList.remove('expand-menu');
      }
    };

    document.addEventListener('click', handleOutsideClick);

    // Handle mobile behavior
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        body.classList.remove('expand-menu');
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

    // Return cleanup function
    return () => {
      sidebar.removeEventListener('mouseenter', handleMouseEnter);
      sidebar.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleOutsideClick);
      if (toggleBtn && handleToggleClick) {
        toggleBtn.removeEventListener('click', handleToggleClick);
      }
    };
  };

  // Cleanup effect for mini sidebar
  useEffect(() => {
    let cleanup: (() => void) | undefined;
    
    if (pathname.includes("/layout-mini")) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        cleanup = initializeMiniSidebar();
      }, 100);
      
      return () => {
        clearTimeout(timer);
        if (cleanup) cleanup();
      };
    }
  }, [pathname]);

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
