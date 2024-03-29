import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import React, { useState } from 'react';
import useDimensions from 'react-cool-dimensions';
import logo from '../assets/HRECOS.logo.png';
import carrieLogo from '../assets/logos/CaryLogo.png';
import piermontLogo from '../assets/logos/ColumbiaLamontLogo.png';
import maristLogo from '../assets/marist_logo.png';
import beczakLogo from '../assets/beczak_logo.jpg';
import norriePointLogo from '../assets/logos/NationalMarineResearchLogo.jpg';
import albanyLogo from '../assets/nysdec_logo.png';
import pier84Logo from '../assets/logos/HudsonRiverPkLogo.png';
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
  westPointLogo: carrieLogo,
};

const logoStyle = {
  albany: { height: '100%' },
  beczak: { height: '100%' },
  marist: { height: '37.5%' },
  pier84: { width: '350px' },
  piermont: { height: '70%' },
  westPoint: { height: '100%' },
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

  const { observe, width } = useDimensions({});
  console.log('width', width);
  const [open, setOpen] = useState(false);
  const stationID = useSelector(state => state.stationID);
  const image = logos[`${stationID}Logo`] || piermontLogo;
  const style = logoStyle[stationID] || { position: 'relative' };
  const titleLogoStyle = titleStyle[stationID] || {};

  const logoImage = <img alt="HRECOS" className={theme.logo} src={logo} />;
  const qrCode = (
    <img alt="hrecos.org" className={theme.code} src={qrCodeLink} />
  );

  const sponsorImage = (
    <img alt={stationID} style={style} className={theme.sponsor} src={image} />
  );
  const stationTitle = get(stations, `${stationID || 'piermont'}.title`) || 'Piermont';

  return (
    <AppBar ref={observe} position="static">
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
          {width > 1200 && (
            <span className={theme.qrCodeWrapper}>
              {qrCode}
              <a href="https://www.hrecos.org">hrecos.org</a>
            </span>
          )}
        </span>

        <h1 className={theme.title} style={titleLogoStyle}>
          {`${stationTitle} Monitoring Station`}
        </h1>
        {width > 1400 && (
          <span className={theme.rightImageWrapper}>{sponsorImage}</span>
        )}
      </Toolbar>
      <Drawer open={open} setOpen={setOpen} />
    </AppBar>
  );
}

export default Header;
