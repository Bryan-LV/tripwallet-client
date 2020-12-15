import React, { useContext, useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import { Auth, Dashboard, Trip, ExpenseItem, UserSettings, AccountDeletion } from './components/pages'
import { TripForm, ExpenseForm, UserSettingsForm } from './components/forms'
import AlertComponent from './components/presentational/AlertComponent'
import { AuthContext } from './context/auth/AuthContext'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import useSidebar from './hooks/useSideBar'
import { AlertContext } from './context/alert/AlertContext'

function App() {
  const { auth, user } = useContext(AuthContext);
  const { alertDispatch } = useContext(AlertContext);
  // User's selected trip
  const [trip, setTrip] = useState(null);
  // Is trip form creating a new trip or editing a trip
  const [isTripEdit, setTripEdit] = useState({ isEdit: false });
  // For editing expense
  const [expenseData, setExpenseData] = useState(null);
  // State for showing single expense info
  const [expenseItem, setExpenseItem] = useState(null)
  const [openSidebar, setSidebar] = useSidebar();

  return (
    <div className="App relative max-w-screen-xl m-auto">

      <Navbar setSidebar={setSidebar} showMenu={user ? true : false} />
      {openSidebar ? <Sidebar user={user} auth={auth} setSidebar={setSidebar} /> : null}
      <AlertComponent />

      <Switch>

        {/* Dashboard */}
        <Route exact path="/" render={() => (
          user ?
            <Dashboard user={user} auth={auth} setTrip={setTrip} setTripEdit={setTripEdit} />
            :
            <Redirect to="/login" />
        )} />

        {/* Selected Trip */}
        <Route exact path="/trip" render={() => (
          user ?
            <Trip trip={trip} setTripEdit={setTripEdit} setExpenseData={setExpenseData} setExpenseItem={setExpenseItem} />
            :
            <Redirect to="/login" />
        )} />

        {/* Expense Item */}
        <Route exact path="/trip/expense" render={() => (
          user ?
            <ExpenseItem data={expenseItem} setExpenseData={setExpenseData} alertDispatch={alertDispatch} auth={auth} />
            :
            <Redirect to="/login" />
        )} />

        {/* Expense Form */}
        <Route exact path="/trip/expenseform" render={() => (
          user ?
            <ExpenseForm expenseData={expenseData} />
            :
            <Redirect to="/login" />
        )} />

        {/* Trip Form */}
        <Route exact path="/tripform" render={() => (
          user ?
            <TripForm user={user} isTripEdit={isTripEdit} />
            :
            <Redirect to="/login" />
        )} />

        {/* Login Page */}
        <Route exact path="/login" render={() => (
          user ?
            <Redirect to="/" />
            :
            <Auth auth={auth} user={user} />
        )} />

        {/* Register Page */}
        <Route exact path="/register" render={() => (
          user ?
            <Redirect to="/" />
            :
            <Auth auth={auth} user={user} />
        )} />

        {/* User settings */}
        <Route exact path="/user" render={() => (
          user ?
            <UserSettings user={user} />
            :
            <Redirect to="/login" />
        )} />

        {/* Edit user settings */}
        <Route exact path="/user/edit" render={() => (
          user ?
            <UserSettingsForm user={user} />
            :
            <Redirect to="/login" />
        )} />

        {/* Confirmation page to delete account */}
        <Route exact path="/user/accountdeletion" render={() => (
          user ?
            <AccountDeletion user={user} auth={auth} />
            :
            <Redirect to="/login" />
        )} />

      </Switch>
    </div >
  );
}

export default App;
