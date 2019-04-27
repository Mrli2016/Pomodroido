console.log('content');
window.chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('request: ', request);
    if (request.act == 'pomodroido') {
        if (request.data === 'workEnd') {
            let target = $('body')
            target.addClass('pomodroido-work-end-bg');
            setTimeout(() => {
                target.removeClass('pomodroido-work-end-bg')
            }, 6000);
        } else if (request.data === 'relaxEnd') {
            let target = $('body')
            target.addClass('pomodroido-relax-end-bg');
            setTimeout(() => {
                target.removeClass('pomodroido-relax-end-bg')
            }, 6000);
        }
    }
});