import GitalkComponent from 'gitalk/dist/gitalk-component';
import 'gitalk/dist/gitalk.css';
import React from 'react';

const Talk = (id) => {
  return (
    <GitalkComponent
      options={{
        clientID: 'cb528f09b2f296588456',
        clientSecret: '16b459b3df9532882614811667dbc099b20fd924',
        repo: 'southlamp.github.io',
        owner: 'southlamp',
        admin: ['770757534@qq.com'],
        id,
      }}
    />
  );
};

export default Talk;
