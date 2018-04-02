/**
 * @description 数据请求封装类
 */

import axios from 'axios';

const remoteUrl = 'https://raw.githubusercontent.com/tinper-uba/uba-gui/develop/project.json';

export function getProjectTemplates(){
    return axios.get(remoteUrl);
}