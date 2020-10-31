import { useState } from 'react';

const UseToggle = (initState) => {
  const [isOn, setOn] = useState(initState);

  const setToggle = () => {
    setOn(prevState => !prevState);
  }
  return [isOn, setToggle];
}

export default UseToggle;