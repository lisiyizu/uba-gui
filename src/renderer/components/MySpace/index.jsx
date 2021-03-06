import React, { Component } from 'react';
import { actions } from 'mirrorx';
import { Button, notification, message, Layout, List, Avatar, Menu, Icon } from 'antd';
import { ipcRenderer } from 'electron';
import ut from 'static/ut.png';
import ansiHTML from 'ansi-html';

import './index.less';
const { Header, Content, Footer, Sider } = Layout;


const ipc = ipcRenderer;


//测试用记得删除
ipc.on('uba::view::project2', (event, workSpace) => {
    actions.my.setWorkSpace(workSpace);
});


let prt, ele;
/**
 * 接收构建on消息
 */
ipc.on('uba::run::build::on', (event, log) => {
    // console.log(log)
    actions.my.setCmdLog(ansiHTML(log.toString().replace(/\n/g, '<br>')));
    if (ele.offsetHeight > prt.clientHeight) {
        prt.scrollTop = ele.clientHeight - prt.clientHeight;
    }
});

/**
 * 接收构建end消息
 */
ipc.on('uba::run::build::end', (event, log, msg) => {
    message.success(msg);
});
/**
 * 接收调试on消息
 */
ipc.on('uba::run::dev::on', (event, log) => {
    // console.log(log)
    actions.my.setCmdLog(ansiHTML(log.toString().replace(/\n/g, '<br>')));
    if (ele.offsetHeight > prt.clientHeight) {
        prt.scrollTop = ele.clientHeight - prt.clientHeight;
    }
});

ipc.on('uba::log', (event, log) => {
    console.log(log)
});

/**
 * 接收构建end消息
 */
ipc.on('uba::run::dev::end', (event, log, code) => {
    // console.log(log,code);
    message.success(log);
});


class MySpace extends Component {
    /**
     * 执行调试
     */
    npmRun = (item) => () => {
        console.log('发送启动调试消息 uba::run::dev', item.path);
        ipc.send('uba::run::dev', item);
    }
    /**
     * 执行构建
     */
    npmBuild = (item) => () => {
        console.log('发送构建消息 uba::run::build', item.path);
        ipc.send('uba::run::build', item);
    }

    npmStop = (item) => () => {
        ipc.send('uba::run::stop', item);
    }

    /**
     * 打开本地工程
     */
    openLocalFolder = (item) => () => {
        console.log('发送打开本地文件夹消息 uba::open::folder', item.path);
        ipc.send('uba::open::folder', item.path);
    }

    render() {
        let { workSpace, cmdLine } = this.props;
        return (
            <div className="uba-my-space">
                <Layout>
                    <Content style={{ "background": "#fff" }}>
                        <List
                            className="uba-project-list"
                            itemLayout="horizontal"
                            bordered={true}
                            dataSource={workSpace}
                            renderItem={item => (
                                <List.Item actions={[
                                    <Button onClick={this.npmRun(item)} >运行</Button>,
                                    <Button onClick={this.npmBuild(item)} >构建</Button>,
                                    <Button onClick={this.npmStop(item)} >停止</Button>
                                ]}>
                                    <List.Item.Meta
                                        avatar={<Avatar src={ut} />}
                                        title={<a onClick={this.openLocalFolder(item)} href="javascript:void(0)">{item.title}</a>}
                                        description={`Path:${item.path}`}
                                    />
                                </List.Item>
                            )}
                        />
                        <div className="uba-cmd" ref={(item) => { prt = item }}>
                            <div ref={(item) => { ele = item }} dangerouslySetInnerHTML={{ __html: cmdLine }} ></div>
                        </div>
                    </Content>
                </Layout>
            </div>
        );
    }
}

export default MySpace;
