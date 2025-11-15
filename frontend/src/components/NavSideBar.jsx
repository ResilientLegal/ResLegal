import { useState } from 'react';
import { TbUserFilled, TbHomeFilled, TbBriefcaseFilled } from 'react-icons/tb'
import { Stack, UnstyledButton } from '@mantine/core';
import { NavLink } from 'react-router-dom';
import styles from '../styles/NavSideBar.module.css';

const icons = [
    { icon: TbHomeFilled, label: 'Home', path: '/' },
    { icon: TbBriefcaseFilled, label: 'Matter', path: '/matters' },
];

function SideBar({ icon: Icon, label, onClick, isActive, path }) {
    return (
        <NavLink to={path}>
            {({ isActive }) => (
                <UnstyledButton 
                    onClick={onClick} 
                    className={styles.link}
                    data-active={isActive || undefined}
                >
                    <Icon size={20} stroke={1.5} />
                </UnstyledButton>
            )}
        </NavLink>
    );
}

export default function NavSideBar() {
    const [active, setActive] = useState('Home');
    const items = icons.map((item) => (
        <SideBar
            key={item.label}
            icon={item.icon}
            label={item.label}
            path={item.path}
            onClick={() => 
                setActive(item.label)
            }
            isActive={item.label === active}
        />
    ));

    return (
        <nav className={styles.navbar}>
            <div className={styles.navbarMain}>
                <Stack>
                    {items}
                </Stack>
            </div>

            <div className={styles.navbarFooter}>
                <Stack>
                    <SideBar
                        icon={TbUserFilled}
                        label='Profile'
                        onClick={() => 
                            setActive('Profile')
                        }
                        isActive={'Profile' === active}
                    />
                </Stack>
            </div>
        </nav>
    );
}