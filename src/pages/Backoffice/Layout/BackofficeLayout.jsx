import { useState } from 'react';
import {
  Box,
  AppBar,
  Drawer,
  Toolbar,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Breadcrumbs,
  Link,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  FitnessCenter as GymIcon,
  BarChart as CongestionIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  Home as HomeIcon,
  NavigateNext,
} from '@mui/icons-material';
import { Outlet, useNavigate, NavLink, useLocation } from 'react-router-dom';

const DRAWER_WIDTH = 280;
const MOBILE_WIDTH = '393px';

const BackofficeLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Breadcrumb route mapping
  const routeMap = {
    '/backoffice': '대시보드',
    '/backoffice/gyms': '암장 관리',
    '/backoffice/congestion': '혼잡도 관리',
    '/backoffice/settings': '설정',
  };

  // Generate breadcrumb trail
  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    const breadcrumbs = [];

    // Always start with dashboard
    breadcrumbs.push({
      path: '/backoffice',
      label: '대시보드',
      isHome: true,
    });

    // Build path incrementally
    let currentPath = '';
    pathnames.forEach((value, index) => {
      currentPath += `/${value}`;
      if (currentPath !== '/backoffice' && routeMap[currentPath]) {
        breadcrumbs.push({
          path: currentPath,
          label: routeMap[currentPath],
          isHome: false,
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    // TODO: Implement logout logic
    navigate('/backoffice/login');
  };

  const menuItems = [
    { text: '대시보드', icon: <DashboardIcon />, path: '/backoffice' },
    { text: '암장 관리', icon: <GymIcon />, path: '/backoffice/gyms' },
    { text: '혼잡도 관리', icon: <CongestionIcon />, path: '/backoffice/congestion' },
    { text: '설정', icon: <SettingsIcon />, path: '/backoffice/settings' },
  ];

  const drawer = (
    <Box
      sx={{
        height: '100%',
        background: 'linear-gradient(180deg, #1a1f2e 0%, #0f1419 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo / Brand */}
      <Box
        sx={{
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #ff6b35 0%, #ff8f66 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '20px',
            color: '#fff',
            fontFamily: '"Outfit", sans-serif',
            transform: 'rotate(-5deg)',
            boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
          }}
        >
          C
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontFamily: '"Outfit", sans-serif',
            fontWeight: 700,
            color: '#fff',
            fontSize: '20px',
            letterSpacing: '-0.02em',
          }}
        >
          ClimbHub
        </Typography>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ flex: 1, pt: 2, px: 1.5 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
            sx={{ mb: 0.5 }}
          >
            <ListItemButton
              component={NavLink}
              to={item.path}
              end={item.path === '/backoffice'}
              onClick={handleDrawerToggle}
              sx={{
                borderRadius: '12px',
                py: 1.5,
                px: 2,
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                background: 'transparent',
                textDecoration: 'none',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  transform: 'translateX(4px)',
                },
                '&.active': {
                  background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.15) 0%, rgba(255, 143, 102, 0.1) 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.2) 0%, rgba(255, 143, 102, 0.15) 100%)',
                  },
                  '&::before': {
                    height: '60%',
                  },
                  '& .MuiListItemIcon-root': {
                    color: '#ff6b35',
                  },
                  '& .MuiListItemText-primary': {
                    fontWeight: 600,
                    color: '#fff',
                  },
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '3px',
                  height: '0%',
                  background: 'linear-gradient(180deg, #ff6b35 0%, #ff8f66 100%)',
                  borderRadius: '0 4px 4px 0',
                  transition: 'height 0.3s ease',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: 'rgba(255, 255, 255, 0.7)',
                  transition: 'color 0.3s ease',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontFamily: '"DM Sans", sans-serif',
                  fontWeight: 500,
                  fontSize: '15px',
                  color: 'rgba(255, 255, 255, 0.85)',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer Info */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255, 255, 255, 0.4)',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '12px',
          }}
        >
          Version 1.0.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        background: '#f8f9fa',
      }}
    >
      <Box sx={{ width: MOBILE_WIDTH, display: 'flex', minHeight: '100vh', position: 'relative' }}>
        {/* AppBar */}
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            width: MOBILE_WIDTH,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#ffffff',
            borderBottom: '1px solid #e8eaed',
          }}
        >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              color: '#1a1f2e',
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Page Title - Could be dynamic based on route */}
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontFamily: '"Outfit", sans-serif',
              fontWeight: 600,
              color: '#1a1f2e',
              fontSize: '18px',
              letterSpacing: '-0.01em',
            }}
          >
            백오피스
          </Typography>

          {/* User Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                p: 0.5,
                '&:hover': {
                  background: 'rgba(255, 107, 53, 0.08)',
                },
              }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ff8f66 100%)',
                  fontFamily: '"Outfit", sans-serif',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                A
              </Avatar>
            </IconButton>
          </Box>

          {/* Profile Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{
              mt: 1,
              '& .MuiPaper-root': {
                borderRadius: '12px',
                minWidth: 200,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
              },
            }}
          >
            <MenuItem
              onClick={() => {
                navigate('/backoffice/settings');
                handleProfileMenuClose();
              }}
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                py: 1.5,
              }}
            >
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              설정
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={handleLogout}
              sx={{
                fontFamily: '"DM Sans", sans-serif',
                py: 1.5,
                color: '#ff6b35',
              }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: '#ff6b35' }} />
              </ListItemIcon>
              로그아웃
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Drawer - Mobile Only */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: DRAWER_WIDTH,
            border: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: MOBILE_WIDTH,
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #f1f3f5 100%)',
        }}
      >
        {/* Toolbar spacer */}
        <Toolbar />

        {/* Breadcrumbs Navigation */}
        <Box
          sx={{
            px: 2,
            pt: 2,
            pb: 1,
          }}
        >
          <Breadcrumbs
            separator={
              <NavigateNext
                sx={{
                  fontSize: 18,
                  color: '#9ca3af',
                }}
              />
            }
            sx={{
              '& .MuiBreadcrumbs-separator': {
                mx: 0.5,
              },
            }}
          >
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              const isFirst = index === 0;

              if (isLast) {
                // Current page - not clickable
                return (
                  <Box
                    key={crumb.path}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                      px: 1.5,
                      py: 0.75,
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.12) 0%, rgba(255, 143, 102, 0.08) 100%)',
                      border: '1px solid rgba(255, 107, 53, 0.2)',
                    }}
                  >
                    {isFirst && (
                      <HomeIcon
                        sx={{
                          fontSize: 16,
                          color: '#ff6b35',
                        }}
                      />
                    )}
                    <Typography
                      sx={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#ff6b35',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {crumb.label}
                    </Typography>
                  </Box>
                );
              }

              // Previous pages - clickable
              return (
                <Link
                  key={crumb.path}
                  onClick={() => navigate(crumb.path)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: '8px',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      background: 'rgba(255, 107, 53, 0.06)',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  {isFirst && (
                    <HomeIcon
                      sx={{
                        fontSize: 16,
                        color: '#6b7280',
                        transition: 'color 0.2s ease',
                      }}
                    />
                  )}
                  <Typography
                    sx={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#6b7280',
                      letterSpacing: '-0.01em',
                      transition: 'color 0.2s ease',
                      '&:hover': {
                        color: '#ff6b35',
                      },
                    }}
                  >
                    {crumb.label}
                  </Typography>
                </Link>
              );
            })}
          </Breadcrumbs>
        </Box>

        {/* Page Content */}
        <Box
          sx={{
            p: 2,
          }}
        >
          <Outlet />
        </Box>
      </Box>
      </Box>
    </Box>
  );
};

export default BackofficeLayout;
