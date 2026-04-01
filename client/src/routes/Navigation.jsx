import Navbar from "../components/Navbar.jsx";
import MyMap from "../components/Map.jsx";

function Navigation() {
    return (
        <div>
            <Navbar></Navbar>
            <div className={'py-24'}>
                <h1 className={'text-6xl text-center'}>Navigation Page</h1>
            </div>
            <div className={'flex justify-center'}>
                <MyMap></MyMap>
            </div>
        </div>
    )

}

export default Navigation