import Topbar from "./components/Topbar";

function App() {
    return (
        <div className='grid grid-cols-[1fr_6fr] h-screen'>
            <div className='col-span-2'>
                <Topbar />
            </div>
        </div>
    );
}
export default App;
