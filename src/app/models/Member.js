import makeObs from '../infrastructure/makeObservable';

const memberFds = {
  id: 0,
  username: '',
  tagline: '',
  avatar_mini: '',
  avatar_normal: '',
  avatar_large: ''
};
class Member {
  constructor() {
    makeObs(this, memberFds)
  }
}

export default Member