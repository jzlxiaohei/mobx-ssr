import React from 'react';
import { observer } from 'mobx-react';
import injectStore from '../../infrastructure/injectStore';
import Topic from '../../models/Topic';
import About from '../about/About';

@injectStore({
  storeName: 'page-home',
  storeMap: {
    topic: Topic,
  },
  initData: (storeProps)=> {
    return new Promise((resolve)=> {
      setTimeout(()=> {
        storeProps.topic.id = 'topic';
        resolve(storeProps)
      }, 100);
    });
  }
}) @observer
class Home extends React.Component {
  constructor(props) {
    console.log('constructor');
    super(props);
  }

  handleClick = ()=> {
    this.props.topic.id = 22;
  };

  render() {
    return (
      <div>
        <div onClick={this.handleClick}>{this.props.topic.id} home 111</div>
        <About/>
      </div>
    )
  }
}

export default Home;