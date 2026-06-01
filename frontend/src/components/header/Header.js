import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAuth } from '../../context/AuthContext';

const navButtonSx = {
  color: 'text.primary',
  '&.active': { color: 'primary.main', fontWeight: 700 },
};

const Header = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ maxWidth: 1100, width: '100%', mx: 'auto' }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 700, flexGrow: 1 }}
        >
          Founder&apos;s<Box component="span" sx={{ color: 'primary.main' }}>Box</Box>
        </Typography>

        <Stack direction="row" spacing={1} alignItems="center">
          <Button component={NavLink} to="/shop" sx={navButtonSx} variant="text">
            Shop
          </Button>

          {isLoggedIn ? (
            <>
              <Button component={NavLink} to="/dashboard" sx={navButtonSx} variant="text">
                Dashboard
              </Button>
              <Button component={NavLink} to="/categories" sx={navButtonSx} variant="text">
                Categories
              </Button>
              <Button component={NavLink} to="/orders" sx={navButtonSx} variant="text">
                Orders
              </Button>
              {user?.role === 'admin' && (
                <Button component={NavLink} to="/admin" sx={navButtonSx} variant="text">
                  Admin
                </Button>
              )}
              <Button onClick={handleLogout} variant="contained">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button component={NavLink} to="/login" sx={navButtonSx} variant="text">
                Login
              </Button>
              <Button component={NavLink} to="/register" variant="contained">
                Register
              </Button>
            </>
          )}

          <IconButton component={Link} to="/cart" color="primary">
            <Badge color="primary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
