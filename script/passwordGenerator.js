const passLength = document.getElementById('pwLength')
const allLists = document.getElementsByClassName('lists')
const LOCAL_STORAGE_LIST_OF_PW = 'list.password'
const result = document.getElementsByClassName('result')[0]
let listPasswords =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_OF_PW)) || []
function PasswordGenerator() {
  this.pwArray = []
  this.generatePass = ''
  this.pwLength = passLength.value
  this.numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  this.lowerLetters = 'ABCDEFGHIJKLMOPQRSTNUVWXYZ'
  this.upperLetters = 'abcdefghijklmopqrstnuvwxyz'
  this.symbols = `@#$_&-+()/*"':><%\`;!?~%{}[]\\=^`
  this.interval
}
PasswordGenerator.prototype.checkBox = function () {
  const checkNum = document.getElementById('numbers').checked
  const checkSym = document.getElementById('symbols').checked
  const checkLet = document.getElementById('letters').checked
  const symbolSplit = this.symbols.split('')
  const lowerLettersSplit = this.lowerLetters.split('')
  const upperLettersSplit = this.upperLetters.split('')

  if (!checkNum && !checkLet && !checkSym) return false
  if (checkNum) {
    this.numbers.forEach((nums) => {
      this.pwArray.push(nums)
    })
  }
  if (checkSym) {
    symbolSplit.forEach((symbol) => {
      this.pwArray.push(symbol)
    })
  }
  if (checkLet) {
    lowerLettersSplit.forEach((letter) => {
      this.pwArray.push(letter)
    })
    upperLettersSplit.forEach((letter, index) => {
      this.pwArray.splice(index, 0, letter)
    })
  }
  return true
}

PasswordGenerator.prototype.generate = function () {
  const pwArrayLength = this.pwArray.length
  for (let i = 1; i <= this.pwLength; i++) {
    const randomIndex = Math.floor(Math.random() * pwArrayLength)
    this.generatePass += this.pwArray[randomIndex]
  }
  return this.generatePass
}
PasswordGenerator.prototype.generatePassword = function () {
  const pw = new PasswordGenerator()
  const rangeText = document.getElementById('rangeValue')
  const rangeValue = document.querySelector('input[type=range]').value
  const fos = rangeValue > 25 ? 1 : rangeValue > 18 ? 1.1 : 1.3
  rangeText.innerText = rangeValue
  if (pw.checkBox()) {
    result.style.fontSize = fos + 'rem'
    result.innerText = pw.generate()
    return
  }
  alert('Please Check Atleast One')
}
PasswordGenerator.prototype.copy = function (elemnt) {
  const body = document.body
  const copyElmnt = document.querySelector(elemnt).innerHTML
  const input = document.createElement('input')
  input.style.position = 'fixed'
  input.style.top = 0
  input.style.opacity = 0
  body.appendChild(input)
  input.value = copyElmnt
  input.select()
  document.execCommand('copy')
  body.removeChild(input)
  alert('Successfully Copy')
}
PasswordGenerator.prototype.saved = function () {
  const title = prompt('Enter Title')
  if (title === null || title === '') return
  const lists = {
    titleName: title,
    pass: result.innerText,
  }
  listPasswords.push(lists)
  this.render()
  save()
}
function save() {
  const stringLists = JSON.stringify(listPasswords)
  localStorage.setItem(LOCAL_STORAGE_LIST_OF_PW, stringLists)
}
PasswordGenerator.prototype.render = function () {
  const titleParent = document.querySelector('.listOfPassword')
  const title = document.querySelector('.title')
  const pass = document.querySelector('.pass')
  const pw = new PasswordGenerator()
  clearElement(titleParent)
  listPasswords.forEach((all) => {
    const li = document.createElement('li')
    const div = document.createElement('div')
    const div2 = document.createElement('div')
    div.className = 'title'
    div2.className = 'pass'
    li.className = 'lists'
    div.innerText = all.titleName
    div2.innerText = all.pass
    li.appendChild(div2)
    li.appendChild(div)
    titleParent.insertBefore(li, titleParent.firstChild)
  })
  const alls = Object.values(allLists)
  const modalCont = document.querySelector('.modalConfirm')
  alls.forEach((all) => {
    all.classList.remove('selected')
    all.onclick = function () {
      modalCont.classList.toggle('show')
      this.className += ' selected'
      pw.tools()
    }
  })
  modalCont.onclick = function (e) {
    if (e.target !== this) return
    this.classList.toggle('show')
  }
  pw.tools()
}
function clearElement(elmnt) {
  while (elmnt.firstChild) {
    elmnt.removeChild(elmnt.firstChild)
  }
}
PasswordGenerator.prototype.tools = function () {
  const pw = this
  const copyBtn = document.querySelector('.btn1')
  const deleteBtn = document.querySelector('.btn2')
  const selected = document.querySelector('.selected')
  const modalCont = document.querySelector('.modalConfirm')

  copyBtn.onclick = function () {
    navigator.vibrate(50)
    try {
      pw.copy('.selected .pass')
      modalCont.click()
    } catch (err) {
      console.log(err)
    }
  }
  deleteBtn.onclick = function () {
    navigator.vibrate(50)
    const text = selected.firstChild.innerText
    listPasswords = listPasswords.filter((all) => text !== all.pass)
    modalCont.click()
    save()
    pw.render()
  }
}
passLength.oninput = function () {
  const pw = new PasswordGenerator()
  const rangeLength = this.parentElement.children[0]
  const fillRange = this.parentElement.children[1]
  const rangevalue = this.value
  const minValue = this.min
  const maxValue = this.max
  const rangeDiv = 100 / (maxValue - minValue)
  fillRange.style.width = (rangevalue - minValue) * rangeDiv + '%'
  pw.generatePassword()
}
window.onload = function () {
  const saveBtn = document.querySelector('.save')
  const copy = document.getElementsByClassName('copy')[0]
  const pw = new PasswordGenerator()
  saveBtn.onclick = () => pw.saved()
  copy.addEventListener('click', (e) => pw.copy('.result'))
  pw.generatePassword()
  pw.render()
}
