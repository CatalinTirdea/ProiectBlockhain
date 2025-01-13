import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <AppBar position="static" sx={{ backgroundColor: '#333' }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Blockchain App
                </Typography>
                <Box>
                    <Button color="inherit" component={Link} to="/">
                        Home
                    </Button>
                    <Button color="inherit" component={Link} to="/donate">
                        Donate
                    </Button>
                    <Button color="inherit" component={Link} to="/events">
                        Events
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
