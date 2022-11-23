/*
 * @Description:
 * @Author: eleven
 * @Date: 2022-11-22 10:27:48
 */
import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { TextInput, Select, Icon, TabFooter } from '@ohif/ui';
import OHIFLogo from '../OHIFLogo/OHIFLogo.js';
import './editServerContent.css';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom'
function EditServerContent(props) {
  const {
    onClose,
  } = props;
  const { t } = useTranslation('UserPreferencesModal');

  const [serveForm, setServeForm] = useState({})
  const history = useHistory()

  useEffect(() => {
    //get form data
    let config = JSON.parse(localStorage.getItem('serve'))
    console.log('config: ', config);
    if (JSON.stringify(config) == "{}" || !config) {
      config = JSON.parse(localStorage.getItem('defaultServe'))?.servers.dicomWeb[0]
    }
    const { qidoRoot, wadoRoot, wadoUriRoot } = config
    setServeForm({ qidoRoot, wadoRoot, wadoUriRoot })
  }, [])

  const onChange = (value, key) => {
    setServeForm(v => {
      return {
        ...v,
        [key]: value
      }
    })
  }

  //save serve and change
  const onSave = () => {
    let requiredList = ['wadoUriRoot', 'qidoRoot', 'wadoRoot']
    console.log('!requiredList.some(item => item in serveForm): ', !requiredList.every(item => item in serveForm));
    if (!requiredList.every(item => item in serveForm)) {
      return
    }
    localStorage.setItem('serve', JSON.stringify(serveForm))
    onClose()
    history.push({ pathname: '/', search: '' })
    history.go(0)
    // windows.location.href = '/'
  }

  //callback default serve
  const onResetPreferences = () => {
    const config = JSON.parse(localStorage.getItem('defaultServe'))?.servers.dicomWeb[0]
    const { qidoRoot, wadoRoot, wadoUriRoot } = config
    setServeForm({ qidoRoot, wadoRoot, wadoUriRoot })
  }

  return (
    <>
      <div className="edit-server-content">
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
      </div>
      <TabFooter
        onResetPreferences={onResetPreferences}
        onSave={onSave}
        onCancel={onClose}
        t={t}
      />
    </>
  );
}


export default EditServerContent
