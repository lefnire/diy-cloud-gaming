import React, {useState} from 'react'

interface BillingProps {
  loggedIn: boolean
  setLoggedIn: Function
}
function Billing({loggedIn, setLoggedIn}: BillingProps) {
  const [showInvoices, setShowInvoices] = useState(false)
  if (!loggedIn) {
    return <div>Login <button onClick={() => setLoggedIn(true)}>here</button> please</div>
  }
  return <div>
    <h1>Billing</h1>
    <div id="collapsed">
      Invoice 1
      Invoice 2
    </div>
  </div>
}

interface AccountProps {
  loggedIn: boolean
  setLoggedIn: Function
}
function Account({loggedIn, setLoggedIn}: AccountProps): JSX.Element {
  if (!loggedIn) {
    return <div>Login <button onClick={() => setLoggedIn(true)}>here</button> please</div>
  }
  return <div>
    <h1>My Account</h1>
  </div>
}

export default function Dashboard(): JSX.Element {
  const [loggedIn, setLoggedIn] = useState(false)
  return <div>
    <h1>Your Dashboard</h1>
    <div id="sidebar-links">
      <a href='/account'>Account</a>
      <a href='/logout'>Logout</a>
    </div>
    <div id="acount-info">
      <Account loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <Billing loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
    </div>
  </div>
}