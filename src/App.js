import React, { useContext, useEffect, useState } from 'react'
import { Switch, Route } from 'react-router-dom'
import { useLazyQuery } from '@apollo/client'

import { Auth, Dashboard, Trip, ExpenseItem, UserSettings, AccountDeletion } from './components/pages'
import { TripForm, ExpenseForm, UserSettingsForm } from './components/forms'
import AlertComponent from './components/presentational/AlertComponent'
import { AuthContext } from './context/auth/AuthContext'
import { CHECK_AUTH_TOKEN } from './queries/user'
import checkToken from './utils/checkToken'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import useSidebar from './hooks/useSideBar'
import { AlertContext } from './context/alert/AlertContext'

function App() {
  const { auth, user } = useContext(AuthContext);
  const { alertDispatch } = useContext(AlertContext);
  const [trip, setTrip] = useState(null); // select trip when user clicks on trip box
  const [isTripEdit, setTripEdit] = useState({ isEdit: false, }); // is trip form creating a new trip or editing a trip
  const [expenseData, setExpenseData] = useState(null); // editing an expense
  const [expenseItem, setExpenseItem] = useState(null) // expense info for showing single expense
  const [openSidebar, setSidebar] = useSidebar();
  const [queryToken] = useLazyQuery(CHECK_AUTH_TOKEN, {
    onCompleted: () => {
      auth.persistUser();
    },
    onError: () => {
      alertDispatch.setAlert('Session has expired, please login to continue');
    }
  });

  useEffect(() => {
    const persistUser = async () => {
      // check if token is set and valid
      const isValid = await checkToken()
      if (isValid) {
        queryToken()
      }
    }
    persistUser()
  }, [user, queryToken])

  return (
    <div className="App relative max-w-screen-xl m-auto">
      <Navbar setSidebar={setSidebar} showMenu={user ? true : false} />
      {openSidebar ? <Sidebar user={user} auth={auth} setSidebar={setSidebar} /> : null}
      <AlertComponent />
      <Switch>
        <Route exact path="/" render={() => <Dashboard user={user} auth={auth} setTrip={setTrip} setTripEdit={setTripEdit} />} />
        <Route exact path="/trip" render={() => <Trip trip={trip} setTripEdit={setTripEdit} setExpenseData={setExpenseData} setExpenseItem={setExpenseItem} />} />
        <Route exact path="/trip/expense" render={() => <ExpenseItem data={expenseItem} setExpenseData={setExpenseData} alertDispatch={alertDispatch} auth={auth} />} />
        <Route exact path="/trip/expenseform" render={() => <ExpenseForm expenseData={expenseData} />} />
        <Route exact path="/tripform" render={() => <TripForm user={user} isTripEdit={isTripEdit} />} />
        <Route exact path="/login" render={() => <Auth auth={auth} user={user} />} />
        <Route exact path="/register" render={() => <Auth auth={auth} user={user} />} />
        <Route exact path="/user" render={() => <UserSettings user={user} />} />
        <Route exact path="/user/edit" render={() => <UserSettingsForm user={user} />} />
        <Route exact path="/user/accountdeletion" render={() => <AccountDeletion user={user} auth={auth} />} />
      </Switch>
    </div >
  );
}

export default App;
