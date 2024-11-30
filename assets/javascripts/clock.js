(function clock() {
  const clockElement = document.querySelector('#clock');
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
    const minutes = clockMinutes.innerHTML = date.getMinutes().toString().padStart(2, '0');
    const seconds = clockSeconds.innerHTML = date.getSeconds().toString().padStart(2, '0');
    const month = date.getMonth();
    const monthElement = document.querySelector('#month').innerHTML = (`${MONTHS[month]}`);
    const day = date.getDate();
    const dayElement = document.querySelector('#day').innerHTML = `${day},`;
    const year = document.querySelector('#year').innerHTML = date.getFullYear();

    dayOfWeekElement.classList.add('active');

    if (hours > 12) {
      clockHours.innerHTML = (hours - 12).toString().padStart(2, '0');
      clockAmPm.innerHTML = 'PM';
    } else {
      clockHours.innerHTML = hours.toString().padStart(2, '0');
      clockAmPm.innerHTML = 'AM';
    }



    setTimeout(getTime, 250);
  }

  getTime()
})();
