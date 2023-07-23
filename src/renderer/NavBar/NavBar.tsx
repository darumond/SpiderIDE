import * as React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

type ContainerProps = {
  children: React.ReactNode;
};


const NavBar: React.FC<ContainerProps> = (props) => {
  const theme = useTheme();

  return (
    <Box
      className="flex flex-col gap-nav-gap p-nav-pad max-w-screen-sm border-r-primary-light border-solid border-r-2 border-l-0 border-t-0 border-b-0"
      sx={{
        alignItems: 'center',
        height: '100%',
        backgroundColor: 'primary.main',
      }}
    >
      {props.children}
    </Box>
  );
};

export default NavBar;
