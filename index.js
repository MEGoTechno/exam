
// start header
// main page only open linkers 
let get_fast = document.querySelector("header .getFast .icon i")
let get_fast_ul = document.querySelector("header .getFast ul")
let lists = get_fast_ul.children
let listsArray = Array.from(lists)

get_fast.onclick = function(){
    get_fast_ul.classList.toggle("open")
    get_fast.classList.toggle("rotate")
}

listsArray.forEach((list) => {
    list.addEventListener("click", () => {
        get_fast_ul.classList.toggle("open")
        get_fast.classList.toggle("rotate")
    })
})
// close linker

// open nav
let openNav = document.querySelector("header .mobile")
let closeNav = document.querySelector("header nav ul li .close")
let nav = document.querySelector("header nav ul")


openNav.onclick = function(){
    nav.classList.add("open")
    closeNav.classList.remove("hide")
}

closeNav.onclick = function(){
    nav.classList.remove("open")
    closeNav.classList.add("hide")
}
// close nav

// end header


document.querySelectorAll(".closed").forEach(one => {
    one.addEventListener("click", function(e){
        e.preventDefault()
        alert("it is only allowed to see exam page, any other page is forbidden")
    })
})