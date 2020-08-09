import React from 'react';
import './App.css';
import axios from 'axios';

class App extends React.Component{
  constructor(props){
    super(props)
      this.state ={
        members : [ ],
        first_name :'',
        last_name : '',
        foto :'',
        buttonDisable : false,
        status : 'Tambah Data',
        onstatus : 'Masukan Inputan',
        memberIdSelected: null
      }
  }
  componentDidMount(){
    axios.get('https://reqres.in/api/users?page=1')
    .then(request => {
     this.setState({ members : request.data.data})
    })
    .catch(error =>{
      console.log('error' , error);

    });
  };

  handleinputnamefrom = (inputname) =>{
     this.setState({ [inputname.target.name] : inputname.target.value}
    )}
  handleonsubmit = (event)=> {
    event.preventDefault();
    var dataditambah ={
    first_name  : this.state.first_name,
    last_name  : this.state.last_name
    }
    var url = 'https://reqres.in/api/users' 
    if (this.state.status === 'Tambah Data') {
    this.addMember(url, dataditambah)
    } else {
    // url untuk form edit
    url = `https://reqres.in/api/users/${this.state.memberIdSelected}`
    this.editMember(url, dataditambah)
    } 
    
  }

  addMember = (url , dataditambah) => {
    axios.post(url , dataditambah)
    .then(response => {
      console.log(response)
      var members = [...this.state.members]
      members.push(response.data)
      this.setState({members})

      this.setState({ onstatus : 'Data Telah Dinput'})
    })
    .catch(error => {
      console.log(error)
    })
  }

  editMember = (url, payload) => {
    axios.put(url, payload)
      .then(response => {
        var members     = [...this.state.members]
        var indexMember = members.findIndex(member => member.id === this.state.memberIdSelected)

        // mengganti data yang ada dalam state members dan index yang sesuai
        members[indexMember].first_name = response.data.first_name
        members[indexMember].last_name  = response.data.last_name
        this.setState({ 
          members, 
          buttonDisabled: false, 
          first_name: '', 
          last_name: '',
          status: 'Tambah Data' ,
        
        })
      })
      .catch(error => {
        console.log(error)
      })
  }
  deleteButtonHandler = (id) => {
    var url = `https://reqres.in/api/users/${id}`
    axios.delete(url)
      .then(response => {
        if(response.status === 204) {
          var members = [...this.state.members]
          var index = members.findIndex(member => member.id === id)
          members.splice(index, 1)
          this.setState({ members })
        }
      })
      .catch(error => {
        console.log(error)
      })
}

      
  handleEditdata = (Edit) => {
    this.setState({
      first_name : Edit.first_name,
      last_name : Edit.last_name,
      status : 'Edit Data',
      memberIdSelected : Edit.id
    })
  }

  render(){
    return(
      
      <div className="container">
      <br></br><br></br>
      <h1 className="App">React CRUD with API </h1>
      <h3 className="App"> {this.state.onstatus}</h3>
      <div className="row" >
        <div className="col-6" style={{ border: '1px solid black'}}>
          <h2 className="App">Member</h2>
          <div className="row" >
          { this.state.members.map((member, index) => (
            <div className="col-md-6" key={index}>
              <div className="card" style={{ margin: 10}}>
                <div className="card-body">
                <h5 className="card-title">{member.id}</h5>
                  <h5 className="card-title">{member.first_name}</h5>
                  <h5 className="card-title">{member.last_name}</h5>
                  <button className="btn btn-primary" onClick={() => {this.handleEditdata(member)}}>Edit</button>
                  <button className="btn btn-danger" onClick={ () => {this.deleteButtonHandler(member)}} >Delete</button>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>

        <div className="col-6" style={{ border: '1px solid black'}}>
          <h2 className="App">Form {this.state.status}</h2>
          <form onSubmit={this.handleonsubmit}>
            <div className="form-group">
              <label>First Name</label>
              <input 
                type="text" 
                className="form-control"
                name="first_name"
                value={this.state.first_name}
                onChange={this.handleinputnamefrom}
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input 
                type="text" 
                className="form-control" 
                name="last_name"
                value={this.state.last_name}
                onChange={this.handleinputnamefrom}
              />
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    </div>
      
    );
  }
}

export default App;
