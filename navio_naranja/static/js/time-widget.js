function updateWidget() {
    const now = new Date();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    const day = now.getDay(); 
    const date = now.getDate().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    
    document.getElementById('current-date-day').innerText = `${date}/${month} ${shortDayNames[day]}`; 

    const weekStatus = (day === 0 || day === 6) ? "WEEKEND" : "WEEKDAY";
    document.getElementById('week-status').innerText = weekStatus; 

    const hours = now.getHours();
    let period = "Evening"; 
    let iconClass = ""; 

    if (hours >= 5 && hours < 12) {
        period = "Early Morning";
        iconClass = "bxs-sun"; 
    } else if (hours >= 12 && hours < 17) {
        period = "Afternoon";
        iconClass = "bxs-sun";
    } else if (hours >= 17 && hours < 21) {
        period = "Evening";
        iconClass = "bxs-moon"; 
    } else {
        period = "Night";
        iconClass = "bxs-moon"; 
    }

    document.getElementById('current-period').innerText = period; 
    document.getElementById('time-icon').className = `bx ${iconClass}`; 
}

setInterval(updateWidget, 1000);
updateWidget(); 
