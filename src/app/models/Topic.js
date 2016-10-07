import makeObs from '../infrastructure/makeObservable';
import Node from './Node';
import Member from './Member';

const topicFds = {
  id: 0,
  title: '',
  url: '',
  content: '',
  content_rendered: '',
  replies: 0,
  created: 0,
  last_modified: 0,
  last_touched: 0,
  node: new Node(),
  member: new Member()
};

class Topic {
  constructor() {
    makeObs(this, topicFds)
  }
}


export default Topic;