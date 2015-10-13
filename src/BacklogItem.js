import React, {PropTypes} from 'react';

export default class BacklogItem extends React.Component {
  static propTypes = {
    categoryID: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    story: PropTypes.string.isRequired
  }
  static defaultProps = {
    categoryID: '',
    category: '',
    priority: '',
    status: '',
    time: '',
    title: '',
    story: '',
  }
  static style
  render () {
    const {categoryID, category, priority, status, time, title, story} = this.props;
    const className = 'item '+categoryID;
    return (
      <table className={className}>
        <thead>
          <tr>
            <th colSpan={2}>{title}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={2}>{story}</td>
          </tr>
          <tr>
            <td><strong>{category}</strong></td>
            <td>Tijd: <strong>{time}</strong></td>
          </tr>
        </tbody>
      </table>
    );
  }
}
