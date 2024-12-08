(function clock() {
  const clockHours = document.querySelector('#hours');
  const clockMinutes = document.querySelector('#minutes');
  const clockSeconds = document.querySelector('#seconds');
  const clockAmPm = document.querySelector('#ampm');

  function getTime() {
    const DAYS_OF_WEEK = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const MONTHS = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const date = new Date();
    const dayOfWeek = date.getDay();
    const dayOfWeekElement = document.querySelector(`#${DAYS_OF_WEEK[dayOfWeek]}`);
    const hours = date.getHours();
    const month = date.getMonth();
    const day = date.getDate();

    clockMinutes.innerHTML = date.getMinutes().toString().padStart(2, '0');
    clockSeconds.innerHTML = date.getSeconds().toString().padStart(2, '0');
    document.querySelector('#month').innerHTML = (`${MONTHS[month]}`);
    document.querySelector('#day').innerHTML = `${day},`;
    document.querySelector('#year').innerHTML = date.getFullYear();

    const daysOfWeekElements = document.querySelectorAll('.day');

    daysOfWeekElements.forEach(day => {
      if (day.classList.contains('active')){
        day.classList.remove('active');
      }
    })

    dayOfWeekElement.classList.add('active');

    if (hours > 12) {
      clockHours.innerHTML = (hours - 12).toString().padStart(2, '0');
      clockAmPm.innerHTML = 'PM';
    } else {
      if (hours === 12) {
       clockHours.innerHTML = '12';
      } else {
        clockHours.innerHTML = hours.toString().padStart(2, '0');
      }
      clockAmPm.innerHTML = 'AM';
    }



    setTimeout(getTime, 250);
  }

  getTime()
})();
