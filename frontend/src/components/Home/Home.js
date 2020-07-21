import React, { Component } from 'react'
import styles from './home.module.scss'
import { Grid, Card, CardMedia, CardContent, Typography } from '@material-ui/core'
import GitHubButton from 'react-github-btn'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'

class Home extends Component {
  render() {
    return (
      <div className={ styles.home }>
        <Grid
          item
          xs={ 12 }
          sm={ 6 }
          md={ 4 }
        >
          <Card className={ styles.card }>
            <CardMedia
              component="img"
              image="https://camo.githubusercontent.com/7fb1ce3c4d77a02b0508d05865ec667798a1dd0e/68747470733a2f2f692e6962622e636f2f324b74677143762f4e65772d50726f6a6563742d342d312e706e67"
              title="Deno Seed"
              style={{ 'padding-bottom': '15px' }}
            />
            <hr/>
            <CardContent>
              <Typography component="p">
                <GitHubButton
                  href="https://github.com/tamasszoke/deno-seed"
                  data-icon="octicon-star"
                  data-size="large"
                  data-show-count="true"
                  aria-label="Star tamasszoke/deno-seed on GitHub"
                >
                  Star
                </GitHubButton>
              </Typography>
              <Typography component="p">
                <GitHubButton
                  href="https://github.com/tamasszoke"
                  data-size="large"
                  aria-label="Follow @tamasszoke on GitHub"
                >
                  Follow @tamasszoke
                </GitHubButton>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    url: state.url,
    authenticated: state.authenticated,
    notification: state.notification,
    user: state.user
  }
}

export default withRouter(connect(mapStateToProps)(Home))
