window.chrome.runtime.onMessage.addListener(function(request) {
    if (request.act == 'pomodroido') {
        if (request.data === 'workEnd') {
            // eslint-disable-next-line
            let target = $('body')
            target.addClass('pomodroido-work-end-bg');
            setTimeout(() => {
                target.removeClass('pomodroido-work-end-bg')
            }, 6000);
        } else if (request.data === 'relaxEnd') {
            // eslint-disable-next-line
            let target = $('body')
            target.addClass('pomodroido-relax-end-bg');
            setTimeout(() => {
                target.removeClass('pomodroido-relax-end-bg')
            }, 6000);
        }
    }
});