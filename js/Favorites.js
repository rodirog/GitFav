import { GithubUser } from "./GithubUser.js"


export class Favorites {
  constructor(root) {
    this.load()
    this.root = document.querySelector(root) 
    this.tbody = this.root.querySelector('tbody')
  }

  save() {
    localStorage.setItem('@github-favorites2:', JSON.stringify(this.entries))
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites2:')) || []
  }

  async addUser(username) {
    
    try {
      const user = await GithubUser.search(username)

      if (user.login === undefined) {
        throw new Error("Usuário não encontrado.")
      }

      if (this.entries.find(
            addedUser => addedUser.login == user.login
          )
        ) {
        throw new Error ("Esse usuário já foi adicionado.")
      }
      
      this.entries = [user, ...this.entries]
      this.save()
      this.update()
    }
    catch(error) {alert(error.message)}
  }

  deleteUser(username) {
    const filteredEntries = this.entries.filter(user => user.login != username)

    this.entries = filteredEntries
    this.save()
    this.update()
  }

}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.onAdd()
    this.update()
    this.setSameHeight()
    this.viewNoFavoritesAdded()

  }

  removeAllUserRows() {
    this.tbody.querySelectorAll('.user-row').forEach(userRow => {
      userRow.remove()
    })
   }

  update() {
    this.removeAllUserRows()
    this.viewNoFavoritesAdded()

    this.entries.forEach(user => {
      const row = this.createRow()
      row.querySelector('img').src = `https://github.com/${user.login}.png`
      row.querySelector('a').href = `https://github.com/${user.login}`
      row.querySelector('a p').textContent = user.name
      row.querySelector('a span').textContent = `/${user.login}`
      row.querySelector('.followers div').textContent = user.followers
      row.querySelector('.public-repos div').textContent = user.public_repos

      row.querySelector('.remove').onclick = () => {
          const username = user.login
          const isOk = confirm("Deseja mesmo deletar esse usuário?")
          if (isOk) {this.deleteUser(username)} 
        }

      this.tbody.append(row)
    }
    )
    this.setSameHeight()
  }

  onAdd() {
    const addButton = this.root.querySelector('.search button')
    const input = this.root.querySelector('.search input')

    addButton.onclick = () => {
      const username = input.value

      this.addUser(username)
    }
  }

  setSameHeight() {
    
    let scrollContainer = this.root.querySelector('.scroll-container')
    let table = this.root.querySelector('table')

    if (this.entries.length == 1) {
      table.setAttribute('style','max-height:30px;')
    }

    let tbodyHeight = this.tbody.offsetHeight;
    scrollContainer.setAttribute('style','height:'+tbodyHeight+'px;');
  }

  viewNoFavoritesAdded() {
    if (this.entries.length == 0) {
      this.root.querySelector('.no-favorites').classList.remove('hide')}

    else {
      this.root.querySelector('.no-favorites').classList.add('hide')
    }
  }

  createRow() {
    const tr = document.createElement('tr')
    const content = `
    <td class='cell-1'>
    <div class='user'>
      <img
        src='https://github.com/rodirog.png'
        alt='Image of rodirog'
      />
      <a href='https://github.com/rodirog' target='_blank'>
        <p>Rodrigo Reis</p>
        <span>/rodirog</span>
      </a>
    </div>
    </td>
    <td class='cell-2'>
      <div class='public-repos'>
        <div>123</div>
      </div>
    </td>
    <td class='cell-3'>
      <div class='followers'>
        <div>1234</div>
      </div>
    </td>
    <td class='cell-4'>
      <div class='remove'>
        <button>Remove</button>
      </div>
    </td>`

  tr.innerHTML = content
  tr.classList.add('user-row')
  return tr
  }

}

