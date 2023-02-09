import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import logo from '../assets/HRECOS.logo.png';
import piermontLogo from '../assets/LamontLogo_trans_2.png';
import maristLogo from '../assets/marist_logo.png';
import beczakLogo from '../assets/beczak_logo.jpg';
import norriePointLogo from '../assets/norriePoint_logo.jpg';
import albanyLogo from '../assets/nysdec_logo.png';
import pier84Logo from '../assets/pier84_logo.png';
import qrCodeLink from '../assets/hrecos-qr-code.png';
import stations from '../utils/stations.json';
import theme from './Header.module.scss';
import Drawer from './Drawer';

const logos = {
  albanyLogo,
  beczakLogo,
  maristLogo,
  norriePointLogo,
  pier84Logo,
  piermontLogo,
};

const logoStyle = {
  albany: { height: '100%' },
  beczak: { height: '100%' },
  marist: { height: '37.5%' },
  pier84: { width: '350px' },
  piermont: { height: '70%', marginLeft: '-250px' },
};
const titleStyle = {
  albany: { marginLeft: '-10rem' },
  piermont: { marginLeft: '-6rem' },
};

const useStyles = makeStyles(styleTheme => ({
  menuButton: {
    marginRight: styleTheme.spacing(2),
  },
  root: {
    flexGrow: 1,
  },
  toolbar: {
    background: '#7f99c7',
    display: 'flex',
    height: '6rem',
    justifyContent: 'space-between',
  },
}));

function Header() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const stationID = useSelector(state => state.stationID);
  const image = logos[`${stationID}Logo`] || piermontLogo;
  const style = logoStyle[stationID] || { position: 'relative' };
  const titleLogoStyle = titleStyle[stationID] || {};

  let logoImage = <img alt="HRECOS" className={theme.logo} src={logo} />;
  const qrCode = (
    <img alt="hrecos.org" className={theme.code} src={qrCodeLink} />
  );

  let sponsorImage = (
    <img alt={stationID} style={style} className={theme.sponsor} src={image} />
  );
  if (stationID === 'pier84') {
    const temp = sponsorImage;
    sponsorImage = logoImage;
    logoImage = temp;
  }
  const stationTitle = get(stations, `${stationID || 'piermont'}.title`) || 'Piermont';

  return (
    <AppBar position="static">
      <Toolbar className={classes.toolbar}>
        <IconButton
          onClick={() => setOpen(!open)}
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="Menu"
        >
          <MenuIcon />
        </IconButton>
        <span className={theme.leftImageWrapper}>
          {logoImage}
          <span className={theme.qrCodeWrapper}>
            {qrCode}
            <a href="https://www.hrecos.org">hrecos.org</a>
          </span>
        </span>

        <h1 className={theme.title} style={titleLogoStyle}>
          {`${stationTitle} Monitoring Station`}
        </h1>
        <span className={theme.rightImageWrapper}>{sponsorImage}</span>
      </Toolbar>
      <Drawer open={open} setOpen={setOpen} />
    </AppBar>
  );
}

export default Header;
