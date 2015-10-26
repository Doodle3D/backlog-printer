import React from 'react';
import ReactDOM from 'react-dom';
import csv from 'csv';
import FileDropZone from './FileDropZone.js';
import BacklogItem from './BacklogItem.js';

export default class App extends React.Component {
  state = {
    backlog: {}
  }
  onDrop = (files) => {
    var file = files[0];
    this._readFile(file)
      .then(this._parseFile)
      .then(this._filterFile)
      .catch((e) => console.log(e));
  }
  _readFile = (file) => {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener('load', (event) => {
        file.rawContent = event.target.result;
        resolve(file);
      }, false );
      if ( reader.readAsBinaryString !== undefined ) {
        reader.readAsBinaryString( file );
      } else {
        reader.readAsArrayBuffer( file );
      }
    });
  }
  _parseFile = (file) => {
    return new Promise((resolve, reject) => {
      var extension = file.name.split( '.' ).pop().toLowerCase();

      switch(extension) {
        case 'csv':
          var result = csv.parse(file.rawContent, {header: true});
          // console.log('result: ', result);
          file.content = result.data;
          resolve(file);
          break;
        default:
          reject(`Unsupported file format (${extension}).`)
          break;
      }
    });
  }
  _filterFile = (file) => {
    return new Promise((resolve, reject) => {
      var data = file.content
      let backlog = {};
      for(let item of data) {
        // console.log('item: ', item);
        let category = item.Categorie.toLowerCase()
          .replace(/(\+|^\s|\s&)/g,'');
        // console.log('category: ', category);
        if(category === '') continue;
        category = 'category-'+category
          .replace(/\s+/g,'-');
        if(backlog[category] === undefined) {
          backlog[category] = {
            title: item.Categorie,
            items: []
          };
        }
        item = this._filterItem(item);
        backlog[category].items.push(item);
      }
      this.setState({backlog});
    });
  }
  _filterItem = (rawItem) => {
    var time;
    var days = rawItem['Man dagen'];
    if(days != undefined) {
      if(days < 1) time = days*8+'u';
      else time = days+'d';
    }
    return {
      category: rawItem.Categorie,
      priority: rawItem.Prioriteit,
      status: rawItem.Status,
      time: time||rawItem.Tijd,
      title: rawItem.Titel,
      story: rawItem.Verhaal
    }
  }
  render () {
    const {backlog} = this.state;
    // console.log('backlog: ', backlog);
    return (
      <FileDropZone onDrop={this.onDrop}>
        {Object.keys(backlog).map((categoryID) => {
          var categoryData = backlog[categoryID]
          let categoryTitle = categoryData.title;
          let items = categoryData.items;
          return (
            <div key={categoryID} className='category'>
              <h2>{categoryTitle}</h2>
              {items.map((item, index) => {
                // console.log('item: ', item);
                return <BacklogItem 
                  key={index}
                  categoryID={categoryID}
                  {...item} />
              })}
            </div>
          )
        })}
      </FileDropZone>
    );
  }
}
ReactDOM.render(<App />, document.getElementById('app'));
