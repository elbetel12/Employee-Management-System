import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  useEffect(() => {
    // Load scripts after the component mounts
    const loadScripts = () => {
      try {
        // Initialize scripts if they exist in the window object
        if ((window as any).jQuery) {
          // Initialize off-canvas
          const offCanvasInit = (window as any).$('[data-toggle="offcanvas"]');
          if (offCanvasInit && offCanvasInit.length > 0) {
            offCanvasInit.click();
          }
          
          // Initialize dropdown menus
          const dropdowns = document.querySelectorAll('.dropdown-toggle');
          dropdowns.forEach(dropdown => {
            dropdown.addEventListener('click', (e) => {
              e.preventDefault();
              const target = dropdown.nextElementSibling as HTMLElement;
              if (target && target.classList.contains('dropdown-menu')) {
                target.classList.toggle('show');
              }
            });
          });
        }
      } catch (error) {
        console.error('Error initializing scripts:', error);
      }
    };

    // Handle sidebar toggle
    const body = document.querySelector('body');
    const sidebarToggle = document.querySelectorAll('.navbar-toggler');
    
    sidebarToggle.forEach(toggle => {
      toggle.addEventListener('click', () => {
        body?.classList.toggle('sidebar-icon-only');
      });
    });

    // Handle fullscreen toggle
    const fullscreenButton = document.getElementById('fullscreen-button');
    fullscreenButton?.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
        fullscreenButton.classList.add('mdi-fullscreen-exit');
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          fullscreenButton.classList.remove('mdi-fullscreen-exit');
        }
      }
    });

    // Load scripts after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      loadScripts();
    }, 100);

    return () => {
      // Cleanup event listeners
      clearTimeout(timer);
      
      sidebarToggle.forEach(toggle => {
        toggle.removeEventListener('click', () => {
          body?.classList.toggle('sidebar-icon-only');
        });
      });

      fullscreenButton?.removeEventListener('click', () => {});
      
      // Clean up dropdown listeners
      const dropdowns = document.querySelectorAll('.dropdown-toggle');
      dropdowns.forEach(dropdown => {
        dropdown.removeEventListener('click', () => {});
      });
    };
  }, []);

  return (
    <div className="container-scroller">
      <Header />
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="content-wrapper">
            {children}
          </div>
          <footer className="footer">
            <div className="d-sm-flex justify-content-center justify-content-sm-between">
              <span className="text-muted text-center text-sm-left d-block d-sm-inline-block">
                Copyright © {new Date().getFullYear()} EMS. All rights reserved.
              </span>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Layout; 