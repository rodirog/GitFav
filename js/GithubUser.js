export class GithubUser {
  static search(user) {
    
    const endpoint = `https://api.github.com/users/${user}`

    return fetch(endpoint)
    .then(data => data.json())
    .then(({login, name, public_repos, followers}) => ({
      login, 
      name,
      public_repos, 
      followers}))
  } 
} 