(function($) {
    jQuery.extend($.icescrum, {

                closeWindow:function(obj, event, disableAnim) {
                    var opts = obj.data('opts');
                    $.icescrum.o.currentOpenedWindow = null;
                    var closeClosure = function() {
                        jQuery.ajax({
                                    type:'GET',
                                    url:$.icescrum.o.urlCloseWindow + '/' + obj.data('id')
                                });
                        obj.trigger('beforeIsCloseWindow');
                        obj.remove();
                    };
                    if (!disableAnim) {
                        var speed = 'fast';
                        obj.fadeOut(speed, function() {
                            closeClosure();
                        });
                    } else {
                        closeClosure();
                    }
                    if (opts.onClose)
                        opts.onClose();
                    if (event)
                        this.stopEvent(event);
                    location.hash = '';
                    this.o.fullscreen = false;
                },

                openWindow:function(id, callback) {

                    var targetWindow = id;
                    var openPanel = false;
                    var targetIndex = id.indexOf('/');
                    if (targetIndex >= 0) {
                        targetWindow = id.substring(0, targetIndex);
                        openPanel = true;
                    }
                    var targetParam = targetWindow.indexOf('?');
                    if (targetParam >= 0) {
                        targetWindow = targetWindow.substring(0, targetParam);
                    }

                    if ($.inArray(targetWindow, this.o.widgetsList) != -1) {
                        var obj = $("#widget-id-" + targetWindow);
                        this.closeWidget(obj);
                    }


                    if (this.o.currentOpenedWindow != null && this.o.currentOpenedWindow.data('id') != targetWindow) {
                        $(document).unbind('keydown.' + this.o.currentOpenedWindow.data('id'));
                        if (this.o.currentOpenedWindow.data('opts').widgetable) {
                            this.addToWidgetBar(this.o.currentOpenedWindow.data('id'));
                        }
                    }

                    jQuery.ajax({
                                type:'GET',
                                cache:true,
                                url:this.o.urlOpenWindow + '/' + id,
                                beforeSend:function(){
                                    var loading = $('<div/>').attr('id','window-loading').css('opacity',0).css('z-index',998);
                                    if ($.icescrum.o.fullscreen) {
                                        $(document.body).prepend(loading);
                                        loading.addClass('window-fullscreen loading').animate({opacity:0.2},250);
                                    }else{
                                        $('#main').prepend(loading);
                                        loading.addClass('modal-background loading').animate({opacity:0.2},250);
                                    }
                                },
                                success:function(data, textStatus) {
                                    if ($.icescrum.o.fullscreen) {
                                        $.icescrum.o.currentOpenedWindow.remove();
                                        $(document.body).prepend(data);
                                        $('#window-id-' + targetWindow).addClass('window-fullscreen');
                                    } else {
                                        $($.icescrum.o.windowContainer).html('').html(data);
                                    }
                                    $('#window-loading').stop().animate({opacity:0.0},250,function(){  $(this).remove(); });
                                    if (callback) {
                                        callback();
                                    }
                                    var url = location.hash.replace(/^.*#/, '');
                                    if (url != id) {
                                        $.icescrum.o.openWindow = true;
                                        location.hash = id;
                                    }
                                    if (!jQuery("#dropmenu").is(':visible')) {
                                        jQuery("#window-id-" + targetWindow).focus();
                                    }
                                    return false;
                                }
                            });
                },

                maximizeWindow:function(obj, event) {
                    var opts = obj.data('opts');
                    if (!this.o.fullscreen) {
                        $(document.body).prepend(obj);
                        this.o.fullscreen = true;
                    } else {
                        $('#main-content').prepend(obj);
                        this.o.fullscreen = false;
                    }
                    obj.toggleClass('window-fullscreen');
                    obj.resize();

                    if (this.o.fullscreen) {
                        obj.trigger('afterIsWindowMaximize');
                        if (opts.afterMaximize)
                            opts.afterMaximize();
                    } else {
                        obj.trigger('afterIsWindowUnMaximize');
                        if (opts.onUnMaximize)
                            opts.onUnMaximize();
                    }
                    if (event)
                        this.stopEvent(event);
                    $(window).trigger('resize');
                },

                windowToWidget:function(obj, event) {
                    var opts = obj.data('opts');
                    $.icescrum.closeWindow(obj);
                    $.icescrum.addToWidgetBar(obj.data('id'));
                    this.stopEvent(event);
                }
            });

    $.fn.isWindow = function(options) {
        var opts = $.extend({}, $.fn.isWindow.defaults, options);
        var obj = $(this);
        var windowid = $(this).attr('id'), id = windowid.substring(windowid.lastIndexOf("-") + 1, windowid.length);
        var iconMaximize;

        obj.data('opts', opts);
        obj.data('windowid', windowid);
        obj.data('id', id);

        if (opts.maximizeable) {
            iconMaximize = $("#" + windowid + ' .window-maxicon');
            //icon action
            iconMaximize.parent().bind('click', function(event) {
                $.icescrum.maximizeWindow(obj, event)
            });
            //barre action
            iconMaximize.parents('.resizable:first').bind('dblclick', function(event) {
                if (!$(event.target).is('a,span')) {
                    $.icescrum.maximizeWindow(obj, event)
                }
            });
        }

        if (opts.widgetable) {
            $("#" + windowid + ' .window-minimize').bind('click', function(event) {
                $.icescrum.windowToWidget(obj, event)
            });
        }

        if (opts.closeable) {
            $("#" + windowid + ' .window-close').bind('click', function(event) {
                $.icescrum.closeWindow(obj, event)
            });
        }

        $.icescrum.o.currentOpenedWindow = obj;
    };
})(jQuery);

$.fn.isWindow.defaults = {
    maximizeable:false,
    widgetable:false,
    closeable:true,
    onMaximize:null,
    onUnMaximize:null,
    onClose:null
};