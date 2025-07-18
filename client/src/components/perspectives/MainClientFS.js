import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from 'tss-react/mui'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import intl from 'react-intl-universal'
import bgImage from '../../img/main_page/bg2.jpg'

const styles = (theme) => ({
  paper: {
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    backgroundImage: `url(${bgImage})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
  },
  textContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    margin: theme.spacing(3),
    padding: theme.spacing(3),
    [theme.breakpoints.down('lg')]: {
      padding: theme.spacing(1)
    }
  },
  frontPageHeading: {
    [theme.breakpoints.down('lg')]: {
      fontSize: '1.2rem'
    }
  },
  frontPageText: {
    [theme.breakpoints.down('lg')]: {
      fontSize: '1.0rem'
    }
  }

})

const MainClientFS = props => {
  const { classes } = props
  return (
    <Paper className={classes.paper}>
      <div className={classes.content}>
        <div className={classes.textContainer}>
          <Typography className={classes.frontPageHeading} component='h1' variant='h3' align='center' color='textPrimary' gutterBottom>
            {intl.getHTML('appTitle.long')}
          </Typography>
          <Typography className={classes.frontPageText} variant='h5' align='left' color='textPrimary' paragraph>
            {intl.get('appDescription1')}
          </Typography>
          <Typography className={classes.frontPageText} variant='h5' align='left' color='textPrimary' paragraph>
            {intl.get('appDescription2')}
          </Typography>
          <Typography className={classes.frontPageText} variant='h5' align='left' color='textPrimary' paragraph>
            {intl.get('appDescription3')}
          </Typography>
          <Typography className={classes.frontPageText} variant='h5' align='left' color='textPrimary' paragraph>
            {intl.get('appDescription4')}
          </Typography>
        </div>
      </div>
    </Paper>
  )
}

MainClientFS.propTypes = {
  classes: PropTypes.object
}

export default withStyles(MainClientFS, styles)
