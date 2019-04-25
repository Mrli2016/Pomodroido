window.chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.act == 'pomodroido') {
        if (request.data === 'finish') {
            let target = $('body')
            target.addClass('pomodroido-finish-bg');
            setTimeout(() => {
                target.removeClass('pomodroido-finish-bg')
            }, 6000);
        }
    }
});