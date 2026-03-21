import { useState} from 'react';
import { Link, NavLink } from 'react-router-dom';

function Navbar() {

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navItemCss = ({ isActive }) => {
    return isActive ? "bg-black" : "bg-grey-500";
    }


    return (
        <nav>
            <div className={'flex'}>
                <div>
                    <Link to={'/'}>NavSense</Link>
                </div>
                <NavLink to={'/'} className={navItemCss} >hi</NavLink>
                <NavLink to={'/search'} className={navItemCss} >Search</NavLink>
                <NavLink to={'/navigation'} className={navItemCss} >Navigation</NavLink>
            </div>
        </nav>
    )
}

export default Navbar
