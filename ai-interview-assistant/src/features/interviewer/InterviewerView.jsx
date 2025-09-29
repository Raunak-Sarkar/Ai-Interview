import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Table, Input, Button, Space, Modal, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

// The dashboard view for the interviewer. [cite: 9, 34]
const InterviewerView = () => {
  const { candidates } = useSelector((state) => state.interview);
  const [searchText, setSearchText] = useState('');
  const [sortedInfo, setSortedInfo] = useState({});
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleChange = (pagination, filters, sorter) => {
    setSortedInfo(sorter);
  };
  
  const viewDetails = (candidate) => {
    setSelectedCandidate(candidate);
    setIsModalVisible(true);
  };

  const filteredCandidates = candidates.filter(c =>
    c.name.toLowerCase().includes(searchText.toLowerCase()) && c.score !== null
  );

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortOrder: sortedInfo.columnKey === 'name' && sortedInfo.order,
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      sorter: (a, b) => a.score - b.score,
      sortOrder: sortedInfo.columnKey === 'score' && sortedInfo.order,
      defaultSortOrder: 'descend', // [cite: 9]
    },
    {
      title: 'Summary',
      dataIndex: 'summary',
      key: 'summary',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button onClick={() => viewDetails(record)}>View Details</Button>
      ),
    },
  ];

  return (
    <div>
      <Input
        placeholder="Search by name"
        onChange={handleSearch}
        style={{ width: 200, marginBottom: 16 }}
        prefix={<SearchOutlined />}
      />
      <Table
        columns={columns}
        dataSource={filteredCandidates}
        rowKey="id"
        onChange={handleChange}
      />
      
      {selectedCandidate && (
        <Modal
          title={`Interview Details: ${selectedCandidate.name}`}
          open={isModalVisible}
          onOk={() => setIsModalVisible(false)}
          onCancel={() => setIsModalVisible(false)}
          width={800}
          footer={[<Button key="back" onClick={() => setIsModalVisible(false)}>Close</Button>]}
        >
          <Title level={5}>Profile</Title>
          <Paragraph>
            <Text strong>Email:</Text> {selectedCandidate.email} <br/>
            <Text strong>Phone:</Text> {selectedCandidate.phone}
          </Paragraph>
          <Title level={5}>AI Summary</Title>
          <Paragraph>{selectedCandidate.summary}</Paragraph>
          <Title level={5}>Chat History</Title>
          <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', borderRadius: '4px' }}>
             {selectedCandidate.chatHistory.map((msg, index) => (
                <p key={index}>
                    <Text strong>{msg.sender.toUpperCase()}:</Text> <Text>{msg.text}</Text>
                </p>
             ))}
          </div>
        </Modal>
      )}
    </div>
  );
};

export default InterviewerView;