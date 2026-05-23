import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

function App() {
    return (
        <div className='grid grid-cols-[1fr_6fr] grid-rows-[auto_1fr] h-screen'>
            <div className='col-span-2'>
                <Topbar />
            </div>
            <Sidebar />
        </div>
    );
}
export default App;
