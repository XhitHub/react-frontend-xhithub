
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
