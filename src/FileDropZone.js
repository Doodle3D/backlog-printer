import React from 'react';
import Dropzone from 'react-dropzone';

export default class FileDropZone extends React.Component {
  state = {
    hasFile: false,
    isDragActive: false
  }
  static propTypes = {
    onDrop: React.PropTypes.func.isRequired
  }
  onDragOver = () => this.setState({isDragActive:true});
  onDragLeave = () => this.setState({isDragActive:false});
  onFileDrop = (files) => {
    this.setState({isDragActive:false, hasFile:true});
    this.props.onDrop(files);
  }
  style = {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
  }
  borderStyle = {
    position: 'absolute',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    borderColor: '#BBB',
    borderStyle: 'dashed',
    borderRadius: 5,
    margin: 10,
    pointerEvents: 'none'
  }
  render () {
    let {isDragActive, hasFile} = this.state;
    var showBorder = (isDragActive || !hasFile)
    let style = this.style;
    let borderStyle = this.borderStyle;
    borderStyle.borderColor = isDragActive ? '#333' : '#BBB';
    borderStyle.display = showBorder ? 'block' : 'none';
    return (
      <div>
        <Dropzone
          onDrop={this.onFileDrop}
          onDragOver={this.onDragOver}
          onDragLeave={this.onDragLeave}
          style={style}
          multiple={false}
          supportClick={false}
          accept=".stl">
          {this.props.children}
        </Dropzone>
        <div style={borderStyle}></div>
      </div>
    )
  }
}
