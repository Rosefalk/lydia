(function($) {
    $.fn.extend({
        lydia: function(options) {
            var defaults = {
                    location: 'modules/lydia/',
                    lydiaVersion: 0.1,
                    $console: undefined,
                    $blink: undefined,
                    $textField: undefined,
                    commandKey: 112,
                    lydiaSpeed: 15,
                    open: false,
                    textRepeater: undefined,
                    queueData: [],
                    height: '60%'
                };

            var options = $.extend(defaults, options);

            return this.each(function() {
                var o = options;
                var obj = $(this);

                console.log('lydia active');

                o.$lydia = obj
                o.$console = o.$lydia.find('.console');
                o.$blink = o.$lydia.find('.blink');
                blink(o.$blink);

                o.$lydia.children('.query').keyup(function(e) {
                    if (e.keyCode == 13) {
                        var $that = $(this);
                        var command = $that.val()
                        writeText(command)
                        $that.val('');
                    }
                });

                $('body').keyup(function(e) {
                    if (e.keyCode == o.commandKey) {
                        if (o.open) {
                            o.$lydia.animate({
                                height: '0'
                            }, 500);
                        } else {
                            o.$lydia.children('input').focus();

                            if (o.$lydia.children('.console').text() == '') {

                                o.$lydia.animate({
                                    height: o.height
                                }, 500, function() {
                                    writeText('V.' + o.lydiaVersion + ' is now active.', true)
                                });
                            } else {
                                o.$lydia.animate({
                                    height: o.height
                                }, 500);
                            }
                        }
                        o.open = !o.open;
                    }
                });

                function blink($selector) {
                    $selector.animate( {
                        opacity: 0
                    }, 500, function() {
                        $selector.animate( {
                            opacity: 1
                        }, 500, function() {
                            blink($selector);
                        });
                    });
                }

                function writeQueue() {
                    var data = o.queueData[0];
                    if (o.textRepeater === undefined && o.queueData.length > 0) {
                        o.$textfield = $(document.createElement('span')).addClass(data.userName);
                        o.$blink.before(o.$textfield);
                        o.$blink.css('display', 'none');
                        var counter = 0;

                        o.textRepeater = setInterval(function() {
                            textRelay(counter)
                            counter++;
                        }, o.lydiaSpeed);
                    }
                }

                function textRelay(counter) {
                    var data = o.queueData[0];

                    function continueQueue() {
                        o.$blink.before('<br />');
                        o.$blink.css('display', 'block');
                        clearInterval(o.textRepeater);
                        o.textRepeater = undefined;
                        o.queueData.shift();
                        writeQueue();
                    }

                    if(data.internal && data.instant){
                        o.$textfield.append(data.string);
                        continueQueue();
                        return;
                    }

                    if (counter <= data.string.length) {
                        o.$textfield.append(data.string[counter]);
                        o.$console.scrollTop(function() {
                            return this.scrollHeight;
                        });
                        counter++;
                    } else {
                        continueQueue();
                    }
                }

                function writeText(string, internal) {
                    var data = string.toString(),
                        dataObj = {
                            string:data,
                            userName:"",
                            internal: internal,
                            instant: false
                        }

                    if(internal) {
                        //add modifier to signify lydia input
                        //you can send data to a server here
                        //and reply back with response
                        dataObj.userName = "Lydia";
                        dataObj.string = dataObj.userName+" "+dataObj.string;
                        o.queueData.push(dataObj);
                    }else {
                        //add modifier to signify user input
                        dataObj.userName = "User";
                        dataObj.string = "> "+dataObj.string;
                        o.queueData.push(dataObj);
                    }

                    //if using a REST service or any other XHR call
                    //you may want to defer pushing to the queue
                    //strings can be queued until invoked by writeQueue
                    writeQueue();
                }
            });
        }
    })
})(jQuery);
