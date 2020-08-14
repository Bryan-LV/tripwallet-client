import { useState } from 'react'

function useSideBar() {
  const [openSidebar, setOpenSidebar] = useState(false);

  const setSidebar = () => {
    setOpenSidebar(!openSidebar);
  }

  return [openSidebar, setSidebar]
}

export default useSideBar
