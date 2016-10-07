import makeObs from '../infrastructure/makeObservable';

const nodeFds = {
  id: '',
  name: '',
  title_alternative: '',
  url: '',
  topics: 0,
  avatar_mini: '',
  avatar_normal: '',
  avatar_large: ''
};

class Node {
  constructor() {
    makeObs(this, nodeFds)
  }
}

export default Node;