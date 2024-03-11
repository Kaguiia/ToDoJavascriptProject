// // const axios = require('axios');
function showLoader() {
  document.querySelector('.loader-container').style.display = 'flex';
}
function hideLoader() {
  document.querySelector('.loader-container').style.display = 'none';
}
// part one
document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault()
  showLoader()
  const inputText = document.querySelector('input[type="text"]').value;
  const selectedStatus = document.querySelector('input[name="status"]:checked').value;
  axios.post('https://puzzled-ionian-actor.glitch.me/todo', {
      title: inputText,
      status: selectedStatus
  })
  .then (({data}) => {
    const textContainer = document.createElement('div')
    textContainer.classList.add('text-container')
    const textElement = document.createElement('div')
    textElement.classList.add('text')
    textElement.textContent = inputText
    const taskElement = document.createElement('div')
    taskElement.classList.add('task')
    taskElement.textContent = inputText
    taskElement.id = data.id
    const trashIcon = document.createElement('div');
    trashIcon.classList.add('trash-icon')
    hideLoader();
    trashIcon.addEventListener('click', function() {
      showLoader()
      textContainer.remove();
      fetch(`https://puzzled-ionian-actor.glitch.me/todo/${data.id}`, {
        method: 'DELETE'
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        hideLoader();
      })
      .catch(error => {
        console.error(error)
        hideLoader()
      });
    });
    textContainer.appendChild(textElement)
    textContainer.appendChild(trashIcon)
    const statusColumn = document.getElementById(`${selectedStatus}-column`)
    statusColumn.appendChild(textContainer); 
    document.querySelector('input[type="text"]').value = ''
  })
  .catch(error => {
    console.error(error)
    hideLoader()
  });
});

// part two 
let todos = []
fetch("https://puzzled-ionian-actor.glitch.me/todo")
  .then(response => response.json())
  .then(data => {
    todos = data
    hideLoader()
    const todoItems = data
    todoItems.forEach(item => {
      const taskContainer = document.getElementById(item.status)
      if (taskContainer) {
        const textContainer = document.createElement('div')
        textContainer.classList.add('text-container') 
        textContainer.dataset.todoId = item.id;
        const textElement = document.createElement('div')
        textElement.classList.add('text')
        textElement.textContent = item.title
        textContainer.appendChild(textElement)
        const trashIcon = document.createElement('div')
        trashIcon.classList.add('trash-icon');
        trashIcon.addEventListener('click', function() {
          textContainer.remove();
          showLoader()
          fetch(`https://puzzled-ionian-actor.glitch.me/todo/${item.id}`, { ///fetch(`http://localhost:3000/todo/${item.id}`, {
            method: 'DELETE'
          })
          .then(response => response.json())
          .then(data => {
            console.log(data)
            hideLoader()
          })
          .catch(error => console.error(error));
        });
        textContainer.appendChild(trashIcon);
        taskContainer.appendChild(textContainer);
        textElement.addEventListener('dblclick', function() {
          const inputField = document.createElement('input')
          inputField.type = 'text'
          inputField.value = textElement.textContent
          textContainer.replaceChild(inputField, textElement)
          inputField.select()
          inputField.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
              showLoader()
              textElement.textContent = inputField.value;
              textContainer.replaceChild(textElement, inputField)
              fetch(`https://puzzled-ionian-actor.glitch.me/todo/${item.id}`, {
                method: 'PUT',
                body: JSON.stringify({title: textElement.textContent, status: item.status}),
              })
              .then(response => response.json())
              .then(data => {
                console.log(data)
                hideLoader();
              })
              .catch(error => {
                console.error(error)
              });
            }
          });
        });
      }
    });
    
  })
  .catch(error => {
    console.error(error)
  })
  //part three
  $(function() {
    $(".task-block").sortable({
        connectWith: ".task-block",
        tolerance: "pointer",
        stop: async function(event, ui) {
            const todoId = ui.item[0].dataset.todoId;
            const status = ui.item.parent().attr("id");
            const newText = ui.item.find('.text').text(); 
            showLoader();
            try {
                const response = await fetch(`https://puzzled-ionian-actor.glitch.me/todo/${todoId}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        status: status,
                        title: newText 
                    })
                });
                const updatedData = await response.json();
                console.log(updatedData);
            } catch (error) {
                console.error(error);
            } finally {
                hideLoader();
            }
        }
    }).disableSelection();
});
