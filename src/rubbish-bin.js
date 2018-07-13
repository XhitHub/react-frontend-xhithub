
global.simpleAjax2 = function(path,type,success){
  var options = {
      url: global.apiUrl+path,
      type: type,
      dataType: 'json',
      contentType: 'application/json',
      success: success,
      error: (err) => {
        console.log('err', err);
        if(err.status == 401){
          localStorage.removeItem('token');
          window.location.href = global.appUrl;
        }
      },
      headers: {"Authorization": 'Bearer ' + localStorage.getItem('token')}
  };
  $.ajax(options);
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





if(this.state.mode == 'READ'){
  var argViews = []
  p.arguments.forEach((arg) => {
    argViews.push(
      <li class="list-group-item">{arg}</li>
    )
  })
  content = (
    <div className=" card">
      <div className=" predicate-text card-header">
        {p.text}
      </div>
      <div className=" predicate-arguments card-body">
        <ul class="list-group">
          {argViews}
        </ul>
      </div>
    </div>
  )
}
if(this.state.mode == 'EDIT'){
  var argViews = []
  p.arguments.forEach((arg,i) => {
    argViews.push(
      <li class="list-group-item">
        <input
            className="form-item form-control"
            name="argument"
            index={i}
            type="text"
            value={arg}
            onChange={this.props.handleChange.bind(this)}
        />
      </li>
    )
  })
  content = (
    <div className="col col-lg-12">
      <div className="col-lg-12 predicate-text">
        <input
            className="form-item form-control"
            name="text"
            type="text"
            value={p.text}
            onChange={this.props.handleChange.bind(this)}
        />
      </div>
      <div className="col col-lg-12 predicate-arguments">
        <ul class="list-group">
          {argViews}
        </ul>
      </div>
    </div>
  )
}













if(relatedPreds.length > 0 ){  //TODO remove true
  var relatedPredsCards = [];
  var relatedPredsListviewItems = [];
  relatedPreds.forEach((rp)=>{
    var cardTitle = '';
    var predicateViews = [];
    rp.words.forEach((w)=>{
      cardTitle += w.split('.')[0] + ", "
    });
    rp.relatedPredicates.forEach((rprp) => {
      var btn;
      if(rprp.isRelated){
        btn = (
          <input type="button" class="btn btn-success" value="Is related" onClick={()=>{this.togglePredicateIsRelated(rprp)}} />
        )
      }
      else{
        btn = (
          <input type="button" class="btn btn-fail" value="Not related" onClick={()=>{this.togglePredicateIsRelated(rprp)}} />
        )
      }
      predicateViews.push(
        <div className="row">
          <div class="col-md-9">
          <Predicate predicate={rprp} mode="READ-FOL" />
          </div>
          <div class="col-md-3">

          </div>
        </div>
      )
    })
    relatedPredsCards.push(
      <div className=" card">
        <div className=" card-header">
        {cardTitle}
        </div>
        <div className=" card-body">
        {predicateViews}
        </div>
      </div>
    );

  });
  relatedPredicatesView = (
    <div className="col col-lg-12">
      {relatedPredsCards}
    </div>
  )
}
else{
  relatedPredicatesView = (
    <div className="col col-lg-12">
      No related predicates were found.
    </div>
  )
}




var selectItem = this.state.selectedItem;
if(selectItem){
  if(Array.isArray(selectItem)){
    selectItem.push(elem);
    this.setState({});
  }
  else{
    if(!(selectItem.and || selectItem.or || selectItem.not)){
      for(var k in elem){
        selectItem[k] = elem[k]
      }
      this.setState({});
    }
  }
}










and:[
  {
    text: 'goes to',
    arguments: [
      'home', 'school'
    ]
  },
  {
    text: 'back to',
    arguments: [
      'home', 'school'
    ]
  },
  {
    or:[
      {
        not: {
          and:[
            {
              text: 'goes to',
              arguments: [
                'home', 'school'
              ]
            }
          ]

        }
      }

    ]
  }

]
