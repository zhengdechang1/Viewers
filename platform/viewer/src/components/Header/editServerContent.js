/*
 * @Description:
 * @Author: devin
 * @Date: 2022-11-22 10:27:48
 */
import React, { useState, useEffect } from 'react';
import { TextInput, Select, Icon, TabFooter } from '@ohif/ui';
import './editServerContent.css';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom'
import ReplaceStr from '../../utils/replaceStr'
import { servicesManager } from '../../App';
function EditServerContent(props) {
  const {
    onClose,
  } = props;
  const { t } = useTranslation('UserPreferencesModal');
  const { UINotificationService } = servicesManager.services;
  // const [serveForm, setServeForm] = useState({})
  const [currentServer, setCurrentServer] = useState()
  const [serverList, setServerList] = useState([])
  const [addServerValue, setAddServerValue] = useState();
  const history = useHistory()

  useEffect(() => {
    //get form data
    let config = JSON.parse(localStorage.getItem('serve'))

    if (JSON.stringify(config) == "{}" || !config) {
      config = JSON.parse(localStorage.getItem('defaultServe'))
    }

    let serverListMid = JSON.parse(localStorage.getItem('serverList'))
    let serve = new ReplaceStr(config)

    setServerList(serverListMid)
    setCurrentServer(serve.ip)
  }, [])

  const onChange = (value) => {
    setAddServerValue(value)
  }

  //save serve and change
  const onSave = () => {
    let serve = new ReplaceStr(currentServer)

    localStorage.setItem('serve', JSON.stringify(serve.ip))

    onClose()
    history.push({ pathname: '/', search: '' })
    history.go(0)
  }

  const pingServer = () => {
    const start = (new Date()).getTime()
    let server = process.env.NODE_ENV === "development" ? `/${addServerValue}:2099` : `http://${addServerValue}:2099`
    fetch(server, { mode: 'no-cors', }).then(() => {
      const delta = (new Date()).getTime() - start
      if (delta > 10000) {
        UINotificationService.show({
          title: 'Error Message Prompt',
          message: 'Continuous connection timeout',
          type: 'error',
          autoClose: true,
        });
      } else {
        addServerList()
      }
    }).catch((err) => {
      console.log('err: ', err.message);
      UINotificationService.show({
        title: 'Error Message Prompt',
        message: err.message ? err.message : 'Failed to fetch',
        type: 'error',
        autoClose: true,
      });
    })
  }


  const handleRadioChange = (e, index) => {
    setCurrentServer(e.target.value)
  }

  const addServerList = () => {
    if (serverList.some(item => item.key == addServerValue)) {
      UINotificationService.show({
        title: 'Error Message Prompt',
        message: 'Service already exists',
        type: 'error',
        autoClose: true,
      });
      return
    }
    setServerList(v => {
      let list = [
        ...v,
        { key: addServerValue, ip: addServerValue }
      ]
      localStorage.setItem('serverList', JSON.stringify(list))
      return list
    })
    setAddServerValue()
  }



  return (
    <>
      {/* <div className="edit-server-content">
        <TextInput
          type="string"
          value={serveForm.wadoUriRoot}
          label={t('server wadoUriRoot：')}
          onChange={evt => onChange(evt.target.value, 'wadoUriRoot')}
          data-cy="wadoUriRoot"
        />
        <TextInput
          type="string"
          value={serveForm.qidoRoot}
          label={t('server qidoRoot：')}
          onChange={evt => onChange(evt.target.value, 'qidoRoot')}
          data-cy="qidoRoot"
        />
        <TextInput
          type="string"
          value={serveForm.wadoRoot}
          label={t('server wadoRoot：')}
          onChange={evt => onChange(evt.target.value, 'wadoRoot')}
          data-cy="wadoRoot"
        />

      </div> */}
      <div className='current-server'>
        <div className="wlColumn preset">Add Server
        </div>
        <div className="wlColumn add-server " >
          {/* <input
            type="text"
            className="preferencesInput"
            value={addServerValue}
            onChange={onChange}
          /> */}
          <TextInput
            type="string"
            value={addServerValue}
            // label={t('Add Server')}
            onChange={evt => onChange(evt.target.value)}
          />
          <button
            className="btn btn-primary add-button"
            onClick={pingServer}
          >
            {t('Add Server')}
          </button>
        </div>
      </div>
      <div className='current-server'>
        <div className="wlColumn preset">Current Server
        </div>
        <div className="wlColumn description">
          <input
            type="text"
            className="preferencesInput"
            value={currentServer}
            disabled={true}
          />
        </div>
      </div>
      <div className="WindowLevelPreferences">
        <div className="wlColumn">
          <div className="wlRow header">
            <div className="wlColumn preset">Serial Number</div>
            <div className="wlColumn description">Server IP</div>
            <div className="wlColumn window">Option</div>
          </div>
          {serverList.map((item, index) => {
            return (
              <div className="wlRow" key={item.key}>
                <div className="wlColumn preset form-center">{index + 1}</div>
                <div className="wlColumn description">
                  <input
                    type="text"
                    className="preferencesInput"
                    value={item.ip}
                    data-key={item.key}
                    data-inputname="description"
                    disabled={true}
                  // onChange={handleInputChange}
                  />
                </div>
                <div className="wlColumn window form-center">
                  <input
                    type="radio"
                    className="server-radio"
                    checked={currentServer == item.key}
                    data-key={item.key}
                    data-inputname="window"
                    onChange={e => {
                      handleRadioChange(e);
                    }}
                    value={item.key}
                  />
                </div>

              </div>
            );
          })}
        </div>
      </div>
      <TabFooter
        onSave={onSave}
        onCancel={onClose}
        isShowReset={false}
        t={t}
      />
    </>
  );
}


export default EditServerContent
