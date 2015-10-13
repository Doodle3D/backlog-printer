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
      //.catch((e) => alert(e));
  }
  _readFile = (file) => {
    return new Promise((resolve, reject) => {
      var reader = new FileReader();
      reader.addEventListener('load', (event) => {
        file.contents = event.target.result;
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
        let result = csv.parse(file.contents, {header: true});
          // console.log('result: ', result);
          let backlog = {};
          for(let item of result.data) {
            // console.log('item: ', item);
            let category = 'category-'+item.Categorie.toLowerCase()
              .replace(/(\+|^\s|\s&)/g,'')
              .replace(/\s+/g,'-');
            // console.log('category: ', category);
            if(backlog[category] === undefined) {
              backlog[category] = {
                title: item.Categorie,
                items: []
              };
            }
            backlog[category].items.push(item);
          }
          this.setState({backlog});
          break;
        default:
          reject(`Unsupported file format (${extension}).`)
          break;
      }
    });
  }
  render () {
    const {backlog} = this.state;
    return (
      <FileDropZone onDrop={this.onDrop}>
        {Object.keys(backlog).map((categoryID) => {
          var categoryData = backlog[categoryID]
          let categoryTitle = categoryData.title;
          let items = categoryData.items;
          return (
            <div key={categoryID} className='category'>
              <h2>{categoryTitle}</h2>
              {items.map((item) => {
                // console.log('item: ', item);
                return <BacklogItem 
                  key={item.Titel}
                  categoryID={categoryID}
                  category={item.Categorie}
                  priority={item.Prioriteit}
                  status={item.Status}
                  time={item.Tijd}
                  title={item.Titel}
                  story={item.Verhaal}/>
              })}
            </div>
          )
        })}
      </FileDropZone>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
