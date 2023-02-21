import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Dropdown, AboutContent, withModal } from '@ohif/ui';
import { useHistory } from 'react-router-dom'
import { UserPreferences } from './../UserPreferences';
import OHIFLogo from '../OHIFLogo/OHIFLogo.js';
import './Header.css';
import EditServerContent from './editServerContent'

function Header(props) {
  const {
    t,
    user,
    userManager,
    modal: { show, hide },
    useLargeLogo,
    linkPath,
    linkText,
    location,
    children,
  } = props;
  const history = useHistory()
  const [options, setOptions] = useState([]);
  const [optionsServe, setOptionsServe] = useState([]);
  const hasLink = linkText && linkPath;

  const [currentAlias, setCurrentAlias] = useState('服务器')

  useEffect(() => {
    const optionsValue = [
      {
        title: t('About'),
        icon: { name: 'info' },
        onClick: () =>
          show({
            content: AboutContent,
            title: t('JancsiTech Viewer - About'),
          }),
      },
      {
        title: t('Preferences'),
        icon: {
          name: 'user',
        },
        onClick: () =>
          show({
            content: UserPreferences,
            title: t('User Preferences'),
          }),
      },

    ];



    if (user && userManager) {
      optionsValue.push({
        title: t('Logout'),
        icon: { name: 'power-off' },
        onClick: () => userManager.signoutRedirect(),
      });
    }

    setOptions(optionsValue);
    getServeList()
  }, [setOptions, show, t, user, userManager]);

  const getServeList = () => {

    //get form data
    let currentIp = JSON.parse(localStorage.getItem('serve'))

    if (JSON.stringify(currentIp) == "{}" || !currentIp) {
      currentIp = JSON.parse(localStorage.getItem('defaultServe'))
    }

    let serverListMid = JSON.parse(localStorage.getItem('serverList'))
    setCurrentAlias(`当前服务器：${serverListMid.filter(i => i.key == currentIp)[0].alias}`)
    let res = serverListMid.map(item => {
      return {
        title: item.alias ? `${item.alias}(${item.ip})` : item.ip,
        active: item.ip == currentIp,
        onClick: () => {
          if (item.ip == currentIp) {
            return
          }
          localStorage.setItem('serve', JSON.stringify(item.ip))
          history.push({ pathname: '/', search: '' })
          history.go(0)
        }
      }
    })
    const serveOptionsValue = [
      {
        title: '新增服务',//t(Modify service)
        icon: {
          name: 'edit',
        },
        onClick: () => {
          return show({
            content: () => <EditServerContent onClose={hide} getServeList={getServeList} />,
            title: '服务',
          })
        }
      },
    ]
    setOptionsServe([...res, ...serveOptionsValue,])
  }


  return (
    <>
      <div className="notification-bar">{t('INVESTIGATIONAL USE ONLY')}</div>
      <div
        className={classNames('entry-header', { 'header-big': useLargeLogo })}
      >
        <div className="header-left-box">
          {location && location.studyLink && (
            <Link
              to={location.studyLink}
              className="header-btn header-viewerLink"
            >
              {t('Back to Viewer')}
            </Link>
          )}

          {children}

          {hasLink && (
            <Link
              className="header-btn header-studyListLinkSection"
              to={{
                pathname: linkPath,
                state: { studyLink: location.pathname },
              }}
            >
              {t(linkText)}
            </Link>
          )}
        </div>

        <div className="header-menu">
          <span className="research-use">{t('INVESTIGATIONAL USE ONLY')}</span>
          <Dropdown
            title={t(currentAlias)}
            list={optionsServe}
            align="right"
            className='add-serve'
          />
          <Dropdown title={t('Options')} list={options} align="right" />

        </div>
      </div>
    </>
  );
}

Header.propTypes = {
  // Study list, /
  linkText: PropTypes.string,
  linkPath: PropTypes.string,
  useLargeLogo: PropTypes.bool,
  //
  location: PropTypes.object.isRequired,
  children: PropTypes.node,
  t: PropTypes.func.isRequired,
  userManager: PropTypes.object,
  user: PropTypes.object,
  modal: PropTypes.object,
};

Header.defaultProps = {
  useLargeLogo: false,
  children: OHIFLogo(),
};

export default withTranslation(['Header', 'AboutModal'])(
  withRouter(withModal(Header))
);
