import { Link, NavLink } from 'react-router-dom';

function Navbar() {

    // CSS for NavLink items based on if they are slected or not
    const navItemCss = ({ isActive }) =>
        isActive ? 'text-gray-900 font-semibold' : 'text-gray-600 hover:text-gray-900';



    return (
        <nav>
            <div className={'bg-white border-gray-200 border-b sticky top-0 z-50 px-6 py-4'}>
                <div className={'max-w-7xl mx-auto flex justify-between'}>

                    {/* Logo section */}
                    <div>
                        <Link className={'flex gap-2 items-center'} to={'/'}>
                            <div className="size-8 bg-[#00853E] rounded flex items-center justify-center text-white font-bold">
                                N
                            </div>
                            <span className="text-xl font-semibold text-gray-800">NavSense</span>
                        </Link>
                    </div>

                    {/* Menu buttons section */}
                    <div className={'space-x-8 items-center'}>
                        <NavLink to={'/'} className={navItemCss} >Home</NavLink>
                        <NavLink to={'/search'} className={navItemCss} >Search</NavLink>
                        <NavLink to={'/navigation'} className={navItemCss} >Navigation</NavLink>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
