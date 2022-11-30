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
    getServeList
  } = props;
  const { t } = useTranslation('UserPreferencesModal');
  const { UINotificationService } = servicesManager.services;
  // const [serveForm, setServeForm] = useState({})
  const [currentServer, setCurrentServer] = useState()
  const [serverList, setServerList] = useState([])
  const [addServerValue, setAddServerValue] = useState();
  const [addServerValueAlias, setAddServerValueAlias] = useState();
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
    // if (!addServerValueAlias) {
    //   setAddServerValueAlias(value)
    // }
    setAddServerValue(value)
  }
  const onChangeAlias = (value) => {
    setAddServerValueAlias(value)
  }

  const serveListOnchange = (key, value, index) => {
    let list = JSON.parse(JSON.stringify(serverList))
    list.splice(index, 1, {
      key: key,
      ip: key,
      alias: value
    })
    setServerList(list)
  }

  //save serve and change
  const onSave = () => {
    // let serve = new ReplaceStr(currentServer)
    // localStorage.setItem('serve', JSON.stringify(serve.ip))
    localStorage.setItem('serverList', JSON.stringify(serverList))
    getServeList()
    onClose()
    // history.push({ pathname: '/', search: '' })
    // history.go(0)
  }

  const pingServer = () => {
    if (addServerValue && !addServerValueAlias) {
      UINotificationService.show({
        title: 'Alias Is Required',
        message: 'Please input an alias',
        type: 'warning',
        autoClose: true,
      });
      return
    }
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
        title: 'Waning Message Prompt',
        message: 'Service already exists',
        type: 'warning',
        autoClose: true,
      });
      return
    }
    setServerList(v => {
      let list = [
        ...v,
        { key: addServerValue, ip: addServerValue, alias: addServerValueAlias }
      ]
      localStorage.setItem('serverList', JSON.stringify(list))
      return list
    })
    setAddServerValue()
    setAddServerValueAlias()
  }



  return (
    <>
      <div className='add-server-alias'>
        <div className="wlColumn preset">Add Server
        </div>
        <div className="wlColumn add-server" >
          <TextInput
            type="string"
            value={addServerValueAlias}
            placeholder={t('Please Server Alias')}
            onChange={evt => onChangeAlias(evt.target.value)}

          />
          <TextInput
            type="string"
            value={addServerValue}
            placeholder={t('Please Input Host')}
            onChange={evt => onChange(evt.target.value)}
            style={{ marginLeft: '20px' }}
          />

          <button
            className="btn btn-primary add-button"
            onClick={pingServer}
          >
            {t('Add Server')}
          </button>
        </div>
      </div>
      {/* <div className='current-server'>
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
      </div> */}
      <div className="WindowLevelPreferences">
        <div className="wlColumn">
          <div className="wlRow header">
            <div className="wlColumn preset">Serial Number</div>
            <div className="wlColumn window">Server Alias</div>
            <div className="wlColumn description">Server Host</div>
            {/* <div className="wlColumn preset">Option</div> */}
          </div>
          {serverList.map((item, index) => {
            return (
              <div className="wlRow" key={item.key}>
                <div className="wlColumn preset form-center">{index + 1}</div>
                <div className="wlColumn window form-center">
                  <input
                    type="text"
                    className="preferencesInput"
                    value={item.alias}
                    data-key={item.key}
                    data-inputname="description"
                    // disabled={true}
                    // onChange={handleInputChange}
                    onChange={(e) => serveListOnchange(item.key, e.target.value, index)}
                  />
                </div>
                <div className="wlColumn description" >
                  <input
                    type="text"
                    className="preferencesInput"
                    defaultValue={item.ip}
                    data-key={item.key}
                    data-inputname="description"
                    disabled={true}

                  // onChange={handleInputChange}
                  />
                </div>

                {/* <div className="wlColumn preset form-center">
                  <input
                    type="radio"
                    className="server-radio"
                    checked={currentServer == item.key}
                    data-key={item.key}
                    data-inputname="preset"
                    onChange={e => {
                      handleRadioChange(e);
                    }}
                    value={item.key}
                  /> */}
                {/* </div> */}

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
