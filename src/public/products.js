const $form = document.getElementById('sortForm')
addEventListener("submit", e => {
  e.preventDefault()
  const filter = $form.elements[0].value
  const entries = $form.elements[1].value
  let q = ''
  if (filter) q += `sort=${filter}&`
  if (entries) q += `limit=${entries}`
  window.location.replace(`/api/products?${q}&page=1`)
})

function addToCart (code) {
  const xhr = new XMLHttpRequest()
  xhr.open("POST", `http://localhost:8080/api/carts/1/product/${code}`)
  xhr.send()
  setTimeout(() => location.reload(), 1000)
}

function logout () {
  window.location.replace('/logout')
}