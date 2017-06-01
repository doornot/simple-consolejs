(function(window, document, undefined) {
    var original = {
        // store original functions
        console: {
            log: window.console.log,
            debug: window.console.debug,
            info: window.console.info,
            warn: window.console.warn,
            error: window.console.error
        },
    }
    var debugBox = {
        // 自定义控制台的位置信息
        pos: {
            x: 0,
            y: 0
        },
        wrapTop: 0
    }
    var fnDelegate = function() {
        original.console.log.apply(this, arguments); // 保留原控制台输出
        logger.log(arguments); // 自定义控制台输出
    }
    window.console.log = fnDelegate;
    window.console.error = fnDelegate;
    window.console.info = fnDelegate;
    window.console.debug = fnDelegate;
    window.onerror = function(message, url, lineNo) {
        // 更多参数请参考：MDN - GlobalEventHandlers.onerror
        logger.log([message, url, lineNo], true);
    }
    var _target = document.querySelectorAll('#debug')[0];
    var _controller = document.querySelectorAll('.debug-wrap .controller')[0];
    var _clean = document.querySelectorAll('.debug-wrap .clean')[0];
    var _refresh = document.querySelectorAll('.debug-wrap .refresh')[0];
    var _back = document.querySelectorAll('.debug-wrap .back')[0];
    var _wrap = document.querySelectorAll('.debug-wrap')[0];
    
    _controller.addEventListener('touchstart', function(e) {
        debugBox.pos.y = e.touches[0].clientY;
        debugBox.wrapTop = _wrap.offsetTop;
    });
    _controller.addEventListener('touchmove', function(e) {
        e.preventDefault();
        var clientY = e.touches[0].clientY;
        var offsetTop = (debugBox.wrapTop + clientY - debugBox.pos.y) + 'px';
        _wrap.style.top = offsetTop;
    });
    _clean.addEventListener('click', function(e) {
        e.preventDefault();
        // 清屏
        _target.value = '';
    });
    _refresh.addEventListener('click', function(e) {
        e.preventDefault();
        // 刷新
        location.reload();
    });
    _back.addEventListener('click', function(e) {
        e.preventDefault();
        // 回退到上一页
        history.go(-1);
    })
    var logger = {
        log: function(msg, error) {
            var out = '';
            // 将具有length属性的对象转成数组
            msg = Array.prototype.slice.call(msg, 0);
            msg.forEach(function(item) {
                if (typeof item === 'undefined') {
                    out += 'undefined';
                } else if (typeof item === 'string' || typeof item === 'number' || typeof item === 'boolean') {
                    out += item;
                } else if (typeof item === 'object') {
                    out += JSON.stringify(item);
                }
                out += " ";
            });
            if (error) {
                out = 'ERROR:' + out;
            }
            _target.value += out + '\r\n';
            // 改变元素的滚动位置 - 如果有滚动条，则滚动条默认被拉到最底部
            _target.scrollTop = _target.scrollHeight;
        }
    }
})(window, document);