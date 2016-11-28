(function($) {
    $.fn.extend({
        lydia: function(options, user) {
            var defaultOptions = {
                location: 'modules/lydia/',
                lydiaVersion: '0.1.1',
                layout: {
                    $lydia: undefined,
                    $console: undefined,
                    $blink: undefined,
                    $textField: undefined,
                    $query: undefined
                },

                keyCodes: {
                    commandKey: 119
                },

                settings: {
                    lydiaSpeed: 15,
                    height: '60%'
                },

                internals: {
                    open: false,
                    textRepeater: undefined,
                    queueData: []
                }
            },

            defaultUser = {
                string:'',
                userName:'User',
                internal: false,
                instant: false
            },

            systemUser = {
                string:'',
                userName:'Lydia',
                internal: true,
                instant: false
            };

            var options = $.extend(defaultOptions, options),
                user    = $.extend(defaultUser, user);

            return this.each(function() {
                var o       = options,
                    userData= user
                    sysUser = systemUser;

                o.layout.$lydia = $(this);
                o.layout.$console = o.layout.$lydia.find('.console');
                o.layout.$blink = o.layout.$lydia.find('.blink');
                o.layout.$query = o.layout.$lydia.children('.query');

                o.layout.$query.keyup(function(e) {
                    if (e.keyCode == 13) {
                        var $that = $(this);
                        var command = $that.val();
                        writeText(command);
                        $that.val('');
                    }
                });

                $('body').keyup(function(e) {
                    if (e.keyCode == o.keyCodes.commandKey) {
                        if (o.internals.open) {
                            o.layout.$lydia.animate({
                                height: '0'
                            }, 500);
                        } else {
                            o.layout.$lydia.children('input').focus();

							if (o.layout.$lydia.children('.console').children().length == 1) {

                                o.layout.$lydia.animate({
                                    height: o.settings.height
                                }, 500, function() {
                                    writeText('V.' + o.lydiaVersion + ' is now active.', true);
                                });
                            } else {
                                o.layout.$lydia.animate({
                                    height: o.settings.height
                                }, 500);
                            }
                        }
                        o.internals.open = !o.internals.open;
                    }
                });

                function writeQueue() {
                    var data = o.internals.queueData[0];
                    if (o.internals.textRepeater === undefined && o.internals.queueData.length > 0) {
                        o.$textfield = $(document.createElement('span')).addClass(data.userName);
                        o.layout.$blink.before(o.$textfield);
                        o.layout.$blink.css('display', 'none');
                        var counter = 0;

                        o.internals.textRepeater = setInterval(function() {
                            textRelay(counter);
                            counter++;
                        }, o.settings.lydiaSpeed);
                    }
                }

                function textRelay(counter) {
                    var data = o.internals.queueData[0];

                    function continueQueue() {
                        o.layout.$blink.before('<br />');
                        o.layout.$blink.css('display', 'block');
                        clearInterval(o.internals.textRepeater);
                        o.internals.textRepeater = undefined;
                        o.internals.queueData.shift();
                        writeQueue();
                    }

                    if(data.internal && data.instant){
                        o.$textfield.append(data.string);
                        continueQueue();
                        return;
                    }

                    if (counter <= data.string.length) {
                        o.$textfield.append(data.string[counter]);
                        o.layout.$console.scrollTop(function() {
                            return this.scrollHeight;
                        });
                        counter++;
                    } else {
                        continueQueue();
                    }
                }

                function writeText(string, internal) {
                    var text = string.toString();

                    if(internal) {
                        //add modifier to signify lydia input
                        //you can send data to a server here
                        //and reply back with response
                        sysUser.string = sysUser.userName+': '+text;
                        o.internals.queueData.push(sysUser);
                    }else {
                        //add modifier to signify user input
                        userData.string = userData.userName+': '+text;
                        o.internals.queueData.push(userData);
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
