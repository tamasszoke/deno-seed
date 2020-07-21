import React, { Component } from 'react'
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import styles from './app.module.scss'
import Home from './components/Home/Home'
import Login from './components/Login/Login'
import Logout from './components/Logout/Logout'
import Registration from './components/Registration/Registration'
import Activation from './components/Activation/Activation'
import ActivationHash from './components/ActivationHash/ActivationHash'
import Recovery from './components/Recovery/Recovery'
import RecoveryHash from './components/RecoveryHash/RecoveryHash'
import Error from './components/Error/Error'
import Navigation from './components/Navigation/Navigation'
import Profile from './components/Profile/Profile'
import { connect } from 'react-redux'
import { setUrl, setAuth, setUser, setNotifications } from './actions/connectionActions'
// import ReactNotification from "react-notifications-component"
// import "react-notifications-component/dist/theme.css"
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import "animate.css"
import ProfileModify from './components/ProfileModify/ProfileModify'
import axios from 'axios'
import { CssBaseline } from '@material-ui/core'

toast.configure({
  autoClose: 5000,
  draggable: false
})

const PrivateRoute = ({ component: Component, authenticated, ...rest }) => (
  <Route { ...rest }
    render={(props) => (
      authenticated ?
      <Component { ...props } /> :
      <Redirect to='/login' />
    )}
  />
)

class App extends Component {
  constructor(props) {
    super(props)
    this.url = `${process.env.REACT_APP_PROTOCOL}://${process.env.REACT_APP_HOST}:${process.env.REACT_APP_PORT}`
    this.paypal = {
      clientId: ''
    }
    this.props.setNotifications(this.notification)
    this.props.setUrl(this.url)
    axios.defaults.withCredentials = true
  }

  async componentDidMount() {
    axios.interceptors.response.use(undefined, (error) => {
      if(error && error.response && error.response.status === 401) {
        this.props.setAuth(false)
        this.notification({
          type: 'danger',
          title: 'Failed!',
          message: 'Not logged in!'
        })
        return Promise.reject(error)
      }
    })
    const authenticated = await axios.get(`${this.url}/api/auth/status`)
    try{
      this.props.setAuth(authenticated.data.success)
      this.props.setUser(authenticated.data.user) /* DO WE REALLY NEED THIS??? */
    } catch(error) {
      console.log('Server not responding!')
    }
  }

  notification(options) {
    let { type, title, message } = options
    if (type === 'danger') {
      type = 'warning'
    }
    toast[type](<div><b>{title}</b><br/>{message}</div>)
  }

  render() {
    return (
        <BrowserRouter>
          <MuiThemeProvider theme={ createMuiTheme({palette: { type: this.props.theme }}) }>
          <CssBaseline />
          <div className={ styles.app }>
            <Navigation />
            <Switch>
              <Route path="/" component={ Home } exact />
              <Route path="/login" component={ Login } exact />
              <Route path="/logout" component={ Logout } exact />
              <Route path="/registration" component={ Registration } exact />
              <Route path="/activation" component={ Activation } exact />
              <Route path="/activation/:hash" component={ ActivationHash } exact />
              <Route path="/recovery" component={ Recovery } exact />
              <Route path="/recovery/:hash" component={ RecoveryHash }/>
              <PrivateRoute path='/profile' component={ Profile } authenticated={ this.props.authenticated } exact/>
              <PrivateRoute path='/profile/modify' component={ ProfileModify } authenticated={ this.props.authenticated } exact/>
              <Route component={ Error } />
            </Switch>
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    authenticated: state.authenticated,
    theme: state.theme
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUrl: url => { dispatch(setUrl(url)) },
    setAuth: authenticated => { dispatch(setAuth(authenticated)) },
    setUser: (user) => { dispatch(setUser(user)) },
    setNotifications: notifications => { dispatch(setNotifications(notifications)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
