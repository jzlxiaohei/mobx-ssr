import React from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router';

@observer
class Layout extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Link to="/">home</Link>
        <Link to="/about/1">about</Link>
        {this.props.children}
      </div>
    )
  }
}

export default Layout;