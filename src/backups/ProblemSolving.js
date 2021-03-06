import React, { Component } from 'react';
import './style.css';
import $ from 'jquery';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import ReactTable from "react-table";
import 'react-table/react-table.css';

import KnowledgeGroupPicker from "../knowledge-group/KnowledgeGroupPicker";
import PrologMaker from "../general/PrologMaker";
import FactBuilder from "../knowledge/FactBuilder";
import Fact from '../knowledge/Fact';

var cloneDeep = require('clone-deep');

class ProblemSolving extends Component {
  constructor(props) {
      super(props);
      this.prologMaker = new PrologMaker();
      this.state = {
         lastExportInfo: undefined,
         factsKnowledgeGroups: [],
         rulesKnowledgeGroups: [],
          exportAllRules: true,
           exportAllFacts: false,
          newOnly: true,
          pl: '',
          solveMode: 'local',
          problemType: 'fact-check',
          fact:{},
          problems:[]
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
   updateRulesKnowledgeGroups(groups){
     var arr = [];
     groups.forEach(
       (g)=>{
         arr.push(g._id)
       }
     )
     this.state.rulesKnowledgeGroups = arr;
     this.setState({})
   }
   updateFactsKnowledgeGroups(groups){
     var arr = [];
     groups.forEach(
       (g)=>{
         arr.push(g._id)
       }
     )
     this.state.factsKnowledgeGroups = arr;
     this.setState({})
   }
   updateFact(fact){
     this.setState({
       fact: fact
     })
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
   exportRules(){
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
         this.download("rules.pl",pl);
       }
     }
     if(!this.state.exportAllRules){
       var kgs = this.state.rulesKnowledgeGroups;
       kgs.push('related-predicates-rules');
       opts.url = global.apiUrl + 'knowledge/get-rules-by-knowledge-groups'
       opts.type = 'post';
       opts.data = JSON.stringify(
         kgs
       )
     }
      global.simpleAjax(opts);
   }
    exportFacts(){
      var opts = {
        url: global.apiUrl + 'knowledge/get-all-facts',
        type: 'get',
        success: (data) => {
          var pl = ''
          data.forEach((item) => {
            pl += this.prologMaker.formulaToPL(item.fact) + '.\n';
          })
          this.setState({
            pl: pl,
          });
          this.download("facts.pl",pl);
        }
      }
      if(!this.state.exportAllFacts){
        var kgs = this.state.factsKnowledgeGroups;
        kgs.push('related-predicates-rules');
        opts.url = global.apiUrl + 'knowledge/get-facts-by-knowledge-groups'
        opts.type = 'post';
        opts.data = JSON.stringify(
          kgs
        )
      }
       global.simpleAjax(opts);
    }
    addProblem(){
      this.state.problems.push(
        {
          type: this.state.problemType,
          fact: cloneDeep(this.state.fact)
        }
      )
      this.setState({
        fact: {}
      })
    }
    removeProblem(fact){
      this.state.problems = this.state.problems.filter(p=>{
        return p.fact !== fact
      });
      this.setState({})
    }
    exportProblems(){
      var pl = this.prologMaker.problemsToPL(this.state.problems);
      // this.download("solve_problems.pl",pl);
      this.setState({
        plQuery: pl
      })
    }
    createProblemSolvingRequest(){

    }
  render() {
    var kgPickRules
    var kgPickFacts
    var exportRulesBtn, exportFactsBtn, confirmProblemsBtn, plQueryTextarea
    if(!this.state.exportAllRules){
      kgPickRules = (
        <KnowledgeGroupPicker onPickedGroupsChange={this.updateRulesKnowledgeGroups.bind(this)} />
      )
    }
    if(!this.state.exportAllFacts){
      kgPickFacts = (
        <KnowledgeGroupPicker onPickedGroupsChange={this.updateFactsKnowledgeGroups.bind(this)} />
      )
    }
    if(this.state.solveMode == 'local'){
      exportRulesBtn = (
        <div className="col col-lg-12 text-center">
          <button class="btn btn-primary" onClick={this.exportRules.bind(this)}>Export</button>
        </div>
      )
      exportFactsBtn = (
        <div className="col col-lg-12 text-center">
          <button class="btn btn-primary" onClick={this.exportFacts.bind(this)}>Export</button>
        </div>
      )
      confirmProblemsBtn = (
        <div className="col col-lg-12 text-center">
          <button class="btn btn-primary" onClick={this.exportProblems.bind(this)}>
          <h4>Generate problems queries</h4>
          <p>(No need to export facts, rules again unless facts/rules are modified)</p>
          </button>
        </div>
      )
      plQueryTextarea = (
        <div class="row">
          <div class="col">
            <h4>Problems queries:</h4>
            <textarea id="pl-queries-textarea" value={this.state.plQuery}></textarea>
          </div>
        </div>
      )
    }
    else{
      confirmProblemsBtn = (
        <div className="col col-lg-12 text-center">
          <button class="btn btn-primary" onClick={this.createProblemSolvingRequest.bind(this)}>
          <h4>Create problem solving request</h4>
          </button>
        </div>
      )
    }
    const columns = [
      {
        Header: 'Problem type',
        accessor: 'type', // String-based value accessors!
        Cell: props =>
            <p>{props.value}</p>
      },
      {
        Header: 'Fact / goal',
        accessor: 'fact', // String-based value accessors!
        Cell: props =>
          <p class="">
            {global.formulaToString(props.value)}
          </p>
      },
      {
        Header: 'Remove',
        accessor: 'fact',
        Cell: props => <i className='fa fa-times pointer' onClick={(()=>{this.removeProblem(props.value)})}></i> // Custom cell components!
      }
    ];
    return (
      <div className="">
        <h1>Automated problem solving</h1>
        <div class="text-center">
          <p class="text-center">Perform automated problem solving with the shared knowledge base.</p>
        </div>
        <hr />
        <h4 class="">Problem solving mode:</h4>
          <div className="row mode-buttons-container">
          <div className="col offset-lg-2 col-lg-4 text-center">
            <button class={this.state.solveMode == 'server' ? 'btn btn-outline-primary' : 'btn btn-outline-secondary'} onClick={()=>{this.setState({solveMode: 'server'})}}>
              <h3>Server side</h3>
              <p>Solve problems in server side inference engine</p>
              <hr />
              <p>Recommended for solving a few problems</p>
            </button>
          </div>
          <div className="col col-lg-4 text-center">
            <button class={this.state.solveMode == 'local' ? 'btn btn-outline-primary' : 'btn btn-outline-secondary'} onClick={()=>{this.setState({solveMode: 'local'})}}>
              <h3>Local</h3>
              <p>Export knowledge and problems to .pl files to be solved in SWI-prolog console</p>
              <hr />
              <p>Recommended for solving large amount of problems</p>
            </button>
          </div>
        </div>
        <hr class="section-divider" />
        <h4 class="">Knowledge to be used:</h4>
        <div className="row">
          <div class="col-lg-6 kg-div">
            <div className="card ">
              <div className="card-header">
              Rules
              </div>
              <div className="card-body">
                <div class="form-group">
                  <div class="checkbox">
                    <label><input class="checkbox" type="checkbox" name="exportAllRules" defaultChecked={this.state.exportAllRules} onChange={this.handleChangeChk.bind(this)} />
                    Use rules from all knowledge groups</label>
                  </div>
                </div>
                {kgPickRules}
                {exportRulesBtn}
              </div>
            </div>
          </div>

          <div class="col-lg-6 kg-div">
            <div className="card ">
              <div className="card-header">
              Facts
              </div>
              <div className="card-body">
                <div class="form-group">
                  <div class="checkbox">
                    <label><input class="checkbox" type="checkbox" name="exportAllFacts" defaultChecked={this.state.exportAllFacts} onChange={this.handleChangeChk.bind(this)} />
                    Use facts from all knowledge groups</label>
                  </div>
                </div>
                {kgPickFacts}
                {exportFactsBtn}
              </div>
            </div>
          </div>
        </div>

        <hr class="section-divider" />

        <div className="row">
        <div class="col-lg-12">
        <h4 class="">Define problem:</h4>

      <div className="row">
      <div class="col-lg-12">
          <div className="card">
            <div className="card-body">
              <FactBuilder updateFact={this.updateFact.bind(this)} factName={''}/>
            </div>
          </div>
        </div>
        </div>
      </div>
      </div>

    <div className="row">
      <div className="col col-lg-12 text-center">
        <button class="btn btn-primary" onClick={this.addProblem.bind(this)}>Add problem</button>
      </div>
    </div>

      <hr class="section-divider"/>

      <div className="row">
        <div class="col-lg-12">
        <h4 class="">Problem(s) to be solved:</h4>
        <div class="text-center">
        <ReactTable
          data={this.state.problems}
          columns={columns}
          defaultPageSize="10"
          pageSizeOptions={[5, 10, 15, 20, 25, 50, 100]}
        />
        </div>
        </div>
      </div>
      <div class="row">
      {confirmProblemsBtn}
      </div>
      <hr class="section-divider" />

      {plQueryTextarea}
      </div>

    );
  }
}

export default withRouter(ProblemSolving);
