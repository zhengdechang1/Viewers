/*
 * @Description:
 * @Author: Devin
 * @Date: 2022-12-16 11:44:33
 */
import React, { useState, useMemo, useEffect } from 'react';
import './lookInfo.css';
import { Input, Tree } from 'antd';
const { Search } = Input;
const LookInfo = props => {
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const [dataList, setDataList] = useState([]);
  const [dataTree, setDataTree] = useState([]); //默认数据

  const onExpand = newExpandedKeys => {
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const list = [
    '0020000D',
    '0020000E',
    '00080005',
    '00080020',
    '00080030',
    '00080050',
    '00080060',
    '00080090',
    '00081190',
    '00100010',
    '00100020',
    '00100030',
    '00100040',
    '00200010',
    '00200011',
    '00201209',
  ];

  const getStudyTree = (studies, index) => {
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
        let title = `${item.label} ： ${String(value)}`;
        return {
          key: `series${index + 1}${item.key}`,
          title: title,
        };
      })
      .filter(i => !!i);
  };

  const ignore = ['00291140', '00321032', '00189346', '00082112', '00189346'];

  useEffect(() => {
    let studies = props.studies ? props.studies[0] : {};
    let activeImage = props.activeImage ? props.activeImage : 0;

    let currentSeries = props.currentSeries;
    let instances = studies.seriesMap[currentSeries]
      ? studies.seriesMap[currentSeries].instances
      : [];

    let seriesData = instances[activeImage];

    let studyInfo = {
      ...seriesData.seriesData.find(
        i => i['0020000E']['Value'][0] == currentSeries
      ),
      ...seriesData.originMetaData,
    };

    const info = Object.keys(studyInfo).map((item, index) => {
      let title = `${item} : ${
        studyInfo[item] && studyInfo[item]['Value']
          ? studyInfo[item]['Value'].toString()
          : ''
      }`;

      if (item == '00100010') {
        title = `${item} : ${studyInfo[item]['Value'][0].Alphabetic}`;
      }
      if (item == '7FE00010') {
        title = `${item} : ${studyInfo[item].BulkDataURI}`;
      }

      if (ignore.includes(item)) {
        return false;
      }

      return {
        key: `${item}`,
        title: title,
      };
    });

    let tree = [
      {
        key: `studyInfo`,
        title: `studyInfo`,
        children: info.filter(i => !!i),
      },
    ];

    setDataTree(tree);
    getDataList(tree);
  }, [props.activeImage, props.currentSeries]);

  const getDataList = tree => {
    let newDataList = [];
    const generateList = data => {
      for (let i = 0; i < data.length; i++) {
        const node = data[i];
        const { key, title } = node;
        newDataList.push({
          key,
          title: title,
        });
        if (node.children) {
          generateList(node.children);
        }
      }
    };
    generateList(tree);
    setDataList(newDataList);
  };

  const treeData = useMemo(() => {
    const loop = data =>
      data.map(item => {
        const strTitle = item.title;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );
        if (item.children) {
          return {
            title,
            key: item.key,
            children: loop(item.children),
          };
        }
        return {
          title,
          key: item.key,
        };
      });
    return loop(dataTree);
  }, [searchValue, dataTree]);

  const getParentKey = (key, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some(item => item.key === key)) {
          parentKey = node.key;
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children);
        }
      }
    }
    return parentKey;
  };

  const onChange = e => {
    const { value } = e.target;
    const newExpandedKeys = dataList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, dataTree);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setExpandedKeys(newExpandedKeys);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

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
        return;
      })
      .filter(i => !!i);
  };

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
      {/* {props.studies && (
        <div className="info">{renderItem(props.studies[0])}</div>
      )} */}
      <div>
        <Search
          style={{
            marginBottom: 8,
          }}
          placeholder="Search"
          onChange={onChange}
        />
        <Tree
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          treeData={treeData}
        />
      </div>
    </div>
  );
};

export default LookInfo;
