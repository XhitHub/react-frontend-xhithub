import React, { Component } from 'react';
import './style.css';
import { TablePagination } from 'react-pagination-table';
import config from 'react-global-configuration';
import $ from 'jquery';

// var apiUrl = config.get('apiUrl');

class KnowledgeGroups extends Component {
  constructor(props) {
      super(props);

      this.state = {
         knowledgeGroups: []
      }
   }

  componentWillMount() {
      console.log('Component WILL MOUNT!')
   }
   componentDidMount() {
      console.log('Component DID MOUNT!')
      console.log('global.apiUrl',global.apiUrl);
      $.ajax({
          url: global.apiUrl+'knowledge/get-knowledge-group',
          type: 'post',
          dataType: 'json',
          contentType: 'application/json',
          success: function (data) {
              this.setState({knowledgeGroups: data});
          },
          data: {
          	"tags": ["thrower","asd"]
          }
      });
   }
   componentWillReceiveProps(newProps) {
      console.log('Component WILL RECIEVE PROPS!')
   }
   shouldComponentUpdate(newProps, newState) {
      return true;
   }
   componentWillUpdate(nextProps, nextState) {
      console.log('Component WILL UPDATE!');
   }
   componentDidUpdate(prevProps, prevState) {
      console.log('Component DID UPDATE!')
   }
   componentWillUnmount() {
      console.log('Component WILL UNMOUNT!')
   }
  render() {
    const Header = ["Name", "Tags" ];
    return (
      <div className="">
        <h1>Knowledge groups</h1>
        <TablePagination
            subTitle=""
            headers={ Header }
            data={ this.state.knowledgeGroups }
            columns="name.tagsStr"
            perPageItemCount={ 5 }
            totalCount={ this.state.knowledgeGroups.length }
            arrayOption={ [["size", 'all', ' ']] }
        />
      </div>
    );
  }
}

export default KnowledgeGroups;
