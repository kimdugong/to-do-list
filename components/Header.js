import React from 'react';
import { Header } from 'semantic-ui-react';

export default () => {
  return (
    <Header
      style={{ marginTop: '40px' }}
      as="h2"
      icon="tasks"
      content="TO-DO-LIST"
    />
  );
};
