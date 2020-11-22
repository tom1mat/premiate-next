import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  UserOutlined,
  DollarCircleOutlined,
  RollbackOutlined,
  GiftOutlined,

} from '@ant-design/icons';

import Sorteos from './Sorteos';
import Subastas from './Subastas';
import Usuarios from './Usuarios';

const { Header, Sider, Content } = Layout;

const Slider = ({ page, sorteos, subastas, usuarios }) => {
  const [collapsed, setCollapsed] = useState(false);

  const toggle = () => setCollapsed(!collapsed);

  let content = null;

  const pages = { sorteos: 1, subastas: 2, usuarios: 3 };

  if (page) {
    switch (page) {
      case 'sorteos':
        content = <Sorteos sorteos={sorteos} />;
        break;
      case 'subastas':
        content = <Subastas subastas={subastas} />;
        break;
      case 'usuarios':
        content = <Usuarios usuarios={usuarios} />;
        break;
      default:
        content = 'Bienvenido!';
        break;
    }
  } else {
    content = 'Bienvenido!';
  }

  return (
    <Layout style={{ height: '100%' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={[String(pages[page] || null)]}>
          <Menu.Item key="1" icon={<GiftOutlined />}><a href="/admin/sorteos">Sorteos</a></Menu.Item>
          <Menu.Item key="2" icon={<DollarCircleOutlined />}><a href="/admin/subastas">Subastas</a></Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}><a href="/admin/usuarios">Usuarios</a></Menu.Item>
          <Menu.Item key="4" icon={<RollbackOutlined />}><a href="/">Volver a la web</a></Menu.Item>
        </Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {
            React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger toggle-menu',
              onClick: toggle,
            })
          }
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
          }}
        >
          {content}
        </Content>
      </Layout>
    </Layout>
  );
}

export default Slider;
