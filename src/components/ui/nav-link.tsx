
import { NavLink as RouterNavLink } from "react-router-dom";

export const NavLink = ({ to, className, children, ...props }) => {
    const getClassName = (isActive) => {
        if (typeof className === 'function') {
            return className({ isActive });
        }
        return `${className}${isActive ? ' font-bold' : ''}`;
    };

    return (
        <RouterNavLink to={to} className={({ isActive }) => getClassName(isActive)} {...props}>
            {children}
        </RouterNavLink>
    );
};
