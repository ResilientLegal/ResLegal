import { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import {
    TbUserFilled,
    TbHomeFilled,
    TbBriefcaseFilled,
    TbLogout,
    TbCalendar,
} from 'react-icons/tb';
import { FaRegCalendarAlt } from 'react-icons/fa';   // NEW
import { UnstyledButton } from '@mantine/core';
import { authService } from '../services/authService';
import styles from '../styles/NavSideBar.module.css';

const icons = [
    { icon: TbHomeFilled, label: 'Home', path: '/' },
    { icon: TbBriefcaseFilled, label: 'Matter', path: '/matters' },
    { icon: FaRegCalendarAlt, label: 'Calendar', path: '/calendar' }, // use FA icon
];

function SideBar({ icon: Icon, label, onClick, isActive, path }) {
    return (
        <NavLink to={path}>
            {({ isActive }) => (
                <UnstyledButton 
                    onClick={onClick} 
                    className={styles.link}
                    data-active={isActive || undefined}
                    aria-label={label}
                    title={label}
                >
                    <Icon size={22} stroke={1.6} color="currentColor" />
                </UnstyledButton>
            )}
        </NavLink>
    );
}

export default function NavSideBar() {
    const navigate = useNavigate();
    const [active, setActive] = useState('Home');

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const items = icons.map((item) => (
        <SideBar
            key={item.label}
            icon={item.icon}
            label={item.label}
            path={item.path}
            onClick={() => setActive(item.label)}
            isActive={item.label === active}
        />
    ));

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarMain}>{items}</div>

            <div className={styles.navbarFooter}>
                <SideBar
                    icon={TbUserFilled}
                    label='Profile'
                    path='/profile'
                    onClick={() => setActive('Profile')}
                    isActive={'Profile' === active}
                />
                <UnstyledButton 
                    onClick={handleLogout} 
                    className={styles.logoutLink}
                    title="Logout"
                >
                    <TbLogout size={20} stroke={1.5} />
                </UnstyledButton>
            </div>
        </nav>
    );
}
