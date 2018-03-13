import { shell, ipcMain, Notification, dialog } from 'electron';
import fs from 'fs';
import { resolve, join } from 'path';
import { exec, fork, spawn } from 'child_process';
import { Buffer } from 'buffer';
import init from './action/init';
import install from './action/install';
import fixpath from 'fix-path';
import npmRunPath from 'npm-run-path';
import { Info } from './util';
import { APP_PATH, NPM_PATH, UBA_PATH } from './path';

const IPC = () => {
    //打开默认浏览器
    ipcMain.on('uba::openUrl', (event, arg) => {
        shell.openExternal(arg);
    });
    //导入项目打开OpenDialog
    ipcMain.on('uba::import', (event, arg) => {
        let path = (dialog.showOpenDialog({ properties: ['openDirectory'] }));
        console.log(path);
        if (path && path.length !== 0) {
            fs.readFile(join(path[0], 'uba.config.js'), 'utf-8', (err, data) => {
                if (err) {
                    event.sender.send('uba::import::error', '无效的uba前端工程');
                } else {
                    event.sender.send('uba::import::success', data);
                }
            });
        }
    });
    //创建工程选择目录
    ipcMain.on('uba::openProject', (event, arg) => {
        let path = (dialog.showOpenDialog({ properties: ['openDirectory'] }));
        console.log(path);
        if (path && path.length !== 0) {
            event.sender.send('uba::openProject::success', path[0]);
        }
    });
    //接收下载远程仓库模板
    ipcMain.on('uba::init', async (event, arg) => {
        let result = await init(arg);
        if (result.success) {
            Info('下载成功', `项目「${arg.project}」下载完毕`);
            event.sender.send('uba::init::success');
        } else {
            Info('下载失败', `项目「${arg.project}」下载失败`);
            event.sender.send('uba::init::error');
        }
    });
    //安装依赖
    ipcMain.on('uba::install', (event, arg) => {
        event.sender.send('uba::install::start');
        install(event, arg);
    });
    ipcMain.on('uba::server', (event, arg) => {
        // console.log(build);
        // console.log(NPM_PATH);
        fixpath();
        let log = '';
        const term = fork(NPM_PATH, ['run','build'], {
            silent: true,
            cwd: '/Users/kvkens/test/first',
            env: npmRunPath.env(),
            detached: true
        });

        term.stdout.on('data', data => {
            log += data.toString();
            console.log(log);
        });
        term.stderr.on('data', data => {
            console.log(data.toString());
            log += data.toString();
        });

        term.on('exit', (code) => {
            // console.log( log);
            event.sender.send('uba::server::start', log);
            Info(`npm:${log}`, `code:${code}`);
        });

    });
}

export default IPC;