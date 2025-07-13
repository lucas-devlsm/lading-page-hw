document.addEventListener('DOMContentLoaded', function() {
    // Set the countdown time to 20 minutes (in seconds)
    let timeLeft = 20 * 60;
    let countdownInterval;
    let countdownStarted = false;
    
    // Get all countdown elements
    const countdowns = [
        {
            element: document.getElementById('countdown-1'),
            minutes: document.querySelector('#countdown-1 .minutes'),
            seconds: document.querySelector('#countdown-1 .seconds')
        },
        {
            element: document.getElementById('countdown-2'),
            minutes: document.querySelector('#countdown-2 .minutes'),
            seconds: document.querySelector('#countdown-2 .seconds')
        },
        {
            element: document.getElementById('countdown-3'),
            minutes: document.querySelector('#countdown-3 .minutes'),
            seconds: document.querySelector('#countdown-3 .seconds')
        }
    ];

    function updateCountdowns() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;

        // Update all countdown displays
        countdowns.forEach(countdown => {
            if (countdown.element && countdown.minutes && countdown.seconds) {
                countdown.minutes.textContent = minutes.toString().padStart(2, '0');
                countdown.seconds.textContent = seconds.toString().padStart(2, '0');
            }
        });

        if (timeLeft > 0) {
            timeLeft--;
        } else {
            // Optional: Add any actions when timer reaches zero
            clearInterval(countdownInterval);
        }
    }

    function startCountdown() {
        if (!countdownStarted) {
            countdownStarted = true;
            
            // Reset and store the end time in localStorage
            timeLeft = 20 * 60;
            const endTime = Date.now() + (timeLeft * 1000);
            localStorage.setItem('countdownEndTime', endTime.toString());
            
            // Initial update for all countdowns
            updateCountdowns();

            // Update all countdowns every second
            countdownInterval = setInterval(updateCountdowns, 1000);
        }
    }

    // Listen for the video time event
    document.addEventListener('videoTimeReached', function() {
        startCountdown();
    });

    // Initialize countdowns with zeros
    countdowns.forEach(countdown => {
        if (countdown.element && countdown.minutes && countdown.seconds) {
            countdown.minutes.textContent = '20';
            countdown.seconds.textContent = '00';
        }
    });
});