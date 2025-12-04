import React, { useState, useRef, useEffect } from 'react';
import './Header.css';
import logoImg from '../../assets/logo.png';
import notificationIcon from '../../assets/notification-icon.jpg';
import { useAuth } from '../../hooks/useAuth';
import { notificationService, type Notification } from '../../services';

interface HeaderProps {
  className?: string;
}

interface DropdownItem {
  label: string;
  href: string;
}

interface MenuItemProps {
  label: string;
  href?: string;
  dropdownItems?: DropdownItem[];
  isDropdownOpen?: boolean;
  onToggleDropdown?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  label, 
  href, 
  dropdownItems, 
  isDropdownOpen, 
  onToggleDropdown 
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isDropdownOpen && onToggleDropdown) {
          onToggleDropdown();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, onToggleDropdown]);

  if (dropdownItems && dropdownItems.length > 0) {
    return (
      <div className="menu-item dropdown-container" ref={dropdownRef}>
        <button 
          className="menu-link dropdown-trigger"
          onClick={onToggleDropdown}
          aria-expanded={isDropdownOpen}
        >
          {label}
          <svg 
            className={`dropdown-arrow ${isDropdownOpen ? 'rotate' : ''}`}
            width="12" 
            height="12" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M7 10l5 5 5-5z"/>
          </svg>
        </button>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            {dropdownItems.map((item, index) => (
              <a key={index} href={item.href} className="dropdown-item">
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="menu-item">
      <a href={href} className="menu-link">
        {label}
      </a>
    </div>
  );
};

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationList, setNotificationList] = useState<Notification[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const notificationListRef = useRef<HTMLDivElement>(null);
  
  // Mock user data - in real app, this would come from useAuth hook
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;

  // WebSocket connection for real-time notifications
  useEffect(() => {
    if (!user?.id) return;

    // Connect to WebSocket
    notificationService.connect(user.id.toString());

    // Subscribe to new notifications
    const unsubscribe = notificationService.subscribe((notification) => {
      console.log('New notification received:', notification);
      
      // Add to notification list
      setNotificationList(prev => [notification, ...prev]);
      
      // Increment unread count if unread
      if (!notification.read) {
        setNotificationCount(prev => prev + 1);
      }

      // Optional: Show browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.content,
          icon: '/favicon.ico'
        });
      }
    });

    // Request browser notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Cleanup on unmount
    return () => {
      unsubscribe();
      notificationService.disconnect();
    };
  }, [user?.id]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await notificationService.getNotifications(0, 20);
        setNotificationList(data.notifications || []);
        setNotificationCount(data.unreadCount || 0);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        // Fallback to mock data
        setNotificationList(allNotifications);
        setNotificationCount(2);
      }
    };

    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleToggleDropdown = (dropdownName: string) => {
    setActiveDropdown(activeDropdown === dropdownName ? null : dropdownName);
  };

  // const handleSearch = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // Handle search logic here
  //   console.log('Searching for:', searchQuery);
  // };

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
  };

  // Handle scroll to load more notifications
  const handleNotificationScroll = async (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollPosition = target.scrollTop + target.clientHeight;
    const scrollHeight = target.scrollHeight;
    
    // Load more when scrolled to 80% of the list
    if (scrollPosition >= scrollHeight * 0.8 && !isLoadingMore) {
      setIsLoadingMore(true);
      
      try {
        const data = await notificationService.getNotifications(notificationList.length, 10);
        setNotificationList(prev => [...prev, ...data.notifications]);
      } catch (error) {
        console.error('Error loading more notifications:', error);
      } finally {
        setIsLoadingMore(false);
      }
    }
  };

  // Mark notification as read - REST API
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotificationList(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true, readAt: new Date().toISOString() } : n)
      );
      setNotificationCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Mark all as read - REST API
  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotificationList(prev => prev.map(n => ({ ...n, read: true, readAt: new Date().toISOString() })));
      setNotificationCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationOpen(false);
      }
    };

    if (isUserDropdownOpen || isNotificationOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserDropdownOpen, isNotificationOpen]);

  const coursesDropdown: DropdownItem[] = [
    { label: 'Beginner', href: '/courses/beginner' },
    { label: 'Intermediate', href: '/courses/intermediate' },
    { label: 'Advanced', href: '/courses/advanced' },
    { label: 'Business English', href: '/courses/business' }
  ];

  const skillsDropdown: DropdownItem[] = [
    { label: 'Listening', href: '/skills/listening' },
    { label: 'Speaking', href: '/skills/speaking' },
    { label: 'Reading', href: '/skills/reading' },
    { label: 'Writing', href: '/skills/writing' }
  ];

  // Mock notification data (fallback)
  const allNotifications: Notification[] = [
    { id: '1', userId: '1', type: 'LESSON', title: 'New lesson available', content: 'Advanced Grammar Unit 5 is now available', createdAt: new Date(Date.now() - 2*60*60*1000).toISOString(), readAt: null, read: false },
    { id: '2', userId: '1', type: 'ACHIEVEMENT', title: 'Achievement unlocked', content: "You've completed 10 lessons this week!", createdAt: new Date(Date.now() - 5*60*60*1000).toISOString(), readAt: null, read: false },
    { id: '3', userId: '1', type: 'REMINDER', title: 'Reminder', content: "Don't forget to practice speaking today", createdAt: new Date(Date.now() - 24*60*60*1000).toISOString(), readAt: new Date(Date.now() - 12*60*60*1000).toISOString(), read: true },
    { id: '4', userId: '1', type: 'COURSE', title: 'New course available', content: 'Business English for Professionals', createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString(), readAt: new Date(Date.now() - 1*24*60*60*1000).toISOString(), read: true },
  ];

  return (
    <header className={`header ${className}`}>
      <div className="header-container">
        {/* Logo & Brand */}
        <div className="header-brand">
          <a href="/" className="brand-link">
            <div className="logo-container">
              <img src={logoImg} alt="ENGLISHHUB Logo" className="header-logo" />
              <div className="brand-text">
                <h1 className="brand-name">ENGHUB</h1>
                <p className="brand-slogan">Learn English Smarter, Faster</p>
              </div>
            </div>
          </a>
        </div>

        {/* Navigation Menu */}
        <nav className={`header-nav ${isMenuOpen ? 'nav-open' : ''}`}>
          <MenuItem 
            label="Courses" 
            dropdownItems={coursesDropdown}
            isDropdownOpen={activeDropdown === 'courses'}
            onToggleDropdown={() => handleToggleDropdown('courses')}
          />
          
          {/* <MenuItem 
            label="Skills" 
            dropdownItems={skillsDropdown}
            isDropdownOpen={activeDropdown === 'skills'}
            onToggleDropdown={() => handleToggleDropdown('skills')}
          /> */}
          
          {/* <MenuItem label="Resources" href="/resources" /> */}
          <MenuItem label="Speaking Training" href="/speaking-training" />
          <MenuItem label="About Us" href="/about" />
          <MenuItem label="Contact" href="/contact" />
        </nav>

        {/* Right Section */}
        <div className="header-actions">
          {/* Search Bar */}
          {/* <form className="search-form" onSubmit={handleSearch}>
            <div className="search-container">
              <input
                type="text"
                placeholder="Tìm khóa học, bài học..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn" aria-label="Search">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
              </button>
            </div>
          </form> */}

          {/* Notifications */}
          <div className="notification-container" ref={notificationRef}>
            <button 
              className="notification-btn"
              aria-label="Notifications"
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
            >
              <img src={notificationIcon} alt="Notifications" className="notification-icon" />
              {isAuthenticated && notificationCount > 0 && (
                <span className="notification-badge">{notificationCount}</span>
              )}
            </button>
            
            {isNotificationOpen && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h3>Notifications</h3>
                  <button className="mark-all-read" onClick={handleMarkAllAsRead}>
                    Mark all as read
                  </button>
                </div>
                <div 
                  className="notification-list" 
                  ref={notificationListRef}
                  onScroll={handleNotificationScroll}
                >
                  {notificationList.length > 0 ? (
                    notificationList.map((notif) => (
                      <div 
                        key={notif.id} 
                        className={`notification-item ${!notif.read ? 'unread' : 'read'}`}
                        onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                      >
                        <div className="notification-content">
                          {!notif.read && <span className="unread-dot"></span>}
                          <div className="notification-text-wrapper">
                            <p className="notification-title">{notif.title}</p>
                            <p className="notification-text">{notif.content}</p>
                            <span className="notification-time">
                              {new Date(notif.createdAt).toLocaleString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="notification-empty">
                      <p>No notifications yet</p>
                    </div>
                  )}
                  {isLoadingMore && (
                    <div className="notification-loading">
                      <span>Loading more...</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Authentication */}
          <div className="auth-section">
            {isAuthenticated ? (
              <div className="user-menu" ref={userMenuRef}>
                <button 
                  className="user-avatar-btn"
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  aria-expanded={isUserDropdownOpen}
                >
                  <div className="user-avatar">
                    {user?.avatar ? (
                      <img src={user.avatar} alt={user.username} className="avatar-img" />
                    ) : (
                      <div className="avatar-placeholder">
                        {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                  <svg 
                    className={`dropdown-arrow ${isUserDropdownOpen ? 'rotate' : ''}`}
                    width="12" 
                    height="12" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 10l5 5 5-5z"/>
                  </svg>
                </button>
                
                {isUserDropdownOpen && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <p className="user-name">{user?.username}</p>
                      <p className="user-email">{user?.email}</p>
                    </div>
                    <div className="dropdown-divider"></div>
                    <a href="/profile" className="dropdown-item">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                      Profile
                    </a>
                    <a href="/dashboard" className="dropdown-item">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                      </svg>
                      Dashboard
                    </a>
                    <button onClick={handleLogout} className="dropdown-item logout-btn">
                      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <a href="/login" className="auth-btn login-btn">Login</a>
                <a href="/register" className="auth-btn register-btn">Register</a>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="mobile-menu-btn"
            onClick={handleToggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            <div className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay" onClick={handleToggleMenu}>
          <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <div className="mobile-brand">
                <img src={logoImg} alt="ENGLISHHUB Logo" className="mobile-logo" />
                <span className="mobile-brand-name">ENGHUB</span>
              </div>
              <button className="mobile-close-btn" onClick={handleToggleMenu}>
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>
            
            <nav className="mobile-nav">
              <div className="mobile-nav-section">
                <span className="mobile-section-title">Courses</span>
                {coursesDropdown.map((item, index) => (
                  <a key={index} href={item.href} className="mobile-nav-subitem">
                    {item.label}
                  </a>
                ))}
              </div>
              
              <div className="mobile-nav-section">
                <span className="mobile-section-title">Skills</span>
                {skillsDropdown.map((item, index) => (
                  <a key={index} href={item.href} className="mobile-nav-subitem">
                    {item.label}
                  </a>
                ))}
              </div>
              
              <a href="/resources" className="mobile-nav-item">Resources</a>
              <a href="/about" className="mobile-nav-item">About Us</a>
              <a href="/contact" className="mobile-nav-item">Contact</a>
            </nav>
            
            <div className="mobile-actions">
              {!isAuthenticated && (
                <div className="mobile-auth">
                  <a href="/login" className="mobile-auth-btn login">Login</a>
                  <a href="/register" className="mobile-auth-btn register">Register</a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};