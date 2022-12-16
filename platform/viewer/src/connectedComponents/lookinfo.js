/*
 * @Description:
 * @Author: Devin
 * @Date: 2022-12-16 11:44:33
 */
import React from 'react';
import './lookInfo.css';
// import { Input, Tree } from 'antd';

const LookInfo = props => {
  console.log('props: ', props);
  const renderItem = studies => {
    const list = [
      { key: 'PatientID', label: '患者ID' },
      { key: 'PatientName', label: '患者姓名' },
      { key: 'BirthDay', label: '出生日期' },
      { key: 'Sex', label: '性别' },
      { key: 'StudyDate', label: '检查日期' },
      { key: 'StudyTime', label: '检查时间' },
      { key: 'Modality', label: '成像设备' },
      { key: 'series', label: '序列数量' },
    ];

    const newList = [
      { key: 'ContentDate', label: '检查日期' },
      { key: 'ContentTime', label: '检查时间' },
    ];

    return list
      .map(item => {
        let value = studies[item.key];
        if (item.key == 'series') {
          value = studies[item.key].length;
        }
        if (item.key == 'Modality') {
          value = studies['series'][0].Modality;
        }

        if (item.key == 'StudyDate') {
          value =
            studies[item.key].slice(0, 4) +
            '年' +
            studies[item.key].slice(4, 6) +
            '月' +
            studies[item.key].slice(6, 8) +
            '日';
        }
        if (item.key == 'StudyTime') {
          value =
            studies[item.key].slice(0, 2) +
            ':' +
            studies[item.key].slice(2, 4) +
            ':' +
            studies[item.key].slice(4, 6);
        }
        if (!value) {
          return false;
        }
        return getCustomHeader({ ...item, value });
      })
      .filter(i => !!i);
  };

  const treeData = [
    {
      title: '1',
      key: '1',
    },
    {
      title: '2',
      key: '2',
    },
  ];

  const getCustomHeader = info => {
    return (
      <React.Fragment key={info.key}>
        <div className="info-item">
          <div className="info-item-title">
            {/* {this.props.t(measureGroup.groupName)} */}
            <span>{info.label} ：</span>
          </div>
          <div className="info-item-items">
            {/* {measureGroup.measurements.length} */}
            <span>{info.value}</span>
          </div>
          {/* <Tree treeData></Tree> */}
        </div>
      </React.Fragment>
    );
  };

  return (
    <div className="look-info">
      <div className="measurementTableHeader">
        <div className="measurementTableHeaderItem">
          <div className="timepointLabel">患者信息</div>
        </div>
      </div>
      {props.studies && (
        <div className="info">{renderItem(props.studies[0])}</div>
      )}
    </div>
  );
};

export default LookInfo;
