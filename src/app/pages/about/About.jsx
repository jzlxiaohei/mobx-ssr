import React from 'react';
import { observer } from 'mobx-react';
import injectStore from '../../infrastructure/injectStore';
import Member from '../../models/Member';

@injectStore({
  storeName:'page-about',
  storeMap: {
    member: Member
  },
  initData: (storeProps)=> {
    return new Promise((resolve)=> {
      setTimeout(()=> {
        storeProps.member.id = 'member';
        resolve(storeProps)
      }, 1000);
    });
  }
}) @observer
class About extends React.Component {
  constructor(props) {
    console.log('constructor');
    super(props);
  }

  render() {
    console.log('render');
    return <div onClick={this.handleClick}>{this.props.member.id} about 2222</div>
  }
}

export default About;