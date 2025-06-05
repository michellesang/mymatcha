import React from 'react';
import { AppBar, Avatar, Box, Button, Toolbar, styled } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(8px)',
    boxShadow: '0 2px 10px rgba(255, 192, 203, 0.2)',
    margin: '16px 24px 0 24px',
    width: 'calc(100% - 48px)',
    borderRadius: '15px',
    zIndex: theme.zIndex.drawer + 1,
}));

const NavButton = styled(Button)({
    color: '#ff92a5',
    textTransform: 'lowercase',
    marginLeft: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    '&:hover': {
        backgroundColor: '#fff5f6',
    },
});

const NavAvatar = styled(Avatar)({
    width: 30,
    height: 30,
    backgroundColor: '#ffb6c1',
    fontSize: '1rem',
});

const UserSection = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
});

const LogoLink = styled(Link)({
    textDecoration: 'none',
    color: '#ff92a5',
    fontSize: '1.4rem',
    textTransform: 'lowercase',
    display: 'flex',
    alignItems: 'center',
});

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleUnauthenticatedClick = (e) => {
        e.preventDefault();
        navigate('/auth');
    };

    return (
        <>
            <StyledAppBar position="fixed">
                <Toolbar>
                    <LogoLink to="/">
                        <img
                            src="/mymatcha.png"
                            alt="mymatcha Logo"
                            style={{
                                height: '40px',
                                width: 'auto',
                                marginRight: '10px'
                            }}
                        />
                        mymatcha!
                    </LogoLink>
                    <Box sx={{ flexGrow: 1 }} />
                    <UserSection>
                        <NavButton
                            component={Link}
                            to="/collection"
                            onClick={!user ? handleUnauthenticatedClick : undefined}
                        >
                            your collection
                        </NavButton>
                        <NavButton
                            component={Link}
                            to="/add"
                            onClick={!user ? handleUnauthenticatedClick : undefined}
                        >
                            add matcha form
                        </NavButton>
                        {user ? (
                            <>
                                <NavButton
                                    component={Link}
                                    to="/profile"
                                >
                                    <NavAvatar>
                                        {user.email ? user.email[0].toUpperCase() : '?'}
                                    </NavAvatar>
                                    profile
                                </NavButton>
                                <NavButton
                                    onClick={handleLogout}
                                >
                                    logout
                                </NavButton>
                            </>
                        ) : (
                            <NavButton
                                component={Link}
                                to="/auth"
                            >
                                login
                            </NavButton>
                        )}
                    </UserSection>
                </Toolbar>
            </StyledAppBar>
            {!isHomePage && <Toolbar />} {/* Spacer */}
        </>
    );
};

export default Navbar;