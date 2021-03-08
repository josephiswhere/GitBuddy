import React, { Component } from 'react';
import RepoGrabber from './RepoGrabber.jsx';
import DataDisplay from './DataDisplay';
import CSVExport from './CSVExport';

class MainContainer extends Component {
  constructor(props){
    super(props);
    this.state = {
      loggedIn: true,
      name: '',
      // repos: [{name: "myFirst Repo", followers: [1,2,3,4,5]},
      repos: [],
      personalFollowers: [],
      checked: new Map(),
      toBeSent: [],
    };
    this.getFollowers = this.getFollowers.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.csvExport = this.csvExport.bind(this);

  }

  getFollowers(){
    let toBeSent = []
    for(const [key, value] of this.state.checked){
    if (value===true){
      for(let repo of this.state.repos){
        if(key === repo.name){toBeSent.push(repo.stargazersUrl)}
      }
    }
  }
  this.setState({...this.state, toBeSent});
  // fetch request to db for user's repo follower data should go here
  fetch('/repoPost', {
    method: 'POST',
    body: JSON.stringify({urls: toBeSent})
  })
  .then((res) => res.json())
  .then((data) => {
    this.setState({...this.state, personalFollowers: data})
    console.log("followers", this.state.personalFollowers)
  })
  .catch(err => console.log(err))
}

csvExport(){


}
    

    handleChange(e) {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState(prevState => ({...this.state, checked: prevState.checked.set(item, isChecked) }))
    // console.log(this.state)
  }

  componentDidMount () {
    //db fetch request
    fetch("/getUser")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        this.setState({...this.state, name : data.user.name, repos: data.repos});
      })
      .catch(err => console.log(err));
    //that url runs a get request on the db 
  }

  render(){
    return(
      <div className="MainContainer">
        <h3 className="greeting">Hi, {this.state.name}. Would you like to see your bomb ass repos?</h3>
        <RepoGrabber 
          repos={this.state.repos}
          personalFollowers={this.state.personalFollowers}
          getFollowers={this.getFollowers}
          handleChange={this.handleChange}
          checkedItems={this.state.checked}
        />
        <DataDisplay 
          personalFollowers={this.state.personalFollowers}
        />
        <CSVExport 
        csvExport={this.csvExport}
        />
      </div>
    );
  }
}
export default MainContainer;