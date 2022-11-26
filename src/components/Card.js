import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';

const useStyles = makeStyles(theme => ({
  appBar: {
    lineHeight: theme.typography.h3.fontSize,
    minHeight: theme.typography.h3.fontSize,
    padding: `0 ${theme.typography.body1.fontSize}`,
    fontSize: '2rem',
    fontFamily: 'Montserrat,sans-serif !important',
    fontWeight: 'lighter',
    background: '#007465',
  },
  root: {
    backgroundColor: 'rgb(56, 125, 159)' || theme.palette.background.paper,
    overflowX: 'hidden',
    height: 'calc(50% - 0.5em)',
  },
  cardContent: {
    padding: '1rem 1rem 0 1rem',
    height: 'calc(100% - 4rem)',
    '& p': {
      marginBlockStart: 0,
    },
  },
}));

function Card({ title, children }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.appBar}>
        {title}
      </AppBar>
      <div className={classes.cardContent}>{children}</div>
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

export default Card;
