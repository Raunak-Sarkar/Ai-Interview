import React from 'react';
import { Layout, Tabs, Typography } from 'antd';
import IntervieweeView from './features/interviewee/IntervieweeView';
import InterviewerView from './features/interviewer/InterviewerView';
import { UserOutlined, SolutionOutlined } from '@ant-design/icons';
import WelcomeBackModal from './components/WelcomeBackModal';

const { Header, Content } = Layout;
const { Title } = Typography;
function App() {
  const items = [
    {
      key: '1',
      label: (
        <span>
          <UserOutlined /> Candidate
        </span>
      ),
      children: <IntervieweeView />,
    },
    {
      key: '2',
      label: (
        <span>
          <SolutionOutlined /> Interviewer
        </span>
      ),
      children: <InterviewerView />,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          AI-Powered Interview Assistant
        </Title>
      </Header>
      <Content style={{ padding: '24px 48px' }}>
        <Tabs defaultActiveKey="1" items={items} />
      </Content>
      <WelcomeBackModal />
    </Layout>
  );
}

export default App;