import * as React from 'react';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import CompareArrowsOutlinedIcon from '@mui/icons-material/CompareArrowsOutlined';
import IconButton from '@mui/material/IconButton';
import ListAltIcon from "@mui/icons-material/ListAlt";
import ConfigJSON from 'renderer/ConfigJSON/ConfigJSON';
import GitHubIcon from '@mui/icons-material/GitHub';

type NavBarIconProps = {
    iconType: string;
    onClick: () => void;
};

const NavBarIcon: React.FC<NavBarIconProps> = ({ iconType, onClick }) => {
    let IconComponent;

    switch (iconType) {
        case 'folder':
            IconComponent = FolderOutlinedIcon;
            break;
        case 'construction':
            IconComponent = ListAltIcon;
            break;
        case 'send':
            IconComponent = CompareArrowsOutlinedIcon;
            break;
        case 'git':
            IconComponent = GitHubIcon;
            break;
        default:
            IconComponent = FolderOutlinedIcon;
            break;
    }

    const handleIconClick = () => {
        if (iconType === 'construction') {
            onClick();
        }
        if (iconType === 'folder') {
            onClick();
        }
        if (iconType === 'send') {
            onClick();
        }
        if (iconType === 'git') {
            onClick();
        }
    };

    return (
        <IconButton onClick={handleIconClick}>
            <IconComponent fontSize="large" sx={{ color: 'secondary.main' }} />
        </IconButton>
    );
};

export default NavBarIcon;
