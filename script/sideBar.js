function Sidebar(){
	this.sidebar = document.querySelector(".sidebar")
	this.savePassword = document.querySelector(".savePassword")
	this.burger = document.querySelector(".burger")
}
//Sidebar.prototype.toggle=function(){}
Sidebar.prototype.slide=function(){
	const sd = this
	function toggle(){
		sd.sidebar.classList.toggle("fade")
		sd.savePassword.classList.toggle("slide")
	}
	this.sidebar.addEventListener("click",toggle)
	this.burger.addEventListener("click",toggle)
}
const sidebar = new Sidebar()
sidebar.slide()