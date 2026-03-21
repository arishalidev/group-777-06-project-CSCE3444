import Navbar from "../components/Navbar.jsx";

function Home() {
    return (
        <div>
            <Navbar></Navbar>
            <div className={'py-24'}>
                <h1 className={'text-6xl text-center'}>Home Page</h1>
            </div>
        </div>
    )

}

export default Home