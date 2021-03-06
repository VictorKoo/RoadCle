import {objToQueryString} from '../common/ObjToQueryString';
import {Alert} from 'react-native';
/**
 * @file 轨迹点处理工具
 * @author Victor Koo
 */
/**上传单个轨迹点到百度鹰眼平台
 * @param {string} user_uuid 用户UUID
 * @param {int} time 定位时设备的时间
 * @param {double} longitude [-180.0 , +180.0]
 * @param {double} latitude [-90.0 , +90.0]
 * @param {double} speed 速度(kmph)
 * @param {double} direction [0,359]
 * @param {double} height
 * @param {double} radius 定位精度，GPS或定位SDK返回的值(米)
 * @return {string} state
 * @seeAlso http://lbsyun.baidu.com/index.php?title=yingyan/api/v3/trackupload
 */
export let uploadPoint = (
  _user_uuid = '0',
  _time = 0,
  _longitude = 0.0,
  _latitude = 0.0,
  _speed = 0.0,
  _direction = 0.0,
  _height = 0.0,
  _radius = 0.0,
) => {
  console.log('Upload point');
  var formData = new FormData();
  formData.append('ak', 'm5yRqRW0RlGoZCPL5PX8hS1dTpRZ7AAs');
  formData.append('service_id', 226802);
  formData.append('entity_name', _user_uuid);
  formData.append('loc_time', _time);
  formData.append('longitude', _longitude);
  formData.append('latitude', _latitude);
  formData.append('speed', _speed);
  formData.append('coord_type_input', 'bd09ll');
  formData.append('direction', _direction);
  formData.append('height', _height);
  formData.append('radius', _radius);
  fetch('http://yingyan.baidu.com/api/v3/track/addpoint', {
    method: 'POST',
    body: formData,
  })
    .then((response) =>
      response.json().then((res) => {
        return res.status;
      }),
    )
    .catch((error) => {
      console.log(error);
    });
};

/**
 * 上传轨迹点集合到百度鹰眼平台
 * @param {Array} point_list
 * @param {string} point_list.entity_name 用户UUID
 * @param {int} point_list.time 定位时设备的时间
 * @param {double} point_list.longitude [-180.0 , +180.0]
 * @param {double} point_list.latitude [-90.0 , +90.0]
 * @param {double} point_list.speed 速度(kmph)
 * @param {double} point_list.direction [0,359]
 * @param {double} point_list.height
 * @param {double} point_list.radius 定位精度，GPS或定位SDK返回的值(米)
 * @seeAlso http://lbsyun.baidu.com/index.php?title=yingyan/api/v3/trackupload
 */
export let uploadPoints = (point_list) => {
  var formData = new FormData();
  formData.append('ak', 'm5yRqRW0RlGoZCPL5PX8hS1dTpRZ7AAs');
  formData.append('service_id', 226802);
  formData.append('point_list', point_list);
  fetch('http://yingyan.baidu.com/api/v3/track/addpoints', {
    method: 'POST',
    body: formData,
  })
    .then((response) =>
      response.json().then((res) => {
        return res.message;
      }),
    )
    .catch((error) => {
      console.log(error);
    });
};

/**
 * 通过经纬度和高度计算距离
 * @param {Number} lat1
 * @param {Number} lng1
 * @param {Number} lat2
 * @param {Number} lng2
 * @param {Number=} alt1
 * @param {Number=} alt2
 * @returns {Number} distant (metre)
 */
export let calcDistantByLL = (lat1, lng1, lat2, lng2, alt1 = 0, alt2 = 0) => {
  let h = Math.abs(alt1 - alt2);
  let radLat1 = (lat1 * Math.PI) / 180.0;
  let radLat2 = (lat2 * Math.PI) / 180.0;
  let a = radLat1 - radLat2;
  let b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
  let s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2),
      ),
    );
  s = s * 6378137; // EARTH_RADIUS(metre);
  s = Math.sqrt(Math.pow(h, 2) + Math.pow(s, 2));
  s = Math.round(s * 100) / 100; // (metre)
  return s;
};

/**
 * 由速度计算距离
 * @param {Number} interval (second)
 * @param {Number} speed (metre per second)
 * @returns mileage (metre)
 */
export let calcDistantBySpeed = (interval, speed) => {
  return interval * speed;
};

/**
 * 获取距离
 * @param {String} name
 * @param {Number} start_time
 * @param {Number} end_time
 */
export let getDistance = (name, start_time, end_time) => {
  fetch(
    'http://yingyan.baidu.com/api/v3/track/getdistance?' +
      objToQueryString({
        ak: 'm5yRqRW0RlGoZCPL5PX8hS1dTpRZ7AAs',
        service_id: '226802',
        entity_name: name,
        process_option: 'denoise_grade=1,need_mapmatch=0,transport_mode=riding',
        supplement_mode: 'riding',
        start_time: start_time,
        end_time: end_time,
        is_processed: '1',
      }),
    {
      method: 'GET',
    },
  )
    .then((res) =>
      res.json().then((json) => {
        console.log(json);
      }),
    )
    .catch((error) => {
      console.warn(error);
    });
};

/**开始时间戳 */
let startTime = 0;

/**
 * 运动信息计算
 * @param {Number} interval (ms)
 * @param {Number} speed (mps)
 * @param {Number} mileage (m)
 * @param {Number} altitude (m)
 * @param {Number} timestamp (s)
 * @param {Boolean} isStart Is it start point?
 * @returns {Object} data
 */
export let calcData = (
  interval,
  speed,
  mileage,
  altitude,
  timestamp,
  isStart = false,
) => {
  // console.log('Calc data: ' + isStart);
  let data = {
    /**速度 */
    speed: 0,
    /**里程 */
    mileage: 0,
    /**时间 */
    duration: '00:00',
    /**爬升 */
    climb: 0,
    /**平均速度 */
    averageSpeed: 0,
  };
  let startAltitude = 0;
  let timeDur = Math.abs(timestamp - startTime);
  // let timeDur = z + interval / 1000;
  // z = timeDur;
  let s = 0;
  let m = 0;
  s = timeDur % 60;
  m = parseInt(timeDur / 60, 10);
  if (isStart) {
    timeDur = 0;
    startTime = timestamp;
    startAltitude = altitude;
    return data;
  }
  data.speed = Math.round(speed * 10) / 10;
  data.mileage =
    Math.round((calcDistantBySpeed(interval / 1000, speed) + mileage) * 10) /
    10;
  data.duration =
    (m < 10 ? '0' + String(m) : m >= 1000 ? (m = '999') : String(m)) +
    ':' +
    (s < 10 ? '0' + String(s) : String(s));
  data.climb = altitude - startAltitude;
  data.averageSpeed = (mileage * 1000) / timeDur;
  return data;
};
