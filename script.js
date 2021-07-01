document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('input'),
        table = document.querySelector('table'),
        spinner = document.querySelector('.spinner');

  let results;

  class Table {
    constructor(firstName, lastName, picture, bigPicture, state, city, email, phone, registeredDate) {
      this.name = firstName + ' ' + lastName;
      this.picture = picture;
      this.bigPicture = bigPicture;
      this.location = state + ', ' + city;
      this.email = email;
      this.phone = phone;
      this.registeredDate = this.changeDate(registeredDate);
      this.createRow();
    }

    createRow() {
      let element = `
        <tr class="table_row">
          <td class="elastic">${this.name}</td>
          <td><img data-picture="${this.picture}" data-bigPicture="${this.bigPicture}" class="picture" src="${this.picture}" alt="picture"></td>
          <td>${this.location}</td>
          <td><a href="mailto:${this.email}">${this.email}</a></td>
          <td><a href="tel:+${this.phone}">${this.phone}</a></td>
          <td>${this.registeredDate}</td>
        </tr>
      `;
      table.innerHTML += element;
    }

    changeDate(registeredDate) {
      const date = new Date(registeredDate),
            year = date.getFullYear(),
            month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1),
            day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate();

      return `${year}-${month}-${day}`;
    }
  }

  // server request

  fetch('https://randomuser.me/api/?results=15')
    .then(data => {
      if(data.status === 200) {
        spinner.classList.add('hide');
      }
      return data.json();
    })
    .catch(err => {
      console.error('Fetch error: ', err);
    })
    .then(data => {
      results = data.results;
      results.forEach(item => {
        new Table(
          item.name.first, 
          item.name.last, 
          item.picture.thumbnail, 
          item.picture.large, 
          item.location.state, 
          item.location.city, 
          item.email, 
          item.phone, 
          item.registered.date);
      });
    });

  //picture

  document.addEventListener('mouseover', function(event) {
    const elem = event.target;
    if(elem.getAttribute('data-picture')) {
      elem.src=elem.getAttribute('data-bigPicture');
    }
  });
  document.addEventListener('mouseout', function(event) {
    const elem = event.target;
    if(elem.getAttribute('data-picture')) {
      elem.src=elem.getAttribute('data-picture');
    }
  });

  // search

  const debounce = (fn, ms) => {
    let timeout;
    return function() {
      const fnCall = () => fn.apply(this);
      clearTimeout(timeout);
      timeout = setTimeout(fnCall, ms);
    };
  };

  function onChange() {
    let val = this.value.trim();
    let elasticItems = document.querySelectorAll('.elastic');
    
    if(val != '') {
      elasticItems.forEach(item => {
        if(item.textContent.toLowerCase().search(val.toLowerCase()) == -1) {
          item.parentElement.classList.add('hide');    
          
        } else {
          item.parentElement.classList.remove('hide');

        }
      });
    } else {
      elasticItems.forEach(item => {
        item.parentElement.classList.remove('hide');

      });
    }

    let countHide = document.querySelectorAll('table .hide');
    if(elasticItems.length === countHide.length) {
      document.querySelector('.matches').textContent = 'Совпадения отсутствуют 😞';
    } else {
      document.querySelector('.matches').textContent = '';
    }
  }


  const startOnChange = debounce(onChange, 300);

  input.addEventListener('input', startOnChange);
});
