import React from 'react'

function ProgressBar({ totalSpent, budget }) {
  // under 33% green , between 34% - 80% yellow , after 81% red    
  const calcPercentage = () => {
    if (totalSpent === 0) {
      return 0
    } else {
      const percentage = (totalSpent / budget) * 100;
      return percentage.toFixed(2);
    }
  }

  const percentage = calcPercentage();
  const progressBarColor = percentage < 34 ? 'bg-green-400' : percentage < 81 ? 'bg-yellow-400' : 'bg-red-700';

  return (
    <div className="h-1 bg-black w-5/6 m-auto relative mt-8 rounded-lg">
      <div style={{ width: `${percentage}%` }} className={`h-1 m-auto absolute rounded-lg ${progressBarColor}`}></div>
    </div>
  )
}

export default ProgressBar
