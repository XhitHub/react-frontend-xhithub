import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";

import KnowledgeGroupPicker from "../knowledge-group/KnowledgeGroupPicker";
import PrologMaker from "../general/PrologMaker";

class ExportKnowledge extends Component {
  constructor(props) {
      super(props);
      this.prologMaker = new PrologMaker();
      this.state = {
         lastExportInfo: undefined,
         knowledgeGroups: [],
          exportAll: true,
          newOnly: true,
          pl: ''
      }
   }

   handleChange(e){
     global.handleInputChange(this,e);
   }
   handleChangeChk(e){
     global.handleInputChangeChk(this,e);
   }

  componentWillMount() {
      console.log('Component WILL MOUNT!')
   }
   componentDidMount() {
      console.log('Component DID MOUNT!')
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
      console.log(this.state)
   }
   componentWillUnmount() {
      console.log('Component WILL UNMOUNT!')
   }
   templateAjax(){
     var opts = {
       url: global.apiUrl + 'knowledge/knowledge-group',
       type: 'post',
       success: (data) => {
         this.setState({
           knowledgeGroup: data
         });
       },
       data: JSON.stringify({
         "name": this.state.name,
        	"is_private":false,
        	"tags": [
        	],
          "description": this.state.description
       })
     }
     global.simpleAjax(opts);
   }
   updateKnowledgeGroups(groups){
     var arr = [];
     groups.forEach(
       (g)=>{
         arr.push(g._id)
       }
     )
     this.state.knowledgeGroups = arr;
     this.setState({})
   }
   download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }
   export(){
     var opts = {
       url: global.apiUrl + 'knowledge/get-all-rules',
       type: 'get',
       success: (data) => {
         var pl = ''
         data.forEach((item) => {
           pl += this.prologMaker.ruleToPL(item.rule) + '.\n';
         })
         this.setState({
           pl: pl,
         });
         this.download("exports.pl",pl);
       }
     }
      global.simpleAjax(opts);
   }
  render() {
    var kgPick
    if(!this.state.exportAll){
      kgPick = (
        <KnowledgeGroupPicker onPickedGroupsChange={this.updateKnowledgeGroups.bind(this)} />
      )
    }
    return (
      <div className="">
        <h1>Export knowledge</h1>
        <div class="text-center">
          <p class="text-center">Export knowledge from selected knowledge groups to perform automated problem solving locally.</p>
        </div>
        <hr/>
        <div className="row">
        <div className="col offset-lg-2 col-lg-8">
          <h4>Export mode:</h4>
          <div class="form-group">
            <div class="checkbox">
              <label><input class="checkbox" type="checkbox" name="newOnly" defaultChecked={this.state.newOnly} onChange={this.handleChangeChk.bind(this)} />
              Export new/updated knowledge since last export only</label>
            </div>
          </div>

          <h4>Knowledge group(s) to be exported:</h4>
          <div class="form-group">
            <div class="checkbox">
              <label><input class="checkbox" type="checkbox" name="exportAll" defaultChecked={this.state.exportAll} onChange={this.handleChangeChk.bind(this)} />
              Export all knowledge groups</label>
            </div>
          </div>
          {kgPick}
        </div>
        </div>


        <div className="col col-lg-12 text-center">
          <button class="btn btn-primary" onClick={this.export.bind(this)}>Export</button>
        </div>

        {this.state.pl}
      </div>

    );
  }
}

export default withRouter(ExportKnowledge);
