/**
 * 获得相关系统路径
 */

import { join } from 'path';
import { homedir } from 'os';


//APP系统当前的路径，分为两种，开发阶段从当前源文件级别获取app。生产阶段从应用下的app获得。
export const APP_PATH = __isDev__ ? join(process.cwd(), 'app') : join(process.resourcesPath, 'app');
//系统自带的npm路径
export const NPM_PATH = join(APP_PATH, 'node_modules', 'npm', 'bin', 'npm-cli.js');
//Uba的配置文件目录
export const UBA_PATH = join(homedir(), '.UbaGui');
//Uba的配置文件
export const UBA_CONFIG_PATH = join(homedir(), '.UbaGui','uba-gui.json');
//二进制node的目录
export const NODE_PATH = join(APP_PATH, 'nodes');
//应用内app的node_module
export const NPM_BIN_PATH = join(APP_PATH, 'node_modules', '.bin');
//Uba执行的路径
export const UBA_BIN_PATH = join(APP_PATH, 'node_modules', 'uba','bin','uba.js');
