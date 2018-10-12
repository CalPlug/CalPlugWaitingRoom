var app = {
    _msgAnnounceOverride: false,
    _msgsToDisplay: ['Please have your portfolio, including your resume and unofficial transcript ready.'],
    main: function(){
        this.setupDisplay();
        this.bindEvents();

    },
    setupDisplay: function(){
        var msgDisplayIndex = -1;
        var totalMsgs = app._msgsToDisplay.length;
        var timerInterval;
        var msgToDisplay = '';
        var postMsg = function(msg){
            if (!app._msgAnnounceOverride){
                document.getElementById('scrollingText').innerText = msg;
            }
        }

        var loopMsgs = function(){
            if (msgDisplayIndex != -1){
                msgToDisplay = app._msgsToDisplay[msgDisplayIndex];
                postMsg(msgToDisplay);

            } else {
                if (!timerInterval) {
                    timerInterval = setInterval(function(){
                        if (msgDisplayIndex == -1){
                            msgToDisplay = new Date().toLocaleString('en-US', {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit"
                            });

                            postMsg(msgToDisplay);
                        }
                    }, 2000);
                }
            }
        }
        
        loopMsgs();
        //Change index and check for clients
        setInterval(function(){
            if (++msgDisplayIndex == totalMsgs){
                msgDisplayIndex = -1;
            }
            loopMsgs();


        }, 20000);

        var refreshInterviewees = function(){
            $.ajax({
                type: "GET",
                url: '/client?limit=3',
                contentType:'application/json',
                success:function(data){
                    if (data.success){
                        var toDisplay = '';
                        for(var i in data.clients){

                            toDisplay += ((toDisplay != '') ? ', ' : '' ) + data.clients[i].name;
                        }

                        $('#nextInterviewees').text( (toDisplay!='') ? toDisplay : "N/A" );
                    }
                }
            });
        }
        
        setInterval(function(){
            refreshInterviewees();
        }, 10000);
        refreshInterviewees();

        $('.slideshow').slick({
            arrows: false,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 10000
        });
                      
        
    },
    bindEvents: function(){
        $('#btnCall').click(function(){
            $.ajax({
                type: "GET",
                url: '/client?limit=1',
                contentType:'application/json',
                success:function(data){
                    if (data.success){
                        if (data.clients.length){
                            app.announce('Now calling: ' + data.clients[0].name);
                            $.ajax({
                                type: "DELETE",
                                url: '/client/' + data.clients[0].id,
                                contentType:'application/json',
                                success:function(data){}
                            });
                        }
                    }
                }
            });
        });
    },
    announce: function(msg, noSpeech){
        if (msg){
            this._msgAnnounceOverride = true;
            $('#scrollingText').css('display', 'none');
            $('#announcementText').text(msg).css('display', 'block');

            if (!noSpeech) this.speech(msg);
            setTimeout(function(){
                app._msgAnnounceOverride = false;
                $('#scrollingText').css('display', 'block');
                $('#announcementText').css('display', 'none');
            }, 15000);
        }
    },
    speech: function(msg){
        if (msg){
            const message = new SpeechSynthesisUtterance(msg); 
            window.speechSynthesis.speak(message);
        }
    },
    pollClients: function(){

    }
};

// Start to initial the main function
$(function(){
    app.main();
    $(window).on('hashchange', function(e){ app.main(); });
});

// app.main();