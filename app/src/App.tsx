import { Outlet } from "react-router";

function App() {

  return (
    <div className="bg-primary w-full py-6 font-sans h-full">
      <Outlet />
    </div>
  )
}

export default App
