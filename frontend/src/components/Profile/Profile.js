import React, { Component } from 'react'
import styles from './profile.module.scss'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardContent,
  Typography,
  CircularProgress
} from '@material-ui/core'
import { ValidatorForm, TextValidator} from 'react-material-ui-form-validator'
import axios from 'axios'

class Profile extends Component {
  constructor(props) {
    super(props)

    this.state = {
      loading: false,
      password: '',
      open: false
    }
  }
  
  handleChange = (event) => {
    const name = event.target.name
    const value = event.target.value
    this.setState({
      [name]: value
    })
  }

  removeUser = async () => {
    const { email } = this.props.user
    const { password } = this.state
    const userdata = {
      data: {
        email,
        password
      }
    }
    this.setState({
      loading: true
    })
    const response = await axios.delete(`${this.props.url}/api/user/profile/remove`, userdata)
    this.setState({
      loading: false
    })
    if (response.data.success) {
      this.props.notification({
        type: 'success',
        title: 'Success!',
        message: 'Profile deleted!'
      })
      this.props.history.push('/logout')
    } else {
      this.props.notification({
        type: 'danger',
        title: 'Delete failed!',
        message: 'Try again later!'
      })
    }
  }

  removeDialogClick = () => {
    this.setState({
      open: this.state.open ? false : true
    })
  }

  render() {
    const { loading } = this.state
    return (
      <div className={ styles.profile }>
        <Card className={ styles.card }>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Profile
            </Typography>
            <Typography color="textSecondary">
              Username
            </Typography>
            <Typography component="p" gutterBottom>
              { this.props.user.username }
            </Typography>
            <Typography color="textSecondary">
              Name
            </Typography>
            <Typography component="p" gutterBottom>
              { this.props.user.name }
            </Typography>
            <Typography color="textSecondary">
              Email
            </Typography>
            <Typography component="p" gutterBottom>
              { this.props.user.email }
            </Typography>
            <Typography color="textSecondary">
              Age
            </Typography>
            <Typography component="p" gutterBottom>
              { this.props.user.age }
            </Typography>
            <Typography color="textSecondary">
              Location
            </Typography>
            <Typography component="p" gutterBottom>
              { this.props.user.location }
            </Typography>
          </CardContent>
        </Card>
        <Button
          onClick={ this.removeDialogClick }
          className={ styles.button }
          variant="contained"
          color="secondary"
        >
          Delete
        </Button>
        <Button
          className={ styles.button }
          variant="contained"
        >
          <Link className={ styles.link } to="/profile/modify">Modify</Link>
        </Button>
        <Dialog
          open={ this.state.open }
          onClose={ this.removeDialogClick }
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Delete your profile?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure?
              <br/>This action is irreversible, you will lose all your data!
              <br/><br/>Enter your password to confirm:
            </DialogContentText>
            <ValidatorForm
              ref="form"
              onSubmit={ this.removeUser }
              // onError={ errors => console.log(errors) }
              className={ styles.content }
            >
              <TextValidator
                label="Password"
                onChange={ this.handleChange }
                name="password"
                type="password"
                value={ this.state.password || '' }
                validators={[
                  'required',
                  'minStringLength:5',
                  'maxStringLength:100'
                ]}
                errorMessages={[
                  'this field is required',
                  'min 5 characters',
                  'max 100 characters'
                ]}
                margin="normal"
                fullWidth
                autoComplete="new-password"
              />
              {
                loading ?
                <Button
                  className={ styles.button }
                  variant="contained"
                  color="secondary"
                  fullWidth
                  disabled
                >
                  <CircularProgress color="primary" size={ 24 } />
                </Button> :
                <Button
                  type="submit"
                  className={ styles.button }
                  variant="contained"
                  color="secondary"
                  fullWidth
                >
                  Delete
                </Button>
              }
            </ValidatorForm>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    url: state.url,
    user: state.user,
    notification: state.notification
  }
}

export default connect(mapStateToProps)(Profile)
