// ...existing code...
const form = document.getElementById('todo-form');
const input = document.getElementById('new-todo');
const list = document.getElementById('todo-list');

form.addEventListener('submit', e=>{
  e.preventDefault();
  const text = input.value.trim();
  if(!text) return;
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.innerHTML = `
    <label><input type="checkbox" /> <span class="text"></span></label>
    <button aria-label="Hapus">✕</button>
  `;
  li.querySelector('.text').textContent = text;
  list.prepend(li);
  input.value = '';
});

list.addEventListener('click', e=>{
  if(e.target.matches('input[type="checkbox"]')){
    e.target.closest('.todo-item').classList.toggle('completed');
  } else if(e.target.closest('button')){
    e.target.closest('.todo-item').remove();
  }
});
// ...existing code...
