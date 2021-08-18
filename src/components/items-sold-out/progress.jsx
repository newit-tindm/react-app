import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${(props.value).toFixed()}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};
  
const useStyles = makeStyles((theme) => ({
	bar: {
		width: '40%',
	},

  loading: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
    marginLeft: '10px'
  },

  layout: {
    height: '35px !important',
    width: '35px !important'
  }
}));

export const ProgressBar = ({ progress }) => {
  const classes = useStyles();

  return (
    <div className={classes.bar}>
      <LinearProgressWithLabel value={progress} />
    </div>
  );
}

export const ProgressLoading = () => {
  const classes = useStyles();

  return (
    <div className={classes.loading}>
      <CircularProgress color="primary" className={classes.layout} />
    </div>
  );
}
 
export default {
  ProgressBar, ProgressLoading
};
