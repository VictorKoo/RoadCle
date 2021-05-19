import {objToQueryString} from '../common/ObjToQueryString';
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
